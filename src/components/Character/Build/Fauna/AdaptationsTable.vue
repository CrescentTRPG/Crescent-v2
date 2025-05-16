<script lang="ts">
import { useSkillStore } from '@/stores/skillsStore'

import {
  BButton,
  BTable,
  BFormSelect,
  BTh,
  BTableSimple,
  BThead,
  BTr,
  BTd
} from 'bootstrap-vue-next'
import CustomModal from '@/components/CustomModal.vue'
import { ref, onMounted, toRaw } from 'vue'
import { storeToRefs } from 'pinia'
import TitleWidget from '@/components/TitleWidget.vue'
import OneToTenDropdown from '@/components/OneToTenDropdown.vue'
import { useFaunaStore } from '@/stores/faunaStore'
import { useDesignStore } from '@/stores/designStore'

interface Skill {
  skill: string
  rank: number
  source: string
  id: string
}

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()

    //const skills = ref(skillStore.getSkills)
    //const allSkills: any = ref(skillStore.getAllSkills)

    const fields = ref([{ key: 'name' }, { key: 'description' }, { key: 'adaptiveScore' }])
    return {
      designStore,
      faunaStore,
      fields
    }
  },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    },
    tableBg(num: number) {
      if (num % 2 === 0) {
        if (parseInt(this.designStore.inputBacking.substring(1), 16) >= 3000000) {
          return this.LightenDarkenColor(this.designStore.inputBacking, 10)
        }
        return this.LightenDarkenColor(this.designStore.inputBacking, -10)
      }
      return this.designStore.inputBacking
    },
    tableTxt(num: number) {
      return this.designStore.inputText
    }
  },
  components: {
    BTh,
    BTableSimple,
    BTr,
    BTd,
    BThead
  }
}
</script>

<template>
  <div
    id="BuildTab"
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <BTableSimple
      style="border-top: 2px solid"
      :style="{
        bsEmphasisColor: designStore.sidebarBacking,
        bsTableStripedColor: designStore.sidebarText,
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText,
        backgroundColor: designStore.inputBacking
      }"
      class="tableClass"
    >
      <col />
      <col />
      <col />
      <BThead>
        <BTr
          style="border-bottom: 1px solid"
          :style="{
            fontFamily: designStore.font,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking
          }"
        >
          <BTh>Name</BTh>
          <BTh>Description</BTh>
          <BTh> Adaptive Score </BTh>
        </BTr>
        <BTr
          v-for="(adaptation, index) in faunaStore.getAdaptations"
          :key="adaptation.name"
          :style="{ background: tableBg(index), color: tableTxt(index) }"
        >
          <BTd>
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-height: 5rem;
                text-wrap: wrap;
                width: 100%;
                max-width: 6rem;
                word-wrap: break-word;
              "
            >
              {{ adaptation.name }}
            </div>
          </BTd>
          <BTd style="min-width: 10rem">
            <div
              style="
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-height: 5rem;
                width: 100%;
              "
            >
              {{ adaptation.description }}
            </div>
          </BTd>
          <BTd>
            <div
              style="display: flex; flex-direction: column; justify-content: center; height: 5rem"
            >
              {{ adaptation.adaptiveScore }}
            </div>
          </BTd>
        </BTr>
      </BThead>
    </BTableSimple>
    <!-- <BTable
    striped
      :items="effectiveSkills"
      :fields="fields"
      :style="{
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText,
        backgroundColor: designStore.inputBacking
      }"
      headerTitle="Skills"
      class="tableClass"
    >
      <template #cell(skill)="data" :style="{ background: designStore.inputBacking }">
        <BButton
          style="width: 100%; border: 2px solid; text-align: left"
          @click="showModal(data.index)"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          >{{ data.item.skill }}</BButton
        >

      </template>
      <template #cell(isOrigin?)="data">
        <CustomCheckbox :overrideBox="''" :overrideFill="''" :isChecked="data.item.isOrigin" style=" margin-left: 1rem;" :update="0" @true="addOrigin(data.item.skill)" @false="removeOrigin(data.item.skill)"></CustomCheckbox>
      </template>
      <template #cell(ranks)="data">
        <BFormSelect
          :options="options"
          v-model="adaptationsClone[data.index].rank"
          :style="{
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          @change="update(data.item.skill, data.item.id, adaptationsClone[data.index].rank, data.item.source)"
          style="font-size: large; border-width: 2px; width: 4rem; cursor: pointer"
        ></BFormSelect>
      </template>
    </BTable> -->
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
