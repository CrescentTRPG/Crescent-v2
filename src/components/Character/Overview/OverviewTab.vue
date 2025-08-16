<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import CharacterStateBanner from './CharacterStateBanner.vue'
import EffectsRibbon from './EffectsRibbon.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import OverviewAttributes from './OverviewAttributes.vue'
import MobileCharacterStateBanner from './MobileCharacterStateBanner.vue'
import AbilitiesTable from './AbilitiesTable.vue'
import MovespeedWidget from './MovespeedWidget.vue'
import TurnPlanner from './TurnPlanner.vue'
import { BAccordion, BAccordionItem } from 'bootstrap-vue-next'
import ActionsRepresentationWidget from './ActionsRepresentationWidget.vue'
import BPopover from 'bootstrap-vue-next/src/directives/BPopover.js'
import BarPlannerDisplay from './BarPlannerDisplay.vue'
import { useCharacterComputedStore } from '@/stores/characterComputedStore'
import { storeToRefs } from 'pinia'
import { useStatusEffectStore } from '@/stores/statusEffectStore'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const characterComputedStore = useCharacterComputedStore()
    const statusEffectsStore = useStatusEffectStore()

    const {
      secondaryHandheldPassives,
      primaryHandheldPassives,
      wornArmorPassives,
      isStunned,
      isPinned,
      isProne,
      isSlowed,
      base,
      flight,
      swimming,
      climbing,
      burrowing
    } = storeToRefs(characterComputedStore)
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      secondaryHandheldPassives,
      primaryHandheldPassives,
      wornArmorPassives,
      isStunned,
      isPinned,
      isProne,
      isSlowed,
      base,
      flight,
      swimming,
      climbing,
      burrowing,
      statusEffectsStore
    }
  },
  components: {
    CharacterStateBanner,
    EffectsRibbon,
    TitleWidget,
    OverviewAttributes,
    MobileCharacterStateBanner,
    AbilitiesTable,
    MovespeedWidget,
    TurnPlanner,
    BAccordion,
    BAccordionItem,
    BarPlannerDisplay
  }
}
</script>

<template>
  <div class="overviewLayout" :style="{ fontFamily: designStore.font }">
    <div style="width: fit-content" class="bannerTime">
      <CharacterStateBanner></CharacterStateBanner>
    </div>
    <div class="mobileBannnerTime"><MobileCharacterStateBanner></MobileCharacterStateBanner></div>
    <div class="centralItems">
      <div class="plannerInfoHeader" style="justify-content: space-between">
        <BarPlannerDisplay class="plannerInfoHeader"></BarPlannerDisplay>

        <BAccordion
          class="accordion plannerOverlay"
          :style="{
            color: designStore.sidebarText,
            background: designStore.inputBacking,
            backgroundColor: designStore.sidebarBacking,
            borderColor: designStore.secondaryTheme
          }"
        >
          <BAccordionItem
            :title="`Planner&nbsp`"
            style="z-index: 4; position: relative"
            :style="{
              color: designStore.inputText,
              background: designStore.sidebarBacking,
              borderColor: designStore.secondaryTheme
            }"
          >
            <TurnPlanner></TurnPlanner>
          </BAccordionItem>
        </BAccordion>
      </div>
      <EffectsRibbon
        :traits="characterStore.traits"
        :customStatusEffects="characterStore.customStatusEffects"
        :addCustomStatus="characterStore.addCustomStatus"
        :removeStatus="characterStore.removeStatus"
        :addStatus="statusEffectsStore.addStatus"
        :statuses="characterStore.statusEffects"
      ></EffectsRibbon>
      <OverviewAttributes></OverviewAttributes>
      <MovespeedWidget
        :traits="characterStore.traits"
        :secondaryHandheldPassives="secondaryHandheldPassives"
        :primaryHandheldPassives="primaryHandheldPassives"
        :wornArmorPassives="wornArmorPassives"
        :movementStatusModifiers="characterStore.movementStatusModifiers"
        :statusEffects="characterStore.statusEffects"
        :removeMovementStatusModifier="characterStore.removeMovementStatusModifier"
        :addNewMovementStatusModifier="characterStore.addNewMovementStatusModifier"
        :isStunned="isStunned"
        :isPinned="isPinned"
        :isProne="isProne"
        :isSlowed="isSlowed"
        :base="base"
        :flight="flight"
        :swimming="swimming"
        :climbing="climbing"
        :burrowing="burrowing"
      ></MovespeedWidget>
      <TitleWidget title="Abilities" style="margin-top: -0.25rem"></TitleWidget>
      <AbilitiesTable></AbilitiesTable>
    </div>
    <TurnPlanner class="turnPlanner"></TurnPlanner>
  </div>
</template>

<style>
.overviewLayout {
  display: flex;
  width: 100%;
}
.centralItems {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.mobileBannnerTime {
  display: none;
}
.plannerOverlay {
  display: none;
  right: 0;
  height: 3rem;
  z-index: 5;
  border: 1px solid;
}
.plannerInfoHeader {
  height: 3rem;

  display: none;
}
@media (max-width: 1200px) {
  .turnPlanner {
    display: none;
  }
  .overviewLayout {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
  }
  .centralItems {
    width: 100%;
  }
  .plannerInfoHeader {
    height: 3rem;

    display: flex;
  }
  .plannerOverlay {
    display: block;
    position: absolute;
    right: 0;
    height: 3rem;
    z-index: 5;
    border: 2px solid;
    border-top: none;
  }
}
@media (max-width: 800px) {
  .turnPlanner {
    display: none;
  }
  .plannerInfoHeader {
    display: flex;
  }
  .overviewLayout {
    display: flex;
    flex-direction: column;
  }
  .bannerTime {
    display: none;
  }
  .mobileBannnerTime {
    display: block;
  }
  .plannerOverlay {
    position: absolute;
    display: block;
    right: 0;
    height: 3rem;
    z-index: 5;
    border: 2px solid;
  }
}
</style>
