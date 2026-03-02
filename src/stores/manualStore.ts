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
import { ABILITY_ENTRY } from '@/bases.js'
import { useAdventureStore } from './adventureStore.js'
import { useEquipmentStore } from './equipmentStore.ts'

export interface Rule {
  title: string
  type: string
  document: string
  tags: string
}

export const useManualStore = defineStore('manual', {
  state: () => ({
    generalActions: {},
    rollingTables: {},
    customAbilities: { ABILITY_ENTRY },
    stagedAbilityEntry: ABILITY_ENTRY,
    buildCustomNavPos: '',
    rulesReference: {}
  }),
  getters: {
    getCustomAbilities(context) {
      return Object.values(context.customAbilities)
    },
    getCustomSpells(context) {
      return Object.values(context.customAbilities).filter((a) => a.type === 'Spellgroup')
    },
    getRules(context): Rule[] {
      let ret: Rule[] = []

      const vals = Object.values(context.rulesReference).map((rule: any) => ({
        title: rule.title || '',
        type: rule.type || 'html',
        document: rule.document || '',
        tags: rule.tags || []
      }))
      ret = ret.concat(vals)

      return ret
    }
  },
  actions: {
    updateStagedAbilityEntry(newStagedAbility) {
      this.stagedAbilityEntry = newStagedAbility
    },
    saveStagedCustomAbiity(newStagedAbility) {
      this.customAbilities[newStagedAbility.name] = newStagedAbility
      useAdventureStore().updateCustomAbilitiesInFirebase(this.customAbilities)
    },
    removeCustomAbility(name) {
      delete this.customAbilities[name]
      useAdventureStore().updateCustomAbilitiesInFirebase(this.customAbilities)
    },
    setCustomAbilities(abilities) {
      this.customAbilities = abilities
    },
    setCustomAbilitiesAsCharacter(abilities) {
      this.customAbilities = abilities
      console.log('setCustom', this.customAbilities)
      useSpellStore().setUpBuildDisplay(undefined)
    },
    async pullManualFromFirebase() {
      useSpellStore().pullManualSpellgroupsFromFirebase()

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
        useEquipmentStore().setAlchemicalIngredientsFromFirebase(
          docSnap.data()['Alchemical Ingredients']
        )
        this.rollingTables = docSnap.data()['RollingTables']
        this.generalActions = docSnap.data()['generalActions']
      } else {
        console.log("Couldn't pull base manual!!")
      }
      const rulesReference = doc(db, 'Ability/RulesReference')
      const reference = await getDoc(rulesReference)
      if (reference.exists()) {
        this.rulesReference = reference.data()
      }
    }
  },
  persist: true
})
