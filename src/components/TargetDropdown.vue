<script lang="ts">
import { ref, watch } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import DropdownSelect from './DropdownSelect.vue'

export default {
  props: ['modelValue'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const targets = [
      { value: 'Caster', text: 'Caster' },
      { value: 'Touch', text: 'Touch' },
      { value: "LOS 10'", text: "LOS 10'" },
      { value: "LOS 10' + 10'/F", text: "LOS 10' + 10'/F" },
      { value: "LOS 20'", text: "LOS 20'" },
      { value: "LOS 20' + 20'/F", text: "LOS 20' + 20'/F" },
      { value: "LOS 40'", text: "LOS 40'" },
      { value: "LOS 40' + 20'/F", text: "LOS 40' + 20'/F" },
      { value: "LOS 60'", text: "LOS 60'" },
      { value: "LOS 60' + 20'/F", text: "LOS 60' + 20'/F" },
      { value: "LOS 80'", text: "LOS 80'" },
      { value: "LOS 80' + 40'/F", text: "LOS 80' + 40'/F" },
      { value: "LOS 100'", text: "LOS 100'" },
      { value: "LOS 100' + 40'/F", text: "LOS 100' + 40'/F" }
    ]
    const chosen = ref(props.modelValue || 'Select Target')
    watch(props, (last, now) => {
      if (props.modelValue != chosen.value) {
        chosen.value = props.modelValue
      }
    })
    return { designStore, targets, chosen }
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
    :options="targets"
    :default="chosen"
    @selection="(val) => select(val)"
    :override-down="true"
    :write-in="true"
  >
  </DropdownSelect>
</template>

<style></style>
