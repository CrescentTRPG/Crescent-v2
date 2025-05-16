import { db } from '@/firebase/config.js'
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
export const useUserStore = defineStore('user', {
  state: () => ({
    displayName: '',
    email: '',
    id: '',
    invites: {},
    inviteRef: () => {},
    subscriptionLevel: ''
  }),
  getters: {
    getDisplayName: (state) => state.displayName,
    getEmail: (state) => state.email,
    getUserId: (state): string => state.id,
    getInvites: (state): Array<any> => Object.values(state.invites || {})
  },
  actions: {
    setUser(displayName: string, email: string, id: string, invites: any) {
      this.displayName = displayName
      this.email = email
      this.id = id
      this.invites = invites
    },
    async getSubscriptionLevel() {
      const userDocs = await getDoc(doc(db, 'User/' + this.getUserId))
      this.subscriptionLevel = userDocs.data()?.subscriptionLevel || ''
    },
    subscribeToInvites() {
      console.log(this.invites)

      this.inviteRef = onSnapshot(
        collection(db, 'User/' + useUserStore().getUserId + '/Invites'),
        (snap) => {
          this.invites = {}
          snap.docs.forEach((doc) => {
            const invite = {
              adventureName: doc.data().adventureName,
              adventureId: doc.data().adventureId,
              gameMasterId: doc.data().gameMasterId,
              gameMasterDisplayName: doc.data().gameMasterDisplayName,
              id: doc.id
            }
            this.invites[invite.id] = invite
          })
        }
      )
    },
    unsubscribe() {
      this.inviteRef()
    },
    setInvites(invites: any) {
      this.invites = invites
    },
    setDisplayName(displayName: string) {
      this.displayName = displayName
    },
    setEmail(email: string) {
      this.email = email
    },
    setUserId(id: string) {
      this.id = id
    }
  },
  persist: true
})
