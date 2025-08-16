<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useAdventureStore } from '@/stores/adventureStore'

import TitleWidget from '@/components/TitleWidget.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import CombatTable from './CombatTable.vue'
import { DEFAULT_COMBAT } from '@/bases'
import _ from 'lodash'
import PlanCombat from './PlanCombat.vue'
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
