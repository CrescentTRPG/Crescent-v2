<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import CharacterSidebar from '../Build/CharacterSidebar.vue'
import TabContents from '../Build/TabContents.vue'
import AttributeDisplay from '../Build/AttributeDisplay.vue'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    return { designStore }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CharacterSidebar,
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
      attribute="Strength"
      attribute-message="Heavy Weapons, Versatile 
 Weapons, Might, Martial Perks"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attribute="Agility"
      attribute-message=" Precision Weapons, Versatile 
 Weapons, Acrobatics, Subtlety, Martial Perks"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attribute="Health"
      attribute-message="Fitness"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attribute="Willpower"
      attribute-message="Alchemy"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attribute="Perception"
      attribute-message="Awareness"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attribute="Charisma"
      attribute-message=" Interpersonal, Performance, Divine Spellgroups"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attribute="Intelligence"
      attribute-message="Elemental Spellgroups, Knowledge, Crafting"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
    <AttributeDisplay
      attribute="Power"
      attribute-message="Spells, Metamagic"
      attributeValue="10"
      exceptionalValue="1"
    ></AttributeDisplay>
  </div>
</template>

<style></style>
