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
import MartialSkillsDisplay from '@/components/MartialSkillDisplay.vue'

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
    const { allSpecializations, specializations, buildDisplaySpecializations } =
      storeToRefs(martialSkillsStore)
    const buildDisplaySpecializationsClone: any = ref(buildDisplaySpecializations.value)

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

    const fields = ref([
      { key: 'Specializations', class: 'w-40-max' },
      { key: 'CombatStyles', class: 'w-40' },
      { key: 'Ranks', class: 'w-10' }
    ])
    return {
      designStore,
      characterStore,
      userStore,
      fields,
      options,
      modal,
      currentModal,
      allSpecializations,
      buildDisplaySpecializationsClone,
      specializations,
      buildDisplaySpecializations,
      martialSkillsStore
    }
  },
  watch: {
    buildDisplaySpecializations() {
      this.buildDisplaySpecializationsClone = this.buildDisplaySpecializations
    }
  },
  methods: {
    combatStylesString(combatStyles: Array<string>): string {
      console.log(typeof combatStyles)
      let ret: string = ''
      combatStyles.forEach((style) => {
        ret += style + ' OR '
      })
      return ret.substring(0, ret.length - 4)
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    updateSpecialization(name: any, id: any, rank: any, source: any) {
      let skillObj = {
        name: name,
        id: id,
        rank: parseInt(rank),
        source: source
      }
      this.martialSkillsStore.setSpecialization(skillObj)
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    BTable,
    BFormSelect,
    CustomModal,
    MartialSkillsDisplay
  }
}
</script>

<template>
  <BTable
    striped
    :items="buildDisplaySpecializations"
    :fields="fields"
    style="border-top: 2px solid"
    :style="{
      bsEmphasisColor: designStore.sidebarBacking,
      bsTableStripedColor: designStore.sidebarText,
      fontFamily: designStore.font,
      borderColor: designStore.secondaryTheme,
      color: designStore.inputText,
      backgroundColor: designStore.inputBacking
    }"
    headerTitle="Skills"
    class="tableClass"
  >
    <template
      #cell(Specializations)="data"
      :style="{ background: designStore.inputBacking }"
      lg="2"
    >
      <BButton
        style="width: 100%; border: 2px solid; text-align: left"
        @click="showModal(data.index)"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        >{{ data.item.name }}</BButton
      >
      <CustomModal
        :showModal="modal && currentModal == data.index"
        :title="data.item.name"
        @close="showModal(data.index)"
      >
        <template v-slot:body>
          <div
            style="padding-bottom: 0.5rem; border-top: 2px solid"
            :style="{ borderColor: designStore.secondaryTheme }"
          >
            <div v-for="skill in data.item.skills">
              <MartialSkillsDisplay
                :title="skill.name"
                :description="skill.description"
                :mpCost="skill.mp_cost"
              ></MartialSkillsDisplay>
            </div>
          </div>
        </template>
      </CustomModal>
    </template>
    <template #cell(CombatStyles)="data">
      <div
        style="display: flex; flex-direction: column; justify-content: center; min-height: 2.25rem"
      >
        {{ combatStylesString(data.item.combatStyles) }}
      </div>
    </template>
    <template #cell(Ranks)="data">
      <BFormSelect
        :options="options"
        v-model="buildDisplaySpecializationsClone[data.index].rank"
        :style="{
          color: designStore.inputText,
          backgroundColor: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
        @change="
          updateSpecialization(
            data.item.name,
            data.item.id,
            buildDisplaySpecializationsClone[data.index].rank,
            data.item.source
          )
        "
        style="font-size: large; width: 4rem; cursor: pointer; border-width: 2px"
      ></BFormSelect>
    </template>
  </BTable>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
  --bs-emphasis-color: color !important;
}
.w-40 {
  width: 40%;
}

.w-40-max {
  width: 30%;
}
@media (max-width: 500px) {
  .w-40 {
    width: 40%;
  }

  .w-40-max {
    width: 40%;
  }
}
.w-10 {
  width: 10%;
}
</style>
