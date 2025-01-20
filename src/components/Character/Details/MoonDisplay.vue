<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import BCard from 'bootstrap-vue-next/src/components/BCard/BCard.vue'
import BCardTitle from 'bootstrap-vue-next/src/components/BCard/BCardTitle.vue'
import BCardImg from 'bootstrap-vue-next/src/components/BCard/BCardImg.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'
import CustomModal from '@/components/CustomModal.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormFile from 'bootstrap-vue-next/src/components/BFormFile/BFormFile.vue'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import ImagePicker from '@/components/ImagePicker.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'

export default {
  props: ['moonPhase'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const file = ref()
    const localImg = ref('')
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const story = ref('')

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      file,
      story,
      localImg,
      props
    }
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
    }
  },
  components: {}
}
</script>

<template>
  <div
    style="width: 10rem; height: 5rem; display: flex; flex-direction: column; margin-top: 0.5rem"
    :style="{ color: designStore.secondaryTheme }"
  >
    <div style="position: absolute; margin-top: 0.75rem; margin-left: 3.2rem">
      <v-icon :name="props.moonPhase" scale="3"></v-icon>
    </div>
    <div
      style="display: flex; justify-content: center; margin-bottom: -0.5rem; margin-top: -0.15rem"
    >
      <v-icon name="wi-moon-full"></v-icon>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding-left: 2.5rem;
        padding-right: 2.5rem;
        margin-top: -0.25rem;
      "
    >
      <v-icon name="wi-moon-waxing-gibbous-5" style="transform: rotate(-25deg)"></v-icon>
      <v-icon name="wi-moon-waxing-gibbous-5" style="transform: rotate(205deg)"></v-icon>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        margin-top: -0.25rem;
      "
    >
      <v-icon name="wi-moon-first-quarter" style="transform: rotate(-50deg)"></v-icon>
      <v-icon name="wi-moon-first-quarter" style="transform: rotate(230deg)"></v-icon>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding-left: 0.65rem;
        padding-right: 0.65rem;
        margin-top: -0.25rem;
      "
    >
      <v-icon name="wi-moon-waxing-crescent-4" style="transform: rotate(-70deg)"></v-icon>
      <v-icon name="wi-moon-waxing-crescent-4" style="transform: rotate(245deg)"></v-icon>
    </div>
    <div
      style="
        display: flex;
        justify-content: space-between;
        padding-left: 0.3rem;
        padding-right: 0.3rem;
        margin-top: -0.25rem;
      "
    >
      <v-icon name="wi-moon-waxing-crescent-2" style="transform: rotate(-80deg)"></v-icon>
      <v-icon name="wi-moon-waxing-crescent-2" style="transform: rotate(260deg)"></v-icon>
    </div>
  </div>
</template>

<style scoped></style>
