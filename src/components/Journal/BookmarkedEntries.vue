<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import { useJournalStore } from '@/stores/journalStore.ts'

export default {
  props: ['openCreateFile', 'openFile', 'noExcessMargin', 'isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()

    const bookmarks: any = computed(() => {
      return Object.values(journalStore.bookmarkedEntries) || []
    })
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    function getBackgroundColor(id) {
      if (id === props.openFile.id) {
        return designStore.alertTheme
      }
      return designStore.inputBacking
    }
    function getTextColor(id) {
      if (id === props.openFile.id) {
        return designStore.primaryText
      }
      return designStore.inputText
    }
    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore,
      bookmarks,
      getBackgroundColor,
      getTextColor,
      lightenDarkenColor
    }
  },
  components: {}
}
</script>

<template>
  <div
    :style="{ fontFamily: designStore.font }"
    style="
      flex-grow: 1;
      display: flex;
      flex-direction: row;
      width: 100%;
      cursor: pointer;
      flex-wrap: wrap;
    "
  >
    <div
      @click="journalStore.setOpenFileFromBookmark(mark, props.isCharacter)"
      v-for="mark in bookmarks"
      :key="mark.id"
      class="bookmarkedTab"
      :style="{
        background: getBackgroundColor(mark.id),
        color: getTextColor(mark.id),
        borderColor: lightenDarkenColor(designStore.inputBacking, -20)
      }"
    >
      <i
        @click="journalStore.removeBookmarkedEntry(mark.id)"
        class="bi bi-x-lg"
        style="padding: 0.25rem"
      ></i>
      {{ mark.name }}
    </div>
  </div>
</template>

<style>
.bookmarkedTab {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-radius: 0.5rem;
  font-size: small;
  padding: 0.5rem;
  padding-bottom: 1rem;
  margin-right: 0.25rem;
  margin-bottom: -0.5rem;
  border: 1px solid;
  border-bottom: 0;
  z-index: 2;
}
</style>
