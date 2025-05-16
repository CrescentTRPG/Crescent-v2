<script lang="ts">
import ArrayTabs from '@/components/ArrayTabs.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { storeToRefs } from 'pinia'
import { computed, Ref, ref } from 'vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const martialSkillsStore = useMartialSkillsStore()
    const { combatStyles, specializations, allCombatStyles, allSpecializations } =
      storeToRefs(martialSkillsStore)
    const combatStylesArray = computed(() => {
      let ret: Array<any> = []
      let id = 0
      Object.keys(combatStyles.value).forEach((style: string) => {
        ret.push({ name: style, isHeader: true })

        ret = ret.concat(Object.values(allCombatStyles.value[style].skills))
      })
      return ret
    })
    const specializationsArray = computed(() => {
      let ret: Array<any> = []
      let id = 0
      Object.keys(specializations.value).forEach((style: string) => {
        ret.push({ name: style, isHeader: true })
        ret = ret.concat(Object.values(allSpecializations.value[style].skills))
      })
      return ret
    })
    const tabs = computed(() => {
      let i = 0
      let ret: Array<any> = []
      Object.keys(combatStyles.value)
        .concat(Object.keys(specializations.value))
        .forEach((skill) => ret.push({ index: i++, name: skill }))
      return ret
    })
    function startDrag(event, item, index) {
      event.dataTransfer.dropEffect = 'copy'
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('item', item)
      context.emit('draggedItem', item)
    }
    function onDrop(event) {
      const item = event.dataTransfer.getData('item')
    }
    const selectedTabs: Ref<Array<any>> = ref([])
    const weaponSkills = computed(() => {
      if (selectedTabs.value.length <= 0) {
        return combatStylesArray.value.concat(specializationsArray.value)
      } else {
        let ret: Array<any> = []
        selectedTabs.value.forEach((tab) => {
          ret.push({ name: tab.name, isHeader: true })
          if (allSpecializations.value[tab.name]?.skills) {
            ret = ret.concat(Object.values(allSpecializations.value[tab.name]?.skills))
          } else {
            ret = ret.concat(Object.values(allCombatStyles.value[tab.name]?.skills))
          }
        })
        console.log(ret)

        return ret
      }
    })

    return {
      selectedTabs,
      tabs,
      designStore,
      props,
      combatStylesArray,
      startDrag,
      onDrop,
      specializationsArray,
      weaponSkills
    }
  },
  components: { TitleMedallion, ArrayTabs }
}
</script>
<template>
  <div class="skilltabs" :style="{ background: designStore.sidebarBacking }">
    <ArrayTabs
      filteringMessage="Weapon Skill"
      :tabs="tabs"
      @selectedTabs="(tabs) => (selectedTabs = tabs)"
    ></ArrayTabs>
    <div
      style="
        max-height: 65vh;
        display: flex;
        flex-flow: column;
        flex-direction: column;
        overflow-y: scroll;
        border: 1px solid;
        border-top: 0;
        height: inherit;
      "
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        '--bs-secondary-color': designStore.inputText,
        scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
      }"
    >
      <div v-for="(skill, index) in weaponSkills" :key="index">
        <TitleMedallion v-if="skill.isHeader" :title="skill.name"></TitleMedallion>
        <div
          :style="{
            fontFamily: designStore.font,
            color: designStore.primaryText,
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          draggable="true"
          @dragstart="startDrag($event, skill, index)"
          style="
            border-radius: 0.375rem;
            margin: 0.5rem;
            padding: 0.25rem;
            cursor: grab;
            display: flex;

            justify-content: flex-start;
          "
          v-else
        >
          <i class="bi bi-grip-vertical"></i>

          <div>{{ skill.name + ' (' + skill.mp_cost + ')' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.skilltabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}
@media (max-width: 600px) {
  .skilltabs {
    display: flex;
    flex-direction: row;
    height: 12rem;
  }
}
</style>
