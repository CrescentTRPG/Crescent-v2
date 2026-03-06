<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'

import GuideMessage from '@/components/GuideMessage.vue'
import EquipmentTable from '@/components/Character/Equipment/EquipmentTable.vue'
import { useEquipmentStore } from '@/stores/equipmentStore.ts'
import { storeToRefs } from 'pinia'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { usePartyStore } from '@/stores/partyStore.ts'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const adventureStore = useAdventureStore()
    const partyStore = usePartyStore()
    const { characterObjects } = usePartyStore()
    const { equipment } = storeToRefs(adventureStore)
    const genericItems: ComputedRef<Array<any>> = computed(() => {
      let ret: Array<any> = []
      Object.values(characterObjects).forEach((character: any) => {
        ret = ret.concat(Object.values(character?.equipment?.items?.Generic))
      })
      return Object.values(equipment.value.items.Generic).concat(ret)
    })
    const weapons: ComputedRef<Array<any>> = computed(() => {
      let ret: Array<any> = []
      Object.values(characterObjects).forEach((character: any) => {
        ret = ret
          .concat(Object.values(character?.equipment?.items?.Weapon))
          .filter((item) => item.name)
      })
      return Object.values(equipment.value.items.Weapon).concat(ret)
    })
    const armor: ComputedRef<Array<any>> = computed(() => {
      let ret: Array<any> = []
      Object.values(characterObjects).forEach((character: any) => {
        ret = ret
          .concat(Object.values(character?.equipment?.items?.Armor))
          .filter((item) => item.name)
      })
      return Object.values(equipment.value.items.Armor).concat(ret)
    })
    const shields: ComputedRef<Array<any>> = computed(() => {
      let ret: Array<any> = []
      Object.values(characterObjects).forEach((character: any) => {
        ret = ret
          .concat(Object.values(character?.equipment?.items?.Shield))
          .filter((item) => item.name)
      })
      return Object.values(equipment.value.items.Shield).concat(ret)
    })
    const potions: ComputedRef<Array<any>> = computed(() => {
      let ret: Array<any> = []
      Object.values(characterObjects).forEach((character: any) => {
        ret = ret
          .concat(Object.values(character?.equipment?.items?.Potion))
          .filter((item) => item.name)
      })
      return Object.values(equipment.value.items.Potion).concat(ret)
    })
    const ingredients: ComputedRef<Array<any>> = computed(() => {
      let ret: Array<any> = []
      Object.values(characterObjects).forEach((character: any) => {
        ret = ret
          .concat(Object.values(character?.equipment?.items?.Ingredient))
          .filter((item) => item.name)
      })
      return Object.values(equipment.value.items.Ingredient).concat(ret)
    })
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      adventureStore,
      equipment,
      genericItems,
      weapons,
      potions,
      armor,
      shields,
      ingredients
    }
  },
  components: { EquipmentTable }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <EquipmentTable
      :equipment="equipment"
      :add="adventureStore.addItem"
      :remove="adventureStore.removeItem"
      :edit="adventureStore.editInPlace"
      :get-numberof-attuned-items="0"
      :getTotalAttuneableItems="0"
      :adventure-mode="true"
      :weapons="weapons"
      :armor="armor"
      :potions="potions"
      :ingredients="ingredients"
      :genericItems="genericItems"
      :shields="shields"
    ></EquipmentTable>
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
