<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import MartialSkillsDisplay from '@/components/MartialSkillDisplay.vue'
import { BButton, BTableSimple, BTd, BTh, BThead, BTr } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useCharacterStore } from '../../../stores/characterStore.ts'
import { useDesignStore } from '../../../stores/designStore.ts'
import { useMartialSkillsStore } from '../../../stores/martialSkillsStore.ts'
import { useUserStore } from '../../../stores/userStore.ts'

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
    const { allCombatStyles, combatStyles, buildDisplayCombatStyles } =
      storeToRefs(martialSkillsStore)
    const buildDisplayCombatStylesClone: any = ref(buildDisplayCombatStyles.value)

    const modal = ref(false)
    const currentModal = ref(0)

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

    const fields = ref([
      { key: 'CombatStyle', class: 'w-40-max' },
      { key: 'Attributes', class: 'w-40' },
      { key: 'Ranks', class: 'w-10' }
    ])
    return {
      designStore,
      characterStore,
      allCombatStyles,
      userStore,
      fields,
      modal,
      currentModal,
      buildDisplayCombatStyles,
      buildDisplayCombatStylesClone,
      combatStyles,
      martialSkillsStore,
      options
    }
  },
  watch: {
    buildDisplayCombatStyles() {
      this.buildDisplayCombatStylesClone = this.buildDisplayCombatStyles
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
    },
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
    updateCombatStyle(
      skill: any,
      id: any,
      rank: any,
      source: any,
      attributes: Array<string>,
      index: number
    ) {
      this.buildDisplayCombatStylesClone[index].rank = rank
      let skillObj = {
        skill: skill,
        id: id,
        rank: rank,
        attributes: attributes,
        source: source,
        index: index
      }
      this.martialSkillsStore.setCombatStyle(skillObj)
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
    DropdownSelect
  }
}
</script>

<template>
  <BTableSimple
    style="border-top: 3px solid; margin-bottom: 0"
    :style="{
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
        <BTh>Combat Styles</BTh>
        <BTh>Attributes</BTh>
        <BTh> Rank</BTh>
      </BTr>
      <BTr
        v-for="(combatStyle, index) in buildDisplayCombatStylesClone"
        :key="combatStyle.name"
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
            >{{ combatStyle.name }}</BButton
          >
          <CustomModal
            :showModal="modal && currentModal == index"
            :title="combatStyle.name"
            @close="showModal(index)"
          >
            <template v-slot:body>
              <div
                style="padding-bottom: 0.5rem; border-top: 2px solid"
                :style="{ borderColor: designStore.secondaryTheme }"
              >
                <div v-for="skill in combatStyle.skills" :key="skill.name">
                  <MartialSkillsDisplay
                    :title="skill.name"
                    :description="skill.description"
                    :mpCost="skill.mp_cost"
                  ></MartialSkillsDisplay>
                </div>
              </div>
            </template> </CustomModal
        ></BTd>
        <BTd class="w-40">{{ attrString(combatStyle.attributes) }}</BTd>
        <BTd>
          <!-- <BFormSelect
            :options="options"
            v-model="buildDisplayCombatStylesClone[index].rank"
            :style="{
              color: designStore.inputText,
              backgroundColor: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            @change="
              updateCombatStyle(
                combatStyle.name,
                combatStyle.name,
                buildDisplayCombatStylesClone[index].rank,
                combatStyle.source,
                combatStyle.attributes,
                combatStyle.index
              )
            "
            style="font-size: large; width: 4rem; cursor: pointer; border-width: 2px"
          ></BFormSelect> -->
          <DropdownSelect
            :default="buildDisplayCombatStylesClone[index].rank"
            style="
              font-size: large;
              width: 4.5rem;
              cursor: pointer;
              border-width: 2px;
              margin-left: 0rem;
            "
            :options="options"
            @selection="
              (selection) =>
                updateCombatStyle(
                  combatStyle.name,
                  combatStyle.name,
                  selection,
                  combatStyle.source,
                  combatStyle.attributes,
                  combatStyle.index
                )
            "
          ></DropdownSelect>
        </BTd>
        <BTd></BTd>
      </BTr>
    </BThead>
  </BTableSimple>
</template>

<style scoped></style>
