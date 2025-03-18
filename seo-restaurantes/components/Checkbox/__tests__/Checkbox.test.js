// Checkbox.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import Checkbox from '../index'

describe('Checkbox', () => {
  const mockOnChange = jest.fn()
  const mockOnBlur = jest.fn()
  const mockOnFocus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o checkbox corretamente', () => {
    render(<Checkbox label="Aceito os termos" />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toBeInTheDocument()
  })

  it('chama onChange quando clicado', () => {
    render(<Checkbox label="Aceito os termos" onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.click(checkbox)
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('chama onBlur quando perde o foco', () => {
    render(<Checkbox label="Aceito os termos" onBlur={mockOnBlur} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.blur(checkbox)
    
    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('chama onFocus quando recebe o foco', () => {
    render(<Checkbox label="Aceito os termos" onFocus={mockOnFocus} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.focus(checkbox)
    
    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('aplica o valor inicial', () => {
    render(<Checkbox label="Aceito os termos" checked />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toBeChecked()
  })

  it('aplica o label', () => {
    render(<Checkbox label="Aceito os termos" />)
    
    const label = screen.getByText(/aceito os termos/i)
    expect(label).toBeInTheDocument()
  })

  it('aplica o erro', () => {
    render(<Checkbox label="Aceito os termos" error="Campo obrigatório" />)
    
    const error = screen.getByText(/campo obrigatório/i)
    expect(error).toBeInTheDocument()
  })

  it('aplica o helper text', () => {
    render(<Checkbox label="Aceito os termos" helperText="Leia os termos antes de aceitar" />)
    
    const helper = screen.getByText(/leia os termos antes de aceitar/i)
    expect(helper).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-checkbox'
    render(<Checkbox label="Aceito os termos" className={customClass} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      color: '#333333',
    }
    render(<Checkbox label="Aceito os termos" style={customStyle} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toHaveStyle(customStyle)
  })

  it('é desabilitado quando disabled é true', () => {
    render(<Checkbox label="Aceito os termos" disabled />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toBeDisabled()
  })

  it('é obrigatório quando required é true', () => {
    render(<Checkbox label="Aceito os termos" required />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toBeRequired()
  })

  it('é indeterminado quando indeterminate é true', () => {
    render(<Checkbox label="Aceito os termos" indeterminate />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed')
  })

  it('é acessível para leitores de tela', () => {
    render(<Checkbox label="Aceito os termos" aria-label="Checkbox de termos" />)
    
    const checkbox = screen.getByRole('checkbox', { name: /checkbox de termos/i })
    expect(checkbox).toBeInTheDocument()
  })

  it('associa o label ao checkbox corretamente', () => {
    render(<Checkbox label="Aceito os termos" id="terms" />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    const label = screen.getByText(/aceito os termos/i)
    
    expect(checkbox).toHaveAttribute('id', 'terms')
    expect(label).toHaveAttribute('for', 'terms')
  })

  it('aplica o foco quando clica no label', () => {
    render(<Checkbox label="Aceito os termos" id="terms" />)
    
    const label = screen.getByText(/aceito os termos/i)
    fireEvent.click(label)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    expect(checkbox).toHaveFocus()
  })

  it('aplica o foco quando pressiona Tab', () => {
    render(<Checkbox label="Aceito os termos" />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    checkbox.focus()
    
    expect(checkbox).toHaveFocus()
  })

  it('aplica o foco quando pressiona Shift+Tab', () => {
    render(<Checkbox label="Aceito os termos" />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    checkbox.focus()
    
    expect(checkbox).toHaveFocus()
  })

  it('permite pressionar Espaço para ativar', () => {
    render(<Checkbox label="Aceito os termos" onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.keyDown(checkbox, { key: ' ' })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('permite pressionar Enter para ativar', () => {
    render(<Checkbox label="Aceito os termos" onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.keyDown(checkbox, { key: 'Enter' })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('não ativa quando pressiona outras teclas', () => {
    render(<Checkbox label="Aceito os termos" onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.keyDown(checkbox, { key: 'Tab' })
    
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('previne comportamento padrão ao pressionar Espaço', () => {
    render(<Checkbox label="Aceito os termos" onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    const event = fireEvent.keyDown(checkbox, { key: ' ' })
    
    expect(event.defaultPrevented).toBe(true)
  })

  it('previne comportamento padrão ao pressionar Enter', () => {
    render(<Checkbox label="Aceito os termos" onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    const event = fireEvent.keyDown(checkbox, { key: 'Enter' })
    
    expect(event.defaultPrevented).toBe(true)
  })

  it('alterna o estado quando clicado', () => {
    render(<Checkbox label="Aceito os termos" onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.click(checkbox)
    
    expect(checkbox).toBeChecked()
  })

  it('mantém o estado quando clicado em modo controlado', () => {
    render(<Checkbox label="Aceito os termos" checked onChange={mockOnChange} />)
    
    const checkbox = screen.getByRole('checkbox', { name: /aceito os termos/i })
    fireEvent.click(checkbox)
    
    expect(checkbox).toBeChecked()
  })
}) 