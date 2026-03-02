import { defineStore } from 'pinia'
import { useCharacterStore } from './characterStore.js'
import { useUserStore } from './userStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { ManualSpell, useSpellStore } from './spellsStore.js'
import { creature } from '@/components/Character/Build/Fauna/BuildCreature.vue'

export const useFaunaStore = defineStore('fauna', {
  state: () => ({
    manualTraits: {},
    manualCreatures: { bubby: { Name: 'bubby', Traits: ['boogey'] } },
    manualAdaptations: {},
    creatures: {},
    customCreatures: {}
  }),
  getters: {
    adaptiveScore: (state): number => {
      if (useSpellStore().spellgroups['Fauna']?.name) {
        const faunaSpells = Object.values(useSpellStore().spellgroups['Fauna']?.spells)
        const maxRank = faunaSpells.reduce(
          (acc: number, spell: any) => Math.max(acc, spell.rank),
          0
        )
        return Math.min(maxRank * 2, useCharacterStore().attributes.health)
      }
      return 0
    },
    avaiableCreatureBases: (state): Array<any> => {
      if (useSpellStore().spellgroups['Fauna']?.name) {
        return Object.keys(state.manualCreatures).filter((creature) => {
          const faunaSpells = useSpellStore().spellgroups['Fauna']?.spells
          const BR1 = faunaSpells[['Butterfly / Raven I']] ? true : false
          const BR2 = faunaSpells[['Butterfly / Raven II']] ? true : false
          const BR4 = faunaSpells[['Butterfly / Raven IV']] ? true : false
          const BR5 = faunaSpells[['Butterfly / Raven V']] ? true : false
          const WB1 = faunaSpells[['Wolf / Bear I']] ? true : false
          const WB2 = faunaSpells[['Wolf / Bear II']] ? true : false
          const WB4 = faunaSpells[['Wolf / Bear IV']] ? true : false
          const WB5 = faunaSpells[['Wolf / Bear V']] ? true : false
          if (creature === 'Bear' || creature === 'Wolf') {
            return WB1
          }
          if (creature === 'Great Butterfly' || creature === 'Great Raven') {
            return BR1
          }
          if (creature === 'Dire Bear' || creature === 'Dire Wolf') {
            return WB2
          }
          if (creature === 'Eruraven' || creature === 'Mawfly') {
            return BR2
          }
          if (creature === 'Earthenbear' || creature === 'Leechwolf') {
            return WB4
          }
          if (creature === 'Solar Starfly' || creature === 'Roc') {
            return BR4
          }
          if (creature === 'Elemental Bear' || creature === 'Duskhunter') {
            return WB5
          }
          if (creature === 'Strygarii' || creature === 'Astral Wanderer') {
            return BR5
          }
          return false
        })
      } else {
        return []
      }
    },
    getAdaptationsList: (state): Array<string> => Object.keys(state.manualAdaptations),
    getAdaptations: (state): Array<any> => Object.values(state.manualAdaptations),
    getManualCreatures: (state): Array<any> => {
      if (useSpellStore().spellgroups['Fauna']?.name) {
        return Object.values(state.manualCreatures).filter((creature) => {
          const faunaSpells = useSpellStore().spellgroups['Fauna']?.spells
          const BR1 = faunaSpells[['Butterfly / Raven I']] ? true : false
          const BR2 = faunaSpells[['Butterfly / Raven II']] ? true : false
          const BR4 = faunaSpells[['Butterfly / Raven IV']] ? true : false
          const BR5 = faunaSpells[['Butterfly / Raven V']] ? true : false
          const WB1 = faunaSpells[['Wolf / Bear I']] ? true : false
          const WB2 = faunaSpells[['Wolf / Bear II']] ? true : false
          const WB4 = faunaSpells[['Wolf / Bear IV']] ? true : false
          const WB5 = faunaSpells[['Wolf / Bear V']] ? true : false
          if (creature.Name === 'Bear' || creature.Name === 'Wolf') {
            return WB1
          }
          if (creature.Name === 'Great Butterfly' || creature.Name === 'Great Raven') {
            return BR1
          }
          if (creature.Name === 'Dire Bear' || creature.Name === 'Dire Wolf') {
            return WB2
          }
          if (creature.Name === 'Eruraven' || creature.Name === 'Mawfly') {
            return BR2
          }
          if (creature.Name === 'Earthenbear' || creature.Name === 'Leechwolf') {
            return WB4
          }
          if (creature.Name === 'Solar Starfly' || creature.Name === 'Roc') {
            return BR4
          }
          if (creature.Name === 'Elemental Bear' || creature.Name === 'Duskhunter') {
            return WB5
          }
          if (creature.Name === 'Strygarii' || creature.Name === 'Astral Wanderer') {
            return BR5
          }
          return false
        })
      } else {
        return []
      }
    },
    getCreatures: (state): Array<any> => {
      if (useSpellStore().spellgroups['Fauna']?.name) {
        return Object.values(state.manualCreatures)
          .filter((creature) => {
            const faunaSpells = useSpellStore().spellgroups['Fauna']?.spells
            const BR1 = faunaSpells[['Butterfly / Raven I']] ? true : false
            const BR2 = faunaSpells[['Butterfly / Raven II']] ? true : false
            const BR4 = faunaSpells[['Butterfly / Raven IV']] ? true : false
            const BR5 = faunaSpells[['Butterfly / Raven V']] ? true : false
            const WB1 = faunaSpells[['Wolf / Bear I']] ? true : false
            const WB2 = faunaSpells[['Wolf / Bear II']] ? true : false
            const WB4 = faunaSpells[['Wolf / Bear IV']] ? true : false
            const WB5 = faunaSpells[['Wolf / Bear V']] ? true : false
            if (creature.Name === 'Bear' || creature.Name === 'Wolf') {
              return WB1
            }
            if (creature.Name === 'Great Butterfly' || creature.Name === 'Great Raven') {
              return BR1
            }
            if (creature.Name === 'Dire Bear' || creature.Name === 'Dire Wolf') {
              return WB2
            }
            if (creature.Name === 'Eruraven' || creature.Name === 'Mawfly') {
              return BR2
            }
            if (creature.Name === 'Earthenbear' || creature.Name === 'Leechwolf') {
              return WB4
            }
            if (creature.Name === 'Solar Starfly' || creature.Name === 'Roc') {
              return BR4
            }
            if (creature.Name === 'Elemental Bear' || creature.Name === 'Duskhunter') {
              return WB5
            }
            if (creature.Name === 'Strygarii' || creature.Name === 'Astral Wanderer') {
              return BR5
            }
            return false
          })
          .concat(Object.values(state.creatures))
      } else {
        return []
      }
    }
  },
  actions: {
    setFaunaFromManual(fauna: any) {
      this.setManualCreatures(fauna.transformations)
      this.setManualAdaptations(fauna.adaptations)
      this.setManualTraits(fauna.faunaTraits)
    },
    async setManualCreatures(creatures: any) {
      this.manualCreatures = creatures
    },
    async setManualTraits(traits: any) {
      this.manualTraits = traits
    },
    async setManualAdaptations(adaptations: any) {
      this.manualAdaptations = adaptations
    },
    async setLocalCustomCreatures(creatures: any) {
      this.customCreatures = creatures
    },
    async setCustomCreatures(creatures: any) {
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { customCreatures: creatures }
      )
      console.log(ret)
    },
    async setCreatures(creatures: any) {
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { creatures: creatures }
      )
    },
    setCreaturesandCustomCreatures(creatures: any, customCreatures: any) {
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { creatures: creatures, customCreatures: customCreatures }
      )
    },
    async clearFauna() {
      this.manualAdaptations = {}
      this.manualCreatures = { bubby: { Name: '', Traits: [] } }
      this.manualTraits = {}
      this.creatures = {}

      this.customCreatures = {}
    },
    async setLocalCreatures(creatures: any) {
      this.customCreatures = creatures
    },
    async addCreature(creature: any) {
      this.creatures[creature.Name] = creature
      this.setCreatures(this.creatures)
    },
    async removeCustomCreature(name: string) {
      delete this.creatures[name]
      delete this.customCreatures[name]
      this.setCreaturesandCustomCreatures(this.creatures, this.customCreatures)
    },
    async removeCreature(name: string) {
      delete this.creatures[name]
      this.setCreatures(this.creatures)
    }
  },
  persist: true
})
