import { useRouter } from 'next/router';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { useCallback } from 'react';
import useSWR from 'swr';

// Importação dinâmica do template do restaurante para reduzir bundle size inicial
const RestaurantTemplate = dynamic(
  () => import('@/components/templates/RestaurantTemplate'),
  { 
    loading: () => (
      <div className="skeleton-loading">
        <div className="skeleton-header"></div>
        <div className="skeleton-content"></div>
      </div>
    ),
    ssr: true // Mantém SSR para SEO
  }
);

// Importações dinâmicas de componentes pesados que não são críticos para o SEO
const RestaurantGallery = dynamic(() => import('@/components/RestaurantGallery'), { ssr: false });
const Map = dynamic(() => import('@/components/Map'), { ssr: false });
const ReviewForm = dynamic(() => import('@/components/ReviewForm'), { ssr: false });
const ShareModal = dynamic(() => import('@/components/ShareModal'), { ssr: false });

// Fetcher para SWR
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Falha ao carregar dados');
  return res.json();
};

// Função para buscar restaurantes relacionados
async function buscarRestaurantesRelacionados(restaurantData, popularityCache) {
  // Implemente a função que identifica restaurantes relacionados
  // Esta implementação evita carregar todos os restaurantes na memória
  try {
    const response = await fetch(`/api/restaurants/related?id=${restaurantData.id}&cuisine=${restaurantData.cuisine.join(',')}&neighborhood=${restaurantData.neighborhood}&city=${restaurantData.city}`);
    if (!response.ok) throw new Error('Falha ao buscar restaurantes relacionados');
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar restaurantes relacionados:', error);
    return [];
  }
}

// Função que determina se um restaurante deve ser pré-gerado durante a build
// baseado em sua popularidade e importância para SEO
function shouldPrerender(restaurantStats) {
  // Critérios para pré-renderização:
  // 1. Restaurantes com alto tráfego (top 20%)
  // 2. Restaurantes com alta conversão
  // 3. Restaurantes com bom posicionamento em SEO
  const { pageViews, conversions, searchRanking } = restaurantStats;
  
  const isHighTraffic = pageViews > 1000; // exemplo
  const isHighConversion = conversions > 50; // exemplo
  const hasGoodSEO = searchRanking < 30; // exemplo: ranking menor que 30
  
  return isHighTraffic || isHighConversion || hasGoodSEO;
}

// Função para obter dados de um restaurante específico pelo slug
export async function getStaticProps({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'data', 'restaurants', `${slug}.json`);
  
  try {
    // Ler o arquivo do restaurante atual
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const restaurantData = JSON.parse(fileContents);
    
    // Buscar estatísticas de popularidade a partir de um arquivo de cache
    // Este arquivo seria atualizado regularmente por um job de análise
    const popularityPath = path.join(process.cwd(), 'data', 'analytics', 'popularity.json');
    let popularityData = {};
    
    try {
      const popularityContents = fs.readFileSync(popularityPath, 'utf8');
      popularityData = JSON.parse(popularityContents);
    } catch (error) {
      console.warn('Arquivo de popularidade não encontrado, usando valores padrão');
    }
    
    // Obter estatísticas para este restaurante
    const restaurantStats = popularityData[slug] || {
      pageViews: 0,
      conversions: 0,
      searchRanking: 100,
      lastUpdated: null
    };
    
    // Verificar se os dados estão atualizados
    const needsRevalidation = !restaurantStats.lastUpdated || 
      (new Date() - new Date(restaurantStats.lastUpdated) > 7 * 24 * 60 * 60 * 1000); // 7 dias
    
    // Buscar restaurantes relacionados (implementação com performance otimizada)
    // Usamos uma API que pagina os resultados em vez de carregar todos na memória
    const relatedPath = path.join(process.cwd(), 'data', 'related', `${slug}.json`);
    let relatedRestaurants = [];
    
    try {
      const relatedContents = fs.readFileSync(relatedPath, 'utf8');
      relatedRestaurants = JSON.parse(relatedContents);
    } catch (error) {
      // Se o arquivo de relacionados não existir, use a API para gerá-lo
      // Em produção, isso seria feito por um processo em background
      console.warn(`Arquivo de restaurantes relacionados para ${slug} não encontrado`);
    }
    
    // Adicionar timestamp para verificação de idade do cache
    const lastUpdated = new Date().toISOString();
    
    return {
      props: {
        restaurant: restaurantData,
        relatedRestaurants,
        restaurantStats,
        lastUpdated,
      },
      // Estratégia ISR com tempo de revalidação baseado na popularidade
      // Páginas mais populares são revalidadas com mais frequência
      revalidate: needsRevalidation || restaurantStats.pageViews > 5000 
        ? 3600 // 1 hora para páginas populares ou desatualizadas
        : restaurantStats.pageViews > 1000 
          ? 86400 // 24 horas para páginas com tráfego médio
          : 604800, // 7 dias para páginas com pouco tráfego
    };
  } catch (error) {
    console.error(`Erro ao carregar dados do restaurante ${slug}:`, error);
    return {
      notFound: true,
      // Mesmo com erro, tentar revalidar após 1 hora
      revalidate: 3600,
    };
  }
}

// Função para gerar caminhos estáticos na build
export async function getStaticPaths() {
  try {
    // Em vez de ler todos os arquivos do diretório, usamos um arquivo de
    // priorização que contém slugs ordenados por importância
    const priorityPath = path.join(process.cwd(), 'data', 'priority-restaurants.json');
    let priorityRestaurants = [];
    
    try {
      const priorityContents = fs.readFileSync(priorityPath, 'utf8');
      priorityRestaurants = JSON.parse(priorityContents);
    } catch (error) {
      console.warn('Arquivo de priorização não encontrado, usando método padrão');
      
      // Fallback para o método padrão se o arquivo de prioridade não existir
      const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
      const filenames = fs.readdirSync(restaurantsDirectory);
      
      // Limitar a quantidade para não impactar o tempo de build
      priorityRestaurants = filenames
        .slice(0, 100) // Gerar apenas os 100 principais na build
        .map(filename => ({
          slug: filename.replace(/\.json$/, ''),
          priority: 1
        }));
    }
    
    // Aplicar limites para controlar tempo de build e uso de memória
    // Páginas muito populares são pré-renderizadas, outras sob demanda
    const MAX_STATIC_PATHS = process.env.NODE_ENV === 'production' ? 200 : 20;
    
    const topRestaurantPaths = priorityRestaurants
      .slice(0, MAX_STATIC_PATHS)
      .map(({ slug }) => ({
        params: { slug }
      }));
    
    return {
      paths: topRestaurantPaths,
      // Fallback 'blocking' para melhor experiência do usuário e SEO
      // Páginas são geradas sob demanda e cacheadas para futuros visitantes
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Erro ao gerar caminhos estáticos:', error);
    
    // Em caso de erro, gere um número mínimo de páginas
    // para garantir que a build não falhe completamente
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export default function RestaurantPage({ restaurant, relatedRestaurants, restaurantStats, lastUpdated }) {
  const router = useRouter();
  const [loadTime, setLoadTime] = useState(null);
  const [webVitals, setWebVitals] = useState({});
  
  // URL para atualização em tempo real via SWR (versão ao vivo)
  // Será chamada apenas no lado do cliente
  const { data: liveData, error } = useSWR(
    () => restaurant ? `/api/restaurants/${restaurant.slug}/live` : null,
    fetcher,
    { 
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 0, // Sem revalidação automática
      dedupingInterval: 60000, // 1 minuto
      focusThrottleInterval: 60000, // 1 minuto
      errorRetryCount: 3
    }
  );
  
  // Mesclar dados em tempo real, se disponíveis
  const restaurantData = liveData ? { ...restaurant, ...liveData } : restaurant;
  
  // Rastrear visualização de página para análise
  useEffect(() => {
    if (router.isReady && restaurant && typeof window !== 'undefined') {
      // Atualizar contagem de visualizações via API
      fetch(`/api/restaurants/${restaurant.slug}/view`, { method: 'POST' })
        .catch(err => console.error('Erro ao registrar visualização:', err));
      
      // Registrar tempo até interatividade
      if (window.performance) {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'TTI') {
              console.log('Time to Interactive:', entry.startTime);
              // Enviar para analytics
            }
          });
        });
        
        observer.observe({ entryTypes: ['measure'] });
      }
    }
  }, [router.isReady, restaurant]);
  
  // Calcular tempo de carregamento para análise de performance
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      // Performance Observer para métricas de Web Vitals
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Registrar as métricas importantes
          setWebVitals(prev => ({ ...prev, [entry.name]: Math.round(entry.value) }));
          
          // Enviar para monitoramento
          if (window.gtag) {
            window.gtag('event', 'web_vital', {
              name: entry.name,
              value: Math.round(entry.value),
              event_category: 'Web Vitals',
              page: restaurant?.slug,
              non_interaction: true
            });
          }
        }
      });
      
      // Observar métricas importantes
      observer.observe({ type: 'paint', buffered: true });
      observer.observe({ type: 'layout-shift', buffered: true });
      observer.observe({ type: 'first-input', buffered: true });
      observer.observe({ type: 'longtask', buffered: true });
      
      // Calcular tempo total de carregamento
      const navEntry = performance.getEntriesByType('navigation')[0];
      if (navEntry) {
        const pageLoadTime = Math.round(navEntry.loadEventEnd - navEntry.startTime);
        setLoadTime(pageLoadTime);
        
        // Enviar métrica para monitoramento
        if (window.gtag) {
          window.gtag('event', 'timing_complete', {
            name: 'load',
            value: pageLoadTime,
            event_category: 'Page Timing',
            page: restaurant?.slug
          });
        }
      }
      
      return () => observer.disconnect();
    }
  }, [restaurant]);
  
  // Mostra um indicador de carregamento para novas páginas sendo geradas
  if (router.isFallback) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h1>Carregando...</h1>
        <p>Preparando informações do restaurante...</p>
      </div>
    );
  }
  
  // Tratamento de erro para restaurante não encontrado
  if (!restaurant) {
    return (
      <div className="error-container">
        <h1>Restaurante não encontrado</h1>
        <p>Desculpe, não encontramos as informações deste restaurante.</p>
        <button onClick={() => router.push('/')}>
          Voltar para a página inicial
        </button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${restaurantData.name} - Cardápio e Avaliações | Guia de Restaurantes`}</title>
        <meta name="description" content={`Confira o cardápio, avaliações e informações de contato do restaurante ${restaurantData.name} em ${restaurantData.neighborhood}, ${restaurantData.city}.`} />
        <meta property="og:title" content={`${restaurantData.name} - Cardápio e Avaliações`} />
        <meta property="og:description" content={`Confira o cardápio, avaliações e informações de contato do restaurante ${restaurantData.name}.`} />
        <meta property="og:type" content="restaurant.restaurant" />
        <meta property="og:url" content={`https://seo-restaurantes.vercel.app/restaurantes/${restaurantData.slug}`} />
        <meta property="og:image" content={restaurantData.image || 'https://seo-restaurantes.vercel.app/images/default-restaurant.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://seo-restaurantes.vercel.app/restaurantes/${restaurantData.slug}`} />
        
        {/* Preload de recursos críticos */}
        <link 
          rel="preload" 
          href={restaurantData.image || 'https://seo-restaurantes.vercel.app/images/default-restaurant.jpg'} 
          as="image" 
        />
        
        {/* Estruturação Rich Results para Schema.org */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": restaurantData.name,
              "image": restaurantData.image || 'https://seo-restaurantes.vercel.app/images/default-restaurant.jpg',
              "address": {
                "@type": "PostalAddress",
                "streetAddress": restaurantData.address.street,
                "addressLocality": restaurantData.city,
                "addressRegion": restaurantData.state,
                "postalCode": restaurantData.address.zipCode
              },
              "telephone": restaurantData.phone,
              "servesCuisine": restaurantData.cuisine,
              "priceRange": restaurantData.priceRange,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": restaurantData.rating,
                "reviewCount": restaurantData.reviewCount || 10
              },
              "menu": `https://seo-restaurantes.vercel.app/restaurantes/${restaurantData.slug}/menu`
            })
          }}
        />
      </Head>
      
      {/* Web Vitals e Core Analytics */}
      <Script
        id="web-vitals"
        strategy="afterInteractive"
        src="https://unpkg.com/web-vitals@3.1.0/dist/web-vitals.attribution.umd.js"
        onLoad={() => {
          // Monitorar Core Web Vitals
          window.webVitals.getCLS(metric => {
            console.log('CLS:', metric.value);
            setWebVitals(prev => ({ ...prev, CLS: metric.value }));
          });
          window.webVitals.getFID(metric => {
            console.log('FID:', metric.value);
            setWebVitals(prev => ({ ...prev, FID: metric.value }));
          });
          window.webVitals.getLCP(metric => {
            console.log('LCP:', metric.value);
            setWebVitals(prev => ({ ...prev, LCP: metric.value }));
          });
        }}
      />
      
      {/* Renderizar o template com os dados do restaurante */}
      <RestaurantTemplate 
        restaurant={restaurantData}
        relatedRestaurants={relatedRestaurants}
        lastUpdated={lastUpdated}
        loadTime={loadTime}
        webVitals={webVitals}
        stats={restaurantStats}
      />
    </>
  );
} 