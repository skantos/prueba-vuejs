<script setup>
import { computed } from 'vue'
import { useInstrumentStore } from '@/stores/instrumentStore'
import InstrumentItemComponent from './InstrumentItemComponent.vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'

const instrumentStore = useInstrumentStore()

const sortBy = (field, direction = 'asc') => {
  instrumentStore.sortConstituents(field, direction)
}

const leftInstruments = computed(() => instrumentStore.filteredConstituents.slice(0, 16))
const rightInstruments = computed(() => instrumentStore.filteredConstituents.slice(16))

const hasDataForSelectedIndex = computed(() => {
  return instrumentStore.indexData[instrumentStore.selectedIndex]?.constituents !== null
})

const hasFilteredConstituents = computed(() => {
  return instrumentStore.filteredConstituents.length > 0
})

const showNoDataMessage = computed(() => {
  if (!instrumentStore.selectedIndex) return false
  if (!hasDataForSelectedIndex.value) return 'no-data'
  if (!hasFilteredConstituents.value) return 'no-constituents'
  return false
})
</script>

<template>
  <div>
    <template v-if="hasDataForSelectedIndex && hasFilteredConstituents">
      <table class="min-w-full h-30% text-left text-xs border-separate">
        <thead>
          <tr>
            <template
              v-for="col in [
                { name: 'Nombre', field: 'codeInstrument' },
                { name: 'Último', field: 'lastPrice' },
                { name: 'Monto (MM)', field: 'volumeMoney' },
                { name: 'Var. Día', field: 'pctDay' },
                { name: 'Var. 30D', field: 'pct30D' },
                { name: 'Año Actual', field: 'pctCY' },
                { name: '12 Meses', field: 'pct1Y' },
              ]"
              :key="col.field"
            >
              <th class="px-4 py-2 font-semibold">
                <div
                  class="flex items-center gap-1 cursor-pointer"
                  @click="
                    sortBy(
                      col.field,
                      instrumentStore.sortField === col.field &&
                        instrumentStore.sortDirection === 'asc'
                        ? 'desc'
                        : 'asc',
                    )
                  "
                >
                  <span>{{ col.name }}</span>
                  <div class="flex flex-col">
                    <ArrowUpIcon
                      class="w-3 h-3"
                      :class="{
                        'text-blue-500':
                          instrumentStore.sortField === col.field &&
                          instrumentStore.sortDirection === 'asc',
                        'text-gray-400':
                          instrumentStore.sortField !== col.field ||
                          instrumentStore.sortDirection !== 'asc',
                      }"
                    />
                    <ArrowDownIcon
                      class="w-3 h-3"
                      :class="{
                        'text-blue-500':
                          instrumentStore.sortField === col.field &&
                          instrumentStore.sortDirection === 'desc',
                        'text-gray-400':
                          instrumentStore.sortField !== col.field ||
                          instrumentStore.sortDirection !== 'desc',
                      }"
                    />
                  </div>
                </div>
              </th>
            </template>

            <template
              v-for="col in [
                { name: 'Nombre', field: 'codeInstrument' },
                { name: 'Último', field: 'lastPrice' },
                { name: 'Monto (MM)', field: 'volumeMoney' },
                { name: 'Var. Día', field: 'pctDay' },
                { name: 'Var. 30D', field: 'pct30D' },
                { name: 'Año Actual', field: 'pctCY' },
                { name: '12 Meses', field: 'pct1Y' },
              ]"
              :key="'right-' + col.field"
            >
              <th class="px-4 py-2 font-semibold">
                <div
                  class="flex items-center gap-1 cursor-pointer"
                  @click="
                    sortBy(
                      col.field,
                      instrumentStore.sortField === col.field &&
                        instrumentStore.sortDirection === 'asc'
                        ? 'desc'
                        : 'asc',
                    )
                  "
                >
                  <span>{{ col.name }}</span>
                  <div class="flex flex-col">
                    <ArrowUpIcon
                      class="w-3 h-3"
                      :class="{
                        'text-blue-500':
                          instrumentStore.sortField === col.field &&
                          instrumentStore.sortDirection === 'asc',
                        'text-gray-400':
                          instrumentStore.sortField !== col.field ||
                          instrumentStore.sortDirection !== 'asc',
                      }"
                    />
                    <ArrowDownIcon
                      class="w-3 h-3"
                      :class="{
                        'text-blue-500':
                          instrumentStore.sortField === col.field &&
                          instrumentStore.sortDirection === 'desc',
                        'text-gray-400':
                          instrumentStore.sortField !== col.field ||
                          instrumentStore.sortDirection !== 'desc',
                      }"
                    />
                  </div>
                </div>
              </th>
            </template>
          </tr>
        </thead>
        <tbody class="[&>tr:hover]:bg-gray-100">
          <InstrumentItemComponent
            v-for="(_, index) in Math.max(leftInstruments.length, rightInstruments.length)"
            :key="index"
            :left-instrument="leftInstruments[index]"
            :right-instrument="rightInstruments[index]"
          />
        </tbody>
      </table>
    </template>

    <template v-else-if="showNoDataMessage">
      <div class="p-4 text-center text-gray-500">
        <template v-if="showNoDataMessage === 'no-data'">
          No se encontraron datos para el índice "{{ instrumentStore.selectedIndex }}"
        </template>
        <template v-else-if="showNoDataMessage === 'no-constituents'">
          No hay instrumentos disponibles para el índice "{{ instrumentStore.selectedIndex }}"
        </template>
      </div>
    </template>
  </div>
</template>
