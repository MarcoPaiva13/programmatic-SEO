import { 
  initializeIndices, 
  buildAllIndices, 
  buildMasterIndex,
  buildCuisineIndices,
  buildLocationIndices,
  buildRatingIndices,
  buildPriceIndices,
  buildFeatureIndices
} from '../lib/indexBuilder';
import fs from 'fs';
import path from 'path';

/**
 * Script para construção de índices e geração de listas de prioridade
 * para otimização de build em um cenário de escala com milhares de restaurantes
 * 
 * Uso:
 * - node scripts/build-indices.js --all            # Constrói todos os índices
 * - node scripts/build-indices.js --master         # Constrói apenas o índice mestre
 * - node scripts/build-indices.js --cuisine        # Constrói índices de cozinha
 * - node scripts/build-indices.js --priority       # Gera lista de prioridade
 * - node scripts/build-indices.js --force          # Força reconstrução mesmo se existirem
 */

async function main() {
  console.log('Iniciando construção de índices para otimização de SEO...');
  
  const args = process.argv.slice(2);
  const forceRebuild = args.includes('--force');
  
  // Inicializar diretórios de índices
  await initializeIndices();
  
  // Determinar quais índices construir com base nos argumentos
  const buildAll = args.includes('--all');
  const buildMaster = args.includes('--master') || buildAll;
  const buildCuisine = args.includes('--cuisine') || buildAll;
  const buildLocation = args.includes('--location') || buildAll;
  const buildRating = args.includes('--rating') || buildAll;
  const buildPrice = args.includes('--price') || buildAll;
  const buildFeature = args.includes('--feature') || buildAll;
  const buildPriority = args.includes('--priority') || buildAll;
  
  // Construir índices solicitados
  if (buildMaster) {
    console.log('Construindo índice mestre...');
    await buildMasterIndex(forceRebuild);
  }
  
  if (buildCuisine) {
    console.log('Construindo índices de cozinha...');
    await buildCuisineIndices(forceRebuild);
  }
  
  if (buildLocation) {
    console.log('Construindo índices de localização...');
    await buildLocationIndices(forceRebuild);
  }
  
  if (buildRating) {
    console.log('Construindo índices de avaliação...');
    await buildRatingIndices(forceRebuild);
  }
  
  if (buildPrice) {
    console.log('Construindo índices de preço...');
    await buildPriceIndices(forceRebuild);
  }
  
  if (buildFeature) {
    console.log('Construindo índices de características...');
    await buildFeatureIndices(forceRebuild);
  }
  
  // Gerar lista de prioridade, se solicitado
  if (buildPriority) {
    await generatePriorityList();
  }
  
  console.log('Processo de construção de índices concluído com sucesso!');
}

/**
 * Gera uma lista de prioridade para build baseada em dados analíticos
 */
async function generatePriorityList() {
  console.log('Gerando lista de prioridade para otimização de build...');
  
  try {
    // Carregar dados de popularidade
    const popularityPath = path.join(process.cwd(), 'data', 'analytics', 'popularity.json');
    
    if (!fs.existsSync(popularityPath)) {
      console.warn('Arquivo de popularidade não encontrado. Criando lista padrão baseada em rating...');
      await generateDefaultPriorityList();
      return;
    }
    
    const popularityContents = fs.readFileSync(popularityPath, 'utf8');
    const popularityData = JSON.parse(popularityContents);
    
    // Transformar dados de popularidade em um array para ordenação
    const restaurants = Object.entries(popularityData).map(([slug, stats]) => {
      // Calcular pontuação de prioridade com base em múltiplos fatores
      const priorityScore = 
        (stats.pageViews || 0) * 1.0 + 
        (stats.conversions || 0) * 5.0 + 
        (100 - (stats.searchRanking || 100)) * 0.5;
      
      return {
        slug,
        priority: priorityScore,
        stats: {
          pageViews: stats.pageViews || 0,
          conversions: stats.conversions || 0,
          searchRanking: stats.searchRanking || 100
        }
      };
    });
    
    // Ordenar restaurantes por pontuação de prioridade
    const sortedRestaurants = restaurants.sort((a, b) => b.priority - a.priority);
    
    // Salvar lista de prioridade
    const priorityListPath = path.join(process.cwd(), 'data', 'priority-restaurants.json');
    fs.writeFileSync(priorityListPath, JSON.stringify(sortedRestaurants));
    
    console.log(`Lista de prioridade gerada com ${sortedRestaurants.length} restaurantes.`);
    console.log(`Top 5 restaurantes prioritários:
${sortedRestaurants.slice(0, 5).map((r, i) => `${i + 1}. ${r.slug} (score: ${r.priority.toFixed(1)})`).join('\n')}`);
  } catch (error) {
    console.error('Erro ao gerar lista de prioridade:', error);
    await generateDefaultPriorityList();
  }
}

/**
 * Gera uma lista de prioridade padrão baseada apenas nos ratings dos restaurantes
 * Usada como fallback quando não há dados analíticos disponíveis
 */
async function generateDefaultPriorityList() {
  console.log('Gerando lista de prioridade padrão baseada em ratings...');
  
  try {
    // Obter índice mestre, ou construí-lo se não existir
    const masterIndexPath = path.join(process.cwd(), 'data', 'indices', 'master.json');
    
    if (!fs.existsSync(masterIndexPath)) {
      console.log('Índice mestre não encontrado. Construindo primeiro...');
      await buildMasterIndex(true);
    }
    
    const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
    
    // Ordenar por rating (como critério padrão)
    const sortedRestaurants = masterIndex
      .map(restaurant => ({
        slug: restaurant.slug,
        priority: restaurant.rating * 10, // Multiplicar por 10 para ter uma escala similar
        stats: {
          rating: restaurant.rating
        }
      }))
      .sort((a, b) => b.priority - a.priority);
    
    // Salvar lista de prioridade
    const priorityListPath = path.join(process.cwd(), 'data', 'priority-restaurants.json');
    fs.writeFileSync(priorityListPath, JSON.stringify(sortedRestaurants));
    
    console.log(`Lista de prioridade padrão gerada com ${sortedRestaurants.length} restaurantes.`);
  } catch (error) {
    console.error('Erro ao gerar lista de prioridade padrão:', error);
  }
}

// Executar o script
main().catch(console.error); 