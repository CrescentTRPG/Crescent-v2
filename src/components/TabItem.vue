<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { BButton } from 'bootstrap-vue-next'
import { ref } from 'vue'

export default {
  emits: ['true', 'false'],
  props: ['tabName'],
  setup(props: any) {
    const designStore = useDesignStore()
    const selected = ref(false)
    return {
      designStore,
      selected,
      props
    }
  },
  methods: {
    buttonBg() {
      if (this.selected) {
        return this.designStore.alertTheme
      }
      return this.designStore.primaryTheme
    },
    buttonText() {
      if (this.selected) {
        return this.designStore.inputBacking
      }
      return this.designStore.primaryText
    },
    click() {
      this.selected = !this.selected
      if (this.selected) {
        this.$emit('true')
      } else {
        this.$emit('false')
      }
    }
  },
  components: { BButton }
}
</script>
<template>
  <BButton
    @click="click"
    :style="{
      background: buttonBg(),
      color: buttonText(),
      borderColor: designStore.secondaryTheme
    }"
    >{{ props.tabName }}</BButton
  >
</template>
<style>
.popover {
  --bs-popover-max-width: 1000rem;
}
</style>
