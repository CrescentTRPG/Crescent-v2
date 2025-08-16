<script lang="ts">
import { DEFAULT_STAT_BLOCK } from '@/bases'
import { useDesignStore } from '@/stores/designStore'
import { BButton } from 'bootstrap-vue-next'
import { computed, ComputedRef, onMounted, Ref, ref } from 'vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import PowerLevelDisplay from './PowerLevelDisplay.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'
import BCard from 'bootstrap-vue-next/src/components/BCard/BCard.vue'
import BCardImg from 'bootstrap-vue-next/src/components/BCard/BCardImg.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import ImagePicker from '@/components/ImagePicker.vue'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import CustomModal from '@/components/CustomModal.vue'

export default {
  props: ['currentStatBlock', 'isEditing', 'updateTemp'],
  setup(props, context) {
    const designStore = useDesignStore()
    function getImage() {
      if (useImg.value) {
        return props.currentStatBlock.image
      }
      const val = Math.floor(Math.random() * 5) + 1
      switch (val) {
        case 4:
          return 'src\\assets\\flame.png'
        case 5:
          return 'src\\assets\\Finn.png'
        default:
          return 'src\\assets\\default' + val + '.png'
      }
    }
    const useImg: ComputedRef<boolean> = computed(() => {
      if (props.currentStatBlock.image != '') {
        return true
      }
      return false
    })
    const img = ref('')
    const modal = ref(false)
    const description = ref(props.currentStatBlock.description || '')
    const collapsed = ref(false)
    function setImage() {
      let newTemp = { ...props.currentStatBlock }
      newTemp.image = img.value
      props.updateTemp(newTemp)
      modal.value = false
    }
    function updateDescription() {
      let newTemp = { ...props.currentStatBlock }
      newTemp.description = description.value
      console.log(description.value)
      props.updateTemp(newTemp)
    }
    return {
      designStore,
      props,
      getImage,
      description,
      collapsed,
      useImg,
      modal,
      img,
      setImage,
      updateDescription
    }
  },
  components: {
    BCard,
    BCardImg,
    TitleMedallion,
    BFormTextarea,
    ImagePicker,
    BImg,
    BButton,
    CustomModal
  }
}
</script>
<template>
  <div>
    <div
      @click="collapsed = !collapsed"
      v-if="collapsed"
      style="
        max-width: fit-content;
        flex-grow: 1;
        border: 2px solid;
        border-top: 0;
        padding: 0.5rem;
      "
      :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
    >
      <i style="font-size: x-large" class="bi bi-arrows-expand-vertical"></i>
    </div>
    <div
      v-if="!collapsed"
      class="biobio"
      :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
    >
      <div
        style="
          display: flex;
          font-size: x-large;
          justify-content: space-between;
          margin-top: -0.75rem;
          margin-bottom: 0.25rem;
        "
        :style="{
          fontFamily: designStore.titleFont,
          color: designStore.sidebarText
        }"
      >
        <div style="display: flex; justify-content: left">
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
          <div style="padding-right: 0.5rem; margin-left: -0.25rem">Bio</div>
          <div style="margin-left: -1rem; z-index: 4">
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
        <i
          @click="collapsed = !collapsed"
          class="bi bi-arrows-collapse-vertical"
          style="font-size: 1.5rem; margin-top: -0.5rem; align-self: flex-end"
          :style="{ color: designStore.sidebarText }"
        ></i>
      </div>
      <div v-if="isEditing">
        <BCard
          @click="modal = true"
          style="border: 1px solid; cursor: pointer"
          :style="{ color: designStore.secondaryTheme, background: designStore.inputBacking }"
        >
          <BCardImg
            v-if="useImg"
            :src="getImage()"
            style="border: 4px solid; border-radius: 0"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.sidebarBacking
            }"
          ></BCardImg>
          <div style="display: flex; justify-content: center" v-if="!useImg">
            <i class="bi bi-file-image" style="font-size: 8rem; border-radius: 0"></i>
          </div>
          <div style="margin: 1.5rem"></div>
        </BCard>
        <TitleMedallion title="Description" :color="designStore.sidebarText"></TitleMedallion>
        <div style="flex-grow: 1">
          <BFormTextarea
            v-model="description"
            style="height: 100%; min-height: 10rem"
            @change="updateDescription()"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
          ></BFormTextarea>
        </div>
      </div>
      <div v-else>
        <BCard
          style="border: 1px solid"
          :style="{ color: designStore.secondaryTheme, background: designStore.inputBacking }"
        >
          <BCardImg
            v-if="useImg"
            :src="getImage()"
            style="border: 4px solid; border-radius: 0"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.sidebarBacking
            }"
          ></BCardImg>
          <div style="display: flex; justify-content: center" v-if="!useImg">
            <i class="bi bi-file-image" style="font-size: 8rem; border-radius: 0"></i>
          </div>
          <div style="margin: 1.5rem"></div>
        </BCard>
        <TitleMedallion title="Description" :color="designStore.sidebarText"></TitleMedallion>
        <div style="flex-grow: 1">
          <BFormTextarea
            v-model="description"
            style="height: 100%; min-height: 10rem"
            @change="updateDescription()"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
          ></BFormTextarea>
        </div>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Edit Stat Block Image" @close="modal = false">
      <template v-slot:body>
        <BImg :src="img || props.currentStatBlock.image" style="max-width: 100%"></BImg>
        <ImagePicker @newImage="(image) => (img = image)"></ImagePicker>
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
  </div>
</template>
<style>
.biobio {
  max-width: 20rem;
  padding: 1rem;
  flex-grow: 1;
  border: 2px solid;
  border-top: 0;
  display: flex;
  flex-direction: column;
}
@media (max-width: 1200px) {
  .biobio {
    max-width: 25rem;
    padding: 1rem;
    flex-grow: 1;
    border: 2px solid;
    border-top: 0;
    display: flex;
    flex-direction: column;
  }
}
</style>
