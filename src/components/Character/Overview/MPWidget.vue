<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormGroup from 'bootstrap-vue-next/src/components/BFormGroup/BFormGroup.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import { useEquipmentStore } from '@/stores/equipmentStore'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { mpStatusModifiers } = storeToRefs(characterStore)
    const martialSkillsStore = useMartialSkillsStore()
    const { combatStyles } = storeToRefs(martialSkillsStore)
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const modifierType = ['Modify Mp', 'Override Mp']

    const wornArmorPassives = computed(() => {
      return equipment.value.items.Armor[equipment.value.wornArmor]?.equippedStats?.passives || {}
    })

    const primaryHandheldPassives = computed(() => {
      return (
        equipment.value.items.Weapon[equipment.value.primaryHand]?.equippedStats?.passives || {}
      )
    })

    const secondaryHandheldPassives = computed(() => {
      return (
        equipment.value.items.Shield[equipment.value.secondaryHand]?.equippedStats?.passives ||
        equipment.value.items.Weapon[equipment.value.secondaryHand]?.equippedStats?.passives ||
        {}
      )
    })
    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(mpStatusModifiers.value)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })
      console.log(ret)

      return ret
    })
    function getColor() {
      if (mpStatusModifiers.value['Override Mp'] || mpStatusModifiers.value['Modify Mp']) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }
    function addMpStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount
      }

      characterStore.addNewMpStatusModifier(statusObj)
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      characterStore.removeMpStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }

    const maxCombatStyle: ComputedRef<number> = computed(() => {
      const styles = Object.values(combatStyles.value)
      let ret = styles.reduce((acc: number, style: any) => (style.rank > acc ? style.rank : acc), 0)
      if (mpStatusModifiers.value['Override Mp']) {
        let max = Object.values(mpStatusModifiers.value['Override Mp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          ret = max
        }
      }
      if (characterStore.traits['Bonus MP']) {
        ret += parseInt(characterStore.traits['Bonus MP'].number)
      }
      if (wornArmorPassives.value['Override Mp']) {
        ret = parseInt(wornArmorPassives.value['Override Mp']?.modAmount)
      }
      if (primaryHandheldPassives.value['Override Mp']) {
        ret = parseInt(primaryHandheldPassives.value['Override Mp']?.modAmount)
      }
      if (secondaryHandheldPassives.value['Override Mp']) {
        ret = parseInt(secondaryHandheldPassives.value['Override Mp']?.modAmount)
      }
      let modifier = -1000

      if (wornArmorPassives.value['Modify Mp']) {
        modifier = Math.max(parseInt(wornArmorPassives.value['Modify Mp']?.modAmount), modifier)
      }
      if (primaryHandheldPassives.value['Modify Mp']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Mp']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Mp']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Mp']?.modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }

      if (mpStatusModifiers.value['Modify Mp']) {
        let max = Object.values(mpStatusModifiers.value['Modify Mp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      return Math.max(ret + modifier, 0)
    })
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      maxCombatStyle,
      modifierType,
      statusModifiersList,
      addMpStatusModifier,
      removeModifier,
      getColor,
      primaryHandheldPassives
    }
  },
  components: {
    TitleWidget,
    CustomModal,
    AddStatusEffectWidget,
    StatusModifierExplaination,
    StatusEffectItem
  }
}
</script>

<template>
  <div
    @click="modal = !modal"
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
        :style="{
          color: getColor()
        }"
      >
        <div style="display: flex; justify-content: center">{{ maxCombatStyle }}</div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: getColor() }"
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
    <CustomModal title="Modify MP " :showModal="modal" @close="modal = !modal">
      <template v-slot:body>
        <div style="font-size: x-large; text-align: center; margin-bottom: 0.25rem">
          {{ maxCombatStyle }} Martial Points
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: -1.5rem">
          <TitleWidget title="Status Modifiers" style="width: 100%"></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>
        <AddStatusEffectWidget
          :modifierType="modifierType"
          @added="(addedVal) => addMpStatusModifier(addedVal)"
        ></AddStatusEffectWidget>

        <div v-for="mod in statusModifiersList" :key="mod">
          <StatusEffectItem
            @delete="removeModifier(mod.modifierType, mod.modAmount, mod.linkedStatus)"
            :modifierType="mod.modifierType"
            :modAmount="mod.modAmount"
            :linkedStatus="mod.linkedStatus"
          ></StatusEffectItem>
        </div>
      </template>
    </CustomModal>
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
