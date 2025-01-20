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
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { movementStatusModifiers, statusEffects } = storeToRefs(characterStore)
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
    const isPinned: ComputedRef<boolean> = computed(() => {
      return statusEffects.value['Pinned']?.description.length > 0 ? true : false
    })
    const isStunned: ComputedRef<boolean> = computed(() => {
      return statusEffects.value['Stunned']?.description.length > 0 ? true : false
    })
    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(movementStatusModifiers.value)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })
      console.log(ret)

      return ret
    })
    function getColor() {
      if (
        isStunned.value ||
        isPinned.value ||
        isProne.value ||
        isSlowed.value ||
        movementStatusModifiers.value['Override Base'] ||
        movementStatusModifiers.value['Modify Base']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getFlightColor() {
      if (
        isStunned.value ||
        isPinned.value ||
        isProne.value ||
        isSlowed.value ||
        characterStore.statusEffects['Ethereal'] ||
        movementStatusModifiers.value['Override Flight'] ||
        movementStatusModifiers.value['Modify Flight']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getSwimColor() {
      if (
        isStunned.value ||
        isPinned.value ||
        isProne.value ||
        isSlowed.value ||
        movementStatusModifiers.value['Override Swim'] ||
        movementStatusModifiers.value['Modify Swim']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getClimbColor() {
      if (
        isStunned.value ||
        isPinned.value ||
        isProne.value ||
        isSlowed.value ||
        movementStatusModifiers.value['Override Climb'] ||
        movementStatusModifiers.value['Modify Climb']
      ) {
        return designStore.alertTheme
      }
      return designStore.inputText
    }
    function getBurrowColor() {
      if (
        isStunned.value ||
        isPinned.value ||
        isProne.value ||
        isSlowed.value ||
        movementStatusModifiers.value['Override Burrow'] ||
        movementStatusModifiers.value['Modify Burrow']
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
      characterStore.addNewMovementStatusModifier(statusObj)
    }

    const isProne: ComputedRef<boolean> = computed(() => {
      return statusEffects.value['Prone']?.description.length > 0 ? true : false
    })
    const isSlowed: ComputedRef<boolean> = computed(() => {
      return statusEffects.value['Slowed']?.description.length > 0 ? true : false
    })

    function removeModifier(modifierType, modAmount, linkedStatus) {
      characterStore.removeMovementStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }
    const base: ComputedRef<number> = computed(() => {
      let modifier = -1000
      const perkAndSkillGain = getPerkAndSkillGain()
      if (wornArmorPassives.value['Modify Movespeed']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Movespeed']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Movespeed']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Movespeed']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Movespeed']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Movespeed']?.modAmount),
          modifier
        )
      }
      if (modifier === -1000) {
        modifier = 0
      }
      if (movementStatusModifiers.value['Modify Base']) {
        let max = Object.values(movementStatusModifiers.value['Modify Base']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (movementStatusModifiers.value['Override Base']) {
        let max = Object.values(movementStatusModifiers.value['Override Base']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return isPinned.value || isStunned.value
            ? 0
            : isProne.value || isSlowed.value
              ? Math.floor(Math.max(max + modifier, 0) / 2)
              : Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Movespeed']) {
        const speed = parseInt(wornArmorPassives.value['Override Movespeed']?.modAmount)
        return isPinned.value || isStunned.value
          ? 0
          : isProne.value || isSlowed.value
            ? Math.floor(Math.max(speed + modifier, 0) / 2)
            : Math.max(speed + modifier, 0)
      }
      if (secondaryHandheldPassives.value['Override Movespeed']) {
        const speed = parseInt(secondaryHandheldPassives.value['Override Movespeed']?.modAmount)
        return isPinned.value || isStunned.value
          ? 0
          : isProne.value || isSlowed.value
            ? Math.floor(Math.max(speed + modifier, 0) / 2)
            : Math.max(speed + modifier, 0)
      }
      if (primaryHandheldPassives.value['Override Movespeed']) {
        const speed = parseInt(primaryHandheldPassives.value['Override Movespeed']?.modAmount)
        return isPinned.value || isStunned.value
          ? 0
          : isProne.value || isSlowed.value
            ? Math.floor(Math.max(speed + modifier, 0) / 2)
            : Math.max(speed + modifier, 0)
      }

      if (characterStore.traits['Bonus Movespeed']) {
        return Math.max(
          parseInt(characterStore.traits['Bonus Movespeed'].number) +
            modifier +
            perkAndSkillGain +
            30
        )
      }
      return isStunned.value || isPinned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor((30 + modifier + perkAndSkillGain) / 2)
          : 30 + modifier + perkAndSkillGain
    })

    const flight: ComputedRef<number> = computed(() => {
      let speed = 0
      let modifier = -1000
      if (wornArmorPassives.value['Modify Flightspeed']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Flightspeed']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Flightspeed']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Flightspeed']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Flightspeed']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Flightspeed']?.modAmount),
          modifier
        )
      }

      if (modifier === -1000) {
        modifier = 0
      }
      if (characterStore.traits['Flight ']) {
        speed = parseInt(characterStore.traits['Flight Speed'].number)
      }
      if (characterStore.traits['Flight Speed']) {
        speed += parseInt(characterStore.traits['Flight Speed'].number)
      }

      if (movementStatusModifiers.value['Override Flight']) {
        let max = Object.values(movementStatusModifiers.value['Override Flight']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }
      if (wornArmorPassives.value['Override Flightspeed']) {
        speed = parseInt(wornArmorPassives.value['Override Flightspeed']?.modAmount)
      }
      if (secondaryHandheldPassives.value['Override Flightspeed']) {
        speed = parseInt(secondaryHandheldPassives.value['Override Flightspeed']?.modAmount)
      }
      if (primaryHandheldPassives.value['Override Flightspeed']) {
        speed = parseInt(primaryHandheldPassives.value['Override Flightspeed']?.modAmount)
      }
      if (movementStatusModifiers.value['Modify Flight']) {
        let max = Object.values(movementStatusModifiers.value['Modify Flight']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }
      if (speed > 0) {
        speed += getPerkAndSkillGain()
      }
      if (characterStore.statusEffects['Ethereal']) {
        speed = base.value
      }
      speed += modifier

      return isStunned.value || isPinned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor(speed / 2)
          : speed
    })
    const climbing: ComputedRef<number> = computed(() => {
      let speed = 0
      let modifier = -1000
      if (wornArmorPassives.value['Modify Climbspeed']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Climbspeed']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Climbspeed']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Climbspeed']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Climbspeed']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Climbspeed']?.modAmount),
          modifier
        )
      }

      if (modifier === -1000) {
        modifier = 0
      }
      if (characterStore.traits['Climbing Speed']) {
        speed = parseInt(characterStore.traits['Climbing Speed'].number)
      }
      if (movementStatusModifiers.value['Override Climb']) {
        let max = Object.values(movementStatusModifiers.value['Override Climb']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }
      if (characterStore.traits['Climbing Speed']) {
        speed += parseInt(characterStore.traits['Climbing Speed'].number)
      }
      if (wornArmorPassives.value['Override Climbspeed']) {
        speed = parseInt(wornArmorPassives.value['Override Climbspeed']?.modAmount)
      }
      if (secondaryHandheldPassives.value['Override Climbspeed']) {
        speed = parseInt(secondaryHandheldPassives.value['Override Climbspeed']?.modAmount)
      }
      if (primaryHandheldPassives.value['Override Climbspeed']) {
        speed = parseInt(primaryHandheldPassives.value['Override Climbspeed']?.modAmount)
      }
      if (movementStatusModifiers.value['Modify Climb']) {
        let max = Object.values(movementStatusModifiers.value['Modify Climb']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }
      speed += modifier
      if (speed > 0) {
        speed += getPerkAndSkillGain()
      }

      return isStunned.value || isPinned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor(speed / 2)
          : speed
    })
    const swimming: ComputedRef<number> = computed(() => {
      let speed = 0
      let modifier = -1000
      if (wornArmorPassives.value['Modify Swimspeed']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Swimspeed']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Swimspeed']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Swimspeed']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Swimspeed']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Swimspeed']?.modAmount),
          modifier
        )
      }

      if (modifier === -1000) {
        modifier = 0
      }
      if (characterStore.traits['Swim Speed']) {
        speed = parseInt(characterStore.traits['Swim Speed'].number)
      }
      if (movementStatusModifiers.value['Override Swim']) {
        let max = Object.values(movementStatusModifiers.value['Override Swim']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }
      if (wornArmorPassives.value['Override Swimspeed']) {
        speed = parseInt(wornArmorPassives.value['Override Swimspeed']?.modAmount)
      }
      if (secondaryHandheldPassives.value['Override Swimspeed']) {
        speed = parseInt(secondaryHandheldPassives.value['Override Swimspeed']?.modAmount)
      }
      if (primaryHandheldPassives.value['Override Swimspeed']) {
        speed = parseInt(primaryHandheldPassives.value['Override Swimspeed']?.modAmount)
      }
      if (movementStatusModifiers.value['Modify Swim']) {
        let max = Object.values(movementStatusModifiers.value['Modify Swim']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }
      speed += modifier
      if (speed > 0) {
        speed += getPerkAndSkillGain()
      }

      return isStunned.value || isPinned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor(speed / 2)
          : speed
    })
    const burrowing: ComputedRef<number> = computed(() => {
      let speed = 0
      let modifier = -1000
      if (wornArmorPassives.value['Modify Burrowspeed']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Burrowspeed']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Burrowspeed']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Burrowspeed']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Burrowspeed']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Burrowspeed']?.modAmount),
          modifier
        )
      }

      if (modifier === -1000) {
        modifier = 0
      }
      if (characterStore.traits['Burrowing Speed']) {
        speed = parseInt(characterStore.traits['Burrowing Speed'].number)
      }
      if (movementStatusModifiers.value['Override Burrow']) {
        let max = Object.values(movementStatusModifiers.value['Override Burrow']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }
      if (wornArmorPassives.value['Override Burrowspeed']) {
        speed = parseInt(wornArmorPassives.value['Override Burrowspeed']?.modAmount)
      }
      if (secondaryHandheldPassives.value['Override Burrowspeed']) {
        speed = parseInt(secondaryHandheldPassives.value['Override Burrowspeed']?.modAmount)
      }
      if (primaryHandheldPassives.value['Override Burrowspeed']) {
        speed = parseInt(primaryHandheldPassives.value['Override Burrowspeed']?.modAmount)
      }
      if (movementStatusModifiers.value['Modify Burrow']) {
        let max = Object.values(movementStatusModifiers.value['Modify Burrow']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }
      speed += modifier
      if (speed > 0) {
        speed += getPerkAndSkillGain()
      }

      return isStunned.value || isPinned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor(speed / 2)
          : speed
    })
    function getPerkAndSkillGain() {
      const perks = perkGain.value
      let perkBonus = 0
      if (perks[0] == 'movespeed') {
        perkBonus += 2
      }
      if (perks[1] == 'movespeed') {
        perkBonus += 4
      }
      if (perks[2] == 'movespeed') {
        perkBonus += 6
      }
      if (perks[3] == 'movespeed') {
        perkBonus += 8
      }
      if (perks[4] == 'movespeed') {
        perkBonus += 10
      }

      let skillBonus = skills.value['Acrobatics']?.skill ? skills.value['Acrobatics'].rank * 2 : 0
      return perkBonus + skillBonus
    }

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      base,
      flight,
      getColor,
      getFlightColor,
      getBurrowColor,
      getSwimColor,
      getClimbColor,
      modifierType,
      statusModifiersList,
      removeModifier,
      addMovespeedStatusModifier,
      swimming,
      climbing,
      burrowing,
      isPinned
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
      <div>{{ base }}</div>
    </div>
    <div
      style="display: flex"
      :style="{
        color: getFlightColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-angel-wings"></v-icon></div>

      <div class="fullNames">Flight:&nbsp;</div>
      <div>{{ flight }}</div>
    </div>
    <div
      style="display: flex"
      :style="{
        color: getSwimColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-whale-tail"></v-icon></div>

      <div class="fullNames">Swim:&nbsp;</div>
      <div>{{ swimming }}</div>
    </div>
    <div
      style="display: flex"
      :style="{
        color: getClimbColor()
      }"
    >
      <div class="iconNames"><v-icon scale="1.5" name="gi-gecko"></v-icon></div>

      <div class="fullNames">Climb:&nbsp;</div>
      <div>{{ climbing }}</div>
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
          {{ base }} &nbsp;
          <v-icon scale="1.5" name="gi-angel-wings"></v-icon>

          {{ flight }} &nbsp;
          <v-icon scale="1.5" name="gi-whale-tail"></v-icon>
          {{ swimming }} &nbsp;
          <v-icon scale="1.5" name="gi-gecko"></v-icon>

          {{ climbing }} &nbsp;
          <v-icon scale="1.5" name="gi-dig-hole"></v-icon>
          {{ burrowing }} &nbsp;
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
