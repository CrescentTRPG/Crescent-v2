<script lang="ts">
import { computed, ref } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'
import MartialAttackDisplay from '../Character/Matrial Attack Builder/MartialAttackDisplay.vue'
import DropdownSelect from '../DropdownSelect.vue'

export default {
  emits: ['rollString', 'as'],
  props: ['attributes'],
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const martialAttackKeys = computed(() => {
      return Object.keys(characterStore.martialAttacks)
    })
    function roll(rollstring) {
      context.emit('as', attackToRoll.value)
      context.emit('rollString', rollstring)
    }
    const attackToRoll = ref('')

    return { designStore, props, martialAttackKeys, attackToRoll, characterStore, roll }
  },
  components: {
    DropdownSelect,
    MartialAttackDisplay
  }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; width: 100%"
    :style="{
      fontFamily: designStore.font,
      background: designStore.primaryTheme,
      color: designStore.primaryText
    }"
  >
    <DropdownSelect
      @selection="(selection) => (attackToRoll = selection)"
      :options="martialAttackKeys"
      :borderless="false"
      label="Martial Attack"
    ></DropdownSelect>
    <MartialAttackDisplay
      @rollString="(rollstring) => roll(rollstring)"
      :attributes="props.attributes"
      :display-dice="true"
      v-if="attackToRoll"
      :icon="characterStore.martialAttacks[attackToRoll].icon || 'gi-tec-9'"
      :weaponAttack="characterStore.martialAttacks[attackToRoll].attackObj"
    >
    </MartialAttackDisplay>
  </div>
</template>

<style>
.abilityGrid {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  z-index: 4;
  border: 2px solid;
  border-bottom: 2px solid;
  margin-top: -1.5rem;
  grid-gap: 0.05rem;
  justify-content: space-around;
}
.grid__item {
  padding: 0.25rem;
  position: relative;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
  padding-top: 0.25rem;
  text-wrap: wrap;
}
@media (max-width: 1000px) {
  .abilityGrid {
    grid-template-rows: auto auto auto;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
