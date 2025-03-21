// pages/api/vitals/summary.js
import { getVitalsDataForDateRange, calculateAverageMetrics } from '@/utils/vitalsUtils';

/**
 * API endpoint para obter um resumo das métricas Core Web Vitals
 * 
 * Retorna dados agregados das métricas coletadas em um intervalo de datas
 * 
 * @param {object} req - Objeto de requisição Next.js
 * @param {object} res - Objeto de resposta Next.js
 */
export default async function handler(req, res) {
  // Verificar se o método é GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Obter parâmetros de consulta
    const { start, end, page } = req.query;
    
    // Validar datas
    let startDate = start ? new Date(start) : new Date();
    startDate.setDate(startDate.getDate() - 7); // Padrão: últimos 7 dias
    
    let endDate = end ? new Date(end) : new Date();
    
    // Verificar se as datas são válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Datas inválidas' });
    }
    
    // Obter dados de métricas para o intervalo
    const metricsData = getVitalsDataForDateRange(startDate, endDate);
    
    // Filtrar por página específica, se fornecida
    const filteredData = page 
      ? metricsData.filter(metric => metric.page === page)
      : metricsData;
    
    // Calcular médias para cada tipo de métrica
    const averages = calculateAverageMetrics(filteredData);
    
    // Agrupar por página para análise
    const pageGroups = {};
    filteredData.forEach(metric => {
      if (!pageGroups[metric.page]) {
        pageGroups[metric.page] = [];
      }
      pageGroups[metric.page].push(metric);
    });
    
    // Calcular médias por página
    const pageAverages = {};
    Object.keys(pageGroups).forEach(pagePath => {
      pageAverages[pagePath] = calculateAverageMetrics(pageGroups[pagePath]);
    });
    
    // Preparar resposta
    const response = {
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      metrics: {
        total: filteredData.length,
        averages,
        byPage: pageAverages,
      },
      pages: Object.keys(pageGroups).length,
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Erro ao gerar resumo de métricas:', error);
    return res.status(500).json({ error: 'Erro interno ao processar métricas' });
  }
}
