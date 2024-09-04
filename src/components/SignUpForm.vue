<template>
  <form @submit.prevent="handleSubmit()">
    <input type="text" required placeholder="display name" v-model="displayName" :maxlength="16" />
    <input type="email" required placeholder="email" v-model="email" />
    <input type="password" required placeholder="password" v-model="password" />
    <button>Sign Up</button>
  </form>
</template>

<script>
import { ref } from 'vue'
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useUserStore } from '@/stores/userStore'

export default {
  setup(props, context) {
    const displayName = ref('')
    const email = ref('')
    const password = ref('')
    const userStore = useUserStore()
    const handleSubmit = async () => {
      createUserWithEmailAndPassword(auth, email.value, password.value).then((userCredential) => {
        // Signed up
        const user = userCredential.user

        updateProfile(user, {
          displayName: displayName.value
        })
          .then(() => {
            console.log('User profile updated successfully')
            this.userStore.setUser(user.displayName, user.email, user.uid)
            console.log('signed up')
            context.emit('login')
          })
          .catch((error) => {
            console.log(error)
          })
        // ...
      })
    }

    return { displayName, email, password, handleSubmit }
  }
}
</script>

<style></style>
