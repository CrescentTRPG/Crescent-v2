<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref, watch } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

/* this contains the default theme, these are optional styles */
import { useJournalStore } from '@/stores/journalStore.ts'
import { lightenDarkenColor } from '@/Utility.ts'
import { BFormTextarea, BPopover } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import AreYouSure from '../AreYouSure.vue'
import CustomCheckbox from '../Character/CustomCheckbox.vue'
import CustomModal from '../CustomModal.vue'
import IconDisplay from '../IconDisplay.vue'
import IconPicker from '../IconPicker.vue'

export default {
  props: ['icon', 'imageHeight', 'imageWidth', 'deleteIndex', 'placement'],
  emits: ['iconUpdate'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()

    const colorModel = ref('#000000')
    const iconModel = ref('gi-uncertainty')
    const tempIcon = ref(props.icon)
    watch(props, (oldProps, newProps) => {
      if (props.icon != tempIcon.value) {
        tempIcon.value = props.icon
      }
    })
    function updateShowTitle(bool) {
      tempIcon.value.titleHoverAlways = bool
      sendUpdates()
    }
    function sendUpdates() {
      if (tempIcon.value.scale < 1 || !tempIcon.value.scale) {
        tempIcon.value.scale = 1
      }
      context.emit('iconUpdate', tempIcon.value)
    }

    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore,
      colorModel,
      iconModel,
      lightenDarkenColor,
      tempIcon,
      sendUpdates,
      updateShowTitle
    }
  },
  components: {
    BFormInput,
    CustomModal,
    BButton,
    IconDisplay,
    BPopover,
    IconPicker,
    BFormTextarea,
    AreYouSure,
    CustomCheckbox
  }
}
</script>

<template>
  <div
    style="cursor: pointer"
    :style="{ left: tempIcon.x * imageWidth + 'px', top: tempIcon.y * imageHeight + 'px' }"
  >
    <div style="position: relative">
      <BPopover
        :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
        class="popover"
        click="true"
        hover
        :placement="placement"
        :close-on-hide="true"
        :delay="{ show: 0, hide: 0 }"
        style="width: fit-content"
      >
        <template #target>
          <div>
            <div
              :style="{
                color: tempIcon.color,
                fontSize: 1 + 'rem',
                width: tempIcon.scale + 'rem'
              }"
              style="
                margin-top: -1rem;
                padding-bottom: 0.5rem;
                margin-bottom: -1rem;
                text-wrap: nowrap;
                text-align: center;
                padding-left: 0.25rem;
                z-index: 3;
              "
              v-if="icon.title && icon.titleHoverAlways"
            >
              {{ icon.title }}
            </div>
            <IconDisplay
              style="z-index: 3"
              :icon="tempIcon.icon"
              :color="tempIcon.color"
              :scale="tempIcon.scale + ''"
              :fontSize="tempIcon.scale + 'rem'"
            ></IconDisplay>
          </div>
        </template>
        <div style="z-index: 6" :style="{ width: icon.description ? 20 + 'rem' : 'fit-content' }">
          <div style="display: flex; justify-content: space-between">
            <div
              v-if="tempIcon.title"
              style="padding: 0.5rem; padding-top: 0; border-radius: 0.25rem; font-size: large"
              :style="{ color: designStore.primaryText }"
            >
              {{ tempIcon.title }}
            </div>
            <BButton
              @click="modal = true"
              style="align-self: flex-end"
              :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
              ><i class="bi bi-pen-fill"></i
            ></BButton>
          </div>
          <hr v-if="tempIcon.description" :style="{ color: designStore.secondaryTheme }" />
          <div
            v-if="tempIcon.description"
            style="padding: 0.5rem; border-radius: 0.25rem; border: 1px solid; margin-top: -0.5rem"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{ tempIcon.description }}
          </div>
        </div>
      </BPopover>
      <CustomModal :showModal="modal" title="Edit Marker Info" @close="modal = false">
        <template v-slot:body>
          <div style="display: flex; flex-wrap: wrap">
            <div style="display: flex; flex-direction: column; margin-right: 0.5rem">
              <div>Title</div>
              <BFormInput
                style="height: 2.5rem"
                lazy
                @update="sendUpdates()"
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  borderColor: designStore.secondaryTheme
                }"
                placeholder="Title"
                v-model="tempIcon.title"
              ></BFormInput>
            </div>

            <div style="display: flex; flex-direction: column; margin-right: 0.5rem">
              <div style="text-wrap: nowrap">Display Title</div>
              <div
                style="
                  width: 100%;
                  height: 2.5rem;
                  padding: 0.25rem;
                  padding-top: 0;
                  border-radius: 0.375rem;
                  border: 1px solid;
                  align-items: center;
                "
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  borderColor: designStore.secondaryTheme
                }"
              >
                <CustomCheckbox
                  style="margin-top: -0.15rem; padding-left: 1.25rem"
                  @true="updateShowTitle(true)"
                  @false="updateShowTitle(false)"
                  :is-checked="icon.titleHoverAlways"
                ></CustomCheckbox>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; margin-right: 0.5rem; width: 25%">
              <div>Color</div>
              <BFormInput
                lazy
                @update="sendUpdates()"
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  borderColor: designStore.secondaryTheme
                }"
                style="width: 100%"
                type="color"
                v-model="tempIcon.color"
              ></BFormInput>
            </div>
            <div style="display: flex; flex-direction: column; margin-right: 0.5rem; width: 5rem">
              <div>Scale</div>
              <BFormInput
                style="height: 2.5rem"
                lazy
                @update="sendUpdates()"
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  borderColor: designStore.secondaryTheme
                }"
                type="number"
                v-model="tempIcon.scale"
              ></BFormInput>
            </div>
            <IconPicker
              style="margin: 0.25rem; transform: scale(0.75)"
              :color="tempIcon.color"
              :current-icon="tempIcon.icon"
              @selected-icon="(icon) => ((tempIcon.icon = icon), sendUpdates())"
            ></IconPicker>
          </div>

          <BFormTextarea
            lazy
            @update="sendUpdates()"
            style="min-height: 8rem"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            placeholder="Description..."
            v-model="tempIcon.description"
          ></BFormTextarea>
        </template>
        <template v-slot:footer>
          <BButton
            @click="modal = false"
            style="border: 1px solid; margin-right: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            >Close</BButton
          >
          <AreYouSure :passedFunction="props.deleteIndex" action="delete this marker"
            ><BButton
              style="border: 1px solid"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              >Delete</BButton
            ></AreYouSure
          >
        </template>
      </CustomModal>
    </div>
  </div>
</template>

<style>
.noImageContainer {
  display: flex;
  align-self: center;
  justify-content: center;
  font-size: 20rem;
}
.overflow-auto {
  z-index: 6;
}
</style>
