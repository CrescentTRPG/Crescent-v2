<script lang="ts">
import { ref, watch } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import DropdownSelect from './DropdownSelect.vue'

export default {
  props: ['modelValue'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const durations = [
      { value: 'Instantaneous', text: 'Instantaneous' },
      { value: '1 Round', text: '1 Round' },
      { value: '1 + 1/F Round(s)', text: '1 + 1/F Round(s)' },
      { value: '2 Rounds', text: '2 Rounds' },
      { value: '2 + 1/F Rounds', text: '2 + 1/F Rounds' },
      { value: '4 + 2/F Rounds', text: '4 + 2/F Rounds' },
      { value: '1 Minute', text: '1 Minute' },
      { value: '1 + 1/F Minute(s)', text: '1 + 1/F Minute(s)' },
      { value: '1 Hour', text: '1 Hour' },
      { value: '1 + 1/F Hour(s)', text: '1 + 1/F Hour(s)' },
      { value: '1 Day', text: '1 Day' },
      { value: '1 + 1/F Day(s)', text: '1 + 1/F Day(s)' },
      { value: 'Permanent', text: 'Permanent' }
    ]
    const chosen = ref(props.modelValue || 'Select Duration')
    watch(props, (last, now) => {
      if (props.modelValue != chosen.value) {
        chosen.value = props.modelValue
      }
    })
    return { designStore, durations, chosen }
  },
  components: { DropdownSelect },
  methods: {
    select(val) {
      this.chosen = val
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
    :options="durations"
    :default="chosen"
    @selection="(val) => select(val)"
    :override-down="true"
    :write-in="true"
  >
  </DropdownSelect>
</template>

<style></style>
