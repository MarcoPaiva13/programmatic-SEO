import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import styles from '@/styles/Home.module.css';
import FilterBar from '@/components/filters/FilterBar';
import ViewSelector from '@/components/search/ViewSelector';
import FilterBuilder from '@/components/search/FilterBuilder';
import SavedSearches from '@/components/search/SavedSearches';
import SearchHistory from '@/components/search/SearchHistory';
import ResultsMap from '@/components/search/ResultsMap';
import ResultsTable from '@/components/search/ResultsTable';
import RestaurantCard from '@/components/RestaurantCard';

export async function getStaticProps() {
  // Obter todos os arquivos JSON da pasta restaurants
  const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
  const filenames = fs.readdirSync(restaurantsDirectory);
  
  // Obter dados de cada restaurante
  const restaurants = filenames.map(filename => {
    const filePath = path.join(restaurantsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  });
  
  // Ordenar por avaliação (melhor primeiro)
  restaurants.sort((a, b) => b.rating - a.rating);
  
  return {
    props: {
      restaurants
    },
    // Revalidar a cada 24 horas
    revalidate: 86400
  };
}

export default function Home({ restaurants }) {
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [currentView, setCurrentView] = useState('grid');
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  
  // Carregar buscas salvas, histórico e favoritos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedSearches');
    const history = localStorage.getItem('searchHistory');
    const favs = localStorage.getItem('favoriteRestaurants');
    
    if (saved) {
      setSavedSearches(JSON.parse(saved));
    }
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
    if (favs) {
      setFavorites(JSON.parse(favs));
    }
  }, []);
  
  // Função para renderizar estrelas
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('★');
      } else if (i - 0.5 <= rating) {
        stars.push('½');
      } else {
        stars.push('☆');
      }
    }
    return stars.join(' ');
  };
  
  // Função para salvar busca
  const handleSaveSearch = (search) => {
    const newSearch = {
      id: Date.now(),
      name: search.name,
      filters: search.filters,
      createdAt: new Date().toISOString()
    };

    const updatedSearches = [...savedSearches, newSearch];
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
  };
  
  // Função para carregar busca salva
  const handleLoadSearch = (search) => {
    setIsLoading(true);
    // Aplicar filtros da busca salva
    setFilteredRestaurants(restaurants.filter(restaurant => {
      return search.filters.every(filter => {
        switch (filter.type) {
          case 'cuisine':
            return restaurant.cuisine.includes(filter.value);
          case 'price':
            return restaurant.priceRange === filter.value;
          case 'rating':
            return restaurant.rating >= parseFloat(filter.value);
          case 'location':
            return restaurant.neighborhood === filter.value;
          case 'features':
            return restaurant.features.includes(filter.value);
          default:
            return true;
        }
      });
    }));
    setIsLoading(false);
  };
  
  // Função para excluir busca salva
  const handleDeleteSearch = (searchId) => {
    const updatedSearches = savedSearches.filter(search => search.id !== searchId);
    setSavedSearches(updatedSearches);
    localStorage.setItem('savedSearches', JSON.stringify(updatedSearches));
  };
  
  // Função para adicionar ao histórico
  const addToHistory = (search) => {
    const newHistory = [
      {
        id: Date.now(),
        term: search.term,
        filters: search.filters,
        timestamp: new Date().toISOString()
      },
      ...searchHistory.filter(item => 
        item.term !== search.term || 
        JSON.stringify(item.filters) !== JSON.stringify(search.filters)
      )
    ].slice(0, 10); // Manter apenas as 10 buscas mais recentes

    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };
  
  // Função para limpar histórico
  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };
  
  // Função para repetir busca do histórico
  const handleRepeatSearch = (search) => {
    setIsLoading(true);
    // Aplicar filtros da busca histórica
    setFilteredRestaurants(restaurants.filter(restaurant => {
      return search.filters.every(filter => {
        switch (filter.type) {
          case 'cuisine':
            return restaurant.cuisine.includes(filter.value);
          case 'price':
            return restaurant.priceRange === filter.value;
          case 'rating':
            return restaurant.rating >= parseFloat(filter.value);
          case 'location':
            return restaurant.neighborhood === filter.value;
          case 'features':
            return restaurant.features.includes(filter.value);
          default:
            return true;
        }
      });
    }));
    setIsLoading(false);
  };
  
  // Função para selecionar restaurante
  const handleRestaurantSelect = (restaurant) => {
    // Implementar navegação para a página do restaurante
    console.log('Restaurante selecionado:', restaurant);
  };
  
  // Função para lidar com favoritos
  const handleToggleFavorite = (restaurantId) => {
    const newFavorites = favorites.includes(restaurantId)
      ? favorites.filter(id => id !== restaurantId)
      : [...favorites, restaurantId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteRestaurants', JSON.stringify(newFavorites));
  };
  
  // Função para compartilhar restaurante
  const handleShareRestaurant = async (restaurant) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Conheça ${restaurant.name} - ${restaurant.cuisine.join(', ')} em ${restaurant.city}`,
          url: `${window.location.origin}/restaurantes/${restaurant.slug}`
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para navegadores que não suportam Web Share API
      const shareUrl = `${window.location.origin}/restaurantes/${restaurant.slug}`;
      alert(`Link para compartilhar: ${shareUrl}`);
    }
  };
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Guia de Restaurantes</title>
        <meta name="description" content="Descubra os melhores restaurantes em cada cidade do Brasil. Guia completo com avaliações, especialidades e informações úteis." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        <h1>Guia de Restaurantes</h1>
        <p>Descubra os melhores restaurantes para sua experiência gastronômica</p>
      </header>
      
      <main className={styles.main}>
        <div className={styles.searchLayout}>
          <aside className={styles.filterPanel}>
            <FilterBuilder onFilterChange={setFilteredRestaurants} />
            <SavedSearches
              savedSearches={savedSearches}
              onLoadSearch={handleLoadSearch}
              onDeleteSearch={handleDeleteSearch}
            />
            <SearchHistory
              searchHistory={searchHistory}
              onRepeatSearch={handleRepeatSearch}
              onClearHistory={handleClearHistory}
            />
          </aside>

          <section className={styles.resultsArea}>
            <div className={styles.resultsHeader}>
              <h2>
                {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? 's' : ''} encontrado{filteredRestaurants.length !== 1 ? 's' : ''}
              </h2>
              <ViewSelector
                currentView={currentView}
                onViewChange={setCurrentView}
              />
            </div>

            {isLoading ? (
              <div className={styles.loading}>
                Carregando resultados...
              </div>
            ) : filteredRestaurants.length === 0 ? (
              <div className={styles.noResults}>
                <p>Nenhum restaurante encontrado com os filtros selecionados.</p>
                <button
                  className={styles.clearFilters}
                  onClick={() => setFilteredRestaurants(restaurants)}
                >
                  Limpar Filtros
                </button>
              </div>
            ) : (
              <>
                {currentView === 'grid' && (
                  <div className={styles.restaurantGrid}>
                    {filteredRestaurants.map(restaurant => (
                      <RestaurantCard
                        key={restaurant.id}
                        restaurant={restaurant}
                        isFavorite={favorites.includes(restaurant.id)}
                        onFavoriteToggle={() => handleToggleFavorite(restaurant.id)}
                        onShare={() => handleShareRestaurant(restaurant)}
                        variant="standard"
                        imageType="EXTERIOR"
                        maxFeatures={3}
                      />
                    ))}
                  </div>
                )}

                {currentView === 'table' && (
                  <ResultsTable
                    restaurants={filteredRestaurants}
                    onRestaurantSelect={handleRestaurantSelect}
                  />
                )}

                {currentView === 'map' && (
                  <ResultsMap
                    restaurants={filteredRestaurants}
                    onRestaurantSelect={handleRestaurantSelect}
                  />
                )}
              </>
            )}
          </section>
        </div>
      </main>
      
      <footer>
        <p>© 2025 Guia de Restaurantes - Todos os direitos reservados</p>
      </footer>
    </div>
  );
} 