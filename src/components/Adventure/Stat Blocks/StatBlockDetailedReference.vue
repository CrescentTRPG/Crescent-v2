<script lang="ts">
import { DEFAULT_STAT_BLOCK } from '@/bases'
import { useDesignStore } from '@/stores/designStore'
import { ref } from 'vue'

export default {
  props: ['currentStatBlock', 'editMode'],
  setup(props, context) {
    const designStore = useDesignStore()
    const statBlock = props.currentStatBlock
    return {
      designStore,
      statBlock
    }
  }
}
</script>
<template>
  <div></div>
</template>
<style></style>
