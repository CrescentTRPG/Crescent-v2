<script lang="ts">
export default {
  props: ['size', 'icon', 'color', 'scale'],
  setup(props, context) {
    return {
      props
    }
  },
  components: {}
}
</script>

<template>
  <div>
    <v-icon
      v-if="props.icon?.substring(0, 2) === 'gi'"
      :name="props.icon"
      :scale="props.scale"
      :style="{ color: props.color }"
    ></v-icon>
    <i
      v-if="props.icon?.substring(0, 2) === 'bi'"
      style="padding-left: 0.2rem; padding-right: 0.2rem"
      :style="{ fontSize: props.size, color: props.color }"
      :class="props.icon"
    ></i>
  </div>
</template>

<style></style>
