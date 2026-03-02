<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import StatBlockDetailedReference from '@/components/Adventure/Stat Blocks/StatBlockDetailedReference.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useCharacterComputedStore } from '@/stores/characterComputedStore.ts'
import { useEffigyStore } from '@/stores/effigyStore.ts'
import { useStatusEffectStore } from '@/stores/statusEffectStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BAccordion, BAccordionItem } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { storeToRefs } from 'pinia'
import AbilitiesTable from './AbilitiesTable.vue'
import BarPlannerDisplay from './BarPlannerDisplay.vue'
import CharacterStateBanner from './CharacterStateBanner.vue'
import EffectsRibbon from './EffectsRibbon.vue'
import MobileCharacterStateBanner from './MobileCharacterStateBanner.vue'
import MovespeedWidget from './MovespeedWidget.vue'
import OverviewAttributes from './OverviewAttributes.vue'
import TurnPlanner from './TurnPlanner.vue'
import GuideMessage from '@/components/GuideMessage.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const characterComputedStore = useCharacterComputedStore()
    const statusEffectsStore = useStatusEffectStore()
    const effigyStore = useEffigyStore()
    const viewing = ref('!!!!!character!!!!!')
    function viewSheet(nav) {
      viewing.value = nav
    }
    const currentEffigy = {}

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

    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    function getTextColor(name) {
      if (name === viewing.value) {
        return designStore.alertTheme
      } else {
        return designStore.primaryText
      }
    }

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
      statusEffectsStore,
      lightenDarkenColor,
      effigyStore,
      viewSheet,
      currentEffigy,
      viewing,
      getTextColor
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
    BarPlannerDisplay,
    StatBlockDetailedReference,
    BButton,
    IconDisplay,
    GuideMessage
  }
}
</script>

<template>
  <div>
    <div
      v-if="effigyStore.getFormedEffigiesList.length > 0"
      :style="{ background: designStore.primaryTheme }"
      style="width: 100%; display: flex"
    >
      <BButton
        @click="viewSheet('!!!!!character!!!!!')"
        style="
          font-size: x-large;
          padding: 0.25rem;
          flex-grow: 1;
          display: flex;
          justify-content: center;
          border: 1px solid;
          margin: 0.2rem;
        "
        :style="{
          background: designStore.primaryTheme,
          color: getTextColor('!!!!!character!!!!!')
        }"
        ><IconDisplay scale="2" :icon="designStore.charIcon"></IconDisplay
        >{{ characterStore.name }}'s Sheet
      </BButton>
      <BButton
        v-for="e in effigyStore.getFormedEffigiesList"
        @click="viewSheet(e.name)"
        style="
          font-size: x-large;
          padding: 0.25rem;
          flex-grow: 1;
          display: flex;
          justify-content: center;
          border: 1px solid;
          margin: 0.2rem;
        "
        :style="{ background: designStore.primaryTheme, color: getTextColor(e.name) }"
        :key="e.name"
        ><IconDisplay :icon="e.groupIcon" scale="2"></IconDisplay>{{ e.name }}'s Sheet</BButton
      >
    </div>
    <div v-if="viewing != '!!!!!character!!!!!'">
      <StatBlockDetailedReference
        v-if="viewing != '!!!!!character!!!!!'"
        :is-editing="false"
        :current-stat-block="effigyStore.effigies[viewing]"
        :lightenDarkenColor="lightenDarkenColor"
        :omitDetails="true"
        :omitVersionControl="true"
        :omitToolbar="true"
        :useIconInsteadOfPowerLevel="true"
      ></StatBlockDetailedReference>
    </div>
    <div v-else class="overviewLayout" :style="{ fontFamily: designStore.font }">
      <div style="width: fit-content" class="bannerTime">
        <CharacterStateBanner></CharacterStateBanner>
      </div>

      <div class="mobileBannnerTime"><MobileCharacterStateBanner></MobileCharacterStateBanner></div>
      <GuideMessage
        class="mobileBannnerTime"
        :step="11"
        style="position: absolute; margin-left: 0rem; margin-top: 3rem"
        title="Stats Overview"
        orientation="bottom"
        guideNumber="11"
        message="Now that we are on the Overview Page, let me show you around! This Display shows you all your important resources including HP, Mana, Dvs,and MP.  It also lets you modify them in a temporary manner when they are effected by a status modifier."
      ></GuideMessage>
      <GuideMessage
        class="bannerTime"
        :step="11"
        style="position: absolute; margin-left: 10rem; margin-top: 2rem"
        title="Banner"
        orientation="left"
        guideNumber="11"
        message="Now that we are on the Overview Page, let me show you around! This Banner shows you all your important resources including HP, Mana, Dvs,and MP.  It also lets you modify them in a temporary manner when they are effected by a status modifier."
      ></GuideMessage>
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
        <GuideMessage
          :step="12"
          style="position: absolute"
          class="traitsGuidePos"
          title="Traits Ribbon"
          orientation="left"
          guideNumber="11"
          message="Once you add Traits to your character, they will appear here for easy reference.  If your traits has an ability, it will be in the list of abilities below!"
        ></GuideMessage>
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

        <GuideMessage
          :step="15"
          style="position: absolute; margin-top: -4rem"
          title="Abilities"
          orientation="top"
          guideNumber="15"
          message="This is a one stop reference for every ability available to your character, even including ones from traits and equipment. Click on an ability name to read it.  You can also filter by Action Cost, type, or search directly in the search bar."
        ></GuideMessage>
        <TitleWidget title="Abilities" style="margin-top: -0.25rem"></TitleWidget>

        <AbilitiesTable></AbilitiesTable>
      </div>
      <TurnPlanner class="turnPlanner"></TurnPlanner>
    </div>
  </div>
</template>

<style>
.traitsGuidePos {
  position: absolute;
  margin-left: 2rem;
  margin-top: -5rem;
}
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
  .traitsGuidePos {
    position: absolute;
    margin-left: 2rem;
    margin-top: -3rem;
  }
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
  .traitsGuidePos {
    position: absolute;
    margin-left: 2rem;
    margin-top: -3rem;
  }
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
@media (max-width: 500px) {
  .traitsGuidePos {
    position: absolute;
    margin-left: 2rem;
    margin-top: -5rem;
  }
}
</style>
