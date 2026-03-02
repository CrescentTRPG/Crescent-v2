<template>
  <BForm @submit.prevent="handleSubmit()">
    <BFormInput
      type="text"
      required
      placeholder="display name"
      v-model="displayName"
      :maxlength="16"
      valid=""
      :state="validUsername"
    />
    <BFormInput type="email" required placeholder="email" v-model="email" />
    <BFormInput
      type="password"
      required
      placeholder="password"
      v-model="password"
      :state="validPassword"
    />
    <BButton type="submit">Sign Up</BButton>
  </BForm>
</template>

<script>
import { computed, ref } from 'vue'
import { auth } from '../firebase/config'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useUserStore } from '@/stores/userStore.ts'
import BForm from 'bootstrap-vue-next/src/components/BForm/BForm.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
export default {
  setup(props, context) {
    const displayName = ref('')
    const email = ref('')
    const password = ref('')
    const userStore = useUserStore()
    const validUsername = computed(() => {
      if (!displayName.value) {
        return null
      } else if (displayName.value.length > 16) {
        return false
      } else {
        return true
      }
    })
    const validPassword = computed(() => {
      if (!password.value) {
        return null
      } else if (password.value.length < 6) {
        return false
      } else {
        return true
      }
    })
    const handleSubmit = async () => {
      createUserWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user

          updateProfile(user, {
            displayName: displayName.value
          })
            .then(() => {
              console.log('User profile updated successfully')
              userStore.setUser(user.displayName, user.email, user.uid, user.invites)
              console.log('signed up')
              context.emit('login')
            })
            .catch((error) => {
              console.log(error.message)
            })
          // ...
        })
        .catch((error) => {
          console.log(error.message)
          if (error.message.includes('email-already')) {
            alert('Email already in use!')
          }
        })
    }

    return { displayName, email, password, handleSubmit, validPassword, validUsername }
  },
  components: {
    BButton,
    BForm,
    BFormInput
  }
}
</script>

<style></style>
