<script lang="ts">
import { BInputGroup, BFormInput, BInputGroupText, BButton, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import CustomModal from '@/components/CustomModal.vue'
import { useUserStore } from '@/stores/userStore.ts'

import CustomPagination from '@/components/CustomPagination.vue'

import { Item, useEquipmentStore } from '@/stores/equipmentStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useEffigyStore } from '@/stores/effigyStore.ts'
import CustomCheckbox from '../CustomCheckbox.vue'
import AreYouSure from '@/components/AreYouSure.vue'

export default {
  emits: ['ability'],
  props: ['edit'],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const effigyStore = useEffigyStore()
    const stagedEffigy: Ref<Item> = ref({
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
    const filterOn = ['name', 'type', 'formed', 'level']
    const filter = ref('')
    const fields = ref([
      { key: 'groupIcon', label: 'Icon' },
      { key: 'name', label: 'Name' },
      { key: 'level', label: 'Level' },
      { key: 'formed', label: 'Formed?' },
      { key: 'actions', label: 'Actions' }
    ])
    function showModal(index) {
      currentModal.value = index
      viewCreatureModal.value = true
    }

    function setStagedEffigy(effigy) {
      stagedEffigy.value = effigy
    }

    const selectedTabs: Ref<Array<any>> = ref([])
    const totalRows = ref(effigyStore.getEffigies?.length)
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
      props,
      stagedEffigy,
      setStagedEffigy,
      viewCreatureModal,
      effigyStore,
      showModal
    }
  },
  components: {
    BFormInput,
    CustomPagination,
    BTable,
    BButton,
    CustomModal,
    CustomCheckbox,
    AreYouSure
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
      headerTitle="Effigies"
      class="tableClass mobile"
      :fields="fields"
      :items="effigyStore.getEffigies"
    >
      <template #cell(name)="data">
        <div>
          <BButton
            class="nameButton mobile"
            style="border: 1px solid; width: 100%; border: 2px solid; text-align: left"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="props.edit(data.item.name)"
            >{{ data.item.name }}</BButton
          >
          <CustomModal
            :showModal="viewCreatureModal && currentModal == data.index"
            :title="data.item.name"
            @close="viewCreatureModal = false"
          >
            <template v-slot:body> hi </template>
            <template v-slot:footer> </template>
          </CustomModal>
        </div>
      </template>
      <template #cell(groupIcon)="data">
        <v-icon scale="1.5" :name="data.item.groupIcon"></v-icon>
      </template>
      <template #cell(level)="data">
        <div style="width: 2rem; text-align: center">{{ data.item.level }}</div>
      </template>
      <template #cell(formed)="data">
        <CustomCheckbox
          style="margin-left: 0.75rem; margin-right: 1rem"
          :is-checked="data.item.formed"
          @true="effigyStore.updateFormed(data.item.name, true)"
          @false="effigyStore.updateFormed(data.item.name, false)"
        ></CustomCheckbox>
      </template>
      <template #cell(actions)="data">
        <AreYouSure
          :passedFunction="effigyStore.removeEffigy"
          :passedVal="data.item.name"
          :action="'delete ' + data.item.name + ''"
        >
          <BButton
            style="border: 2px solid"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            ><i class="bi bi-x-lg"></i
          ></BButton>
        </AreYouSure>
      </template>
    </BTable>

    <CustomPagination
      @currentPage="(page) => (currentPage = page)"
      :currentPage="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
    ></CustomPagination>
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
