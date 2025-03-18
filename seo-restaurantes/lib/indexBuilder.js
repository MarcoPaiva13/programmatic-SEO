import fs from 'fs';
import path from 'path';

/**
 * Biblioteca para construção e manutenção de índices de restaurantes
 * Otimiza as operações de busca e recuperação em cenários de escala
 * reduzindo a carga de memória e melhorando o desempenho de queries
 */

// Diretórios para os índices
const INDICES_BASE_DIR = path.join(process.cwd(), 'data', 'indices');
const RESTAURANTS_DIR = path.join(process.cwd(), 'data', 'restaurants');

/**
 * Inicializa a estrutura de diretórios para índices
 */
export async function initializeIndices() {
  try {
    // Garantir que o diretório base de índices exista
    if (!fs.existsSync(INDICES_BASE_DIR)) {
      fs.mkdirSync(INDICES_BASE_DIR, { recursive: true });
    }
    
    // Criar diretórios para cada tipo de índice
    const indexTypes = ['cuisine', 'location', 'rating', 'price', 'features'];
    
    for (const type of indexTypes) {
      const typeDir = path.join(INDICES_BASE_DIR, type);
      if (!fs.existsSync(typeDir)) {
        fs.mkdirSync(typeDir, { recursive: true });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao inicializar estrutura de índices:', error);
    return false;
  }
}

/**
 * Constrói todos os índices para otimizar buscas
 * @param {boolean} forceRebuild - Se true, reconstrói todos os índices mesmo se já existentes
 */
export async function buildAllIndices(forceRebuild = false) {
  try {
    // Inicializar estrutura de diretórios
    await initializeIndices();
    
    // Primeiro, construir índice principal que contém todos os restaurantes
    await buildMasterIndex(forceRebuild);
    
    // Construir índices específicos para diferentes critérios
    await buildCuisineIndices(forceRebuild);
    await buildLocationIndices(forceRebuild);
    await buildRatingIndices(forceRebuild);
    await buildPriceIndices(forceRebuild);
    await buildFeatureIndices(forceRebuild);
    
    console.log('Todos os índices construídos com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao construir índices:', error);
    return false;
  }
}

/**
 * Constrói o índice mestre com todos os restaurantes
 * @param {boolean} forceRebuild - Se true, reconstrói o índice mesmo se já existente
 */
export async function buildMasterIndex(forceRebuild = false) {
  try {
    const masterIndexPath = path.join(INDICES_BASE_DIR, 'master.json');
    
    // Verificar se o índice já existe e se não precisamos reconstruí-lo
    if (fs.existsSync(masterIndexPath) && !forceRebuild) {
      console.log('Índice mestre já existe. Use forceRebuild=true para reconstruir.');
      return true;
    }
    
    console.log('Construindo índice mestre...');
    
    // Listar todos os arquivos de restaurante
    const restaurantFiles = fs.readdirSync(RESTAURANTS_DIR);
    
    // Criar índice com informações básicas de cada restaurante
    const masterIndex = [];
    
    // Processar em lotes para controlar uso de memória
    const batchSize = 100;
    
    for (let i = 0; i < restaurantFiles.length; i += batchSize) {
      const batch = restaurantFiles.slice(i, i + batchSize);
      
      for (const filename of batch) {
        // Pular arquivos que não são JSON
        if (!filename.endsWith('.json')) continue;
        
        try {
          const filePath = path.join(RESTAURANTS_DIR, filename);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const restaurant = JSON.parse(fileContent);
          
          // Adicionar apenas os campos necessários para o índice
          masterIndex.push({
            id: restaurant.id,
            slug: restaurant.slug,
            name: restaurant.name,
            city: restaurant.city,
            neighborhood: restaurant.neighborhood,
            cuisine: restaurant.cuisine,
            rating: restaurant.rating,
            priceRange: restaurant.priceRange,
            features: restaurant.features || []
          });
        } catch (error) {
          console.warn(`Erro ao processar restaurante ${filename}:`, error.message);
          continue;
        }
      }
      
      // Liberar memória entre lotes
      if (global.gc) global.gc();
    }
    
    // Salvar índice mestre
    fs.writeFileSync(masterIndexPath, JSON.stringify(masterIndex));
    
    console.log(`Índice mestre construído com ${masterIndex.length} restaurantes`);
    return true;
  } catch (error) {
    console.error('Erro ao construir índice mestre:', error);
    return false;
  }
}

/**
 * Constrói índices por tipo de cozinha
 * @param {boolean} forceRebuild - Se true, reconstrói os índices mesmo se já existentes
 */
export async function buildCuisineIndices(forceRebuild = false) {
  try {
    console.log('Construindo índices por tipo de cozinha...');
    
    // Usar índice mestre para evitar carregar todos os arquivos novamente
    const masterIndexPath = path.join(INDICES_BASE_DIR, 'master.json');
    
    if (!fs.existsSync(masterIndexPath)) {
      console.warn('Índice mestre não encontrado. Construindo primeiro...');
      await buildMasterIndex(true);
    }
    
    const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
    
    // Mapear todos os tipos de cozinha
    const cuisineMap = {};
    
    for (const restaurant of masterIndex) {
      if (!restaurant.cuisine || !Array.isArray(restaurant.cuisine)) continue;
      
      for (const cuisine of restaurant.cuisine) {
        const cuisineKey = cuisine.toLowerCase().trim();
        
        if (!cuisineMap[cuisineKey]) {
          cuisineMap[cuisineKey] = [];
        }
        
        cuisineMap[cuisineKey].push({
          id: restaurant.id,
          slug: restaurant.slug,
          name: restaurant.name,
          city: restaurant.city,
          neighborhood: restaurant.neighborhood,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating
        });
      }
    }
    
    // Salvar um arquivo de índice para cada tipo de cozinha
    const cuisineDir = path.join(INDICES_BASE_DIR, 'cuisine');
    
    for (const [cuisine, restaurants] of Object.entries(cuisineMap)) {
      const cuisineIndexPath = path.join(cuisineDir, `${cuisine}.json`);
      
      // Verificar se já existe e se não precisamos reconstruir
      if (fs.existsSync(cuisineIndexPath) && !forceRebuild) continue;
      
      fs.writeFileSync(cuisineIndexPath, JSON.stringify(restaurants));
    }
    
    console.log(`Índices de cozinha construídos para ${Object.keys(cuisineMap).length} tipos de cozinha`);
    return true;
  } catch (error) {
    console.error('Erro ao construir índices de cozinha:', error);
    return false;
  }
}

/**
 * Constrói índices por localização (cidade+bairro)
 * @param {boolean} forceRebuild - Se true, reconstrói os índices mesmo se já existentes
 */
export async function buildLocationIndices(forceRebuild = false) {
  try {
    console.log('Construindo índices por localização...');
    
    // Usar índice mestre para evitar carregar todos os arquivos novamente
    const masterIndexPath = path.join(INDICES_BASE_DIR, 'master.json');
    
    if (!fs.existsSync(masterIndexPath)) {
      console.warn('Índice mestre não encontrado. Construindo primeiro...');
      await buildMasterIndex(true);
    }
    
    const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
    
    // Mapear todas as localizações (cidade+bairro)
    const locationMap = {};
    
    for (const restaurant of masterIndex) {
      if (!restaurant.city || !restaurant.neighborhood) continue;
      
      const locationKey = `${restaurant.city.toLowerCase()}-${restaurant.neighborhood.toLowerCase()}`;
      
      if (!locationMap[locationKey]) {
        locationMap[locationKey] = [];
      }
      
      locationMap[locationKey].push({
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        city: restaurant.city,
        neighborhood: restaurant.neighborhood,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating
      });
    }
    
    // Salvar um arquivo de índice para cada localização
    const locationDir = path.join(INDICES_BASE_DIR, 'location');
    
    for (const [location, restaurants] of Object.entries(locationMap)) {
      const locationIndexPath = path.join(locationDir, `${location}.json`);
      
      // Verificar se já existe e se não precisamos reconstruir
      if (fs.existsSync(locationIndexPath) && !forceRebuild) continue;
      
      fs.writeFileSync(locationIndexPath, JSON.stringify(restaurants));
    }
    
    console.log(`Índices de localização construídos para ${Object.keys(locationMap).length} localizações`);
    return true;
  } catch (error) {
    console.error('Erro ao construir índices de localização:', error);
    return false;
  }
}

/**
 * Constrói índices por faixa de avaliação
 * @param {boolean} forceRebuild - Se true, reconstrói os índices mesmo se já existentes
 */
export async function buildRatingIndices(forceRebuild = false) {
  try {
    console.log('Construindo índices por faixa de avaliação...');
    
    // Usar índice mestre para evitar carregar todos os arquivos novamente
    const masterIndexPath = path.join(INDICES_BASE_DIR, 'master.json');
    
    if (!fs.existsSync(masterIndexPath)) {
      console.warn('Índice mestre não encontrado. Construindo primeiro...');
      await buildMasterIndex(true);
    }
    
    const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
    
    // Mapear todas as faixas de avaliação (4.5+, 4.0-4.4, 3.5-3.9, <3.5)
    const ratingMap = {
      'excellent': [], // 4.5+
      'veryGood': [], // 4.0-4.4
      'good': [], // 3.5-3.9
      'regular': [] // <3.5
    };
    
    for (const restaurant of masterIndex) {
      if (typeof restaurant.rating !== 'number') continue;
      
      let ratingKey;
      
      if (restaurant.rating >= 4.5) {
        ratingKey = 'excellent';
      } else if (restaurant.rating >= 4.0) {
        ratingKey = 'veryGood';
      } else if (restaurant.rating >= 3.5) {
        ratingKey = 'good';
      } else {
        ratingKey = 'regular';
      }
      
      ratingMap[ratingKey].push({
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        city: restaurant.city,
        neighborhood: restaurant.neighborhood,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating
      });
    }
    
    // Salvar um arquivo de índice para cada faixa de avaliação
    const ratingDir = path.join(INDICES_BASE_DIR, 'rating');
    
    for (const [rating, restaurants] of Object.entries(ratingMap)) {
      const ratingIndexPath = path.join(ratingDir, `${rating}.json`);
      
      // Verificar se já existe e se não precisamos reconstruir
      if (fs.existsSync(ratingIndexPath) && !forceRebuild) continue;
      
      fs.writeFileSync(ratingIndexPath, JSON.stringify(restaurants));
    }
    
    console.log(`Índices de avaliação construídos para ${Object.keys(ratingMap).length} faixas`);
    return true;
  } catch (error) {
    console.error('Erro ao construir índices de avaliação:', error);
    return false;
  }
}

/**
 * Constrói índices por faixa de preço
 * @param {boolean} forceRebuild - Se true, reconstrói os índices mesmo se já existentes
 */
export async function buildPriceIndices(forceRebuild = false) {
  try {
    console.log('Construindo índices por faixa de preço...');
    
    // Usar índice mestre para evitar carregar todos os arquivos novamente
    const masterIndexPath = path.join(INDICES_BASE_DIR, 'master.json');
    
    if (!fs.existsSync(masterIndexPath)) {
      console.warn('Índice mestre não encontrado. Construindo primeiro...');
      await buildMasterIndex(true);
    }
    
    const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
    
    // Mapear todas as faixas de preço ($, $$, $$$, $$$$)
    const priceMap = {
      '$': [],
      '$$': [],
      '$$$': [],
      '$$$$': []
    };
    
    for (const restaurant of masterIndex) {
      if (!restaurant.priceRange) continue;
      
      const priceKey = restaurant.priceRange;
      
      if (!priceMap[priceKey]) {
        priceMap[priceKey] = [];
      }
      
      priceMap[priceKey].push({
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        city: restaurant.city,
        neighborhood: restaurant.neighborhood,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        priceRange: restaurant.priceRange
      });
    }
    
    // Salvar um arquivo de índice para cada faixa de preço
    const priceDir = path.join(INDICES_BASE_DIR, 'price');
    
    for (const [price, restaurants] of Object.entries(priceMap)) {
      const priceIndexPath = path.join(priceDir, `${price.replace('$', 'price')}.json`);
      
      // Verificar se já existe e se não precisamos reconstruir
      if (fs.existsSync(priceIndexPath) && !forceRebuild) continue;
      
      fs.writeFileSync(priceIndexPath, JSON.stringify(restaurants));
    }
    
    console.log(`Índices de preço construídos para ${Object.keys(priceMap).length} faixas`);
    return true;
  } catch (error) {
    console.error('Erro ao construir índices de preço:', error);
    return false;
  }
}

/**
 * Constrói índices por características/recursos
 * @param {boolean} forceRebuild - Se true, reconstrói os índices mesmo se já existentes
 */
export async function buildFeatureIndices(forceRebuild = false) {
  try {
    console.log('Construindo índices por características...');
    
    // Usar índice mestre para evitar carregar todos os arquivos novamente
    const masterIndexPath = path.join(INDICES_BASE_DIR, 'master.json');
    
    if (!fs.existsSync(masterIndexPath)) {
      console.warn('Índice mestre não encontrado. Construindo primeiro...');
      await buildMasterIndex(true);
    }
    
    const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
    
    // Mapear todas as características
    const featureMap = {};
    
    for (const restaurant of masterIndex) {
      if (!restaurant.features || !Array.isArray(restaurant.features)) continue;
      
      for (const feature of restaurant.features) {
        const featureKey = feature.toLowerCase().trim().replace(/\s+/g, '-');
        
        if (!featureMap[featureKey]) {
          featureMap[featureKey] = [];
        }
        
        featureMap[featureKey].push({
          id: restaurant.id,
          slug: restaurant.slug,
          name: restaurant.name,
          city: restaurant.city,
          neighborhood: restaurant.neighborhood,
          cuisine: restaurant.cuisine,
          rating: restaurant.rating
        });
      }
    }
    
    // Salvar um arquivo de índice para cada característica
    const featureDir = path.join(INDICES_BASE_DIR, 'features');
    
    for (const [feature, restaurants] of Object.entries(featureMap)) {
      const featureIndexPath = path.join(featureDir, `${feature}.json`);
      
      // Verificar se já existe e se não precisamos reconstruir
      if (fs.existsSync(featureIndexPath) && !forceRebuild) continue;
      
      fs.writeFileSync(featureIndexPath, JSON.stringify(restaurants));
    }
    
    console.log(`Índices de características construídos para ${Object.keys(featureMap).length} características`);
    return true;
  } catch (error) {
    console.error('Erro ao construir índices de características:', error);
    return false;
  }
}

/**
 * Atualiza índices para um único restaurante
 * @param {string} slug - Slug do restaurante a ser atualizado
 */
export async function updateIndicesForRestaurant(slug) {
  try {
    console.log(`Atualizando índices para restaurante ${slug}...`);
    
    // Carregar dados do restaurante
    const restaurantPath = path.join(RESTAURANTS_DIR, `${slug}.json`);
    
    if (!fs.existsSync(restaurantPath)) {
      console.warn(`Restaurante ${slug} não encontrado`);
      return false;
    }
    
    const restaurant = JSON.parse(fs.readFileSync(restaurantPath, 'utf8'));
    
    // Atualizar índice mestre
    const masterIndexPath = path.join(INDICES_BASE_DIR, 'master.json');
    
    if (fs.existsSync(masterIndexPath)) {
      const masterIndex = JSON.parse(fs.readFileSync(masterIndexPath, 'utf8'));
      
      // Remover restaurante existente (se houver)
      const updatedMasterIndex = masterIndex.filter(r => r.id !== restaurant.id);
      
      // Adicionar versão atualizada
      updatedMasterIndex.push({
        id: restaurant.id,
        slug: restaurant.slug,
        name: restaurant.name,
        city: restaurant.city,
        neighborhood: restaurant.neighborhood,
        cuisine: restaurant.cuisine,
        rating: restaurant.rating,
        priceRange: restaurant.priceRange,
        features: restaurant.features || []
      });
      
      // Salvar índice mestre atualizado
      fs.writeFileSync(masterIndexPath, JSON.stringify(updatedMasterIndex));
    }
    
    // Reconstruir todos os índices específicos
    // Isso é mais simples do que atualizar seletivamente cada índice
    await buildCuisineIndices(true);
    await buildLocationIndices(true);
    await buildRatingIndices(true);
    await buildPriceIndices(true);
    await buildFeatureIndices(true);
    
    console.log(`Índices atualizados para restaurante ${slug}`);
    return true;
  } catch (error) {
    console.error(`Erro ao atualizar índices para restaurante ${slug}:`, error);
    return false;
  }
} 