<script lang="ts">
import ActionCostDropdown from '@/components/ActionCostDropdown.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import IconPicker from '@/components/IconPicker.vue'
import SearchForAbilityDropdown from '@/components/SearchForAbilityDropdown.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { BForm, BFormInput, BFormTextarea, BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import CustomCheckbox from '../CustomCheckbox.vue'
import EquippableProperties from './EquippableProperties.vue'
export default {
  props: ['holder', 'holderType'],
  emits: ['stagedItem'],
  setup(props, context) {
    const designStore = useDesignStore()
    const hasAbility = ref(false)
    const icon = ref('gi-cubes')
    const item = ref({
      name: '',
      count: 1,
      type: 'Generic',
      description: 'Write the item description here',
      icon: 'gi-cubes',
      isAttuneable: false,
      holder: props.holder,
      holderType: props.holderType,
      isAttuned: false,
      equippedStats: {
        ability: {},
        passives: {},
        material: '',
        enchantments: {},
        technicalAddons: {},
        materialCoverings: {},
        value: 0,
        weight: '',
        hands: 0,
        weaponDamageTypes: [],
        range: 0,
        strReq: 0,
        damageString: '',
        specializations: [],
        combatStyles: [],
        isMusical: false,
        isCustom: false
      }
    })
    const itemAbility = ref({
      isEquipment: true,
      uses: 'Unlimited',
      name: item.value.name,
      actionCost: 'Core Action',
      area: 'Self',
      target: 'Character',
      duration: '1 Round',
      type: 'Instantaneous',
      resistance: 'N/A',
      description: 'item description',
      groupIcon: icon
    })
    const types = ['Generic', 'Armor', 'Weapon', 'Shield', 'Ingredient', 'Potion']
    const emitItem = () => {
      if (!hasAbility.value) {
        context.emit('stagedItem', item.value)
      } else {
        item.value.equippedStats = { ...item.value.equippedStats, ability: itemAbility.value }
        context.emit('stagedItem', item.value)
      }
    }
    function setAbilityFromDropdown(ability) {
      itemAbility.value = ability
      emitItem()
    }
    function setEquippableProperties(updatedInfo) {
      item.value.equippedStats.passives = updatedInfo.passives || item.value.equippedStats.passives
      item.value.equippedStats.material = updatedInfo.material || item.value.equippedStats.material
      item.value.equippedStats.enchantments =
        updatedInfo.enchantments || item.value.equippedStats.enchantments
      item.value.equippedStats.technicalAddons =
        updatedInfo.technicalAddons || item.value.equippedStats.technicalAddons
      item.value.equippedStats.materialCoverings =
        updatedInfo.materialCoverings || item.value.equippedStats.materialCoverings
      item.value.equippedStats.value = updatedInfo.value || item.value.equippedStats.value
      item.value.equippedStats.weight = updatedInfo.weight || item.value.equippedStats.weight
      item.value.equippedStats.hands = updatedInfo.hands || item.value.equippedStats.hands
      item.value.equippedStats.weaponDamageTypes =
        updatedInfo.weaponDamageTypes || item.value.equippedStats.weaponDamageTypes
      item.value.equippedStats.range = updatedInfo.range || item.value.equippedStats.range
      item.value.equippedStats.strReq = updatedInfo.strReq || item.value.equippedStats.strReq
      item.value.equippedStats.damageString =
        updatedInfo.damageString || item.value.equippedStats.damageString
      item.value.equippedStats.specializations =
        updatedInfo.specializations || item.value.equippedStats.specializations
      item.value.equippedStats.combatStyles =
        updatedInfo.combatStyles || item.value.equippedStats.combatStyles
      item.value.equippedStats.isMusical =
        updatedInfo.isMusical || item.value.equippedStats.isMusical
      item.value.equippedStats.isCustom = updatedInfo.isCustom || item.value.equippedStats.isCustom
    }

    const updateHasAbility = (bool: boolean) => {
      hasAbility.value = bool
    }

    return {
      designStore,
      props,
      emitItem,
      item,
      hasAbility,
      updateHasAbility,
      itemAbility,
      types,
      setEquippableProperties,
      setAbilityFromDropdown
    }
  },
  components: {
    BInputGroup,
    BFormInput,
    BInputGroupText,
    ToggleSwitch,
    BFormTextarea,
    ActionCostDropdown,
    BForm,
    DropdownSelect,
    CustomCheckbox,
    EquippableProperties,
    SearchForAbilityDropdown,
    IconPicker
  }
}
</script>
<template>
  <div>
    <div class="nameIcon">
      <div style="display: flex; width: 100%" class="name-and-amount">
        <BInputGroupText
          class="item-name-label"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          >Item Name</BInputGroupText
        >
        <BFormInput
          @change="emitItem()"
          v-model="item.name"
          style="border-radius: 0; width: 100%; border-right: 0"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
        >
        </BFormInput>
        <div class="amount">
          <BInputGroupText
            class="amount-label"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            >Amount</BInputGroupText
          >
          <BFormInput
            @change="emitItem()"
            v-model="item.count"
            type="number"
            style="
              max-width: 5rem;
              border-top-left-radius: 0px;
              border-bottom-left-radius: 0px;
              border: 1px solid;
            "
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          >
          </BFormInput>
        </div>
      </div>
      <div class="item-name-container"></div>
    </div>
    <div style="margin-top: 0.5rem; display: flex">
      <BInputGroupText
        style="border-top-right-radius: 0; border-bottom-right-radius: 0"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        >Item Type</BInputGroupText
      >

      <DropdownSelect
        :default="item.type"
        @selection="(val) => (item.type = val)"
        :borderless="true"
        :options="types"
        :overrideDown="true"
        style="
          height: 2.5rem;
          padding: 0.2rem;
          width: 100%;
          border-radius: 0.375rem;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          border: 1px solid;
        "
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      ></DropdownSelect>
    </div>
    <div class="name-and-amount">
      <BInputGroupText
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        style="border-top-right-radius: 0; border-bottom-right-radius: 0"
        >Is Attuneable?</BInputGroupText
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
          :isChecked="item.isAttuneable"
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
          @true="item.isAttuneable = true"
          @false="item.isAttuneable = false"
        ></CustomCheckbox>
      </div>
      <div class="amount">
        <BInputGroupText
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="attuned-label"
          v-if="item.isAttuneable"
          >Is Attuned?</BInputGroupText
        >
        <div
          v-if="item.isAttuneable"
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
            v-if="item.isAttuneable"
            :overrideBox="''"
            :overrideFill="''"
            :isChecked="item.isAttuned"
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
            @true="item.isAttuned = true"
            @false="item.isAttuned = false"
          ></CustomCheckbox>
        </div>
      </div>
    </div>
    <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap">
      <div style="display: flex; width: 100%; justify-content: flex-end">
        <BInputGroupText
          class="item-label"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          >Item Description</BInputGroupText
        >
      </div>
      <BFormTextarea
        @change="emitItem()"
        style="height: fit-content !important; border-top-right-radius: 0; min-height: 6rem"
        v-model="item.description"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      ></BFormTextarea>
    </div>
    <EquippableProperties
      @equippedStats="(updatedValue) => setEquippableProperties(updatedValue)"
      :type="item.type"
      v-if="item.type === 'Armor' || item.type === 'Shield' || item.type === 'Weapon'"
    ></EquippableProperties>

    <BInputGroup
      style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; max-width: 12rem"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
      ><BInputGroupText
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        style="border-top: none; border-bottom: none; border-left: none"
        >Has Ability ?</BInputGroupText
      >
      <ToggleSwitch
        style="margin-top: 0.5rem; margin-left: 0.3rem"
        @true="updateHasAbility(true)"
        @false="updateHasAbility(false)"
      ></ToggleSwitch>
    </BInputGroup>
    <div v-if="hasAbility" style="margin-top: 1rem">
      <SearchForAbilityDropdown
        @ability="(ability) => setAbilityFromDropdown(ability)"
      ></SearchForAbilityDropdown>
      <BForm
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <div style="display: flex">
          <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Name:</div>

          <BFormInput
            @change="emitItem()"
            v-model="itemAbility.name"
            placeholder="name"
            style="border-left: 0; border-top: 0"
            class="ability-form-item"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme,
              '--bs-secondary-color': designStore.inputText
            }"
          ></BFormInput>
          <div
            class="ability-item"
            style="border-top: 0px solid; align-self: center; width: 95.5%"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme,
              '--bs-secondary-color': designStore.inputText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Uses:</div>

            <BFormInput
              @change="emitItem()"
              v-model="itemAbility.uses"
              placeholder="Uses"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme,
                '--bs-secondary-color': designStore.inputText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <IconPicker
            :style="{ background: designStore.inputBacking }"
            style="align-self: center; border-radius: 10px; margin: 0.25rem"
            :currentIcon="itemAbility.groupIcon || 'gi-cubes'"
            @selectedIcon="(icon) => (itemAbility.groupIcon = icon)"
            orientation="bottom"
            :color="designStore.iconColor"
          ></IconPicker>
        </div>
        <div
          class="abilityGrid"
          style="margin-top: 0rem"
          :style="{
            background: designStore.secondaryTheme,
            color: designStore.sidebarText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <ActionCostDropdown
            v-model="itemAbility.actionCost"
            @change="emitItem()"
            class="grid__item"
          ></ActionCostDropdown>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Target:</div>
            <BFormInput
              @change="emitItem()"
              v-model="itemAbility.target"
              placeholder="target"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Area:</div>
            <BFormInput
              @change="emitItem()"
              v-model="itemAbility.area"
              placeholder="area"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Type:</div>
            <BFormInput
              @change="emitItem()"
              v-model="itemAbility.type"
              placeholder="type"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Duration:</div>
            <BFormInput
              @change="emitItem()"
              v-model="itemAbility.duration"
              placeholder="duration"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">
              Resistance:
            </div>
            <BFormInput
              @change="emitItem()"
              v-model="itemAbility.resistance"
              placeholder="resistance"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
        </div>
        <BFormTextarea
          @change="emitItem()"
          placeholder="description"
          v-model="itemAbility.description"
          class="ability-form-last-item"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          style="border-top: 0; min-height: 6rem"
        ></BFormTextarea>
      </BForm>
    </div>
  </div>
</template>
<style>
.name-and-amount {
  margin-top: 0.5rem;
  display: flex;
}
.ability-form-item {
  border-radius: 0;
  border: 1px solid;
  border-bottom: 0;
}
.ability-form-last-item {
  border-radius: 0;
  border: 1px solid;
}
.form-check-input {
  --bs-form-check-bg: inherit;
  color: inherit;
  border-color: inherit;
}
.form-check {
  --bs-form-check-bg: inherit;
  color: inherit;
  background-color: inherit;
  border-color: inherit;
}
.form-check-input:checked {
  --bs-form-check-bg: inherit;
  color: inherit;
  --input-bg: inherit;
  background-color: var(--input-bg);
  border-color: inherit;
  background-image: none;
}
.nested-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.item-name-label {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
}
.amount {
  width: 100%;
  display: flex;
}

.item-name {
  min-height: 2rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  flex-grow: 1;
}

.item-name-container {
  margin-top: 1.5rem;
  display: flex;
  align-self: center;
  width: auto;
}

.item-label {
  margin-top: -2.5rem;
  align-self: flex-end;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 0;
}

.nameIcon {
  display: flex;
  margin-top: -1rem;
}

.ability-item {
  display: flex;
  justify-content: flex-start;
  height: 100%;
  padding-right: 0.5rem;
}
.amount-label {
  border-radius: 0;
}
.attuned-label {
  border-radius: 0;
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
  margin-left: 0.5rem;
}

.ability-item-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: fit-content;
}
@media (min-width: 1024px) {
  .nested-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 775px) {
  .item-label {
    margin-top: 0;
  }
}
@media (max-width: 650px) {
  .item-label {
    margin-top: -2.5rem;
  }
  .amount-label {
    border-radius: 0;
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }
  .attuned-label {
    margin-left: 0;
    border-radius: 0;
    border-top-left-radius: 0.375rem;
    border-bottom-left-radius: 0.375rem;
  }
  .amount {
    display: flex;
    margin-top: 0.5rem;
  }
  .name-and-amount {
    flex-wrap: wrap;
  }
  .item-name {
    height: fit-content;
    border-bottom-left-radius: 0.375rem;
  }
  .item-name-label {
    height: fit-content;
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-right: 1px solid;
    border-bottom: 0;
  }
  .item-name-container {
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }
  .nested-grid {
    margin-top: -1rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }
  @media (max-width: 570px) {
    .item-label {
      margin-top: 0rem;
    }
  }
  @media (max-width: 450px) {
    .nameIcon {
      flex-wrap: wrap-reverse;
      justify-content: flex-end;
    }
    .item-name-container {
      margin-bottom: 0rem;
      margin-top: -2.5rem;
    }
    .ability-item {
      flex-wrap: wrap;
    }
  }
}
</style>
