<script lang="ts">
import { HTMLJournalEntry, JOUNRAL_ENTRY, JournalEntry } from '@/bases.ts'
import CustomModal from '@/components/CustomModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import ImagePicker from '@/components/ImagePicker.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useJournalStore } from '@/stores/journalStore.ts'
import { BButton, BTable } from 'bootstrap-vue-next'
import BCard from 'bootstrap-vue-next/src/components/BCard/BCard.vue'
import BCardImg from 'bootstrap-vue-next/src/components/BCard/BCardImg.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import _ from 'lodash'
import { computed, ComputedRef, Ref, ref } from 'vue'
import StatBlockTags from './StatBlockTags.vue'

export default {
  props: ['currentStatBlock', 'isEditing', 'updateTemp', 'collapsable'],
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
    const entryModal = ref(false)
    const viewEntryModal = ref(false)
    const entryToView: Ref<JournalEntry> = ref(JOUNRAL_ENTRY)
    async function viewEntry(id) {
      entryToView.value = (await journalStore.getFile(id, false)) as JournalEntry
      viewEntryModal.value = true
    }

    const description = ref(props.currentStatBlock.description || '')
    const journalEntryArr: ComputedRef<Array<JournalEntry>> = computed(() => {
      return Object.values(props.currentStatBlock.journalEntry || {})
    })
    const journalStore = useJournalStore()
    const journalEntries: any = computed(() => {
      return Object.values(journalStore.journalIdKey as any)
    })
    const collapsed = ref(true)
    function setImage() {
      let newTemp = { ...props.currentStatBlock }
      newTemp.image = img.value
      props.updateTemp(newTemp)
      modal.value = false
    }
    function updateDescription() {
      let newTemp = { ...props.currentStatBlock }
      newTemp.description = description.value
      props.updateTemp(newTemp)
    }

    const currentPage = ref(1)
    const perPage = ref(10)

    const totalRows = ref(journalEntries?.value?.length)
    function onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      totalRows.value = filteredItems.length
      currentPage.value = 1
    }

    const filterOn = ['name', 'type', 'tags']
    const filter = ref('')
    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'tags', label: 'Tags' },
      { key: 'actions', label: 'Link' }
    ])
    function tableBg() {
      if (parseInt(designStore.inputBacking.substring(1), 16) >= 3000000) {
        return LightenDarkenColor(designStore.inputBacking, 10)
      }
      return LightenDarkenColor(designStore.inputBacking, -10)
    }
    function LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
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

    function linkFile(id, name, type) {
      let statBlockCp = _.cloneDeep(props.currentStatBlock)
      statBlockCp.journalEntry[id] = { id: id, name: name, type: type }
      props.updateTemp(statBlockCp)
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
      updateDescription,
      journalEntryArr,
      entryModal,
      journalStore,
      journalEntries,
      onFiltered,
      perPage,
      currentPage,
      totalRows,
      filterOn,
      filter,
      fields,
      tableBg,
      linkFile,
      getIcon,
      entryToView,
      viewEntryModal,
      viewEntry
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
    CustomModal,
    BTable,
    CustomPagination,
    BFormInput,
    StatBlockTags
  }
}
</script>
<template>
  <div>
    <CustomModal
      :title="entryToView.name"
      :showModal="viewEntryModal"
      @close="viewEntryModal = false"
    >
      <template v-slot:body>
        <div v-if="entryToView.type === 'html'">
          <div
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            style="padding: 0.5rem"
          >
            <div v-html="(entryToView.journalEntryData as HTMLJournalEntry).data"></div>
          </div></div
      ></template>
    </CustomModal>
    <div
      @click="collapsed = !collapsed"
      v-if="collapsed && props.collapsable"
      style="
        max-width: fit-content;
        flex-grow: 1;
        border: 2px solid;
        border-top: 0;
        padding: 0.25rem;
        padding-top: 0.5rem;
        display: flex;
      "
      :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
    >
      <i
        style="font-size: x-large; margin: -0.25rem; margin-top: 0"
        class="bi bi-arrow-bar-left"
      ></i>

      <i style="font-size: x-large" class="bi bi-file-person"></i>
    </div>
    <div class="bioCont" v-if="!collapsed || !props.collapsable">
      <div
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
            v-if="props.collapsable"
            @click="collapsed = !collapsed"
            class="bi bi-arrow-bar-right"
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
          <TitleMedallion :inline="true"
            ><template v-slot:dropdown>
              <BButton
                @click="entryModal = true"
                style="margin-bottom: 0; margin-top: -0.25rem; font-size: large; display: flex"
                :style="{ background: designStore.sidebarBacking, color: designStore.sidebarText }"
                >Entries <i class="bi bi-plus-lg" style="margin-left: 0.5rem"></i
              ></BButton>
            </template>
          </TitleMedallion>
          <CustomModal
            title="Link Journal Entry"
            :showModal="entryModal"
            @close="entryModal = false"
          >
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
                :items="journalEntries"
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
                  <BButton
                    :style="{
                      background: designStore.primaryTheme,
                      color: designStore.primaryText
                    }"
                    @click="linkFile(data.item.id, data.item.name, data.item.type)"
                    >Link File <i class="bi bi-link"></i
                  ></BButton>
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

          <div
            style="margin-left: 1rem; text-decoration: underline"
            v-for="j in journalEntryArr"
            :key="j.name"
          >
            <a @click="viewEntry(j.id)">{{ j.name }}</a>
          </div>

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
          <TitleMedallion :inline="true" title="Entries"> </TitleMedallion>

          <div
            style="margin-left: 1rem; text-decoration: underline"
            v-for="j in journalEntryArr"
            :key="j.id"
          >
            <a @click="viewEntry(j.id)">{{ j.name }}</a>
          </div>
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
.bioCont {
  position: static;
  z-index: 5;
  margin-left: -17rem;
  height: 100%;
}
.biobio {
  position: relative;
  max-width: 20rem;
  height: 100%;
  padding: 1rem;
  flex-grow: 1;
  border: 2px solid;
  border-top: 0;
  display: flex;
  flex-direction: column;
}
@media (max-width: 1200px) {
  .bioCont {
    margin-left: 0;
    position: block;
    width: 92%;
  }
  .biobio {
    position: block;

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
