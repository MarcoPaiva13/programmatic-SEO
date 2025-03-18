import { render, screen } from '@testing-library/react'
import Avatar from '../index'

describe('Avatar', () => {
  it('renderiza o avatar com imagem corretamente', () => {
    render(<Avatar src="/path/to/avatar.jpg" alt="Avatar do usuário" />)
    
    const avatar = screen.getByRole('img', { name: /avatar do usuário/i })
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', '/path/to/avatar.jpg')
  })

  it('renderiza as iniciais quando não há imagem e o nome é fornecido', () => {
    render(<Avatar name="João Silva" />)
    
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renderiza apenas a primeira letra quando o nome tem apenas uma palavra', () => {
    render(<Avatar name="João" />)
    
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('renderiza um ícone de fallback quando não há imagem nem nome', () => {
    render(<Avatar />)
    
    // Assumindo que há um elemento com classe 'avatar-icon' para o ícone de fallback
    const fallbackIcon = document.querySelector('.avatar-icon')
    expect(fallbackIcon).toBeInTheDocument()
  })

  it('aplica o tamanho pequeno corretamente', () => {
    render(<Avatar name="João Silva" size="small" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('small')
  })

  it('aplica o tamanho médio corretamente', () => {
    render(<Avatar name="João Silva" size="medium" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('medium')
  })

  it('aplica o tamanho grande corretamente', () => {
    render(<Avatar name="João Silva" size="large" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('large')
  })

  it('aplica tamanho personalizado quando fornecido em pixels', () => {
    render(<Avatar name="João Silva" size="48px" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveStyle({
      width: '48px',
      height: '48px'
    })
  })

  it('aplica variante circular corretamente', () => {
    render(<Avatar name="João Silva" variant="circular" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('circular')
  })

  it('aplica variante quadrada corretamente', () => {
    render(<Avatar name="João Silva" variant="square" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('square')
  })

  it('aplica variante arredondada corretamente', () => {
    render(<Avatar name="João Silva" variant="rounded" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('rounded')
  })

  it('aplica a cor de fundo personalizada', () => {
    render(<Avatar name="João Silva" backgroundColor="#ff5722" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveStyle({ backgroundColor: '#ff5722' })
  })

  it('aplica a cor de texto personalizada', () => {
    render(<Avatar name="João Silva" color="#ffffff" />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveStyle({ color: '#ffffff' })
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-avatar'
    render(<Avatar name="João Silva" className={customClass} />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      border: '2px solid #000',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
    render(<Avatar name="João Silva" style={customStyle} />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveStyle(customStyle)
  })

  it('renderiza um indicador de online quando online é true', () => {
    render(<Avatar name="João Silva" online />)
    
    const statusIndicator = document.querySelector('.status-indicator.online')
    expect(statusIndicator).toBeInTheDocument()
  })

  it('renderiza um indicador de offline quando online é false', () => {
    render(<Avatar name="João Silva" online={false} />)
    
    const statusIndicator = document.querySelector('.status-indicator.offline')
    expect(statusIndicator).toBeInTheDocument()
  })

  it('não renderiza indicador de status quando online não é definido', () => {
    render(<Avatar name="João Silva" />)
    
    const statusIndicator = document.querySelector('.status-indicator')
    expect(statusIndicator).not.toBeInTheDocument()
  })

  it('aplica uma borda quando há um indicador de status', () => {
    render(<Avatar name="João Silva" online />)
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('with-status')
  })

  it('renderiza um badge quando fornecido', () => {
    render(<Avatar name="João Silva" badge="3" />)
    
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('torna as iniciais maiúsculas', () => {
    render(<Avatar name="joão silva" />)
    
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('aplica a formatação correta do nome com mais de duas palavras', () => {
    render(<Avatar name="João da Silva Santos" />)
    
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('é acessível para leitores de tela', () => {
    render(<Avatar name="João Silva" alt="Avatar de João Silva" />)
    
    const avatar = screen.getByLabelText('Avatar de João Silva')
    expect(avatar).toBeInTheDocument()
  })

  it('usa a imagem especificada mesmo quando há um nome fornecido', () => {
    render(
      <Avatar 
        name="João Silva" 
        src="/path/to/avatar.jpg"
        alt="Avatar de João Silva"
      />
    )
    
    const avatar = screen.getByRole('img', { name: /avatar de joão silva/i })
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', '/path/to/avatar.jpg')
  })

  it('reverte para iniciais quando a imagem falha ao carregar', () => {
    render(
      <Avatar 
        name="João Silva" 
        src="/path/to/invalid-avatar.jpg"
        alt="Avatar de João Silva"
      />
    )
    
    const avatar = screen.getByRole('img')
    // Simula erro de carregamento de imagem
    fireEvent.error(avatar)
    
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('aplica estilo de grupo quando usado dentro de AvatarGroup', () => {
    render(
      <div className="avatar-group">
        <Avatar name="João Silva" />
      </div>
    )
    
    const avatar = screen.getByText('JS').closest('.avatar')
    expect(avatar).toHaveClass('in-group')
  })
}) 