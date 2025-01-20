<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { useFaunaStore } from '@/stores/faunaStore'
import { BPopover } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { describe } from 'node:test'
import { storeToRefs } from 'pinia'

export default {
  props: ['trait'],
  setup(props) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualTraits } = storeToRefs(faunaStore)
    return { manualTraits, designStore, props }
  },
  components: { BPopover, BButton }
}
</script>
<template>
  <div>
    <BPopover
      :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
      class="popover"
      :click="true"
      :close-on-hide="true"
      :delay="{ show: 0, hide: 0 }"
      style="width: 20rem"
    >
      <template #target>
        <BButton
          style="margin: 0.25rem; border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          >{{ props.trait }}</BButton
        >
      </template>
      <div
        style="padding: 0.5rem; border-radius: 0.25rem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        {{ manualTraits[props.trait].description }}
      </div>
    </BPopover>
  </div>
</template>
<script></script>
