<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useUserStore } from '@/stores/userStore'
import { useAdventureStore } from '@/stores/adventureStore'
import { usePartyStore } from '@/stores/partyStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import CustomModal from '@/components/CustomModal.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import CharacterComputedShell from '../CharacterComputedShell.vue'
import TitleWidget from '@/components/TitleWidget.vue'

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
