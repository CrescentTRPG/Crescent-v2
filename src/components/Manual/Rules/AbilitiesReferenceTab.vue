<script lang="ts">
import { computed, ComputedRef, Ref, ref, useTemplateRef, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import _ from 'lodash'
import { useManualStore } from '@/stores/manualStore.ts'
import VuePdfEmbed from 'vue-pdf-embed'
import TitleWidget from '@/components/TitleWidget.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import ReferenceSearch from './ReferenceSearch.vue'
import { lightenDarkenColor } from '@/Utility.ts'
import { ManualSpell, useSpellStore } from '@/stores/spellsStore.ts'
import { storeToRefs } from 'pinia'
import CustomPagination from '@/components/CustomPagination.vue'
import { BFormInput, BPopover, BTable } from 'bootstrap-vue-next'
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import MartialSkillDisplay from '@/components/MartialSkillDisplay.vue'
import { LiteralUnion } from 'bootstrap-vue-next/src/types/LiteralUnion.js'
import { a } from 'vitest/dist/suite-dWqIFb_-.js'
import { ManualMartialPerk, useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import ArrayTabs from '@/components/ArrayTabs.vue'
import CustomModal from '@/components/CustomModal.vue'
import {
  ManualCombatStyle,
  ManualSpecialization,
  useMartialSkillsStore
} from '@/stores/martialSkillsStore.ts'
import { ManualSkill, useSkillStore } from '@/stores/skillsStore.ts'
import { PerformanceAbility, usePerformanceStore } from '@/stores/performanceStore.ts'
import FilterByActionCost from '@/components/Character/Overview/FilterByActionCost.vue'
import { aB } from 'vitest/dist/reporters-w_64AS5f.js'
import { isConstructorDeclaration } from 'typescript'
import FilterByType from '../FilterByType.vue'
import InputRange from '@/components/InputRange.vue'
import IconDisplay from '@/components/IconDisplay.vue'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const manualStore = useManualStore()
    const spellStore = useSpellStore()
    const martialPerksStore = useMartialPerksStore()
    const { manualMartialPerks } = storeToRefs(martialPerksStore)
    const skillsStore = useSkillStore()
    const { allSkills } = storeToRefs(skillsStore)
    const martialSkillsStore = useMartialSkillsStore()
    const { allCombatStyles, allSpecializations } = storeToRefs(martialSkillsStore)
    const { manualSpellgroups } = storeToRefs(spellStore)
    const performanceStore = usePerformanceStore()
    const { manualPerformanceStyles } = storeToRefs(performanceStore)
    const designStore = useDesignStore()
    const perPage = ref(15)
    const currentModal = ref(0)
    const actionCost = ref({ value: 0, name: 'Any' })
    const type = ref({ value: 0, name: 'Any' })
    const rankMin = ref(0)
    const rankMax = ref(10)
    const targetMin = ref('Caster')
    const targetMax = ref('none')
    const excludedAreaValueMap = ref([])
    const excludedRangeValueMap = ref([])

    const filterOn = [
      'name',
      'group',
      'actionCost',
      'spellgroup',
      'perkGroup',
      'rank',
      'skill',
      'area',
      'target',
      'type'
    ]
    function getMedallion(group: string) {
      switch (group) {
        case 'Offensive Perks':
          return 'gi-swords-power'
        case 'Defensive Perks':
          return 'gi-heavy-helm'
        case 'Utility Perks':
          return 'gi-gear-hammer'
        case 'Supportive Perks':
          return 'gi-heart-shield'

        default:
          return false
      }
    }
    const filter = ref('')
    function scrollbarColor() {
      let sec = designStore.secondaryTheme
      let prim = designStore.primaryTheme
      return sec + ' ' + prim
    }
    function showModal(id: number) {
      currentModal.value = id
      modal.value = !modal.value
    }
    const groupFilters: Ref<Array<String>> = ref([])
    const groupFilterNames: Ref<Array<String>> = computed(() => {
      let ret: Array<string> = []
      groupFilters.value.forEach((group: any) => {
        ret.push(group.name)
      })
      return ret
    })

    const spells = computed(() => {
      let groups = Object.values(manualSpellgroups.value)
      let spells: Array<ManualSpell> = []
      groups.forEach((group: any) => {
        if (groupFilterNames.value.length >= 1) {
          if (groupFilterNames.value.includes('Spells')) {
            spells = spells.concat(getGroupSpellsSorted(group.spells))
          } else if (groupFilterNames.value.includes(group.name)) {
            spells = spells.concat(getGroupSpellsSorted(group.spells))
          }
        } else {
          spells = spells.concat(getGroupSpellsSorted(group.spells))
        }
      })
      return spells
    })
    const perks = computed(() => {
      let perks: Array<ManualMartialPerk> = Object.values(manualMartialPerks.value)
      perks = perks.filter((perk) => {
        if (groupFilterNames.value.length >= 1) {
          if (groupFilterNames.value.includes('Perks')) {
            return perk
          }
          if (groupFilterNames.value.includes(perk.perkGroup)) {
            return perk
          }
        } else {
          return perk
        }
      })
      return perks.sort((a: ManualMartialPerk, b: ManualMartialPerk) => a.rank - b.rank)
    })

    const martialSkills = computed(() => {
      let combatStyles: Array<ManualCombatStyle> = Object.values(allCombatStyles.value).sort(
        (a: any, b: any) => {
          let aCode = a.attributes.length
          let bCode = b.attributes.length
          if (a.attributes.includes('Agility')) {
            aCode -= 1
          } else {
            aCode += 2
          }
          if (b.attributes.includes('Agility')) {
            bCode -= 1
          } else {
            bCode += 2
          }
          return aCode - bCode
        }
      )
      let specializations: Array<ManualSpecialization> = Object.values(
        allSpecializations.value
      ).sort((a: any, b: any) => {
        let aCode = a.name.charCodeAt(0)
        let bCode = b.name.charCodeAt(0)
        if (aCode - bCode == 0) {
          aCode = a.name.charCodeAt(1)
          bCode = b.name.charCodeAt(1)
          if (aCode - bCode == 0) {
            aCode = a.name.charCodeAt(2)
            bCode = b.name.charCodeAt(2)
          }
        }
        return aCode - bCode
      })
      let martialSkills: Array<ManualCombatStyle | ManualSpecialization> = []
      martialSkills = martialSkills.concat(combatStyles)
      martialSkills = martialSkills.concat(specializations)
      if (groupFilterNames.value.length === 0) {
        return martialSkills
      }
      if (
        groupFilterNames.value.includes('Martial Skills') ||
        (groupFilterNames.value.includes('Combat Styles') &&
          groupFilterNames.value.includes('Specializations'))
      ) {
        return martialSkills
      }
      if (groupFilterNames.value.includes('Specializations')) {
        return specializations
      }

      if (groupFilterNames.value.includes('Combat Styles')) {
        return combatStyles
      }
      return []
    })
    const generalActions: ComputedRef<Array<ManualMartialPerk>> = computed(() => {
      return groupFilterNames.value.length === 0 ||
        groupFilterNames.value.includes('General Actions')
        ? (Object.values(manualStore.generalActions) as Array<ManualMartialPerk>)
        : ([] as Array<ManualMartialPerk>)
    })
    const performance: ComputedRef<Array<PerformanceAbility>> = computed(() => {
      const styles = Object.keys(manualPerformanceStyles.value)
      let ret: Array<PerformanceAbility> = []
      styles.forEach((style) => {
        let styles: Array<PerformanceAbility> = Object.values(
          manualPerformanceStyles.value[style].styles
        ).map((ability: any) => ({
          ...ability,
          groupIcon: manualPerformanceStyles.value[style].groupIcon
        }))
        if (
          groupFilterNames.value.length === 0 ||
          groupFilterNames.value.includes('Performance Abilities')
        ) {
          ret = ret.concat(styles)
        } else if (groupFilterNames.value.includes(style)) {
          ret = ret.concat(styles)
        }
      })
      return ret.sort((a: PerformanceAbility, b: PerformanceAbility) => a.rank - b.rank)
    })
    const skills: ComputedRef<Array<ManualSkill>> = computed(() => {
      const skillsArr: Array<ManualSkill> = Object.values(allSkills.value)
      return groupFilterNames.value.length === 0 || groupFilterNames.value.includes('Skills')
        ? skillsArr
        : ([] as Array<ManualSkill>)
    })

    function getGroupSpellsSorted(spells) {
      let groupSpells: Array<ManualSpell> = Object.values(spells)
      groupSpells.sort((a: ManualSpell, b: ManualSpell) => a.rank - b.rank)
      return groupSpells
    }
    const abilities: ComputedRef<
      Array<
        | ManualSpell
        | ManualMartialPerk
        | ManualCombatStyle
        | ManualSpecialization
        | ManualSkill
        | PerformanceAbility
      >
    > = computed(() => {
      let abilities: Array<
        | ManualSpell
        | ManualMartialPerk
        | ManualCombatStyle
        | ManualSpecialization
        | ManualSkill
        | PerformanceAbility
      > = []
      abilities = abilities.concat(spells.value)
      abilities = abilities.concat(perks.value)
      abilities = abilities.concat(martialSkills.value)
      abilities = abilities.concat(skills.value)
      abilities = abilities.concat(generalActions.value)
      abilities = abilities.concat(performance.value)
      //filter actionCost
      if (actionCost.value.value != 0) {
        abilities = abilities.filter(
          (a: any) =>
            (a.actionCost && a.actionCost?.includes(actionCost.value.name)) ||
            (a.action_cost && a.action_cost?.includes(actionCost.value.name))
        )
      }

      //filter type
      if (type.value.value != 0) {
        abilities = abilities.filter(
          (a: any) =>
            (a.type && a.type?.includes(type.value.name)) || type.value.name.includes(a.type)
        )
      }
      //filter target
      if (Object.values(excludedRangeValueMap.value).length >= 1) {
        const currRange = new Set(Object.keys(excludedRangeValueMap.value))
        const allVals = ['0', '1', '2', '3', '4', '5']
        const includedRangeArr = allVals.filter((val) => !currRange.has(val))
        console.log(getRangeTranslation(includedRangeArr))
        abilities = abilities.filter((a: any) =>
          getRangeTranslation(includedRangeArr).some((sub) => {
            let ret = false
            if (sub.includes('LOS')) {
              let min = parseInt(sub.split('-')[0].substring(5))
              let max = parseInt(sub.split('-')[1])
              let targetNum = -1
              if (
                a.target &&
                a.target.includes('LOS') &&
                a.target?.indexOf('LOS') >= 0 &&
                a.target?.indexOf("'") >= 0
              ) {
                targetNum = parseInt(
                  a.target?.substring(a.target?.indexOf('LOS') + 4, a.target?.indexOf("'")) || 0
                )
              }
              console.log(min, max, targetNum)
              //console.log(targetNum, max, min)
              ret = a.target?.includes('LOS') && targetNum <= max && targetNum >= min
            } else {
              ret = a.target?.includes(sub)
            }
            console.log(ret)
            return ret
          })
        )
      }

      //filter area
      if (Object.values(excludedAreaValueMap.value).length >= 1) {
        const currRange = new Set(Object.keys(excludedAreaValueMap.value))
        const allVals = ['0', '1', '2', '3', '4', '5']
        const includedAreaArr = allVals.filter((val) => !currRange.has(val))
        console.log(getAreaTranslation(includedAreaArr))
        abilities = abilities.filter((a: any) => {
          let ret = getAreaTranslation(includedAreaArr).some((sub) => {
            return a.area?.toLowerCase()?.includes(sub) || false
          })
          return ret
        })
      }

      return abilities
    })
    function getAreaTranslation(arr) {
      let newArr: Array<String> = []
      arr.forEach((index) => {
        if (index === '0') {
          newArr.push('self')
        } else if (index === '1') {
          newArr.push('single')
        } else if (index === '2') {
          newArr.push('targets')
          newArr.push('target(s)')
        } else if (index === '3') {
          newArr.push('line')
        } else if (index === '4') {
          newArr.push('cone')
        } else {
          newArr.push('radius')
        }
      })
      return newArr
    }
    function getRangeTranslation(arr) {
      let newArr: Array<String> = []
      arr.forEach((index) => {
        if (index === '0') {
          newArr.push('Caster')
          newArr.push('Character')
        } else if (index === '1') {
          newArr.push('Touch')
          newArr.push('Melee Reach')
        } else if (index === '2') {
          newArr.push('LOS *01-30*')
        } else if (index === '3') {
          newArr.push('LOS *31-59*')
        } else if (index === '4') {
          newArr.push('LOS *60-79*')
        } else {
          newArr.push('LOS *80-1200*')
        }
      })
      return newArr
    }
    const fields = ref([
      { key: 'name', label: 'Rank - Name' },
      {
        key: 'group',
        formatter: (_value: unknown, _key?: LiteralUnion<keyof any>, item?: any) =>
          item
            ? item.spellgroup
              ? `${item.spellgroup}`
              : item.isEquipment
                ? 'Equipment'
                : item.perkGroup
                  ? `${item.perkGroup}`
                  : item.style
                    ? item.style
                    : item.attributes
                      ? 'Combat Style'
                      : `${item.mp}`
                        ? 'Weapon Attack'
                        : item.combatStyles
                          ? 'Specialization'
                          : item.groupIcon
                            ? 'General Action'
                            : 'Skill'
            : 'Something went wrong',
        label: 'Group'
      },
      { key: 'actionCost', label: 'Action Cost' },
      { key: 'target', label: 'Target' },
      { key: 'type', label: 'Type' },
      { key: 'area', label: 'Area' }
    ])
    const totalRows = ref(abilities.value.length)
    watch(abilities, (oldAb, newAb) => {
      totalRows.value = abilities.value.length
    })
    const currentPage = ref(1)
    function onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      totalRows.value = filteredItems.length
      currentPage.value = 1
    }

    function formatActionCost(actionCost: string) {
      let arr = actionCost?.split('/')
      if (arr?.length == 2) return arr[0] + ' /' + '\n' + arr[1]
      else {
        return actionCost
      }
    }
    function tableBg() {
      if (parseInt(designStore.inputBacking.substring(1), 16) >= 3000000) {
        return lightenDarkenColor(designStore.inputBacking, 10)
      }
      return lightenDarkenColor(designStore.inputBacking, -10)
    }
    function getSortedSkills(spec) {
      return spec.skills.sort(function (a, b) {
        let aVal =
          a.skillStats.type === 'Passive'
            ? 0
            : a.skillStats.modes
              ? a.skillStats[a.skillStats.modes[0]].type === 'Passive'
                ? 0
                : 100
              : 100
        let bVal =
          b.skillStats.type === 'Passive'
            ? 0
            : b.skillStats.modes
              ? b.skillStats[b.skillStats.modes[0]].type === 'Passive'
                ? 0
                : 100
              : 100
        let ret = 0
        if (aVal > bVal) ret = 1
        else if (aVal < bVal) ret = -1

        return ret
      })
    }

    const tabArray: ComputedRef<Array<any>> = computed((): Array<any> => {
      let i = 1
      let ret: Array<{ name: String; index: number; header: boolean }> = [
        { name: 'Spells', index: 0, header: true }
      ]
      Object.keys(manualSpellgroups.value).forEach((item) => {
        ret.push({ name: item, index: i++, header: false })
      })
      ret.push({ name: '', index: -1, header: true })
      ret = ret.concat([
        { name: 'Perks', index: i++, header: true },
        { name: 'Defensive Perks', index: i++, header: false },
        { name: 'Supportive Perks', index: i++, header: false },
        { name: 'Offensive Perks', index: i++, header: false },
        { name: 'Utility Perks', index: i++, header: false }
      ])
      ret.push({ name: '', index: -1, header: true })
      ret = ret.concat([
        { name: 'Martial Skills', index: i++, header: true },
        { name: 'Combat Styles', index: i++, header: false },
        { name: 'Specializations', index: i++, header: false }
      ])
      ret.push({ name: '', index: -1, header: true })
      ret.push({ name: 'Performance Abilities', index: i++, header: true })
      ret = ret.concat([
        { name: 'Dance', index: i++, header: false },
        { name: 'Instrumental', index: i++, header: false },
        { name: 'Vocal', index: i++, header: false }
      ])
      ret.push({ name: '', index: -1, header: true })
      ret.push({ name: 'Skills', index: i++, header: false })

      ret.push({ name: 'General Actions', index: i++, header: false })

      return ret
    })
    const points = [
      { index: 0, icon: 'bi bi-person-bounding-box' },
      { index: 1, icon: 'bi-hand-index' },
      { index: 2, icon: 'bi-arrow-right-short' },
      { index: 3, icon: 'bi-arrow-right' },
      { index: 4, icon: 'bi-arrow-right', transform: 'scalex(1.5)' },
      { index: 5, icon: 'bi-arrow-right', transform: 'scalex(2)' }
    ]
    const areaPoints = [
      { index: 0, icon: 'bi bi-person-bounding-box' },
      { index: 1, icon: 'bi bi-person-standing' },
      { index: 2, icon: 'bi bi-people' },
      { index: 3, icon: 'gi-straight-pipe' },
      { index: 4, icon: 'gi-triangle-target' },
      { index: 5, icon: 'gi-circle' }
    ]

    function getTypeIcon(type) {
      if (type === 'Continuous') return 'gi-duration'
      if (type === 'Focus') return 'gi-brain'
      if (type === 'Evocation') return 'gi-eclipse-flare'
      if (type && type.includes('Charged')) return 'gi-energise'
      if (type && type.includes('Activated')) return 'gi-throwing-ball'
      if (type && type.includes('Passive')) return 'gi-embrassed-energy'
      return 'gi-uncertainty'
    }
    return {
      modal,
      userStore,
      props,
      designStore,
      scrollbarColor,
      showModal,
      currentModal,
      filter,
      currentPage,
      filterOn,
      perPage,
      totalRows,
      onFiltered,
      tableBg,
      lightenDarkenColor,
      fields,
      abilities,
      manualSpellgroups,
      getSortedSkills,
      formatActionCost,
      spells,
      groupFilters,
      tabArray,
      martialSkills,
      actionCost,
      type,
      getMedallion,
      points,
      areaPoints,
      excludedAreaValueMap,
      excludedRangeValueMap,
      getTypeIcon
    }
  },
  components: {
    CustomPagination,
    BTable,
    BButton,
    AbilityDisplay,
    MartialSkillDisplay,
    TitleWidget,
    ArrayTabs,
    CustomModal,
    BFormInput,
    FilterByActionCost,
    FilterByType,
    InputRange,
    BPopover,
    IconDisplay
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }" class="rulesReferenceContainer">
    <div style="flex-grow: 1">
      <div
        style="border-left: 2px solid; margin-left: -2px"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <TitleWidget title="Abilities"></TitleWidget>

        <ArrayTabs
          filteringMessage="Ability Group"
          :tabs="tabArray"
          @selectedTabs="(tabs) => (groupFilters = tabs)"
        ></ArrayTabs>

        <FilterByActionCost
          @actionCost="
            (val) => {
              actionCost = val
            }
          "
        ></FilterByActionCost>
        <FilterByType
          @type="
            (val) => {
              type = val
            }
          "
        ></FilterByType>
        <BFormInput
          class="inputSearch"
          placeholder="Search..."
          v-model="filter"
          style="border-radius: 0; border: none; border-bottom: 2px solid"
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
        ></BFormInput>
        <div
          style="display: flex; flex-wrap: wrap; justify-content: space-around"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          <InputRange
            @valueMap="(val) => (excludedRangeValueMap = val)"
            label="Target"
            :points="points"
          ></InputRange>
          <InputRange
            @valueMap="(val) => (excludedAreaValueMap = val)"
            label="Area"
            :points="areaPoints"
          ></InputRange>
        </div>
        <BTable
          @filtered="onFiltered"
          striped
          :style="{
            fontFamily: designStore.font,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking,
            '--bs-table-striped-bg': tableBg()
          }"
          :sort-internal="true"
          :filter="filter"
          :filterable="filterOn"
          :per-page="perPage"
          :current-page="currentPage"
          headerTitle="Abilities"
          class="tableClass mobile"
          :fields="fields"
          :items="abilities"
        >
          <template #cell(name)="data">
            <div :style="{ background: designStore.inputBacking }">
              <BButton
                class="nameButton mobile"
                style="width: 100%; border: 2px solid; text-align: left"
                @click="showModal(data.index)"
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                >{{
                  data.item.rank != undefined
                    ? data.item.rank + ' - ' + (data.item.name || data.item.Name || data.item.skill)
                    : data.item.name || data.item.Name || data.item.skill
                }}</BButton
              >
              <CustomModal
                :showModal="modal && currentModal == data.index"
                :title="
                  data.item.rank != undefined
                    ? (data.item.name || data.item.Name || data.item.skill) + ' - ' + data.item.rank
                    : data.item.name || data.item.Name || data.item.skill
                "
                @close="showModal(data.index)"
              >
                <template v-slot:body>
                  <AbilityDisplay
                    v-if="
                      data.item.spellgroup ||
                      data.item.perkGroup ||
                      (!(data.item.attributes || data.item.combatStyles || data.item.mp) &&
                        !data.item.skill &&
                        !data.item.Movement)
                    "
                    :medallion="
                      manualSpellgroups[data.item.spellgroup as any]?.groupIcon ||
                      data.item.groupIcon ||
                      getMedallion(data.item.perkGroup) ||
                      'gi-cubes'
                    "
                    :description="data.item.description || ''"
                    :area="data.item.area || ''"
                    :duration="data.item.duration || ''"
                    :action-cost="data.item.actionCost || ''"
                    :resistance="data.item.resistance || ''"
                    :target="data.item.target || ''"
                    :type="data.item.type || ''"
                  ></AbilityDisplay>

                  <div
                    v-if="data.item.attributes || data.item.combatStyles"
                    style="padding-bottom: 0.5rem; border-top: 2px solid"
                    :style="{ borderColor: designStore.secondaryTheme }"
                  >
                    <div v-for="skill in getSortedSkills(data.item)" :key="skill.name">
                      <MartialSkillDisplay
                        :title="skill.name"
                        :description="skill.description"
                        :mpCost="skill.mp_cost"
                      ></MartialSkillDisplay>
                    </div>
                  </div>
                  <div v-if="data.item.skill != undefined" v-html="data.item.description"></div>
                </template>
              </CustomModal>
            </div>
          </template>

          <template #cell(group)="data">
            <div class="fullGroup">
              {{
                data.item
                  ? data.item.isEquipment
                    ? 'Equipment'
                    : data.item.spellgroup
                      ? `${data.item.spellgroup}`
                      : data.item.perkGroup
                        ? `${data.item.perkGroup}`
                        : data.item.attributes
                          ? 'Combat Style'
                          : data.item.combatStyles
                            ? 'Specialization'
                            : data.item.isTrait
                              ? 'Trait'
                              : data.item.mp
                                ? 'Martial Attack'
                                : data.item.Movement
                                  ? 'Fauna Transformation'
                                  : data.item.style
                                    ? data.item.style
                                    : data.item.groupIcon
                                      ? 'General Actions'
                                      : 'Skill'
                  : 'Something went wrong'
              }}
            </div>
            <BPopover
              class="iconGroup"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              :click="true"
              :close-on-hide="true"
              :delay="{ show: 0, hide: 0 }"
              placement="top"
              ><template #target>
                <IconDisplay
                  class="iconGroup"
                  scale="1.5"
                  fontsize="1.5rem"
                  :icon="
                    manualSpellgroups[data.item.spellgroup as any]?.groupIcon ||
                    data.item.groupIcon ||
                    getMedallion(data.item.perkGroup) ||
                    'gi-uncertainty'
                  "
                  :color="designStore.primaryText"
                ></IconDisplay>
              </template>
              <div
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
              >
                {{
                  data.item
                    ? data.item.isEquipment
                      ? 'Equipment'
                      : data.item.spellgroup
                        ? `${data.item.spellgroup}`
                        : data.item.perkGroup
                          ? `${data.item.perkGroup}`
                          : data.item.attributes
                            ? 'Combat Style'
                            : data.item.combatStyles
                              ? 'Specialization'
                              : data.item.isTrait
                                ? 'Trait'
                                : data.item.mp
                                  ? 'Martial Attack'
                                  : data.item.Movement
                                    ? 'Fauna Transformation'
                                    : data.item.style
                                      ? data.item.style
                                      : data.item.groupIcon
                                        ? 'General Actions'
                                        : 'Skill'
                    : 'Something went wrong'
                }}
              </div>
            </BPopover>
          </template>
          <template #cell(actionCost)="data">
            <div style="white-space: pre-line">
              {{ formatActionCost(data.item.actionCost as string) || 'Variable' }}
            </div>
          </template>
          <template #cell(type)="data">
            <div class="nonMobileType">{{ data.item.type }}</div>
            <div class="mobileType">
              <BPopover
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                :click="true"
                :close-on-hide="true"
                :delay="{ show: 0, hide: 0 }"
                placement="top"
                ><template #target>
                  <IconDisplay
                    scale="1.5"
                    fontsize="1.5rem"
                    :icon="getTypeIcon(data.item.type)"
                    :color="designStore.primaryText"
                  ></IconDisplay>
                </template>
                <div
                  :style="{
                    background: designStore.primaryTheme,
                    color: designStore.primaryText,
                    borderColor: designStore.secondaryTheme
                  }"
                >
                  {{ data.item.type }}
                </div>
              </BPopover>
            </div>
          </template>
        </BTable>

        <CustomPagination
          @currentPage="(page) => (currentPage = page)"
          :currentPage="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
        ></CustomPagination>
      </div>
    </div>
  </div>
</template>

<style>
.rulesReferenceContainer {
  display: flex;
}
.mobileType {
  display: none;
}
@media (max-width: 600px) {
  .nonMobileType {
    display: none;
  }
  .mobileType {
    display: block;
  }
  .nameButton {
    min-width: 4rem;
    word-break: break-word;
  }
}
</style>
