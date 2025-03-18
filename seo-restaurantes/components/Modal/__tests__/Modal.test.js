import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../index'

describe('Modal', () => {
  const mockOnClose = jest.fn()
  const mockOnConfirm = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o modal corretamente', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    // Verifica se o overlay está presente
    const overlay = screen.getByTestId('modal-overlay')
    expect(overlay).toBeInTheDocument()
    
    // Verifica se o conteúdo está presente
    expect(screen.getByText('Conteúdo do modal')).toBeInTheDocument()
  })

  it('não renderiza quando isOpen é false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument()
  })

  it('fecha o modal ao clicar no botão de fechar', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const closeButton = screen.getByRole('button', { name: /fechar/i })
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('fecha o modal ao clicar fora dele', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const overlay = screen.getByTestId('modal-overlay')
    fireEvent.click(overlay)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('fecha o modal ao pressionar a tecla Escape', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    fireEvent.keyDown(document, { key: 'Escape' })
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('não fecha o modal ao clicar no conteúdo', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const content = screen.getByText('Conteúdo do modal')
    fireEvent.click(content)
    
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('exibe o título do modal', () => {
    const title = 'Título do Modal'
    render(
      <Modal isOpen onClose={mockOnClose} title={title}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    expect(screen.getByText(title)).toBeInTheDocument()
  })

  it('exibe botões de ação quando fornecidos', () => {
    render(
      <Modal
        isOpen
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        confirmText="Confirmar"
        cancelText="Cancelar"
      >
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    expect(screen.getByRole('button', { name: /confirmar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('chama onConfirm ao clicar no botão de confirmar', () => {
    render(
      <Modal
        isOpen
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        confirmText="Confirmar"
      >
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    fireEvent.click(confirmButton)
    
    expect(mockOnConfirm).toHaveBeenCalled()
  })

  it('desabilita o botão de confirmar quando loading é true', () => {
    render(
      <Modal
        isOpen
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        confirmText="Confirmar"
        loading
      >
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    expect(confirmButton).toBeDisabled()
  })

  it('exibe um indicador de carregamento no botão de confirmar', () => {
    render(
      <Modal
        isOpen
        onClose={mockOnClose}
        onConfirm={mockOnConfirm}
        confirmText="Confirmar"
        loading
      >
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-modal'
    render(
      <Modal isOpen onClose={mockOnClose} className={customClass}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const modal = screen.getByTestId('modal-content')
    expect(modal).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#f8f8f8',
      padding: '20px',
    }
    render(
      <Modal isOpen onClose={mockOnClose} style={customStyle}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const modal = screen.getByTestId('modal-content')
    expect(modal).toHaveStyle(customStyle)
  })

  it('é acessível para leitores de tela', () => {
    render(
      <Modal isOpen onClose={mockOnClose} title="Título do Modal">
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    const modal = screen.getByRole('dialog')
    expect(modal).toHaveAttribute('aria-labelledby', 'modal-title')
    expect(modal).toHaveAttribute('aria-modal', 'true')
  })

  it('trap focus dentro do modal', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        <button>Botão 1</button>
        <button>Botão 2</button>
      </Modal>
    )
    
    const firstButton = screen.getByRole('button', { name: /botão 1/i })
    const secondButton = screen.getByRole('button', { name: /botão 2/i })
    
    // Verifica se o primeiro botão recebe foco inicialmente
    expect(firstButton).toHaveFocus()
    
    // Simula pressionar Tab
    fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: false })
    expect(secondButton).toHaveFocus()
    
    // Simula pressionar Shift+Tab
    fireEvent.keyDown(secondButton, { key: 'Tab', shiftKey: true })
    expect(firstButton).toHaveFocus()
  })

  it('previne scroll do body quando o modal está aberto', () => {
    render(
      <Modal isOpen onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    expect(document.body).toHaveStyle({ overflow: 'hidden' })
  })

  it('restaura scroll do body quando o modal é fechado', () => {
    const { rerender } = render(
      <Modal isOpen onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    rerender(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Conteúdo do modal</div>
      </Modal>
    )
    
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' })
  })
}) 