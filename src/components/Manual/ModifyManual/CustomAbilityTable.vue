<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'
import { Ref, ref } from 'vue'

import CustomPagination from '@/components/CustomPagination.vue'

import { ABILITY_ENTRY } from '@/bases.ts'
import AreYouSure from '@/components/AreYouSure.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useManualStore } from '@/stores/manualStore.ts'
import _ from 'lodash'
import CustomCheckbox from '../../Character/CustomCheckbox.vue'

export default {
  emits: ['ability'],
  props: ['edit'],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const manualStore = useManualStore()
    const stagedAbilityEntry = ref(_.cloneDeep(ABILITY_ENTRY))
    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'type', 'playerAccessible', 'statBlockAccessible']
    const filter = ref('')
    const fields = ref([
      { key: 'groupIcon', label: 'Icon' },
      { key: 'name', label: 'Name' },
      { key: 'type', label: 'Type' },
      { key: 'rank', label: 'Rank' },
      // { key: 'playerAccessible', label: 'playerAccessible?' },
      // { key: 'statBlockAccessible', label: 'statBlockAccessible?' },
      { key: 'actions', label: 'Actions' }
    ])

    function setstagedAbilityEntry(effigy) {
      stagedAbilityEntry.value = effigy
    }

    const selectedTabs: Ref<Array<any>> = ref([])
    const totalRows = ref(manualStore.getCustomAbilities?.length)
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
      stagedAbilityEntry,
      setstagedAbilityEntry,
      manualStore
    }
  },
  components: {
    BFormInput,
    CustomPagination,
    BTable,
    BButton,
    AreYouSure,
    CustomCheckbox
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
      :items="manualStore.getCustomAbilities"
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
        </div>
      </template>
      <template #cell(groupIcon)="data">
        <v-icon scale="1.5" :name="data.item.groupIcon"></v-icon>
      </template>
      <template #cell(rank)="data">
        <div style="width: 2rem; text-align: center">{{ data.item.rank }}</div>
      </template>
      <template #cell(playerAccessible)="data">
        {{ data.item.playerAccessible }}
      </template>
      <template #cell(statBlockAccessible)="data">
        <CustomCheckbox
          :isChecked="data.item.statBlockAccessible"
          @true="console.log(true)"
          @false="console.log(false)"
        ></CustomCheckbox>
      </template>
      <template #cell(actions)="data">
        <AreYouSure
          :passedFunction="() => {}"
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
