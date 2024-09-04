<template>
  <div style="background: #422c58; height: 100%">
    <i
      class="bi bi-moon-stars-fill"
      style="position: relative; top: 0rem; left: 0.4rem; rotate: 0deg; z-index: 2"
    ></i>
    <!-- <svg src="../assets/5Mox5f01.svg"></svg>> -->
  </div>
</template>

<script lang="ts">
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import moon from '../assets/5Mox5f01.svg'

export default {
  setup(props, context) {
    return {}
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
}
.moon {
  font-size: 1em;
  width: 1rem;
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
}
</style>
