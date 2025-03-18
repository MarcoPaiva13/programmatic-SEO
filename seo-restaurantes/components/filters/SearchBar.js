// SearchBar.js
// Componente de barra de busca com sugestões automáticas

import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Home.module.css';

const SearchBar = ({ searchTerm, setSearchTerm, restaurants }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm);
  const searchInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  
  // Atualizar o valor do input quando o searchTerm muda (por exemplo, ao limpar filtros)
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);
  
  // Gerar sugestões quando o usuário digita
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length >= 2) {
      // Coletar sugestões baseadas no nome, culinária, cidade e bairro
      const matchedSuggestions = new Set();
      
      // Sugestões de nomes de restaurantes
      restaurants.forEach(restaurant => {
        if (restaurant.name.toLowerCase().includes(value.toLowerCase())) {
          matchedSuggestions.add(restaurant.name);
        }
        
        // Sugestões de tipos de culinária
        restaurant.cuisine.forEach(cuisine => {
          if (cuisine.toLowerCase().includes(value.toLowerCase())) {
            matchedSuggestions.add(cuisine);
          }
        });
        
        // Sugestões de cidades e bairros
        if (restaurant.city.toLowerCase().includes(value.toLowerCase())) {
          matchedSuggestions.add(restaurant.city);
        }
        
        if (restaurant.neighborhood.toLowerCase().includes(value.toLowerCase())) {
          matchedSuggestions.add(`${restaurant.neighborhood}, ${restaurant.city}`);
        }
      });
      
      // Limitar a 5 sugestões e ordenar alfabeticamente
      setSuggestions(Array.from(matchedSuggestions).sort().slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };
  
  // Aplicar o termo de busca quando o usuário pressiona Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchTerm(inputValue);
      setSuggestions([]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
      searchInputRef.current.blur();
    }
  };
  
  // Aplicar o termo de busca quando o usuário clica no botão de busca
  const handleSearchClick = () => {
    setSearchTerm(inputValue);
    setSuggestions([]);
  };
  
  // Selecionar uma sugestão
  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion);
    setSearchTerm(suggestion);
    setSuggestions([]);
    searchInputRef.current.focus();
  };
  
  // Fechar sugestões quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        !searchInputRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <input
          ref={searchInputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder="Buscar restaurantes, culinária ou localização..."
          className={styles.searchInput}
          aria-label="Buscar restaurantes"
          aria-autocomplete="list"
          aria-controls={suggestions.length > 0 ? "search-suggestions" : undefined}
          aria-expanded={suggestions.length > 0}
        />
        
        <button 
          className={styles.searchButton} 
          onClick={handleSearchClick}
          aria-label="Buscar"
        >
          Buscar
        </button>
        
        {suggestions.length > 0 && isFocused && (
          <ul 
            id="search-suggestions"
            ref={suggestionsRef}
            className={styles.suggestions}
            role="listbox"
          >
            {suggestions.map((suggestion, index) => (
              <li 
                key={index}
                role="option"
                aria-selected={false}
                className={styles.suggestionItem}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 