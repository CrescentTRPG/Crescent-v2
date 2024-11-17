<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import CustomModal from './CustomModal.vue'
import { ref } from 'vue'

export default {
  props: ['title', 'infoMessage'],
  setup(props) {
    const modal = ref(false)

    const designStore = useDesignStore()
    return { designStore, props, modal }
  },
  components: {
    CustomModal
  }
}
</script>
<template>
  <div
    style="
      font-size: x-large;
      margin-top: 1rem;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
    "
    :style="{
      fontFamily: designStore.titleFont,
      color: designStore.primaryText,
      background: designStore.primaryTheme
    }"
  >
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="margin-left: 2rem">{{ props.title }}</div>
      <div v-if="infoMessage">
        <i
          class="bi bi-patch-question"
          style="margin-right: 2rem; cursor: pointer"
          :style="{ color: designStore.alertTheme }"
          @click="modal = true"
        ></i>
      </div>
    </div>
    <span
      style="display: flex; margin-bottom: -1rem; margin-top: -1rem"
      :style="{ borderColor: designStore.secondaryTheme, color: designStore.secondaryTheme }"
    >
      <v-icon
        name="gi-abstract-119"
        style="position: relative; left: 0.25rem; top: 0.5rem"
      ></v-icon>
      <hr :style="{ borderColor: designStore.secondaryTheme }" />
      <v-icon
        name="gi-abstract-119"
        style="position: relative; right: 0.25rem; top: 0.5rem"
      ></v-icon>
    </span>
    <CustomModal :showModal="modal" :title="title" @close="modal = false">
      <template v-slot:body>
        <div>{{ infoMessage }}</div>
      </template>
    </CustomModal>
  </div>
</template>
<style></style>
