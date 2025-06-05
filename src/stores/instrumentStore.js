import { defineStore } from 'pinia'

import constituyentes from '@/data/constituyentes/constituensList.json'

import resumenAGUAS from '@/data/resumen/AGUAS-A.json'
import resumenANDINA from '@/data/resumen/ANDINA-B.json'
import resumenBCI from '@/data/resumen/BCI.json'
import resumenBSANTANDER from '@/data/resumen/BSANTANDER.json'
import resumenCAP from '@/data/resumen/CAP.json'
import resumenIPSA from '@/data/resumen/IPSA.json'

import historyAGUAS from '@/data/history/history-AGUAS-A.json'
import historyANDINA from '@/data/history/history-ANDINA-B.json'
import historyBCI from '@/data/history/history-BCI.json'
import historyBSANTANDER from '@/data/history/history-BSANTANDER.json'
import historyCAP from '@/data/history/history-CAP.json'
import historyIPSA from '@/data/history/history-IPSA.json'

const resumenes = {
  'AGUAS-A': resumenAGUAS,
  'ANDINA-B': resumenANDINA,
  'BCI': resumenBCI,
  'BSANTANDER': resumenBSANTANDER,
  'CAP': resumenCAP,
  'IPSA': resumenIPSA
}

const historiales = {
  'AGUAS-A': historyAGUAS,
  'ANDINA-B': historyANDINA,
  'BCI': historyBCI,
  'BSANTANDER': historyBSANTANDER,
  'CAP': historyCAP,
  'IPSA': historyIPSA
}

export const useInstrumentStore = defineStore('instrumentStore', {
  state: () => ({
    info: constituyentes.data.info,
    constituents: constituyentes.data.constituents,
    resumenes,
    searchTerm: '',
    selectedIndex: '',
    historiales,
    selectedInstrument: null,
    selectedResumen: null,
    selectedHistory: null,
    selectedInfo: null,
    availableIndices: ['IPSA', 'IGPA', 'NASDAQ', 'DOW JONES', 'SP/BVL'], 
    indexData: {}
  }),

  getters: {
    getByCode: (state) => (code) => {
      return state.constituents.find(i => i.codeInstrument === code) ||
             Object.values(state.indexData)
               .flatMap(index => index.constituents || [])
               .find(i => i?.codeInstrument === code)
    },

    filteredConstituents: (state) => {
      if (!state.selectedIndex) return []
      
      const indexConstituents = state.indexData[state.selectedIndex]?.constituents
      const constituentsToFilter = indexConstituents || state.constituents
      
      if (!state.searchTerm.trim()) return constituentsToFilter
      
      const searchTermLower = state.searchTerm.toLowerCase()
      return constituentsToFilter.filter(instr => {
        if (!instr) return false
        
        const codeMatch = instr.codeInstrument?.toLowerCase().includes(searchTermLower)
        const nameMatch = instr.name?.toLowerCase().includes(searchTermLower)
        return codeMatch || nameMatch
      })
    },

    currentIndexInfo: (state) => {
      return state.indexData[state.selectedIndex]?.info || {
        name: state.selectedIndex,
        shortName: state.selectedIndex,
        countryName: 'No disponible',
        codeInstrument: state.selectedIndex
      }
    }
  },

  actions: {
    setSearchTerm(term) {
      this.searchTerm = term
    },

    selectInstrument(code) {
      this.selectedInstrument = code
      this.selectedResumen = this.resumenes[code]?.data || null
      this.selectedHistory = this.historiales[code]?.data || null
      this.selectedInfo = this.getByCode(code) || null
    },

    setSelectedIndex(index) {
      if (this.availableIndices.includes(index)) {
        this.selectedIndex = index
        this.searchTerm = ''

        if (!this.indexData[index]) {
          if (index === 'IPSA') {
            this.indexData[index] = {
              info: constituyentes.data.info,
              constituents: constituyentes.data.constituents
            }
          } else {
            this.indexData[index] = {
              info: null,
              constituents: null
            }
          }
        }

        this.selectedResumen = this.resumenes[index]?.data || null
        this.selectedHistory = this.historiales[index]?.data || null
        this.selectedInfo = this.indexData[index]?.info || null
        this.selectedInstrument = index
      }
    },

    clearSearch() {
      this.searchTerm = ''
    }
  }
})