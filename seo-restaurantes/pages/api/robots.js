/**
 * API para geração dinâmica do arquivo robots.txt
 * Permite configurações diferentes baseadas no ambiente
 */
export default function handler(req, res) {
  // Definir URL base do site
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://seo-restaurantes.vercel.app';
  
  // Configurar cabeçalho como texto plano
  res.setHeader('Content-Type', 'text/plain');
  
  // Gerar conteúdo do robots.txt
  const robotsTxt = `
# Arquivo robots.txt gerado dinamicamente
# Atualizado em: ${new Date().toISOString()}

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /login
Disallow: /painel
Disallow: /erro/

# Configurações para bots específicos
User-agent: GPTBot
Allow: /
Allow: /restaurantes/
Disallow: /api/
Disallow: /admin/

User-agent: Googlebot
Allow: /

User-agent: Googlebot-Image
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/server-sitemap.xml
`.trim();
  
  // Enviar resposta
  return res.status(200).send(robotsTxt);
} 