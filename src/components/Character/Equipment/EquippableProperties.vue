<script lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import SearchableDropdown from '@/components/SearchableDropdown.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { Passive, useEquipmentStore } from '@/stores/equipmentStore.ts'
import PassiveListObj from './PassiveListObj.vue'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import CustomCheckbox from '../CustomCheckbox.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import BDropdown from 'bootstrap-vue-next/src/components/BDropdown/BDropdown.vue'
import BDropdownItem from 'bootstrap-vue-next/src/components/BDropdown/BDropdownItem.vue'
import { defaultWeapons } from './defaultWeapons'

export default {
  emits: ['equippedStats'],
  props: ['type', 'passedStats'],
  setup(props, context) {
    const title: ComputedRef<String> = computed(() => {
      return props.type + ' Properties'
    })
    const designStore = useDesignStore()
    const equipmentStore = useEquipmentStore()
    const martialSkillsStore = useMartialSkillsStore()
    const passives: Ref<any> = ref(props.passedStats?.passives || {})
    const material = ref(props.passedStats?.material || '')
    const searchS = ref('')
    const enchantments = ref(props.passedStats?.enchantments || {})
    const technicalAddons = ref(props.passedStats?.technicalAddons || {})
    const materialCoverings = ref(props.passedStats?.materialCoverings || {})
    const weaponDamageTypes: Ref<Array<string>> = ref(props.passedStats?.weaponDamageTypes || [])
    const value = ref(props.passedStats?.value || 0)
    const weight = ref(props.passedStats?.weight || 'Light')
    const hands = ref(props.passedStats?.hands || 1)
    const range = ref(props.passedStats?.range || 0)
    const strReq = ref(props.passedStats?.strReq || 0)
    const damageString = ref(props.passedStats?.damageString || '1d6')
    const specializations: Ref<Array<string>> = ref(props.passedStats?.specializations || [])
    const selectedSpecialization = ref('Axes')
    const selectedCombatStyle = ref('')
    const selectedDamageType = ref('')

    const defaults = defaultWeapons

    const combatStylesList: ComputedRef<Array<string>> = computed(() => {
      return martialSkillsStore.allSpecializations[selectedSpecialization.value].combatStyles
    })
    const specializationsList: ComputedRef<Array<string>> = computed(() => {
      return Object.keys(martialSkillsStore.allSpecializations)
    })
    const combatStyles: Ref<Array<string>> = ref([])

    const isMusical = ref(props.passedStats?.isMusical || false)
    const target = ref('')
    const isCustom = ref(props.passedStats?.isCustom || false)
    const armorWeight = ref(['Robe', 'Light', 'Medium', 'Heavy'])
    const damageTypes = [
      'Fire',
      'Ice',
      'Lightning',
      'Force',
      'Toxic',
      'Stress',
      'Piercing',
      'Edged',
      'Blunt',
      'Blight',
      'Divine',
      'Pure Magic',
      'Mundane',
      'Magical',
      'Elemental'
    ]
    const passiveDamageType = ref('')
    const modAmount = ref(0)
    const modifier = ref('')
    const modifierType = [
      'Modify Attribute',
      'Override Attribute',
      'Add Exceptional(s)',
      'Add Inferior(s)',
      'Resistance',
      'Susceptibility',
      'Immunity',
      'Vulnerability',
      'Damage Reduction',
      'Damage Amplification',
      'Rot',
      'Suffering',
      'Hp Regen',
      'Barrier Regen',
      'Modify Base Hp',
      'Override Base Hp',
      'Mana Regen',
      'Modify Base Mana',
      'Override Base Mana',
      'Override Bonus Dvs',
      'Override Move Dvs',
      'Modify Bonus Dvs',
      'Modify Move Dvs',
      'Override Armor Dvs',
      'Override Shield Dvs',
      'Modify Armor Dvs',
      'Modify Shield Dvs',
      'Modify Mp',
      'Override Mp',
      'Modify Movespeed',
      'Override Movespeed',
      'Modify Flightspeed',
      'Override Flightspeed',
      'Modify Swimspeed',
      'Override Swimspeed',
      'Modify Climbspeed',
      'Override Climbspeed',
      'Modify Burrowspeed',
      'Override Burrowspeed',
      'Add Placed Rolls',
      'Add Displaced Rolls',
      'Override Placed Rolls',
      'Override Displaced Rolls'
    ]
    const attributes = [
      'Strength',
      'Agility',
      'Health',
      'Willpower',
      'Perception',
      'Charisma',
      'Intelligence',
      'Power'
    ]
    const rollTypes = [
      'Strength',
      'Agility',
      'Health',
      'Willpower',
      'Perception',
      'Charisma',
      'Intelligence',
      'Power',
      'Acrobatics',
      'Alchemy',
      'Awareness',
      'Crafting',
      'Fitness',
      'Knowledge',
      'Interpersonal',
      'Metamagic',
      'Might',
      'Subtlety',
      'Performance'
    ]

    const materials = ['Iron', 'Steel', 'Lumil', 'Adamant', 'Oricalcum', 'Selenium', 'Illastrium']

    function removePassive(name: string, damageType: string) {
      delete passives.value[name]
      delete passives.value[damageType + ' ' + name]

      passChanges()
    }
    function passChanges() {
      if (props.type === 'Armor') {
        const obj = {
          value: value.value,
          weight: weight.value,
          passives: passives.value,
          material: material.value,
          enchantments: enchantments.value,
          technicalAddons: technicalAddons.value,
          materialCoverings: materialCoverings.value
        }
        context.emit('equippedStats', obj)
      }
      if (props.type === 'Shield') {
        const obj = {
          value: value.value,
          passives: passives.value,
          material: material.value,
          enchantments: enchantments.value,
          technicalAddons: technicalAddons.value,
          materialCoverings: materialCoverings.value
        }
        context.emit('equippedStats', obj)
      }
      if (props.type === 'Weapon') {
        const obj = {
          hands: hands.value,
          weaponDamageTypes: weaponDamageTypes.value,
          range: range.value,
          strReq: strReq.value,
          damageString: damageString.value,
          specializations: specializations.value,
          combatStyles: combatStyles.value,
          isMusical: isMusical.value,
          isCustom: isCustom.value,
          passives: passives.value,
          material: material.value,
          enchantments: enchantments.value,
          technicalAddons: technicalAddons.value,
          materialCoverings: materialCoverings.value
        }
        context.emit('equippedStats', obj)
      }
    }
    function addPassive() {
      if (selectedMod.value) {
        if (
          selectedMod.value.includes('Attribute') ||
          selectedMod.value.includes('laced') ||
          selectedMod.value.includes('Inferior') ||
          selectedMod.value.includes('Exceptional')
        ) {
          const loc = selectedMod.value + ' ' + target.value
          let passiveObj = {
            modAmount: modAmount.value,
            name: loc,
            damageType: passiveDamageType.value
          }
          passives.value[loc] = passiveObj
        } else if (
          selectedMod.value === 'Suffering' ||
          selectedMod.value === 'Resistance' ||
          selectedMod.value === 'Susceptibility' ||
          selectedMod.value === 'Immunity' ||
          selectedMod.value === 'Vulnerability' ||
          selectedMod.value === 'Damage Reduction' ||
          selectedMod.value === 'Damage Amplification'
        ) {
          let passiveObj = {
            modAmount: modAmount.value,
            name: selectedMod.value,
            damageType:
              selectedMod.value === 'Suffering' ||
              selectedMod.value === 'Resistance' ||
              selectedMod.value === 'Susceptibility' ||
              selectedMod.value === 'Immunity' ||
              selectedMod.value === 'Vulnerability' ||
              selectedMod.value === 'Damage Reduction' ||
              selectedMod.value === 'Damage Amplification'
                ? passiveDamageType.value
                : ''
          }
          passives.value[passiveDamageType.value + ' ' + selectedMod.value] = passiveObj
        } else {
          let passiveObj = {
            modAmount: modAmount.value,
            name: selectedMod.value,
            damageType:
              selectedMod.value === 'Suffering' ||
              selectedMod.value === 'Resistance' ||
              selectedMod.value === 'Susceptibility' ||
              selectedMod.value === 'Immunity' ||
              selectedMod.value === 'Vulnerability' ||
              selectedMod.value === 'Damage Reduction' ||
              selectedMod.value === 'Damage Amplification'
                ? passiveDamageType.value
                : ''
          }
          passives.value[selectedMod.value] = passiveObj
        }
        modAmount.value = 0
        selectedMod.value = ''
        searchS.value = ''
        passiveDamageType.value = ''
        passChanges()
      }
    }
    function addWeaponSkills() {
      if (!combatStyles.value.includes(selectedCombatStyle.value)) {
        combatStyles.value.push(selectedCombatStyle.value)
      }
      if (!specializations.value.includes(selectedSpecialization.value)) {
        specializations.value.push(selectedSpecialization.value)
      }
      passChanges()
    }
    function addDamageType() {
      if (!weaponDamageTypes.value.includes(selectedDamageType.value)) {
        weaponDamageTypes.value.push(selectedDamageType.value)
      }
      passChanges()
    }
    function populateFields(pos: number) {
      material.value = 'Iron'
      strReq.value = defaultWeapons[pos].strReq
      range.value = defaultWeapons[pos].range
      hands.value = defaultWeapons[pos].hands
      weaponDamageTypes.value = defaultWeapons[pos].damageTypes || []
      damageString.value = defaultWeapons[pos].damageString
      specializations.value = defaultWeapons[pos].specialzations || []
      combatStyles.value = defaultWeapons[pos].combatStyles || []
      passChanges()
    }

    const selectedMod = ref('add New Modifier')
    return {
      passChanges,
      modifier,
      passiveDamageType,
      addPassive,
      designStore,
      props,
      armorWeight,
      value,
      weight,
      material,
      passives,
      enchantments,
      technicalAddons,
      materialCoverings,
      hands,
      damageTypes,
      range,
      strReq,
      damageString,
      specializations,
      combatStyles,
      isMusical,
      isCustom,
      selectedMod,
      modAmount,
      modifierType,
      title,
      attributes,
      rollTypes,
      target,
      materials,
      searchS,
      removePassive,
      combatStylesList,
      specializationsList,
      selectedSpecialization,
      selectedCombatStyle,
      addWeaponSkills,
      populateFields,
      defaults,
      weaponDamageTypes,
      addDamageType,
      selectedDamageType
    }
  },
  components: {
    BFormSelect,
    BFormInput,
    TitleMedallion,
    SearchableDropdown,
    BButton,
    PassiveListObj,
    CustomCheckbox,
    BInputGroupText,
    BDropdown,
    BDropdownItem
  }
}
</script>
<template>
  <div>
    <TitleMedallion :title="title" :color="designStore.primaryText"></TitleMedallion>
    <!-- -------------------------ARMOR-------------------------- -->
    <div class="armor" v-if="props.type === 'Armor'">
      <SearchableDropdown
        :options="materials"
        :searchS="material"
        class="material"
        borders="left"
        @select="(selection) => (material = selection)(passChanges())"
      ></SearchableDropdown>

      <BFormSelect
        v-model="weight"
        :options="armorWeight"
        class="armor-weight"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
        @change="passChanges()"
      ></BFormSelect>
      <BFormInput
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
        type="number"
        v-model="value"
        class="value"
        @change="passChanges()"
      ></BFormInput>
    </div>

    <!-- -------------------------Shield-------------------------- -->
    <div class="shield" v-if="props.type === 'Shield'">
      <SearchableDropdown
        :options="materials"
        :searchS="material"
        class="material"
        borders="left"
        @select="(selection) => (material = selection)(passChanges())"
      ></SearchableDropdown>
      <BFormInput
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
        type="number"
        v-model="value"
        class="value"
        @change="passChanges()"
      ></BFormInput>
    </div>

    <!-- -------------------------Weapon-------------------------- -->
    <div class="weapon" v-if="props.type === 'Weapon'">
      <BDropdown
        style="font-size: medium"
        :style="{
          '--bs-btn-color': designStore.primaryText,
          '--bs-btn-hover-color': designStore.primaryText,
          '--bs-btn-hover-bg': designStore.primaryTheme,
          '--bs-btn-active-color': designStore.primaryText,
          '--bs-btn-active-bg:': designStore.inputBacking,
          '--bs-dropdown-color': designStore.inputText,
          '--bs-dropdown-bg': designStore.inputBacking,
          '--bs-dropdown-link-hover-color': designStore.alertTheme,
          '--bs-dropdown-link-hover-bg': designStore.inputBacking,
          '--bs-dropdown-link-active-color': designStore.alertTheme,
          '--bs-dropdown-link-active-bg': designStore.inputBacking,
          scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
        }"
      >
        <template #button-content>
          <BButton
            style="margin-bottom: 0.5rem; margin: 0rem; width: 100%"
            :style="{
              '--dropdownBg': designStore.inputBacking,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
            >Populate Fields from Default</BButton
          >
        </template>
        <BDropdownItem
          v-for="(weapon, index) in defaults"
          class="dropdown-item"
          @click="populateFields(index)"
          :key="weapon.name"
          >{{ defaults[index].name }}</BDropdownItem
        >
      </BDropdown>
      <div class="weapon-row">
        <div style="width: 100%">
          Material
          <SearchableDropdown
            :options="materials"
            :searchS="material"
            class="material"
            borders="left"
            @select="(selection) => (material = selection)(passChanges())"
          ></SearchableDropdown>
        </div>
        <div style="min-width: 7rem">
          STR Req
          <BFormInput
            class="strReq"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            type="number"
            v-model="strReq"
            @change="passChanges()"
          ></BFormInput>
        </div>
        <div style="min-width: 7rem">
          # Hands
          <BFormInput
            class="hands"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            type="number"
            v-model="hands"
            @change="passChanges()"
          ></BFormInput>
        </div>
        <div style="min-width: 6rem">
          Range
          <BFormInput
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            type="number"
            v-model="range"
            class="range"
            @change="passChanges()"
          ></BFormInput>
        </div>
      </div>
      <div class="damage-row">
        <div class="damageStringContainer">
          <BInputGroupText
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            style="border-top-right-radius: 0; border-bottom-right-radius: 0"
            >Damage String</BInputGroupText
          >
          <BFormInput
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            v-model="damageString"
            class="damageString"
            @change="passChanges()"
          ></BFormInput>
        </div>
        <div class="damageStringContainer">
          <SearchableDropdown
            :options="damageTypes"
            style="border-top-right-radius: 0"
            borders="left"
            @select="(selection) => (selectedDamageType = selection)"
          ></SearchableDropdown>
          <BButton
            style="
              min-width: 6rem;
              border: 1px solid;
              margin-right: 0.5rem;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            "
            :style="{
              color: designStore.primaryText,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            @click="addDamageType()"
            >Add Type</BButton
          >
        </div>
        <div style="display: flex">
          <BInputGroupText
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            style="border-top-right-radius: 0; border-bottom-right-radius: 0"
            >Is Musical?</BInputGroupText
          >
          <div
            style="
              border: 1px solid;
              border-top-right-radius: 0.375rem;
              border-bottom-right-radius: 0.375rem;
            "
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <CustomCheckbox
              :overrideBox="''"
              :overrideFill="''"
              :isChecked="isMusical"
              style="
                position: relative;
                bottom: 0.25rem;
                margin-left: 1rem;
                height: 0rem;
                width: inherit;
                margin-right: 1rem;
                width: 2rem;
              "
              :update="0"
              @true="isMusical = true"
              @false="isMusical = false"
            ></CustomCheckbox>
          </div>
        </div>
      </div>
      <div class="weapon-row">
        <BFormSelect
          v-model="selectedSpecialization"
          :options="specializationsList"
          class="specialization"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          @change="passChanges()"
        ></BFormSelect>
        <BFormSelect
          v-model="selectedCombatStyle"
          :options="combatStylesList"
          class="combatStyles"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          @change="passChanges()"
        ></BFormSelect>
        <BButton
          :style="{
            color: designStore.primaryText,
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme
          }"
          @click="addWeaponSkills()"
          class="weaponButton"
          >Add Weapon Skills</BButton
        >
      </div>
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap">
        <div style="display: flex">
          Specializations:
          <div
            v-for="(spec, index) in specializations"
            style="padding-left: 0.5rem; display: flex"
            :key="spec"
          >
            {{ spec }}
            <div v-if="index < specializations.length - 1">,</div>
          </div>
        </div>
        <div style="display: flex">
          Combat Styles:
          <div
            v-for="(style, index) in combatStyles"
            style="padding-left: 0.5rem; display: flex"
            :key="style"
          >
            {{ style }}
            <div v-if="index < combatStyles.length - 1">,</div>
          </div>
        </div>
      </div>
      <div style="display: flex">
        Damage Types:
        <div
          v-for="(damage, index) in weaponDamageTypes"
          style="padding-left: 0.5rem; display: flex"
          :key="damage"
        >
          {{ damage }}
          <div v-if="index < weaponDamageTypes.length - 1">,</div>
        </div>
      </div>
    </div>

    <div style="margin: 0.5rem; margin-bottom: 0">Add Passive Effect...</div>
    <div
      style="border: 3px solid; border-radius: 10px; display: flex"
      :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
    >
      <SearchableDropdown
        :options="modifierType"
        style="border-top-right-radius: 0"
        borders="left"
        :search-s="searchS"
        @select="(selection) => (selectedMod = selection)"
      ></SearchableDropdown>

      <BFormSelect
        v-if="
          selectedMod === 'Suffering' ||
          selectedMod === 'Resistance' ||
          selectedMod === 'Susceptibility' ||
          selectedMod === 'Immunity' ||
          selectedMod === 'Vulnerability' ||
          selectedMod === 'Damage Reduction' ||
          selectedMod === 'Damage Amplification'
        "
        style="border-radius: 0"
        v-model="passiveDamageType"
        :options="damageTypes"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking
        }"
      ></BFormSelect>
      <BFormSelect
        v-model="target"
        v-if="
          selectedMod === 'Override Attribute' ||
          selectedMod === 'Modify Attribute' ||
          selectedMod === 'Add Inferior(s)' ||
          selectedMod === 'Add Exceptional(s)'
        "
        style="border-radius: 0; max-width: 8rem"
        :options="attributes"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking
        }"
      ></BFormSelect>
      <BFormSelect
        v-model="target"
        v-if="
          selectedMod === 'Add Placed Rolls' ||
          selectedMod === 'Override Placed Rolls' ||
          selectedMod === 'Override Displaced Rolls' ||
          selectedMod === 'Add Displaced Rolls'
        "
        style="border-radius: 0; max-width: 9rem"
        :options="rollTypes"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking
        }"
      ></BFormSelect>
      <BFormInput
        v-if="
          selectedMod !== 'Resistance' &&
          selectedMod !== 'Susceptibility' &&
          selectedMod !== 'Immunity' &&
          selectedMod !== 'Vulnerability'
        "
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        type="number"
        placeholder="value"
        style="border-radius: 0; max-width: 4rem"
        v-model="modAmount"
      ></BFormInput>

      <BButton @click="addPassive()" style="width: 5rem; padding-top: 0.5rem; padding-left: 0.5rem"
        ><i class="bi bi-plus-lg" @click="addPassive()"></i
      ></BButton>
    </div>
    <PassiveListObj
      v-for="passive in Object.values(passives) as Array<Passive>"
      :modifierType="passive.name"
      :modAmount="passive.modAmount"
      :damageType="passive.damageType"
      :key="passive.name"
      @delete="removePassive(passive.name, passive.damageType)"
    >
    </PassiveListObj>
  </div>
</template>
<style>
.armor {
  margin-top: 0.5rem;
  display: flex;
}
.weapon {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
}
.damage-row {
  margin-bottom: 0.5rem;
  display: flex;
}
.weapon-row {
  margin-bottom: 0.5rem;
  display: flex;
}
.shield {
  margin-top: 0.5rem;
  display: flex;
}
.material {
  border-radius: 0;
}
.specialization {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.combatStyles {
  border-radius: 0;
}
.strReq {
  border-radius: 0;
}
.hands {
  border-radius: 0;
}
.damageString {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  margin-right: 0.5rem;
}
.weaponButton {
  min-width: 10rem;
  border: 1px solid;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.armor-weight {
  border-radius: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;

  max-width: 10rem;
}
.value {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  max-width: 5rem;
}
.range {
  max-width: 7rem;
  border-radius: 0.375rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.damageStringContainer {
  display: flex;
}
@media (max-width: 900px) {
  .damage-row {
    flex-wrap: wrap;
  }
  .damageStringContainer {
    margin-bottom: 0.5rem;
    display: flex;
  }
}
@media (max-width: 700px) {
  .weapon-row {
    flex-wrap: wrap;
  }
  .strReq {
    max-width: 7rem;
    border-radius: 0.375rem;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .hands {
    max-width: 7rem;
  }

  @media (max-width: 550px) {
    .hands {
      border-radius: 0.375rem;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .range {
      max-width: 10rem;
      border-radius: 0.375rem;
    }
  }
}
</style>
