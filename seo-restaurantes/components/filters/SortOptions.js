// SortOptions.js
// Componente para opções de ordenação de resultados

import styles from '../../styles/Home.module.css';

const SortOptions = ({ sortOption, setSortOption }) => {
  // Opções de ordenação disponíveis
  const sortOptions = [
    { value: 'relevance', label: 'Relevância' },
    { value: 'rating', label: 'Melhor Avaliação' },
    { value: 'priceAsc', label: 'Preço: Menor para Maior' },
    { value: 'priceDesc', label: 'Preço: Maior para Menor' },
    { value: 'proximity', label: 'Proximidade' }
  ];
  
  // Atualizar a opção de ordenação selecionada
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  return (
    <div className={styles.sortContainer}>
      <label htmlFor="sort-select" className={styles.sortLabel}>
        Ordenar por:
      </label>
      <select
        id="sort-select"
        value={sortOption}
        onChange={handleSortChange}
        className={styles.sortSelect}
        aria-label="Ordenar resultados"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortOptions; 