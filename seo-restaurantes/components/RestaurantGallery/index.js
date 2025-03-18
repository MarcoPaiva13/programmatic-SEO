import { useState } from 'react';
import PropTypes from 'prop-types';
import OptimizedImage from '../OptimizedImage';
import { IMAGE_TYPES, reportImageError } from '@/utils/imageHelpers';
import styles from './RestaurantGallery.module.css';

const RestaurantGallery = ({
  restaurant,
  maxImages = 6,
  aspectRatio = 16/9,
  onImageClick,
  className = '',
}) => {
  const [errors, setErrors] = useState({});

  if (!restaurant || !restaurant.images || restaurant.images.length === 0) {
    return (
      <div className={`${styles.noImages} ${className}`}>
        <p>Sem imagens disponíveis para este restaurante</p>
      </div>
    );
  }

  // Limita o número de imagens exibidas
  const imagesToDisplay = restaurant.images.slice(0, maxImages);
  
  // Manipula erros de carregamento de imagem
  const handleImageError = (imageIndex) => {
    setErrors(prev => ({ ...prev, [imageIndex]: true }));
    
    if (restaurant && restaurant.id && restaurant.images[imageIndex]) {
      const image = restaurant.images[imageIndex];
      reportImageError(image.url, restaurant.id, image.type || 'unknown');
    }
  };
  
  // Manipula clique em imagem
  const handleImageClick = (image, index) => {
    if (typeof onImageClick === 'function') {
      onImageClick(image, index);
    }
  };

  // Determina a classe do layout de grade com base no número de imagens
  const getGridClass = () => {
    const count = imagesToDisplay.length;
    
    if (count === 1) return styles.gridSingle;
    if (count === 2) return styles.gridTwo;
    if (count === 3) return styles.gridThree;
    if (count === 4) return styles.gridFour;
    if (count >= 5) return styles.gridMany;
    
    return '';
  };

  return (
    <div className={`${styles.gallery} ${getGridClass()} ${className}`}>
      {imagesToDisplay.map((image, index) => (
        <div 
          key={`${restaurant.id}-image-${index}`}
          className={`${styles.imageContainer} ${errors[index] ? styles.hasError : ''}`}
          onClick={() => handleImageClick(image, index)}
          style={{ aspectRatio: aspectRatio }}
        >
          <OptimizedImage
            src={image.url}
            alt={image.alt || `Imagem ${index + 1} do restaurante ${restaurant.name}`}
            type={image.type || 'default'}
            layout="fill"
            objectFit="cover"
            priority={index === 0} // A primeira imagem tem prioridade
            quality={index === 0 ? 90 : 75} // Qualidade maior para primeira imagem
            onError={() => handleImageError(index)}
            sizes={
              index === 0
                ? '(max-width: 768px) 100vw, 66vw'
                : '(max-width: 768px) 50vw, 33vw'
            }
          />
          
          {/* Indicativo de tipo de imagem */}
          {image.type && (
            <div className={styles.imageType}>
              {image.type}
            </div>
          )}
          
          {/* Para galeria com mais imagens do que exibidas */}
          {index === maxImages - 1 && restaurant.images.length > maxImages && (
            <div className={styles.moreImages}>
              <span>+{restaurant.images.length - maxImages}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

RestaurantGallery.propTypes = {
  restaurant: PropTypes.object.isRequired,
  maxImages: PropTypes.number,
  aspectRatio: PropTypes.number,
  onImageClick: PropTypes.func,
  className: PropTypes.string,
};

export default RestaurantGallery; 