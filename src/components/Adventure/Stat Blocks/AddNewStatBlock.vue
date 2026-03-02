<script lang="ts">
import { DEFAULT_STAT_BLOCK } from '@/bases.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import _ from 'lodash'
import { ref } from 'vue'
import StatBlockDetailedReference from './StatBlockDetailedReference.vue'

export default {
  props: ['currentStatBlock', 'lightenDarkenColor'],
  setup(props, context) {
    const designStore = useDesignStore()
    const statBlock = ref(_.cloneDeep(DEFAULT_STAT_BLOCK))

    function goBack() {
      context.emit('return')
    }
    const isEditing = ref(true)

    return {
      goBack,
      designStore,
      props,
      statBlock,
      isEditing
    }
  },
  components: {
    StatBlockDetailedReference
  }
}
</script>
<template>
  <div>
    <StatBlockDetailedReference
      :is-editing="isEditing"
      :current-stat-block="statBlock"
      :lightenDarkenColor="props.lightenDarkenColor"
      :goBack="goBack"
    ></StatBlockDetailedReference>
  </div>
</template>
<style></style>
