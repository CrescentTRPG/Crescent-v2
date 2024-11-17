<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import CharacterSidebar from '../Build/CharacterSidebar.vue'
import TabContents from '../Build/TabContents.vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    return { designStore, tab }
  },

  methods: {},
  components: {
    CharacterSidebar,
    TabContents
  }
}
</script>

<template>
  <div
    id="BuildTab"
    style="display: flex; justify-content: flex-start; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <CharacterSidebar
      style="width: 20%; max-width: 9rem; z-index: 2; height: inherit"
      @corestats="tab = 'corestats'"
      @traits="tab = 'traits'"
      @skills="tab = 'skills'"
      @martialskills="tab = 'martialskills'"
      @martialperks="tab = 'martialperks'"
      @spells="tab = 'spells'"
      @effigy="tab = 'effigy'"
      @fauna="tab = 'fauna'"
      @performance="tab = 'performance'"
    ></CharacterSidebar>
    <TabContents style="width: 100%; flex-grow: 1; height: fit-content" :tab="tab"></TabContents>
  </div>
</template>

<style></style>
