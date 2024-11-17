<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

export default {
  props: ['charges', 'name'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    return {
      designStore,
      modal,
      props
    }
  },
  components: {}
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; justify-content: center"
    :style="{ background: designStore.sidebarBacking }"
  >
    <v-icon
      name="wi-moon-alt-full"
      scale="1"
      style="align-self: center; margin-bottom: -0.3rem"
    ></v-icon>
    <div style="display: flex; width: 3rem; justify-content: space-between">
      <v-icon name="wi-moon-alt-third-quarter" scale="1"></v-icon>
      <v-icon name="wi-moon-alt-waning-crescent-4" scale="1"></v-icon>
    </div>
    <v-icon
      name="wi-moon-alt-new"
      scale="1"
      style="align-self: center; margin-top: -0.3rem"
    ></v-icon>
  </div>
</template>

<style scoped></style>
