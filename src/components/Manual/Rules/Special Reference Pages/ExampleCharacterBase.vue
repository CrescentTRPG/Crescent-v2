<script lang="ts">
import { computed, ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { useDesignStore } from '@/stores/designStore.ts'
import ExampleCharacterBuild from './ExampleCharacterBuild.vue'
import ExampleCharacterOverview from './ExampleCharacterOverview.vue'
import {
  DevoutProtector,
  IronBlade,
  PoisonBlade,
  pyromaniac,
  ScarletThorn,
  SureShot
} from './ExampleCharacterBases.ts'
import BNavbar from 'bootstrap-vue-next/src/components/BNavbar/BNavbar.vue'
import { BNavItem } from 'bootstrap-vue-next'

export default {
  props: ['character'],
  setup(props, context) {
    const modal = ref(false)

    const designStore = useDesignStore()
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    const navPos = ref('build')

    let exampleCharacter = computed(() => {
      return props.character === 'Pyromaniac'
        ? pyromaniac
        : props.character === 'Sure Shot'
          ? SureShot
          : props.character === 'Iron Blade'
            ? IronBlade
            : props.character === 'Devout Protector'
              ? DevoutProtector
              : props.character === 'Poison Blade'
                ? PoisonBlade
                : ScarletThorn
    })

    function navItemStyle(item: string) {
      if (item === navPos.value) {
        return designStore.getAlertTheme
      }
      return designStore.getInputText
    }
    function navItemStyleBg(item: string) {
      if (item === navPos.value) {
        return designStore.pageBackdrop
      }
      return designStore.inputBacking
    }
    return {
      designStore,
      props,
      lightenDarkenColor,
      navItemStyle,
      navItemStyleBg,
      navPos,
      exampleCharacter
    }
  },

  components: { ExampleCharacterBuild, ExampleCharacterOverview, BNavbar, BNavItem }
}
</script>

<template>
  <div style="position: relative">
    <BNavbar
      class="navClass"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.inputBacking,
        fontFamily: designStore.font
      }"
    >
      <BNavItem
        :style="{ color: navItemStyle('build'), background: designStore.inputBacking }"
        @click="navPos = 'build'"
        class="textI"
        >Build</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('build'), background: designStore.inputBacking }"
        @click="navPos = 'build'"
        class="navI"
      >
        <i class="bi bi-tools"></i>
        <div v-if="navPos === 'build'">Build</div>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('overview'), background: designStore.inputBacking }"
        @click="navPos = 'overview'"
        class="textI"
        >Overview</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('overview'), background: designStore.inputBacking }"
        @click="navPos = 'overview'"
        class="navI"
      >
        <i class="bi bi-view-list"></i>
        <div v-if="navPos === 'overview'">Overview</div>
      </BNavItem>
    </BNavbar>
    <div v-if="navPos === 'build'">
      <ExampleCharacterBuild
        :stats="exampleCharacter.stats"
        :buildName="exampleCharacter.buildName"
        :buildDescription="exampleCharacter.buildDescription"
        :archetype="exampleCharacter.archetype"
        :archetypeDescription="exampleCharacter.archetypeDescription"
        :atributeDescriptions="exampleCharacter.atributeDescriptions"
        :exceptionalDescription="exampleCharacter.exceptionalDescription"
        :abilitiesDesciption="exampleCharacter.abilitiesDesciption"
        :originSkills="exampleCharacter.originSkills"
        :originSkillsDescription="exampleCharacter.originSkillsDescription"
        :equipment="exampleCharacter.equipment"
        :lunarMotivation="exampleCharacter.lunarMotivation"
        :lunarMotivationDescription="exampleCharacter.lunarMotivationDescription"
      ></ExampleCharacterBuild>
    </div>

    <div v-if="navPos === 'overview'">
      <ExampleCharacterOverview :stats="exampleCharacter.stats"></ExampleCharacterOverview>
    </div>
  </div>
</template>

<style scoped>
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  width: 100%;
  border: 2px solid;
  border-left: 0px;
  border-right: 0px;
}
@media (max-width: 500px) {
  .navClass {
    width: 100%;
    border: 2px solid;
  }
  .navI {
    padding-bottom: 0.5rem;
  }
  .textI {
    display: none;
  }
}
@media (min-width: 501px) {
  .navI {
    display: none;
  }
  .manText {
    display: none;
  }
}
.manText {
  padding-bottom: 0.5rem;
}
</style>
