// pages/api/sitemap.xml.js
// Gerador dinâmico de sitemap XML para indexação em buscadores

import fs from 'fs';
import path from 'path';

// Função para definir prioridade com base na avaliação do restaurante
const calcularPrioridade = (rating) => {
  if (rating >= 4.5) return 0.9;
  if (rating >= 4.0) return 0.8;
  if (rating >= 3.5) return 0.7;
  return 0.6;
};

// Função para gerar a data da última modificação (hoje)
const gerarDataModificacao = () => {
  const data = new Date();
  return data.toISOString().split('T')[0];
};

export default async function handler(req, res) {
  try {
    // Configurar cabeçalhos para XML
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    // Obter todos os arquivos JSON da pasta restaurants
    const restaurantsDirectory = path.join(process.cwd(), 'data', 'restaurants');
    const filenames = fs.readdirSync(restaurantsDirectory);
    
    // Data de última modificação (hoje)
    const dataModificacao = gerarDataModificacao();
    
    // Iniciar o XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Página inicial (prioridade máxima)
    xml += `  <url>
    <loc>https://guia-restaurantes.com.br</loc>
    <lastmod>${dataModificacao}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;
    
    // Outras páginas estáticas
    const paginasEstaticas = [
      { url: '/sobre', prioridade: 0.7 },
      { url: '/contato', prioridade: 0.7 },
      { url: '/termos-de-uso', prioridade: 0.5 },
      { url: '/politica-de-privacidade', prioridade: 0.5 },
    ];
    
    paginasEstaticas.forEach(pagina => {
      xml += `  <url>
    <loc>https://guia-restaurantes.com.br${pagina.url}</loc>
    <lastmod>${dataModificacao}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${pagina.prioridade}</priority>
  </url>\n`;
    });
    
    // Páginas de restaurantes
    const restaurantesPromises = filenames.map(async (filename) => {
      const filePath = path.join(restaurantsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const restaurantData = JSON.parse(fileContents);
      
      // Calcular prioridade com base na avaliação
      const prioridade = calcularPrioridade(restaurantData.rating);
      
      // Extrair o slug do nome do arquivo (remover a extensão .json)
      const slug = filename.replace(/\.json$/, '');
      
      return `  <url>
    <loc>https://guia-restaurantes.com.br/restaurantes/${slug}</loc>
    <lastmod>${dataModificacao}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${prioridade}</priority>
  </url>`;
    });
    
    // Aguardar todas as promessas e adicionar ao XML
    const restaurantesXml = await Promise.all(restaurantesPromises);
    xml += restaurantesXml.join('\n');
    
    // Fechar o XML
    xml += '\n</urlset>';
    
    // Retornar o XML
    res.status(200).send(xml);
  } catch (error) {
    console.error("Erro ao gerar sitemap:", error);
    res.status(500).json({ error: "Falha ao gerar o sitemap" });
  }
} 