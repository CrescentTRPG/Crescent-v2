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
import { computed, ref } from 'vue'
import _ from 'lodash'
import GridSelect from '@/components/GridSelect.vue'
import CustomModal from '@/components/CustomModal.vue'
import StrikeAreaIndicator from './StrikeAreaIndicator.vue'

export default {
  props: [
    'updateAttack',
    'strikeObj',
    'attack',
    'name',
    'primary',
    'secondary',
    'specializations',
    'combatStyles',
    'deleteStrike',
    'addToTypeMalleable',
    'rmTypeMalleable',
    'typeMalleableApplyToAllSkills',
    'typeMalleableObj'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const martialSkillsStore = useMartialSkillsStore()
    const { allSpecializations, allCombatStyles } = storeToRefs(martialSkillsStore)
    const weapon = computed(() => {
      return props.strikeObj?.hand === 'Primary' ? props.primary : props.secondary
    })
    const specializationsList = computed(() => {
      return weapon.value.equippedStats.specializations
    })
    const combatStylesList = computed(() => {
      return weapon.value.equippedStats.combatStyles
    })
    const maxSpecRank = computed(() => {
      return props.specializations[specializationsList.value[0]]?.rank || 0
    })
    const maxCombatStyleRank = computed(() => {
      return props.combatStyles[combatStylesList.value[0]]?.rank || 0
    })
    const grantedBy = computed(() => {
      let ret = 'Base Strike'
      Object.values(props.strikeObj.skills).forEach((skill: any) => {
        if (skill.skillStats.grantsNewStrike) {
          ret = skill.name + ' ' + (skill.purchasedMp || 0) + 'MP'
        }
      })
      return ret
    })
    const spentMP = computed(() => {
      return Object.values(props.strikeObj.skills).reduce(
        (acc, curr: any) => (curr.purchasedMp || 0) + acc,
        0
      )
    })
    const selectedUtilitySkills = computed(() => {
      let skill = props.strikeObj?.specialization
        ? props.strikeObj?.specialization
        : specializationsList.value[0]
      let combatStyle = props.strikeObj?.specialization
        ? props.strikeObj?.combatStyle
        : combatStylesList.value[0]
      let totalSkills = props.typeMalleableApplyToAllSkills
        ? _.unionBy(
            Object.values(props.strikeObj.skills),
            Object.values(props.typeMalleableObj).map((obj: any) => ({ ...obj, immutable: true })),
            'name'
          )
        : Object.values(props.strikeObj.skills)
      return totalSkills.filter(
        (s: any) =>
          (s && allSpecializations.value[skill]?.skills[s.name]?.skillStats?.utility) ||
          (s && allCombatStyles.value[combatStyle]?.skills[s.name]?.skillStats?.utility)
      )
    })
    const selectedDamageSkills = computed(() => {
      let skill = props.strikeObj?.specialization
        ? props.strikeObj?.specialization
        : specializationsList.value[0]
      let combatStyle = props.strikeObj?.specialization
        ? props.strikeObj?.combatStyle
        : combatStylesList.value[0]

      let totalSkills = props.typeMalleableApplyToAllSkills
        ? _.unionBy(
            Object.values(props.strikeObj.skills),
            Object.values(props.typeMalleableObj).map((obj: any) => ({ ...obj, immutable: true })),
            'name'
          )
        : Object.values(props.strikeObj.skills)
      return totalSkills.filter(
        (s: any) =>
          s &&
          (allSpecializations.value[skill]?.skills[s.name]?.skillStats?.damage ||
            allCombatStyles.value[combatStyle]?.skills[s.name]?.skillStats?.damage)
      )
    })
    const selectedSpecialization = ref(specializationsList.value[0])
    const usingSpecialization = ref(allSpecializations.value[selectedSpecialization.value])
    const mode = ref(0)
    const modes = computed(() => {
      return (
        usingSpecialization.value.skills[
          Object.keys(usingSpecialization.value.skills)[0]
        ].skillStats.modes?.map((val: string, i = -1) => ({ value: i++, text: val })) || ['']
      )
    })

    const utilitySkillOptions = computed(() => {
      let skill = props.strikeObj?.specialization
        ? props.strikeObj?.specialization
        : specializationsList.value[0]
      let combatStyle = props.strikeObj?.specialization
        ? props.strikeObj?.combatStyle
        : combatStylesList.value[0]
      return Object.values(allSpecializations.value[skill].skills)
        .filter(
          (s: any) =>
            s?.skillStats.utility &&
            !(s?.skillStats.isModal
              ? s?.skillStats[s?.skillStats.modes[0]]?.type.includes('All')
              : s?.skillStats?.type.includes('All'))
        )
        .concat(
          Object.values(allCombatStyles.value[combatStyle].skills).filter(
            (s: any) =>
              s.skillStats.utility &&
              !(s?.skillStats?.isModal
                ? s?.skillStats[s?.skillStats.modes[0]]?.type.includes('All')
                : s?.skillStats?.type.includes('All'))
          )
        )
        .map((skill: any) => {
          return {
            name: skill.name + '(' + skill.mp_cost + ')',
            value: skill.name,
            icon: skill.icon,
            description: skill.description,
            disabled: props.strikeObj.skills[skill.name]
          }
        })
    })
    const damageSkillOptions = computed(() => {
      let skill = props.strikeObj.specialization || specializationsList.value[0]
      let combatStyle = props.strikeObj?.specialization
        ? props.strikeObj?.combatStyle
        : combatStylesList.value[0]

      return Object.values(allSpecializations.value[skill].skills)
        .filter(
          (s: any) =>
            s?.skillStats.damage &&
            !(s?.skillStats.isModal
              ? s?.skillStats[s?.skillStats?.modes[0]]?.type.includes('All')
              : s?.skillStats?.type.includes('All'))
        )
        .concat(
          Object.values(allCombatStyles.value[combatStyle].skills).filter(
            (s: any) =>
              s.skillStats.damage &&
              !(s?.skillStats?.isModal
                ? s?.skillStats[s?.skillStats.modes[0]]?.type.includes('All')
                : s?.skillStats?.type.includes('All'))
          )
        )
        .map((skill: any) => {
          return {
            name: skill.name + '(' + skill.mp_cost + ')',
            value: skill.name,
            icon: skill.icon,
            description: skill.description,
            disabled: props.strikeObj.skills[skill.name]
          }
        })
    })

    function selectSkillFromPicker(name) {
      let searchInput =
        name === 'Lethal III' || name === 'Lethal II' || name === 'Lethal I' ? 'Lethal' : name
      showDamageModal.value = false
      showUtilityModal.value = false
      let skill = props.strikeObj?.specialization
        ? props.strikeObj?.specialization
        : specializationsList.value[0]
      let combatStyle = props.strikeObj?.combatStyle
        ? props.strikeObj?.combatStyle
        : combatStylesList.value[0]
      console.log(name)
      let val =
        allSpecializations.value[skill].skills[name] ||
        allCombatStyles.value[combatStyle].skills[searchInput]

      let minCost =
        (val.skillStats.mpCost ||
          (val.skillStats.modes && val.skillStats[val.skillStats.modes[0]].mpCost) ||
          0) + (props.attack.attackObj['Universal Skills'].increasedCosts || 0)
      console.log(minCost)

      editSkill(name, {
        ...val,
        purchasedMp:
          val.skillStats.costMalleable &&
          specializationsList.value[0] ===
            props.attack.attackObj['Universal Skills'].modifiesSomeCostsSkill &&
          props.attack.attackObj['Universal Skills'].modifiesSomeCosts
            ? minCost + props.attack.attackObj['Universal Skills'].modifiesSomeCosts
            : minCost,
        name: searchInput,
        rank: 1,
        attributes: allCombatStyles.value[combatStyle].skills[searchInput] || undefined
      })
    }

    function editSkill(skillName, skill) {
      let searchInput =
        skillName === 'Lethal III' || skillName === 'Lethal II' || skillName === 'Lethal I'
          ? 'Lethal'
          : skillName
      let attackTemp = _.cloneDeep(props.attack)
      attackTemp.attackObj[props.name].skills[searchInput] = skill
      if (attackTemp.attackObj[props.name].skills[searchInput].skillStats.modes?.length > 1)
        attackTemp.attackObj[props.name].modes =
          attackTemp.attackObj[props.name].skills[searchInput].skillStats.modes
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
      if (Object.keys(attackTemp.attackObj[props.name].skills).length < 1) {
        //attackTemp.attackObj[props.name].modes = ['']
      }
      props.updateAttack(attackTemp)
      props.rmTypeMalleable(skillName)
    }

    function updateHand(hand) {
      let attackTemp = _.cloneDeep(props.attack)
      attackTemp.attackObj[props.name].hand = hand
      props.updateAttack(attackTemp)
    }

    const showDamageModal = ref(false)
    const showUtilityModal = ref(false)

    return {
      designStore,
      props,
      martialSkillsStore,
      allSpecializations,
      allCombatStyles,
      lightenDarkenColor,
      utilitySkillOptions,
      damageSkillOptions,
      specializationsList,
      weapon,
      selectedUtilitySkills,
      selectedDamageSkills,
      editSkill,
      deleteSkill,
      selectSkillFromPicker,
      showUtilityModal,
      showDamageModal,
      maxCombatStyleRank,
      maxSpecRank,
      updateHand,
      grantedBy,
      spentMP,
      usingSpecialization,
      modes,
      mode
    }
  },
  components: {
    DropdownSelect,
    WeaponSkillDisplay,
    GridSelect,
    CustomModal,
    StrikeAreaIndicator
  }
}
</script>
<template>
  <div>
    <div>
      <div
        style="display: flex; padding-left: 0.5rem; padding-bottom: 0.5rem; margin-bottom: 0.25rem"
        :style="{
          background: designStore.sidebarBacking,
          color: designStore.sidebarText,
          boxShadow: '0px 1px 1px 1px ' + lightenDarkenColor(designStore.sidebarBacking, -25)
        }"
      >
        <div style="display: flex; flex-direction: column; flex-grow: 1">
          <div style="display: flex; flex-grow: 1">
            <i
              v-if="name != 'Strike 1'"
              class="bi bi-x-lg"
              style="text-align: center; font-size: x-large"
              @click="deleteStrike()"
            ></i>
            <div style="font-size: x-large; text-wrap: nowrap; margin-right: 0.5rem">
              {{ props.name }}
            </div>
            <div style="text-wrap: nowrap; align-self: center">({{ grantedBy }})</div>
            <hr
              :style="{ borderColor: designStore.secondaryTheme }"
              style="align-self: center; position: relative; top: 0rem"
            />
            <v-icon
              name="gi-abstract-119"
              :style="{ color: designStore.secondaryTheme }"
              style="position: relative; right: 0.25rem; top: 0.5rem"
            ></v-icon>
          </div>
          <div style="display: flex">
            <DropdownSelect
              class="hoverableTransparantLinear"
              :default="props.strikeObj.hand"
              style="max-width: 10rem; margin-left: 1rem; margin-top: -0.25rem"
              :options="
                props.strikeObj.handRestriction === 'Offhand'
                  ? ['Offhand']
                  : props.strikeObj.handRestriction === 'Primary' || !secondary
                    ? ['Primary']
                    : ['Primary', 'Offhand']
              "
              @selection="(val) => updateHand(val)"
            ></DropdownSelect>
            <StrikeAreaIndicator
              :updateAttack="props.updateAttack"
              :strikeObj="props.strikeObj"
              :name="props.name"
              :weapon="weapon"
              :primary="props.primary"
              :secondary="props.secondary"
              :attack="props.attack"
              :combatStyles="combatStyles"
              :specializations="specializations"
              :addToTypeMalleable="addToTypeMalleable"
              :typeMalleableObj="typeMalleableObj"
              :typeMalleableApplyToAllSkills="typeMalleableApplyToAllSkills"
              :rmTypeMalleable="rmTypeMalleable"
              :increasedCosts="attack.attackObj['Universal Skills'].increasedCosts"
              :universalModifiesSomeCosts="attack.attackObj['Universal Skills'].modifiesSomeCosts"
            ></StrikeAreaIndicator>
            <DropdownSelect
              v-if="modes.length > 1"
              :options="modes"
              :default="modes[mode].text"
              @selection="(m) => (mode = m)"
              style="max-width: 10rem; margin-left: 1rem; margin-top: -0.25rem; min-width: 6rem"
              class="hoverableTransparantLinear"
            ></DropdownSelect>
          </div>
        </div>
        <v-icon
          :style="{ color: designStore.secondaryTheme }"
          scale="3"
          :name="weapon.icon"
        ></v-icon>
        <div style="display: flex; flex-direction: column; justify-content: center">
          <div>"{{ weapon.name }}"</div>
          <div style="font-style: italic; align-self: flex-end; margin-right: 1rem">
            {{ usingSpecialization.name }}
          </div>
        </div>
        <div
          style="
            border: 2px solid;
            height: fit-content;
            font-size: x-large;
            padding: 0.25rem;
            border-radius: 0.5rem;
            margin: 0.5rem;
          "
          :style="{
            borderColor: designStore.secondaryTheme,
            background: designStore.primaryTheme,
            color: designStore.primaryText
          }"
        >
          {{ spentMP }} MP
        </div>
      </div>
      <div
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        style="display: grid; grid-template-columns: 1fr 1fr"
      >
        <div style="padding: 0.5rem">
          <div
            style="font-size: large; border-bottom: 2px solid"
            :style="{ borderColor: designStore.secondaryTheme }"
          >
            Utility
            <i
              :style="{ color: designStore.secondaryTheme }"
              class="bi bi-plus-lg"
              @click="showUtilityModal = true"
            ></i>
          </div>
          <WeaponSkillDisplay
            v-for="skill in selectedUtilitySkills"
            :key="(skill as any).name"
            :mpAllocated="(skill as any).purchasedMp"
            :skillObj="skill"
            :remove="skill.immutable ? undefined : deleteSkill"
            :update="skill.immutable ? undefined : editSkill"
            :increasedCosts="attack.attackObj['Universal Skills'].increasedCosts"
            :universalModifiesSomeCosts="attack.attackObj['Universal Skills'].modifiesSomeCosts"
            :maxSkillRank="(skill as any).attributes ? maxCombatStyleRank : maxSpecRank"
          ></WeaponSkillDisplay>
        </div>
        <div style="padding: 0.5rem">
          <div
            style="font-size: large; border-bottom: 2px solid"
            :style="{ borderColor: designStore.secondaryTheme }"
          >
            Damage:
            {{
              (props.strikeObj.modeObj[modes[mode].text]
                ? props.strikeObj.modeObj[modes[mode].text]?.rollstring
                : props.strikeObj.rollstring
              ).substring(
                0,
                (props.strikeObj.modeObj[modes[mode].text]
                  ? props.strikeObj.modeObj[modes[mode].text]?.rollstring
                  : props.strikeObj.rollstring
                ).indexOf('|')
              )
            }}
            <i
              :style="{ color: designStore.secondaryTheme }"
              class="bi bi-plus-lg"
              @click="showDamageModal = true"
            ></i>
          </div>
          <WeaponSkillDisplay
            v-for="skill in selectedDamageSkills"
            :key="(skill as any).name"
            :skillObj="skill"
            :mpAllocated="(skill as any).purchasedMp"
            :update="editSkill"
            :remove="deleteSkill"
            :increasedCosts="attack.attackObj['Universal Skills'].increasedCosts"
            :maxSkillRank="(skill as any).attributes ? maxCombatStyleRank : maxSpecRank"
          ></WeaponSkillDisplay>
        </div>
      </div>

      <div
        style="padding: 0.25rem; padding-right: 0.5rem; font-size: large; text-align: end"
        :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
      >
        Rollstring:
        {{
          props.strikeObj.modeObj[modes[mode].text]
            ? props.strikeObj.modeObj[modes[mode].text]?.rollstring
            : props.strikeObj.rollstring
        }}
      </div>
    </div>
  </div>
  <CustomModal
    :showModal="showDamageModal"
    @close="showDamageModal = false"
    title="Modify Damage Skills"
  >
    <template v-slot:body>
      <GridSelect
        :updateOption="selectSkillFromPicker"
        :options="damageSkillOptions"
        :selected="selectedDamageSkills.map((s: any) => s.name)"
      ></GridSelect>
    </template>
  </CustomModal>
  <CustomModal
    :showModal="showUtilityModal"
    @close="showUtilityModal = false"
    title="Modify Utility Skills"
  >
    <template v-slot:body>
      <GridSelect
        :updateOption="selectSkillFromPicker"
        :options="utilitySkillOptions"
        :selected="selectedUtilitySkills.map((s: any) => s.name)"
      ></GridSelect>
    </template>
  </CustomModal>
</template>
<style scoped></style>
