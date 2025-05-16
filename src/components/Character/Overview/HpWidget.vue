<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useUserStore } from '@/stores/userStore'
import CustomModal from '@/components/CustomModal.vue'
import { BButton, BFormInput, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
import { Ref, watch } from 'vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'

import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  props: [
    'setCurrentAndBarrier',
    'totalHp',
    'traits',
    'statusEffects',
    'hpStatusModifiers',
    'storeRef',
    'currentHp',
    'barrierHp',
    'wornArmorPassives',
    'secondaryHandheldPassives',
    'primaryHandheldPassives',
    'addNewHpStatusModifier',
    'removeHpStatusModifier'
  ],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const damage: Ref<number> = ref(0)
    const dice: Ref<number> = ref(0)
    const heal: Ref<number> = ref(0)
    const barrier: Ref<number> = ref(0)
    const currentHpCopy = ref(props.currentHp)
    const currentBarrierCopy = ref(props.barrierHp)
    const damageTypes = [
      'Un-typed',
      'Fire',
      'Ice',
      'Lightning',
      'Force',
      'Toxic',
      'Stress',
      'Piercing',
      'Edged',
      'Blunt',
      'Blight',
      'Divine',
      'Pure Magic'
    ]

    const modifierType = [
      'Rot',
      'Suffering',
      'Hp Regen',
      'Barrier Regen',
      'Modify Base Hp',
      'Override Base Hp'
    ]

    const damageType = ref('un-typed')

    function getTotalColor() {
      if (
        props.hpStatusModifiers['Override Base Hp'] ||
        props.hpStatusModifiers['Modify Base Hp']
      ) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }

    function getBarrierColor() {
      if (props.hpStatusModifiers['Barrier Regen']) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }

    function getCurrentColor() {
      if (
        props.hpStatusModifiers['Rot'] ||
        props.hpStatusModifiers['Hp Regen'] ||
        props.hpStatusModifiers['Suffering'] ||
        props.statusEffects['Suffering']
      ) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(props.hpStatusModifiers)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })
      console.log(ret)

      return ret
    })

    function addHpStatusModifier(addedVal: {
      selectedMod: string
      linkedStatus: string
      modAmount: number
      sufferingDamageType: string
    }) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount,
        sufferingDamageType: addedVal.sufferingDamageType
      }
      props.addNewHpStatusModifier(statusObj)
    }

    function dealDamage() {
      let finalBarrier = props.barrierHp
      let finalCurrent = props.currentHp

      finalBarrier = finalBarrier - getRealDamageValue(damageType.value, damage.value)
      if (finalBarrier < 0) {
        finalCurrent += finalBarrier
        finalBarrier = 0
        console.log(finalBarrier)
      }
      props.setCurrentAndBarrier(finalCurrent, finalBarrier)
    }

    function getRealDamageValue(damageType: string, damage: number) {
      if (damageType === 'Un-Typed') {
        return damage
      }
      let resistance =
        props.traits[damageType + ' Resistance'] ||
        props.statusEffects[damageType + ' Resistance'] ||
        props.secondaryHandheldPassives[damageType + ' Resistance'] ||
        props.primaryHandheldPassives[damageType + ' Resistance'] ||
        props.wornArmorPassives[damageType + ' Resistance']
      let susceptibility =
        props.traits[damageType + ' Susceptibility'] ||
        props.statusEffects[damageType + ' Susceptibility'] ||
        props.secondaryHandheldPassives[damageType + ' Susceptibility'] ||
        props.primaryHandheldPassives[damageType + ' Susceptibility'] ||
        props.wornArmorPassives[damageType + ' Susceptibility']
      let immunity =
        props.traits[damageType + ' Immunity'] ||
        props.statusEffects[damageType + ' Immunity'] ||
        props.secondaryHandheldPassives[damageType + ' Immunity'] ||
        props.primaryHandheldPassives[damageType + ' Immunity'] ||
        props.wornArmorPassives[damageType + ' Immunity']
      let vulnerability =
        props.traits[damageType + ' Vulnerability'] ||
        props.statusEffects[damageType + ' Vulnerability'] ||
        props.secondaryHandheldPassives[damageType + ' Vulnerability'] ||
        props.primaryHandheldPassives[damageType + ' Vulnerability'] ||
        props.wornArmorPassives[damageType + ' Vulnerability']
      let damageReduction =
        props.traits[damageType + ' Damage Reduction'] ||
        props.statusEffects[damageType + ' Damage Reduction'] ||
        props.secondaryHandheldPassives[damageType + ' Damage Reduction'] ||
        props.primaryHandheldPassives[damageType + ' Damage Reduction'] ||
        props.wornArmorPassives[damageType + ' Damage Reduction']
      let damageAmplification =
        props.traits[damageType + ' Damage Amplification'] ||
        props.statusEffects[damageType + ' Damage Amplification'] ||
        props.secondaryHandheldPassives[damageType + 'Damage Amplification'] ||
        props.primaryHandheldPassives[damageType + ' Damage Amplification'] ||
        props.wornArmorPassives[damageType + ' Damage Amplification']
      if (props.statusEffects['Petrified']) {
        if (
          damageType == 'Fire' ||
          damageType == 'Ice' ||
          damageType == 'Lightning' ||
          damageType == 'Force' ||
          damageType == 'Toxic' ||
          damageType == 'Piercing' ||
          damageType == 'Edged'
        ) {
          resistance = true
        }
      }
      if (
        damageType == 'Fire' ||
        damageType == 'Ice' ||
        damageType == 'Lightning' ||
        damageType == 'Force'
      ) {
        resistance =
          resistance ||
          props.traits['Elemental Resistance'] ||
          props.secondaryHandheldPassives[damageType + ' Elemental Resistance'] ||
          props.primaryHandheldPassives[damageType + ' Elemental Resistance'] ||
          props.wornArmorPassives[damageType + ' Elemental Resistance']
        susceptibility =
          susceptibility ||
          props.traits['Elemental Susceptibility'] ||
          props.secondaryHandheldPassives[damageType + ' Elemental Susceptibility'] ||
          props.primaryHandheldPassives[damageType + ' Elemental Susceptibility'] ||
          props.wornArmorPassives[damageType + ' Elemental Susceptibility']
        immunity =
          immunity ||
          props.traits['Elemental Immunity'] ||
          props.statusEffects['Ethereal'] ||
          props.secondaryHandheldPassives[damageType + ' Elemental Immunity'] ||
          props.primaryHandheldPassives[damageType + ' Elemental Immunity'] ||
          props.wornArmorPassives[damageType + ' Elemental Immunity']
        vulnerability =
          vulnerability ||
          props.traits['Elemental Vulnerability'] ||
          props.secondaryHandheldPassives[damageType + ' Elemental Vulnerability'] ||
          props.primaryHandheldPassives[damageType + ' Elemental Vulnerability'] ||
          props.wornArmorPassives[damageType + ' Elemental Vulnerability']
        damageReduction =
          damageReduction ||
          props.traits['Elemental Damage Reduction'] ||
          props.secondaryHandheldPassives[damageType + ' Elemental Damage Reduction'] ||
          props.primaryHandheldPassives[damageType + ' Elemental Damage Reduction'] ||
          props.wornArmorPassives[damageType + ' Elemental Damage Reduction']
        damageAmplification =
          damageAmplification ||
          props.traits['Elemental Damage Amplification'] ||
          props.secondaryHandheldPassives[damageType + ' Elemental Damage Amplification'] ||
          props.primaryHandheldPassives[damageType + ' Elemental Damage Amplification'] ||
          props.wornArmorPassives[damageType + ' Elemental Damage Amplification']
      }

      if (
        damageType == 'Toxic' ||
        damageType == 'Stress' ||
        damageType == 'Blunt' ||
        damageType == 'Piercing' ||
        damageType == 'Edged'
      ) {
        resistance =
          resistance ||
          props.traits['Mundane Resistance'] ||
          props.secondaryHandheldPassives[damageType + ' Mundane Resistance'] ||
          props.primaryHandheldPassives[damageType + ' Mundane Resistance'] ||
          props.wornArmorPassives[damageType + ' Mundane Resistance']
        susceptibility =
          susceptibility ||
          props.traits['Mundane Susceptibility'] ||
          props.secondaryHandheldPassives[damageType + ' Mundane Susceptibility'] ||
          props.primaryHandheldPassives[damageType + ' Mundane Susceptibility'] ||
          props.wornArmorPassives[damageType + ' Mundane Susceptibility']
        immunity =
          immunity ||
          props.traits['Mundane Immunity'] ||
          props.statusEffects['Ethereal'] ||
          props.secondaryHandheldPassives[damageType + ' Mundane Immunity'] ||
          props.primaryHandheldPassives[damageType + ' Mundane Immunity'] ||
          props.wornArmorPassives[damageType + ' Mundane Immunity']
        vulnerability =
          vulnerability ||
          props.traits['Mundane Vulnerability'] ||
          props.secondaryHandheldPassives[damageType + ' Mundane Vulnerability'] ||
          props.primaryHandheldPassives[damageType + ' Mundane Vulnerability'] ||
          props.wornArmorPassives[damageType + ' Mundane Vulnerability']
        damageReduction =
          damageReduction ||
          props.traits['Mundane Damage Reduction'] ||
          props.secondaryHandheldPassives[damageType + ' Mundane Damage Reduction'] ||
          props.primaryHandheldPassives[damageType + ' Mundane Damage Reduction'] ||
          props.wornArmorPassives[damageType + ' Mundane Damage Reduction']
        damageAmplification =
          damageAmplification ||
          props.traits['Mundane Damage Amplification'] ||
          props.secondaryHandheldPassives[damageType + ' Mundane Damage Amplification'] ||
          props.primaryHandheldPassives[damageType + ' Mundane Damage Amplification'] ||
          props.wornArmorPassives[damageType + ' Mundane Damage Amplification']
      }

      let damageAmp = 0
      let damageRed = 0

      if (damageAmplification) {
        damageAmp += dice.value * damageAmplification.number
      }
      if (damageReduction) {
        damageRed -= dice.value * damageReduction.number
      }
      if (immunity && !vulnerability) {
        return 0
      }
      if (vulnerability) {
        return damage * 2 + damageAmp
      }
      if (resistance && susceptibility) {
        return Math.max(damage + damageAmp + damageRed, 0)
      }
      if (resistance) {
        return Math.max(Math.floor(damage / 2) + damageAmp + damageRed, 0)
      }
      if (susceptibility) {
        console.log('damage', damage, damageAmp, damageRed)
        return Math.max(Math.floor(damage * 2) + damageAmp + damageRed, 0)
      }
      return Math.max(Math.floor(damage) + damageAmp + damageRed, 0)
    }

    function dealDamageIgnoreShield() {
      let finalCurrent = props.currentHp

      finalCurrent = finalCurrent - damage.value
      props.setCurrentAndBarrier(finalCurrent, props.barrierHp)
    }
    function applyHeal() {
      let finalCurrent: number = props.currentHp

      finalCurrent = finalCurrent + parseInt(heal.value + '')
      if (finalCurrent > props.totalHp) {
        finalCurrent = props.totalHp
      }
      props.setCurrentAndBarrier(finalCurrent, props.barrierHp)
    }
    function applyHealWithOvershield() {
      let finalCurrent = props.currentHp
      let finalBarrier = props.barrierHp

      finalCurrent = finalCurrent + parseInt(heal.value + '')
      if (finalCurrent > props.totalHp) {
        finalBarrier += finalCurrent - props.totalHp
        console.log(finalCurrent - props.totalHp, ' vibes')
        finalCurrent = props.totalHp
      }
      props.setCurrentAndBarrier(finalCurrent, finalBarrier)
    }
    function applyBarrier() {
      let finalCurrent = props.currentHp
      let finalBarrier = props.barrierHp

      finalBarrier = finalBarrier + parseInt(barrier.value + '')

      props.setCurrentAndBarrier(finalCurrent, finalBarrier)
    }
    function setNewCurrentBarrierValue() {
      let finalCurrent = props.currentHp

      props.setCurrentAndBarrier(finalCurrent, parseInt(currentBarrierCopy.value + ''))
    }
    function setNewCurrentHpValue(val = currentHpCopy.value) {
      let finalBarrier = props.barrierHp

      props.setCurrentAndBarrier(Math.min(parseInt(val + ''), props.totalHp), finalBarrier)
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      props.removeHpStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus,
        sufferingDamageType: 'no'
      })
    }
    return {
      removeModifier,
      designStore,
      modal,
      userStore,
      damage,
      heal,
      damageType,
      modifierType,
      dealDamage,
      dealDamageIgnoreShield,
      applyHeal,
      applyHealWithOvershield,
      barrier,
      applyBarrier,
      currentHpCopy,
      currentBarrierCopy,
      setNewCurrentBarrierValue,
      setNewCurrentHpValue,
      addHpStatusModifier,
      statusModifiersList,
      getCurrentColor,
      getBarrierColor,
      getTotalColor,
      dice,
      damageTypes,
      props
    }
  },
  components: {
    CustomModal,
    BFormInput,
    BInputGroup,
    BFormSelect,
    BButton,
    StatusModifierExplaination,
    TitleWidget,
    StatusEffectItem,
    AddStatusEffectWidget
  }
}
</script>

<template>
  <div
    style="width: 13.5rem; height: 10rem"
    :style="{ fontFamily: designStore.font }"
    @click="modal = !modal"
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
      <i class="bi bi-heart-fill"></i>
    </div>
    <div
      style="
        position: absolute;
        font-size: 10rem;
        z-index: 4;
        margin-left: 1.5rem;
        margin-top: -2rem;
        transform: scale(1.05, 1);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <i class="bi bi-heart-fill"></i>
    </div>
    <div class="heartTxt">
      <div style="display: flex; flex-direction: column; margin-top: 0.75rem">
        <div style="display: flex; flex-direction: row">
          <div
            style="
              width: 50%;
              display: flex;
              flex-direction: row;
              justify-content: flex-end;
              position: relative;
              right: 1rem;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-self: center;
                margin-bottom: 0.75rem;
                font-size: xx-large;
              "
              :style="{ color: getCurrentColor() }"
            >
              <div style="align-self: center; margin: 0.5rem; margin-bottom: -1rem" class="bigText">
                {{ currentHp }}
              </div>
              <div style="align-self: center; font-size: 0.75rem" class="liltext">Current</div>
            </div>
          </div>
          <div style="display: flex; justify-content: center; position: absolute; width: 100%">
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
          </div>
          <div
            style="
              width: 50%;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
              position: relative;
              left: 1rem;
            "
          >
            <div
              style="
                display: flex;
                flex-direction: column;
                align-self: center;
                margin-bottom: 0.75rem;
                font-size: xx-large;
              "
              :style="{ color: getTotalColor() }"
            >
              <div style="align-self: center; margin: 0.5rem; margin-bottom: -1rem" class="bigText">
                {{ props.totalHp }}
              </div>
              <div style="align-self: center; font-size: 0.75rem" class="liltext">Total</div>
            </div>
          </div>
        </div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 2.25rem; align-self: center; margin-top: -1rem"
        >
          HP
        </div>
      </div>
    </div>
    <div
      style="position: relative; z-index: 5; top: 4rem; left: 0rem; transform: scale(1.1, 1)"
      :style="{ color: getBarrierColor() }"
    >
      <div style="position: absolute; z-index: 6">
        <v-icon
          name="gi-hearts"
          scale="2.9"
          style="
            position: relative;
            top: 1.1rem;
            left: 0.95rem;
            z-index: 4;
            transform: scale(1, 0.95);
          "
          :style="{ color: designStore.primaryTheme }"
        ></v-icon>
      </div>

      <div style="position: absolute; z-index: 5">
        <v-icon
          name="gi-heart-shield"
          scale="3.9"
          style="position: relative; top: 0.35rem; left: 0.35rem; z-index: 4"
          :style="{ color: designStore.primaryTheme }"
        ></v-icon>
      </div>

      <v-icon name="gi-heart-shield" scale="4.5" style="position: relative; z-index: 5"></v-icon>
      <div
        style="
          position: relative;
          z-index: 6;
          width: 4rem;
          height: 3rem;
          left: 0.7rem;
          bottom: 3.6rem;
          display: flex;
          justify-content: center;
          font-size: x-large;
        "
        :style="{ color: designStore.primaryText }"
        id="mememememe"
      >
        <div style="z-index: 6; width: min-content; position: absolute">
          {{ barrierHp }}
        </div>
      </div>
    </div>
    <CustomModal title="Modify HP" :showModal="modal" @close="modal = !modal">
      <template v-slot:body>
        <div
          style="font-size: x-large; text-align: center; margin-top: -1rem; margin-bottom: 0.25rem"
        >
          {{ currentHp }} Current with {{ barrierHp }} Barrier / {{ props.totalHp }} Total
        </div>
        <TitleWidget
          class="expandingInput"
          title="Modify Values"
          style="margin-top: -1rem"
        ></TitleWidget>

        <div class="damageInput" :style="{ background: designStore.primaryTheme }">
          <div style="display: flex; width: 100%">
            <div style="display: flex; flex-direction: column" class="infoHeader">
              <div style="flex-grow: 1; padding-left: 2.5%; display: flex; width: min-content">
                <div style="align-self: end; width: min-content">Damage</div>
              </div>
              <BFormInput
                class="rightField"
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  borderColor: designStore.secondaryTheme
                }"
                type="number"
                min="0"
                v-model="damage"
              ></BFormInput>
            </div>
            <div style="display: flex; flex-direction: column" class="infoHeader">
              <div style="flex-grow: 1; padding-left: 2.5%; display: flex">
                <div style="align-self: end; padding-left: 0.25rem">Damage Type</div>
              </div>
              <BFormSelect
                v-model="damageType"
                :options="damageTypes"
                class="damageType"
                :style="{
                  color: designStore.inputText,
                  background: designStore.inputBacking,
                  borderColor: designStore.secondaryTheme
                }"
              ></BFormSelect>
            </div>
            <div style="display: flex; flex-direction: column" class="infoHeader">
              <div style="flex-grow: 1; padding-left: 2.5%"># Damage Dice</div>
              <BFormInput
                :style="{
                  color: designStore.inputText,
                  background: designStore.inputBacking,
                  borderColor: designStore.secondaryTheme
                }"
                class="damageDice"
                v-model="dice"
                placeholder="# Damage Dice"
                type="number"
                min="0"
              ></BFormInput>
            </div>
          </div>
          <div style="display: flex; width: 100%">
            <BButton
              class="leftDamageButton"
              :style="{ borderColor: designStore.secondaryTheme }"
              @click="dealDamage()"
              >Damage</BButton
            >
            <BButton
              class="rightDamageButton"
              :style="{ borderColor: designStore.secondaryTheme }"
              @click="dealDamageIgnoreShield()"
              ><span style="display: flex; justify-content: center">
                Damage Ignore<v-icon
                  class="superMobile"
                  name="gi-heart-shield"
                  style="font-size: large"
                ></v-icon>
                <span class="norm">&nbsp;Barrier</span></span
              ></BButton
            >
          </div>
        </div>
        <div class="expandingInput">
          <BInputGroup
            style="border: 2px solid; border-radius: 10px; margin-bottom: 1rem"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme
            }"
          >
            <BFormInput
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
              type="number"
              min="0"
              v-model="heal"
            ></BFormInput>
            <BButton
              style="width: 5rem; padding-top: 0.5rem; padding-left: 0.5rem"
              @click="applyHeal()"
              >Heal</BButton
            >
            <BButton
              style="
                width: 5.5rem;
                padding-top: 0.5rem;
                padding-left: 0.5rem;
                border-left: 1px solid;
              "
              :style="{ borderColor: designStore.secondaryTheme }"
              @click="applyHealWithOvershield()"
            >
              Overheal</BButton
            >
          </BInputGroup>
        </div>
        <div class="expandingInput">
          <BInputGroup
            style="border: 3px solid; border-radius: 10px; margin-bottom: 1rem"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme
            }"
          >
            <BFormInput
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
              type="number"
              min="0"
              v-model="barrier"
            ></BFormInput>

            <BButton
              style="
                width: 10.5rem;
                padding-top: 0.5rem;
                padding-left: 0.5rem;
                border-left: 1px solid;
              "
              :style="{ borderColor: designStore.secondaryTheme }"
              @click="applyBarrier()"
              >Apply Barrier</BButton
            >
          </BInputGroup>
        </div>
        <TitleWidget
          class="expandingInput"
          title="Override Values"
          style="margin-top: -1rem"
        ></TitleWidget>
        <div class="expandingInput">
          <BInputGroup
            style="border: 2px solid; border-radius: 10px; margin-bottom: 1rem"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme
            }"
          >
            <BFormInput
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
              type="number"
              min="0"
              v-model="currentHpCopy"
            ></BFormInput>

            <BButton
              style="
                width: 10.5rem;
                padding-top: 0.5rem;
                padding-left: 0.5rem;
                border-left: 1px solid;
              "
              :style="{ borderColor: designStore.secondaryTheme }"
              @click="setNewCurrentHpValue()"
              >Set Current Hp</BButton
            >
          </BInputGroup>
        </div>
        <div class="expandingInput">
          <BInputGroup
            style="border: 3px solid; border-radius: 10px; margin-bottom: 1rem"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme
            }"
          >
            <BFormInput
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
              type="number"
              min="0"
              v-model="currentBarrierCopy"
            ></BFormInput>

            <BButton
              style="
                width: 10.5rem;
                padding-top: 0.5rem;
                padding-left: 0.5rem;
                border-left: 1px solid;
              "
              :style="{ borderColor: designStore.secondaryTheme }"
              @click="setNewCurrentBarrierValue()"
              >Set Barrier Hp</BButton
            >
          </BInputGroup>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: -2rem">
          <TitleWidget
            class="expandingInput"
            title="Status Modifiers"
            style="width: 100%"
          ></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>

        <AddStatusEffectWidget
          class="expandingInput"
          :modifierType="modifierType"
          @added="(addedVal) => addHpStatusModifier(addedVal)"
        ></AddStatusEffectWidget>
        <div v-for="mod in statusModifiersList" :key="mod">
          <StatusEffectItem
            v-if="mod.modifierType == 'Suffering'"
            @delete="removeModifier(mod.modifierType, mod.modAmount, mod.linkedStatus)"
            :modifierType="mod.modifierType"
            :modAmount="mod.modAmount"
            :linkedStatus="mod.linkedStatus"
            :unlockableCondition="mod.sufferingDamageType"
          ></StatusEffectItem>
          <StatusEffectItem
            v-else
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
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
.num {
  width: 5rem;
  border-radius: 0;
}
.damageInput {
  border-radius: 10px;
  margin-bottom: 1rem;
  display: flex;
}
.damageType {
  min-width: 9rem;
  border-radius: 0;
  border: 2px solid;
  border-right: 1px solid;
  border-left: 1px solid;
}
.damageDice {
  min-width: 5rem;
  border-radius: 0;
  border: 2px solid;
  border-right: 1px solid;
  border-left: 1px solid;
}
.rightField {
  border: 2px solid;
  border-right: 0px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.leftDamageButton {
  min-width: 5rem;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  border: 2px solid;
  border-left: 1px solid;
  border-right: 0px solid;
  text-align: center;
  border-radius: 0;
  max-height: 2.5rem;
  align-self: end;
}
.rightDamageButton {
  border: 2px solid;
  padding-top: 0.5rem;
  padding-left: 0.5rem;
  border-left: 1px solid;
  width: 12.5rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  max-height: 2.5rem;
  align-self: end;
  flex-grow: 1;
  min-width: 9rem;
}
.superMobile {
  display: none;
}
.infoHeader {
  flex-grow: 1;
}
@media (max-width: 950px) {
  .damageInput {
    flex-wrap: wrap;
  }
  .rightField {
    border-bottom-left-radius: 0;
  }
  .leftDamageButton {
    min-width: 5rem;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    border-radius: 0;
    flex-grow: 1;
    border: 2px solid;
    border-top: 0;
    border-right: 0px solid;
    border-bottom-left-radius: 0.375rem;
    text-align: center;
    max-height: 2.5rem;
    align-self: end;
  }
  .rightDamageButton {
    border-top: 0;
    border-top-right-radius: 0rem;
    min-width: 8rem;
  }
  .damageType {
    max-width: 15rem;
  }
  @media (max-width: 720px) {
    .liltext {
      display: none;
    }
    .bigText {
      font-size: 2.5rem;
    }
    .damageType {
      max-width: 15rem;
    }
    .rightField {
      border-bottom-left-radius: 0;
    }
    .buttonSpacers {
      display: none;
    }
    .infoHeader {
      font-size: small;
    }

    @media (max-width: 600px) {
      .heart {
        margin-left: -5rem;
      }
      .damageType {
        min-width: 7.25rem;
        font-size: small;
      }
      .rightField {
        font-size: small;

        border-bottom-left-radius: 0;
      }
      .damageDice {
        min-width: 3.5rem;
        font-size: small;
      }

      @media (max-width: 550px) {
        .damageInput {
          margin-left: -1rem;
          margin-right: -1rem;
        }
        .expandingInput {
          margin-left: -1rem;
          margin-right: -1rem;
        }
      }
      .superMobile {
        display: block;
      }
      .norm {
        display: none;
      }
      .infoHeader {
        text-align: center;
      }
    }
  }
}
</style>
