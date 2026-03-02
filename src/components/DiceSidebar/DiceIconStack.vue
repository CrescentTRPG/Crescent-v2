<template>
  <BPopover
    :style="{
      background: designStore.primaryTheme,
      borderColor: designStore.secondaryTheme
    }"
    class="popover"
    :click="true"
    :close-on-hide="true"
    :delay="{ show: 0, hide: 0 }"
    style="width: fit-content !important; position: absolute"
  >
    <template #target>
      <div
        style="display: flex; width: 40%; justify-content: end; position: relative; cursor: pointer"
      >
        <div id="modifier" style="margin-right: -7rem; margin-top: -0.25rem">
          <v-icon
            :style="{ color: designStore.inputBacking }"
            scale="3.8"
            name="gi-plain-circle"
            style="position: absolute; transform: translate(0rem, -0.15rem)"
          ></v-icon>

          <v-icon
            scale="3.75"
            name="gi-eclipse"
            style="position: absolute; transform: rotate(90deg) translate(-1.1rem, -0.45rem)"
            :style="{ color: designStore.secondaryTheme }"
          ></v-icon>
          <v-icon
            scale="3.75"
            name="wi-moon-waning-crescent-6"
            style="
              position: absolute;
              transform: rotate(290deg) translate(0rem, 0.1rem) scale(1, 1.1);
            "
            :style="{ color: designStore.secondaryTheme }"
          ></v-icon>

          <div
            style="
              font-size: xx-large;
              position: absolute;
              margin-top: 0.75rem;
              width: 4.5rem;
              text-align: center;
            "
            :style="{ fontFamily: designStore.titleFont, color: designStore.inputText }"
          >
            +{{ modifier }}
          </div>
        </div>
        <div id="placed" style="margin-right: -0.75rem; margin-top: 0.5rem">
          <v-icon
            v-if="props.rolls > 0"
            name="gi-star-swirl"
            scale="3.5"
            style="position: absolute; margin-left: 3.45rem; font-size: large"
            :style="{ color: designStore.alertTheme }"
          ></v-icon>
          <v-icon
            v-if="props.rolls < 0"
            name="gi-spectre"
            scale="3.75"
            style="position: absolute; margin-left: 3.35rem; margin-top: -0.5rem; font-size: large"
            :style="{ color: designStore.alertTheme }"
          ></v-icon>
          <i
            :style="{ color: designStore.inputBacking }"
            class="bi bi-diamond-fill"
            style="
              position: absolute;
              margin-left: 3.85rem;
              font-size: 3.3rem;
              margin-top: -0.25rem;
            "
          ></i>
          <v-icon
            scale="3.75"
            name="gi-d10"
            style="position: absolute; margin-left: 3.25rem; margin-top: -0.25rem"
            :style="{ color: designStore.secondaryTheme }"
          ></v-icon>

          <i
            :style="{ color: designStore.inputBacking }"
            class="bi bi-diamond-fill"
            style="
              position: absolute;
              margin-left: 4.5rem;
              margin-top: 0.1rem;
              font-size: xx-large;
              transform: scale(1.4, 1);
              clip-path: polygon(50% 0, 100% 67%, 50% 100%, 0 67%);
            "
          ></i>

          <div
            style="
              position: absolute;
              margin-left: 3.15rem;
              margin-top: 0.75rem;
              width: 4.8rem;
              text-align: center;
              font-size: large;
            "
            :style="{ color: designStore.inputText }"
          >
            x{{ Math.abs(props.rolls) + 2 }}
          </div>
        </div>
      </div>
    </template>
    <div
      style="padding: 0.5rem; border-radius: 0.25rem"
      :style="{ background: designStore.inputBacking, color: designStore.inputText }"
    >
      The roller has {{ props.selectedRoll }} selected. It will roll
      {{ Math.abs(props.rolls) + 2 }} dice.
      {{
        rolls > 0
          ? 'The two highest dice will be selected, all others discarded. (' +
            Math.abs(props.rolls) +
            ' placed rolls)'
          : 'The two lowest dice will be selected all others discarded. ' +
            '(' +
            Math.abs(props.rolls) +
            ' displaced rolls)'
      }}
      Finally,
      {{ modifier }} will be added to the rolled result.
    </div>
  </BPopover>
</template>

<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import BPopover from 'bootstrap-vue-next/src/components/BPopover.vue'

export default {
  props: ['modifier', 'placed', 'rolls', 'selectedRoll'],
  setup(props, context) {
    const designStore = useDesignStore()
    window.addEventListener('resize', function () {})
    return {
      designStore,
      props
    }
  },
  components: {
    BPopover
  }
}
</script>

<style></style>
