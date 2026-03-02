<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { usePerformanceStore } from '@/stores/performanceStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import PerformanceTable from './PerformanceTable.vue'

export default {
  setup(props, context) {
    const skillStore = useSkillStore()
    const { skills } = storeToRefs(skillStore)
    const designStore = useDesignStore()
    const performanceStore = usePerformanceStore()
    const { performanceStyles, practicedStyles, buildDisplayAbilities } =
      storeToRefs(performanceStore)
    const styles = ref(['Vocal', 'Instrumental', 'Dance'])
    const styles2 = computed(() => {
      return styles.value.filter((style) => style != style1.value)
    })
    const styles3 = computed(() => {
      return styles2.value.filter((style) => style != style2.value)
    })
    const spentPoints = computed(() => {
      let spent = 0
      buildDisplayAbilities.value.forEach((ability) => {
        if (ability.known) {
          spent += ability.rank
        }
      })
      return spent
    })
    const total = skills.value['Performance'].rank * 2
    const style1 = ref(performanceStyles.value.style1)
    const style2 = ref(performanceStyles.value.style2)
    const style3 = ref(performanceStyles.value.style3)
    function update() {
      performanceStore.setPerformanceStyles({
        style1: style1.value,
        style2: style2.value,
        style3: style3.value
      })
    }
    function updateStyle1(val) {
      style1.value = val
      update()
    }
    function updateStyle2(val) {
      style2.value = val
      update()
    }
    function updateStyle3(val) {
      style3.value = val
      update()
    }
    return {
      styles,
      styles2,
      styles3,
      style1,
      style2,
      style3,
      designStore,
      update,
      skills,
      spentPoints,
      total,
      updateStyle3,
      updateStyle2,
      updateStyle1
    }
  },
  components: {
    TitleWidget,
    DropdownSelect,
    BInputGroupText,
    PerformanceTable
  },
  watch: {
    performanceStyles() {
      this.style1 = usePerformanceStore().performanceStyles.style1
      this.style2 = usePerformanceStore().performanceStyles.style2
      this.style3 = usePerformanceStore().performanceStyles.style3
    }
  }
}
</script>
<template>
  <div>
    <TitleWidget
      title="Performance"
      :spent="spentPoints"
      :total="total"
      units="Style Points "
      info-message="Performers gain 2 Style Points (SP) for every rank they buy in performance. At rank 1 of the performance skill, the performer may choose a performance style: Dance, Instrumental, or Vocal. A character may only use Performance abilities from the one style, until rank  5  in which the performer may choose a second style. At rank 10 a performer has mastered all styles. A performer has access to all skills associated with their choses style(s), however they may only use their practiced skills.  After each rest period, a performer may select new practiced skills, selecting abilities across all known styles until their Style Point cap is reached."
    ></TitleWidget>
    <div class="stylesContainer">
      <div style="display: flex; width: 100%">
        <BInputGroupText
          class="stylesLabel"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          >Performance Style(s)</BInputGroupText
        >
        <DropdownSelect
          class="style1"
          :borderless="true"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          :squared="true"
          :options="styles"
          :default="style1"
          @selection="(val) => updateStyle1(val)"
        ></DropdownSelect>
      </div>
      <div style="display: flex; width: 100%">
        <DropdownSelect
          :disabled="skills['Performance'].rank < 5"
          disabled-message="Unlocks at rank 5"
          :borderless="true"
          style="padding-right: 0.25rem"
          class="style2"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          :squared="true"
          :options="styles2"
          :default="style2"
          @selection="(val) => updateStyle2(val)"
        ></DropdownSelect>

        <DropdownSelect
          :disabled="skills['Performance'].rank < 10"
          disabled-message="Unlocks at rank 10"
          :borderless="true"
          class="style2"
          :squared="true"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          :options="styles3"
          :default="style3"
          @selection="(val) => updateStyle3(val)"
        ></DropdownSelect>
      </div>
    </div>
    <PerformanceTable></PerformanceTable>
  </div>
</template>
<style scoped>
.stylesContainer {
  display: flex;
}
.stylesLabel {
  width: 50%;

  border-left: 0;
  border-radius: 0;
}
.style1 {
  width: 50%;

  border-radius: 0;
}
.style2 {
  width: 50%;

  border-radius: 0;
}
.style3 {
  width: 50%;

  border-right: 0;

  border-radius: 0;
}
@media (max-width: 800px) {
  .stylesContainer {
    flex-wrap: wrap;
  }
}
</style>
