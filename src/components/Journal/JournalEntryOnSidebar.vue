P
<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import { useJournalStore } from '@/stores/journalStore.ts'
import { storeToRefs } from 'pinia'

export default {
  props: ['path', 'id', 'closeSideBar', 'isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const { entryMap, journalIdKey } = storeToRefs(journalStore)
    const render = ref(false)

    function getIcon() {
      switch (journalIdKey.value[props.id]?.type || 'html') {
        case 'html':
          return 'bi bi-file'
        case 'image':
          return 'bi bi-file-image'
        case 'bio':
          return 'bi bi-file-post'
        case 'timeline':
          return 'bi bi-calender-4-range'
        default:
          return 'bi bi-file'
      }
    }
    return {
      modal,
      userStore,
      props,
      designStore,
      entryMap,
      render,
      journalStore,
      getIcon,
      journalIdKey
    }
  },
  components: {}
}
</script>

<template>
  <a
    @click="
      (journalStore.openNewFile(props.id, isCharacter), props.closeSideBar(), props.isCharacter)
    "
    style="width: fit-content; text-wrap: nowrap; cursor: pointer"
  >
    <i :class="getIcon()"></i> {{ journalIdKey[id]?.name || '' }}
  </a>
</template>

<style>
.rulesReferenceContainer {
  display: flex;
}
</style>
