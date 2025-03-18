import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../index'

describe('Button', () => {
  const mockOnClick = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o botão corretamente', () => {
    render(<Button>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toBeInTheDocument()
  })

  it('chama onClick quando clicado', () => {
    render(<Button onClick={mockOnClick}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    fireEvent.click(button)
    
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('não chama onClick quando desabilitado', () => {
    render(
      <Button onClick={mockOnClick} disabled>
        Clique aqui
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    fireEvent.click(button)
    
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('aplica a variante padrão', () => {
    render(<Button>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveClass('primary')
  })

  it('aplica a variante secundária', () => {
    render(<Button variant="secondary">Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveClass('secondary')
  })

  it('aplica a variante outline', () => {
    render(<Button variant="outline">Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveClass('outline')
  })

  it('aplica o tamanho padrão', () => {
    render(<Button>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveClass('medium')
  })

  it('aplica o tamanho pequeno', () => {
    render(<Button size="small">Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveClass('small')
  })

  it('aplica o tamanho grande', () => {
    render(<Button size="large">Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveClass('large')
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-button'
    render(<Button className={customClass}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#ff0000',
      color: '#ffffff',
    }
    render(<Button style={customStyle}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toHaveStyle(customStyle)
  })

  it('exibe um ícone quando fornecido', () => {
    render(
      <Button icon={<span data-testid="icon">🔍</span>}>
        Buscar
      </Button>
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('exibe o ícone à esquerda do texto por padrão', () => {
    render(
      <Button icon={<span data-testid="icon">🔍</span>}>
        Buscar
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /buscar/i })
    const icon = screen.getByTestId('icon')
    
    expect(button.firstChild).toBe(icon)
  })

  it('exibe o ícone à direita do texto quando iconPosition é right', () => {
    render(
      <Button icon={<span data-testid="icon">🔍</span>} iconPosition="right">
        Buscar
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /buscar/i })
    const icon = screen.getByTestId('icon')
    
    expect(button.lastChild).toBe(icon)
  })

  it('exibe um indicador de carregamento quando loading é true', () => {
    render(<Button loading>Clique aqui</Button>)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('desabilita o botão quando loading é true', () => {
    render(<Button loading>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    expect(button).toBeDisabled()
  })

  it('não chama onClick quando loading é true', () => {
    render(
      <Button onClick={mockOnClick} loading>
        Clique aqui
      </Button>
    )
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    fireEvent.click(button)
    
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('é acessível para leitores de tela', () => {
    render(<Button aria-label="Botão de teste">Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /botão de teste/i })
    expect(button).toBeInTheDocument()
  })

  it('permite pressionar Enter para ativar', () => {
    render(<Button onClick={mockOnClick}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    fireEvent.keyDown(button, { key: 'Enter' })
    
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('permite pressionar Espaço para ativar', () => {
    render(<Button onClick={mockOnClick}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    fireEvent.keyDown(button, { key: ' ' })
    
    expect(mockOnClick).toHaveBeenCalled()
  })

  it('não ativa quando pressiona outras teclas', () => {
    render(<Button onClick={mockOnClick}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    fireEvent.keyDown(button, { key: 'Tab' })
    
    expect(mockOnClick).not.toHaveBeenCalled()
  })

  it('previne comportamento padrão ao pressionar Enter', () => {
    render(<Button onClick={mockOnClick}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    const event = fireEvent.keyDown(button, { key: 'Enter' })
    
    expect(event.defaultPrevented).toBe(true)
  })

  it('previne comportamento padrão ao pressionar Espaço', () => {
    render(<Button onClick={mockOnClick}>Clique aqui</Button>)
    
    const button = screen.getByRole('button', { name: /clique aqui/i })
    const event = fireEvent.keyDown(button, { key: ' ' })
    
    expect(event.defaultPrevented).toBe(true)
  })
}) 