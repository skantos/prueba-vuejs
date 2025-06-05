import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import SearchBarComponent from '@/components/SearchBarComponent.vue';
import { useInstrumentStore } from '@/stores/instrumentStore';

describe('SearchBarComponent', () => {
  it('actualiza el término de búsqueda en el store', async () => {
    const wrapper = mount(SearchBarComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      },
    });

    const store = useInstrumentStore();
    const input = wrapper.find('input');
    await input.setValue('AAPL');

    expect(store.setSearchTerm).toHaveBeenCalledWith('AAPL');
  });
});


