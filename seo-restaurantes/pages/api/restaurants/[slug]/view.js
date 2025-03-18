import fs from 'fs';
import path from 'path';

/**
 * API para registrar visualizações de páginas de restaurantes
 * Usado para identificar quais restaurantes são mais populares
 * para priorizar na geração estática e otimizar tempos de revalidação
 */
export default async function handler(req, res) {
  // Permitir apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use POST.' 
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
    // Rastrear a visualização da página
    const result = await trackPageView(slug, req);
    
    return res.status(200).json({
      success: true,
      message: 'Visualização registrada com sucesso',
      ...result
    });
  } catch (error) {
    console.error(`Erro ao registrar visualização para ${slug}:`, error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao registrar visualização',
      error: error.message
    });
  }
}

/**
 * Função para rastrear visualização de página e atualizar estatísticas
 * @param {string} slug - Slug do restaurante
 * @param {object} req - Objeto de requisição para extrair metadados
 * @returns {object} Estatísticas atualizadas
 */
async function trackPageView(slug, req) {
  // Diretório para armazenar dados de popularidade
  const analyticsDir = path.join(process.cwd(), 'data', 'analytics');
  const popularityPath = path.join(analyticsDir, 'popularity.json');
  const viewsDir = path.join(analyticsDir, 'views');
  
  // Garantir que diretórios existam
  if (!fs.existsSync(analyticsDir)) {
    fs.mkdirSync(analyticsDir, { recursive: true });
  }
  
  if (!fs.existsSync(viewsDir)) {
    fs.mkdirSync(viewsDir, { recursive: true });
  }
  
  // Carregar dados de popularidade existentes
  let popularityData = {};
  try {
    if (fs.existsSync(popularityPath)) {
      const popularityContents = fs.readFileSync(popularityPath, 'utf8');
      popularityData = JSON.parse(popularityContents);
    }
  } catch (error) {
    console.warn('Erro ao carregar dados de popularidade:', error.message);
    // Continuar com objeto vazio se arquivo não existir ou estiver corrompido
  }
  
  // Obter ou inicializar estatísticas para este restaurante
  const restaurantStats = popularityData[slug] || {
    pageViews: 0,
    conversions: 0,
    searchRanking: 100,
    lastUpdated: null,
    deviceBreakdown: {
      desktop: 0,
      mobile: 0,
      tablet: 0
    },
    referrerBreakdown: {}
  };
  
  // Extrair informações do dispositivo e referenciador
  const userAgent = req.headers['user-agent'] || 'unknown';
  const referrer = req.headers['referer'] || 'direct';
  
  // Detectar tipo de dispositivo
  let deviceType = 'desktop';
  if (/mobile/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet/i.test(userAgent)) {
    deviceType = 'tablet';
  }
  
  // Detectar origem do referenciador
  let referrerType = 'direct';
  if (referrer !== 'direct') {
    try {
      const referrerURL = new URL(referrer);
      const hostname = referrerURL.hostname;
      
      if (hostname.includes('google')) {
        referrerType = 'google';
      } else if (hostname.includes('bing')) {
        referrerType = 'bing';
      } else if (hostname.includes('facebook')) {
        referrerType = 'facebook';
      } else if (hostname.includes('instagram')) {
        referrerType = 'instagram';
      } else if (hostname.includes('twitter')) {
        referrerType = 'twitter';
      } else {
        referrerType = 'other';
      }
    } catch (e) {
      // Se não conseguir analisar o URL, manter como 'direct'
    }
  }
  
  // Incrementar contadores
  restaurantStats.pageViews += 1;
  restaurantStats.deviceBreakdown[deviceType] += 1;
  
  // Atualizar contadores de referenciador
  if (!restaurantStats.referrerBreakdown[referrerType]) {
    restaurantStats.referrerBreakdown[referrerType] = 0;
  }
  restaurantStats.referrerBreakdown[referrerType] += 1;
  
  // Registrar timestamp da última atualização
  restaurantStats.lastUpdated = new Date().toISOString();
  
  // Atualizar dados de popularidade
  popularityData[slug] = restaurantStats;
  
  // Salvar dados de popularidade atualizados
  fs.writeFileSync(popularityPath, JSON.stringify(popularityData, null, 2));
  
  // Registrar visualização no log diário
  const today = new Date().toISOString().split('T')[0];
  const viewLogPath = path.join(viewsDir, `${today}.json`);
  
  let viewLog = [];
  try {
    if (fs.existsSync(viewLogPath)) {
      const viewLogContents = fs.readFileSync(viewLogPath, 'utf8');
      viewLog = JSON.parse(viewLogContents);
    }
  } catch (error) {
    console.warn(`Erro ao carregar log de visualizações de ${today}:`, error.message);
    // Continuar com array vazio se arquivo não existir ou estiver corrompido
  }
  
  // Adicionar entrada ao log
  viewLog.push({
    slug,
    timestamp: new Date().toISOString(),
    deviceType,
    referrerType,
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    // Salvar apenas os primeiros 50 caracteres do userAgent para economizar espaço
    userAgent: userAgent.substring(0, 50)
  });
  
  // Salvar log atualizado
  fs.writeFileSync(viewLogPath, JSON.stringify(viewLog, null, 2));
  
  // Retornar estatísticas atualizadas
  return {
    pageViews: restaurantStats.pageViews,
    timestamp: restaurantStats.lastUpdated
  };
} 