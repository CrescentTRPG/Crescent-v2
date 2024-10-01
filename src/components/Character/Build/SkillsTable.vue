<script lang="ts">

import { useSkillStore } from '@/stores/skillsStore'
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'
import { BButton, BTable, BFormSelect } from 'bootstrap-vue-next'
import CustomModal from '@/components/CustomModal.vue'
import CustomCheckbox from "../CustomCheckbox.vue"
import { ref, onMounted, toRaw } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { storeToRefs } from 'pinia'


interface Skill {
  skill: string
  rank: number
  source: string
  id: string
}

export default {
  setup(props, context) {
    const userStore = useUserStore()
    const characterStore = useCharacterStore()
    const designStore = useDesignStore()
    const skillStore = useSkillStore()
    const {skills, allSkills, effectiveSkills} = storeToRefs(skillStore)
    //const skills = ref(skillStore.getSkills)
    //const allSkills: any = ref(skillStore.getAllSkills)
    const effectiveSkillsClone: any = ref(structuredClone(toRaw(effectiveSkills.value)))
    const modal = ref(false)
    const currentModal = ref(0)
    const options = [
      { value: '0', text: '0' },
      { value: '1', text: '1' },
      { value: '2', text: '2' },
      { value: '3', text: '3' },
      { value: '4', text: '4' },
      { value: '5', text: '5' },
      { value: '6', text: '6' },
      { value: '7', text: '7' },
      { value: '8', text: '8' },
      { value: '9', text: '9' },
      { value: '10', text: '10' }
    ]


    const fields = ref([{ key: 'skill' }, {key: 'isOrigin?'}, { key: 'ranks' }])
    return { designStore, characterStore, effectiveSkills, userStore, skillStore, fields, skills, allSkills, effectiveSkillsClone, options, modal, currentModal }
  },
  watch: {
    effectiveSkills() {
      this.effectiveSkillsClone = ref(structuredClone(toRaw(this.effectiveSkills)))
    }
  },
  methods: {
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    update(skill: any, id: any, rank: any, source: any) {
        let skillObj = {
            skill: skill, id: id, rank: parseInt(rank), source: source
        }
        this.skillStore.setSkill(skillObj)
    },
    addOrigin(origin:any) {
        let origins = this.characterStore.getOriginSkills.concat(origin);
        this.characterStore.setOrigin(origins, this.userStore.getUserId, this.characterStore.getCharacterId)
    },
    removeOrigin(origin:any) {
        let origins = this.characterStore.originSkills.filter(e => e != origin);
        this.characterStore.setOrigin(origins, this.userStore.getUserId, this.characterStore.getCharacterId)
    }
  },
  components: {
    BButton,

    BTable,
    BFormSelect,
    CustomModal,
    CustomCheckbox
  }
}
</script>

<template>
  <div
    id="BuildTab"
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="font-size: x-large; margin-top: 1rem; padding: 0.5rem; display: flex;flex-direction: column;"
      :style="{
        fontFamily: designStore.titleFont,
        color: designStore.primaryText,
        background: designStore.primaryTheme
      }"
    >
      <div style="margin-left: 2rem">Skills</div>
      <span style="display: flex;  margin-bottom: -1rem; margin-top: -1rem;" :style="{borderColor: designStore.secondaryTheme, color:designStore.secondaryTheme}">
          <v-icon name="gi-abstract-119" style="position: relative; left: .25rem; top: .5rem"></v-icon>
          <hr :style="{borderColor: designStore.secondaryTheme}"></hr>
          <v-icon name="gi-abstract-119" style="position: relative; right: .25rem; top: .5rem"></v-icon>

        </span>
    </div>
    <BTable
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
        <CustomModal
          :showModal="modal && currentModal == data.index"
          :title="data.item.skill"
          @close="showModal(data.index)"
        >
          <template v-slot:body>
            <div v-html="data.item.description"></div>
          </template>
        </CustomModal>
      </template>
      <template #cell(isOrigin?)="data">
        <CustomCheckbox :overrideBox="''" :overrideFill="''" :isChecked="data.item.isOrigin" style="margin-left: 1rem;" :update="0" @true="addOrigin(data.item.skill)" @false="removeOrigin(data.item.skill)"></CustomCheckbox>
      </template>
      <template #cell(ranks)="data">
        <BFormSelect
          :options="options"
          v-model="effectiveSkillsClone[data.index].rank"
          :style="{
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          @change="update(data.item.skill, data.item.id, effectiveSkillsClone[data.index].rank, data.item.source)"
          style="font-size: large; border-width: 2px; width: 4rem; cursor: pointer"
        ></BFormSelect>
      </template>
    </BTable>
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
