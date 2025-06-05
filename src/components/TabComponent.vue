<script setup>
import { computed } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'

const store = useInstrumentStore()

function toggleIndex(index) {
  store.setSelectedIndex(index)
}

const filteredConstituents = computed(() => {
  return store.filteredConstituents
})
</script>

<template>
  <div class="tab-component border-b overflow-hidden">
    <div class="flex">
      <button
        v-for="index in store.availableIndices"
        :key="index"
        @click="toggleIndex(index)"
        :class="[
          'py-3 px-4 text-center transition-colors border-b-4',
          store.selectedIndex === index
            ? 'border-b-[#2B7FFF] text-white'
            : 'border-b-transparent text-gray-400 hover:border-b-[#2B7FFF]',
        ]"
      >
        {{ index }}
      </button>
    </div>
  </div>
</template>
