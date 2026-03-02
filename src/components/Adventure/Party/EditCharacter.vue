<script lang="ts">
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { usePartyStore } from '@/stores/partyStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

export default {
  props: ['characterId'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const partyStore = usePartyStore()
    const userToAdd = ref('')

    return {
      designStore,
      modal,
      userStore,
      adventureStore,
      userToAdd,
      partyStore
    }
  },
  components: { BButton }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <BButton></BButton>
  </div>
</template>

<style></style>
