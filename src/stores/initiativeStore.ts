import { defineStore } from 'pinia'
import _ from 'lodash'
import { usePartyStore } from './partyStore.js'
import { useAdventureStore } from './adventureStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useUserStore } from './userStore.js'

export const useInitiativeStore = defineStore('initiative', {
  state: () => ({
    combatants: {},
    orderedCombatants: [] as Array<string>,
    expanded: [],
    currentInitiative: 0,
    initiativeOpened: {}
  }),
  getters: {
    orderedCombatantList(context) {
      if (this.orderedCombatants.length < 1) {
        return Object.keys(this.combatants)
      } else {
        return this.orderedCombatants
      }
    }
  },
  actions: {
    setInitiativeDataFromFirebase(data) {
      this.orderedCombatants = data.orderedCombatants
      this.combatants = data.combatants
    },
    updateOrderedCombatantsInFirebase() {
      // const ret = updateDoc(
      //   doc(db, 'User/' + useUserStore().id + '/Adventure/' + useAdventureStore().id),
      //   {
      //     orderedCombatants: this.orderedCombatants
      //   }
      // )
    },
    updateCombatantsInFirebase() {
      // const ret = updateDoc(
      //   doc(db, 'User/' + useUserStore().id + '/Adventure/' + useAdventureStore().id),
      //   {
      //     combatants: this.combatants
      //   }
      // )
    },
    setInitiativeOpened(key, value) {
      this.initiativeOpened[key] = value
    },
    removeFromInitiative(key) {
      const newOrderedCombatants: Array<string> = []
      this.orderedCombatants.forEach((c) => {
        if (c != key) {
          newOrderedCombatants.push(c)
        }
      })
      this.orderedCombatants = newOrderedCombatants
    },
    changeInitiativeOrder(key: string, newVal: number, agi: number | string) {
      console.log(key)
      this.removeFromInitiative(key)
      this.combatants[key].initiativeScore = newVal
      this.addToOrderedCombatantsInPlace(newVal, key, agi)
      this.updateOrderedCombatantsInFirebase()
    },
    resetInitiativeOpened() {
      this.initiativeOpened = {}
    },
    clearOrderedCombatants() {
      this.orderedCombatants = []
      this.updateOrderedCombatantsInFirebase()
    },
    nextTurn() {
      const temp = this.orderedCombatants
      const turnOverGuy = temp.shift() || ''
      temp.push(turnOverGuy)
      this.orderedCombatants = temp
      this.updateOrderedCombatantsInFirebase()
    },
    lastTurn() {
      const temp = this.orderedCombatants
      const turnOverGuy = temp.pop() || ''
      temp.unshift(turnOverGuy)
      this.orderedCombatants = temp
      this.updateOrderedCombatantsInFirebase()
    },
    sort() {
      const oldOrderedCombatants = _.cloneDeep(this.orderedCombatants)
      this.orderedCombatants = []
      oldOrderedCombatants.forEach((i) => {
        if (this.combatants[i]?.name) {
          this.addToOrderedCombatantsInPlace(
            this.combatants[i].initiativeScore,
            i,
            this.combatants[i].attributes?.agility || 0
          )
        } else {
          this.addToOrderedCombatantsInPlace(
            useAdventureStore().characterInitiatives[i].initiativeScore,
            i,
            useAdventureStore().characterInitiatives[i].attributes?.agility || 0
          )
        }
      })
      this.updateOrderedCombatantsInFirebase()
    },
    createInitiativeAndRollValues() {
      this.sort()
      const init = Object.keys(this.combatants)
        .concat(Object.keys(useAdventureStore().characterInitiatives))
        .filter(
          (a) =>
            (!this.combatants[a]?.initiativeScore && this.combatants[a]?.name) ||
            (useAdventureStore().characterInitiatives[a] && !this.orderedCombatants.includes(a))
        )
      if (init.length <= 0) {
        console.log('rejected')
        return
      }
      console.log(init)
      init.forEach((i) => {
        if (this.combatants[i]?.name) {
          console.log(i)
          this.combatants[i].initiativeScore = this.rollAgility(
            this.combatants[i].attributes?.agility || 0
          )
          this.addToOrderedCombatantsInPlace(
            this.combatants[i].initiativeScore,
            i,
            this.combatants[i].attributes?.agility || 0
          )
        } else {
          this.addToOrderedCombatantsInPlace(
            useAdventureStore().characterInitiatives[i].initiativeScore,
            i,
            useAdventureStore().characterInitiatives[i].attributes?.agility || 0
          )
        }
      })
      // this.updateOrderedCombatantsInFirebase()
    },

    addToOrderedCombatantsInPlace(initiative: number, key: string, agility: string | number) {
      if (this.orderedCombatants.length >= 1) {
        for (let i = 0; i < this.orderedCombatants.length; i++) {
          const compInitiative =
            this.combatants[this.orderedCombatants[i]]?.initiativeScore ||
            useAdventureStore().characterInitiatives[i]?.initiativeScore ||
            0
          const compAgility =
            this.combatants[this.orderedCombatants[i]]?.attributes?.agility ||
            useAdventureStore().characterInitiatives[i]?.attributes?.agility ||
            0
          if (initiative > compInitiative) {
            this.orderedCombatants.splice(i, 0, key)
            return
          } else if (
            initiative == compInitiative &&
            parseInt('' + agility) > parseInt('' + compAgility)
          ) {
            this.orderedCombatants.splice(i, 0, key)
            return
          }
        }
      }
      this.orderedCombatants.push(key)
    },
    rollAgility(agility) {
      return Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10) + parseInt(agility + '')
    },
    updateCombatants(newCombatants) {
      if (newCombatants) {
        this.combatants = _.cloneDeep(newCombatants)
        // Object.keys(this.combatants).forEach((c) => {
        //   this.combatants[c].initiativeScore = 0
        // })
        this.updateCombatantsInFirebase()
      }
    }
  },
  persist: true
})
