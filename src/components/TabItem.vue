<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { BButton } from 'bootstrap-vue-next'
import { ref } from 'vue'

export default {
  emits: ['true', 'false'],
  props: ['tabName', 'chosen', 'useSingleSelect'],
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
      if (this.props.useSingleSelect ? this.props.chosen : this.selected) {
        return this.designStore.alertTheme
      }
      return this.designStore.primaryTheme
    },
    buttonText() {
      if (this.props.useSingleSelect ? this.props.chosen : this.selected) {
        return this.designStore.primaryTheme
      }
      return this.designStore.primaryText
    },
    click() {
      if (this.props.useSingleSelect) {
        this.$emit('true')
      } else {
        this.selected = !this.selected
        if (this.selected) {
          this.$emit('true')
        } else {
          this.$emit('false')
        }
      }
    }
  },
  components: { BButton }
}
</script>
<template>
  <BButton
    @click="click"
    style="border-radius: 0px; border: 2px solid"
    :style="{
      background: buttonBg(),
      borderColor: designStore.sidebarBacking,
      color: buttonText()
    }"
    >{{ props.tabName }}</BButton
  >
</template>
<style>
.popover {
  --bs-popover-max-width: 1000rem;
}
</style>
