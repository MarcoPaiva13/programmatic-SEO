// ResultsTable.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ResultsTable from '../ResultsTable'

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
  },
]

describe('ResultsTable', () => {
  it('renderiza a tabela corretamente', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Verifica se os cabeçalhos da tabela estão presentes
    expect(screen.getByText('Nome')).toBeInTheDocument()
    expect(screen.getByText('Localização')).toBeInTheDocument()
    expect(screen.getByText('Avaliação')).toBeInTheDocument()
    expect(screen.getByText('Preço')).toBeInTheDocument()
    expect(screen.getByText('Culinária')).toBeInTheDocument()
    expect(screen.getByText('Recursos')).toBeInTheDocument()
  })

  it('exibe todos os restaurantes na tabela', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Verifica se todos os restaurantes estão listados
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.getByText('Sushi Bar Japonês')).toBeInTheDocument()
  })

  it('ordena por nome quando o cabeçalho é clicado', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Clica no cabeçalho "Nome"
    const nameHeader = screen.getByText('Nome')
    fireEvent.click(nameHeader)
    
    // Verifica se a seta de ordenação aparece
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending')
  })

  it('ordena por avaliação quando o cabeçalho é clicado', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Clica no cabeçalho "Avaliação"
    const ratingHeader = screen.getByText('Avaliação')
    fireEvent.click(ratingHeader)
    
    // Verifica se a seta de ordenação aparece
    expect(ratingHeader).toHaveAttribute('aria-sort', 'descending')
  })

  it('ordena por preço quando o cabeçalho é clicado', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Clica no cabeçalho "Preço"
    const priceHeader = screen.getByText('Preço')
    fireEvent.click(priceHeader)
    
    // Verifica se a seta de ordenação aparece
    expect(priceHeader).toHaveAttribute('aria-sort', 'ascending')
  })

  it('exibe as estrelas de avaliação corretamente', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Verifica se as estrelas são exibidas corretamente
    const ratingCell = screen.getByText('4.5')
    expect(ratingCell).toBeInTheDocument()
  })

  it('exibe os recursos do restaurante corretamente', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Verifica se os recursos são exibidos
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument()
    expect(screen.getByText('Estacionamento')).toBeInTheDocument()
    expect(screen.getByText('Delivery')).toBeInTheDocument()
    expect(screen.getByText('Reservas')).toBeInTheDocument()
  })

  it('exibe a localização corretamente', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Verifica se a localização é exibida corretamente
    expect(screen.getByText('Centro, São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Copacabana, Rio de Janeiro')).toBeInTheDocument()
  })

  it('exibe a faixa de preço corretamente', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Verifica se a faixa de preço é exibida corretamente
    expect(screen.getByText('Moderado')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('exibe as culinárias corretamente', () => {
    render(<ResultsTable restaurants={mockRestaurants} />)
    
    // Verifica se as culinárias são exibidas corretamente
    expect(screen.getByText('Italiana')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Japonesa')).toBeInTheDocument()
    expect(screen.getByText('Sushi')).toBeInTheDocument()
  })
}) 