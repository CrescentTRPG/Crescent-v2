<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import CustomModal from '@/components/CustomModal.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BFormInput, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
import { Ref } from 'vue'
import StatusEffectItem from './StatusEffectItem.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'

import AddStatusEffectWidget from './AddStatusEffectWidget.vue'
import BDropdown from 'bootstrap-vue-next/src/components/BDropdown/BDropdown.vue'
import BDropdownItem from 'bootstrap-vue-next/src/components/BDropdown/BDropdownItem.vue'
import BDropdownDivider from 'bootstrap-vue-next/src/components/BDropdown/BDropdownDivider.vue'
import AddStatusModifierModal from './AddStatusModifierModal.vue'

export default {
  props: [
    'setCurrentAndBarrier',
    'totalHp',
    'traits',
    'statusEffects',
    'hpStatusModifiers',
    'currentHp',
    'barrierHp',
    'wornArmorPassives',
    'secondaryHandheldPassives',
    'primaryHandheldPassives',
    'addNewHpStatusModifier',
    'removeHpStatusModifier',
    'setHp',
    'modal',
    'setModal',
    'restirictedMode'
  ],
  setup(props, context) {
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

    const modifierValueTypesChoice = ref('Un-typed Damage')

    const modifiers = [
      'Rot',
      'Suffering',
      'Hp Regen',
      'Barrier Regen',
      'Modify Base Hp',
      'Override Base Hp'
    ]

    const damageType = ref('un-typed')

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(props.hpStatusModifiers)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })

      return ret
    })

    const hasDRorDA = computed(() => {
      switch (modifierValueTypesChoice.value) {
        case 'Fire Damage':
        case 'Fire Damage (Ignore Barrier)':
          return (
            props.traits['Fire Damage Amplification'] ||
            props.statusEffects['Fire Damage Amplification'] ||
            props.secondaryHandheldPassives['Fire Damage Amplification'] ||
            props.primaryHandheldPassives['Fire Damage Amplification'] ||
            props.wornArmorPassives['Fire Damage Amplification'] ||
            props.traits['Fire Damage Amplification'] ||
            props.statusEffects['Fire Damage Reduction'] ||
            props.secondaryHandheldPassives['Fire Damage Reduction'] ||
            props.primaryHandheldPassives['Fire Damage Reduction'] ||
            props.wornArmorPassives['Fire Damage Reduction'] ||
            props.traits['Elemental Damage Reduction'] ||
            props.statusEffects['Elemental Damage Reduction'] ||
            props.secondaryHandheldPassives['Elemental Damage Reduction'] ||
            props.primaryHandheldPassives['Elemental Damage Reduction'] ||
            props.wornArmorPassives['Elemental Damage Reduction'] ||
            props.traits['Elemental Damage Amplification'] ||
            props.statusEffects['Elemental Damage Amplification'] ||
            props.secondaryHandheldPassives['Elemental Damage Amplification'] ||
            props.primaryHandheldPassives['Elemental Damage Amplification'] ||
            props.wornArmorPassives['Elemental Damage Amplification']
          )
        case 'Ice Damage':
        case 'Ice Damage (Ignore Barrier)':
          return (
            props.traits['Ice Damage Reduction'] ||
            props.statusEffects['Ice Damage Reduction'] ||
            props.secondaryHandheldPassives['Ice Damage Reduction'] ||
            props.primaryHandheldPassives['Ice Damage Reduction'] ||
            props.wornArmorPassives['Ice Damage Reduction'] ||
            props.traits['Elemental Damage Reduction'] ||
            props.statusEffects['Elemental Damage Reduction'] ||
            props.secondaryHandheldPassives['Elemental Damage Reduction'] ||
            props.primaryHandheldPassives['Elemental Damage Reduction'] ||
            props.wornArmorPassives['Elemental Damage Reduction'] ||
            props.traits['Ice Damage Amplification'] ||
            props.statusEffects['Ice Damage Amplification'] ||
            props.secondaryHandheldPassives['Ice Damage Amplification'] ||
            props.primaryHandheldPassives['Ice Damage Amplification'] ||
            props.wornArmorPassives['Ice Damage Amplification'] ||
            props.traits['Elemental Damage Amplification'] ||
            props.statusEffects['Elemental Damage Amplification'] ||
            props.secondaryHandheldPassives['Elemental Damage Amplification'] ||
            props.primaryHandheldPassives['Elemental Damage Amplification'] ||
            props.wornArmorPassives['Elemental Damage Amplification']
          )
        case 'Lightning Damage':
        case 'Lightning Damage (Ignore Barrier)':
          return (
            props.traits['Lightning Damage Reduction'] ||
            props.statusEffects['Lightning Damage Reduction'] ||
            props.secondaryHandheldPassives['Lightning Damage Reduction'] ||
            props.primaryHandheldPassives['Lightning Damage Reduction'] ||
            props.wornArmorPassives['Lightning Damage Reduction'] ||
            props.traits['Elemental Damage Reduction'] ||
            props.statusEffects['Elemental Damage Reduction'] ||
            props.secondaryHandheldPassives['Elemental Damage Reduction'] ||
            props.primaryHandheldPassives['Elemental Damage Reduction'] ||
            props.wornArmorPassives['Elemental Damage Reduction'] ||
            props.traits['Lightning Damage Amplification'] ||
            props.statusEffects['Lightning Damage Amplification'] ||
            props.secondaryHandheldPassives['Lightning Damage Amplification'] ||
            props.primaryHandheldPassives['Lightning Damage Amplification'] ||
            props.wornArmorPassives['Lightning Damage Amplification'] ||
            props.traits['Elemental Damage Amplification'] ||
            props.statusEffects['Elemental Damage Amplification'] ||
            props.secondaryHandheldPassives['Elemental Damage Amplification'] ||
            props.primaryHandheldPassives['Elemental Damage Amplification'] ||
            props.wornArmorPassives['Elemental Damage Amplification']
          )
        case 'Force Damage':
        case 'Force Damage (Ignore Barrier)':
          return (
            props.traits['Force Damage Reduction'] ||
            props.statusEffects['Force Damage Reduction'] ||
            props.secondaryHandheldPassives['Force Damage Reduction'] ||
            props.primaryHandheldPassives['Force Damage Reduction'] ||
            props.wornArmorPassives['Force Damage Reduction'] ||
            props.traits['Elemental Damage Reduction'] ||
            props.statusEffects['Elemental Damage Reduction'] ||
            props.secondaryHandheldPassives['Elemental Damage Reduction'] ||
            props.primaryHandheldPassives['Elemental Damage Reduction'] ||
            props.wornArmorPassives['Elemental Damage Reduction'] ||
            props.traits['Force Damage Amplification'] ||
            props.statusEffects['Force Damage Amplification'] ||
            props.secondaryHandheldPassives['Force Damage Amplification'] ||
            props.primaryHandheldPassives['Force Damage Amplification'] ||
            props.wornArmorPassives['Force Damage Amplification'] ||
            props.traits['Elemental Damage Amplification'] ||
            props.statusEffects['Elemental Damage Amplification'] ||
            props.secondaryHandheldPassives['Elemental Damage Amplification'] ||
            props.primaryHandheldPassives['Elemental Damage Amplification'] ||
            props.wornArmorPassives['Elemental Damage Amplification']
          )
        case 'Blunt Damage':
        case 'Blunt Damage (Ignore Barrier)':
          return (
            props.traits['Blunt Damage Reduction'] ||
            props.statusEffects['Blunt Damage Reduction'] ||
            props.secondaryHandheldPassives['Blunt Damage Reduction'] ||
            props.primaryHandheldPassives['Blunt Damage Reduction'] ||
            props.wornArmorPassives['Blunt Damage Reduction'] ||
            props.traits['Mundane Damage Reduction'] ||
            props.statusEffects['Mundane Damage Reduction'] ||
            props.secondaryHandheldPassives['Mundane Damage Reduction'] ||
            props.primaryHandheldPassives['Mundane Damage Reduction'] ||
            props.wornArmorPassives['Mundane Damage Reduction'] ||
            props.traits['Blunt Damage Amplification'] ||
            props.statusEffects['Blunt Damage Amplification'] ||
            props.secondaryHandheldPassives['Blunt Damage Amplification'] ||
            props.primaryHandheldPassives['Blunt Damage Amplification'] ||
            props.wornArmorPassives['Blunt Damage Amplification'] ||
            props.traits['Mundane Damage Amplification'] ||
            props.statusEffects['Mundane Damage Amplification'] ||
            props.secondaryHandheldPassives['Mundane Damage Amplification'] ||
            props.primaryHandheldPassives['Mundane Damage Amplification'] ||
            props.wornArmorPassives['Mundane Damage Amplification']
          )
        case 'Edged Damage':
        case 'Edged Damage (Ignore Barrier)':
          return (
            props.traits['Edged Damage Reduction'] ||
            props.statusEffects['Edged Damage Reduction'] ||
            props.secondaryHandheldPassives['Edged Damage Reduction'] ||
            props.primaryHandheldPassives['Edged Damage Reduction'] ||
            props.wornArmorPassives['Edged Damage Reduction'] ||
            props.traits['Mundane Damage Reduction'] ||
            props.statusEffects['Mundane Damage Reduction'] ||
            props.secondaryHandheldPassives['Mundane Damage Reduction'] ||
            props.primaryHandheldPassives['Mundane Damage Reduction'] ||
            props.wornArmorPassives['Mundane Damage Reduction'] ||
            props.traits['Edged Damage Amplification'] ||
            props.statusEffects['Edged Damage Amplification'] ||
            props.secondaryHandheldPassives['Edged Damage Amplification'] ||
            props.primaryHandheldPassives['Edged Damage Amplification'] ||
            props.wornArmorPassives['Edged Damage Amplification'] ||
            props.traits['Mundane Damage Amplification'] ||
            props.statusEffects['Mundane Damage Amplification'] ||
            props.secondaryHandheldPassives['Mundane Damage Amplification'] ||
            props.primaryHandheldPassives['Mundane Damage Amplification'] ||
            props.wornArmorPassives['Mundane Damage Amplification']
          )
        case 'Piercing Damage':
        case 'Piercing Damage (Ignore Barrier)':
          return (
            props.traits['Piercing Damage Reduction'] ||
            props.statusEffects['Piercing Damage Reduction'] ||
            props.secondaryHandheldPassives['Piercing Damage Reduction'] ||
            props.primaryHandheldPassives['Piercing Damage Reduction'] ||
            props.wornArmorPassives['Piercing Damage Reduction'] ||
            props.traits['Mundane Damage Reduction'] ||
            props.statusEffects['Mundane Damage Reduction'] ||
            props.secondaryHandheldPassives['Mundane Damage Reduction'] ||
            props.primaryHandheldPassives['Mundane Damage Reduction'] ||
            props.wornArmorPassives['Mundane Damage Reduction'] ||
            props.traits['Piercing Damage Amplification'] ||
            props.statusEffects['Piercing Damage Amplification'] ||
            props.secondaryHandheldPassives['Piercing Damage Amplification'] ||
            props.primaryHandheldPassives['Piercing Damage Amplification'] ||
            props.wornArmorPassives['Piercing Damage Amplification'] ||
            props.traits['Mundane Damage Amplification'] ||
            props.statusEffects['Mundane Damage Amplification'] ||
            props.secondaryHandheldPassives['Mundane Damage Amplification'] ||
            props.primaryHandheldPassives['Mundane Damage Amplification'] ||
            props.wornArmorPassives['Mundane Damage Amplification']
          )
        case 'Toxic Damage':
        case 'Toxic Damage (Ignore Barrier)':
          return (
            props.traits['Toxic Damage Reduction'] ||
            props.statusEffects['Toxic Damage Reduction'] ||
            props.secondaryHandheldPassives['Toxic Damage Reduction'] ||
            props.primaryHandheldPassives['Toxic Damage Reduction'] ||
            props.wornArmorPassives['Toxic Damage Reduction'] ||
            props.traits['Mundane Damage Reduction'] ||
            props.statusEffects['Mundane Damage Reduction'] ||
            props.secondaryHandheldPassives['Mundane Damage Reduction'] ||
            props.primaryHandheldPassives['Mundane Damage Reduction'] ||
            props.wornArmorPassives['Mundane Damage Reduction'] ||
            props.traits['Toxic Damage Amplification'] ||
            props.statusEffects['Toxic Damage Amplification'] ||
            props.secondaryHandheldPassives['Toxic Damage Amplification'] ||
            props.primaryHandheldPassives['Toxic Damage Amplification'] ||
            props.wornArmorPassives['Toxic Damage Amplification'] ||
            props.traits['Mundane Damage Amplification'] ||
            props.statusEffects['Mundane Damage Amplification'] ||
            props.secondaryHandheldPassives['Mundane Damage Amplification'] ||
            props.primaryHandheldPassives['Mundane Damage Amplification'] ||
            props.wornArmorPassives['Mundane Damage Amplification']
          )
        case 'Stress Damage':
        case 'Stress Damage (Ignore Barrier)':
          return (
            props.traits['Stress Damage Reduction'] ||
            props.statusEffects['Stress Damage Reduction'] ||
            props.secondaryHandheldPassives['Stress Damage Reduction'] ||
            props.primaryHandheldPassives['Stress Damage Reduction'] ||
            props.wornArmorPassives['Stress Damage Reduction'] ||
            props.traits['Mundane Damage Reduction'] ||
            props.statusEffects['Mundane Damage Reduction'] ||
            props.secondaryHandheldPassives['Mundane Damage Reduction'] ||
            props.primaryHandheldPassives['Mundane Damage Reduction'] ||
            props.wornArmorPassives['Mundane Damage Reduction'] ||
            props.traits['Stress Damage Amplification'] ||
            props.statusEffects['Stress Damage Amplification'] ||
            props.secondaryHandheldPassives['Stress Damage Amplification'] ||
            props.primaryHandheldPassives['Stress Damage Amplification'] ||
            props.wornArmorPassives['Stress Damage Amplification'] ||
            props.traits['Mundane Damage Amplification'] ||
            props.statusEffects['Mundane Damage Amplification'] ||
            props.secondaryHandheldPassives['Mundane Damage Amplification'] ||
            props.primaryHandheldPassives['Mundane Damage Amplification'] ||
            props.wornArmorPassives['Mundane Damage Amplification']
          )
        case 'Divine Damage':
        case 'Divine Damage (Ignore Barrier)':
          return (
            props.traits['Divine Damage Reduction'] ||
            props.statusEffects['Divine Damage Reduction'] ||
            props.secondaryHandheldPassives['Divine Damage Reduction'] ||
            props.primaryHandheldPassives['Divine Damage Reduction'] ||
            props.wornArmorPassives['Divine Damage Reduction'] ||
            props.traits['Magical Damage Reduction'] ||
            props.statusEffects['Magical Damage Reduction'] ||
            props.secondaryHandheldPassives['Magical Damage Reduction'] ||
            props.primaryHandheldPassives['Magical Damage Reduction'] ||
            props.wornArmorPassives['Magical Damage Reduction'] ||
            props.traits['Divine Damage Amplification'] ||
            props.statusEffects['Divine Damage Amplification'] ||
            props.secondaryHandheldPassives['Divine Damage Amplification'] ||
            props.primaryHandheldPassives['Divine Damage Amplification'] ||
            props.wornArmorPassives['Divine Damage Amplification'] ||
            props.traits['Magical Damage Amplification'] ||
            props.statusEffects['Magical Damage Amplification'] ||
            props.secondaryHandheldPassives['Magical Damage Amplification'] ||
            props.primaryHandheldPassives['Magical Damage Amplification'] ||
            props.wornArmorPassives['Magical Damage Amplification']
          )
        case 'Blight Damage':
        case 'Blight Damage (Ignore Barrier)':
          return (
            props.traits['Blight Damage Reduction'] ||
            props.statusEffects['Blight Damage Reduction'] ||
            props.secondaryHandheldPassives['Blight Damage Reduction'] ||
            props.primaryHandheldPassives['Blight Damage Reduction'] ||
            props.wornArmorPassives['Blight Damage Reduction'] ||
            props.traits['Magical Damage Reduction'] ||
            props.statusEffects['Magical Damage Reduction'] ||
            props.secondaryHandheldPassives['Magical Damage Reduction'] ||
            props.primaryHandheldPassives['Magical Damage Reduction'] ||
            props.wornArmorPassives['Magical Damage Reduction'] ||
            props.traits['Blight Damage Amplification'] ||
            props.statusEffects['Blight Damage Amplification'] ||
            props.secondaryHandheldPassives['Blight Damage Amplification'] ||
            props.primaryHandheldPassives['Blight Damage Amplification'] ||
            props.wornArmorPassives['Blight Damage Amplification'] ||
            props.traits['Magical Damage Amplification'] ||
            props.statusEffects['Magical Damage Amplification'] ||
            props.secondaryHandheldPassives['Magical Damage Amplification'] ||
            props.primaryHandheldPassives['Magical Damage Amplification'] ||
            props.wornArmorPassives['Magical Damage Amplification']
          )
        case 'Pure Magic Damage':
        case 'Pure Magic Damage (Ignore Barrier)':
          return (
            props.traits['Pure Magic Damage Reduction'] ||
            props.statusEffects['Pure Magic Damage Reduction'] ||
            props.secondaryHandheldPassives['Pure Magic Damage Reduction'] ||
            props.primaryHandheldPassives['Pure Magic Damage Reduction'] ||
            props.wornArmorPassives['Pure Magic Damage Reduction'] ||
            props.traits['Magical Damage Reduction'] ||
            props.statusEffects['Magical Damage Reduction'] ||
            props.secondaryHandheldPassives['Magical Damage Reduction'] ||
            props.primaryHandheldPassives['Magical Damage Reduction'] ||
            props.wornArmorPassives['Magical Damage Reduction'] ||
            props.traits['Pure Magic Damage Amplification'] ||
            props.statusEffects['Pure Magic Damage Amplification'] ||
            props.secondaryHandheldPassives['Pure Magic Damage Amplification'] ||
            props.primaryHandheldPassives['Pure Magic Damage Amplification'] ||
            props.wornArmorPassives['Pure Magic Damage Amplification'] ||
            props.traits['Magical Damage Amplification'] ||
            props.statusEffects['Magical Damage Amplification'] ||
            props.secondaryHandheldPassives['Magical Damage Amplification'] ||
            props.primaryHandheldPassives['Magical Damage Amplification'] ||
            props.wornArmorPassives['Magical Damage Amplification']
          )
        default:
          return false
      }
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
      }
      props.setCurrentAndBarrier(finalCurrent, finalBarrier)
      damage.value = 0
    }

    function getRealDamageValue(damageType: string, damage: number) {
      if (damageType === 'Un-Typed') {
        return damage
      }

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
          // resistance = true
        }
      }
      if (
        damageType == 'Fire' ||
        damageType == 'Ice' ||
        damageType == 'Lightning' ||
        damageType == 'Force'
      ) {
        damageReduction =
          damageReduction ||
          props.traits['Elemental Damage Reduction'] ||
          props.secondaryHandheldPassives['Elemental Damage Reduction'] ||
          props.primaryHandheldPassives['Elemental Damage Reduction'] ||
          props.wornArmorPassives['Elemental Damage Reduction']
        damageAmplification =
          damageAmplification ||
          props.traits['Elemental Damage Amplification'] ||
          props.secondaryHandheldPassives['Elemental Damage Amplification'] ||
          props.primaryHandheldPassives['Elemental Damage Amplification'] ||
          props.wornArmorPassives['Elemental Damage Amplification']
      }
      console.log(damageType)
      if (
        damageType == 'Toxic' ||
        damageType == 'Stress' ||
        damageType == 'Blunt' ||
        damageType == 'Piercing' ||
        damageType == 'Edged'
      ) {
        damageReduction =
          damageReduction ||
          props.traits['Mundane Damage Reduction'] ||
          props.secondaryHandheldPassives['Mundane Damage Reduction'] ||
          props.primaryHandheldPassives['Mundane Damage Reduction'] ||
          props.wornArmorPassives['Mundane Damage Reduction']
        damageAmplification =
          damageAmplification ||
          props.traits['Mundane Damage Amplification'] ||
          props.secondaryHandheldPassives['Mundane Damage Amplification'] ||
          props.primaryHandheldPassives['Mundane Damage Amplification'] ||
          props.wornArmorPassives['Mundane Damage Amplification']
      }
      let damageAmp = 0
      let damageRed = 0
      console.log(damageReduction)

      if (damageAmplification) {
        damageAmp +=
          parseInt(dice.value + '') *
          (damageAmplification.number ||
            damageAmplification.rank ||
            parseInt(damageAmplification.modAmount + ''))
      }
      if (damageReduction) {
        damageRed -=
          parseInt(dice.value + '') *
          (damageReduction.number ||
            damageReduction.rank ||
            parseInt(damageReduction.modAmount + ''))
      }

      if (detectedImmunity.value.display && !detectedVulnerability.value.display) {
        return 0
      }
      if (detectedVulnerability.value.display) {
        return damage * 2 + damageAmp
      }
      if (detectedResistance.value.display && detectedSusceptibility.value.display) {
        return Math.max(damage + damageAmp + damageRed, 0)
      }
      if (detectedResistance.value.display) {
        return Math.max(Math.floor(damage / 2) + damageAmp + damageRed, 0)
      }
      if (detectedSusceptibility.value.display) {
        return Math.max(Math.floor(damage * 2) + damageAmp + damageRed, 0)
      }

      return Math.max(Math.floor(damage) + damageAmp + damageRed, 0)
    }

    function dealDamageIgnoreShield() {
      let finalCurrent = props.currentHp

      finalCurrent = finalCurrent - damage.value
      props.setCurrentAndBarrier(finalCurrent, props.barrierHp)
      damage.value = 0
    }
    function applyHeal() {
      let finalCurrent: number = props.currentHp

      finalCurrent = finalCurrent + parseInt(heal.value + '')
      if (finalCurrent > props.totalHp) {
        finalCurrent = props.totalHp
      }
      props.setCurrentAndBarrier(finalCurrent, props.barrierHp)
      heal.value = 0
    }
    function applyHealWithOvershield() {
      let finalCurrent = props.currentHp
      let finalBarrier = props.barrierHp

      finalCurrent = finalCurrent + parseInt(heal.value + '')
      if (finalCurrent > props.totalHp) {
        finalBarrier += finalCurrent - props.totalHp
        finalCurrent = props.totalHp
      }
      props.setCurrentAndBarrier(finalCurrent, finalBarrier)
      heal.value = 0
    }
    function applyBarrier() {
      let finalCurrent = props.currentHp
      let finalBarrier = props.barrierHp

      finalBarrier = finalBarrier + parseInt(barrier.value + '')

      props.setCurrentAndBarrier(finalCurrent, finalBarrier)
      barrier.value = 0
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
    const detectedResistance = computed(() => {
      let detectionMessage = 'Detected: '
      if (modifierValueTypesChoice.value.includes('Damage')) {
        const type = modifierValueTypesChoice.value.split(' Damage')[0]

        if (props.traits[type + ' Resistance']) {
          detectionMessage += type + ' Resistance from Trait,'
        }
        if (props.statusEffects[type + ' Resistance']) {
          detectionMessage += type + ' Resistance from Status Effect,'
        }
        if (
          props.secondaryHandheldPassives[type + ' Resistance'] +
          props.primaryHandheldPassives[type + ' Resistance']
        ) {
          detectionMessage += type + ' Resistance from Handheld Item,'
        }
        if (props.primaryHandheldPassives[type + ' Resistance']) {
          detectionMessage += type + ' Resistance from Handheld Item,'
        }
        if (props.wornArmorPassives[type + ' Resistance']) {
          detectionMessage += type + ' Resistance from Worn Armor,'
        }
        let resistance =
          props.traits[type + ' Resistance'] ||
          props.statusEffects[type + ' Resistance'] ||
          props.secondaryHandheldPassives[type + ' Resistance'] ||
          props.primaryHandheldPassives[type + ' Resistance'] ||
          props.wornArmorPassives[type + ' Resistance']
        if (props.statusEffects['Petrified']) {
          if (
            type == 'Fire' ||
            type == 'Ice' ||
            type == 'Lightning' ||
            type == 'Force' ||
            type == 'Toxic' ||
            type == 'Piercing' ||
            type == 'Edged'
          ) {
            resistance = true
            detectionMessage += type + ' Resistance from Petrification,'
          }
        }
        let overResist = false
        switch (type) {
          case 'Blunt (Ignore Barrier)':
          case 'Blunt':
          case 'Piercing':
          case 'Piercing (Ignore Barrier)':
          case 'Edged':
          case 'Edged (Ignore Barrier)':
          case 'Toxic  (Ignore Barrier)':
          case 'Toxic':
          case 'Stress  (Ignore Barrier)':
          case 'Stress':
            if (props.traits['Mundane Resistance']) {
              detectionMessage += 'Mundane Resistance from Trait,'
            }
            if (props.statusEffects['Mundane Resistance']) {
              detectionMessage += 'Mundane Resistance from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Mundane Resistance'] +
              props.primaryHandheldPassives['Mundane Resistance']
            ) {
              detectionMessage += 'Mundane Resistance from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Mundane Resistance']) {
              detectionMessage += 'Mundane Resistance from Handheld Item,'
            }
            if (props.wornArmorPassives['Mundane Resistance']) {
              detectionMessage += 'Mundane Resistance from Worn Armor,'
            }

            overResist =
              props.traits['Mundane Resistance'] ||
              props.statusEffects['Mundane Resistance'] ||
              props.secondaryHandheldPassives['Mundane Resistance'] ||
              props.primaryHandheldPassives['Mundane Resistance'] ||
              props.wornArmorPassives['Mundane Resistance']
            return { message: detectionMessage, display: resistance || overResist || false }
          case 'Fire':
          case 'Fire (Ignore Barrier)':
          case 'Ice':
          case 'Ice (Ignore Barrier)':
          case 'Force':
          case 'Force (Ignore Barrier)':
          case 'Lightning':
          case 'Lightning (Ignore Barrier)':
            if (props.traits['Elemental Resistance']) {
              detectionMessage += 'Elemental Resistance from Trait,'
            }
            if (props.statusEffects['Elemental Resistance']) {
              detectionMessage += 'Elemental Resistance from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Elemental Resistance'] +
              props.primaryHandheldPassives['Elemental Resistance']
            ) {
              detectionMessage += 'Elemental Resistance from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Elemental Resistance']) {
              detectionMessage += 'Elemental Resistance from Handheld Item,'
            }
            if (props.wornArmorPassives['Elemental Resistance']) {
              detectionMessage += 'Elemental Resistance from Worn Armor,'
            }

            overResist =
              props.traits['Elemental Resistance'] ||
              props.statusEffects['Elemental Resistance'] ||
              props.secondaryHandheldPassives['Elemental Resistance'] ||
              props.primaryHandheldPassives['Elemental Resistance'] ||
              props.wornArmorPassives['Elemental Resistance']
            return { message: detectionMessage, display: resistance || overResist || false }
          case 'Divine':
          case 'Divine (Ignore Barrier)':
          case 'Blight':
          case 'Blight (Ignore Barrier)':
          case 'Pure Magic':
          case 'Pure Magic (Ignore Barrier)':
            if (props.traits['Magical Resistance']) {
              detectionMessage += 'Magical Resistance from Trait,'
            }
            if (props.statusEffects['Magical Resistance']) {
              detectionMessage += 'Magical Resistance from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Magical Resistance'] +
              props.primaryHandheldPassives['Magical Resistance']
            ) {
              detectionMessage += 'Magical Resistance from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Magical Resistance']) {
              detectionMessage += 'Magical Resistance from Handheld Item,'
            }
            if (props.wornArmorPassives['Magical Resistance']) {
              detectionMessage += 'Magical Resistance from Worn Armor,'
            }

            overResist =
              props.traits['Magical Resistance'] ||
              props.statusEffects['Magical Resistance'] ||
              props.secondaryHandheldPassives['Magical Resistance'] ||
              props.primaryHandheldPassives['Magical Resistance'] ||
              props.wornArmorPassives['Magical Resistance']
            return { message: detectionMessage, display: resistance || overResist || false }
        }
      }
      return { message: '', display: false }
    })

    const detectedSusceptibility = computed(() => {
      let detectionMessage = 'Detected: '
      if (modifierValueTypesChoice.value.includes('Damage')) {
        const type = modifierValueTypesChoice.value.split(' Damage')[0]
        if (props.traits[type + ' Succeptibility']) {
          detectionMessage += type + ' Susceptibility from Trait,'
        }
        if (props.statusEffects[type + ' Susceptibility']) {
          detectionMessage += type + ' Susceptibility from Status Effect,'
        }
        if (
          props.secondaryHandheldPassives[type + ' Susceptibility'] +
          props.primaryHandheldPassives[type + ' Susceptibility']
        ) {
          detectionMessage += type + ' Susceptibility from Handheld Item,'
        }
        if (props.primaryHandheldPassives[type + ' Susceptibility']) {
          detectionMessage += type + ' Susceptibility from Handheld Item,'
        }
        if (props.wornArmorPassives[type + ' Susceptibility']) {
          detectionMessage += type + ' Susceptibility from Worn Armor,'
        }
        let susceptibility =
          props.traits[type + ' Susceptibility'] ||
          props.statusEffects[type + ' Susceptibility'] ||
          props.secondaryHandheldPassives[type + ' Susceptibility'] ||
          props.primaryHandheldPassives[type + ' Susceptibility'] ||
          props.wornArmorPassives[type + ' Susceptibility']
        let overResist = false
        switch (type) {
          case 'Blunt (Ignore Barrier)':
          case 'Blunt':
          case 'Piercing':
          case 'Piercing (Ignore Barrier)':
          case 'Edged':
          case 'Edged (Ignore Barrier)':
          case 'Stress':
          case 'Stress (Ignore Barrier)':
          case 'Toxic  (Ignore Barrier)':
          case 'Toxic':
            if (props.traits['Mundane Susceptibility']) {
              detectionMessage += 'Mundane Susceptibility from Trait,'
            }
            if (props.statusEffects['Mundane Susceptibility']) {
              detectionMessage += 'Mundane Susceptibility from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Mundane Susceptibility'] +
              props.primaryHandheldPassives['Mundane Susceptibility']
            ) {
              detectionMessage += 'Mundane Susceptibility from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Mundane Susceptibility']) {
              detectionMessage += 'Mundane Susceptibility from Handheld Item,'
            }
            if (props.wornArmorPassives['Mundane Susceptibility']) {
              detectionMessage += 'Mundane Susceptibility from Worn Armor,'
            }

            overResist =
              props.traits['Mundane Susceptibility'] ||
              props.statusEffects['Mundane Susceptibility'] ||
              props.secondaryHandheldPassives['Mundane Susceptibility'] ||
              props.primaryHandheldPassives['Mundane Susceptibility'] ||
              props.wornArmorPassives['Mundane Susceptibility']
            return { message: detectionMessage, display: susceptibility || overResist || false }
          case 'Fire':
          case 'Fire (Ignore Barrier)':
          case 'Ice':
          case 'Ice (Ignore Barrier)':
          case 'Force':
          case 'Force (Ignore Barrier)':
          case 'Lightning':
          case 'Lightning (Ignore Barrier)':
            if (props.traits['Elemental Susceptibility']) {
              detectionMessage += 'Elemental Susceptibility from Trait,'
            }
            if (props.statusEffects['Elemental Susceptibility']) {
              detectionMessage += 'Elemental Susceptibility from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Elemental Susceptibility'] +
              props.primaryHandheldPassives['Elemental Susceptibility']
            ) {
              detectionMessage += 'Elemental Susceptibility from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Elemental Susceptibility']) {
              detectionMessage += 'Elemental Susceptibility from Handheld Item,'
            }
            if (props.wornArmorPassives['Elemental Susceptibility']) {
              detectionMessage += 'Elemental Susceptibility from Worn Armor,'
            }

            overResist =
              props.traits['Elemental Susceptibility'] ||
              props.statusEffects['Elemental Susceptibility'] ||
              props.secondaryHandheldPassives['Elemental Susceptibility'] ||
              props.primaryHandheldPassives['Elemental Susceptibility'] ||
              props.wornArmorPassives['Elemental Susceptibility']
            return { message: detectionMessage, display: susceptibility || overResist || false }
          case 'Divine':
          case 'Divine (Ignore Barrier)':
          case 'Blight':
          case 'Blight (Ignore Barrier)':
          case 'Pure Magic':
          case 'Pure Magic (Ignore Barrier)':
            if (props.traits['Magical Susceptibility']) {
              detectionMessage += 'Magical Susceptibility from Trait,'
            }
            if (props.statusEffects['Magical Susceptibility']) {
              detectionMessage += 'Magical Susceptibility from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Magical Susceptibility'] +
              props.primaryHandheldPassives['Magical Susceptibility']
            ) {
              detectionMessage += 'Magical Susceptibility from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Magical Susceptibility']) {
              detectionMessage += 'Magical Susceptibility from Handheld Item,'
            }
            if (props.wornArmorPassives['Magical Susceptibility']) {
              detectionMessage += 'Magical Susceptibility from Worn Armor,'
            }

            overResist =
              props.traits['Magical Susceptibility'] ||
              props.statusEffects['Magical Susceptibility'] ||
              props.secondaryHandheldPassives['Magical Susceptibility'] ||
              props.primaryHandheldPassives['Magical Susceptibility'] ||
              props.wornArmorPassives['Magical Susceptibility']
            return { message: detectionMessage, display: susceptibility || overResist || false }
        }
      }
      return { message: '', display: false }
    })

    const detectedImmunity = computed(() => {
      let detectionMessage = 'Detected: '
      if (modifierValueTypesChoice.value.includes('Damage')) {
        const type = modifierValueTypesChoice.value.split(' Damage')[0]
        if (props.traits[type + ' Immunity']) {
          detectionMessage += type + ' Immunity from Trait,'
        }
        if (props.statusEffects[type + ' Immunity']) {
          detectionMessage += type + ' Immunity from Status Effect,'
        }
        if (
          props.secondaryHandheldPassives[type + ' Immunity'] +
          props.primaryHandheldPassives[type + ' Immunity']
        ) {
          detectionMessage += type + ' Immunity from Handheld Item,'
        }
        if (props.primaryHandheldPassives[type + ' Immunity']) {
          detectionMessage += type + ' Immunity from Handheld Item,'
        }
        if (props.wornArmorPassives[type + ' Immunity']) {
          detectionMessage += type + ' Immunity from Worn Armor,'
        }
        let immunity =
          props.traits[type + ' Immunity'] ||
          props.statusEffects[type + ' Immunity'] ||
          props.secondaryHandheldPassives[type + ' Immunity'] ||
          props.primaryHandheldPassives[type + ' Immunity'] ||
          props.wornArmorPassives[type + ' Immunity']
        let overResist = false
        switch (type) {
          case 'Blunt (Ignore Barrier)':
          case 'Blunt':
          case 'Piercing':
          case 'Piercing (Ignore Barrier)':
          case 'Edged':
          case 'Edged (Ignore Barrier)':
          case 'Toxic  (Ignore Barrier)':
          case 'Toxic':
          case 'Stress  (Ignore Barrier)':
          case 'Stress':
            if (props.traits['Mundane Immunity']) {
              detectionMessage += 'Mundane Immunity from Trait,'
            }
            if (props.statusEffects['Mundane Immunity']) {
              detectionMessage += 'Mundane Immunity from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Mundane Immunity'] +
              props.primaryHandheldPassives['Mundane Immunity']
            ) {
              detectionMessage += 'Mundane Immunity from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Mundane Immunity']) {
              detectionMessage += 'Mundane Immunity from Handheld Item,'
            }
            if (props.wornArmorPassives['Mundane Immunity']) {
              detectionMessage += 'Mundane Immunity from Worn Armor,'
            }

            overResist =
              props.traits['Mundane Immunity'] ||
              props.statusEffects['Mundane Immunity'] ||
              props.secondaryHandheldPassives['Mundane Immunity'] ||
              props.primaryHandheldPassives['Mundane Immunity'] ||
              props.wornArmorPassives['Mundane Immunity']
            return { message: detectionMessage, display: immunity || overResist || false }
          case 'Fire':
          case 'Fire (Ignore Barrier)':
          case 'Ice':
          case 'Ice (Ignore Barrier)':
          case 'Force':
          case 'Force (Ignore Barrier)':
          case 'Lightning':
          case 'Lightning (Ignore Barrier)':
            if (props.traits['Elemental Immunity']) {
              detectionMessage += 'Elemental Immunity from Trait,'
            }
            if (props.statusEffects['Elemental Immunity']) {
              detectionMessage += 'Elemental Immunity from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Elemental Immunity'] +
              props.primaryHandheldPassives['Elemental Immunity']
            ) {
              detectionMessage += 'Elemental Immunity from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Elemental Immunity']) {
              detectionMessage += 'Elemental Immunity from Handheld Item,'
            }
            if (props.wornArmorPassives['Elemental Immunity']) {
              detectionMessage += 'Elemental Immunity from Worn Armor,'
            }

            overResist =
              props.traits['Elemental Immunity'] ||
              props.statusEffects['Elemental Immunity'] ||
              props.secondaryHandheldPassives['Elemental Immunity'] ||
              props.primaryHandheldPassives['Elemental Immunity'] ||
              props.wornArmorPassives['Elemental Immunity']
            return { message: detectionMessage, display: immunity || overResist || false }
          case 'Divine':
          case 'Divine (Ignore Barrier)':
          case 'Blight':
          case 'Blight (Ignore Barrier)':
          case 'Pure Magic':
          case 'Pure Magic (Ignore Barrier)':
            if (props.traits['Magical Immunity']) {
              detectionMessage += 'Magical Immunity from Trait,'
            }
            if (props.statusEffects['Magical Immunity']) {
              detectionMessage += 'Magical Immunity from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Magical Immunity'] +
              props.primaryHandheldPassives['Magical Immunity']
            ) {
              detectionMessage += 'Magical Immunity from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Magical Immunity']) {
              detectionMessage += 'Magical Immunity from Handheld Item,'
            }
            if (props.wornArmorPassives['Magical Immunity']) {
              detectionMessage += 'Magical Immunity from Worn Armor,'
            }

            overResist =
              props.traits['Magical Immunity'] ||
              props.statusEffects['Magical Immunity'] ||
              props.secondaryHandheldPassives['Magical Immunity'] ||
              props.primaryHandheldPassives['Magical Immunity'] ||
              props.wornArmorPassives['Magical Immunity']
            return { message: detectionMessage, display: immunity || overResist || false }
        }
      }
      return { message: '', display: false }
    })

    const detectedVulnerability = computed(() => {
      let detectionMessage = 'Detected: '
      if (modifierValueTypesChoice.value.includes('Damage')) {
        const type = modifierValueTypesChoice.value.split(' Damage')[0]
        if (props.traits[type + ' Vulnerability']) {
          detectionMessage += type + ' Vulnerability from Trait,'
        }
        if (props.statusEffects[type + ' Vulnerability']) {
          detectionMessage += type + ' Vulnerability from Status Effect,'
        }
        if (
          props.secondaryHandheldPassives[type + ' Vulnerability'] +
          props.primaryHandheldPassives[type + ' Vulnerability']
        ) {
          detectionMessage += type + ' Vulnerability from Handheld Item,'
        }
        if (props.primaryHandheldPassives[type + ' Vulnerability']) {
          detectionMessage += type + ' Vulnerability from Handheld Item,'
        }
        if (props.wornArmorPassives[type + ' Vulnerability']) {
          detectionMessage += type + ' Vulnerability from Worn Armor,'
        }
        let vulnerability =
          props.traits[type + ' Vulnerability'] ||
          props.statusEffects[type + ' Vulnerability'] ||
          props.secondaryHandheldPassives[type + ' Vulnerability'] ||
          props.primaryHandheldPassives[type + ' Vulnerability'] ||
          props.wornArmorPassives[type + ' Vulnerability']
        let overResist = false
        switch (type) {
          case 'Blunt (Ignore Barrier)':
          case 'Blunt':
          case 'Piercing':
          case 'Piercing (Ignore Barrier)':
          case 'Edged':
          case 'Edged (Ignore Barrier)':
          case 'Toxic  (Ignore Barrier)':
          case 'Toxic':
          case 'Stress  (Ignore Barrier)':
          case 'Stress':
            if (props.traits['Mundane Vulnerability']) {
              detectionMessage += 'Mundane Vulnerability from Trait,'
            }
            if (props.statusEffects['Mundane Vulnerability']) {
              detectionMessage += 'Mundane Vulnerability from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Mundane Vulnerability'] +
              props.primaryHandheldPassives['Mundane Vulnerability']
            ) {
              detectionMessage += 'Mundane Vulnerability from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Mundane Vulnerability']) {
              detectionMessage += 'Mundane Vulnerability from Handheld Item,'
            }
            if (props.wornArmorPassives['Mundane Vulnerability']) {
              detectionMessage += 'Mundane Vulnerability from Worn Armor,'
            }

            overResist =
              props.traits['Mundane Vulnerability'] ||
              props.statusEffects['Mundane Vulnerability'] ||
              props.secondaryHandheldPassives['Mundane Vulnerability'] ||
              props.primaryHandheldPassives['Mundane Vulnerability'] ||
              props.wornArmorPassives['Mundane Vulnerability']
            return { message: detectionMessage, display: vulnerability || overResist || false }
          case 'Fire':
          case 'Fire (Ignore Barrier)':
          case 'Ice':
          case 'Ice (Ignore Barrier)':
          case 'Force':
          case 'Force (Ignore Barrier)':
          case 'Lightning':
          case 'Lightning (Ignore Barrier)':
            if (props.traits['Elemental Vulnerability']) {
              detectionMessage += 'Elemental Vulnerability from Trait,'
            }
            if (props.statusEffects['Elemental Vulnerability']) {
              detectionMessage += 'Elemental Vulnerability from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Elemental Vulnerability'] +
              props.primaryHandheldPassives['Elemental Vulnerability']
            ) {
              detectionMessage += 'Elemental Vulnerability from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Elemental Vulnerability']) {
              detectionMessage += 'Elemental Vulnerability from Handheld Item,'
            }
            if (props.wornArmorPassives['Elemental Vulnerability']) {
              detectionMessage += 'Elemental Vulnerability from Worn Armor,'
            }

            overResist =
              props.traits['Elemental Vulnerability'] ||
              props.statusEffects['Elemental Vulnerability'] ||
              props.secondaryHandheldPassives['Elemental Vulnerability'] ||
              props.primaryHandheldPassives['Elemental Vulnerability'] ||
              props.wornArmorPassives['Elemental Vulnerability']
            return { message: detectionMessage, display: vulnerability || overResist || false }
          case 'Divine':
          case 'Divine (Ignore Barrier)':
          case 'Blight':
          case 'Blight (Ignore Barrier)':
          case 'Pure Magic':
          case 'Pure Magic (Ignore Barrier)':
            if (props.traits['Magical Vulnerability']) {
              detectionMessage += 'Magical Vulnerability from Trait,'
            }
            if (props.statusEffects['Magical Vulnerability']) {
              detectionMessage += 'Magical Vulnerability from Status Effect,'
            }
            if (
              props.secondaryHandheldPassives['Magical Vulnerability'] +
              props.primaryHandheldPassives['Magical Vulnerability']
            ) {
              detectionMessage += 'Magical Vulnerability from Handheld Item,'
            }
            if (props.primaryHandheldPassives['Magical Vulnerability']) {
              detectionMessage += 'Magical Vulnerability from Handheld Item,'
            }
            if (props.wornArmorPassives['Magical Vulnerability']) {
              detectionMessage += 'Magical Vulnerability from Worn Armor,'
            }

            overResist =
              props.traits['Magical Vulnerability'] ||
              props.statusEffects['Magical Vulnerability'] ||
              props.secondaryHandheldPassives['Magical Vulnerability'] ||
              props.primaryHandheldPassives['Magical Vulnerability'] ||
              props.wornArmorPassives['Magical Vulnerability']
            return { message: detectionMessage, display: vulnerability || overResist || false }
        }
      }
      return { message: '', display: false }
    })

    function applyModifiedValue() {
      if (modifierValueTypesChoice.value.includes('Ignore Barrier')) {
        damageType.value = modifierValueTypesChoice.value.split(' Damage')[0]
        dealDamageIgnoreShield()
      } else if (modifierValueTypesChoice.value.includes('Damage')) {
        damageType.value = modifierValueTypesChoice.value.split(' Damage')[0]
        dealDamage()
      } else if (modifierValueTypesChoice.value === 'Healing') {
        heal.value = damage.value
        applyHeal()
      } else if (modifierValueTypesChoice.value === 'Shielding') {
        barrier.value = damage.value
        applyBarrier()
      } else if (modifierValueTypesChoice.value === 'Healing with Overheal') {
        heal.value = damage.value
        applyHealWithOvershield()
      }
      damage.value = 0
    }
    const isHidden = ref(false)
    return {
      designStore,
      userStore,
      damage,
      heal,
      damageType,
      modifiers,
      removeModifier,
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
      dice,
      damageTypes,
      props,
      modifierValueTypesChoice,
      hasDRorDA,
      applyModifiedValue,
      detectedResistance,
      detectedSusceptibility,
      detectedImmunity,
      detectedVulnerability,
      isHidden
    }
  },
  components: {
    CustomModal,
    BFormInput,
    BInputGroup,
    // BFormSelect,
    BButton,
    TitleWidget,
    StatusEffectItem,
    BDropdown,
    BDropdownItem,
    BDropdownDivider,
    AddStatusModifierModal
  }
}
</script>

<template>
  <CustomModal
    :isHidden="isHidden"
    title="Modify HP"
    :showModal="props.modal"
    @close="props.setModal(!props.modal)"
  >
    <template v-slot:body>
      <div
        v-if="!props.restirictedMode"
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
          <div style="display: flex; flex-direction: column; width: 20%" class="infoHeader">
            <div style="flex-grow: 1; padding-left: 2.5%; display: flex; width: min-content">
              <div style="align-self: end; width: min-content">Value</div>
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
          <div style="display: flex; flex-direction: column; width: 40%" class="infoHeader">
            <div style="flex-grow: 1; padding-left: 2.5%; display: flex">
              <div style="align-self: end; padding-left: 0.25rem">Action</div>
            </div>
            <!-- <BFormSelect
              v-model="damageType"
              :options="damageTypes"
              class="damageType"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormSelect> -->
            <BDropdown
              class="damageType"
              style="
                border-top: 2px solid;
                border-bottom: 2px solid;
                border-radius: 0;
                border-left: 1px solid;
              "
              :text="modifierValueTypesChoice"
              :style="{
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme,
                '--bs-btn-bg': designStore.inputBacking,
                '--bs-btn-color': designStore.inputText,
                '--bs-btn-border-color': designStore.secondaryTheme,
                '--bs-btn-hover-color': designStore.inputText,
                '--bs-btn-hover-bg': designStore.inputBacking,
                '--bs-btn-hover-border-color': designStore.secondaryTheme,
                '--bs-btn-active-color': designStore.inputText,
                '--bs-btn-active-bg:': designStore.inputBacking,
                '--bs-btn-active-border-color': designStore.secondaryTheme,
                '--bs-dropdown-color': designStore.inputText,
                '--bs-dropdown-bg': designStore.inputBacking,
                '--bs-dropdown-link-hover-color': designStore.alertTheme,
                '--bs-dropdown-link-hover-bg': designStore.inputBacking,
                '--bs-dropdown-link-active-color': designStore.alertTheme,
                '--bs-dropdown-link-active-bg': designStore.primaryTheme,
                scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
              }"
            >
              <div
                class="dropdownHeader"
                :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
              >
                Helpful effects
              </div>

              <BDropdownDivider
                style="margin-bottom: -1rem; border: 2px"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Healing'"
                ><v-icon name="gi-health-increase"></v-icon>Healing<v-icon
                  name="gi-health-increase"
                ></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Shielding'"
                ><v-icon name="gi-heart-shield"></v-icon>Shielding<v-icon
                  name="gi-heart-shield"
                ></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Healing with Overheal'"
                ><v-icon name="gi-healing-shield"></v-icon>Healing with Overheal<v-icon
                  name="gi-healing-shield"
                ></v-icon
              ></BDropdownItem>
              <div
                class="dropdownHeader"
                :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
              >
                Damage
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Un-typed Damage'">
                <v-icon name="gi-broken-bone"></v-icon> Un-Typed Damage
                <v-icon name="gi-broken-bone"></v-icon
              ></BDropdownItem>
              <div
                class="dropdownHeader"
                style="font-size: small"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText
                }"
              >
                Mundane
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Blunt Damage'">
                <v-icon name="gi-punch"></v-icon> Blunt Damage
                <v-icon name="gi-punch"></v-icon>
              </BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Edged Damage'"
                ><v-icon name="gi-sword-wound"></v-icon>Edged Damage
                <v-icon name="gi-sword-wound"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Piercing Damage'">
                <v-icon name="gi-plain-dagger"></v-icon> Piercing Damage
                <v-icon name="gi-plain-dagger"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Toxic Damage'"
                ><v-icon name="gi-poison-bottle"></v-icon>Toxic Damage
                <v-icon name="gi-poison-bottle"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Stress Damage'">
                <v-icon name="gi-worried-eyes"></v-icon> Stress Damage
                <v-icon name="gi-worried-eyes"></v-icon
              ></BDropdownItem>

              <div
                class="dropdownHeader"
                style="font-size: small"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText
                }"
              >
                Elemental
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Fire Damage'">
                <v-icon name="gi-fire"></v-icon> Fire Damage <v-icon name="gi-fire"></v-icon>
              </BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Ice Damage'">
                <v-icon name="gi-ice-bolt"></v-icon> Ice Damage <v-icon name="gi-ice-bolt"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Lightning Damage'"
                ><v-icon name="gi-lightning-trio"></v-icon> Lightning Damage
                <v-icon name="gi-lightning-trio"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Force Damage'"
                ><v-icon name="gi-earth-spit"></v-icon> Force Damage
                <v-icon name="gi-earth-spit"></v-icon
              ></BDropdownItem>
              <div
                class="dropdownHeader"
                style="font-size: small"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText
                }"
              >
                Magical
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Divine Damage'">
                <v-icon name="gi-sunbeams"></v-icon> Divine Damage
                <v-icon name="gi-sunbeams"></v-icon>
              </BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Blight Damage'">
                <v-icon name="gi-death-zone"></v-icon> Blight Damage
                <v-icon name="gi-death-zone"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Pure Magic Damage'"
                ><v-icon name="gi-sparkles"></v-icon> Pure Magic Damage
                <v-icon name="gi-sparkles"></v-icon
              ></BDropdownItem>
              <div
                class="dropdownHeader"
                :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
              >
                Damage Ignore Barrier
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Un-typed Damage (Ignore Barrier)'">
                <v-icon name="gi-broken-bone"></v-icon> Un-Typed Damage
                <v-icon name="gi-broken-bone"></v-icon
              ></BDropdownItem>
              <div
                class="dropdownHeader"
                style="font-size: small"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText
                }"
              >
                Mundane
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Blunt Damage (Ignore Barrier)'">
                <v-icon name="gi-punch"></v-icon> Blunt Damage
                <v-icon name="gi-punch"></v-icon>
              </BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Edged Damage (Ignore Barrier)'"
                ><v-icon name="gi-sword-wound"></v-icon>Edged Damage
                <v-icon name="gi-sword-wound"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Piercing Damage (Ignore Barrier)'">
                <v-icon name="gi-plain-dagger"></v-icon> Piercing Damage
                <v-icon name="gi-plain-dagger"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Toxic Damage (Ignore Barrier)'"
                ><v-icon name="gi-poison-bottle"></v-icon>Toxic Damage
                <v-icon name="gi-poison-bottle"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Stress Damage (Ignore Barrier)'">
                <v-icon name="gi-worried-eyes"></v-icon> Stress Damage
                <v-icon name="gi-worried-eyes"></v-icon
              ></BDropdownItem>

              <div
                class="dropdownHeader"
                style="font-size: small"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText
                }"
              >
                Elemental
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Fire Damage (Ignore Barrier)'">
                <v-icon name="gi-fire"></v-icon> Fire Damage <v-icon name="gi-fire "></v-icon>
              </BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Ice Damage (Ignore Barrier)'">
                <v-icon name="gi-ice-bolt"></v-icon> Ice Damage <v-icon name="gi-ice-bolt"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Lightning Damage (Ignore Barrier)'"
                ><v-icon name="gi-lightning-trio"></v-icon> Lightning Damage
                <v-icon name="gi-lightning-trio"></v-icon
              ></BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Force Damage (Ignore Barrier)'"
                ><v-icon name="gi-earth-spit"></v-icon> Force Damage
                <v-icon name="gi-earth-spit"></v-icon
              ></BDropdownItem>
              <div
                class="dropdownHeader"
                style="font-size: small"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText
                }"
              >
                Magical
              </div>
              <BDropdownDivider
                style="margin-bottom: -1rem"
                :style="{ color: designStore.secondaryTheme }"
              ></BDropdownDivider>
              <BDropdownItem @click="modifierValueTypesChoice = 'Divine Damage (Ignore Barrier)'">
                <v-icon name="gi-sunbeams"></v-icon> Divine Damage
                <v-icon name="gi-sunbeams"></v-icon>
              </BDropdownItem>
              <BDropdownItem @click="modifierValueTypesChoice = 'Blight Damage (Ignore Barrier)'">
                <v-icon name="gi-death-zone"></v-icon> Blight Damage
                <v-icon name="gi-death-zone"></v-icon
              ></BDropdownItem>
              <BDropdownItem
                @click="modifierValueTypesChoice = 'Pure Magic Damage (Ignore Barrier)'"
                ><v-icon name="gi-sparkles"></v-icon> Pure Magic Damage
                <v-icon name="gi-sparkles"></v-icon
              ></BDropdownItem>
            </BDropdown>
          </div>
        </div>
        <div
          style="display: flex; flex-direction: column; width: 20%"
          class="infoHeader"
          v-if="hasDRorDA"
        >
          <div style="flex-grow: 1; padding-left: 2.5%; min-width: 7.5rem"># Dice in Roll</div>

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
        <BButton
          class="rightDamageButton"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="applyModifiedValue()"
          >Apply</BButton
        >
      </div>
      <div
        v-if="hasDRorDA && dice <= 0"
        :style="{ color: designStore.alertTheme }"
        style="margin-top: -1rem; margin-bottom: 1rem; font-size: small; text-align: end"
      >
        Detected Applicable Damage Reduction or Damage Amplification. # of Dice needed to do
        calculation correctly!
      </div>
      <div
        v-if="detectedImmunity?.display"
        :style="{ color: designStore.alertTheme }"
        style="margin-top: -1rem; margin-bottom: 1rem; font-size: small; text-align: end"
      >
        {{ detectedImmunity.message }}
      </div>
      <div
        v-if="detectedSusceptibility?.display"
        :style="{ color: designStore.alertTheme }"
        style="margin-top: -1rem; margin-bottom: 1rem; font-size: small; text-align: end"
      >
        {{ detectedSusceptibility.message }}
      </div>
      <div
        v-if="detectedResistance?.display"
        :style="{ color: designStore.alertTheme }"
        style="margin-top: -1rem; margin-bottom: 1rem; font-size: small; text-align: end"
      >
        {{ detectedResistance.message }}
      </div>
      <div
        v-if="detectedVulnerability?.display"
        :style="{ color: designStore.alertTheme }"
        style="margin-top: -1rem; margin-bottom: 1rem; font-size: small; text-align: end"
      >
        {{ detectedVulnerability.message }}
      </div>

      <!-- <div class="expandingInput">
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
            style="width: 5.5rem; padding-top: 0.5rem; padding-left: 0.5rem; border-left: 1px solid"
            :style="{ borderColor: designStore.secondaryTheme }"
            @click="applyHealWithOvershield()"
          >
            Overheal</BButton
          >
        </BInputGroup>
      </div> -->
      <!-- <div class="expandingInput">
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
      </div> -->
      <TitleWidget
        v-if="!props.restirictedMode"
        class="expandingInput"
        title="Override Values"
        style="margin-top: -1rem"
      ></TitleWidget>
      <div class="expandingInput" v-if="!props.restirictedMode">
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
      <div class="expandingInput" v-if="!props.restirictedMode">
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

      <AddStatusModifierModal
        :modify-is-hidden="(val) => (isHidden = true)"
        :modifiers="modifiers"
        :modifierType="'HP'"
        @added="(addedVal) => addHpStatusModifier(addedVal)"
      ></AddStatusModifierModal>
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
  flex-grow: 1;
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
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  max-height: 2.5rem;
  align-self: end;
  width: 20%;
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
