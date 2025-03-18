// SavedSearches.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import SavedSearches from '../SavedSearches'

// Mock dos dados de buscas salvas
const mockSavedSearches = [
  {
    id: 1,
    name: 'Restaurantes Italianos em SP',
    filters: {
      cuisine: ['Italiana'],
      city: ['São Paulo'],
      priceRange: ['Moderado'],
      minRating: 4.0,
    },
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 2,
    name: 'Sushi Premium no Rio',
    filters: {
      cuisine: ['Japonesa'],
      city: ['Rio de Janeiro'],
      priceRange: ['Premium'],
      minRating: 4.5,
    },
    createdAt: '2024-03-19T15:30:00Z',
  },
]

describe('SavedSearches', () => {
  it('renderiza a lista de buscas salvas corretamente', () => {
    render(<SavedSearches savedSearches={mockSavedSearches} />)
    
    // Verifica se os títulos das buscas estão presentes
    expect(screen.getByText('Restaurantes Italianos em SP')).toBeInTheDocument()
    expect(screen.getByText('Sushi Premium no Rio')).toBeInTheDocument()
  })

  it('exibe os filtros de cada busca salva', () => {
    render(<SavedSearches savedSearches={mockSavedSearches} />)
    
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

  it('exibe a data de criação de cada busca', () => {
    render(<SavedSearches savedSearches={mockSavedSearches} />)
    
    // Verifica se as datas estão presentes
    expect(screen.getByText('20/03/2024')).toBeInTheDocument()
    expect(screen.getByText('19/03/2024')).toBeInTheDocument()
  })

  it('chama a função onLoadSearch quando uma busca é clicada', () => {
    const onLoadSearch = jest.fn()
    render(<SavedSearches savedSearches={mockSavedSearches} onLoadSearch={onLoadSearch} />)
    
    // Clica na primeira busca salva
    const firstSearch = screen.getByText('Restaurantes Italianos em SP')
    fireEvent.click(firstSearch)
    
    // Verifica se a função foi chamada com os filtros corretos
    expect(onLoadSearch).toHaveBeenCalledWith(mockSavedSearches[0].filters)
  })

  it('chama a função onDeleteSearch quando o botão de excluir é clicado', () => {
    const onDeleteSearch = jest.fn()
    render(<SavedSearches savedSearches={mockSavedSearches} onDeleteSearch={onDeleteSearch} />)
    
    // Clica no botão de excluir da primeira busca
    const deleteButton = screen.getAllByRole('button', { name: /excluir/i })[0]
    fireEvent.click(deleteButton)
    
    // Verifica se a função foi chamada com o ID correto
    expect(onDeleteSearch).toHaveBeenCalledWith(mockSavedSearches[0].id)
  })

  it('exibe uma mensagem quando não há buscas salvas', () => {
    render(<SavedSearches savedSearches={[]} />)
    
    // Verifica se a mensagem é exibida
    expect(screen.getByText('Nenhuma busca salva')).toBeInTheDocument()
  })

  it('exibe um botão para salvar a busca atual', () => {
    render(<SavedSearches savedSearches={mockSavedSearches} />)
    
    // Verifica se o botão está presente
    expect(screen.getByText('Salvar Busca Atual')).toBeInTheDocument()
  })

  it('chama a função onSaveSearch quando o botão de salvar é clicado', () => {
    const onSaveSearch = jest.fn()
    render(<SavedSearches savedSearches={mockSavedSearches} onSaveSearch={onSaveSearch} />)
    
    // Clica no botão de salvar
    const saveButton = screen.getByText('Salvar Busca Atual')
    fireEvent.click(saveButton)
    
    // Verifica se a função foi chamada
    expect(onSaveSearch).toHaveBeenCalled()
  })

  it('exibe um modal de confirmação ao tentar excluir uma busca', () => {
    const onDeleteSearch = jest.fn()
    render(<SavedSearches savedSearches={mockSavedSearches} onDeleteSearch={onDeleteSearch} />)
    
    // Clica no botão de excluir da primeira busca
    const deleteButton = screen.getAllByRole('button', { name: /excluir/i })[0]
    fireEvent.click(deleteButton)
    
    // Verifica se o modal de confirmação é exibido
    expect(screen.getByText('Confirmar Exclusão')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza que deseja excluir esta busca salva?')).toBeInTheDocument()
  })

  it('cancela a exclusão quando o botão de cancelar é clicado', () => {
    const onDeleteSearch = jest.fn()
    render(<SavedSearches savedSearches={mockSavedSearches} onDeleteSearch={onDeleteSearch} />)
    
    // Clica no botão de excluir
    const deleteButton = screen.getAllByRole('button', { name: /excluir/i })[0]
    fireEvent.click(deleteButton)
    
    // Clica no botão de cancelar
    const cancelButton = screen.getByText('Cancelar')
    fireEvent.click(cancelButton)
    
    // Verifica se o modal foi fechado
    expect(screen.queryByText('Confirmar Exclusão')).not.toBeInTheDocument()
    // Verifica se a função de exclusão não foi chamada
    expect(onDeleteSearch).not.toHaveBeenCalled()
  })
}) 