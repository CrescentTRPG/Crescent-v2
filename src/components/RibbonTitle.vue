<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'

export default {
  props: ['title', 'background', 'textColor', 'enableHover'],
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    return {
      userStore,
      designStore,
      props
    }
  },
  components: {},
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  }
}
</script>
<template>
  <div
    style="text-align: center; margin-bottom: 0.25rem; display: flex; width: fit-content"
    class="fonty"
    :style="{
      color: designStore.sidebarText,
      font: designStore.titleFont
    }"
  >
    <div style="display: flex">
      <div style="display: flex; flex-direction: column; z-index: 5; margin-bottom: 0.1rem">
        <div class="ribbon-top-left" :style="{ borderRightColor: props.background }"></div>
        <div class="ribbon-bottom-left" :style="{ borderRightColor: props.background }"></div>
      </div>
      <div
        style="
          width: 1rem;
          height: 2.5rem !important;
          margin-top: 0.25rem;
          padding: 0.5rem;
          z-index: 5;
        "
        :style="{
          background: props.background,
          boxShadow: 'inset -4px 0px 3px 0px ' + LightenDarkenColor(props.background, -20),
          color: props.textColor
        }"
      >
        {{ ' ' }}
      </div>
    </div>
    <div
      style="
        padding-left: 1rem;
        padding-right: 1rem;
        border-radius: 0.15rem;
        display: flex;
        justify-content: center;
      "
      :class="enableHover ? 'hoverableTransparantLinear' : ''"
      :style="{ background: props.background, color: props.textColor }"
    >
      <div
        style="text-align: center; display: flex; flex-direction: column; justify-content: center"
      >
        {{ props.title }}
      </div>
    </div>

    <div style="display: flex">
      <div
        style="
          width: 1rem;
          height: 2.5rem !important;
          margin-top: 0.25rem;
          padding: 0.5rem;
          z-index: 5;
        "
        :style="{
          background: props.background,
          boxShadow: 'inset 4px 0px 3px 0px ' + LightenDarkenColor(props.background, -20)
        }"
      >
        {{ ' ' }}
      </div>
      <div style="display: flex; flex-direction: column; z-index: 5; margin-bottom: 0.1rem">
        <div class="ribbon-top" :style="{ borderLeftColor: props.background }"></div>
        <div class="ribbon-bottom" :style="{ borderLeftColor: props.background }"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.ribbon-top {
  margin-top: 0.25rem;
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 20px solid transparent;

  border-left: 15px solid;
}
.ribbon-bottom {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 0px solid transparent;

  border-left: 15px solid;
}
.ribbon-top-left {
  margin-top: 0.25rem;
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 20px solid transparent;

  border-right: 15px solid;
}
.ribbon-bottom-left {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 0px solid transparent;

  border-right: 15px solid;
}
.fonty {
  font-size: x-large;
}
@media (max-width: 500px) {
  .fonty {
    font-size: small;
  }
}
</style>
