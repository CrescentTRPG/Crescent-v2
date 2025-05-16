import { db } from '@/firebase/config.js'
import { doc, getDoc, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { useMartialPerksStore } from './martialPerksStore.js'
import { useTraitsStore } from './traitsStore.js'
import { useMartialSkillsStore } from './martialSkillsStore.js'
import { useSkillStore } from './skillsStore.js'
import { useStatusEffectStore } from './statusEffectStore.js'
import { usePerformanceStore } from './performanceStore.js'
import { useFaunaStore } from './faunaStore.js'
import { useSpellStore } from './spellsStore.js'

export const useManualStore = defineStore('manual', {
  state: () => ({ generalActions: {} }),
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
        useStatusEffectStore().setManualStatusEffect(docSnap.data()['Status Effects'])
        usePerformanceStore().setManualPerformanceStyles(docSnap.data()['Performance']['styles'])
        useFaunaStore().setFaunaFromManual(docSnap.data()['Fauna'])
        this.generalActions = docSnap.data()['generalActions']
      } else {
        console.log("Couldn't pull base manual!!")
      }
    }
  },
  persist: true
})
