<template>
  <div>
    <LoadingDisplay class="fill" v-if="character.loading"></LoadingDisplay>
    <div
      :class="props.isGameMaster ? 'none' : 'fill'"
      style="display: flex; flex-direction: column"
      :style="{
        background: design.pageBackdrop,
        '--hover-color': hoverShade,
        '--hover-blend': design.primaryTheme,
        '--hover-blend-input': design.inputBacking,
        '--hover-blend-sidebar': design.sidebarBacking,
        '--mixed-color': mixedShade
      }"
      v-if="!character.loading"
    >
      <div
        v-if="!props.isGameMaster"
        style="display: flex; justify-content: space-between; height: 4.5rem"
        :style="{ background: design.inputBacking }"
      >
        <div
          style="display: flex; justify-content: flex-start; height: 5rem"
          @click="nameModal = true"
        >
          <IconStackCloud
            :style="{ background: design.primaryTheme, color: design.secondaryTheme }"
            class="moon"
          ></IconStackCloud>
          <span
            class="component"
            :style="{
              background: design.primaryTheme,
              color: design.primaryText,
              fontFamily: design.titleFont
            }"
            ><div style="width: 150%">{{ character?.name }}</div>
            <div
              style="display: flex; justify-content: end; position: relative"
              class="sparkle-height"
            >
              <i
                v-if="design.charIconFlair.substring(0, 2) == 'bi'"
                :class="design.charIconFlair"
                style="position: absolute; z-index: 5"
                :style="{ color: design.secondaryTheme }"
              ></i>
              <v-icon
                v-if="design.charIconFlair.substring(0, 2) == 'gi'"
                :name="design.charIconFlair"
                scale="1.5"
                style="position: absolute; z-index: 5; transform: translate(0.75rem)"
                :style="{ color: design.secondaryTheme }"
              ></v-icon>
            </div>
          </span>
          <div
            class="dazzle"
            :style="{ borderLeftColor: design.primaryTheme }"
            style="z-index: 1"
          ></div>
          <div class="dazzle2" :style="{ background: design.secondaryTheme }"></div>
        </div>
        <div style="padding-right: 1rem; padding-top: 0.5rem; min-width: 8.5rem; display: flex">
          <div>
            <BButton
              class="button"
              style="margin-right: 0.25rem; margin-bottom: 1rem"
              :style="{ background: design.primaryTheme, color: design.primaryText }"
              @click="goToHome()"
            >
              <i class="bi bi-arrow-return-left"></i>
            </BButton>
          </div>
          <DesignButton :isAdventure="false"></DesignButton>
          <div>
            <BButton
              @click="settingsModal = !settingsModal"
              class="button"
              style="margin-right: 0.25rem; margin-bottom: 1rem"
              :style="{ background: design.primaryTheme, color: design.primaryText }"
            >
              <i class="bi bi-gear-fill"></i>
            </BButton>
            <CustomModal
              :showModal="settingsModal"
              :title="character.name + ' Settings'"
              @close="settingsModal = !settingsModal"
            >
              <template v-slot:body> <CharacterSettings></CharacterSettings> </template>
            </CustomModal>
          </div>
          <div>
            <BButton
              @click="showDice = !showDice"
              class="diceButton"
              style="margin-right: 0.25rem"
              :style="{ background: design.primaryTheme, color: design.primaryText }"
            >
              <i class="bi bi-dice-6"></i>
            </BButton>
            <BOffcanvas
              v-model="showDice"
              placement="end"
              :backdrop="true"
              shadow="false"
              :teleportDisabled="false"
              :style="{
                background: design.primaryTheme,
                color: design.primaryText,
                '--bs-btn-close-color': design.primaryText
              }"
            >
              <div style="display: flex; margin-bottom: 0.5rem" v-if="rollOptions.length > 1">
                <div style="margin-right: 0.75rem; text-align: center; font-size: large">
                  Rolling As:
                </div>
                <DropdownSelect
                  style="flex-grow: 1"
                  :options="rollOptions"
                  :default="selectedRoller"
                  @selection="(val) => (selectedRoller = val)"
                ></DropdownSelect>
              </div>
              <CharacterDiceSidebar
                v-if="selectedRoller === character.name"
                @rolled="
                  (rollObj) => {
                    logRoll(rollObj)
                  }
                "
              ></CharacterDiceSidebar>
              <StatBlockDiceRoller
                v-else
                :currentStatBlock="effigyStore.effigies[selectedRoller]"
              ></StatBlockDiceRoller>
            </BOffcanvas>
          </div>
        </div>
      </div>
      <CustomModal
        :showModal="promptForCharacterInitiative"
        title="A Fight Has Started! Roll Initiative!!"
      >
        <template v-slot:body>
          <BFormInput
            style="border: 2px solid; padding: 0.25rem; padding-top: 0.25rem"
            :style="{
              background: design.inputBacking,
              color: design.inputText,
              borderColor: design.secondaryTheme,
              '--bs-secondary-color': design.inputText
            }"
            type="number"
            v-model="init"
          ></BFormInput>
        </template>
        <template v-slot:footer>
          <BButton
            style="border: 2px solid; padding: 0.25rem; padding-top: 0.25rem; margin-right: 0.5rem"
            :style="{
              background: design.primaryTheme,
              color: design.primaryText,
              borderColor: design.secondaryTheme,
              '--bs-secondary-color': design.inputText
            }"
            @click="
              adventureStore.addCharacterInitiative(
                character.id,
                parseInt('' + init),
                character.attributes.agility
              )
            "
            ><div
              style="display: flex; flex-direction: row; justify-content: center; font-size: large"
              :style="{ color: design.secondaryTheme }"
            >
              <div :style="{ color: design.primaryText }">Add from Input</div>
              <v-icon scale="1.5" name="gi-leapfrog"></v-icon></div
          ></BButton>
          <BButton
            style="border: 2px solid; padding: 0.25rem; padding-top: 0.25rem"
            :style="{
              background: design.primaryTheme,
              color: design.primaryText,
              borderColor: design.secondaryTheme,
              '--bs-secondary-color': design.inputText
            }"
            @click="rollAgi()"
            ><div
              style="display: flex; flex-direction: row; justify-content: center; font-size: large"
              :style="{ color: design.secondaryTheme }"
            >
              <div :style="{ color: design.primaryText }">Roll Agility!</div>
              <v-icon scale="1.5" name="gi-rolling-dice-cup"></v-icon></div
          ></BButton>
        </template>
      </CustomModal>
      <div v-if="props.isGameMaster">
        <BButton
          style="
            position: absolute;
            display: flex;
            right: 2rem;
            margin-top: 0.15rem;
            z-index: 5;
            border: 1px solid;
          "
          :style="{
            borderColor: design.secondaryTheme,
            background: design.primaryTheme,
            color: design.primaryText
          }"
          @click="props.exit()"
        >
          <i class="bi bi-escape"></i>
          <div class="non-Mobile" style="margin-left: 0.25rem">Exit Detailed View</div></BButton
        >
        <TitleWidget
          style="margin-top: 0rem; padding-top: 0.5rem"
          :title="character.name"
        ></TitleWidget>
      </div>
      <CharacterNav
        @build="navPos = 'build'"
        @overview="navPos = 'overview'"
        @details="navPos = 'details'"
        @equipment="navPos = 'equipment'"
        @journal="navPos = 'journal'"
        @party="navPos = 'party'"
        @manual="navPos = 'manual'"
      ></CharacterNav>
      <BuildTab v-if="navPos === 'build'" style="flex-grow: 1"></BuildTab>
      <OverviewTab v-if="navPos === 'overview'"></OverviewTab>
      <DetailsTab v-if="navPos === 'details'"></DetailsTab>
      <EquipmentTab v-if="navPos === 'equipment'"></EquipmentTab>
      <JournalTab :isCharacter="true" style="flex-grow: 1" v-if="navPos === 'journal'"></JournalTab>

      <ManualTab :isCharacter="true" v-if="navPos === 'manual'"></ManualTab>
      <CharacterPartyTab v-if="navPos === 'party'"></CharacterPartyTab>
      <div style="display: flex; justify-content: space-between; height: 3rem">
        <div
          v-if="adventureStore.activeCombatId"
          style="
            align-self: right;
            display: flex;
            justify-content: space-between;
            border-top: 2px solid;
            position: fixed;
            width: 100%;
            bottom: 0;
            z-index: 5;
          "
          :style="{
            background: design.primaryTheme,
            color: design.sidebarText,
            borderColor: design.secondaryTheme
          }"
        >
          <div style="display: flex">
            <div style="margin-left: 0.75rem">
              <InitiativeDisplay
                style="z-index: 6"
                :initiative="initiativeVal.initiativeScore"
                :changeInitiative="adventureStore.addCharacterInitiative"
                :name="character.name"
                :keyVal="character.id"
                :agi="character.attributes.agility"
              ></InitiativeDisplay>
            </div>
            <div
              style="padding: 0.5rem"
              :style="{
                background: design.primaryTheme,
                color: design.primaryText,
                borderColor: design.secondaryTheme
              }"
            >
              {{ turnsBefore }}
            </div>
          </div>

          <div style="display: flex; margin: 0.2rem; z-index: 5">
            <BButton
              class="footerButtons"
              :style="{
                background: design.primaryTheme,
                color: design.primaryText,
                borderColor: design.secondaryTheme
              }"
              @click="showInitiativeSidebar = !showInitiativeSidebar"
            >
              <i class="bi bi-arrow-bar-left"></i>
              <div style="margin-left: 0.5rem">View Initiative</div>
            </BButton>
          </div>
        </div>
      </div>
      <BOffcanvas
        v-model="showInitiativeSidebar"
        placement="end"
        :backdrop="true"
        :no-backdrop="true"
        :teleportDisabled="true"
        style="width: 40%; min-width: 480px; z-index: 6; overflow-y: scroll; min-height: 100vh"
        :style="{
          background: design.primaryTheme,
          color: design.primaryText,
          '--bs-btn-close-color': design.primaryText
        }"
      >
        <TitleMedallion title="Initiative Order" :color="design.primaryText"></TitleMedallion>
        <div
          class="combatantListContainer"
          style="overflow-y: hidden; display: block"
          :style="{ scrollbarColor: scrollbarColor }"
        >
          <CombatantList
            :primaryOverride="true"
            :combat="{
              combatants: initiativeStore.combatants,
              orderedCombatants: initiativeStore.orderedCombatants
            }"
            :overrideFull="true"
            :noToolbar="true"
            :noViewButton="true"
            :update-temp="updateTemp"
            :collapseable="true"
            style="flex-grow: 1"
            mode="run"
            :initiativeDisplayNumericHp="
              adventureStore.settings?.initiativeDisplayNumericHp || false
            "
            :initiativeDisplayNumericMana="
              adventureStore.settings?.initiativeDisplayNumericMana || false
            "
            :initiativeDisplayHp="adventureStore.settings?.initiativeDisplayHp || false"
            :initiativeDisplayMana="adventureStore.settings?.initiativeDisplayMana || false"
            :initiativeDisplayEnemyTraits="
              adventureStore.settings?.initiativeDisplayEnemyTraits || false
            "
            :initiativeDisplayCharacterTraits="
              adventureStore.settings?.initiativeDisplayCharacterTraits || false
            "
            :allowApplyStatusToCharacter="
              adventureStore.settings?.allowApplyStatusToCharacter || false
            "
            :allowApplyStatusToEnemy="adventureStore.settings?.allowApplyStatusToEnemy || false"
          ></CombatantList>
        </div>
      </BOffcanvas>
      <CustomModal :showModal="nameModal" title="Edit Character Name" @close="nameModal = false">
        <template v-slot:body>
          <BFormInput
            v-model="name"
            style="border: 1px solid"
            :style="{
              background: design.inputBacking,
              color: design.inputText,
              borderColor: design.secondaryTheme
            }"
          ></BFormInput>
        </template>
        <template v-slot:footer>
          <BButton
            @click="character.setCharacterName(name)"
            style="border: 1px solid"
            :style="{ borderColor: design.secondaryTheme }"
            >Set Name</BButton
          >
        </template>
      </CustomModal>
      <CustomModal
        :showModal="showNewPlayerGuideModalConfirmation"
        title="New Player Guide"
        @close="showNewPlayerGuideModalConfirmation = false"
      >
        <template v-slot:body>Would you like to be introduced to your character sheet?</template>
        <template v-slot:footer
          ><BButton
            style="border: 1px solid; margin-right: 0.5rem"
            :style="{ borderColor: design.secondaryTheme }"
            @click="
              (character.setShowNewPlayerGuide(false),
              (showNewPlayerGuideModalConfirmation = false))
            "
            >NO, END THIS INSUFFERABLE GUIDE</BButton
          ><BButton
            style="border: 1px solid"
            :style="{ borderColor: design.secondaryTheme }"
            @click="
              (character.incrementNewPlayerGuideStep(),
              (showNewPlayerGuideModalConfirmation = false))
            "
            >YES PLEASE HELP ME</BButton
          ></template
        >
      </CustomModal>
    </div>
    <Teleport to="body">
      <div class="toast-container position-fixed p-3 bottom-0 end-0">
        <BToast
          v-model="showToast"
          :style="{
            background: design.alertTheme,
            color: design.primaryText,
            borderColor: design.alertTheme
          }"
          style="padding: 0"
          pos="bottom-0 end-0"
          solid
        >
          <div
            :style="{
              background: design.alertTheme,
              color: design.primaryText,
              borderColor: design.alertTheme
            }"
          >
            <ChatBubble
              v-if="toast"
              :colorOverride="design.primaryText"
              :backgroundOverride="design.alertTheme"
              :messageObj="toast"
              style="margin-right: -1.75rem; width: 100%"
            ></ChatBubble>
          </div>
        </BToast>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import CombatantList from '@/components/Adventure/Combat/CombatantList.vue'
import InitiativeDisplay from '@/components/Adventure/Stat Blocks/initiativeDisplay.vue'
import BeingBuilt from '@/components/BeingBuilt.vue'
import CharacterPartyTab from '@/components/Character/Build/Party/CharacterPartyTab.vue'
import CharacterSettings from '@/components/Character/CharacterSettings.vue'
import DetailsTab from '@/components/Character/Details/DetailsTab.vue'
import EquipmentTab from '@/components/Character/Equipment/EquipmentTab.vue'
import OverviewTab from '@/components/Character/Overview/OverviewTab.vue'
import CharacterDiceSidebar from '@/components/DiceSidebar/CharacterDiceSidebar.vue'
import StatBlockDiceRoller from '@/components/DiceSidebar/StatBlockDiceRoller.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import LoadingDisplay from '@/components/LoadingDisplay.vue'
import ManualTab from '@/components/Manual/ManualTab.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { Chat, useAdventureStore } from '@/stores/adventureStore.ts'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useEffigyStore } from '@/stores/effigyStore.ts'
import { useInitiativeStore } from '@/stores/initiativeStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { usePerformanceStore } from '@/stores/performanceStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { useStatusEffectStore } from '@/stores/statusEffectStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BToast } from 'bootstrap-vue-next'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BOffcanvas from 'bootstrap-vue-next/src/components/BOffcanvas/BOffcanvas.vue'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BuildTab from '../components/Character/Build/BuildTab.vue'
import CharacterNav from '../components/Character/CharacterNav.vue'
import DesignButton from '../components/Character/DesignButton.vue'
import IconStackCloud from '../components/IconStackCloud.vue'
import JournalTab from '@/components/Journal/JournalTab.vue'
import CustomModal from '@/components/CustomModal.vue'
import ChatBubble from '@/components/Adventure/Party/ChatBubble.vue'

export default {
  props: ['isGameMaster', 'exit', 'userId'],
  setup(props, context) {
    const navPos = ref('build')
    let design = useDesignStore()
    const character = useCharacterStore()
    const showDice = ref(false)
    const settingsModal = ref(false)
    const showNewPlayerGuideModalConfirmation = ref(character.showNewPlayerGuide)
    const adventureStore = useAdventureStore()
    const { chats } = storeToRefs(adventureStore)
    const showToast = ref(false)
    const toast: Ref<Chat | undefined> = ref(undefined)
    watch(chats, (newChats, oldChats) => {
      console.log(oldChats, newChats)
      if (
        oldChats[oldChats.length - 1].timestamp != newChats[newChats.length - 1].timestamp &&
        newChats[newChats.length - 1].fromId != character.id
      ) {
        showToast.value = true
        toast.value = undefined
        toast.value = newChats[newChats.length - 1]

        setTimeout(() => {
          toast.value = undefined
          showToast.value = false
        }, 5000)
      }
    })
    const statusStore = useStatusEffectStore()
    const { getAgility, getAgilityExceptionals, getAgilityInferiors, getAgilityPlaced } =
      storeToRefs(statusStore)
    const { activeCombatId } = storeToRefs(adventureStore)
    const userStore = useUserStore()
    const initiativeStore = useInitiativeStore()
    const nameModal = ref(false)
    const { orderedCombatants } = storeToRefs(initiativeStore)
    const name = ref('')
    onUnmounted(() => {
      character.loading = true
      character.unsubscribe()
      initiativeStore.unscubscribeToInitiative()
    })
    function logRoll(rollObj: { rollsObj: {}; timestamp: string; rolltitle: string }) {
      let message = 'DICE ROLL: ' + rollObj.rolltitle + '\n'
      let arr = Object.values(rollObj.rollsObj)
      arr.forEach((roll: any) => {
        let label = roll.label ? roll.label : '(' + roll.str + ')'
        message += label + ' = ' + roll.subtotal + '\n'
      })
      adventureStore.addChat(
        message,
        character.name,
        userStore.getUserId,
        false,
        [],
        design.charIcon
      )
    }
    function rollAgi() {
      let rolls: Array<number> = []
      for (let i = 0; i < 2 + Math.abs(getAgilityPlaced.value); i++) {
        rolls.push(Math.ceil(Math.random() * 10))
      }
      rolls = rolls.sort()
      let roll1 = rolls[0]
      let roll2 = rolls[1]
      let accepted: Array<number> = rolls
      let rejected: Array<number> = []

      let str = '2d10'
      if (getAgilityPlaced.value != 0) {
        str += '*' + getAgilityPlaced.value
        if (getAgilityPlaced.value > 0) {
          roll1 = rolls[rolls.length - 1]
          roll2 = rolls[rolls.length - 2]
          accepted = rolls.slice(Math.abs(getAgilityPlaced.value))
          rejected = rolls.slice(0, Math.abs(getAgilityPlaced.value))
        } else {
          rejected = rolls.slice(Math.abs(getAgilityPlaced.value))
          accepted = rolls.slice(0, Math.abs(getAgilityPlaced.value))
        }
      }
      str += '+' + getAgility.value
      console.log(str)

      logRoll({
        rollsObj: {
          'roll 1': {
            'roll group': 'Initiative',
            str: str,
            subtotal: roll1 + roll2 + getAgility.value,
            resultsArr: [
              {
                operator: '',
                dVal: 10,
                isD: true,
                val: roll1 + roll2,
                accepted: accepted,
                rejected: rejected
              }
            ]
          }
        },
        timestamp: new Date().toDateString(),
        rolltitle: 'Initiative'
      })
      adventureStore.addCharacterInitiative(
        character.id,
        roll1 + roll2 + getAgility.value,
        getAgility.value
      )
    }

    let router = useRouter()
    const init = ref(0)
    onMounted(() => {
      character.loading = true
      if (!props.isGameMaster) {
        useCharacterStore().pullCharacterFromFirebase(useUserStore().getUserId, character.id, true)
        if (character.adventure?.adventureId && character.adventure?.gameMasterId) {
          adventureStore.pullAdventureAsCharacterFromFirebase(
            character.adventure.adventureId,
            character.adventure.gameMasterId
          )
        }
      }
      name.value = character.name
    })

    let promptForCharacterInitiative = computed(() => {
      if (!adventureStore.activeCombatId) {
        return false
      }
      return (adventureStore.characterInitiatives &&
        adventureStore.characterInitiatives[character.id]?.initiativeScore) ||
        adventureStore.characterInitiatives[character.id]?.initiativeScore === 0
        ? false
        : true
    })
    function goToHome() {
      useSpellStore().clearBuildDisplay()
      useMartialPerksStore().clearBuildDisplay()
      useMartialSkillsStore().clearMartialSkillsBuild()
      useSkillStore().clearEffectiveSkills()
      usePerformanceStore().clearBuildDisplay()
      adventureStore.clearLocalActiveCombatId()
      router.push({ name: 'home' })
    }
    const hoverShade = computed(() => {
      const r = parseInt(design.alertTheme.substring(1, 3), 16)
      const g = parseInt(design.alertTheme.substring(3, 5), 16)
      const b = parseInt(design.alertTheme.substring(5, 7), 16)
      return 'rgb(' + r + ',' + g + ',' + b + ',.2)'
    })
    const mixedShade = computed(() => {
      const r = Math.floor(
        (parseInt(design.alertTheme.substring(1, 3), 16) +
          parseInt(design.primaryTheme.substring(1, 3), 16)) /
          2
      )

      const g = Math.floor(
        (parseInt(design.alertTheme.substring(3, 5), 16) +
          parseInt(design.primaryTheme.substring(3, 5), 16)) /
          2
      )

      const b = Math.floor(
        (parseInt(design.alertTheme.substring(5, 7), 16) +
          parseInt(design.primaryTheme.substring(5, 7), 16)) /
          2
      )
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    })
    const initiativeVal = computed(() => {
      return adventureStore.characterInitiatives
        ? adventureStore.characterInitiatives[character.id] || 0
        : 0
    })
    const turnsBefore = computed(() => {
      let ret = 0
      for (let i = 0; i < initiativeStore.orderedCombatantList.length; i++) {
        if (initiativeStore.orderedCombatantList[i] === character.id) {
          if (i === 0) {
            return "IT'S YOUR TURN"
          }
          return ret + ' turns before your turn'
        }
        ret++
      }
      return 'not in turn order?'
    })

    const showInitiativeSidebar = ref(false)
    const scrollbarColor = computed(() => {
      let sec = design.secondaryTheme
      let prim = design.primaryTheme
      return sec + ' ' + prim
    })

    function updateTemp(temp) {
      let tempCombat = _.cloneDeep(temp)
      let combatantsWithPreservedInitiative = { ...tempCombat.combatants }
      Object.keys(combatantsWithPreservedInitiative).forEach((c) => {
        combatantsWithPreservedInitiative[c].initiativeScore =
          initiativeStore.combatants[c]?.initiativeScore || 0
      })
      initiativeStore.updateCombatants(combatantsWithPreservedInitiative)
      initiativeStore.createInitiativeAndRollValues()
    }
    const effigyStore = useEffigyStore()
    const rollOptions = computed(() => {
      return [character.name].concat(effigyStore.getFormedEffigiesList.map((e) => e.name))
    })
    const selectedRoller = ref(character.name)

    return {
      logRoll,
      props,
      design,
      navPos,
      character,
      showDice,
      goToHome,
      settingsModal,
      promptForCharacterInitiative,
      init,
      adventureStore,
      rollAgi,
      hoverShade,
      mixedShade,
      initiativeVal,
      showInitiativeSidebar,
      scrollbarColor,
      updateTemp,
      initiativeStore,
      nameModal,
      name,
      rollOptions,
      effigyStore,
      selectedRoller,
      showNewPlayerGuideModalConfirmation,
      showToast,
      toast,
      turnsBefore
    }
  },
  components: {
    BButton,
    CharacterNav,
    IconStackCloud,
    BuildTab,
    DesignButton,
    OverviewTab,
    BOffcanvas,
    CharacterDiceSidebar,
    DetailsTab,
    EquipmentTab,
    JournalTab,
    TitleWidget,
    CharacterPartyTab,
    CharacterSettings,
    CustomModal,
    LoadingDisplay,
    BFormInput,
    InitiativeDisplay,
    CombatantList,
    TitleMedallion,
    DropdownSelect,
    StatBlockDiceRoller,
    ManualTab,
    BToast,
    ChatBubble
  }
}
</script>

<style>
.diceButton {
  border: none;
  font-size: 1.75rem;
}

@media (max-width: 450px) {
  .diceButton {
    border: none;
    font-size: 1rem;
    margin-bottom: 1rem;
  }
  .non-Mobile {
    display: none;
  }
}
.btn-close {
  ----bs-btn-close-color: inherit;
}
.b-overlay-wrap {
  z-index: 5;
}
ul {
}
</style>
