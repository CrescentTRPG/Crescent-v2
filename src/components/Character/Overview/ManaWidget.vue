<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useUserStore } from '@/stores/userStore'

import CustomModal from '@/components/CustomModal.vue'
import { BFormInput, BInputGroup } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'
import BasicInput from '../BasicInput.vue'

export default {
  props: [
    'setCurrentMana',
    'wornArmorPassives',
    'secondaryHandheldPassives',
    'primaryHandheldPassives',
    'traits',
    'manaStatusModifiers',
    'currentMana',
    'totalMana',
    'addNewManaStatusModifier',
    'removeManaStatusModifier',
    'customStatusEffects',
    'isEditing',
    'setMana'
  ],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const manaMod = ref(0)
    const modifierType = ['mana regen', 'modify base mana', 'override base mana']
    const currentManaCopy = ref(props.currentMana)

    function addManaStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount
      }

      props.addNewManaStatusModifier(statusObj)
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      props.removeManaStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }

    function getColor() {
      if (
        props.manaStatusModifiers['override base mana'] ||
        props.manaStatusModifiers['modify base mana']
      ) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }

    function getCurrentColor() {
      if (props.manaStatusModifiers['mana regen']) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(props.manaStatusModifiers)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })

      return ret
    })

    const statuses: ComputedRef = computed(() => {
      let ret = ['']
      return ret.concat(Object.keys(props.customStatusEffects))
    })

    function gainMana() {
      const finalMana = props.currentMana + parseInt(manaMod.value + '')
      props.setCurrentMana(Math.min(finalMana, props.totalMana))
    }

    function loseMana() {
      const finalMana = props.currentMana - manaMod.value
      props.setCurrentMana(finalMana)
    }

    function setNewCurrentValue(mana = currentManaCopy.value) {
      props.setCurrentMana(Math.min(parseInt(mana + ''), props.totalMana))
    }
    function showModal() {
      modal.value = true
    }

    return {
      removeModifier,
      addManaStatusModifier,
      statusModifiersList,
      designStore,
      modal,
      userStore,
      manaMod,
      currentManaCopy,
      statuses,
      modifierType,
      gainMana,
      loseMana,
      setNewCurrentValue,
      showModal,
      getColor,
      getCurrentColor,
      props
    }
  },
  components: {
    CustomModal,
    BInputGroup,
    BFormInput,
    BButton,
    StatusModifierExplaination,
    TitleWidget,
    StatusEffectItem,
    AddStatusEffectWidget,
    BasicInput
  }
}
</script>

<template>
  <div
    class="hoverableIconOnSidebar"
    style="width: 13.5rem; height: 10rem; margin-top: -1rem"
    :style="{ fontFamily: designStore.font }"
    @click="showModal()"
  >
    <div
      style="
        position: absolute;
        font-size: 9rem;
        z-index: 5;
        margin-left: 2rem;
        margin-top: -1.5rem;
        transform: scale(1.2, 1);
      "
      :style="{ color: designStore.primaryTheme }"
    >
      <i class="bi bi-book-fill"></i>
    </div>
    <div
      style="
        position: absolute;
        font-size: 10rem;
        z-index: 4;
        margin-left: 1.5rem;
        margin-top: -2rem;
        transform: scale(1.1, 1);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <i class="bi bi-book-fill"></i>
    </div>

    <div class="manaTxt">
      <div style="display: flex; flex-direction: column; margin-top: 0.75rem">
        <div style="display: flex; flex-direction: row; justify-content: center">
          <div style="display: flex; flex-direction: column" :style="{ color: getCurrentColor() }">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
            >
              <div style="display: flex" class="bigText">{{ currentMana }}</div>
            </div>
            <div style="align-self: center; font-size: 0.75rem" class="liltext">Current</div>
          </div>
          <i
            class="bi bi-slash-lg"
            style="
              align-self: center;
              font-size: 3rem;
              transform: skew(25deg);
              margin-right: -0.75rem;
              margin-left: -0.5rem;
            "
            :style="{ color: designStore.secondaryTheme }"
          ></i>
          <div style="display: flex; flex-direction: column" :style="{ color: getColor() }">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
            >
              <div style="display: flex" class="bigText">{{ totalMana }}</div>
            </div>
            <div style="align-self: center; font-size: 0.75rem" class="liltext">Total</div>
          </div>
        </div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 2.25rem; align-self: center; margin-top: -1rem"
        >
          Mana
        </div>
      </div>
    </div>
    <CustomModal
      v-if="!props.isEditing"
      title="Modify Mana"
      :showModal="modal"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <div
          style="font-size: x-large; text-align: center; margin-top: -1rem; margin-bottom: 0.25rem"
        >
          {{ currentMana }} Current / {{ totalMana }} Total
        </div>
        <TitleWidget title="Modify Values" style="margin-top: -1.5rem"></TitleWidget>

        <BInputGroup
          style="border: 2px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="0"
            v-model="manaMod"
          ></BFormInput>

          <BButton
            style="width: 5rem; padding-top: 0.5rem; padding-left: 0.5rem"
            @click="gainMana()"
            >Gain</BButton
          >
          <BButton
            style="padding-top: 0.5rem; padding-left: 0.5rem; border-left: 1px solid; width: 5.5rem"
            :style="{ borderColor: designStore.secondaryTheme }"
            @click="loseMana()"
            >Lose</BButton
          >
        </BInputGroup>
        <TitleWidget title="Override Values" style="margin-top: -1rem"></TitleWidget>

        <BInputGroup
          style="border: 2px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="0"
            v-model="currentManaCopy"
          ></BFormInput>

          <BButton
            style="
              width: 10.5rem;
              padding-top: 0.5rem;
              padding-left: 0.5rem;
              border-left: 1px solid;
            "
            :style="{ borderColor: designStore.secondaryTheme }"
            @click="setNewCurrentValue()"
            >Set New Value</BButton
          >
        </BInputGroup>
        <div style="display: flex; justify-content: space-between; margin-top: -2rem">
          <TitleWidget title="Status Modifiers" style="width: 100%"></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>

        <AddStatusEffectWidget
          :modifierType="modifierType"
          @added="(addedVal) => addManaStatusModifier(addedVal)"
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
    <CustomModal
      v-if="props.isEditing"
      title="Modify Mana"
      :showModal="modal"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <BasicInput
          style="margin-bottom: 1rem"
          label="Total Mana"
          type="number"
          :value="props.totalMana"
          :min="0"
          :max="999"
          @newValue="(val) => props.setMana(props.currentMana, val)"
        ></BasicInput>
        <BasicInput
          label="Current Mana"
          type="number"
          :value="props.currentMana"
          :min="0"
          :max="999"
          @newValue="(val) => props.setMana(val, props.totalMana)"
        ></BasicInput>
      </template>
    </CustomModal>
  </div>
</template>

<style scoped>
.manaTxt {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
@media (max-width: 600px) {
}
@media (max-width: 700px) {
  .liltext {
    display: none;
  }
  .bigText {
    font-size: 2.5rem;
  }
}
</style>
