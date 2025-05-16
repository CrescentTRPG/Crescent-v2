<script lang="ts">
import { BInputGroup, BFormInput, BInputGroupText, BButton, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useSkillStore } from '@/stores/skillsStore'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import CustomModal from '@/components/CustomModal.vue'
import { useUserStore } from '@/stores/userStore'

import CustomPagination from '@/components/CustomPagination.vue'

import ArrayTabs from '@/components/ArrayTabs.vue'
import { Item, useEquipmentStore } from '@/stores/equipmentStore'
import TitleWidget from '@/components/TitleWidget.vue'
import BButtonGroup from 'bootstrap-vue-next/src/components/BButton/BButtonGroup.vue'

import { GiConsoleController } from 'oh-vue-icons/icons/gi'
import { useFaunaStore } from '@/stores/faunaStore'
import { useDesignStore } from '@/stores/designStore'
import TraitDisplay from './TraitDisplay.vue'
import CreatureDisplay from './CreatureDisplay.vue'

export default {
  emits: ['ability'],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const faunaStore = useFaunaStore()
    const stagedItem: Ref<Item> = ref({
      name: '',
      count: 0,
      description: '',
      type: 'Generic',
      isAttuneable: false,
      isAttuned: false,
      equippedStats: {
        ability: {
          name: ''
        },
        passives: {},
        material: '',
        enchantments: {},
        technicalAddons: {},
        materialCoverings: {}
      }
    })
    const viewCreatureModal = ref(false)

    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'type', 'isAttuned']
    const filter = ref('')
    const fields = ref([
      { key: 'Name', label: 'Name' },
      { key: 'groupIcon', label: 'Type' },
      // { key: 'adaptations', label: 'Adaptations' },
      // { key: 'Traits', label: 'Traits' },
      { key: 'actions', label: 'Actions' }
    ])
    function showModal(index) {
      currentModal.value = index
      viewCreatureModal.value = true
    }

    function setStagedItem(item: Item) {
      stagedItem.value = item
    }

    const selectedTabs: Ref<Array<any>> = ref([])

    const totalRows = ref(faunaStore.getCreatures?.length)
    return {
      designStore,
      userStore,
      characterStore,
      currentPage,
      perPage,
      currentModal,
      modal,
      filterOn,
      filter,
      fields,
      totalRows,
      selectedTabs,
      infoModal,

      stagedItem,

      setStagedItem,
      viewCreatureModal,
      faunaStore,
      showModal
    }
  },
  components: {
    BFormInput,
    CustomPagination,
    BTable,
    BButton,
    CustomModal,
    CreatureDisplay
  },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    },
    tableBg() {
      if (parseInt(this.designStore.inputBacking.substring(1), 16) >= 3000000) {
        return this.LightenDarkenColor(this.designStore.inputBacking, 10)
      }
      return this.LightenDarkenColor(this.designStore.inputBacking, -10)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    showInfoModal() {
      this.infoModal = !this.infoModal
    }
  }
}
</script>

<template>
  <div
    style="border-left: 2px solid; margin-left: -2px"
    :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
  >
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
      :items="faunaStore.getCreatures"
    >
      <template #cell(Name)="data">
        <div>
          <BButton
            class="nameButton mobile"
            style="border: 1px solid; width: 100%; border: 2px solid; text-align: left"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="showModal(data.index)"
            >{{ data.item.Name }}</BButton
          >
          <CustomModal
            :showModal="viewCreatureModal && currentModal == data.index"
            :title="data.item.Name"
            @close="viewCreatureModal = false"
          >
            <template v-slot:body>
              <CreatureDisplay :creature="data.item"></CreatureDisplay>
            </template>
            <template v-slot:footer>
              <!-- ><BButton
                style="border: 1px solid; margin-right: 0.5rem"
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                @click="editItem(data.item)"
                >Edit Item</BButton
              ><BButton
                style="border: 1px solid"
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                @click="deleteItem(data.item)"
                >Delete Item</BButton
              > -->
            </template>
          </CustomModal>
        </div>
      </template>
      <template #cell(groupIcon)="data">
        <v-icon scale="1.5" :name="data.item.groupIcon"></v-icon>
      </template>
      <!-- <template #cell(adaptations)="data">
        <div style="margin-left: 1rem; margin-top: 0.5rem">
          {{ data.item.adaptations || 'None' }}
        </div>
      </template> -->
      <!-- <template #cell(Traits)="data">
        <div style="margin-left: 1rem; margin-top: 0.5rem; display: flex; flex-wrap: wrap">
          <div
            v-for="(trait, index) in data.item.Traits"
            :key="index"
            style="padding-right: 0.25rem; display: flex"
          >
            <TraitDisplay :trait="trait"></TraitDisplay>
          </div>
        </div>
      </template> -->
      <template #cell(actions)="data">
        <BButton
          style="border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          v-if="data.item.isCustom"
          @click="faunaStore.removeCreature(data.item.Name)"
          ><i @click="faunaStore.removeCreature(data.item.Name)" class="bi bi-x-lg"></i
        ></BButton>
      </template>

      <!-- <template #cell(actions)="data">
       
      </template> -->
    </BTable>

    <CustomPagination
      @currentPage="(page) => (currentPage = page)"
      :currentPage="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
    ></CustomPagination>

    <!-- <CustomModal
      :showModal="deleteModal"
      :title="'Delete ' + itemToDelete.name"
      @close="deleteModal = false"
    >
      <template v-slot:body>
        Are you sure you want to delete: {{ itemToDelete.name }}? This action is irreversible.
      </template>
      <template v-slot:footer
        ><BButton
          style="border: 1px solid; margin-right: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="deleteForReal()"
          >Yes Delete</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="deleteModal = false"
          >Please Don't</BButton
        >
      </template>
    </CustomModal> -->
    <!-- <CustomModal :showModal="editItemModal" title="Edit Item" @close="editItemModal = false">
      <template v-slot:body>
        <EditItem
          @staged-item="(staged) => (stagedItem = staged)"
          :passedItem="itemToEdit"
        ></EditItem>
      </template>
      <template v-slot:footer
        ><BButton
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="saveEdits(stagedItem, itemToEdit)"
          >Edit</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="editItemModal = false"
          >Cancel</BButton
        >
      </template>
    </CustomModal> -->
  </div>
</template>

<style>
ul {
  --dropdownBg: inherit;
}
li {
  --dropdownBg: inherit;
}
.dropdown-item {
  --dropdownBg: inherit;
  background-color: var(--dropdownBg);
  background: inherit;
  color: inherit;
  --bs-dropdown-link-hover-color: inherit;
  --bs-dropdown-link-hover-bg: inherit;
  --bs-dropdown-link-active-color: inherit;
  --bs-dropdown-link-active-bg: inherit;
}
.addButton {
  padding: 0px 5px 0px 5px;
  font-size: x-large;
  border: 2px solid;
  margin-left: 0.5rem;
}
.fullGroup {
  display: block;
}
.iconGroup {
  display: none;
}
@media (max-width: 550px) {
  .addButton {
    padding: 0px 4px 0px 4px;
    font-size: large;
    border: 2px solid;
    margin: 0;
  }
  .fullGroup {
    display: none;
  }
  .iconGroup {
    display: block;
  }
}
</style>
