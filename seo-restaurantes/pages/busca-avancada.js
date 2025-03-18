// busca-avancada.js
// Página de busca avançada do Guia de Restaurantes

import { useReducer, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import fs from 'fs';
import path from 'path';
import styles from '../styles/Home.module.css';
import AdvancedSearchBar from '../components/search/AdvancedSearchBar';
import FilterBuilder from '../components/search/FilterBuilder';
import ViewSelector from '../components/search/ViewSelector';
import ResultsList from '../components/search/ResultsList';
import ResultsMap from '../components/search/ResultsMap';
import ResultsTable from '../components/search/ResultsTable';
import SavedSearches from '../components/search/SavedSearches';
import SearchHistory from '../components/search/SearchHistory';
import { searchReducer, initialState } from '../reducers/searchReducer';

export async function getServerSideProps() {
  // Carregar dados dos restaurantes
  const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
  const filenames = fs.readdirSync(restaurantsDirectory);
  const restaurants = filenames.map(filename => {
    const filePath = path.join(restaurantsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  });

  return {
    props: {
      restaurants
    }
  };
}

export default function AdvancedSearch({ restaurants }) {
  const router = useRouter();
  const [state, dispatch] = useReducer(searchReducer, initialState);
  const [viewMode, setViewMode] = useState('list');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Carregar busca salva do localStorage ao iniciar
  useEffect(() => {
    const savedSearch = localStorage.getItem('lastAdvancedSearch');
    if (savedSearch) {
      dispatch({ type: 'LOAD_SAVED_SEARCH', payload: JSON.parse(savedSearch) });
    }
  }, []);

  // Sincronizar estado com URL
  useEffect(() => {
    if (router.isReady) {
      const { query } = router;
      if (query.search) {
        dispatch({ type: 'LOAD_FROM_URL', payload: query });
      }
    }
  }, [router.isReady, router.query]);

  // Atualizar URL quando a busca mudar
  useEffect(() => {
    const searchParams = new URLSearchParams();
    if (state.searchTerm) searchParams.set('search', state.searchTerm);
    if (state.filters.length > 0) searchParams.set('filters', JSON.stringify(state.filters));
    if (state.sortBy) searchParams.set('sort', state.sortBy);
    
    const newUrl = searchParams.toString() 
      ? `${router.pathname}?${searchParams.toString()}`
      : router.pathname;
      
    router.push(newUrl, undefined, { shallow: true });
  }, [state, router]);

  // Salvar busca no localStorage
  useEffect(() => {
    localStorage.setItem('lastAdvancedSearch', JSON.stringify(state));
  }, [state]);

  // Aplicar filtros e ordenação
  useEffect(() => {
    setIsLoading(true);
    
    // Simular delay de processamento
    setTimeout(() => {
      let filteredResults = [...restaurants];
      
      // Aplicar filtros
      if (state.filters.length > 0) {
        filteredResults = filteredResults.filter(restaurant => {
          return state.filters.every(filter => {
            switch (filter.type) {
              case 'cuisine':
                return restaurant.cuisine.includes(filter.value);
              case 'price':
                return restaurant.priceRange === filter.value;
              case 'rating':
                return restaurant.rating >= filter.value;
              case 'location':
                return restaurant.city === filter.value || 
                       restaurant.neighborhood === filter.value;
              case 'features':
                return restaurant.features?.includes(filter.value);
              case 'dietary':
                return restaurant.dietaryRestrictions?.includes(filter.value);
              case 'time':
                return restaurant.openingHours?.includes(filter.value);
              default:
                return true;
            }
          });
        });
      }
      
      // Aplicar ordenação
      if (state.sortBy) {
        filteredResults.sort((a, b) => {
          switch (state.sortBy) {
            case 'rating':
              return b.rating - a.rating;
            case 'price':
              return a.priceRange.length - b.priceRange.length;
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });
      }
      
      setResults(filteredResults);
      setIsLoading(false);
    }, 300);
  }, [state.filters, state.sortBy, restaurants]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Busca Avançada - Guia de Restaurantes</title>
        <meta 
          name="description" 
          content="Busca avançada de restaurantes com filtros por culinária, preço, localização e mais." 
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>Busca Avançada</h1>
        <p>Encontre o restaurante perfeito com filtros detalhados</p>
      </header>

      <main>
        <div className={styles.searchLayout}>
          {/* Painel de filtros */}
          <aside className={styles.filterPanel}>
            <FilterBuilder 
              state={state}
              dispatch={dispatch}
            />
            
            <SavedSearches 
              onLoadSearch={(search) => dispatch({ type: 'LOAD_SAVED_SEARCH', payload: search })}
            />
            
            <SearchHistory 
              onSelectSearch={(search) => dispatch({ type: 'LOAD_FROM_URL', payload: search })}
            />
          </aside>

          {/* Área de resultados */}
          <section className={styles.resultsArea}>
            <div className={styles.resultsHeader}>
              <AdvancedSearchBar 
                value={state.searchTerm}
                onChange={(value) => dispatch({ type: 'SET_SEARCH_TERM', payload: value })}
              />
              
              <ViewSelector 
                currentView={viewMode}
                onChange={setViewMode}
              />
            </div>

            {isLoading ? (
              <div className={styles.loading}>Processando sua busca...</div>
            ) : (
              <>
                {results.length > 0 ? (
                  <>
                    <div className={styles.resultsCount}>
                      {results.length} restaurantes encontrados
                    </div>

                    {viewMode === 'list' && (
                      <ResultsList results={results} />
                    )}

                    {viewMode === 'map' && (
                      <ResultsMap results={results} />
                    )}

                    {viewMode === 'table' && (
                      <ResultsTable results={results} />
                    )}
                  </>
                ) : (
                  <div className={styles.noResults}>
                    <h2>Nenhum restaurante encontrado</h2>
                    <p>Tente ajustar seus filtros ou fazer uma busca diferente.</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
} 