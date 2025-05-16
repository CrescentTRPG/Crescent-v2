<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { useFaunaStore } from '@/stores/faunaStore'
import { BPopover } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { describe } from 'node:test'
import { storeToRefs } from 'pinia'

export default {
  props: ['trait', 'editable'],
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualTraits } = storeToRefs(faunaStore)
    function remove() {
      context.emit('delete', props.trait)
    }
    return { manualTraits, designStore, props, remove }
  },
  components: { BPopover, BButton }
}
</script>
<template>
  <div>
    <div
      v-if="props.editable"
      style="margin: 0.25rem; border: 2px solid; padding: 0.5rem; border-radius: 0.375rem"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <i class="bi bi-x-lg" style="padding-right: 0.25rem" @click="remove()"></i>

      <BPopover
        :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
        class="popover"
        :click="true"
        :close-on-hide="true"
        :delay="{ show: 0, hide: 0 }"
        style="width: 20rem"
      >
        <template #target>
          <BButton class="fontSmall" style="padding: 0; margin: 0">{{ props.trait }}</BButton>
        </template>
        <div
          style="padding: 0.5rem; border-radius: 0.25rem"
          :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >
          {{ manualTraits[props.trait].description }}
        </div>
      </BPopover>
    </div>
    <BPopover
      v-else
      :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
      class="popover"
      :click="true"
      :close-on-hide="true"
      :delay="{ show: 0, hide: 0 }"
      style="width: 20rem"
    >
      <template #target>
        <BButton
          class="fontSmall"
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
<style scoped>
@media (max-width: 650px) {
  .fontSmall {
    font-size: small;
  }
}
</style>
