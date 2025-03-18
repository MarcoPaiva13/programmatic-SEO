// FilterBuilder.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBuilder from '../FilterBuilder'

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

describe('FilterBuilder', () => {
  it('renderiza o construtor de filtros corretamente', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Verifica se os componentes principais estão presentes
    expect(screen.getByText('Culinária')).toBeInTheDocument()
    expect(screen.getByText('Localização')).toBeInTheDocument()
    expect(screen.getByText('Faixa de Preço')).toBeInTheDocument()
    expect(screen.getByText('Avaliação Mínima')).toBeInTheDocument()
  })

  it('exibe as opções de culinária disponíveis', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Verifica se as culinárias estão listadas
    expect(screen.getByText('Italiana')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()
    expect(screen.getByText('Japonesa')).toBeInTheDocument()
    expect(screen.getByText('Sushi')).toBeInTheDocument()
  })

  it('exibe as opções de localização disponíveis', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Verifica se as cidades estão listadas
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
    
    // Verifica se os bairros estão listados
    expect(screen.getByText('Centro')).toBeInTheDocument()
    expect(screen.getByText('Copacabana')).toBeInTheDocument()
  })

  it('exibe as opções de faixa de preço', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Verifica se as faixas de preço estão listadas
    expect(screen.getByText('Moderado')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
  })

  it('permite selecionar múltiplas culinárias', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Seleciona duas culinárias
    const italianCheckbox = screen.getByLabelText('Italiana')
    const japaneseCheckbox = screen.getByLabelText('Japonesa')
    
    fireEvent.click(italianCheckbox)
    fireEvent.click(japaneseCheckbox)
    
    // Verifica se as culinárias foram selecionadas
    expect(italianCheckbox).toBeChecked()
    expect(japaneseCheckbox).toBeChecked()
  })

  it('permite selecionar múltiplas localizações', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Seleciona duas cidades
    const saoPauloCheckbox = screen.getByLabelText('São Paulo')
    const rioCheckbox = screen.getByLabelText('Rio de Janeiro')
    
    fireEvent.click(saoPauloCheckbox)
    fireEvent.click(rioCheckbox)
    
    // Verifica se as cidades foram selecionadas
    expect(saoPauloCheckbox).toBeChecked()
    expect(rioCheckbox).toBeChecked()
  })

  it('permite selecionar múltiplas faixas de preço', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Seleciona duas faixas de preço
    const moderateCheckbox = screen.getByLabelText('Moderado')
    const premiumCheckbox = screen.getByLabelText('Premium')
    
    fireEvent.click(moderateCheckbox)
    fireEvent.click(premiumCheckbox)
    
    // Verifica se as faixas de preço foram selecionadas
    expect(moderateCheckbox).toBeChecked()
    expect(premiumCheckbox).toBeChecked()
  })

  it('permite ajustar a avaliação mínima', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Encontra o slider de avaliação
    const ratingSlider = screen.getByRole('slider')
    
    // Move o slider para 4.0
    fireEvent.change(ratingSlider, { target: { value: '4.0' } })
    
    // Verifica se o valor foi atualizado
    expect(ratingSlider.value).toBe('4.0')
  })

  it('chama a função onFilterChange quando os filtros são alterados', () => {
    const onFilterChange = jest.fn()
    render(<FilterBuilder restaurants={mockRestaurants} onFilterChange={onFilterChange} />)
    
    // Seleciona uma culinária
    const italianCheckbox = screen.getByLabelText('Italiana')
    fireEvent.click(italianCheckbox)
    
    // Verifica se a função foi chamada
    expect(onFilterChange).toHaveBeenCalled()
  })

  it('permite limpar todos os filtros', () => {
    render(<FilterBuilder restaurants={mockRestaurants} />)
    
    // Seleciona alguns filtros
    const italianCheckbox = screen.getByLabelText('Italiana')
    const saoPauloCheckbox = screen.getByLabelText('São Paulo')
    const moderateCheckbox = screen.getByLabelText('Moderado')
    
    fireEvent.click(italianCheckbox)
    fireEvent.click(saoPauloCheckbox)
    fireEvent.click(moderateCheckbox)
    
    // Clica no botão de limpar filtros
    const clearButton = screen.getByText('Limpar Filtros')
    fireEvent.click(clearButton)
    
    // Verifica se os filtros foram limpos
    expect(italianCheckbox).not.toBeChecked()
    expect(saoPauloCheckbox).not.toBeChecked()
    expect(moderateCheckbox).not.toBeChecked()
  })

  it('exibe uma mensagem quando não há restaurantes que correspondem aos filtros', () => {
    render(<FilterBuilder restaurants={[]} />)
    
    // Verifica se a mensagem é exibida
    expect(screen.getByText('Nenhum restaurante encontrado com os filtros selecionados')).toBeInTheDocument()
  })
}) 