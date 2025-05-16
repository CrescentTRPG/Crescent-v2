<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore'
import { useDesignStore } from '@/stores/designStore'
import BAccordion from 'bootstrap-vue-next/src/components/BAccordion/BAccordion.vue'
import BAccordionItem from 'bootstrap-vue-next/src/components/BAccordion/BAccordionItem.vue'
import BNavItem from 'bootstrap-vue-next/src/components/BNav/BNavItem.vue'
import BNavbar from 'bootstrap-vue-next/src/components/BNavbar/BNavbar.vue'
import { computed, ComputedRef, ref } from 'vue'
import TitleWidget from '../TitleWidget.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BFormSelectOption from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelectOption.vue'
import BFormSelectOptionGroup from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelectOptionGroup.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import ToggleSwitch from '../ToggleSwitch.vue'
import { BPopover } from 'bootstrap-vue-next'
import TitleMedallion from '../TitleMedallion.vue'
import DiceIconStack from './DiceIconStack.vue'
import { useSkillStore } from '@/stores/skillsStore'

export default {
  props: ['attributes', 'skills'],
  setup(props, context) {
    let designStore = useDesignStore()
    let characterStore = useCharacterStore()
    let skillStore = useSkillStore()
    const selectedRoll = ref('agility')
    const placedRollOverride = ref(0)
    const override = ref(0)
    const useOverride = ref(false)
    const attrs: ComputedRef<any> = computed(() => {
      return Object.values(props.attributes)
    })
    const passedSkills: ComputedRef<any> = computed(() => {
      return Object.values(props.skills)
    })
    const rolls: ComputedRef<number> = computed(() => {
      if (useOverride.value) {
        return override.value
      } else {
        return props.attributes[selectedRoll.value].placed
      }
    })
    const modifier: ComputedRef<number> = computed(() => {
      let exep = 0
      if (props.attributes[selectedRoll.value]?.attribute) {
        exep = Math.max(
          parseInt(
            props.attributes[props.attributes[selectedRoll.value].attribute.toLowerCase()]
              .exceptionalVal + ''
          ),
          0
        )
      } else {
        exep = Math.max(parseInt(props.attributes[selectedRoll.value].exceptionalVal + ''), 0)
      }

      const val: number = props.attributes[selectedRoll.value]?.modifier + exep

      return val
    })
    function roll() {
      const placed = useOverride.value
        ? override.value
        : props.attributes[selectedRoll.value].placed
      const placedString = placed > 0 || placed < 0 ? '*' + placed : ''
      const rollString = '2d10' + placedString + '+' + modifier.value
      context.emit(
        'as',
        selectedRoll.value.substring(0, 1).toUpperCase() + selectedRoll.value.substring(1)
      )
      context.emit('rollString', rollString)
    }
    function getAttributesArray() {
      return Object.keys(characterStore.attributes).sort()
    }
    function getSkillsArray() {
      const skills = Object.values(skillStore.allSkills)
      return skills.map((skill: { skill: string }) => skill.skill).sort()
    }

    return {
      getSkillsArray,
      getAttributesArray,
      useOverride,
      designStore,
      placedRollOverride,
      selectedRoll,
      props,
      attrs,
      passedSkills,
      override,
      rolls,
      modifier,
      roll
    }
  },
  components: {
    ToggleSwitch,
    BFormSelect,
    BFormSelectOption,
    BFormSelectOptionGroup,
    BFormInput,
    BButton,
    TitleMedallion,
    DiceIconStack
  }
}
</script>
<template>
  <div :style="{ fontFamily: designStore.font }">
    <TitleMedallion title="Attributes and Skills" :color="designStore.primaryText"></TitleMedallion>
    <div style="display: flex; justify-content: end; margin-right: 12rem">
      <DiceIconStack
        :selectedRoll="selectedRoll"
        :modifier="modifier"
        :rolls="rolls"
        :placed="attributes[selectedRoll].placed"
      ></DiceIconStack>
    </div>

    <div
      style="padding: 0.5rem; border-radius: 0.2rem; margin-left: 0.25rem"
      :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
    >
      <BFormSelect
        style="border: 2px solid; cursor: pointer; margin-bottom: 1.35rem; width: 95%"
        v-model="selectedRoll"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <BFormSelectOptionGroup
          label="Attributes"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          <BFormSelectOption
            v-for="attr in getAttributesArray()"
            :key="attr"
            :value="attr"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >{{ attr.substring(0, 1).toUpperCase() + attr.substring(1) }}</BFormSelectOption
          >
        </BFormSelectOptionGroup>
        <BFormSelectOptionGroup
          label="Skills"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          <BFormSelectOption
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            v-for="skill in getSkillsArray()"
            :key="skill"
            :value="skill"
            >{{ skill }}</BFormSelectOption
          >
        </BFormSelectOptionGroup>
      </BFormSelect>

      <div style="display: flex">
        <div style="display: flex; flex-direction: column; flex-grow: 1">
          <div
            style="
              display: flex;
              flex-direction: row;
              flex-grow: 1;
              align-items: center;
              justify-content: start;
            "
          >
            <div
              style="
                display: flex;
                text-wrap: wrap;
                height: 2.5rem;
                align-items: center;
                text-wrap: nowrap;
              "
            >
              Override Placed Rolls
              <ToggleSwitch
                style="margin-left: 0.3rem"
                @true="useOverride = true"
                @false="useOverride = false"
              ></ToggleSwitch>
            </div>
            <BFormInput
              v-model="override"
              v-if="useOverride"
              type="number"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormInput>
          </div>
          <div
            v-for="mod in attributes[selectedRoll].modifiers"
            style="margin-bottom: 0.5rem; margin-left: 1rem"
            :key="mod"
          >
            ❖ {{ mod }}
          </div>
        </div>
      </div>
      <div style="display: flex; justify-content: center; margin-left: 0.5rem">
        <BButton
          class="shaky-btn"
          style="border: 2px solid; width: 60%; padding: 0; padding-top: 0.25rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          @click="roll()"
        >
          <div
            style="display: flex; flex-direction: row; justify-content: center; font-size: large"
            :style="{ color: designStore.secondaryTheme }"
          >
            <div :style="{ color: designStore.primaryText }">Roll!</div>
            <v-icon scale="1.5" name="gi-rolling-dice-cup"></v-icon>
          </div>
        </BButton>
      </div>
    </div>
  </div>
</template>
<style scoped>
.shaky-btn {
  cursor: pointer;
}
.shaky-btn:active {
  animation: shake 0.4s ease-out;
}
@keyframes shake {
  0% {
    transform: skewX(-10deg);
  }

  25% {
    transform: skewX(10deg);
  }

  50% {
    transform: skewX(-10deg);
  }

  75% {
    transform: skewX(10deg);
  }

  100% {
    transform: skewX(-10deg);
  }
}
</style>
