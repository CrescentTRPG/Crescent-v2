<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'
import {
  BButton,
  BFormInput,
  BFormSelect,
  BInputGroup,
  BInputGroupText,
  BPopover
} from 'bootstrap-vue-next'
import { describe } from 'node:test'
import { Ref } from 'vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { useSkillStore } from '@/stores/skillsStore'
import { useEquipmentStore } from '@/stores/equipmentStore'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { totalAbilityPoints, currentHp, barrierHp, hpStatusModifiers, statusEffects } =
      storeToRefs(characterStore)
    const martialPerksStore = useMartialPerksStore()
    const { perkGain } = storeToRefs(martialPerksStore)
    const skillsStore = useSkillStore()
    const { skills } = storeToRefs(skillsStore)
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const damage: Ref<number> = ref(0)
    const dice: Ref<number> = ref(0)
    const heal: Ref<number> = ref(0)
    const barrier: Ref<number> = ref(0)
    const currentHpCopy = ref(currentHp.value)
    const currentBarrierCopy = ref(barrierHp.value)

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

    const modifierType = [
      'Rot',
      'Suffering',
      'Hp Regen',
      'Barrier Regen',
      'Modify Base Hp',
      'Override Base Hp'
    ]

    const damageType = ref('un-typed')

    function getPerkAndSkillGain() {
      const perks = perkGain.value
      let perkBonus = 0
      if (perks[0] == 'hitpoints') {
        perkBonus += 3
      }
      if (perks[1] == 'hitpoints') {
        perkBonus += 6
      }
      if (perks[2] == 'hitpoints') {
        perkBonus += 9
      }
      if (perks[3] == 'hitpoints') {
        perkBonus += 12
      }
      if (perks[4] == 'hitpoints') {
        perkBonus += 15
      }

      let skillBonus = skills.value['Fitness']?.skill ? skills.value['Fitness'].rank * 3 : 0
      return perkBonus + skillBonus
    }

    function getTotalColor() {
      if (
        hpStatusModifiers.value['Override Base Hp'] ||
        hpStatusModifiers.value['Modify Base Hp']
      ) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }

    function getBarrierColor() {
      if (hpStatusModifiers.value['Barrier Regen']) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }

    function getCurrentColor() {
      if (
        hpStatusModifiers.value['Rot'] ||
        hpStatusModifiers.value['Hp Regen'] ||
        hpStatusModifiers.value['Suffering'] ||
        statusEffects.value['Suffering']
      ) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }
    const totalHp: ComputedRef<number> = computed(() => {
      let ret = 0
      const level = Math.floor(totalAbilityPoints.value / 10)
      if (level < 3) {
        ret = 10 + level * 8
      } else if (level < 15) {
        ret = 34 + (level - 3) * 4
      } else if (level < 40) {
        ret = 82 + (level - 15) * 2
      } else {
        ret = Math.floor(152 + (level - 40) * 0.1)
      }
      ret += getPerkAndSkillGain()
      if (characterStore.traits['Bonus HP']) {
        ret += parseInt(characterStore.traits['Bonus HP'].number)
      }
      if (wornArmorPassives.value['Override Base Hp']) {
        ret = parseInt(wornArmorPassives.value['Override Base Hp'].modAmount)
      }
      if (primaryHandheldPassives.value['Override Base Hp']) {
        ret = parseInt(primaryHandheldPassives.value['Override Base Hp'].modAmount)
      }
      if (secondaryHandheldPassives.value['Override Base Hp']) {
        ret = parseInt(secondaryHandheldPassives.value['Override Base Hp'].modAmount)
      }
      if (hpStatusModifiers.value['Override Base Hp']) {
        let max = Object.values(hpStatusModifiers.value['Override Base Hp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          ret = max
        }
      }
      let modifier = -1000
      if (wornArmorPassives.value['Modify Base Hp']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Base Hp']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Base Hp']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Base Hp']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Base Hp']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Base Hp']?.modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }

      if (hpStatusModifiers.value['Modify Base Hp']) {
        let max = Object.values(hpStatusModifiers.value['Modify Base Hp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (currentHp.value > ret + modifier) {
        setNewCurrentHpValue(parseInt(ret + modifier + ''))
      }
      return Math.max(ret + modifier, 0)
    })

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(hpStatusModifiers.value)
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
      characterStore.addNewHpStatusModifier(statusObj)
    }

    function dealDamage() {
      let finalBarrier = barrierHp.value
      let finalCurrent = currentHp.value

      finalBarrier = finalBarrier - getRealDamageValue(damageType.value, damage.value)
      if (finalBarrier < 0) {
        finalCurrent += finalBarrier
        finalBarrier = 0
        console.log(finalBarrier)
      }
      characterStore.setCurrentAndBarrierHP(finalCurrent, finalBarrier)
    }

    function getRealDamageValue(damageType: string, damage: number) {
      if (damageType === 'Un-Typed') {
        return damage
      }
      let resistance =
        characterStore.traits[damageType + ' Resistance'] ||
        statusEffects.value[damageType + ' Resistance'] ||
        secondaryHandheldPassives.value[damageType + ' Resistance'] ||
        primaryHandheldPassives.value[damageType + ' Resistance'] ||
        wornArmorPassives.value[damageType + ' Resistance']
      let susceptibility =
        characterStore.traits[damageType + ' Susceptibility'] ||
        statusEffects.value[damageType + ' Susceptibility'] ||
        secondaryHandheldPassives.value[damageType + ' Susceptibility'] ||
        primaryHandheldPassives.value[damageType + ' Susceptibility'] ||
        wornArmorPassives.value[damageType + ' Susceptibility']
      let immunity =
        characterStore.traits[damageType + ' Immunity'] ||
        statusEffects.value[damageType + ' Immunity'] ||
        secondaryHandheldPassives.value[damageType + ' Immunity'] ||
        primaryHandheldPassives.value[damageType + ' Immunity'] ||
        wornArmorPassives.value[damageType + ' Immunity']
      let vulnerability =
        characterStore.traits[damageType + ' Vulnerability'] ||
        statusEffects.value[damageType + ' Vulnerability'] ||
        secondaryHandheldPassives.value[damageType + ' Vulnerability'] ||
        primaryHandheldPassives.value[damageType + ' Vulnerability'] ||
        wornArmorPassives.value[damageType + ' Vulnerability']
      let damageReduction =
        characterStore.traits[damageType + ' Damage Reduction'] ||
        statusEffects.value[damageType + ' Damage Reduction'] ||
        secondaryHandheldPassives.value[damageType + ' Damage Reduction'] ||
        primaryHandheldPassives.value[damageType + ' Damage Reduction'] ||
        wornArmorPassives.value[damageType + ' Damage Reduction']
      let damageAmplification =
        characterStore.traits[damageType + ' Damage Amplification'] ||
        statusEffects.value[damageType + ' Damage Amplification'] ||
        secondaryHandheldPassives.value[damageType + 'Damage Amplification'] ||
        primaryHandheldPassives.value[damageType + ' Damage Amplification'] ||
        wornArmorPassives.value[damageType + ' Damage Amplification']
      if (characterStore.statusEffects['Petrified']) {
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
          characterStore.traits['Elemental Resistance'] ||
          secondaryHandheldPassives.value[damageType + ' Elemental Resistance'] ||
          primaryHandheldPassives.value[damageType + ' Elemental Resistance'] ||
          wornArmorPassives.value[damageType + ' Elemental Resistance']
        susceptibility =
          susceptibility ||
          characterStore.traits['Elemental Susceptibility'] ||
          secondaryHandheldPassives.value[damageType + ' Elemental Susceptibility'] ||
          primaryHandheldPassives.value[damageType + ' Elemental Susceptibility'] ||
          wornArmorPassives.value[damageType + ' Elemental Susceptibility']
        immunity =
          immunity ||
          characterStore.traits['Elemental Immunity'] ||
          characterStore.statusEffects['Ethereal'] ||
          secondaryHandheldPassives.value[damageType + ' Elemental Immunity'] ||
          primaryHandheldPassives.value[damageType + ' Elemental Immunity'] ||
          wornArmorPassives.value[damageType + ' Elemental Immunity']
        vulnerability =
          vulnerability ||
          characterStore.traits['Elemental Vulnerability'] ||
          secondaryHandheldPassives.value[damageType + ' Elemental Vulnerability'] ||
          primaryHandheldPassives.value[damageType + ' Elemental Vulnerability'] ||
          wornArmorPassives.value[damageType + ' Elemental Vulnerability']
        damageReduction =
          damageReduction ||
          characterStore.traits['Elemental Damage Reduction'] ||
          secondaryHandheldPassives.value[damageType + ' Elemental Damage Reduction'] ||
          primaryHandheldPassives.value[damageType + ' Elemental Damage Reduction'] ||
          wornArmorPassives.value[damageType + ' Elemental Damage Reduction']
        damageAmplification =
          damageAmplification ||
          characterStore.traits['Elemental Damage Amplification'] ||
          secondaryHandheldPassives.value[damageType + ' Elemental Damage Amplification'] ||
          primaryHandheldPassives.value[damageType + ' Elemental Damage Amplification'] ||
          wornArmorPassives.value[damageType + ' Elemental Damage Amplification']
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
          characterStore.traits['Mundane Resistance'] ||
          secondaryHandheldPassives.value[damageType + ' Mundane Resistance'] ||
          primaryHandheldPassives.value[damageType + ' Mundane Resistance'] ||
          wornArmorPassives.value[damageType + ' Mundane Resistance']
        susceptibility =
          susceptibility ||
          characterStore.traits['Mundane Susceptibility'] ||
          secondaryHandheldPassives.value[damageType + ' Mundane Susceptibility'] ||
          primaryHandheldPassives.value[damageType + ' Mundane Susceptibility'] ||
          wornArmorPassives.value[damageType + ' Mundane Susceptibility']
        immunity =
          immunity ||
          characterStore.traits['Mundane Immunity'] ||
          characterStore.statusEffects['Ethereal'] ||
          secondaryHandheldPassives.value[damageType + ' Mundane Immunity'] ||
          primaryHandheldPassives.value[damageType + ' Mundane Immunity'] ||
          wornArmorPassives.value[damageType + ' Mundane Immunity']
        vulnerability =
          vulnerability ||
          characterStore.traits['Mundane Vulnerability'] ||
          secondaryHandheldPassives.value[damageType + ' Mundane Vulnerability'] ||
          primaryHandheldPassives.value[damageType + ' Mundane Vulnerability'] ||
          wornArmorPassives.value[damageType + ' Mundane Vulnerability']
        damageReduction =
          damageReduction ||
          characterStore.traits['Mundane Damage Reduction'] ||
          secondaryHandheldPassives.value[damageType + ' Mundane Damage Reduction'] ||
          primaryHandheldPassives.value[damageType + ' Mundane Damage Reduction'] ||
          wornArmorPassives.value[damageType + ' Mundane Damage Reduction']
        damageAmplification =
          damageAmplification ||
          characterStore.traits['Mundane Damage Amplification'] ||
          secondaryHandheldPassives.value[damageType + ' Mundane Damage Amplification'] ||
          primaryHandheldPassives.value[damageType + ' Mundane Damage Amplification'] ||
          wornArmorPassives.value[damageType + ' Mundane Damage Amplification']
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
      let finalCurrent = currentHp.value

      finalCurrent = finalCurrent - damage.value
      characterStore.setCurrentAndBarrierHP(finalCurrent, barrierHp.value)
    }
    function applyHeal() {
      let finalCurrent: number = currentHp.value

      finalCurrent = finalCurrent + parseInt(heal.value + '')
      if (finalCurrent > totalHp.value) {
        finalCurrent = totalHp.value
      }
      characterStore.setCurrentAndBarrierHP(finalCurrent, barrierHp.value)
    }
    function applyHealWithOvershield() {
      let finalCurrent = currentHp.value
      let finalBarrier = barrierHp.value

      finalCurrent = finalCurrent + parseInt(heal.value + '')
      if (finalCurrent > totalHp.value) {
        finalBarrier += finalCurrent - totalHp.value
        console.log(finalCurrent - totalHp.value, ' vibes')
        finalCurrent = totalHp.value
      }
      characterStore.setCurrentAndBarrierHP(finalCurrent, finalBarrier)
    }
    function applyBarrier() {
      let finalCurrent = currentHp.value
      let finalBarrier = barrierHp.value

      finalBarrier = finalBarrier + parseInt(barrier.value + '')

      characterStore.setCurrentAndBarrierHP(finalCurrent, finalBarrier)
    }
    function setNewCurrentBarrierValue() {
      let finalCurrent = currentHp.value

      characterStore.setCurrentAndBarrierHP(finalCurrent, parseInt(currentBarrierCopy.value + ''))
    }
    function setNewCurrentHpValue(val = currentHpCopy.value) {
      let finalBarrier = barrierHp.value

      characterStore.setCurrentAndBarrierHP(
        Math.min(parseInt(val + ''), totalHp.value),
        finalBarrier
      )
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      characterStore.removeHpStatusModifier({
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
      characterStore,
      totalHp,
      currentHp,
      barrierHp,
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
      hpStatusModifiers,
      statusModifiersList,
      getCurrentColor,
      getBarrierColor,
      getTotalColor,
      dice,
      wornArmorPassives,
      damageTypes
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
                {{ totalHp }}
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
          {{ currentHp }} Current with {{ barrierHp }} Barrier / {{ totalHp }} Total
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
