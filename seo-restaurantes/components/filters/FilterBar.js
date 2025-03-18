// FilterBar.js
// Componente principal que agrega todos os filtros para o guia de restaurantes

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/Home.module.css';
import CuisineFilter from './CuisineFilter';
import LocationFilter from './LocationFilter';
import PriceFilter from './PriceFilter';
import RatingFilter from './RatingFilter';
import SearchBar from './SearchBar';
import SortOptions from './SortOptions';

const FilterBar = ({ restaurants, onFilterChange }) => {
  const router = useRouter();
  
  // Estados para os diferentes filtros
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [locations, setLocations] = useState({ cities: [], neighborhoods: [] });
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('relevance');
  
  // Obter dados para os filtros a partir dos restaurantes disponíveis
  useEffect(() => {
    if (restaurants && restaurants.length > 0) {
      // Extrair tipos de culinária únicos
      const cuisines = [...new Set(restaurants.flatMap(r => r.cuisine))];
      setCuisineTypes(cuisines.sort());
      
      // Extrair cidades e bairros únicos
      const cities = [...new Set(restaurants.map(r => r.city))];
      const neighborhoods = [...new Set(restaurants.map(r => r.neighborhood))];
      setLocations({
        cities: cities.sort(),
        neighborhoods: neighborhoods.sort()
      });
    }
  }, [restaurants]);
  
  // Sincronizar filtros com os parâmetros da URL
  useEffect(() => {
    const { query } = router;
    
    // Restaurar filtros dos parâmetros da URL, se existirem
    if (query.cuisines) setSelectedCuisines(query.cuisines.split(','));
    if (query.cities) setSelectedCities(query.cities.split(','));
    if (query.neighborhoods) setSelectedNeighborhoods(query.neighborhoods.split(','));
    if (query.price) setSelectedPriceRanges(query.price.split(','));
    if (query.rating) setMinRating(parseFloat(query.rating));
    if (query.search) setSearchTerm(query.search);
    if (query.sort) setSortOption(query.sort);
    
  }, [router.isReady, router.query]);
  
  // Atualizar URL quando os filtros mudam
  const updateUrlParams = () => {
    const query = {};
    
    if (selectedCuisines.length > 0) query.cuisines = selectedCuisines.join(',');
    if (selectedCities.length > 0) query.cities = selectedCities.join(',');
    if (selectedNeighborhoods.length > 0) query.neighborhoods = selectedNeighborhoods.join(',');
    if (selectedPriceRanges.length > 0) query.price = selectedPriceRanges.join(',');
    if (minRating > 0) query.rating = minRating.toString();
    if (searchTerm) query.search = searchTerm;
    if (sortOption !== 'relevance') query.sort = sortOption;
    
    router.push(
      {
        pathname: router.pathname,
        query: query
      },
      undefined,
      { shallow: true }
    );
  };
  
  // Aplicar filtros aos restaurantes
  useEffect(() => {
    // Evitar executar antes que os dados iniciais sejam carregados
    if (!cuisineTypes.length) return;
    
    // Filtrar restaurantes com base nos critérios selecionados
    let filteredRestaurants = [...restaurants];
    
    // Filtro por termo de busca
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.name.toLowerCase().includes(searchLower) || 
        r.cuisine.some(c => c.toLowerCase().includes(searchLower)) ||
        r.neighborhood.toLowerCase().includes(searchLower) ||
        r.city.toLowerCase().includes(searchLower)
      );
    }
    
    // Filtro por tipo de culinária
    if (selectedCuisines.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.cuisine.some(c => selectedCuisines.includes(c))
      );
    }
    
    // Filtro por cidade
    if (selectedCities.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        selectedCities.includes(r.city)
      );
    }
    
    // Filtro por bairro
    if (selectedNeighborhoods.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        selectedNeighborhoods.includes(r.neighborhood)
      );
    }
    
    // Filtro por faixa de preço
    if (selectedPriceRanges.length > 0) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        selectedPriceRanges.includes(r.priceRange)
      );
    }
    
    // Filtro por avaliação mínima
    if (minRating > 0) {
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.rating >= minRating
      );
    }
    
    // Ordenação
    switch (sortOption) {
      case 'rating':
        filteredRestaurants.sort((a, b) => b.rating - a.rating);
        break;
      case 'priceAsc':
        filteredRestaurants.sort((a, b) => {
          const priceToNumber = price => price.length;
          return priceToNumber(a.priceRange) - priceToNumber(b.priceRange);
        });
        break;
      case 'priceDesc':
        filteredRestaurants.sort((a, b) => {
          const priceToNumber = price => price.length;
          return priceToNumber(b.priceRange) - priceToNumber(a.priceRange);
        });
        break;
      // A ordenação por proximidade requer geolocalização, que seria implementada aqui
      default:
        // Por padrão, mantem a ordenação por relevância
        break;
    }
    
    // Informar ao componente pai sobre a mudança nos filtros
    onFilterChange(filteredRestaurants);
    
    // Atualizar URL com os parâmetros de filtro
    updateUrlParams();
    
  }, [
    selectedCuisines, 
    selectedCities, 
    selectedNeighborhoods, 
    selectedPriceRanges, 
    minRating, 
    searchTerm, 
    sortOption,
    cuisineTypes.length // Garante que só execute após os dados serem carregados
  ]);
  
  // Limpar todos os filtros
  const clearAllFilters = () => {
    setSelectedCuisines([]);
    setSelectedCities([]);
    setSelectedNeighborhoods([]);
    setSelectedPriceRanges([]);
    setMinRating(0);
    setSearchTerm('');
    setSortOption('relevance');
  };
  
  // Verificar se há algum filtro ativo
  const hasActiveFilters = () => {
    return (
      selectedCuisines.length > 0 ||
      selectedCities.length > 0 ||
      selectedNeighborhoods.length > 0 ||
      selectedPriceRanges.length > 0 ||
      minRating > 0 ||
      searchTerm !== '' ||
      sortOption !== 'relevance'
    );
  };
  
  return (
    <div className={styles.filters} aria-label="Filtros de busca">
      <h2>Filtros e Busca</h2>
      
      <SearchBar 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        restaurants={restaurants} 
      />
      
      <div className={styles.filterGroup}>
        <CuisineFilter 
          cuisineTypes={cuisineTypes} 
          selectedCuisines={selectedCuisines} 
          setSelectedCuisines={setSelectedCuisines} 
        />
        
        <LocationFilter 
          locations={locations} 
          selectedCities={selectedCities} 
          setSelectedCities={setSelectedCities} 
          selectedNeighborhoods={selectedNeighborhoods} 
          setSelectedNeighborhoods={setSelectedNeighborhoods} 
        />
        
        <PriceFilter 
          selectedPriceRanges={selectedPriceRanges} 
          setSelectedPriceRanges={setSelectedPriceRanges} 
        />
        
        <RatingFilter 
          minRating={minRating} 
          setMinRating={setMinRating} 
        />
      </div>
      
      <div className={styles.filtersBottom}>
        <SortOptions 
          sortOption={sortOption} 
          setSortOption={setSortOption} 
        />
        
        {hasActiveFilters() && (
          <button 
            className={styles.clearFilters} 
            onClick={clearAllFilters}
            aria-label="Limpar todos os filtros"
          >
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
};

export default FilterBar; 