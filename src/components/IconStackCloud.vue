<template>
  <div style="background: #422c58; height: 100%" id="main">
    <i
      v-if="designStore?.charIcon.substring(0, 2) === 'bi'"
      :class="designStore.charIcon"
      style="position: relative; top: 0rem; left: 0.4rem; rotate: 0deg; z-index: 2"
    ></i>
    <v-icon
      id="gi-main-icon"
      v-if="designStore?.charIcon.substring(0, 2) === 'gi'"
      :name="designStore.charIcon"
      :scale="size"
      style="position: relative; top: 0rem; rotate: 0deg; z-index: 2; left: 0.2rem"
    ></v-icon>
    <!-- <svg src="../assets/5Mox5f01.svg"></svg>> -->
  </div>
</template>

<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { ref } from 'vue'

export default {
  scale: ['scale'],
  setup(props, context) {
    const designStore = useDesignStore()
    const size = ref(window.innerWidth > 600 ? 3.5 : 1.25)
    window.addEventListener('resize', function () {
      if (window.innerWidth < 600) {
        size.value = 1.25
      } else {
        size.value = 3.5
      }
    })
    return {
      size,
      designStore,
      props
    }
  }
}
</script>

<style>
@media (max-width: 450px) {
  /* CSS that should be displayed if width is equal to or less than 800px goes here */
  .moon {
    font-size: 3.5rem;
    width: 3.5rem;
  }
  .gi-main-icon {
    scale: '1';
  }
}
.moon {
  font-size: 1em;
  width: 1rem;
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
}
</style>
