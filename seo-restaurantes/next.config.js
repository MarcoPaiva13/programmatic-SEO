const path = require('path');
const withBundleAnalyzer = process.env.ANALYZE === 'true' 
  ? require('@next/bundle-analyzer')({enabled: true}) 
  : (config) => config;

module.exports = withBundleAnalyzer({
  reactStrictMode: true,
  
  // Configuração de imagens
  images: {
    domains: ['images.unsplash.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60, // Cache em segundos
  },
  
  // Configurações de ISR para otimização de regeneração
  experimental: {
    // Habilitar cache entre builds
    isrMemoryCacheSize: 50, // Aumenta o número de páginas em cache durante o build
    // Otimização para páginas estáticas
    optimizeCss: true,
    scrollRestoration: true,
  },
  
  // Compressão e otimização
  compress: true,
  
  // Configuração do webpack
  webpack: (config, { dev, isServer }) => {
    // Aliases para facilitar importações
    config.resolve.alias['@'] = path.join(__dirname);
    
    // Otimização de SVGs
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Otimização de imagens e assets
    config.module.rules.push({
      test: /\.(png|jpg|gif)$/i,
      type: 'asset/resource',
    });
    
    // Otimizações apenas para produção
    if (!dev && !isServer) {
      // Substitui importações React por otimizadas em produção
      Object.assign(config.resolve.alias, {
        'react/jsx-runtime': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }
    
    return config;
  },
  
  // Otimização de bundle
  swcMinify: true,
  
  // Configuração para performance e otimização
  productionBrowserSourceMaps: false, // Desabilita source maps em produção
  
  // Configurar headers para cabeçalhos de cache e segurança
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        // Cache de assets estáticos
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache de imagens
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
  
  // Configuração de redirects
  async redirects() {
    return [
      {
        source: '/restaurante/:path*',
        destination: '/restaurantes/:path*',
        permanent: true,
      },
    ];
  },
  
  // Permite que os URLs sejam limpos para SEO
  trailingSlash: false,
}); 