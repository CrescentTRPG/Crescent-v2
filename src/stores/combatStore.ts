import { useCollection } from '@/composable/useCollection.js'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore.js'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useDesignStore } from './designStore.js'
import { usePartyStore } from './partyStore.js'
import { useManualStore } from './manualStore.js'
import { useCharacterStore } from './characterStore.js'
import { DEFAULT_DESIGN } from '@/bases.js'

export const useAdventureStore = defineStore('adventure', {
  state: () => ({
    activeCombat: {
      combatants: {},
      players: []
    } //combat
  }),
  actions: {},
  persist: true
})
