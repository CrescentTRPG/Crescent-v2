<script lang="ts">
import { useDesignStore } from '../../../stores/designStore'

import { BPopover } from 'bootstrap-vue-next'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    return {
      designStore
    }
  },
  components: {
    BPopover
  }
}
</script>

<template>
  <div>
    <BPopover
      :style="{
        background: designStore.primaryTheme,
        borderColor: designStore.secondaryTheme
      }"
      class="popover"
      :click="true"
      :close-on-hide="true"
      :delay="{ show: 0, hide: 0 }"
      style="width: fit-content !important; min-width: 20rem; position: absolute"
    >
      <template #target>
        <i
          class="bi bi-patch-question"
          :style="{ color: designStore.alertTheme }"
          style="font-size: 2rem; width: 2rem; cursor: pointer; margin-top: -0.5rem"
        ></i>
      </template>
      <div
        style="padding: 0.5rem; border-radius: 0.25rem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        Status Modifiers are temporary effects, often times tied to a status effect. Generic Status
        Effects such as suffering, pinned, etc., automatically apply modifiers. For Custom Statuses,
        users can set those modifiers up and tie them to their respective custom status. This
        ensures that when the status is removed the modifier is removed as well.
      </div>
    </BPopover>
  </div>
</template>
