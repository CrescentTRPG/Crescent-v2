<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { BNavItem } from 'bootstrap-vue-next'
import { ref } from 'vue'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { Day, Days } from '@/bases.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import { BButton, BInputGroupText, BTable } from 'bootstrap-vue-next'

import BNav from 'bootstrap-vue-next/src/components/BNav/BNav.vue'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AreYouSure from '../AreYouSure.vue'
import BasicInput from '../Character/BasicInput.vue'
import CustomPagination from '../CustomPagination.vue'
import DropdownSelect from '../DropdownSelect.vue'
import TitleMedallion from '../TitleMedallion.vue'
import CalendarSections from './CalendarSections.vue'
import HolidaysTab from './HolidaysTab.vue'

export default {
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const journalStore = useJournalStore()
    const { getFullDateArr, calendar } = storeToRefs(journalStore)

    let router = useRouter()
    const days: Days | any = ref({})
    function navItemStyle(item: string) {
      if (navPos.value === item) {
        return designStore.alertTheme
      } else {
        return designStore.sidebarText
      }
    }

    const navPos = ref('calendar')

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

    function newDay() {
      let dayNum = Object.keys(calendar.value.days).length + 1
      let cp = _.cloneDeep(calendar.value)

      cp.days[dayNum] = { key: dayNum, name: '' }
      journalStore.updateCalendar(cp)
    }
    function subDay() {
      let dayNum = Object.keys(calendar.value.days).length
      let cp = _.cloneDeep(calendar.value)

      delete cp.days[dayNum]
      journalStore.updateCalendar(cp)
    }

    function updateDayName(key, name) {
      let cp = _.cloneDeep(calendar.value)
      cp.days[key].name = name
      journalStore.updateCalendar(cp)
    }

    const fields = ref([
      { key: 'key', label: 'Day Number' },
      { key: 'name', label: 'Name' }
    ])
    const currentPage = ref(1)
    const perPage = ref(5)
    function updateSections(section, key) {
      let calendarClone = _.cloneDeep(journalStore.calendar)
      calendarClone.sections[key] = section
      journalStore.updateCalendar(calendarClone)
    }
    function addSection() {
      let calendarClone = _.cloneDeep(journalStore.calendar)
      let key = Object.values(calendarClone.sections).length - 1
      calendarClone.sections[key] = {}
      calendarClone.sections.names.push('New Section')
      alert('added New Section')
      journalStore.updateCalendar(calendarClone)
    }
    function updateName(name, key) {
      let calendarClone = _.cloneDeep(journalStore.calendar)
      calendarClone.sections.names[key] = name
      journalStore.updateCalendar(calendarClone)
    }

    function wipeCalendar() {
      journalStore.updateCalendar({
        days: {},
        sections: { 0: {}, names: ['month'] },
        dateFormula: ''
      })
    }
    function setDateFormula(formula) {
      let calendarClone = _.cloneDeep(journalStore.calendar)
      calendarClone.dateFormula = formula

      journalStore.updateCalendar(calendarClone)
    }
    function setMiniPickerFormula(formula) {
      let calendarClone = _.cloneDeep(journalStore.calendar)
      calendarClone.miniPickerFormula = formula

      journalStore.updateCalendar(calendarClone)
    }
    function setOrganizedBy(section) {
      let calendarClone = _.cloneDeep(journalStore.calendar)
      calendarClone.organizedBy = section
      journalStore.updateCalendar(calendarClone)
    }
    function setItemsInARow(items) {
      let calendarClone = _.cloneDeep(journalStore.calendar)
      calendarClone.itemsInARow = items
      journalStore.updateCalendar(calendarClone)
    }
    const sections = computed(() => {
      let ret: Array<{ value: number; text: string }> = []
      for (let i = 0; i < calendar.value.sections.names.length; i++) {
        ret.push({ value: i, text: calendar.value.sections.names[i] })
      }
      return ret
    })
    const currSection = ref(0)
    return {
      userStore,
      navPos,
      designStore,
      navItemStyle,
      updateName,
      characterStore,
      days,
      tableBg,
      fields,
      newDay,
      subDay,
      currentPage,
      perPage,
      journalStore,
      calendar,
      updateSections,
      sections,
      currSection,
      addSection,
      updateDayName,
      wipeCalendar,
      setDateFormula,
      setItemsInARow,
      setMiniPickerFormula,
      setOrganizedBy,
      getFullDateArr
    }
  },
  components: {
    BNav,
    BNavItem,
    TitleMedallion,
    BTable,
    BButton,
    CustomPagination,
    CalendarSections,
    DropdownSelect,
    BasicInput,
    AreYouSure,
    BInputGroupText,
    HolidaysTab
  }
}
</script>

<template>
  <div style="display: flex" :style="{ color: designStore.inputText }">
    <BNav
      vertical
      class="sidebar"
      :style="{
        background: designStore.sidebarBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
      ><BNavItem
        :style="{ color: navItemStyle('calendar'), background: designStore.sidebarBacking }"
        @click="navPos = 'calendar'"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-calendar" />
          <span class="textI">Calendar Settings</span>
        </div></BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('days'), background: designStore.sidebarBacking }"
        @click="navPos = 'days'"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-plain-circle" />
          <span class="textI">Days</span>
        </div></BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('sections'), background: designStore.sidebarBacking }"
        @click="navPos = 'sections'"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-ball-pyramid" />
          <span class="textI">Sections</span>
        </div></BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('holidays'), background: designStore.sidebarBacking }"
        @click="navPos = 'holidays'"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-party-popper" />
          <span class="textI">Holidays</span>
        </div></BNavItem
      >
    </BNav>
    <div
      v-if="navPos === 'calendar'"
      style="display: flex; flex-direction: column; width: 100%; padding: 1rem"
      :style="{ background: designStore.inputBacking }"
    >
      <TitleMedallion title="Calendar Settings"></TitleMedallion>
      <div style="display: flex; margin-bottom: 1rem; flex-direction: column">
        <BasicInput
          class="desktopInput"
          style="flex-grow: 1; margin-bottom: 0.5rem"
          placeholder="Ex: DayNum/Section0Num/Year -> 25/5/2025"
          label="Date Formula"
          @new-value="(val) => setDateFormula(val)"
          :value="calendar.dateFormula"
        ></BasicInput>
        <BasicInput
          class="mobileInput"
          style="flex-grow: 1; margin-bottom: 0.5rem"
          placeholder="Ex: DayNum/Section0Num/Year -> 25/5/2025"
          label="Date Formula"
          :label-above="true"
          @new-value="(val) => setDateFormula(val)"
          :value="calendar.dateFormula"
        ></BasicInput>

        <p style="margin: 0.25rem">Use the following key words to contruct how dates looks:</p>
        <p style="margin: 0.25rem">"DayNum": The number of the day</p>
        <p style="margin: 0.25rem">
          "DayName": The name of the day (will default top number if name is not present)
        </p>
        <p style="margin: 0.25rem">"Section0Num": The number of the smallest section.</p>
        <p style="margin: 0.25rem">
          "Section0Name": The number of the smallest section. Ex: January
        </p>
        <p style="margin: 0.25rem">
          "Section[enumerator]Num": The number of a section corresponding to the inputted enumerator
        </p>
        <p style="margin: 0.25rem">
          "Section[enumerator]Name": The name of a section corresponding to the inputted enumerator
        </p>
        <p style="margin: 0.25rem">"Year": the year number</p>
        <TitleMedallion title="Dispay Settings"></TitleMedallion>
        <BasicInput
          class="desktopInput"
          style="flex-grow: 1; margin-bottom: 0.5rem"
          placeholder="Display on individual day in calendar"
          label="Date Picker Formula"
          @new-value="(val) => setMiniPickerFormula(val)"
          :value="calendar.miniPickerFormula"
        ></BasicInput>
        <BasicInput
          class="mobileInput"
          style="flex-grow: 1; margin-bottom: 0.5rem"
          placeholder="Display on individual day in calendar"
          label="Date Picker Formula"
          :label-above="true"
          @new-value="(val) => setMiniPickerFormula(val)"
          :value="calendar.miniPickerFormula"
        ></BasicInput>
        <BasicInput
          class="desktopInput"
          style="flex-grow: 1; margin-bottom: 0.5rem"
          placeholder="Ex: 7"
          type="number"
          label="Days in A Calendar Row"
          @new-value="(val) => setItemsInARow(val)"
          :value="calendar.itemsInARow"
        ></BasicInput>
        <BasicInput
          class="mobileInput"
          style="flex-grow: 1; margin-bottom: 0.5rem"
          placeholder="Ex: 7"
          type="number"
          :label-above="true"
          label="Days in A Calendar Row"
          @new-value="(val) => setItemsInARow(val)"
          :value="calendar.itemsInARow"
        ></BasicInput>
        <div class="mobileInput">
          <div style="padding-left: 0.5rem">Calendar Groups By</div>
        </div>
        <div
          style="display: flex; border: 3px solid; border-radius: 0.5rem"
          :style="{ borderColor: designStore.secondaryTheme }"
        >
          <BInputGroupText
            class="desktopInput"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              width: 'fit-content'
            }"
            style="border-radius: 0.5rem; border-top-right-radius: 0; border-bottom-right-radius: 0"
            >Calendar Groups By</BInputGroupText
          >
          <DropdownSelect
            @selection="(val) => setOrganizedBy(val)"
            style="flex-grow: 1"
            :default="calendar.sections.names[calendar.organizedBy || 0] || ''"
            :borderless="true"
            :options="sections"
          ></DropdownSelect>
        </div>
      </div>
      <AreYouSure
        style="display: flex; justify-content: flex-end"
        :action="'permanently reset all calendar data'"
        :passed-function="wipeCalendar"
        ><BButton
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          >WIPE ALL CALENDAR DATA <i class="bi bi-trash"></i></BButton
      ></AreYouSure>
    </div>
    <div
      v-if="navPos === 'days'"
      class="mainContainer"
      :style="{ background: designStore.inputBacking }"
    >
      <TitleMedallion title="Days"></TitleMedallion>
      <div style="margin-bottom: 1rem">
        <div style="margin-bottom: 0.5rem">
          By Default, you do not need to create days. You will be able to define days as numbers. If
          you want some or all days to have special names, define them below.
        </div>
        <div
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          style="display: flex; justify-content: space-between"
        >
          <div style="padding: 0.5rem; font-size: large">Days</div>
          <div style="display: flex">
            <BButton
              @click="newDay()"
              style="border-left: 1px solid; border-radius: 0"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              ><i class="bi bi-plus-lg"></i
            ></BButton>
            <BButton
              @click="subDay()"
              style="border-left: 1px solid; border-radius: 0"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              ><i class="bi bi-dash-lg"></i
            ></BButton>
          </div>
        </div>
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
          :items="(Object.values(calendar.days) as Day[]) || []"
        >
          <template #cell(name)="data">
            <BasicInput
              :value="calendar.days[data.item.key].value"
              placeholder="Name Day"
              @new-value="(val) => updateDayName(data.item.key, val)"
            ></BasicInput>
          </template>
        </BTable>

        <CustomPagination
          @currentPage="(page) => (currentPage = page)"
          :currentPage="currentPage"
          :total-rows="Object.keys(calendar.days).length"
          :per-page="perPage"
        ></CustomPagination>
      </div>
    </div>
    <div v-if="navPos === 'sections'" :style="{ background: designStore.inputBacking }">
      <TitleMedallion
        style="padding: 1rem; padding-bottom: 0"
        :button="true"
        :buttonIcon="'bi bi-plus-lg'"
        :buttonFunction="addSection"
      >
        <template v-slot:dropdown>
          <DropdownSelect
            class="titleDropdown"
            :default="calendar.sections.names[currSection]"
            :overrideDisplay="calendar.sections.names[currSection]"
            :options="sections"
            @selection="(val) => (currSection = val)"
            label="section"
          ></DropdownSelect>
        </template>
      </TitleMedallion>
      <CalendarSections
        :section="calendar.sections[currSection]"
        :update-section="
          (section) => {
            updateSections(section, currSection)
          }
        "
        :update-name="(name) => updateName(name, currSection)"
        :label="journalStore.calendar.sections.names[currSection]"
        :subcontents="
          currSection === 0 ? 'Day' : journalStore.calendar.sections.names[currSection - 1]
        "
      ></CalendarSections>
    </div>
    <div v-if="navPos === 'holidays'" :style="{ background: designStore.inputBacking }">
      <HolidaysTab :holidays="journalStore.getHoldiays"></HolidaysTab>
    </div>
  </div>
</template>

<style scoped>
.giIcon {
  font-size: 2rem;
}
li {
  list-style-type: none;
  text-align: start;
  padding-top: 1rem;
  width: 85%;
}
.vertical {
  display: flex;
  flex-direction: column;
}
.mobileInput {
  display: none;
}
.desktopInput {
  display: block;
}
.mainContainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1rem;
}
.sidebar {
  --bs-nav-link-padding-x: 0;
  --bs-nav-link-padding-y: 0;
  --bs-nav-link-color: color !important;
  --bs-nav-link-hover-color: color !important;
  margin-left: 0;
  width: 7.5;
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  border: solid 2px;
  /* box-shadow: inset -2px -3px 10px 2px; */
  display: flex;
  align-items: start;
  flex-direction: column;
  padding-left: 1rem;
}
.titleDropdown {
  min-width: 12rem;
}
@media (max-width: 720px) {
  .long {
    display: none;
  }
  .textI {
    display: none;
  }
  .sidebar {
    width: 4rem;
    min-width: 4rem;
  }
  .desktopInput {
    display: none;
  }
  .mobileInput {
    display: block;
  }
  .titleDropdown {
    font-size: medium;
    min-width: 6rem;
  }
  @media (max-width: 500px) {
    .mainContainer {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      padding: 0.5rem;
    }
  }
}
@media (min-width: 721px) {
  .short {
    display: none;
  }
}
</style>
