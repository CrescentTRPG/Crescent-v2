<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    return { designStore }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard
  }
}
</script>

<template>
  <div style="display: flex; width: 18rem">
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
        <div style="display: flex; justify-content: flex-start">
          <div style="align-self: center; font-size: large; margin-right: 1rem">Build Status:</div>
          <i class="bi bi-check2" style="font-size: x-large"></i>
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
@media (max-width: 600px) {
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
