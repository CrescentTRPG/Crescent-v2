<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useUserStore } from '@/stores/userStore'
import { useAdventureStore } from '@/stores/adventureStore'
import { usePartyStore } from '@/stores/partyStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import CustomModal from '@/components/CustomModal.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import CharacterComputedShell from '../CharacterComputedShell.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import CharacterView from '@/views/CharacterView.vue'
import { useCharacterStore } from '@/stores/characterStore'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { validateHeaderValue } from 'http'
import StatBlockTable from './StatBlockTable.vue'
import AddNewStatBlock from './AddNewStatBlock.vue'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const currentlyBuilding = ref(false)

    return {
      designStore,
      modal,
      adventureStore,
      props,
      currentlyBuilding
    }
  },
  components: {
    TitleWidget,
    StatBlockTable,
    AddNewStatBlock
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <TitleWidget title="Stat Blocks"></TitleWidget>
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
        <v-icon name="gi-spiked-dragon-head" scale="1.5" style="transform: scaleX(1)"></v-icon> Add
        New Stat Block
        <v-icon name="gi-high-punch" scale="1.5" style="transform: scaleX(-1)"></v-icon
      ></BButton>
    </div>
    <StatBlockTable v-if="!currentlyBuilding"></StatBlockTable>
    <AddNewStatBlock v-if="currentlyBuilding"></AddNewStatBlock>
  </div>
</template>

<style></style>
