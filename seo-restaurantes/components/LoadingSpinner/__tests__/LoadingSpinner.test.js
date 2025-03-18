import { render, screen } from '@testing-library/react'
import LoadingSpinner from '../index'

describe('LoadingSpinner', () => {
  it('renderiza o spinner corretamente', () => {
    render(<LoadingSpinner />)
    
    // Verifica se o container do spinner está presente
    const spinnerContainer = screen.getByTestId('loading-spinner')
    expect(spinnerContainer).toBeInTheDocument()
    
    // Verifica se o spinner tem a classe correta
    expect(spinnerContainer).toHaveClass('spinner')
  })

  it('exibe a mensagem de carregamento padrão', () => {
    render(<LoadingSpinner />)
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })

  it('exibe uma mensagem de carregamento personalizada', () => {
    const customMessage = 'Buscando restaurantes...'
    render(<LoadingSpinner message={customMessage} />)
    
    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  it('aplica o tamanho padrão do spinner', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveStyle({
      width: '40px',
      height: '40px',
    })
  })

  it('aplica um tamanho personalizado ao spinner', () => {
    const size = '60px'
    render(<LoadingSpinner size={size} />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveStyle({
      width: size,
      height: size,
    })
  })

  it('aplica a cor padrão do spinner', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveStyle({
      borderColor: '#f3f3f3',
      borderTopColor: '#3498db',
    })
  })

  it('aplica uma cor personalizada ao spinner', () => {
    const color = '#ff0000'
    render(<LoadingSpinner color={color} />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveStyle({
      borderColor: '#f3f3f3',
      borderTopColor: color,
    })
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-spinner'
    render(<LoadingSpinner className={customClass} />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      margin: '20px',
      padding: '10px',
    }
    render(<LoadingSpinner style={customStyle} />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveStyle(customStyle)
  })

  it('é acessível para leitores de tela', () => {
    render(<LoadingSpinner />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveAttribute('role', 'status')
    expect(spinner).toHaveAttribute('aria-label', 'Carregando...')
  })

  it('permite personalizar o texto para leitores de tela', () => {
    const ariaLabel = 'Buscando restaurantes próximos...'
    render(<LoadingSpinner ariaLabel={ariaLabel} />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveAttribute('aria-label', ariaLabel)
  })

  it('renderiza sem mensagem quando showMessage é false', () => {
    render(<LoadingSpinner showMessage={false} />)
    
    expect(screen.queryByText('Carregando...')).not.toBeInTheDocument()
  })

  it('renderiza com uma mensagem personalizada e sem texto para leitores de tela', () => {
    const message = 'Buscando...'
    render(<LoadingSpinner message={message} showMessage={false} />)
    
    const spinner = screen.getByTestId('loading-spinner')
    expect(spinner).toHaveAttribute('aria-label', message)
    expect(screen.queryByText(message)).not.toBeInTheDocument()
  })
}) 