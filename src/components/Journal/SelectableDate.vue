<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ComputedRef } from 'vue'

import { useDesignStore } from '@/stores/designStore.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import DateEventDisplay from './DateEventDisplay.vue'
import DisplayDate from './DisplayDate.vue'

export default {
  props: ['dateObj', 'selectDate', 'selectedDate', 'year'],
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()

    const holidays: ComputedRef<Array<any>> = computed(() => {
      return journalStore.getHoldiays.filter((a: any) => a.dateObj.index === props.dateObj.index)
    })
    return {
      userStore,
      designStore,
      props,
      journalStore,
      holidays
    }
  },
  components: { DisplayDate, DateEventDisplay }
}
</script>

<template>
  <div>
    <div
      v-if="
        props.selectedDate === props.dateObj.index &&
        (props.year === journalStore.currentYear || !props.year)
      "
      @click="props.selectDate(null)"
      style="background-image: linear-gradient(transparent, var(--hover-color)) !important"
    >
      <div
        @click="props.selectDate(props.dateObj.index)"
        style="border-bottom: 1px solid; border-right: 1px solid; padding: 0.25rem; height: 4rem"
        :style="{ color: designStore.inputText, borderColor: designStore.secondaryTheme }"
      >
        <div
          class="selectableDate"
          style="border-radius: 10rem"
          :style="{
            background:
              props.dateObj.index === journalStore.currentDate &&
              props.year === journalStore.currentYear
                ? designStore.alertTheme
                : 'transparent',
            color:
              props.dateObj.index === journalStore.currentDate &&
              props.year === journalStore.currentYear
                ? designStore.primaryText
                : designStore.inputText
          }"
        >
          <DisplayDate
            :dateObj="props.dateObj"
            formula="miniPickerFormula"
            :drop-year="false"
          ></DisplayDate>
        </div>
        <div style="display: flex; justify-content: flex-end">
          <DateEventDisplay
            v-for="h in holidays"
            :icon="h.icon"
            :name="h.name"
            :key="h.id"
          ></DateEventDisplay>
        </div>
      </div>
    </div>
    <div
      v-else
      @click="props.selectDate(props.dateObj.index)"
      class="hoverableTransparantLinear"
      style="border-bottom: 1px solid; border-right: 1px solid; padding: 0.25rem; height: 4rem"
      :style="{ color: designStore.inputText, borderColor: designStore.secondaryTheme }"
    >
      <div
        class="selectableDate"
        style="border-radius: 10rem"
        :style="{
          background:
            props.dateObj.index === journalStore.currentDate &&
            props.year === journalStore.currentYear
              ? designStore.alertTheme
              : 'transparent',
          color:
            props.dateObj.index === journalStore.currentDate &&
            props.year === journalStore.currentYear
              ? designStore.primaryText
              : designStore.inputText
        }"
      >
        <DisplayDate
          :dateObj="props.dateObj"
          formula="miniPickerFormula"
          :drop-year="false"
        ></DisplayDate>
      </div>
      <div style="display: flex; justify-content: flex-end">
        <DateEventDisplay
          v-for="h in holidays"
          :icon="h.icon"
          :name="h.name"
          :key="h.id"
        ></DateEventDisplay>
      </div>
    </div>
  </div>
</template>

<style scoped>
.selectableDate {
  font-size: medium;
  padding: 0.25rem;
}
@media (max-width: 600px) {
  .selectableDate {
    font-size: small;
    padding: 0.15rem;
    text-align: center;
    text-overflow: ellipsis;
  }
}
</style>
