<script setup>
import { ref, watch } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'

const store = useInstrumentStore()
const searchQuery = ref('')
const showResults = ref(false)

watch(searchQuery, (newValue) => {
  store.setSearchTerm(newValue)
  showResults.value = newValue.length > 0
})
</script>

<template>
  <div class="search-bar relative">
    <div class="flex items-center bg-card-bg border border-border-color rounded-lg">
      <div class="px-3 py-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <input
        type="text"
        class="w-full py-2 px-2 bg-transparent focus:outline-none text-white"
        placeholder="Busca un instrumento"
        v-model="searchQuery"
      />
    </div>
  </div>
</template>
