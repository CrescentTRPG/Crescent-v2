<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import EquipmentTable from './EquipmentTable.vue'
import EquippedItems from './EquippedItems.vue'
import CoinPurse from './CoinPurse.vue'
import EquippedItemsMobileView from './EquippedItemsMobileView.vue'

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
  components: { EquipmentTable, EquippedItems, CoinPurse, EquippedItemsMobileView }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <div class="arrangePage">
      <div class="largeView"><EquippedItems></EquippedItems></div>
      <div style="display: flex; flex-direction: column; flex-grow: 1">
        <CoinPurse></CoinPurse>
        <div class="smallView"><EquippedItemsMobileView></EquippedItemsMobileView></div>
        <EquipmentTable></EquipmentTable>
      </div>
    </div>
  </div>
</template>

<style>
.arrangePage {
  display: flex;
}
.smallView {
  display: none;
}

@media (max-width: 800px) {
  .largeView {
    display: none;
  }
  .smallView {
    display: block;
  }
}
</style>
