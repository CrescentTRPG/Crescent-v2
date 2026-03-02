<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { ref } from 'vue'

export default {
  props: [
    'value',
    'label',
    'modalTitle',
    'isDual',
    'value2',
    'icon',
    'icon2',
    'iconShift',
    'addFlair',
    'lilLabel'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)
    return {
      props,
      designStore,
      modal
    }
  },
  components: { CustomModal }
}
</script>
<template>
  <div @click="modal = true" style="cursor: pointer">
    <CustomModal :title="props.modalTitle" :show-modal="modal" @close="modal = false">
      <template v-slot:body>
        <section><slot name="body"> This is the default body! </slot></section>
      </template>
    </CustomModal>
    <div v-if="props.addFlair" style="position: absolute">
      <v-icon
        name="gi-angel-outfit"
        scale="6"
        style="transform: scale(1, 1.5); margin-top: 2rem; margin-left: -0.15rem"
        :style="{ color: designStore.secondaryTheme }"
      ></v-icon>
    </div>
    <div v-if="!props.isDual">
      <div
        style="position: absolute; font-size: 7rem; z-index: 2; transform: scale(1.2, 1)"
        :style="{ color: designStore.primaryTheme }"
      >
        <div
          style="
            font-size: xx-large;
            position: absolute;
            width: 7rem;
            z-index: 3;
            text-align: center;
            padding-top: 2rem;
          "
          :style="{ color: designStore.primaryText }"
        >
          {{ props.value }}
        </div>
        <div
          style="
            font-size: x-large;
            position: absolute;
            width: 7rem;
            z-index: 3;
            text-align: center;
            margin-top: 4.5rem;
          "
          :style="{ color: designStore.primaryText }"
        >
          {{ props.label }}
        </div>
        <div
          style="
            font-size: medium;
            position: absolute;
            width: 7rem;
            z-index: 3;
            text-align: center;
            margin-top: 5.75rem;
          "
          :style="{ color: designStore.primaryText }"
        >
          {{ props.lilLabel }}
        </div>
        <i :class="props.icon"></i>
      </div>
    </div>
    <div v-if="props.isDual">
      <div
        style="position: absolute; z-index: 2; transform: scale(1.2, 1)"
        :style="{ color: designStore.primaryTheme }"
      >
        <div style="display: flex">
          <v-icon
            :name="icon"
            scale="5"
            style="position: relative"
            :style="{ right: props.iconShift }"
          ></v-icon>
          <div
            style="
              z-index: 4;
              font-size: small;
              border: 1px solid;
              padding: 0.6rem;
              border-radius: 1rem;
              width: fit-content;
              height: fit-content;
              margin-top: 1.55rem;
              margin-left: -4.2rem;
            "
            :style="{
              color: designStore.primaryText,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{ value }}
          </div>
        </div>
        <div style="display: flex; margin-left: 1rem; margin-top: -2.75rem">
          <v-icon :name="icon2" scale="5"></v-icon>
          <div
            style="
              font-size: small;
              border: 1px solid;
              padding: 0.65rem;
              border-radius: 1rem;
              width: fit-content;
              height: fit-content;
              margin-top: 1.5rem;
              margin-left: -4.2rem;
            "
            :style="{
              color: designStore.primaryText,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{ value2 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style></style>
