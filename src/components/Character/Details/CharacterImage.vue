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

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const file = ref()
    const localImg = ref('')
    const nameModal = ref(false)
    const name = ref('')

    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const useImg: ComputedRef<boolean> = computed(() => {
      if (characterStore.image != '') {
        return true
      }
      return false
    })
    function setImage() {
      characterStore.setcharacterImage(localImg.value)
    }

    return {
      name,
      nameModal,
      useImg,
      designStore,
      modal,
      userStore,
      characterStore,
      file,
      localImg,
      setImage
    }
  },
  components: { BCard, BCardImg, RibbonTitle, CustomModal, BImg, ImagePicker, BButton, BFormInput },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    },
    getCharacterImage() {
      const val = Math.floor(Math.random() * 5) + 1
      switch (val) {
        case 4:
          return 'src\\assets\\flame.png'
        case 5:
          return 'src\\assets\\Finn.png'
        default:
          return 'src\\assets\\default' + val + '.png'
      }
    },
    getBase64(file, image) {
      var reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = function () {
        image.base64 = reader.result
      }
      reader.onerror = function (error) {
        console.log('Error: ', error)
      }
    }
  }
}
</script>

<template>
  <div style="width: fit-content; height: fit-content">
    <div class="charImage">
      <BCard
        class="charx"
        :style="{
          background: designStore.sidebarBacking,
          borderColor: designStore.secondaryTheme
        }"
      >
        <BCardImg
          @click="modal = true"
          fluid
          v-if="useImg"
          style="border: 4px solid; border-radius: 0"
          :src="characterStore.image"
          :style="{
            background: designStore.inputBacking,
            color: designStore.iconColor,
            borderColor: designStore.secondaryTheme
          }"
        ></BCardImg>
        <div
          v-if="!useImg"
          class="addIconContainer"
          :style="{ background: designStore.inputBacking, color: designStore.iconColor }"
        >
          <i class="bi bi-file-image" style="position: relative"></i>
        </div>
        <div style="margin: 1.5rem"></div>
        <div style="display: flex; justify-content: center"></div>
        <div
          style="
            display: flex;
            flex-direction: row;
            position: relative;
            bottom: 0rem;
            justify-content: center;
          "
        >
          <RibbonTitle
            @click="nameModal = true"
            :title="characterStore.name"
            :background="designStore.primaryTheme"
            :textColor="designStore.primaryText"
          ></RibbonTitle>
        </div>
      </BCard>
    </div>
    <CustomModal :showModal="modal" title="Edit Character Image" @close="modal = false">
      <template v-slot:body>
        <BImg :src="localImg || characterStore.image" style="max-width: 100%"></BImg>
        <ImagePicker @newImage="(image) => (localImg = image)"></ImagePicker>
      </template>
      <template v-slot:footer>
        <BButton
          @click="setImage()"
          style="border: 1px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Set Image</BButton
        >
      </template>
    </CustomModal>
    <CustomModal :showModal="nameModal" title="Edit Character Name" @close="nameModal = false">
      <template v-slot:body>
        <BFormInput
          v-model="name"
          style="border: 1px solid"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
        ></BFormInput>
      </template>
      <template v-slot:footer>
        <BButton
          @click="characterStore.setCharacterName(name)"
          style="border: 1px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Set Name</BButton
        >
      </template>
    </CustomModal>
  </div>
</template>

<style scoped>
.charImage {
  height: fit-content;
}
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
.charx {
  max-width: 350px;
  max-height: 25rem;
  margin: 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 1rem;

  cursor: pointer;
}
</style>
