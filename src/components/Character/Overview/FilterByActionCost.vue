<script lang="ts">
import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import { BFormInput, BFormRadio, BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import IconPicker from '@/components/IconPicker.vue'
export default {
  emits: ['actionCost'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const number = ref(0)
    const selectedActionCost = ref({ name: 'Any', value: 0 })

    const actionCosts = ref([
      { name: 'Any', value: 0 },
      { name: 'Core', value: 1 },
      { name: 'Move', value: 2 },
      { name: 'Swift', value: 3 },
      { name: 'Reaction', value: 4 }
    ])

    watch(selectedActionCost, (oldVal, newVal) => {
      context.emit('actionCost', selectedActionCost.value)
    })

    return {
      designStore,
      tab,
      props,
      number,
      actionCosts,
      selectedActionCost
    }
  },
  components: { BFormRadio }
}
</script>
<template>
  <div>
    <div
      class="action-grid"
      :style="{
        color: designStore.inputText,
        background: designStore.inputBacking,
        '--bs-form-check-bg': designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        '--input-bg': designStore.alertTheme
      }"
    >
      <div style="margin-left: 1rem; min-width: 9.5rem">Filter By Action Cost:</div>
      <BFormRadio
        style="margin: 0.25rem; cursor: pointer"
        v-model="selectedActionCost"
        v-for="o in actionCosts"
        :value="o"
        :key="o.name"
      >
        {{ o.name }}
      </BFormRadio>
    </div>
  </div>
</template>
<style>
.form-check-input {
  --bs-form-check-bg: inherit;
  color: inherit;
  border-color: inherit;
}
.form-check {
  --bs-form-check-bg: inherit;
  color: inherit;
  background-color: inherit;
  border-color: inherit;
}
.form-check-input:checked {
  --bs-form-check-bg: inherit;
  color: inherit;
  --input-bg: inherit;
  background-color: var(--input-bg);
  border-color: inherit;
  background-image: none;
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  border-bottom: 2px solid;
}
@media (max-width: 1024px) {
  .action-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 650px) {
  .action-grid {
    font-size: small;
    margin: 0.25rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
