// RestaurantCard.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import RestaurantCard from '../index'

// Mock dos dados do restaurante
const mockRestaurant = {
  id: 1,
  name: 'Restaurante Italiano',
  cuisine: ['Italiana', 'Pizza'],
  city: 'São Paulo',
  neighborhood: 'Centro',
  priceRange: 'Moderado',
  rating: 4.5,
  features: ['Wi-Fi', 'Estacionamento'],
  image: '/images/restaurants/italian.jpg',
  description: 'Um autêntico restaurante italiano no coração da cidade.',
  openingHours: {
    monday: '11:00-22:00',
    tuesday: '11:00-22:00',
    wednesday: '11:00-22:00',
    thursday: '11:00-22:00',
    friday: '11:00-23:00',
    saturday: '11:00-23:00',
    sunday: '12:00-22:00',
  },
  contact: {
    phone: '(11) 3333-4444',
    email: 'contato@restauranteitaliano.com.br',
    website: 'www.restauranteitaliano.com.br',
  },
  location: {
    lat: -23.550520,
    lng: -46.633308,
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
  },
}

describe('RestaurantCard', () => {
  it('renderiza o card do restaurante corretamente', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se as informações básicas estão presentes
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.getByText('Centro, São Paulo')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Moderado')).toBeInTheDocument()
  })

  it('exibe as culinárias do restaurante', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se as culinárias estão listadas
    expect(screen.getByText('Italiana')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
  })

  it('exibe os recursos do restaurante', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se os recursos estão listados
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument()
    expect(screen.getByText('Estacionamento')).toBeInTheDocument()
  })

  it('exibe a imagem do restaurante', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se a imagem está presente
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/restaurants/italian.jpg')
    expect(image).toHaveAttribute('alt', 'Restaurante Italiano')
  })

  it('exibe as estrelas de avaliação corretamente', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se as estrelas são exibidas corretamente
    const stars = screen.getAllByTestId('star')
    expect(stars).toHaveLength(5)
    expect(stars[0]).toHaveClass('filled')
    expect(stars[1]).toHaveClass('filled')
    expect(stars[2]).toHaveClass('filled')
    expect(stars[3]).toHaveClass('filled')
    expect(stars[4]).toHaveClass('half')
  })

  it('navega para a página de detalhes ao clicar no card', () => {
    const onNavigate = jest.fn()
    render(<RestaurantCard restaurant={mockRestaurant} onNavigate={onNavigate} />)
    
    // Clica no card
    const card = screen.getByRole('article')
    fireEvent.click(card)
    
    // Verifica se a função de navegação foi chamada
    expect(onNavigate).toHaveBeenCalledWith('/restaurantes/1')
  })

  it('exibe um botão de favorito', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se o botão de favorito está presente
    const favoriteButton = screen.getByRole('button', { name: /favorito/i })
    expect(favoriteButton).toBeInTheDocument()
  })

  it('alterna o estado de favorito ao clicar no botão', () => {
    const onToggleFavorite = jest.fn()
    render(<RestaurantCard restaurant={mockRestaurant} onToggleFavorite={onToggleFavorite} />)
    
    // Clica no botão de favorito
    const favoriteButton = screen.getByRole('button', { name: /favorito/i })
    fireEvent.click(favoriteButton)
    
    // Verifica se a função foi chamada
    expect(onToggleFavorite).toHaveBeenCalledWith(mockRestaurant.id)
  })

  it('exibe um indicador de preço com o número correto de símbolos', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se o indicador de preço está presente
    const priceIndicator = screen.getByTestId('price-indicator')
    expect(priceIndicator).toBeInTheDocument()
    expect(priceIndicator).toHaveTextContent('$$')
  })

  it('exibe um link para o site do restaurante', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se o link do site está presente
    const websiteLink = screen.getByRole('link', { name: /visitar site/i })
    expect(websiteLink).toBeInTheDocument()
    expect(websiteLink).toHaveAttribute('href', 'www.restauranteitaliano.com.br')
    expect(websiteLink).toHaveAttribute('target', '_blank')
    expect(websiteLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('exibe um botão para compartilhar', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Verifica se o botão de compartilhar está presente
    const shareButton = screen.getByRole('button', { name: /compartilhar/i })
    expect(shareButton).toBeInTheDocument()
  })

  it('exibe um modal de compartilhamento ao clicar no botão', () => {
    render(<RestaurantCard restaurant={mockRestaurant} />)
    
    // Clica no botão de compartilhar
    const shareButton = screen.getByRole('button', { name: /compartilhar/i })
    fireEvent.click(shareButton)
    
    // Verifica se o modal é exibido
    expect(screen.getByText('Compartilhar Restaurante')).toBeInTheDocument()
  })
}) 