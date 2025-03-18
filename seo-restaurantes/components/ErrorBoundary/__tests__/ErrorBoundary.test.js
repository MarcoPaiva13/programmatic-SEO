// ErrorBoundary.test.js
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorBoundary from '../index'

// Componente que lança um erro
const ThrowError = () => {
  throw new Error('Erro de teste')
}

// Componente que não lança erro
const NoError = () => <div>Conteúdo normal</div>

describe('ErrorBoundary', () => {
  // Desativa os logs de erro do console durante os testes
  const consoleError = console.error
  beforeAll(() => {
    console.error = jest.fn()
  })
  afterAll(() => {
    console.error = consoleError
  })

  it('renderiza o conteúdo normal quando não há erro', () => {
    render(
      <ErrorBoundary>
        <NoError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Conteúdo normal')).toBeInTheDocument()
  })

  it('renderiza a mensagem de erro quando ocorre um erro', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Ops! Algo deu errado.')).toBeInTheDocument()
    expect(screen.getByText('Erro de teste')).toBeInTheDocument()
  })

  it('exibe o botão de tentar novamente', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByRole('button', { name: /tentar novamente/i })).toBeInTheDocument()
  })

  it('tenta renderizar novamente ao clicar no botão', () => {
    const onReset = jest.fn()
    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    )
    
    const resetButton = screen.getByRole('button', { name: /tentar novamente/i })
    fireEvent.click(resetButton)
    
    expect(onReset).toHaveBeenCalled()
  })

  it('exibe uma mensagem de erro personalizada', () => {
    const customMessage = 'Erro ao carregar o conteúdo'
    render(
      <ErrorBoundary message={customMessage}>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('exibe um botão com texto personalizado', () => {
    const customButtonText = 'Recarregar página'
    render(
      <ErrorBoundary buttonText={customButtonText}>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByRole('button', { name: customButtonText })).toBeInTheDocument()
  })

  it('exibe detalhes do erro quando showDetails é true', () => {
    render(
      <ErrorBoundary showDetails>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Detalhes do erro:')).toBeInTheDocument()
    expect(screen.getByText(/Error: Erro de teste/)).toBeInTheDocument()
  })

  it('não exibe detalhes do erro quando showDetails é false', () => {
    render(
      <ErrorBoundary showDetails={false}>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.queryByText('Detalhes do erro:')).not.toBeInTheDocument()
    expect(screen.queryByText(/Error: Erro de teste/)).not.toBeInTheDocument()
  })

  it('exibe um ícone de erro', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    const errorIcon = screen.getByTestId('error-icon')
    expect(errorIcon).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-error-boundary'
    render(
      <ErrorBoundary className={customClass}>
        <ThrowError />
      </ErrorBoundary>
    )
    
    const container = screen.getByTestId('error-boundary')
    expect(container).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f8f8f8',
      padding: '20px',
    }
    render(
      <ErrorBoundary style={customStyle}>
        <ThrowError />
      </ErrorBoundary>
    )
    
    const container = screen.getByTestId('error-boundary')
    expect(container).toHaveStyle(customStyle)
  })

  it('é acessível para leitores de tela', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    const container = screen.getByTestId('error-boundary')
    expect(container).toHaveAttribute('role', 'alert')
    expect(container).toHaveAttribute('aria-live', 'polite')
  })

  it('registra o erro no console', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(console.error).toHaveBeenCalled()
  })

  it('mantém o estado do erro entre renderizações', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    // Tenta renderizar novamente com o mesmo erro
    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Ops! Algo deu errado.')).toBeInTheDocument()
  })
}) 