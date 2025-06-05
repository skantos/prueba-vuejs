import { setActivePinia, createPinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useInstrumentStore } from '@/stores/instrumentStore'

// Mocks parciales si es necesario
vi.mock('@/data/constituyentes/constituensList.json', () => ({
  default: {
    data: {
      info: { name: 'IPSA Index', countryName: 'Chile' },
      constituents: [
        { codeInstrument: 'AGUAS-A', name: 'Aguas Andinas' },
        { codeInstrument: 'CAP', name: 'CAP S.A.' },
      ],
    },
  },
}))

vi.mock('@/data/resumen/AGUAS-A.json', () => ({ default: { data: { resumen: 'Resumen AGUAS' } } }))
vi.mock('@/data/history/history-AGUAS-A.json', () => ({ default: { data: [{ date: '2023-01-01', value: 100 }] } }))

describe('instrumentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicializa correctamente el estado', () => {
    const store = useInstrumentStore()

    expect(store.constituents.length).toBeGreaterThan(0)
    expect(store.selectedInstrument).toBe(null)
    expect(store.searchTerm).toBe('')
    expect(store.sortField).toBe('codeInstrument')
  })

  it('setSearchTerm cambia correctamente el término de búsqueda', () => {
    const store = useInstrumentStore()

    store.setSearchTerm('agua')
    expect(store.searchTerm).toBe('agua')
  })

  it('clearSearch limpia correctamente el término de búsqueda', () => {
    const store = useInstrumentStore()

    store.setSearchTerm('algo')
    store.clearSearch()
    expect(store.searchTerm).toBe('')
  })

  it('selectInstrument actualiza los datos seleccionados correctamente', () => {
    const store = useInstrumentStore()

    store.selectInstrument('AGUAS-A')

    expect(store.selectedInstrument).toBe('AGUAS-A')
    expect(store.selectedResumen).toEqual({ resumen: 'Resumen AGUAS' })
    expect(store.selectedHistory).toEqual([{ date: '2023-01-01', value: 100 }])
    expect(store.selectedInfo).toEqual({ codeInstrument: 'AGUAS-A', name: 'Aguas Andinas' })
  })

  it('setSelectedIndex actualiza correctamente el índice seleccionado', () => {
    const store = useInstrumentStore()

    store.setSelectedIndex('IPSA')
    expect(store.selectedIndex).toBe('IPSA')
    expect(store.indexData['IPSA']).toBeTruthy()
    expect(store.selectedInstrument).toBe('IPSA')
  })

  it('filteredConstituents devuelve resultados filtrados por searchTerm', () => {
    const store = useInstrumentStore()

    store.setSelectedIndex('IPSA')
    store.setSearchTerm('cap')

    const filtered = store.filteredConstituents
    expect(filtered).toHaveLength(1)
    expect(filtered[0].codeInstrument).toBe('CAP')
  })

  it('sortConstituents ordena por campo correctamente', () => {
    const store = useInstrumentStore()

    store.setSelectedIndex('IPSA')
    store.sortConstituents('name', 'desc')
    const sorted = store.filteredConstituents

    expect(sorted[0].name).toBe('CAP S.A.')
    expect(sorted[1].name).toBe('Aguas Andinas')
  })

  it('currentIndexInfo devuelve info básica si no existe en indexData', () => {
    const store = useInstrumentStore()

    store.setSelectedIndex('NASDAQ')
    const info = store.currentIndexInfo

    expect(info.name).toBe('NASDAQ')
    expect(info.countryName).toBe('No disponible')
  })
})
