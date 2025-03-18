// RatingFilter.js
// Componente de filtro por avaliação mínima com slider

import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';

const RatingFilter = ({ minRating, setMinRating }) => {
  // Estado local para o valor do slider durante o arrasto
  const [sliderValue, setSliderValue] = useState(minRating);
  
  // Atualizar o valor do slider quando o minRating muda (por exemplo, ao limpar filtros)
  useEffect(() => {
    setSliderValue(minRating);
  }, [minRating]);
  
  // Lidar com a mudança do slider
  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setSliderValue(value);
  };
  
  // Aplicar o filtro apenas quando o usuário para de arrastar o slider
  const handleSliderRelease = () => {
    setMinRating(sliderValue);
  };
  
  // Renderizar estrelas para o valor atual
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className={styles.star} aria-hidden="true">★</span>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<span key={i} className={styles.star} aria-hidden="true">★</span>);
      } else {
        stars.push(<span key={i} className={styles.emptyStar} aria-hidden="true">☆</span>);
      }
    }
    
    return stars;
  };
  
  return (
    <div className={styles.filterSection}>
      <h3 id="rating-heading">Avaliação</h3>
      
      <div className={styles.sliderContainer}>
        <div className={styles.sliderLabels}>
          <span>0</span>
          <span>5</span>
        </div>
        
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={sliderValue}
          onChange={handleSliderChange}
          onMouseUp={handleSliderRelease}
          onTouchEnd={handleSliderRelease}
          className={styles.slider}
          aria-labelledby="rating-heading"
          aria-valuemin="0"
          aria-valuemax="5"
          aria-valuenow={sliderValue}
          aria-valuetext={`${sliderValue} estrelas ou mais`}
        />
        
        <div className={styles.currentRating}>
          <span className={styles.ratingValue}>{sliderValue}</span>
          <div className={styles.starRating}>
            {renderStars(sliderValue)}
          </div>
          <span className={styles.ratingLabel}>ou mais</span>
        </div>
      </div>
    </div>
  );
};

export default RatingFilter; 