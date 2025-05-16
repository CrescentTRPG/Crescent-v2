<script lang="ts">
import {} from 'vue-router'
import { useDesignStore } from '../../../../stores/designStore'
import TitleWidget from '@/components/TitleWidget.vue'
import { BNavbar } from 'bootstrap-vue-next'
import { computed, ref } from 'vue'
import BNavItem from 'bootstrap-vue-next/src/components/BNav/BNavItem.vue'
import CreaturesTable from './CreaturesTable.vue'
import CreatureBuilder from './CreatureBuilder.vue'
import AdaptationsTable from './AdaptationsTable.vue'
import { useFaunaStore } from '@/stores/faunaStore'
import BuildCustomCreature from './BuildCustomCreature.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { useSpellStore, ManualSpell } from '@/stores/spellsStore'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const spellsStore = useSpellStore()
    const navPos = ref('creature')
    function switchTab(tab: string) {
      navPos.value = tab
    }
    function navItemStyle(item: string) {
      if (item === navPos.value) {
        return designStore.getAlertTheme
      }
      return designStore.getInputText
    }
    function shiftMode(newMode) {
      mode.value = newMode
    }

    const knownTraitsList = computed(() => {
      let arr: Array<any> = []
      useFaunaStore().getCreatures.forEach((creature) => {
        arr = arr.concat(creature.Traits)
      })
      const s = new Set(arr)
      return [...s]
    })
    const mode = ref('table')

    return { designStore, props, switchTab, navPos, navItemStyle, mode, shiftMode, spellsStore }
  },
  methods: {},
  components: {
    TitleWidget,
    BNavbar,
    BNavItem,
    CreaturesTable,
    CreatureBuilder,
    AdaptationsTable,
    BuildCustomCreature,
    BButton
  }
}
</script>

<template>
  <div>
    <TitleWidget
      title="Fauna"
      :info-message="'When buying ranks in the fauna spellgroup, a character gains the ability to morph their body few a few mechanisms: Base Creatures, Adaptations, and for some characters: Custom Creatures.'"
    ></TitleWidget>
    <BNavbar
      style="border-left: 0; border-right: 0"
      class="navClass"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.inputBacking,
        fontFamily: designStore.font
      }"
    >
      <BNavItem
        :style="{ color: navItemStyle('creature'), background: designStore.inputBacking }"
        @click="switchTab('creature')"
        class="textI"
        >Creatures</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('creature'), background: designStore.inputBacking }"
        @click="switchTab('creature')"
        class="navI"
      >
        <v-icon name="gi-polar-bear" scale="1.5"></v-icon>
        <div v-if="navPos === 'creature'">Creatures</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('adapt'), background: designStore.inputBacking }"
        @click="switchTab('adapt')"
        class="textI"
        >Adaptations</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('adapt'), background: designStore.inputBacking }"
        @click="switchTab('adapt')"
        class="navI"
      >
        <v-icon name="gi-tumor" scale="1.5"></v-icon>
        <div v-if="navPos === 'adapt'">Adaptations</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('builder'), background: designStore.inputBacking }"
        @click="switchTab('builder')"
        class="textI"
        >Creature Builder</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('builder'), background: designStore.inputBacking }"
        @click="switchTab('builder')"
        class="navI"
      >
        <v-icon name="gi-frankenstein-creature" scale="1.5"></v-icon>
        <div v-if="navPos === 'builder'">Creature Builder</div>
      </BNavItem>
    </BNavbar>
    <div v-if="navPos === 'creature'">
      <div
        style="display: flex; justify-content: flex-end; border-bottom: 2px solid"
        :style="{
          background: designStore.pageBackdrop,
          color: designStore.sidebarText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <BButton
          v-if="
            mode === 'table' &&
            spellsStore.isSpellKnown({ name: 'Transformation' } as ManualSpell, 'Fauna')
          "
          style="
            border-radius: 0;
            font-size: large;
            border: 2px solid;
            border-bottom: 0;
            border-top: 0;
          "
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText,
            borderColor: designStore.secondaryTheme
          }"
          @click="shiftMode('buildCustom')"
        >
          <v-icon name="gi-wyvern" scale="1.5" style="transform: scaleX(-1)"></v-icon> Build Custom
          Transformation <v-icon name="gi-griffin-symbol" scale="1.5"></v-icon
        ></BButton>
        <BButton
          v-if="mode != 'table'"
          style="
            border-radius: 0;
            font-size: large;
            border: 2px solid;
            border-bottom: 0;
            border-top: 0;
          "
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText,
            borderColor: designStore.secondaryTheme
          }"
          @click="shiftMode('table')"
        >
          <i class="bi bi-arrow-90deg-left"></i>
          Discard Custom Transformation
        </BButton>
      </div>
      <CreaturesTable v-if="mode === 'table'"></CreaturesTable>
      <BuildCustomCreature
        @added="shiftMode('table')"
        v-if="mode === 'buildCustom'"
      ></BuildCustomCreature>
    </div>
    <div v-if="navPos === 'adapt'">
      <AdaptationsTable></AdaptationsTable>
    </div>
    <div v-if="navPos === 'builder'">
      <CreatureBuilder></CreatureBuilder>
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
