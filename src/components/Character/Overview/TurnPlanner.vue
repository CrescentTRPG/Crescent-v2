<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import TitleMedallion from '@/components/TitleMedallion.vue'
import { useUserStore } from '@/stores/userStore.ts'
import PlannedActionWidget from './PlannedActionWidget.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    return {
      designStore,
      modal,
      userStore,
      characterStore
    }
  },
  components: { PlannedActionWidget, TitleMedallion }
}
</script>

<template>
  <div
    style="
      width: 15rem;
      min-width: 15rem;
      height: 85rem;
      grid-column: 1 / span 2;
      border: 2px solid;
      border-top: transparent;
    "
    :style="{
      background: designStore.sidebarBacking,
      borderColor: designStore.secondaryTheme,
      color: designStore.sidebarText
    }"
  >
    <TitleMedallion title="Turn Planner" style="margin-bottom: -0.5rem"></TitleMedallion>
    <PlannedActionWidget
      actionName="Core Action"
      :ability="characterStore.plannedCoreAction.ability"
    ></PlannedActionWidget>
    <PlannedActionWidget
      actionName="Swift Action"
      :ability="characterStore.plannedSwiftAction.ability"
    ></PlannedActionWidget>

    <PlannedActionWidget
      actionName="Movement Action"
      :ability="characterStore.plannedMovementAction.ability"
    ></PlannedActionWidget>

    <PlannedActionWidget
      actionName="Reaction"
      :ability="characterStore.plannedReaction.ability"
    ></PlannedActionWidget>
    <!-- <TitleMedallion title="Trackers"></TitleMedallion>
    <TrackerWidget name="Exceptional Willpower" :charges="1"></TrackerWidget>
    <TrackerWidget name="Exceptional Charisma" :charges="1"></TrackerWidget>
    <TrackerWidget name="Berserker's Frenzy" :charges="5"></TrackerWidget>
    <div style="justify-content: flex-end; display: flex; cursor: pointer">
      <div>Add Tracker</div>
      <i class="bi bi-plus" style="font-size: 1.5rem; margin-top: -0.25rem"></i>
    </div> -->
  </div>
</template>

<style scoped>
.fullNames {
  display: block;
}

.iconNames {
  display: block;
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
