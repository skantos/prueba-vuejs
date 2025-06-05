<script setup>
import { computed } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'

const store = useInstrumentStore()

const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatPercentage = (value) => {
  const numValue = Number(value)
  const fixedValue = numValue.toFixed(2)
  return `${numValue > 0 ? '+' : ''}${fixedValue}%`
}

const getVariationClass = (value) => {
  const numValue = Number(value)
  return numValue > 0 ? 'text-green-500' : numValue < 0 ? 'text-red-500' : ''
}

const currentResumen = computed(() => {
  const key = store.selectedInstrument || store.selectedIndex
  return key
    ? store.resumenes[key] || { data: { info: {}, price: {} } }
    : { data: { info: {}, price: {} } }
})

const hasDataForSelection = computed(() => {
  const key = store.selectedInstrument || store.selectedIndex
  return key && store.resumenes[key]?.data
})

const currentDateTime = computed(() => {
  const dt = currentResumen.value.data?.price?.datetimeLastPrice
  if (!dt) return ''
  const date = new Date(dt)
  return date.toLocaleDateString('es-CL') + ' - ' + date.toLocaleTimeString('es-CL')
})
</script>

<template>
  <header class="p-4 rounded-lg">
    <template v-if="!store.selectedInstrument && !store.selectedIndex">
      <div class="text-gray-400 text-center py-4">
        Seleccione un índice o instrumento para ver información
      </div>
    </template>

    <template v-else-if="!hasDataForSelection">
      <div class="text-gray-400 text-center py-4">
        No se encontraron datos para la selección actual
      </div>
    </template>

    <template v-else>
      <div class="flex flex-col">
        <h1 class="text-xl font-bold">
          {{ currentResumen.data.info.name }}, {{ currentResumen.data.info.countryName }}
        </h1>

        <div class="flex flex-col">
          <div class="w-full border-b-2 border-[#1F1F1F] pb-1 mt-4">
            <span class="text-gray-400">Indice:</span>
          </div>

          <div class="flex items-center mt-2 text-sm flex-wrap gap-2 border-b-2 border-[#1F1F1F] pb-1">
            <span class="text-gray-400">Valor Actual:</span>
            <span :class="getVariationClass(currentResumen.data.price.performanceRelative)">
              {{ formatNumber(currentResumen.data.price.lastPrice) }}
            </span>

            <span class="text-gray-400">Var % Actual:</span>
            <span :class="getVariationClass(currentResumen.data.price.performanceRelative)">
              {{ formatPercentage(currentResumen.data.price.performanceRelative) }}
            </span>

            <span class="text-gray-400">Var. Puntos Actual:</span>
            <span :class="getVariationClass(currentResumen.data.price.performanceAbsolute)">
              {{ formatNumber(currentResumen.data.price.performanceAbsolute) }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </header>
</template>

<style scoped>
.text-green-500 {
  color: #10b981;
}

.text-red-500 {
  color: #ef4444;
}

.text-gray-400 {
  color: #9ca3af;
}
</style>
