<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../stores/designStore'
export default {
  props: ['isChecked', 'overrideBox', 'overrideFill', 'key'],
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const fill = ref(props.overrideFill)
    const box = ref(props.overrideBox)
    const key = ref(props.key)
    const designStore = useDesignStore()
    return { designStore, props, fill, box }
  },
  watch: {
    key() {
      console.log('heyy')
      this.$forceUpdate()
    }
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
  <div
    style="display: flex; justify-content: flex-start"
    :style="{ fontFamily: designStore.font, color: designStore.iconColor }"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: absolute;
        height: 2rem;
        width: 2rem;
      "
    >
      <div style="display: flex; justify-content: center; height: 1rem; position: absolute">
        <i
          id="iconBox"
          :class="box || designStore.icon"
          style="font-size: 2rem; z-index: 2; position: relative; bottom: 0.45rem"
          :style="{ color: designStore.inputText }"
        ></i>
      </div>
    </div>
    <div
      v-if="isChecked"
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 2rem;
        width: 2rem;
      "
    >
      <div style="display: flex; justify-content: center; height: 1rem">
        <i
          v-if="fill?.substring(0, 2) == 'bi' || designStore.iconFill.substring(0, 2) == 'bi'"
          :class="fill || designStore.iconFill"
          style="font-size: 1.4rem; z-index: 3"
        ></i>
        <v-icon
          v-if="fill?.substring(0, 2) == 'gi' || designStore.iconFill.substring(0, 2) == 'gi'"
          :name="fill || designStore.iconFill"
          scale="1.45"
          style="font-size: 1.4rem; z-index: 3"
        ></v-icon>
      </div>
    </div>
  </div>
</template>

<style></style>
