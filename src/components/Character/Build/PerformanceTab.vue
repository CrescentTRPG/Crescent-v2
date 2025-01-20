<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore'
import { BFormSelect } from 'bootstrap-vue-next'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { computed, ref } from 'vue'
import PerformanceTable from './PerformanceTable.vue'
import { usePerformanceStore } from '@/stores/performanceStore'
import { storeToRefs } from 'pinia'
import { useSkillStore } from '@/stores/skillsStore'

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
      total
    }
  },
  components: {
    TitleWidget,
    BFormSelect,
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
        <BFormSelect
          class="style1"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          v-model="style1"
          :options="styles"
          @change="update()"
        ></BFormSelect>
      </div>
      <div style="display: flex; width: 100%">
        <BFormSelect
          :disabled="skills['Performance'].rank < 5"
          class="style2"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          v-model="style2"
          :options="styles2"
          @change="update()"
        ></BFormSelect>

        <BFormSelect
          :disabled="skills['Performance'].rank < 10"
          class="style3"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          v-model="style3"
          :options="styles3"
          @change="update()"
        ></BFormSelect>
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
