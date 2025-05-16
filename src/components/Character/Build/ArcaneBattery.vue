<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useDesignStore } from '@/stores/designStore'
import { useSpellStore } from '@/stores/spellsStore'
import { BFormInput } from 'bootstrap-vue-next'

import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export default {
  props: ['name', 'description'],
  setup(props) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const spellsStore = useSpellStore()
    const battery = ref(spellsStore.arcaneBattery)
    return { designStore, props, battery, spellsStore, modal }
  },
  components: { BFormInput, CustomModal }
}
</script>
<template>
  <div>
    <div
      style="
        display: flex;
        width: fit-content;
        padding: 0.5rem;
        margin-bottom: -1rem;
        border-top-right-radius: 0.275rem;
        border: 2px solid;
        border-left: 0;
        border-bottom: 0;
        cursor: pointer;
      "
      @click="modal = true"
      :style="{ background: designStore.inputBacking, borderColor: designStore.secondaryTheme }"
    >
      <div
        :style="{ font: designStore.titleFont, color: designStore.inputText }"
        style="font-size: large; align-self: center"
      >
        Arcane Battery
      </div>
      <div style="display: flex">
        <div style="position: absolute; padding-left: 0.9rem; margin-top: 1rem">
          <div style="display: flex">
            <div v-for="i in parseInt(battery + '') || 0" :key="i">
              <v-icon
                name="gi-plain-square"
                :style="{ color: designStore.alertTheme }"
                style="transform: scale(0.45, 2.65); margin-left: -0.35rem; margin-right: -0.35rem"
              ></v-icon>
            </div>
          </div>
        </div>
        <v-icon
          name="gi-battery-0"
          scale="6.1"
          style="transform: rotate(90deg) scale(0.75, 1); margin-top: -1.8rem; margin-bottom: -2rem"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Set Arcane Battery" @close="modal = !modal">
      <template v-slot:body>
        <BFormInput
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          :max="10"
          :min="0"
          v-model="battery"
          type="number"
          @change="spellsStore.setArcaneBattery(battery)"
        ></BFormInput>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped>
@media (max-width: 650px) {
  .fontSmall {
    font-size: small;
  }
}
</style>
