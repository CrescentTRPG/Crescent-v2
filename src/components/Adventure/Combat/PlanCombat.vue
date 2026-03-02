<script lang="ts">
import CustomCheckbox from '@/components/Character/CustomCheckbox.vue'
import CustomModal from '@/components/CustomModal.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useInitiativeStore } from '@/stores/initiativeStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BOffcanvas from 'bootstrap-vue-next/src/components/BOffcanvas/BOffcanvas.vue'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import StatBlockDetailedReference from '../Stat Blocks/StatBlockDetailedReference.vue'
import CombatHeader from './CombatHeader.vue'
import CombatNav from './CombatNav.vue'
import CombatNotes from './CombatNotes.vue'
import CombatantList from './CombatantList.vue'

export default {
  props: ['combat', 'updateTemp', 'lightenDarkenColor', 'toTable', 'tabMode', 'id'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const initiativeStore = useInitiativeStore()
    const { combatants } = storeToRefs(initiativeStore)
    const mode = ref('table')
    const navPos = ref('notes')
    function switchTab(tab) {
      navPos.value = tab
    }
    const openCombatant: Ref<any> = ref('none')

    function updateDeletedViewedCombatant() {
      openCombatant.value = 'none'
    }
    function setViewedCombatant(name) {
      openCombatant.value = props.combat.combatants[name]
      navPos.value = 'combatant'
    }
    const localCombatants: ComputedRef<Array<any>> = computed(() => {
      return Object.values(props.combat.combatants)
    })
    watch(combatants, (newOne, oldOne) => {
      openCombatant.value = openCombatant.value.name
        ? combatants.value[openCombatant.value.name]
        : 'none'
    })
    function saveCombat() {
      if (props.id) {
        adventureStore.putCombat(props.combat, props.id)
      } else {
        adventureStore.postCombat(props.combat)
      }
      // if (adventureStore.activeCombatId) {
      //   adventureStore.clearActiveCombat(adventureStore.activeCombatId)
      // }
      modal.value = true
    }
    function closeAndBoBack() {
      modal.value = false
      props.toTable()
      if (adventureStore.activeCombatId) {
        adventureStore.clearActiveCombat(adventureStore.activeCombatId)
      }
    }
    function updateViewedCombatant(statBlock) {
      let newTemp = _.cloneDeep(props.combat)
      if (!newTemp[statBlock.name]?.name) {
        delete newTemp.combatants[openCombatant.value.name]
      }
      openCombatant.value = statBlock
      newTemp.combatants[openCombatant.value.name] = openCombatant.value
      props.updateTemp(newTemp)
    }

    const overwriteKey = ref({})

    const showCombatants = ref(false)
    function overwrite() {
      let statBlocks = { ...adventureStore.statBlocks }
      const keyArr: Array<{ val: boolean; name: string }> = Object.values(overwriteKey.value)
      keyArr.forEach((val) => {
        if (val.val) {
          statBlocks[val.name] = props.combat.combatants[val.name]
        }
      })
      adventureStore.updateStatBlocks(statBlocks)
      closeAndBoBack()
    }
    const scrollbarColor = computed(() => {
      let sec = designStore.secondaryTheme
      let prim = designStore.primaryTheme
      return sec + ' ' + prim
    })
    const sidebarWidth = computed(() => {
      return innerWidth.value > 1500
        ? Math.floor(innerWidth.value / 3)
        : innerWidth.value > 1200
          ? Math.floor(innerWidth.value / 4)
          : 0
    })
    const sidebarWidthPx = computed(() => {
      return sidebarWidth.value + 'px'
    })
    const innerWidth = ref(window.innerWidth)
    onMounted(() => {
      window.addEventListener('resize', () => (innerWidth.value = window.innerWidth))
    })

    const mainContainerWidth = computed(() => {
      return 'calc(100vw -  ' + sidebarWidth.value + 'px )'
    })
    const mainContainerWidthNoScroll = computed(() => {
      return 'calc(100vw -  ' + sidebarWidth.value + 'px - 18px )'
    })
    return {
      designStore,
      modal,
      adventureStore,
      props,
      mode,
      setViewedCombatant,
      openCombatant,
      updateViewedCombatant,
      navPos,
      switchTab,
      showCombatants,
      updateDeletedViewedCombatant,
      localCombatants,
      overwrite,
      overwriteKey,
      saveCombat,
      closeAndBoBack,
      scrollbarColor,
      mainContainerWidth,
      mainContainerWidthNoScroll,
      sidebarWidth,
      sidebarWidthPx
    }
  },
  components: {
    CombatHeader,
    CombatantList,
    StatBlockDetailedReference,
    CombatNav,
    BOffcanvas,
    CombatNotes,
    BButton,
    CustomCheckbox,
    TitleMedallion,
    CustomModal
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }" style="height: fit-content">
    <CombatHeader
      :updateTemp="props.updateTemp"
      :combat="props.combat"
      :is-editing="true"
    ></CombatHeader>
    <div style="display: flex; height: 100%">
      <div
        :style="{ width: mainContainerWidth, maxWidth: mainContainerWidth }"
        style="display: flex; flex-direction: column; flex-grow: 1; margin-top: -1rem"
        id="mainDisplay"
      >
        <CombatNav
          :switchTab="switchTab"
          :navPos="navPos"
          :openCombatant="openCombatant"
          :combatants="props.combat.combatants"
        ></CombatNav>
        <div
          :style="{ width: mainContainerWidthNoScroll }"
          v-if="navPos === 'combatant' && openCombatant != 'none'"
        >
          <StatBlockDetailedReference
            :currentStatBlock="openCombatant"
            :is-editing="false"
            :lighten-darken-color="lightenDarkenColor"
            :rm="console.log('rm')"
            :updateCombat="updateViewedCombatant"
            :in-combat="true"
          ></StatBlockDetailedReference>
        </div>
        <CombatNotes
          class="mainDisplayClass"
          :combat="props.combat"
          :updateTemp="updateTemp"
          v-if="navPos === 'notes'"
        ></CombatNotes>
        <CombatantList
          v-if="navPos === 'list'"
          :overrideFull="true"
          style="flex-grow: 1; width: 100vw"
          :combat="props.combat"
          :switchTab="switchTab"
          :openEdit="setViewedCombatant"
          :update-temp="updateTemp"
          :openCombatant="openCombatant"
          :mode="props.tabMode"
          :updateDeletedViewedCombatant="updateDeletedViewedCombatant"
          :initiativeDisplayNumericHp="true"
          :initiativeDisplayNumericMana="true"
          :initiativeDisplayHp="true"
          :initiativeDisplayMana="true"
          :initiativeDisplayEnemyTraits="true"
          :initiativeDisplayCharacterTraits="true"
          :allowApplyStatusToCharacter="true"
          :allowApplyStatusToEnemy="true"
        ></CombatantList>
      </div>
      <div
        :style="{ width: sidebarWidthPx }"
        class="combatantSidebar"
        v-if="navPos === 'combatant' || navPos === 'notes'"
      >
        <div style="height: calc(100% - 15rem); padding-bottom: 1rem; width: 100%">
          <div
            class="combatantListContainer"
            id="sidebar"
            :style="{ scrollbarColor: scrollbarColor }"
          >
            <CombatantList
              :style="{ width: sidebarWidthPx }"
              style="flex-grow: 1; min-height: 75vh; padding-right: 0.75rem"
              :combat="props.combat"
              :switchTab="switchTab"
              :openEdit="setViewedCombatant"
              :update-temp="updateTemp"
              :openCombatant="openCombatant"
              :updateDeletedViewedCombatant="updateDeletedViewedCombatant"
              :mode="props.tabMode"
              :initiativeDisplayNumericHp="true"
              :initiativeDisplayNumericMana="true"
              :initiativeDisplayHp="true"
              :initiativeDisplayMana="true"
              :initiativeDisplayEnemyTraits="true"
              :initiativeDisplayCharacterTraits="true"
              :allowApplyStatusToCharacter="true"
              :allowApplyStatusToEnemy="true"
            ></CombatantList>
          </div>
        </div>
      </div>
    </div>
    <BOffcanvas
      v-model="showCombatants"
      placement="end"
      :teleportDisabled="false"
      :backdrop="true"
      shadow="false"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        '--bs-btn-close-color': designStore.primaryText
      }"
    ></BOffcanvas>
    <div
      v-if="navPos != 'combatant'"
      style="
        align-self: right;
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid;
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 5;
      "
      class="coverUp"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="display: flex; margin: 0.2rem; z-index: 5"></div>
    </div>
    <div style="display: flex; justify-content: end">
      <div
        style="
          align-self: right;
          display: flex;
          justify-content: flex-end;
          border-top: 2px solid;
          position: fixed;
          width: 85%;
          bottom: 0;
          z-index: 5;
        "
        :style="{
          background: designStore.primaryTheme,
          color: designStore.sidebarText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <div style="display: flex; margin: 0.2rem; z-index: 5">
          <BButton
            class="footerButtons"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="saveCombat()"
          >
            <i class="bi bi-floppy"></i>
            <div style="margin-left: 0.5rem" class="discardText">Save</div>
            <div class="goBackText">and Go Back</div>
          </BButton>
          <BButton
            class="footerButtons"
            style="margin-left: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="closeAndBoBack()"
          >
            <i class="bi bi-arrow-90deg-left"></i>
            <div class="discardText">Return</div>
            <div class="goBackText"></div>
          </BButton>
        </div>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Combat Has Been Saved!" @close="modal = false">
      <template v-slot:body>
        <div>
          Huzzah! your combat has been saved. By default, new combatants and changes made to
          Statblocks do not propagate to Statblocks. Select all combatants you would like to save as
          StatBlocks. Please Note: If you save a pre-exsisting statblock, (or a statblock with an
          identical name to an existing one), it will be overwrittren.
          <TitleMedallion :color="designStore.primaryText" title="Combatants"> </TitleMedallion>
          <div style="display: flex">
            <div
              v-for="c in localCombatants"
              :key="c"
              style="
                display: flex;
                flex-direction: column;
                padding: 0.5rem;
                padding-bottom: 1rem;
                max-height: 5rem;
                border-radius: 0.375rem;
                border: 1px solid;
                margin-right: 0.5rem;
              "
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
            >
              <div>{{ c.name }}</div>
              <div style="display: flex; justify-content: center">
                <div style="height: 2rem; min-width: 2rem">
                  <CustomCheckbox
                    @click="
                      overwriteKey[c.name] = { val: !overwriteKey[c.name] || false, name: c.name }
                    "
                    :isChecked="overwriteKey[c.name] || false"
                  ></CustomCheckbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <BButton
          style="border: 2px solid; margin-right: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="overwrite()"
          >Save Selected as Statblocks</BButton
        >
        <BButton
          style="border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="closeAndBoBack()"
          >No thanks, Just take me back</BButton
        ></template
      >
    </CustomModal>
  </div>
</template>

<style>
.footerButtons {
  font-size: large;
  align-self: center;
  border: 2px solid;
  display: flex;
}
.coverUp {
  height: 3.2rem;
}
.combatantList {
  display: flex;
  flex-direction: column;
}

.combatantListContainer {
  height: 100%;
  width: 100%;

  overscroll-behavior: contain;
  overflow-y: scroll;
  position: relative;
  display: flex;
  flex-direction: column;
}
@media (max-width: 1500px) {
  .sidebarWidth {
    width: 25%;
  }
}
.combatantOffCanvas {
  display: none;
}

.combatantSidebar {
  height: max-content;
  display: flex;
  flex-grow: 1;
}
@media (max-width: 1500px) {
  .sidebarWidth {
    width: 20%;
  }
  .combatantList {
    display: none;
  }
  .combatantOffCanvas {
    width: 30%;
    display: flex;
    flex-direction: column;
  }
}
@media (max-width: 1200px) {
  .combatantSidebar {
    display: none;
  }
  .sidebarWidth {
    width: 0px;
  }
  .footerButtons {
    font-size: medium;
    align-self: center;
    border: 2px solid;
  }
  .coverUp {
    height: 3rem;
  }
}

@media (max-width: 800px) {
  .combatantSidebar {
    display: none;
  }
}
@media (max-width: 600px) {
  .combatantListContainer {
    display: none;
  }
}
</style>
