<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'
import { BButton, BThead, BTableSimple, BTh, BTr, BTd, BFormSelect } from 'bootstrap-vue-next'
import CustomCheckbox from '../CustomCheckbox.vue'
import { ref, onMounted, toRaw } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useMartialSkillsStore } from '../../../stores/martialSkillsStore'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'
import MartialSkillsDisplay from '@/components/MartialSkillDisplay.vue'
import OneToTenDropdown from '@/components/OneToTenDropdown.vue'

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

    const fields = ref([
      { key: 'Specializations', class: 'w-40-max' },
      { key: 'CombatStyles', class: 'w-40' },
      { key: 'Ranks', class: 'w-10' }
    ])

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

    return {
      designStore,
      characterStore,
      userStore,
      fields,
      modal,
      currentModal,
      allSpecializations,
      buildDisplaySpecializationsClone,
      specializations,
      buildDisplaySpecializations,
      martialSkillsStore,
      options
    }
  },
  watch: {
    buildDisplaySpecializations() {
      this.buildDisplaySpecializationsClone = this.buildDisplaySpecializations
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
    updateSpecialization(
      name: any,
      id: any,
      rank: any,
      source: any,
      index: number,
      combatStyles: Array<String>
    ) {
      this.buildDisplaySpecializationsClone[index].rank = rank
      let skillObj = {
        name: name,
        id: id,
        rank: rank,
        source: source,
        combatStyles: combatStyles,
        index: index
      }
      this.martialSkillsStore.setSpecialization(skillObj)
    }
  },
  components: {
    BThead,
    BTableSimple,
    BTr,
    BTh,
    BTd,
    BButton,
    CustomModal,
    MartialSkillsDisplay,
    BFormSelect
  }
}
</script>

<template>
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
        <BTh>Specializations</BTh>
        <BTh>Combat Styles</BTh>
        <BTh> Rank</BTh>
      </BTr>
      <BTr
        v-for="(specialization, index) in buildDisplaySpecializationsClone"
        :key="specialization.name"
        :style="{ background: tableBg(index), color: tableTxt(index) }"
      >
        <BTd class="w-40-max"
          ><BButton
            style="width: 100%; border: 2px solid; text-align: left"
            @click="showModal(index)"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            >{{ specialization.name }}</BButton
          >
          <CustomModal
            :showModal="modal && currentModal == index"
            :title="specialization.name"
            @close="showModal(index)"
          >
            <template v-slot:body>
              <div
                style="padding-bottom: 0.5rem; border-top: 2px solid"
                :style="{ borderColor: designStore.secondaryTheme }"
              >
                <div v-for="skill in specialization.skills" :key="skill.name">
                  <MartialSkillsDisplay
                    :title="skill.name"
                    :description="skill.description"
                    :mpCost="skill.mp_cost"
                  ></MartialSkillsDisplay>
                </div>
              </div>
            </template> </CustomModal
        ></BTd>
        <BTd class="w-40">{{ combatStylesString(specialization.combatStyles) }}</BTd>
        <BTd>
          <BFormSelect
            :options="options"
            v-model="buildDisplaySpecializationsClone[index].rank"
            :style="{
              color: designStore.inputText,
              backgroundColor: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            @change="
              updateSpecialization(
                specialization.name,
                specialization.id,
                buildDisplaySpecializationsClone[index].rank,
                specialization.source,
                specialization.index,
                specialization.combatStyles
              )
            "
            style="font-size: large; width: 4rem; cursor: pointer; border-width: 2px"
          ></BFormSelect>
        </BTd>
        <BTd></BTd>
      </BTr>
    </BThead>
  </BTableSimple>
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
