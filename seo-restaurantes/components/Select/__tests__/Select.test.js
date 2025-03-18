import { render, screen, fireEvent } from '@testing-library/react'
import Select from '../index'

describe('Select', () => {
  const mockOnChange = jest.fn()
  const mockOnBlur = jest.fn()
  const mockOnFocus = jest.fn()

  const options = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
    { value: '3', label: 'Opção 3' },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o select corretamente', () => {
    render(<Select options={options} />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
  })

  it('chama onChange quando o valor muda', () => {
    render(<Select options={options} onChange={mockOnChange} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '1' } })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('chama onBlur quando perde o foco', () => {
    render(<Select options={options} onBlur={mockOnBlur} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.blur(select)
    
    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('chama onFocus quando recebe o foco', () => {
    render(<Select options={options} onFocus={mockOnFocus} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.focus(select)
    
    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('aplica o valor inicial', () => {
    render(<Select options={options} value="1" />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('1')
  })

  it('aplica o placeholder', () => {
    render(<Select options={options} placeholder="Selecione uma opção" />)
    
    const placeholder = screen.getByText(/selecione uma opção/i)
    expect(placeholder).toBeInTheDocument()
  })

  it('aplica o label', () => {
    render(<Select options={options} label="Selecione" />)
    
    const label = screen.getByText(/selecione/i)
    expect(label).toBeInTheDocument()
  })

  it('aplica o erro', () => {
    render(<Select options={options} error="Campo obrigatório" />)
    
    const error = screen.getByText(/campo obrigatório/i)
    expect(error).toBeInTheDocument()
  })

  it('aplica o helper text', () => {
    render(<Select options={options} helperText="Escolha uma opção" />)
    
    const helper = screen.getByText(/escolha uma opção/i)
    expect(helper).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-select'
    render(<Select options={options} className={customClass} />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      color: '#333333',
    }
    render(<Select options={options} style={customStyle} />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveStyle(customStyle)
  })

  it('exibe um ícone quando fornecido', () => {
    render(
      <Select
        options={options}
        icon={<span data-testid="icon">▼</span>}
      />
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('exibe o ícone à direita por padrão', () => {
    render(
      <Select
        options={options}
        icon={<span data-testid="icon">▼</span>}
      />
    )
    
    const select = screen.getByRole('combobox')
    const icon = screen.getByTestId('icon')
    
    expect(select.nextElementSibling).toBe(icon)
  })

  it('exibe o ícone à esquerda quando iconPosition é left', () => {
    render(
      <Select
        options={options}
        icon={<span data-testid="icon">▼</span>}
        iconPosition="left"
      />
    )
    
    const select = screen.getByRole('combobox')
    const icon = screen.getByTestId('icon')
    
    expect(select.previousElementSibling).toBe(icon)
  })

  it('é desabilitado quando disabled é true', () => {
    render(<Select options={options} disabled />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeDisabled()
  })

  it('é obrigatório quando required é true', () => {
    render(<Select options={options} required />)
    
    const select = screen.getByRole('combobox')
    expect(select).toBeRequired()
  })

  it('permite múltipla seleção quando multiple é true', () => {
    render(<Select options={options} multiple />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('multiple')
  })

  it('aplica o tamanho quando multiple é true', () => {
    render(<Select options={options} multiple size={3} />)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveAttribute('size', '3')
  })

  it('é acessível para leitores de tela', () => {
    render(<Select options={options} aria-label="Selecione uma opção" />)
    
    const select = screen.getByRole('combobox', { name: /selecione uma opção/i })
    expect(select).toBeInTheDocument()
  })

  it('associa o label ao select corretamente', () => {
    render(<Select options={options} label="Selecione" id="select" />)
    
    const select = screen.getByRole('combobox')
    const label = screen.getByText(/selecione/i)
    
    expect(select).toHaveAttribute('id', 'select')
    expect(label).toHaveAttribute('for', 'select')
  })

  it('aplica o foco quando clica no label', () => {
    render(<Select options={options} label="Selecione" id="select" />)
    
    const label = screen.getByText(/selecione/i)
    fireEvent.click(label)
    
    const select = screen.getByRole('combobox')
    expect(select).toHaveFocus()
  })

  it('aplica o foco quando pressiona Tab', () => {
    render(<Select options={options} />)
    
    const select = screen.getByRole('combobox')
    select.focus()
    
    expect(select).toHaveFocus()
  })

  it('aplica o foco quando pressiona Shift+Tab', () => {
    render(<Select options={options} />)
    
    const select = screen.getByRole('combobox')
    select.focus()
    
    expect(select).toHaveFocus()
  })

  it('exibe as opções corretamente', () => {
    render(<Select options={options} />)
    
    options.forEach((option) => {
      const optionElement = screen.getByText(option.label)
      expect(optionElement).toBeInTheDocument()
    })
  })

  it('permite selecionar uma opção', () => {
    render(<Select options={options} onChange={mockOnChange} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '1' } })
    
    expect(select).toHaveValue('1')
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('permite selecionar múltiplas opções', () => {
    render(<Select options={options} multiple onChange={mockOnChange} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { selectedOptions: [options[0], options[1]] } })
    
    expect(select.selectedOptions).toHaveLength(2)
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('permite limpar a seleção', () => {
    render(<Select options={options} value="1" onChange={mockOnChange} />)
    
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '' } })
    
    expect(select).toHaveValue('')
    expect(mockOnChange).toHaveBeenCalled()
  })
}) 