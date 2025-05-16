<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { computed, Ref, ref } from 'vue'
import MartialSkillTabs from './MartialSkillTabs.vue'
import WeaponSkillTab from './WeaponSkillTab.vue'
import { useCharacterStore } from '@/stores/characterStore'
import { storeToRefs } from 'pinia'
import TitleMedallion from '@/components/TitleMedallion.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

export default {
  emits: ['kill', 'dropped', 'remove', 'draggedItem', 'selection', 'newHand'],
  props: [
    'skills',
    'id',
    'strike',
    'universalModifiesSomeCosts',
    'increasedCosts',
    'hand',
    'handRestriction'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { getMp } = storeToRefs(characterStore)
    const name = ref('')
    const handOptions = computed(() => {
      if (props.handRestriction === 'any') {
        return ['Primary', 'Offhand']
      }
      return [props.handRestriction]
    })

    function onDrop(event) {
      const item = event.dataTransfer.getData('item')
      context.emit('dropped', props.strike)
    }
    function startDrag(event, item, index) {
      //console.log(item)
      context.emit('remove', props.strike)
      event.dataTransfer.dropEffect = 'copy'
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('item', item)
      context.emit('draggedItem', {
        ...item,
        conditionObj: { condition: { alternateRollstring: '' } }
      })
    }
    function kill(name) {
      context.emit('kill', props.strike, name)
    }
    const items: Ref<Array<any>> = ref([])
    const draggedItem = ref({ name: 'poopy' })
    return {
      handOptions,
      designStore,
      props,
      name,
      context,
      items,
      onDrop,
      kill,
      draggedItem,
      startDrag,
      getMp
    }
  },
  components: { WeaponSkillTab, TitleMedallion, DropdownSelect }
}
</script>
<template>
  <div>
    <div
      style="
        min-width: 10rem;
        height: 100%;
        min-height: 10rem;
        flex-grow: 1;
        border: 1px solid;
        border-top: 0;
        border-left: 0;
      "
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        '--bs-secondary-color': designStore.inputText,
        scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
      }"
      id="here"
      @drop="onDrop($event)"
      @dragenter.prevent
      @dragover.prevent
    >
      <TitleMedallion :title="props.strike">
        <template v-slot:dropdown>
          <DropdownSelect
            v-if="props.hand"
            :borderless="true"
            :options="handOptions"
            :default="props.hand"
            @selection="(selected) => context.emit('newHand', selected)"
            :color="designStore.inputText"
          ></DropdownSelect
        ></template>
      </TitleMedallion>

      <div style="display: flex">
        <div style="display: flex; flex-direction: row; flex-wrap: wrap">
          <WeaponSkillTab
            v-for="(skill, index) in props.skills"
            :key="skill.name"
            draggable="true"
            @dragstart="startDrag($event, skill, index)"
            @kill="kill(skill.name)"
            @selection="(selection) => (skill.purchasedMp = selection)"
            @setRank="(selection) => (skill.rank = selection)"
            :name="skill.name"
            :additionalMpCost="
              skill.skillStats.additionalMpCost ||
              (skill.skillStats.modes &&
                skill.skillStats[skill.skillStats.modes[0]].additionalMpCost)
            "
            :increasedCosts="props.increasedCosts"
            :isCompoundingCost="skill.skillStats.isCompoundingCost"
            :isDropdown="
              skill.skillStats.costType === 'rank' ||
              skill.skillStats.costType === 'activation + rank' ||
              (skill.skillStats.modes &&
                (skill.skillStats[skill.skillStats.modes[0]].costType === 'rank' ||
                  skill.skillStats[skill.skillStats.modes[0]].costType === 'activation + rank'))
            "
            :description="skill.description"
            :purchased="skill.purchasedMp"
            :min-cost="
              skill.skillStats.mpCost ||
              (skill.skillStats.modes && skill.skillStats[skill.skillStats.modes[0]].mpCost)
            "
            :increasedCost="props.increasedCosts"
            :universalModifiesSomeCosts="props.universalModifiesSomeCosts"
            :costMalleable="
              skill.skillStats.costMalleable ||
              (skill.skillStats.modes && skill.skillStats[skill.skillStats.modes[0]].costMalleable)
            "
            :cost-per-rank="
              skill.skillStats.additionalMpCost ||
              (skill.skillStats.modes &&
                skill.skillStats[skill.skillStats.modes[0]].additionalMpCost) ||
              skill.skillStats.mpCost ||
              (skill.skillStats.modes && skill.skillStats[skill.skillStats.modes[0]].mpCost)
            "
            :max-skill-rank="getMp"
          >
          </WeaponSkillTab>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
