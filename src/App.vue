
<script setup>
import { ref, onMounted } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'

import SearchBarComponent from './components/SearchBarComponent.vue'
import ChartComponent from './components/ChartComponent.vue'
import HeaderComponent from './components/HeaderComponent.vue'
import SummaryComponent from './components/SummaryComponent.vue'
import TabComponent from './components/TabComponent.vue'
import InstrumentListComponent from '@/components/InstrumentListComponent.vue'

const store = useInstrumentStore()
</script>

<template>
  <div class="app-container min-h-screen bg-[#121212] text-white">
    <div class="max-w-7xl mx-auto px-4 py-6">
      <SearchBarComponent />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        <div class="lg:col-span-2 space-y-4">
          <HeaderComponent />
          <ChartComponent />
        </div>

        <div>
          <SummaryComponent />
        </div>
      </div>

      <div class="mt-6">
        <TabComponent />
      </div>

      <div class="mt-8">
        <InstrumentListComponent :instruments="store.constituents" />
      </div>

      <footer class="mt-8 text-xs text-gray-500">
        <p>* Los valores pueden tener hasta 15 minutos de desfase.</p>
        <p>* Los valores en USD están ajustados según el tipo de cambio del día.</p>
      </footer>
    </div>
  </div>
</template>


<style>
.app-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>