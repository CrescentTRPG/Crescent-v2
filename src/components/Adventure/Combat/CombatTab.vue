<script lang="ts">
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { onMounted, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { DEFAULT_COMBAT } from '@/bases.ts'
import LoadingDisplay from '@/components/LoadingDisplay.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useInitiativeStore } from '@/stores/initiativeStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import _ from 'lodash'
import CombatTable from './CombatTable.vue'
import PlanCombat from './PlanCombat.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const initiativeStore = useInitiativeStore()
    const mode = ref('table')
    const tempCombat = ref({ ...DEFAULT_COMBAT })
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    onMounted(() => {
      console.log('mount')
      tempCombat.value = _.cloneDeep(DEFAULT_COMBAT)
      mode.value = adventureStore.combatNavPos
      if (mode.value === 'run') {
        tempCombat.value = {
          ...initiativeStore.baseCombatDetails,
          combatants: initiativeStore.combatants
        }
      }
    })

    function updateTemp(temp) {
      tempCombat.value = _.cloneDeep(temp)
      if (adventureStore.combatNavPos === 'run') {
        let combatantsWithPreservedInitiative = { ...tempCombat.value.combatants }
        Object.keys(combatantsWithPreservedInitiative).forEach((c) => {
          combatantsWithPreservedInitiative[c].initiativeScore =
            initiativeStore.combatants[c]?.initiativeScore || 0
        })
        initiativeStore.updateCombatantsLocal(combatantsWithPreservedInitiative)
        initiativeStore.createInitiativeAndRollValues()
        initiativeStore.putInitiative()
        initiativeStore.setBaseCombatDetails(tempCombat.value)
      } else {
        initiativeStore.updateCombatantsLocal({ ...tempCombat.value.combatants })
      }
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
      tempCombat.value = _.cloneDeep(combatDetails)

      mode.value = 'run'
      initiativeStore.resetInitiativeOpened()
      initiativeStore.clearOrderedCombatantsLocally()
      initiativeStore.setNewCombatants(combatDetails.combatants)
      //       initiativeStore.createInitiativeAndRollValues()
      // initiativeStore.putInitiative()
      initiativeStore.setBaseCombatDetails(tempCombat.value)

      adventureStore.dispatchAdventureStart()
      loading.value = false
    }
    async function planCombatFromExisting(combat) {
      loading.value = true

      let combatDetails = (await adventureStore.getCombatDetails(combat.id)) || combat
      combatId.value = combat.id
      mode.value = 'build'
      initiativeStore.clearOrderedCombatantsLocally()

      adventureStore.updateCombatNavPosLocal(mode.value)
      updateTemp(combatDetails)
      initiativeStore.updateCombatantsLocal(combatDetails.combatants)

      loading.value = false
    }
    async function toTable() {
      mode.value = 'table'
      tempCombat.value = _.cloneDeep({
        combatants: {},
        initiative: {},
        notes: '',
        tags: [],
        name: 'Default Combat'
      })
      adventureStore.toTable()
      initiativeStore.unscubscribeToInitiative()
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
      initiativeStore.clearOrderedCombatantsLocally()

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
