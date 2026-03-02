<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'
import BackstoryWidget from './BackstoryWidget.vue'
import CharacterImage from './CharacterImage.vue'
import CoreTraits from './CoreTraits.vue'
import LunarMotivation from './LunarMotivation.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    return {
      designStore,
      modal,
      userStore,
      characterStore
    }
  },
  components: { CharacterImage, BackstoryWidget, LunarMotivation, CoreTraits }
}
</script>

<template>
  <div class="detailsLayout" :style="{ fontFamily: designStore.font }">
    <div class="imageBackContent">
      <CharacterImage></CharacterImage>
      <LunarMotivation class="mobileMotive"></LunarMotivation>
      <div style="display: flex; flex-direction: column; flex-grow: 1; min-height: 20rem">
        <BackstoryWidget style="flex-grow: 1"></BackstoryWidget>
      </div>
    </div>
    <div class="coreContainer" :style="{ background: designStore.primaryTheme }">
      <div style="flex-grow: 1"><CoreTraits></CoreTraits></div>
      <div style="display: flex; flex-direction: column">
        <div class="motive">
          <LunarMotivation></LunarMotivation>
        </div>
        <!-- <LilDesign style="position: relative; top: 2rem"></LilDesign> -->
      </div>
    </div>
    <div style="display: flex"></div>
  </div>
</template>

<style>
.mobileMotive {
  display: none;
}

.imageBackContent {
  display: flex;
  height: fit-content;
}
.detailsLayout {
  width: 100%;
}
.coreContainer {
  display: flex;
  padding-bottom: 2rem;
}
.charImage {
  width: 20rem;
}
.wholepiece {
  display: none;
}
@media (max-width: 1400px) {
  .wholepiece {
    display: block;
  }
}
@media (max-width: 800px) {
  .charImage {
    width: 15rem;
  }

  .coreContainer {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
}
@media (max-width: 500px) {
  .wholepiece {
    display: block;
  }
  .imageBackContent {
    display: flex;
    height: fit-content;
    justify-content: center;
    flex-wrap: wrap;
  }
  .charImage {
    width: 12rem;
  }
  .coreContainer {
    display: flex;
    flex-wrap: wrap;
  }
  .motive {
    display: none;
  }
  .mobileMotive {
    flex-grow: 1;
    align-self: center;
    display: block;
  }
}
</style>
