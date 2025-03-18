import { verifySignature } from '@/lib/auth';

/**
 * API para buscar dados do Google Search Console
 * Retorna métricas como impressões, cliques, CTR e posição para o período especificado
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
    
    // Conectar ao Search Console API
    // Em um ambiente real, você usaria a biblioteca oficial do Google para Node.js
    // Como exemplo, aqui estamos gerando dados simulados
    
    // Em um ambiente de produção, seria algo como:
    /*
    const { google } = require('googleapis');
    const searchconsole = google.searchconsole('v1');
    
    // Autenticar com credenciais de serviço
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_CREDENTIALS_PATH,
      scopes: ['https://www.googleapis.com/auth/webmasters'],
    });
    
    const authClient = await auth.getClient();
    google.options({auth: authClient});
    
    // Chamar a API do Search Console
    const scData = await searchconsole.searchanalytics.query({
      siteUrl: process.env.SEARCH_CONSOLE_SITE_URL,
      requestBody: {
        startDate: startDateString,
        endDate: endDateString,
        dimensions: ['date'],
        rowLimit: 7,
      },
    });
    */
    
    // Gerar dados simulados para fins de demonstração
    const days = getDaysBetweenDates(startDate, endDate);
    const impressions = generateDemoData(days, 1000, 1600);
    const clicks = generateDemoData(days, 200, 400);
    const ctr = days.map((day, index) => ({
      date: day,
      value: (clicks[index].value / impressions[index].value) * 100
    }));
    const position = generateDemoData(days, 15, 25);
    
    // Formatar dados para uso nos gráficos
    const formattedData = {
      impressions: formatChartData(impressions, 'Impressões', 'rgba(75, 192, 192, 1)', 'rgba(75, 192, 192, 0.2)'),
      clicks: formatChartData(clicks, 'Cliques', 'rgba(54, 162, 235, 1)', 'rgba(54, 162, 235, 0.2)'),
      ctr: formatChartData(ctr, 'CTR (%)', 'rgba(153, 102, 255, 1)', 'rgba(153, 102, 255, 0.2)'),
      position: formatChartData(position, 'Posição Média', 'rgba(255, 159, 64, 1)', 'rgba(255, 159, 64, 0.2)')
    };
    
    return res.status(200).json(formattedData);
  } catch (error) {
    console.error('Erro ao buscar dados do Search Console:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Erro ao buscar dados do Search Console',
      error: error.message
    });
  }
}

// Função auxiliar para obter os dias entre duas datas
function getDaysBetweenDates(startDate, endDate) {
  const days = [];
  const currentDate = new Date(startDate);
  
  // Ajustar para o formato 'YYYY-MM-DD'
  while (currentDate <= endDate) {
    days.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

// Função para gerar dados simulados para demonstração
function generateDemoData(days, min, max) {
  return days.map(day => ({
    date: day,
    value: Math.floor(Math.random() * (max - min + 1)) + min
  }));
}

// Função para formatar dados para uso em gráficos Chart.js
function formatChartData(data, label, borderColor, backgroundColor) {
  return {
    labels: data.map(item => {
      // Converter data para formato mais amigável
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