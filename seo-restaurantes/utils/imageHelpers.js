/**
 * Funções utilitárias para gerenciamento de imagens
 */

// Mapa de tipos de imagens de restaurante para fallbacks
export const IMAGE_TYPES = {
  EXTERIOR: 'exterior',
  INTERIOR: 'interior',
  FOOD: 'food',
  MENU: 'menu',
  CHEF: 'chef',
  DRINKS: 'drinks',
  EVENT: 'event',
  DETAIL: 'detail',
};

// Caminhos para imagens de fallback
export const FALLBACK_IMAGES = {
  [IMAGE_TYPES.EXTERIOR]: '/images/fallbacks/restaurant-exterior.jpg',
  [IMAGE_TYPES.INTERIOR]: '/images/fallbacks/restaurant-interior.jpg',
  [IMAGE_TYPES.FOOD]: '/images/fallbacks/food-dish.jpg',
  [IMAGE_TYPES.MENU]: '/images/fallbacks/menu.jpg',
  [IMAGE_TYPES.CHEF]: '/images/fallbacks/chef.jpg',
  [IMAGE_TYPES.DRINKS]: '/images/fallbacks/drinks.jpg',
  [IMAGE_TYPES.EVENT]: '/images/fallbacks/event.jpg',
  [IMAGE_TYPES.DETAIL]: '/images/fallbacks/detail.jpg',
  default: '/images/fallbacks/restaurant-default.jpg',
};

// Função para gerar alt-text acessível para imagens de restaurante
export const generateAccessibleAlt = (restaurant, type) => {
  if (!restaurant) return '';
  
  const { name, neighborhood, city } = restaurant;
  
  switch (type) {
    case IMAGE_TYPES.EXTERIOR:
      return `Fachada do restaurante ${name} localizado em ${neighborhood}, ${city}`;
    case IMAGE_TYPES.INTERIOR:
      return `Ambiente interno do restaurante ${name} em ${neighborhood}`;
    case IMAGE_TYPES.FOOD:
      return `Prato servido no restaurante ${name}`;
    case IMAGE_TYPES.MENU:
      return `Cardápio do restaurante ${name}`;
    case IMAGE_TYPES.CHEF:
      return `Chef do restaurante ${name}`;
    case IMAGE_TYPES.DRINKS:
      return `Bebidas servidas no restaurante ${name}`;
    case IMAGE_TYPES.EVENT:
      return `Evento no restaurante ${name}`;
    case IMAGE_TYPES.DETAIL:
      return `Detalhe do restaurante ${name}`;
    default:
      return `Imagem do restaurante ${name} em ${neighborhood}, ${city}`;
  }
};

// Função para selecionar a melhor imagem de acordo com o viewpor
export const selectResponsiveImage = (images, type = 'default') => {
  if (!images || !images.length) {
    return FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default;
  }
  
  // Encontra a primeira imagem do tipo especificado
  const typeImage = images.find(img => img.type === type);
  
  // Se encontrou imagem do tipo, retorna ela
  if (typeImage) {
    return typeImage.url;
  }
  
  // Se não encontrou do tipo específico, usa a primeira disponível
  return images[0].url;
};

// Função para gerar metatags OpenGraph para imagens
export const generateImageMetaTags = (restaurant) => {
  if (!restaurant || !restaurant.images || !restaurant.images.length) {
    return [];
  }
  
  // Seleciona a imagem principal (exterior ou a primeira disponível)
  const mainImage = selectResponsiveImage(restaurant.images, IMAGE_TYPES.EXTERIOR);
  const fallbackImage = FALLBACK_IMAGES[IMAGE_TYPES.EXTERIOR];
  
  const imageUrl = mainImage || fallbackImage;
  const baseUrl = 'https://guia-restaurantes.com.br';
  const fullImageUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`;
  
  return [
    { property: 'og:image', content: fullImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: generateAccessibleAlt(restaurant, IMAGE_TYPES.EXTERIOR) },
    { property: 'twitter:image', content: fullImageUrl },
    { property: 'twitter:card', content: 'summary_large_image' },
  ];
};

// Função para reportar erros de imagem para análise
export const reportImageError = (imageUrl, restaurantId, imageType) => {
  // Implementação pode enviar dados para analytics ou logging
  console.error(`Erro ao carregar imagem: ${imageUrl} - Restaurante ID: ${restaurantId} - Tipo: ${imageType}`);
  
  // Aqui poderia ser feita uma chamada para API interna para registrar erros
  // fetch('/api/report-image-error', {
  //   method: 'POST',
  //   body: JSON.stringify({ imageUrl, restaurantId, imageType }),
  //   headers: { 'Content-Type': 'application/json' }
  // });
};

// Função para determinar quais imagens carregar com prioridade
export const getPriorityImageTypes = () => [IMAGE_TYPES.EXTERIOR, IMAGE_TYPES.FOOD];

// Função para melhorar src da imagem (adicionar parâmetros de otimização se necessário)
export const enhanceImageSrc = (src) => {
  if (!src) return '';
  
  // Para URLs externas, retornar como está
  if (src.startsWith('http')) {
    return src;
  }
  
  // Para imagens locais, adiciona ao caminho
  return src.startsWith('/') ? src : `/${src}`;
}; 