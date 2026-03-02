<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ref } from 'vue'

import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { storeToRefs } from 'pinia'
import BasicInput from '../Character/BasicInput.vue'
import CustomModal from '../CustomModal.vue'
import TitleMedallion from '../TitleMedallion.vue'
import DisplayDate from './DisplayDate.vue'
import SelectableDate from './SelectableDate.vue'

export default {
  props: ['orientation', 'startingSection', 'default', 'pickYear', 'currentYear'],
  emits: ['newValue'],
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const { getFullDateArr, calendar } = storeToRefs(journalStore)
    const adventureStore = useAdventureStore()
    const currentSection = ref(props.startingSection)
    const filteredSection = computed(() => {
      return getFullDateArr.value.filter(
        (dateObj) => dateObj[journalStore.calendar.organizedBy] === currentSection.value
      )
    })
    const cols = computed(() => {
      return 'repeat(' + journalStore.calendar.itemsInARow + ', 1fr)'
    })
    const selectedIndex = ref(props.default)
    const selectedYear = ref(props.currentYear)

    function modifyCurrentSection(am) {
      if (
        currentSection.value + am >
        Object.keys(calendar.value.sections[calendar.value.organizedBy]).length
      ) {
        currentSection.value = 1
        selectedYear.value += 1
      } else if (currentSection.value + am < 1) {
        currentSection.value = Object.keys(
          calendar.value.sections[calendar.value.organizedBy]
        ).length
        selectedYear.value -= 1
        selectedYear.value = Math.max(selectedYear.value, 1)
      } else {
        currentSection.value = currentSection.value + am
      }
    }

    function selectDate(index) {
      selectedIndex.value = index
      console.log(getFullDateArr.value[index], selectedYear.value)
      if (props.pickYear) {
        context.emit('newValue', getFullDateArr.value[index], selectedYear.value)
      } else {
        context.emit('newValue', getFullDateArr.value[index])
      }
    }
    function emitYear(val) {
      selectedYear.value = val
      context.emit(
        'newValue',
        getFullDateArr.value[selectedIndex.value],
        parseInt(selectedYear.value + '')
      )
    }
    const modal = ref(false)
    return {
      userStore,
      designStore,
      props,
      getFullDateArr,
      filteredSection,
      cols,
      modal,
      calendar,
      currentSection,
      modifyCurrentSection,
      selectedIndex,
      selectDate,
      selectedYear,
      journalStore,
      emitYear
    }
  },
  components: { SelectableDate, CustomModal, TitleMedallion, BButton, BasicInput, DisplayDate }
}
</script>

<template>
  <div style="width: fit-content">
    <div @click="modal = true">
      <slot name="wrappedAround"></slot>
    </div>
    <CustomModal :show-modal="modal" @close="modal = false" title="Select Date">
      <div v-if="pickYear">
        <DisplayDate
          style="z-index: 4; cursor: pointer"
          :dateObj="journalStore.getFullDateArr[journalStore.currentDate]"
          formula="dateFormula"
        ></DisplayDate>
      </div>
      <template v-slot:body>
        <title-medallion :color="designStore.primaryText">
          <template v-slot:dropdown>
            <b-button
              @click="modifyCurrentSection(-1)"
              :style="{ color: designStore.secondaryTheme }"
              ><i class="bi bi-caret-left-fill"></i
            ></b-button>
            <div :style="{ color: designStore.primaryText }" style="display: flex">
              <div>
                {{
                  calendar.sections[calendar.organizedBy][currentSection].name
                    ? calendar.sections[calendar.organizedBy][currentSection].name
                    : calendar.sections.names[parseInt(calendar.organizedBy)] +
                      ' : ' +
                      currentSection
                }}
              </div>
              <div style="margin-left: 0.5rem" v-if="props.pickYear">{{ selectedYear }}</div>
            </div>
            <b-button
              @click="modifyCurrentSection(1)"
              :style="{ color: designStore.secondaryTheme }"
              ><i class="bi bi-caret-right-fill"></i
            ></b-button> </template
        ></title-medallion>

        <div
          style="display: grid"
          :style="{
            color: designStore.inputText,
            'grid-template-columns': cols,
            background: designStore.inputBacking
          }"
        >
          <SelectableDate
            :selectDate="selectDate"
            v-for="date in filteredSection"
            :dateObj="date"
            :key="date"
            :selectedDate="selectedIndex"
            :year="selectedYear"
          ></SelectableDate>
        </div>
      </template>
      <template v-slot:footer v-if="pickYear">
        <BasicInput
          style="width: 100%"
          label="Current Year"
          :value="props.currentYear"
          @new-value="(val) => emitYear(val)"
        ></BasicInput>
      </template>
    </CustomModal>
  </div>
</template>

<style scoped></style>
