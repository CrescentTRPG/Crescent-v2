<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BFormSelect, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const actionCosts = [
      { value: 'Select Action Cost', text: 'Select Action Cost', disabled: true },
      { value: 'Core Action', text: 'Core Action' },
      { value: 'Swift Action', text: 'Swift Action' },
      { value: 'Movement Action', text: 'Movement Action' },
      { value: 'Reaction', text: 'Reaction' },
      { value: 'Passive', text: 'Passive' },
      { value: 'Core / Swift Action', text: 'Core / Swift Action' },
      { value: 'Core / Movement Action', text: 'Core / Movement Action' },
      { value: 'Core / Reaction', text: 'Core / Reaction' },
      { value: 'Core / Passive', text: 'Core / Passive' },
      { value: 'Swift / Movement Action', text: 'Swift / Movement Action' },
      { value: 'Swift / Reaction', text: 'Swift / Reaction' },
      { value: 'Swift / Passive', text: 'Swift / Passive' },
      { value: 'Movement / Reaction', text: 'Movement / Reaction' },
      { value: 'Movement / Passive', text: 'Movement / Passive' }
    ]
    const chosen = ref('Select Action Cost')
    return { designStore, actionCosts, chosen }
  },
  components: { BFormSelect },
  methods: {
    select(val) {
      this.$emit('selection', val)
    }
  }
}
</script>

<template>
  <BFormSelect
    v-model="chosen"
    :options="actionCosts"
    :style="{
      background: designStore.sidebarBacking,
      color: designStore.sidebarText,
      '--bs-secondary-color': designStore.sidebarText
    }"
    placeholder="action cost"
    style="border: none; border-radius: 0; height: max-content; overflow: ellipsis"
    @change="select(chosen)"
  ></BFormSelect>
</template>

<style></style>
