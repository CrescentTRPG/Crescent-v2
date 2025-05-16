<template>
  <div
    class="fill"
    v-if="character.loading"
    style="font-size: xx-large; display: flex; justify-content: center; padding-top: 10rem"
    :style="{ fontFamily: design.font + ', sans-serif' }"
  >
    <v-icon scale="4" :name="leftmoon" animation="float"></v-icon>
    <div>{{ message }}</div>
    <v-icon scale="4" :name="rightmoon" animation="float"></v-icon>
  </div>
  <div
    :class="props.isGameMaster ? 'none' : 'fill'"
    style="display: flex; flex-direction: column"
    :style="{
      background: design.pageBackdrop
    }"
    v-if="!character.loading"
  >
    <div
      v-if="!props.isGameMaster"
      style="display: flex; justify-content: space-between; height: 4.5rem"
      :style="{ background: design.inputBacking }"
    >
      <div style="display: flex; justify-content: flex-start; height: 5rem">
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
              style="position: absolute; z-index: 5; right: -10"
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
            <DiceSidebar
              @rolled="
                (rollObj) => {
                  logRoll(rollObj)
                }
              "
            ></DiceSidebar>
          </BOffcanvas>
        </div>
      </div>
    </div>
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
    <BeingBuilt v-if="navPos === 'journal'"></BeingBuilt>
    <BeingBuilt v-if="navPos === 'manual'"></BeingBuilt>
    <CharacterPartyTab v-if="navPos === 'party'"></CharacterPartyTab>
  </div>
</template>

<script lang="ts">
import { BButton } from 'bootstrap-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import CharacterNav from '../components/Character/CharacterNav.vue'
import IconStackCloud from '../components/IconStackCloud.vue'
import BuildTab from '../components/Character/Build/BuildTab.vue'
import { useDesignStore } from '@/stores/designStore'
import { useCharacterStore } from '@/stores/characterStore'
import DesignButton from '../components/Character/DesignButton.vue'
import { useUserStore } from '@/stores/userStore'
import { FileExtensionInfo } from 'typescript'
import OverviewTab from '@/components/Character/Overview/OverviewTab.vue'
import BOffcanvas from 'bootstrap-vue-next/src/components/BOffcanvas/BOffcanvas.vue'
import DiceSidebar from '@/components/DiceSidebar/DiceSidebar.vue'
import DetailsTab from '@/components/Character/Details/DetailsTab.vue'
import EquipmentTab from '@/components/Character/Equipment/EquipmentTab.vue'
import router from '@/router'
import { useRouter } from 'vue-router'
import { useSpellStore } from '@/stores/spellsStore'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import { useSkillStore } from '@/stores/skillsStore'
import BeingBuilt from '@/components/BeingBuilt.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useAdventureStore } from '@/stores/adventureStore'
import CharacterPartyTab from '@/components/Character/Build/Party/CharacterPartyTab.vue'
import { validateHeaderName } from 'http'
import CharacterSettings from '@/components/Character/CharacterSettings.vue'
import CustomModal from '@/components/CustomModal.vue'

export default {
  props: ['isGameMaster', 'exit'],
  setup(props, context) {
    const navPos = ref('build')
    let design = useDesignStore()
    const character = useCharacterStore()
    const leftmoon = ref('wi-moon-alt-full')
    const rightmoon = ref('wi-moon-alt-new')
    const showDice = ref(false)
    const settingsModal = ref(false)
    const loadMessage = function () {
      let val = Math.floor(Math.random() * 15)
      switch (val) {
        case 0:
          return 'Calibrating Crossbows'
        case 1:
          return 'Scouting the Dungeon'
        case 2:
          return 'Stealthily Casting Fireball'
        case 3:
          return 'Applying Ambiance'
        case 4:
          return 'Fetching Quests'
        case 5:
          return 'Slaying the Dragon'
        case 6:
          return 'Leveling Up'
        case 7:
          return 'Gearing Up'
        case 8:
          return 'Building a Worthy Rival'
        case 9:
          return 'Brewing Potions'
        case 10:
          return 'Stressing my Exceptional Intelligence'
        case 11:
          return 'Rolling the Dice'
        case 12:
          return 'Running on Water'
        case 13:
          return 'Testing out a new Spell'
        case 14:
          return 'Sharpening Blades'
        default:
          return 'Counting Coins'
      }
    }
    const userStore = useUserStore()
    onUnmounted(() => {
      character.loading = true
      character.unsubscribe()
    })
    function logRoll(rollObj: { rollsObj: {}; timestamp: string; rolltitle: string }) {
      let message = 'DICE ROLL: ' + rollObj.rolltitle + '\n'
      let arr = Object.values(rollObj.rollsObj)
      arr.forEach((roll: any) => {
        let label = roll.label ? roll.label : '(' + roll.str + ')'
        message += label + ' = ' + roll.subtotal + '\n'
      })
      console.log(message)
      useAdventureStore().addChat(
        message,
        character.name,
        userStore.getUserId,
        false,
        [],
        design.charIcon
      )
    }
    const message = ref(loadMessage())
    const delay = (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
    const animate = async function (time) {
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-5'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-2'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-4'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-3'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-3'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-4'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-2'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-5'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-1'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-6'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-first-quarter'
      rightmoon.value = 'wi-moon-alt-first-quarter'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-1'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-6'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-2'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-5'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-3'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-4'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-4'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-3'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-5'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-2'
      animate(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-6'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-1'
      if (character.loading) {
        animate(time)
      }
    }
    let router = useRouter()

    onMounted(() => {
      character.loading = true
      animate(300)

      if (!props.isGameMaster) {
        useCharacterStore().pullCharacterFromFirebase(useUserStore().getUserId, character.id, true)
        if (character.adventure.adventureId && character.adventure.gameMasterId) {
          useAdventureStore().pullAdventureAsCharacterFromFirebase(
            character.adventure.adventureId,
            character.adventure.gameMasterId
          )
        }
      }
    })
    function goToHome() {
      useSpellStore().clearBuildDisplay()
      useMartialPerksStore().clearBuildDisplay()
      useMartialSkillsStore().clearMartialSkillsBuild()
      useSkillStore().clearEffectiveSkills()
      router.push({ name: 'home' })
    }
    return {
      logRoll,
      props,
      design,
      navPos,
      character,
      leftmoon,
      rightmoon,
      message,
      showDice,
      goToHome,
      settingsModal
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
    DiceSidebar,
    DetailsTab,
    EquipmentTab,
    BeingBuilt,
    TitleWidget,
    CharacterPartyTab,
    CharacterSettings,
    CustomModal
  },
  methods: {
    delay: function (time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
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
ul {
}
</style>
