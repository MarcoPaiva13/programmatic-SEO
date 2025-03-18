import { verifySignature } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

/**
 * API para revalidação em lote de páginas estáticas (ISR)
 * Versão otimizada para trabalhar com milhares de restaurantes
 * 
 * Recursos:
 * - Controle de concorrência e limitação de taxa para evitar sobrecarga
 * - Priorização inteligente com base em popularidade e dados analíticos
 * - Geração de caches de prioridade para otimizar builds
 * - Revalidação progressiva em lotes para milhares de páginas
 * 
 * Exemplo de uso:
 * POST /api/revalidate-batch
 * {
 *   "secret": "token-secreto",
 *   "paths": ["/", "/restaurantes/slug-1", "/restaurantes/slug-2"],
 *   "concurrency": 3,
 *   "updatePriority": true
 * }
 */
export default async function handler(req, res) {
  // Apenas permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use POST.' 
    });
  }

  try {
    // Extrair parâmetros do corpo da requisição
    const { 
      paths, 
      secret, 
      concurrency = 5, 
      updatePriority = false,
      generatePriorityList = false,
      revalidateAll = false
    } = req.body;

    // Verificar token de segurança
    if (!verifySignature(secret)) {
      console.warn('Tentativa de revalidação em lote com token inválido:', new Date().toISOString());
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido ou não autorizado' 
      });
    }

    // Para revalidação de todas as páginas, construir lista com base em dados de popularidade
    let pathsToRevalidate = paths;
    
    if (revalidateAll) {
      pathsToRevalidate = await getAllRestaurantPaths();
      console.log(`[${new Date().toISOString()}] Revalidação completa solicitada. Revalidando ${pathsToRevalidate.length} páginas.`);
    }
    
    // Se solicitado para gerar lista de prioridade, fazer isso antes da revalidação
    if (generatePriorityList) {
      await generateRestaurantPriorityList();
      console.log(`[${new Date().toISOString()}] Lista de prioridade gerada para otimização de build`);
    }

    // Validar parâmetros
    if (!pathsToRevalidate || !Array.isArray(pathsToRevalidate) || pathsToRevalidate.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parâmetro "paths" deve ser um array não vazio de caminhos a serem revalidados' 
      });
    }

    // Inicializar resultados
    const results = {
      success: [],
      failed: []
    };

    // Função para revalidar uma única página
    const revalidatePath = async (path) => {
      try {
        await res.revalidate(path);
        console.log(`[${new Date().toISOString()}] Revalidado: ${path}`);
        return { path, success: true };
      } catch (error) {
        console.error(`[${new Date().toISOString()}] Erro ao revalidar ${path}:`, error.message);
        return { path, success: false, error: error.message };
      }
    };

    // Revalidar páginas em lotes com controle de concorrência
    // Esta abordagem evita sobrecarga do servidor durante atualizações em massa
    const batchSize = Math.max(1, Math.min(concurrency, 10)); // Limitar entre 1 e 10
    
    console.log(`[${new Date().toISOString()}] Iniciando revalidação em lote de ${pathsToRevalidate.length} páginas (concorrência: ${batchSize})`);
    
    // Processar em lotes para controlar concorrência e uso de memória
    for (let i = 0; i < pathsToRevalidate.length; i += batchSize) {
      const batch = pathsToRevalidate.slice(i, i + batchSize);
      
      // Executar revalidações em paralelo, mas limitadas ao tamanho do lote
      const batchResults = await Promise.all(
        batch.map(path => revalidatePath(path))
      );
      
      // Classificar resultados
      batchResults.forEach(result => {
        if (result.success) {
          results.success.push(result.path);
        } else {
          results.failed.push({
            path: result.path,
            error: result.error
          });
        }
      });
      
      // Pequena pausa entre lotes para não sobrecarregar o servidor
      if (i + batchSize < pathsToRevalidate.length) {
        await new Promise(r => setTimeout(r, 500));
      }
      
      // Liberar memória periodicamente para evitar vazamentos
      if (i > 0 && i % 100 === 0) {
        global.gc && global.gc();
      }
    }
    
    // Se solicitado, atualizar lista de prioridade com base nos resultados
    if (updatePriority) {
      await updatePriorityWithResults(results.success, results.failed);
    }

    // Retornar resultados
    return res.status(200).json({
      success: true,
      message: `Revalidação em lote concluída: ${results.success.length} com sucesso, ${results.failed.length} falhas`,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (error) {
    console.error('Erro durante revalidação em lote:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar revalidação em lote',
      error: error.message
    });
  }
}

/**
 * Gera lista completa de caminhos de restaurantes para revalidação
 * @returns {Array} Lista de caminhos de todas as páginas de restaurantes
 */
async function getAllRestaurantPaths() {
  try {
    const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
    const filenames = fs.readdirSync(restaurantsDirectory);
    
    // Converter arquivos em slugs e depois em caminhos
    const paths = filenames
      .map(filename => filename.replace(/\.json$/, ''))
      .map(slug => `/restaurantes/${slug}`);
    
    // Adicionar página inicial e outras páginas importantes
    paths.unshift('/'); // Página inicial
    paths.push('/busca-avancada'); // Página de busca
    
    return paths;
  } catch (error) {
    console.error('Erro ao obter lista de restaurantes:', error);
    return [];
  }
}

/**
 * Gera uma lista de prioridade para restaurantes com base em dados analíticos
 * Esta lista é usada para otimizar a ordem de geração durante builds
 */
async function generateRestaurantPriorityList() {
  try {
    // Carregar dados de popularidade
    const popularityPath = path.join(process.cwd(), 'data', 'analytics', 'popularity.json');
    let popularityData = {};
    
    try {
      if (fs.existsSync(popularityPath)) {
        const popularityContents = fs.readFileSync(popularityPath, 'utf8');
        popularityData = JSON.parse(popularityContents);
      }
    } catch (error) {
      console.warn('Erro ao carregar dados de popularidade:', error.message);
    }
    
    // Transformar dados de popularidade em um array para ordenação
    const restaurants = Object.entries(popularityData).map(([slug, stats]) => {
      // Calcular pontuação de prioridade com base em múltiplos fatores
      // pageViews tem o maior peso, mas também consideramos conversões e SEO
      const priorityScore = 
        (stats.pageViews || 0) * 1.0 + 
        (stats.conversions || 0) * 5.0 + 
        (100 - (stats.searchRanking || 100)) * 0.5;
      
      return {
        slug,
        priorityScore,
        stats
      };
    });
    
    // Ordenar restaurantes por pontuação de prioridade
    const sortedRestaurants = restaurants.sort((a, b) => b.priorityScore - a.priorityScore);
    
    // Garantir que diretório de dados exista
    const dataDirectory = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDirectory)) {
      fs.mkdirSync(dataDirectory, { recursive: true });
    }
    
    // Salvar lista de prioridade para uso durante builds
    const priorityListPath = path.join(dataDirectory, 'priority-restaurants.json');
    
    fs.writeFileSync(priorityListPath, JSON.stringify(
      sortedRestaurants.map(({ slug, priorityScore }) => ({ slug, priority: priorityScore }))
    ));
    
    console.log(`Lista de prioridade gerada com ${sortedRestaurants.length} restaurantes.`);
    return true;
  } catch (error) {
    console.error('Erro ao gerar lista de prioridade:', error);
    return false;
  }
}

/**
 * Atualiza pontuações de prioridade com base nos resultados de revalidação
 * @param {Array} successPaths - Caminhos revalidados com sucesso
 * @param {Array} failedPaths - Caminhos com falha na revalidação
 */
async function updatePriorityWithResults(successPaths, failedPaths) {
  try {
    // Extrair slugs dos caminhos bem-sucedidos
    const successSlugs = successPaths
      .filter(path => path.startsWith('/restaurantes/'))
      .map(path => path.replace('/restaurantes/', ''));
    
    // Extrair slugs dos caminhos com falha
    const failedSlugs = failedPaths
      .filter(item => item.path.startsWith('/restaurantes/'))
      .map(item => item.path.replace('/restaurantes/', ''));
    
    // Carregar lista de prioridade existente
    const priorityListPath = path.join(process.cwd(), 'data', 'priority-restaurants.json');
    let priorityData = [];
    
    try {
      if (fs.existsSync(priorityListPath)) {
        const priorityContents = fs.readFileSync(priorityListPath, 'utf8');
        priorityData = JSON.parse(priorityContents);
      }
    } catch (error) {
      console.warn('Erro ao carregar lista de prioridade:', error.message);
    }
    
    // Atualizar pontuações - aumentar para sucessos, diminuir para falhas
    const updatedPriorityData = priorityData.map(item => {
      if (successSlugs.includes(item.slug)) {
        // Aumentar prioridade para sucessos (recompensa)
        return {
          ...item,
          priority: item.priority * 1.05 // 5% de aumento
        };
      } else if (failedSlugs.includes(item.slug)) {
        // Reduzir prioridade para falhas (penalização)
        return {
          ...item,
          priority: item.priority * 0.9 // 10% de redução
        };
      }
      return item;
    });
    
    // Reordenar por prioridade atualizada
    const sortedPriorityData = updatedPriorityData.sort((a, b) => b.priority - a.priority);
    
    // Salvar lista de prioridade atualizada
    fs.writeFileSync(priorityListPath, JSON.stringify(sortedPriorityData));
    
    console.log(`Lista de prioridade atualizada com ${successSlugs.length} sucessos e ${failedSlugs.length} falhas.`);
    return true;
  } catch (error) {
    console.error('Erro ao atualizar lista de prioridade:', error);
    return false;
  }
} 