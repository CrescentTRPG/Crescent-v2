<script lang="ts">
import FancyDecor from '@/components/FancyDecor.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { storeToRefs } from 'pinia'
import { lightenDarkenColor } from '@/Utility.ts'

export default {
  props: ['trait', 'editable', 'index'],
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualTraits } = storeToRefs(faunaStore)
    function remove() {
      context.emit('delete', props.trait)
    }
    return { manualTraits, designStore, props, remove, lightenDarkenColor }
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
      :icon="manualTraits[props.trait].icon"
      :text="manualTraits[props.trait].name"
      :justify-text="'space-around'"
      width="12rem"
    >
      <template v-slot:body
        ><div style="display: flex; justify-content: space-between">
          <div style="padding: 0.5rem; border-radius: 0.25rem">
            {{ manualTraits[props.trait].description }}
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
