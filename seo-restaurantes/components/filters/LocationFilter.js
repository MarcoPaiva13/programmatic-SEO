// LocationFilter.js
// Componente de filtro por localização (cidade e bairro)

import { useState } from 'react';
import styles from '../../styles/Home.module.css';

const LocationFilter = ({ 
  locations, 
  selectedCities, 
  setSelectedCities, 
  selectedNeighborhoods, 
  setSelectedNeighborhoods 
}) => {
  const [isCitiesExpanded, setCitiesExpanded] = useState(false);
  const [isNeighborhoodsExpanded, setNeighborhoodsExpanded] = useState(false);
  
  // Alternar a seleção de uma cidade
  const toggleCity = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter(c => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };
  
  // Alternar a seleção de um bairro
  const toggleNeighborhood = (neighborhood) => {
    if (selectedNeighborhoods.includes(neighborhood)) {
      setSelectedNeighborhoods(selectedNeighborhoods.filter(n => n !== neighborhood));
    } else {
      setSelectedNeighborhoods([...selectedNeighborhoods, neighborhood]);
    }
  };
  
  return (
    <div className={styles.filterSection}>
      <h3 id="location-heading">Localização</h3>
      
      {/* Filtro de cidades */}
      <div className={styles.locationGroup}>
        <h4 id="cities-heading">Cidades</h4>
        <div 
          className={styles.filterContent} 
          role="group" 
          aria-labelledby="cities-heading"
        >
          {locations.cities.slice(0, isCitiesExpanded ? locations.cities.length : 3).map(city => (
            <label 
              key={city} 
              className={styles.checkboxLabel}
            >
              <input
                type="checkbox"
                checked={selectedCities.includes(city)}
                onChange={() => toggleCity(city)}
                aria-label={`Filtrar por cidade ${city}`}
              />
              <span className={styles.checkboxText}>{city}</span>
              {selectedCities.includes(city) && (
                <span className={styles.activeIndicator} aria-hidden="true"></span>
              )}
            </label>
          ))}
          
          {locations.cities.length > 3 && (
            <button 
              className={styles.expandButton}
              onClick={() => setCitiesExpanded(!isCitiesExpanded)}
              aria-expanded={isCitiesExpanded}
            >
              {isCitiesExpanded ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>
      </div>
      
      {/* Filtro de bairros */}
      <div className={styles.locationGroup}>
        <h4 id="neighborhoods-heading">Bairros</h4>
        <div 
          className={styles.filterContent} 
          role="group" 
          aria-labelledby="neighborhoods-heading"
        >
          {locations.neighborhoods.slice(0, isNeighborhoodsExpanded ? locations.neighborhoods.length : 5).map(neighborhood => (
            <label 
              key={neighborhood} 
              className={styles.checkboxLabel}
            >
              <input
                type="checkbox"
                checked={selectedNeighborhoods.includes(neighborhood)}
                onChange={() => toggleNeighborhood(neighborhood)}
                aria-label={`Filtrar por bairro ${neighborhood}`}
              />
              <span className={styles.checkboxText}>{neighborhood}</span>
              {selectedNeighborhoods.includes(neighborhood) && (
                <span className={styles.activeIndicator} aria-hidden="true"></span>
              )}
            </label>
          ))}
          
          {locations.neighborhoods.length > 5 && (
            <button 
              className={styles.expandButton}
              onClick={() => setNeighborhoodsExpanded(!isNeighborhoodsExpanded)}
              aria-expanded={isNeighborhoodsExpanded}
            >
              {isNeighborhoodsExpanded ? 'Ver menos' : 'Ver mais'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationFilter; 