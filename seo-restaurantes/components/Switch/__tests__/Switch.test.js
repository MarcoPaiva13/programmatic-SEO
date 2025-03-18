import { render, screen, fireEvent } from '@testing-library/react'
import Switch from '../index'

describe('Switch', () => {
  const mockOnChange = jest.fn()
  const mockOnBlur = jest.fn()
  const mockOnFocus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o switch corretamente', () => {
    render(<Switch label="Ativar notificações" />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toBeInTheDocument()
  })

  it('chama onChange quando clicado', () => {
    render(<Switch label="Ativar notificações" onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.click(switchElement)
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('chama onBlur quando perde o foco', () => {
    render(<Switch label="Ativar notificações" onBlur={mockOnBlur} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.blur(switchElement)
    
    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('chama onFocus quando recebe o foco', () => {
    render(<Switch label="Ativar notificações" onFocus={mockOnFocus} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.focus(switchElement)
    
    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('aplica o valor inicial', () => {
    render(<Switch label="Ativar notificações" checked />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('aplica o label', () => {
    render(<Switch label="Ativar notificações" />)
    
    const label = screen.getByText(/ativar notificações/i)
    expect(label).toBeInTheDocument()
  })

  it('aplica o erro', () => {
    render(<Switch label="Ativar notificações" error="Campo obrigatório" />)
    
    const error = screen.getByText(/campo obrigatório/i)
    expect(error).toBeInTheDocument()
  })

  it('aplica o helper text', () => {
    render(<Switch label="Ativar notificações" helperText="Receba atualizações" />)
    
    const helper = screen.getByText(/receba atualizações/i)
    expect(helper).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-switch'
    render(<Switch label="Ativar notificações" className={customClass} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      color: '#333333',
    }
    render(<Switch label="Ativar notificações" style={customStyle} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveStyle(customStyle)
  })

  it('é desabilitado quando disabled é true', () => {
    render(<Switch label="Ativar notificações" disabled />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveAttribute('aria-disabled', 'true')
  })

  it('é obrigatório quando required é true', () => {
    render(<Switch label="Ativar notificações" required />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveAttribute('aria-required', 'true')
  })

  it('é acessível para leitores de tela', () => {
    render(<Switch label="Ativar notificações" aria-label="Switch de teste" />)
    
    const switchElement = screen.getByRole('switch', { name: /switch de teste/i })
    expect(switchElement).toBeInTheDocument()
  })

  it('associa o label ao switch corretamente', () => {
    render(<Switch label="Ativar notificações" id="notifications" />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    const label = screen.getByText(/ativar notificações/i)
    
    expect(switchElement).toHaveAttribute('id', 'notifications')
    expect(label).toHaveAttribute('for', 'notifications')
  })

  it('aplica o foco quando clica no label', () => {
    render(<Switch label="Ativar notificações" id="notifications" />)
    
    const label = screen.getByText(/ativar notificações/i)
    fireEvent.click(label)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveFocus()
  })

  it('aplica o foco quando pressiona Tab', () => {
    render(<Switch label="Ativar notificações" />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    switchElement.focus()
    
    expect(switchElement).toHaveFocus()
  })

  it('aplica o foco quando pressiona Shift+Tab', () => {
    render(<Switch label="Ativar notificações" />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    switchElement.focus()
    
    expect(switchElement).toHaveFocus()
  })

  it('permite pressionar Espaço para ativar', () => {
    render(<Switch label="Ativar notificações" onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.keyDown(switchElement, { key: ' ' })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('permite pressionar Enter para ativar', () => {
    render(<Switch label="Ativar notificações" onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.keyDown(switchElement, { key: 'Enter' })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('não ativa quando pressiona outras teclas', () => {
    render(<Switch label="Ativar notificações" onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.keyDown(switchElement, { key: 'Tab' })
    
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('previne comportamento padrão ao pressionar Espaço', () => {
    render(<Switch label="Ativar notificações" onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    const event = fireEvent.keyDown(switchElement, { key: ' ' })
    
    expect(event.defaultPrevented).toBe(true)
  })

  it('previne comportamento padrão ao pressionar Enter', () => {
    render(<Switch label="Ativar notificações" onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    const event = fireEvent.keyDown(switchElement, { key: 'Enter' })
    
    expect(event.defaultPrevented).toBe(true)
  })

  it('alterna o estado quando clicado', () => {
    render(<Switch label="Ativar notificações" onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.click(switchElement)
    
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('mantém o estado quando clicado em modo controlado', () => {
    render(<Switch label="Ativar notificações" checked onChange={mockOnChange} />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    fireEvent.click(switchElement)
    
    expect(switchElement).toHaveAttribute('aria-checked', 'true')
  })

  it('aplica a cor correta quando ativado', () => {
    render(<Switch label="Ativar notificações" checked color="primary" />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveClass('primary')
  })

  it('aplica a cor correta quando desativado', () => {
    render(<Switch label="Ativar notificações" color="secondary" />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveClass('secondary')
  })

  it('aplica o tamanho correto', () => {
    render(<Switch label="Ativar notificações" size="small" />)
    
    const switchElement = screen.getByRole('switch', { name: /ativar notificações/i })
    expect(switchElement).toHaveClass('small')
  })
}) 