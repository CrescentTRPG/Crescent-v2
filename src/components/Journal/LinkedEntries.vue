<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import _ from 'lodash'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'

import { useJournalStore } from '@/stores/journalStore.ts'
import StatBlockTags from '../Adventure/Stat Blocks/StatBlockTags.vue'
import CustomModal from '../CustomModal.vue'
import CustomPagination from '../CustomPagination.vue'
import EditLink from './EditLink.vue'

export default {
  props: ['openFile', 'isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const journalStore = useJournalStore()
    const linkedEntries: any = computed(() => {
      return Object.values(props.openFile.linkedEntries as any)
    })
    const linkedBy: any = computed(() => {
      return Object.values(journalStore.journalIdKey[props.openFile.id].linkedBy)
    })
    const journalEntries: any = computed(() => {
      return Object.values(journalStore.journalIdKey as any)
    })

    const filterOn = ['name', 'type', 'tags']
    const filter = ref('')
    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'tags', label: 'Tags' },
      { key: 'actions', label: 'Link' }
    ])
    function LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    function removeLink(linkedId, linkingId) {
      let newOpenFile = _.cloneDeep(props.openFile)
      delete newOpenFile.linkedEntries[linkedId]
      journalStore.updateOpenFile(newOpenFile, props.isCharacter)
      journalStore.deleteJournalIDKeyLinkedBy(linkedId, linkingId)
    }
    function tableBg() {
      if (parseInt(designStore.inputBacking.substring(1), 16) >= 3000000) {
        return LightenDarkenColor(designStore.inputBacking, 10)
      }
      return LightenDarkenColor(designStore.inputBacking, -10)
    }
    const currentPage = ref(1)
    const perPage = ref(10)

    const totalRows = ref(journalEntries?.value?.length)
    function onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      totalRows.value = filteredItems.length
      currentPage.value = 1
    }

    function linkFile(id, relation) {
      let newOpenFile = _.cloneDeep(props.openFile)
      newOpenFile.linkedEntries[id] = { id: id, relationship: relation }
      journalStore.updateOpenFile(newOpenFile, props.isCharacter)
      journalStore.updateJournalIDKeyLinkedBy(id, props.openFile.id, relation)
    }

    function getIcon(type) {
      switch (type || '') {
        case 'html':
          return 'bi bi-file'
        case 'image':
          return 'bi bi-file-image'
        case 'bio':
          return 'bi bi-file-post'
        case 'timeline':
          return 'bi bi-calender-4-range'
        default:
          return 'bi bi-file'
      }
    }
    return {
      modal,
      userStore,
      props,
      designStore,
      journalStore,
      linkedEntries,
      linkedBy,
      journalEntries,
      filter,
      filterOn,
      fields,
      tableBg,
      totalRows,
      currentPage,
      perPage,
      onFiltered,
      getIcon,
      linkFile,
      removeLink
    }
  },
  components: {
    BButton,
    CustomModal,
    BTable,
    CustomPagination,
    StatBlockTags,
    EditLink,
    BFormInput
  }
}
</script>

<template>
  <div
    class="linkedEntriesContainer"
    :style="{ background: designStore.sidebarBacking, color: designStore.sidebarText }"
  >
    <div style="display: flex; justify-content: space-between; margin: 0.25rem">
      <div :style="{ fontFamily: designStore.titleFont }" style="font-size: large">
        Linked Entries
        <i
          :style="{ color: designStore.secondaryTheme }"
          style="font-size: 2rem; position: relative; right: 0.25rem; top: 0.5rem"
          class="bi bi-link-45deg"
        ></i>
      </div>
      <BButton
        @click="modal = true"
        style="border: 1px solid; padding: 0.25rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <i style="font-size: 1.25rem" class="bi bi-plus"></i
        ><i style="font-size: 1.25rem" class="bi bi-link-45deg"></i>
      </BButton>
    </div>
    <hr :style="{ borderColor: designStore.secondaryTheme }" />

    <div v-if="linkedEntries.length < 1" style="display: flex; justify-content: center">
      <div
        style="
          display: flex;
          padding: 0.25rem;
          margin: 0.25rem;
          width: fit-content;
          font-size: large;
        "
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center">
          <div>No Links</div>
        </div>
        <v-icon name="gi-breaking-chain" scale="2"></v-icon>
      </div>
    </div>
    <div v-else>
      <div
        v-for="linkedEntry in linkedEntries"
        :key="linkedEntry.id"
        style="margin-bottom: 1rem"
        :style="{ color: designStore.alertTheme }"
      >
        <div style="display: flex">
          <i
            @click="removeLink(linkedEntry.id, props.openFile.id)"
            :style="{ color: designStore.sidebarText }"
            class="bi bi-x-lg"
            style="padding-right: 0.25rem; cursor: pointer; margin-left: 0.5rem"
          ></i>
          <div
            style="text-decoration: underline; cursor: pointer"
            @click="journalStore.openNewFile(linkedEntry.id, props.isCharacter)"
          >
            {{ journalStore.journalIdKey[linkedEntry.id].name + ' - ' + linkedEntry.relationship }}
          </div>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; margin: 0.25rem">
      <div
        :style="{ fontFamily: designStore.titleFont }"
        style="font-size: large; display: flex; margin-bottom: -1rem"
      >
        Linked By
        <div style="transform: scaleX(-1)">
          <i
            :style="{ color: designStore.secondaryTheme }"
            style="font-size: 2rem; position: relative; bottom: 0.5rem; transform: scaleX(-1)"
            class="bi bi-link-45deg"
          ></i>
        </div>
      </div>
    </div>
    <hr :style="{ borderColor: designStore.secondaryTheme }" />
    <div v-if="linkedBy.length < 1" style="display: flex; justify-content: center">
      <div
        style="
          display: flex;
          padding: 0.25rem;
          margin: 0.25rem;
          width: fit-content;
          font-size: large;
        "
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center">
          <div>Not Linked</div>
        </div>
        <v-icon name="gi-nested-hearts" scale="2"></v-icon>
      </div>
    </div>
    <div v-else>
      <div
        v-for="linkedEntry in linkedBy"
        :key="linkedEntry.id"
        :style="{ color: designStore.alertTheme }"
      >
        <div style="display: flex; padding-left: 0.5rem">
          <div
            style="text-decoration: underline; cursor: pointer"
            @click="journalStore.openNewFile(linkedEntry.id, props.isCharacter)"
          >
            {{ journalStore.journalIdKey[linkedEntry.id].name + ' - ' + linkedEntry.relationship }}
          </div>
        </div>
      </div>
    </div>
    <CustomModal :show-modal="modal" @close="modal = false" title="Link Entries">
      <template v-slot:body>
        <BFormInput
          class="inputSearch"
          placeholder="Search..."
          v-model="filter"
          style="border-radius: 0; border: none; border-bottom: 2px solid"
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
        ></BFormInput>
        <BTable
          :items="journalEntries.filter((a) => a.id != props.openFile.id)"
          @filtered="onFiltered"
          striped
          :style="{
            fontFamily: designStore.font,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking,
            '--bs-table-striped-bg': tableBg()
          }"
          :sort-internal="true"
          :filter="filter"
          :filterable="filterOn"
          :per-page="perPage"
          :current-page="currentPage"
          headerTitle="Abilities"
          class="tableClass mobile"
          :fields="fields"
        >
          <template #cell(name)="data">
            <i :class="getIcon(data.item.name)"></i> {{ data.item.name }}
          </template>
          <template #cell(tags)="data">
            <StatBlockTags
              style="display: flex; justify-content: flex-start"
              :currentStatBlock="{ tags: data.item.tags }"
            ></StatBlockTags>
          </template>
          <template #cell(actions)="data">
            <EditLink
              :linkProspect="data.item"
              :openFile="openFile"
              :isLinked="linkedEntries.includes(data.item.id)"
              :linkFile="linkFile"
            ></EditLink>
          </template>
        </BTable>
        <CustomPagination
          style="margin-top: -1rem"
          @currentPage="(page) => (currentPage = page)"
          :currentPage="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
        ></CustomPagination>
      </template>
    </CustomModal>
  </div>
</template>

<style>
.linkedEntriesContainer {
  width: 15%;
  height: calc(100%);
  min-width: 15rem;
}
</style>
