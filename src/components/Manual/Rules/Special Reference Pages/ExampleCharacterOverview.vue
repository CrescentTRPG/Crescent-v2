<script lang="ts">
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { useDesignStore } from '@/stores/designStore.ts'
import TitleWidget from '@/components/TitleWidget.vue'
import OverviewAttributes from '@/components/Character/Overview/OverviewAttributes.vue'
import StatBlockAttributes from '@/components/Adventure/Stat Blocks/StatBlockAttributes.vue'
import StatBlockState from '@/components/Adventure/Stat Blocks/StatBlockState.vue'
import StatBlockDetailedReference from '@/components/Adventure/Stat Blocks/StatBlockDetailedReference.vue'

export default {
  props: ['stats'],
  setup(props, context) {
    const modal = ref(false)

    const designStore = useDesignStore()

    return {
      designStore,
      props
    }
  },

  components: { StatBlockDetailedReference }
}
</script>

<template>
  <div>
    <StatBlockDetailedReference
      :omitDetails="true"
      :omitVersionControl="true"
      :omitToolbar="true"
      :currentStatBlock="props.stats"
      :isEditing="false"
    ></StatBlockDetailedReference>
  </div>
</template>

<style scoped></style>
