<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import { useJournalStore } from '@/stores/journalStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BookmarkedEntries from './BookmarkedEntries.vue'

export default {
  props: ['openCreateFile'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore
    }
  },
  components: { BButton, BookmarkedEntries }
}
</script>

<template>
  <div style="display: flex; justify-content: center; flex-direction: column; height: 50vh">
    <div style="display: flex; justify-content: center; width: 100%; font-size: large">
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          fontFamily: designStore.titleFont
        }"
        style="
          display: flex;
          flex-direction: column;
          padding: 1rem;
          border-radius: 0.375rem;
          width: 80%;
          text-align: center;
        "
      >
        No File Open
        <div style="display: flex; justify-content: center">
          <i
            class="bi bi-journal-richtext"
            style="font-size: 10rem; transform: scaleX(0.8); font-family: sans-serif"
          ></i>
        </div>
        <b-button
          @click="props.openCreateFile('')"
          style="width: fit-content; align-self: center; padding: 0.5rem"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          >Create New File</b-button
        >

        <div v-if="Object.keys(journalStore.bookmarkedEntries).length">
          Or Open from Bookmarks
          <div
            style="
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              padding-top: 0.5rem;
              padding-bottom: 1rem;
              margin-top: 0.5rem;
            "
            :style="{ background: designStore.primaryTheme }"
          >
            <BookmarkedEntries :openFile="{}"></BookmarkedEntries>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
