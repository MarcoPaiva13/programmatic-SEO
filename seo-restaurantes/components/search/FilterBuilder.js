// FilterBuilder.js
// Componente para construir consultas complexas visualmente

import { useState } from 'react';
import styles from '@/styles/Home.module.css';

const FilterBuilder = ({ onFilterChange }) => {
  const [logicalOperator, setLogicalOperator] = useState('AND');
  const [filters, setFilters] = useState([]);

  // Tipos de filtros disponíveis
  const filterTypes = [
    { id: 'cuisine', label: 'Tipo de Cozinha' },
    { id: 'price', label: 'Faixa de Preço' },
    { id: 'rating', label: 'Avaliação Mínima' },
    { id: 'location', label: 'Localização' },
    { id: 'features', label: 'Recursos' }
  ];

  // Opções para cada tipo de filtro
  const filterOptions = {
    cuisine: [
      { value: 'italian', label: 'Italiana' },
      { value: 'japanese', label: 'Japonesa' },
      { value: 'brazilian', label: 'Brasileira' },
      { value: 'chinese', label: 'Chinesa' },
      { value: 'mexican', label: 'Mexicana' }
    ],
    price: [
      { value: 'low', label: 'Econômico' },
      { value: 'medium', label: 'Moderado' },
      { value: 'high', label: 'Premium' }
    ],
    rating: [
      { value: '4', label: '4+ Estrelas' },
      { value: '3', label: '3+ Estrelas' },
      { value: '2', label: '2+ Estrelas' }
    ],
    location: [
      { value: 'downtown', label: 'Centro' },
      { value: 'suburbs', label: 'Subúrbios' },
      { value: 'beach', label: 'Praia' }
    ],
    features: [
      { value: 'delivery', label: 'Delivery' },
      { value: 'parking', label: 'Estacionamento' },
      { value: 'wifi', label: 'Wi-Fi' },
      { value: 'outdoor', label: 'Área Externa' }
    ]
  };

  // Adicionar novo filtro
  const addFilter = () => {
    setFilters([
      ...filters,
      {
        id: Date.now(),
        type: '',
        value: '',
        operator: 'equals'
      }
    ]);
  };

  // Remover filtro
  const removeFilter = (filterId) => {
    setFilters(filters.filter(f => f.id !== filterId));
  };

  // Atualizar filtro
  const updateFilter = (filterId, field, value) => {
    setFilters(filters.map(f => 
      f.id === filterId ? { ...f, [field]: value } : f
    ));
  };

  // Aplicar filtros
  const applyFilters = () => {
    const validFilters = filters.filter(f => f.type && f.value);
    onFilterChange({
      operator: logicalOperator,
      filters: validFilters
    });
  };

  return (
    <div className={styles.filterBuilder}>
      <div className={styles.logicalOperator}>
        <label htmlFor="logicalOperator">Operador Lógico:</label>
        <select
          id="logicalOperator"
          value={logicalOperator}
          onChange={(e) => setLogicalOperator(e.target.value)}
        >
          <option value="AND">E (AND)</option>
          <option value="OR">Ou (OR)</option>
        </select>
      </div>

      <div className={styles.filtersList}>
        {filters.map(filter => (
          <div key={filter.id} className={styles.filterItem}>
            <div className={styles.filterTypeSelector}>
              <select
                value={filter.type}
                onChange={(e) => updateFilter(filter.id, 'type', e.target.value)}
              >
                <option value="">Selecione o tipo de filtro</option>
                {filterTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {filter.type && (
              <div className={styles.filterOptions}>
                {filterOptions[filter.type].map(option => (
                  <button
                    key={option.value}
                    className={`${styles.filterOption} ${
                      filter.value === option.value ? styles.active : ''
                    }`}
                    onClick={() => updateFilter(filter.id, 'value', option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}

            <button
              className={styles.removeFilter}
              onClick={() => removeFilter(filter.id)}
              aria-label="Remover filtro"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.filterActions}>
        <button
          className={styles.addFilterButton}
          onClick={addFilter}
        >
          Adicionar Filtro
        </button>
        <button
          className={styles.applyFiltersButton}
          onClick={applyFilters}
          disabled={filters.length === 0}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default FilterBuilder; 