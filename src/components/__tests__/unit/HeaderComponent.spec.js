import { describe, it, expect, beforeEach, vi } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import HeaderComponent from '@/components/HeaderComponent.vue'

vi.mock('@/stores/instrumentStore', () => ({
  useInstrumentStore: vi.fn(),
}))

import { useInstrumentStore } from '@/stores/instrumentStore'

describe('HeaderComponent.vue', () => {
  let mockStore

  beforeEach(() => {
    mockStore = {
      selectedInstrument: null,
      selectedIndex: null,
      resumenes: {},
    }

    useInstrumentStore.mockReturnValue(mockStore)
  })

  it('muestra mensaje por defecto cuando no hay selección', () => {
    const wrapper = shallowMount(HeaderComponent)
    expect(wrapper.text()).toContain('Seleccione un índice o instrumento para ver información')
  })

  it('muestra mensaje cuando no hay datos para la selección', () => {
    mockStore.selectedIndex = 'ABC123'
    mockStore.resumenes = {
      ABC123: {},
    }

    const wrapper = shallowMount(HeaderComponent)
    expect(wrapper.text()).toContain('No se encontraron datos para la selección actual')
  })

  it('muestra los datos correctamente cuando están disponibles', () => {
    mockStore.selectedInstrument = 'XYZ789'
    mockStore.resumenes = {
      XYZ789: {
        data: {
          info: {
            name: 'Instrumento Prueba',
            countryName: 'Chile',
          },
          price: {
            lastPrice: 1234.56,
            performanceRelative: -2.34,
            performanceAbsolute: -30.45,
            datetimeLastPrice: new Date('2023-08-20T10:00:00Z').toISOString(),
          },
        },
      },
    }

    const wrapper = shallowMount(HeaderComponent)
    expect(wrapper.text()).toContain('Instrumento Prueba')
    expect(wrapper.text()).toContain('Chile')
    expect(wrapper.text()).toContain('-2.34%')
    expect(wrapper.text()).toContain('1.234,56')
    expect(wrapper.text()).toContain('-30,45')
  })
})
