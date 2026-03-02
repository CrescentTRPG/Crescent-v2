<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'

export default {
  props: ['emblem', 'marginTop', 'value', 'color'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      props
    }
  },
  components: {}
}
</script>
<template>
  <div>
    <div style="z-index: 5" :style="{ color: props.color }">
      <v-icon
        :name="props.emblem"
        scale="4"
        style="position: absolute; z-index: 4"
        :style="{ marginTop: props.marginTop }"
      ></v-icon>
      <div
        v-if="props.emblem === 'gi-visored-helm'"
        :style="{ background: designStore.primaryTheme }"
        style="
          width: 2.6rem;
          height: 2.5rem;
          margin-left: 1.2rem;
          margin-top: -0.25rem;
          border-radius: 20px;
          position: absolute;
          z-index: 3;
        "
      ></div>
      <div
        v-if="props.emblem === 'gi-vibrating-shield'"
        :style="{ background: designStore.primaryTheme }"
        style="
          width: 1rem;
          height: 1rem;
          margin-left: 2.45rem;
          position: absolute;
          z-index: 3;
          border-radius: 5px;
        "
      ></div>
      <div style="width: 4.9rem; justify-content: center; display: flex">
        <div
          style="
            z-index: 5;
            width: fit-content;
            padding-top: 0.25rem;
            padding-left: 0.25rem;
            padding-right: 0.25rem;
            border-radius: 5px;
            font-size: large;
            border: 3px solid;
          "
          :style="{
            color: designStore.primaryText,
            background: designStore.primaryTheme,
            borderColor: props.color
          }"
        >
          {{ props.value }}
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
