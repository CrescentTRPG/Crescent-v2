<template>
  <div class="landing container">
    <p>Welcome to Crescent</p>
    <div v-if="showLogin" style="background: rgb(255, 255, 255); padding: 10px">
      <LoginForm @login="goToHome()" />
      <p style="cursor: pointer; text-decoration: underline" @click="showLogin = !showLogin">
        Need to Create an Account?
      </p>
    </div>
    <div v-else style="background: rgb(255, 255, 255); padding: 10px">
      <SignUpForm @login="goToHome()" />
      <p style="cursor: pointer; text-decoration: underline" @click="showLogin = !showLogin">
        Already have an Account?
      </p>
    </div>
    <p>Made By Jean {{ '<3' }}</p>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import SignUpForm from '../components/SignUpForm.vue'

export default {
  components: { SignUpForm, LoginForm },
  data: function () {
    return {
      showLogin: true,
      router: useRouter()
    }
  },
  methods: {
    goToHome() {
      this.router.push({ name: 'home' })
    }
  }
}
</script>

<style>
.landing {
  color: rgb(163, 98, 193);
  text-align: center;
  padding: 20px 0;
  font-family: 'Courier New', Courier, monospace;
  background: rgb(50, 15, 66);
}

.landing form {
  width: 300px;
  margin: 20px auto;
}
.landing label {
  display: block;
  margin: 20px 0 10px;
}

.landing input {
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #eee;
  outline: none;
  color: #999;
  margin: 10px auto;
}
.landing button {
  cursor: pointer;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #eee;
  outline: none;
  background: rgb(249, 215, 234);
  color: rgb(163, 98, 193);
  font-family: 'Courier New', Courier, monospace;
}
</style>
