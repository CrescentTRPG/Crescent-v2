<template>
  <div
    class="fill"
    v-if="character.loading"
    style="font-size: xx-large; display: flex; justify-content: center; padding-top: 10rem"
  >
    <v-icon scale="4" :name="leftmoon" animation="float"></v-icon>
    <div>{{ message }}</div>
    <v-icon scale="4" :name="rightmoon" animation="float"></v-icon>
  </div>
  <div class="fill" :style="{ background: design.pageBackdrop }" v-if="!character.loading">
    <div
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
          :style="{ background: design.primaryTheme, color: design.primaryText }"
          ><div style="width: 150%">{{ character?.name }}</div>
          <div
            style="display: flex; justify-content: end; position: relative"
            class="sparkle-height"
          >
            <i
              class="bi bi-stars"
              style="position: absolute; z-index: 5"
              :style="{ color: design.secondaryTheme }"
            ></i>
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
        <DesignButton></DesignButton>
        <div>
          <BButton
            class="button"
            style="margin-right: 0.25rem; margin-bottom: 1rem"
            :style="{ background: design.primaryTheme, color: design.primaryText }"
          >
            <i class="bi bi-gear-fill"></i>
          </BButton>
        </div>
        <div>
          <BButton
            class="diceButton"
            style="margin-right: 0.25rem"
            :style="{ background: design.primaryTheme, color: design.primaryText }"
          >
            <i class="bi bi-dice-6"></i>
          </BButton>
        </div>
      </div>
    </div>
    <CharacterNav
      @build="navPos = 'build'"
      @overview="navPos = 'overview'"
      @details="navPos = 'details'"
      @equipment="navPos = 'equipment'"
      @journal="navPos = 'journal'"
      @manual="navPos = 'manual'"
    ></CharacterNav>
    <BuildTab v-if="navPos === 'build'"></BuildTab>
  </div>
</template>

<script lang="ts">
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'
import CharacterNav from '../components/Character/CharacterNav.vue'
import IconStackCloud from '../components/IconStackCloud.vue'
import BuildTab from '../components/Character/Build/BuildTab.vue'
import { useDesignStore } from '@/stores/designStore'
import { useCharacterStore } from '@/stores/characterStore'
import DesignButton from '../components/Character/DesignButton.vue'
import { useUserStore } from '@/stores/userStore'
import { FileExtensionInfo } from 'typescript'

export default {
  setup(props, context) {
    const navPos = ref('build')
    let design = useDesignStore()
    const character = useCharacterStore()
    const leftmoon = ref('wi-moon-alt-full')
    const rightmoon = ref('wi-moon-alt-new')
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
    onMounted(() => {
      animate(300)
      if (character.here == 0) {
        character.pullCharacterFromFirebase(useUserStore().getUserId, character.getCharacterId)
      }
    })
    onUnmounted(() => {
      character.unsubscribe()
    })
    return { design, navPos, character, leftmoon, rightmoon, message }
  },
  components: {
    BButton,
    CharacterNav,
    IconStackCloud,
    BuildTab,
    DesignButton
  },
  methods: {
    delay: function (time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
  }
}
</script>

<style scoped>
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
}
</style>
