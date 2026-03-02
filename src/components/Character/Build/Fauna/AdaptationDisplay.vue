<script lang="ts">
import FancyDecor from '@/components/FancyDecor.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { storeToRefs } from 'pinia'
import { lightenDarkenColor } from '@/Utility.ts'

export default {
  props: ['adaptation', 'editable', 'index'],
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualAdaptations } = storeToRefs(faunaStore)
    function remove() {
      context.emit('delete', props.adaptation)
    }
    return { manualAdaptations, designStore, props, remove, lightenDarkenColor }
  },
  components: { FancyDecor }
}
</script>
<template>
  <div>
    <FancyDecor
      :background="
        props.index % 2 === 0
          ? designStore.inputBacking
          : lightenDarkenColor(designStore.inputBacking, -10)
      "
      style="border: 1px solid"
      :style="{ borderColor: designStore.secondaryTheme }"
      :color="designStore.inputText"
      :icon="manualAdaptations[props.adaptation].icon"
      :text="manualAdaptations[props.adaptation].name"
      :justify-text="'space-around'"
      width="12rem"
    >
      <template v-slot:body
        ><div style="display: flex; justify-content: space-between">
          <div style="padding: 0.5rem; border-radius: 0.25rem">
            {{ manualAdaptations[props.adaptation].description }}
          </div>
        </div></template
      ></FancyDecor
    >
  </div>
</template>
<style scoped>
@media (max-width: 650px) {
  .fontSmall {
    font-size: small;
  }
}
</style>
