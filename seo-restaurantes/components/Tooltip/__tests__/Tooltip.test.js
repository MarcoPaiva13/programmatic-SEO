// Tooltip.test.js
import { render, screen, fireEvent, act } from '@testing-library/react'
import Tooltip from '../index'

describe('Tooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renderiza o conteúdo filho corretamente', () => {
    render(
      <Tooltip content="Informação adicional">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    expect(screen.getByRole('button', { name: /ajuda/i })).toBeInTheDocument()
  })

  it('não exibe o tooltip por padrão', () => {
    render(
      <Tooltip content="Informação adicional">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    expect(screen.queryByText('Informação adicional')).not.toBeInTheDocument()
  })

  it('exibe o tooltip ao passar o mouse sobre o elemento', () => {
    render(
      <Tooltip content="Informação adicional">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    expect(screen.getByText('Informação adicional')).toBeInTheDocument()
  })

  it('esconde o tooltip ao remover o mouse do elemento', () => {
    render(
      <Tooltip content="Informação adicional">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    
    // Exibe o tooltip
    fireEvent.mouseEnter(button)
    act(() => {
      jest.runAllTimers()
    })
    
    // Esconde o tooltip
    fireEvent.mouseLeave(button)
    act(() => {
      jest.runAllTimers()
    })
    
    expect(screen.queryByText('Informação adicional')).not.toBeInTheDocument()
  })

  it('exibe o tooltip ao focar no elemento', () => {
    render(
      <Tooltip content="Informação adicional">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.focus(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    expect(screen.getByText('Informação adicional')).toBeInTheDocument()
  })

  it('esconde o tooltip ao remover o foco do elemento', () => {
    render(
      <Tooltip content="Informação adicional">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    
    // Exibe o tooltip
    fireEvent.focus(button)
    act(() => {
      jest.runAllTimers()
    })
    
    // Esconde o tooltip
    fireEvent.blur(button)
    act(() => {
      jest.runAllTimers()
    })
    
    expect(screen.queryByText('Informação adicional')).not.toBeInTheDocument()
  })

  it('posiciona o tooltip acima do elemento quando placement é "top"', () => {
    render(
      <Tooltip content="Informação adicional" placement="top">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    expect(tooltip).toHaveClass('top')
  })

  it('posiciona o tooltip abaixo do elemento quando placement é "bottom"', () => {
    render(
      <Tooltip content="Informação adicional" placement="bottom">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    expect(tooltip).toHaveClass('bottom')
  })

  it('posiciona o tooltip à esquerda do elemento quando placement é "left"', () => {
    render(
      <Tooltip content="Informação adicional" placement="left">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    expect(tooltip).toHaveClass('left')
  })

  it('posiciona o tooltip à direita do elemento quando placement é "right"', () => {
    render(
      <Tooltip content="Informação adicional" placement="right">
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    expect(tooltip).toHaveClass('right')
  })

  it('aplica delay na exibição do tooltip', () => {
    render(
      <Tooltip content="Informação adicional" enterDelay={500}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    // Antes do delay
    expect(screen.queryByText('Informação adicional')).not.toBeInTheDocument()
    
    // Após o delay
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(screen.getByText('Informação adicional')).toBeInTheDocument()
  })

  it('aplica delay na ocultação do tooltip', () => {
    render(
      <Tooltip content="Informação adicional" leaveDelay={500}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    
    // Exibe o tooltip
    fireEvent.mouseEnter(button)
    act(() => {
      jest.runAllTimers()
    })
    
    // Remove o mouse
    fireEvent.mouseLeave(button)
    
    // Tooltip ainda visível antes do delay
    expect(screen.getByText('Informação adicional')).toBeInTheDocument()
    
    // Após o delay, tooltip deve desaparecer
    act(() => {
      jest.advanceTimersByTime(500)
    })
    
    expect(screen.queryByText('Informação adicional')).not.toBeInTheDocument()
  })

  it('aplica classes CSS personalizadas', () => {
    const customClass = 'custom-tooltip'
    render(
      <Tooltip content="Informação adicional" className={customClass}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    expect(tooltip).toHaveClass(customClass)
  })

  it('aplica estilos inline personalizados', () => {
    const customStyle = {
      backgroundColor: '#000',
      color: '#fff',
    }
    render(
      <Tooltip content="Informação adicional" style={customStyle}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    expect(tooltip).toHaveStyle(customStyle)
  })

  it('renderiza tooltip com HTML quando disableHtml é false', () => {
    render(
      <Tooltip content={<span data-testid="html-content">Conteúdo <b>HTML</b></span>} disableHtml={false}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    expect(screen.getByTestId('html-content')).toBeInTheDocument()
    expect(screen.getByText('HTML')).toBeInTheDocument()
  })

  it('escapa HTML quando disableHtml é true', () => {
    render(
      <Tooltip content="<b>Texto em negrito</b>" disableHtml={true}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    expect(screen.getByText('<b>Texto em negrito</b>')).toBeInTheDocument()
  })

  it('renderiza arrow quando arrow é true', () => {
    render(
      <Tooltip content="Informação adicional" arrow={true}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const arrow = document.querySelector('.tooltip-arrow')
    expect(arrow).toBeInTheDocument()
  })

  it('não renderiza arrow quando arrow é false', () => {
    render(
      <Tooltip content="Informação adicional" arrow={false}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const arrow = document.querySelector('.tooltip-arrow')
    expect(arrow).not.toBeInTheDocument()
  })

  it('mantém o tooltip visível ao passar o mouse sobre ele quando interactive é true', () => {
    render(
      <Tooltip content="Informação adicional" interactive={true}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    
    // Exibe o tooltip
    fireEvent.mouseEnter(button)
    act(() => {
      jest.runAllTimers()
    })
    
    // Obtém o tooltip e simula que o mouse sai do botão para o tooltip
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    fireEvent.mouseLeave(button)
    fireEvent.mouseEnter(tooltip)
    
    act(() => {
      jest.runAllTimers()
    })
    
    // O tooltip deve permanecer visível
    expect(screen.getByText('Informação adicional')).toBeInTheDocument()
  })

  it('esconde o tooltip ao passar o mouse para fora do tooltip interativo', () => {
    render(
      <Tooltip content="Informação adicional" interactive={true}>
        <button>Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    
    // Exibe o tooltip
    fireEvent.mouseEnter(button)
    act(() => {
      jest.runAllTimers()
    })
    
    // Obtém o tooltip e simula que o mouse sai do botão para o tooltip e depois sai do tooltip
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    fireEvent.mouseLeave(button)
    fireEvent.mouseEnter(tooltip)
    fireEvent.mouseLeave(tooltip)
    
    act(() => {
      jest.runAllTimers()
    })
    
    // O tooltip deve desaparecer
    expect(screen.queryByText('Informação adicional')).not.toBeInTheDocument()
  })

  it('é acessível para leitores de tela', () => {
    render(
      <Tooltip content="Informação adicional">
        <button aria-describedby="tooltip">Ajuda</button>
      </Tooltip>
    )
    
    const button = screen.getByRole('button', { name: /ajuda/i })
    fireEvent.mouseEnter(button)
    
    act(() => {
      jest.runAllTimers()
    })
    
    const tooltip = screen.getByText('Informação adicional').closest('.tooltip')
    expect(tooltip).toHaveAttribute('role', 'tooltip')
    expect(tooltip).toHaveAttribute('id', expect.any(String))
    expect(button).toHaveAttribute('aria-describedby', tooltip.id)
  })
}) 