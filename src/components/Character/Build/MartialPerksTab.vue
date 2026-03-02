<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
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
    MartialPerksTable,
    MartialGainWidget
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column">
    <MartialGainWidget></MartialGainWidget>

    <MartialPerksTable style="margin-top: -1rem"></MartialPerksTable>
  </div>
</template>

<style></style>
