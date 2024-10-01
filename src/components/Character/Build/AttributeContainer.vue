<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import AttributeDisplay from '../Build/AttributeDisplay.vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { attributes } = storeToRefs(characterStore)
    const agility = ref(attributes.value.agility)

    return { designStore, attributes, agility }
  },
  methods: {},
  components: {
    AttributeDisplay
  }
}
</script>

<template>
  <div
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <AttributeDisplay
      attrShorthand="STR"
      attribute="Strength"
      attributeMessage="Heavy Weapons, Versatile 
 Weapons, Might, Martial Perks"
      :attributeValue="attributes.strength"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="AGI"
      attribute="Agility"
      attributeMessage=" Precision Weapons, Versatile 
 Weapons, Acrobatics, Subtlety, Martial Perks"
      :attributeValue="attributes.agility"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="HEA"
      attribute="Health"
      attributeMessage="Fitness"
      :attributeValue="attributes.health"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="WIL"
      attribute="Willpower"
      attributeMessage="Alchemy"
      :attributeValue="attributes.willpower"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="PER"
      attribute="Perception"
      attributeMessage="Awareness"
      :attributeValue="attributes.perception"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="CHA"
      attribute="Charisma"
      attributeMessage=" Interpersonal, Performance, Divine Spellgroups"
      :attributeValue="attributes.charisma"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="INT"
      attribute="Intelligence"
      attributeMessage="Elemental Spellgroups, Knowledge, Crafting"
      :attributeValue="attributes.intelligence"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="PWR"
      attribute="Power"
      attributeMessage="Spells, Metamagic"
      :attributeValue="attributes.power"
      exceptionalValue="1"
    ></AttributeDisplay>
  </div>
</template>

<style></style>
