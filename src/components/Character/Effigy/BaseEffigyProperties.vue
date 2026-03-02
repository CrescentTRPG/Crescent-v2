<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import FancyDecor from '@/components/FancyDecor.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useEffigyStore } from '@/stores/effigyStore.ts'
import _ from 'lodash'

export interface effigy {
  name: string
  level: number
  groupIcon: string
  isAscendant: boolean
  attributes: {
    strength: number
    agility: number
    perception: number
    willpower: number
    health: number
    intelligence: number
    power: number
    charisma: number
  }
  exceptionals: {
    strength: number
    agility: number
    perception: number
    willpower: number
    health: number
    intelligence: number
    power: number
    charisma: number
  }
  spells: any
  combatStyles: any
  specializations: any
  perks: any
  skills: any
  currentHp: number
  currentMana: number
  traits: any
  majorBonuses: any
  minorBonuses: any
  chosenResistance: string
  chosenSucceptibility: string
  chosenImmunity: string
  chosenVulnerability: string
  base: number
  flight: number
  effigyType: string
  practicedStyles: any
  equipment: any
  damageType: string
}

export default {
  props: ['effigy', 'updateEffigy'],
  setup(props, context) {
    const designStore = useDesignStore()
    const effigyStore = useEffigyStore()

    const damageTypes = [
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

    const movement = ['Flight', 'Land']
    function updateVal(val, key) {
      let copy = _.cloneDeep(props.effigy)
      copy[key] = val
      props.updateEffigy(copy)
    }

    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    return {
      designStore,
      damageTypes,
      lightenDarkenColor,
      updateVal,
      props,
      movement
    }
  },
  components: {
    TitleWidget,
    DropdownSelect,
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    FancyDecor
  }
}
</script>
<template>
  <div>
    <title-widget style="margin-top: 0" title="Base Properties"></title-widget>
    <FancyDecor
      text="Attack Damage Type"
      :background="designStore.inputBacking"
      :color="designStore.inputText"
      width="15rem"
      icon="gi-sword-wound"
    >
      <template v-slot:body>
        <DropdownSelect
          :color="designStore.inputText"
          @selection="(selection) => updateVal(selection, 'damageType')"
          :default="props.effigy.damageType"
          :options="damageTypes"
          class="fancySelect"
        ></DropdownSelect>
      </template>
    </FancyDecor>
    <FancyDecor
      text="Base Movement"
      :background="lightenDarkenColor(designStore.inputBacking, -20)"
      :color="designStore.inputText"
      width="15rem"
      icon="gi-sprint"
    >
      <template v-slot:body>
        <DropdownSelect
          :color="designStore.inputText"
          @selection="(selection) => updateVal(selection, 'movementType')"
          :options="movement"
          :default="props.effigy.movementType"
          class="fancySelect"
        ></DropdownSelect>
      </template>
    </FancyDecor>
    <FancyDecor
      text="Resistance"
      :background="designStore.inputBacking"
      :color="designStore.inputText"
      width="15rem"
      icon="gi-armor-upgrade"
    >
      <template v-slot:body>
        <DropdownSelect
          :disabled="props.effigy.level < 2"
          disabled-message="Unlocks at level 2"
          :color="designStore.inputText"
          @selection="(selection) => updateVal(selection, 'chosenResistance')"
          :options="damageTypes"
          :default="props.effigy.chosenResistance"
          class="fancySelect"
        ></DropdownSelect>
      </template>
    </FancyDecor>
    <FancyDecor
      text="Susceptibility"
      :background="lightenDarkenColor(designStore.inputBacking, -20)"
      :color="designStore.inputText"
      width="15rem"
      icon="gi-armor-downgrade"
    >
      <template v-slot:body>
        <DropdownSelect
          :disabled="props.effigy.level < 2"
          disabled-message="Unlocks at level 2"
          :color="designStore.inputText"
          @selection="(selection) => updateVal(selection, 'chosenSucceptibility')"
          :options="damageTypes"
          :default="props.effigy.chosenSucceptibility"
          class="fancySelect"
        ></DropdownSelect>
      </template>
    </FancyDecor>
    <FancyDecor
      text="Immunity"
      :background="designStore.inputBacking"
      :color="designStore.inputText"
      icon="gi-bell-shield"
      width="15rem"
    >
      <template v-slot:body>
        <DropdownSelect
          :disabled="props.effigy.level < 4"
          disabled-message="Unlocks at level 4"
          :color="designStore.inputText"
          @selection="(selection) => updateVal(selection, 'chosenImmunity')"
          :options="damageTypes"
          :default="props.effigy.chosenImmunity"
          class="fancySelect"
        ></DropdownSelect>
      </template>
    </FancyDecor>
    <FancyDecor
      text="Vulnerability"
      :background="lightenDarkenColor(designStore.inputBacking, -20)"
      :color="designStore.inputText"
      icon="gi-achilles-heel"
      width="15rem"
    >
      <template v-slot:body>
        <DropdownSelect
          :disabled="props.effigy.level < 4"
          disabled-message="Unlocks at level 4"
          :default="props.effigy.chosenVulnerability"
          :color="designStore.inputText"
          @selection="(selection) => updateVal(selection, 'chosenVulnerability')"
          :options="damageTypes"
          class="fancySelect"
        ></DropdownSelect>
      </template>
    </FancyDecor>
  </div>
</template>
<style>
.fancySelect {
  cursor: pointer;
  border-width: 2px;
  margin: 0rem;
  margin-bottom: 0.5rem;
  flex-grow: 1;
}
</style>
