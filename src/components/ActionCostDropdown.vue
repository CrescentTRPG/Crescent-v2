<script lang="ts">
import { ref, watch } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import DropdownSelect from './DropdownSelect.vue'

export default {
  props: ['modelValue'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const actionCosts = [
      { value: 'Core Action', text: 'Core Action' },
      { value: 'Swift Action', text: 'Swift Action' },
      { value: 'Movement Action', text: 'Movement Action' },
      { value: 'Reaction', text: 'Reaction' },
      { value: 'Passive', text: 'Passive' },
      { value: 'Free Action', text: 'Free Action' },
      { value: 'Core / Swift Action', text: 'Core / Swift Action' },
      { value: 'Core / Movement Action', text: 'Core / Movement Action' },
      { value: 'Core / Reaction', text: 'Core / Reaction' },
      { value: 'Core / Passive', text: 'Core / Passive' },
      { value: 'Swift / Movement Action', text: 'Swift / Movement Action' },
      { value: 'Swift / Reaction', text: 'Swift / Reaction' },
      { value: 'Swift / Passive', text: 'Swift / Passive' },
      { value: 'Movement / Reaction', text: 'Movement / Reaction' },
      { value: 'Movement / Passive', text: 'Movement / Passive' },
      { value: 'Reaction / Passive', text: 'Reaction / Passive' }
    ]

    const chosen = ref(props.modelValue || 'Select Action Cost')
    watch(props, (last, now) => {
      if (props.modelValue != chosen.value) {
        chosen.value = props.modelValue
      }
    })
    return { designStore, actionCosts, chosen }
  },
  components: { DropdownSelect },
  methods: {
    select(val) {
      this.$emit('update:modelValue', val)
      this.$emit('change')
    }
  }
}
</script>

<template>
  <DropdownSelect
    style="flex-grow: 1; align-self: center"
    :background="designStore.sidebarBacking"
    :color="designStore.sidebarText"
    :borderless="true"
    :options="actionCosts"
    :default="chosen"
    @selection="(val) => select(val)"
    :override-down="true"
  >
  </DropdownSelect>
</template>

<style></style>
