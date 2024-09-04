<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    return { designStore }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard
  }
}
</script>

<template>
  <div
    :style="{ color: designStore.inputText }"
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      width: min-content;
      z-index: 2;
      flex-grow: 1;
      cursor: pointer;
    "
  >
    <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
      <div
        style="display: flex; justify-content: space-between; margin-left: 1rem"
        class="pointsContainer"
      >
        <div style="display: flex; flex-direction: row">
          <div style="display: flex; flex-direction: column">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
              :style="{ fontFamily: designStore.titleFont }"
            >
              101
            </div>
            <div style="align-self: center">Spent</div>
          </div>
          <i
            class="bi bi-slash-lg"
            style="
              align-self: center;
              font-size: 3rem;
              transform: skew(25deg);
              margin-right: -0.75rem;
              margin-left: -0.5rem;
            "
            :style="{ color: designStore.secondaryTheme }"
          ></i>
          <div style="display: flex; flex-direction: column">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
              :style="{ fontFamily: designStore.titleFont }"
            >
              120
            </div>
            <div style="align-self: center">Earned</div>
          </div>
        </div>
        <div class="level">
          <div style="font-size: medium; align-self: center; padding-top: 0.5rem">Lvl.</div>
          <div :style="{ fontFamily: designStore.titleFont }" style="margin-top: -1rem">10</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pointsContainer {
  margin-left: 1rem;
}
.level {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: xx-large;
  margin-left: 1rem;
}
@media (max-width: 600px) {
  .level {
    display: none;
  }
  .pointsContainer {
    margin-left: 0;
  }
}
</style>
