<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'

import TitleWidget from '@/components/TitleWidget.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'

export default {
  props: ['title', 'value'],
  emits: ['update'],
  setup(props, context) {
    const designStore = useDesignStore()
    const fieldValue = ref(props.value || '')
    const characterStore = useCharacterStore()
    function change() {
      context.emit('update', fieldValue.value)
    }
    return {
      designStore,
      change,
      characterStore,
      fieldValue,
      props
    }
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
    }
  },
  components: { TitleMedallion, BFormInput }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; justify-content: flex-end"
    :style="{ background: designStore.inputBacking }"
  >
    <div style="display: flex; flex-direction: column; min-height: 4.5rem; flex-grow: 1">
      <div style="flex-grow: 1"></div>
      <TitleMedallion :title="props.title" :color="designStore.inputText"></TitleMedallion>
      <div style="flex-grow: 1"></div>
    </div>
    <BFormInput
      class="detailInputStyles inputColorBackdrop"
      @change="change()"
      v-model="fieldValue"
      debounce="100"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    ></BFormInput>
  </div>
</template>

<style scoped>
.detailInputStyles {
  border: none;
  border-bottom: 2px solid;
  border-radius: 0;
  height: 4rem;
  font-size: large;
  text-align: center;
}
@media (max-width: 1700px) {
  .detailInputStyles {
    border: none;
    border-bottom: 2px solid;
    border-radius: 0;
    height: 3rem;
    font-size: medium;
    text-align: center;
  }
}
</style>
