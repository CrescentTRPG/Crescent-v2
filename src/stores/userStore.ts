import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({ displayName: '', email: '' }),
  getters: {
    getDisplayName: (state) => state.displayName,
    getEmail: (state) => state.email
  },
  actions: {
    setDisplayName(displayName: string) {
      this.displayName = displayName
    },
    setEmail(email: string) {
      this.email = email
    }
  },
  persist: true
})
