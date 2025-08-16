<script lang="ts">
import { useDesignStore } from '../stores/designStore'

export default {
  props: ['title', 'color', 'inline'],
  setup(props, context) {
    const designStore = useDesignStore()
    return {
      designStore,
      props
    }
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
      <slot name="dropdown"></slot>
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
