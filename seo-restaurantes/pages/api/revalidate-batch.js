import { verifySignature } from '@/lib/auth';

/**
 * API para revalidação em lote de páginas estáticas (ISR)
 * 
 * Permite revalidar várias páginas de uma só vez com controle de concorrência
 * Útil para atualizações periódicas ou quando muitos dados mudam simultaneamente
 * 
 * Exemplo de uso:
 * POST /api/revalidate-batch
 * {
 *   "secret": "token-secreto",
 *   "paths": ["/", "/restaurantes/slug-1", "/restaurantes/slug-2"],
 *   "concurrency": 3
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
    const { paths, secret, concurrency = 5 } = req.body;

    // Verificar token de segurança
    if (!verifySignature(secret)) {
      console.warn('Tentativa de revalidação em lote com token inválido:', new Date().toISOString());
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido ou não autorizado' 
      });
    }

    // Validar parâmetros
    if (!paths || !Array.isArray(paths) || paths.length === 0) {
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
    
    console.log(`[${new Date().toISOString()}] Iniciando revalidação em lote de ${paths.length} páginas (concorrência: ${batchSize})`);
    
    // Processar em lotes para controlar concorrência
    for (let i = 0; i < paths.length; i += batchSize) {
      const batch = paths.slice(i, i + batchSize);
      
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
      if (i + batchSize < paths.length) {
        await new Promise(r => setTimeout(r, 500));
      }
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