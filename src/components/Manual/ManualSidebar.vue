<script lang="ts">
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { BNav, BNavItem } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const designStore = useDesignStore()
    const spellsStore = useSpellStore()
    const skillsStore = useSkillStore()
    const martialSkillsStore = useMartialSkillsStore()

    const navPos = ref('rules')
    return { designStore, navPos, props }
  },
  methods: {
    navItemStyle(item: string) {
      if (item === this.navPos) {
        return this.designStore.getAlertTheme
      }
      return this.designStore.getSidebarText
    },
    navItemStyleBg(item: string) {
      if (item === this.navPos) {
        return this.designStore.pageBackdrop
      }
      return this.designStore.inputBacking
    },
    switchTab(tab: string) {
      this.navPos = tab
      this.$emit('tabChange', tab)
    }
  },
  components: {
    BNavItem,
    BNav
  }
}
</script>

<template>
  <div>
    <BNav
      class="sidebar"
      :style="{
        background: designStore.sidebarBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <BNavItem :style="{ color: navItemStyle('rules') }" @click="switchTab('rules')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-rule-book" />
          <span class="textI">Rules Reference</span>
        </div>
      </BNavItem>
      <BNavItem :style="{ color: navItemStyle('abilities') }" @click="switchTab('abilities')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-magic-palm" />
          <span class="textI">Abilities</span>
        </div>
      </BNavItem>
      <BNavItem
        v-if="!props.isCharacter"
        :style="{ color: navItemStyle('manual') }"
        @click="switchTab('manual')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-notebook" />
          <span class="textI">Modify Manual</span>
        </div>
      </BNavItem>
      <BNavItem
        v-if="!props.isCharacter"
        :style="{ color: navItemStyle('rolling') }"
        @click="switchTab('rolling')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-perspective-dice-six-faces-random" />
          <span class="textI">Rolling Tables</span>
        </div>
      </BNavItem>
    </BNav>
  </div>
</template>

<style scoped>
.giIcon {
  font-size: 2rem;
}
li {
  list-style-type: none;
  text-align: start;
  padding-top: 1rem;
  width: 85%;
}
.vertical {
  display: flex;
  flex-direction: column;
}

.sidebar {
  --bs-nav-link-padding-x: 0;
  --bs-nav-link-padding-y: 0;
  --bs-nav-link-color: color !important;
  --bs-nav-link-hover-color: color !important;
  margin-left: 0;
  max-width: 9rem;
  min-width: 9rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: solid 4px;
  /* box-shadow: inset -2px -3px 10px 2px; */
  display: flex;
  align-items: start;
  padding-left: 1rem;
  border-left: solid 2px;
}
@media (max-width: 800px) {
  .sidebar {
    flex-direction: row;
    max-width: none;
    display: flex;
    width: 100%;
    border: none;
    justify-content: space-around;
  }
  .vertical {
    display: flex;
    flex-direction: row;
  }
  li {
    list-style-type: none;
    text-align: start;
    padding-top: 1rem;
    width: fit-content;
    padding: 0.55rem;
  }
}
@media (max-width: 720px) {
  .long {
    display: none;
  }
}
@media (min-width: 721px) {
  .short {
    display: none;
  }
}
@media (max-width: 500px) {
  .textI {
    display: none;
  }
  .sidebar {
    min-width: 4rem;
    border-right: solid 2px;
    border-left: solid 2px;
    display: flex;
    align-items: start;
    padding-left: 1rem;
  }
}
</style>
