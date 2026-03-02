<script lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import _ from 'lodash'

import NoFileOpen from './NoFileOpen.vue'
import RichTextEntry from '../RichTextEntry.vue'
import { useJournalStore } from '@/stores/journalStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import StatBlockTags from '../Adventure/Stat Blocks/StatBlockTags.vue'
import LinkedEntries from './LinkedEntries.vue'
import CustomModal from '../CustomModal.vue'
import BasicInput from '../Character/BasicInput.vue'
import AreYouSure from '../AreYouSure.vue'
import JournalTags from './JournalTags.vue'
import BookmarkedEntries from './BookmarkedEntries.vue'
import { BCardFooter, BCardText, BFormInput, BFormTextarea, useToast } from 'bootstrap-vue-next'
import BToast from 'bootstrap-vue-next/src/components/BToast/BToast.vue'
import { storeToRefs } from 'pinia'
import BCard from 'bootstrap-vue-next/src/components/BCard/BCard.vue'
import BCardImg from 'bootstrap-vue-next/src/components/BCard/BCardImg.vue'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import ImagePicker from '../ImagePicker.vue'
import DatePicker from './DatePicker.vue'
import DisplayDate from './DisplayDate.vue'
import BCardBody from 'bootstrap-vue-next/src/components/BCard/BCardBody.vue'

export default {
  props: ['sendUpdates', 'openFile'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const oneLiner = ref(props.openFile?.journalEntryData.oneLiner || '')
    const description = ref(props.openFile?.journalEntryData.description || '')
    const tempImg = ref(props.openFile?.journalEntryData.description)
    function setImage() {
      let newFile = _.cloneDeep(props.openFile.journalEntryData)
      newFile.image = tempImg.value
      props.sendUpdates(newFile)
    }
    function setDate(date, year) {
      let newFile = _.cloneDeep(props.openFile.journalEntryData)

      if (props.openFile.journalEntryData.includeYear) {
        newFile.year = year
      }
      newFile.date = date.index
      props.sendUpdates(newFile)
    }
    const toolbarHeight = ref(0)
    const richTextHeight = computed(() => {
      return 'calc(100% -  ' + toolbarHeight.value + 'px)'
    })
    onMounted(() => {
      console.log((document.getElementsByClassName('ql-toolbar').item(0) as any)?.offsetHeight || 0)
      toolbarHeight.value =
        (document.getElementsByClassName('ql-toolbar').item(0) as any)?.offsetHeight || 0
    })
    function updateHTML(val) {
      let newFile = _.cloneDeep(props.openFile.journalEntryData)
      newFile.description.data = val
      props.sendUpdates(newFile)
    }
    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore,
      oneLiner,
      description,
      tempImg,
      setImage,
      setDate,
      updateHTML,
      toolbarHeight,
      richTextHeight
    }
  },
  components: {
    BCard,
    BCardImg,
    CustomModal,
    BImg,
    ImagePicker,
    BButton,
    DatePicker,
    DisplayDate,
    BCardFooter,
    RichTextEntry
  }
}
</script>

<template>
  <div style="width: 100%; display: flex; flex-direction: row">
    <div
      :style="{ fontFamily: designStore.font }"
      style="width: 100%; display: flex; flex-direction: column"
    >
      <div style="display: flex; height: calc(100vh - 21rem)" class="arrangeForMobile">
        <div style="display: flex; flex-direction: column">
          <BCard
            style="
              border: 1px solid;
              cursor: pointer;
              min-width: 10rem;
              border-radius: 0;
              height: 100%;
            "
            :style="{ color: designStore.secondaryTheme, background: designStore.inputBacking }"
          >
            <BCardImg
              @click="modal = true"
              v-if="props.openFile.journalEntryData.image"
              :src="props.openFile.journalEntryData.image"
              style="border: 4px solid"
              :style="{
                borderColor: designStore.secondaryTheme,
                background: designStore.sidebarBacking
              }"
            ></BCardImg>
            <div style="display: flex; justify-content: center" @click="modal = true" v-else>
              <i class="bi bi-file-image" style="font-size: 8rem; border-radius: 0"></i>
            </div>
            <div style="margin: 1.5rem"></div>
            <BCardFooter>
              <DatePicker
                style="z-index: 4; cursor: pointer"
                :style="{ color: designStore.inputText }"
                @newValue="(date, year) => setDate(date, year)"
                :orientation="'bottom'"
                :startingSection="
                  journalStore.getFullDateArr[journalStore.currentDate][
                    journalStore.calendar.organizedBy
                  ]
                "
                :pick-year="props.openFile.journalEntryData.includeYear"
                :current-year="props.openFile.journalEntryData.dateYear"
                :default="props.openFile.journalEntryData.date"
                ><template v-slot:wrappedAround
                  ><div style="width: 10rem">
                    <DisplayDate
                      v-if="props.openFile.journalEntryData.date > 0"
                      style="z-index: 4; cursor: pointer"
                      :dateObj="journalStore.getFullDateArr[props.openFile.journalEntryData.date]"
                      formula="dateFormula"
                    ></DisplayDate>
                    <div v-else>No Date</div>
                  </div></template
                ></DatePicker
              >
            </BCardFooter>
          </BCard>
        </div>
        <rich-text-entry
          id="textentry"
          :style="{ height: richTextHeight }"
          :form-val="openFile.journalEntryData.description.data"
          :send-updates="updateHTML"
        ></rich-text-entry>
      </div>

      <CustomModal :showModal="modal" title="Edit Image" @close="modal = false">
        <template v-slot:body>
          <BImg :src="props.openFile.journalEntryData.image" style="max-width: 100%"></BImg>
          <ImagePicker @newImage="(image) => (tempImg = image)"></ImagePicker>
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
  </div>
</template>

<style>
.arrangeForMobile {
  flex-direction: row;
}
@media (max-width: 600px) {
  .arrangeForMobile {
    flex-direction: column;
  }
}
</style>
