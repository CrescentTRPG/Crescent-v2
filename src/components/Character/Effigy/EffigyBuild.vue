<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'

import IconPicker from '@/components/IconPicker.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'

import StatBlockAttributes from '@/components/Adventure/Stat Blocks/StatBlockAttributes.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

import CustomModal from '@/components/CustomModal.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { computed, ref } from 'vue'
import BasicInput from '../BasicInput.vue'
import BaseEffigyProperties from './BaseEffigyProperties.vue'
import EffigyBonuses from './EffigyBonuses.vue'
import EffigyComputedShell from './EffigyComputedShell.vue'
import EffigyType from './EffigyType.vue'

export default {
  props: ['effigy', 'updateEffigy'],
  setup(props, context) {
    const designStore = useDesignStore()
    const nameModal = ref(false)
    const typeModal = ref(false)

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
    const oneToFive = [
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' }
    ]
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }

    function updateName(val) {
      let newEffigy = { ...props.effigy, name: val }
      props.updateEffigy(newEffigy)
      nameModal.value = false
    }
    function updateLevel(val) {
      let newEffigy = { ...props.effigy, level: val }
      props.updateEffigy(newEffigy)
    }
    function updateIcon(val) {
      let newEffigy = { ...props.effigy, groupIcon: val }
      props.updateEffigy(newEffigy)
    }

    const attributeMessages = computed(() => {
      let messages: Array<String> = []
      let maxCount = 34 + props.effigy.level
      let attrCount = Object.values(props.effigy.attributes).reduce(
        (acc: number, val: any) => parseInt(val + '') + acc,
        0
      )
      if (maxCount < attrCount) {
        messages.push(
          'Your attributes are too high!  You have allocated ' +
            attrCount +
            ' points across your attributes when ' +
            maxCount +
            ' is the maximum'
        )
      }
      let baseArr = [6, 5, 5, 5, 4, 4, 3, 2]
      let levelGain = props.effigy.level
      let standardArrayError = true
      Object.values(props.effigy.attributes)
        .map((a) => parseInt(a + ''))
        .sort((a, b) => a - b)
        .reverse()
        .forEach((attr) => {
          let intAttr = parseInt(attr + '')
          if (baseArr[0] === intAttr) {
            baseArr.splice(0, 1)
          } else if (baseArr[0] > intAttr && intAttr > 0) {
            if (standardArrayError) {
              messages.push(
                "Effigies must use a standard array of ([6, 5, 5, 5, 4, 4, 3, 2]). I didn't find a match for " +
                  baseArr[0] +
                  ' instead I found: ' +
                  attr +
                  '.'
              )
            }
            standardArrayError = false

            baseArr.splice(0, 1)
          } else if (intAttr - levelGain <= baseArr[0]) {
            levelGain -= intAttr - baseArr[0]
            baseArr.splice(0, 1)
          } else {
            if (standardArrayError) {
              messages.push(
                "Effigies must use a standard array of ([6, 5, 5, 5, 4, 4, 3, 2]). I didn't find a match for " +
                  baseArr[0] +
                  ' instead I found: ' +
                  attr +
                  '.'
              )
            }
            standardArrayError = false
          }
        })
      if (maxCount > attrCount) {
        messages.push(
          'Suggestion: You can spend ' +
            (maxCount - attrCount) +
            ' more points on attributes.  Make sure you start with the standard array of ([6, 5, 5, 5, 4, 4, 3, 2]) and then apply attribute increases based on the effigy level.  This effigy is entitled to ' +
            props.effigy.level +
            ' increase(s).'
        )
      }

      return messages
    })

    const statusIcon = computed(() => {
      let icon = 'bi bi-patch-question'
      if (attributeMessages.value.length < 1) {
        return undefined
      }
      attributeMessages.value.forEach((message) => {
        if (!message.includes('Suggestion:')) {
          icon = 'bi bi-patch-exclamation'
        }
      })
      return icon
    })
    return {
      designStore,
      damageTypes,
      lightenDarkenColor,
      oneToFive,
      nameModal,
      updateName,
      typeModal,
      updateLevel,
      updateIcon,
      statusIcon,
      attributeMessages
    }
  },
  components: {
    DropdownSelect,
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    StatBlockAttributes,
    RibbonTitle,
    IconPicker,
    EffigyBonuses,
    BaseEffigyProperties,
    EffigyComputedShell,
    CustomModal,
    BasicInput,
    EffigyType,
    TitleWidget
  }
}
</script>
<template>
  <div>
    <div style="display: flex; justify-content: space-between; z-index: 3">
      <div style="display: flex; flex-wrap: wrap">
        <RibbonTitle
          @click="nameModal = true"
          style="height: fit-content; align-self: end; margin: 1rem; margin-right: 0; z-index: 5"
          :background="designStore.primaryTheme"
          :textColor="designStore.primaryText"
          :title="effigy.name === 'New Effigy' ? 'Effigy Name Here' : effigy.name"
        ></RibbonTitle>
        <CustomModal :showModal="nameModal" title="Edit Effigy Name" @close="nameModal = false">
          <template v-slot:body>
            <div>
              <BasicInput
                @newValue="(val) => updateName(val)"
                :label="'name'"
                :value="effigy.name"
              ></BasicInput>
            </div>
          </template>
        </CustomModal>
        <div
          style="align-self: end; margin-bottom: 1rem; display: flex; z-index: 4"
          :style="{ fontFamily: designStore.titleFont, color: designStore.sidebarText }"
        >
          <div
            style="margin-right: 0.5rem; margin-left: 2rem; padding-top: 0.5rem; font-size: large"
          >
            Level
          </div>
          <DropdownSelect
            :default="effigy.level || 0"
            :options="oneToFive"
            style="width: 4rem"
            @selection="(level) => updateLevel(level)"
          ></DropdownSelect>
        </div>
      </div>

      <div style="display: flex; z-index: 4" class="scaleIcons">
        <EffigyType :effigy="effigy" :updateEffigy="updateEffigy"></EffigyType>
        <div
          style="display: flex; flex-direction: column; margin: 0.5rem; border-radius: 0.5rem"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          <div style="text-align: center">Icon</div>
          <IconPicker
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            style="align-self: center; border-radius: 10px; margin: 0.5rem; margin-top: 0"
            :currentIcon="effigy.groupIcon"
            @selectedIcon="(icon) => updateIcon(icon)"
            orientation="left"
          ></IconPicker>
        </div>
      </div>
    </div>
    <div
      style="
        flex-grow: 1;
        height: 3.5rem;
        position: relative;
        flex-grow: 1;
        z-index: 1rem;
        margin-top: -4rem;
      "
      :style="{ background: designStore.sidebarBacking, color: designStore.inputText }"
    ></div>
    <TitleWidget
      title="Attributes"
      :noFlair="true"
      :status="statusIcon"
      :statusMessages="attributeMessages"
      statusTitle="Build Status"
      :suggestionKey="'Suggestion'"
    ></TitleWidget>
    <StatBlockAttributes
      :isEditing="true"
      :currentStatBlock="effigy"
      :updateTemp="updateEffigy"
    ></StatBlockAttributes>
    <div class="arrangeMidsection">
      <EffigyComputedShell
        style="margin-bottom: 4rem"
        :effigy="effigy"
        :updateEffigy="updateEffigy"
      ></EffigyComputedShell>

      <EffigyBonuses :effigy="effigy" :updateEffigy="updateEffigy"></EffigyBonuses>
    </div>
    <BaseEffigyProperties :effigy="effigy" :updateEffigy="updateEffigy"></BaseEffigyProperties>
  </div>
</template>
<style>
.arrangeMidsection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: -22rem;
}
@media (max-width: 700px) {
  .arrangeMidsection {
    display: flex;
    flex-direction: column;
    margin-bottom: -22rem;
  }
  .scaleIcons {
    transform: scale(0.8);
    z-index: 5;
  }
  @media (max-width: 400px) {
    .scaleIcons {
      flex-wrap: wrap;
      transform: scale(0.75);
      margin-bottom: -1rem;
      z-index: 5;
    }
  }
}
.fancySelect {
  cursor: pointer;
  border-width: 2px;
  margin: 0rem;
  margin-bottom: 0.5rem;
  flex-grow: 1;
}

.bonuses {
  clip-path: stroke-box
    polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
  padding: 1rem;
  margin: 1rem;
  border: 2px solid;
  z-index: 3;
  position: relative;
}
</style>
