import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import ChartComponent from '@/components/ChartComponent.vue'

vi.spyOn(console, 'error').mockImplementation(() => {})
HTMLCanvasElement.prototype.getContext = vi.fn((type) => {
  if (type === '2d') {
    return {
      fillRect: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi.fn(),
      putImageData: vi.fn(),
      createImageData: vi.fn(),
      setTransform: vi.fn(),
      drawImage: vi.fn(),
      save: vi.fn(),
      fillText: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      closePath: vi.fn(),
      stroke: vi.fn(),
      translate: vi.fn(),
      scale: vi.fn(),
      rotate: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      strokeRect: vi.fn(),
      measureText: vi.fn(() => ({ width: 0 })),
    }
  }
  return null
})

describe('ChartComponent.vue', () => {
  it('renderiza correctamente los datos del estado', () => {
    const wrapper = mount(ChartComponent, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            stubActions: false,
          }),
        ],
      },
    })

    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })
})
