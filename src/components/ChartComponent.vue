<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'
import Chart from 'chart.js/auto'

const store = useInstrumentStore()

const chartCanvas = ref(null)

const chartContainer = ref(null)

let chartInstance = null
const activeTimeFrame = ref('1M')
const showDatePicker = ref(false)
const customStartDate = ref('')
const customEndDate = ref('')

const timeFrames = [
  { id: '1D', label: '1D' },
  { id: '1S', label: '1S' },
  { id: '1M', label: '1M' },
  { id: '3M', label: '3M' },
  { id: '6M', label: '6M' },
  { id: '1A', label: '1A' },
  { id: '5A', label: '5A' }
]

const currentRangeLabel = computed(() => {
  if (!filteredChartData.value.length) return ''
  
  const firstDate = new Date(filteredChartData.value[0].datetimeLastPrice)
  const lastDate = new Date(filteredChartData.value[filteredChartData.value.length - 1].datetimeLastPrice)
  
  return `${firstDate.toLocaleDateString('es-CL')} - ${lastDate.toLocaleDateString('es-CL')}`
})

const filteredChartData = computed(() => {
  if (!store.selectedIndex || !store.historiales[store.selectedIndex]?.data?.chart) return []
  
  const allData = store.historiales[store.selectedIndex].data.chart
  const now = new Date()
  
  switch(activeTimeFrame.value) {
    case '1D':
      return allData.filter(item => {
        const itemDate = new Date(item.datetimeLastPrice)
        return itemDate.toDateString() === now.toDateString()
      })
    case '1S':
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(now.getDate() - 7)
      return allData.filter(item => new Date(item.datetimeLastPrice) >= oneWeekAgo)
    case '1M':
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(now.getMonth() - 1)
      return allData.filter(item => new Date(item.datetimeLastPrice) >= oneMonthAgo)
    case '3M':
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(now.getMonth() - 3)
      return allData.filter(item => new Date(item.datetimeLastPrice) >= threeMonthsAgo)
    case '6M':
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(now.getMonth() - 6)
      return allData.filter(item => new Date(item.datetimeLastPrice) >= sixMonthsAgo)
    case '1A':
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(now.getFullYear() - 1)
      return allData.filter(item => new Date(item.datetimeLastPrice) >= oneYearAgo)
    case '5A':
      const fiveYearsAgo = new Date()
      fiveYearsAgo.setFullYear(now.getFullYear() - 5)
      return allData.filter(item => new Date(item.datetimeLastPrice) >= fiveYearsAgo)
    default:
      return allData
  }
})

const initChart = () => {
  if (chartInstance) {
    chartInstance.destroy()
  }

  const ctx = chartCanvas.value.getContext('2d')
  
  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: filteredChartData.value.map(item => 
        new Date(item.datetimeLastPrice).toLocaleDateString('es-CL')
      ),
      datasets: [{
        label: 'Precio',
        data: filteredChartData.value.map(item => item.lastPrice),
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: function(context) {
              return `$${context.parsed.y.toLocaleString('es-CL')}`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#9CA3AF'
          }
        },
        y: {
          grid: {
            color: 'rgba(156, 163, 175, 0.1)'
          },
          ticks: {
            color: '#9CA3AF',
            callback: function(value) {
              return `$${value.toLocaleString('es-CL')}`
            }
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  })
}

const setTimeFrame = (frame) => {
  activeTimeFrame.value = frame
  showDatePicker.value = false
}

const applyCustomDateRange = () => {
  if (!customStartDate.value || !customEndDate.value) return
  
  const start = new Date(customStartDate.value)
  const end = new Date(customEndDate.value)
  
  activeTimeFrame.value = 'custom'
  showDatePicker.value = false
  
  filteredChartData.value = store.historiales[store.selectedIndex].data.chart.filter(item => {
    const itemDate = new Date(item.datetimeLastPrice)
    return itemDate >= start && itemDate <= end
  })
}

watch(filteredChartData, () => {
  initChart()
}, { deep: true })

watch(() => store.selectedIndex, () => {
  activeTimeFrame.value = '1M' 
  initChart()
})

onMounted(() => {
  initChart()
})

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>




<template>
  <div class="chart-component bg-card-bg border border-border-color rounded-lg p-4 mb-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="font-semibold">Histórico {{ store.selectedIndex }}</h3>
      <div class="text-sm text-gray-400">
        {{ currentRangeLabel }}
      </div>
    </div>

    <div class="chart-container" ref="chartContainer" style="height: 250px;">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="time-frame-selector flex space-x-2 mt-4 overflow-x-auto pb-2">
      <button 
        v-for="frame in timeFrames" 
        :key="frame.id"
        @click="setTimeFrame(frame.id)"
        :class="[
          'px-3 py-1 text-sm rounded-md transition-colors',
          activeTimeFrame === frame.id 
            ? 'bg-chart-blue text-white' 
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        ]"
      >
        {{ frame.label }}
      </button>

      <button 
        class="px-3 py-1 text-sm rounded-md bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
        @click="showDatePicker = !showDatePicker"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
    </div>

    <div v-if="showDatePicker" class="mt-3 p-3 bg-gray-800 rounded-md">
      <div class="flex space-x-2">
        <input 
          type="date" 
          v-model="customStartDate" 
          class="bg-gray-700 text-white px-2 py-1 rounded text-sm"
        >
        <input 
          type="date" 
          v-model="customEndDate" 
          class="bg-gray-700 text-white px-2 py-1 rounded text-sm"
        >
        <button 
          @click="applyCustomDateRange"
          class="px-3 py-1 bg-chart-blue text-white rounded-md text-sm"
        >
          Aplicar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .chart-component {
    background-color: #1f1f1f;
    border-color: #3a3a3a;
  }

  .bg-card-bg {
    background-color: #1f1f1f;
  }

  .border-border-color {
    border-color: #3a3a3a;
  }

  .bg-chart-blue {
    background-color: #1976d2;
  }

  .time-frame-selector::-webkit-scrollbar {
    height: 4px;
  }

  .time-frame-selector::-webkit-scrollbar-thumb {
    background-color: #3a3a3a;
    border-radius: 2px;
  }
</style>
