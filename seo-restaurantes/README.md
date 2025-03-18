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
├── components/
│   ├── Avatar/
│   │   ├── __tests__/
│   │   │   └── Avatar.test.js
│   │   └── index.js
│   ├── Badge/
│   │   ├── __tests__/
│   │   │   └── Badge.test.js
│   │   └── index.js
│   ├── Button/
│   │   ├── __tests__/
│   │   │   └── Button.test.js
│   │   └── index.js
│   ├── Card/
│   │   ├── __tests__/
│   │   │   └── Card.test.js
│   │   └── index.js
│   ├── Checkbox/
│   │   ├── __tests__/
│   │   │   └── Checkbox.test.js
│   │   └── index.js
│   ├── ErrorBoundary/
│   │   ├── __tests__/
│   │   │   └── ErrorBoundary.test.js
│   │   └── index.js
│   ├── Input/
│   │   ├── __tests__/
│   │   │   └── Input.test.js
│   │   └── index.js
│   ├── Modal/
│   │   ├── __tests__/
│   │   │   └── Modal.test.js
│   │   └── index.js
│   ├── Progress/
│   │   ├── __tests__/
│   │   │   └── Progress.test.js
│   │   └── index.js
│   ├── Radio/
│   │   ├── __tests__/
│   │   │   └── Radio.test.js
│   │   └── index.js
│   ├── Select/
│   │   ├── __tests__/
│   │   │   └── Select.test.js
│   │   └── index.js
│   ├── Slider/
│   │   ├── __tests__/
│   │   │   └── Slider.test.js
│   │   └── index.js
│   ├── Switch/
│   │   ├── __tests__/
│   │   │   └── Switch.test.js
│   │   └── index.js
│   ├── Tooltip/
│   │   ├── __tests__/
│   │   │   └── Tooltip.test.js
│   │   └── index.js
│   ├── filters/
│   │   ├── CuisineFilter.js
│   │   ├── FilterBar.js
│   │   ├── LocationFilter.js
│   │   ├── PriceFilter.js
│   │   ├── RatingFilter.js
│   │   └── SearchBar.js
│   └── search/
│       ├── __tests__/
│       │   ├── FilterBuilder.test.js
│       │   └── ViewSelector.test.js
│       ├── FilterBuilder.js
│       ├── ResultsMap.js
│       ├── ResultsTable.js
│       ├── SavedSearches.js
│       ├── SearchHistory.js
│       └── ViewSelector.js
├── data/
│   └── restaurants/
├── pages/
│   ├── __tests__/
│   │   └── index.test.js
│   ├── search/
│   │   ├── __tests__/
│   │   │   └── SearchPage.test.js
│   │   └── index.js
│   ├── _app.js
│   └── index.js
├── public/
│   └── images/
├── styles/
│   └── Home.module.css
├── scripts/
│   └── generateRestaurants.js
├── jest.config.js
├── jest.setup.js
├── next.config.js
├── .gitignore
├── .eslintrc.json
├── .babelrc
├── package.json
└── README.md
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
