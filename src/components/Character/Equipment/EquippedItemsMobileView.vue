<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import EquippedArmor from './EquippedArmor.vue'
import PrimaryHandheld from './PrimaryHandheld.vue'
import SecondaryHandheld from './SecondaryHandheld.vue'

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
  components: { EquippedArmor, PrimaryHandheld, SecondaryHandheld }
}
</script>

<template>
  <div
    style="display: flex; justify-content: space-evenly"
    :style="{ background: designStore.sidebarBacking, color: designStore.secondaryTheme }"
  >
    <PrimaryHandheld class="evenSmaller tiny"></PrimaryHandheld>

    <EquippedArmor class="evenSmaller tiny" style="position: relative; top: 2rem"></EquippedArmor>
    <SecondaryHandheld class="evenSmaller tiny"> </SecondaryHandheld>
  </div>
</template>

<style scoped>
@media (max-width: 600px) {
  .evenSmaller {
    transform: scale(0.8, 0.8);
    margin: -2rem;

    margin-left: -5rem;
    margin-right: -5rem;
  }
  @media (max-width: 550px) {
    .tiny {
      transform: scale(0.6, 0.6);
      margin: -3rem;

      margin-left: -5rem;
      margin-right: -5rem;
    }
  }
}
</style>
