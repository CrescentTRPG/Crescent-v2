import { useCollection } from '@/composable/useCollection.js'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore.js'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useDesignStore } from './designStore.js'
import { usePartyStore } from './partyStore.js'
import { useManualStore } from './manualStore.js'
import { useCharacterStore } from './characterStore.js'
import { DEFAULT_DESIGN } from '@/bases.js'

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
      maxChats: 100
    },
    chat: {},
    customAbilites: {},
    combats: {},
    loading: false,
    here: 0,
    rules: {},
    userIds: []
  }),
  actions: {
    setLocalAdventure(adventure) {
      this.id = adventure.id
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
    },
    editChat(messageObj) {
      this.chat[messageObj.timestamp] = messageObj
      this.updateChat()
    },
    addChat(message, from, fromId, isStarred, filteredRecipients, fromIcon) {
      const date = new Date()
      const now = date.toLocaleString()
      const chats = Object.keys(this.chat)
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
      this.updateChat()
    },
    resolveLength(chats) {
      chats.sort()
      chats.forEach((c) => {
        if (!this.chat[c].isStarred) {
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
            userIds: doc.data()?.userIds
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
            userIds: doc.data()?.userIds
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
