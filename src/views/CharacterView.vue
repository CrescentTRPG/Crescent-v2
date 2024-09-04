<template>
  <div class="fill" :style="{ background: design.pageBackdrop }">
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
import { ref } from 'vue'
import CharacterNav from '../components/Character/CharacterNav.vue'
import IconStackCloud from '../components/IconStackCloud.vue'
import BuildTab from '../components/Character/Build/BuildTab.vue'
import { useDesignStore } from '@/stores/designStore'
import { useCharacterStore } from '@/stores/characterStore'
import DesignButton from '../components/Character/DesignButton.vue'

export default {
  setup(props, context) {
    const navPos = ref('build')
    let design = useDesignStore()
    const character = useCharacterStore()
    return { design, navPos, character }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CharacterNav,
    IconStackCloud,
    BuildTab,
    DesignButton
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
