import { verifySignature } from '@/lib/auth';

/**
 * API para buscar métricas de Core Web Vitals
 * Fornece dados sobre LCP, FID e CLS para o período especificado
 */
export default async function handler(req, res) {
  // Permitir apenas solicitações GET
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método não permitido. Use GET.' 
    });
  }

  try {
    // Verificar autenticação para endpoints de admin
    const isAdmin = req.headers['x-api-key'] && verifySignature(req.headers['x-api-key']);
    
    // Extrair parâmetros da solicitação
    const { period = '7d' } = req.query;
    
    // Determinar datas de início e fim com base no período
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default: // 7d
        startDate.setDate(startDate.getDate() - 7);
    }
    
    const startDateString = startDate.toISOString().split('T')[0];
    const endDateString = endDate.toISOString().split('T')[0];
    
    // Em um ambiente real, você buscaria esses dados de um banco de dados 
    // ou da API do Google Analytics 4 que armazena métricas de Web Vitals
    // Como exemplo, estamos gerando dados simulados
    
    // Dados do LCP (Largest Contentful Paint)
    const lcp = {
      average: generateRandomMetric(2.2, 2.8), // em segundos
      good: Math.floor(Math.random() * (75 - 55 + 1)) + 55, // porcentagem de bom (55-75%)
      needsImprovement: Math.floor(Math.random() * (30 - 15 + 1)) + 15, // porcentagem que precisa melhorar (15-30%)
      poor: 0 // o restante
    };
    lcp.poor = 100 - lcp.good - lcp.needsImprovement;
    
    // Dados do FID (First Input Delay)
    const fid = {
      average: generateRandomMetric(60, 100), // em milissegundos
      good: Math.floor(Math.random() * (90 - 70 + 1)) + 70, // porcentagem de bom (70-90%)
      needsImprovement: Math.floor(Math.random() * (20 - 5 + 1)) + 5, // porcentagem que precisa melhorar (5-20%)
      poor: 0 // o restante
    };
    fid.poor = 100 - fid.good - fid.needsImprovement;
    
    // Dados do CLS (Cumulative Layout Shift)
    const cls = {
      average: generateRandomMetric(0.05, 0.15), // valor sem unidade
      good: Math.floor(Math.random() * (80 - 60 + 1)) + 60, // porcentagem de bom (60-80%)
      needsImprovement: Math.floor(Math.random() * (30 - 10 + 1)) + 10, // porcentagem que precisa melhorar (10-30%)
      poor: 0 // o restante
    };
    cls.poor = 100 - cls.good - cls.needsImprovement;
    
    // Gerar dados de tendência para cada métrica
    const days = getDaysBetweenDates(startDate, endDate);
    
    const lcpTrend = generateMetricTrend(days, 2.0, 3.0);
    const fidTrend = generateMetricTrend(days, 50, 120);
    const clsTrend = generateMetricTrend(days, 0.03, 0.18);
    
    // Estruturar e retornar os dados
    const webVitals = {
      lcp,
      fid,
      cls,
      trends: {
        lcp: formatTrendData(lcpTrend, 'LCP (s)', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)'),
        fid: formatTrendData(fidTrend, 'FID (ms)', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)'),
        cls: formatTrendData(clsTrend, 'CLS', 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)')
      },
      period: {
        start: startDateString,
        end: endDateString
      }
    };
    
    return res.status(200).json(webVitals);
  } catch (error) {
    console.error('Erro ao buscar dados de Web Vitals:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados de Web Vitals',
      error: error.message
    });
  }
}

// Função auxiliar para obter os dias entre duas datas
function getDaysBetweenDates(startDate, endDate) {
  const days = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    days.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

// Função para gerar uma métrica aleatória dentro de um intervalo
function generateRandomMetric(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

// Função para gerar dados de tendência para uma métrica
function generateMetricTrend(days, min, max) {
  return days.map(day => ({
    date: day,
    value: generateRandomMetric(min, max)
  }));
}

// Função para formatar dados de tendência para gráficos
function formatTrendData(data, label, borderColor, backgroundColor) {
  return {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
    }),
    datasets: [
      {
        label,
        data: data.map(item => item.value),
        borderColor,
        backgroundColor,
        fill: true,
      }
    ]
  };
} 