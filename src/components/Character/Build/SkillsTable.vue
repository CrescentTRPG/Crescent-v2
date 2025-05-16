<script lang="ts">
import { useSkillStore } from '@/stores/skillsStore'
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'
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
import CustomCheckbox from '../CustomCheckbox.vue'
import { ref, onMounted, toRaw, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { storeToRefs } from 'pinia'
import TitleWidget from '@/components/TitleWidget.vue'
import OneToTenDropdown from '@/components/OneToTenDropdown.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

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
    const { skills, allSkills, effectiveSkills } = storeToRefs(skillStore)
    //const skills = ref(skillStore.getSkills)
    //const allSkills: any = ref(skillStore.getAllSkills)
    const skillsMessage =
      'Skills encompass a wide range of abilities, each with different Attributes that govern them.  Everyone can attempt and perform skills on some level but gaining ranks in them will improve a characters ability to make skill checks and give them access to additional abilities and bonuses.  By deafault, a character may select two origin skills.  These skills represent skills a character is naturally better at (They have a placed roll on these skill checks)'
    const effectiveSkillsClone: any = ref(structuredClone(toRaw(effectiveSkills.value)))
    const effectiveSkillsClone2: any = ref(structuredClone(toRaw(effectiveSkills.value)))
    const options = [
      { value: 0, text: '0' },
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' },
      { value: 6, text: '6' },
      { value: 7, text: '7' },
      { value: 8, text: '8' },
      { value: 9, text: '9' },
      { value: 10, text: '10' }
    ]
    watch(effectiveSkills, async (newEffectiveSkills, old) => {
      console.log(newEffectiveSkills, 'hoorah')
      effectiveSkillsClone.value = structuredClone(toRaw(effectiveSkills.value))
    })
    const modal = ref(false)
    const currentModal = ref(0)
    const fields = ref([{ key: 'skill' }, { key: 'isOrigin?' }, { key: 'ranks' }])
    return {
      designStore,
      characterStore,
      effectiveSkills,
      userStore,
      skillStore,
      fields,
      skills,
      allSkills,
      effectiveSkillsClone,
      modal,
      currentModal,
      skillsMessage,
      options
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
      console.log(parseInt(this.designStore.inputBacking.substring(1), 16))

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
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    delay(time: number) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    updateSkill(skill: any, id: any, rank: any, source: any, index: number, attribute: string) {
      let skillObj = {
        skill: skill,
        id: id,
        rank: rank,
        source: source,
        attribute: attribute,
        index: index
      }

      this.skillStore.setSkill(skillObj)
    },
    addOrigin(origin: any, index: number) {
      let origins = this.characterStore.getOriginSkills.concat(origin)
      this.characterStore.setOrigin(
        origins,
        this.userStore.getUserId,
        this.characterStore.getCharacterId
      )
      this.skillStore.setEffectiveOriginSkill(true, index)
    },
    removeOrigin(origin: any, index: number) {
      let origins = this.characterStore.originSkills.filter((e) => e != origin)
      this.characterStore.setOrigin(
        origins,
        this.userStore.getUserId,
        this.characterStore.getCharacterId
      )
      this.skillStore.setEffectiveOriginSkill(false, index)
    }
  },
  components: {
    BButton,
    BTh,
    BTableSimple,
    BTr,
    BTd,
    BThead,
    CustomModal,
    CustomCheckbox,
    TitleWidget,
    DropdownSelect
  }
}
</script>

<template>
  <div
    id="BuildTab"
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <TitleWidget title="Skills" :info-message="skillsMessage"></TitleWidget>

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
          <BTh>Skills</BTh>
          <BTh>Is Origin?</BTh>
          <BTh> Ranks </BTh>
        </BTr>
        <BTr
          v-for="(skill, index) in effectiveSkillsClone"
          :key="skill.name"
          :style="{ background: tableBg(index), color: tableTxt(index) }"
        >
          <BTd
            ><BButton
              style="width: 100%; border: 2px solid; text-align: left"
              @click="showModal(index)"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              >{{ skill.skill }}</BButton
            >
            <CustomModal
              :showModal="modal && currentModal == index"
              :title="skill.skill"
              @close="showModal(index)"
            >
              <template v-slot:body>
                <div v-html="skill.description"></div>
              </template>
            </CustomModal>
          </BTd>
          <BTd>
            <CustomCheckbox
              :overrideBox="''"
              :overrideFill="''"
              :update="index"
              :isChecked="effectiveSkills[index as number].isOrigin || false"
              style="
                position: relative;
                bottom: 2.65rem;
                margin-left: 1rem;
                height: 0rem;
                width: inherit;
              "
              @true="addOrigin(skill.skill, index)"
              @false="removeOrigin(skill.skill, index)"
            ></CustomCheckbox>
          </BTd>
          <BTd>
            <DropdownSelect
              :default="effectiveSkillsClone[index].rank"
              style="font-size: large; width: 4.5rem; cursor: pointer; border-width: 2px"
              :options="options"
              @selection="
                (selection) =>
                  updateSkill(
                    skill.skill,
                    skill.id,
                    selection,
                    skill.source,
                    skill.index,
                    skill.attribute
                  )
              "
            ></DropdownSelect>
            <!-- <BFormSelect
              :options="options"
              v-model="effectiveSkillsClone[index].rank"
              :style="{
                color: designStore.inputText,
                backgroundColor: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              @change="
                updateSkill(
                  skill.skill,
                  skill.id,
                  effectiveSkillsClone[index].rank,
                  skill.source,
                  skill.index,
                  skill.attribute
                )
              "
              style="font-size: large; width: 4rem; cursor: pointer; border-width: 2px"
            ></BFormSelect> -->
          </BTd>
          <BTd></BTd>
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
    </BTable> -->
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
