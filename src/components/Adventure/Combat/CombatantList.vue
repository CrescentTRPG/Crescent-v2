<script lang="ts">
import { DEFAULT_STAT_BLOCK } from '@/bases.ts'
import CustomModal from '@/components/CustomModal.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useInitiativeStore } from '@/stores/initiativeStore.ts'
import { usePartyStore } from '@/stores/partyStore.ts'
import { BButton, BFormInput } from 'bootstrap-vue-next'
import BInputGroup from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroup.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import CharacterComputedShell from '../CharacterComputedShell.vue'
import InitiativeDisplay from '../Stat Blocks/initiativeDisplay.vue'
import StatBlockQuickReferenceShell from '../Stat Blocks/StatBlockQuickReferenceShell.vue'
import StatBlockTable from '../Stat Blocks/StatBlockTable.vue'
import CombatantListToolbar from './CombatantListToolbar.vue'

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
    'noToolbar',
    'noViewButton',
    'initiativeDisplayNumericHp',
    'initiativeDisplayNumericMana',
    'initiativeDisplayHp',
    'initiativeDisplayMana',
    'initiativeDisplayEnemyTraits',
    'initiativeDisplayCharacterTraits',
    'allowApplyStatusToCharacter',
    'allowApplyStatusToEnemy',
    'primaryOverride',
    'collapseable'
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
        initiativeStore.removeOrderedCombatant(combatantName)
      }
    }
    function getName(id) {
      return partyStore.characterObjects[id]?.name
        ? partyStore.characterObjects[id]?.name + ' (Player)'
        : id
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
    function changeInitiative(key: string, newVal: number, agi: string | number) {
      initiativeStore.changeInitiativeOrder(key, newVal, agi)
    }
    const blankEnemyName = ref('')
    const statBlocks: Ref<Array<any>> = ref(Object.values(adventureStore.statBlocks))
    const characterStore = useCharacterStore()
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
      updateCombatant,
      characterStore,
      changeInitiative,
      getName
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
    CharacterComputedShell,
    InitiativeDisplay
  }
}
</script>

<template>
  <div
    :style="{
      fontFamily: designStore.font,
      background: props.primaryOverride ? designStore.primaryTheme : designStore.sidebarBacking
    }"
    style="padding-bottom: 3rem"
  >
    <CombatantListToolbar
      v-if="!props.noToolbar"
      :rollInitiative="rollInitiative"
      :overrideFull="props.overrideFull"
      :sortHighToLow="initiativeStore.sort"
      :nextTurn="initiativeStore.nextTurn"
      :mode="props.mode"
      :lastTurn="initiativeStore.lastTurn"
      :openAddCombatantModal="openAddCombatantModal"
    ></CombatantListToolbar>
    <div v-if="overrideFull">
      <div v-for="c in orderedCombatantList" :key="c">
        <StatBlockQuickReferenceShell
          v-if="initiativeStore.combatants[c]?.name"
          :statBlock="initiativeStore.combatants[c]"
          :editable="!props.noViewButton"
          :edit="props.openEdit"
          :updateTemp="updateCombatant"
          :initiative="initiativeStore.combatants[c].initiativeScore || 0"
          :initiativeDisplayNumericHp="initiativeDisplayNumericHp"
          :initiativeDisplayNumericMana="initiativeDisplayNumericMana"
          :initiativeDisplayHp="initiativeDisplayHp"
          :initiativeDisplayMana="initiativeDisplayMana"
          :initiativeDisplayEnemyTraits="initiativeDisplayEnemyTraits"
          :allowApplyStatusToEnemy="allowApplyStatusToEnemy"
          :collapseable="props.collapseable"
        ></StatBlockQuickReferenceShell>
        <CharacterComputedShell
          v-else-if="partyStore.characterObjects[c]?.name"
          :editable="false"
          allowApplyStatusToChar
          :allowApplyStatusToCharacter="allowApplyStatusToCharacter"
          :initiativeDisplayCharacterTraits="initiativeDisplayCharacterTraits"
          :character="partyStore.characterObjects[c] || {}"
          :initiative="adventureStore.characterInitiatives[c]?.initiativeScore || 0"
        ></CharacterComputedShell>
        <div
          style="padding: 1rem; display: flex; border-bottom: 2px solid"
          :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
          v-if="characterStore.id === c"
        >
          <InitiativeDisplay
            :initiative="adventureStore.characterInitiatives[c]?.initiativeScore || 0"
          ></InitiativeDisplay>
          <div style="font-size: x-large; padding: 0.25rem">
            {{ characterStore.name }}
          </div>

          <IconDisplay
            :color="designStore.secondaryTheme"
            :icon="designStore.charIconFlair"
            scale="1"
            size="1rem"
            style="position: relative; right: 0.5rem"
          ></IconDisplay>
        </div>
      </div>
    </div>
    <div v-if="!overrideFull">
      <div v-for="c in orderedCombatantList" :key="c" class="combatantList">
        <StatBlockQuickReferenceShell
          v-if="initiativeStore.combatants[c]?.name"
          :statBlock="initiativeStore.combatants[c]"
          :editable="true"
          :edit="props.openEdit"
          :updateTemp="updateCombatant"
          :initiative="initiativeStore.combatants[c].initiativeScore || 0"
          :initiativeDisplayNumericHp="initiativeDisplayNumericHp"
          :initiativeDisplayNumericMana="initiativeDisplayNumericMana"
          :initiativeDisplayHp="initiativeDisplayHp"
          :initiativeDisplayMana="initiativeDisplayMana"
          :initiativeDisplayEnemyTraits="initiativeDisplayEnemyTraits"
          :allowApplyStatusToCharacter="allowApplyStatusToCharacter"
          :allowApplyStatusToEnemy="allowApplyStatusToEnemy"
        ></StatBlockQuickReferenceShell>
        <CharacterComputedShell
          v-else-if="partyStore.characterObjects[c]?.name"
          :editable="false"
          :allowApplyStatusToCharacter="allowApplyStatusToCharacter"
          :initiativeDisplayCharacterTraits="initiativeDisplayCharacterTraits"
          :character="partyStore.characterObjects[c] || {}"
          :initiative="adventureStore.characterInitiatives[c]?.initiativeScore || 0"
        ></CharacterComputedShell>
      </div>
      <div class="miniListCombatants">
        <div
          v-for="c in orderedCombatantList"
          :key="c"
          class="miniListButtons"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <div style="display: flex; padding: 0.15rem">
            <InitiativeDisplay
              :changeInitiative="changeInitiative"
              style="width: 2.65rem; translate: 0rem -0.25rem"
              :initiative="
                initiativeStore.combatants[c]?.initiativeScore ||
                adventureStore.characterInitiatives[c]?.initiativeScore ||
                0
              "
            ></InitiativeDisplay>
            <div
              class="full-combatant-name"
              @click="props.openEdit(c)"
              style="cursor: pointer"
              v-if="initiativeStore.combatants[c]?.name"
            >
              {{ c }}
            </div>
            <div class="full-combatant-name" v-if="partyStore.characterObjects[c]?.name">
              {{ partyStore.characterObjects[c]?.name }}
            </div>
          </div>
        </div>
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
            <TitleMedallion :color="designStore.primaryText" title="Combatants"></TitleMedallion>
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
              ><i style="position: absolute; left: 0.5rem" class="bi bi-x-lg"></i>
              {{ getName(s) }}</BButton
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
  padding: 0.35rem;

  font-size: 1rem;
  border: 2px solid;
  margin: 0.25rem;
}
.full-combatant-name {
  overflow-x: hidden;
  align-self: center;
  padding-left: 0.25rem;
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
  .miniListButtons {
    font-size: 1rem;
    border: 2px solid;
    margin-left: 0;
  }
}
</style>
