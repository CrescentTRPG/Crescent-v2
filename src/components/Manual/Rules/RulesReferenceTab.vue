<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref, useTemplateRef } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useManualStore } from '@/stores/manualStore.ts'
import ReferenceSearch from './ReferenceSearch.vue'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const manualStore = useManualStore()
    const input: any = useTemplateRef('pdf')
    const designStore = useDesignStore()
    function download() {
      input.value.download('crescent-manual-0.3.pdf')
    }
    function scrollbarColor() {
      let sec = designStore.secondaryTheme
      let prim = designStore.primaryTheme
      return sec + ' ' + prim
    }
    return {
      modal,
      userStore,
      props,
      designStore,
      scrollbarColor,
      download
    }
  },
  components: { ReferenceSearch }
}
</script>

<template>
  <div
    :style="{ fontFamily: designStore.font }"
    style="height: 800px"
    class="rulesReferenceContainer"
  >
    <div style="flex-grow: 1">
      <ReferenceSearch></ReferenceSearch>
      <div></div>
    </div>
  </div>
</template>

<style>
.rulesReferenceContainer {
  display: flex;
}
</style>
