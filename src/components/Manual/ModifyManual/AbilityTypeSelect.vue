<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'

import TitleMedallion from '@/components/TitleMedallion.vue'

export default {
  props: ['type', 'update'],
  setup(props, context) {
    const designStore = useDesignStore()

    function getTypeColor(type) {
      if (type === props.type) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }
    function getTypeBoxShadow(type) {
      if (type === props.type) {
        return '0px 0px 10px 3px ' + designStore.alertTheme
      }
      return 'none'
    }
    function updateType(type) {
      props.update(type)
    }

    return {
      designStore,
      getTypeColor,
      updateType,
      getTypeBoxShadow
    }
  },
  components: {
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    TitleMedallion
  }
}
</script>
<template>
  <div class="abilitySelectContainer">
    <div
      @click="updateType('Spellgroup')"
      class="abilityTypeSelect hoverableTransparantLinear"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: getTypeColor('Spellgroup'),
        boxShadow: getTypeBoxShadow('Spellgroup')
      }"
    >
      <TitleMedallion title="Spellgroup"></TitleMedallion>
      <div style="display: flex">
        <v-icon name="gi-comet-spark" scale="5"></v-icon>
        <div style="text-align: end; align-self: center">
          Build a new Spellgroup. Ex: Life, Aquamancy
        </div>
      </div>
    </div>
    <div
      class="abilityTypeSelect hoverableTransparantLinear"
      @click="updateType('CombatStyle')"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: getTypeColor('CombatStyle'),
        boxShadow: getTypeBoxShadow('CombatStyle')
      }"
    >
      <TitleMedallion title="Combat Style" style="text-wrap: nowrap"></TitleMedallion>

      <div style="display: flex; justify-content: space-between">
        <v-icon name="gi-crossed-swords" scale="5"></v-icon>
        <div style="text-align: end; align-self: center">
          Build a new Combat Style. Ex: Heavy, Versatile
        </div>
      </div>
    </div>
    <div
      class="abilityTypeSelect hoverableTransparantLinear"
      @click="updateType('Specialization')"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: getTypeColor('Specialization'),
        boxShadow: getTypeBoxShadow('Specialization')
      }"
    >
      <TitleMedallion title="Specialization"></TitleMedallion>

      <div style="display: flex; justify-content: space-between">
        <v-icon name="gi-swordman" scale="5"></v-icon>
        <div style="text-align: end; align-self: center">
          Build a new Specialization. Ex: Axes, Bows
        </div>
      </div>
    </div>
    <div
      class="abilityTypeSelect hoverableTransparantLinear"
      @click="updateType('MartialPerk')"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: getTypeColor('MartialPerk'),
        boxShadow: getTypeBoxShadow('MartialPerk')
      }"
    >
      <TitleMedallion style="text-wrap: nowrap" title="Martial Perk"></TitleMedallion>

      <div style="display: flex; justify-content: space-between">
        <v-icon name="gi-sword-tie" scale="5"></v-icon>
        <div style="text-align: end; align-self: center">
          Build a new Martial Perk. Ex: Dodging, Mighty Rage
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.abilityTypeSelect {
  border: 3px solid;
  border-radius: 0.375rem;
  padding: 1rem;
  align-items: center;
  margin: 2rem;
}
.abilitySelectContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 900px) {
  .abilitySelectContainer {
    display: flex;
    flex-direction: column;
  }
}
</style>
