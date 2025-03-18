// FilterBar.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import FilterBar from '../FilterBar'

// Mock dos dados de restaurantes
const mockRestaurants = [
  {
    id: 1,
    name: 'Restaurante Teste 1',
    cuisine: ['Italiana', 'Pizza'],
    city: 'São Paulo',
    neighborhood: 'Centro',
    priceRange: 'Moderado',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Restaurante Teste 2',
    cuisine: ['Japonesa', 'Sushi'],
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
    priceRange: 'Premium',
    rating: 4.8,
  },
]

describe('FilterBar', () => {
  it('renderiza todos os filtros corretamente', () => {
    render(<FilterBar restaurants={mockRestaurants} />)
    
    // Verifica se os componentes principais estão presentes
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByText('Culinária')).toBeInTheDocument()
    expect(screen.getByText('Localização')).toBeInTheDocument()
    expect(screen.getByText('Faixa de Preço')).toBeInTheDocument()
    expect(screen.getByText('Avaliação Mínima')).toBeInTheDocument()
    expect(screen.getByText('Ordenar por')).toBeInTheDocument()
  })

  it('filtra restaurantes por culinária', () => {
    render(<FilterBar restaurants={mockRestaurants} />)
    
    // Clica no checkbox da culinária Italiana
    const italianCheckbox = screen.getByLabelText('Italiana')
    fireEvent.click(italianCheckbox)
    
    // Verifica se o checkbox está marcado
    expect(italianCheckbox).toBeChecked()
  })

  it('filtra restaurantes por cidade', () => {
    render(<FilterBar restaurants={mockRestaurants} />)
    
    // Clica no checkbox da cidade São Paulo
    const saoPauloCheckbox = screen.getByLabelText('São Paulo')
    fireEvent.click(saoPauloCheckbox)
    
    // Verifica se o checkbox está marcado
    expect(saoPauloCheckbox).toBeChecked()
  })

  it('filtra restaurantes por faixa de preço', () => {
    render(<FilterBar restaurants={mockRestaurants} />)
    
    // Clica no checkbox da faixa de preço Moderado
    const moderatePriceCheckbox = screen.getByLabelText('Moderado')
    fireEvent.click(moderatePriceCheckbox)
    
    // Verifica se o checkbox está marcado
    expect(moderatePriceCheckbox).toBeChecked()
  })

  it('atualiza a avaliação mínima ao mover o slider', () => {
    render(<FilterBar restaurants={mockRestaurants} />)
    
    // Encontra o slider de avaliação
    const ratingSlider = screen.getByRole('slider')
    
    // Move o slider para 4.0
    fireEvent.change(ratingSlider, { target: { value: '4.0' } })
    
    // Verifica se o valor foi atualizado
    expect(ratingSlider.value).toBe('4.0')
  })

  it('ordena restaurantes quando uma opção é selecionada', () => {
    render(<FilterBar restaurants={mockRestaurants} />)
    
    // Encontra o select de ordenação
    const sortSelect = screen.getByRole('combobox')
    
    // Seleciona a opção "Melhor Avaliação"
    fireEvent.change(sortSelect, { target: { value: 'rating-desc' } })
    
    // Verifica se a opção foi selecionada
    expect(sortSelect.value).toBe('rating-desc')
  })

  it('limpa todos os filtros quando o botão é clicado', () => {
    render(<FilterBar restaurants={mockRestaurants} />)
    
    // Aplica alguns filtros
    fireEvent.click(screen.getByLabelText('Italiana'))
    fireEvent.click(screen.getByLabelText('São Paulo'))
    fireEvent.click(screen.getByLabelText('Moderado'))
    
    // Clica no botão de limpar filtros
    const clearButton = screen.getByText('Limpar Filtros')
    fireEvent.click(clearButton)
    
    // Verifica se os filtros foram limpos
    expect(screen.getByLabelText('Italiana')).not.toBeChecked()
    expect(screen.getByLabelText('São Paulo')).not.toBeChecked()
    expect(screen.getByLabelText('Moderado')).not.toBeChecked()
  })
}) 