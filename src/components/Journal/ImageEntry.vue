<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ComputedRef, onMounted, Ref, ref, watch } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import { IconData, IconStuff } from '@/bases.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import { lightenDarkenColor } from '@/Utility.ts'
import { BImg } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import _ from 'lodash'
import AreYouSure from '../AreYouSure.vue'
import CustomModal from '../CustomModal.vue'
import IconPicker from '../IconPicker.vue'
import ImagePicker from '../ImagePicker.vue'
import EditableIconInfoDisplay from './EditableIconInfoDisplay.vue'

export default {
  props: ['sendUpdates', 'openFile'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()

    const colorModel = ref('#000000')
    const iconModel = ref('gi-uncertainty')
    const localImg = ref(props.openFile.journalEntryData.image)
    const currentlyDragging = ref(false)
    function setImage() {
      let cpOpenFile = _.cloneDeep(props.openFile.journalEntryData)
      cpOpenFile.image = localImg.value

      props.sendUpdates(cpOpenFile)
    }
    const icons: Ref<IconData> = ref(props.openFile.journalEntryData.iconData)
    const iconList: ComputedRef<Array<IconStuff>> = computed(() => {
      return Object.values(icons.value) as Array<IconStuff>
    })
    watch(props, (oldProps, newProps) => {
      icons.value = props.openFile.journalEntryData.iconData
      if (imageHeight.value === 0) {
        imageHeight.value = document.getElementById('imageId')?.offsetHeight || 0
      }
    })
    const imageHeight = ref(document.getElementById('imageId')?.offsetHeight || 0)
    const imageWidth = ref(document.getElementById('imageId')?.offsetWidth || 0)
    window.addEventListener('resize', function () {
      imageHeight.value = document.getElementById('imageId')?.offsetHeight || 0
      imageWidth.value = document.getElementById('imageId')?.offsetWidth || 0
    })
    onMounted(() => {
      let img = document.getElementById('imageId')
      if (img)
        new Promise((resolve) => {
          img.onload = img.onerror = resolve
        }).then(() => {
          imageHeight.value = document.getElementById('imageId')?.offsetHeight || 0
          imageWidth.value = document.getElementById('imageId')?.offsetWidth || 0
        })
    })

    function fillData(event, dropIndex, icon) {
      currentlyDragging.value = true
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'copyMove'
      //event.dataTransfer.effectAllowed = 'move'

      event.dataTransfer.setData('dropIndex', dropIndex)
      event.dataTransfer.setData('icon', icon.icon)
      event.dataTransfer.setData('color', icon.color)
      event.dataTransfer.setData('title', icon.title)
      event.dataTransfer.setData('description', icon.description)
      event.dataTransfer.setData('scale', icon.scale)
    }
    async function onDrop(drop) {
      currentlyDragging.value = false
      let ind = await drop.dataTransfer.getData('dropIndex')
      if (ind) {
        const index = ind
        const icon = await drop.dataTransfer.getData('icon')
        const color = await drop.dataTransfer.getData('color')
        const title = await drop.dataTransfer.getData('title')
        const description = await drop.dataTransfer.getData('description')
        const scale = await drop.dataTransfer.getData('scale')

        icons.value[index] = {
          icon: icon,
          color: color,
          x: (drop.offsetX - 10) / imageWidth.value,
          y: (drop.offsetY - 10) / imageHeight.value,
          title: title,
          description: description,
          scale: scale,
          titleHoverAlways: false
        }
      } else {
        icons.value[iconList.value.length] = {
          icon: iconModel.value,
          color: colorModel.value,
          x: (drop.offsetX - 10) / imageWidth.value,
          y: (drop.offsetY - 10) / imageHeight.value,
          title: '',
          description: '',
          scale: 1,
          titleHoverAlways: false
        }
      }
      updateIcons()
    }
    function updateIcons() {
      let cp = _.cloneDeep(props.openFile.journalEntryData)
      cp.iconData = icons.value
      props.sendUpdates(cp)
    }

    function updateIcon(newVal, index) {
      icons.value[index] = newVal
      updateIcons()
    }

    function reIndexIcons() {
      let iconsCp = {}
      let i = 0
      iconList.value.forEach((icon) => {
        iconsCp[i] = icon
        iconsCp[i].index = i
        i++
      })
      icons.value = iconsCp
    }
    function deleteIndex(index) {
      delete icons.value[index]
      reIndexIcons()
      updateIcons()
    }

    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore,
      colorModel,
      iconModel,
      localImg,
      setImage,
      lightenDarkenColor,
      onDrop,
      iconList,
      imageWidth,
      imageHeight,
      icons,
      fillData,
      updateIcons,
      updateIcon,
      deleteIndex,
      currentlyDragging
    }
  },
  components: {
    BImg,
    BFormInput,
    IconPicker,
    ImagePicker,
    CustomModal,
    BButton,
    AreYouSure,
    EditableIconInfoDisplay
  }
}
</script>

<template>
  <div style="width: 100%; flex-grow: 1; min-width: 50vw">
    <div style="position: relative; z-index: 5">
      <div
        :class="currentlyDragging ? 'stopPointer' : ''"
        v-for="(icon, index) in iconList"
        :key="index"
        style="position: absolute"
        :style="{
          left:
            Math.round(icon.x * imageWidth + (imageWidth / imageWidth - icon.scale) * 16) + 'px',
          top:
            Math.round(icon.y * imageHeight + (imageHeight / imageHeight - icon.scale) * 16) + 'px'
        }"
      >
        <EditableIconInfoDisplay
          :class="currentlyDragging ? 'stopPointer' : ''"
          @iconUpdate="
            (newVal) => {
              updateIcon(newVal, index)
            }
          "
          draggable="true"
          @dragstart="fillData($event, index, icon)"
          v-if="icon.icon"
          :icon="icon"
          :imageHeight="imageHeight"
          :imageWidth="imageWidth"
          :deleteIndex="() => deleteIndex(index)"
          :placement="
            imageWidth * icon.x < 200
              ? 'right'
              : icon.x * imageWidth > imageWidth - 200
                ? 'left'
                : imageHeight * icon.y > 200
                  ? 'top'
                  : 'bottom'
          "
        ></EditableIconInfoDisplay>
      </div>
    </div>
    <BImg
      id="imageId"
      fluid-grow="true"
      @drop="onDrop($event)"
      @dragenter.prevent
      @dragover.prevent
      :src="props.openFile.journalEntryData.image"
      v-if="props.openFile.journalEntryData.image"
    ></BImg>
    <div
      v-else
      style="height: calc(100% - 5rem); width: 100%; flex-grow: 1"
      :style="{ background: designStore.inputBacking }"
    >
      <div
        @click="modal = true"
        class="noImageContainer"
        :style="{
          background: designStore.inputBacking,
          color: lightenDarkenColor(designStore.inputBacking, -20)
        }"
      >
        <i class="bi bi-file-image" style="position: relative"></i>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Set Image" @close="modal = false">
      <template v-slot:body>
        <BImg :src="localImg" style="max-width: 100%"></BImg>
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
    <div
      style="display: flex; justify-content: space-between; padding: 0.5rem; border: 1px solid"
      :style="{
        background: designStore.primaryTheme,
        borderColor: designStore.secondaryTheme,
        color: designStore.primaryText
      }"
    >
      <div style="display: flex; flex-direction: column">
        <BButton
          @click="modal = true"
          style="border: 1px solid; margin-bottom: 0.5rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Change Image</BButton
        >
        <AreYouSure
          action="delete this Image"
          :passed-function="() => ((localImg = ''), setImage())"
        >
          <BButton style="border: 1px solid" :style="{ borderColor: designStore.secondaryTheme }"
            >Remove Image</BButton
          ></AreYouSure
        >
      </div>
      <div style="display: flex; flex-direction: column">
        <div>Try Dragging me !</div>
        <div style="display: flex">
          <BFormInput
            style="margin: 0.25rem; flex-grow: 1; align-self: center"
            type="color"
            v-model="colorModel"
          ></BFormInput>

          <IconPicker
            style="margin: 0.25rem; transform: scale(0.75)"
            :color="colorModel"
            :current-icon="iconModel"
            @selected-icon="(icon) => (iconModel = icon)"
            draggable="true"
            @dragstart="currentlyDragging = true"
          ></IconPicker>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.stopPointer {
}
.noImageContainer {
  display: flex;
  align-self: center;
  justify-content: center;
  font-size: 20rem;
}
</style>
