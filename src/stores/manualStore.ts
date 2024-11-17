import { db } from '@/firebase/config.js'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { useMartialPerksStore } from './martialPerksStore.js'
import { useTraitsStore } from './traitsStore.js'
import { useMartialSkillsStore } from './martialSkillsStore.js'
import { useSkillStore } from './skillsStore.js'

export const useManualStore = defineStore('manual', {
  state: () => ({}),
  getters: {},
  actions: {
    async pullManualFromFirebase() {
      const manualRef = doc(db, 'Ability/Base')
      const docSnap = await getDoc(manualRef)
      if (docSnap.exists()) {
        useMartialPerksStore().setManualMartialPerksFromFirebase(docSnap.data()?.perks)
        useTraitsStore().setManualTraits(docSnap.data()?.Traits)
        useMartialSkillsStore().setAllSpecializationsFromFirebase(docSnap.data()?.Specializations)
        useMartialSkillsStore().setAllCombatStylesFromFirebase(docSnap.data()['Combat Styles'])
        useSkillStore().setAllSkillsFromFirebase(docSnap.data()?.Skills)
      } else {
        console.log("Couldn't pull base manual!!")
      }
    }
  },
  persist: true
})
