<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../../../stores/designStore.ts'

import AlchemicalIngredient from './AlchemicalIngredient.vue'
import AdaptationsReference from './AdaptationsReference.vue'
import NewPlayerGuide from './NewPlayerGuide.vue'
import RollingDice from './RollingDice.vue'
import StatusEffectsTable from './StatusEffectsTable.vue'
import ExampleCharacterBase from './ExampleCharacterBase.vue'

export default {
  props: ['title'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()

    const designStore = useDesignStore()
    const character = computed(() => {
      return props.title.split(': ')[1]
    })
    return {
      designStore,
      props,
      character
    }
  },
  components: {
    AlchemicalIngredient,
    AdaptationsReference,
    NewPlayerGuide,
    RollingDice,
    StatusEffectsTable,
    ExampleCharacterBase
  }
}
</script>

<template>
  <div>
    <div v-if="props.title === 'Alchemical Ingredients'">
      <AlchemicalIngredient></AlchemicalIngredient>
    </div>
    <div v-if="props.title === 'Adaptations'">
      <AdaptationsReference></AdaptationsReference>
    </div>
    <div v-if="props.title === 'New Player Guide'">
      <NewPlayerGuide></NewPlayerGuide>
    </div>
    <div v-if="props.title === 'Rolling Dice'">
      <RollingDice></RollingDice>
    </div>
    <div v-if="props.title === 'Status Effect'">
      <StatusEffectsTable></StatusEffectsTable>
    </div>
    <div v-if="props.title.includes('Example Character:')">
      <ExampleCharacterBase :character="character"></ExampleCharacterBase>
    </div>
  </div>
</template>

<style>
.rulesReferenceContainer {
  display: flex;
}
</style>
