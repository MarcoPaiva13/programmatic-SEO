import { render, screen } from '@testing-library/react'
import Progress from '../index'

describe('Progress', () => {
  it('renderiza a barra de progresso corretamente', () => {
    render(<Progress value={50} max={100} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toBeInTheDocument()
    expect(progress).toHaveAttribute('aria-valuenow', '50')
    expect(progress).toHaveAttribute('aria-valuemax', '100')
  })

  it('aplica o valor corretamente', () => {
    render(<Progress value={75} max={100} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '75')
  })

  it('aplica o valor máximo corretamente', () => {
    render(<Progress value={50} max={200} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuemax', '200')
  })

  it('aplica o valor mínimo corretamente', () => {
    render(<Progress value={50} min={10} max={100} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuemin', '10')
  })

  it('exibe o valor como porcentagem quando showPercentage é true', () => {
    render(<Progress value={50} max={100} showPercentage />)
    
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('não exibe o valor como porcentagem quando showPercentage é false', () => {
    render(<Progress value={50} max={100} />)
    
    expect(screen.queryByText('50%')).not.toBeInTheDocument()
  })

  it('aplica o label', () => {
    render(<Progress value={50} max={100} label="Carregamento" />)
    
    expect(screen.getByText('Carregamento')).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-progress'
    render(<Progress value={50} max={100} className={customClass} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      height: '10px',
    }
    render(<Progress value={50} max={100} style={customStyle} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveStyle(customStyle)
  })

  it('renderiza uma barra de progresso indeterminada quando indeterminate é true', () => {
    render(<Progress indeterminate />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', undefined)
    expect(progress).toHaveClass('indeterminate')
  })

  it('aplica variante de cor primária corretamente', () => {
    render(<Progress value={50} max={100} color="primary" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('primary')
  })

  it('aplica variante de cor secundária corretamente', () => {
    render(<Progress value={50} max={100} color="secondary" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('secondary')
  })

  it('aplica variante de cor de sucesso corretamente', () => {
    render(<Progress value={50} max={100} color="success" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('success')
  })

  it('aplica variante de cor de erro corretamente', () => {
    render(<Progress value={50} max={100} color="error" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('error')
  })

  it('aplica variante de cor de alerta corretamente', () => {
    render(<Progress value={50} max={100} color="warning" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('warning')
  })

  it('aplica variante de cor de informação corretamente', () => {
    render(<Progress value={50} max={100} color="info" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('info')
  })

  it('aplica tamanho pequeno corretamente', () => {
    render(<Progress value={50} max={100} size="small" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('small')
  })

  it('aplica tamanho médio corretamente', () => {
    render(<Progress value={50} max={100} size="medium" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('medium')
  })

  it('aplica tamanho grande corretamente', () => {
    render(<Progress value={50} max={100} size="large" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('large')
  })

  it('calcula a porcentagem corretamente com base nos valores min e max', () => {
    render(<Progress value={60} min={10} max={110} showPercentage />)
    
    // (60 - 10) / (110 - 10) * 100 = 50%
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('limita o valor ao mínimo quando fornecido um valor menor', () => {
    render(<Progress value={5} min={10} max={100} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '10')
  })

  it('limita o valor ao máximo quando fornecido um valor maior', () => {
    render(<Progress value={150} min={0} max={100} />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveAttribute('aria-valuenow', '100')
  })

  it('aceita formato circular', () => {
    render(<Progress value={50} max={100} variant="circular" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('circular')
  })

  it('aceita formato linear', () => {
    render(<Progress value={50} max={100} variant="linear" />)
    
    const progress = screen.getByRole('progressbar')
    expect(progress).toHaveClass('linear')
  })

  it('é acessível para leitores de tela', () => {
    render(<Progress 
      value={50} 
      max={100} 
      aria-label="Progresso do carregamento" 
    />)
    
    const progress = screen.getByRole('progressbar', {
      name: 'Progresso do carregamento'
    })
    expect(progress).toBeInTheDocument()
  })
}) 