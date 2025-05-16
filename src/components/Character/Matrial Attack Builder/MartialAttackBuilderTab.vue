<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore'
import { BFormSelect } from 'bootstrap-vue-next'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { computed, ref } from 'vue'
import { usePerformanceStore } from '@/stores/performanceStore'
import { storeToRefs } from 'pinia'
import { useSkillStore } from '@/stores/skillsStore'
import BNavbar from 'bootstrap-vue-next/src/components/BNavbar/BNavbar.vue'
import BNavItem from 'bootstrap-vue-next/src/components/BNav/BNavItem.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import WeaponAttackBuilder from './WeaponAttackBuilder.vue'
import MartialAttackTable from './MartialAttackTable.vue'
import { useCharacterStore } from '@/stores/characterStore'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const navPos = ref('creature')
    const currentlyBuilding = ref(false)
    function switchTab(tab: string) {
      navPos.value = tab
    }
    function navItemStyle(item: string) {
      if (item === navPos.value) {
        return designStore.getAlertTheme
      }
      return designStore.getInputText
    }
    const characterStore = useCharacterStore()

    const { getMp } = storeToRefs(characterStore)

    const spent = ref(0)
    return { designStore, props, switchTab, navPos, getMp, navItemStyle, currentlyBuilding, spent }
  },
  components: {
    TitleWidget,
    BButton,
    WeaponAttackBuilder,
    MartialAttackTable
  }
}
</script>
<template>
  <div>
    <TitleWidget
      v-if="!currentlyBuilding"
      title="Weapon Attack Builder"
      info-message="My eyeballs are slimy"
    ></TitleWidget>

    <div
      v-if="!currentlyBuilding"
      style="display: flex; justify-content: flex-end; border-bottom: 2px solid"
      :style="{
        background: designStore.inputBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <BButton
        style="border-radius: 0; font-size: large; border: 2px solid; border-bottom: 0"
        :style="{
          background: designStore.sidebarBacking,
          color: designStore.sidebarText,
          borderColor: designStore.secondaryTheme
        }"
        @click="currentlyBuilding = true"
      >
        <v-icon name="gi-hammer-drop" scale="1.5" style="transform: scaleX(1)"></v-icon> Build New
        Martial Attack
        <v-icon name="gi-sword-break" scale="1.5" style="transform: rotate(45deg)"></v-icon
      ></BButton>
    </div>
    <div v-if="currentlyBuilding">
      <WeaponAttackBuilder
        @spent="(mp) => (spent = mp)"
        @saved="((currentlyBuilding = false), (spent = 0))"
      ></WeaponAttackBuilder>
    </div>
    <div v-if="!currentlyBuilding"><MartialAttackTable></MartialAttackTable></div>
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
