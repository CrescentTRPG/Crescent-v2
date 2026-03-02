<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed } from 'vue'

import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useJournalStore } from '@/stores/journalStore.ts'

export default {
  props: ['formula', 'dateObj', 'dropYear'],
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const adventureStore = useAdventureStore()
    const dateString = computed(() => {
      return replaceAllKeys(journalStore.calendar[props.formula])
    })
    function replaceAllKeys(str) {
      str = ' ' + str
      let reg = new RegExp('Section[0-9]Num')
      let match = str.match(reg)
      let index = match?.index || -1
      while (index >= 0) {
        const num = parseInt(str.substring(index + 7, index + 8))
        str = str.replace(reg, props.dateObj[num])
        match = str.match(reg)
        index = match?.index || -1
      }
      reg = new RegExp('Section[0-9]Name')
      match = str.match(reg)
      index = match?.index || -1

      while (index >= 0) {
        const num = parseInt(str.substring(index + 7, index + 8))
        if (journalStore.calendar.sections[num]) {
          str = str.replace(
            reg,
            journalStore.calendar.sections[num][props.dateObj[num]]?.name || props.dateObj[num]
          )
          match = str.match(reg)
          index = match?.index || -1
        } else {
          break
        }
      }
      reg = new RegExp('DayName')
      match = str.match(reg)
      index = match?.index || -1

      while (index >= 0) {
        str = str.replace(
          reg,
          journalStore.calendar.days[props.dateObj.day]?.name || props.dateObj.day
        )
        match = str.match(reg)
        index = match?.index || -1
      }
      reg = new RegExp('DayNum')
      match = str.match(reg)
      index = match?.index || -1
      while (index >= 0) {
        str = str.replace(reg, props.dateObj.day)
        match = str.match(reg)
        index = match?.index || -1
      }
      if (props.dropYear) {
        reg = new RegExp('Year')
        match = str.match(reg)
        index = match?.index || -1
        while (index >= 0) {
          str = str.replace(reg, '')
          match = str.match(reg)
          index = match?.index || -1
        }
      }
      reg = new RegExp('Year')
      match = str.match(reg)
      index = match?.index || -1
      while (index >= 0) {
        str = str.replace(reg, journalStore.currentYear)
        match = str.match(reg)
        index = match?.index || -1
      }
      return str
    }

    return {
      userStore,
      designStore,
      props,
      dateString,
      journalStore
    }
  },
  components: {}
}
</script>

<template>
  <div>
    {{ dateString }}
  </div>
</template>

<style scoped></style>
