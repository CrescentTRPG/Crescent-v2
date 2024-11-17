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
  <div style="width: 13.5rem; height: 10rem" :style="{ fontFamily: designStore.font }">
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
      <i class="bi bi-heart-fill"></i>
    </div>
    <div
      style="
        position: absolute;
        font-size: 10rem;
        z-index: 4;
        margin-left: 1.5rem;
        margin-top: -2rem;
        transform: scale(1.05, 1);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <i class="bi bi-heart-fill"></i>
    </div>
    <div class="heartTxt">
      <div style="display: flex; flex-direction: column; margin-top: 0.75rem">
        <div style="display: flex; flex-direction: row">
          <div
            style="
              width: 50%;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              position: relative;
              right: 1rem;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-self: center;
                margin-bottom: 0.75rem;
                font-size: xx-large;
              "
              :style="{ color: designStore.primaryText }"
            >
              <div style="align-self: center; margin: 0.5rem; margin-bottom: -1rem" class="bigText">
                10
              </div>
              <div style="align-self: center; font-size: 0.75rem" class="liltext">Current</div>
            </div>
          </div>
          <div style="display: flex; justify-content: center; position: absolute; width: 100%">
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
          </div>
          <div
            style="
              width: 50%;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              position: relative;
              left: 1rem;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-self: center;
                margin-bottom: 0.75rem;
                font-size: xx-large;
              "
              :style="{ color: designStore.primaryText }"
            >
              <div style="align-self: center; margin: 0.5rem; margin-bottom: -1rem" class="bigText">
                12
              </div>
              <div style="align-self: center; font-size: 0.75rem" class="liltext">Total</div>
            </div>
          </div>
        </div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 2.25rem; align-self: center; margin-top: -1rem"
        >
          HP
        </div>
      </div>
    </div>
    <div
      style="position: relative; z-index: 5; top: 4rem; left: 0rem; transform: scale(1.1, 1)"
      :style="{ color: designStore.secondaryTheme }"
    >
      <div style="position: absolute; z-index: 6">
        <v-icon
          name="gi-hearts"
          scale="2.9"
          style="
            position: relative;
            top: 1.1rem;
            left: 0.95rem;
            z-index: 4;
            transform: scale(1, 0.95);
          "
          :style="{ color: designStore.primaryTheme }"
        ></v-icon>
      </div>

      <div style="position: absolute; z-index: 5">
        <v-icon
          name="gi-heart-shield"
          scale="3.9"
          style="position: relative; top: 0.35rem; left: 0.35rem; z-index: 4"
          :style="{ color: designStore.primaryTheme }"
        ></v-icon>
      </div>

      <v-icon name="gi-heart-shield" scale="4.5" style="position: relative; z-index: 5"></v-icon>
      <div
        style="
          position: relative;
          z-index: 6;
          width: 4rem;
          height: 3rem;
          left: 0.7rem;
          bottom: 3.6rem;
          display: flex;
          justify-content: center;
          font-size: x-large;
        "
        :style="{ color: designStore.primaryText }"
        id="mememememe"
      >
        <div style="z-index: 6; width: min-content; position: absolute">9</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.heartTxt {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
@media (max-width: 600px) {
  .heart {
    margin-left: -5rem;
  }
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
