<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import TitleWidget from '@/components/TitleWidget.vue'
import { useUserStore } from '@/stores/userStore.ts'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'

export default {
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
      localImg
    }
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
    }
  },
  components: { BFormTextarea, TitleWidget }
}
</script>

<template>
  <div style="width: 100%">
    <TitleWidget title="Backstory"></TitleWidget>
    <BFormTextarea
      v-model="story"
      style="height: 75%; border-radius: 0; overflow-y: auto; border-bottom: 2px solid"
      placeholder="I was once a child you know."
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        fontFamily: designStore.font,
        scrollbarColor: scrollbarColor,
        borderColor: designStore.secondaryTheme
      }"
    ></BFormTextarea>
  </div>
</template>

<style scoped>
.image-box {
  cursor: pointer;
  border: 2px solid;
}
.characterCardTitle {
  background: #422c58;
  color: #dfdfdf;
  padding: 0.5rem;
  width: fit-content;
  border-radius: 10px;
  font-size: 1rem;
  position: absolute;
  left: 1.5rem;
  max-width: 90%;
}
.addIconContain {
  background-color: #dfdfdf;
  display: flex;
  justify-content: center;
  font-size: 12rem;
  color: #ffffff;
}
</style>
