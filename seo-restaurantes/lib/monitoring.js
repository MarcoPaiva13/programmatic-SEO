import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

/**
 * Função para inicializar o monitoramento de métricas Web Vitals
 * @param {function} sendToAnalytics - Função de callback para enviar métricas
 */
export function reportWebVitals(sendToAnalytics) {
  getCLS(sendToAnalytics); // Cumulative Layout Shift
  getFID(sendToAnalytics); // First Input Delay
  getLCP(sendToAnalytics); // Largest Contentful Paint
  getFCP(sendToAnalytics); // First Contentful Paint
  getTTFB(sendToAnalytics); // Time To First Byte
}

/**
 * Registra métricas Web Vitals no Google Analytics/Vercel Analytics
 * @param {Object} metric - Objeto contendo os dados da métrica
 */
export function sendWebVitalsToAnalytics(metric) {
  // Console para depuração em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    console.log(`Web Vital: ${metric.name}`, metric);
  }
  
  // Enviar para Google Analytics, se disponível
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.value * 100) / 100,
      non_interaction: true,
    });
  }
  
  // Enviar para Vercel Analytics, se disponível
  if (typeof window !== 'undefined' && window.va) {
    window.va('event', {
      name: metric.name,
      value: metric.value,
      category: 'Web Vitals',
      metricId: metric.id,
    });
  }
}

/**
 * Inicializar rastreamento de erros para monitoramento
 */
export function initErrorTracking() {
  if (typeof window === 'undefined') return;
  
  // Registrar erros não tratados
  window.addEventListener('error', (event) => {
    console.error('Erro não tratado:', event.error);
    
    if (window.va) {
      window.va('event', {
        name: 'Unhandled Error',
        category: 'Error',
        message: event.error?.message || 'Unknown error',
        stack: event.error?.stack,
        url: window.location.href,
      });
    }
  });
  
  // Registrar rejeições de promessas não tratadas
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Promessa rejeitada não tratada:', event.reason);
    
    if (window.va) {
      window.va('event', {
        name: 'Unhandled Rejection',
        category: 'Error',
        message: event.reason?.message || 'Unknown promise rejection',
        stack: event.reason?.stack,
        url: window.location.href,
      });
    }
  });
}

/**
 * Registrar uma visualização de página específica
 * @param {string} url - URL da página visualizada
 * @param {string} title - Título da página
 */
export function trackPageView(url, title) {
  if (typeof window === 'undefined') return;
  
  // Google Analytics
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_location: url,
      page_title: title,
    });
  }
  
  // Vercel Analytics
  if (window.va) {
    window.va('page_view', { url });
  }
}

/**
 * Inicializa o indicador de progresso para navegação entre páginas
 * Integra com NProgress para feedback visual de carregamento
 */
export function initializeProgressIndicator() {
  if (typeof window === 'undefined' || !window.NProgress) return;
  
  // Configuração do NProgress
  window.NProgress.configure({ 
    showSpinner: false,
    minimum: 0.1,
    easing: 'ease',
    speed: 300,
  });
  
  // Eventos do router do Next.js para controle de progresso
  if (typeof window !== 'undefined' && window.next && window.next.router) {
    const router = window.next.router;
    
    router.events.on('routeChangeStart', () => {
      window.NProgress.start();
    });
    
    router.events.on('routeChangeComplete', () => {
      window.NProgress.done();
    });
    
    router.events.on('routeChangeError', () => {
      window.NProgress.done();
    });
  }
} 