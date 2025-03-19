import { useEffect, useRef } from 'react';
import styles from '@/styles/Home.module.css';

/**
 * Componente de mapa para exibir a localização do restaurante
 * @param {Object} props - Propriedades do componente
 * @param {number} props.latitude - Latitude da localização do restaurante
 * @param {number} props.longitude - Longitude da localização do restaurante
 * @param {string} props.restaurantName - Nome do restaurante para exibição
 * @param {number} props.zoom - Nível de zoom do mapa (opcional, padrão: 15)
 */
const Map = ({ latitude, longitude, restaurantName, zoom = 15 }) => {
  const mapRef = useRef(null);
  
  useEffect(() => {
    // Verificar se estamos no navegador e se as props necessárias foram fornecidas
    if (typeof window !== 'undefined' && latitude && longitude) {
      // Se o Leaflet estiver disponível, inicializar um mapa real
      if (window.L) {
        // Verificar se já existe um mapa neste elemento
        if (mapRef.current._leaflet_id) return;
        
        // Inicializar o mapa
        const map = window.L.map(mapRef.current).setView([latitude, longitude], zoom);
        
        // Adicionar camada de tiles (OpenStreetMap)
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        }).addTo(map);
        
        // Adicionar marcador
        window.L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup(restaurantName)
          .openPopup();
      }
    }
    
    // Cleanup function para remover o mapa quando o componente for desmontado
    return () => {
      if (mapRef.current && mapRef.current._leaflet_id) {
        mapRef.current._leaflet = null;
      }
    };
  }, [latitude, longitude, restaurantName, zoom]);
  
  // Renderizar um placeholder se as coordenadas não forem fornecidas
  if (!latitude || !longitude) {
    return (
      <div className={styles.mapPlaceholder}>
        <p>Localização não disponível</p>
      </div>
    );
  }
  
  return (
    <div 
      ref={mapRef} 
      className={styles.mapContainer} 
      style={{ 
        height: '300px', 
        width: '100%',
        backgroundColor: '#e5e5e5',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666'
      }}
    >
      {!window?.L && (
        <div>
          <p>Mapa: {restaurantName}</p>
          <p>Latitude: {latitude}, Longitude: {longitude}</p>
        </div>
      )}
    </div>
  );
};

export default Map; 