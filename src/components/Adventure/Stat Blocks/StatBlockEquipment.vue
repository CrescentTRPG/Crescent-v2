<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'
import _ from 'lodash'

import GuideMessage from '@/components/GuideMessage.vue'
import EquipmentTable from '@/components/Character/Equipment/EquipmentTable.vue'
import { Item, useEquipmentStore } from '@/stores/equipmentStore.ts'
import { storeToRefs } from 'pinia'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { usePartyStore } from '@/stores/partyStore.ts'
import StatBlockEquippedItems from './StatBlockEquippedItems.vue'

export default {
  props: ['equipment', 'update', 'updateTemp', 'currentStatBlock', 'currentStatBlockId'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const adventureStore = useAdventureStore()
    const partyStore = usePartyStore()
    const genericItems: ComputedRef<Array<any>> = computed(() => {
      return Object.values(props.equipment.items.Generic)
    })
    const weapons: ComputedRef<Array<any>> = computed(() => {
      return Object.values(props.equipment.items.Weapon)
    })
    const armor: ComputedRef<Array<any>> = computed(() => {
      return Object.values(props.equipment.items.Armor)
    })
    const shields: ComputedRef<Array<any>> = computed(() => {
      return Object.values(props.equipment.items.Shield)
    })
    const potions: ComputedRef<Array<any>> = computed(() => {
      return Object.values(props.equipment.items.Potion)
    })
    const ingredients: ComputedRef<Array<any>> = computed(() => {
      return Object.values(props.equipment.items.Ingredient)
    })
    function addItem(item) {
      const newEquip = _.cloneDeep(props.equipment)
      const newStatBlock = _.cloneDeep(props.currentStatBlock)

      if (item.equippedStats?.ability?.name && (!item.isAttuneable || item.isAttuned)) {
        if (item.type === 'Generic') {
          if (!newStatBlock.genericsWithAbilitites) {
            newStatBlock.genericsWithAbilitites = []
          }
          newStatBlock.genericsWithAbilitites.unshift(item.name)
        }
        if (item.type === 'Armor') {
          if (!newStatBlock.armorsWithAbilities) {
            newStatBlock.armorsWithAbilities = []
          }
          newStatBlock.armorsWithAbilities.unshift(item.name)
        }
        if (item.type === 'Weapon') {
          if (!newStatBlock.weaponsWithAbilitites) {
            newStatBlock.weaponsWithAbilitites = []
          }
          newStatBlock.weaponsWithAbilitites.unshift(item.name)
        }
        if (item.type === 'Shield') {
          if (!newStatBlock.shieldsWithAbilitites) {
            newStatBlock.shieldsWithAbilitites = []
          }
          newStatBlock.shieldsWithAbilitites.unshift(item.name)
        }
      }
      if (item.type === 'Potion') {
        if (!newStatBlock.potionsWithAbilities) {
          newStatBlock.potionsWithAbilities = []
        }
        newStatBlock.potionsWithAbilities.unshift(item.name)
      }
      newEquip.items[item.type][item.name] = item
      props.updateTemp(newStatBlock)
      props.update(newEquip)
    }
    function removeItem(item: Item, unequip = false) {
      const newEquip = _.cloneDeep(props.equipment)
      let newStatBlock = _.cloneDeep(props.currentStatBlock)
      if (item.type === 'Armor' && item.name === newEquip.wornArmor && unequip) {
        newEquip.equipment.wornArmor = ''
      }
      if (item.equippedStats.ability.name && (!item.isAttuneable || item.isAttuned)) {
        if (item.type === 'Generic') {
          newStatBlock.genericsWithAbilitites = newStatBlock.genericsWithAbilitites.filter(
            (word) => word != item.name
          )
        }
        if (item.type === 'Armor') {
          newStatBlock.armorsWithAbilities = newStatBlock.armorsWithAbilities.filter(
            (word) => word != item.name
          )
        }
        if (item.type === 'Weapon') {
          newStatBlock.weaponsWithAbilitites = newStatBlock.weaponsWithAbilitites.filter(
            (word) => word != item.name
          )
        }
        if (item.type === 'Shield') {
          newStatBlock.shieldsWithAbilitites = newStatBlock.shieldsWithAbilitites.filter(
            (word) => word != item.name
          )
        }
      }
      if (item.type === 'Potion') {
        newStatBlock.potionsWithAbilities = newStatBlock.potionsWithAbilities.filter(
          (word) => word != item.name
        )
      }
      delete newEquip.items[item.type][item.name]
      props.updateTemp(newStatBlock)
      props.update(newEquip)
    }
    function editInPlace(item: Item) {
      const newEquip = _.cloneDeep(props.equipment)
      newEquip.items[item.type][item.name] = item
      props.update(newEquip)
    }
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      adventureStore,
      genericItems,
      weapons,
      potions,
      armor,
      shields,
      ingredients,
      addItem,
      editInPlace,
      removeItem,
      props
    }
  },
  components: { EquipmentTable, StatBlockEquippedItems }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <!-- <div class="largeView"><EquippedItems></EquippedItems></div> -->
    <div class="arrangePage">
      <div>
        <StatBlockEquippedItems
          :addItem="addItem"
          :removeItem="removeItem"
          :updateTemp="props.updateTemp"
          :currentStatBlock="props.currentStatBlock"
        ></StatBlockEquippedItems>
      </div>
      <EquipmentTable
        style="flex-grow: 1"
        :equipment="equipment"
        :add="addItem"
        :remove="removeItem"
        :edit="editInPlace"
        :get-numberof-attuned-items="0"
        :getTotalAttuneableItems="0"
        :adventure-mode="true"
        :weapons="weapons"
        :armor="armor"
        :potions="potions"
        :ingredients="ingredients"
        :genericItems="genericItems"
        :shields="shields"
        :addTo="currentStatBlockId"
        :hideOwnership="true"
      ></EquipmentTable>
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
