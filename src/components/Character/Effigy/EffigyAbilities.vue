<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'

import DropdownSelect from '@/components/DropdownSelect.vue'
import _ from 'lodash'

import StatBlockAbilities from '@/components/Adventure/Stat Blocks/StatBlockAbilities.vue'
import ArrayTabs from '@/components/ArrayTabs.vue'
import FancyDecor from '@/components/FancyDecor.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { ManualSpecialization, useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { ManualSpell, useSpellStore } from '@/stores/spellsStore.ts'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, onMounted, Ref, ref, watch } from 'vue'
import { LiteralUnion } from 'bootstrap-vue-next/src/types/LiteralUnion.js'

export default {
  props: ['effigy', 'updateEffigy'],
  setup(props, context) {
    const designStore = useDesignStore()
    const buildDisplaySpells: Ref<Array<any>> = ref([])
    const knownSpellgroups = ref({})
    const spellgroupKey = ref({})
    const buildDisplaySpellgroups: Ref<Array<any>> = ref([])
    const spellsStore = useSpellStore()
    const martialPerksStore = useMartialPerksStore()
    const buildDisplayMartialPerks: Ref<Array<any>> = ref([])

    const { manualSpellgroups } = storeToRefs(spellsStore)
    const { manualMartialPerks } = storeToRefs(martialPerksStore)
    const martialSkillsStore = useMartialSkillsStore()
    const { allCombatStyles, allSpecializations } = storeToRefs(martialSkillsStore)

    const oneToSix = [
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' },
      { value: 5, text: '5' }
    ]
    const spellgroups = computed(() => {
      return Object.keys(spellsStore.manualSpellgroups)
    })
    const combatStylesArr = computed(() => {
      return Object.keys(allCombatStyles.value)
    })
    const specializationsArr = computed(() => {
      let ret: Array<String> = []
      Object.values(allSpecializations.value).forEach((spec: ManualSpecialization) => {
        if (spec.combatStyles.indexOf(props.effigy.combatStyle) > -1) {
          ret.push(spec.name)
        }
      })
      return ret
    })
    const filteredManualSpellgroups = computed(() => {
      let ret = {}

      if (props.effigy.spellgroup && props.effigy.effigyType === 'caster') {
        ret[props.effigy.spellgroup] = manualSpellgroups.value[props.effigy.spellgroup]
      }
      if (props.effigy.spellgroup2) {
        ret[props.effigy.spellgroup2] = manualSpellgroups.value[props.effigy.spellgroup2]
      }
      return ret
    })
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }

    function updateVal(val, key) {
      let copy = _.cloneDeep(props.effigy)
      copy[key] = val
      props.updateEffigy(copy)
    }
    function setUpBuildDisplayPerksFromScratch() {
      const perks: Array<any> = []
      let index = 0
      if (props.effigy.effigyType === 'caster') {
        return []
      }
      if (!props.effigy.effigyType) {
        return []
      }
      sortByRankAndName(Object.values(manualMartialPerks.value)).forEach((martialPerk: any) => {
        perks.push({
          name: martialPerk.name,
          description: martialPerk.description,
          rank: martialPerk.rank,
          source: martialPerk.source,
          known: props.effigy.perks[martialPerk.name]?.known ? true : false,
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

    watch(filteredManualSpellgroups, (newOne, oldOne) => {
      setUpBuildDisplaySpellsFromScratch()
    })
    const unlockedSpellgroup = computed(() => {
      let val = false
      Object.values(props.effigy.majorBonuses).forEach((bonus: any) => {
        if (bonus.includes('spell')) {
          val = true
        }
      })

      return val
    })
    const unlockedSpecialization = computed(() => {
      let val = false
      Object.values(props.effigy.majorBonuses).forEach((bonus: any) => {
        if (bonus.includes('specialization')) {
          val = true
        }
      })

      return val
    })

    const unlockedWeaponSkill = computed(() => {
      let val = false
      Object.values(props.effigy.minorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Combat')) {
          val = true
        }
      })

      return val
    })

    const combatRanks = computed(() => {
      let val = 0
      Object.values(props.effigy.minorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Combat')) {
          val += 2
        }
      })

      return val
    })
    const perksMessage = computed(() => {
      let perkranks = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
      }
      let messages: Array<String> = []
      if (props.effigy.effigyType === 'fighter') {
        let count = 0
        Object.values(props.effigy.perks).forEach((perk: any) => {
          perkranks[perk.rank] = true
          count++
        })
        if (count < Math.round(props.effigy.level / 2)) {
          let level =
            Math.round(props.effigy.level / 2) === 1
              ? 1
              : Math.round(props.effigy.level / 2) === 2
                ? 3
                : 5
          messages.push(
            'Select ' +
              Math.round(props.effigy.level / 2) +
              ' total martial perks.  This effigy is entitled to them because they are a fighter of at least level ' +
              level
          )
        }
        if (count > Math.round(props.effigy.level / 2)) {
          messages.push(
            'You are only entitled to ' +
              Math.round(props.effigy.level / 2) +
              ' martial perks.  Fighter effigies gain a new martial perk at levels 1,3, and 5.'
          )
        }
        if (perkranks[3] && !perkranks[2]) {
          messages.push('You cannot purchase a rank 3 perk without a rank 2 perk')
        }
        if (perkranks[2] && !perkranks[1]) {
          messages.push('You cannot purchase a rank 2 perk without a rank 1 perk')
        }
      }

      return messages
    })

    const spellsMessage = computed(() => {
      let spellranks1 = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
      }
      let spellranks2 = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
      }
      let messages: Array<String> = []
      if (props.effigy.spellgroup) {
        let count = 0
        let spellgroup = Object.values(
          props.effigy.spells[props.effigy.spellgroup]?.spells || {}
        ).forEach((spell: any) => {
          spellranks1[spell.rank] = true
          if (spell.rank > 0) {
            count++
          }
        })
        if (count < props.effigy.level) {
          messages.push(
            'Select ' +
              props.effigy.level +
              ' spells in spellgroup: "' +
              props.effigy.spellgroup +
              '".  Caster effigies are entitled to a number of spells in a chosen spell group equivalent to their level.'
          )
        }
        if (spellranks1[5] && !spellranks1[4]) {
          messages.push(
            'You cannot purchase a rank 5 spell without a rank 4 spell in spellgroup: ' +
              props.effigy.spellgroup
          )
        }
        if (spellranks1[4] && !spellranks1[3]) {
          messages.push(
            'You cannot purchase a rank 4 spell without a rank 3 spell in spellgroup: ' +
              props.effigy.spellgroup
          )
        }
        if (spellranks1[3] && !spellranks1[2]) {
          messages.push(
            'You cannot purchase a rank 3 spell without a rank 2 spell in spellgroup: ' +
              props.effigy.spellgroup
          )
        }
        if (spellranks1[2] && !spellranks1[1]) {
          messages.push(
            'You cannot purchase a rank 2 spell without a rank 1 spell in spellgroup: ' +
              props.effigy.spellgroup
          )
        }
      }
      if (props.effigy.spellgroup2) {
        let count = 0
        let spellgroup2 = Object.values(
          props.effigy.spells[props.effigy.spellgroup2]?.spells || {}
        ).forEach((spell: any) => {
          spellranks2[spell.rank] = true
          count++
        })
        if (count > 3) {
          messages.push(
            'You may only select 3 spells in spellgroup: "' + props.effigy.spellgroup2 + '"'
          )
        }
        if (count < 3) {
          messages.push(
            'Select 3 spells in spellgroup: "' +
              props.effigy.spellgroup2 +
              '" This effigy is entitled to this because they have selected "3 ranks in a new spell group" as a Major Bonus.'
          )
        }
        if (spellranks2[4] || spellranks2[5]) {
          messages.push(
            'You are not entitled to spells above rank 3 in secondary spellgroup: ' +
              props.effigy.spellgroup2
          )
        }
        if (spellranks2[3] && !spellranks2[2]) {
          messages.push(
            'You cannot purchase a rank 3 spell without a rank 2 spell in spellgroup: ' +
              props.effigy.spellgroup2
          )
        }
        if (spellranks2[2] && !spellranks2[1]) {
          messages.push(
            'You cannot purchase a rank 2 spell without a rank 1 spell in spellgroup: ' +
              props.effigy.spellgroup2
          )
        }
      }
      return messages
    })
    onMounted(() => {
      knownSpellgroups.value = { ...props.effigy.spells }
      setUpBuildDisplayFromScratch()
    })

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

    function isSpellKnown(spell: ManualSpell, spellgroup: string): boolean {
      let ret = false
      if (
        props.effigy?.spells[spellgroup] &&
        props.effigy?.spells[spellgroup].spells &&
        props.effigy?.spells[spellgroup].spells[spell.name] &&
        props.effigy?.spells[spellgroup].spells[spell.name].known
      ) {
        ret = true
      }
      return ret
    }

    function setUpBuildDisplayFromScratch() {
      setUpBuildDisplaySpellsFromScratch()
      setUpBuildDisplayPerksFromScratch()
      //   setUpBuildSpecializationDisplayFromScratch()
      //   setUpBuildDisplayCombatStylesFromScratch()
      //   setUpBuildDisplaySkillsFromScratch()
      //   setUpBuildDisplayPerformanceFromScratch()
    }

    function setUpBuildDisplaySpellsFromScratch() {
      const spells: Array<any> = []
      const spellgroups: Array<any> = []
      let index = 0
      let spellIndex = 0
      let ret = filteredManualSpellgroups.value
      if (!props.effigy.effigyType) {
        buildDisplaySpells.value = []
        buildDisplaySpellgroups.value = []
        ret = {}
      }
      if (props.effigy.effigyType === 'fighter') {
        ret = {}
        if (props.effigy.spellgroup2) {
          ret[props.effigy.spellgroup2] = manualSpellgroups.value[props.effigy.spellgroup2]
        }
      }
      Object.entries(ret).map(([spellgroup]) => {
        const spellsArray = sortByRankAndName(
          Object.values(filteredManualSpellgroups.value[spellgroup]?.spells)
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
          ...filteredManualSpellgroups.value[spellgroup],
          spells: acc,
          index: index
        })
        spellgroupKey.value[spellgroup] = index
        index++
      })

      buildDisplaySpells.value = spells
      buildDisplaySpellgroups.value = spellgroups
    }
    const selectedTabs: Ref<Array<any>> = ref([])

    const spells: ComputedRef<Array<any>> = computed(() => {
      let groups: any
      groups = buildDisplaySpellgroups.value

      let spells: Array<any> = []
      groups.forEach((group) => {
        let spellx = Object.values(group.spells).filter(
          (spell: any) => spell.rank <= props.effigy.level
        )

        spells = spells.concat(spellx)
      })

      return spells
    })

    function getSpellsAtLoc(spellgroup) {
      let group: any = props.effigy.spells[spellgroup]
      group = buildDisplaySpellgroups.value[spellgroupKey.value[spellgroup]]
      let spellz: Array<any> = []
      if (group) {
        spellz = Object.values(group.spells)
      }
      return spellz || []
    }

    const martialPerks: ComputedRef<Array<any>> = computed(() => {
      let val = 1
      if (props.effigy.level >= 3) {
        val = 2
      }
      if (props.effigy.level >= 5) {
        val = 3
      }
      let perks: any
      perks = buildDisplayMartialPerks.value.filter((perk) => perk.rank <= val)

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

    let knownAbilities: ComputedRef<Array<any>> = computed(() => {
      let abilities: Array<any> = []
      if (selectedTabs.value && selectedTabs.value.length > 0) {
        selectedTabs.value.forEach((tab) => {
          if (tab.name === 'Spells') {
            abilities = abilities.concat(spells.value)
          }
          if (tab.name === 'Martial Perks') {
            abilities = abilities.concat(martialPerks.value)
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
      return spells.value.concat(martialPerks.value)
    })
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

    const tabObject: ComputedRef<any> = computed((): any => {
      let index = 0
      let arr = {}
      Object.values(filteredManualSpellgroups.value).map(
        (group: any) =>
          (arr[group.name] = {
            name: group.name,
            index: index++,
            known: true
          })
      )
      if (martialPerks.value.length > 0) {
        arr['Martial Perks'] = { known: true, name: 'Martial Perks', index: index++ }
      }
      return arr
    })

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
      let newTemp = props.effigy
      if (!newTemp.spells[spellObj.spellgroup]) {
        newTemp.spells[spellObj.spellgroup] = {
          ...manualSpellgroups.value[spellObj.spellgroup],
          spells: {}
        }
      }
      newTemp.spells[spellObj.spellgroup].spells[spellObj.name] = {
        ...manualSpellgroups.value[spellObj.spellgroup].spells[spellObj.name],
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
      props.updateEffigy(newTemp)
      knownSpellgroups.value = { ...props.effigy.spells }

      setUpBuildDisplaySpellsFromScratch()
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
      let newTemp = props.effigy

      if (perkObj.known) {
        newTemp.perks[perkObj.name] = perkObj
      } else {
        delete newTemp.perks[perkObj.name]
      }

      props.updateEffigy(newTemp)
      setUpBuildDisplayPerksFromScratch()
    }

    const statusIcon = computed(() => {
      let messages = spellsMessage.value.concat(perksMessage.value)
      let icon = 'bi bi-patch-question'
      if (messages.length < 1) {
        return undefined
      }
      messages.forEach((message) => {
        if (!message.includes('Select')) {
          icon = 'bi bi-patch-exclamation'
        }
      })
      return icon
    })
    return {
      designStore,
      lightenDarkenColor,
      props,
      spellgroups,
      updateVal,
      unlockedSpellgroup,
      unlockedWeaponSkill,
      unlockedSpecialization,
      buildDisplaySpells,
      filteredManualSpellgroups,
      knownAbilities,
      editingFields,
      tabObject,
      selectedTabs,
      martialPerks,
      buildDisplayMartialPerks,
      updateSpell,
      updatePerk,
      specializationsArr,
      combatStylesArr,
      combatRanks,
      perksMessage,
      spellsMessage,
      statusIcon,
      manualSpellgroups
    }
  },
  components: {
    TitleWidget,
    FancyDecor,
    DropdownSelect,
    StatBlockAbilities,
    TitleMedallion,
    ArrayTabs
  }
}
</script>
<template>
  <div>
    <TitleMedallion
      v-if="props.effigy.effigyType === 'caster' || props.effigy.spe"
      title="Select Ability Groups"
    ></TitleMedallion>
    <div v-if="effigy.effigyType === 'caster'">
      <FancyDecor
        text="Base Spellgroup"
        :background="designStore.inputBacking"
        :color="designStore.inputText"
        width="15rem"
        icon="gi-magic-palm"
      >
        <template v-slot:body>
          <DropdownSelect
            :color="designStore.inputText"
            @selection="(selection) => updateVal(selection, 'spellgroup')"
            :default="effigy.spellgroup || ''"
            :options="spellgroups"
            class="fancySelect"
          ></DropdownSelect>
        </template>
      </FancyDecor>
    </div>
    <div v-else-if="effigy.effigyType === 'fighter'"></div>
    <FancyDecor
      text="Bonus Spellgroup"
      v-if="unlockedSpellgroup"
      :background="lightenDarkenColor(designStore.inputBacking, -20)"
      :color="designStore.inputText"
      width="15rem"
      icon="gi-magic-palm"
    >
      <template v-slot:body>
        <DropdownSelect
          :color="designStore.inputText"
          :default="effigy.spellgroup2 || ''"
          @selection="(selection) => updateVal(selection, 'spellgroup2')"
          :options="spellgroups"
          class="fancySelect"
        ></DropdownSelect>
      </template>
    </FancyDecor>
    <FancyDecor
      text="Combat Style"
      v-if="unlockedWeaponSkill"
      :color="designStore.inputText"
      :background="designStore.inputBacking"
      width="15rem"
      icon="gi-crossed-swords"
    >
      <template v-slot:body>
        <div style="display: flex">
          <DropdownSelect
            :color="designStore.inputText"
            @selection="(selection) => updateVal(selection, 'combatStyle')"
            :default="props.effigy.combatStyle || ''"
            :options="combatStylesArr"
            class="fancySelect"
          ></DropdownSelect>
          <div style="margin: 0.5rem">({{ combatRanks }} Ranks)</div>
        </div>
      </template>
    </FancyDecor>
    <FancyDecor
      text="Specialization"
      v-if="unlockedSpecialization"
      :background="lightenDarkenColor(designStore.inputBacking, -20)"
      :color="designStore.inputText"
      width="15rem"
      icon="gi-sword-wound"
    >
      <template v-slot:body>
        <div style="display: flex">
          <DropdownSelect
            :color="designStore.inputText"
            @selection="(selection) => updateVal(selection, 'specialization')"
            :default="props.effigy.specialization || ''"
            :options="specializationsArr"
            :disabled="specializationsArr.length < 1"
            :disabled-message="'This Bonus only works for effigies with a Combat Style'"
            class="fancySelect"
          ></DropdownSelect>
          <div style="margin: 0.5rem">({{ combatRanks }} Ranks)</div>
        </div>
      </template>
    </FancyDecor>

    <title-widget
      title="Select Abilities"
      :status="statusIcon"
      :status-title="'Build Status'"
      :status-messages="spellsMessage.concat(perksMessage)"
      suggestionKey="Select"
    ></title-widget>
    <ArrayTabs
      style="width: inherit"
      filteringMessage="Ability Type"
      :tabs="Object.values(tabObject)"
      @selectedTabs="(tabs) => (selectedTabs = tabs)"
    ></ArrayTabs>
    <StatBlockAbilities
      :build-display-spells="buildDisplaySpells"
      :build-display-perks="buildDisplayMartialPerks"
      :is-editing="true"
      :abilities="knownAbilities"
      :updateSpell="updateSpell"
      :updatePerk="updatePerk"
      :fields="editingFields"
      :manual-spellgroups="manualSpellgroups"
    ></StatBlockAbilities>
  </div>
</template>
<style></style>
