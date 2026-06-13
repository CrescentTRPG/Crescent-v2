<script lang="ts">
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { useDesignStore } from '@/stores/designStore.ts'
import TitleWidget from '@/components/TitleWidget.vue'
import OverviewAttributes from '@/components/Character/Overview/OverviewAttributes.vue'
import StatBlockAttributes from '@/components/Adventure/Stat Blocks/StatBlockAttributes.vue'

export default {
  props: [
    'buildName',
    'buildDescription',
    'archetype',
    'archetypeDescription',
    'stats',
    'atributeDescriptions',
    'exceptionalDescription',
    'abilitiesDesciption',
    'originSkills',
    'equipment',
    'originSkillsDescription',
    'lunarMotivation',
    'lunarMotivationDescription'
  ],
  setup(props, context) {
    const modal = ref(false)

    const designStore = useDesignStore()

    return {
      designStore,
      props
    }
  },

  components: { TitleWidget, StatBlockAttributes }
}
</script>

<template>
  <div>
    <TitleWidget :title="props.buildName"></TitleWidget>
    <div style="margin: 1rem" v-html="buildDescription"></div>
    <TitleWidget title="Attributes"></TitleWidget>
    <StatBlockAttributes
      :currentStatBlock="stats"
      :isEditing="false"
      :wornArmorPassives="{}"
      :secondaryHandheldPassives="{}"
      :primaryHandheldPassives="{}"
    ></StatBlockAttributes>
    <div style="margin: 1rem" v-html="atributeDescriptions"></div>
    <TitleWidget :title="'Archetype: ' + props.archetype"></TitleWidget>
    <div style="margin: 1rem" v-html="archetypeDescription"></div>
    <TitleWidget
      :title="'Origin Skills: ' + props.originSkills[0] + ', ' + props.originSkills[1]"
    ></TitleWidget>
    <div style="margin: 1rem" v-html="props.originSkillsDescription"></div>
    <TitleWidget :title="'Lunar Motivation: ' + props.lunarMotivation"></TitleWidget>
    <div style="margin: 1rem" v-html="props.lunarMotivationDescription"></div>
    <TitleWidget title="Exceptional"></TitleWidget>
    <div style="margin: 1rem" v-html="props.exceptionalDescription"></div>
    <TitleWidget title="Equipment"></TitleWidget>
    <div style="margin: 1rem" v-html="props.equipment"></div>
    <TitleWidget title="Abilities"></TitleWidget>
    <div style="margin: 1rem" v-html="props.abilitiesDesciption"></div>
  </div>
</template>

<style scoped></style>
