<script lang="ts">
import {} from 'vue-router'
import { useDesignStore } from '../../../../stores/designStore'
import TitleWidget from '@/components/TitleWidget.vue'

export default {
  props: ['tab'],
  setup(props, context) {
    const designStore = useDesignStore()
    return { designStore, props }
  },
  methods: {},
  components: { TitleWidget }
}
</script>

<template>
  <TitleWidget title="Fauna" :info-message="''"></TitleWidget>
</template>

<style></style>
