<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import { useJournalStore } from '@/stores/journalStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import MoonDisplay from '../Character/Details/MoonDisplay.vue'
import CalenderPicker from './CalenderPicker.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useAdventureStore } from '@/stores/adventureStore.ts'

export default {
  props: ['setCreateCalendarModal', 'isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const characterStore = useCharacterStore()
    const adventureStore = useAdventureStore()

    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore,
      characterStore,
      adventureStore
    }
  },
  components: {
    BButton,
    MoonDisplay,
    CalenderPicker
  }
}
</script>

<template>
  <div class="header">
    <div
      style="
        display: flex;
        justify-content: space-between;
        height: 2.5rem;
        font-size: x-large;
        max-width: 100vw;
      "
      :style="{ background: designStore.inputBacking }"
    >
      <div
        style="display: flex; justify-content: space-between; flex-grow: 1"
        :style="{ color: designStore.inputText }"
      >
        <div style="display: flex">
          <div
            class="journalTitle"
            :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          >
            <div class="journalIcon">
              <i :style="{ color: designStore.secondaryTheme }" class="bi bi-journal-richtext"></i>
            </div>
            <div>Journal</div>
          </div>
          <div class="dazzle" :style="{ color: designStore.primaryTheme }"></div>
          <div class="dazzle2" :style="{ borderColor: designStore.secondaryTheme }"></div>
        </div>
        <div style="display: flex; justify-content: end">
          <BButton
            v-if="!props.isCharacter || characterStore.adventure.adventureId"
            class="mobileJournalTabDissapearingItems"
            style="
              margin-right: 0.5rem;
              padding: 0.5rem;
              padding-top: 0.15rem;
              margin-top: 0.25rem;
              height: 2rem;
            "
            :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
            ><i class="bi bi-share"></i
          ></BButton>
          <BButton
            v-if="!props.isCharacter"
            class="mobileJournalTabDissapearingItems"
            style="
              margin-right: 0.5rem;
              padding: 0.5rem;
              padding-top: 0.15rem;
              margin-top: 0.25rem;
              height: 2rem;
            "
            @click="props.setCreateCalendarModal(true)"
            :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
            ><i class="bi bi-calendar"></i
          ></BButton>
        </div>
      </div>
      <div
        v-if="
          (characterStore.adventure.adventureId || adventureStore.gameMasterId === userStore.id) &&
          journalStore.calendar.dateFormula
        "
        class="shrinkForMobile"
        style="
          position: absolute;
          right: 0;
          height: 5rem;
          width: 15rem;
          border-radius: 0 0 50rem 50rem;
        "
        :style="{ background: designStore.primaryTheme }"
      >
        <div style="display: flex; justify-content: center">
          <div style="display: flex; flex-direction: column">
            <CalenderPicker></CalenderPicker>
            <MoonDisplay
              style="
                transform: scale(1.25, -1);
                position: relative;
                bottom: 1rem;
                pointer-events: none;
              "
            ></MoonDisplay>
          </div>
        </div>
      </div>
      <div v-if="journalStore.calendar.dateFormula" style="width: 15rem"></div>
    </div>
  </div>
</template>

<style scoped>
.header {
  height: 6rem;
  display: flex;
  flex-direction: column;
}
.dazzle {
  width: 0;
  height: 0;
  border-left: 4rem solid;
  border-bottom: 4rem solid transparent;
}
.dazzle2 {
  width: 1.5rem;
  height: 4rem;
  transform: skew(-45deg);
  position: relative;
  right: 2.5rem;
  z-index: 5;
}
.journalTitle {
  padding: 0.5rem;
  padding-bottom: 1rem;
  z-index: 4;
  display: flex;
  font-size: x-large;
  text-align: center;
  height: 4rem;
}
.journalIcon {
  font-size: 2.5rem;
  margin-top: -0.5rem;
  margin-right: 0.5rem;
}
@media (max-width: 600px) {
  .header {
    height: 4.5rem;
  }
  .journalIcon {
    font-size: 2rem;
  }
  .journalTitle {
    font-size: large;
    height: 3.5rem;
  }
  .shrinkForMobile {
    transform: scale(0.75);
    margin-top: -0.65rem;
    margin-right: -1rem;
  }
  .dazzle {
    display: none;
  }
  .dazzle2 {
    display: none;
  }
}
</style>
