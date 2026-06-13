<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import FancyDecor from '@/components/FancyDecor.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { BButton } from 'bootstrap-vue-next'
import WeaponSkillDisplay from './WeaponSkillDisplay.vue'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { storeToRefs } from 'pinia'
import { lightenDarkenColor } from '../../../Utility.ts'
import { computed, ComputedRef, ref } from 'vue'
import _ from 'lodash'
import GridSelect from '@/components/GridSelect.vue'
import CustomModal from '@/components/CustomModal.vue'

export default {
  props: [
    'updateAttack',
    'strikeObj',
    'name',
    'weapon',
    'primary',
    'secondary',
    'increasedCosts',
    'specializations',
    'combatStyles',
    'attack',
    'universalModifiesSomeCosts',
    'addToTypeMalleable',
    'rmTypeMalleable',
    'typeMalleableApplyToAllSkills',
    'typeMalleableObj'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const martialSkillsStore = useMartialSkillsStore()
    const { allSpecializations, allCombatStyles } = storeToRefs(martialSkillsStore)
    const weaponChoice = computed(() => {
      return props.strikeObj?.hand === 'Primary' ? props.primary : props.secondary
    })
    const specializationsList = computed(() => {
      return weaponChoice.value.equippedStats.specializations
    })
    const combatStylesList = computed(() => {
      return weaponChoice.value.equippedStats.combatStyles
    })
    const minCost = computed(() => {
      return (
        aoeSkill.value?.skillStats.mpCost ||
        (aoeSkill.value?.skillStats.modes &&
          aoeSkill.value?.skillStats[aoeSkill.value?.skillStats.modes[0]].mpCost)
      )
    })
    const reachModObj = computed(() => {
      let skills = Object.values(props.strikeObj.skills)
      let val = { val: '', rank: 0 }
      skills.forEach((skill: any) => {
        if (skill.skillStats.reachMod) {
          val.val = skill.skillStats.reachMod
          let localMinCost =
            skill.skillStats.mpCost ||
            (skill?.skillStats.modes && skill?.skillStats[skill?.skillStats.modes[0]].mpCost)
          let localCostPerRank =
            skill?.skillStats.additionalMpCost ||
            (skill?.skillStats.modes &&
              skill?.skillStats[skill?.skillStats.modes[0]].additionalMpCost) ||
            skill?.skillStats.mpCost ||
            (skill?.skillStats.modes && skill?.skillStats[skill?.skillStats.modes[0]].mpCost)
          val.rank = (skill.purchasedMp - localMinCost) / localCostPerRank + 1
        }
      })
      return val
    })
    const rankCost: ComputedRef<number> = computed(() => {
      if (aoeSkill.value?.skillStats.costMalleable) {
        return costPerRank.value + props.universalModifiesSomeCosts + props.increasedCosts
      }

      return costPerRank.value + props.increasedCosts
    })
    const min: ComputedRef<number> = computed(() => {
      if (aoeSkill.value?.costMalleable) {
        return minCost.value + aoeSkill.value?.skillStats.costMalleable + props.increasedCosts
      }
      return minCost.value + props.increasedCosts
    })
    const costPerRank = computed(() => {
      return (
        aoeSkill.value?.skillStats.additionalMpCost ||
        (aoeSkill.value?.skillStats.modes &&
          aoeSkill.value?.skillStats[aoeSkill.value?.skillStats.modes[0]].additionalMpCost) ||
        aoeSkill.value?.skillStats.mpCost ||
        (aoeSkill.value?.skillStats.modes &&
          aoeSkill.value?.skillStats[aoeSkill.value?.skillStats.modes[0]].mpCost)
      )
    })
    const ranks = computed(() => {
      return (aoeSkill.value.purchasedMp - minCost.value) / costPerRank.value + 1
    })
    const aoeSkill: any = computed(() => {
      let ret = undefined
      let totalSkills =
        props.typeMalleableApplyToAllSkills && Object.values(props.typeMalleableObj).length > 0
          ? _.unionBy(
              Object.values(props.strikeObj.skills),
              Object.values(props.typeMalleableObj).map((obj: any) => ({
                ...obj,
                immutable: true
              })),
              'name'
            )
          : Object.values(props.strikeObj.skills)
      totalSkills.forEach((s: any) => {
        if (s.skillStats.aoe) {
          ret = s
        }
      })
      return ret
    })

    const strikeArea = computed(() => {
      let ret =
        props.weapon.equippedStats.range > 10
          ? 'Ranged Single Target Strike'
          : 'Single Target Melee Strike'
      if (aoeSkill.value != undefined) {
        if (aoeSkill.value?.skillStats.aoe.includes('(')) {
          return aoeMath(aoeSkill.value?.skillStats.aoe, aoeSkill.value?.name)
        }
        return aoeSkill.value?.skillStats.aoe
      }
      return ret
    })
    function aoeMath(text, skillName) {
      let index = text.indexOf('rank')
      let ret = text
      if (index > 0) {
        ret = ret.substring(0, index) + ranks.value + ret.substring(index + 5, ret.length + 1)
      }
      index = text.indexOf('Reach')
      if (index > 0) {
        ret =
          ret.substring(0, index) +
          props.weapon.equippedStats.range +
          (reachModObj.value.val ? '+' + reachModObj.value.val : '') +
          ret.substring(index + 6, ret.length + 1)
        index = ret.indexOf('rank')
        if (index > 0) {
          ret =
            ret.substring(0, index) +
            reachModObj.value.rank +
            "'" +
            ret.substring(index + 5, ret.length + 1)
        }
      }
      if (ret.includes('*')) {
        let low: number = getNumber(ret, ret.indexOf('*') - 1, -1)
        let high: number = getNumber(ret, ret.indexOf('*') + 1, 1)

        ret =
          ret.substring(0, ret.indexOf(low + '')) +
          low * high +
          ret.substring(
            ret.indexOf(high + '', ret.indexOf(low + '') + 1) + (high + '').length,
            ret.length
          )
      }
      if (ret.includes('+')) {
        let low = getNumber(ret, ret.indexOf('+') - 1, -1)
        let high = getNumber(ret, ret.indexOf('+') + 1, 1)

        ret =
          ret.substring(0, ret.indexOf(low + '')) +
          (low + high) +
          ret.substring(
            ret.indexOf(high + '', ret.indexOf(low + '') + 1) + (high + '').length,
            ret.length
          )
      }
      return ret.substring(1)
    }
    function getNumber(text, index, direction) {
      if (text.charCodeAt(index) > 57 || text.charCodeAt(index) < 48) {
        return ''
      }
      return direction > 0
        ? parseInt(text.charAt(index) + getNumber(text, index + 1, direction))
        : parseInt(getNumber(text, index - 1, direction) + text.charAt(index))
    }

    const maxSpecRank = computed(() => {
      return props.specializations[specializationsList.value[0]]?.rank || 0
    })
    const maxCombatStyleRank = computed(() => {
      return props.combatStyles[combatStylesList.value[0]]?.rank || 0
    })
    const maxSkillRank = computed(() => {
      return aoeSkill.value?.attributes ? maxCombatStyleRank.value : maxSpecRank.value
    })

    const options = computed(() => {
      let skill = props.strikeObj.specialization || specializationsList.value[0]
      let combatStyle = props.strikeObj?.specialization
        ? props.strikeObj?.combatStyle
        : combatStylesList.value[0]
      return Object.values(allSpecializations.value[skill].skills)
        .filter((s: any) => s?.skillStats.aoe)
        .concat(
          Object.values(allCombatStyles.value[combatStyle].skills).filter(
            (s: any) => s.skillStats.aoe
          )
        )
        .map((skill: any) => {
          return {
            name: skill.name + '(' + skill.mp_cost || +')',
            value: skill.name,
            icon: skill.icon,
            description: skill.description,
            disabled: props.strikeObj.skills[skill.name]
          }
        })
        .concat({
          name: props.weapon.equippedStats.range
            ? 'Single Target Strike'
            : 'Single Target Melee Strike',
          value: '',
          icon: 'gi-targeting',
          description: 'The basic default strike type',
          disabled: Boolean(!aoeSkill.value)
        })
    })

    function selectSkillFromPicker(name) {
      if (name != aoeSkill.value?.name) {
        deleteSkill(aoeSkill.value?.name)
      }
      showModal.value = false
      let skill = props.strikeObj?.specialization
        ? props.strikeObj?.specialization
        : specializationsList.value[0]
      let combatStyle = props.strikeObj?.combatStyle
        ? props.strikeObj?.combatStyle
        : combatStylesList.value[0]
      let val =
        allSpecializations.value[skill].skills[name] ||
        allCombatStyles.value[combatStyle].skills[name]

      let minCost =
        val.skillStats.mpCost ||
        (val.skillStats.modes && val.skillStats[val.skillStats.modes[0]].mpCost)
      editSkill(name, { ...val, purchasedMp: minCost, name: name, rank: 1 })
    }

    function editSkill(skillName, skill) {
      let searchInput =
        skillName === 'Lethal III' || skillName === 'Lethal II' || skillName === 'Lethal I'
          ? 'Lethal'
          : skillName
      let attackTemp = _.cloneDeep(props.attack)
      attackTemp.attackObj[props.name].skills[searchInput] = skill
      props.updateAttack(attackTemp)
      if (skill.skillStats.typeMalleable) {
        props.addToTypeMalleable(skill)
      }
    }

    function deleteSkill(skillName) {
      let searchInput =
        skillName === 'Lethal III' || skillName === 'Lethal II' || skillName === 'Lethal I'
          ? 'Lethal'
          : skillName
      let attackTemp = _.cloneDeep(props.attack)
      delete attackTemp.attackObj[props.name].skills[searchInput]
      props.updateAttack(attackTemp)
      props.rmTypeMalleable(skillName)
    }
    function getDropdownArray() {
      let arr = [{ value: min.value, text: min.value + ' MP' }]
      let compound = aoeSkill.value?.skillStats.isCompoundingCost ? props.increasedCosts : 0
      for (
        let i = min.value + rankCost.value + compound;
        i <= maxSkillRank.value;
        i += rankCost.value + compound
      ) {
        arr.push({ value: i, text: i + ' MP' })
        compound = aoeSkill.value?.skillStats.isCompoundingCost
          ? compound + props.increasedCosts
          : 0
      }
      return arr
    }
    const localModifiedCost = ref(props.universalModifiesSomeCosts)

    function purchase(selection) {
      let ranks = 1 + (selection - min.value) / rankCost.value
      if (aoeSkill.value?.skillStats.costMalleable) {
        ranks = 1 + (selection - min.value) / (rankCost.value + localModifiedCost.value)
      }
      if (aoeSkill.value?.skillStats.isCompoundingCost) {
        let rank = 1
        let j = 0
        for (let i = min.value; i < selection; i += rankCost.value + j) {
          j = j + 1
          rank++
        }
        ranks = rank
      }
      let skillObjCp = _.cloneDeep(aoeSkill.value)
      skillObjCp.rank = ranks
      skillObjCp.purchasedMp = selection
      skillObjCp.skillStats.rank = ranks

      editSkill(skillObjCp.name, skillObjCp)
    }

    const showModal = ref(false)

    return {
      designStore,
      props,
      martialSkillsStore,
      allSpecializations,
      allCombatStyles,
      lightenDarkenColor,
      options,
      specializationsList,
      weaponChoice,
      editSkill,
      deleteSkill,
      selectSkillFromPicker,
      showModal,
      maxCombatStyleRank,
      maxSpecRank,
      getDropdownArray,
      strikeArea,
      aoeSkill,
      purchase,
      reachModObj
    }
  },
  components: {
    DropdownSelect,
    BButton,
    GridSelect,
    CustomModal
  }
}
</script>
<template>
  <div>
    <BButton
      class="hoverableTransparantLinear"
      style="margin-left: 0.5rem; margin-top: -0.25rem; padding: 0.25rem; border: 2px solid"
      :style="{
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="display: flex; align-items: center">
        <div @click="showModal = true">
          {{ strikeArea }}
        </div>
        <DropdownSelect
          v-if="
            aoeSkill?.purchasedMp && !aoeSkill.immutable && aoeSkill.skillStats.aoe.includes('rank')
          "
          :color="designStore.primaryText"
          :background="designStore.primaryTheme"
          :borderless="true"
          :overrideDown="true"
          :options="getDropdownArray()"
          label="MP"
          style="
            width: 4rem;
            text-align: end;
            z-index: 4;
            margin-left: 0.5rem;
            margin-top: -0.25rem;
            margin-right: -0.25rem;
            margin-bottom: -0.25rem;
          "
          :default="aoeSkill?.purchasedMp || 0"
          @selection="(selection) => purchase(selection)"
        ></DropdownSelect>
      </div>
    </BButton>
  </div>
  <CustomModal :showModal="showModal" @close="showModal = false">
    <template v-slot:body>
      <GridSelect
        :updateOption="selectSkillFromPicker"
        :options="options"
        :selected="strikeArea"
        :nameDecorator="''"
      ></GridSelect>
    </template>
  </CustomModal>
</template>
<style scoped></style>
