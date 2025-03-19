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
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        }
      ]
    },
    ctr: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'CTR (%)',
          data: [2.1, 2.3, 2.4, 2.2, 2.5, 2.1, 2.0],
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          fill: true,
        }
      ]
    },
    position: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'Posição Média',
          data: [12.3, 11.8, 11.5, 11.9, 11.2, 12.0, 12.1],
          borderColor: 'rgba(153, 102, 255, 1)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          fill: true,
        }
      ]
    }
  };
  
  const demoWebVitalsData = {
    lcp: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'LCP (s)',
          data: [2.8, 2.7, 2.5, 2.6, 2.4, 2.7, 2.8],
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        }
      ]
    },
    fid: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'FID (ms)',
          data: [120, 115, 110, 118, 105, 115, 120],
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: true,
        }
      ]
    },
    cls: {
      labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
      datasets: [
        {
          label: 'CLS',
          data: [0.15, 0.14, 0.12, 0.13, 0.11, 0.14, 0.15],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        }
      ]
    }
  };
  
  const demoTrafficData = {
    sources: {
      labels: ['Busca Orgânica', 'Direto', 'Referência', 'Social', 'Email', 'Pago'],
      datasets: [
        {
          label: 'Fontes de Tráfego',
          data: [45, 25, 10, 8, 7, 5],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }
      ]
    }
  };
  
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };
  
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Dashboard de SEO</h1>
        <div className={styles.controls}>
          <select value={dateRange} onChange={handleDateRangeChange} className={styles.dateRangeSelector}>
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
          </select>
        </div>
      </header>
      
      {isLoading ? (
        <div className={styles.loading}>Carregando dados...</div>
      ) : (
        <div className={styles.dashboardContent}>
          <section className={styles.metricsSection}>
            <h2>Métricas do Search Console</h2>
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3>Impressões</h3>
                <Line 
                  data={searchConsoleData?.impressions || demoSearchConsoleData.impressions} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
              <div className={styles.chartCard}>
                <h3>Cliques</h3>
                <Line 
                  data={searchConsoleData?.clicks || demoSearchConsoleData.clicks} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
              <div className={styles.chartCard}>
                <h3>CTR</h3>
                <Line 
                  data={searchConsoleData?.ctr || demoSearchConsoleData.ctr} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
              <div className={styles.chartCard}>
                <h3>Posição Média</h3>
                <Line 
                  data={searchConsoleData?.position || demoSearchConsoleData.position} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </section>
          
          <section className={styles.metricsSection}>
            <h2>Web Vitals</h2>
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3>Largest Contentful Paint</h3>
                <Line 
                  data={webVitalsData?.lcp || demoWebVitalsData.lcp} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
              <div className={styles.chartCard}>
                <h3>First Input Delay</h3>
                <Line 
                  data={webVitalsData?.fid || demoWebVitalsData.fid} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
              <div className={styles.chartCard}>
                <h3>Cumulative Layout Shift</h3>
                <Line 
                  data={webVitalsData?.cls || demoWebVitalsData.cls} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </section>
          
          <section className={styles.metricsSection}>
            <h2>Tráfego</h2>
            <div className={styles.chartsGrid}>
              <div className={styles.chartCard}>
                <h3>Fontes de Tráfego</h3>
                <Doughnut 
                  data={trafficData?.sources || demoTrafficData.sources} 
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default SEODashboard;
 