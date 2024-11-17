<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import AttributeDisplay from '../Build/AttributeDisplay.vue'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import TitleWidget from '@/components/TitleWidget.vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { attributes, exceptionals } = storeToRefs(characterStore)
    const agility = ref(attributes.value.agility)
    const attributesMessage =
      "Attributes represent a characters raw potential. All of them limit a character's ability to purchase ranks in varying amounts of groups, listed beneath each attribute, but certain attributes are used in more general applications as well.  Health, Willpower, and Agility are all resistance stats, meaning they will be comonly used in checks to resist damaging or otherwise impairing effects.  Perception is used as the bonus for every to hit roll (abilities rolled against an opponents Defense Values(DVs)).  In addition to being a resistance stat, Health influences how much HP a character recovers when they rest(HEA * 10 HP). Power influences mana recovery during rest (PWR * 2 Mana) and is used to set the resitance checks of spells."

    return { designStore, attributes, agility, attributesMessage, exceptionals }
  },
  methods: {},
  components: {
    AttributeDisplay,
    TitleWidget
  }
}
</script>

<template>
  <div
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <TitleWidget title="Attributes" :info-message="attributesMessage"></TitleWidget>

    <AttributeDisplay
      attrShorthand="STR"
      attribute="Strength"
      attributeMessage="Heavy Weapons, Versatile 
 Weapons, Might, Martial Perks"
      :attributeValue="attributes.strength"
      :exceptionalValue="exceptionals.strength"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="AGI"
      attribute="Agility"
      attributeMessage=" Precision Weapons, Versatile 
 Weapons, Acrobatics, Subtlety, Martial Perks"
      :attributeValue="attributes.agility"
      :exceptionalValue="exceptionals.agility"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="HEA"
      attribute="Health"
      attributeMessage="Fitness"
      :attributeValue="attributes.health"
      :exceptionalValue="exceptionals.health"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="WIL"
      attribute="Willpower"
      attributeMessage="Alchemy"
      :attributeValue="attributes.willpower"
      :exceptionalValue="exceptionals.willpower"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="PER"
      attribute="Perception"
      attributeMessage="Awareness"
      :attributeValue="attributes.perception"
      :exceptionalValue="exceptionals.perception"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="CHA"
      attribute="Charisma"
      attributeMessage=" Interpersonal, Performance, Divine Spellgroups"
      :attributeValue="attributes.charisma"
      :exceptionalValue="exceptionals.charisma"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="INT"
      attribute="Intelligence"
      attributeMessage="Elemental Spellgroups, Knowledge, Crafting"
      :attributeValue="attributes.intelligence"
      :exceptionalValue="exceptionals.intelligence"
    ></AttributeDisplay>
    <AttributeDisplay
      attrShorthand="PWR"
      attribute="Power"
      attributeMessage="Spells, Metamagic"
      :attributeValue="attributes.power"
      :exceptionalValue="exceptionals.power"
    ></AttributeDisplay>
  </div>
</template>

<style></style>
