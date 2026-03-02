<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import { useJournalStore } from '@/stores/journalStore.ts'
import DatePicker from './DatePicker.vue'
import DisplayDate from './DisplayDate.vue'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()

    const fileType = ref('html')
    const pathForNewFile = ref('')

    function openCreateFileModal(path) {
      pathForNewFile.value = path
      modal.value = true
    }

    return {
      modal,
      userStore,
      props,
      designStore,
      fileType,
      openCreateFileModal,
      journalStore
    }
  },
  components: {
    DatePicker,
    DisplayDate
  }
}
</script>

<template>
  <div style="flex-grow: 1; display: flex; flex-direction: column">
    <div style="display: flex; justify-content: center">
      <div
        style="position: absolute"
        calss="simplifyCalender"
        :style="{ color: designStore.secondaryTheme }"
      >
        <div
          style="
            border: 2px solid;
            border-radius: 0 0 10rem 10rem;
            width: 10rem;
            height: 4rem;
            font-size: medium;
            text-align: center;
            overflow: hidden;
          "
          :style="{
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText
          }"
        >
          <DatePicker
            style="z-index: 4; cursor: pointer"
            @newValue="(date, year) => journalStore.setCurrentDate(date.index, year)"
            :orientation="'bottom'"
            :startingSection="
              journalStore.getFullDateArr[journalStore.currentDate][
                journalStore.calendar.organizedBy
              ]
            "
            :pick-year="true"
            :current-year="journalStore.currentYear"
            :default="journalStore.getFullDateArr[journalStore.currentDate].index"
            ><template v-slot:wrappedAround
              ><div style="width: 10rem">
                <DisplayDate
                  style="z-index: 4; cursor: pointer"
                  :dateObj="journalStore.getFullDateArr[journalStore.currentDate]"
                  formula="dateFormula"
                ></DisplayDate></div></template
          ></DatePicker>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
