import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import InstrumentListComponent from '@/components/InstrumentListComponent.vue'
import InstrumentItemComponent from '@/components/InstrumentItemComponent.vue'
import { createTestingPinia } from '@pinia/testing'
import { useInstrumentStore } from '@/stores/instrumentStore'
import { nextTick } from 'vue'

const mockConstituents = Array.from({ length: 20 }, (_, i) => ({
  codeInstrument: `TEST${i + 1}`,
  name: `Instrument ${i + 1}`,
  lastPrice: 1000 + i * 100,
  volumeMoney: 1000000 * (i + 1),
  pctDay: (i % 3) - 1,
  pct30D: (i % 5) - 2,
  pctCY: (i % 7) - 3,
  pct1Y: (i % 9) - 4
}))

describe('InstrumentListComponent', () => {
  let wrapper, store

  beforeEach(async () => {
    vi.clearAllMocks()
    
    wrapper = mount(InstrumentListComponent, {
      global: {
        plugins: [createTestingPinia({
          createSpy: vi.fn,
          stubActions: false,
          initialState: {
            instrumentStore: {
              selectedIndex: 'IPSA',
              indexData: {
                IPSA: {
                  constituents: mockConstituents,
                  info: { name: 'IPSA Index' }
                },
                IGPA: {
                  constituents: null,
                  info: null
                }
              },
              sortField: 'codeInstrument',
              sortDirection: 'asc',
              filteredConstituents: [...mockConstituents], 
              searchTerm: ''
            }
          }
        })],
        stubs: {
          ArrowUpIcon: true,
          ArrowDownIcon: true,
          InstrumentItemComponent: true
        }
      }
    })
    
    store = useInstrumentStore()
    store.sortConstituents = vi.fn() 
    await nextTick()
  })

  it('renderiza correctamente con datos', () => {
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAllComponents(InstrumentItemComponent).length).toBe(16) 
  })

  it('divide correctamente los instrumentos en izquierda y derecha', () => {
    const sortedConstituents = [...mockConstituents].sort((a, b) => 
      a.codeInstrument.localeCompare(b.codeInstrument)
    )
    
    expect(wrapper.vm.leftInstruments.length).toBe(16)
    expect(wrapper.vm.rightInstruments.length).toBe(4)
    expect(wrapper.vm.leftInstruments[0].codeInstrument).toBe(sortedConstituents[0].codeInstrument)
    expect(wrapper.vm.rightInstruments[0].codeInstrument).toBe(sortedConstituents[16].codeInstrument)
  })

  it('maneja correctamente el ordenamiento al hacer clic en encabezados', async () => {
    const firstHeader = wrapper.findAll('th')[0]
    const sortButton = firstHeader.find('.cursor-pointer')
    
    await sortButton.trigger('click')
    expect(store.sortConstituents).toHaveBeenCalledWith('codeInstrument', 'desc')
    
    store.sortField = 'codeInstrument'
    store.sortDirection = 'asc'
    await nextTick()
    
    await sortButton.trigger('click')
    expect(store.sortConstituents).toHaveBeenCalledWith('codeInstrument', 'desc')
    
    store.sortField = 'codeInstrument'
    store.sortDirection = 'desc'
    await nextTick()
    
    await sortButton.trigger('click')
    expect(store.sortConstituents).toHaveBeenCalledWith('codeInstrument', 'asc')
  })

  it('aplica clases CSS correctas para iconos de ordenamiento', async () => {
    let firstHeaderIcons = wrapper.findAll('th')[0].findAll('svg')
    expect(firstHeaderIcons[0].classes()).toContain('text-blue-500') 
    expect(firstHeaderIcons[1].classes()).toContain('text-gray-400') 
    
    store.sortField = 'lastPrice'
    store.sortDirection = 'desc'
    await nextTick()
    
    const secondHeaderIcons = wrapper.findAll('th')[1].findAll('svg')
    expect(secondHeaderIcons[0].classes()).toContain('text-gray-400') 
    expect(secondHeaderIcons[1].classes()).toContain('text-blue-500') 
  })

  it('muestra mensaje cuando no hay datos para el índice', async () => {
    store.selectedIndex = 'IGPA'
    await nextTick()
    
    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('No se encontraron datos para el índice "IGPA"')
  })

  it('muestra mensaje cuando no hay instrumentos filtrados', async () => {
    store.searchTerm = 'XYZ123'
    await nextTick()
    
    expect(wrapper.find('table').exists()).toBe(false)
    expect(wrapper.text()).toContain('No hay instrumentos disponibles para el índice "IPSA"')
  })

  it('calcula correctamente las propiedades computadas', async () => {
    expect(wrapper.vm.hasDataForSelectedIndex).toBe(true)
    
    expect(wrapper.vm.hasFilteredConstituents).toBe(true)
    
    expect(wrapper.vm.showNoDataMessage).toBe(false)
    
    store.selectedIndex = ''
    await nextTick()
    expect(wrapper.vm.showNoDataMessage).toBe(false)
    
    store.selectedIndex = 'IGPA'
    await nextTick()
    expect(wrapper.vm.hasDataForSelectedIndex).toBe(false)
    expect(wrapper.vm.showNoDataMessage).toBe('no-data')
    
    store.selectedIndex = 'IPSA'
    store.searchTerm = 'XYZ123'
    await nextTick()
    expect(wrapper.vm.hasFilteredConstituents).toBe(false)
    expect(wrapper.vm.showNoDataMessage).toBe('no-constituents')
  })
})