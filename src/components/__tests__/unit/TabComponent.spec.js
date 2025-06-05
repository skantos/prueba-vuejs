import { mount } from '@vue/test-utils'
import TabComponent from '@/components/TabComponent.vue'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// 👇 Mueve el mock afuera para que puedas actualizarlo dinámicamente
vi.mock('@/stores/instrumentStore', () => {
  return {
    useInstrumentStore: vi.fn()
  }
})

import { useInstrumentStore } from '@/stores/instrumentStore'

describe('TabComponent.vue', () => {
  let mockStore

  beforeEach(() => {
    // 👇 define el mock antes de cada test
    mockStore = {
      availableIndices: ['Indice A', 'Indice B'],
      selectedIndex: 'Indice A',
      setSelectedIndex: vi.fn(),
      filteredConstituents: []
    }
    // 👇 actualiza el mock devuelto por useInstrumentStore
    useInstrumentStore.mockReturnValue(mockStore)
  })

  it('renderiza los botones según availableIndices', () => {
    const wrapper = mount(TabComponent)
    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    expect(buttons[0].text()).toBe('Indice A')
    expect(buttons[1].text()).toBe('Indice B')
  })

  it('aplica clases activas correctamente', () => {
    const wrapper = mount(TabComponent)
    const buttons = wrapper.findAll('button')
    expect(buttons[0].classes()).toContain('border-b-[#2B7FFF]')
    expect(buttons[1].classes()).toContain('text-gray-400')
  })

  it('llama a setSelectedIndex al hacer clic en un botón', async () => {
    const wrapper = mount(TabComponent)
    const buttons = wrapper.findAll('button')

    await buttons[1].trigger('click')

    expect(mockStore.setSelectedIndex).toHaveBeenCalledWith('Indice B')
  })
})
