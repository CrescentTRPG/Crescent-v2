<script lang="ts">
import { computed, ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { useDesignStore } from '@/stores/designStore.ts'
import { BTableSimple, BTbody, BTd, BTh, BThead, BTr } from 'bootstrap-vue-next'
import AbilityDisplayMedallion from '@/components/AbilityDisplayMedallion.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import IconDisplay from './IconDisplay.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'

export default {
  props: ['title', 'message', 'orientation', 'step', 'shift', 'execute'],
  setup(props, context) {
    const modal = ref(false)
    const characterStore = useCharacterStore()
    const designStore = useDesignStore()
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    const hoverShade = computed(() => {
      const r = parseInt(designStore.alertTheme.substring(1, 3), 16)
      const g = parseInt(designStore.alertTheme.substring(3, 5), 16)
      const b = parseInt(designStore.alertTheme.substring(5, 7), 16)
      return 'rgb(' + r + ',' + g + ',' + b + ',.2)'
    })
    const highlightColor = '0px 0px 10px 3px ' + designStore.alertTheme
    return {
      designStore,
      props,
      lightenDarkenColor,
      highlightColor,
      hoverShade,
      characterStore
    }
  },
  components: { AbilityDisplayMedallion, TitleMedallion, IconDisplay, BButton }
}
</script>

<template>
  <div
    :style="{ color: designStore.alertTheme }"
    style="position: relative; z-index: 9"
    v-if="props.step === characterStore.newPlayerGuideStep"
  >
    <div v-if="orientation === 'left'" style="padding: 0.5rem; display: flex" class="GuideMessage">
      <IconDisplay icon="bi bi-arrow-left" size="2rem" style="align-self: center"></IconDisplay>
      <div
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.alertTheme,
          boxShadow: highlightColor
        }"
        style="border: 1px solid; border-radius: 0.5rem; padding: 0.5rem"
      >
        <TitleMedallion :title="props.title"></TitleMedallion>
        <div>{{ props.message }}</div>
        <div style="display: flex; justify-content: end">
          <BButton
            @click="(characterStore.incrementNewPlayerGuideStep(), props.execute())"
            z-index="10"
            :style="{
              '--hover-color': hoverShade,
              '--hover-blend': designStore.primaryTheme,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            style="
              display: flex;
              align-self: flex-end;
              border: 1px solid;
              position: relative;
              margin-right: 1rem;
              margin-top: 1rem;
            "
            >OK <IconDisplay icon="bi bi-check" size="1rem"></IconDisplay
          ></BButton>
        </div>
        <AbilityDisplayMedallion medallion="bi bi-info-square"></AbilityDisplayMedallion>
      </div>
    </div>
    <div
      class="GuideMessage"
      v-if="orientation === 'right'"
      style="margin: 1rem; padding: 0.5rem; display: flex"
    >
      <div
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.alertTheme,
          boxShadow: highlightColor
        }"
        style="border: 1px solid; border-radius: 0.5rem; padding: 0.5rem"
      >
        <TitleMedallion :title="props.title"></TitleMedallion>
        <div>{{ props.message }}</div>
        <div style="display: flex; justify-content: end">
          <BButton
            @click="(characterStore.incrementNewPlayerGuideStep(), props.execute())"
            z-index="10"
            :style="{
              '--hover-color': hoverShade,
              '--hover-blend': designStore.primaryTheme,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            style="
              display: flex;
              align-self: flex-end;
              border: 1px solid;
              position: relative;
              margin-right: 1rem;
              margin-top: 1rem;
            "
            >OK <IconDisplay icon="bi bi-check" size="1rem"></IconDisplay
          ></BButton>
        </div>
        <AbilityDisplayMedallion medallion="bi bi-info-square"></AbilityDisplayMedallion>
      </div>
      <IconDisplay icon="bi bi-arrow-right" size="2rem"></IconDisplay>
    </div>
    <div class="GuideMessage" v-if="orientation === 'top'" style="margin: 1rem; padding: 0.5rem">
      <div
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.alertTheme,
          boxShadow: highlightColor
        }"
        style="border: 1px solid; border-radius: 0.5rem; padding: 0.5rem"
      >
        <TitleMedallion :title="props.title"></TitleMedallion>
        <div>{{ props.message }}</div>
        <div style="display: flex; justify-content: end">
          <BButton
            @click="(characterStore.incrementNewPlayerGuideStep(), props.execute())"
            z-index="10"
            :style="{
              '--hover-color': hoverShade,
              '--hover-blend': designStore.primaryTheme,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            style="
              display: flex;
              align-self: flex-end;
              border: 1px solid;
              position: relative;
              margin-right: 1rem;
              margin-top: 1rem;
            "
            >OK <IconDisplay icon="bi bi-check" size="1rem"></IconDisplay
          ></BButton>
        </div>
        <AbilityDisplayMedallion medallion="bi bi-info-square"></AbilityDisplayMedallion>
      </div>
      <IconDisplay
        icon="bi bi-arrow-down"
        size="2rem"
        :style="{ textAlign: props.shift }"
      ></IconDisplay>
    </div>
    <div class="GuideMessage" v-if="orientation === 'bottom'" style="margin: 1rem; padding: 0.5rem">
      <IconDisplay
        icon="bi bi-arrow-up"
        size="2rem"
        :style="{ textAlign: props.shift }"
      ></IconDisplay>
      <div
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.alertTheme,
          boxShadow: highlightColor
        }"
        style="border: 1px solid; border-radius: 0.5rem; padding: 0.5rem"
      >
        <TitleMedallion :title="props.title"></TitleMedallion>
        <div>{{ props.message }}</div>
        <div style="display: flex; justify-content: end">
          <BButton
            @click="(characterStore.incrementNewPlayerGuideStep(), props.execute())"
            z-index="100"
            :style="{
              '--hover-color': hoverShade,
              '--hover-blend': designStore.primaryTheme,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            style="
              display: flex;
              align-self: flex-end;
              border: 1px solid;
              position: relative;
              margin-right: 1rem;
              margin-top: 1rem;
            "
            >OK <IconDisplay icon="bi bi-check" size="1rem"></IconDisplay
          ></BButton>
        </div>
        <AbilityDisplayMedallion medallion="bi bi-info-square"></AbilityDisplayMedallion>
      </div>
    </div>
  </div>
</template>

<style>
.GuideMessage {
  animation: fade 0.75s ease-in;
}
@keyframes fade {
  0% {
    opacity: 0%;
    transform: scale(0.25, 0.25);
  }

  100% {
    opacity: 100%;
    transform: scale(1, 1);
  }
}
</style>
