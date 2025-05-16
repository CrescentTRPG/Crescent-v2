<template>
  <div style="height: 100%">
    <BImg
      style="position: absolute; z-index: 2; width: 10%; min-width: 6rem; max-width: 10rem"
      fluid
      src="\corner.png"
    ></BImg>
    <BImg
      style="
        position: absolute;
        right: 0;
        transform: scaleX(-1);
        z-index: 2;
        width: 10%;
        min-width: 6rem;
        max-width: 10rem;
      "
      fluid
      src="\corner.png"
    ></BImg>
    <BImg
      style="
        position: absolute;
        right: 0;
        bottom: 0;
        transform: scale(-1, -1);
        z-index: 2;
        width: 10%;
        min-width: 6rem;
        max-width: 10rem;
      "
      fluid
      src="\corner.png"
    ></BImg>
    <BImg
      style="
        position: absolute;
        bottom: 0;
        transform: scale(1, -1);
        z-index: 2;
        width: 10%;
        min-width: 6rem;
        max-width: 10rem;
      "
      fluid
      src="\corner.png"
    ></BImg>
    <BImg
      style="position: absolute; z-index: 1; min-height: 100%; min-width: 100%"
      src="\web-bg.png"
    ></BImg>
    <div style="height: 100%">
      <div style="height: 100vh; display: flex; justify-content: center">
        <div
          class="landing container"
          style="
            z-index: 3;
            position: relative;
            align-self: center;
            border-radius: 0.375rem;
            border: 3px solid;
            border-color: #c2b172;
            box-shadow: 2px 2px 8px 6px rgb(0, 0, 0, 0.3);
          "
        >
          <h1>
            <i class="bi bi-stars" style="color: #c2b172"></i>Welcome to Crescent<i
              style="transform: scaleX(-1); color: #c2b172"
              class="bi bi-stars"
            ></i>
          </h1>
          <div v-if="showLogin" style="background: #dfdfdf; color: #c15be6; padding: 10px">
            <LoginForm @login="goToHome()" />
            <p style="cursor: pointer; text-decoration: underline" @click="showLogin = !showLogin">
              Need to Create an Account?
            </p>
          </div>
          <div v-else style="background: #dfdfdf; color: #c15be6; padding: 10px">
            <SignUpForm @login="goToHome()" />
            <p style="cursor: pointer; text-decoration: underline" @click="showLogin = !showLogin">
              Already have an Account?
            </p>
          </div>
        </div>
      </div>
      <hr
        style="
          color: #b8860b;
          z-index: 3;
          margin-top: -0.55rem;
          height: 0.45rem;
          background-color: #b8860b;
          border-top: 4px solid #c2b172;
        "
      />
      <div
        style="
          display: flex;
          flex-direction: column;
          width: 100%;
          z-index: 10;
          height: 100%;
          min-height: 10rem;
          margin-top: -1.5rem;
          justify-content: center;
        "
      >
        <div style="z-index: 3; min-height: 10rem; text-align: center; font-size: large">
          <div
            style="
              display: flex;
              justify-content: center;
              width: 100%;
              height: 100%;
              min-height: 10rem;
              padding-top: 1rem;
              background: #422c58;
            "
          >
            <RibbonTitle
              style="align-self: center"
              title="This Will Be A Banner"
              textColor="#000000"
              background="#e7e2e9"
            ></RibbonTitle>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import LoginForm from '../components/LoginForm.vue'
import SignUpForm from '../components/SignUpForm.vue'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'

export default {
  components: { SignUpForm, LoginForm, BImg, RibbonTitle },
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
  color: #dfdfdf;
  text-align: center;
  padding: 20px 0;
  font-family: 'Bahnschrift', sans-serif;
  background: #422c58;
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
  border-radius: 0.375rem;
  border: 2px solid #eee;
  outline: none;
  border-color: #c2b172;
  background: #f1eef1;
  margin: 10px auto;
}
.landing button {
  cursor: pointer;
  padding: 10px;
  border-radius: 0.375rem;
  border: 1px solid #eee;
  outline: none;
  background: #422c58;
  color: #dfdfdf;
  font-family: 'Bahnschrift', sans-serif;
}
</style>
