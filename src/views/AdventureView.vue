<template>
  <div
    class="fill"
    style="display: flex; flex-direction: column"
    :style="{
      background: design.pageBackdrop,
      '--hover-color': hoverShade,
      '--hover-blend': design.primaryTheme,
      '--hover-blend-input': design.inputBacking,
      '--hover-blend-sidebar': design.sidebarBacking
    }"
  >
    <div
      style="display: flex; justify-content: space-between; height: 4.5rem"
      :style="{ background: design.inputBacking }"
    >
      <div
        style="display: flex; justify-content: flex-start; height: 5rem; cursor: pointer"
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
          ><a style="width: 150%">{{ adventure?.name }}</a>
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
      <div class="buttonsTop">
        <div>
          <BButton
            class="button shrinkingButton"
            style="margin-right: 0.25rem; margin-bottom: 1rem"
            :style="{ background: design.primaryTheme, color: design.primaryText }"
            @click="goToHome()"
          >
            <i class="bi bi-arrow-return-left"></i>
          </BButton>
        </div>
        <DesignButton :isAdventure="true"></DesignButton>
        <div>
          <AdventureSettingsButton></AdventureSettingsButton>
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
            <!-- <DiceSidebar></DiceSidebar> -->
          </BOffcanvas>
        </div>
      </div>
    </div>
    <AdventureNav
      @party="navPos = 'party'"
      @combat="navPos = 'combat'"
      @statblocks="navPos = 'statblocks'"
      @items="navPos = 'items'"
      @notes="navPos = 'notes'"
      @manual="navPos = 'manual'"
    ></AdventureNav>
    <PartyTab v-if="navPos === 'party'"></PartyTab>
    <CombatTab v-if="navPos === 'combat'"></CombatTab>
    <StatBlockTab v-if="navPos === 'statblocks'"></StatBlockTab>
    <BeingBuilt v-if="navPos === 'items'"></BeingBuilt>
    <JournalTab :isCharacter="false" style="flex-grow: 1" v-if="navPos === 'notes'"></JournalTab>
    <ManualTab v-if="navPos === 'manual'"></ManualTab>
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
    <CustomModal :showModal="nameModal" title="Edit Adventure Name" @close="nameModal = false">
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
          @click="adventure.setAdventureName(name)"
          style="border: 1px solid"
          :style="{ borderColor: design.secondaryTheme }"
          >Set Name</BButton
        >
      </template>
    </CustomModal>
  </div>
</template>

<script lang="ts">
import { BButton, BFormInput, BToast } from 'bootstrap-vue-next'
import { computed, onMounted, onUnmounted, Ref, ref, watch } from 'vue'
import IconStackCloud from '../components/IconStackCloud.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import DesignButton from '../components/Character/DesignButton.vue'

import BOffcanvas from 'bootstrap-vue-next/src/components/BOffcanvas/BOffcanvas.vue'
import DiceSidebar from '@/components/DiceSidebar/DiceSidebar.vue'
import { useRouter } from 'vue-router'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import BeingBuilt from '@/components/BeingBuilt.vue'
import { Chat, useAdventureStore } from '@/stores/adventureStore.ts'
import AdventureNav from '@/components/Adventure/AdventureNav.vue'
import PartyTab from '@/components/Adventure/Party/PartyTab.vue'
import { usePartyStore } from '@/stores/partyStore.ts'
import StatBlockTab from '@/components/Adventure/Stat Blocks/StatBlockTab.vue'
import CombatTab from '@/components/Adventure/Combat/CombatTab.vue'
import AdventureSettingsButton from '@/components/Adventure/AdventureSettingsButton.vue'
import ManualTab from '@/components/Manual/ManualTab.vue'
import JournalTab from '@/components/Journal/JournalTab.vue'
import { useManualStore } from '@/stores/manualStore.ts'
import { storeToRefs } from 'pinia'
import ChatBubble from '@/components/Adventure/Party/ChatBubble.vue'
import CustomModal from '@/components/CustomModal.vue'

export default {
  setup(props, context) {
    const navPos = ref('party')
    let design = useDesignStore()
    const adventure = useAdventureStore()
    const { chats } = storeToRefs(adventure)
    const showToast = ref(false)
    const name = ref(adventure.name)
    const nameModal = ref(false)
    const toast: Ref<Chat | undefined> = ref(undefined)
    watch(chats, (newChats, oldChats) => {
      console.log(oldChats, newChats)
      if (
        oldChats[oldChats.length - 1].timestamp != newChats[newChats.length - 1].timestamp &&
        newChats[newChats.length - 1].fromId != adventure.gameMasterId
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
    const leftmoon = ref('wi-moon-alt-full')
    const rightmoon = ref('wi-moon-alt-new')
    const showDice = ref(false)
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
    //   onUnmounted(() => {
    //     character.loading = true
    //   })
    const message = ref(loadMessage())
    const delay = (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
    //   const animate = async function (time) {
    //     await delay(time)
    //     leftmoon.value = 'wi-moon-alt-waxing-gibbous-5'
    //     rightmoon.value = 'wi-moon-alt-waxing-crescent-2'
    //     await delay(time)
    //     leftmoon.value = 'wi-moon-alt-waxing-gibbous-4'
    //     rightmoon.value = 'wi-moon-alt-waxing-crescent-3'
    //     await delay(time)
    //     leftmoon.value = 'wi-moon-alt-waxing-gibbous-3'
    //     rightmoon.value = 'wi-moon-alt-waxing-crescent-4'
    //     await delay(time)
    //     leftmoon.value = 'wi-moon-alt-waxing-gibbous-2'
    //     rightmoon.value = 'wi-moon-alt-waxing-crescent-5'
    //     await delay(time)
    //     leftmoon.value = 'wi-moon-alt-waxing-gibbous-1'
    //     rightmoon.value = 'wi-moon-alt-waxing-crescent-6'
    //     await delay(time)
    //     leftmoon.value = 'wi-moon-alt-first-quarter'
    //     rightmoon.value = 'wi-moon-alt-first-quarter'
    //     await delay(time)
    //     rightmoon.value = 'wi-moon-alt-waxing-gibbous-1'
    //     leftmoon.value = 'wi-moon-alt-waxing-crescent-6'
    //     await delay(time)
    //     rightmoon.value = 'wi-moon-alt-waxing-gibbous-2'
    //     leftmoon.value = 'wi-moon-alt-waxing-crescent-5'
    //     await delay(time)
    //     rightmoon.value = 'wi-moon-alt-waxing-gibbous-3'
    //     leftmoon.value = 'wi-moon-alt-waxing-crescent-4'
    //     await delay(time)
    //     rightmoon.value = 'wi-moon-alt-waxing-gibbous-4'
    //     leftmoon.value = 'wi-moon-alt-waxing-crescent-3'
    //     await delay(time)
    //     rightmoon.value = 'wi-moon-alt-waxing-gibbous-5'
    //     leftmoon.value = 'wi-moon-alt-waxing-crescent-2'
    //     animate(time)
    //     rightmoon.value = 'wi-moon-alt-waxing-gibbous-6'
    //     leftmoon.value = 'wi-moon-alt-waxing-crescent-1'
    //     if (character.loading) {
    //       animate(time)
    //     }
    //   }
    let router = useRouter()

    onMounted(() => {
      // character.loading = true
      // animate(300)
      useAdventureStore().pullAdventureFromFirebase(adventure.id)
      useManualStore().pullManualFromFirebase()
      useSpellStore().pullManualSpellgroupsFromFirebase()
      useSpellStore().setUpBuildDisplay({})
    })
    function goToHome() {
      useSpellStore().clearBuildDisplay()
      useMartialPerksStore().clearBuildDisplay()
      useMartialSkillsStore().clearMartialSkillsBuild()
      useSkillStore().clearEffectiveSkills()
      router.push({ name: 'home' })
    }
    onUnmounted(() => {
      adventure.unsubscribe()
      usePartyStore().unsubscribeFromCharacters()
    })

    const hoverShade = computed(() => {
      const r = parseInt(design.alertTheme.substring(1, 3), 16)
      const g = parseInt(design.alertTheme.substring(3, 5), 16)
      const b = parseInt(design.alertTheme.substring(5, 7), 16)
      return 'rgb(' + r + ',' + g + ',' + b + ',.3)'
    })

    return {
      design,
      navPos,
      adventure,
      leftmoon,
      rightmoon,
      message,
      showDice,
      goToHome,
      hoverShade,
      toast,
      showToast,
      chats,
      name,
      nameModal
    }
  },
  components: {
    BButton,
    IconStackCloud,
    DesignButton,
    BOffcanvas,
    AdventureNav,
    BeingBuilt,
    PartyTab,
    StatBlockTab,
    CombatTab,
    AdventureSettingsButton,
    ManualTab,
    JournalTab,
    ChatBubble,
    BToast,
    CustomModal,
    BFormInput
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
.shrinkingButton {
  margin-right: 0.25rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}
.buttonsTop {
  padding-right: 1rem;
  padding-top: 0.5rem;
  min-width: 8.5rem;
  display: flex;
}

@media (max-width: 450px) {
  .diceButton {
    border: none;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
  .shrinkingButton {
    border: none;
    font-size: 0.75rem !important;
    margin-bottom: 0.75rem !important;
  }

  .dazzle2 {
    width: 1rem;
    height: 5rem;
    transform: skew(-45deg);
    position: relative;
    right: 2.5rem;
    z-index: 5;
  }
}
.btn-close {
  ----bs-btn-close-color: inherit;
}
ul {
}
</style>
