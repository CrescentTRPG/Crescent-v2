<script lang="ts">
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import SelectCharacter from '../components/SelectCharacter.vue'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const userStore = useUserStore()
    const navPos = ref('character')
    const logout = async () => {
      error.value = null
      try {
        await signOut(auth)
      } catch (err: any) {
        console.log(err.message)
        error.value = err.message
      }
      router.push({ name: 'landing' })
      console.log('Signed Out')
    }
    return { logout, userStore, navPos }
  },
  computed: {
    width() {
      return window.innerWidth
    }
  },
  methods: {
    navItemStyle(item: string) {
      switch (item) {
        case 'character':
          if (this.navPos === 'character') {
            return '#c15be6'
          }
          return '#000000'
        case 'adventure':
          if (this.navPos == 'adventure') {
            return '#c15be6'
          }
          return '#000000'
        case 'browse':
          if (this.navPos == 'browse') {
            return '#c15be6'
          }
          return '#000000'
      }
    },
    navItemStyleBg(item: string) {
      switch (item) {
        case 'character':
          if (this.navPos === 'character') {
            return '#dfdfdf'
          }
          return '#f1eef1'
        case 'adventure':
          if (this.navPos == 'adventure') {
            return '#dfdfdf'
          }
          return '#f1eef1'
        case 'browse':
          if (this.navPos == 'browse') {
            return '#dfdfdf'
          }
          return '#f1eef1'
      }
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    SelectCharacter
  }
}
</script>

<template>
  <div class="fill">
    <div
      style="
        display: flex;
        justify-content: space-between;
        background-color: #f1eef1;
        height: 4.5rem;
      "
    >
      <div style="display: flex; justify-content: flex-start">
        <span class="component"
          ><div style="width: 150%">Welcome {{ userStore.getDisplayName }}!</div></span
        >
        <div class="dazzle"></div>
        <div class="dazzle2"></div>
      </div>
      <div style="padding-right: 1rem; padding-top: 0.5rem; min-width: 8.5rem">
        <BButton class="button" style="margin-right: 0.25rem">
          <i class="bi bi-gear-fill"></i>
        </BButton>
        <BButton @click="logout()" class="button"> logout</BButton>
      </div>
    </div>
    <BNavbar
      style="
        background: #f1eef1;
        width: 100%;
        font-family: Bahnschrift;
        margin-top: 1rem;
        border: 2px solid #c2b172;
      "
    >
      <BNavItem
        :style="{ color: navItemStyle('character'), background: navItemStyleBg('character') }"
        @click="navPos = 'character'"
        class="navI"
        >Characters</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('adventure'), background: navItemStyleBg('adventure') }"
        @click="navPos = 'adventure'"
        class="navI"
        >Adventures</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('browse'), background: navItemStyleBg('browse') }"
        @click="navPos = 'browse'"
        class="navI"
        >Browse</BNavItem
      ></BNavbar
    >
    <SelectCharacter v-if="navPos == 'character'"></SelectCharacter>
  </div>
</template>

<style>
.component {
  background-color: #422c58;
  padding: 1rem;
  padding-top: 0.5rem;
  font-size: 1.25rem;
  color: #dfdfdf;
  font-style: 'Bahnscrift';
  height: 5rem;
  font-family: 'Bahnschrift', sans-serif;
  text-wrap: wrap;
}
.button {
  background-color: #422c58;
  border: none;
  color: #dfdfdf;
  font-family: 'Bahnschrift', sans-serif;
}
.navI {
  list-style-type: none;
  width: 33%;
  text-align: center;
}
@media (max-width: 600px) {
  /* CSS that should be displayed if width is equal to or less than 800px goes here */
  .component {
    background-color: #422c58;
    padding: 1rem;
    padding-top: 0.5rem;
    font-size: 1rem;
    color: #dfdfdf;
    font-style: 'Bahnscrift';
    height: 5rem;
    font-family: 'Bahnschrift', sans-serif;
    text-wrap: wrap;
    width: min-content;
  }
}
.dazzle {
  width: 0;
  height: 0;
  border-left: 5rem solid #422c58;
  border-bottom: 5rem solid transparent;
}
.dazzle2 {
  width: 2rem;
  height: 5rem;
  transform: skew(-45deg);
  background: #c2b172;
  position: relative;
  right: 2.5rem;
}
.fill {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  background-color: #dfdfdf;
}
</style>
