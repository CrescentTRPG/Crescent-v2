<script lang="ts">
import { ref, watch } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import DropdownSelect from './DropdownSelect.vue'

export default {
  props: ['modelValue'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const areas = [
      { value: 'Self', text: 'Self' },
      { value: 'Single Target', text: 'Single Target' },
      { value: '2 + 1/F Targets', text: '2 + 1/F Targets' },
      { value: '4 + 2/F Targets', text: '4 + 2/F Targets' },
      { value: '6 + 2/F Targets', text: '6 + 2/F Targets' },
      { value: "5' Radius", text: "5' Radius" },
      { value: "10' + 5'/F Radius", text: "10' + 5'/F Radius" },
      { value: "20' + 10'/F Radius", text: "20' + 10'/F Radius" },
      { value: "30' + 10'/F Radius", text: "30' + 10'/F Radius" },
      { value: "40' + 10'/F Radius", text: "40' + 10'/F Radius" },
      { value: "20' + 10'/F Line", text: "20' + 10'/F Line" },
      { value: "40' + 10'/F Line", text: "20' + 10'/F Line" },
      { value: "60' + 10'/F Line", text: "20' + 10'/F Line" },
      { value: "10' X 10' Cone", text: "10' X 10' Cone" },
      { value: "10' X 20' Cone", text: "10' X 20' Cone" },
      { value: "10' X 40' Cone", text: "10' X 40' Cone" }
    ]
    const chosen = ref(props.modelValue || 'Select Area')
    watch(props, (last, now) => {
      if (props.modelValue != chosen.value) {
        chosen.value = props.modelValue
      }
    })
    return { designStore, areas, chosen }
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
    :options="areas"
    :default="chosen"
    @selection="(val) => select(val)"
    :override-down="true"
    :write-in="true"
  >
  </DropdownSelect>
</template>

<style></style>
