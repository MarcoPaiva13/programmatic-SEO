// pages/admin/web-vitals-dashboard.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useSWR from 'swr';
import styles from '@/styles/WebVitalsDashboard.module.css';

// Componentes do dashboard
import MetricCard from '@/components/dashboard/MetricCard';
import TimelineChart from '@/components/dashboard/TimelineChart';
import PageComparisonChart from '@/components/dashboard/PageComparisonChart';
import GaugeChart from '@/components/dashboard/GaugeChart';
import WorstPagesTable from '@/components/dashboard/WorstPagesTable';
import AlertsConfigModal from '@/components/dashboard/AlertsConfigModal';

// Funções utilitárias
import { 
  formatMetricValue, 
  getMetricRating, 
  convertToCSV, 
  downloadFile,
  prepareTimelineData,
  preparePageComparisonData,
  prepareWorstPerformingPagesData
} from '@/utils/dashboardUtils';

// Função para buscar dados da API
const fetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao buscar dados');
  }
  return response.json();
};

/**
 * Página do Dashboard de Web Vitals
 */
const WebVitalsDashboard = () => {
  const router = useRouter();
  const { token, page, start, end, period } = router.query;
  
  // Estados para controle da interface
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('LCP');
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
    period: '7d'
  });
  const [customThresholds, setCustomThresholds] = useState(null);
  
  // Parâmetros para a API
  const apiParams = new URLSearchParams();
  if (dateRange.start) apiParams.append('start', dateRange.start);
  if (dateRange.end) apiParams.append('end', dateRange.end);
  if (page) apiParams.append('page', page);
  
  // Buscar dados com SWR
  const { data, error, isValidating, mutate } = useSWR(
    `/api/vitals/summary?${apiParams.toString()}`, 
    fetcher,
    { 
      refreshInterval: 5 * 60 * 1000, // Revalidar a cada 5 minutos
      revalidateOnFocus: false
    }
  );
  
  // Verificar token de autenticação
  useEffect(() => {
    // Simples autenticação por token na URL
    // Simulado para este exercício
    const adminToken = 'admin123'; // Em produção, use algo mais seguro
    
    if (token === adminToken) {
      setIsAuthenticated(true);
    } else if (typeof window !== 'undefined') {
      // Verificar se token foi salvo anteriormente
      const savedToken = localStorage.getItem('vitals_dashboard_token');
      if (savedToken === adminToken) {
        setIsAuthenticated(true);
      }
    }
  }, [token]);
  
  // Atualizar parâmetros de data com base na URL
  useEffect(() => {
    if (period) {
      handlePeriodChange(period);
    } else if (start && end) {
      setDateRange({
        start,
        end,
        period: 'custom'
      });
    } else if (!start && !end && !period) {
      // Padrão: últimos 7 dias
      handlePeriodChange('7d');
    }
  }, [start, end, period]);
  
  // Carregar limiares personalizados
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('customVitalsThresholds');
        if (saved) {
          setCustomThresholds(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Erro ao carregar limiares personalizados:', error);
      }
    }
  }, []);
  
  // Função para fazer login com token
  const handleLogin = (e) => {
    e.preventDefault();
    const inputToken = document.getElementById('token').value;
    
    // Simples autenticação por token
    if (inputToken === 'admin123') {
      localStorage.setItem('vitals_dashboard_token', inputToken);
      router.push(`/admin/web-vitals-dashboard?token=${inputToken}`);
    } else {
      alert('Token inválido. Tente novamente.');
    }
  };
  
  // Função para exportar dados
  const handleExportData = () => {
    if (!data) return;
    
    // Criar dados para CSV
    const exportData = [];
    
    // Adicionar métricas por página
    if (data.metrics && data.metrics.byPage) {
      Object.keys(data.metrics.byPage).forEach(pagePath => {
        const metrics = data.metrics.byPage[pagePath];
        Object.keys(metrics).forEach(metricKey => {
          const metric = metrics[metricKey];
          exportData.push({
            page: pagePath,
            metric: metricKey,
            average: metric.average,
            rating: metric.rating,
            count: metric.count,
            timestamp: new Date().toISOString()
          });
        });
      });
    }
    
    // Converter para CSV e fazer download
    const csv = convertToCSV(exportData);
    const fileName = `web-vitals-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(csv, fileName);
  };
  
  // Função para mudar o período de visualização
  const handlePeriodChange = (periodValue) => {
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    
    switch (periodValue) {
      case '7d': // 7 dias
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d': // 30 dias
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d': // 90 dias
        startDate.setDate(now.getDate() - 90);
        break;
      case 'custom':
        // Manter datas atuais, atualizado pelo datepicker
        return;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    setDateRange({
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      period: periodValue
    });
    
    // Atualizar URL
    const query = { ...router.query, period: periodValue };
    delete query.start;
    delete query.end;
    router.push({
      pathname: router.pathname,
      query
    }, undefined, { shallow: true });
  };
  
  // Função para mudar datas personalizadas
  const handleDateChange = (type, value) => {
    setDateRange(prev => ({
      ...prev,
      [type]: value,
      period: 'custom'
    }));
    
    // Atualizar URL
    router.push({
      pathname: router.pathname,
      query: {
        ...router.query,
        [type]: value,
        period: 'custom'
      }
    }, undefined, { shallow: true });
  };
  
  // Função para filtrar por página específica
  const handlePageFilterChange = (e) => {
    const selectedPage = e.target.value;
    
    if (selectedPage === 'all') {
      // Remover filtro de página
      const query = { ...router.query };
      delete query.page;
      router.push({
        pathname: router.pathname,
        query
      }, undefined, { shallow: true });
    } else {
      // Aplicar filtro de página
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          page: selectedPage
        }
      }, undefined, { shallow: true });
    }
  };
  
  // Função para salvar configurações de alertas
  const handleSaveAlerts = (newThresholds) => {
    setCustomThresholds(newThresholds);
    setShowAlertsModal(false);
    
    // Recarregar dados para aplicar novos limiares
    mutate();
  };
  
  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return (
      <div className={styles.authContainer}>
        <Head>
          <title>Login - Dashboard de Web Vitals</title>
        </Head>
        
        <h1 className={styles.authTitle}>
          Dashboard de Web Vitals
        </h1>
        
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Token de Acesso:
            </label>
            <input
              id="token"
              type="password"
              className={styles.formInput}
              placeholder="Digite o token de acesso"
              required
            />
          </div>
          
          <button type="submit" className={styles.authButton}>
            Acessar Dashboard
          </button>
        </form>
      </div>
    );
  }
  
  // Preparar dados para os componentes
  let averageMetrics = data?.metrics?.averages || {};
  let pageMetrics = data?.metrics?.byPage || {};
  let allPages = Object.keys(pageMetrics).map(path => ({ path, label: path }));
  
  // Preparar dados para gráfico de tendências
  const timelineData = prepareTimelineData(
    data?.rawMetrics || [], 
    selectedMetric
  );
  
  // Preparar dados para gráfico de comparação entre páginas
  const pageComparisonData = preparePageComparisonData(
    pageMetrics,
    selectedMetric
  );
  
  // Preparar dados para tabela de páginas com pior desempenho
  const worstPagesData = prepareWorstPerformingPagesData(pageMetrics);

  return (
    <div className={styles.container}>
      <Head>
        <title>Dashboard de Web Vitals</title>
        <meta name="description" content="Monitoramento de métricas Core Web Vitals" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard de Core Web Vitals</h1>
        
        <div className={styles.filters}>
          {/* Seletor de período */}
          <select
            className={styles.select}
            value={dateRange.period}
            onChange={(e) => handlePeriodChange(e.target.value)}
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="custom">Período personalizado</option>
          </select>
          
          {/* Seleção de datas personalizadas */}
          {dateRange.period === 'custom' && (
            <>
              <input
                type="date"
                className={styles.datePicker}
                value={dateRange.start || ''}
                onChange={(e) => handleDateChange('start', e.target.value)}
              />
              <span>até</span>
              <input
                type="date"
                className={styles.datePicker}
                value={dateRange.end || ''}
                onChange={(e) => handleDateChange('end', e.target.value)}
              />
            </>
          )}
          
          {/* Filtro por página */}
          <select
            className={styles.select}
            value={page || 'all'}
            onChange={handlePageFilterChange}
          >
            <option value="all">Todas as páginas</option>
            {allPages.map((page, index) => (
              <option key={index} value={page.path}>
                {page.label.length > 30 ? page.label.substring(0, 30) + '...' : page.label}
              </option>
            ))}
          </select>
          
          {/* Botões de ação */}
          <button
            className={styles.exportButton}
            onClick={handleExportData}
            disabled={!data}
          >
            Exportar CSV
          </button>
          
          <button
            className={styles.alertsButton}
            onClick={() => setShowAlertsModal(true)}
          >
            Configurar Alertas
          </button>
        </div>
      </header>
      
      {/* Mensagem de erro */}
      {error && (
        <div className={styles.error}>
          <p>Erro ao carregar dados: {error.message}</p>
          <button onClick={() => mutate()}>Tentar novamente</button>
        </div>
      )}
      
      {/* Indicador de carregamento */}
      {isValidating && !data && (
        <div className={styles.loading}>
          <p>Carregando dados...</p>
        </div>
      )}
      
      {/* Métricas principais (visão geral) */}
      <section className={styles.overview}>
        <MetricCard
          title="LCP"
          value={averageMetrics.LCP?.average}
          metricName="LCP"
          rating={averageMetrics.LCP?.rating || 'unknown'}
        />
        
        <MetricCard
          title="FID"
          value={averageMetrics.FID?.average}
          metricName="FID"
          rating={averageMetrics.FID?.rating || 'unknown'}
        />
        
        <MetricCard
          title="CLS"
          value={averageMetrics.CLS?.average}
          metricName="CLS"
          rating={averageMetrics.CLS?.rating || 'unknown'}
        />
        
        <MetricCard
          title="FCP"
          value={averageMetrics.FCP?.average}
          metricName="FCP"
          rating={averageMetrics.FCP?.rating || 'unknown'}
        />
        
        <MetricCard
          title="TTFB"
          value={averageMetrics.TTFB?.average}
          metricName="TTFB"
          rating={averageMetrics.TTFB?.rating || 'unknown'}
        />
      </section>
      
      {/* Gauges para métricas principais */}
      <section className={styles.chartCard}>
        <h2 className={styles.chartTitle}>Visão Geral de Métricas</h2>
        
        <div className={styles.gaugeContainer}>
          <GaugeChart
            value={averageMetrics.LCP?.average}
            metricName="LCP"
            rating={averageMetrics.LCP?.rating || 'unknown'}
          />
          
          <GaugeChart
            value={averageMetrics.FID?.average}
            metricName="FID"
            rating={averageMetrics.FID?.rating || 'unknown'}
          />
          
          <GaugeChart
            value={averageMetrics.CLS?.average}
            metricName="CLS"
            rating={averageMetrics.CLS?.rating || 'unknown'}
          />
        </div>
      </section>
      
      {/* Seção de gráficos (tendências e comparação) */}
      <section className={styles.chartsGrid}>
        {/* Gráfico de tendências temporais */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            Tendência de {selectedMetric} ao longo do tempo
            
            <select
              className={styles.select}
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              style={{ marginLeft: '1rem', width: 'auto' }}
            >
              <option value="LCP">LCP</option>
              <option value="FID">FID</option>
              <option value="CLS">CLS</option>
              <option value="FCP">FCP</option>
              <option value="TTFB">TTFB</option>
            </select>
          </h2>
          
          <TimelineChart 
            data={timelineData} 
            metricName={selectedMetric} 
          />
        </div>
        
        {/* Gráfico de comparação entre páginas */}
        <div className={styles.chartCard}>
          <h2 className={styles.chartTitle}>
            Comparação entre páginas ({selectedMetric})
          </h2>
          
          <PageComparisonChart 
            data={pageComparisonData}
            metricName={selectedMetric}
          />
        </div>
      </section>
      
      {/* Tabela de páginas com pior desempenho */}
      <section className={styles.tableCard}>
        <h2 className={styles.chartTitle}>
          Páginas com Pior Desempenho
        </h2>
        
        <WorstPagesTable data={worstPagesData} />
      </section>
      
      {/* Modal de configuração de alertas */}
      <AlertsConfigModal
        isOpen={showAlertsModal}
        onClose={() => setShowAlertsModal(false)}
        onSave={handleSaveAlerts}
      />
    </div>
  );
};

export default WebVitalsDashboard; 