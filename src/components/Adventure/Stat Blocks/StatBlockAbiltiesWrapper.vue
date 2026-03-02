<script lang="ts">
import { BInputGroup, BFormInput, BInputGroupText, BButton, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, onMounted, Ref, ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import { ManualSkill, useSkillStore } from '@/stores/skillsStore.ts'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { ManualSpell, useSpellStore } from '@/stores/spellsStore.ts'
import _ from 'lodash'
import ArrayTabs from '@/components/ArrayTabs.vue'
import { useEquipmentStore } from '@/stores/equipmentStore.ts'
import { usePerformanceStore } from '@/stores/performanceStore.ts'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { useManualStore } from '@/stores/manualStore.ts'
import StatBlockAbilities from './StatBlockAbilities.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { LiteralUnion } from 'bootstrap-vue-next/src/types/LiteralUnion.js'

export default {
  emits: ['ability'],
  props: [
    'isEditing',
    'currentStatBlock',
    'updateTemp',
    'currentVersion',
    'selectVersion',
    'randomized',
    'updateRandom'
  ],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const manualStore = useManualStore()
    const { martialAttacks } = storeToRefs(characterStore)
    const spellsStore = useSpellStore()
    const { manualSpellgroups } = storeToRefs(spellsStore)
    const performanceStore = usePerformanceStore()
    const { manualPerformanceStyles } = storeToRefs(performanceStore)
    const buildDisplaySpells: Ref<Array<any>> = ref([])
    const buildDisplaySpellgroups: Ref<Array<any>> = ref([])
    const buildDisplayMartialPerks: Ref<Array<any>> = ref([])
    const buildDisplaySpecializations: Ref<Array<any>> = ref([])
    const buildDisplayCombatStyles: Ref<Array<any>> = ref([])
    const buildDisplaySkills: Ref<Array<any>> = ref([])
    const buildDisplayPerformanceAbilities: Ref<Array<any>> = ref([])
    const buildDisplayPerformanceStyles: Ref<Array<any>> = ref([])
    const version = ref(props.currentVersion)
    const adventureStore = useAdventureStore()
    const manualSpellgroupsWithCustom = ref(manualSpellgroups.value)
    const knownSpellgroups = ref({})
    const spellgroupKey = ref({})
    const loading = ref(true)
    const name = ref(props.currentStatBlock.name)
    watch(props, async (newVersion, oldVersion) => {
      if (
        version.value != props.currentVersion ||
        props.randomized ||
        props.currentStatBlock.name != name.value
      ) {
        knownSpellgroups.value = { ...props.currentStatBlock.spells }
        setUpBuildDisplayFromScratch()
        version.value = props.currentVersion
        name.value = props.currentStatBlock.name
        props.updateRandom()
      }
      if (props.isEditing && buildDisplaySpells.value.length < 1) {
        setUpBuildDisplayFromScratch()
      }
    })
    onMounted(() => {
      knownSpellgroups.value = { ...props.currentStatBlock.spells }
      setUpBuildDisplayFromScratch()
    })

    function isSpellKnown(spell: ManualSpell, spellgroup: string): boolean {
      let ret = false
      if (
        props.currentStatBlock?.spells[spellgroup] &&
        props.currentStatBlock?.spells[spellgroup].spells &&
        props.currentStatBlock?.spells[spellgroup].spells[spell.name] &&
        props.currentStatBlock?.spells[spellgroup].spells[spell.name].known
      ) {
        ret = true
      }
      return ret
    }

    function sortByRankAndName(list: Array<any>) {
      return list.sort((a: any, b: any) => {
        if (a.rank === b.rank) {
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
        }
        return a.rank - b.rank
      })
    }

    function setUpBuildDisplayFromScratch() {
      if (props.isEditing) {
        addCustomAbilities()
        setUpBuildDisplayPerksFromScratch()
        setUpBuildSpecializationDisplayFromScratch()
        setUpBuildDisplayCombatStylesFromScratch()
        setUpBuildDisplaySkillsFromScratch()
        setUpBuildDisplayPerformanceFromScratch()
      } else {
        loading.value = false
      }
    }

    function setUpBuildDisplayPerformanceFromScratch() {
      const abilities: Array<any> = []
      const styleGroups: Array<any> = []
      let index = 0
      let styleIndex = 0
      Object.entries(manualPerformanceStyles.value).map(([style]) => {
        const stylesArray = sortByRankAndName(
          Object.values(manualPerformanceStyles.value[style].styles)
        )
        let groupStyleIndex = 0
        stylesArray.forEach((ability: any) => {
          ability.known = isPracticed(style, ability.name)
          ability.groupNumber = index
          ability.styleIndex = styleIndex
          ability.source = 'base'
          ability.groupStyleIndex = groupStyleIndex
          ability.style = style
          groupStyleIndex += 1
          styleIndex += 1
        })
        abilities.push(...stylesArray)
        styleGroups.push({
          ...manualPerformanceStyles.value[style],
          abilities: stylesArray,
          index: index
        })
        index++
      })
      buildDisplayPerformanceAbilities.value = abilities
      buildDisplayPerformanceStyles.value = styleGroups
    }
    function isPracticed(style: string, abilityName: string) {
      let ret = false
      if (
        props.currentStatBlock.practicedStyles[style] &&
        props.currentStatBlock.practicedStyles[style][abilityName] &&
        props.currentStatBlock.practicedStyles[style][abilityName].known
      ) {
        ret = true
      }
      return ret
    }
    function setUpBuildDisplaySkillsFromScratch() {
      let effectiveSkillsArr: Array<any> = Object.values(allSkills.value)
      effectiveSkillsArr.sort((a: any, b: any) => {
        let aCode = a.skill.charCodeAt(0)
        let bCode = b.skill.charCodeAt(0)
        if (aCode - bCode == 0) {
          aCode = a.skill.charCodeAt(1)
          bCode = b.skill.charCodeAt(1)
          if (aCode - bCode == 0) {
            aCode = a.skill.charCodeAt(2)
            bCode = b.skill.charCodeAt(2)
          }
        }
        return aCode - bCode
      })
      const ret: Array<any> = []
      let index = 0
      effectiveSkillsArr.forEach((skill: ManualSkill) => {
        const obj = {
          id: props.currentStatBlock.skills[skill.skill]?.id || '',
          skill: skill.skill,
          rank: props.currentStatBlock.skills[skill.skill]?.rank || 0,
          source: props.currentStatBlock.skills[skill.skill]?.source || 'Base',
          description: skill.description,
          attribute: skill.attribute,
          isOrigin: false,
          index: index
        }
        ret.push(obj)
        index += 1
      })
      buildDisplaySkills.value = ret
    }

    function setUpBuildDisplayCombatStylesFromScratch() {
      const allCombatStylesArr = sortByRankAndName(Object.values(allCombatStyles.value))
      const ret: Array<{
        name: string
        id: string
        skills: Array<any>
        source: string
        rank: number
        attributes: Array<string>
        index: number
        groupIcon: string
      }> = []
      let index = 0
      allCombatStylesArr.forEach((combatStyle) => {
        const obj = {
          id: props.currentStatBlock.combatStyles[combatStyle.name]?.id || '',
          skills: Object.values(combatStyle.skills),
          source: combatStyle.source,
          name: combatStyle.name,
          rank: props.currentStatBlock.combatStyles[combatStyle.name]?.rank || 0,
          attributes: combatStyle.attributes,
          index: index,
          groupIcon: combatStyle.groupIcon
        }
        ret.push(obj)
        index += 1
      })
      buildDisplayCombatStyles.value = ret
    }

    function setUpBuildSpecializationDisplayFromScratch() {
      const allSpecializationsArr = sortByRankAndName(Object.values(allSpecializations.value))
      let index = 0
      const ret: Array<{
        name: string
        id: string
        skills: Array<any>
        source: string
        rank: number
        combatStyles: Array<string>
        groupIcon: string
      }> = []
      allSpecializationsArr.forEach((specialization) => {
        const obj = {
          id: props.currentStatBlock.specializations[specialization.name]?.id || '',
          skills: Object.values(specialization.skills),
          source: specialization.source,
          name: specialization.name,
          rank: props.currentStatBlock.specializations[specialization.name]?.rank || 0,
          combatStyles: specialization.combatStyles,
          index: index,
          groupIcon: specialization.groupIcon
        }
        ret.push(obj)
        index += 1
      })
      buildDisplaySpecializations.value = ret
    }

    function setUpBuildDisplayPerksFromScratch() {
      const perks: Array<any> = []
      let index = 0

      sortByRankAndName(Object.values(manualMartialPerks.value)).forEach((martialPerk: any) => {
        perks.push({
          name: martialPerk.name,
          description: martialPerk.description,
          rank: martialPerk.rank,
          source: martialPerk.source,
          known: props.currentStatBlock.perks[martialPerk.name]?.known ? true : false,
          actionCost: martialPerk.actionCost,
          duration: martialPerk.duration,
          type: martialPerk.type,
          target: martialPerk.target,
          resistance: martialPerk.resistance,
          area: martialPerk.area,
          perkGroup: martialPerk.perkGroup,
          perkIndex: index
        })
        index += 1
      })
      buildDisplayMartialPerks.value = perks
    }

    function addCustomAbilities() {
      console.log('add Custom')
      Object.values(adventureStore.customAbilites).forEach((a: any) => {
        if (a.type === 'Spellgroup' && a.statBlockAccessible) {
          manualSpellgroupsWithCustom.value[a.name] = a
          console.log(a)
        }
      })
      console.log(manualSpellgroupsWithCustom.value)
      determineIfDanglingAbilities()
    }
    function determineIfDanglingAbilities() {
      const list: Array<any> = Object.values(manualSpellgroupsWithCustom.value)
      list.forEach((group) => {
        if (
          group.source == 'custom' &&
          !adventureStore.customAbilites[group.name]?.statBlockAccessible
        ) {
          console.log(group)
          delete manualSpellgroupsWithCustom.value[group.name]
          let temp = _.cloneDeep(props.currentStatBlock)
          delete temp.spells[group.name]
          props.updateTemp(temp)
        }
      })
      setUpBuildDisplaySpellsFromScratch()
    }

    function setUpBuildDisplaySpellsFromScratch() {
      loading.value = true
      const spells: Array<any> = []
      const spellgroups: Array<any> = []
      let index = 0
      let spellIndex = 0
      Object.entries(manualSpellgroupsWithCustom.value).map(([spellgroup]) => {
        const spellsArray = sortByRankAndName(
          Object.values(manualSpellgroupsWithCustom.value[spellgroup]?.spells)
        )
        let groupSpellIndex = 0
        let acc: Array<any> = []
        spellsArray.forEach((spell: any) => {
          spell.known = isSpellKnown(spell, spellgroup) || false
          let ret = {
            ...spell,
            known: isSpellKnown(spell, spellgroup) || false,
            groupNumber: index,
            spellIndex: spellIndex,
            groupSpellIndex: groupSpellIndex
          }
          if (spell.known) {
            knownSpellgroups.value[spellgroup].spells[spell.name].spellIndex = spellIndex
            knownSpellgroups.value[spellgroup].spells[spell.name].groupSpellIndex = groupSpellIndex
            knownSpellgroups.value[spellgroup].spells[spell.name].groupNumber = index
          }
          groupSpellIndex += 1
          spellIndex += 1
          acc.push(ret)
        })
        spells.push(...acc)
        spellgroups.push({
          ...manualSpellgroupsWithCustom.value[spellgroup],
          spells: acc,
          index: index
        })
        spellgroupKey.value[spellgroup] = index
        index++
      })

      buildDisplaySpells.value = spells
      buildDisplaySpellgroups.value = spellgroups
      loading.value = false
    }

    function setUpBuildDisplaySpells(spellChanged: any) {
      if (buildDisplaySpellgroups.value.length > 1 && buildDisplaySpells.value.length > 1) {
        if (spellChanged != undefined && spellChanged.name) {
          buildDisplaySpellgroups.value[spellChanged.groupNumber].spells[
            spellChanged.groupSpellIndex
          ].known = spellChanged.known
          buildDisplaySpells.value[spellChanged.spellIndex].known = spellChanged.known
        }
      } else {
        addCustomAbilities()
      }
    }
    function setUpBuildDisplayPerks(perkChanged) {
      if (buildDisplayMartialPerks.value.length > 1) {
        if (perkChanged != undefined && perkChanged.name) {
          buildDisplayMartialPerks.value[perkChanged.perkIndex].known = perkChanged.known
        }
      } else {
        setUpBuildDisplayPerksFromScratch()
      }
    }

    function setUpBuildSpecializationDisplay(specializationChanged) {
      if (buildDisplaySpecializations.value.length > 1) {
        if (specializationChanged != undefined && specializationChanged.rank) {
          buildDisplaySpecializations.value[specializationChanged.index].rank =
            specializationChanged.rank
        }
      } else {
        setUpBuildSpecializationDisplayFromScratch()
      }
    }

    function setUpBuildCombatStylesDisplay(combatStyleChanged) {
      if (buildDisplayCombatStyles.value.length > 1) {
        if (combatStyleChanged != undefined && combatStyleChanged.rank) {
          buildDisplayCombatStyles.value[combatStyleChanged.index].rank = combatStyleChanged.rank
        }
      } else {
        setUpBuildDisplayCombatStylesFromScratch()
      }
    }

    function setUpBuildDisplaySkills(skillChanged) {
      if (buildDisplaySkills.value.length > 1) {
        if (skillChanged != undefined && skillChanged.skill) {
          buildDisplaySkills.value[skillChanged.index].rank = skillChanged.rank
        }
      } else {
        setUpBuildDisplaySkillsFromScratch()
      }
    }
    function setUpBuildDisplayPerformance(styleChanged: any) {
      if (
        buildDisplayPerformanceAbilities.value.length > 1 &&
        buildDisplayPerformanceStyles.value.length > 1
      ) {
        if (styleChanged.name) {
          buildDisplayPerformanceStyles.value[styleChanged.groupNumber].abilities[
            styleChanged.groupStyleIndex
          ].known = styleChanged.known
          buildDisplayPerformanceAbilities.value[styleChanged.styleIndex].known = styleChanged.known
        }
      } else {
        setUpBuildDisplayPerformanceFromScratch()
      }
    }

    const martialSkillsStore = useMartialSkillsStore()
    const { allSpecializations, allCombatStyles } = storeToRefs(martialSkillsStore)
    const martialPerksStore = useMartialPerksStore()
    const { manualMartialPerks } = storeToRefs(martialPerksStore)
    const skillStore = useSkillStore()
    const { allSkills } = storeToRefs(skillStore)
    const equipmentStore = useEquipmentStore()
    const faunaStore = useFaunaStore()
    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'group', 'actionCost', 'spellgroup', 'perkGroup', 'rank', 'skill']
    const filter = ref('')
    const editingFields = ref([
      { key: 'name', label: 'Rank - Name' },
      {
        key: 'cost',
        label: 'Cost',
        formatter: (_value: unknown, _key?: LiteralUnion<keyof any>, item?: any) =>
          item
            ? item.spellgroup
              ? `${item.rank} Mana`
              : item.uses
                ? item.uses
                : item.Movement
                  ? `${item.rank} Mana`
                  : item.perkGroup
                    ? `${item.type}`
                    : item.mp
                      ? `${item.mp}` + ' MP'
                      : item.style
                        ? `${item.type}`
                        : 'No Cost'
            : 'Something went wrong'
      },

      {
        key: 'group',
        formatter: (_value: unknown, _key?: LiteralUnion<keyof any>, item?: any) =>
          item
            ? item.spellgroup
              ? `${item.spellgroup}`
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
      { key: 'known', label: 'Known?' }
    ])
    const fields = ref([
      { key: 'name', label: 'Rank - Name' },
      {
        key: 'cost',
        label: 'Cost',
        formatter: (_value: unknown, _key?: LiteralUnion<keyof any>, item?: any) =>
          item
            ? item.spellgroup
              ? `${item.rank} Mana`
              : item.uses
                ? item.uses
                : item.Movement
                  ? `${item.rank} Mana`
                  : item.perkGroup
                    ? `${item.type}`
                    : item.mp
                      ? `${item.mp}` + ' MP'
                      : item.style
                        ? `${item.type}`
                        : 'No Cost'
            : 'Something went wrong'
      },

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
      { key: 'addStatus', label: 'Add Status' }
    ])
    const spells: ComputedRef<Array<any>> = computed(() => {
      let groups: any
      if (props.isEditing) {
        groups = buildDisplaySpellgroups.value
      } else {
        groups = Object.values(props.currentStatBlock.spells)
      }
      let spells: Array<any> = []
      groups.forEach((group) => {
        let spellx = Object.values(group.spells)

        spells = spells.concat(spellx)
      })

      return spells
    })

    function getSpellsAtLoc(spellgroup) {
      let group: any = props.currentStatBlock.spells[spellgroup]
      if (props.isEditing) {
        group = buildDisplaySpellgroups.value[spellgroupKey.value[spellgroup]]
      }
      let spellz: Array<any> = []
      if (group) {
        spellz = Object.values(group.spells)
      }
      return spellz || []
    }

    const generalActions = computed(() => {
      return Object.values(manualStore.generalActions) || []
    })

    const martialPerks: ComputedRef<Array<any>> = computed(() => {
      let perks: any
      if (props.isEditing) {
        perks = buildDisplayMartialPerks.value
      } else {
        perks = Object.values(manualMartialPerks.value).filter(
          (perk: any) => props.currentStatBlock.perks[perk.name]?.known
        )
      }
      let knownPerks: Array<any> = []
      sortByRankAndName(perks).forEach((perk) => {
        let perkx = {
          ...perk,
          known: buildDisplayMartialPerks[perk.name]?.known ? true : false,
          groupIcon: getMedallion(perk.perkGroup),
          perkIndex: perk.perkIndex
        }
        knownPerks.push(perkx)
      })
      return knownPerks || []
    })

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
      }
    }

    const combatStyles: ComputedRef<Array<any>> = computed(() => {
      let skills: any
      if (props.isEditing) {
        skills = buildDisplayCombatStyles.value
      } else {
        skills = buildDisplayCombatStyles.value.filter((spec) => spec.rank > 0)
        skills = Object.values(props.currentStatBlock.combatStyles)
      }
      let styles: Array<any> = []
      skills.forEach((combatStyle) => {
        let skillx = allCombatStyles.value[combatStyle.name]
        if (skillx) {
          let skilly = {
            ...skillx,
            actionCost: 'Core Action',
            index: combatStyle.index,
            rank: combatStyle.rank,
            skills: Object.values(skillx.skills)
          }

          styles.push(skilly)
        }
      })
      return styles || []
    })

    const specializations: ComputedRef<Array<any>> = computed(() => {
      let skills: any
      if (props.isEditing) {
        skills = buildDisplaySpecializations.value
      } else {
        skills = buildDisplaySpecializations.value.filter((spec) => spec.rank > 0)
        skills = Object.values(props.currentStatBlock.specializations)
      }
      let styles: Array<any> = []
      skills.forEach((spec) => {
        let specx = allSpecializations.value[spec.name]
        let specy = {
          ...specx,
          actionCost: 'Core Action',
          index: spec.index,
          rank: spec.rank,
          skills: Object.values(specx.skills)
        }

        styles.push(specy)
      })
      return styles || []
    })

    const skills: ComputedRef<Array<any>> = computed(() => {
      let skillsArr: any = buildDisplaySkills.value
      if (!props.isEditing) {
        skillsArr = skillsArr.filter((skill) => skill.rank > 0)
      }
      let skillsRet: Array<any> = []
      skillsArr.forEach((skillx) => {
        skillsRet.push({ ...buildDisplaySkills.value[skillx.index], name: skillx.skill })
      })
      return skillsRet || []
    })

    const knownTraits: ComputedRef<Array<any>> = computed(() => {
      let traits = Object.values(props.currentStatBlock.traits)
      let abilities: Array<any> = []
      traits.forEach((trait: any) => {
        if (trait.ability) abilities.push({ ...trait.ability, groupIcon: trait.icon })
      })
      return abilities || []
    })
    const knownMartialAttacks = computed(() => {
      return Object.values(martialAttacks.value)
    })

    const performanceAbilities: ComputedRef<Array<any>> = computed(() => {
      let groups: any
      if (props.isEditing) {
        return buildDisplayPerformanceAbilities.value
      } else {
        groups = Object.values(props.currentStatBlock.practicedStyles)
      }
      let styles: Array<any> = []
      groups.forEach((group) => {
        let abilities = Object.values(group)
        styles = styles.concat(abilities)
      })

      return styles
    })

    const tabObject: ComputedRef<any> = computed((): any => {
      let index = 0
      let arr = {}
      if (spells.value.length > 0) {
        arr['Spells'] = { known: true, name: 'Spells', index: index++ }
        let groups
        if (props.isEditing) {
          groups = manualSpellgroupsWithCustom.value
          Object.values(groups).map(
            (group: any) =>
              (arr[group.name] = {
                name: group.name,
                index: index++,
                known: true
              })
          )
        } else {
          groups = props.currentStatBlock.spells
          Object.keys(groups).map(
            (group: any) =>
              (arr[group] = {
                name: group,
                index: index++,
                known: true
              })
          )
        }
      }

      if (martialPerks.value.length > 0) {
        arr['Martial Perks'] = { known: true, name: 'Martial Perks', index: index++ }
      }
      if (combatStyles.value.length > 0) {
        arr['Combat Styles'] = { known: true, name: 'Combat Styles', index: index++ }
      }
      if (specializations.value.length > 0) {
        arr['Specializations'] = { known: true, name: 'Specializations', index: index++ }
      }
      if (skills.value.length > 0) {
        arr['Skills'] = { known: true, name: 'Skills', index: index++ }
      }
      if (!props.isEditing && knownTraits.value.length >= 1) {
        arr['Traits'] = { known: true, name: 'Traits', index: index++ }
      }
      // if (!props.isEditing) {
      //   arr['Equipment'] = { known: true, name: 'Equipment', index: index++ }
      // }
      if (performanceAbilities.value.length > 0) {
        arr['Performance'] = { known: true, name: 'Performance', index: index++ }
      }
      // if (!props.isEditing) {
      //   arr['Fauna Transformations'] = {
      //     known: true,
      //     name: 'Fauna Transformations',
      //     index: index++
      //   }
      // }
      // if (!props.isEditing) {
      //   arr['Martial Attacks'] = {
      //     known: true,
      //     name: 'Martial Attacks',
      //     index: index++
      //   }
      // }
      if (!props.isEditing) {
        arr['General Actions'] = {
          known: true,
          name: 'General Actions',
          index: index++
        }
      }

      return arr
    })

    const selectedTabs: Ref<Array<any>> = ref([])

    let knownAbilities: ComputedRef<Array<any>> = computed(() => {
      let abilities: Array<any> = []
      if (selectedTabs.value && selectedTabs.value.length > 0) {
        selectedTabs.value.forEach((tab) => {
          if (tab.name === 'Skills') {
            abilities = abilities.concat(skills.value)
          }
          if (tab.name === 'Specializations') {
            abilities = abilities.concat(specializations.value)
          }
          if (tab.name === 'Combat Styles') {
            abilities = abilities.concat(combatStyles.value)
          }
          if (tab.name === 'Traits') {
            abilities = abilities.concat(knownTraits.value)
          }
          if (tab.name === 'Equipment') {
            abilities = abilities.concat(equipmentStore.getAbilitites)
          }
          if (tab.name === 'Performance') {
            abilities = abilities.concat(performanceAbilities.value)
          }
          if (tab.name === 'Martial Perks') {
            abilities = abilities.concat(martialPerks.value)
          }
          if (tab.name === 'Fauna Transformations') {
            abilities = abilities.concat(faunaStore.getCreatures)
          }
          if (tab.name == 'Martial Attacks') {
            abilities = abilities.concat(knownMartialAttacks.value)
          }
          if (tab.name === 'General Actions') {
            abilities = abilities.concat(generalActions.value)
          }
          if (tab.name === 'Spells') {
            abilities = abilities.concat(spells.value)
          } else {
            if (
              tab.name != 'Skills' &&
              tab.name != 'Specializations' &&
              tab.name != 'Traits' &&
              tab.name != 'Martial Perks' &&
              tab.name != 'Combat Styles' &&
              tab.name != 'Equipment' &&
              tab.name != 'Performance' &&
              tab.name != 'Fauna Transformations' &&
              tab.name != 'General Actions' &&
              tab.name != 'Martial Attacks'
            ) {
              abilities = abilities.concat(getSpellsAtLoc(tab.name) || [])
            }
          }
        })
        return abilities || []
      }
      return spells.value
        .concat(martialPerks.value)
        .concat(combatStyles.value)
        .concat(specializations.value)
        .concat(skills.value)
        .concat(knownTraits.value)
        .concat(performanceAbilities.value)
        .concat(generalActions.value)
    })

    const totalRows = ref(knownAbilities?.value?.length)

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

    function updateSpell(
      name: any,
      rank: number,
      source: any,
      known: any,
      spellgroup: string,
      groupNumber: number,
      groupSpellIndex: number,
      spellIndex: number
    ) {
      let spellObj = {
        name: name,
        rank: rank,
        known: known,
        source: source,
        spellgroup: spellgroup,
        groupNumber: groupNumber,
        groupSpellIndex: groupSpellIndex,
        spellIndex: spellIndex
      }
      let newTemp = props.currentStatBlock
      if (!newTemp.spells[spellObj.spellgroup]) {
        newTemp.spells[spellObj.spellgroup] = {
          ...manualSpellgroupsWithCustom.value[spellObj.spellgroup],
          spells: {}
        }
      }
      newTemp.spells[spellObj.spellgroup].spells[spellObj.name] = {
        ...manualSpellgroupsWithCustom.value[spellObj.spellgroup].spells[spellObj.name],
        ...spellObj
      }
      if (!newTemp.spells[spellObj.spellgroup].spells[spellObj.name].known) {
        delete newTemp.spells[spellObj.spellgroup].spells[spellObj.name]
      }
      if (
        newTemp.spells[spellObj.spellgroup].spells &&
        Object.values(newTemp.spells[spellObj.spellgroup].spells).length < 1
      ) {
        delete newTemp.spells[spellObj.spellgroup]
      }
      props.updateTemp(newTemp)
      setUpBuildDisplaySpells(spellObj)
    }
    function updatePerk(
      name: any,
      rank: number,
      source: any,
      known: any,
      perkGroup: string,
      perkIndex: number
    ) {
      let perkObj = {
        name: name,
        rank: rank,
        known: known,
        source: source,
        perkGroup: perkGroup,
        perkIndex: perkIndex
      }
      let newTemp = props.currentStatBlock

      if (perkObj.known) {
        newTemp.perks[perkObj.name] = perkObj
      } else {
        delete newTemp.perks[perkObj.name]
      }

      props.updateTemp(newTemp)
      setUpBuildDisplayPerks(perkObj)
    }
    function updateSpecialization(
      name: any,
      id: any,
      rank: any,
      source: any,
      index: number,
      combatStyles: Array<String>,
      groupIcon: string
    ) {
      buildDisplaySpecializations.value[index].rank = rank
      let skillObj = {
        name: name,
        id: id || '',
        rank: rank,
        source: source,
        combatStyles: combatStyles,
        index: index,
        groupIcon: groupIcon
      }
      let newTemp = props.currentStatBlock

      if (skillObj.rank > 0) {
        newTemp.specializations[skillObj.name] = skillObj
      } else {
        delete newTemp.specializations[skillObj.name]
      }
      props.updateTemp(newTemp)
      setUpBuildSpecializationDisplay(skillObj)
    }
    function updateCombatStyles(
      name: any,
      id: any,
      rank: any,
      source: any,
      index: number,
      attributes: Array<String>,
      groupIcon: string
    ) {
      buildDisplayCombatStyles.value[index].rank = rank
      let skillObj = {
        name: name,
        id: id || '',
        rank: rank,
        source: source,
        attributes: attributes,
        index: index,
        groupIcon: groupIcon
      }
      let newTemp = props.currentStatBlock

      if (skillObj.rank > 0) {
        newTemp.combatStyles[skillObj.name] = skillObj
      } else {
        delete newTemp.combatStyles[skillObj.name]
      }
      props.updateTemp(newTemp)
      setUpBuildCombatStylesDisplay(skillObj)
    }

    function updateSkill(
      name: any,
      id: any,
      rank: any,
      source: any,
      index: number,
      attribute: Array<String>
    ) {
      buildDisplaySkills.value[index].rank = rank
      let skillObj = {
        skill: name,
        id: id || '',
        rank: rank,
        source: source,
        attribute: attribute,
        index: index
      }
      let newTemp = props.currentStatBlock

      if (skillObj.rank > 0) {
        newTemp.skills[skillObj.skill] = skillObj
      } else {
        delete newTemp.skills[skillObj.skill]
      }
      props.updateTemp(newTemp)
      setUpBuildDisplaySkills(skillObj)
    }

    function updateStyle(
      name: any,
      rank: number,
      source: any,
      known: any,
      style: string,
      groupNumber: number,
      groupStyleIndex: number,
      styleIndex: number
    ) {
      let newTemp = { ...props.currentStatBlock }

      let obj = {
        name: name,
        rank: rank,
        known: known,
        source: source || '',
        style: style,
        groupNumber: groupNumber,
        groupStyleIndex: groupStyleIndex,
        styleIndex: styleIndex
      }
      if (!obj.known) {
        delete newTemp.practicedStyles[obj.style][obj.name]
        if (Object.entries(newTemp.practicedStyles[obj.style]).length < 1) {
          delete newTemp.practicedStyles[obj.style]
        }
      } else {
        if (!newTemp.practicedStyles[obj.style]) {
          newTemp.practicedStyles[obj.style] = {}
        }
        newTemp.practicedStyles[obj.style][obj.name] = {
          ...manualPerformanceStyles.value[style].styles[name],
          ...obj,
          groupIcon: manualPerformanceStyles.value[style].groupIcon
        }
      }
      props.updateTemp(newTemp)
      console
      setUpBuildDisplayPerformance(obj)
    }

    return {
      designStore,
      userStore,
      characterStore,
      buildDisplaySpells,
      knownAbilities,
      currentPage,
      perPage,
      currentModal,
      modal,
      filterOn,
      filter,
      fields,
      editingFields,
      totalRows,
      manualSpellgroups,
      martialPerks,
      combatStyles,
      specializations,
      skills,
      knownTraits,
      tabObject,
      selectedTabs,
      infoModal,
      manualPerformanceStyles,
      getSortedSkills,
      props,
      loading,
      updateSpell,
      buildDisplayMartialPerks,
      updatePerk,
      buildDisplaySpecializations,
      updateSpecialization,
      updateCombatStyles,
      buildDisplayCombatStyles,
      buildDisplaySkills,
      updateSkill,
      buildDisplaySpellgroups,
      spellgroupKey,
      updateStyle,
      buildDisplayPerformanceAbilities,
      performanceAbilities,
      spells,
      manualSpellgroupsWithCustom
    }
  },
  components: {
    ArrayTabs,
    StatBlockAbilities,
    TitleWidget
  }
}
</script>

<template>
  <div
    style="border-left: 2px solid; margin-left: -2px"
    :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
  >
    <TitleWidget
      style="margin-top: 0rem"
      title="Abilities"
      info-message="This Table, along with the entire page, toggles between being a page for building a stat block from scratch, and viewing the qualities of a statblock. When in build mode, the table will have every ability in this adventure available for selection via checkbox or dropdown.  When in view only mode, the table and its quick filters only display options based on what has been selected in build mode. "
    ></TitleWidget>
    <ArrayTabs
      style="width: inherit"
      filteringMessage="Ability Type"
      :tabs="Object.values(tabObject)"
      @selectedTabs="(tabs) => (selectedTabs = tabs)"
    ></ArrayTabs>
    <StatBlockAbilities
      v-if="!loading"
      :fields="props.isEditing ? editingFields : fields"
      :abilities="knownAbilities"
      :isEditing="props.isEditing"
      :build-display-spells="buildDisplaySpells"
      :updateSpell="updateSpell"
      :updatePerk="updatePerk"
      :buildDisplayPerks="buildDisplayMartialPerks"
      :buildDisplaySpecializations="buildDisplaySpecializations"
      :updateSpecialization="updateSpecialization"
      :buildDisplayCombatStyles="buildDisplayCombatStyles"
      :updateCombatStyles="updateCombatStyles"
      :buildDisplaySkills="buildDisplaySkills"
      :updateSkill="updateSkill"
      :updateStyle="updateStyle"
      :buildDisplayPerformanceAbilities="buildDisplayPerformanceAbilities"
      :manualSpellgroups="manualSpellgroupsWithCustom"
    ></StatBlockAbilities>
    <div v-else>Loading ...</div>
  </div>
</template>

<style>
ul {
  --dropdownBg: inherit;
}
li {
  --dropdownBg: inherit;
}
.dropdown-item {
  --dropdownBg: inherit;
  background-color: var(--dropdownBg);
  background: inherit;
  color: inherit;
  --bs-dropdown-link-hover-color: inherit;
  --bs-dropdown-link-hover-bg: inherit;
  --bs-dropdown-link-active-color: inherit;
  --bs-dropdown-link-active-bg: inherit;
}
.addButton {
  padding: 0px 5px 0px 5px;
  font-size: x-large;
  border: 2px solid;
  margin-left: 0.5rem;
}
.fullGroup {
  display: block;
}
.iconGroup {
  display: none;
}
@media (max-width: 550px) {
  .addButton {
    padding: 0px 4px 0px 4px;
    font-size: large;
    border: 2px solid;
    margin: 0;
  }
  .fullGroup {
    display: none;
  }
  .iconGroup {
    display: block;
  }
}
</style>
