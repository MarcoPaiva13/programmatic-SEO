import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import OptimizedImage from '../OptimizedImage';
import { 
  IMAGE_TYPES, 
  FALLBACK_IMAGES, 
  selectResponsiveImage, 
  generateAccessibleAlt,
  reportImageError
} from '@/utils/imageHelpers';
import styles from './RestaurantImage.module.css';

const RestaurantImage = ({
  restaurant,
  imageType = IMAGE_TYPES.EXTERIOR,
  width = 600,
  height = 400,
  layout = 'responsive',
  priority = false,
  className = '',
  showRestaurantInfo = false,
  rounded = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  onClick,
  ...props
}) => {
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  
  useEffect(() => {
    if (restaurant && restaurant.images) {
      // Seleciona a melhor imagem com base no tipo
      const selectedSrc = selectResponsiveImage(restaurant.images, imageType);
      setImageSrc(selectedSrc);
      
      // Gera alt text acessível com base nas informações do restaurante
      const alt = restaurant.images.find(img => img.type === imageType)?.alt || 
                 generateAccessibleAlt(restaurant, imageType);
      setImageAlt(alt);
    } else {
      // Fallback para caso não tenha restaurante ou imagens
      setImageSrc(FALLBACK_IMAGES[imageType] || FALLBACK_IMAGES.default);
      setImageAlt(`Imagem não disponível de ${imageType}`);
    }
  }, [restaurant, imageType]);
  
  // Manipula erros de carregamento
  const handleError = () => {
    setError(true);
    
    // Reporta o erro para análise
    if (restaurant && restaurant.id) {
      reportImageError(imageSrc, restaurant.id, imageType);
    }
  };
  
  // Classes condicionais 
  const containerClasses = [
    styles.restaurantImage,
    rounded ? styles.rounded : '',
    error ? styles.hasError : '',
    onClick ? styles.clickable : '',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={containerClasses}
      onClick={onClick}
      data-testid="restaurant-image-container"
    >
      <OptimizedImage
        src={imageSrc}
        alt={imageAlt}
        width={width}
        height={height}
        layout={layout}
        priority={priority}
        type={imageType}
        onError={handleError}
        sizes={sizes}
        {...props}
      />
      
      {/* Informações sobrepostas do restaurante (opcional) */}
      {showRestaurantInfo && restaurant && (
        <div className={styles.overlay}>
          <div className={styles.info}>
            <h3 className={styles.name}>{restaurant.name}</h3>
            <div className={styles.details}>
              <span className={styles.cuisine}>{Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(', ') : restaurant.cuisine}</span>
              <span className={styles.location}>{restaurant.neighborhood}, {restaurant.city}</span>
            </div>
            {restaurant.rating && (
              <div className={styles.rating}>
                <span className={styles.stars}>{'★'.repeat(Math.floor(restaurant.rating))}</span>
                <span className={styles.ratingValue}>{restaurant.rating}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

RestaurantImage.propTypes = {
  restaurant: PropTypes.object,
  imageType: PropTypes.oneOf(Object.values(IMAGE_TYPES)),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  layout: PropTypes.string,
  priority: PropTypes.bool,
  className: PropTypes.string,
  showRestaurantInfo: PropTypes.bool,
  rounded: PropTypes.bool,
  sizes: PropTypes.string,
  onClick: PropTypes.func
};

export default RestaurantImage; 