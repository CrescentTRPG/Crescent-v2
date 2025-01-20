import { defineStore } from 'pinia'
import { useCharacterStore } from './characterStore.js'
import { useUserStore } from './userStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'

export const useTraitsStore = defineStore('traits', {
  state: () => ({
    manualTraits: {}
  }),
  getters: {},
  actions: {
    async setManualTraits(traits: any) {
      this.manualTraits = traits
    },
    async setTraits(traits: any) {
      useCharacterStore().setLocalTraits(traits)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { traits: traits }
      )
      console.log(ret)
    },
    async removeTrait(traitName: string) {
      const traits = { ...useCharacterStore().traits }
      delete traits[traitName]
      useCharacterStore().setLocalTraits(traits)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { traits: traits }
      )
      if (traitName.includes('Exceptional')) {
        const attrArr = traitName.split(' ')
        const attr = attrArr[attrArr.length - 1].toLowerCase()
        useCharacterStore().updateExceptionals(attr, 0)
      }
      if (traitName.includes('Inferior')) {
        const attrArr = traitName.split(' ')
        const attr = attrArr[attrArr.length - 1].toLowerCase()
        useCharacterStore().updateExceptionals(attr, 0)
      }
    }
  },
  persist: true
})
