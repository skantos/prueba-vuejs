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
  <div class="tab-component bg-card-bg border border-border-color overflow-hidden">
    <div class="flex">
      <button
        v-for="index in store.availableIndices"
        :key="index"
        @click="toggleIndex(index)"
        :class="[ 
          'py-3 px-4 text-center transition-colors border-b-4',
          store.selectedIndex === index
            ? 'border-b-chart-blue text-white'
            : 'border-b-transparent text-gray-400 hover:border-b-gray-800'
        ]"
      >
        {{ index }}
      </button>
    </div>

  </div>
</template>