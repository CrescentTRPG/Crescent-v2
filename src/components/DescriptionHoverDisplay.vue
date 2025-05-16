<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { useFaunaStore } from '@/stores/faunaStore'
import { BPopover } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { describe } from 'node:test'
import { storeToRefs } from 'pinia'

export default {
  props: ['name', 'description', 'notBordered', 'showDots'],
  setup(props) {
    const designStore = useDesignStore()

    return { designStore, props }
  },
  components: { BPopover, BButton }
}
</script>
<template>
  <div>
    <BPopover
      v-if="props.notBordered"
      :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
      class="popover"
      :click="true"
      :close-on-hide="true"
      :delay="{ show: 0, hide: 0 }"
      style="width: 20rem"
    >
      <template #target>
        <BButton
          class="fontSmall"
          style="margin: 0.25rem; margin-top: 0; display: flex; justify-content: flex-start"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <i style="margin-left: -0.25rem" v-if="showDots" class="bi bi-grip-vertical"></i>
          <div>{{ props.name }}</div></BButton
        >
      </template>
      <div
        style="padding: 0.5rem; border-radius: 0.25rem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        {{ props.description }}
      </div>
    </BPopover>

    <BPopover
      v-else
      :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
      class="popover"
      :click="true"
      :close-on-hide="true"
      :delay="{ show: 0, hide: 0 }"
      style="width: 20rem"
    >
      <template #target>
        <BButton
          class="fontSmall"
          style="
            margin: 0.25rem;
            border: 2px solid;
            margin-top: 0;
            display: flex;
            justify-content: flex-start;
          "
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <i style="margin-left: -0.25rem" v-if="showDots" class="bi bi-grip-vertical"></i>
          <div>{{ props.name }}</div>
        </BButton>
      </template>
      <div
        style="padding: 0.5rem; border-radius: 0.25rem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        {{ props.description }}
      </div>
    </BPopover>
  </div>
</template>
<style scoped>
@media (max-width: 650px) {
  .fontSmall {
    font-size: small;
  }
}
</style>
