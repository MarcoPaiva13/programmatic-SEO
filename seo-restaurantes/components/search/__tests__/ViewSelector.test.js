// ViewSelector.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ViewSelector from '../ViewSelector'

describe('ViewSelector', () => {
  it('renderiza os botões de visualização corretamente', () => {
    render(<ViewSelector view="grid" onViewChange={() => {}} />)
    
    // Verifica se os botões estão presentes
    expect(screen.getByRole('button', { name: /grade/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /lista/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /mapa/i })).toBeInTheDocument()
  })

  it('destaca o botão da visualização atual', () => {
    render(<ViewSelector view="grid" onViewChange={() => {}} />)
    
    // Verifica se o botão da grade está destacado
    const gridButton = screen.getByRole('button', { name: /grade/i })
    expect(gridButton).toHaveClass('active')
    
    // Verifica se os outros botões não estão destacados
    expect(screen.getByRole('button', { name: /lista/i })).not.toHaveClass('active')
    expect(screen.getByRole('button', { name: /mapa/i })).not.toHaveClass('active')
  })

  it('chama a função onViewChange quando um botão é clicado', () => {
    const onViewChange = jest.fn()
    render(<ViewSelector view="grid" onViewChange={onViewChange} />)
    
    // Clica no botão de lista
    const listButton = screen.getByRole('button', { name: /lista/i })
    fireEvent.click(listButton)
    
    // Verifica se a função foi chamada com o valor correto
    expect(onViewChange).toHaveBeenCalledWith('list')
  })

  it('atualiza o destaque quando a visualização muda', () => {
    const { rerender } = render(<ViewSelector view="grid" onViewChange={() => {}} />)
    
    // Verifica se o botão da grade está destacado inicialmente
    expect(screen.getByRole('button', { name: /grade/i })).toHaveClass('active')
    
    // Muda para visualização de lista
    rerender(<ViewSelector view="list" onViewChange={() => {}} />)
    
    // Verifica se o botão da lista está destacado
    expect(screen.getByRole('button', { name: /lista/i })).toHaveClass('active')
    
    // Muda para visualização de mapa
    rerender(<ViewSelector view="map" onViewChange={() => {}} />)
    
    // Verifica se o botão do mapa está destacado
    expect(screen.getByRole('button', { name: /mapa/i })).toHaveClass('active')
  })

  it('mantém a acessibilidade dos botões', () => {
    render(<ViewSelector view="grid" onViewChange={() => {}} />)
    
    // Verifica se os botões têm os atributos de acessibilidade corretos
    const gridButton = screen.getByRole('button', { name: /grade/i })
    expect(gridButton).toHaveAttribute('aria-label', 'Visualização em grade')
    expect(gridButton).toHaveAttribute('aria-pressed', 'true')
    
    const listButton = screen.getByRole('button', { name: /lista/i })
    expect(listButton).toHaveAttribute('aria-label', 'Visualização em lista')
    expect(listButton).toHaveAttribute('aria-pressed', 'false')
    
    const mapButton = screen.getByRole('button', { name: /mapa/i })
    expect(mapButton).toHaveAttribute('aria-label', 'Visualização em mapa')
    expect(mapButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('atualiza os atributos de acessibilidade quando a visualização muda', () => {
    const { rerender } = render(<ViewSelector view="grid" onViewChange={() => {}} />)
    
    // Verifica o estado inicial
    expect(screen.getByRole('button', { name: /grade/i })).toHaveAttribute('aria-pressed', 'true')
    
    // Muda para visualização de lista
    rerender(<ViewSelector view="list" onViewChange={() => {}} />)
    
    // Verifica se os atributos foram atualizados
    expect(screen.getByRole('button', { name: /grade/i })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: /lista/i })).toHaveAttribute('aria-pressed', 'true')
  })

  it('exibe os ícones corretos para cada visualização', () => {
    render(<ViewSelector view="grid" onViewChange={() => {}} />)
    
    // Verifica se os ícones estão presentes
    expect(screen.getByTestId('grid-icon')).toBeInTheDocument()
    expect(screen.getByTestId('list-icon')).toBeInTheDocument()
    expect(screen.getByTestId('map-icon')).toBeInTheDocument()
  })
}) 