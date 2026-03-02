<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'
import EquipmentTable from './EquipmentTable.vue'
import EquippedItems from './EquippedItems.vue'
import CoinPurse from './CoinPurse.vue'
import EquippedItemsMobileView from './EquippedItemsMobileView.vue'
import GuideMessage from '@/components/GuideMessage.vue'

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
  components: { EquipmentTable, EquippedItems, CoinPurse, EquippedItemsMobileView, GuideMessage }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <div class="arrangePage">
      <div class="largeView"><EquippedItems></EquippedItems></div>
      <GuideMessage
        :step="18"
        style="
          position: absolute;
          max-width: 30rem;
          z-index: 50;
          margin-top: 2rem;
          margin-left: 10rem;
        "
        title="Equipped Items"
        orientation="left"
        shift="start"
        message="Equip items to your character here. Remember to add them to your inventory first.  When you equip an item, it's passive effects will automatically propagate on the overview page."
      ></GuideMessage>
      <div style="display: flex; flex-direction: column; flex-grow: 1">
        <GuideMessage
          :step="19"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: 3rem;
            margin-left: 10rem;
          "
          title="Money"
          orientation="bottom"
          shift="start"
          message="Track your funds here."
        ></GuideMessage>
        <CoinPurse></CoinPurse>
        <GuideMessage
          :step="20"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: 25rem;
            margin-left: 10rem;
          "
          title="Items"
          orientation="bottom"
          shift="start"
          message="This table shows every item in your character's possesion. Adding a craftable item uses the crafting mechanics to build an item form scratch, brewing a potion uses alchemy mechanics to make a potion following the rules, and add item works for anything from generic items to uniqque magical artifacts with custom abilities and passives."
        ></GuideMessage>
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
