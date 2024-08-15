<script lang="ts">
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'

export default {
  setup(props, context) {
    return {}
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard
  }
}
</script>

<template></template>

<style></style>
