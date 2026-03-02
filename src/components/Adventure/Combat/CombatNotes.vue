<script lang="ts">
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import RichTextEntry from '@/components/RichTextEntry.vue'

export default {
  props: ['updateTemp', 'combat'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()

    function updateNotes(form) {
      let newTemp = { ...props.combat }
      newTemp.notes = form
      props.updateTemp(newTemp)
    }
    return {
      designStore,
      modal,
      adventureStore,
      props,
      updateNotes
    }
  },
  components: { RichTextEntry }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }" style="min-height: 40vh">
    <RichTextEntry :formVal="props.combat.notes || ''" :sendUpdates="updateNotes"></RichTextEntry>
  </div>
</template>

<style></style>
