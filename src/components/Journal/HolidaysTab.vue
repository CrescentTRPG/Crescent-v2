<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ref } from 'vue'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useDesignStore } from '@/stores/designStore.ts'

import { Holiday } from '@/bases.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { BButton, BTable } from 'bootstrap-vue-next'

import BasicInput from '../Character/BasicInput.vue'
import CustomPagination from '../CustomPagination.vue'
import IconPicker from '../IconPicker.vue'
import TitleWidget from '../TitleWidget.vue'
import DatePicker from './DatePicker.vue'
import DisplayDate from './DisplayDate.vue'

export default {
  props: ['holidays', 'updateHolidays', 'label', 'updateName', 'subcontents'],
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const journalStore = useJournalStore()
    const { getFullDateArr, calendar } = storeToRefs(journalStore)

    function LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    function tableBg() {
      if (parseInt(designStore.inputBacking.substring(1), 16) >= 3000000) {
        return LightenDarkenColor(designStore.inputBacking, 10)
      }
      return LightenDarkenColor(designStore.inputBacking, -10)
    }
    function editHolidayAtId(id, val) {
      console.log(val)
      let cp = _.cloneDeep(calendar.value.holidays)
      cp[id] = val
      journalStore.editHolidays(cp)
    }
    function deleteHolidayAtId(id) {
      let cp = _.cloneDeep(calendar.value.holidays)
      delete cp[id]
      journalStore.editHolidays(cp)
    }
    function addHoliday() {
      let num = props.holidays.length
      let cp = _.cloneDeep(calendar.value.holidays)
      cp[num] = { id: num, name: '', dateObj: { day: 1, 0: 1, 1: 1 }, icon: 'gi-plain-circle' }
      journalStore.editHolidays(cp)
    }

    const fields = computed(() => {
      return [
        { key: 'dateObj', label: 'Date' },
        { key: 'name', label: ' Name' },
        { key: 'icon', label: 'Icon' },
        { key: 'actions', label: '' }
      ]
    })
    const currentPage = ref(1)
    const perPage = ref(5)

    return {
      userStore,
      designStore,
      props,
      characterStore,
      tableBg,
      fields,
      currentPage,
      perPage,
      getFullDateArr,
      journalStore,
      deleteHolidayAtId,
      editHolidayAtId,
      addHoliday,
      calendar
    }
  },
  components: {
    BTable,
    CustomPagination,
    DatePicker,
    TitleWidget,
    DisplayDate,
    BasicInput,
    IconPicker,
    BButton
  }
}
</script>

<template>
  <div style="display: flex" :style="{ color: designStore.inputText }">
    <div class="mainContainer" :style="{ background: designStore.inputBacking }">
      <p>
        Only assign holidays after your calender system has been finalized, otherwise, weird
        behaviors may occur.
      </p>

      <TitleWidget title="Holidays"></TitleWidget>
      <div style="margin-bottom: 1rem">
        <BTable
          striped
          :style="{
            fontFamily: designStore.font,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking,
            '--bs-table-striped-bg': tableBg()
          }"
          :sort-internal="true"
          class="tableClass mobile"
          :fields="fields"
          :per-page="perPage"
          :current-page="currentPage"
          :items="(Object.values(props.holidays) as Holiday[]) || []"
        >
          <template #cell(name)="data">
            <BasicInput
              :value="data.item.name"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              placeholder="Holiday Name"
              @new-value="(val) => editHolidayAtId(data.item.id, { ...data.item, name: val })"
            ></BasicInput>
          </template>
          <template #cell(dateObj)="data">
            <DatePicker
              @newValue="(date) => editHolidayAtId(data.item.id, { ...data.item, dateObj: date })"
              :orientation="'bottom'"
              :startingSection="
                calendar.holidays[data.item.id]?.dateObj[journalStore.calendar.organizedBy]
              "
              :default="calendar.holidays[data.item.id]?.dateObj.index"
              ><template v-slot:wrappedAround
                ><div class="dateCell">
                  <DisplayDate
                    :dropYear="true"
                    :dateObj="data.item.dateObj"
                    formula="dateFormula"
                  ></DisplayDate></div></template
            ></DatePicker>
          </template>
          <template #cell(icon)="data">
            <IconPicker
              class="iconCell"
              orientation="top"
              :current-icon="data.item.icon"
              @selected-icon="(val) => editHolidayAtId(data.item.id, { ...data.item, icon: val })"
            ></IconPicker>
            <IconPicker
              class="iconCellXSmall"
              orientation="top"
              :xsmall="true"
              :current-icon="data.item.icon"
              @selected-icon="(val) => editHolidayAtId(data.item.id, { ...data.item, icon: val })"
            ></IconPicker>
          </template>
          <template #cell(actions)="data">
            <BButton @click="deleteHolidayAtId(data.item.id)" style="padding: 0"
              ><i class="bi bi-x-lg"></i
            ></BButton>
          </template>
        </BTable>
        <BButton
          :style="{
            fontFamily: designStore.font,
            borderColor: designStore.secondaryTheme,
            color: designStore.primaryText,
            backgroundColor: designStore.primaryTheme,
            '--bs-table-striped-bg': tableBg()
          }"
          style="width: 100%; margin-top: -1rem"
          @click="addHoliday()"
          >Add Holiday <i class="bi bi-plus-lg"></i
        ></BButton>

        <CustomPagination
          @currentPage="(page) => (currentPage = page)"
          :currentPage="currentPage"
          :total-rows="Object.keys(props.holidays).length"
          :per-page="perPage"
        ></CustomPagination>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mainContainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1rem;
}
.dateCell {
  width: 10rem;
}
.iconCell {
}
.iconCellXSmall {
  display: none;
}
@media (max-width: 800px) {
  .dateCell {
    width: 5rem;
    padding-right: 0.5rem;

    text-overflow: ellipsis;
  }
  .iconCell {
    display: none;
  }
  .iconCellXSmall {
    display: block;
  }
  @media (max-width: 600px) {
    .dateCell {
      width: 5rem;
      padding-right: 0.5rem;

      text-overflow: ellipsis;
    }

    @media (max-width: 500px) {
      .mainContainer {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        padding: 0.5rem;
      }
      .dateCell {
        width: 2.5rem;
        padding-right: 0.25rem;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
