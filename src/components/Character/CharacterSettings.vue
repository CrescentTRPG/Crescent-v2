<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { BNavItem } from 'bootstrap-vue-next'
import { ref } from 'vue'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BNav from 'bootstrap-vue-next/src/components/BNav/BNav.vue'
import { useRouter } from 'vue-router'
import TitleMedallion from '../TitleMedallion.vue'

export default {
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const adventureStore = useAdventureStore()
    let router = useRouter()

    function navItemStyle(item: string) {
      if (navPos.value === item) {
        return designStore.alertTheme
      } else {
        return designStore.sidebarText
      }
    }
    function nukeItAll() {
      context.emit('close')
      characterStore.dispatchHardReset()
    }

    function deleteCharacter() {
      router.push({ name: 'home' })
    }
    const events = ref([{ timestamp: '00;44:33', message: 'Deleted Everything' }])
    const navPos = ref('manage')
    return {
      userStore,
      navPos,
      designStore,
      navItemStyle,
      events,
      nukeItAll,
      characterStore
    }
  },
  components: {
    BNav,
    BNavItem,
    BButton,
    TitleMedallion
  }
}
</script>

<template>
  <div style="display: flex" :style="{ color: designStore.inputText }">
    <BNav
      vertical
      class="sidebar"
      :style="{
        background: designStore.sidebarBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
      ><BNavItem
        :style="{ color: navItemStyle('manage'), background: designStore.sidebarBacking }"
        @click="navPos = 'manage'"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-pencil-ruler" />
          <span class="textI">Manage</span>
        </div></BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('data'), background: designStore.sidebarBacking }"
        @click="navPos = 'data'"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-cloud-upload" />
          <span class="textI">Data Event Log</span>
        </div></BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('adventure'), background: designStore.sidebarBacking }"
        @click="navPos = 'adventure'"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-throne-king" />
          <span class="textI">Adventure</span>
        </div></BNavItem
      >
    </BNav>
    <div
      v-if="navPos === 'manage'"
      style="display: flex; flex-direction: column; width: 100%; padding: 1rem"
      :style="{ background: designStore.inputBacking }"
    >
      <TitleMedallion title="Manage"></TitleMedallion>
      <div style="display: flex; margin-bottom: 1rem; justify-content: space-between">
        <div style="display: flex; flex-direction: column">
          <div
            style="margin-right: 1rem; font-size: large"
            :style="{ fontFamily: designStore.titleFont }"
          >
            Trigger Hard Reset
          </div>
          <div>
            There is a known bug where a character's abilities listed on the overview page can
            become de-synced from what has been selected in build. I am still working on a solution
            to prevent this from ever happening. In this case, triggering a hard reset may fix this
            issue.
          </div>
        </div>
        <BButton
          @click="nukeItAll()"
          style="align-self: flex-start"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          ><i v-if="!characterStore.loading" class="bi bi-arrow-repeat"></i
          ><BSpinner v-else></BSpinner
        ></BButton>
      </div>
      <div style="display: flex; margin-bottom: 1rem; justify-content: space-between">
        <div style="display: flex; flex-direction: column">
          <div
            style="margin-right: 1rem; font-size: large"
            :style="{ fontFamily: designStore.titleFont }"
          >
            Delete Character
          </div>
          <div>
            Permanently delete this character. This action is irreversible. This feature is a
            placeholder and is not yet implemented
          </div>
        </div>
        <BButton
          style="align-self: flex-start"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          ><i class="bi bi-trash3"></i
        ></BButton>
      </div>
    </div>
    <div
      v-if="navPos === 'data'"
      style="display: flex; flex-direction: column; width: 100%; padding: 1rem"
      :style="{ background: designStore.inputBacking }"
    >
      <TitleMedallion title="Data Event Log"></TitleMedallion>
      <div v-for="event in events" :key="event.timestamp">
        <div style="display: flex; justify-content: space-between">
          <div>{{ event.message }}</div>
          <div>{{ event.timestamp }}</div>
        </div>
      </div>
    </div>
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
  display: flex;
  flex-direction: column;
  padding-bottom: 1rem;
  border: solid 2px;
  /* box-shadow: inset -2px -3px 10px 2px; */
  display: flex;
  align-items: start;
  flex-direction: column;
  padding-left: 1rem;
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
