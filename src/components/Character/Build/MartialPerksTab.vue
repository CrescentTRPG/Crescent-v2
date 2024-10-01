<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '@/stores/designStore'
import MartialGainWidget from './MartialGainWidget.vue'
import MartialPerksTable from './MartialPerksTable.vue'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const tab = ref('corestats')
    return { designStore, tab, props }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    MartialPerksTable,
    MartialGainWidget
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <MartialGainWidget></MartialGainWidget>

    <MartialPerksTable></MartialPerksTable>
  </div>
</template>

<style></style>
