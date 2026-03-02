<script lang="ts">
export default {
  props: ['icons', 'color', 'scale', 'size', 'direction', 'justify'],
  setup(props, context) {
    return {
      props
    }
  },
  components: {}
}
</script>

<template>
  <div :style="{ color: props.color }">
    <div
      style="display: flex"
      :style="{ justifyContent: props.justify, flexDirection: props.direction }"
    >
      <div v-for="icon in props.icons" :key="icon">
        <v-icon
          v-if="icon.substring(0, 2) === 'gi' || icon.substring(0, 2) === 'wi'"
          :name="icon"
          :scale="props.scale"
        ></v-icon>
        <i
          v-if="icon.substring(0, 2) === 'bi'"
          style="padding-left: 0.2rem; padding-right: 0.2rem"
          :style="{ fontSize: props.size }"
          :class="icon"
        ></i>
      </div>
    </div>
  </div>
</template>

<style></style>
