// ResultsList.js
// Componente para exibir a lista de resultados de busca usando RestaurantCard

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styles from './ResultsList.module.css';
import RestaurantCard from '../RestaurantCard';

const ResultsList = ({ results }) => {
  const [favorites, setFavorites] = useState([]);
  
  // Carregar favoritos do localStorage
  useEffect(() => {
    const favs = localStorage.getItem('favoriteRestaurants');
    if (favs) {
      setFavorites(JSON.parse(favs));
    }
  }, []);
  
  // Função para lidar com favoritos
  const handleToggleFavorite = (restaurantId) => {
    const newFavorites = favorites.includes(restaurantId)
      ? favorites.filter(id => id !== restaurantId)
      : [...favorites, restaurantId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteRestaurants', JSON.stringify(newFavorites));
  };
  
  // Função para compartilhar restaurante
  const handleShareRestaurant = async (restaurant) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Conheça ${restaurant.name} - ${restaurant.cuisine.join(', ')} em ${restaurant.city}`,
          url: `${window.location.origin}/restaurantes/${restaurant.slug}`
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const shareUrl = `${window.location.origin}/restaurantes/${restaurant.slug}`;
      alert(`Link para compartilhar: ${shareUrl}`);
    }
  };

  if (results.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>Nenhum restaurante corresponde aos critérios de busca.</p>
        <p>Tente ajustar seus filtros ou realizar uma nova busca.</p>
      </div>
    );
  }

  return (
    <div className={styles.resultsList}>
      {results.map((restaurant) => (
        <div key={restaurant.id} className={styles.resultItem}>
          <RestaurantCard
            restaurant={restaurant}
            isFavorite={favorites.includes(restaurant.id)}
            onFavoriteToggle={() => handleToggleFavorite(restaurant.id)}
            onShare={() => handleShareRestaurant(restaurant)}
            variant="featured"
            imageType="EXTERIOR"
            maxFeatures={5}
          />
        </div>
      ))}
    </div>
  );
};

ResultsList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired,
      images: PropTypes.array,
      cuisine: PropTypes.arrayOf(PropTypes.string),
      city: PropTypes.string,
      neighborhood: PropTypes.string,
      rating: PropTypes.number,
      priceRange: PropTypes.string,
      features: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired
};

export default ResultsList; 