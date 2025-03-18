// ShareModal.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ShareModal from '../index'

describe('ShareModal', () => {
  const mockRestaurant = {
    id: 1,
    name: 'Restaurante Italiano',
    description: 'Um autêntico restaurante italiano no coração da cidade.',
    image: '/images/restaurants/italian.jpg',
    location: {
      address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    },
  }

  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o modal corretamente', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    // Verifica se os elementos do modal estão presentes
    expect(screen.getByText('Compartilhar Restaurante')).toBeInTheDocument()
    expect(screen.getByText('Restaurante Italiano')).toBeInTheDocument()
    expect(screen.getByText('Um autêntico restaurante italiano no coração da cidade.')).toBeInTheDocument()
    expect(screen.getByText('Rua das Flores, 123 - Centro, São Paulo - SP')).toBeInTheDocument()
  })

  it('exibe a imagem do restaurante', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/images/restaurants/italian.jpg')
    expect(image).toHaveAttribute('alt', 'Restaurante Italiano')
  })

  it('fecha o modal ao clicar no botão de fechar', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const closeButton = screen.getByRole('button', { name: /fechar/i })
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('fecha o modal ao clicar fora dele', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const overlay = screen.getByTestId('modal-overlay')
    fireEvent.click(overlay)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('exibe opções de compartilhamento', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    // Verifica se as opções de compartilhamento estão presentes
    expect(screen.getByText('WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Facebook')).toBeInTheDocument()
    expect(screen.getByText('Twitter')).toBeInTheDocument()
    expect(screen.getByText('Copiar Link')).toBeInTheDocument()
  })

  it('compartilha via WhatsApp', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const whatsappButton = screen.getByRole('button', { name: /whatsapp/i })
    fireEvent.click(whatsappButton)
    
    // Verifica se a URL do WhatsApp foi gerada corretamente
    const expectedUrl = `https://wa.me/?text=${encodeURIComponent(
      `Confira o Restaurante Italiano!\n\nUm autêntico restaurante italiano no coração da cidade.\n\nEndereço: Rua das Flores, 123 - Centro, São Paulo - SP`
    )}`
    
    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank')
  })

  it('compartilha via Facebook', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const facebookButton = screen.getByRole('button', { name: /facebook/i })
    fireEvent.click(facebookButton)
    
    // Verifica se a URL do Facebook foi gerada corretamente
    const expectedUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `${window.location.origin}/restaurantes/1`
    )}`
    
    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank')
  })

  it('compartilha via Twitter', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const twitterButton = screen.getByRole('button', { name: /twitter/i })
    fireEvent.click(twitterButton)
    
    // Verifica se a URL do Twitter foi gerada corretamente
    const expectedUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Confira o Restaurante Italiano!`
    )}&url=${encodeURIComponent(`${window.location.origin}/restaurantes/1`)}`
    
    expect(window.open).toHaveBeenCalledWith(expectedUrl, '_blank')
  })

  it('copia o link para a área de transferência', async () => {
    // Mock da API de área de transferência
    const mockClipboard = {
      writeText: jest.fn(),
    }
    Object.assign(navigator, {
      clipboard: mockClipboard,
    })
    
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const copyButton = screen.getByRole('button', { name: /copiar link/i })
    fireEvent.click(copyButton)
    
    // Verifica se o link foi copiado
    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      `${window.location.origin}/restaurantes/1`
    )
    
    // Verifica se a mensagem de sucesso é exibida
    expect(screen.getByText('Link copiado!')).toBeInTheDocument()
    
    // Verifica se a mensagem desaparece após 2 segundos
    await waitFor(() => {
      expect(screen.queryByText('Link copiado!')).not.toBeInTheDocument()
    }, { timeout: 2500 })
  })

  it('exibe uma mensagem de erro ao falhar ao copiar o link', async () => {
    // Mock da API de área de transferência com erro
    const mockClipboard = {
      writeText: jest.fn().mockRejectedValue(new Error('Erro ao copiar')),
    }
    Object.assign(navigator, {
      clipboard: mockClipboard,
    })
    
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    const copyButton = screen.getByRole('button', { name: /copiar link/i })
    fireEvent.click(copyButton)
    
    // Verifica se a mensagem de erro é exibida
    expect(screen.getByText('Erro ao copiar o link')).toBeInTheDocument()
    
    // Verifica se a mensagem desaparece após 2 segundos
    await waitFor(() => {
      expect(screen.queryByText('Erro ao copiar o link')).not.toBeInTheDocument()
    }, { timeout: 2500 })
  })

  it('fecha o modal ao pressionar a tecla Escape', () => {
    render(<ShareModal restaurant={mockRestaurant} onClose={mockOnClose} />)
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalled()
  })
}) 