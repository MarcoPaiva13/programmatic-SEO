// generateRestaurants.js
// Script para gerar dados de teste de restaurantes para SEO programático

const faker = require('faker');
const fs = require('fs');
const path = require('path');
const { gerarConteudoRestaurante } = require('../utils/contentGenerator');

// Configurar Faker para português do Brasil
faker.locale = 'pt_BR';

// Dados de cidades e bairros principais
const cidades = [
  { cidade: 'São Paulo', estado: 'SP', bairros: ['Jardins', 'Vila Mariana', 'Pinheiros', 'Itaim Bibi', 'Moema', 'Vila Madalena', 'Perdizes', 'Higienópolis'] },
  { cidade: 'Rio de Janeiro', estado: 'RJ', bairros: ['Leblon', 'Ipanema', 'Copacabana', 'Botafogo', 'Jardim Botânico', 'Barra da Tijuca', 'Flamengo', 'Santa Teresa'] },
  { cidade: 'Belo Horizonte', estado: 'MG', bairros: ['Savassi', 'Funcionários', 'Lourdes', 'Sion', 'Cidade Jardim', 'Santa Efigênia', 'Floresta', 'Santo Antônio'] },
  { cidade: 'Curitiba', estado: 'PR', bairros: ['Batel', 'Água Verde', 'Boa Vista', 'Centro', 'Mercês', 'Bigorrilho', 'Cristo Rei', 'Jardim Social'] },
  { cidade: 'Porto Alegre', estado: 'RS', bairros: ['Moinhos de Vento', 'Bela Vista', 'Petrópolis', 'Boa Vista', 'Centro', 'Floresta', 'Cidade Baixa', 'Tristeza'] }
];

// Tipos de culinária e suas especialidades
const culinarias = {
  'Italiana': {
    especialidades: ['Pasta', 'Risotto', 'Pizza', 'Tiramisu', 'Ravioli'],
    pratos: [
      { nome: 'Spaghetti alla Carbonara', preco: 58.00, descricao: 'Massa fresca com molho cremoso de ovos, queijo pecorino e pancetta' },
      { nome: 'Risotto ai Funghi', preco: 65.00, descricao: 'Arroz arbóreo com mix de cogumelos frescos e parmesão' },
      { nome: 'Pizza Margherita', preco: 45.00, descricao: 'Pizza tradicional com molho de tomate, mussarela e manjericão' }
    ]
  },
  'Japonesa': {
    especialidades: ['Sushi', 'Sashimi', 'Temaki', 'Yakisoba', 'Tempura'],
    pratos: [
      { nome: 'Combinado Especial', preco: 85.00, descricao: 'Mix de sushis e sashimis variados' },
      { nome: 'Temaki de Salmão', preco: 35.00, descricao: 'Cone de alga com arroz e salmão fresco' },
      { nome: 'Yakisoba de Frango', preco: 48.00, descricao: 'Macarrão frito com legumes e frango' }
    ]
  },
  'Brasileira': {
    especialidades: ['Feijoada', 'Churrasco', 'Moqueca', 'Acarajé', 'Pão de Queijo'],
    pratos: [
      { nome: 'Feijoada Completa', preco: 75.00, descricao: 'Feijoada tradicional com todas as carnes e acompanhamentos' },
      { nome: 'Picanha na Brasa', preco: 95.00, descricao: 'Picanha grelhada com arroz, farofa e vinagrete' },
      { nome: 'Moqueca de Peixe', preco: 85.00, descricao: 'Moqueca de peixe com arroz e pirão' }
    ]
  }
};

// Função para gerar coordenadas realistas
function gerarCoordenadas(cidade) {
  const coordenadas = {
    'São Paulo': { lat: [-23.5505, -23.5616], lng: [-46.6333, -46.6601] },
    'Rio de Janeiro': { lat: [-22.9068, -22.9068], lng: [-43.1729, -43.1729] },
    'Belo Horizonte': { lat: [-19.9167, -19.9167], lng: [-43.9345, -43.9345] },
    'Curitiba': { lat: [-25.4284, -25.4284], lng: [-49.2733, -49.2733] },
    'Porto Alegre': { lat: [-30.0346, -30.0346], lng: [-51.2177, -51.2177] }
  };

  const lat = faker.random.number({ min: coordenadas[cidade].lat[0] * 1000, max: coordenadas[cidade].lat[1] * 1000 }) / 1000;
  const lng = faker.random.number({ min: coordenadas[cidade].lng[0] * 1000, max: coordenadas[cidade].lng[1] * 1000 }) / 1000;

  return { latitude: lat, longitude: lng };
}

// Função para gerar horário de funcionamento
function gerarHorarioFuncionamento() {
  const horarios = {
    monday: '12:00-22:00',
    tuesday: '12:00-22:00',
    wednesday: '12:00-22:00',
    thursday: '12:00-23:00',
    friday: '12:00-23:00',
    saturday: '12:00-23:00',
    sunday: '12:00-16:00'
  };

  // Variação aleatória nos horários
  if (faker.random.boolean()) {
    horarios.sunday = 'Fechado';
  }

  return horarios;
}

// Função para gerar um restaurante
function gerarRestaurante() {
  const cidade = faker.random.arrayElement(cidades);
  const bairro = faker.random.arrayElement(cidade.bairros);
  const tipoCulinaria = faker.random.arrayElement(Object.keys(culinarias));
  const culinariaInfo = culinarias[tipoCulinaria];
  
  const nome = faker.company.companyName();
  const slug = nome.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + bairro.toLowerCase();
  
  const coordenadas = gerarCoordenadas(cidade.cidade);
  
  return {
    id: slug,
    name: nome,
    slug: slug,
    city: cidade.cidade,
    neighborhood: bairro,
    state: cidade.estado,
    address: {
      street: faker.address.streetName(),
      number: faker.random.number({ min: 1, max: 9999 }).toString(),
      zipCode: faker.address.zipCode('#####-###'),
      coordinates: coordenadas
    },
    cuisine: [tipoCulinaria],
    specialties: faker.random.arrayElements(culinariaInfo.especialidades, 3),
    priceRange: faker.random.arrayElement(['$', '$$', '$$$']),
    operatingHours: gerarHorarioFuncionamento(),
    reservations: faker.random.boolean(),
    delivery: faker.random.boolean(),
    takeout: faker.random.boolean(),
    phone: faker.phone.phoneNumber('(##) ####-####'),
    website: `https://www.${slug}.com.br`,
    socialMedia: {
      instagram: `@${slug.replace(/-/g, '')}`,
      facebook: slug.replace(/-/g, '')
    },
    rating: faker.random.number({ min: 3.5, max: 5, precision: 0.1 }),
    reviewCount: faker.random.number({ min: 50, max: 500 }),
    ambience: faker.random.arrayElements(['Romântico', 'Familiar', 'Casual Elegante', 'Moderno', 'Tradicional'], 2),
    features: faker.random.arrayElements(['Wi-Fi', 'Estacionamento', 'Acessibilidade', 'Ar Condicionado', 'Terraço', 'Bar'], 3),
    paymentOptions: ['Crédito', 'Débito', 'Dinheiro', 'Pix'],
    establishment: {
      foundedYear: faker.random.number({ min: 1980, max: 2020 }),
      founder: faker.name.findName(),
      story: faker.lorem.paragraph()
    },
    chef: {
      name: faker.name.findName(),
      background: faker.lorem.sentence()
    },
    keywords: [tipoCulinaria.toLowerCase(), bairro.toLowerCase(), cidade.cidade.toLowerCase()],
    nearbyAttractions: faker.random.arrayElements(['Shopping', 'Parque', 'Teatro', 'Museu', 'Centro Comercial'], 3),
    relatedQueries: faker.random.arrayElements([
      `melhor restaurante ${tipoCulinaria.toLowerCase()} em ${cidade.cidade.toLowerCase()}`,
      `${tipoCulinaria.toLowerCase()} em ${bairro.toLowerCase()}`,
      `restaurante ${tipoCulinaria.toLowerCase()} tradicional`
    ], 3),
    images: [
      {
        url: `/images/${slug}/fachada.jpg`,
        alt: `Fachada do ${nome} em ${bairro}`,
        type: 'exterior'
      },
      {
        url: `/images/${slug}/interior.jpg`,
        alt: `Ambiente interno do ${nome}`,
        type: 'interior'
      },
      {
        url: `/images/${slug}/prato.jpg`,
        alt: `Prato especial do ${nome}`,
        type: 'food'
      }
    ],
    menuHighlights: culinariaInfo.pratos.map(prato => ({
      ...prato,
      ingredients: faker.random.arrayElements(['Ingrediente 1', 'Ingrediente 2', 'Ingrediente 3'], 3),
      isSignatureDish: faker.random.boolean()
    })),
    awards: faker.random.arrayElements([
      `Melhor Restaurante ${tipoCulinaria} de ${cidade.cidade} ${faker.random.number({ min: 2018, max: 2023 })}`,
      `Destaque Gastronômico - Revista Gourmet ${faker.random.number({ min: 2018, max: 2023 })}`
    ], 2),
    events: faker.random.arrayElements([
      'Noites de Degustação',
      'Festival Gastronômico',
      'Happy Hour Especial',
      'Menu Degustação'
    ], 2),
    dietaryOptions: faker.random.arrayElements(['Opções Vegetarianas', 'Opções sem Glúten', 'Opções Veganas'], 2)
  };
}

// Função principal para gerar múltiplos restaurantes
function gerarRestaurantes(quantidade) {
  const restaurantes = [];
  
  for (let i = 0; i < quantidade; i++) {
    restaurantes.push(gerarRestaurante());
  }
  
  return restaurantes;
}

// Criar diretório se não existir
const outputDir = path.join(__dirname, '../data/restaurants');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Gerar restaurantes e salvar em arquivos individuais
const quantidade = 100;
const restaurantes = gerarRestaurantes(quantidade);

restaurantes.forEach(restaurante => {
  const filePath = path.join(outputDir, `${restaurante.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(restaurante, null, 2), 'utf8');
});

console.log(`✅ ${quantidade} restaurantes gerados com sucesso em ${outputDir}`); 