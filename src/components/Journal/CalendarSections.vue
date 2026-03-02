<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ref } from 'vue'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'

import { Section } from '@/bases.ts'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'

import _ from 'lodash'
import BasicInput from '../Character/BasicInput.vue'
import CustomModal from '../CustomModal.vue'
import CustomPagination from '../CustomPagination.vue'

export default {
  props: ['section', 'updateSection', 'label', 'updateName', 'subcontents'],
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const adventureStore = useAdventureStore()

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

    function add() {
      let num = Object.keys(props.section).length + 1
      let cp = _.cloneDeep(props.section)
      cp[num] = { key: num, name: '', arrangedVals: [], numSubsections: 0 }
      props.updateSection(cp)
    }
    function updateNumSubsection(key, num) {
      let cp = _.cloneDeep(props.section)
      cp[key].numSubsections = parseInt(num + '')
      props.updateSection(cp)
    }
    function updateArrangedVals(key, vals) {
      let cp = _.cloneDeep(props.section)
      cp[key].arrangedVals = vals.split(',')
      if (cp[key].arrangedVals[0] === '') {
        cp[key].arrangedVals = ''
      }

      props.updateSection(cp)
    }
    function sub() {
      let num = Object.keys(props.section).length
      let cp = _.cloneDeep(props.section)
      delete cp[num]
      props.updateSection(cp)
    }

    const fields = computed(() => {
      return [
        { key: 'key', label: props.label + ' Number' },
        { key: 'name', label: props.label + ' Name' },
        { key: 'subsection', label: (props.subcontents || 'Day') + '(s)' }
      ]
    })
    const currentPage = ref(1)
    const perPage = ref(5)
    const sectionName = ref(props.label)
    const contentModalNum = ref(1)
    const contentModal = ref(false)

    function showContentModal(num) {
      contentModalNum.value = num
      contentModal.value = true
    }

    return {
      userStore,
      designStore,
      props,
      characterStore,
      tableBg,
      fields,
      add,
      sub,
      currentPage,
      perPage,
      sectionName,
      showContentModal,
      contentModal,
      contentModalNum,
      updateNumSubsection,
      updateArrangedVals
    }
  },
  components: {
    BTable,
    BButton,
    CustomPagination,
    BFormInput,
    BasicInput,
    CustomModal
  }
}
</script>

<template>
  <div style="display: flex" :style="{ color: designStore.inputText }">
    <div class="mainContainer" :style="{ background: designStore.inputBacking }">
      <BasicInput
        class="desktopInput"
        :style="{ background: designStore.inputBacking }"
        label="Section Name"
        :value="props.label"
        @new-value="(name) => props.updateName(name)"
      ></BasicInput>
      <BasicInput
        class="mobileInput"
        :style="{ background: designStore.inputBacking }"
        label="Section Name"
        :label-above="true"
        :value="props.label"
        @new-value="(name) => props.updateName(name)"
      ></BasicInput>
      <div style="margin-bottom: 1rem">
        <div style="margin-bottom: 0.5rem; text-wrap: wrap; padding: 0.5rem">
          Sections are groupings that are calender significant. To translate the gregorian calendar
          into this format, I would have only one section "Month". You can have as many sections as
          you like, the first section groups Days, the next groups the previous section and so on.
        </div>
        <div
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          style="display: flex; justify-content: space-between"
        >
          <div style="padding: 0.5rem; font-size: large">{{ props.label }}(s)</div>
          <div style="display: flex">
            <BButton
              @click="add()"
              style="border-left: 1px solid; border-radius: 0"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              ><i class="bi bi-plus-lg"></i
            ></BButton>
            <BButton
              @click="sub()"
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
          :items="(Object.values(props.section) as Section[]) || []"
        >
          <template #cell(name)="data">
            <BFormInput v-model="props.section[data.item.key].name" placeholder="Name"></BFormInput>
          </template>
          <template #cell(subsection)="data">
            <div @click="showContentModal(data.item.key)">
              <div v-if="data.item.arrangedVals.length > 0" style="display: flex">
                <v-icon scale="1.25" name="gi-card-pick"></v-icon>
                <div style="display: flex">
                  <div v-for="val in data.item.arrangedVals" style="margin-left: 0.5rem" :key="val">
                    {{ val }}
                  </div>
                </div>
              </div>
              <div v-else style="display: flex">
                <v-icon scale="1.25" name="gi-progression"></v-icon>
                <div style="margin-left: 0.5rem">{{ data.item.numSubsections }}</div>
              </div>
            </div>
            <CustomModal
              :showModal="contentModal && contentModalNum === data.item.key"
              :title="
                'Contents of ' +
                props.label +
                ' ' +
                (data.item.name ? data.item.name : data.item.key)
              "
              @close="contentModal = false"
            >
              <template v-slot:body>
                <BasicInput
                  label="Incremental Content"
                  style="margin-bottom: 0.5rem"
                  :value="section[data.item.key].numSubsections"
                  @new-value="(num) => updateNumSubsection(data.item.key, num)"
                ></BasicInput>
                <BasicInput
                  label="List of Contents"
                  :placeholder="'Comma separated list of numbers, matching to ' + props.subcontents"
                  style="margin-bottom: 0.5rem"
                  :value="
                    section[data.item.key]?.arrangedVals
                      ? section[data.item.key]?.arrangedVals?.join()
                      : ''
                  "
                  @new-value="(vals) => updateArrangedVals(data.item.key, vals)"
                ></BasicInput>
                Note: If both inputs have content, the list will override
              </template>
            </CustomModal>
          </template>
        </BTable>

        <CustomPagination
          @currentPage="(page) => (currentPage = page)"
          :currentPage="currentPage"
          :total-rows="Object.keys(props.section).length"
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
.mobileInput {
  display: none;
}
.desktopInput {
  display: block;
}
@media (max-width: 720px) {
  .desktopInput {
    display: none;
  }
  .mobileInput {
    display: block;
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
</style>
