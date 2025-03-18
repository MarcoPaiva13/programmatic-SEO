import fs from 'fs';
import path from 'path';
import { verifySignature } from '@/lib/auth';

/**
 * API para buscar restaurantes relacionados de forma eficiente
 * Implementa busca com índices, filtragem e paginação para evitar carregar todos os registros em memória
 */
export default async function handler(req, res) {
  // Apenas permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use GET.' 
    });
  }

  // Extrair parâmetros da query
  const { id, cuisine, neighborhood, city, limit = 3, page = 1 } = req.query;
  
  // Validar parâmetros obrigatórios
  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'O parâmetro id é obrigatório'
    });
  }
  
  try {
    // Carregar índices para otimizar a busca
    // Os índices são arquivos pré-gerados que mapeiam restaurants por cozinha, bairro, etc.
    const indicesPath = path.join(process.cwd(), 'data', 'indices');
    
    // Tentar usar índices se existirem
    let restaurantsToSearch = [];
    let usedIndex = false;
    
    // Buscar por índice de cozinha se especificado
    if (cuisine) {
      const cuisines = cuisine.split(',');
      
      for (const c of cuisines) {
        try {
          const cuisineIndexPath = path.join(indicesPath, 'cuisine', `${c.toLowerCase().trim()}.json`);
          const cuisineIndexExists = fs.existsSync(cuisineIndexPath);
          
          if (cuisineIndexExists) {
            const cuisineIndex = JSON.parse(fs.readFileSync(cuisineIndexPath, 'utf8'));
            restaurantsToSearch = [...restaurantsToSearch, ...cuisineIndex];
            usedIndex = true;
          }
        } catch (error) {
          console.warn(`Erro ao carregar índice de cozinha ${c}:`, error.message);
        }
      }
    }
    
    // Buscar por índice de bairro e cidade
    if (neighborhood && city && !usedIndex) {
      try {
        const locationIndexPath = path.join(indicesPath, 'location', `${city.toLowerCase()}-${neighborhood.toLowerCase()}.json`);
        const locationIndexExists = fs.existsSync(locationIndexPath);
        
        if (locationIndexExists) {
          const locationIndex = JSON.parse(fs.readFileSync(locationIndexPath, 'utf8'));
          restaurantsToSearch = [...restaurantsToSearch, ...locationIndex];
          usedIndex = true;
        }
      } catch (error) {
        console.warn(`Erro ao carregar índice de localização ${city}-${neighborhood}:`, error.message);
      }
    }
    
    // Se não encontrou índices, buscar diretamente nos arquivos
    // Implementar busca eficiente com streaming para não carregar todos em memória
    if (!usedIndex) {
      const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
      const filenames = fs.readdirSync(restaurantsDirectory).slice(0, 100); // Limitar para não sobrecarregar
      
      // Usar uma busca mais direcionada baseada nos parâmetros
      for (const filename of filenames) {
        // Pular o restaurante atual
        if (filename.replace(/\.json$/, '') === id) continue;
        
        try {
          const restaurantPath = path.join(restaurantsDirectory, filename);
          const restaurantContent = fs.readFileSync(restaurantPath, 'utf8');
          const restaurant = JSON.parse(restaurantContent);
          
          // Critérios de relacionamento
          const matchesCuisine = cuisine ? 
            restaurant.cuisine.some(c => cuisine.split(',').map(item => item.trim().toLowerCase()).includes(c.toLowerCase())) : 
            false;
            
          const matchesLocation = neighborhood && city ? 
            restaurant.neighborhood.toLowerCase() === neighborhood.toLowerCase() && 
            restaurant.city.toLowerCase() === city.toLowerCase() : 
            false;
            
          if (matchesCuisine || matchesLocation) {
            restaurantsToSearch.push({
              id: restaurant.id,
              name: restaurant.name,
              slug: restaurant.slug,
              cuisine: restaurant.cuisine,
              neighborhood: restaurant.neighborhood,
              city: restaurant.city,
              rating: restaurant.rating
            });
          }
          
          // Limitar a quantidade de resultados para não sobrecarregar memória
          if (restaurantsToSearch.length >= 20) break;
        } catch (error) {
          console.warn(`Erro ao processar restaurante ${filename}:`, error.message);
          continue;
        }
      }
    }
    
    // Remover o restaurante atual, se estiver na lista
    restaurantsToSearch = restaurantsToSearch.filter(restaurant => restaurant.id !== id);
    
    // Remover duplicatas (pode acontecer se buscar por múltiplos índices)
    const uniqueRestaurants = Array.from(
      new Map(restaurantsToSearch.map(item => [item.id, item])).values()
    );
    
    // Aplicar paginação
    const pageSize = parseInt(limit, 10);
    const currentPage = parseInt(page, 10);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    
    // Ordenar por relevância (exemplo: rating)
    const sortedRestaurants = uniqueRestaurants.sort((a, b) => b.rating - a.rating);
    
    // Aplicar paginação
    const paginatedResults = sortedRestaurants.slice(startIndex, endIndex);
    
    // Retornar resultados com metadados de paginação
    return res.status(200).json({
      success: true,
      restaurants: paginatedResults,
      pagination: {
        total: uniqueRestaurants.length,
        page: currentPage,
        pageSize,
        totalPages: Math.ceil(uniqueRestaurants.length / pageSize)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar restaurantes relacionados:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar restaurantes relacionados',
      error: error.message
    });
  }
} 