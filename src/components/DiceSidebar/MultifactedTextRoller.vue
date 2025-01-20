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
import TitleMedallion from '../TitleMedallion.vue'
import BPopover from 'bootstrap-vue-next/src/components/BPopover.vue'

export default {
  emits: ['rollString'],
  setup(props, context) {
    let designStore = useDesignStore()
    const rollString = ref('')

    function roll() {
      context.emit('rollString', rollString.value)
    }

    return {
      designStore,
      rollString,
      props,
      roll
    }
  },
  components: {
    BPopover,
    BFormInput,
    BButton,
    TitleMedallion
  }
}
</script>
<template>
  <div :style="{ fontFamily: designStore.font }">
    <TitleMedallion
      title="Multifaceted Text Roller"
      :color="designStore.primaryText"
    ></TitleMedallion>

    <div style="display: flex; flex-direction: column; margin-right: 0.5rem; margin-left: 0.5rem">
      <div style="display: flex">
        <div style="width: 100%">
          <BFormInput
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme,
              '--bs-secondary-color': designStore.inputText,
              '--bs-form-invalid-border-color': designStore.alertTheme,
              '--bs-focus-ring-color': designStore.alertTheme
            }"
            v-model="rollString"
            min="0"
            placeholder="Enter Roll String..."
          ></BFormInput>
        </div>
        <BPopover
          :style="{
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme
          }"
          class="popover"
          :click="true"
          :close-on-hide="true"
          :delay="{ show: 0, hide: 0 }"
          style="width: fit-content !important; min-width: 20rem; position: absolute"
        >
          <template #target>
            <i
              class="bi bi-patch-question"
              :style="{ color: designStore.alertTheme }"
              style="
                font-size: 2rem;
                width: 2rem;
                cursor: pointer;
                margin-top: 0rem;
                margin-left: 0.25rem;
              "
            ></i>
          </template>
          <div
            style="padding: 0.5rem; border-radius: 0.25rem"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
          >
            Type any die roll to begin in the format [number of dice]d[sides of die]. In order to
            roll a placed roll, simply add "*[number of placed rolls]" to your roll string. To make
            it a displaced roll, do "*-[#of displaced rolls instead]". You can also create more
            complex rolls by adding extra die rolls or flat modifiers with a "+" or subtracting the
            value of a dice roll or flat modifier with a "-". A "++"" has a similar effect but adds
            its value multiple times depending on how many dice are rolled in the expression before
            it. The "--" does a similar effect but subtracting instead. Ex: 4d12 + 5 - 3d4*2
          </div>
        </BPopover>
      </div>
      <div style="display: flex; justify-content: center; margin-left: 0.5rem">
        <BButton
          @click="roll()"
          class="shaky-btn"
          style="border: 2px solid; width: 60%; padding: 0; padding-top: 0.25rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
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
<style>
.shaky-btn {
  margin-top: 0.5rem;
  cursor: pointer;
}
.shaky-btn:active {
  animation: shake 0.4s ease-out;
}
.left {
  margin-bottom: 0.25rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.right {
  margin-bottom: 0.25rem;
  border-left: 0;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
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
