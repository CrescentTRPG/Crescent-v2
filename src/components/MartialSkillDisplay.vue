<script lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore'

export default {
  props: ['title', 'description', 'mpCost'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    return { designStore, tab, props }
  },

  methods: {},
  components: {}
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        position: absolute;
        z-index: 1;
        width: 100%;
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-abstract-076" scale="2" style="position: relative; right: 0.7rem"></v-icon>
      <v-icon
        name="gi-abstract-076"
        scale="2"
        style="position: relative; left: 0.7rem; text-align: right"
      ></v-icon>
    </div>
    <div
      style="
        padding: 0.5rem;
        border: 2px solid;
        border-left: 4px solid;
        border-right: 4px solid;
        border-top: 0px solid;
        z-index: 2;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        fontFamily: designStore.titleFont,
        borderColor: designStore.secondaryTheme
      }"
    >
      {{ props.title }} - {{ props.mpCost }}
    </div>

    <div
      style="
        padding: 0.5rem;
        border-right: 2px solid;
        border-left: 2px solid;
        border-bottom: 2px solid;
        padding-bottom: 1.5rem;
        z-index: 2;
        font-size: small;
      "
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme
      }"
    >
      {{ props.description }}
    </div>
  </div>
</template>

<style></style>
