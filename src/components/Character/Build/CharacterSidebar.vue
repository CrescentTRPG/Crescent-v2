<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const navPos = ref('corestats')

    return { designStore, navPos }
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
      this.$emit(tab)
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    BNav
  }
}
</script>

<template>
  <div style="height: 100%">
    <BNav
      vertical
      class="sidebar"
      :style="{
        background: designStore.sidebarBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <BNavItem :style="{ color: navItemStyle('corestats') }" @click="switchTab('corestats')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-skills" />
          <span class="textI">Core Stats</span>
        </div>
      </BNavItem>
      <BNavItem :style="{ color: navItemStyle('skills') }" @click="switchTab('skills')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-jump-across" />
          <span class="textI">Skills</span>
        </div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('martialskills') }"
        @click="switchTab('martialskills')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-crossed-swords" />
          <span class="textI">Martial Skills</span>
        </div>
      </BNavItem>
      <BNavItem :style="{ color: navItemStyle('martialperks') }" @click="switchTab('martialperks')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-sword-tie" />
          <span class="textI">Martial Perks</span>
        </div>
      </BNavItem>
      <BNavItem :style="{ color: navItemStyle('spells') }" @click="switchTab('spells')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-comet-spark" />
          <span class="textI">Spells</span>
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
  height: 100%;
  border-right: solid 4px;
  /* box-shadow: inset -2px -3px 10px 2px; */
  display: flex;
  align-items: start;
  flex-direction: column;
  padding-left: 1rem;
  border-left: solid 2px;
}
@media (max-width: 470px) {
  .textI {
    display: none;
  }
  .sidebar {
    min-width: 4rem;
    height: 100%;
    border-right: solid 2px;
    border-left: solid 2px;
    display: flex;
    align-items: start;
    flex-direction: column;
    padding-left: 1rem;
  }
}
</style>
