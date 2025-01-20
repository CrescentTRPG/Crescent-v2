<script lang="ts">
export default {
  props: ['icon'],
  setup(props) {
    return { props }
  }
}
</script>
<template>
  <div style="display: flex">
    <v-icon name="wi-moon-waning-crescent-5" scale="1.5"></v-icon>
    <v-icon
      name="wi-moon-waning-crescent-4"
      scale="1.5"
      style="position: relative; right: 1.25rem"
    ></v-icon>

    <v-icon :name="props.icon" scale="1.5" style="position: relative; right: 1rem"></v-icon>
    <v-icon
      name="wi-moon-waxing-crescent-1"
      scale="1.5"
      style="position: relative; right: 1rem"
    ></v-icon>
    <v-icon
      name="wi-moon-waxing-crescent-2"
      scale="1.5"
      style="position: relative; right: 2.25rem"
    ></v-icon>
  </div>
</template>
<style></style>
