import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';

/**
 * Biblioteca de analytics integrada para o projeto SEO Restaurantes
 * Suporta Google Analytics 4, Web Vitals e rastreamento de eventos personalizados
 */

// Verificar se o rastreamento está habilitado
const isTrackingEnabled = () => {
  try {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven || consentGiven === 'rejected') return false;
    
    if (consentGiven === 'customized') {
      const preferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
      return preferences.analytics === true;
    }
    
    return consentGiven === 'accepted';
  } catch (error) {
    console.error('Erro ao verificar consentimento:', error);
    return false;
  }
};

/**
 * Inicializar GA4 na página
 * Usa o carregamento diferido e respeita preferências de privacidade
 */
export function initGA4() {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
  
  if (!GA_MEASUREMENT_ID) {
    console.warn('ID do Google Analytics não configurado');
    return;
  }
  
  // Configuração inicial do GA4
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  
  gtag('js', new Date());
  
  // Configurar para respeitar preferências
  gtag('consent', 'default', {
    'analytics_storage': 'denied',
    'ad_storage': 'denied',
    'personalization_storage': 'denied'
  });
  
  // Definir coleta padrão
  gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // Desativado no início, será ativado se houver consentimento
    anonymize_ip: true,
    transport_type: 'beacon'
  });
}

/**
 * Atualizar consentimento baseado nas preferências do usuário
 * Usado quando o usuário altera suas preferências de rastreamento
 */
export function updateConsent(preferences) {
  if (!window.gtag) return;
  
  // Obter status de consentimento das preferências
  const analyticsConsent = preferences.analytics ? 'granted' : 'denied';
  const marketingConsent = preferences.marketing ? 'granted' : 'denied';
  const personalizationConsent = preferences.personalization ? 'granted' : 'denied';
  
  // Atualizar consentimento no GA4
  window.gtag('consent', 'update', {
    'analytics_storage': analyticsConsent,
    'ad_storage': marketingConsent,
    'personalization_storage': personalizationConsent
  });
  
  // Se analytics permitido, ativar coleta de dados
  if (preferences.analytics) {
    const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;
    if (GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: true
      });
    }
  }
}

/**
 * Medir e reportar métricas Core Web Vitals
 */
export function reportWebVitals() {
  if (!isTrackingEnabled()) return;
  
  const sendToAnalytics = (metric) => {
    // Debug em desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric.name, metric.value);
    }
    
    // Envio para GA4
    if (window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.value * 100) / 100,
        metric_name: metric.name,
        metric_value: metric.value,
        metric_delta: metric.delta,
        metric_rating: getMetricRating(metric),
        non_interaction: true
      });
    }
  };
  
  // Iniciar medição de métricas
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getLCP(sendToAnalytics);
  getFCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}

/**
 * Determinar classificação da métrica (bom, precisa melhorar, ruim)
 */
function getMetricRating(metric) {
  const metricName = metric.name;
  const value = metric.value;
  
  // Limiares baseados nas recomendações do Core Web Vitals
  switch (metricName) {
    case 'CLS':
      return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
    case 'FID':
      return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
    case 'LCP':
      return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
    case 'FCP':
      return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
    case 'TTFB':
      return value <= 500 ? 'good' : value <= 1000 ? 'needs-improvement' : 'poor';
    default:
      return 'unknown';
  }
}

/**
 * Rastrear visualização de página
 */
export function trackPageView(url) {
  if (!isTrackingEnabled() || !window.gtag) return;
  
  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: document.title,
    page_location: window.location.href
  });
}

/**
 * Rastrear evento personalizado
 */
export function trackEvent(eventName, eventParams = {}) {
  if (!isTrackingEnabled() || !window.gtag) return;
  
  // Adicionar informações do dispositivo e sessão
  const deviceType = getDeviceType();
  const params = {
    ...eventParams,
    event_time: new Date().toISOString(),
    device_type: deviceType,
    event_source: window.location.pathname
  };
  
  window.gtag('event', eventName, params);
}

/**
 * Eventos específicos para rastreamento de conversão
 */
export const trackingEvents = {
  // Eventos de reserva
  RESERVATION_START: 'reservation_start',
  RESERVATION_COMPLETE: 'reservation_complete',
  RESERVATION_ABANDON: 'reservation_abandon',
  
  // Eventos de menu
  MENU_VIEW: 'menu_view',
  MENU_ITEM_CLICK: 'menu_item_click',
  MENU_DOWNLOAD: 'menu_download',
  
  // Eventos de engajamento
  REVIEW_SUBMIT: 'review_submit',
  PHOTO_VIEW: 'photo_view',
  SHARE_RESTAURANT: 'share_restaurant',
  ADD_TO_FAVORITES: 'add_to_favorites',
  
  // Eventos de busca
  SEARCH_QUERY: 'search_query',
  SEARCH_FILTER_APPLY: 'search_filter_apply',
  SEARCH_RESULTS_VIEW: 'search_results_view',
  SEARCH_ZERO_RESULTS: 'search_zero_results',
  
  // Eventos de navegação
  CATEGORY_CLICK: 'category_click',
  RELATED_RESTAURANT_CLICK: 'related_restaurant_click',
  NEARBY_RESTAURANT_CLICK: 'nearby_restaurant_click',
  
  // Eventos de contato
  CALL_RESTAURANT: 'call_restaurant',
  GET_DIRECTIONS: 'get_directions',
  VISIT_WEBSITE: 'visit_website'
};

/**
 * Rastrear erro na aplicação
 */
export function trackError(errorName, errorMessage, errorStack) {
  if (!isTrackingEnabled() || !window.gtag) return;
  
  window.gtag('event', 'app_error', {
    error_name: errorName,
    error_message: errorMessage,
    error_stack: errorStack,
    page_url: window.location.href,
    page_title: document.title
  });
}

/**
 * Detectar tipo de dispositivo do usuário
 */
function getDeviceType() {
  const ua = navigator.userAgent;
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  
  return 'desktop';
}

/**
 * Detectar origem do tráfego
 */
export function getTrafficSource() {
  if (typeof window === 'undefined') return 'unknown';
  
  try {
    const referrer = document.referrer;
    if (!referrer) return 'direct';
    
    const referrerDomain = new URL(referrer).hostname;
    const currentDomain = window.location.hostname;
    
    if (referrerDomain === currentDomain) return 'internal';
    
    // Detecção de mecanismos de busca comuns
    if (referrerDomain.includes('google')) return 'google';
    if (referrerDomain.includes('bing')) return 'bing';
    if (referrerDomain.includes('yahoo')) return 'yahoo';
    if (referrerDomain.includes('duckduckgo')) return 'duckduckgo';
    
    // Detecção de redes sociais
    if (referrerDomain.includes('facebook') || referrerDomain.includes('fb.')) return 'facebook';
    if (referrerDomain.includes('instagram')) return 'instagram';
    if (referrerDomain.includes('twitter') || referrerDomain.includes('t.co')) return 'twitter';
    if (referrerDomain.includes('linkedin')) return 'linkedin';
    if (referrerDomain.includes('pinterest')) return 'pinterest';
    
    return 'referral';
  } catch (e) {
    console.error('Erro ao detectar origem do tráfego:', e);
    return 'unknown';
  }
}

/**
 * Inicializar heatmap
 */
export function initHeatmap() {
  if (!isTrackingEnabled()) return;
  
  // Simples detector de cliques para heatmap básico
  if (typeof window !== 'undefined') {
    const clicks = [];
    
    document.addEventListener('click', (e) => {
      // Registrar clique com coordenadas relativas
      const pageWidth = window.innerWidth;
      const pageHeight = window.innerHeight;
      
      const clickData = {
        x: Math.round((e.clientX / pageWidth) * 100),
        y: Math.round((e.clientY / pageHeight) * 100),
        path: window.location.pathname,
        timestamp: new Date().toISOString(),
        elementType: e.target.tagName.toLowerCase(),
        elementId: e.target.id || '',
        elementClass: e.target.className || ''
      };
      
      clicks.push(clickData);
      
      // Limitar armazenamento (máximo 100 cliques)
      if (clicks.length > 100) clicks.shift();
      
      // Armazenar no localStorage
      try {
        localStorage.setItem('heatmapClicks', JSON.stringify(clicks));
      } catch (error) {
        console.error('Erro ao armazenar dados de heatmap:', error);
      }
      
      // Enviar para analytics a cada 10 cliques
      if (clicks.length % 10 === 0 && window.gtag) {
        window.gtag('event', 'heatmap_data', {
          clicks: JSON.stringify(clicks.slice(-10))
        });
      }
    });
  }
} 