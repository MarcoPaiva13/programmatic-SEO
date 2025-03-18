import fs from 'fs';
import path from 'path';
import { verifySignature } from '@/lib/auth';

/**
 * API para retornar dados em tempo real do restaurante
 * Complementa os dados estáticos com informações dinâmicas como:
 * - Disponibilidade de reservas
 * - Avaliações recentes
 * - Promoções ativas
 * - Tempos de espera
 */
export default async function handler(req, res) {
  // Apenas permitir GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use GET.' 
    });
  }

  // Obter slug do restaurante da URL
  const { slug } = req.query;
  
  // Validar parâmetros
  if (!slug) {
    return res.status(400).json({
      success: false,
      message: 'O parâmetro slug é obrigatório'
    });
  }
  
  try {
    // Verificar a disponibilidade de reservas em tempo real
    // Em um ambiente real, isso se conectaria a um banco de dados ou API externa
    // Para exemplificar, usaremos um arquivo de cache com valores simulados
    const cacheDirectory = path.join(process.cwd(), 'data', 'cache');
    const dynamicDataPath = path.join(cacheDirectory, 'live', `${slug}.json`);
    
    let dynamicData = {
      isAvailable: true,
      currentWaitTime: 0,
      tableAvailability: [],
      activePromotions: [],
      recentReviews: []
    };
    
    // Tentar carregar dados dinâmicos do cache, se existirem
    try {
      if (fs.existsSync(dynamicDataPath)) {
        const dynamicContent = fs.readFileSync(dynamicDataPath, 'utf8');
        const cachedData = JSON.parse(dynamicContent);
        
        // Verificar se o cache está atualizado (menos de 5 minutos)
        const cacheTime = new Date(cachedData.cachedAt || 0);
        const now = new Date();
        const cacheAgeMinutes = (now - cacheTime) / 60000;
        
        if (cacheAgeMinutes < 5) {
          dynamicData = cachedData.data;
        } else {
          // Cache expirado, gerar novos dados
          dynamicData = await generateLiveData(slug);
          
          // Salvar no cache para futuras requisições
          if (!fs.existsSync(path.dirname(dynamicDataPath))) {
            fs.mkdirSync(path.dirname(dynamicDataPath), { recursive: true });
          }
          
          fs.writeFileSync(dynamicDataPath, JSON.stringify({
            cachedAt: new Date().toISOString(),
            data: dynamicData
          }));
        }
      } else {
        // Se não existe cache, gerar dados e salvar
        dynamicData = await generateLiveData(slug);
        
        // Salvar no cache
        if (!fs.existsSync(path.dirname(dynamicDataPath))) {
          fs.mkdirSync(path.dirname(dynamicDataPath), { recursive: true });
        }
        
        fs.writeFileSync(dynamicDataPath, JSON.stringify({
          cachedAt: new Date().toISOString(),
          data: dynamicData
        }));
      }
    } catch (error) {
      console.warn(`Erro ao carregar cache para ${slug}:`, error.message);
      // Em caso de erro no cache, gerar dados dinâmicos
      dynamicData = await generateLiveData(slug);
    }
    
    // Retornar dados dinâmicos
    return res.status(200).json({
      success: true,
      ...dynamicData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Erro ao buscar dados em tempo real para ${slug}:`, error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados em tempo real',
      error: error.message
    });
  }
}

/**
 * Função para gerar dados em tempo real simulados
 * Em produção, isso se conectaria a APIs externas ou banco de dados
 */
async function generateLiveData(slug) {
  // Buscar dados estáticos do restaurante
  const restaurantPath = path.join(process.cwd(), 'data', 'restaurants', `${slug}.json`);
  let restaurantBaseData = {};
  
  try {
    if (fs.existsSync(restaurantPath)) {
      const restaurantContent = fs.readFileSync(restaurantPath, 'utf8');
      restaurantBaseData = JSON.parse(restaurantContent);
    }
  } catch (error) {
    console.warn(`Erro ao carregar dados base do restaurante ${slug}:`, error.message);
  }
  
  // Gerar horários de disponibilidade para hoje e amanhã
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const tomorrow = new Date(now.setDate(now.getDate() + 1)).toISOString().split('T')[0];
  
  // Simular disponibilidade
  const generateTimeSlots = (date) => {
    const slots = [];
    const baseHours = [12, 13, 18, 19, 20, 21];
    
    for (const hour of baseHours) {
      // Adicionar variabilidade nas disponibilidades
      const isAvailable = Math.random() > 0.3; // 70% de chance de estar disponível
      
      slots.push({
        time: `${hour}:00`,
        date,
        available: isAvailable,
        tables: isAvailable ? Math.floor(Math.random() * 5) + 1 : 0
      });
      
      // Adicionar slot de meia hora
      const halfHourAvailable = Math.random() > 0.4; // 60% de chance
      slots.push({
        time: `${hour}:30`,
        date,
        available: halfHourAvailable,
        tables: halfHourAvailable ? Math.floor(Math.random() * 4) + 1 : 0
      });
    }
    
    return slots;
  };
  
  // Simular avaliações recentes
  const generateRecentReviews = () => {
    const reviews = [];
    const numReviews = Math.floor(Math.random() * 3) + 1; // 1 a 3 reviews
    
    for (let i = 0; i < numReviews; i++) {
      const daysAgo = Math.floor(Math.random() * 7); // 0 a 7 dias atrás
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() - daysAgo);
      
      reviews.push({
        userName: `Usuário${Math.floor(Math.random() * 1000)}`,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        date: reviewDate.toISOString()
      });
    }
    
    return reviews;
  };
  
  // Simular promoções ativas
  const generatePromotions = () => {
    const hasPromotion = Math.random() > 0.7; // 30% de chance de ter promoção
    
    if (!hasPromotion) return [];
    
    const promotionTypes = [
      {
        type: 'discount',
        description: 'Desconto de 15% em pratos principais',
        validUntil: new Date(now.setDate(now.getDate() + 7)).toISOString()
      },
      {
        type: 'special',
        description: 'Menu degustação especial',
        validUntil: new Date(now.setDate(now.getDate() + 14)).toISOString()
      },
      {
        type: 'event',
        description: 'Noite gastronômica temática',
        validUntil: new Date(now.setDate(now.getDate() + 3)).toISOString()
      }
    ];
    
    return [promotionTypes[Math.floor(Math.random() * promotionTypes.length)]];
  };
  
  // Calcular tempo de espera baseado na hora do dia
  const calculateWaitTime = () => {
    const currentHour = new Date().getHours();
    
    // Horários de pico: almoço (12-14h) e jantar (19-21h)
    const isPeakLunch = currentHour >= 12 && currentHour < 14;
    const isPeakDinner = currentHour >= 19 && currentHour < 21;
    
    if (isPeakLunch || isPeakDinner) {
      return Math.floor(Math.random() * 30) + 15; // 15-45 minutos
    } else {
      return Math.floor(Math.random() * 15); // 0-15 minutos
    }
  };
  
  // Retornar dados dinâmicos simulados
  return {
    isAvailable: true, // restaurante está operando
    currentWaitTime: calculateWaitTime(),
    tableAvailability: {
      today: generateTimeSlots(today),
      tomorrow: generateTimeSlots(tomorrow)
    },
    activePromotions: generatePromotions(),
    recentReviews: generateRecentReviews(),
    // Atualizar rating com base em avaliações recentes (pequena variação)
    rating: restaurantBaseData.rating 
      ? restaurantBaseData.rating + (Math.random() * 0.4 - 0.2)
      : 4.5
  };
} 