<template>
  <form @submit.prevent="handleSubmit()">
    <input type="email" required placeholder="email" v-model="email" />
    <input type="password" required placeholder="password" v-model="password" />
    <div class="error">{{ error }}</div>
    <button>Log in</button>
  </form>
</template>

<script>
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useUserStore } from '@/stores/userStore'

export default {
  data: function () {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  computed: {
    userStore: () => useUserStore()
  },
  methods: {
    async login(email, password) {
      this.error = null
      try {
        const res = await signInWithEmailAndPassword(auth, email, password)
        if (!res) {
          throw new Error('Could not complete Login')
        }
        console.log(res)
        this.error = null
        return res
      } catch (err) {
        console.log(err.message)
        this.error = 'Incorrect Login Credentials'
      }
    },
    async handleSubmit() {
      let userCredential = await this.login(this.email, this.password)
      this.userStore.setDisplayName(userCredential.user.displayName)
      this.userStore.setEmail(userCredential.user.email)
      if (!this.error) {
        console.log('Log in Successful')
        this.$emit('login')
      }
    }
  }
}
</script>

<style></style>
