// Map.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Map from '../index'

// Mock do Leaflet
jest.mock('leaflet', () => ({
  map: jest.fn(),
  tileLayer: jest.fn().mockReturnThis(),
  addTo: jest.fn().mockReturnThis(),
  marker: jest.fn().mockReturnThis(),
  setView: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  remove: jest.fn(),
  Icon: jest.fn(),
  icon: jest.fn().mockReturnThis(),
  DefaultIcon: {
    imagePath: '/images/markers/',
  },
}))

describe('Map', () => {
  const mockRestaurant = {
    id: 1,
    name: 'Restaurante Italiano',
    location: {
      lat: -23.550520,
      lng: -46.633308,
      address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    },
  }

  const mockRestaurants = [
    mockRestaurant,
    {
      id: 2,
      name: 'Restaurante Japonês',
      location: {
        lat: -23.551520,
        lng: -46.634308,
        address: 'Rua das Cerejeiras, 456 - Centro, São Paulo - SP',
      },
    },
  ]

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks()
    
    // Mock do elemento DOM para o mapa
    document.body.innerHTML = '<div id="map"></div>'
  })

  it('renderiza o container do mapa', () => {
    render(<Map restaurants={mockRestaurants} />)
    
    const mapContainer = screen.getByTestId('map-container')
    expect(mapContainer).toBeInTheDocument()
    expect(mapContainer).toHaveAttribute('id', 'map')
  })

  it('inicializa o mapa com as configurações corretas', () => {
    render(<Map restaurants={mockRestaurants} />)
    
    // Verifica se o mapa foi inicializado com as configurações corretas
    expect(require('leaflet').map).toHaveBeenCalledWith('map', {
      center: [-23.550520, -46.633308],
      zoom: 13,
      zoomControl: false,
    })
  })

  it('adiciona a camada de tiles do mapa', () => {
    render(<Map restaurants={mockRestaurants} />)
    
    // Verifica se a camada de tiles foi adicionada
    expect(require('leaflet').tileLayer).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object)
    )
  })

  it('adiciona marcadores para todos os restaurantes', () => {
    render(<Map restaurants={mockRestaurants} />)
    
    // Verifica se os marcadores foram adicionados
    expect(require('leaflet').marker).toHaveBeenCalledTimes(2)
    
    // Verifica se os marcadores foram adicionados com as coordenadas corretas
    expect(require('leaflet').marker).toHaveBeenCalledWith([
      -23.550520,
      -46.633308,
    ])
    expect(require('leaflet').marker).toHaveBeenCalledWith([
      -23.551520,
      -46.634308,
    ])
  })

  it('adiciona popups com informações dos restaurantes', () => {
    render(<Map restaurants={mockRestaurants} />)
    
    // Verifica se os popups foram adicionados
    const marker = require('leaflet').marker()
    expect(marker.bindPopup).toHaveBeenCalledTimes(2)
    
    // Verifica se os popups contêm as informações corretas
    expect(marker.bindPopup).toHaveBeenCalledWith(
      expect.stringContaining('Restaurante Italiano')
    )
    expect(marker.bindPopup).toHaveBeenCalledWith(
      expect.stringContaining('Restaurante Japonês')
    )
  })

  it('atualiza o mapa quando os restaurantes mudam', () => {
    const { rerender } = render(<Map restaurants={[mockRestaurant]} />)
    
    // Adiciona um novo restaurante
    rerender(<Map restaurants={mockRestaurants} />)
    
    // Verifica se o mapa foi atualizado
    expect(require('leaflet').map().remove).toHaveBeenCalled()
    expect(require('leaflet').map).toHaveBeenCalledTimes(2)
  })

  it('chama onRestaurantClick quando um marcador é clicado', () => {
    const onRestaurantClick = jest.fn()
    render(<Map restaurants={mockRestaurants} onRestaurantClick={onRestaurantClick} />)
    
    // Simula o clique em um marcador
    const marker = require('leaflet').marker()
    marker.on.mock.calls[0][1]()
    
    // Verifica se a função foi chamada com o restaurante correto
    expect(onRestaurantClick).toHaveBeenCalledWith(mockRestaurant)
  })

  it('ajusta o zoom e o centro quando um restaurante é selecionado', () => {
    render(<Map restaurants={mockRestaurants} selectedRestaurant={mockRestaurant} />)
    
    // Verifica se o mapa foi ajustado
    expect(require('leaflet').map().setView).toHaveBeenCalledWith(
      [-23.550520, -46.633308],
      15
    )
  })

  it('remove os event listeners ao desmontar o componente', () => {
    const { unmount } = render(<Map restaurants={mockRestaurants} />)
    
    unmount()
    
    // Verifica se os event listeners foram removidos
    const marker = require('leaflet').marker()
    expect(marker.off).toHaveBeenCalled()
  })

  it('exibe um indicador de carregamento enquanto o mapa está inicializando', () => {
    render(<Map restaurants={mockRestaurants} />)
    
    expect(screen.getByText('Carregando mapa...')).toBeInTheDocument()
  })

  it('remove o indicador de carregamento após o mapa ser inicializado', async () => {
    render(<Map restaurants={mockRestaurants} />)
    
    await waitFor(() => {
      expect(screen.queryByText('Carregando mapa...')).not.toBeInTheDocument()
    })
  })

  it('exibe uma mensagem de erro quando o mapa falha ao carregar', async () => {
    // Mock de erro na inicialização do mapa
    require('leaflet').map.mockImplementationOnce(() => {
      throw new Error('Erro ao carregar o mapa')
    })
    
    render(<Map restaurants={mockRestaurants} />)
    
    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar o mapa')).toBeInTheDocument()
    })
  })
}) 