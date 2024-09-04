import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ displayName: '', email: '', id: '' }),
  getters: {
    getDisplayName: (state) => state.displayName,
    getEmail: (state) => state.email,
    getUserId: (state): string => state.id
  },
  actions: {
    setUser(displayName: string, email: string, id: string) {
      this.displayName = displayName
      this.email = email
      this.id = id
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
