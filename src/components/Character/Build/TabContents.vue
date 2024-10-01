<script lang="ts">
import { useRouter } from 'vue-router'

import ArchetypeWidget from '../Build/ArchetypeWidget.vue'
import RulesStatus from '../Build/RulesStatus.vue'
import MartialSkillsTable from './MartialSkillsTable.vue'
import AbilityPointWidget from '../Build/AbilityPointWidget.vue'
import ArmorLevelWidget from '../Build/ArmorLevelWidget.vue'
import AttributeContainer from '../Build/AttributeContainer.vue'
import { useDesignStore } from '../../../stores/designStore'
import SkillsTable from '../Build/SkillsTable.vue'
import MartialPerksTab from '../Build/MartialPerksTab.vue'
import SpellsTable from './SpellsTable.vue'

export default {
  props: ['tab'],
  setup(props, context) {
    const router = useRouter()
    const designStore = useDesignStore()
    return { designStore, props }
  },
  methods: {},
  components: {
    ArchetypeWidget,
    RulesStatus,
    AbilityPointWidget,
    AttributeContainer,
    ArmorLevelWidget,
    SkillsTable,
    MartialSkillsTable,
    MartialPerksTab,
    SpellsTable
  }
}
</script>

<template>
  <div id="tab-contents" style="display: flex; flex-direction: column">
    <div
      style="width: 100%; position: absolute; height: 4rem; left: -1rem; z-index: 0"
      :style="{ background: designStore.inputBacking }"
    ></div>
    <div class="buildInfoDisplay">
      <AbilityPointWidget style="height: 4rem; align-self: flex-start"></AbilityPointWidget
      ><RulesStatus style="height: 5rem; width: 50%; z-index: 2"></RulesStatus>
    </div>
    <div class="buildContent" v-if="props.tab == 'corestats'">
      <AttributeContainer class="attributeWidth"></AttributeContainer>
      <div style="display: flex; justify-content: center; flex-grow: 1">
        <div class="archetypeDisplay">
          <ArchetypeWidget></ArchetypeWidget>
          <ArmorLevelWidget></ArmorLevelWidget>
        </div>
      </div>
    </div>
    <div v-if="props.tab == 'skills'"><SkillsTable></SkillsTable></div>
    <div v-if="props.tab == 'martialskills'"><MartialSkillsTable></MartialSkillsTable></div>
    <div v-if="props.tab == 'martialperks'"><MartialPerksTab></MartialPerksTab></div>
    <div v-if="props.tab == 'spells'"><SpellsTable></SpellsTable></div>
  </div>
</template>

<style>
.attributeWidth {
  width: 66%;
  margin-right: 2rem;
}
.buildContent {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
.archetypeDisplay {
  display: flex;
  z-index: 3;
}

.buildInfoDisplay {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 1200px) {
  .archetypeDisplay {
    display: flex;
    flex-direction: column;
  }
  .buildInfoDisplay {
    display: flex;
    justify-content: space-between;
  }
}
@media (max-width: 750px) {
  .buildContent {
    flex-wrap: wrap;
  }
  .attributeWidth {
    width: 100%;
    margin-right: 0;
  }
  .archetypeDisplay {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
