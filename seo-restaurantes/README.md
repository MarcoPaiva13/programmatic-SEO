# Guia de Restaurantes

Um guia de restaurantes com sistema de busca avançada e visualização em diferentes formatos.

## Funcionalidades

- Busca avançada com múltiplos filtros
- Visualização em grade, tabela e mapa
- Sistema de buscas salvas
- Histórico de buscas
- Filtros por:
  - Tipo de cozinha
  - Faixa de preço
  - Avaliação mínima
  - Localização
  - Recursos disponíveis
- Ordenação por diferentes critérios
- Interface responsiva e acessível
- SEO otimizado

## Tecnologias Utilizadas

- Next.js
- React
- Leaflet (mapas)
- CSS Modules
- LocalStorage para persistência de dados

## Pré-requisitos

- Node.js 14.x ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/seo-restaurantes.git
cd seo-restaurantes
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Gere os dados de teste:
```bash
npm run generate
# ou
yarn generate
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

5. Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

## Estrutura do Projeto

```
seo-restaurantes/
├── .github/                       # Configurações do GitHub
├── .next/                         # Build do Next.js
├── components/                    # Componentes React reutilizáveis
│   ├── Map/                       # Componentes relacionados a mapas
│   │   └── Map.js                 # Implementação do componente de mapa
│   ├── OptimizedImage/            # Componente de imagem otimizada
│   ├── RestaurantCard/            # Card de exibição de restaurante
│   │   ├── index.js               # Implementação do cartão de restaurante
│   │   └── RestaurantCard.module.css # Estilos do cartão
│   ├── RestaurantGallery/         # Galeria de fotos de restaurantes
│   ├── RestaurantImage/           # Componente de imagem de restaurante
│   ├── ReviewForm/                # Formulário de avaliação
│   ├── ShareModal/                # Modal de compartilhamento
│   ├── admin/                     # Componentes da área administrativa
│   ├── filters/                   # Componentes de filtros de busca
│   │   ├── CuisineFilter.js       # Filtro de tipos de cozinha
│   │   ├── FilterBar.js           # Barra de filtros
│   │   ├── LocationFilter.js      # Filtro de localização
│   │   ├── PriceFilter.js         # Filtro de preço
│   │   ├── RatingFilter.js        # Filtro de avaliação
│   │   ├── SearchBar.js           # Barra de busca
│   │   └── SortOptions.js         # Opções de ordenação
│   ├── search/                    # Componentes relacionados à busca
│   │   ├── AdvancedSearchBar.js   # Barra de busca avançada
│   │   ├── AdvancedSearchBar.module.css # Estilos da busca avançada
│   │   ├── FilterBuilder.js       # Construtor de filtros
│   │   ├── ResultsList.js         # Lista de resultados
│   │   ├── ResultsList.module.css # Estilos da lista de resultados
│   │   ├── ResultsMap.js          # Visualização em mapa
│   │   ├── ResultsTable.js        # Visualização em tabela
│   │   ├── SavedSearches.js       # Gerenciamento de buscas salvas
│   │   ├── SearchHistory.js       # Histórico de buscas
│   │   └── ViewSelector.js        # Seletor de visualização
│   ├── templates/                 # Templates de página
│   ├── ConsentBanner.js           # Banner de consentimento de cookies
│   └── PreferencesModal.js        # Modal de preferências do usuário
├── data/                          # Dados do aplicativo
│   ├── analytics/                 # Dados de análise
│   ├── indices/                   # Índices para busca
│   └── restaurants/               # Dados dos restaurantes
├── hooks/                         # Hooks personalizados do React
├── lib/                           # Bibliotecas e funções utilitárias
├── node_modules/                  # Dependências do projeto
├── pages/                         # Páginas da aplicação
│   ├── api/                       # Endpoints da API
│   │   ├── analytics/             # API de análises
│   │   ├── restaurants/           # API de restaurantes
│   │   ├── revalidate.js          # Endpoint para revalidação
│   │   ├── revalidate-batch.js    # Revalidação em lote
│   │   ├── robots.js              # Configuração de robots.txt
│   │   └── sitemap.xml.js         # Gerador de sitemap
│   ├── restaurantes/              # Páginas de restaurantes
│   ├── _app.js                    # Configuração principal do Next.js
│   ├── busca-avancada.js          # Página de busca avançada
│   └── index.js                   # Página inicial
├── public/                        # Arquivos públicos estáticos
│   ├── robots.txt                 # Arquivo robots.txt
│   ├── vercel.svg                 # Logo da Vercel
│   ├── next.svg                   # Logo do Next.js
│   ├── globe.svg                  # Ícone de globo
│   ├── file.svg                   # Ícone de arquivo
│   └── window.svg                 # Ícone de janela
├── reducers/                      # Reducers (para gerenciamento de estado)
├── scripts/                       # Scripts de utilitários
├── styles/                        # Estilos globais
│   ├── ConsentBanner.module.css   # Estilos do banner de consentimento
│   ├── globals.css                # Estilos globais
│   ├── Home.module.css            # Estilos da página inicial
│   ├── PreferencesModal.module.css # Estilos do modal de preferências
│   └── SEODashboard.module.css    # Estilos do dashboard de SEO
├── utils/                         # Funções utilitárias
├── .env.example                   # Exemplo de variáveis de ambiente
├── .eslintrc.json                 # Configuração do ESLint
├── .gitignore                     # Configuração do Git ignore
├── .prettierrc                    # Configuração do Prettier
├── LICENSE                        # Licença do projeto
├── OTIMIZACOES.md                 # Documentação de otimizações
├── eslint.config.mjs              # Configuração adicional do ESLint
├── jest.config.js                 # Configuração de testes
├── jest.setup.js                  # Configuração adicional de testes
├── next-env.d.ts                  # Tipos do Next.js
├── next-sitemap.config.js         # Configuração do sitemap
├── next.config.js                 # Configuração do Next.js
├── package-lock.json              # Lock de dependências
├── package.json                   # Dependências e scripts
├── postcss.config.js              # Configuração do PostCSS
├── postcss.config.mjs             # Configuração adicional do PostCSS
├── tailwind.config.js             # Configuração do Tailwind CSS
├── tsconfig.json                  # Configuração do TypeScript
└── vercel.json                    # Configuração da Vercel
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run generate` - Gera dados de teste
- `npm test` - Executa os testes unitários
- `npm run test:watch` - Executa os testes no modo de observação
- `npm run test:coverage` - Gera relatório de cobertura de testes

## Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Contato

Seu Nome - [@seu_twitter](https://twitter.com/seu_twitter) - email@exemplo.com

Link do Projeto: [https://github.com/seu-usuario/seo-restaurantes](https://github.com/seu-usuario/seo-restaurantes)