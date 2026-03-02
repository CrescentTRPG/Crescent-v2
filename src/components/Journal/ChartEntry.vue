<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'
import { useJournalStore } from '@/stores/journalStore.ts'

export default {
  props: ['sendUpdates', 'openFile'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const nodes = ref([
      { id: '1', type: 'input', label: 'Node 1', position: { x: 250, y: 5 } },
      { id: '2', label: 'Node 2', position: { x: 100, y: 100 } },
      { id: '3', label: 'Node 3', position: { x: 400, y: 100 } },
      { id: '4', label: 'Node 4', position: { x: 400, y: 200 } }
    ])

    const edges = ref([
      { id: 'e1-2', source: '1', target: '2', animated: true },
      { id: 'e1-3', source: '1', target: '3' }
    ])
    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore,
      nodes,
      edges
    }
  },
  components: {}
}
</script>

<template>
  <div style="height: 100rem; width: 100rem"></div>
</template>

<style>
.arrangeForMobile {
  flex-direction: row;
}
@media (max-width: 600px) {
  .arrangeForMobile {
    flex-direction: column;
  }
}
</style>
