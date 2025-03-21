// utils/vitalsUtils.js
import fs from 'fs';
import path from 'path';

/**
 * Utilitário para trabalhar com métricas Core Web Vitals
 * Funções para ler, analisar e formatar dados de métricas
 */

/**
 * Constantes para valores de referência das métricas
 * Baseado em https://web.dev/vitals/
 */
export const VITAL_THRESHOLDS = {
  LCP: {
    good: 2500,       // <= 2.5s é bom
    poor: 4000,       // > 4s é ruim
  },
  FID: {
    good: 100,        // <= 100ms é bom
    poor: 300,        // > 300ms é ruim
  },
  CLS: {
    good: 0.1,        // <= 0.1 é bom
    poor: 0.25,       // > 0.25 é ruim
  },
  FCP: {
    good: 1800,       // <= 1.8s é bom
    poor: 3000,       // > 3s é ruim
  },
  TTFB: {
    good: 800,        // <= 800ms é bom
    poor: 1800,       // > 1.8s é ruim
  },
};

/**
 * Obtém dados de métricas para um intervalo de datas específico
 * 
 * @param {Date} startDate - Data inicial
 * @param {Date} endDate - Data final (padrão: hoje)
 * @returns {Array} Dados de métricas para o intervalo
 */
export function getVitalsDataForDateRange(startDate, endDate = new Date()) {
  const result = [];
  const currentDate = new Date(startDate);
  
  // Percorrer o intervalo de datas
  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split('T')[0];
    const filePath = path.join(process.cwd(), 'data', 'vitals', `${dateString}.json`);
    
    // Verificar se existe arquivo para a data
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const metrics = JSON.parse(fileContent);
        
        // Adicionar dados ao resultado
        result.push(...metrics);
      } catch (error) {
        console.error(`Erro ao ler métricas para ${dateString}:`, error);
      }
    }
    
    // Incrementar data em 1 dia
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return result;
}

/**
 * Classifica uma métrica conforme os limiares de qualidade
 * 
 * @param {string} name - Nome da métrica (LCP, FID, CLS, etc)
 * @param {number} value - Valor da métrica
 * @returns {string} Classificação ('good', 'needs-improvement', 'poor')
 */
export function getRatingForMetric(name, value) {
  const metricKey = name.toUpperCase();
  const thresholds = VITAL_THRESHOLDS[metricKey];
  
  if (!thresholds) return 'unknown';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Calcula valores médios para cada tipo de métrica
 * 
 * @param {Array} metricsData - Array de objetos de métricas
 * @returns {Object} Médias para cada tipo de métrica
 */
export function calculateAverageMetrics(metricsData) {
  const metrics = {
    CLS: { sum: 0, count: 0 },
    LCP: { sum: 0, count: 0 },
    FID: { sum: 0, count: 0 },
    FCP: { sum: 0, count: 0 },
    TTFB: { sum: 0, count: 0 },
  };
  
  // Processar cada métrica
  metricsData.forEach(metric => {
    const metricKey = metric.name.toUpperCase();
    
    if (metrics[metricKey]) {
      metrics[metricKey].sum += metric.value;
      metrics[metricKey].count++;
    }
  });
  
  // Calcular médias
  const result = {};
  Object.keys(metrics).forEach(key => {
    if (metrics[key].count > 0) {
      result[key] = {
        average: metrics[key].sum / metrics[key].count,
        count: metrics[key].count,
      };
      
      // Adicionar classificação para a média
      result[key].rating = getRatingForMetric(key, result[key].average);
    }
  });
  
  return result;
}
