<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore'
import { useDesignStore } from '../../../stores/designStore'
import { computed, ComputedRef, ref } from 'vue'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BDropdown from 'bootstrap-vue-next/src/components/BDropdown/BDropdown.vue'
import BDropdownItem from 'bootstrap-vue-next/src/components/BDropdown/BDropdownItem.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BInputGroup from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroup.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import IconPicker from '@/components/IconPicker.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import { useTraitsStore } from '@/stores/traitsStore'
import StatusEffectIcon from '@/StatusEffectIcon.vue'

export default {
  props: ['tab'],
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const statusEffectsStore = useStatusEffectStore()
    const traitsStore = useTraitsStore()
    const { manualStatusEffect } = storeToRefs(statusEffectsStore)
    const modal = ref(false)
    const modalName = ref('')
    const addModal = ref(false)
    const statusName = ref('')
    const statusDescription = ref('')
    const statusIcon = ref('gi-select')
    const statusDuration = ref('')
    const checkToBreak = ref('')
    const addBasicModal = ref(false)
    const basicStatus = ref('')
    const basicCheckToBreak = ref('')
    const basicDuration = ref('')
    const basicStatusRank = ref(1)

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

    const statusEffects = Object.keys(statusEffectsStore.manualStatusEffect).sort()
    const modalDescription = ref('')
    const modalDuration = ref('')
    const modalCheckToBreak = ref('')
    const isCustomStatus = ref(false)
    const traitArr: ComputedRef<Array<any>> = computed(() => {
      return Object.values(characterStore.traits)
    })
    const customStatusArr: ComputedRef<Array<any>> = computed(() => {
      return Object.values(characterStore.customStatusEffects)
    })
    const statusArr: ComputedRef<Array<any>> = computed(() => {
      return Object.values(characterStore.statusEffects)
    })
    function loadValuesAndShowModal(val, isCustom) {
      modalName.value = val.name
      modalDescription.value = val.description
      modalDuration.value = val.duration || ''
      modalCheckToBreak.value = val.checkToBreak || ''
      modal.value = true
      isCustomStatus.value = isCustom
    }
    function remove(name) {
      characterStore.removeStatus(name)
    }
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

    function addAsStatus() {
      characterStore.addCustomStatus({
        name: statusName.value,
        description: statusDescription.value,
        duration: statusDuration.value,
        icon: statusIcon.value,
        checkToBreak: checkToBreak.value,
        linkedModifiers: []
      })
      addModal.value = false
    }

    function addStatus() {
      console.log(manualStatusEffect[basicStatus.value]?.groupIcon.value || 'gi-uncertainty')
      let type = ''
      let ogStatus = basicStatus.value
      if (basicStatus.value.indexOf('X') > -1) {
        type = basicStatus.value.substring(2)
        basicStatus.value = basicStatus.value.replace('X', damageType.value)
      }
      statusEffectsStore.addStatus(
        basicStatus.value,
        basicCheckToBreak.value,
        basicDuration.value,
        manualStatusEffect.value[basicStatus.value]?.groupIcon ||
          useTraitsStore().manualTraits[type][basicStatus.value]?.icon ||
          'gi-uncertainty',
        manualStatusEffect.value[ogStatus]?.description || '',
        basicStatusRank.value || 1,
        damageType.value || ''
      )
      addBasicModal.value = false
    }

    return {
      designStore,
      props,
      characterStore,
      traitArr,
      // traitWraps,
      // spillOver,
      // spaces,
      customStatusArr,
      statusArr,
      modal,
      modalName,
      modalDescription,
      modalDuration,
      modalCheckToBreak,
      isCustomStatus,
      remove,
      loadValuesAndShowModal,
      addModal,
      statusName,
      statusDescription,
      statusIcon,
      statusDuration,
      checkToBreak,
      addAsStatus,
      addBasicModal,
      basicStatus,
      statusEffects,
      damageType,
      damageTypes,
      basicCheckToBreak,
      basicDuration,
      manualStatusEffect,
      addStatus,
      basicStatusRank,
      traitsStore,
      getIcon
    }
  },
  methods: {
    formatHTML(description: string) {
      console.log('what?')
      let sections = description.split('❖ ')
      console.log(sections)
      let ret
      if (sections.length === 1) {
        sections = description.split('\\n')
        if (sections.length === 1) {
          return '<div>' + description + '</div>'
        }
      }
      ret = '<div style="margin-bottom: .25rem">' + sections[0] + '</div>'
      sections.shift()
      sections.forEach((s) => {
        ret +=
          '<li style="padding-left: 1rem; margin-bottom: .25rem;list-style-type:none;text-indent: -1rem ;">' +
          '❖ ' +
          s +
          '</li>'
      })

      return ret
    },
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  },
  components: {
    CustomModal,
    BButton,
    BDropdown,
    BDropdownItem,
    BFormInput,
    BInputGroupText,
    BFormTextarea,
    IconPicker,
    BFormSelect,
    StatusEffectIcon
  }
}
</script>

<template>
  <div style="height: max-content; width: 100%">
    <div
      style="
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-auto-rows: max-content;
        border-bottom: 2px solid;
        border-left: 2px solid;
      "
      :style="{ background: designStore.inputBacking, borderColor: designStore.secondaryTheme }"
    >
      <div class="traitRibbon">
        <div v-for="t in traitArr" :key="t.name" @click="loadValuesAndShowModal(t, false)">
          <StatusEffectIcon
            :icon="t.icon"
            :status-obj="t"
            :notRemoveable="true"
            :color="designStore.primaryText"
            :is-custom="false"
            :boxShadow="
              'inset -5px 0px 3px 1px ' + LightenDarkenColor(designStore.primaryTheme, 10)
            "
            borderBottom="1px solid"
            :background="designStore.primaryTheme"
          ></StatusEffectIcon>
          <!-- <div
            class="iconContain"
            v-if="t.icon.substring(0, 2) == 'gi'"
            :style="{
              boxShadow:
                'inset -5px 0px 3px 1px ' + LightenDarkenColor(designStore.primaryTheme, 10),
              borderBottom: '1px solid',

              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme
            }"
          >
            <v-icon
              scale="1.5"
              :name="t.icon"
              style="cursor: pointer"
              :style="{ color: designStore.primaryText }"
            ></v-icon>
          </div>
          <div
            class="iconContain"
            :style="{
              borderColor: designStore.secondaryTheme,
              color: designStore.primaryText
            }"
            v-if="t.icon.substring(0, 2) == 'bi'"
            style="font-size: 1.5rem; cursor: pointer"
          >
            <i :class="t.icon"></i>
          </div> -->
        </div>
        <div style="display: flex" v-if="traitArr.length >= 1">
          <div
            style="
              width: 1rem;
              height: 2.5rem !important;
              margin-top: 0.2rem;
              padding: 0.5rem;
              z-index: 5;
            "
            :style="{
              background: designStore.primaryTheme,
              boxShadow:
                'inset 4px 0px 3px 1px ' + LightenDarkenColor(designStore.primaryTheme, -20)
            }"
          >
            {{ ' ' }}
          </div>
          <div
            v-if="traitArr.length >= 1"
            style="display: flex; flex-direction: column; z-index: 5; margin-bottom: 0.1rem"
          >
            <div class="ribbon-top" :style="{ borderLeftColor: designStore.primaryTheme }"></div>
            <div class="ribbon-bottom" :style="{ borderLeftColor: designStore.primaryTheme }"></div>
          </div>
        </div>
      </div>
      <div>
        <div class="statusRibbon">
          <div v-for="t in statusArr" :key="t.name">
            <StatusEffectIcon
              :icon="t.icon"
              :status-obj="t"
              :remove-status="remove"
              :is-custom="false"
              style="margin-top: -0.25rem"
            ></StatusEffectIcon>
          </div>
          <div v-for="t in customStatusArr" :key="t.name">
            <StatusEffectIcon
              :icon="t.icon"
              :status-obj="t"
              :remove-status="remove"
              :is-custom="true"
              style="margin-top: -0.25rem"
            ></StatusEffectIcon>
          </div>
          <div class="iconContain" style="display: flex; align-items: center; margin-top: 0.25rem">
            <BDropdown
              style="font-size: medium"
              :style="{
                '--bs-btn-color': designStore.inputText,
                '--bs-btn-hover-bg': designStore.inputBacking,
                '--bs-btn-active-color': designStore.inputText,
                '--bs-btn-active-bg:': designStore.inputBacking,
                '--bs-dropdown-color': designStore.inputText,
                '--bs-dropdown-bg': designStore.inputBacking,
                '--bs-dropdown-link-hover-color': designStore.alertTheme,
                '--bs-dropdown-link-hover-bg': designStore.inputBacking,
                '--bs-dropdown-link-active-color': designStore.alertTheme,
                '--bs-dropdown-link-active-bg': designStore.primaryTheme,
                scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
              }"
            >
              <template #button-content>
                <BButton
                  style="margin-bottom: 0.5rem"
                  :style="{
                    '--dropdownBg': designStore.inputBacking
                  }"
                  >Add Status</BButton
                >
              </template>
              <BDropdownItem class="dropdown-item" @click="addBasicModal = true"
                >Basic Status</BDropdownItem
              >
              <BDropdownItem @click="addModal = true" class="dropdown-item"
                >Custom Status</BDropdownItem
              >
            </BDropdown>
          </div>
        </div>
      </div>

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
            @click="addAsStatus()"
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

      <CustomModal
        :showModal="addBasicModal"
        title="Add Basic Status"
        @close="addBasicModal = false"
      >
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
            @click="addStatus()"
            style="border: 1px solid; margin-right: 1rem"
            :style="{ borderColor: designStore.secondaryTheme }"
            >Add Status</BButton
          >
          <BButton
            style="border: 1px solid"
            :style="{ borderColor: designStore.secondaryTheme }"
            @click="addBasicModal = false"
            >Cancel</BButton
          ></template
        >
      </CustomModal>
    </div>
  </div>
</template>

<style>
.traitRibbon {
  margin-left: 0.25rem;
  display: flex;
  flex-wrap: wrap;
  grid-auto-rows: 3rem;
  font-size: large;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 2;
}

.statusRibbon {
  height: 2.6rem !important;
  z-index: 1;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  font-size: large;
  padding-left: 0.5rem;
  padding: 0.5rem;
  padding-top: 0.25rem;
  grid-column: 2;
}

.iconContain {
  height: 100%;
  padding-top: 0.5rem;
  padding-left: 0.25rem;
  margin-left: -0.45rem;
  padding-right: 0.65rem;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
}
.ribbon-top {
  margin-top: 0.2rem;
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 20px solid transparent;

  border-left: 15px solid;
}
.ribbon-bottom {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 0px solid transparent;

  border-left: 15px solid;
}
@media (max-width: 600px) {
  .wrappers {
    flex-wrap: wrap;
  }
  .wrappingItem {
    margin-bottom: 0.5rem;
  }
}
</style>
