import { defineStore } from 'pinia'
import { useCharacterStore } from './characterStore.js'
import { useUserStore } from './userStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useSpellStore } from './spellsStore.js'

export const useEffigyStore = defineStore('effigy', {
  state: () => ({
    effigies: { someVal: { name: 'melanie', formed: false, level: 0, groupIcon: '' } }
  }),
  getters: {
    getEffigies(context) {
      return Object.values(context.effigies)
    },
    getFormedEffigiesList(context) {
      return Object.values(context.effigies).filter((effigy) => effigy.formed)
    }
  },
  actions: {
    async setLocalEffigies(effigies: any) {
      this.effigies = effigies
    },
    async addEffigy(newEffigy: any) {
      this.effigies[newEffigy.name] = newEffigy
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { effigies: this.effigies }
      )
      console.log(ret)
    },
    async setEffigies(effigies: any) {
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { effigies: effigies }
      )
      console.log(ret)
    },
    async updateFormed(name, bool) {
      this.effigies[name].formed = bool
      this.setEffigies(this.effigies)
    },
    removeEffigy(name) {
      delete this.effigies[name]
      this.setEffigies(this.effigies)
    }
  },
  persist: true
})
