
<script setup>
import { computed } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'
import InstrumentItemComponent from './InstrumentItemComponent.vue'

const instrumentStore = useInstrumentStore()

const leftInstruments = computed(() =>
instrumentStore.filteredConstituents.slice(0, 16)
)
const rightInstruments = computed(() =>
instrumentStore.filteredConstituents.slice(16)
)

const hasDataForSelectedIndex = computed(() => {
return instrumentStore.indexData[instrumentStore.selectedIndex]?.constituents !== null
})
const hasFilteredConstituents = computed(() => {
return instrumentStore.filteredConstituents.length > 0
})
</script>


<template>
<div>
    <table 
    v-if="hasDataForSelectedIndex && hasFilteredConstituents" 
    class="min-w-full h-30% text-left text-xs border-separate"
    >
    <thead>
        <tr>
        <th class="px-4 py-2 font-semibold">Nombre</th>
        <th class="px-4 py-2 font-semibold">Último</th>
        <th class="px-4 py-2 font-semibold">Monto (MM)</th>
        <th class="px-4 py-2 font-semibold">Var. Día</th>
        <th class="px-4 py-2 font-semibold">Var. 30D</th>
        <th class="px-4 py-2 font-semibold">Año Actual</th>
        <th class="px-4 py-2 font-semibold">12 Meses</th>
        <th class="px-4 py-2 font-semibold">Nombre</th>
        <th class="px-4 py-2 font-semibold">Último</th>
        <th class="px-4 py-2 font-semibold">Monto (MM)</th>
        <th class="px-4 py-2 font-semibold">Var. Día</th>
        <th class="px-4 py-2 font-semibold">Var. 30D</th>
        <th class="px-4 py-2 font-semibold">Año Actual</th>
        <th class="px-4 py-2 font-semibold">12 Meses</th>
        </tr>
    </thead>
    <tbody class="[&>tr:hover]:bg-gray-100">
        <InstrumentItemComponent
        v-for="(_, index) in Math.max(leftInstruments.length, rightInstruments.length)"
        :key="index"
        :leftInstrument="leftInstruments[index]"
        :rightInstrument="rightInstruments[index]"
        />
    </tbody>
    </table>

    <div 
    v-else-if="instrumentStore.selectedIndex && !hasDataForSelectedIndex" 
    class="p-4 text-center text-gray-500"
    >
    No se encontraron datos para el índice "{{ instrumentStore.selectedIndex }}"
    </div>
    <div 
    v-else-if="instrumentStore.selectedIndex && hasDataForSelectedIndex && !hasFilteredConstituents" 
    class="p-4 text-center text-gray-500"
    >
    No hay instrumentos disponibles para el índice "{{ instrumentStore.selectedIndex }}"
    </div>
</div>
</template>

