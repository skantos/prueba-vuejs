<script setup>
import { ref, computed } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'

const store = useInstrumentStore()
const activeTab = ref('resumen')

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

const getVariationClass = (val) => {
  if (val > 0) return 'text-green-500'
  if (val < 0) return 'text-red-500'
  return 'text-gray-400'
}

const currentResumen = computed(() => {
  const key = store.selectedInstrument || store.selectedIndex
  return key
    ? store.resumenes[key] || { data: { info: {}, price: {} } }
    : { data: { info: {}, price: {} } }
})

const hasDataForSelectedInstrument = computed(() => {
  const key = store.selectedInstrument || store.selectedIndex
  return key && store.resumenes[key]?.data
})

const currentDateTime = computed(() => {
  const dt = currentResumen.value.data?.price?.datetimeLastPrice
  if (!dt) return ''
  const date = new Date(dt)
  return `${date.toLocaleDateString('es-CL')} - ${date.toLocaleTimeString('es-CL')}`
})

const summaryItems = computed(() => ({
  resumen: [
    { label: 'Cotización:', value: currentDateTime.value, isTitle: true },
    { label: 'MERCADO:', value: currentResumen.value.data.info.marketName },
    { label: 'APERTURA:', value: formatNumber(currentResumen.value.data.price.openPrice) },
    { label: 'CIERRE ANTERIOR:', value: formatNumber(currentResumen.value.data.price.closePrice) },
    { label: 'ÚLTIMO PRECIO:', value: formatNumber(currentResumen.value.data.price.lastPrice) },
    {
      label: 'VARIACIÓN DÍA:',
      value: formatPercentage(currentResumen.value.data.price.performanceRelative),
      variation: currentResumen.value.data.price.performanceRelative,
    },
  ],
  detalles: [
    { label: 'Cotización', value: currentDateTime.value, isTitle: true },
    { label: 'MERCADO:', value: currentResumen.value.data.info.marketName },
    { label: 'APERTURA:', value: formatNumber(currentResumen.value.data.price.openPrice) },
    { label: 'CIERRE ANTERIOR:', value: formatNumber(currentResumen.value.data.price.closePrice) },
    { label: 'MÁXIMO DIARIO:', value: formatNumber(currentResumen.value.data.price.maxDay) },
    { label: 'MÍNIMO DIARIO:', value: formatNumber(currentResumen.value.data.price.minDay) },
    { label: 'MÁXIMO 52 SEMANAS:', value: formatNumber(currentResumen.value.data.price.max52W) },
    { label: 'MÍNIMO 52 SEMANAS:', value: formatNumber(currentResumen.value.data.price.min52W) },
    { label: 'Variación %', isSectionTitle: true },
    {
      label: '1 MES:',
      value: formatPercentage(currentResumen.value.data.price.pct30D),
      variation: currentResumen.value.data.price.pct30D,
    },
    {
      label: '1 AÑO:',
      value: formatPercentage(currentResumen.value.data.price.pctRelW52),
      variation: currentResumen.value.data.price.pctRelW52,
    },
    {
      label: 'AÑO A LA FECHA:',
      value: formatPercentage(currentResumen.value.data.price.pctRelCY),
      variation: currentResumen.value.data.price.pctRelCY,
    },
  ],
}))
</script>

<template>
  <div class="p-4 mt-10 rounded-lg">
    <div class="flex border-b border-gray-700 mb-2 space-x-4">
      <button
        v-for="tab in ['resumen', 'detalles']"
        :key="tab"
        class="pb-2 font-semibold"
        :class="{
          'text-white border-b-2 border-blue-500': activeTab === tab,
          'text-gray-400': activeTab !== tab,
        }"
        @click="activeTab = tab"
      >
        {{ tab === 'resumen' ? 'Resumen' : 'Detalles' }}
      </button>
    </div>

    <template v-if="!store.selectedInstrument && !store.selectedIndex">
      <div class="text-gray-400 text-center py-4">
        Haga clic en un instrumento o índice para ver su resumen
      </div>
    </template>

    <template v-else-if="!hasDataForSelectedInstrument">
      <div class="text-gray-400 text-center py-4">
        No se encontraron datos para "{{ store.selectedInstrument || store.selectedIndex }}"
      </div>
    </template>

    <template v-else>
      <div class="space-y-4 text-sm">
        <template v-for="(item, index) in summaryItems[activeTab]" :key="index">
          <div v-if="item.isSectionTitle" class="pt-3 border-bottom-custom">
            <div class="flex justify-between font-semibold">
              <span>{{ item.label }}</span>
              <span></span>
            </div>
          </div>
          <div
            v-else
            class="flex justify-between"
            :class="[
              { 'font-semibold border-bottom-custom': item.isTitle },
              { 'text-gray-400': !item.isTitle },
            ]"
          >
            <span>{{ item.label }}</span>
            <span :class="item.variation !== undefined ? getVariationClass(item.variation) : ''">
              {{ item.value }}
            </span>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.border-bottom-custom {
  border-bottom: 2px solid #364153;
  padding-bottom: 4px;
  margin-bottom: 6px;
}
.font-semibold {
  color: white;
}
.text-gray-400 {
  color: #9ca3af;
}
.text-green-500 {
  color: #10b981;
}
.text-red-500 {
  color: #ef4444;
}
</style>
