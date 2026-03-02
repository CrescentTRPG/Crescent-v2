<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { ref } from 'vue'
import StatBlockDetailedReference from './StatBlockDetailedReference.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'

export default {
  props: ['currentStatBlock', 'lightenDarkenColor', 'id'],
  setup(props, context) {
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    function goBack() {
      context.emit('return')
    }
    function rm(id) {
      adventureStore.removeStatBlock(id)
      goBack()
    }
    const isEditing = ref(true)

    return {
      goBack,
      designStore,
      props,
      isEditing,
      rm
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
      :current-stat-block="props.currentStatBlock"
      :lightenDarkenColor="props.lightenDarkenColor"
      :goBack="goBack"
      :rm="rm"
      :current-stat-block-id="props.id"
    ></StatBlockDetailedReference>
  </div>
</template>
<style></style>
