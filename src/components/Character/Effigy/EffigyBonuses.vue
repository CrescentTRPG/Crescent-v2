<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useEffigyStore } from '@/stores/effigyStore.ts'
import _ from 'lodash'

export default {
  props: ['effigy', 'updateEffigy'],
  setup(props, context) {
    const designStore = useDesignStore()
    const effigyStore = useEffigyStore()

    const minorBonuses = [
      'HP increases by 5',
      'Increase DVs by 2',
      '15’ Land Movement',
      '15’ Flight Movement',
      'Increase size class',
      'Mana increases by 2',
      '2 Ranks of Combat Style'
    ]
    const majorBonuses = [
      'HP increases by 20',
      'Gain 3 ranks in a new spell group',
      '30’ Land Movement',
      '30’ Flight Movement',
      'Selected Damage Types may be magical',
      'Mana increases by 6',
      'Gain ranks in weapon specialization equivilant to Combat Style'
    ]
    function updateMinor(val, num) {
      let copy = _.cloneDeep(props.effigy)
      copy.minorBonuses[num] = val
      props.updateEffigy(copy)
    }
    function updateMajor(val, num) {
      let copy = _.cloneDeep(props.effigy)
      copy.majorBonuses[num] = val
      props.updateEffigy(copy)
    }

    return {
      designStore,
      updateMinor,
      minorBonuses,
      majorBonuses,
      props,
      updateMajor
    }
  },
  components: {
    TitleMedallion,
    DropdownSelect
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
  }
}
</script>
<template>
  <div>
    <div>
      <v-icon
        name="gi-abstract-020"
        scale="2"
        style="position: absolute; translate: 1.5rem 0rem; transform: scaleX(1.75)"
        :style="{ color: designStore.secondaryTheme }"
      ></v-icon>
      <v-icon
        name="gi-abstract-020"
        scale="2"
        style="position: absolute; translate: 0rem 0rem; transform: scaleX(1.75); right: 1.25rem"
        :style="{ color: designStore.secondaryTheme }"
      ></v-icon>
      <div
        class="bonuses"
        :style="{
          background: designStore.sidebarBacking,
          color: designStore.secondaryTheme
        }"
        style="height: 25rem"
      ></div>

      <v-icon
        name="gi-abstract-020"
        scale="2"
        style="position: absolute; translate: 1.5rem -3.25rem; transform: scaleX(1.75); z-index: 2"
        :style="{ color: designStore.secondaryTheme }"
      ></v-icon>
      <v-icon
        name="gi-abstract-020"
        scale="2"
        style="
          position: absolute;
          translate: 0rem -3.25rem;
          transform: scaleX(1.75);
          right: 1.25rem;
          z-index: 2;
        "
        :style="{ color: designStore.secondaryTheme }"
      ></v-icon>
    </div>
    <div style="position: relative; top: -25rem; z-index: 3; margin: 1.5rem">
      <TitleMedallion title="Minor Bonuses"></TitleMedallion>
      <DropdownSelect
        :default="props.effigy.minorBonuses[1] || ''"
        :color="designStore.inputText"
        @selection="(selection) => updateMinor(selection, 1)"
        :options="minorBonuses"
        class="fancySelect"
        style="position: relative"
      ></DropdownSelect>
      <DropdownSelect
        :default="props.effigy.minorBonuses[2] || ''"
        :disabled="props.effigy.level <= 2"
        disabled-message="Unlocks at level 3"
        :color="designStore.inputText"
        @selection="(selection) => updateMinor(selection, 2)"
        :options="minorBonuses"
        class="fancySelect"
      ></DropdownSelect>
      <DropdownSelect
        :default="props.effigy.minorBonuses[3] || ''"
        :disabled="props.effigy.level <= 4"
        disabled-message="Unlocks at level 5"
        :color="designStore.inputText"
        @selection="(selection) => updateMinor(selection, 3)"
        :options="minorBonuses"
        class="fancySelect"
      ></DropdownSelect>
      <TitleMedallion title="Major Bonuses"></TitleMedallion>

      <DropdownSelect
        :default="props.effigy.majorBonuses[1] || ''"
        :disabled="props.effigy.level <= 4"
        disabled-message="Unlocks at level 5"
        :color="designStore.inputText"
        @selection="(selection) => updateMajor(selection, 1)"
        :options="majorBonuses"
        class="fancySelect"
      ></DropdownSelect>
      <DropdownSelect
        :default="props.effigy.majorBonuses[2] || ''"
        :disabled="!props.effigy.isAscendant"
        disabled-message="Unlocks with Ascendant Ritual"
        :color="designStore.inputText"
        @selection="(selection) => updateMajor(selection, 2)"
        :options="majorBonuses"
        class="fancySelect"
      ></DropdownSelect>
    </div>
  </div>
</template>
<style>
.bonuses {
  clip-path: stroke-box
    polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
  padding: 1rem;
  margin: 1rem;
  border: 2px solid;
  z-index: 3;
  position: relative;
}
</style>
