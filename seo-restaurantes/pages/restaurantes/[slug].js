import { useRouter } from 'next/router';
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import RestaurantTemplate from '@/components/templates/RestaurantTemplate';
import { useState, useEffect } from 'react';
import Script from 'next/script';

// Função para buscar restaurantes relacionados
function buscarRestaurantesRelacionados(restaurantData, todosRestaurantes) {
  return todosRestaurantes
    .filter(restaurant => {
      // Excluir o restaurante atual
      if (restaurant.id === restaurantData.id) return false;
      
      // Verificar se compartilha a mesma cozinha
      const mesmaCozinha = restaurant.cuisine.some(cuisine => 
        restaurantData.cuisine.includes(cuisine)
      );
      
      // Verificar se está no mesmo bairro
      const mesmoBairro = restaurant.neighborhood === restaurantData.neighborhood;
      
      // Verificar se está na mesma cidade
      const mesmaCidade = restaurant.city === restaurantData.city;
      
      // Retornar true se compartilhar cozinha OU estiver no mesmo bairro/cidade
      return mesmaCozinha || (mesmoBairro && mesmaCidade);
    })
    .map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      cuisine: restaurant.cuisine,
      neighborhood: restaurant.neighborhood,
      city: restaurant.city,
      rating: restaurant.rating
    }))
    .slice(0, 3); // Limitar a 3 restaurantes relacionados
}

// Função para obter dados de um restaurante específico pelo slug
export async function getStaticProps({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'data', 'restaurants', `${slug}.json`);
  
  try {
    // Ler o arquivo do restaurante atual
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const restaurantData = JSON.parse(fileContents);
    
    // Ler todos os restaurantes para buscar relacionados
    const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
    const filenames = fs.readdirSync(restaurantsDirectory);
    
    const todosRestaurantes = filenames.map(filename => {
      const filePath = path.join(restaurantsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents);
    });
    
    // Buscar restaurantes relacionados
    const relatedRestaurants = buscarRestaurantesRelacionados(restaurantData, todosRestaurantes);
    
    // Adicionar timestamp para verificação de idade do cache
    const lastUpdated = new Date().toISOString();
    
    return {
      props: {
        restaurant: restaurantData,
        relatedRestaurants,
        lastUpdated,
      },
      // Estratégia ISR com revalidação a cada 24 horas (86400 segundos)
      // Ou será revalidada sob demanda via API
      revalidate: 86400,
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
  const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
  const filenames = fs.readdirSync(restaurantsDirectory);
  
  // Priorizar os restaurantes mais populares/acessados para geração na build
  // Isso pode ser implementado ordenando os filenames por algum critério
  // Por exemplo, restaurantes com maior rating
  
  // Para facilitar a build em produção, limitamos a quantidade inicial
  // Os demais serão gerados sob demanda (ISR)
  const topRestaurantPaths = filenames
    .slice(0, 100) // Gerar apenas os 100 principais na build
    .map(filename => ({
      params: {
        slug: filename.replace(/\.json$/, ''),
      },
    }));
  
  return {
    paths: topRestaurantPaths,
    // Fallback 'blocking' para melhor experiência do usuário e SEO
    // Páginas são geradas sob demanda e cacheadas para futuros visitantes
    fallback: 'blocking',
  };
}

export default function RestaurantPage({ restaurant, relatedRestaurants, lastUpdated }) {
  const router = useRouter();
  const [loadTime, setLoadTime] = useState(null);
  
  // Calcular tempo de carregamento para análise de performance
  useEffect(() => {
    if (typeof window !== 'undefined' && window.performance) {
      const perf = window.performance.getEntriesByType('navigation')[0];
      const pageLoadTime = Math.round(perf.loadEventEnd - perf.startTime);
      setLoadTime(pageLoadTime);
      
      // Enviar métrica para monitoramento (exemplo usando analytics)
      if (window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: 'load',
          value: pageLoadTime,
          event_category: 'Page Timing',
        });
      }
    }
  }, []);
  
  // Mostra um indicador de carregamento para novas páginas sendo geradas
  if (router.isFallback) {
    return (
      <div className="loading">
        <h1>Carregando...</h1>
        <p>Preparando informações do restaurante...</p>
      </div>
    );
  }
  
  // Tratamento de erro para restaurante não encontrado
  if (!restaurant) {
    return (
      <div className="error">
        <h1>Restaurante não encontrado</h1>
        <p>Desculpe, não encontramos as informações deste restaurante.</p>
        <a href="/">Voltar para a página inicial</a>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{`${restaurant.name} - Cardápio e Avaliações | Guia de Restaurantes`}</title>
        <meta name="description" content={`Confira o cardápio, avaliações e informações de contato do restaurante ${restaurant.name} em ${restaurant.neighborhood}, ${restaurant.city}.`} />
        <meta property="og:title" content={`${restaurant.name} - Cardápio e Avaliações`} />
        <meta property="og:description" content={`Confira o cardápio, avaliações e informações de contato do restaurante ${restaurant.name}.`} />
        <meta property="og:type" content="restaurant.restaurant" />
        <meta property="og:url" content={`https://seo-restaurantes.vercel.app/restaurantes/${restaurant.slug}`} />
        <meta property="og:image" content={restaurant.image || 'https://seo-restaurantes.vercel.app/images/default-restaurant.jpg'} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href={`https://seo-restaurantes.vercel.app/restaurantes/${restaurant.slug}`} />
        
        {/* Estruturação Rich Results para Schema.org */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Restaurant",
              "name": restaurant.name,
              "image": restaurant.image || 'https://seo-restaurantes.vercel.app/images/default-restaurant.jpg',
              "address": {
                "@type": "PostalAddress",
                "streetAddress": restaurant.address,
                "addressLocality": restaurant.city,
                "addressRegion": restaurant.state,
                "postalCode": restaurant.zipCode
              },
              "telephone": restaurant.phone,
              "servesCuisine": restaurant.cuisine,
              "priceRange": restaurant.priceRange,
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": restaurant.rating,
                "reviewCount": restaurant.reviewCount || 10
              },
              "menu": `https://seo-restaurantes.vercel.app/restaurantes/${restaurant.slug}/menu`
            })
          }}
        />
      </Head>
      
      {/* Web Vitals e Core Analytics */}
      <Script
        id="web-vitals"
        strategy="afterInteractive"
        src="https://unpkg.com/web-vitals/dist/web-vitals.iife.js"
        onLoad={() => {
          // Monitorar Core Web Vitals
          window.webVitals.getCLS(metric => console.log('CLS:', metric.value));
          window.webVitals.getFID(metric => console.log('FID:', metric.value));
          window.webVitals.getLCP(metric => console.log('LCP:', metric.value));
        }}
      />
      
      {/* Renderizar o template com os dados do restaurante */}
      <RestaurantTemplate 
        restaurant={restaurant}
        relatedRestaurants={relatedRestaurants}
        lastUpdated={lastUpdated}
        loadTime={loadTime}
      />
    </>
  );
} 