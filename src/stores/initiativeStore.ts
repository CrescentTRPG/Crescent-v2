import { db } from '@/firebase/config.js'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore'
import _ from 'lodash'
import { defineStore } from 'pinia'
import { useAdventureStore } from './adventureStore.js'

export const useInitiativeStore = defineStore('initiative', {
  state: () => ({
    combatants: {},
    orderedCombatants: [] as Array<string>,
    expanded: [],
    currentInitiative: 0,
    initiativeOpened: {},
    initiativeRef: () => {},
    isSubscribed: false,
    baseCombatDetails: {
      combatants: {},
      initiative: {},
      notes: '',
      tags: [],
      name: 'Default Combat'
    }
  }),
  getters: {
    orderedCombatantList: (state) => {
      if (state.orderedCombatants.length < 1) {
        return Object.keys(state.combatants)
      } else {
        return state.orderedCombatants
      }
    }
  },
  actions: {
    setInitiativeDataFromFirebase(data) {
      this.orderedCombatants = data.orderedCombatants
      this.combatants = data.combatants
    },
    setBaseCombatDetails(details) {
      this.baseCombatDetails = details
    },
    async postInitiative() {
      const initiativeObj = {
        orderedCombatants: this.orderedCombatants,
        combatants: this.combatants
      }
      console.log('HIYA')
      const ret = await addDoc(
        collection(
          db,
          'User/' +
            useAdventureStore().gameMasterId +
            '/Adventure/' +
            useAdventureStore().id +
            '/ActiveCombat'
        ),
        initiativeObj
      )
      ret && useAdventureStore().updateActiveCombatId(ret.id)
      ret && this.subscribeToInitiative()
    },
    async putInitiative() {
      console.log('IM AT PUT')
      if (useAdventureStore().activeCombatId) {
        console.log('updating')
        const ret = await updateDoc(
          doc(
            db,
            'User/' +
              useAdventureStore().gameMasterId +
              '/Adventure/' +
              useAdventureStore().id +
              '/ActiveCombat/' +
              useAdventureStore().activeCombatId
          ),
          {
            orderedCombatants: this.orderedCombatants,
            combatants: this.combatants
          }
        )
      }
    },

    async putInitiativeValues(orderedCombatants, combatants) {
      console.log('IM AT PUT')
      if (useAdventureStore().activeCombatId) {
        console.log('updating')
        const ret = await updateDoc(
          doc(
            db,
            'User/' +
              useAdventureStore().gameMasterId +
              '/Adventure/' +
              useAdventureStore().id +
              '/ActiveCombat/' +
              useAdventureStore().activeCombatId
          ),
          {
            orderedCombatants: orderedCombatants,
            combatants: combatants
          }
        )
      }
    },
    async getInitiativeDetails(id) {
      const docRef = doc(
        db,
        'User/' +
          useAdventureStore().gameMasterId +
          '/Adventure/' +
          useAdventureStore().id +
          '/Combats/' +
          id
      )
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        alert('Document not found')
      }
    },
    async deleteInitiative(id) {
      const ret = await deleteDoc(
        doc(
          db,
          'User/' +
            useAdventureStore().gameMasterId +
            '/Adventure/' +
            useAdventureStore().id +
            '/ActiveCombat/' +
            id
        )
      )
    },
    async subscribeToInitiative() {
      console.log('subscribing', useAdventureStore().activeCombatId)
      this.isSubscribed = true
      if (useAdventureStore().activeCombatId) {
        const ref = onSnapshot(
          doc(
            db,
            'User/' +
              useAdventureStore().gameMasterId +
              '/Adventure/' +
              useAdventureStore().id +
              '/ActiveCombat/' +
              useAdventureStore().activeCombatId
          ),
          (doc) => {
            console.log('ITS HAPPENING', doc.data()?.combatants)
            this.combatants = doc.data()?.combatants || {}
            this.orderedCombatants = doc.data()?.orderedCombatants || []
            this.createInitiativeAndRollValues()
          }
        )
        this.initiativeRef = ref
      }
    },
    unscubscribeToInitiative() {
      this.isSubscribed = false
      this.initiativeRef()
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
      this.putInitiative()
    },
    resetInitiativeOpened() {
      this.initiativeOpened = {}
    },
    clearOrderedCombatantsLocally() {
      this.orderedCombatants = []
    },
    removeOrderedCombatant(name) {
      this.orderedCombatants = this.orderedCombatants.filter((c) => c !== name)
      this.putInitiative()
    },
    clearOrderedCombatants() {
      this.orderedCombatants = []
      this.putInitiative()
    },
    nextTurn() {
      const temp = this.orderedCombatants
      const turnOverGuy = temp.shift() || ''
      temp.push(turnOverGuy)
      this.orderedCombatants = temp
      this.putInitiative()
    },
    lastTurn() {
      const temp = this.orderedCombatants
      const turnOverGuy = temp.pop() || ''
      temp.unshift(turnOverGuy)
      this.orderedCombatants = temp
      this.putInitiative()
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
            useAdventureStore().characterInitiatives[i].agility || 0
          )
        }
      })
      this.putInitiative()
    },
    createInitiativeAndRollValues() {
      console.log(Object.keys(this.combatants))
      console.log(this.combatants, 'obj')

      const init = Object.keys(this.combatants)
        .concat(Object.keys(useAdventureStore().characterInitiatives))
        .filter(
          (a) =>
            (!this.combatants[a]?.initiativeScore && this.combatants[a]?.name) ||
            (useAdventureStore().characterInitiatives[a] && !this.orderedCombatants.includes(a))
        )
      console.log('add to initiative', init)
      if (init.length <= 0 && this.orderedCombatants.length > 0) {
        console.log('rejected')
        return
      }
      //this.sort()

      const tempCombatants = _.cloneDeep(this.combatants)
      init.forEach((i) => {
        if (tempCombatants[i]?.name) {
          console.log(i)
          tempCombatants[i].initiativeScore = this.rollAgility(
            tempCombatants[i].attributes?.agility || 0
          )
          this.addToOrderedCombatantsInPlace(
            tempCombatants.initiativeScore,
            i,
            tempCombatants.attributes?.agility || 0
          )
        } else {
          this.addToOrderedCombatantsInPlace(
            useAdventureStore().characterInitiatives[i].initiativeScore,
            i,
            useAdventureStore().characterInitiatives[i].attributes?.agility || 0
          )
        }
      })
      console.log(this.orderedCombatants)
      this.combatants = tempCombatants
      this.putInitiativeValues(this.orderedCombatants, tempCombatants)
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
        this.putInitiative()
      }
    },
    setNewCombatants(newCombatants) {
      if (newCombatants) {
        this.combatants = _.cloneDeep(newCombatants)
        Object.keys(this.combatants).forEach((c) => {
          this.combatants[c].initiativeScore = 0
        })
        this.putInitiative()
      }
    },
    updateCombatantsLocal(newCombatants) {
      if (newCombatants) {
        this.combatants = _.cloneDeep(newCombatants)
        // Object.keys(this.combatants).forEach((c) => {
        //   this.combatants[c].initiativeScore = 0
        // })
      }
    }
  },
  persist: true
})
