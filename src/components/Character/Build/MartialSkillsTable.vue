<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useCharacterStore } from '../../../stores/characterStore.ts'
import { useDesignStore } from '../../../stores/designStore.ts'
import { useMartialSkillsStore } from '../../../stores/martialSkillsStore.ts'
import { useUserStore } from '../../../stores/userStore.ts'
import CombatStylesTable from './CombatStylesTable.vue'
import SpecializationsTable from './SpecializationsTable.vue'

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
    const {
      allCombatStyles,
      allSpecializations,
      combatStyles,
      specializations,
      buildDisplayCombatStyles,
      buildDisplaySpecializations
    } = storeToRefs(martialSkillsStore)
    const buildDisplayCombatStylesClone: any = ref(buildDisplayCombatStyles.value)

    const martialSkillsMessage =
      ' Martial Skills give a character the ability to improve their basic ability: Weapon Attack.  Combat Styles and Specializations are both Martial Skills.  Combat Styles represent a base proficiency in a broad class of weapons.  To buy a rank, a character must have equal to or greater Agility or Strength depending on the Combat Style.  Each rank gives the character more MP.  Specializations represent mastery of a specific style of weapon.  To buy a new rank of a Specialization, a character must have that rank or higher in an appropriate Combat Style.'
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

    const fields = ref([{ key: 'CombatStyle' }, { key: 'Attributes' }, { key: 'Ranks' }])
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
      martialSkillsStore,
      martialSkillsMessage
    }
  },
  watch: {
    buildDisplayCombatStyles() {
      this.buildDisplayCombatStylesClone = this.buildDisplayCombatStyles
    }
  },
  methods: {
    attrString(attributes: Array<string>): string {
      let ret: string = ''
      attributes.forEach((attr) => {
        ret += attr + ' OR '
      })
      return ret.substring(0, ret.length - 4)
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    updateCombatStyle(name: any, id: any, rank: any, source: any) {
      let skillObj = {
        name: name,
        id: id,
        rank: parseInt(rank),
        source: source
      }
      this.martialSkillsStore.setCombatStyle(skillObj)
    }
  },
  components: {
    CombatStylesTable,
    SpecializationsTable,
    TitleWidget
  }
}
</script>

<template>
  <div
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <TitleWidget title="Martial Skills" :info-message="martialSkillsMessage"></TitleWidget>
    <CombatStylesTable></CombatStylesTable>
    <SpecializationsTable></SpecializationsTable>
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
