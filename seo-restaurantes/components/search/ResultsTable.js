// ResultsTable.js
// Componente para visualização dos resultados em tabela comparativa

import { useState } from 'react';
import styles from '../../styles/Home.module.css';

const ResultsTable = ({ results }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'rating',
    direction: 'desc'
  });

  // Função para ordenar os resultados
  const sortResults = (key) => {
    let direction = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Função para renderizar o ícone de ordenação
  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Ordenar resultados
  const sortedResults = [...results].sort((a, b) => {
    if (sortConfig.key === 'rating') {
      return sortConfig.direction === 'asc' 
        ? a.rating - b.rating 
        : b.rating - a.rating;
    }
    
    if (sortConfig.key === 'price') {
      const priceToNumber = price => price.length;
      return sortConfig.direction === 'asc'
        ? priceToNumber(a.priceRange) - priceToNumber(b.priceRange)
        : priceToNumber(b.priceRange) - priceToNumber(a.priceRange);
    }
    
    if (sortConfig.key === 'name') {
      return sortConfig.direction === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    
    return 0;
  });

  // Renderizar estrelas de avaliação
  const renderStars = (rating) => {
    return (
      <div className={styles.tableRating} aria-label={`Avaliação ${rating} de 5 estrelas`}>
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={i < Math.floor(rating) ? styles.star : styles.emptyStar}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
        <span className={styles.ratingValue}>{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.resultsTable} role="grid">
        <thead>
          <tr>
            <th>
              <button
                onClick={() => sortResults('name')}
                className={styles.sortButton}
                aria-label="Ordenar por nome"
              >
                Nome {renderSortIcon('name')}
              </button>
            </th>
            <th>Localização</th>
            <th>
              <button
                onClick={() => sortResults('rating')}
                className={styles.sortButton}
                aria-label="Ordenar por avaliação"
              >
                Avaliação {renderSortIcon('rating')}
              </button>
            </th>
            <th>
              <button
                onClick={() => sortResults('price')}
                className={styles.sortButton}
                aria-label="Ordenar por preço"
              >
                Preço {renderSortIcon('price')}
              </button>
            </th>
            <th>Culinária</th>
            <th>Instalações</th>
            <th>Ações</th>
          </tr>
        </thead>
        
        <tbody>
          {sortedResults.map(restaurant => (
            <tr key={restaurant.id}>
              <td>
                <div className={styles.tableRestaurantName}>
                  <img 
                    src={restaurant.images?.[0]?.url || '/images/restaurant-placeholder.jpg'} 
                    alt="" 
                    className={styles.tableThumbnail}
                  />
                  <span>{restaurant.name}</span>
                </div>
              </td>
              <td>
                <div className={styles.tableLocation}>
                  <span>{restaurant.neighborhood}</span>
                  <span className={styles.tableCity}>{restaurant.city}</span>
                </div>
              </td>
              <td>{renderStars(restaurant.rating)}</td>
              <td>{restaurant.priceRange}</td>
              <td>
                <div className={styles.tableCuisine}>
                  {restaurant.cuisine.map((type, index) => (
                    <span key={index} className={styles.tag}>{type}</span>
                  ))}
                </div>
              </td>
              <td>
                <div className={styles.tableFeatures}>
                  {restaurant.features?.slice(0, 3).map((feature, index) => (
                    <span key={index} className={styles.featureTag}>{feature}</span>
                  ))}
                  {restaurant.features?.length > 3 && (
                    <span className={styles.moreFeatures}>
                      +{restaurant.features.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td>
                <div className={styles.tableActions}>
                  <a 
                    href={`/restaurantes/${restaurant.slug}`}
                    className={styles.viewDetailsButton}
                    aria-label={`Ver detalhes de ${restaurant.name}`}
                  >
                    Ver Detalhes
                  </a>
                  <button
                    className={styles.saveButton}
                    aria-label={`Salvar ${restaurant.name}`}
                  >
                    Salvar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultsTable; 