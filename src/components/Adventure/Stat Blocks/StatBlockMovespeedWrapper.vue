<script lang="ts">
import { useDesignStore } from '@/stores/designStore'

import { computed, ref } from 'vue'

import MovespeedWidget from '@/components/Character/Overview/MovespeedWidget.vue'
import { ComputedRef } from 'vue'

import { GenericModifier } from '@/stores/characterStore'

export default {
  props: [
    'currentStatBlock',
    'isEditing',
    'isProne',
    'isSlowed',
    'isPinned',
    'isStunned',
    'updateTemp',
    'removeMovementStatusModifier'
  ],
  setup(props, context) {
    const designStore = useDesignStore()

    function addNewMovementStatusModifier(modifier: GenericModifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.movementStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      newTemp.movementStatusModifiers[modifier.modifierType] = {
        ...modRef,
        [pos]: modifier
      }
      if (modifier.linkedStatus) {
        newTemp.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'Move: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      props.updateTemp(newTemp)
    }

    function updateSpeeds(base, flight, swim, climb, burrow) {
      let newTemp = { ...props.currentStatBlock }
      newTemp.base = parseInt(base + ' ')
      newTemp.flight = parseInt(flight + ' ')
      newTemp.swimming = parseInt(swim + ' ')
      newTemp.climbing = parseInt(climb + ' ')
      newTemp.burrowing = parseInt(burrow + ' ')
      props.updateTemp(newTemp)
    }

    const base: ComputedRef<number> = computed(() => {
      let modifier = 0
      if (props.isEditing) {
        return props.currentStatBlock.base
      }
      if (props.currentStatBlock.movementStatusModifiers['Modify Base']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Modify Base']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.currentStatBlock.movementStatusModifiers['Override Base']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Override Base']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return props.isPinned || props.isStunned
            ? 0
            : props.isProne || props.isSlowed
              ? Math.floor(Math.max(max + modifier, 0) / 2)
              : Math.max(max + modifier, 0)
        }
      }

      return props.isStunned || props.isPinned
        ? 0
        : props.isProne || props.isSlowed
          ? Math.floor((props.currentStatBlock.base + modifier) / 2)
          : props.currentStatBlock.base + modifier
    })

    const flight: ComputedRef<number> = computed(() => {
      let speed = props.currentStatBlock.flight
      if (props.isEditing) {
        return speed
      }
      let modifier = 0

      if (props.currentStatBlock.movementStatusModifiers['Override Flight']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Override Flight']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }

      if (props.currentStatBlock.movementStatusModifiers['Modify Flight']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Modify Flight']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }

      if (props.currentStatBlock.statusEffects['Ethereal']) {
        speed = base.value
      }
      speed += modifier

      return props.isStunned || props.isPinned
        ? 0
        : props.isProne || props.isSlowed
          ? Math.floor(speed / 2)
          : speed
    })
    const climbing: ComputedRef<number> = computed(() => {
      let speed = props.currentStatBlock.climbing
      if (props.isEditing) {
        return speed
      }
      let modifier = 0

      if (props.currentStatBlock.movementStatusModifiers['Override Climb']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Override Climb']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }

      if (props.currentStatBlock.movementStatusModifiers['Modify Climb']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Modify Climb']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }
      speed += modifier

      return props.isStunned || props.isPinned
        ? 0
        : props.isProne || props.isSlowed
          ? Math.floor(speed / 2)
          : speed
    })
    const swimming: ComputedRef<number> = computed(() => {
      let speed = props.currentStatBlock.swimming
      if (props.isEditing) {
        return speed
      }
      let modifier = 0
      if (props.currentStatBlock.traits['Swim Speed']) {
        speed = parseInt(props.currentStatBlock.traits['Swim Speed'].number)
      }
      if (props.currentStatBlock.movementStatusModifiers['Override Swim']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Override Swim']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }

      if (props.currentStatBlock.movementStatusModifiers['Modify Swim']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Modify Swim']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }
      speed += modifier

      return props.isStunned || props.isPinned
        ? 0
        : props.isProne || props.isSlowed
          ? Math.floor(speed / 2)
          : speed
    })
    const burrowing: ComputedRef<number> = computed(() => {
      let speed = props.currentStatBlock.burrowing
      if (props.isEditing) {
        return speed
      }
      let modifier = 0
      if (props.currentStatBlock.movementStatusModifiers['Override Burrow']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Override Burrow']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          speed = max
        }
      }

      if (props.currentStatBlock.movementStatusModifiers['Modify Burrow']) {
        const max = Object.values(
          props.currentStatBlock.movementStatusModifiers['Modify Burrow']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier += max
        }
      }
      speed += modifier

      return props.isStunned || props.isPinned
        ? 0
        : props.isProne || props.isSlowed
          ? Math.floor(speed / 2)
          : speed
    })

    return {
      designStore,
      props,
      addNewMovementStatusModifier,
      updateSpeeds,
      base,
      flight,
      climbing,
      burrowing,
      swimming
    }
  },
  components: {
    MovespeedWidget
  }
}
</script>
<template>
  <div>
    <MovespeedWidget
      :traits="props.currentStatBlock.traits"
      :secondaryHandheldPassives="props.currentStatBlock.secondaryHandheldPassives"
      :primaryHandheldPassives="props.currentStatBlock.primaryHandheldPassives"
      :wornArmorPassives="props.currentStatBlock.wornArmorPassives"
      :movementStatusModifiers="props.currentStatBlock.movementStatusModifiers"
      :statusEffects="props.currentStatBlock.statusEffects"
      :removeMovementStatusModifier="props.removeMovementStatusModifier"
      :addNewMovementStatusModifier="addNewMovementStatusModifier"
      :isStunned="props.isStunned"
      :isPinned="props.isPinned"
      :isProne="props.isProne"
      :isSlowed="props.isSlowed"
      :base="base"
      :flight="flight"
      :swimming="swimming"
      :climbing="climbing"
      :burrowing="burrowing"
      :isEditing="props.isEditing"
      :updateSpeeds="updateSpeeds"
    ></MovespeedWidget>
  </div>
</template>
<style></style>
