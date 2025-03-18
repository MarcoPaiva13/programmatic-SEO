// PriceFilter.js
// Componente de filtro por faixa de preço

import styles from '../../styles/Home.module.css';

const PriceFilter = ({ selectedPriceRanges, setSelectedPriceRanges }) => {
  // Opções de faixa de preço disponíveis
  const priceOptions = [
    { label: 'Econômico', value: '$', description: 'Até R$ 50 por pessoa' },
    { label: 'Moderado', value: '$$', description: 'R$ 50 a R$ 100 por pessoa' },
    { label: 'Premium', value: '$$$', description: 'Acima de R$ 100 por pessoa' }
  ];
  
  // Alternar a seleção de uma faixa de preço
  const togglePriceRange = (price) => {
    if (selectedPriceRanges.includes(price)) {
      setSelectedPriceRanges(selectedPriceRanges.filter(p => p !== price));
    } else {
      setSelectedPriceRanges([...selectedPriceRanges, price]);
    }
  };
  
  return (
    <div className={styles.filterSection}>
      <h3 id="price-heading">Faixa de Preço</h3>
      
      <div 
        className={styles.filterContent} 
        role="group" 
        aria-labelledby="price-heading"
      >
        {priceOptions.map(option => (
          <label 
            key={option.value} 
            className={`${styles.priceLabel} ${selectedPriceRanges.includes(option.value) ? styles.active : ''}`}
          >
            <input
              type="checkbox"
              checked={selectedPriceRanges.includes(option.value)}
              onChange={() => togglePriceRange(option.value)}
              aria-label={`Filtrar por preço ${option.label}`}
              className={styles.visuallyHidden}
            />
            <span className={styles.priceOption}>
              <span className={styles.priceSymbol}>{option.value}</span>
              <span className={styles.priceDescription}>{option.label}</span>
              <span className={styles.priceSub}>{option.description}</span>
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PriceFilter; 