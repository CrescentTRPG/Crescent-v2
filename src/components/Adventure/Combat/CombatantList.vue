<script lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useAdventureStore } from '@/stores/adventureStore'
import StatBlockQuickReferenceShell from '../Stat Blocks/StatBlockQuickReferenceShell.vue'
import { BButton, BFormInput } from 'bootstrap-vue-next'
import CustomModal from '@/components/CustomModal.vue'
import CombatantListToolbar from './CombatantListToolbar.vue'
import PowerLevelIcon from '../Stat Blocks/PowerLevelIcon.vue'
import PowerLevelDisplay from '../Stat Blocks/PowerLevelDisplay.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import StatBlockTable from '../Stat Blocks/StatBlockTable.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { DEFAULT_STAT_BLOCK } from '@/bases'
import BInputGroup from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroup.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { usePartyStore } from '@/stores/partyStore'
import { useInitiativeStore } from '@/stores/initiativeStore'
import { storeToRefs } from 'pinia'
import CharacterComputedShell from '../CharacterComputedShell.vue'
import _ from 'lodash'

export default {
  props: [
    'combat',
    'openEdit',
    'updateTemp',
    'overrideFull',
    'openCombatant',
    'switchTab',
    'updateDeletedViewedCombatant',
    'mode',
    'noToolbar'
  ],
  setup(props, context) {
    const modal = ref(false)
    function openAddCombatantModal() {
      modal.value = true
    }
    const initiativeStore = useInitiativeStore()
    const { initiativeOpened, orderedCombatantList } = storeToRefs(initiativeStore)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const partyStore = usePartyStore()

    function updateCombatants(newBlock) {
      let newTemp = props.combat
      newTemp.combatants = newBlock
      props.updateTemp(newTemp)
    }
    function updateCombatant(newCombatant) {
      let newTemp = _.cloneDeep(props.combat)
      newTemp.combatants[newCombatant.name] = newCombatant
      props.updateTemp(newTemp)
    }
    function rollInitiative() {
      initiativeStore.createInitiativeAndRollValues()
    }
    const combatantListKeys: ComputedRef<Array<any>> = computed(() => {
      let ret: Array<any> = Object.keys({ ...props.combat.combatants })
      return ret
    })

    async function addCombatant(combatant, useStore = true) {
      ogCombatant.value = combatant
      if (useStore) {
        ogCombatant.value = {
          ...(await adventureStore.getStatBlockDetails(combatant.id)),
          id: combatant.id
        }
      }
      if (!checkForCombatantAlreadyAdded(combatant.name)) {
        let newTemp = { ...props.combat }
        newTemp.combatants[combatant.name] = ogCombatant.value
        props.updateTemp(newTemp)
      }
    }

    function addBlankCombatant() {
      addCombatant({ ...DEFAULT_STAT_BLOCK, name: blankEnemyName.value }, false)
    }
    function addUniqueCombatantByName() {
      let newTemp = { ...props.combat }
      newTemp.combatants[newName.value] = {
        ...ogCombatant.value,
        name: newName.value,
        originalStatBlockName: ogCombatant.value.name
      }
      props.updateTemp(newTemp)
      sameNameModal.value = false
    }

    function removeCombatat(combatantName) {
      if (props.openCombatant.name === combatantName) {
        props.updateDeletedViewedCombatant()
        props.switchTab('notes')
      } else {
        let newTemp = { ...props.combat }
        delete newTemp.combatants[combatantName]
        props.updateTemp(newTemp)
      }
    }

    const sameNameModal = ref(false)
    const newName = ref('')
    const ogCombatant: Ref<any> = ref({})
    function checkForCombatantAlreadyAdded(name) {
      if (combatantListKeys.value.includes(name)) {
        let count = combatantListKeys.value.reduce(
          (acc: number, val: any) => (val.includes(name) ? acc + 1 : acc),
          0
        )
        newName.value = name + ' ( ' + count + ' )'
        sameNameModal.value = true
        return true
      }
      return false
    }
    const blankEnemyName = ref('')
    const statBlocks: Ref<Array<any>> = ref(Object.values(adventureStore.statBlocks))

    return {
      designStore,
      modal,
      adventureStore,
      props,
      updateCombatants,
      addCombatant,
      statBlocks,
      openAddCombatantModal,
      removeCombatat,
      sameNameModal,
      newName,
      addUniqueCombatantByName,
      blankEnemyName,
      addBlankCombatant,
      rollInitiative,
      orderedCombatantList,
      initiativeStore,
      partyStore,
      updateCombatant
    }
  },
  components: {
    StatBlockQuickReferenceShell,
    BButton,
    CustomModal,
    CombatantListToolbar,
    IconDisplay,
    TitleMedallion,
    StatBlockTable,
    BFormInput,
    TitleWidget,
    BInputGroup,
    BInputGroupText,
    CharacterComputedShell
  }
}
</script>

<template>
  <div
    :style="{ fontFamily: designStore.font, background: designStore.sidebarBacking }"
    style="padding-bottom: 3rem"
  >
    <CombatantListToolbar
      v-if="!props.noToolbar"
      :rollInitiative="rollInitiative"
      :overrideFull="props.overrideFull"
      :sortHighToLow="console.log('sort')"
      :nextTurn="console.log('nextTurn')"
      :mode="props.mode"
      :lastTurn="console.log('lastTurn')"
      :openAddCombatantModal="openAddCombatantModal"
    ></CombatantListToolbar>
    <div v-if="overrideFull">
      <div v-for="c in orderedCombatantList" :key="c">
        <StatBlockQuickReferenceShell
          v-if="props.combat.combatants[c]?.name"
          :statBlock="props.combat.combatants[c]"
          :editable="true"
          :edit="props.openEdit"
          :updateTemp="updateCombatant"
          :initiative="initiativeStore.combatants[c].initiativeScore || 0"
        ></StatBlockQuickReferenceShell>
        <CharacterComputedShell
          v-else-if="partyStore.characterObjects[c]?.name"
          :editable="false"
          :character="partyStore.characterObjects[c] || {}"
          :initiative="adventureStore.characterInitiatives[c]?.initiativeScore || 0"
        ></CharacterComputedShell>
      </div>
    </div>
    <div v-if="!overrideFull">
      <div v-for="c in orderedCombatantList" :key="c" class="combatantList">
        <StatBlockQuickReferenceShell
          v-if="props.combat.combatants[c]?.name"
          :statBlock="props.combat.combatants[c]"
          :editable="true"
          :edit="props.openEdit"
          :updateTemp="updateCombatant"
          :initiative="initiativeStore.combatants[c].initiativeScore || 0"
        ></StatBlockQuickReferenceShell>
        <CharacterComputedShell
          v-else-if="partyStore.characterObjects[c]?.name"
          :editable="false"
          :character="partyStore.characterObjects[c] || {}"
          :initiative="adventureStore.characterInitiatives[c]?.initiativeScore || 0"
        ></CharacterComputedShell>
      </div>
      <div class="miniListCombatants">
        <BButton
          v-for="c in orderedCombatantList"
          :key="c"
          @click="props.openEdit(c)"
          class="miniListButtons"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <div style="display: flex">
            <IconDisplay
              style="margin-left: -0.25rem"
              :icon="props.combat.combatants[c]?.icon || 'gi-uncertainty'"
            ></IconDisplay>
            <div class="full-combatant-name">{{ c }}</div>
          </div></BButton
        >
      </div>
      <div
        class="combatantOffCanvas"
        v-for="c in orderedCombatantList"
        :key="c"
        style="flex-grow: 1"
        :style="{ background: designStore.sidebarBacking }"
      >
        <BButton></BButton>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Manage Combatants" @close="modal = false">
      <template v-slot:body>
        <div class="manageModalContainer">
          <div style="display: flex; flex-direction: column; justify-content: center">
            <TitleMedallion
              :color="designStore.primaryText"
              title="Opponents in Combat"
            ></TitleMedallion>
            <div
              v-if="orderedCombatantList.length <= 0"
              style="align-self: center; display: flex; justify-content: center"
            >
              <v-icon scale="2" name="gi-theater-curtains"></v-icon>

              <div style="align-self: center">Nobody's here</div>
              <v-icon scale="2" name="gi-theater-curtains"></v-icon>
            </div>
            <BButton
              style="border: 1px solid; margin-bottom: 0.5rem; justify-content: center"
              :style="{ borderColor: designStore.secondaryTheme }"
              @click="removeCombatat(s)"
              v-for="s in orderedCombatantList"
              :key="s"
              ><i style="position: absolute; left: 0.5rem" class="bi bi-x-lg"></i> {{ s }}</BButton
            >
          </div>
          <div class="addCombatantContainer">
            <TitleMedallion
              :color="designStore.primaryText"
              title="Add Combatants"
            ></TitleMedallion>
            <BInputGroup
              style="border: 2px solid; border-radius: 0.5rem"
              :style="{ borderColor: designStore.secondaryTheme }"
              ><BInputGroupText
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText
                }"
                style="border: 0px"
                >Blank Enemy</BInputGroupText
              ><BFormInput
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText
                }"
                style="border: 0px"
                v-model="blankEnemyName"
              ></BFormInput
              ><BButton
                :disabled="blankEnemyName.length < 1"
                style="border: 0px"
                @click="addBlankCombatant()"
                :style="{
                  '--bs-btn-disabled-bg': designStore.inputBacking,
                  '--bs-btn-disabled-color': designStore.inputText
                }"
                ><i class="bi bi-plus-lg"></i></BButton
            ></BInputGroup>
            <TitleWidget title="Statblocks"></TitleWidget>
            <StatBlockTable
              :hideRm="true"
              :select="addCombatant"
              :use-plus="true"
              style="border-top: 2px solid; border-right: 2px solid"
              :style="{
                borderColor: designStore.secondaryTheme,
                color: designStore.secondaryTheme
              }"
            ></StatBlockTable>
          </div>
        </div>
      </template>
    </CustomModal>
    <CustomModal
      :showModal="sameNameModal"
      title="Combatant Already Added"
      @close="sameNameModal = false"
    >
      <template v-slot:body>
        <div>
          <div>Rename Combatant</div>
          <BFormInput
            v-model="newName"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          ></BFormInput>
        </div>
      </template>
      <template v-slot:footer
        ><BButton
          style="border: 2px solid; margin-right: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="sameNameModal = false"
          >Cancel</BButton
        ><BButton
          style="border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          :disabled="orderedCombatantList.includes(newName)"
          @click="addUniqueCombatantByName()"
          >Add With New Name</BButton
        ></template
      >
    </CustomModal>
  </div>
</template>

<style>
.miniListCombatants {
  display: none;
}
.manageModalContainer {
  display: flex;
  flex-direction: column;
}
.addCombatantContainer {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin-left: 0.5rem;
}
.miniListButtons {
  font-size: 1rem;
  border: 2px solid;
  margin: 0.25rem;
}
@media (max-width: 1500px) {
  .miniListCombatants {
    display: flex;
    flex-direction: column;
    margin: none;
  }
}
@media (max-width: 1100px) {
  .manageModalContainer {
    display: flex;
    flex-direction: column;
  }
  .addCombatantContainer {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin-left: 0rem;
  }
}
@media (max-width: 800px) {
  .full-combatant-name {
    display: none;
  }
  .miniListButtons {
    font-size: 1rem;
    border: 2px solid;
    margin-left: 0;
  }
}
</style>
