import { render, screen } from '@testing-library/react'
import Badge from '../index'

describe('Badge', () => {
  it('renderiza o conteúdo filho corretamente', () => {
    render(
      <Badge count={5}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.getByText('Notificações')).toBeInTheDocument()
  })

  it('renderiza o número de contagem', () => {
    render(
      <Badge count={5}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renderiza o texto personalizado no badge', () => {
    render(
      <Badge content="Novo">
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.getByText('Novo')).toBeInTheDocument()
  })

  it('não renderiza o badge quando showZero é false e count é 0', () => {
    render(
      <Badge count={0} showZero={false}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('renderiza o badge quando showZero é true e count é 0', () => {
    render(
      <Badge count={0} showZero={true}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('mostra "99+" quando count é maior que maxCount', () => {
    render(
      <Badge count={100} maxCount={99}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.getByText('99+')).toBeInTheDocument()
  })

  it('mostra o valor exato quando count é menor ou igual a maxCount', () => {
    render(
      <Badge count={50} maxCount={99}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('posiciona o badge no canto superior direito por padrão', () => {
    render(
      <Badge count={5}>
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('top-right')
  })

  it('posiciona o badge no canto superior esquerdo quando position é "top-left"', () => {
    render(
      <Badge count={5} position="top-left">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('top-left')
  })

  it('posiciona o badge no canto inferior direito quando position é "bottom-right"', () => {
    render(
      <Badge count={5} position="bottom-right">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('bottom-right')
  })

  it('posiciona o badge no canto inferior esquerdo quando position é "bottom-left"', () => {
    render(
      <Badge count={5} position="bottom-left">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('bottom-left')
  })

  it('renderiza o badge como um ponto quando dot é true', () => {
    render(
      <Badge dot={true}>
        <div>Notificações</div>
      </Badge>
    )
    
    const dot = document.querySelector('.badge.dot')
    expect(dot).toBeInTheDocument()
  })

  it('aplica variante de cor primária corretamente', () => {
    render(
      <Badge count={5} color="primary">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('primary')
  })

  it('aplica variante de cor secundária corretamente', () => {
    render(
      <Badge count={5} color="secondary">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('secondary')
  })

  it('aplica variante de cor de sucesso corretamente', () => {
    render(
      <Badge count={5} color="success">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('success')
  })

  it('aplica variante de cor de erro corretamente', () => {
    render(
      <Badge count={5} color="error">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('error')
  })

  it('aplica variante de cor de alerta corretamente', () => {
    render(
      <Badge count={5} color="warning">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('warning')
  })

  it('aplica variante de cor de informação corretamente', () => {
    render(
      <Badge count={5} color="info">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('info')
  })

  it('aplica offset horizontal corretamente', () => {
    render(
      <Badge count={5} offset={[10, 0]}>
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveStyle({ marginRight: '10px' })
  })

  it('aplica offset vertical corretamente', () => {
    render(
      <Badge count={5} offset={[0, 10]}>
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveStyle({ marginTop: '10px' })
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-badge'
    render(
      <Badge count={5} className={customClass}>
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#000',
      color: '#fff',
    }
    render(
      <Badge count={5} style={customStyle}>
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveStyle(customStyle)
  })

  it('aplica tamanho pequeno corretamente', () => {
    render(
      <Badge count={5} size="small">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('small')
  })

  it('aplica tamanho médio corretamente', () => {
    render(
      <Badge count={5} size="medium">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('medium')
  })

  it('aplica tamanho grande corretamente', () => {
    render(
      <Badge count={5} size="large">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('large')
  })

  it('esconde o badge quando invisible é true', () => {
    render(
      <Badge count={5} invisible={true}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.queryByText('5')).not.toBeInTheDocument()
  })

  it('mostra o badge quando invisible é false', () => {
    render(
      <Badge count={5} invisible={false}>
        <div>Notificações</div>
      </Badge>
    )
    
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renderiza o badge standalone (sem filhos) quando não há filhos', () => {
    render(<Badge count={5} />)
    
    expect(screen.getByText('5')).toBeInTheDocument()
    const badge = screen.getByText('5').closest('.badge')
    expect(badge).toHaveClass('standalone')
  })

  it('é acessível para leitores de tela', () => {
    render(
      <Badge count={5} aria-label="5 novas notificações">
        <div>Notificações</div>
      </Badge>
    )
    
    const badge = screen.getByLabelText('5 novas notificações')
    expect(badge).toBeInTheDocument()
  })
}) 