<script lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
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
import { BOffcanvas } from 'bootstrap-vue-next'
import BToast from 'bootstrap-vue-next/src/components/BToast/BToast.vue'
import { storeToRefs } from 'pinia'
import BioEntry from './BioEntry.vue'
import ChartEntry from './ChartEntry.vue'
import ImageEntry from './ImageEntry.vue'

export default {
  props: ['openCreateFile', 'openFile', 'isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const { showToast, openFileUnsavedChanges } = storeToRefs(journalStore)
    function updateHtmlEntry(newHtml) {
      resetAutosaveTimer()
      let newOpenFile = _.cloneDeep(props.openFile)
      newOpenFile.journalEntryData.data = newHtml
      journalStore.updateOpenFile(newOpenFile, props.isCharacter)
    }

    const autoSaveTimeout = ref()

    const time = ref(props.isCharacter ? 30000 : 10000)
    function resetAutosaveTimer() {
      if (time.value) {
        clearTimeout(autoSaveTimeout.value)
      }

      autoSaveTimeout.value = setTimeout(
        () => {
          journalStore.autoSaveOpenFile(props.isCharacter)
        },
        userStore.subscriptionLevel === 'Overlord' ? 10000 : 50000
      )
    }
    onUnmounted(() => {
      if (journalStore.openFileUnsavedChanges) {
        journalStore.pushEntryMapToFirestore(props.isCharacter)

        journalStore.updateFile(journalStore.openFile, props.isCharacter)
      }
      clearTimeout(autoSaveTimeout.value)
    })

    const delay = (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }

    function updateBioEntry(newData) {
      resetAutosaveTimer()

      let newOpenFile = _.cloneDeep(props.openFile)
      newOpenFile.journalEntryData = newData
      journalStore.updateOpenFile(newOpenFile, props.isCharacter)
    }

    function updateFileName(newName) {
      resetAutosaveTimer()

      let newOpenFile = _.cloneDeep(props.openFile)
      newOpenFile.name = newName
      journalStore.updateOpenFile(newOpenFile, props.isCharacter)
    }

    function updateTags(tags) {
      resetAutosaveTimer()

      let newOpenFile = _.cloneDeep(props.openFile)
      newOpenFile.tags = tags
      journalStore.updateOpenFile(newOpenFile, props.isCharacter)
    }
    const toolbarHeight = ref(0)
    const tagBarHeight = computed(() => {
      return window.innerWidth > 1200 ? 0 + 'px' : 18 + 'px'
    })
    const richTextHeight = computed(() => {
      return 'calc(100% -  ' + toolbarHeight.value + 'px ' + ' - ' + tagBarHeight.value + ')'
    })

    onMounted(() => {
      toolbarHeight.value =
        (document.getElementsByClassName('ql-toolbar').item(0) as any)?.offsetHeight || 0
    })
    async function close() {
      let ret = await journalStore.closeOpenFile(props.isCharacter)
    }
    const sidebar = ref(false)

    return {
      modal,
      userStore,
      props,
      designStore,
      updateHtmlEntry,
      updateFileName,
      journalStore,
      updateTags,
      close,
      showToast,
      updateBioEntry,
      toolbarHeight,
      richTextHeight,
      tagBarHeight,
      sidebar
    }
  },
  components: {
    NoFileOpen,
    RichTextEntry,
    StatBlockTags,
    LinkedEntries,
    CustomModal,
    BasicInput,
    BButton,
    AreYouSure,
    JournalTags,
    BookmarkedEntries,
    BToast,
    BioEntry,
    ChartEntry,
    ImageEntry,
    BOffcanvas
  }
}
</script>

<template>
  <div
    :style="{ fontFamily: designStore.font }"
    style="flex-grow: 1; display: flex; flex-direction: column; width: 100%"
  >
    <NoFileOpen v-if="!props.openFile.id" :openCreateFile="props.openCreateFile"></NoFileOpen>
    <div v-else style="display: flex; flex-direction: column; height: 100%">
      <BookmarkedEntries
        style="z-index: 2"
        :openFile="props.openFile"
        :isCharacter="props.isCharacter"
      ></BookmarkedEntries>
      <div
        style="
          display: flex;
          padding: 0.5rem;
          font-size: x-large;
          justify-content: space-between;
          z-index: 3;
        "
        :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
      >
        <div
          @click="modal = true"
          class="entryTitle"
          :style="{ fontFamily: designStore.titleFont }"
        >
          {{ props.openFile.name }}
        </div>
        <div class="arrangeButtons">
          <div class="largeDisplayTags">
            <StatBlockTags
              :justReturnTags="true"
              :isEditing="true"
              :currentStatBlock="props.openFile"
              :updateTemp="(val) => updateTags(val)"
            ></StatBlockTags>
          </div>
          <div style="display: flex; flex-wrap: nowrap">
            <BButton
              @click="journalStore.saveBookmarkedEntry(props.openFile)"
              class="tagButtons"
              style="cursor: pointer; display: flex; height: min-content"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              ><i class="bi bi-bookmark"></i>
              <div class="dissapearingText" style="padding-left: 0.25rem">Bookmark</div></BButton
            >
            <BButton
              @click="close()"
              class="tagButtons"
              style="cursor: pointer; display: flex; height: min-content"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              ><i class="bi bi-x-lg"></i>
              <div class="dissapearingText" style="padding-left: 0.25rem">Close</div></BButton
            >
            <AreYouSure
              :passed-function="journalStore.deleteFileFromFirebase"
              action="permanently delete this file"
              :passed-val="props.openFile.id"
              :passed-val2="props.isCharacter"
            >
              <BButton
                class="tagButtons"
                style="cursor: pointer; display: flex; height: min-content"
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                ><i class="bi bi-file-x"></i>
                <div class="dissapearingText" style="padding-left: 0.25rem">Delete</div></BButton
              >
            </AreYouSure>
            <div class="divider" :style="{ borderColor: designStore.secondaryTheme }"></div>
            <BButton
              @click="sidebar = true"
              class="linkSidebarButton"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
            >
              <i class="bi bi-link-45deg"></i> Links
            </BButton>
            <BOffcanvas
              v-model="sidebar"
              :teleportDisabled="false"
              :backdrop="true"
              placement="end"
              shadow="false"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                '--bs-btn-close-color': designStore.primaryText
              }"
            >
              <LinkedEntries
                :isCharacter="props.isCharacter"
                style="width: 100%; padding: 0.5rem"
                :open-file="props.openFile"
              ></LinkedEntries>
            </BOffcanvas>
          </div>
        </div>
      </div>
      <div style="display: flex; width: 100%; height: 100%">
        <div style="display: flex; flex-direction: column; height: 100%; flex-grow: 1">
          <rich-text-entry
            :style="{ height: richTextHeight }"
            :form-val="openFile.journalEntryData.data"
            :send-updates="updateHtmlEntry"
            v-if="props.openFile.type === 'html'"
          ></rich-text-entry>
          <BioEntry
            :send-updates="updateBioEntry"
            :open-file="openFile"
            v-if="props.openFile.type === 'bio'"
          ></BioEntry>
          <ChartEntry
            :send-updates="updateBioEntry"
            :open-file="openFile"
            v-if="props.openFile.type === 'chart'"
          ></ChartEntry>
          <ImageEntry
            :send-updates="updateBioEntry"
            :open-file="openFile"
            v-if="props.openFile.type === 'image'"
          ></ImageEntry>
          <div
            class="tagBar"
            :style="{ marginTop: toolbarHeight + 'px', background: designStore.primaryTheme }"
          >
            <JournalTags
              style="width: 100%"
              :tagsOg="props.openFile.tags"
              :updateTemp="(val) => updateTags(val)"
            ></JournalTags>
          </div>
        </div>
        <LinkedEntries
          :isCharacter="props.isCharacter"
          class="wrapSidebarLinkedEntries"
          :open-file="props.openFile"
        ></LinkedEntries>
      </div>
    </div>
    <CustomModal
      :show-modal="modal"
      title="Edit File Name"
      @close="modal = false"
      :close-on-enter="true"
    >
      <template v-slot:body
        ><BasicInput
          label="Name"
          :value="props.openFile.name"
          @new-value="(val) => updateFileName(val)"
        ></BasicInput
      ></template>
    </CustomModal>

    <Teleport to="body">
      <div class="toast-container position-fixed p-3 bottom-0 end-0">
        <BToast
          v-model="showToast"
          :style="{
            background: designStore.alertTheme,
            color: designStore.primaryText,
            borderColor: designStore.alertTheme
          }"
          pos="bottom-0 end-0"
          solid
        >
          <i class="bi bi-floppy"></i> {{ journalStore.toast }}
        </BToast>
      </div>
    </Teleport>
  </div>
</template>

<style>
.rulesReferenceContainer {
  display: flex;
}

.entryTitle {
  font-size: 1.75rem;
  cursor: pointer;
  min-width: 15rem;
  align-self: center;
}
.linkSidebarButton {
  display: none;
  border-radius: 0.275rem;
  padding: 0.25rem;
  margin: 0.25rem;
  font-size: medium;
  border: 2px solid;
  cursor: pointer;
  height: min-content;
}

.wrapSidebarLinkedEntries {
  flex-grow: 1;
}

.richTextHeight {
  max-height: calc(100vh - 20.7rem);
}
@media (max-width: 1694px) {
  .richTextHeight {
    max-height: calc(100vh - 25.05rem);
  }
}

.tagButtons {
  border-radius: 0.275rem;
  padding: 0.25rem;
  margin: 0.25rem;
  font-size: medium;
  border: 2px solid;
  cursor: pointer;
  display: flex;
  height: min-content;
}
.divider {
  display: none;
  border: 1px solid;
  margin: 0.25rem;
  margin-top: 0;
  margin-bottom: 0;
}
.tagBar {
  display: none;
}
.arrangeButtons {
  display: flex;
}

@media (max-width: 600px) {
  .entryTitle {
    min-width: 6rem;
    font-size: 1.25rem;
  }
  .tagButtons {
    border-radius: 0.275rem;
    padding: 0.25rem;
    margin: 0.25rem;
    font-size: small;
    border: 2px solid;
    cursor: pointer;
    display: flex;
    height: min-content;
  }
}
@media (max-width: 1200px) {
  .tagBar {
    display: block;
    z-index: 5;
    overflow: hidden;
    width: inherit;
  }
  @media (max-width: 520px) {
    .richTextHeight {
      max-height: calc(100vh - 30.5rem);
    }
    .tagBar {
      display: block;
      z-index: 5;
      overflow: hidden;
      width: inherit;
    }
    .dissapearingText {
      display: none;
    }
    .entryTitle {
      min-width: 5rem;
      font-size: 1rem;
    }
  }
  .arrangeButtons {
    display: flex;
  }
  .wrapSidebarLinkedEntries {
    display: none;
  }
  .linkSidebarButton {
    display: flex;
  }
  .divider {
    display: block;
  }
  .largeDisplayTags {
    display: none;
  }
}
</style>
