// ReviewForm.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ReviewForm from '../index'

describe('ReviewForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renderiza o formulário corretamente', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Verifica se os elementos do formulário estão presentes
    expect(screen.getByLabelText(/sua avaliação/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/comentário/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('permite selecionar uma avaliação com estrelas', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Seleciona 4 estrelas
    const stars = screen.getAllByTestId('star')
    fireEvent.click(stars[3])
    
    // Verifica se as estrelas foram preenchidas corretamente
    expect(stars[0]).toHaveClass('filled')
    expect(stars[1]).toHaveClass('filled')
    expect(stars[2]).toHaveClass('filled')
    expect(stars[3]).toHaveClass('filled')
    expect(stars[4]).toHaveClass('empty')
  })

  it('permite digitar um comentário', async () => {
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const commentInput = screen.getByLabelText(/comentário/i)
    await userEvent.type(commentInput, 'Excelente restaurante!')
    
    expect(commentInput).toHaveValue('Excelente restaurante!')
  })

  it('valida campos obrigatórios', async () => {
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Tenta enviar o formulário sem preencher
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)
    
    // Verifica se as mensagens de erro aparecem
    expect(screen.getByText(/selecione uma avaliação/i)).toBeInTheDocument()
    expect(screen.getByText(/digite um comentário/i)).toBeInTheDocument()
    
    // Verifica se o onSubmit não foi chamado
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('envia o formulário com dados válidos', async () => {
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Preenche o formulário
    const stars = screen.getAllByTestId('star')
    fireEvent.click(stars[4]) // 5 estrelas
    
    const commentInput = screen.getByLabelText(/comentário/i)
    await userEvent.type(commentInput, 'Excelente restaurante!')
    
    // Envia o formulário
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)
    
    // Verifica se o onSubmit foi chamado com os dados corretos
    expect(mockOnSubmit).toHaveBeenCalledWith({
      rating: 5,
      comment: 'Excelente restaurante!',
    })
  })

  it('chama onCancel ao clicar no botão cancelar', () => {
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    fireEvent.click(cancelButton)
    
    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('limpa o formulário após o envio bem-sucedido', async () => {
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Preenche o formulário
    const stars = screen.getAllByTestId('star')
    fireEvent.click(stars[4])
    
    const commentInput = screen.getByLabelText(/comentário/i)
    await userEvent.type(commentInput, 'Excelente restaurante!')
    
    // Envia o formulário
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)
    
    // Verifica se os campos foram limpos
    expect(commentInput).toHaveValue('')
    stars.forEach(star => {
      expect(star).toHaveClass('empty')
    })
  })

  it('exibe um indicador de carregamento durante o envio', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Preenche o formulário
    const stars = screen.getAllByTestId('star')
    fireEvent.click(stars[4])
    
    const commentInput = screen.getByLabelText(/comentário/i)
    await userEvent.type(commentInput, 'Excelente restaurante!')
    
    // Envia o formulário
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)
    
    // Verifica se o botão está desabilitado e mostra o indicador de carregamento
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/enviando/i)).toBeInTheDocument()
    
    // Aguarda o envio completar
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
      expect(screen.queryByText(/enviando/i)).not.toBeInTheDocument()
    })
  })

  it('exibe uma mensagem de erro em caso de falha no envio', async () => {
    const errorMessage = 'Erro ao enviar avaliação'
    mockOnSubmit.mockRejectedValue(new Error(errorMessage))
    
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)
    
    // Preenche o formulário
    const stars = screen.getAllByTestId('star')
    fireEvent.click(stars[4])
    
    const commentInput = screen.getByLabelText(/comentário/i)
    await userEvent.type(commentInput, 'Excelente restaurante!')
    
    // Envia o formulário
    const submitButton = screen.getByRole('button', { name: /enviar/i })
    fireEvent.click(submitButton)
    
    // Verifica se a mensagem de erro é exibida
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })
}) 