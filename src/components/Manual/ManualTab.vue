<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'

import ManualSidebar from './ManualSidebar.vue'
import ModifyManualTab from './ModifyManual/ModifyManualTab.vue'
import RulesReferenceTab from './Rules/RulesReferenceTab.vue'
import AbilitiesReferenceTab from './Rules/AbilitiesReferenceTab.vue'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const currentTab = ref('rules')
    return {
      designStore,
      modal,
      userStore,
      props,
      currentTab
    }
  },
  components: {
    ManualSidebar,
    ModifyManualTab,
    RulesReferenceTab,
    AbilitiesReferenceTab
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <div class="manualPage">
      <ManualSidebar
        :isCharacter="props.isCharacter"
        @tabChange="(tab) => (currentTab = tab)"
      ></ManualSidebar>
      <div class="manualPageContents">
        <div v-if="currentTab === 'rules'"><RulesReferenceTab></RulesReferenceTab></div>
        <div v-if="currentTab === 'abilities'">
          <AbilitiesReferenceTab :isCharacter="props.isCharacter"></AbilitiesReferenceTab>
        </div>
        <div v-if="currentTab === 'manual' && !props.isCharacter">
          <ModifyManualTab></ModifyManualTab>
        </div>
        <div v-if="currentTab === 'rolling' && !props.isCharacter">roll</div>
      </div>
    </div>
  </div>
</template>

<style>
.manualPage {
  display: flex;
}
.manualPageContents {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
@media (max-width: 800px) {
  .manualPage {
    display: flex;
    flex-direction: column;
  }
}
</style>
