<script lang="ts">
import { computed, ComputedRef, onMounted, onUnmounted, ref } from 'vue'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'

import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BDropdown from 'bootstrap-vue-next/src/components/BDropdown/BDropdown.vue'
import { useDesignStore } from '@/stores/designStore'
import BDropdownItem from 'bootstrap-vue-next/src/components/BDropdown/BDropdownItem.vue'
import { storeToRefs } from 'pinia'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import { useTraitsStore } from '@/stores/traitsStore'
import CustomModal from '../CustomModal.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import IconPicker from '../IconPicker.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'

export default {
  props: [
    'icon',
    'removeStatus',
    'removeCustomStatus',
    'addCustomStatus',
    'addStatus',
    'isCustom',
    'statusObj',
    'id'
  ],
  setup(props, context) {
    const modal = ref(false)
    const addModal = ref(false)
    const designStore = useDesignStore()
    function loadValuesAndShowModal(val) {
      modalName.value = val.name
      modalDescription.value = val.description
      modalDuration.value = val.duration || ''
      modalCheckToBreak.value = val.checkToBreak || ''
      modal.value = true
    }
    const modalName = ref('')
    const modalDescription = ref('')
    const modalDuration = ref('')
    const modalCheckToBreak = ref('')
    const basicStatus = ref('')
    const statusEffectsStore = useStatusEffectStore()
    const statusEffects = Object.keys(statusEffectsStore.manualStatusEffect).sort()
    const { manualStatusEffect } = storeToRefs(statusEffectsStore)
    const traitsStore = useTraitsStore()
    const statusName = ref('')
    const statusDescription = ref('')
    const statusIcon = ref('gi-select')
    const statusDuration = ref('')
    const checkToBreak = ref('')

    function remove() {
      modal.value = false
      props.removeStatus(props.statusObj.name)
      props.removeCustomStatus(props.statusObj.name)
    }

    const damageType = ref('Fire')
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
      'Pure Magic'
    ]
    const basicCheckToBreak = ref('')
    const basicDuration = ref('')
    const basicStatusRank = ref(1)
    const getIcon: ComputedRef<string> = computed(() => {
      if (basicStatus.value.indexOf('X') === -1 && manualStatusEffect.value[basicStatus.value])
        return manualStatusEffect.value[basicStatus.value].groupIcon
      if (basicStatus.value.indexOf('X') > -1) {
        return traitsStore.manualTraits[basicStatus.value.substring(2)][
          basicStatus.value.replace('X', damageType.value)
        ]?.icon
      }
      return 'gi-uncertainty'
    })
    function add() {
      props.addStatus(
        basicStatus.value,
        basicCheckToBreak.value,
        basicDuration.value,
        basicStatusRank.value,
        getIcon.value,
        manualStatusEffect.value[basicStatus.value]?.description || '',
        damageType.value,
        props.id
      )
      modal.value = false
    }

    function addCustom() {
      props.addCustomStatus(
        statusName.value,
        checkToBreak.value,
        statusDuration.value,
        statusIcon.value,
        statusDescription.value,
        props.id
      )
      addModal.value = false
    }
    return {
      getIcon,
      designStore,
      modal,
      props,
      remove,
      basicStatus,
      statusEffects,
      damageType,
      damageTypes,
      basicCheckToBreak,
      basicDuration,
      basicStatusRank,
      manualStatusEffect,
      add,
      checkToBreak,
      statusName,
      statusDescription,
      statusIcon,
      statusDuration,
      addModal,
      addCustom
    }
  },
  components: {
    BFormInput,
    BButton,
    BDropdown,
    BDropdownItem,
    CustomModal,
    BFormSelect,
    BInputGroupText,
    IconPicker,
    BFormTextarea
  }
}
</script>

<template>
  <div>
    <div style="display: flex; align-items: center; margin-left: -0.75rem">
      <BDropdown
        style="font-size: medium"
        :style="{
          '--bs-btn-color': designStore.inputText,
          '--bs-btn-hover-bg': 'transparent',
          '--bs-btn-active-color': designStore.inputText,
          '--bs-btn-active-bg:': 'transparent',
          '--bs-dropdown-color': designStore.inputText,
          '--bs-dropdown-bg': designStore.inputBacking,
          '--bs-dropdown-link-hover-color': designStore.alertTheme,
          '--bs-dropdown-link-hover-bg': 'transparent',
          '--bs-dropdown-link-active-color': designStore.alertTheme,
          '--bs-dropdown-link-active-bg': 'transparent',
          scrollbarColor: designStore.secondaryTheme + ' ' + designStore.inputBacking
        }"
      >
        <template #button-content>
          <BButton
            class="hoverableAttr"
            :style="{
              '--dropdownBg': designStore.inputBacking
            }"
            >Add Status</BButton
          >
        </template>
        <BDropdownItem class="dropdown-item" @click="modal = true">Basic Status</BDropdownItem>
        <BDropdownItem class="dropdown-item" @click="addModal = true">Custom Status</BDropdownItem>
      </BDropdown>
    </div>
    <CustomModal :showModal="modal" title="Add Basic Status" @close="modal = false">
      <template v-slot:body>
        <div style="display: flex">
          <BInputGroupText
            style="
              border: 2px solid;
              border-radius: 0.675rem;
              border-right: none;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            >Effect:
          </BInputGroupText>
          <BFormSelect
            v-if="basicStatus.indexOf('X') > -1 || basicStatus === 'Suffering'"
            v-model="basicStatus"
            :options="statusEffects"
            style="border-radius: 0; border: 2px solid; border-left: 1px solid"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
          ></BFormSelect>
          <BFormSelect
            v-else
            v-model="basicStatus"
            :options="statusEffects"
            style="
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
              border: 2px solid;
              border-left: 1px solid;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
          ></BFormSelect>

          <BFormSelect
            v-if="basicStatus.indexOf('X') > -1 || basicStatus === 'Suffering'"
            v-model="damageType"
            :options="damageTypes"
            style="
              border: 2px solid;
              border-left: 1px solid;
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
          ></BFormSelect>

          <v-icon
            :name="getIcon"
            scale="3"
            style="margin-left: 0.5rem"
            :style="{
              color: designStore.primaryText
            }"
          ></v-icon>
        </div>
        <div
          style="display: flex"
          class="wrappingItem"
          v-if="
            basicStatus === 'Suffering' ||
            basicStatus === 'Sickened' ||
            basicStatus === 'Fatigued' ||
            basicStatus === 'Warped'
          "
        >
          <BInputGroupText
            style="
              border: 2px solid;
              border-radius: 0.675rem;
              border-right: none;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
              margin-top: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            >Status Rank</BInputGroupText
          >
          <BFormInput
            v-model="basicStatusRank"
            style="
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
              border: 2px solid;
              border-left: 1px solid;
              margin-right: 0.5rem;
              margin-top: 0.5rem;
            "
            type="number"
            min="1"
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
          ></BFormInput>
        </div>
        <div style="display: flex; margin-top: 0.5rem" class="wrappers">
          <div style="display: flex; width: 100%" class="wrappingItem">
            <BInputGroupText
              style="
                border: 2px solid;
                border-radius: 0.675rem;
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Duration</BInputGroupText
            >
            <BFormInput
              v-model="basicDuration"
              style="
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border: 2px solid;
                border-left: 1px solid;
                margin-right: 0.5rem;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormInput>
          </div>
          <div style="display: flex; width: 100%" class="wrappingItem">
            <BInputGroupText
              style="
                border: 2px solid;
                border-radius: 0.675rem;
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Check Value</BInputGroupText
            >
            <BFormInput
              v-model="basicCheckToBreak"
              style="
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border: 2px solid;
                border-left: 1px solid;
                margin-right: 0.5rem;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormInput>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <BButton
          @click="add()"
          style="border: 1px solid; margin-right: 1rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Add Status</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="modal = false"
          >Cancel</BButton
        ></template
      >
    </CustomModal>
    <CustomModal :showModal="addModal" title="Add Custom Status" @close="addModal = false">
      <template v-slot:body>
        <div style="display: flex">
          <BInputGroupText
            style="
              border: 2px solid;
              border-radius: 0.675rem;
              border-right: none;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            >Name</BInputGroupText
          >
          <BFormInput
            v-model="statusName"
            style="
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
              border: 2px solid;
              border-left: 1px solid;
              margin-right: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
          ></BFormInput>
          <IconPicker
            style="align-self: center; border-radius: 10px"
            :currentIcon="statusIcon"
            @selectedIcon="(icon) => (statusIcon = icon)"
            orientation="bottom"
          ></IconPicker>
        </div>
        <BFormTextarea
          onfocus='this.style.height = "";this.style.height = this.scrollHeight + "px"'
          v-model="statusDescription"
          placeholder="status description..."
          style="white-space: pre-line; min-height: 6rem; margin-top: 0.5rem; border: 2px solid"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
        ></BFormTextarea>
        <div style="display: flex; margin-top: 0.5rem" class="wrappers">
          <div style="display: flex" class="wrappingItem">
            <BInputGroupText
              style="
                border: 2px solid;
                border-radius: 0.675rem;
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Duration</BInputGroupText
            >
            <BFormInput
              v-model="statusDuration"
              style="
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border: 2px solid;
                border-left: 1px solid;
                margin-right: 0.5rem;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormInput>
          </div>
          <div style="display: flex" class="wrappingItem">
            <BInputGroupText
              style="
                border: 2px solid;
                border-radius: 0.675rem;
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Check Value</BInputGroupText
            >
            <BFormInput
              v-model="checkToBreak"
              style="
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border: 2px solid;
                border-left: 1px solid;
                margin-right: 0.5rem;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormInput>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <BButton
          @click="addCustom()"
          style="border: 1px solid; margin-right: 1rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Add as Status</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="addModal = false"
          >Cancel</BButton
        ></template
      >
    </CustomModal>
  </div>
</template>

<style>
.iconContain {
  height: 100%;
  padding-top: 0.5rem;
  padding-left: 0.25rem;
  margin-left: -0.45rem;
  padding-right: 0.65rem;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
</style>
