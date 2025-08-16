import { useCollection } from '@/composable/useCollection.js'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore.js'
import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useDesignStore } from './designStore.js'
import { usePartyStore } from './partyStore.js'
import { useManualStore } from './manualStore.js'
import { useCharacterStore } from './characterStore.js'
import { DEFAULT_COMBAT, DEFAULT_DESIGN } from '@/bases.js'
import { useInitiativeStore } from './initiativeStore.js'

export const useAdventureStore = defineStore('adventure', {
  state: () => ({
    adventureRef: () => {},
    id: '',
    gameMasterId: '',
    name: 'Crescent Adventure',
    image: '',
    design: DEFAULT_DESIGN,
    characterIds: [],
    characterNames: [],
    notes: {},
    items: {},
    manual: {},
    statBlocks: {},
    rollingTables: {},
    settings: {
      maxChats: 100,
      initiativeDisplayNumeric: false,
      initiativeDisplayHp: true,
      initiativeDisplayMana: true,
      initiativeDisplayEnemyTraits: false,
      initiativeDisplayCharacterTraits: true,
      initiativeDefaultExpanded: true,
      allowApplyStatusToCharacter: true,
      allowApplyStatusToEnemy: true
    },
    chat: {},
    customAbilites: {},
    combats: {},
    loading: false,
    here: 0,
    rules: {},
    userIds: [],
    activeCombat: { ...DEFAULT_COMBAT },
    combatNavPos: 'table',
    characterInitiatives: {} // {id {name: string, id: number, init: number}},
  }),
  actions: {
    dispatchAdventureStart() {
      this.characterInitiatives = {}
      const ret = updateDoc(doc(db, 'User/' + useUserStore().id + '/Adventure/' + this.id), {
        characterInitiatives: {},
        activeCombat: this.activeCombat,
        combatNavPos: this.combatNavPos
      })
    },
    addCharacterInitiative(id, init, agi) {
      this.characterInitiatives[id] = { id: id, agility: agi, initiativeScore: init }
      const ret = updateDoc(doc(db, 'User/' + useUserStore().id + '/Adventure/' + this.id), {
        characterInitiatives: this.characterInitiatives
      })
    },
    updateActiveCombat(activeCombat, navPos) {
      this.activeCombat = activeCombat
      this.combatNavPos = navPos
      const ret = updateDoc(doc(db, 'User/' + useUserStore().id + '/Adventure/' + this.id), {
        activeCombat: this.activeCombat,
        combatNavPos: this.combatNavPos
      })
    },
    updateStatBlock(statBlock) {
      this.statBlocks[statBlock.name] = statBlock
      this.updateStatBlocksInFirebase()
    },
    async getStatBlockDetails(id) {
      const docRef = doc(
        db,
        'User/' + this.gameMasterId + '/Adventure/' + this.id + '/StatBlocks/' + id
      )
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        alert('Document not found')
      }
    },
    async getCombatDetails(id) {
      const docRef = doc(
        db,
        'User/' + this.gameMasterId + '/Adventure/' + this.id + '/Combats/' + id
      )
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        alert('Document not found')
      }
    },
    async postStatBlock(statBlock) {
      const ret = await useCollection(
        'User/' + this.gameMasterId + '/Adventure/' + this.id + '/StatBlocks',
        statBlock
      )
      const icon = statBlock.overrideIcon ? statBlock.overrideIcon : statBlock.powerIcon
      const powerLevel = statBlock.overridePowerLevel
        ? statBlock.overridePowerLevel
        : statBlock.powerLevel

      ret && this.updateStatBlockObj(statBlock.name, ret.id, powerLevel, icon, statBlock.tags)
    },
    async putStatBlock(statBlock, id) {
      const ret = await updateDoc(
        doc(db, 'User/' + this.gameMasterId + '/Adventure/' + this.id + '/StatBlocks/' + id),
        statBlock
      )
      const icon = statBlock.overrideIcon ? statBlock.overrideIcon : statBlock.powerIcon
      const powerLevel = statBlock.overridePowerLevel
        ? statBlock.overridePowerLevel
        : statBlock.powerLevel

      this.updateStatBlockObj(statBlock.name, id, powerLevel, icon, statBlock.tags)
    },
    async postCombat(combat) {
      const ret = await useCollection(
        'User/' + this.gameMasterId + '/Adventure/' + this.id + '/Combats/',
        combat
      )
      ret && this.updateCombatObj(combat.name, ret.id, combat.difficulty, combat.tags)
    },
    async putCombat(combat, id) {
      const ret = await updateDoc(
        doc(db, 'User/' + this.gameMasterId + '/Adventure/' + this.id + '/Combats/' + id),
        combat
      )
      this.updateCombatObj(combat.name, id, combat.powerLevel, combat.tags)
    },
    updateStatBlockObj(name, id, powerLevel, icon, tags) {
      this.statBlocks[id] = { name: name, id: id, powerLevel: powerLevel, icon: icon, tags: tags }
      this.updateStatBlocksInFirebase()
    },
    updateStatBlocks(statBlocks) {
      this.statBlocks = statBlocks
      this.updateStatBlocksInFirebase()
    },
    updateCombatObj(name, id, difficulty, tags) {
      this.combats[id] = { name: name, id: id, difficulty: difficulty || 0, tags: tags }
      this.updateCombatsInFirebase()
    },
    updateCombat(combat) {
      this.combats[combat.name] = combat
      this.updateCombatsInFirebase()
    },
    async removeStatBlock(id) {
      delete this.statBlocks[id]
      await deleteDoc(doc(db, 'User/' + this.gameMasterId + '/StatBlocks' + id))
      this.updateStatBlocksInFirebase()
    },
    async removeCombat(id) {
      delete this.combats[id]
      await deleteDoc(doc(db, 'User/' + this.gameMasterId + '/Combats/' + id))
      this.updateCombatsInFirebase()
    },
    setLocalAdventure(adventure) {
      this.id = adventure.id
      this.gameMasterId = adventure.gameMasterId
      this.name = adventure.name
      this.image = adventure.image
      this.design = adventure.design
      this.characterIds = adventure.characterIds
      this.characterNames = adventure.characterNames
      this.notes = adventure.notes
      this.items = adventure.items
      this.manual = adventure.manual
      this.statBlocks = adventure.statBlocks
      this.rollingTables = adventure.rollingTables
      this.settings = adventure.settings
      this.chat = adventure.chat
      this.customAbilites = adventure.customAbilites
      this.combats = adventure.combats
      this.userIds = adventure.userIds
      this.activeCombat = adventure.activeCombat
      this.combatNavPos = adventure.combatNavPos
    },
    editChat(messageObj) {
      this.chat[messageObj.timestamp] = messageObj
      this.updateChat()
    },
    addChat(message, from, fromId, isStarred, filteredRecipients, fromIcon) {
      const date = new Date()
      const now = date.toLocaleString()
      const chats = Object.keys(this.chat)
      console.log(this.settings.maxChats)
      if (chats.length > this.settings.maxChats) {
        this.resolveLength(chats)
      }
      this.chat[now] = {
        message: message,
        from: from,
        fromId: fromId,
        timestamp: now,
        isStarred: isStarred,
        filteredRecipients: filteredRecipients,
        fromIcon: fromIcon
      }
      console.log(Object.keys(this.chat).length)

      this.updateChat()
    },
    resolveLength(chats) {
      chats.sort()
      chats.forEach((c) => {
        if (!this.chat[c].isStarred && chats.length > this.settings.maxChats) {
          delete this.chat[c]
          return
        }
      })
    },
    async updateChat() {
      const ret = updateDoc(doc(db, 'User/' + this.gameMasterId + '/Adventure/' + this.id), {
        chat: this.chat
      })
    },
    async pullAdventureFromFirebase(adventureId: string) {
      this.loading = true
      this.here = 1
      useManualStore().pullManualFromFirebase()

      this.adventureRef = onSnapshot(
        doc(db, 'User/' + useUserStore().getUserId + '/Adventure/' + adventureId),
        (doc) => {
          const adventure = {
            id: doc.id,
            gameMasterId: doc.data()?.gameMasterId,
            name: doc.data()?.name,
            image: doc.data()?.image,
            design: doc.data()?.design,
            characterIds: doc.data()?.characterIds,
            characterNames: doc.data()?.characterNames,
            notes: doc.data()?.notes,
            items: doc.data()?.items,
            manual: doc.data()?.manual,
            statBlocks: doc.data()?.statBlocks,
            rollingTables: doc.data()?.rollingTables,
            settings: doc.data()?.settings,
            chat: doc.data()?.chat,
            customAbilites: doc.data()?.customAbilites,
            combats: doc.data()?.combats,
            userIds: doc.data()?.userIds,
            activeCombat: doc.data()?.activeCombat || DEFAULT_COMBAT,
            combatNavPos: doc.data()?.combatNavPos || 'table'
          }

          if (doc.data()?.characterInitiatives != this.characterInitiatives) {
            this.characterInitiatives = doc.data()?.characterInitiatives
            useInitiativeStore().createInitiativeAndRollValues()
          }
          this.setLocalAdventure(adventure)
          this.delay(2000).then(() => {
            this.loading = false
          })
        }
      )
      for (let i = 0; i < this.characterIds.length; i++) {
        usePartyStore().pullCharacterFromFirebase(this.characterIds[i], this.userIds[i])
      }

      useDesignStore().setLocalDesign(this.design)
    },
    async pullAdventureAsCharacterFromFirebase(adventureId: string, gameMasterId: string) {
      this.loading = true
      this.here = 1
      this.adventureRef = onSnapshot(
        doc(db, 'User/' + gameMasterId + '/Adventure/' + adventureId),
        (doc) => {
          const adventure = {
            id: doc.id,
            name: doc.data()?.name,
            image: doc.data()?.image,
            design: doc.data()?.design,
            characterIds: doc.data()?.characterIds,
            characterNames: doc.data()?.characterNames,
            notes: doc.data()?.notes,
            items: doc.data()?.items,
            manual: doc.data()?.manual,
            statBlocks: doc.data()?.statBlocks,
            rollingTables: doc.data()?.rollingTables,
            settings: doc.data()?.settings,
            chat: doc.data()?.chat,
            customAbilites: doc.data()?.customAbilites,
            combats: doc.data()?.combats,
            userIds: doc.data()?.userIds,
            activeCombat: doc.data()?.activeCombat || DEFAULT_COMBAT,
            combatNavPos: doc.data()?.combatNavPos || 'table'
          }
          this.characterInitiatives = doc.data()?.characterInitiatives || {}

          const loc = doc.data()?.characterIds.indexOf(useCharacterStore().id)
          if (loc > -1) {
            adventure.characterNames.splice(loc, 1)
            adventure.characterIds.splice(loc, 1)
            adventure.userIds.splice(loc, 1)
          }
          this.setLocalAdventure(adventure)
          this.delay(2000).then(() => {
            this.loading = false
          })
        }
      )
      for (let i = 0; i < this.characterIds.length; i++) {
        usePartyStore().pullCharacterFromFirebase(this.characterIds[i], this.userIds[i])
      }
    },
    unsubscribe() {
      this.adventureRef()
    },
    delay(time: number) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    async updateStatBlocksInFirebase() {
      const ret = updateDoc(doc(db, 'User/' + useUserStore().id + '/Adventure/' + this.id), {
        statBlocks: this.statBlocks
      })
    },
    async updateCombatsInFirebase() {
      const ret = updateDoc(doc(db, 'User/' + useUserStore().id + '/Adventure/' + this.id), {
        combats: this.combats
      })
    },
    async addAdventure() {
      const adventure = {
        name: 'Crescent Adventure',
        gameMasterId: useUserStore().getUserId,
        image: '',
        design: DEFAULT_DESIGN,
        characterIds: [],
        characterNames: [],
        notes: {},
        items: {},
        manual: {},
        statBlocks: {},
        rollingTables: {},
        settings: {},
        chat: {},
        customAbilites: {},
        combats: {}
      }
      const ret = await useCollection('User/' + useUserStore().getUserId + '/Adventure', adventure)
    }
  },
  persist: true
})
