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

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const file = ref()
    const localImg = ref('')
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const backstory = ref(characterStore.backstory || '')
    function setBackstory(){
      characterStore.setBackstory(backstory.value)
    }
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      file,
      backstory,
      localImg,
      setBackstory
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
  <div style="flex-grow: 1; height: 100%">
    <TitleWidget title="Backstory"></TitleWidget>
    <BFormTextarea
    debounce="300"
      v-model="backstory"
      @change="setBackstory()"
      style="
        border-radius: 0;
        overflow-y: auto;
        border-bottom: 2px solid;
        max-height: 80%;
        min-height: 70%;
      "
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
