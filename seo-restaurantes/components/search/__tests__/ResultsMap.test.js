// ResultsMap.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ResultsMap from '../ResultsMap'

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

describe('ResultsMap', () => {
  it('renderiza o mapa corretamente', () => {
    render(<ResultsMap restaurants={mockRestaurants} />)
    
    // Verifica se o container do mapa está presente
    expect(screen.getByTestId('map-container')).toBeInTheDocument()
  })

  it('exibe a lista de restaurantes ao lado do mapa', () => {
    render(<ResultsMap restaurants={mockRestaurants} />)
    
    // Verifica se os restaurantes estão listados
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.getByText('Sushi Bar Japonês')).toBeInTheDocument()
  })

  it('exibe as informações básicas de cada restaurante na lista', () => {
    render(<ResultsMap restaurants={mockRestaurants} />)
    
    // Verifica se as informações básicas estão presentes
    expect(screen.getByText('Centro, São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Copacabana, Rio de Janeiro')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('4.8')).toBeInTheDocument()
    expect(screen.getByText('Moderado')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('exibe as culinárias de cada restaurante', () => {
    render(<ResultsMap restaurants={mockRestaurants} />)
    
    // Verifica se as culinárias estão presentes
    expect(screen.getByText('Italiana')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Japonesa')).toBeInTheDocument()
    expect(screen.getByText('Sushi')).toBeInTheDocument()
  })

  it('destaca o restaurante selecionado na lista', () => {
    render(<ResultsMap restaurants={mockRestaurants} />)
    
    // Clica no primeiro restaurante da lista
    const firstRestaurant = screen.getByText('Restaurante Italiano')
    fireEvent.click(firstRestaurant)
    
    // Verifica se o restaurante está destacado
    expect(firstRestaurant.closest('div')).toHaveClass('selected')
  })

  it('alterna a seleção entre restaurantes', () => {
    render(<ResultsMap restaurants={mockRestaurants} />)
    
    // Clica no primeiro restaurante
    const firstRestaurant = screen.getByText('Restaurante Italiano')
    fireEvent.click(firstRestaurant)
    expect(firstRestaurant.closest('div')).toHaveClass('selected')
    
    // Clica no segundo restaurante
    const secondRestaurant = screen.getByText('Sushi Bar Japonês')
    fireEvent.click(secondRestaurant)
    expect(secondRestaurant.closest('div')).toHaveClass('selected')
    expect(firstRestaurant.closest('div')).not.toHaveClass('selected')
  })

  it('exibe uma mensagem quando não há restaurantes', () => {
    render(<ResultsMap restaurants={[]} />)
    
    // Verifica se a mensagem é exibida
    expect(screen.getByText('Nenhum restaurante encontrado nesta área')).toBeInTheDocument()
  })

  it('exibe uma mensagem quando há apenas um restaurante', () => {
    render(<ResultsMap restaurants={[mockRestaurants[0]]} />)
    
    // Verifica se a mensagem é exibida
    expect(screen.getByText('1 restaurante encontrado')).toBeInTheDocument()
  })

  it('exibe uma mensagem quando há múltiplos restaurantes', () => {
    render(<ResultsMap restaurants={mockRestaurants} />)
    
    // Verifica se a mensagem é exibida
    expect(screen.getByText('2 restaurantes encontrados')).toBeInTheDocument()
  })
}) 