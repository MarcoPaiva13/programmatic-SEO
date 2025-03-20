import { VITAL_THRESHOLDS } from './vitalsUtils';

/**
 * Formata um valor numérico para exibição adequada baseado no tipo de métrica
 * @param {string} metricName - Nome da métrica (LCP, FID, CLS, etc.)
 * @param {number} value - Valor da métrica
 * @returns {string} - Valor formatado para exibição
 */
export function formatMetricValue(metricName, value) {
  if (value === undefined || value === null) return 'N/A';
  
  switch (metricName.toUpperCase()) {
    case 'CLS':
      return value.toFixed(2);
    case 'LCP':
    case 'FCP':
    case 'TTFB':
      return `${(value / 1000).toFixed(2)}s`;
    case 'FID':
      return `${Math.round(value)}ms`;
    default:
      return value.toString();
  }
}

/**
 * Determina a classificação de uma métrica com base nos limiares
 * @param {string} metricName - Nome da métrica (LCP, FID, CLS, etc.)
 * @param {number} value - Valor da métrica
 * @returns {string} - Classificação: 'good', 'needs-improvement', ou 'poor'
 */
export function getMetricRating(metricName, value) {
  if (value === undefined || value === null) return 'unknown';
  
  const key = metricName.toUpperCase();
  const thresholds = VITAL_THRESHOLDS[key];
  
  if (!thresholds) return 'unknown';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Traduz a classificação para o português
 * @param {string} rating - Classificação em inglês
 * @returns {string} - Classificação traduzida
 */
export function translateRating(rating) {
  switch (rating) {
    case 'good':
      return 'Bom';
    case 'needs-improvement':
      return 'Precisa Melhorar';
    case 'poor':
      return 'Ruim';
    default:
      return 'Desconhecido';
  }
}

/**
 * Retorna classe CSS baseada na classificação da métrica
 * @param {string} rating - Classificação da métrica
 * @returns {string} - Nome da classe CSS
 */
export function getRatingClass(rating) {
  switch (rating) {
    case 'good':
      return 'good';
    case 'needs-improvement':
      return 'needsImprovement';
    case 'poor':
      return 'poor';
    default:
      return '';
  }
}

/**
 * Retorna classe CSS para badge baseada na classificação da métrica
 * @param {string} rating - Classificação da métrica
 * @returns {string} - Nome da classe CSS para o badge
 */
export function getBadgeClass(rating) {
  switch (rating) {
    case 'good':
      return 'badgeGood';
    case 'needs-improvement':
      return 'badgeNeedsImprovement';
    case 'poor':
      return 'badgePoor';
    default:
      return '';
  }
}

/**
 * Converte dados para formato adequado para exportação CSV
 * @param {Array} metrics - Array de métricas
 * @returns {string} - Conteúdo em formato CSV
 */
export function convertToCSV(metrics) {
  if (!metrics || !metrics.length) return '';
  
  // Cabeçalhos
  const headers = Object.keys(metrics[0]).join(',');
  
  // Linhas de dados
  const rows = metrics.map(metric => {
    return Object.values(metric)
      .map(value => {
        // Tratar strings com vírgulas
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`;
        }
        return value;
      })
      .join(',');
  });
  
  // Juntar cabeçalhos e linhas
  return [headers, ...rows].join('\n');
}

/**
 * Gera um arquivo de download com conteúdo específico
 * @param {string} content - Conteúdo do arquivo
 * @param {string} fileName - Nome do arquivo
 * @param {string} type - Tipo MIME do arquivo
 */
export function downloadFile(content, fileName, type = 'text/csv') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  
  // Limpar
  setTimeout(() => {
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }, 100);
}

/**
 * Prepara dados para gráfico de tendência ao longo do tempo
 * @param {Array} metrics - Array de métricas
 * @param {string} selectedMetric - Métrica selecionada para visualização
 * @returns {Array} - Dados formatados para o gráfico
 */
export function prepareTimelineData(metrics, selectedMetric) {
  if (!metrics || !metrics.length) return [];
  
  // Agrupar métricas por data
  const groupedByDate = {};
  
  metrics.forEach(metric => {
    if (metric.name !== selectedMetric) return;
    
    const date = new Date(metric.timestamp).toISOString().split('T')[0];
    
    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        values: [],
        count: 0,
        sum: 0
      };
    }
    
    groupedByDate[date].values.push(metric.value);
    groupedByDate[date].count++;
    groupedByDate[date].sum += metric.value;
  });
  
  // Converter para array e calcular médias
  return Object.keys(groupedByDate).map(date => {
    const group = groupedByDate[date];
    const avgValue = group.sum / group.count;
    
    return {
      date,
      value: avgValue,
      rating: getMetricRating(selectedMetric, avgValue)
    };
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Prepara dados para o gráfico de barras de comparação entre páginas
 * @param {Object} metricsByPage - Objeto com métricas agrupadas por página
 * @param {string} selectedMetric - Métrica selecionada para visualização
 * @returns {Array} - Dados formatados para o gráfico
 */
export function preparePageComparisonData(metricsByPage, selectedMetric) {
  if (!metricsByPage) return [];
  
  return Object.keys(metricsByPage).map(page => {
    const metrics = metricsByPage[page];
    const metricData = metrics[selectedMetric.toUpperCase()];
    
    if (!metricData) {
      return {
        page: formatPagePath(page),
        value: 0,
        rating: 'unknown'
      };
    }
    
    return {
      page: formatPagePath(page),
      value: metricData.average,
      rating: metricData.rating
    };
  })
  .filter(item => item.rating !== 'unknown')
  .sort((a, b) => b.value - a.value)
  .slice(0, 10);
}

/**
 * Formata caminhos de página para exibição mais legível
 * @param {string} path - Caminho da página
 * @returns {string} - Caminho formatado
 */
export function formatPagePath(path) {
  if (!path) return 'Desconhecido';
  
  // Remover parâmetros de consulta
  const pathWithoutQuery = path.split('?')[0];
  
  // Remover barras duplicadas e trailing
  const cleanPath = pathWithoutQuery.replace(/\/+/g, '/').replace(/\/$/, '');
  
  // Se for homepage
  if (cleanPath === '' || cleanPath === '/') return 'Homepage';
  
  return cleanPath;
}

/**
 * Prepara dados para a tabela de páginas com pior desempenho
 * @param {Object} metricsByPage - Objeto com métricas agrupadas por página
 * @returns {Array} - Dados formatados para a tabela
 */
export function prepareWorstPerformingPagesData(metricsByPage) {
  if (!metricsByPage) return [];
  
  const pages = Object.keys(metricsByPage).map(page => {
    const metrics = metricsByPage[page];
    const pageData = {
      page: formatPagePath(page),
      path: page,
      problemCount: 0
    };
    
    // Adicionar cada métrica ao objeto da página
    Object.keys(metrics).forEach(metricKey => {
      const metric = metrics[metricKey];
      pageData[metricKey.toLowerCase()] = metric.average;
      pageData[`${metricKey.toLowerCase()}Rating`] = metric.rating;
      
      // Contar métricas problemáticas
      if (metric.rating === 'needs-improvement' || metric.rating === 'poor') {
        pageData.problemCount++;
      }
    });
    
    return pageData;
  });
  
  // Ordenar por número de problemas (decrescente) e pegar os 10 piores
  return pages.sort((a, b) => {
    // Primeiro por número de problemas
    if (b.problemCount !== a.problemCount) {
      return b.problemCount - a.problemCount;
    }
    
    // Se igual, verificar severidade por LCP, depois CLS, depois FID
    const metricsToCheck = ['lcp', 'cls', 'fid', 'fcp', 'ttfb'];
    
    for (const metric of metricsToCheck) {
      const aValue = a[metric] || 0;
      const bValue = b[metric] || 0;
      
      // Para CLS, maior é pior; para outros, menor é melhor
      if (metric === 'cls') {
        if (bValue !== aValue) return bValue - aValue;
      } else {
        if (aValue !== bValue) return bValue - aValue;
      }
    }
    
    return 0;
  }).slice(0, 10);
} 