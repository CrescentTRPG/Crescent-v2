<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import CustomModal from '@/components/CustomModal.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useEquipmentStore } from '@/stores/equipmentStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import BasicInput from '../BasicInput.vue'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import AddStatusModifierModal from './AddStatusModifierModal.vue'
import GuideMessage from '@/components/GuideMessage.vue'

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
    'isSlowed',
    'isEditing',
    'updateSpeeds'
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
    const isHidden = ref(false)

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
      props,
      isHidden
    }
  },
  components: {
    CustomModal,
    StatusEffectItem,
    AddStatusModifierModal,
    BasicInput,
    GuideMessage
  }
}
</script>

<template>
  <div>
    <GuideMessage
      :step="14"
      style="position: absolute; margin-top: 0rem; margin-left: 10rem"
      title="Movespeed"
      orientation="bottom"
      guideNumber="14"
      message="Most characters have a base movespeed of 30 feet.  As in, one movement action allows you to move 30 feet.  This widget allows you to see your current movespeed including any temporary modifiers applied by status effects or permanent ones applied by traits."
    ></GuideMessage>
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
      class="inputColorBackdrop"
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
      <CustomModal
        :is-hidden="isHidden"
        v-if="!props.isEditing"
        title="Modify Movespeeds "
        :showModal="modal"
        @close="modal = !modal"
      >
        <template v-slot:body>
          <div
            style="
              font-size: x-large;
              text-align: center;
              margin-bottom: 0.25rem;
              margin-top: -1rem;
            "
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

          <AddStatusModifierModal
            :modify-is-hidden="(val) => (isHidden = val)"
            :modifiers="modifierType"
            modifierType="Movespeed"
            @added="(val) => addMovespeedStatusModifier(val)"
          ></AddStatusModifierModal>

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
      <CustomModal
        v-if="props.isEditing"
        title="Modify Movespeeds"
        :showModal="modal"
        @close="modal = !modal"
      >
        <template v-slot:body>
          <BasicInput
            style="margin-bottom: 0.5rem"
            label="Base Speed"
            type="number"
            :value="props.base"
            :min="0"
            :max="999"
            @newValue="
              (val) =>
                props.updateSpeeds(
                  val,
                  props.flight,
                  props.swimming,
                  props.climbing,
                  props.burrowing
                )
            "
          ></BasicInput>
          <BasicInput
            style="margin-bottom: 0.5rem"
            label="Flight Speed"
            type="number"
            :value="props.flight"
            :min="0"
            :max="999"
            @newValue="
              (val) =>
                props.updateSpeeds(props.base, val, props.swimming, props.climbing, props.burrowing)
            "
          ></BasicInput>
          <BasicInput
            style="margin-bottom: 0.5rem"
            label="Swim Speed"
            type="number"
            :value="props.swimming"
            :min="0"
            :max="999"
            @newValue="
              (val) =>
                props.updateSpeeds(props.base, props.flight, val, props.climbing, props.burrowing)
            "
          ></BasicInput>
          <BasicInput
            style="margin-bottom: 0.5rem"
            label="Climbing Speed"
            type="number"
            :value="props.climbing"
            :min="0"
            :max="999"
            @newValue="
              (val) =>
                props.updateSpeeds(props.base, props.flight, props.swimming, val, props.burrowing)
            "
          ></BasicInput>
          <BasicInput
            label="Burrow Speed"
            type="number"
            :value="props.burrowing"
            :min="0"
            :max="999"
            @newValue="
              (val) =>
                props.updateSpeeds(props.base, props.flight, props.swimming, props.climbing, val)
            "
          ></BasicInput>
        </template>
      </CustomModal>
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
