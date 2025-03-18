// RestaurantDetails.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import RestaurantDetails from '../index'

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
  reviews: [
    {
      id: 1,
      user: 'João Silva',
      rating: 5,
      comment: 'Excelente comida e atendimento!',
      date: '2024-03-15',
    },
    {
      id: 2,
      user: 'Maria Santos',
      rating: 4,
      comment: 'Bom ambiente, preços justos.',
      date: '2024-03-10',
    },
  ],
}

describe('RestaurantDetails', () => {
  it('renderiza os detalhes do restaurante corretamente', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se as informações principais estão presentes
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.getByText('Centro, São Paulo')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('Moderado')).toBeInTheDocument()
    expect(screen.getByText('Um autêntico restaurante italiano no coração da cidade.')).toBeInTheDocument()
  })

  it('exibe a imagem do restaurante', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se a imagem está presente
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/restaurants/italian.jpg')
    expect(image).toHaveAttribute('alt', 'Restaurante Italiano')
  })

  it('exibe as culinárias do restaurante', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se as culinárias estão listadas
    expect(screen.getByText('Italiana')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
  })

  it('exibe os recursos do restaurante', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se os recursos estão listados
    expect(screen.getByText('Wi-Fi')).toBeInTheDocument()
    expect(screen.getByText('Estacionamento')).toBeInTheDocument()
  })

  it('exibe os horários de funcionamento', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se os horários estão listados
    expect(screen.getByText('Segunda a Quinta')).toBeInTheDocument()
    expect(screen.getByText('11:00 - 22:00')).toBeInTheDocument()
    expect(screen.getByText('Sexta e Sábado')).toBeInTheDocument()
    expect(screen.getByText('11:00 - 23:00')).toBeInTheDocument()
    expect(screen.getByText('Domingo')).toBeInTheDocument()
    expect(screen.getByText('12:00 - 22:00')).toBeInTheDocument()
  })

  it('exibe as informações de contato', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se as informações de contato estão presentes
    expect(screen.getByText('(11) 3333-4444')).toBeInTheDocument()
    expect(screen.getByText('contato@restauranteitaliano.com.br')).toBeInTheDocument()
    expect(screen.getByText('www.restauranteitaliano.com.br')).toBeInTheDocument()
    expect(screen.getByText('Rua das Flores, 123 - Centro, São Paulo - SP')).toBeInTheDocument()
  })

  it('exibe o mapa com a localização do restaurante', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se o mapa está presente
    const map = screen.getByTestId('restaurant-map')
    expect(map).toBeInTheDocument()
  })

  it('exibe as avaliações dos usuários', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se as avaliações estão listadas
    expect(screen.getByText('João Silva')).toBeInTheDocument()
    expect(screen.getByText('Excelente comida e atendimento!')).toBeInTheDocument()
    expect(screen.getByText('Maria Santos')).toBeInTheDocument()
    expect(screen.getByText('Bom ambiente, preços justos.')).toBeInTheDocument()
  })

  it('exibe as estrelas de avaliação corretamente', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se as estrelas são exibidas corretamente
    const stars = screen.getAllByTestId('star')
    expect(stars).toHaveLength(5)
    expect(stars[0]).toHaveClass('filled')
    expect(stars[1]).toHaveClass('filled')
    expect(stars[2]).toHaveClass('filled')
    expect(stars[3]).toHaveClass('filled')
    expect(stars[4]).toHaveClass('half')
  })

  it('exibe um botão para adicionar avaliação', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se o botão está presente
    const reviewButton = screen.getByRole('button', { name: /adicionar avaliação/i })
    expect(reviewButton).toBeInTheDocument()
  })

  it('exibe um modal de avaliação ao clicar no botão', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Clica no botão de avaliação
    const reviewButton = screen.getByRole('button', { name: /adicionar avaliação/i })
    fireEvent.click(reviewButton)
    
    // Verifica se o modal é exibido
    expect(screen.getByText('Adicionar Avaliação')).toBeInTheDocument()
  })

  it('exibe um botão para compartilhar', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Verifica se o botão está presente
    const shareButton = screen.getByRole('button', { name: /compartilhar/i })
    expect(shareButton).toBeInTheDocument()
  })

  it('exibe um modal de compartilhamento ao clicar no botão', () => {
    render(<RestaurantDetails restaurant={mockRestaurant} />)
    
    // Clica no botão de compartilhar
    const shareButton = screen.getByRole('button', { name: /compartilhar/i })
    fireEvent.click(shareButton)
    
    // Verifica se o modal é exibido
    expect(screen.getByText('Compartilhar Restaurante')).toBeInTheDocument()
  })
}) 