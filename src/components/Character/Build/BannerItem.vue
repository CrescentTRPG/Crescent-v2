<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

export default {
  props: ['name'],
  setup(props, context) {
    const name = ref(props?.name || '')
    const router = useRouter()
    const designStore = useDesignStore()
    return { designStore, name, props }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard
  }
}
</script>

<template>
  <div style="position: absolute">
    <v-icon
      name="gi-vertical-banner"
      scale="12"
      :style="{ color: designStore.primaryTheme }"
    ></v-icon>
    <v-icon
      scale="2.75"
      :name="props?.name"
      :style="{ color: designStore.secondaryTheme }"
      style="position: absolute; top: 5rem; left: 5.55rem"
    ></v-icon>
  </div>
</template>

<style></style>
