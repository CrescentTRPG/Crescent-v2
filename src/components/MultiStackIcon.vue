<script lang="ts">
import { useDesignStore } from '../stores/designStore.ts'

export default {
  props: ['inner', 'outer'],
  setup(props, context) {
    const designStore = useDesignStore()

    return { designStore, props }
  }
}
</script>
<template>
  <div
    style="
      position: relative;
      left: -0.9rem;
      top: -0.6rem;
      z-index: 2;
      height: 4rem;
      width: 4rem;
      font-family: sans-serif;
    "
  >
    <i
      class="bi bi-circle"
      style="
        font-size: 3rem;
        z-index: 3;
        position: absolute;
        left: 0.9rem;
        top: 0.2rem;
        font-family: sans-serif;
      "
      :style="{ color: designStore.secondaryTheme }"
    ></i>
    <v-icon
      :name="props.outer"
      style="position: absolute; z-index: 2"
      scale="4"
      :style="{ color: designStore.secondaryTheme }"
    ></v-icon>

    <v-icon
      :name="props.inner"
      style="position: absolute; left: 0.7rem; top: 0.6rem; z-index: 2"
      scale="2.9"
      :style="{ color: designStore.inputBacking }"
    ></v-icon>
  </div>
</template>
<style scoped></style>
