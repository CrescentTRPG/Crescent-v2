<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { ref } from 'vue'
import TitleMedallion from '../TitleMedallion.vue'

export default {
  setup(props, context) {
    let designStore = useDesignStore()
    let d4 = ref({ num: 0, placedRolls: 0 })
    let d6 = ref({ num: 0, placedRolls: 0 })
    let d8 = ref({ num: 0, placedRolls: 0 })
    let d10 = ref({ num: 0, placedRolls: 0 })
    let d12 = ref({ num: 0, placedRolls: 0 })
    let d20 = ref({ num: 0, placedRolls: 0 })
    function roll() {
      const d4String =
        d4.value.num > 0
          ? d4.value.placedRolls != 0
            ? '(' + d4.value.num + 'd4*' + d4.value.placedRolls + ')'
            : '(' + d4.value.num + 'd4' + ')'
          : ''
      const d6String =
        d6.value.num > 0
          ? d6.value.placedRolls != 0
            ? '(' + d6.value.num + 'd6*' + d6.value.placedRolls + ')'
            : '(' + d6.value.num + 'd6' + ')'
          : ''
      const d8String =
        d8.value.num > 0
          ? d8.value.placedRolls != 0
            ? '(' + d8.value.num + 'd8*' + d8.value.placedRolls + ')'
            : '(' + d8.value.num + 'd8' + ')'
          : ''
      const d10String =
        d10.value.num > 0
          ? d10.value.placedRolls != 0
            ? '(' + d10.value.num + 'd10*' + d10.value.placedRolls + ')'
            : '(' + d10.value.num + 'd10' + ')'
          : ''
      const d12String =
        d12.value.num > 0
          ? d12.value.placedRolls != 0
            ? '(' + d12.value.num + 'd12*' + d12.value.placedRolls + ')'
            : '(' + d12.value.num + 'd12' + ')'
          : ''
      const d20String =
        d20.value.num > 0
          ? d20.value.placedRolls != 0
            ? '(' + d20.value.num + 'd20*' + d20.value.placedRolls + ')'
            : '(' + d20.value.num + 'd20' + ')'
          : ''
      const rollString = d4String + d6String + d8String + d10String + d12String + d20String
      context.emit('rollString', rollString)
    }
    return {
      designStore,
      d4,
      d6,
      d8,
      d10,
      d12,
      d20,
      props,
      roll
    }
  },
  components: {
    BFormInput,
    BButton,
    TitleMedallion
  }
}
</script>
<template>
  <div :style="{ fontFamily: designStore.font }">
    <TitleMedallion title="Pictoral Roller" :color="designStore.primaryText"></TitleMedallion>

    <div style="display: flex; flex-direction: column; margin-right: 0.5rem">
      <div style="display: flex">
        <div style="display: flex; flex-direction: column">
          <div style="padding: 0.55rem"></div>
          <v-icon name="gi-d4" scale="2.5"></v-icon>
        </div>
        <div style="display: flex; flex-direction: column">
          <div># Dice</div>
          <BFormInput
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme,
              '--bs-secondary-color': designStore.inputText
            }"
            class="left"
            type="number"
            min="0"
            placeholder="# Dice"
            v-model="d4.num"
          ></BFormInput>
        </div>
        <div style="display: flex; flex-direction: column">
          <div># Placed/Displaced</div>
          <BFormInput
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme,
              '--bs-secondary-color': designStore.inputText
            }"
            class="right"
            type="number"
            placeholder="# Placed Rolls"
            v-model="d4.placedRolls"
          ></BFormInput>
        </div>
      </div>
      <div style="display: flex">
        <v-icon name="gi-perspective-dice-six" scale="2.5"></v-icon>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="left"
          type="number"
          min="0"
          placeholder="# Dice"
          v-model="d6.num"
        ></BFormInput>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="right"
          type="number"
          placeholder="# Placed Rolls"
          v-model="d6.placedRolls"
        ></BFormInput>
      </div>
      <div style="display: flex">
        <v-icon name="gi-dice-eight-faces-eight" scale="2.5"></v-icon>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="left"
          type="number"
          min="0"
          v-model="d8.num"
          placeholder="# Dice"
        ></BFormInput>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="right"
          v-model="d8.placedRolls"
          type="number"
          placeholder="# Placed Rolls"
        ></BFormInput>
      </div>
      <div style="display: flex">
        <v-icon name="gi-d10" scale="2.5"></v-icon>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="left"
          type="number"
          v-model="d10.num"
          min="0"
          placeholder="# Dice"
        ></BFormInput>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="right"
          type="number"
          placeholder="# Placed Rolls"
          v-model="d10.placedRolls"
        ></BFormInput>
      </div>
      <div style="display: flex">
        <v-icon name="gi-d12" scale="2.5"></v-icon>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="left"
          type="number"
          v-model="d12.num"
          min="0"
          placeholder="# Dice"
        ></BFormInput>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="right"
          v-model="d12.placedRolls"
          type="number"
          placeholder="# Placed Rolls"
        ></BFormInput>
      </div>
      <div style="display: flex">
        <v-icon name="gi-dice-twenty-faces-twenty" scale="2.5"></v-icon>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="left"
          type="number"
          v-model="d20.num"
          min="0"
          placeholder="# Dice"
        ></BFormInput>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          class="right"
          type="number"
          v-model="d20.placedRolls"
          placeholder="# Placed Rolls"
        ></BFormInput>
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
