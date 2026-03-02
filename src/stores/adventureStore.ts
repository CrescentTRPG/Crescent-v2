import { useCollection } from '@/composable/useCollection.js'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore.js'
import { deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useDesignStore } from './designStore.js'
import { usePartyStore } from './partyStore.js'
import { useManualStore } from './manualStore.js'
import { useCharacterStore } from './characterStore.js'
import { ABILITY_ENTRY, AbilityEntry, DEFAULT_COMBAT, DEFAULT_DESIGN } from '@/bases.js'
import { useInitiativeStore } from './initiativeStore.js'
import { useJournalStore } from './journalStore.js'
export interface CustomAbilities {
  [key: string]: AbilityEntry
}
export interface Chat {
  filteredRecipients: string[]
  from: string
  fromIcon: string
  fromId: string
  isStarred: boolean
  message: string
  timestamp: string
}
export const useAdventureStore = defineStore('adventure', {
  state: () => ({
    adventureRef: () => {},
    id: '',
    gameMasterId: '',
    name: 'Crescent Adventure',
    image: '',
    currentViewedUserId: '',
    design: DEFAULT_DESIGN,
    characterIds: [],
    userIds: [],
    characterNames: [],
    showChatToast: false,
    chatToast: '',
    notes: {},
    items: {},
    manual: {},
    statBlocks: {},
    rollingTables: {},
    settings: {
      maxChats: 100,
      initiativeDisplayNumericHp: false,
      initiativeDisplayNumericMana: false,
      initiativeDisplayHp: true,
      initiativeDisplayMana: true,
      initiativeDisplayEnemyTraits: false,
      initiativeDisplayCharacterTraits: true,
      initiativeDefaultExpanded: true,
      allowApplyStatusToCharacter: true,
      allowApplyStatusToEnemy: true
    },
    chat: {},
    customAbilites: {
      'some group': ABILITY_ENTRY
    } as CustomAbilities,
    combats: {},
    loading: false,
    here: 0,
    rules: {},
    combatNavPos: 'table',
    activeCombatId: '',
    characterInitiatives: {} // {id {name: string, id: number, init: number}},
  }),
  getters: {
    chats: (state): Chat[] => {
      return Object.values(state.chat as Chat).sort((a: any, b: any) => {
        return Date.parse(a.timestamp) - Date.parse(b.timestamp)
      })
    }
  },
  actions: {
    clearActiveCombat(id) {
      useInitiativeStore().deleteInitiative(id)
    },
    clearLocalActiveCombatId() {
      this.activeCombatId = ''
    },
    toTable() {
      this.activeCombatId = ''
      this.updateCombatNavPosLocal('table')
      updateDoc(doc(db, 'User/' + this.gameMasterId + '/Adventure/' + this.id), {
        activeCombatId: this.activeCombatId,
        combatNavPos: 'table'
      })
    },
    updateSettings(settings) {
      this.settings = settings
      updateDoc(doc(db, 'User/' + this.gameMasterId + '/Adventure/' + this.id), {
        settings: this.settings
      })
    },
    setCurrentViewedUserId(id) {
      this.currentViewedUserId = id
    },
    clearImportantAdventureInfo() {
      this.characterInitiatives = {}
      this.unsubscribe()
      this.characterIds = []
      this.userIds = []
      this.characterNames = []
      this.statBlocks = {}
      this.chat = {}
      this.customAbilites = {}
      usePartyStore().characterObjects = {}
      usePartyStore().unsubscribeFromCharacters()
      useInitiativeStore().orderedCombatants = []
      useInitiativeStore().combatants = {}
      this.settings = {
        maxChats: 100,
        initiativeDisplayNumericHp: false,
        initiativeDisplayNumericMana: false,
        initiativeDisplayHp: true,
        initiativeDisplayMana: true,
        initiativeDisplayEnemyTraits: false,
        initiativeDisplayCharacterTraits: true,
        initiativeDefaultExpanded: true,
        allowApplyStatusToCharacter: true,
        allowApplyStatusToEnemy: true
      }
      this.gameMasterId = ''
      this.activeCombatId = ''
    },
    updateCombatNavPosLocal(pos) {
      this.combatNavPos = pos
    },
    dispatchAdventureStart() {
      this.characterInitiatives = {}
      this.updateCombatNavPosLocal('run')
      const ret = updateDoc(
        doc(db, 'User/' + useAdventureStore().gameMasterId + '/Adventure/' + this.id),
        {
          characterInitiatives: {},
          combatNavPos: this.combatNavPos
        }
      )
      useInitiativeStore().postInitiative()
    },
    addCharacterInitiative(id, init, agi) {
      this.characterInitiatives[id] = { id: id, agility: agi, initiativeScore: init }
      const ret = updateDoc(
        doc(db, 'User/' + useAdventureStore().gameMasterId + '/Adventure/' + this.id),
        {
          characterInitiatives: this.characterInitiatives
        }
      )
    },
    updateActiveCombatId(id) {
      this.activeCombatId = id
      updateDoc(doc(db, 'User/' + this.gameMasterId + '/Adventure/' + this.id), {
        activeCombatId: this.activeCombatId
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
      console.log(this.gameMasterId, this.id, id)

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
        'User/' + this.gameMasterId + '/Adventure/' + this.id + '/Combats',
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
    setLocalAdventureFromCharacter(adventure) {
      if (this.chat) this.id = adventure.adventureId
      this.gameMasterId = adventure.gameMasterId
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
      this.combatNavPos = adventure.combatNavPos
      this.activeCombatId = adventure.activeCombatId
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
    async setAdventureName(name) {
      this.name = name
      const ret = updateDoc(doc(db, 'User/' + this.gameMasterId + '/Adventure/' + this.id), {
        name: name
      })
    },
    async pullAdventureFromFirebase(adventureId: string) {
      this.loading = true
      this.here = 1
      useManualStore().pullManualFromFirebase()

      this.adventureRef = onSnapshot(
        doc(db, 'User/' + useAdventureStore().gameMasterId + '/Adventure/' + adventureId),
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
            combatNavPos: doc.data()?.combatNavPos || 'table',
            activeCombatId: doc.data()?.activeCombatId || ''
          }
          console.log('adventure snap')
          if (doc.data()?.activeCombatId != this.activeCombatId && doc.data()?.activeCombatId) {
            this.activeCombatId = doc.data()?.activeCombatId
            useInitiativeStore().subscribeToInitiative()
          } else if (!doc.data()?.activeCombatId) {
            useInitiativeStore().unscubscribeToInitiative()
          }
          if (doc.data()?.entryMap) {
            useJournalStore().setEntryMapFromFirebase(doc.data()?.entryMap)
          } else {
            useJournalStore().setEntryMapFromFirebase({
              entryIds: []
            })
          }
          if (doc.data()?.journalIdKey) {
            useJournalStore().setJournalIdKeyFromFirebase(doc.data()?.journalIdKey)
            if (
              useJournalStore().openFile.id &&
              !useJournalStore().journalIdKey[useJournalStore().openFile.id]
            ) {
              useJournalStore().clearOpenFileAndBookmarks()
              alert(
                'Cleared Bookmarks and open File!  Navigating between new adventures and charcters will do this!'
              )
            }
          } else {
            useJournalStore().setJournalIdKeyFromFirebase({})
            if (
              useJournalStore().openFile.id &&
              !useJournalStore().journalIdKey[useJournalStore().openFile.id]
            ) {
              useJournalStore().clearOpenFileAndBookmarks()
              alert(
                'Cleared Bookmarks and open File!  Navigating between new adventures and charcters will do this!'
              )
            }
          }
          useManualStore().setCustomAbilities(doc.data()?.customAbilites || {})
          if (
            doc.data()?.characterInitiatives != this.characterInitiatives &&
            doc.data()?.combatNavPos === 'run'
          ) {
            this.characterInitiatives = doc.data()?.characterInitiatives
            useInitiativeStore().createInitiativeAndRollValues()
          }
          if (doc.data()?.calendar) {
            useJournalStore().setCalendarFromDatabase(doc.data()?.calendar)
            useJournalStore().setCurrentDateFromFirebase(
              doc.data()?.currentDate || 0,
              doc.data()?.currentYear || 1
            )
          } else {
            useJournalStore().setCalendarFromDatabase({
              days: {},
              sections: { 0: {}, names: ['month'] },
              dateFormula: '',
              miniPickerFormula: '',
              organizedBy: 'month',
              itemsInARow: 7,
              titleSectionFormula: '',
              holidays: {}
            })
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
            combatNavPos: doc.data()?.combatNavPos || 'table',
            gameMasterId: gameMasterId,
            activeCombatId: doc.data()?.activeCombatId || ''
          }
          console.log('customAbilities', doc.data()?.customAbilites)
          useManualStore().setCustomAbilitiesAsCharacter(doc.data()?.customAbilites || {})
          this.characterInitiatives = doc.data()?.characterInitiatives || {}
          if (doc.data()?.activeCombatId != this.activeCombatId && doc.data()?.activeCombatId) {
            console.log('ppopy')
            this.activeCombatId = doc.data()?.activeCombatId
            useInitiativeStore().subscribeToInitiative()
          } else if (!doc.data()?.activeCombatId) {
            useInitiativeStore().unscubscribeToInitiative()
          }
          if (doc.data()?.calendar) {
            useJournalStore().setCalendarFromDatabase(doc.data()?.calendar)
            useJournalStore().setCurrentDateFromFirebase(
              doc.data()?.currentDate || 0,
              doc.data()?.currentYear || 1
            )
          } else {
            useJournalStore().setCalendarFromDatabase({
              days: {},
              sections: { 0: {}, names: ['month'] },
              dateFormula: '',
              miniPickerFormula: '',
              organizedBy: 'month',
              itemsInARow: 7,
              titleSectionFormula: '',
              holidays: {}
            })
          }

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
    async updateCustomAbilitiesInFirebase(abilities) {
      const ret = updateDoc(doc(db, 'User/' + useUserStore().id + '/Adventure/' + this.id), {
        customAbilites: abilities
      })
    },
    async updateCombatsInFirebase() {
      const ret = updateDoc(
        doc(db, 'User/' + useAdventureStore().gameMasterId + '/Adventure/' + this.id),
        {
          combats: this.combats
        }
      )
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
