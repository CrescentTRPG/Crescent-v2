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
import AttributeSkillRoller from './AttributeSkillRoller.vue'
import GuiDice from './GuiDice.vue'

export default {
  props: ['attrs', 'attributes'],
  setup(props) {
    let designStore = useDesignStore()

    return {
      designStore,
      props
    }
  },
  components: { BAccordion, BAccordionItem, AttributeSkillRoller, GuiDice }
}
</script>
<template>
  <div :style="{ fontFamily: designStore.font }">
    <BAccordion
      class="accordion"
      :style="{
        color: designStore.inputText,
        background: designStore.primaryTheme,
        backgroundColor: designStore.inputBacking,
        borderColor: designStore.secondaryTheme
      }"
    >
      <BAccordionItem
        style="z-index: 9"
        :style="{
          color: designStore.inputText,
          background: designStore.primaryTheme,
          borderColor: designStore.secondaryTheme
        }"
      >
        <template v-slot:title>
          <div
            style="display: flex; flex-direction: row; width: 40rem; height: 1rem"
            :style="{ color: designStore.secondaryTheme, background: designStore.inputBacking }"
          >
            <v-icon name="gi-abstract-119" style="position: relative; left: 0.25rem"></v-icon>
            <hr />
            <div style="text-wrap: nowrap" :style="{ color: designStore.inputText }">
              Attributes and Skills
            </div>
            <hr />
            <v-icon name="gi-abstract-119" style="position: relative; right: 0.25rem"></v-icon></div
        ></template>
        <AttributeSkillRoller
          :attributes="props.attrs"
          :skills="props.attributes"
        ></AttributeSkillRoller>
      </BAccordionItem>
      <BAccordionItem
        :style="{
          color: designStore.inputText,
          background: designStore.primaryTheme,
          borderColor: designStore.secondaryTheme
        }"
      >
        <template v-slot:title>
          <div
            style="display: flex; flex-direction: row; width: 40rem; height: 1rem; z-index: 9"
            :style="{ color: designStore.secondaryTheme, background: designStore.inputBacking }"
          >
            <v-icon name="gi-abstract-119" style="position: relative; left: 0.25rem"></v-icon>
            <hr />
            <div style="text-wrap: nowrap" :style="{ color: designStore.inputText }">
              Pictoral Roller
            </div>
            <hr />
            <v-icon name="gi-abstract-119" style="position: relative; right: 0.25rem"></v-icon></div
        ></template>
        <GuiDice :style="{ color: designStore.primaryText }"></GuiDice>
      </BAccordionItem>
    </BAccordion>
  </div>
</template>
<style scoped>
.shaky-btn {
  margin-top: 0.5rem;
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
