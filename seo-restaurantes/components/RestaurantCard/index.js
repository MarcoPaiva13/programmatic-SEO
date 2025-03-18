import { useState } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import RestaurantImage from '../RestaurantImage';
import { IMAGE_TYPES } from '@/utils/imageHelpers';
import styles from './RestaurantCard.module.css';

const RestaurantCard = ({
  restaurant,
  onNavigate,
  onToggleFavorite,
  isFavorite = false,
  style = 'standard', // standard, compact, featured
  className = '',
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Manipuladores de eventos
  const handleCardClick = (e) => {
    if (typeof onNavigate === 'function') {
      e.preventDefault();
      onNavigate(`/restaurantes/${restaurant.id}`);
    }
  };
  
  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (typeof onToggleFavorite === 'function') {
      onToggleFavorite(restaurant.id);
    }
  };
  
  const handleShareClick = (e) => {
    e.stopPropagation();
    // Lógica para compartilhar
    if (navigator.share) {
      navigator.share({
        title: restaurant.name,
        text: `Confira o ${restaurant.name} em ${restaurant.neighborhood}, ${restaurant.city}`,
        url: `https://guia-restaurantes.com.br/restaurantes/${restaurant.id}`,
      });
    }
  };
  
  // Renderiza estrelas de avaliação
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className={styles.star} data-testid="star">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className={`${styles.star} ${styles.half}`} data-testid="star">★</span>);
      } else {
        stars.push(<span key={i} className={`${styles.star} ${styles.empty}`} data-testid="star">★</span>);
      }
    }
    
    return stars;
  };
  
  // Determina o tipo de preço ($, $$, $$$)
  const getPriceIndicator = () => {
    if (restaurant.priceRange === 'Barato') return '$';
    if (restaurant.priceRange === 'Moderado') return '$$';
    if (restaurant.priceRange === 'Caro') return '$$$';
    if (restaurant.priceRange === 'Luxo') return '$$$$';
    
    return restaurant.priceRange;
  };
  
  // Classes condicionais
  const cardClasses = [
    styles.card,
    styles[style],
    isImageLoaded ? styles.loaded : styles.loading,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <article className={cardClasses} onClick={handleCardClick} role="article">
      <div className={styles.imageContainer}>
        <RestaurantImage 
          restaurant={restaurant}
          imageType={IMAGE_TYPES.EXTERIOR} 
          width={400}
          height={300}
          priority={style === 'featured'}
          quality={style === 'featured' ? 85 : 70}
          showRestaurantInfo={false}
          onLoad={() => setIsImageLoaded(true)}
          sizes={style === 'featured' 
            ? '(max-width: 768px) 100vw, 50vw' 
            : '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw'
          }
        />
        
        {/* Badge de favorito */}
        <button 
          className={`${styles.favoriteButton} ${isFavorite ? styles.favorite : ''}`}
          onClick={handleFavoriteClick}
          aria-label="favorito"
        >
          {isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{restaurant.name}</h3>
        
        <div className={styles.meta}>
          <div className={styles.cuisine}>
            {Array.isArray(restaurant.cuisine) 
              ? restaurant.cuisine.join(', ') 
              : restaurant.cuisine}
          </div>
          
          <div className={styles.location}>
            {restaurant.neighborhood}, {restaurant.city}
          </div>
          
          <div className={styles.ratingContainer}>
            <div className={styles.stars} aria-label={`${restaurant.rating} de 5 estrelas`}>
              {renderStars(restaurant.rating)}
            </div>
            <span className={styles.rating}>{restaurant.rating}</span>
          </div>
          
          <div className={styles.price} data-testid="price-indicator">
            {getPriceIndicator()}
          </div>
        </div>
        
        {restaurant.features && restaurant.features.length > 0 && (
          <div className={styles.features}>
            {restaurant.features.slice(0, 3).map((feature, index) => (
              <span key={index} className={styles.feature}>{feature}</span>
            ))}
            {restaurant.features.length > 3 && (
              <span className={styles.moreFeatures}>+{restaurant.features.length - 3}</span>
            )}
          </div>
        )}
        
        <div className={styles.actions}>
          <a 
            href={restaurant.contact?.website || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.websiteLink}
            onClick={(e) => e.stopPropagation()}
          >
            Visitar site
          </a>
          
          <button 
            className={styles.shareButton}
            onClick={handleShareClick}
            aria-label="compartilhar"
          >
            Compartilhar
          </button>
        </div>
      </div>
    </article>
  );
};

RestaurantCard.propTypes = {
  restaurant: PropTypes.object.isRequired,
  onNavigate: PropTypes.func,
  onToggleFavorite: PropTypes.func,
  isFavorite: PropTypes.bool,
  style: PropTypes.oneOf(['standard', 'compact', 'featured']),
  className: PropTypes.string
};

export default RestaurantCard; 