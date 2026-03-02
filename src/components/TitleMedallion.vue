<script lang="ts">
import { styleText } from 'util'
import { useDesignStore } from '../stores/designStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'

export default {
  props: ['title', 'color', 'inline', 'button', 'buttonIcon', 'buttonFunction'],
  setup(props, context) {
    const designStore = useDesignStore()
    return {
      designStore,
      props
    }
  },
  components: {
    BButton
  }
}
</script>

<template>
  <div
    style="display: flex; justify-content: center"
    :style="{
      color: designStore.inputText,
      borderColor: designStore.secondaryTheme
    }"
  >
    <v-icon
      name="gi-abstract-119"
      style="position: relative; left: 0.25rem; align-self: center"
      :style="{ color: designStore.secondaryTheme }"
    ></v-icon>

    <hr
      :style="{ borderColor: designStore.secondaryTheme }"
      style="align-self: center; position: relative; top: 0rem"
    />

    <v-icon
      name="gi-moon"
      :style="{ color: designStore.secondaryTheme }"
      style="align-self: center; rotate: 180deg; position: relative; left: 0.2rem"
    ></v-icon>
    <div>
      <div
        style="font-size: large; text-align: center; margin: 0.25rem"
        :style="{
          fontFamily: designStore.titleFont,
          color: props.color || designStore.sidebarText
        }"
      >
        {{ props.title }}
      </div>
      <div style="display: flex; margin: 0.25rem">
        <slot name="dropdown"></slot>
        <BButton
          @click="props.buttonFunction()"
          class="hoverableTransparantLinear"
          v-if="props.button"
          style="
            height: 2.15rem;
            margin: 0.25rem;
            margin-top: 0.1rem;
            padding: 0.25rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
          "
          ><i :class="props.buttonIcon"></i
        ></BButton>
      </div>
    </div>
    <v-icon
      name="gi-moon"
      :style="{ color: designStore.secondaryTheme }"
      style="align-self: center; position: relative; right: 0.2rem"
    ></v-icon>
    <hr
      :style="{ borderColor: designStore.secondaryTheme }"
      style="align-self: center; position: relative; top: 0rem"
    />
    <v-icon
      name="gi-abstract-119"
      style="position: relative; right: 0.25rem; align-self: center"
      :style="{ color: designStore.secondaryTheme }"
    ></v-icon>
  </div>
</template>

<style scoped></style>
