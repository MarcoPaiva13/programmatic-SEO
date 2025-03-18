// SearchBar.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '../SearchBar'

// Mock dos dados de restaurantes
const mockRestaurants = [
  {
    id: 1,
    name: 'Restaurante Italiano',
    cuisine: ['Italiana', 'Pizza'],
    city: 'São Paulo',
    neighborhood: 'Centro',
  },
  {
    id: 2,
    name: 'Sushi Bar Japonês',
    cuisine: ['Japonesa', 'Sushi'],
    city: 'Rio de Janeiro',
    neighborhood: 'Copacabana',
  },
]

describe('SearchBar', () => {
  it('renderiza a barra de pesquisa corretamente', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Verifica se o campo de pesquisa está presente
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar restaurantes, culinárias ou localizações...')).toBeInTheDocument()
  })

  it('mostra sugestões ao digitar', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "Italiano" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'Italiano' } })
    
    // Verifica se as sugestões aparecem
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
  })

  it('filtra sugestões por culinária', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "Japonesa" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'Japonesa' } })
    
    // Verifica se as sugestões de culinária aparecem
    expect(screen.getByText('Japonesa')).toBeInTheDocument()
  })

  it('filtra sugestões por cidade', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "São Paulo" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'São Paulo' } })
    
    // Verifica se as sugestões de cidade aparecem
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
  })

  it('filtra sugestões por bairro', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "Centro" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'Centro' } })
    
    // Verifica se as sugestões de bairro aparecem
    expect(screen.getByText('Centro')).toBeInTheDocument()
  })

  it('aplica a pesquisa ao clicar em uma sugestão', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "Italiano" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'Italiano' } })
    
    // Clica na sugestão
    fireEvent.click(screen.getByText('Restaurante Italiano'))
    
    // Verifica se o valor do campo foi atualizado
    expect(searchInput.value).toBe('Restaurante Italiano')
  })

  it('aplica a pesquisa ao pressionar Enter', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "Italiano" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'Italiano' } })
    
    // Pressiona Enter
    fireEvent.keyDown(searchInput, { key: 'Enter' })
    
    // Verifica se o valor do campo foi mantido
    expect(searchInput.value).toBe('Italiano')
  })

  it('limpa as sugestões ao pressionar Escape', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "Italiano" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'Italiano' } })
    
    // Verifica se as sugestões aparecem
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    
    // Pressiona Escape
    fireEvent.keyDown(searchInput, { key: 'Escape' })
    
    // Verifica se as sugestões desaparecem
    expect(screen.queryByText('Restaurante Italiano')).not.toBeInTheDocument()
  })

  it('limpa o campo ao clicar no botão de limpar', () => {
    render(<SearchBar restaurants={mockRestaurants} />)
    
    // Digite "Italiano" no campo de pesquisa
    const searchInput = screen.getByRole('searchbox')
    fireEvent.change(searchInput, { target: { value: 'Italiano' } })
    
    // Clica no botão de limpar
    const clearButton = screen.getByRole('button', { name: /limpar/i })
    fireEvent.click(clearButton)
    
    // Verifica se o campo foi limpo
    expect(searchInput.value).toBe('')
  })
}) 