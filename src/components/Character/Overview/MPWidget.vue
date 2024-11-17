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
    style="
      width: 12.5rem;
      height: 10rem;
      margin-top: -1rem;
      margin-bottom: 1.5rem;
      align-items: center;
    "
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="position: absolute; z-index: 5; transform: scale(1.25, 1)"
      :style="{ color: designStore.primaryTheme }"
    >
      <v-icon name="gi-swords-emblem" scale="10"></v-icon>
    </div>
    <div class="heartTxt">
      <div
        style="display: flex; flex-direction: column; margin-top: 4.5rem"
        :style="{ color: designStore.primaryText }"
      >
        <div style="display: flex; justify-content: center">5</div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 1.5rem; align-self: center; margin-top: -1rem"
        >
          MP
        </div>
      </div>
    </div>
    <div
      style="position: relative; right: 0.5rem; top: -0.25rem; z-index: 4; transform: scale(1.2, 1)"
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-swords-emblem" scale="10.75"></v-icon>
    </div>
  </div>
</template>

<style scoped>
.heartTxt {
  position: absolute;
  font-size: 3rem;
  z-index: 5;
  margin-top: -0.5rem;
  width: 12.5rem;
}
@media (max-width: 600px) {
}
</style>
