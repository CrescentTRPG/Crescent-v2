<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useUserStore } from '@/stores/userStore'
import { useAdventureStore } from '@/stores/adventureStore'
import { usePartyStore } from '@/stores/partyStore'
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
import { BButton } from 'bootstrap-vue-next'
import EditStatBlock from './EditStatBlock.vue'
import LoadingDisplay from '@/components/LoadingDisplay.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const currentlyBuilding = ref(false)
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    const stagedBlock = ref({})
    const stagedBlockId = ref()
    const loading = ref(false)
    async function select(statBlock) {
      loading.value = true
      stagedBlockId.value = statBlock.id
      let newBlock = await adventureStore.getStatBlockDetails(statBlock.id)
      stagedBlock.value = newBlock || stagedBlock.value
      isNew.value = false
      currentlyBuilding.value = true
      loading.value = false
    }
    function add() {
      isNew.value = true
      currentlyBuilding.value = true
    }

    function clearAndReturn() {
      currentlyBuilding.value = false
      stagedBlock.value = {}
    }

    const isNew = ref(true)
    return {
      designStore,
      modal,
      adventureStore,
      props,
      currentlyBuilding,
      lightenDarkenColor,
      stagedBlock,
      select,
      isNew,
      add,
      loading,
      stagedBlockId,
      clearAndReturn
    }
  },
  components: {
    BButton,
    TitleWidget,
    StatBlockTable,
    AddNewStatBlock,
    EditStatBlock,
    LoadingDisplay
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <TitleWidget v-if="!currentlyBuilding" title="Stat Blocks"></TitleWidget>
    <LoadingDisplay v-if="loading"></LoadingDisplay>
    <div v-else>
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
            borderColor: designStore.secondaryTheme,
            boxShadow: 'inset 0px 0px 0px 3px ' + lightenDarkenColor(designStore.sidebarBacking, 10)
          }"
          @click="add()"
        >
          <v-icon name="gi-spiked-dragon-head" scale="1.5" style="transform: scaleX(1)"></v-icon>
          Add New Stat Block
          <v-icon name="gi-high-punch" scale="1.5" style="transform: scaleX(-1)"></v-icon
        ></BButton>
      </div>
      <StatBlockTable :add="add" :select="select" v-if="!currentlyBuilding"></StatBlockTable>
      <AddNewStatBlock
        v-if="isNew && currentlyBuilding"
        :lightenDarkenColor="lightenDarkenColor"
        :currentStatBlock="{}"
        @return="clearAndReturn()"
      ></AddNewStatBlock>
      <EditStatBlock
        v-if="!isNew && currentlyBuilding"
        :lightenDarkenColor="lightenDarkenColor"
        :currentStatBlock="stagedBlock"
        :id="stagedBlockId"
        @return="clearAndReturn()"
      >
      </EditStatBlock>
    </div>
  </div>
</template>

<style></style>
