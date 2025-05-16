<script lang="ts">
import { DEFAULT_STAT_BLOCK } from '@/bases'
import { useDesignStore } from '@/stores/designStore'
import { ref } from 'vue'

export default {
  props: ['currentStatBlock', 'isNew'],
  setup(props, context) {
    const designStore = useDesignStore()
    const statBlock = ref(DEFAULT_STAT_BLOCK)
    if (!props.isNew) {
      statBlock.value = props.currentStatBlock
    }
    return {
      designStore
    }
  }
}
</script>
<template>
  <div></div>
</template>
<style></style>
