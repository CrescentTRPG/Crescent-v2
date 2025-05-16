<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { useSkillStore } from '@/stores/skillsStore'
import CustomModal from '@/components/CustomModal.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import { BButton, BFormInput, BFormSelect } from 'bootstrap-vue-next'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import { useEquipmentStore } from '@/stores/equipmentStore'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  props: [
    'traits',
    'wornArmorPassives',
    'secondaryHandheldPassives',
    'primaryHandheldPassives',
    'movementStatusModifiers',
    'statusEffects',
    'addNewMovementStatusModifier',
    'removeMovementStatusModifier',
    'base',
    'climbing',
    'flight',
    'burrowing',
    'swimming',
    'isStunned',
    'isPinned',
    'isProne',
    'isSlowed'
  ],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()

    const skillsStore = useSkillStore()
    const { skills } = storeToRefs(skillsStore)
    const martialPerksStore = useMartialPerksStore()
    const { perkGain } = storeToRefs(martialPerksStore)
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const modifierType = [
      'Modify Base',
      'Override Base',
      'Modify Flight',
      'Override Flight',
      'Modify Swim',
      'Override Swim',
      'Modify Climb',
      'Override Climb',
      'Modify Burrow',
      'Override Burrow'
    ]

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(props.movementStatusModifiers)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })
      console.log(ret)

      return ret
    })
    function getColor() {
      if (
        props.isStunned ||
        props.isPinned ||
        props.isProne ||
        props.isSlowed ||
        props.movementStatusModifiers['Override Base'] ||
        props.movementStatusModifiers['Modify Base']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getFlightColor() {
      if (
        props.isStunned ||
        props.isPinned ||
        props.isProne ||
        props.isSlowed ||
        props.statusEffects['Ethereal'] ||
        props.movementStatusModifiers['Override Flight'] ||
        props.movementStatusModifiers['Modify Flight']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getSwimColor() {
      if (
        props.isStunned ||
        props.isPinned ||
        props.isProne ||
        props.isSlowed ||
        props.movementStatusModifiers['Override Swim'] ||
        props.movementStatusModifiers['Modify Swim']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getClimbColor() {
      if (
        props.isStunned ||
        props.isPinned ||
        props.isProne ||
        props.isSlowed ||
        props.movementStatusModifiers['Override Climb'] ||
        props.movementStatusModifiers['Modify Climb']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getBurrowColor() {
      if (
        props.isStunned ||
        props.isPinned ||
        props.isProne ||
        props.isSlowed ||
        props.movementStatusModifiers['Override Burrow'] ||
        props.movementStatusModifiers['Modify Burrow']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function addMovespeedStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount
      }
      props.addNewMovementStatusModifier(statusObj)
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      props.removeMovementStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }

    return {
      designStore,
      modal,
      userStore,
      getColor,
      getFlightColor,
      getBurrowColor,
      getSwimColor,
      getClimbColor,
      modifierType,
      statusModifiersList,
      removeModifier,
      addMovespeedStatusModifier,
      props
    }
  },
  components: {
    StatusModifierExplaination,
    CustomModal,
    StatusEffectItem,
    TitleWidget,
    AddStatusEffectWidget
  }
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
      cursor: pointer;
    "
    :style="{
      fontFamily: designStore.font,
      background: designStore.inputBacking,
      color: designStore.inputText,
      borderColor: designStore.secondaryTheme
    }"
    @click="modal = !modal"
  >
    <div>Movespeeds:</div>
    <div
      style="display: flex"
      :style="{
        color: getColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-sprint"></v-icon></div>

      <div class="fullNames">Base:&nbsp;</div>
      <div>{{ props.base }}</div>
    </div>
    <div
      style="display: flex"
      :style="{
        color: getFlightColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-angel-wings"></v-icon></div>

      <div class="fullNames">Flight:&nbsp;</div>
      <div>{{ props.flight }}</div>
    </div>
    <div
      style="display: flex"
      :style="{
        color: getSwimColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-whale-tail"></v-icon></div>

      <div class="fullNames">Swim:&nbsp;</div>
      <div>{{ props.swimming }}</div>
    </div>
    <div
      style="display: flex"
      :style="{
        color: getClimbColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-gecko"></v-icon></div>

      <div class="fullNames">Climb:&nbsp;</div>
      <div>{{ props.climbing }}</div>
    </div>
    <div
      style="display: flex"
      :style="{
        color: getBurrowColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-dig-hole"></v-icon></div>

      <div class="fullNames">Burrow:&nbsp;</div>
      <div>{{ burrowing }}</div>
    </div>
    <CustomModal title="Modify MP " :showModal="modal" @close="modal = !modal">
      <template v-slot:body>
        <div
          style="font-size: x-large; text-align: center; margin-bottom: 0.25rem; margin-top: -1rem"
        >
          <v-icon scale="1.5" name="gi-sprint"></v-icon>
          {{ props.base }} &nbsp;
          <v-icon scale="1.5" name="gi-angel-wings"></v-icon>

          {{ props.flight }} &nbsp;
          <v-icon scale="1.5" name="gi-whale-tail"></v-icon>
          {{ props.swimming }} &nbsp;
          <v-icon scale="1.5" name="gi-gecko"></v-icon>

          {{ props.climbing }} &nbsp;
          <v-icon scale="1.5" name="gi-dig-hole"></v-icon>
          {{ props.burrowing }} &nbsp;
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: -1.5rem">
          <TitleWidget title="Status Modifiers" style="width: 100%"></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>
        <AddStatusEffectWidget
          :modifierType="modifierType"
          @added="(addedVal) => addMovespeedStatusModifier(addedVal)"
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
