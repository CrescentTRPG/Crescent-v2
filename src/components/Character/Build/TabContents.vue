<script lang="ts">
import { useRouter } from 'vue-router'

import ArchetypeWidget from '../Build/ArchetypeWidget.vue'
import RulesStatus from '../Build/RulesStatus.vue'
import MartialSkillsTable from './MartialSkillsTable.vue'
import AbilityPointWidget from '../Build/AbilityPointWidget.vue'
import ArmorLevelWidget from '../Build/ArmorLevelWidget.vue'
import AttributeContainer from '../Build/AttributeContainer.vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import SkillsTable from '../Build/SkillsTable.vue'
import MartialPerksTab from '../Build/MartialPerksTab.vue'
import SpellsTable from './SpellsTable.vue'
import TraitsTab from './TraitsTab.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import FaunaTab from './Fauna/FaunaTab.vue'
import PerformanceTab from './PerformanceTab.vue'
import EffigyTab from '../Effigy/EffigyTab.vue'
import GuideMessage from '@/components/GuideMessage.vue'
import WeaponAttackBuilderTab from '../Weapon Attack Builder Remastered/WeaponAttackBuilderTab.vue'
import { useEquipmentStore } from '@/stores/equipmentStore.ts'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'

export default {
  props: ['tab'],
  setup(props, context) {
    const router = useRouter()
    const designStore = useDesignStore()
    const equipmentStore = useEquipmentStore()
    const characterStore = useCharacterStore()
    const skillStore = useSkillStore()

    const { equipment } = storeToRefs(equipmentStore)
    return { designStore, props, equipment, characterStore, skillStore }
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
    SpellsTable,
    TraitsTab,
    TitleWidget,
    FaunaTab,
    PerformanceTab,
    WeaponAttackBuilderTab,
    EffigyTab,
    GuideMessage
  }
}
</script>

<template>
  <div id="tab-contents" style="display: flex; flex-direction: column">
    <div
      v-if="
        !(
          props.tab === 'effigy' ||
          props.tab === 'martialbuilder' ||
          props.tab === 'performance' ||
          props.tab === 'fauna'
        )
      "
      style="width: 100%; position: absolute; height: 4rem; left: -1rem; z-index: 1"
      :style="{ background: designStore.inputBacking }"
    ></div>

    <div
      class="buildInfoDisplay inputColorBackdrop"
      v-if="
        !(
          props.tab === 'effigy' ||
          props.tab === 'martialbuilder' ||
          props.tab === 'performance' ||
          props.tab === 'fauna'
        )
      "
      style="z-index: 3"
    >
      <AbilityPointWidget style="height: 4rem; align-self: flex-start"></AbilityPointWidget>

      <RulesStatus style="height: 5rem; width: 50%; z-index: 2"></RulesStatus>
    </div>
    <GuideMessage
      :step="3"
      style="position: absolute; max-width: 30rem; margin-top: 2rem"
      title="Ability Points"
      orientation="bottom"
      shift="start"
      message="This keeps track of your ability points.  Click here to set your total ability points.  The spent points will be tabulated automatically."
    ></GuideMessage>
    <GuideMessage
      :step="2"
      style="position: absolute; max-width: 50rem; z-index: 5; margin-top: 2rem"
      title="Build Status"
      orientation="bottom"
      shift="end"
      message="This is your build status.  It will let you know if there are any issues with your build as you create your character. Look out for the exclamation point! Alternatively look for the question mark for a suggestion (not a rule break, just some help!). Simply click the widget for details"
    ></GuideMessage>
    <div class="buildContent" v-if="props.tab == 'corestats'">
      <AttributeContainer class="attributeWidth"></AttributeContainer>
      <div class="archetypeHeader">
        <TitleWidget title="Archetype"></TitleWidget>

        <div class="archetypeContainer">
          <div class="archetypeDisplay">
            <GuideMessage
              :step="4"
              style="position: absolute; max-width: 30rem; margin-top: -20rem"
              title="Archetype"
              orientation="top"
              shift="start"
              message="This is where you select your character's archetype.  Archetypes are a powerful choice made at Character Creation.  Read more about them in the manual page."
            ></GuideMessage>
            <ArchetypeWidget></ArchetypeWidget>
            <ArmorLevelWidget></ArmorLevelWidget>
          </div>
        </div>
      </div>
    </div>
    <div v-if="props.tab == 'skills'"><SkillsTable></SkillsTable></div>
    <div v-if="props.tab == 'martialskills'"><MartialSkillsTable></MartialSkillsTable></div>
    <div v-if="props.tab == 'martialperks'"><MartialPerksTab></MartialPerksTab></div>
    <div v-if="props.tab == 'spells'"><SpellsTable></SpellsTable></div>
    <div v-if="props.tab == 'traits'"><TraitsTab></TraitsTab></div>
    <div v-if="props.tab == 'fauna'"><FaunaTab></FaunaTab></div>
    <div v-if="props.tab == 'effigy'"><EffigyTab></EffigyTab></div>
    <div v-if="props.tab == 'performance'"><PerformanceTab></PerformanceTab></div>
    <div v-if="props.tab == 'martialbuilder'">
      <WeaponAttackBuilderTab
        :equipment="equipment"
        :might="(skillStore.getSkills as any).Might?.rank || 0"
        :strength="characterStore.attributes.strength"
      ></WeaponAttackBuilderTab>
    </div>
  </div>
</template>

<style>
.attributeWidth {
  width: 66%;
}
.archetypeContainer {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  margin-left: 2rem;
}
.buildContent {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  z-index: 3;
}
.archetypeDisplay {
  display: flex;
  z-index: 3;
}

.buildInfoDisplay {
  display: flex;
  justify-content: space-between;
  height: 4rem;
  margin-bottom: 1rem;
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
  .archetypeHeader {
    width: 100%;
  }
  .archetypeContainer {
    display: flex;
    justify-content: center;
    flex-grow: 1;
    margin-left: 0rem;
  }
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
