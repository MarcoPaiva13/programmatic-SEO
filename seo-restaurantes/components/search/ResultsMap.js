// ResultsMap.js
// Componente para visualização dos resultados em mapa

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/styles/Home.module.css';

// Importação dinâmica do Leaflet para evitar erros de SSR
const Map = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
  ssr: false,
});

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
  ssr: false,
});

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
  ssr: false,
});

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
  ssr: false,
});

const ResultsMap = ({ restaurants, onRestaurantSelect }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef(null);

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

  // Função para calcular o centro do mapa
  const getMapCenter = () => {
    if (restaurants.length === 0) return [-23.5505, -46.6333]; // São Paulo

    const lat = restaurants.reduce((sum, r) => sum + r.latitude, 0) / restaurants.length;
    const lng = restaurants.reduce((sum, r) => sum + r.longitude, 0) / restaurants.length;

    return [lat, lng];
  };

  // Função para calcular o zoom do mapa
  const getMapZoom = () => {
    if (restaurants.length === 0) return 12;
    if (restaurants.length === 1) return 15;
    return 13;
  };

  // Efeito para atualizar o mapa quando os restaurantes mudarem
  useEffect(() => {
    if (mapRef.current && restaurants.length > 0) {
      const map = mapRef.current;
      const bounds = restaurants.map(r => [r.latitude, r.longitude]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [restaurants]);

  return (
    <div className={styles.mapContainer}>
      {isLoading && (
        <div className={styles.mapLoading}>
          Carregando mapa...
        </div>
      )}

      <Map
        ref={mapRef}
        center={getMapCenter()}
        zoom={getMapZoom()}
        className={styles.map}
        onLoad={() => setIsLoading(false)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {restaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            position={[restaurant.latitude, restaurant.longitude]}
            eventHandlers={{
              click: () => {
                setSelectedRestaurant(restaurant);
                onRestaurantSelect?.(restaurant);
              }
            }}
          >
            <Popup>
              <div className={styles.mapPopup}>
                <h3>{restaurant.name}</h3>
                <p>{restaurant.address}</p>
                <p>{restaurant.neighborhood}, {restaurant.city}</p>
                <p className={styles.mapRating}>
                  {renderStars(restaurant.rating)}
                </p>
                <p className={styles.mapPrice}>
                  {restaurant.priceRange}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </Map>

      {selectedRestaurant && (
        <div className={styles.mapInfoWindow}>
          <div className={styles.mapInfoHeader}>
            <h3>{selectedRestaurant.name}</h3>
            <button
              className={styles.closeInfoWindow}
              onClick={() => setSelectedRestaurant(null)}
              aria-label="Fechar informações do restaurante"
            >
              ×
            </button>
          </div>
          <div className={styles.mapInfoContent}>
            <p>{selectedRestaurant.address}</p>
            <p>{selectedRestaurant.neighborhood}, {selectedRestaurant.city}</p>
            <p className={styles.mapRating}>
              {renderStars(selectedRestaurant.rating)}
            </p>
            <p className={styles.mapPrice}>
              {selectedRestaurant.priceRange}
            </p>
            <div className={styles.mapCuisine}>
              {selectedRestaurant.cuisine.map(type => (
                <span key={type} className={styles.mapCuisineTag}>
                  {type}
                </span>
              ))}
            </div>
            <button
              className={styles.viewDetailsButton}
              onClick={() => onRestaurantSelect?.(selectedRestaurant)}
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsMap; 