<script lang="ts">
import { BFormRadio } from 'bootstrap-vue-next'
import { ref, watch } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'
export default {
  emits: ['type'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const number = ref(0)
    const selectedtype = ref({ name: 'Any', value: 0 })

    const types = ref([
      { name: 'Any', value: 0 },
      { name: 'Evocation', value: 1 },
      { name: 'Continuous', value: 2 },
      { name: 'Focus', value: 3 },

      { name: 'Charged', value: 4 },
      { name: 'Activated', value: 5 },
      { name: 'Passive', value: 6 }
    ])

    watch(selectedtype, (oldVal, newVal) => {
      context.emit('type', selectedtype.value)
    })

    return {
      designStore,
      tab,
      props,
      number,
      types,
      selectedtype
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
      <div style="margin-left: 1rem; min-width: 6rem">Filter By Type:</div>
      <BFormRadio
        style="margin: 0.25rem; cursor: pointer"
        v-model="selectedtype"
        v-for="o in types"
        :value="o"
        :key="o.name"
      >
        {{ o.name }}
      </BFormRadio>
    </div>
  </div>
</template>
<style scoped>
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
  grid-template-columns: repeat(8, 1fr);
  border-bottom: 2px solid;
}
@media (max-width: 1400px) {
  .action-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 650px) {
  .action-grid {
    max-width: 95vw;

    margin: 0.5rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
