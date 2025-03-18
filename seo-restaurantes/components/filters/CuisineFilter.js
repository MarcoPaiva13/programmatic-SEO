// CuisineFilter.js
// Componente de filtro por tipo de culinária

import { useState } from 'react';
import styles from '../../styles/Home.module.css';

const CuisineFilter = ({ cuisineTypes, selectedCuisines, setSelectedCuisines }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Alternar a seleção de um tipo de culinária
  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter(c => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };
  
  return (
    <div className={styles.filterSection}>
      <h3 id="cuisine-heading">Tipo de Culinária</h3>
      
      <div 
        className={styles.filterContent} 
        role="group" 
        aria-labelledby="cuisine-heading"
      >
        {cuisineTypes.slice(0, isExpanded ? cuisineTypes.length : 5).map(cuisine => (
          <label 
            key={cuisine} 
            className={styles.checkboxLabel}
          >
            <input
              type="checkbox"
              checked={selectedCuisines.includes(cuisine)}
              onChange={() => toggleCuisine(cuisine)}
              aria-label={`Filtrar por culinária ${cuisine}`}
            />
            <span className={styles.checkboxText}>{cuisine}</span>
            {selectedCuisines.includes(cuisine) && (
              <span className={styles.activeIndicator} aria-hidden="true"></span>
            )}
          </label>
        ))}
        
        {cuisineTypes.length > 5 && (
          <button 
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Ver menos' : 'Ver mais'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CuisineFilter; 