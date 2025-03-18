import { render, screen, fireEvent } from '@testing-library/react'
import Card from '../index'

describe('Card', () => {
  it('renderiza o card corretamente', () => {
    render(
      <Card>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    expect(screen.getByText('Conteúdo do card')).toBeInTheDocument()
  })

  it('renderiza o título do card quando fornecido', () => {
    render(
      <Card title="Título do Card">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    expect(screen.getByText('Título do Card')).toBeInTheDocument()
  })

  it('renderiza o subtítulo do card quando fornecido', () => {
    render(
      <Card subtitle="Subtítulo do Card">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    expect(screen.getByText('Subtítulo do Card')).toBeInTheDocument()
  })

  it('renderiza imagem no card quando fornecida', () => {
    render(
      <Card 
        image="/path/to/image.jpg" 
        alt="Descrição da imagem"
      >
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const image = screen.getByRole('img', { name: /descrição da imagem/i })
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/path/to/image.jpg')
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-card'
    render(
      <Card className={customClass}>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f0f0f0',
      padding: '20px',
    }
    render(
      <Card style={customStyle}>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveStyle(customStyle)
  })

  it('aplica variante elevada corretamente', () => {
    render(
      <Card variant="elevated">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveClass('elevated')
  })

  it('aplica variante outline corretamente', () => {
    render(
      <Card variant="outlined">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveClass('outlined')
  })

  it('aplica variante flat corretamente', () => {
    render(
      <Card variant="flat">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveClass('flat')
  })

  it('chama onClick quando o card é clicável e é clicado', () => {
    const handleClick = jest.fn()
    render(
      <Card onClick={handleClick}>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    fireEvent.click(card)
    
    expect(handleClick).toHaveBeenCalled()
  })

  it('não chama onClick quando o card não é clicável', () => {
    const handleClick = jest.fn()
    render(
      <Card>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    fireEvent.click(card)
    
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('aplica classe "clickable" quando onClick é fornecido', () => {
    const handleClick = jest.fn()
    render(
      <Card onClick={handleClick}>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveClass('clickable')
  })

  it('renderiza os ícones de ação quando fornecidos', () => {
    render(
      <Card 
        actions={[
          { icon: 'edit', onClick: jest.fn(), label: 'Editar' },
          { icon: 'delete', onClick: jest.fn(), label: 'Excluir' }
        ]}
      >
        <div>Conteúdo do card</div>
      </Card>
    )
    
    expect(screen.getByLabelText('Editar')).toBeInTheDocument()
    expect(screen.getByLabelText('Excluir')).toBeInTheDocument()
  })

  it('chama a função onClick associada à ação quando um ícone de ação é clicado', () => {
    const handleEdit = jest.fn()
    const handleDelete = jest.fn()
    
    render(
      <Card 
        actions={[
          { icon: 'edit', onClick: handleEdit, label: 'Editar' },
          { icon: 'delete', onClick: handleDelete, label: 'Excluir' }
        ]}
      >
        <div>Conteúdo do card</div>
      </Card>
    )
    
    fireEvent.click(screen.getByLabelText('Editar'))
    expect(handleEdit).toHaveBeenCalled()
    
    fireEvent.click(screen.getByLabelText('Excluir'))
    expect(handleDelete).toHaveBeenCalled()
  })

  it('renderiza um rodapé quando fornecido', () => {
    render(
      <Card footer={<div>Rodapé do card</div>}>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    expect(screen.getByText('Rodapé do card')).toBeInTheDocument()
  })

  it('renderiza um cabeçalho quando fornecido', () => {
    render(
      <Card header={<div>Cabeçalho do card</div>}>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    expect(screen.getByText('Cabeçalho do card')).toBeInTheDocument()
  })

  it('aplica a largura corretamente', () => {
    render(
      <Card width="300px">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveStyle({ width: '300px' })
  })

  it('aplica a altura corretamente', () => {
    render(
      <Card height="200px">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveStyle({ height: '200px' })
  })

  it('aplica o preenchimento corretamente', () => {
    render(
      <Card padding="30px">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveStyle({ padding: '30px' })
  })

  it('aplica borderRadius corretamente', () => {
    render(
      <Card borderRadius="15px">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveStyle({ borderRadius: '15px' })
  })

  it('aplica cor de fundo corretamente', () => {
    render(
      <Card backgroundColor="#f5f5f5">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveStyle({ backgroundColor: '#f5f5f5' })
  })

  it('é acessível para leitores de tela', () => {
    render(
      <Card aria-label="Card de exemplo">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByLabelText('Card de exemplo')
    expect(card).toBeInTheDocument()
  })

  it('permite navegação por teclado quando clicável', () => {
    const handleClick = jest.fn()
    render(
      <Card onClick={handleClick} tabIndex={0}>
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    card.focus()
    expect(card).toHaveFocus()
    
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleClick).toHaveBeenCalled()
    
    handleClick.mockClear()
    fireEvent.keyDown(card, { key: 'Space' })
    expect(handleClick).toHaveBeenCalled()
  })

  it('renderiza imagem com proporção correta quando aspectRatio é fornecido', () => {
    render(
      <Card 
        image="/path/to/image.jpg" 
        alt="Descrição da imagem"
        imageAspectRatio="16/9"
      >
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const imageContainer = screen.getByRole('img').closest('.image-container')
    expect(imageContainer).toHaveStyle({ aspectRatio: '16/9' })
  })

  it('aplica cor da borda corretamente', () => {
    render(
      <Card borderColor="#e0e0e0">
        <div>Conteúdo do card</div>
      </Card>
    )
    
    const card = screen.getByText('Conteúdo do card').closest('.card')
    expect(card).toHaveStyle({ borderColor: '#e0e0e0' })
  })
}) 