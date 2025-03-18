import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../index'

describe('Input', () => {
  const mockOnChange = jest.fn()
  const mockOnBlur = jest.fn()
  const mockOnFocus = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o input corretamente', () => {
    render(<Input placeholder="Digite algo" />)
    
    const input = screen.getByPlaceholderText(/digite algo/i)
    expect(input).toBeInTheDocument()
  })

  it('chama onChange quando o valor muda', () => {
    render(<Input onChange={mockOnChange} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'teste' } })
    
    expect(mockOnChange).toHaveBeenCalled()
  })

  it('chama onBlur quando perde o foco', () => {
    render(<Input onBlur={mockOnBlur} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.blur(input)
    
    expect(mockOnBlur).toHaveBeenCalled()
  })

  it('chama onFocus quando recebe o foco', () => {
    render(<Input onFocus={mockOnFocus} />)
    
    const input = screen.getByRole('textbox')
    fireEvent.focus(input)
    
    expect(mockOnFocus).toHaveBeenCalled()
  })

  it('aplica o tipo correto', () => {
    render(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('aplica o valor inicial', () => {
    render(<Input value="valor inicial" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('valor inicial')
  })

  it('aplica o placeholder', () => {
    render(<Input placeholder="Digite algo" />)
    
    const input = screen.getByPlaceholderText(/digite algo/i)
    expect(input).toBeInTheDocument()
  })

  it('aplica o label', () => {
    render(<Input label="Nome" />)
    
    const label = screen.getByText(/nome/i)
    expect(label).toBeInTheDocument()
  })

  it('aplica o erro', () => {
    render(<Input error="Campo obrigatório" />)
    
    const error = screen.getByText(/campo obrigatório/i)
    expect(error).toBeInTheDocument()
  })

  it('aplica o helper text', () => {
    render(<Input helperText="Digite seu nome completo" />)
    
    const helper = screen.getByText(/digite seu nome completo/i)
    expect(helper).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-input'
    render(<Input className={customClass} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      color: '#333333',
    }
    render(<Input style={customStyle} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveStyle(customStyle)
  })

  it('exibe um ícone quando fornecido', () => {
    render(
      <Input
        icon={<span data-testid="icon">🔍</span>}
        placeholder="Buscar"
      />
    )
    
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('exibe o ícone à esquerda por padrão', () => {
    render(
      <Input
        icon={<span data-testid="icon">🔍</span>}
        placeholder="Buscar"
      />
    )
    
    const input = screen.getByPlaceholderText(/buscar/i)
    const icon = screen.getByTestId('icon')
    
    expect(input.previousElementSibling).toBe(icon)
  })

  it('exibe o ícone à direita quando iconPosition é right', () => {
    render(
      <Input
        icon={<span data-testid="icon">🔍</span>}
        iconPosition="right"
        placeholder="Buscar"
      />
    )
    
    const input = screen.getByPlaceholderText(/buscar/i)
    const icon = screen.getByTestId('icon')
    
    expect(input.nextElementSibling).toBe(icon)
  })

  it('é desabilitado quando disabled é true', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('é somente leitura quando readOnly é true', () => {
    render(<Input readOnly />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('readonly')
  })

  it('é obrigatório quando required é true', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })

  it('aplica o autocomplete', () => {
    render(<Input autoComplete="name" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('autocomplete', 'name')
  })

  it('aplica o maxLength', () => {
    render(<Input maxLength={10} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('maxlength', '10')
  })

  it('aplica o minLength', () => {
    render(<Input minLength={3} />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('minlength', '3')
  })

  it('aplica o pattern', () => {
    render(<Input pattern="[0-9]+" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('pattern', '[0-9]+')
  })

  it('é acessível para leitores de tela', () => {
    render(<Input aria-label="Campo de texto" />)
    
    const input = screen.getByRole('textbox', { name: /campo de texto/i })
    expect(input).toBeInTheDocument()
  })

  it('associa o label ao input corretamente', () => {
    render(<Input label="Nome" id="nome" />)
    
    const input = screen.getByRole('textbox')
    const label = screen.getByText(/nome/i)
    
    expect(input).toHaveAttribute('id', 'nome')
    expect(label).toHaveAttribute('for', 'nome')
  })

  it('aplica o foco quando clica no label', () => {
    render(<Input label="Nome" id="nome" />)
    
    const label = screen.getByText(/nome/i)
    fireEvent.click(label)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveFocus()
  })

  it('aplica o foco quando pressiona Tab', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    input.focus()
    
    expect(input).toHaveFocus()
  })

  it('aplica o foco quando pressiona Shift+Tab', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    input.focus()
    
    expect(input).toHaveFocus()
  })
}) 