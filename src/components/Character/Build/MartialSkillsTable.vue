<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'
import { BButton, BCard, BNavItem, BNavbar, BTable, BFormSelect, BThead } from 'bootstrap-vue-next'
import CustomCheckbox from '../CustomCheckbox.vue'
import { ref, onMounted, toRaw } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useMartialSkillsStore } from '../../../stores/martialSkillsStore'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'
import MartialSkillsDisplay from "@/components/MartialSkillDisplay.vue"
import SpecializationsTable from "./SpecializationsTable.vue"
import CombatStylesTable from "./CombatStylesTable.vue"



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
    const martialSkillsStore = useMartialSkillsStore()
    const { allCombatStyles, allSpecializations, combatStyles, specializations, buildDisplayCombatStyles, buildDisplaySpecializations } = storeToRefs(martialSkillsStore)
    const buildDisplayCombatStylesClone: any = ref(buildDisplayCombatStyles.value)

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

    const fields = ref([{ key: 'CombatStyle' },{key: 'Attributes'}, { key: 'Ranks' }])
    return {
      designStore,
      characterStore,
      allCombatStyles,
      userStore,
      fields,
      options,
      modal,
      currentModal,
      allSpecializations,
      buildDisplayCombatStyles,
      buildDisplayCombatStylesClone,
      combatStyles,
      specializations,
      buildDisplaySpecializations,
      martialSkillsStore
    }
  },
  watch: {
    buildDisplayCombatStyles() {
      this.buildDisplayCombatStylesClone = this.buildDisplayCombatStyles
    }
  },
  methods: {
    attrString(attributes :Array<string>):string{
      let ret :string = "";
      attributes.forEach(attr => {
        ret += attr + " OR "
      });    
      return ret.substring(0, ret.length-4)
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    updateCombatStyle(name: any, id: any, rank: any, source: any) {
        let skillObj = {
            name: name, id: id, rank: parseInt(rank), source: source
        }
        this.martialSkillsStore.setCombatStyle(skillObj)
    },
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    BTable,
    BFormSelect,
    CustomModal,
    MartialSkillsDisplay,
    CombatStylesTable,
    SpecializationsTable
  }
}
</script>

<template>
  <div
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
      <div style="margin-left: 2rem">Martial Skills</div>
      <span style="display: flex;  margin-bottom: -1rem; margin-top: -1rem;" :style="{borderColor: designStore.secondaryTheme, color:designStore.secondaryTheme}">
          <v-icon name="gi-abstract-119" style="position: relative; left: .25rem; top: .5rem"></v-icon>
          <hr :style="{borderColor: designStore.secondaryTheme}"></hr>
          <v-icon name="gi-abstract-119" style="position: relative; right: .25rem; top: .5rem"></v-icon>

        </span>
    </div>
    <CombatStylesTable ></CombatStylesTable>
    <SpecializationsTable></SpecializationsTable>
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
