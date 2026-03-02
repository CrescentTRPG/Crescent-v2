<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import AbilityDisplayMedallion from '@/components/AbilityDisplayMedallion.vue'
import { useUserStore } from '@/stores/userStore.ts'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const file = ref()
    const localImg = ref('')
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const story = ref('')

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      file,
      story,
      localImg
    }
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
    }
  },
  components: { AbilityDisplayMedallion }
}
</script>

<template>
  <div
    style="
      width: 20rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    "
    :style="{ color: designStore.secondaryTheme }"
  >
    <div style="display: flex; justify-content: center; margin-right: 3.75rem">
      <div class="wholepiece">
        <div style="position: absolute" class="iconContainLilDesign">
          <v-icon
            style="margin-left: -1.25rem; margin-top: -1rem"
            :name="designStore.charIcon"
            scale="5"
          ></v-icon>
          <i style="margin-left: 1rem; font-size: 4rem" :class="designStore.charIcon"></i>
        </div>
      </div>
    </div>

    <div
      style="
        display: flex;
        justify-content: space-between;
        padding-left: 5rem;
        padding-right: 5rem;
        margin-top: -0.25rem;
        position: relative;
        top: 0.5rem;
      "
    >
      <div class="wholepiece">
        <v-icon
          v-if="designStore.charIconFlair.substring(0, 2) === 'gi'"
          :name="designStore.charIconFlair"
          scale="2"
          style="transform: rotate(0deg)"
        ></v-icon>
        <i
          v-if="designStore.charIconFlair.substring(0, 2) === 'bi'"
          style="font-size: 1.75rem; transform: rotate(0deg)"
          :class="designStore.charIconFlair"
        ></i>
      </div>
      <div class="wholepiece">
        <v-icon
          v-if="designStore.charIconFlair.substring(0, 2) === 'gi'"
          scale="2"
          :name="designStore.charIconFlair"
          style="transform: rotate(90deg)"
        ></v-icon>
        <i
          v-if="designStore.charIconFlair.substring(0, 2) === 'bi'"
          style="font-size: 1.75rem; transform: rotate(-50deg)"
          :class="designStore.charIconFlair"
        ></i>
      </div>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding-left: 5rem;
        padding-right: 5rem;
        margin-top: 4rem;
        position: relative;
        bottom: 0.5rem;
      "
    >
      <div class="wholepiece">
        <v-icon
          v-if="designStore.charIconFlair.substring(0, 2) === 'gi'"
          scale="2"
          :name="designStore.charIconFlair"
          style="transform: rotate(270deg)"
        ></v-icon>
        <i
          v-if="designStore.charIconFlair.substring(0, 2) === 'bi'"
          style="font-size: 1.75rem; transform: rotate(270deg)"
          :class="designStore.charIconFlair"
        ></i>
      </div>
      <div class="wholepiece">
        <v-icon
          v-if="designStore.charIconFlair.substring(0, 2) === 'gi'"
          scale="2"
          :name="designStore.charIconFlair"
          style="transform: rotate(180deg)"
        ></v-icon>
        <i
          v-if="designStore.charIconFlair.substring(0, 2) === 'bi'"
          style="font-size: 1.75rem; transform: rotate(180deg)"
          :class="designStore.charIconFlair"
        ></i>
      </div>
    </div>
    <div class="wholepiece">
      <AbilityDisplayMedallion :medallion="designStore.charIcon"></AbilityDisplayMedallion>
    </div>
  </div>
</template>

<style scoped>
.iconContainLilDesign {
  margin-top: 1.5rem;
}

@media (max-width: 1000px) {
  .iconContainLilDesign {
    margin-top: 4.75rem;
  }
}
</style>
