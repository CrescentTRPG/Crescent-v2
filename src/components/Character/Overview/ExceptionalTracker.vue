<script lang="ts">
import IconDisplay from '@/components/IconDisplay.vue'
import { useDesignStore } from '@/stores/designStore.ts'

export default {
  props: ['used', 'flipExceptional'],
  setup(props, context) {
    function deleteStatusModifier() {
      context.emit('delete')
    }
    const designStore = useDesignStore()
    return {
      props,
      designStore
    }
  },
  components: {
    IconDisplay
  }
}
</script>
<template>
  <div
    @click="props.flipExceptional()"
    style="cursor: pointer; width: 3.5rem; height: 3.5rem; position: relative"
  >
    <IconDisplay
      v-if="!props.used"
      style="position: absolute; margin-left: 1.35rem; margin-top: 1rem"
      :color="designStore.alertTheme"
      :icon="'gi-plain-circle'"
      :scale="0.75"
    ></IconDisplay>
    <IconDisplay
      v-if="!props.used"
      style="position: absolute; margin-left: 0.62rem; margin-top: 0.55rem"
      :color="designStore.alertTheme"
      :icon="'gi-star-shuriken'"
      :scale="2"
    ></IconDisplay>
    <IconDisplay
      :color="designStore.secondaryTheme"
      :icon="'gi-polar-star'"
      :scale="3"
    ></IconDisplay>
  </div>
</template>
<style></style>
