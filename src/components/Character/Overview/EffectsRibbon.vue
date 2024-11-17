<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore'
import { useDesignStore } from '../../../stores/designStore'
import { computed, ComputedRef } from 'vue'
import { storeToRefs } from 'pinia'

export default {
  props: ['tab'],
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const traitArr: ComputedRef<Array<any>> = computed(() => {
      return Object.values(characterStore.traits)
    })
    return { designStore, props, characterStore, traitArr }
  },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  },
  components: {}
}
</script>

<template>
  <div style="display: flex">
    <div
      class="traitRibbon"
      :style="{
        background: designStore.primaryTheme,
        boxShadow: 'inset -5px -2px 2px 2px ' + LightenDarkenColor(designStore.primaryTheme, 10)
      }"
    >
      <div v-for="t in traitArr" :key="t.name">
        <div
          class="iconContain"
          v-if="t.icon.substring(0, 2) == 'gi'"
          :style="{ borderColor: designStore.secondaryTheme }"
        >
          <v-icon
            scale="1.75"
            :name="t.icon"
            style="cursor: pointer"
            :style="{ color: designStore.primaryText }"
          ></v-icon>
        </div>
        <div
          class="iconContain"
          :style="{
            borderColor: designStore.secondaryTheme,
            color: designStore.primaryText
          }"
          v-if="t.icon.substring(0, 2) == 'bi'"
          style="font-size: 2.5rem; cursor: pointer"
        >
          <i :class="t.icon"></i>
        </div>
      </div>
    </div>
    <div
      style="
        margin-bottom: 0.2rem;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        margin-left: -3px;
      "
    >
      <div
        class="StatusRibbon"
        :style="{
          background: designStore.primaryTheme,
          boxShadow: 'inset 7px 0px 3px 1px ' + LightenDarkenColor(designStore.primaryTheme, -20)
        }"
      >
        <div class="iconContain">
          <i
            class="bi bi-plus"
            :style="{ color: designStore.primaryText }"
            style="font-size: 1.75rem; margin-left: 3px"
          ></i>
        </div>
      </div>
    </div>
    <div style="display: flex; flex-direction: column">
      <div class="ribbon-top" :style="{ borderLeftColor: designStore.primaryTheme }"></div>
      <div class="ribbon-bottom" :style="{ borderLeftColor: designStore.primaryTheme }"></div>
    </div>
  </div>
</template>

<style>
.traitRibbon {
  display: flex;
  font-size: large;
  height: 3rem;
  padding: 0.5rem;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 2;
}
.statusRibbon {
  height: 2.75rem !important;
  z-index: 1;
}

.iconContain {
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}
.ribbon-top {
  margin-top: 0.2rem;
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 21px solid transparent;

  border-left: 15px solid;
}
.ribbon-bottom {
  width: 0;
  height: 0;
  border-top: 21px solid transparent;
  border-bottom: 0px solid transparent;

  border-left: 15px solid;
}
</style>
