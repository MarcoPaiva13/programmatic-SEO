/**
 * Script para gerar imagens de fallback para diferentes tipos
 * Execute usando: node scripts/createFallbackImages.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Diretório onde as imagens serão salvas
const FALLBACKS_DIR = path.join(__dirname, '../public/images/fallbacks');

// Certifique-se de que o diretório existe
if (!fs.existsSync(FALLBACKS_DIR)) {
  fs.mkdirSync(FALLBACKS_DIR, { recursive: true });
  console.log(`Diretório criado: ${FALLBACKS_DIR}`);
}

// Configurações
const WIDTH = 1200;
const HEIGHT = 800;
const QUALITY = 0.85;

// Definição dos diferentes tipos de imagens
const imageTypes = [
  {
    name: 'restaurant-exterior',
    backgroundColor: '#B0C4DE',
    text: 'Fachada do Restaurante',
    textColor: '#333',
    icon: '🏢'
  },
  {
    name: 'restaurant-interior',
    backgroundColor: '#E6D5AC',
    text: 'Interior do Restaurante',
    textColor: '#333',
    icon: '🪑'
  },
  {
    name: 'food-dish',
    backgroundColor: '#E2D5C3',
    text: 'Prato Delicioso',
    textColor: '#333',
    icon: '🍽️'
  },
  {
    name: 'menu',
    backgroundColor: '#F5F5DC',
    text: 'Cardápio',
    textColor: '#333',
    icon: '📋'
  },
  {
    name: 'chef',
    backgroundColor: '#F5F5F5',
    text: 'Chef',
    textColor: '#333',
    icon: '👨‍🍳'
  },
  {
    name: 'drinks',
    backgroundColor: '#D6EAF8',
    text: 'Bebidas',
    textColor: '#333',
    icon: '🍷'
  },
  {
    name: 'event',
    backgroundColor: '#D1F2EB',
    text: 'Eventos',
    textColor: '#333',
    icon: '🎉'
  },
  {
    name: 'detail',
    backgroundColor: '#FADBD8',
    text: 'Detalhes',
    textColor: '#333',
    icon: '✨'
  },
  {
    name: 'restaurant-default',
    backgroundColor: '#E0E0E0',
    text: 'Restaurante',
    textColor: '#333',
    icon: '🍴'
  }
];

// Função para criar uma imagem de fallback
function createFallbackImage({ name, backgroundColor, text, textColor, icon }) {
  console.log(`Criando imagem de fallback: ${name}.jpg`);

  // Cria um canvas com as dimensões definidas
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Preenche o fundo
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Adiciona uma borda suave
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.lineWidth = 10;
  ctx.strokeRect(10, 10, WIDTH - 20, HEIGHT - 20);

  // Configura o estilo de texto
  const fontSize = 80;
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;

  // Desenha o ícone
  const iconFontSize = 120;
  ctx.font = `${iconFontSize}px Arial, sans-serif`;
  ctx.fillText(icon, WIDTH / 2, HEIGHT / 2 - 60);

  // Desenha o texto
  ctx.font = `bold ${fontSize}px Arial, sans-serif`;
  ctx.fillText(text, WIDTH / 2, HEIGHT / 2 + 60);

  // Adiciona marca d'água de fallback sutil
  ctx.font = '20px Arial, sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillText('Imagem não disponível', WIDTH / 2, HEIGHT - 30);

  // Salva a imagem como JPG
  const buffer = canvas.toBuffer('image/jpeg', { quality: QUALITY });
  fs.writeFileSync(path.join(FALLBACKS_DIR, `${name}.jpg`), buffer);
  
  console.log(`Imagem de fallback criada: ${name}.jpg`);
}

// Cria todas as imagens de fallback
function createAllFallbackImages() {
  console.log('Iniciando criação das imagens de fallback...');
  
  imageTypes.forEach(createFallbackImage);
  
  console.log(`Todas as imagens de fallback foram criadas em: ${FALLBACKS_DIR}`);
}

// Executa a criação de imagens
createAllFallbackImages(); 