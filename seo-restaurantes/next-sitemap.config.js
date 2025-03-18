/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://seo-restaurantes.vercel.app',
  generateRobotsTxt: true,
  sitemapSize: 7000, // Limitar tamanho para facilitar processamento
  exclude: [
    '/404',
    '/500',
    '/server-sitemap.xml', // Excluir sitemap dinâmico
    '/api/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/*',
          '/admin/*',
          '/login',
          '/painel',
        ],
      },
      {
        userAgent: 'GPTBot',
        allow: [
          '/',
          '/restaurantes/*',
        ],
        disallow: [
          '/api/*',
          '/admin/*',
        ]
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_APP_URL || 'https://seo-restaurantes.vercel.app'}/server-sitemap.xml`,
    ],
  },
  transform: async (config, path) => {
    // Configuração de prioridade baseada no tipo da página
    let priority = 0.7;
    let changefreq = 'weekly';
    
    if (path === '/') {
      // Página inicial com maior prioridade
      priority = 1.0;
      changefreq = 'daily';
    } else if (path.startsWith('/restaurantes/')) {
      // Páginas de restaurantes com prioridade média-alta
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.startsWith('/categorias/')) {
      // Páginas de categorias com prioridade média
      priority = 0.7;
      changefreq = 'weekly';
    } else if (path.startsWith('/busca')) {
      // Páginas de busca com prioridade mais baixa
      priority = 0.5;
      changefreq = 'weekly';
    }
    
    // Adicionar lastmod dinâmico (data atual para simplificar)
    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: [],
    };
  },
}; 