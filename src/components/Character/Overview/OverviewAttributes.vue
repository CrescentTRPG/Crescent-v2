<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import OverviewAttr from './OverviewAttr.vue'
import GridDiplayAttr from './GridDiplayAttr.vue'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import { storeToRefs } from 'pinia'
import { get } from 'node_modules/bootstrap-vue-next/dist/src/utils'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const statusEffectsStore = useStatusEffectStore()
    const {
      getStrength,
      getAgility,
      getPerception,
      getHealth,
      getCharisma,
      getIntelligence,
      getPower,
      getWillpower,
      getStrengthExceptionals,
      getStrengthInferiors,
      getAgilityExceptionals,
      getAgilityInferiors,
      getHealthInferiors,
      gethealthExceptionals,
      getWillpowerExceptionals,
      getWillpowerInferiors,
      getPerceptionInferiors,
      getperceptionExceptionals,
      getCharismaExceptionals,
      getCharismaInferiors,
      getIntelligenceExceptionals,
      getIntelligenceInferiors,
      getPowerExceptionals,
      getPowerInferiors
    } = storeToRefs(statusEffectsStore)
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      getStrength,
      getAgility,
      getPerception,
      getHealth,
      getCharisma,
      getIntelligence,
      getPower,
      getWillpower,
      getStrengthExceptionals,
      getStrengthInferiors,
      getAgilityExceptionals,
      getAgilityInferiors,
      getHealthInferiors,
      gethealthExceptionals,
      getWillpowerExceptionals,
      getWillpowerInferiors,
      getPerceptionInferiors,
      getperceptionExceptionals,
      getCharismaExceptionals,
      getCharismaInferiors,
      getIntelligenceExceptionals,
      getIntelligenceInferiors,
      getPowerExceptionals,
      getPowerInferiors
    }
  },
  components: { OverviewAttr, GridDiplayAttr }
}
</script>

<template>
  <div class="attributesCont" :style="{ background: designStore.inputBacking }">
    <OverviewAttr class="fullDisplay" attribute="Strength" attr-shorthand="STR"></OverviewAttr>
    <OverviewAttr class="fullDisplay" attribute="Agility" attr-shorthand="AGI"></OverviewAttr>
    <OverviewAttr class="fullDisplay" attribute="Health" attr-shorthand="HEA"></OverviewAttr>
    <OverviewAttr class="fullDisplay" attribute="Willpower" attr-shorthand="WIL"></OverviewAttr>
    <OverviewAttr class="fullDisplay" attribute="Perception" attr-shorthand="PER"></OverviewAttr>
    <OverviewAttr class="fullDisplay" attribute="Charisma" attr-shorthand="CHA"></OverviewAttr>
    <OverviewAttr class="fullDisplay" attribute="Intelligence" attr-shorthand="INT"></OverviewAttr>
    <OverviewAttr class="fullDisplay" attribute="Power" attr-shorthand="PWR"></OverviewAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Strength"
      attr-shorthand="STR"
      :exceptionals="getStrengthExceptionals"
      :inferiors="getStrengthInferiors"
      :value="getStrength"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Agility"
      attr-shorthand="AGI"
      :exceptionals="getAgilityExceptionals"
      :inferiors="getAgilityInferiors"
      :value="getAgility"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Health"
      attr-shorthand="HEA"
      :exceptionals="gethealthExceptionals"
      :inferiors="getHealthInferiors"
      :value="getHealth"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Willpower"
      attr-shorthand="WIL"
      :exceptionals="getWillpowerExceptionals"
      :inferiors="getWillpowerInferiors"
      :value="getWillpower"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Perception"
      attr-shorthand="PER"
      :exceptionals="getperceptionExceptionals"
      :inferiors="getPerceptionInferiors"
      :value="getPerception"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Charisma"
      attr-shorthand="CHA"
      :exceptionals="getCharismaExceptionals"
      :inferiors="getCharismaExceptionals"
      :value="getCharisma"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Intelligence"
      attr-shorthand="INT"
      :exceptionals="getIntelligenceExceptionals"
      :inferiors="getIntelligenceInferiors"
      :value="getIntelligence"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Power"
      attr-shorthand="PWR"
      :exceptionals="getPowerExceptionals"
      :inferiors="getPowerInferiors"
      :value="getPower"
      :attribute-status-modifiers="characterStore.attributeStatusModifiers"
      :remove-attribute-status-modifier="characterStore.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="characterStore.addNewAttributeStatusModifier"
    ></GridDiplayAttr>
  </div>
</template>

<style scoped>
.attributesCont {
  display: flex;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  justify-content: space-evenly;
}
.gridDisplay {
  display: block;
}
.fullDisplay {
  display: none;
}

@media (max-width: 900px) {
  .fullDisplay {
    display: none;
  }
  .attributesCont {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr min-content;
    column-gap: 0;
    justify-items: center;
  }
  .gridDisplay {
    display: block;
  }
}
</style>
