<script lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import _ from 'lodash'
import { useManualStore } from '@/stores/manualStore.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import { storeToRefs } from 'pinia'
import JournalEntryOnSidebar from './JournalEntryOnSidebar.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'

export default {
  props: [
    'folderNames',
    'folder',
    'path',
    'padding',
    'showFolder',
    'showFiles',
    'openCreateFile',
    'isCharacter'
  ],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const { entryMap, openFolders } = storeToRefs(journalStore)
    const render = ref(false)
    function getNameFromPath(path) {
      let arr = path.split('\\')
      return arr[arr.length - 1]
    }
    function show() {
      context.emit('showFiles', !props.showFiles)
    }

    function startDrag(event, journalEntry, index) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('id', journalEntry.id)
      event.dataTransfer.setData('path', journalEntry.path)
      event.dataTransfer.setData('index', journalEntry.index)

      context.emit('dragged', journalEntry)
    }
    let draggedItem = ref('')

    function onDrop(event) {
      folderStyle.value = false
      if (event.dataTransfer.getData('index')) {
        journalStore.moveFile(
          props.path,
          event.dataTransfer.getData('path'),
          event.dataTransfer.getData('id'),
          event.dataTransfer.getData('index'),
          props.isCharacter
        )
      } else {
        const oldPathArr = event.dataTransfer.getData('path').split('\\')
        const newPathArr = props.path.split('\\')
        const entryIds =
          event.dataTransfer.getData('entryIds') !== ''
            ? event.dataTransfer.getData('entryIds').split('\\')
            : []

        if (props.path != event.dataTransfer.getData('path')) {
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
    function startFolderDrag(event, folderPath) {
      let entryIdsString =
        props.folder.entryIds.length > 0
          ? props.folder.entryIds.reduce((val, acc) => acc + '\\' + val)
          : ''

      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('path', folderPath)
      event.dataTransfer.setData('entryIds', entryIdsString)
    }
    const folderStyle = ref(false)
    function changeFolderStyle(bool) {
      folderStyle.value = bool
    }
    const showMenu = ref(false)

    function rightClickMenu() {
      showMenu.value = true
      window.addEventListener('click', closeMenu)
    }
    function closeMenu() {
      showMenu.value = false
      window.removeEventListener('click', () => (showMenu.value = false))
    }
    const editFolderName = ref(false)
    const newFolderName = ref(getNameFromPath(props.path))
    function startEditFolderName() {
      editFolderName.value = true
      window.addEventListener('keydown', resolveEdit)
    }
    function resolveEdit(event) {
      const oldName = getNameFromPath(props.path)
      if (event.key === 'Enter') {
        event.preventDefault()
        if (
          oldName != newFolderName.value &&
          !newFolderName.value.includes('\\') &&
          newFolderName.value
        ) {
          let newPath = props.path
          newPath = newPath.substring(0, newPath.lastIndexOf(oldName)) + newFolderName.value
          console.log(newPath)
          journalStore.changeFolderName(
            props.path,
            newPath,
            newFolderName.value,
            oldName,
            props.isCharacter
          )
          editFolderName.value = false
          window.removeEventListener('keydown', resolveEdit)
        } else {
          editFolderName.value = false
          window.removeEventListener('keydown', resolveEdit)
        }
      }
    }
    return {
      modal,
      userStore,
      props,
      designStore,
      entryMap,
      render,
      getNameFromPath,
      show,
      openFolders,
      startDrag,
      onDrop,
      startFolderDrag,
      changeFolderStyle,
      folderStyle,
      showMenu,
      rightClickMenu,
      closeMenu,
      editFolderName,
      newFolderName,
      startEditFolderName,
      journalStore
    }
  },
  components: { JournalEntryOnSidebar, BFormInput }
}
</script>

<template>
  <div
    @contextmenu.prevent
    @contextmenu="rightClickMenu()"
    :style="{ fontFamily: designStore.font }"
    @drop="onDrop($event)"
    @dragenter.prevent
    @dragover.prevent
  >
    <div
      style="display: flex; flex-direction: column"
      @dragover="changeFolderStyle(true)"
      @dragexit="changeFolderStyle(false)"
    >
      <div
        v-if="showFolder"
        @dragstart="startFolderDrag($event, props.path)"
        :draggable="true"
        @dblclick="startEditFolderName()"
      >
        <a v-if="!folderStyle && !editFolderName" @click="show()" style="text-wrap: nowrap">
          <i class="bi bi-folder"></i>
          {{ getNameFromPath(props.path) }}
        </a>
        <a v-if="folderStyle" :style="{ color: designStore.alertTheme }" style="text-wrap: nowrap">
          <i class="bi bi-folder2-open"></i>
          {{ getNameFromPath(props.path) }}
        </a>
        <div v-if="editFolderName">
          <b-form-input
            style="height: 1.5rem; padding: 0"
            :style="{ background: designStore.inputBacking }"
            v-if="editFolderName"
            v-model="newFolderName"
          ></b-form-input>
        </div>
      </div>
      <div
        v-if="showMenu"
        style="
          position: absolute;
          z-index: 5;
          height: 6rem;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
        "
        :style="{ background: designStore.inputBacking }"
      >
        <a
          @click="
            journalStore.deleteFolder(
              props.path.split('\\'),
              getNameFromPath(props.path),
              props.isCharacter
            )
          "
          >delete folder</a
        >
        <a @click="journalStore.createNewFolder(props.path, props.isCharacter)">new folder</a>
        <a @click="openCreateFile(props.path)">new file</a>
      </div>
      <div
        :style="{ paddingLeft: props.padding }"
        v-if="props.showFiles"
        style="display: flex; flex-direction: column"
      >
        <JournalEntryOnSidebar
          :draggable="true"
          @dragstart="
            startDrag(
              $event,
              {
                id: folder.entryIds[i - 1],

                path: path,
                index: i - 1
              },
              i
            )
          "
          :path="props.path"
          :id="folder.entryIds[i - 1]"
          v-for="i in folder.entryIds.length"
          :key="i"
        >
        </JournalEntryOnSidebar>
      </div>
    </div>
  </div>
</template>

<style>
.rulesReferenceContainer {
  display: flex;
}
</style>
