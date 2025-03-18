import { useCallback, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { trackEvent, trackPageView, getTrafficSource, trackingEvents } from '@/lib/analytics';

/**
 * Hook personalizado para rastrear eventos e conversões
 * Fornece uma interface simplificada para usar o sistema de analytics
 */
export default function useAnalytics() {
  const router = useRouter();
  
  // Rastreamento automático de mudanças de página
  useEffect(() => {
    // Função para rastrear visualizações de página
    const handleRouteChange = (url) => {
      trackPageView(url);
    };
    
    // Configurar rastreamento de mudanças de rota
    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Rastrear visualização inicial da página
    if (typeof window !== 'undefined') {
      trackPageView(window.location.pathname);
    }
    
    // Limpar evento ao desmontar
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  // Função para rastrear qualquer evento de analytics
  const logEvent = useCallback((eventName, eventParams = {}) => {
    trackEvent(eventName, eventParams);
  }, []);
  
  // Função para rastrear uma busca
  const logSearch = useCallback((query, results, filters = {}) => {
    const params = {
      search_term: query,
      results_count: results.length,
      filters: JSON.stringify(filters),
      traffic_source: getTrafficSource()
    };
    
    // Usar evento específico se não houver resultados
    const eventName = results.length === 0 
      ? trackingEvents.SEARCH_ZERO_RESULTS 
      : trackingEvents.SEARCH_QUERY;
      
    trackEvent(eventName, params);
  }, []);
  
  // Função para rastrear início da reserva
  const logReservationStart = useCallback((restaurantId, restaurantName, reservationData) => {
    const params = {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      reservation_time: reservationData.time,
      reservation_date: reservationData.date,
      party_size: reservationData.partySize,
      device_type: typeof window !== 'undefined' 
        ? window.innerWidth <= 768 ? 'mobile' : 'desktop'
        : 'unknown'
    };
    
    trackEvent(trackingEvents.RESERVATION_START, params);
  }, []);
  
  // Função para rastrear conclusão da reserva
  const logReservationComplete = useCallback((restaurantId, restaurantName, reservationId, reservationData) => {
    const params = {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      reservation_id: reservationId,
      reservation_time: reservationData.time,
      reservation_date: reservationData.date,
      party_size: reservationData.partySize,
      special_requests: reservationData.specialRequests ? 'yes' : 'no'
    };
    
    trackEvent(trackingEvents.RESERVATION_COMPLETE, params);
  }, []);
  
  // Função para rastrear clique no menu
  const logMenuItemClick = useCallback((restaurantId, restaurantName, itemName, itemCategory, itemPrice) => {
    const params = {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      item_name: itemName,
      item_category: itemCategory,
      item_price: itemPrice,
    };
    
    trackEvent(trackingEvents.MENU_ITEM_CLICK, params);
  }, []);
  
  // Função para rastrear compartilhamento
  const logShare = useCallback((restaurantId, restaurantName, shareMethod) => {
    const params = {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      share_method: shareMethod, // facebook, twitter, whatsapp, etc.
      page_url: typeof window !== 'undefined' ? window.location.href : '',
    };
    
    trackEvent(trackingEvents.SHARE_RESTAURANT, params);
  }, []);
  
  // Função para rastrear envio de avaliação
  const logReviewSubmit = useCallback((restaurantId, restaurantName, rating, hasComment) => {
    const params = {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      rating: rating,
      has_comment: hasComment,
    };
    
    trackEvent(trackingEvents.REVIEW_SUBMIT, params);
  }, []);
  
  // Função para rastrear contato com restaurante
  const logRestaurantContact = useCallback((restaurantId, restaurantName, contactType) => {
    let eventName;
    
    switch(contactType) {
      case 'call':
        eventName = trackingEvents.CALL_RESTAURANT;
        break;
      case 'directions':
        eventName = trackingEvents.GET_DIRECTIONS;
        break;
      case 'website':
        eventName = trackingEvents.VISIT_WEBSITE;
        break;
      default:
        eventName = 'contact_restaurant';
    }
    
    const params = {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      contact_type: contactType,
    };
    
    trackEvent(eventName, params);
  }, []);
  
  // Retornar todas as funções de rastreamento
  return {
    logEvent,
    logSearch,
    logReservationStart,
    logReservationComplete,
    logMenuItemClick,
    logShare,
    logReviewSubmit,
    logRestaurantContact,
    trackingEvents
  };
} 