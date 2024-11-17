<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'

export default {
  props: ['actionName', 'ability'],
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
    style="
      width: 90%;
      border: 2px solid;
      margin-right: 5%;
      margin-left: 5%;
      margin-top: 1rem;
      cursor: pointer;
    "
    :style="{ fontFamily: designStore.font, borderColor: designStore.secondaryTheme }"
  >
    <div
      style="
        width: 100%;
        font-size: 1rem;
        border-bottom: 2px solid;
        padding: 0.25rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        fontFamily: designStore.titleFont,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="margin-right: -0.25rem">
        <v-icon
          style="margin-right: -1.25rem"
          name="wi-moon-waning-crescent-5"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
        <v-icon
          name="wi-moon-waning-crescent-3"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
      </div>
      <div
        style="z-index: 5; display: flex; flex-direction: column; justify-content: center"
        :style="{
          background: designStore.primaryTheme,
          borderColor: designStore.secondaryTheme
        }"
      >
        {{ props.actionName }}
      </div>
      <div style="margin-left: -0.25rem; z-index: 4">
        <v-icon
          name="wi-moon-waxing-crescent-3"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
        <v-icon
          style="margin-left: -1.25rem"
          name="wi-moon-waxing-crescent-1"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
      </div>
    </div>

    <div v-if="props.ability">
      {{ props.ability }}
    </div>
    <div
      v-else
      style="min-height: 4rem; display: flex; flex-direction: column; border: 10px solid"
      :style="{
        background: designStore.secondaryTheme,
        borderColor: LightenDarkenColor(designStore.inputBacking, -10),
        boxShadow: 'inset 0px 0px 0px 2px ' + LightenDarkenColor(designStore.secondaryTheme, -10),
        color: designStore.inputText
      }"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          flex-grow: 1;
          z-index: 3;
        "
        class="outerBox"
        :style="{
          background: designStore.inputBacking
        }"
      >
        <div
          style="
            text-align: center;
            z-index: 4;
            height: 100%;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          "
          :style="{
            background: designStore.inputBacking
          }"
        >
          No Ability Planned
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.outerBox {
  width: 100%;
}
</style>
