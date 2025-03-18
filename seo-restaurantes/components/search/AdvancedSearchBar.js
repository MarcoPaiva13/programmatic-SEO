// AdvancedSearchBar.js
// Componente para entrada de texto na busca avançada

import { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './AdvancedSearchBar.module.css';

const AdvancedSearchBar = ({ value, onChange, onSearch }) => {
  const [inputValue, setInputValue] = useState(value || '');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue.trim());
    }
  };
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  
  const handleClear = () => {
    setInputValue('');
    if (onChange) {
      onChange('');
    }
  };
  
  return (
    <form className={styles.searchBar} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Busque por nome, culinária, bairro..."
        value={inputValue}
        onChange={handleChange}
        className={styles.searchInput}
        aria-label="Campo de busca avançada"
      />
      
      {inputValue && (
        <button 
          type="button" 
          className={styles.clearButton}
          onClick={handleClear}
          aria-label="Limpar busca"
        >
          ×
        </button>
      )}
      
      <button 
        type="submit" 
        className={styles.searchButton}
        aria-label="Buscar"
      >
        Buscar
      </button>
    </form>
  );
};

AdvancedSearchBar.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func
};

AdvancedSearchBar.defaultProps = {
  value: '',
  onChange: null,
  onSearch: null
};

export default AdvancedSearchBar; 