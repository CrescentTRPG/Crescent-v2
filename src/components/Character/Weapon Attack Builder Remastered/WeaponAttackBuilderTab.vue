<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { storeToRefs } from 'pinia'
import { computed, Ref, ref } from 'vue'
import MartialAttackTable from '../Matrial Attack Builder/MartialAttackTable.vue'
import { Weapon } from '@/stores/equipmentStore.ts'
import GridSelect from '@/components/GridSelect.vue'
import CustomModal from '@/components/CustomModal.vue'
import _ from 'lodash'
import { MartialAttack } from '@/bases.ts'
import { DEFAULT_WEAPON_ATTACK } from '@/bases.ts'
import BuildAttack from './BuildAttack.vue'

import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'

export default {
  props: ['equipment', 'might', 'strength'],
  setup(props, context) {
    const designStore = useDesignStore()
    const navPos = ref('creature')
    const currentlyBuilding = ref(false)
    function switchTab(tab: string) {
      navPos.value = tab
    }
    function navItemStyle(item: string) {
      if (item === navPos.value) {
        return designStore.getAlertTheme
      }
      return designStore.getInputText
    }
    const characterStore = useCharacterStore()
    const selectPrimaryWeaponModal = ref(false)
    const martialSkillsStore = useMartialSkillsStore()
    const { specializations, combatStyles, allSpecializations } = storeToRefs(martialSkillsStore)

    const selectSecondaryWeaponModal = ref(false)
    function selectPrimary(val) {
      selectedPrimary.value = val
      attack.value = _.cloneDeep(DEFAULT_WEAPON_ATTACK)
      if (
        props.equipment.items.Weapon[val].equippedStats.hands < 2 &&
        parseInt('' + props.strength) >=
          parseInt('' + props.equipment.items.Weapon[val].equippedStats.strReq)
      ) {
        primaryWeaponObj.value = props.equipment.items.Weapon[val]

        let spec =
          allSpecializations.value[primaryWeaponObj.value?.equippedStats.specializations[0]]?.skills
        let passive: any = Object.values(spec).filter(
          (skill: any) => skill.mp_cost === 'Passive'
        )[0]
        attack.value.attackObj['Universal Skills'].skills[passive.name] = passive
        attack.value.attackObj['Universal Skills'].increasedCosts =
          passive.skillStats.increasesCostOfAllEffects
        attack.value.attackObj['Universal Skills'].modifiesSomeCosts =
          passive.skillStats.modifiesSomeCosts

        selectSecondaryWeaponModal.value = true
        selectPrimaryWeaponModal.value = false
      } else if (
        props.might > 4 &&
        parseInt('' + props.equipment.items.Weapon[val].equippedStats.strReq) <=
          parseInt('' + props.strength) * 1.5
      ) {
        primaryWeaponObj.value = props.equipment.items.Weapon[val]

        let spec = Object.values(
          allSpecializations.value[primaryWeaponObj.value?.equippedStats.specializations[0]]?.skills
        )
        console.log(spec)
        let passive: any = spec.filter((skill: any) => skill.mp_cost === 'Passive')[0]
        console.log(passive)

        attack.value.attackObj['Universal Skills'].skills[passive.name] = passive
        attack.value.attackObj['Universal Skills'].increasedCosts =
          passive.skillStats.increasesCostOfAllEffects
        attack.value.attackObj['Universal Skills'].modifiesSomeCosts =
          passive.skillStats.modifiesSomeCosts

        selectSecondaryWeaponModal.value = true
        selectPrimaryWeaponModal.value = false
      } else {
        currentlyBuilding.value = true
        primaryWeaponObj.value = props.equipment.items.Weapon[val]

        let spec =
          allSpecializations.value[primaryWeaponObj.value?.equippedStats.specializations[0]]?.skills
        console.log(spec)
        let passive: any = Object.values(spec).filter(
          (skill: any) => skill.mp_cost === 'Passive'
        )[0]
        attack.value.attackObj['Universal Skills'].skills[passive.name] = passive
        attack.value.attackObj['Universal Skills'].increasedCosts =
          passive.skillStats.increasesCostOfAllEffects
        attack.value.attackObj['Universal Skills'].modifiesSomeCosts =
          passive.skillStats.modifiesSomeCosts
        selectPrimaryWeaponModal.value = false
      }
      attack.value.attackObj['Universal Skills'].modifiesSomeCostsSkill =
        primaryWeaponObj.value?.equippedStats.specializations[0]
      attack.value.attackObj['Universal Skills'].increasedCostsSkill =
        primaryWeaponObj.value?.equippedStats.specializations[0]
    }

    function selectSecondary(val) {
      if (!val) {
        currentlyBuilding.value = true
        selectSecondaryWeaponModal.value = false

        return
      }

      selectedOffhand.value = val
      secondaryWeaponObj.value = props.equipment.items.Weapon[val]
      selectSecondaryWeaponModal.value = false
      let spec =
        allSpecializations.value[secondaryWeaponObj.value?.equippedStats.specializations[0]]?.skills
      let passive: any = Object.values(spec).filter((skill: any) => skill.mp_cost === 'Passive')[0]

      attack.value.attackObj['Universal Skills'].skills[passive.name] = passive
      if (!attack.value.attackObj['Universal Skills'].modifiesSomeCosts) {
        attack.value.attackObj['Universal Skills'].modifiesSomeCosts =
          passive.skillStats.modifiesSomeCosts
        attack.value.attackObj['Universal Skills'].modifiesSomeCostsSkill =
          secondaryWeaponObj.value?.equippedStats.specializations[0]
      }
      if (!attack.value.attackObj['Universal Skills'].increasedCosts) {
        attack.value.attackObj['Universal Skills'].increasedCosts =
          passive.skillStats.increasesCostOfAllEffects
        attack.value.attackObj['Universal Skills'].increasedCostsSkill =
          secondaryWeaponObj.value?.equippedStats.specializations[0]
      }

      currentlyBuilding.value = true
    }
    const primaryWeaponObj: Ref<Weapon | undefined> = ref()
    const secondaryWeaponObj: Ref<Weapon | undefined> = ref()

    function updateAttack(newVal) {
      attack.value = newVal
    }
    const weaponOptions = computed(() => {
      return Object.values(props.equipment.items.Weapon).map((weapon: any) => {
        return {
          description:
            weapon.equippedStats.hands +
            ' handed, strength requirement ' +
            weapon.equippedStats.strReq +
            ', ' +
            weapon.equippedStats.damageString +
            ' weapon' +
            '\nCombat Styles: ' +
            weapon.equippedStats.combatStyles +
            '\nSpecializations: ' +
            weapon.equippedStats.specializations,
          icon: weapon.icon,
          name:
            props.equipment.primaryHand === weapon.name ||
            props.equipment.secondaryHand === weapon.name
              ? '"' + weapon.name + '" (Currently Equipped)'
              : '"' + weapon.name + '"',
          value: weapon.name
        }
      })
    })
    const offhandWeaponOptions = computed(() => {
      let ret = Object.values(props.equipment.items.Weapon)
        .map((weapon: any) => {
          return {
            description:
              weapon.equippedStats.hands +
              ' handed, strength requirement ' +
              weapon.equippedStats.strReq +
              ', ' +
              weapon.equippedStats.damageString +
              ' weapon' +
              '\nCombat Styles: ' +
              weapon.equippedStats.combatStyles +
              '\nSpecializations: ' +
              weapon.equippedStats.specializations,
            icon: weapon.icon,
            name:
              props.equipment.primaryHand === weapon.name ||
              props.equipment.secondaryHand === weapon.name
                ? '"' + weapon.name + '" (Currently Equipped)'
                : '"' + weapon.name + '"',
            value: weapon.name,
            disabled:
              parseInt('' + weapon.equippedStats.hands) >= 2 &&
              parseInt('' + props.might) < 4 &&
              parseInt('' + props.might) >= 4 &&
              parseInt('' + weapon.equippedStats.strReq) > parseInt('' + props.strength) * 1.5
          }
        })
        .sort((a, b) => {
          return a.name.localeCompare(b.name)
        })

      ret.unshift({
        description: 'No Offhand Weapon',
        icon: 'gi-hand',
        name: 'No Offhand',
        value: undefined
      } as any)
      return ret
    })
    const selectedPrimary: Ref<string> = ref('')
    const selectedOffhand: Ref<string> = ref('')
    const attack: Ref<MartialAttack> = ref(_.cloneDeep(DEFAULT_WEAPON_ATTACK))

    const { getMp } = storeToRefs(characterStore)

    function goBack() {
      currentlyBuilding.value = false
      selectedPrimary.value = ''
      selectedOffhand.value = ''
    }

    const spent = ref(0)
    return {
      designStore,
      props,
      switchTab,
      navPos,
      getMp,
      navItemStyle,
      currentlyBuilding,
      spent,
      weaponOptions,
      selectPrimaryWeaponModal,
      selectPrimary,
      selectedPrimary,
      selectSecondaryWeaponModal,
      selectedOffhand,
      selectSecondary,
      offhandWeaponOptions,
      primaryWeaponObj,
      secondaryWeaponObj,
      updateAttack,
      attack,
      specializations,
      combatStyles,
      goBack
    }
  },
  components: {
    TitleWidget,
    BButton,
    MartialAttackTable,
    GridSelect,
    CustomModal,
    BuildAttack
  }
}
</script>
<template>
  <div>
    <TitleWidget
      v-if="!currentlyBuilding"
      title="Weapon Attack Builder"
      info-message="My eyeballs are slimy"
    ></TitleWidget>

    <div
      v-if="!currentlyBuilding"
      style="display: flex; justify-content: flex-end; border-bottom: 2px solid"
      :style="{
        background: designStore.inputBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <BButton
        style="border-radius: 0; font-size: large; border: 2px solid; border-bottom: 0"
        :style="{
          background: designStore.sidebarBacking,
          color: designStore.sidebarText,
          borderColor: designStore.secondaryTheme
        }"
        @click="selectPrimaryWeaponModal = true"
      >
        <v-icon name="gi-hammer-drop" scale="1.5" style="transform: scaleX(1)"></v-icon> Build New
        Martial Attack
        <v-icon name="gi-sword-break" scale="1.5" style="transform: rotate(45deg)"></v-icon
      ></BButton>
    </div>
    <div v-if="currentlyBuilding">
      <BuildAttack
        :primary="primaryWeaponObj"
        :secondary="secondaryWeaponObj"
        :updateAttack="updateAttack"
        :attack="attack"
        :specializations="specializations"
        :combatStyles="combatStyles"
        :goBack="goBack"
      ></BuildAttack>
    </div>
    <div v-if="!currentlyBuilding"><MartialAttackTable></MartialAttackTable></div>
    <CustomModal
      :show-modal="selectPrimaryWeaponModal"
      @close="selectPrimaryWeaponModal = false"
      title="Select Primary Weapon"
    >
      <template v-slot:body>
        <GridSelect
          :options="weaponOptions"
          :updateOption="selectPrimary"
          :selected="selectedPrimary"
          textWrap="balance"
        ></GridSelect
      ></template>
      <template v-slot:footer>
        <div style="font-size: large; margin-left: 2rem"></div>
      </template>
    </CustomModal>
    <CustomModal
      :show-modal="selectSecondaryWeaponModal"
      @close="selectSecondaryWeaponModal = false"
      title="Select Offhand Weapon"
    >
      <template v-slot:body>
        <GridSelect
          :options="offhandWeaponOptions"
          :updateOption="selectSecondary"
          :selected="selectedOffhand"
          textWrap="balance"
        ></GridSelect
      ></template>
      <template v-slot:footer>
        <div style="font-size: large; margin-left: 2rem"></div>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped>
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  width: 100%;
  border: 2px solid;
  border-left: 0px;
  border-right: 0px;
}
@media (max-width: 500px) {
  .navClass {
    width: 100%;
    border: 2px solid;
  }
  .navI {
    padding-bottom: 0.5rem;
  }
  .textI {
    display: none;
  }
}
@media (min-width: 501px) {
  .navI {
    display: none;
  }
  .manText {
    display: none;
  }
}
.manText {
  padding-bottom: 0.5rem;
}
</style>
