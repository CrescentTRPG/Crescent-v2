<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import MiniArmorWidget from './MiniArmorWidget.vue'

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
  components: { MiniArmorWidget }
}
</script>

<template>
  <div
    style="width: 13.5rem; height: 10rem; margin-top: -0.65rem"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="
        position: absolute;
        font-size: 10rem;
        z-index: 5;
        margin-left: 1.5rem;
        margin-top: -1.5rem;
        transform: scale(1.1, 0.95);
      "
      :style="{ color: designStore.primaryTheme }"
    >
      <i class="bi bi-shield-fill"></i>
    </div>
    <div
      style="
        position: absolute;
        font-size: 11rem;
        z-index: 4;
        margin-left: 1rem;
        margin-top: -2rem;
        transform: scale(1, 0.95);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <i class="bi bi-shield-fill"></i>
    </div>
    <div class="shieldTxt" :style="{ color: designStore.primaryText }">
      <div style="display: flex; flex-direction: column; margin-top: 0.75rem">
        <div class="lilDVs">
          <MiniArmorWidget
            emblem="gi-visored-helm"
            margin-top="-1.2rem"
            value="5"
          ></MiniArmorWidget>
          <MiniArmorWidget emblem="gi-shield" margin-top="-1.2rem" value="0"></MiniArmorWidget>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: -1rem;
            margin-bottom: -0.75rem;
            font-size: 3rem;
          "
        >
          15
        </div>

        <div class="lilDVs">
          <MiniArmorWidget emblem="gi-run" margin-top="-1.4rem" value="10"></MiniArmorWidget>
          <MiniArmorWidget
            emblem="gi-vibrating-shield"
            margin-top="-1.4rem"
            value="0"
          ></MiniArmorWidget>
        </div>

        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 1.75rem; align-self: center; margin-top: -2.75rem"
        >
          Dvs
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shieldTxt {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
.lilDVs {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: medium;
}
@media (max-width: 600px) {
}
</style>
