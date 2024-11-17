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
      display: flex;
      width: 100%;
      justify-content: space-evenly;
      margin-bottom: 0.5rem;
      border-top: 2px solid;
      border-bottom: 2px solid;
    "
    :style="{
      fontFamily: designStore.font,
      background: designStore.inputBacking,
      color: designStore.inputText,
      borderColor: designStore.secondaryTheme
    }"
  >
    <div>Movespeeds:</div>
    <div style="display: flex">
      <div class="iconNames"><v-icon scale="1.5" name="gi-sprint"></v-icon></div>

      <div class="fullNames">Base:&nbsp;</div>
      <div>30</div>
    </div>
    <div style="display: flex">
      <div class="iconNames"><v-icon scale="1.5" name="gi-angel-wings"></v-icon></div>

      <div class="fullNames">Flight:&nbsp;</div>
      <div>0</div>
    </div>
    <div style="display: flex">
      <div class="iconNames"><v-icon scale="1.5" name="gi-whale-tail"></v-icon></div>

      <div class="fullNames">Swim:&nbsp;</div>
      <div>0</div>
    </div>
    <div style="display: flex">
      <div class="iconNames"><v-icon scale="1.5" name="gi-gecko"></v-icon></div>

      <div class="fullNames">Climb:&nbsp;</div>
      <div>0</div>
    </div>
    <div style="display: flex">
      <div class="iconNames"><v-icon scale="1.5" name="gi-dig-hole"></v-icon></div>

      <div class="fullNames">Burrow:&nbsp;</div>
      <div>0</div>
    </div>
  </div>
</template>

<style scoped>
.fullNames {
  display: block;
}

.iconNames {
  display: none;
}
@media (max-width: 600px) {
  .fullNames {
    display: none;
  }
  .iconNames {
    display: block;
  }
}
</style>
