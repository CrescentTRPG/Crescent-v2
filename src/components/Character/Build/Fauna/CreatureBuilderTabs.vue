<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { storeToRefs } from 'pinia'

export default {
  setup() {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()

    const { manualTraits } = storeToRefs(faunaStore)
    return { designStore }
  }
}
</script>
<template>
  <div style="display: flex">
    <div style="display: flex; width: 18rem; cursor: pointer">
      <div class="dazzley2" :style="{ background: designStore.secondaryTheme }"></div>
      <div
        class="dazzley"
        :style="{ borderColor: designStore.primaryTheme }"
        style="border-left: 5rem solid transparent"
      ></div>
      <div
        class="verticalLine"
        :style="{ borderColor: designStore.secondaryTheme }"
        style="border-left-color: transparent"
      ></div>
      <div
        :style="{
          fontFamily: designStore.titleFont,
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        style="flex-grow: 1"
      >
        <div
          class="lil-margin"
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border: 3px solid;
          "
          :style="{ borderColor: designStore.primaryTheme }"
        >
          <div style="align-self: center; font-size: large; margin-right: 1rem">
            Create &nbsp;&nbsp;Transformation
          </div>
        </div>
      </div>
    </div>
    <div
      class="followTriangle"
      :style="{
        borderLeftColor: designStore.primaryTheme
      }"
    ></div>
    <div style="display: flex; width: 18rem; cursor: pointer">
      <div class="dazzley2Smol" :style="{ background: designStore.secondaryTheme }"></div>
      <div
        class="dazzleySmol"
        :style="{ borderColor: designStore.sidebarBacking }"
        style="border-left-color: transparent"
      ></div>
      <div
        class="verticalLine"
        :style="{ borderColor: designStore.secondaryTheme }"
        style="border-left-color: transparent"
      ></div>
      <div
        :style="{
          fontFamily: designStore.titleFont,
          background: designStore.sidebarBacking,
          color: designStore.sidebarText,
          borderColor: designStore.secondaryTheme
        }"
        style="flex-grow: 1"
        class="block"
      >
        <div
          class="lil-margin"
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            border: 3px solid;
          "
          :style="{ borderColor: designStore.sidebarBacking }"
        >
          <div style="align-self: center; font-size: large; margin-right: 1rem">
            Tweak Known &nbsp;&nbsp; &nbsp;&nbsp;Creature
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verticalLine {
  display: none;
}
.dazzley {
  width: 0;
  height: 0;
  border-top: 5rem solid;
}
.dazzley2 {
  width: 2rem;
  height: 5rem;
  transform: skew(45deg);
  position: relative;
  left: 2.5rem;
}
.followTriangleSmol {
  width: 0;
  height: 0;
  border-left: 80px solid transparent;
  border-right: 0rem solid transparent;
  border-top: 5rem solid transparent;
  margin-right: -5rem;
}
.dazzleySmol {
  width: 0;
  height: 0;
  border-top: 4rem solid;
  border-left: 4rem solid transparent;
}
.block {
  height: 4rem;
}
.dazzley2Smol {
  width: 2rem;
  height: 4rem;
  transform: skew(45deg);
  position: relative;
  left: 2.5rem;
}
.followTriangle {
  width: 0;
  height: 0;
  border-left: 80px solid transparent;
  border-right: 0rem solid transparent;
  border-top: 5rem solid transparent;
  margin-right: -5.5rem;
}
.status {
  width: 60%;
  height: 4rem;
  display: block;
  overflow: hidden;
}

@media (max-width: 600px) {
  .status {
    display: none;
  }
  .lil-margin {
    margin-left: 0.5rem;
  }
  .dazzley {
    display: none;
  }
  .dazzley2 {
    display: none;
    background: #000000;
  }
  .verticalLine {
    border-left: 5px solid;
    height: 5rem;
    width: 0.2rem;
    display: inline;
  }
}
</style>
