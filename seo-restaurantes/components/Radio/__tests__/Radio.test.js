// Radio.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import Radio from '../index'

describe('Radio', () => {
  const mockOnChange = jest.fn()
  const mockOnBlur = jest.fn()
  const mockOnFocus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o radio corretamente', () => {
    render(<Radio label="Opção 1" name="test" />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    expect(radio).toBeInTheDocument()
  })

  it('chama onChange quando clicado', () => {
    render(<Radio label="Opção 1" name="test" onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.click(radio)
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('chama onBlur quando perde o foco', () => {
    render(<Radio label="Opção 1" name="test" onBlur={mockOnBlur} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.blur(radio)
    
    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('chama onFocus quando recebe o foco', () => {
    render(<Radio label="Opção 1" name="test" onFocus={mockOnFocus} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.focus(radio)
    
    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('aplica o valor inicial', () => {
    render(<Radio label="Opção 1" name="test" checked />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    expect(radio).toBeChecked()
  })

  it('aplica o label', () => {
    render(<Radio label="Opção 1" name="test" />)
    
    const label = screen.getByText(/opção 1/i)
    expect(label).toBeInTheDocument()
  })

  it('aplica o erro', () => {
    render(<Radio label="Opção 1" name="test" error="Campo obrigatório" />)
    
    const error = screen.getByText(/campo obrigatório/i)
    expect(error).toBeInTheDocument()
  })

  it('aplica o helper text', () => {
    render(<Radio label="Opção 1" name="test" helperText="Selecione uma opção" />)
    
    const helper = screen.getByText(/selecione uma opção/i)
    expect(helper).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-radio'
    render(<Radio label="Opção 1" name="test" className={customClass} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    expect(radio).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      color: '#333333',
    }
    render(<Radio label="Opção 1" name="test" style={customStyle} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    expect(radio).toHaveStyle(customStyle)
  })

  it('é desabilitado quando disabled é true', () => {
    render(<Radio label="Opção 1" name="test" disabled />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    expect(radio).toBeDisabled()
  })

  it('é obrigatório quando required é true', () => {
    render(<Radio label="Opção 1" name="test" required />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    expect(radio).toBeRequired()
  })

  it('é acessível para leitores de tela', () => {
    render(<Radio label="Opção 1" name="test" aria-label="Radio de teste" />)
    
    const radio = screen.getByRole('radio', { name: /radio de teste/i })
    expect(radio).toBeInTheDocument()
  })

  it('associa o label ao radio corretamente', () => {
    render(<Radio label="Opção 1" name="test" id="radio1" />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    const label = screen.getByText(/opção 1/i)
    
    expect(radio).toHaveAttribute('id', 'radio1')
    expect(label).toHaveAttribute('for', 'radio1')
  })

  it('aplica o foco quando clica no label', () => {
    render(<Radio label="Opção 1" name="test" id="radio1" />)
    
    const label = screen.getByText(/opção 1/i)
    fireEvent.click(label)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    expect(radio).toHaveFocus()
  })

  it('aplica o foco quando pressiona Tab', () => {
    render(<Radio label="Opção 1" name="test" />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    radio.focus()
    
    expect(radio).toHaveFocus()
  })

  it('aplica o foco quando pressiona Shift+Tab', () => {
    render(<Radio label="Opção 1" name="test" />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    radio.focus()
    
    expect(radio).toHaveFocus()
  })

  it('permite pressionar Espaço para ativar', () => {
    render(<Radio label="Opção 1" name="test" onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.keyDown(radio, { key: ' ' })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('permite pressionar Enter para ativar', () => {
    render(<Radio label="Opção 1" name="test" onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.keyDown(radio, { key: 'Enter' })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('não ativa quando pressiona outras teclas', () => {
    render(<Radio label="Opção 1" name="test" onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.keyDown(radio, { key: 'Tab' })
    
    expect(mockOnChange).not.toHaveBeenCalled()
  })

  it('previne comportamento padrão ao pressionar Espaço', () => {
    render(<Radio label="Opção 1" name="test" onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    const event = fireEvent.keyDown(radio, { key: ' ' })
    
    expect(event.defaultPrevented).toBe(true)
  })

  it('previne comportamento padrão ao pressionar Enter', () => {
    render(<Radio label="Opção 1" name="test" onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    const event = fireEvent.keyDown(radio, { key: 'Enter' })
    
    expect(event.defaultPrevented).toBe(true)
  })

  it('alterna o estado quando clicado', () => {
    render(<Radio label="Opção 1" name="test" onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.click(radio)
    
    expect(radio).toBeChecked()
  })

  it('mantém o estado quando clicado em modo controlado', () => {
    render(<Radio label="Opção 1" name="test" checked onChange={mockOnChange} />)
    
    const radio = screen.getByRole('radio', { name: /opção 1/i })
    fireEvent.click(radio)
    
    expect(radio).toBeChecked()
  })

  it('agrupa corretamente com outros radios do mesmo name', () => {
    render(
      <div>
        <Radio label="Opção 1" name="test" />
        <Radio label="Opção 2" name="test" />
      </div>
    )
    
    const radio1 = screen.getByRole('radio', { name: /opção 1/i })
    const radio2 = screen.getByRole('radio', { name: /opção 2/i })
    
    expect(radio1).toHaveAttribute('name', 'test')
    expect(radio2).toHaveAttribute('name', 'test')
  })

  it('permite apenas uma opção selecionada por grupo', () => {
    render(
      <div>
        <Radio label="Opção 1" name="test" checked />
        <Radio label="Opção 2" name="test" />
      </div>
    )
    
    const radio1 = screen.getByRole('radio', { name: /opção 1/i })
    const radio2 = screen.getByRole('radio', { name: /opção 2/i })
    
    expect(radio1).toBeChecked()
    expect(radio2).not.toBeChecked()
  })
}) 