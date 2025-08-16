<script lang="ts">
import { DEFAULT_STAT_BLOCK } from '@/bases'
import ArrayTabs from '@/components/ArrayTabs.vue'
import { useDesignStore } from '@/stores/designStore'
import { BButton } from 'bootstrap-vue-next'
import { computed, onMounted, Ref, ref } from 'vue'

export default {
  props: ['currentStatBlock', 'powerLevel', 'icon'],
  setup(props, context) {
    const designStore = useDesignStore()

    return {
      designStore,
      props
    }
  },
  components: {}
}
</script>
<template>
  <div style="width: 2rem; margin-left: 0.25rem; margin-top: 0.25rem">
    <div
      style="position: absolute; z-index: 3"
      :style="{ color: designStore.inputBacking, fontFamily: designStore.titleFont }"
    >
      <v-icon scale="3" name="gi-moon"></v-icon>
    </div>
    <div style="position: absolute; z-index: 2" :style="{ color: designStore.secondaryTheme }">
      <v-icon scale="3" name="gi-plain-circle"></v-icon>
    </div>
    <div
      style="position: absolute; z-index: 1; margin-left: -0.9rem; margin-top: -0.85rem"
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon scale="4.5" :name="icon || 'gi-uncertainty'"></v-icon>
    </div>
    <div
      style="
        display: flex;
        justify-content: center;
        padding-left: 2.15rem;
        font-size: larger;
        padding-top: 1rem;
        z-index: 4;
        position: relative;
      "
      :style="{ fontFamily: designStore.titleFont }"
    >
      {{ props.powerLevel }}
    </div>
  </div>
</template>
<style></style>
