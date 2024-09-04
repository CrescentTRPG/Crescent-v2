<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'

import CharacterSidebar from '../Build/CharacterSidebar.vue'
import ArchetypeWidget from '../Build/ArchetypeWidget.vue'
import RulesChecker from '../Build/RulesChecker.vue'
import AbilityPointWidget from '../Build/AbilityPointWidget.vue'
import ArmorLevelWidget from '../Build/ArmorLevelWidget.vue'
import AttributeContainer from '../Build/AttributeContainer.vue'
import { useDesignStore } from '../../../stores/designStore'
import SkillsTable from '../Build/SkillsTable.vue'

export default {
  props: ['tab'],
  setup(props, context) {
    const router = useRouter()
    const designStore = useDesignStore()
    return { designStore, props }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CharacterSidebar,
    ArchetypeWidget,
    RulesChecker,
    AbilityPointWidget,
    AttributeContainer,
    ArmorLevelWidget,
    SkillsTable
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
      <RulesChecker style="height: 4rem; align-self: flex-start"></RulesChecker
      ><AbilityPointWidget style="height: 5rem; width: 50%; z-index: 2"></AbilityPointWidget>
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
    <div v-if="props.tab == 'martialskills'">Martial Skills</div>
    <div v-if="props.tab == 'martialperks'">Martial Perks</div>
    <div v-if="props.tab == 'spells'">Spells</div>
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
