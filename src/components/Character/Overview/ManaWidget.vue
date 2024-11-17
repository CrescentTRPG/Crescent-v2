<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    return {
      designStore,
      modal,
      userStore,
      characterStore
    }
  },
  components: {}
}
</script>

<template>
  <div
    style="width: 13.5rem; height: 10rem; margin-top: -1rem"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="
        position: absolute;
        font-size: 9rem;
        z-index: 5;
        margin-left: 2rem;
        margin-top: -1.5rem;
        transform: scale(1.2, 1);
      "
      :style="{ color: designStore.primaryTheme }"
    >
      <i class="bi bi-book-fill"></i>
    </div>
    <div
      style="
        position: absolute;
        font-size: 10rem;
        z-index: 4;
        margin-left: 1.5rem;
        margin-top: -2rem;
        transform: scale(1.1, 1);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <i class="bi bi-book-fill"></i>
    </div>
    <!-- <div
      style="
        position: absolute;
        z-index: 4;
        margin-top: -1rem;
        margin-left: 2rem;
        transform: rotate(180deg);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-sparkles" scale="4"></v-icon>
    </div>
    <div
      style="
        position: absolute;
        z-index: 4;
        margin-top: -1rem;
        margin-left: 6.5rem;
        transform: rotate(270deg);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-sparkles" scale="4"></v-icon>
    </div>
    <div
      style="
        position: absolute;
        z-index: 4;
        margin-top: 4.5rem;
        margin-left: 1.5rem;
        transform: rotate(200deg);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-sparkles" scale="4"></v-icon>
    </div>
    <div
      style="
        position: absolute;
        z-index: 4;
        margin-top: 4.5rem;
        margin-left: 6.5rem;
        transform: rotate(120deg);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-sparkles" scale="4"></v-icon>
    </div> -->
    <div class="manaTxt">
      <div style="display: flex; flex-direction: column; margin-top: 0.75rem">
        <div style="display: flex; flex-direction: row; justify-content: center">
          <div
            style="display: flex; flex-direction: column"
            :style="{ color: designStore.primaryText }"
          >
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
            >
              <div style="display: flex" class="bigText">10</div>
            </div>
            <div style="align-self: center; font-size: 0.75rem" class="liltext">Current</div>
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
          <div
            style="display: flex; flex-direction: column"
            :style="{ color: designStore.primaryText }"
          >
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
            >
              <div style="display: flex" class="bigText">12</div>
            </div>
            <div style="align-self: center; font-size: 0.75rem" class="liltext">Total</div>
          </div>
        </div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 2.25rem; align-self: center; margin-top: -1rem"
        >
          Mana
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.manaTxt {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
@media (max-width: 600px) {
}
@media (max-width: 700px) {
  .liltext {
    display: none;
  }
  .bigText {
    font-size: 2.5rem;
  }
}
</style>
