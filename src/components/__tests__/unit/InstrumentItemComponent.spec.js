import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import InstrumentItemComponent from '@/components/InstrumentItemComponent.vue'
import { createTestingPinia } from '@pinia/testing'
import { useInstrumentStore } from '@/stores/instrumentStore'

const mockLeftInstrument = {
  codeInstrument: 'TEST1',
  lastPrice: 1234.56,
  volumeMoney: 5000000,
  pctDay: 1.23,
  pct30D: -2.34,
  pctCY: 5.67,
  pct1Y: 10.11,
}

const mockRightInstrument = {
  codeInstrument: 'TEST2',
  lastPrice: 9876.54,
  volumeMoney: 2000000,
  pctDay: -0.56,
  pct30D: 3.45,
  pctCY: -1.23,
  pct1Y: 7.89,
}

describe('InstrumentItemComponent', () => {
  it('renderiza correctamente con ambos instrumentos', () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: mockLeftInstrument,
        rightInstrument: mockRightInstrument,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('TEST1')
    expect(wrapper.text()).toContain('TEST2')
    expect(wrapper.text()).toContain('1.234,56')
    expect(wrapper.text()).toContain('9.876,54')
    expect(wrapper.text()).toContain('+1.23%')
    expect(wrapper.text()).toContain('-0.56%')
    expect(wrapper.findAll('td').length).toBe(14)
  })

  it('renderiza correctamente solo con instrumento izquierdo', () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: mockLeftInstrument,
        rightInstrument: null,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('TEST1')
    expect(wrapper.text()).not.toContain('TEST2')
    expect(wrapper.find('td[colspan="7"]').exists()).toBe(true)
    expect(wrapper.findAll('td').length).toBe(8)
  })

  it('renderiza correctamente solo con instrumento derecho', () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: null,
        rightInstrument: mockRightInstrument,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).not.toContain('TEST1')
    expect(wrapper.text()).toContain('TEST2')
    expect(wrapper.find('td[colspan="7"]').exists()).toBe(true)
    expect(wrapper.findAll('td').length).toBe(8)
  })

  it('formatea correctamente los números', () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: mockLeftInstrument,
        rightInstrument: mockRightInstrument,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('1.234,56')
    expect(wrapper.text()).toContain('9.876,54')
    expect(wrapper.text()).toContain('5,00')
    expect(wrapper.text()).toContain('2,00')
  })

  it('formatea correctamente los porcentajes', () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: mockLeftInstrument,
        rightInstrument: mockRightInstrument,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('+1.23%')
    expect(wrapper.text()).toContain('-0.56%')
    expect(wrapper.text()).toContain('-2.34%')
    expect(wrapper.text()).toContain('+3.45%')
  })

  it('aplica las clases de variación correctamente', () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: mockLeftInstrument,
        rightInstrument: mockRightInstrument,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.findAll('.text-green-500').length).toBeGreaterThan(0)
    expect(wrapper.findAll('.text-red-500').length).toBeGreaterThan(0)
  })

  it('llama a selectInstrument al hacer clic en una celda', async () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: mockLeftInstrument,
        rightInstrument: mockRightInstrument,
      },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    })

    const store = useInstrumentStore()

    await wrapper.findAll('td')[0].trigger('click')
    expect(store.selectInstrument).toHaveBeenCalledWith('TEST1')

    await wrapper.findAll('td')[7].trigger('click')
    expect(store.selectInstrument).toHaveBeenCalledWith('TEST2')
  })

  it('maneja valores nulos o undefined correctamente', () => {
    const wrapper = mount(InstrumentItemComponent, {
      props: {
        leftInstrument: {
          ...mockLeftInstrument,
          volumeMoney: null,
          pctDay: undefined,
        },
        rightInstrument: null,
      },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    })

    expect(wrapper.text()).toContain('-')
    expect(wrapper.text()).toContain('0.00%')
  })
})
