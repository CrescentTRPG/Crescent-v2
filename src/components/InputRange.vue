<script lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref, useTemplateRef, watch } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import { BButton, BForm, BFormInput, BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import { onKeyPressed, onKeyStroke } from '@vueuse/core'
import IconDisplay from './IconDisplay.vue'
import { preProcessFile } from 'typescript'

export default {
  props: ['label', 'points'],
  emits: ['valueMap'],
  setup(props, context) {
    const designStore = useDesignStore()

    const minVal: Ref<undefined | number> = ref(0)
    const maxVal: Ref<undefined | number> = ref(props.points.length - 1)
    const excludedValueMap = ref({})
    function pointClicked(index) {
      if (excludedValueMap.value[index]) {
        delete excludedValueMap.value[index]
      } else {
        excludedValueMap.value[index] = true
      }
      context.emit('valueMap', excludedValueMap.value)
    }

    return {
      designStore,
      props,
      pointClicked,
      minVal,
      maxVal,
      excludedValueMap
    }
  },
  components: {
    BButton,
    IconDisplay
  }
}
</script>

<template>
  <div>
    <div style="display: flex">
      <div style="padding: 0.5rem">{{ props.label }}:</div>
      <BButton @click="pointClicked(point.index)" v-for="point in props.points" :key="point.index"
        ><IconDisplay
          :style="{ transform: point.transform }"
          :icon="point.icon"
          :color="!excludedValueMap[point.index] ? designStore.alertTheme : designStore.primaryText"
          :scale="1.5"
          fontSize="1.5rem"
        ></IconDisplay
      ></BButton>
    </div>
  </div>
</template>

<style scoped></style>
