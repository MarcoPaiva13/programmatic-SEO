import { render, screen, fireEvent } from '@testing-library/react'
import Slider from '../index'

describe('Slider', () => {
  const mockOnChange = jest.fn()
  const mockOnBlur = jest.fn()
  const mockOnFocus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o slider corretamente', () => {
    render(<Slider label="Volume" />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toBeInTheDocument()
  })

  it('chama onChange quando o valor muda', () => {
    render(<Slider label="Volume" onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.change(slider, { target: { value: '50' } })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('chama onBlur quando perde o foco', () => {
    render(<Slider label="Volume" onBlur={mockOnBlur} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.blur(slider)
    
    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('chama onFocus quando recebe o foco', () => {
    render(<Slider label="Volume" onFocus={mockOnFocus} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.focus(slider)
    
    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('aplica o valor inicial', () => {
    render(<Slider label="Volume" value={50} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toHaveValue('50')
  })

  it('aplica o valor mínimo', () => {
    render(<Slider label="Volume" min={0} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toHaveAttribute('min', '0')
  })

  it('aplica o valor máximo', () => {
    render(<Slider label="Volume" max={100} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toHaveAttribute('max', '100')
  })

  it('aplica o passo', () => {
    render(<Slider label="Volume" step={10} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toHaveAttribute('step', '10')
  })

  it('aplica o label', () => {
    render(<Slider label="Volume" />)
    
    const label = screen.getByText(/volume/i)
    expect(label).toBeInTheDocument()
  })

  it('aplica o erro', () => {
    render(<Slider label="Volume" error="Valor inválido" />)
    
    const error = screen.getByText(/valor inválido/i)
    expect(error).toBeInTheDocument()
  })

  it('aplica o helper text', () => {
    render(<Slider label="Volume" helperText="Ajuste o volume" />)
    
    const helper = screen.getByText(/ajuste o volume/i)
    expect(helper).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-slider'
    render(<Slider label="Volume" className={customClass} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      color: '#333333',
    }
    render(<Slider label="Volume" style={customStyle} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toHaveStyle(customStyle)
  })

  it('é desabilitado quando disabled é true', () => {
    render(<Slider label="Volume" disabled />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toBeDisabled()
  })

  it('é obrigatório quando required é true', () => {
    render(<Slider label="Volume" required />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toBeRequired()
  })

  it('é acessível para leitores de tela', () => {
    render(<Slider label="Volume" aria-label="Slider de volume" />)
    
    const slider = screen.getByRole('slider', { name: /slider de volume/i })
    expect(slider).toBeInTheDocument()
  })

  it('associa o label ao slider corretamente', () => {
    render(<Slider label="Volume" id="volume" />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    const label = screen.getByText(/volume/i)
    
    expect(slider).toHaveAttribute('id', 'volume')
    expect(label).toHaveAttribute('for', 'volume')
  })

  it('aplica o foco quando clica no label', () => {
    render(<Slider label="Volume" id="volume" />)
    
    const label = screen.getByText(/volume/i)
    fireEvent.click(label)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    expect(slider).toHaveFocus()
  })

  it('aplica o foco quando pressiona Tab', () => {
    render(<Slider label="Volume" />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    slider.focus()
    
    expect(slider).toHaveFocus()
  })

  it('aplica o foco quando pressiona Shift+Tab', () => {
    render(<Slider label="Volume" />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    slider.focus()
    
    expect(slider).toHaveFocus()
  })

  it('permite pressionar setas para ajustar o valor', () => {
    render(<Slider label="Volume" min={0} max={100} step={10} value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('não permite valor menor que o mínimo', () => {
    render(<Slider label="Volume" min={0} max={100} value={0} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.change(slider, { target: { value: '-10' } })
    
    expect(slider).toHaveValue('0')
  })

  it('não permite valor maior que o máximo', () => {
    render(<Slider label="Volume" min={0} max={100} value={100} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.change(slider, { target: { value: '110' } })
    
    expect(slider).toHaveValue('100')
  })

  it('aplica o valor correto ao arrastar', () => {
    render(<Slider label="Volume" min={0} max={100} value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.change(slider, { target: { value: '75' } })
    
    expect(slider).toHaveValue('75')
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('aplica o valor correto ao clicar', () => {
    render(<Slider label="Volume" min={0} max={100} value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.click(slider, { clientX: 75 })
    
    expect(slider).toHaveValue('75')
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('aplica o valor correto ao usar o teclado', () => {
    render(<Slider label="Volume" min={0} max={100} step={10} value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.keyDown(slider, { key: 'ArrowRight' })
    
    expect(slider).toHaveValue('60')
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('aplica o valor correto ao usar o mouse wheel', () => {
    render(<Slider label="Volume" min={0} max={100} step={10} value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.wheel(slider, { deltaY: 100 })
    
    expect(slider).toHaveValue('60')
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('aplica o valor correto ao usar o touch', () => {
    render(<Slider label="Volume" min={0} max={100} value={50} onChange={mockOnChange} />)
    
    const slider = screen.getByRole('slider', { name: /volume/i })
    fireEvent.touchStart(slider, { touches: [{ clientX: 0 }] })
    fireEvent.touchMove(slider, { touches: [{ clientX: 75 }] })
    fireEvent.touchEnd(slider)
    
    expect(slider).toHaveValue('75')
    expect(mockOnChange).toHaveBeenCalled()
  })
}) 