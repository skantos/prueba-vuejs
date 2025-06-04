<script setup>
import { useInstrumentStore } from '@/stores/instrumentStore'
const store = useInstrumentStore()

const selectInstrument = (code) => {
  store.selectInstrument(code)
}

defineProps({
  leftInstrument: Object,
  rightInstrument: Object
})

const formatNumber = (value) => {
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

const formatPercentage = (value) => {
  const fixedValue = Number(value).toFixed(2)
  return `${fixedValue > 0 ? '+' : ''}${fixedValue}%`
}

const formatMillions = (value) => {
  if (!value) return '-'
  const millions = value / 1_000_000
  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(millions)
}

const getVariationClass = (value) => {
  const numValue = Number(value)
  return numValue > 0
    ? 'text-green-500'
    : numValue < 0
    ? 'text-red-500'
    : ''
}
</script>

<template>
  <tr class="hover:bg-[#1F1F1F]">
    <template v-if="leftInstrument">
      <td 
        class="px-4 py-2 font-semibold cursor-pointer"
        @click="selectInstrument(leftInstrument.codeInstrument)"
      >
        {{ leftInstrument.codeInstrument }}
      </td>
      <td 
        class="px-4 py-2 font-semibold cursor-pointer"
        @click="selectInstrument(leftInstrument.codeInstrument)"
      >
        {{ formatNumber(leftInstrument.lastPrice) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        @click="selectInstrument(leftInstrument.codeInstrument)"
      >
        {{ formatMillions(leftInstrument.volumeMoney) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(leftInstrument.pctDay)"
        @click="selectInstrument(leftInstrument.codeInstrument)"
      >
        {{ formatPercentage(leftInstrument.pctDay) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(leftInstrument.pct30D)"
        @click="selectInstrument(leftInstrument.codeInstrument)"
      >
        {{ formatPercentage(leftInstrument.pct30D) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(leftInstrument.pctCY)"
        @click="selectInstrument(leftInstrument.codeInstrument)"
      >
        {{ formatPercentage(leftInstrument.pctCY) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(leftInstrument.pct1Y)"
        @click="selectInstrument(leftInstrument.codeInstrument)"
      >
        {{ formatPercentage(leftInstrument.pct1Y) }}
      </td>
    </template>
    <template v-else>
      <td colspan="7" class="px-4 py-2"></td>
    </template>

    <template v-if="rightInstrument">
      <td 
        class="px-4 py-2 font-semibold cursor-pointer"
        @click="selectInstrument(rightInstrument.codeInstrument)"
      >
        {{ rightInstrument.codeInstrument }}
      </td>
      <td 
        class="px-4 py-2 font-semibold cursor-pointer"
        @click="selectInstrument(rightInstrument.codeInstrument)"
      >
        {{ formatNumber(rightInstrument.lastPrice) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        @click="selectInstrument(rightInstrument.codeInstrument)"
      >
        {{ formatMillions(rightInstrument.volumeMoney) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(rightInstrument.pctDay)"
        @click="selectInstrument(rightInstrument.codeInstrument)"
      >
        {{ formatPercentage(rightInstrument.pctDay) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(rightInstrument.pct30D)"
        @click="selectInstrument(rightInstrument.codeInstrument)"
      >
        {{ formatPercentage(rightInstrument.pct30D) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(rightInstrument.pctCY)"
        @click="selectInstrument(rightInstrument.codeInstrument)"
      >
        {{ formatPercentage(rightInstrument.pctCY) }}
      </td>
      <td 
        class="px-4 py-2 cursor-pointer"
        :class="getVariationClass(rightInstrument.pct1Y)"
        @click="selectInstrument(rightInstrument.codeInstrument)"
      >
        {{ formatPercentage(rightInstrument.pct1Y) }}
      </td>
    </template>
    <template v-else>
      <td colspan="7" class="px-4 py-2"></td>
    </template>
  </tr>
</template>