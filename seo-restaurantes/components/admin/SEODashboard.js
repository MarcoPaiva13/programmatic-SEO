import { useState, useEffect } from 'react';
import styles from '@/styles/SEODashboard.module.css';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Dashboard para métricas de SEO e performance
 * Conecta-se a Search Console, Analytics e Web Vitals
 */
const SEODashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchConsoleData, setSearchConsoleData] = useState(null);
  const [webVitalsData, setWebVitalsData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [conversionData, setConversionData] = useState(null);
  const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d
  
  // Buscar dados quando o componente montar ou o período mudar
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // Buscar dados do Search Console
        const scResponse = await fetch(`/api/analytics/search-console?period=${dateRange}`);
        const scData = await scResponse.json();
        setSearchConsoleData(scData);
        
        // Buscar dados de Web Vitals
        const wvResponse = await fetch(`/api/analytics/web-vitals?period=${dateRange}`);
        const wvData = await wvResponse.json();
        setWebVitalsData(wvData);
        
        // Buscar dados de tráfego
        const trafficResponse = await fetch(`/api/analytics/traffic?period=${dateRange}`);
        const trafficData = await trafficResponse.json();
        setTrafficData(trafficData);
        
        // Buscar dados de conversão
        const conversionResponse = await fetch(`/api/analytics/conversions?period=${dateRange}`);
        const conversionData = await conversionResponse.json();
        setConversionData(conversionData);
      } catch (error) {
        console.error('Erro ao buscar dados de analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dateRange]);
  
  // Dados de exemplo para pré-visualização (serão substituídos por dados reais)
  const demoSearchConsoleData = {
    impressions: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Impressões',
          data: [1200, 1350, 1450, 1300, 1500, 1200, 1100],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }
      ]
    },
    clicks: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Cliques',
          data: [250, 280, 300, 290, 320, 260, 240],
          borderColor: 'rgba(54, 162, 235, 1)',
 