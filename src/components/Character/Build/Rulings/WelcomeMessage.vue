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
      <p style="z-index: 5; padding: 0.5rem; padding-bottom: 0rem">
        Welcome to Crescent! I'm here to help. I'll give you tips and let you know if theres an
        error with your build. <br /><br />If you're completely new to Crescent checkout the
        Reference Tab <i class="bi bi-book"></i>. This has all kinds of information regaurding how
        to make a character, how to play, and what abilities to take depending on what you are
        looking for! I reccomend searching for the <i>New Player Guide</i> and starting there!
      </p>
    </div>
  </div>
</template>
<style></style>
