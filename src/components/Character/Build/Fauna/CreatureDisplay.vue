<script lang="ts">
import AbilityDisplayMedallion from '@/components/AbilityDisplayMedallion.vue'
import { useDesignStore } from '@/stores/designStore'
import { useFaunaStore } from '@/stores/faunaStore'
import { BPopover } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { describe } from 'node:test'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import TraitDisplay from './TraitDisplay.vue'
import AdaptationDisplay from './AdaptationDisplay.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'

export default {
  props: ['creature', 'editable'],
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualTraits, manualAdaptations } = storeToRefs(faunaStore)
    const attributes = computed(() => {
      let ret = ''
      if (props.creature['Attribute Changes'].strength > 0) {
        ret += props.creature['Attribute Changes'].strength + ' STR, '
      }
      if (props.creature['Attribute Changes'].health > 0) {
        ret += props.creature['Attribute Changes'].health + ' HEA, '
      }
      if (props.creature['Attribute Changes'].willpower > 0) {
        ret += props.creature['Attribute Changes'].willpower + ' WIL, '
      }
      if (props.creature['Attribute Changes'].agility > 0) {
        ret += props.creature['Attribute Changes'].agility + ' AGI, '
      }
      if (props.creature['Attribute Changes'].intelligence > 0) {
        ret += props.creature['Attribute Changes'].intelligence + ' INT, '
      }
      if (props.creature['Attribute Changes'].charisma > 0) {
        ret += props.creature['Attribute Changes'].charisma + ' CHA, '
      }
      if (props.creature['Attribute Changes'].power > 0) {
        ret += props.creature['Attribute Changes'].power + ' PWR, '
      }
      if (props.creature['Attribute Changes'].perception > 0) {
        ret += props.creature['Attribute Changes'].perception + ' PER, '
      }
      return ret.substring(0, ret.length - 2) || ''
    })

    function removeTrait(trait) {
      context.emit('deleteTrait', props.creature.Traits.indexOf(trait))
    }
    function removeAdaptation(trait) {
      context.emit('deleteAdaptation', props.creature.Adaptations.indexOf(trait))
    }
    return { manualTraits, designStore, props, attributes, removeTrait, removeAdaptation }
  },
  components: { AbilityDisplayMedallion, TraitDisplay, AdaptationDisplay }
}
</script>
<template>
  <div>
    <div style="display: flex; flex-wrap: wrap">
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        class="itemsInList"
      >
        Attacks: {{ creature.Attacks }}
      </div>
      <div
        v-if="creature['HP Changes'] != 'None'"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        class="itemsInList"
      >
        Hp Changes: {{ creature['HP Changes'] + ' HP' }}
      </div>
      <div
        v-if="creature['Armor Changes'] != 'None'"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        class="itemsInList"
      >
        Armor Changes: Override to {{ creature['Armor Changes'] + ' Armor' }}
      </div>
      <div
        v-if="attributes"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        class="itemsInList"
      >
        Attribute Changes: {{ attributes }}
      </div>
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        class="itemsInList"
      >
        Movement: {{ creature.Movement }}
      </div>
    </div>
    <div :style="{ fontFamily: designStore.titleFont }" style="font-size: large">Description</div>
    <hr
      :style="{ color: designStore.secondaryTheme }"
      style="margin-top: 0.25rem; margin-bottom: 0rem"
    />
    <div style="margin: 0.5rem; margin-top: 0rem">{{ creature.Description }}</div>
    <div style="display: flex; justify-content: flex-end">
      <div style="align-self: center; font-size: large; padding-right: 0.5rem">Traits:</div>
      <div v-for="trait in creature.Traits" :key="trait">
        <TraitDisplay
          @delete="(item) => removeTrait(item)"
          :editable="props.editable"
          :trait="trait"
        ></TraitDisplay>
      </div>
    </div>
    <div style="display: flex; justify-content: flex-end">
      <div style="align-self: center; font-size: large; padding-right: 0.5rem">Adaptations:</div>
      <div v-for="adaptation in creature.Adaptations" :key="adaptation">
        <AdaptationDisplay
          @delete="(item) => removeAdaptation(item)"
          :editable="props.editable"
          :adaptation="adaptation"
        ></AdaptationDisplay>
      </div>
    </div>
    <AbilityDisplayMedallion :medallion="creature.groupIcon"></AbilityDisplayMedallion>
  </div>
</template>
<style scoped>
.itemsInList {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  border: 2px solid;
  padding: 0.25rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}
</style>
