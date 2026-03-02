<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import _ from 'lodash'
import { useJournalStore } from '@/stores/journalStore.ts'
import { storeToRefs } from 'pinia'
import FolderObject from './FolderObject.vue'
import JournalEntryOnSidebar from './JournalEntryOnSidebar.vue'
import TitleMedallion from '../TitleMedallion.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'

export default {
  props: ['openCreateFile', 'closeSideBar', 'isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const { entryMap, openFolders } = storeToRefs(journalStore)

    function getFolder(path) {
      let ret = entryMap.value
      let pathVal: string = path || ''
      let folders = pathVal.split('\\')
      folders.forEach((folderName) => {
        ret = ret[folderName]
      })
      return ret
    }
    function getFolderNames(path) {
      return Object.keys(getFolder(path))
        .filter((name) => name !== 'entryIds')
        .map((name) => path + '\\' + name)
    }
    function isParentOpen(path: string) {
      if (path.split('\\').length < 2) {
        return true
      } else {
        let parent: string = path.substring(0, path.lastIndexOf('\\'))
        if (openFolders.value.includes(parent)) {
          return true
        }
      }
    }
    function isOpen(path: string) {
      return openFolders.value.includes(path)
    }

    function resolveFolderClick(newVal: boolean, path: string) {
      if (newVal) {
        journalStore.openFolder(path)
      } else {
        journalStore.closeFolder(path)
      }
    }
    function startDrag(event, journalEntry, index) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('id', journalEntry.id)
      event.dataTransfer.setData('path', journalEntry.path)
      event.dataTransfer.setData('index', journalEntry.index)

      context.emit('dragged', journalEntry)
    }
    const rootstyle = ref(false)
    function onDrop(event) {
      rootstyle.value = false
      if (event.dataTransfer.getData('index')) {
        journalStore.moveFile(
          '',
          event.dataTransfer.getData('path'),
          event.dataTransfer.getData('id'),
          event.dataTransfer.getData('index'),
          props.isCharacter
        )
      } else {
        const oldPathArr = event.dataTransfer.getData('path').split('\\')
        const newPathArr = []
        const entryIds =
          event.dataTransfer.getData('entryIds') !== ''
            ? event.dataTransfer.getData('entryIds').split('\\')
            : []

        if ('' != event.dataTransfer.getData('path')) {
          journalStore.moveFolder(
            oldPathArr,
            oldPathArr[oldPathArr.length - 1],
            newPathArr,
            entryIds,
            props.isCharacter
          )
        }
      }
    }
    function scrollbarColor() {
      return designStore.secondaryTheme + ' ' + designStore.primaryTheme
    }

    return {
      modal,
      userStore,
      props,
      designStore,
      entryMap,
      getFolderNames,
      getFolder,
      journalStore,
      openFolders,
      isParentOpen,
      isOpen,
      resolveFolderClick,
      startDrag,
      onDrop,
      rootstyle,
      scrollbarColor
    }
  },
  components: { FolderObject, JournalEntryOnSidebar, TitleMedallion, BButton }
}
</script>

<template>
  <div
    :style="{ fontFamily: designStore.font }"
    style="width: 100%; display: flex; flex-direction: column; height: 100%"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        overflow-x: auto;

        height: 100%;
        flex-grow: 1;
        padding: 0.25rem;
      "
      :style="{
        background: designStore.sidebarBacking,
        color: designStore.sidebarText,
        scrollbarColor: scrollbarColor()
      }"
    >
      <TitleMedallion title="Files"></TitleMedallion>
      <a>Journal Web</a>
      <div v-for="folderName in journalStore.getFolderDisplay" :key="folderName">
        <div v-if="folderName !== 'entryIds'">
          <FolderObject
            :openCreateFile="openCreateFile"
            :folderNames="getFolderNames(folderName)"
            :folder="getFolder(folderName)"
            :path="folderName"
            :padding="1 + 'rem'"
            :style="{ paddingLeft: folderName.split('\\').length - 1 + 'rem' }"
            :show-folder="isParentOpen(folderName)"
            :show-files="isOpen(folderName)"
            :isCharacter="props.isCharacter"
            @showFiles="(newVal) => resolveFolderClick(newVal, folderName)"
          ></FolderObject>
        </div>
      </div>
      <JournalEntryOnSidebar
        :is-character="props.isCharacter"
        :closeSideBar="props.closeSideBar"
        :draggable="true"
        @dragstart="
          startDrag(
            $event,
            {
              id: entryMap.entryIds[i - 1],
              path: '',
              index: i - 1
            },
            i - 1
          )
        "
        :path="''"
        :id="entryMap.entryIds[i - 1]"
        v-for="i in entryMap.entryIds.length"
        :key="i"
      >
      </JournalEntryOnSidebar>

      <div
        style="flex-grow: 1; display: flex; flex-direction: column"
        @dragenter.prevent
        @dragover.prevent
        @drop="onDrop($event)"
      >
        <div
          style="
            margin: 0.5rem;
            margin-top: 0;
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            width: 100%;
          "
          @dragenter="rootstyle = true"
          @dragexit="rootstyle = false"
        >
          <div
            v-if="rootstyle"
            style="
              border: 2px solid;
              box-shadow: inset 0px 0px 10px 0px;
              flex-grow: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
            "
            :style="{ borderColor: designStore.alertTheme, color: designStore.alertTheme }"
          >
            <div style="text-align: center">Drop into root <i class="bi bi-box-seam"></i></div>
          </div>
          <div
            v-if="!rootstyle"
            style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center"
          ></div>
        </div>
      </div>
      <div style="display: flex; flex-direction: row-reverse">
        <b-button
          class="hoverableTransparantRadial"
          @click="openCreateFile('')"
          style="
            width: 4rem;
            align-self: flex-end;
            margin: -0.5rem;
            margin-right: 0;
            padding: 0.25rem;
          "
          ><i class="bi bi-file"></i><i class="bi bi-plus"></i
        ></b-button>
        <b-button
          @click="journalStore.createNewFolder('', props.isCharacter)"
          class="hoverableTransparantRadial"
          style="
            width: 4rem;
            align-self: flex-end;
            margin: -0.5rem;
            margin-right: 0;
            padding: 0.25rem;
          "
          ><i class="bi bi-folder"></i><i class="bi bi-plus"></i
        ></b-button>
      </div>
      <hr :style="{ borderColor: designStore.secondaryTheme }" />
    </div>
  </div>
</template>

<style>
.rulesReferenceContainer {
  display: flex;
}
@media (max-width: 800px) {
  .mobileJournalTabDissapearingItems {
    display: none;
  }
}
</style>
