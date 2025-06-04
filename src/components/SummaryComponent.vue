<!-- src/components/SummaryComponent.vue -->
<template>
  <div class="p-4 rounded-lg">
    <div class="flex border-b border-gray-700 mb-4 space-x-4">
      <button
        class="pb-2 font-semibold"
        :class="activeTab === 'resumen' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'"
        @click="activeTab = 'resumen'"
      >
        Resumen
      </button>
      <button
        class="pb-2 font-semibold"
        :class="activeTab === 'detalles' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400'"
        @click="activeTab = 'detalles'"
      >
        Detalles
      </button>
    </div>

    <div v-if="!store.selectedInstrument && !store.selectedIndex" class="text-gray-400 text-center py-4">
      Haga clic en un instrumento o índice para ver su resumen
    </div>


    <div v-else-if="!hasDataForSelectedInstrument" class="text-gray-400 text-center py-4">
      No se encontraron datos para "{{ store.selectedInstrument }}"
    </div>

    <template v-else>
      <div v-if="activeTab === 'resumen'" class="space-y-4 text-sm">
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-gray-400">Cotización:</span>
            <span>{{ currentDateTime }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">MERCADO:</span>
            <span>{{ currentResumen.data.info.marketName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">APERTURA:</span>
            <span>{{ formatNumber(currentResumen.data.price.openPrice) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">CIERRE ANTERIOR:</span>
            <span>{{ formatNumber(currentResumen.data.price.closePrice) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">ÚLTIMO PRECIO:</span>
            <span>{{ formatNumber(currentResumen.data.price.lastPrice) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">VARIACIÓN DÍA:</span>
            <span :class="getVariationClass(currentResumen.data.price.performanceRelative)">
              {{ formatPercentage(currentResumen.data.price.performanceRelative) }}
            </span>
          </div>
        </div>
      </div>

      <div v-else class="space-y-4 text-sm">
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="font-semibold">Cotización</span>
            <span>{{ currentDateTime }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">MERCADO:</span>
            <span>{{ currentResumen.data.info.marketName }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">APERTURA:</span>
            <span>{{ formatNumber(currentResumen.data.price.openPrice) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">CIERRE ANTERIOR:</span>
            <span>{{ formatNumber(currentResumen.data.price.closePrice) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">MÁXIMO DIARIO:</span>
            <span>{{ formatNumber(currentResumen.data.price.maxDay) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">MÍNIMO DIARIO:</span>
            <span>{{ formatNumber(currentResumen.data.price.minDay) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">MÁXIMO 52 SEMANAS:</span>
            <span>{{ formatNumber(currentResumen.data.price.max52W) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">MÍNIMO 52 SEMANAS:</span>
            <span>{{ formatNumber(currentResumen.data.price.min52W) }}</span>
          </div>
          
          <div class="pt-3">
            <div class="flex justify-between font-semibold">
              <span>Variación %</span>
              <span></span>
            </div>
            <div class="flex justify-between mt-2">
              <span class="text-gray-400">1 MES:</span>
              <span :class="getVariationClass(currentResumen.data.price.pct30D)">
                {{ formatPercentage(currentResumen.data.price.pct30D) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">1 AÑO:</span>
              <span :class="getVariationClass(currentResumen.data.price.pctRelW52)">
                {{ formatPercentage(currentResumen.data.price.pctRelW52) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">AÑO A LA FECHA:</span>
              <span :class="getVariationClass(currentResumen.data.price.pctRelCY)">
                {{ formatPercentage(currentResumen.data.price.pctRelCY) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import { useInstrumentStore } from '@/stores/instrumentStore'

  const store = useInstrumentStore()
  const activeTab = ref('resumen')

const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}
const formatPercentage = (value) => {
  const numValue = Number(value)
  const fixedValue = numValue.toFixed(2)
  return `${numValue > 0 ? '+' : ''}${fixedValue}%`
}
const getVariationClass = (val) => {
  if (val > 0) return 'text-green-500'
  if (val < 0) return 'text-red-500'
  return 'text-gray-400'
}

const currentResumen = computed(() => {
  if (store.selectedInstrument) {
    return store.resumenes[store.selectedInstrument] || { data: { info: {}, price: {} } }
  }
  if (store.selectedIndex) {
    return store.resumenes[store.selectedIndex] || { data: { info: {}, price: {} } }
  }
  return { data: { info: {}, price: {} } }
})

const hasDataForSelectedInstrument = computed(() => {
  const key = store.selectedInstrument || store.selectedIndex
  return !!(key && store.resumenes[key]?.data)
})

const currentDateTime = computed(() => {
  const dt = currentResumen.value.data?.price?.datetimeLastPrice
  if (!dt) return ''
  const date = new Date(dt)
  return date.toLocaleDateString('es-CL') + ' - ' + date.toLocaleTimeString('es-CL')
})

</script>

<style scoped>
.flex.justify-between {
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(55, 65, 81, 0.3); 
}
.font-semibold {
  color: white;
}
.text-gray-400 {
  color: #9CA3AF;
}
</style>
