<script lang="ts">
import { onMounted, Ref, ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useAdventureStore } from '@/stores/adventureStore'

import TitleWidget from '@/components/TitleWidget.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import CombatTable from './CombatTable.vue'
import { DEFAULT_COMBAT } from '@/bases'
import _ from 'lodash'
import PlanCombat from './PlanCombat.vue'
import LoadingDisplay from '@/components/LoadingDisplay.vue'
import { useInitiativeStore } from '@/stores/initiativeStore'
import { storeToRefs } from 'pinia'

export default {
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const initiativeStore = useInitiativeStore()
    const mode = ref('table')
    const tempCombat = ref({ ...DEFAULT_COMBAT })
    const activeCombat = storeToRefs(adventureStore)
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    onMounted(() => {
      tempCombat.value = _.cloneDeep(adventureStore.activeCombat)
      mode.value = adventureStore.combatNavPos
    })

    function updateTemp(temp) {
      tempCombat.value = _.cloneDeep(temp)
      let combatantsWithPreservedInitiative = { ...tempCombat.value.combatants }
      Object.keys(combatantsWithPreservedInitiative).forEach((c) => {
        combatantsWithPreservedInitiative[c].initiativeScore =
          initiativeStore.combatants[c].initiativeScore || 0
      })
      console.log(combatantsWithPreservedInitiative)
      initiativeStore.updateCombatants(combatantsWithPreservedInitiative)
      adventureStore.updateActiveCombat(tempCombat.value, mode.value)
    }
    const combatId: Ref<string | null> = ref(null)

    function planCombat() {
      combatId.value = null
      mode.value = 'build'
      updateTemp({
        combatants: {},
        initiative: {},
        notes: '',
        tags: [],
        name: 'Default Combat'
      })
    }
    const loading = ref(false)
    async function fight(combat) {
      loading.value = true
      let combatDetails = (await adventureStore.getCombatDetails(combat.id)) || combat
      combatId.value = combat.id
      mode.value = 'run'
      initiativeStore.resetInitiativeOpened()
      initiativeStore.clearOrderedCombatants()
      initiativeStore.updateCombatants(combatDetails.combatants)
      updateTemp(combatDetails)
      adventureStore.dispatchAdventureStart()
      loading.value = false
    }
    async function planCombatFromExisting(combat) {
      loading.value = true

      let combatDetails = (await adventureStore.getCombatDetails(combat.id)) || combat
      combatId.value = combat.id
      mode.value = 'build'
      updateTemp(combatDetails)
      loading.value = false
    }
    async function toTable() {
      mode.value = 'table'
      updateTemp({
        combatants: {},
        initiative: {},
        notes: '',
        tags: [],
        name: 'Default Combat'
      })
    }

    function quickStartCombat() {
      combatId.value = null
      mode.value = 'run'
      updateTemp({
        combatants: {},
        initiative: {},
        notes: '',
        tags: [],
        name: 'Default Combat'
      })
      adventureStore.dispatchAdventureStart()
    }

    function rm(id) {
      adventureStore.removeCombat(id)
    }

    return {
      designStore,
      modal,
      adventureStore,
      props,
      lightenDarkenColor,
      mode,
      planCombat,
      quickStartCombat,
      updateTemp,
      tempCombat,
      toTable,
      planCombatFromExisting,
      fight,
      combatId,
      rm,
      loading
    }
  },
  components: {
    TitleWidget,
    BButton,
    CombatTable,
    PlanCombat,
    LoadingDisplay
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <TitleWidget v-if="mode === 'table'" title="Combats"></TitleWidget>
    <LoadingDisplay v-if="loading"></LoadingDisplay>
    <div v-else>
      <div
        v-if="mode === 'table'"
        style="display: flex; justify-content: flex-end; border-bottom: 2px solid"
        :style="{
          background: designStore.inputBacking,
          color: designStore.sidebarText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <BButton
          style="
            border-radius: 0;
            font-size: large;
            border: 2px solid;
            border-bottom: 0;
            border-right: 0;
          "
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText,
            borderColor: designStore.secondaryTheme,
            boxShadow: 'inset 0px 0px 0px 3px ' + lightenDarkenColor(designStore.sidebarBacking, 10)
          }"
          @click="quickStartCombat()"
        >
          <v-icon name="gi-swordman" scale="1.5" style="transform: scaleX(1)"></v-icon>
          Quick Start Combat
          <v-icon name="gi-high-punch" scale="1.5" style="transform: scaleX(-1)"></v-icon
        ></BButton>
        <BButton
          style="border-radius: 0; font-size: large; border: 2px solid; border-bottom: 0"
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText,
            borderColor: designStore.secondaryTheme,
            boxShadow: 'inset 0px 0px 0px 3px ' + lightenDarkenColor(designStore.sidebarBacking, 10)
          }"
          @click="planCombat()"
        >
          <v-icon name="gi-notebook" scale="1.5" style="transform: scaleX(1)"></v-icon> Plan New
          Combat <v-icon name="gi-id-card" scale="1.5" style="transform: scaleX(-1)"></v-icon
        ></BButton>
      </div>
      <CombatTable
        v-if="mode === 'table'"
        :plan="planCombat"
        :select="planCombatFromExisting"
        :fight="fight"
        :rm="rm"
      ></CombatTable>
      <PlanCombat
        v-if="mode === 'build' || mode === 'run'"
        :lightenDarkenColor="lightenDarkenColor"
        :updateTemp="updateTemp"
        :combat="tempCombat"
        :toTable="toTable"
        :tabMode="mode"
        :id="combatId"
      ></PlanCombat>
    </div>
  </div>
</template>

<style></style>
