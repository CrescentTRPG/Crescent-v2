<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { ref } from 'vue'

export default {
  props: ['message'],
  setup(props: any) {
    const designStore = useDesignStore()
    const selected = ref(false)
    return {
      designStore,
      selected,
      props
    }
  }
}
</script>
<template>
  <div style="padding-bottom: 1rem">
    <div
      style="
        margin-left: 0.5rem;
        padding: 0.5rem;
        font-size: large;
        margin-left: -1rem;
        margin-right: -1rem;
        margin-top: -1rem;
      "
      :style="{
        color: designStore.primaryText
      }"
    >
      <div style="z-index: 5; padding: 0.5rem; padding-bottom: 0rem">
        Following the rules <i class="bi bi-emoji-smile-fill"></i>
      </div>
    </div>
  </div>
</template>
<style></style>
