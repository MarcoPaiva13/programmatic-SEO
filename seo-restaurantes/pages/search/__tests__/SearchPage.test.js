// SearchPage.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import SearchPage from '../index'

// Mock dos dados de restaurantes
const mockRestaurants = [
  {
    id: 1,
    name: 'Restaurante Italiano',
    cuisine: ['Italiana', 'Pizza'],
    city: 'São Paulo',
    neighborhood: 'Centro',
    priceRange: 'Moderado',
    rating: 4.5,
    features: ['Wi-Fi', 'Estacionamento'],
    location: {
      lat: -23.550520,
      lng: -46.633308,
    },
  },
  {
    id: 2,
    name: 'Sushi Bar Japonês',
    cuisine: ['Japonesa', 'Sushi'],
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
    priceRange: 'Premium',
    rating: 4.8,
    features: ['Delivery', 'Reservas'],
    location: {
      lat: -22.906847,
      lng: -43.172897,
    },
  },
]

// Mock do componente MapContainer do react-leaflet
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  useMap: () => ({
    setView: jest.fn(),
    remove: jest.fn(),
  }),
}))

describe('SearchPage', () => {
  it('renderiza a página de busca corretamente', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Verifica se os componentes principais estão presentes
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByText('Culinária')).toBeInTheDocument()
    expect(screen.getByText('Localização')).toBeInTheDocument()
    expect(screen.getByText('Faixa de Preço')).toBeInTheDocument()
    expect(screen.getByText('Avaliação Mínima')).toBeInTheDocument()
    expect(screen.getByText('Ordenar por')).toBeInTheDocument()
  })

  it('exibe os restaurantes na visualização em grade', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Verifica se os restaurantes estão listados
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.getByText('Sushi Bar Japonês')).toBeInTheDocument()
  })

  it('permite alternar entre as visualizações', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Clica no botão de lista
    const listButton = screen.getByRole('button', { name: /lista/i })
    fireEvent.click(listButton)
    
    // Verifica se a visualização mudou para lista
    expect(screen.getByRole('table')).toBeInTheDocument()
    
    // Clica no botão de mapa
    const mapButton = screen.getByRole('button', { name: /mapa/i })
    fireEvent.click(mapButton)
    
    // Verifica se a visualização mudou para mapa
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
  })

  it('filtra restaurantes por culinária', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Seleciona a culinária Italiana
    const italianCheckbox = screen.getByLabelText('Italiana')
    fireEvent.click(italianCheckbox)
    
    // Verifica se apenas o restaurante italiano é exibido
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.queryByText('Sushi Bar Japonês')).not.toBeInTheDocument()
  })

  it('filtra restaurantes por localização', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Seleciona a cidade São Paulo
    const saoPauloCheckbox = screen.getByLabelText('São Paulo')
    fireEvent.click(saoPauloCheckbox)
    
    // Verifica se apenas os restaurantes de São Paulo são exibidos
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.queryByText('Sushi Bar Japonês')).not.toBeInTheDocument()
  })

  it('filtra restaurantes por faixa de preço', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Seleciona a faixa de preço Premium
    const premiumCheckbox = screen.getByLabelText('Premium')
    fireEvent.click(premiumCheckbox)
    
    // Verifica se apenas os restaurantes premium são exibidos
    expect(screen.queryByText('Restaurante Italiano')).not.toBeInTheDocument()
    expect(screen.getByText('Sushi Bar Japonês')).toBeInTheDocument()
  })

  it('filtra restaurantes por avaliação mínima', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Ajusta o slider de avaliação para 4.8
    const ratingSlider = screen.getByRole('slider')
    fireEvent.change(ratingSlider, { target: { value: '4.8' } })
    
    // Verifica se apenas os restaurantes com avaliação >= 4.8 são exibidos
    expect(screen.queryByText('Restaurante Italiano')).not.toBeInTheDocument()
    expect(screen.getByText('Sushi Bar Japonês')).toBeInTheDocument()
  })

  it('ordena restaurantes por diferentes critérios', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Seleciona ordenação por avaliação
    const sortSelect = screen.getByRole('combobox')
    fireEvent.change(sortSelect, { target: { value: 'rating-desc' } })
    
    // Verifica se os restaurantes estão ordenados por avaliação
    const restaurants = screen.getAllByRole('article')
    expect(restaurants[0]).toHaveTextContent('4.8')
    expect(restaurants[1]).toHaveTextContent('4.5')
  })

  it('permite salvar buscas', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Aplica alguns filtros
    const italianCheckbox = screen.getByLabelText('Italiana')
    const saoPauloCheckbox = screen.getByLabelText('São Paulo')
    
    fireEvent.click(italianCheckbox)
    fireEvent.click(saoPauloCheckbox)
    
    // Clica no botão de salvar busca
    const saveButton = screen.getByText('Salvar Busca')
    fireEvent.click(saveButton)
    
    // Verifica se a busca foi salva
    expect(screen.getByText('Buscas Salvas')).toBeInTheDocument()
  })

  it('permite carregar buscas salvas', () => {
    render(<SearchPage restaurants={mockRestaurants} />)
    
    // Clica em uma busca salva
    const savedSearch = screen.getByText('Restaurantes Italianos em SP')
    fireEvent.click(savedSearch)
    
    // Verifica se os filtros foram aplicados
    expect(screen.getByLabelText('Italiana')).toBeChecked()
    expect(screen.getByLabelText('São Paulo')).toBeChecked()
  })

  it('exibe uma mensagem quando não há resultados', () => {
    render(<SearchPage restaurants={[]} />)
    
    // Verifica se a mensagem é exibida
    expect(screen.getByText('Nenhum restaurante encontrado com os filtros selecionados')).toBeInTheDocument()
  })
}) 