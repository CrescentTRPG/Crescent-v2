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
  <div
    style="
      width: fit-content;
      padding-bottom: 1rem;
      padding-top: 0.5rem;
      margin-left: 1.5rem;
      margin-right: 1.5rem;
    "
  >
    <i
      class="bi bi-exclamation"
      style="
        font-size: large;
        align-self: center;
        transform: scale(2, 2);
        z-index: 6;
        margin-top: -0.5rem;
        position: absolute;
      "
      :style="{ color: designStore.alertTheme }"
    ></i>
    <i
      class="bi bi-circle-fill"
      style="
        font-size: large;
        align-self: center;
        transform: scale(2.2, 2.2);
        z-index: 2;
        margin-top: -0.5rem;
        position: absolute;
      "
      :style="{ color: designStore.alertTheme }"
    ></i>
    <i
      class="bi bi-circle-fill"
      style="
        font-size: large;
        align-self: center;
        transform: scale(2, 2);
        z-index: 2;
        margin-top: -0.5rem;
        position: absolute;
      "
      :style="{ color: designStore.inputBacking }"
    ></i>
    <div
      style="margin-left: 0.5rem"
      class="messageBubble"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.alertTheme
      }"
    >
      <div
        :style="{ background: designStore.inputBacking }"
        style="
          z-index: 5;
          padding: 0.5rem;
          padding-left: 0.75rem;
          padding-bottom: 0rem;
          border-radius: 0.25rem;
          position: relative;
          top: -0.5rem;
          left: -0.5rem;
        "
      >
        {{ props.message }}
      </div>
    </div>
  </div>
</template>
<style>
.messageBubble {
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: 2px solid;
}
</style>
