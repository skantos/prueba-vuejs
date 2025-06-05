import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount } from '@vue/test-utils'
import SummaryComponent from '@/components/SummaryComponent.vue'
import { useInstrumentStore } from '@/stores/instrumentStore'

vi.mock('@/stores/instrumentStore', () => ({
  useInstrumentStore: vi.fn(),
}))

describe('SummaryComponent.vue', () => {
  let wrapper
  let mockStore

  const mockResumen = {
    data: {
      info: { marketName: 'Bolsa CL' },
      price: {
        datetimeLastPrice: '2024-06-03T13:00:00Z',
        openPrice: 1000,
        closePrice: 950,
        lastPrice: 1020,
        performanceRelative: 1.5,
        maxDay: 1050,
        minDay: 980,
        max52W: 1500,
        min52W: 800,
        pct30D: 2.2,
        pctRelW52: -3.2,
        pctRelCY: 0,
      },
    },
  }

  beforeEach(() => {
    mockStore = {
      selectedInstrument: 'TEST123',
      selectedIndex: null,
      resumenes: {
        TEST123: mockResumen,
      },
    }
    useInstrumentStore.mockReturnValue(mockStore)

    wrapper = shallowMount(SummaryComponent)
  })

  it('debe renderizar correctamente los datos del resumen', () => {
    expect(wrapper.text()).toContain('Bolsa CL')
    expect(wrapper.text()).toContain('APERTURA:')
    expect(wrapper.text()).toContain('1.50%')
  })

  it('debe cambiar de pestaña al hacer clic en Detalles', async () => {
    const tabs = wrapper.findAll('button')
    expect(wrapper.vm.activeTab).toBe('resumen')

    await tabs[1].trigger('click')
    expect(wrapper.vm.activeTab).toBe('detalles')

    expect(wrapper.text()).toContain('MÁXIMO 52 SEMANAS:')
    expect(wrapper.text()).toMatch(/MÍNIMO 52 SEMANAS:\s*800[,.]00/)
  })

  it('debe mostrar mensaje si no hay instrumento seleccionado', async () => {
    useInstrumentStore.mockReturnValueOnce({
      selectedInstrument: null,
      selectedIndex: null,
      resumenes: {},
    })
    wrapper = shallowMount(SummaryComponent)

    expect(wrapper.text()).toContain('Haga clic en un instrumento o índice para ver su resumen')
  })

  it('debe mostrar mensaje si no hay datos para el instrumento', async () => {
    useInstrumentStore.mockReturnValueOnce({
      selectedInstrument: 'ABC',
      selectedIndex: null,
      resumenes: {}, 
    })
    wrapper = shallowMount(SummaryComponent)

    expect(wrapper.text()).toContain('No se encontraron datos para "ABC"')
  })
})
