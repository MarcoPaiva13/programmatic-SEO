// SearchHistory.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import SearchHistory from '../SearchHistory'

// Mock dos dados do histórico de busca
const mockSearchHistory = [
  {
    id: 1,
    query: 'Restaurantes Italianos em SP',
    filters: {
      cuisine: ['Italiana'],
      city: ['São Paulo'],
      priceRange: ['Moderado'],
      minRating: 4.0,
    },
    timestamp: '2024-03-20T10:00:00Z',
  },
  {
    id: 2,
    query: 'Sushi Premium no Rio',
    filters: {
      cuisine: ['Japonesa'],
      city: ['Rio de Janeiro'],
      priceRange: ['Premium'],
      minRating: 4.5,
    },
    timestamp: '2024-03-19T15:30:00Z',
  },
]

describe('SearchHistory', () => {
  it('renderiza o histórico de busca corretamente', () => {
    render(<SearchHistory searchHistory={mockSearchHistory} />)
    
    // Verifica se as buscas estão listadas
    expect(screen.getByText('Restaurantes Italianos em SP')).toBeInTheDocument()
    expect(screen.getByText('Sushi Premium no Rio')).toBeInTheDocument()
  })

  it('exibe os filtros de cada busca no histórico', () => {
    render(<SearchHistory searchHistory={mockSearchHistory} />)
    
    // Verifica se os filtros da primeira busca estão presentes
    expect(screen.getByText('Italiana')).toBeInTheDocument()
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Moderado')).toBeInTheDocument()
    expect(screen.getByText('Avaliação mínima: 4.0')).toBeInTheDocument()
    
    // Verifica se os filtros da segunda busca estão presentes
    expect(screen.getByText('Japonesa')).toBeInTheDocument()
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Avaliação mínima: 4.5')).toBeInTheDocument()
  })

  it('exibe o horário de cada busca', () => {
    render(<SearchHistory searchHistory={mockSearchHistory} />)
    
    // Verifica se os horários estão presentes
    expect(screen.getByText('10:00')).toBeInTheDocument()
    expect(screen.getByText('15:30')).toBeInTheDocument()
  })

  it('chama a função onLoadSearch quando uma busca é clicada', () => {
    const onLoadSearch = jest.fn()
    render(<SearchHistory searchHistory={mockSearchHistory} onLoadSearch={onLoadSearch} />)
    
    // Clica na primeira busca do histórico
    const firstSearch = screen.getByText('Restaurantes Italianos em SP')
    fireEvent.click(firstSearch)
    
    // Verifica se a função foi chamada com os filtros corretos
    expect(onLoadSearch).toHaveBeenCalledWith(mockSearchHistory[0].filters)
  })

  it('chama a função onClearHistory quando o botão de limpar é clicado', () => {
    const onClearHistory = jest.fn()
    render(<SearchHistory searchHistory={mockSearchHistory} onClearHistory={onClearHistory} />)
    
    // Clica no botão de limpar histórico
    const clearButton = screen.getByText('Limpar Histórico')
    fireEvent.click(clearButton)
    
    // Verifica se a função foi chamada
    expect(onClearHistory).toHaveBeenCalled()
  })

  it('exibe uma mensagem quando não há histórico de busca', () => {
    render(<SearchHistory searchHistory={[]} />)
    
    // Verifica se a mensagem é exibida
    expect(screen.getByText('Nenhuma busca recente')).toBeInTheDocument()
  })

  it('exibe um modal de confirmação ao tentar limpar o histórico', () => {
    const onClearHistory = jest.fn()
    render(<SearchHistory searchHistory={mockSearchHistory} onClearHistory={onClearHistory} />)
    
    // Clica no botão de limpar histórico
    const clearButton = screen.getByText('Limpar Histórico')
    fireEvent.click(clearButton)
    
    // Verifica se o modal de confirmação é exibido
    expect(screen.getByText('Confirmar Limpeza')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza que deseja limpar todo o histórico de busca?')).toBeInTheDocument()
  })

  it('cancela a limpeza quando o botão de cancelar é clicado', () => {
    const onClearHistory = jest.fn()
    render(<SearchHistory searchHistory={mockSearchHistory} onClearHistory={onClearHistory} />)
    
    // Clica no botão de limpar histórico
    const clearButton = screen.getByText('Limpar Histórico')
    fireEvent.click(clearButton)
    
    // Clica no botão de cancelar
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    
    // Verifica se o modal foi fechado
    expect(screen.queryByText('Confirmar Limpeza')).not.toBeInTheDocument()
    // Verifica se a função de limpeza não foi chamada
    expect(onClearHistory).not.toHaveBeenCalled()
  })

  it('limita o número de buscas exibidas ao máximo definido', () => {
    const maxHistoryItems = 1
    render(<SearchHistory searchHistory={mockSearchHistory} maxHistoryItems={maxHistoryItems} />)
    
    // Verifica se apenas a busca mais recente é exibida
    expect(screen.getByText('Restaurantes Italianos em SP')).toBeInTheDocument()
    expect(screen.queryByText('Sushi Premium no Rio')).not.toBeInTheDocument()
  })
}) 