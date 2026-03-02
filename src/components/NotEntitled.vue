<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'

export default {
  setup() {
    const designStore = useDesignStore()
    return { designStore }
  }
}
</script>
<template>
  <div style="display: flex; justify-content: center; flex-direction: column; height: 50vh">
    <div style="display: flex; justify-content: center; width: 100%; font-size: large">
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          fontFamily: designStore.titleFont
        }"
        style="
          display: flex;
          flex-direction: column;
          padding: 1rem;
          border-radius: 0.375rem;
          width: 80%;
          text-align: center;
        "
      >
        This Page is only available to Cool People
        <div style="display: flex; justify-content: center">
          <v-icon scale="10" name="gi-throne-king" style="align-self: center"></v-icon>
        </div>
        {{ 'Take it up with your local Warlord' }}
      </div>
    </div>
  </div>
</template>
<style></style>
