import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { ErrorBoundary } from 'react-error-boundary';
import { useRouter } from 'next/router';
import { Geist, Geist_Mono } from 'next/font/google';

// Importar estilos globais
import '@/styles/globals.css';
import 'nprogress/nprogress.css';

// Importar componentes de analytics e privacidade
import ConsentBanner from '@/components/ConsentBanner';
import PreferencesModal from '@/components/PreferencesModal';

// Importar utilitários de monitoramento e analytics
import { 
  reportWebVitals, 
  initErrorTracking,
  initializeProgressIndicator
} from '@/lib/monitoring';

import {
  initGA4,
  updateConsent,
  reportWebVitals as reportWebVitalsToGA4,
  trackPageView,
  initHeatmap
} from '@/lib/analytics';

// Configurar fontes Geist
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Componente de fallback para erros
function ErrorFallback({ error }) {
  return (
    <div className="error-container">
      <h1>Algo deu errado</h1>
      <p>Desculpe, ocorreu um erro ao carregar esta página.</p>
      <p>Erro: {error.message}</p>
      <button onClick={() => window.location.reload()}>
        Tentar novamente
      </button>
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);
  
  // Verificar consentimento e inicializar funcionalidades com base nas preferências
  const initAnalyticsBasedOnConsent = () => {
    try {
      const consentGiven = localStorage.getItem('cookieConsent');
      let preferences = {
        essential: true,
        analytics: false,
        marketing: false,
        personalization: false,
        thirdParty: false
      };
      
      if (consentGiven === 'accepted') {
        // Se aceitou todos os cookies, habilitar tudo
        preferences = {
          essential: true,
          analytics: true,
          marketing: true,
          personalization: true,
          thirdParty: true
        };
      } else if (consentGiven === 'customized') {
        // Se personalizou, usar preferências salvas
        const savedPrefs = localStorage.getItem('cookiePreferences');
        if (savedPrefs) {
          preferences = JSON.parse(savedPrefs);
        }
      }
      
      // Atualizar consentimento no GA4
      updateConsent(preferences);
      
      // Inicializar recursos com base nas preferências
      if (preferences.analytics) {
        // Inicializar rastreamento de web vitals
        reportWebVitalsToGA4();
        
        // Rastrear visualização de página
        const currentPath = window.location.pathname;
        trackPageView(currentPath);
      }
      
      if (preferences.personalization) {
        // Inicializar heatmap para análise de comportamento
        initHeatmap();
      }
      
      setAnalyticsInitialized(true);
    } catch (error) {
      console.error('Erro ao inicializar analytics:', error);
    }
  };
  
  // Lidar com a aceitação de cookies
  const handleAcceptCookies = () => {
    initAnalyticsBasedOnConsent();
  };
  
  // Lidar com a rejeição de cookies
  const handleRejectCookies = () => {
    // Não há necessidade de ação específica, pois o padrão é não rastrear
  };
  
  // Lidar com as preferências personalizadas
  const handlePreferencesToggle = () => {
    setShowPreferencesModal(prev => !prev);
  };
  
  // Lidar com salvar preferências
  const handleSavePreferences = (preferences) => {
    updateConsent(preferences);
    
    if (!analyticsInitialized && preferences.analytics) {
      initAnalyticsBasedOnConsent();
    }
  };
  
  // Inicializar Google Analytics 4
  useEffect(() => {
    // Inicializar GA4 com consentimento negado por padrão
    // O consentimento será atualizado posteriormente, se aprovado
    initGA4();
  }, []);
  
  // Inicializar monitoramento e analytics quando o componente montar
  useEffect(() => {
    // Inicializar monitoramento de erros
    initErrorTracking();
    
    // Inicializar indicador de progresso
    initializeProgressIndicator();
    
    // Verificar consentimento para inicializar analytics
    if (typeof window !== 'undefined') {
      initAnalyticsBasedOnConsent();
    }
    
    // Rastreamento de mudança de páginas
    const handleRouteChange = (url) => {
      // Verificar consentimento antes de rastrear
      const consentGiven = localStorage.getItem('cookieConsent');
      const analyticsAllowed = consentGiven === 'accepted' || 
        (consentGiven === 'customized' && 
          JSON.parse(localStorage.getItem('cookiePreferences') || '{}').analytics);
      
      if (analyticsAllowed) {
        trackPageView(url);
      }
    };
    
    router.events.on('routeChangeComplete', handleRouteChange);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#f8f9fa" />
        <link rel="icon" href="/favicon.ico" />
        <link 
          rel="preconnect" 
          href="https://images.unsplash.com" 
          crossOrigin="anonymous" 
        />
      </Head>
      
      {/* Google Analytics 4 Script - Carregamento otimizado */}
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      
      {/* Script para Web Vitals - Carregamento otimizado */}
      <Script
        id="web-vitals"
        strategy="afterInteractive"
        src="https://unpkg.com/web-vitals/dist/web-vitals.iife.js"
      />
      
      {/* Configuração global de SEO */}
      <DefaultSeo
        defaultTitle="Guia de Restaurantes | Encontre os melhores restaurantes"
        titleTemplate="%s | Guia de Restaurantes"
        description="Encontre os melhores restaurantes, confira avaliações, cardápios e faça reservas online."
        openGraph={{
          type: 'website',
          locale: 'pt_BR',
          url: 'https://seo-restaurantes.vercel.app/',
          site_name: 'Guia de Restaurantes',
          images: [
            {
              url: 'https://seo-restaurantes.vercel.app/og-image.jpg',
              width: 1200,
              height: 630,
              alt: 'Guia de Restaurantes',
            },
          ],
        }}
        twitter={{
          handle: '@guiarestaurantes',
          site: '@guiarestaurantes',
          cardType: 'summary_large_image',
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
          {
            rel: 'manifest',
            href: '/manifest.json',
          },
        ]}
      />
      
      {/* Componente principal com tratamento de erros */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <main className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <Component {...pageProps} />
        </main>
      </ErrorBoundary>
      
      {/* Integrações com Vercel para analytics e performance */}
      <Analytics debug={false} />
      <SpeedInsights />
      
      {/* Banner de consentimento de cookies */}
      <ConsentBanner 
        onAccept={handleAcceptCookies}
        onReject={handleRejectCookies}
        onPreferences={handlePreferencesToggle}
      />
      
      {/* Modal de preferências de privacidade */}
      <PreferencesModal 
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSave={handleSavePreferences}
      />
    </>
  );
}

// Configuração para monitoramento de Web Vitals
export function reportWebVitals(metric) {
  // Esta função será chamada automaticamente pelo Next.js
  // Apenas reportar se consentimento foi dado
  if (typeof window !== 'undefined') {
    try {
      const consentGiven = localStorage.getItem('cookieConsent');
      const analyticsAllowed = consentGiven === 'accepted' || 
        (consentGiven === 'customized' && 
          JSON.parse(localStorage.getItem('cookiePreferences') || '{}').analytics);
      
      if (analyticsAllowed && window.gtag) {
        window.gtag('event', 'web_vitals', {
          metric_name: metric.name,
          metric_value: metric.value,
          metric_delta: metric.delta,
          metric_id: metric.id,
        });
      }
    } catch (error) {
      console.error('Erro ao reportar web vitals:', error);
    }
  }
}

export default MyApp; 