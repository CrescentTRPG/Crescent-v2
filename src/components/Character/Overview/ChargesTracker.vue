<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import { BButtonGroup } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'

export default {
  props: ['charges', 'chargesSpent', 'updateChargesSpent'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()

    return {
      designStore,
      modal,
      props
    }
  },
  components: { BButtonGroup, BButton }
}
</script>

<template>
  <BButtonGroup
    aria-label="charges left"
    style="border: 2px solid"
    :style="{ borderColor: designStore.secondaryTheme }"
  >
    <BButton
      @click="updateChargesSpent(props.chargesSpent + 1)"
      class="hoverableTransparantLinear"
      style="border-right: 1px solid; padding-left: 0.5rem; padding-right: 0.5rem"
      :style="{ borderColor: designStore.secondaryTheme }"
    >
      <i class="bi bi-dash"></i>
    </BButton>

    <div style="padding-left: 0.5rem; padding-right: 0.5rem; align-self: center">
      {{ charges - chargesSpent }}
    </div>
    <BButton
      @click="updateChargesSpent(props.chargesSpent - 1)"
      class="hoverableTransparantLinear"
      style="border-left: 1px solid; padding-left: 0.5rem; padding-right: 0.5rem"
      :style="{ borderColor: designStore.secondaryTheme }"
      ><i class="bi bi-plus"></i>
    </BButton>
  </BButtonGroup>
</template>

<style scoped></style>
