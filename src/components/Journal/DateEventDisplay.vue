<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { BPopover } from 'bootstrap-vue-next'

import IconDisplay from '../IconDisplay.vue'

export default {
  props: ['icon', 'name', 'orientation'],
  setup(props: any) {
    const designStore = useDesignStore()
    return {
      designStore,
      props
    }
  },
  components: { BPopover, IconDisplay }
}
</script>
<template>
  <div style="width: fit-content">
    <BPopover
      :style="{
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        fontFamily: designStore.titleFont
      }"
      class="popover"
      :placement="orientation"
    >
      <template #target>
        <IconDisplay
          style="z-index: 5; cursor: pointer"
          :scale="1.5"
          :size="1.5"
          :icon="props.icon"
        ></IconDisplay>
      </template>
      <div>{{ props.name }}</div>
    </BPopover>
  </div>
</template>
<style scoped>
.popover {
  --bs-popover-max-width: 20rem;
}
</style>
