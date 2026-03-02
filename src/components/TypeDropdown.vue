<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BFormSelect, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import DropdownSelect from './DropdownSelect.vue'

export default {
  props: ['modelValue'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const types = [
      { value: 'Evocation', text: 'Evocation' },
      { value: 'Continuous', text: 'Continuous' },
      { value: 'Focus', text: 'Focus' }
    ]
    const chosen = ref(props.modelValue || 'Select Type')
    return { designStore, types, chosen }
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
    :options="types"
    :default="chosen"
    @selection="(val) => select(val)"
    :override-down="true"
    :write-in="true"
  >
  </DropdownSelect>
</template>

<style></style>
