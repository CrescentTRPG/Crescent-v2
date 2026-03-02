<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import { BioEntry, ImageEntry, JOUNRAL_ENTRY } from '@/bases.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BOffcanvas from 'bootstrap-vue-next/src/components/BOffcanvas/BOffcanvas.vue'
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import CustomModal from '../CustomModal.vue'
import GridSelect from '../GridSelect.vue'
import CalendarSettings from './CalendarSettings.vue'
import JournalEntryContainer from './JournalEntryContainer.vue'
import JournalHeader from './JournalHeader.vue'
import JournalSidebarNavigate from './JournalSidebarNavigate.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useCharacterStore } from '@/stores/characterStore.ts'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const characterStore = useCharacterStore()
    const { openFile } = storeToRefs(journalStore)

    function saveFile(path) {
      console.log('save at ' + path)
    }
    function createFile() {
      let newFile = _.cloneDeep(JOUNRAL_ENTRY)
      switch (fileType.value) {
        case 'image':
          newFile.type = 'image'
          newFile.journalEntryData = { image: '', iconData: {} } as ImageEntry
          break
        case 'chart':
          newFile.type = 'chart'
          newFile.journalEntryData = { lineData: {}, events: [] }
          break
        case 'bio':
          newFile.type = 'bio'
          newFile.journalEntryData = {
            oneLiner: '',
            date: -1,
            dateLabel: '',
            image: '',
            description: { data: '<p></p>' }
          } as BioEntry
          break
      }
      journalStore.postFile(newFile, pathForNewFile.value, props.isCharacter)
      modal.value = false
    }

    const fileType = ref('html')
    const pathForNewFile = ref('')
    const createCalendarModal = ref(false)

    function openCreateFileModal(path) {
      pathForNewFile.value = path
      modal.value = true
    }

    function closeSideBar() {
      sidebar.value = false
    }

    const options = [
      {
        name: 'Rich Text',
        value: 'html',
        icon: 'bi bi-file',
        description: 'No preset formatting, just a simple text editor'
      },
      {
        name: 'Image',
        icon: 'bi bi-file-image',
        value: 'image',
        description: 'Will only have a slot for an image, linked items, title, and tags'
      },
      {
        name: 'Chart',
        icon: 'bi bi-diagram-3',
        value: 'chart',
        disabled: true,
        description:
          'A modular chart system for representing timelines, family trees, butterfly effects etc'
      },

      {
        name: 'Bio',
        icon: 'bi bi-file-post',
        value: 'bio',
        description:
          'An entry to describe a person, place, or thing... It includes an Image, a description, a headline, a title, tags, and linked entries'
      }
    ]

    const sidebar = ref(false)
    return {
      modal,
      userStore,
      props,
      designStore,
      openFile,
      saveFile,
      createFile,
      fileType,
      options,
      openCreateFileModal,
      createCalendarModal,
      journalStore,
      sidebar,
      closeSideBar,
      characterStore
    }
  },
  components: {
    JournalSidebarNavigate,
    JournalEntryContainer,
    GridSelect,
    CustomModal,
    BButton,
    JournalHeader,
    CalendarSettings,
    BOffcanvas
  }
}
</script>

<template>
  <div style="display: flex; flex-grow: 1; height: 100%">
    <div class="sidePanelContainer">
      <div style="width: 100%" class="mobileJournalTabDissapearingItems sideBarWidth">
        <JournalSidebarNavigate
          :closeSideBar="closeSideBar"
          :openCreateFile="openCreateFileModal"
          :isCharacter="props.isCharacter"
        ></JournalSidebarNavigate>
      </div>
      <div
        class="mobileSidebar"
        :style="{ background: designStore.sidebarBacking, color: designStore.sidebarText }"
        style="height: 100%"
      >
        <a style="cursor: pointer" @click="sidebar = true"> <i class="bi bi-folder"></i></a>
        <a v-if="!props.isCharacter" style="cursor: pointer" @click="createCalendarModal = true">
          <i class="bi bi-calendar"></i
        ></a>
        <a
          v-if="!props.isCharacter || characterStore.adventure.adventureId"
          style="cursor: pointer"
        >
          <i class="bi bi-share"></i
        ></a>
      </div>
      <BOffcanvas
        v-model="sidebar"
        :teleportDisabled="false"
        shadow="false"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          '--bs-btn-close-color': designStore.primaryText
        }"
      >
        <JournalSidebarNavigate
          :isCharacter="props.isCharacter"
          :closeSideBar="closeSideBar"
          :openCreateFile="openCreateFileModal"
        ></JournalSidebarNavigate>
      </BOffcanvas>
    </div>
    <div style="flex-grow: 1; display: flex; flex-direction: column; width: 100%">
      <JournalHeader
        :isCharacter="props.isCharacter"
        :setCreateCalendarModal="(val) => (createCalendarModal = val)"
      ></JournalHeader>
      <div
        :style="{ fontFamily: designStore.font }"
        style="flex-grow: 1; display: flex; flex-direction: row; width: 100%"
      >
        <journal-entry-container
          :isCharacter="props.isCharacter"
          :openFile="openFile"
          :saveFile="saveFile"
          style="flex-grow: 1"
          :openCreateFile="openCreateFileModal"
        ></journal-entry-container>
        <CustomModal :showModal="modal" title="Select File Type" @close="modal = false">
          <template v-slot:body>
            <GridSelect
              :updateOption="(val) => (fileType = val)"
              :options="options"
              :selected="fileType"
            ></GridSelect>
          </template>
          <template v-slot:footer
            ><BButton
              style="border: 1px solid; margin-right: 0.5rem"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              @click="createFile()"
              >Create File</BButton
            ><BButton
              style="border: 1px solid"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              @click="modal = false"
              >Cancel</BButton
            ></template
          >
        </CustomModal>
        <CustomModal
          :showModal="createCalendarModal"
          title="Create Custom Calendar"
          @close="createCalendarModal = false"
        >
          <template v-slot:body>
            <CalendarSettings> </CalendarSettings>
          </template>
          <template v-slot:footer>
            <BButton
              @click="journalStore.saveCalendarToDatabase(props.isCharacter)"
              style="border: 1px solid; margin-right: 0.5rem"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: journalStore.localCalendarChanges
                  ? designStore.alertTheme
                  : designStore.secondaryTheme
              }"
              ><div style="display: flex">
                Save
                <div
                  v-if="journalStore.localCalendarChanges"
                  style="font-size: small; padding: 0.25rem"
                >
                  (Changes Detected)
                </div>
              </div>
            </BButton>
            <BButton
              @click="createCalendarModal = false"
              style="border: 1px solid"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              >Cancel</BButton
            ></template
          >
        </CustomModal>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dazzle {
  width: 0;
  height: 0;
  border-left: 4rem solid;
  border-bottom: 4rem solid transparent;
}
.dazzle2 {
  width: 1.5rem;
  height: 4.1rem;
  transform: skew(-45deg);
  position: relative;
  right: 2.5rem;
}
.mobileSidebar {
  display: none;
}
.mobileJournalTabDissapearingItems {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.sidePanelContainer {
  display: flex;
  flex-direction: column;
  width: 25%;
}
@media (max-width: 800px) {
  .mobileJournalTabDissapearingItems {
    display: none;
    flex-grow: 1;
  }
  .sidePanelContainer {
    display: flex;
    flex-direction: column;
    width: min-content;
  }
  .mobileSidebar {
    width: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 1.25rem;
  }
  .mobileSidebarItems {
    cursor: pointer;
  }
}
@media (min-width: 1900px) {
  .sideBarWidth {
    min-width: 25rem;
  }
}
.sideBarWidth {
  min-width: 15rem;
}
</style>
