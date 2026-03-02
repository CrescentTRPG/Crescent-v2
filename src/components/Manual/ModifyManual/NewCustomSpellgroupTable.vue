<script lang="ts">
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import AreYouSure from '@/components/AreYouSure.vue'
import CustomModal from '@/components/CustomModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'

import { Ref, ref } from 'vue'

export default {
  emits: ['ability'],
  props: ['updateSpell', 'spells', 'deleteSpell', 'icon'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()

    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'rank', 'type', 'actionCost']
    const filter = ref('')
    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'actionCost', label: 'Action Cost' },
      { key: 'area', label: 'Area' },
      { key: 'target', label: 'Target' },
      { key: 'type', label: 'Type' },
      { key: 'duration', label: 'Duration' },
      { key: 'resistances', label: 'Resistances' },
      { key: 'actions', label: 'Actions' }
    ])

    function showModal(id: number) {
      currentModal.value = id
      modal.value = !modal.value
    }

    const selectedTabs: Ref<Array<any>> = ref([])
    const totalRows = ref(props.spells.length)
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
      props,
      showModal
    }
  },
  components: {
    BFormInput,
    CustomPagination,
    BTable,
    BButton,
    AreYouSure,
    CustomModal,
    AbilityDisplay
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
      headerTitle="Spells"
      class="tableClass mobile"
      :fields="fields"
      :items="spells"
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
            @click="showModal(data.index)"
            >{{ data.item.name + ' - ' + data.item.rank }}</BButton
          >

          <CustomModal
            :showModal="modal && currentModal == data.index"
            :title="data.item.name + ' - ' + data.item.rank"
            @close="showModal(data.index)"
          >
            <template v-slot:body>
              <AbilityDisplay
                :medallion="icon"
                :description="data.item.description"
                :area="data.item.area"
                :duration="data.item.duration"
                :action-cost="data.item.actionCost"
                :resistance="data.item.resistance"
                :target="data.item.target"
                :type="data.item.type"
              ></AbilityDisplay>
            </template>
          </CustomModal>
        </div>
      </template>

      <template #cell(actions)="data">
        <div style="display: flex">
          <BButton
            @click="
              updateSpell({
                name: data.item.name,
                actionCost: data.item.actionCost,
                area: data.item.area,
                target: data.item.target,
                duration: data.item.duration,
                type: data.item.type,
                resistance: data.item.resistance,
                description: data.item.description,
                rank: data.item.rank
              })
            "
            style="border: 1px solid; border: 2px solid; text-align: left; margin-right: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            ><i class="bi bi-pen"></i
          ></BButton>
          <AreYouSure
            :passedFunction="deleteSpell"
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
        </div>
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

<style></style>
