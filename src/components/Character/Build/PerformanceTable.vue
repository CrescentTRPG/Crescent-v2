<script lang="ts">
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import ArrayTabs from '@/components/ArrayTabs.vue'
import CustomModal from '@/components/CustomModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { usePerformanceStore } from '@/stores/performanceStore.ts'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, ref } from 'vue'
import CustomCheckbox from '../CustomCheckbox.vue'

export default {
  setup() {
    const designStore = useDesignStore()
    const performanceStore = usePerformanceStore()
    const { buildDisplayAbilities, buildDisplayStyles, manualPerformanceStyles } =
      storeToRefs(performanceStore)
    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'rank', label: 'Rank', sortable: true },
      { key: 'style', label: 'Style' },
      { key: 'known', label: 'Practiced?', sortable: true }
    ])
    const selectedTabs = ref([])
    const filterOn = ['name', 'rank', 'known', 'style']
    const filter = ref('')
    const abilities = ref([])
    const modal = ref(false)
    const currentPage = ref(1)
    const perPage = ref(7)
    const currentModal = ref(0)
    const tabArray: ComputedRef<Array<any>> = computed((): Array<any> => {
      return buildDisplayStyles.value.map((group) => ({
        name: group.style,
        index: group.index
      }))
    })
    const filteredArray: ComputedRef<Array<any>> = computed((): Array<any> => {
      let ret: Array<any> = []
      if (selectedTabs.value && selectedTabs.value.length > 0) {
        selectedTabs.value.forEach((tab: { name: string; index: number }) => {
          buildDisplayStyles.value[tab.index].abilities.forEach((ability) => {
            ret.push(ability)
          })
        })
        return ret
      }
      return buildDisplayAbilities.value
    })
    const totalRows: ComputedRef<number> = computed((): number => {
      return filteredArray?.value?.length
    })

    return {
      filteredArray,
      selectedTabs,
      tabArray,
      totalRows,
      filter,
      filterOn,
      currentPage,
      perPage,
      designStore,
      performanceStore,
      fields,
      modal,
      abilities,
      currentModal,
      buildDisplayStyles,
      buildDisplayAbilities,
      manualPerformanceStyles
    }
  },
  components: {
    BFormInput,
    BTable,
    BButton,
    AbilityDisplay,
    CustomModal,
    CustomCheckbox,
    CustomPagination,
    ArrayTabs
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
    update(
      name: any,
      rank: number,
      source: any,
      known: any,
      style: string,
      groupNumber: number,
      groupStyleIndex: number,
      styleIndex: number
    ) {
      let obj = {
        name: name,
        rank: rank,
        known: known,
        source: source || '',
        style: style,
        groupNumber: groupNumber,
        groupStyleIndex: groupStyleIndex,
        styleIndex: styleIndex
      }
      this.performanceStore.setStyleAsPracticed(obj)
    },

    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    }
  }
}
</script>
<template>
  <div>
    <ArrayTabs
      filteringMessage="Style"
      :tabs="tabArray"
      @selectedTabs="(tabs) => (selectedTabs = tabs)"
    ></ArrayTabs>
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
      class="tableClass mobile"
      :fields="fields"
      :items="filteredArray"
    >
      <template #cell(name)="data">
        <div :style="{ background: designStore.inputBacking }">
          <BButton
            class="nameButton mobile"
            style="width: 100%; border: 2px solid; text-align: left"
            @click="showModal(data.index)"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            >{{ data.item.name }}</BButton
          >
          <CustomModal
            :showModal="modal && currentModal == data.index"
            :title="data.item.name + ' - ' + data.item.rank"
            @close="showModal(data.index)"
          >
            <template v-slot:body>
              <AbilityDisplay
                :medallion="manualPerformanceStyles[data.item.style].groupIcon"
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
      <template #cell(rank)="data">
        <div style="margin-left: 1rem; margin-top: 0.5rem">{{ data.item.rank }}</div>
      </template>

      <template #cell(known)="data">
        <CustomCheckbox
          :overrideBox="''"
          :overrideFill="''"
          :isChecked="data.item.known"
          style="margin-left: 0.5rem; margin-right: 1rem"
          :update="0"
          @true="
            update(
              data.item.name,
              data.item.rank,
              manualPerformanceStyles[data.item.style]?.source || '',
              true,
              data.item.style,
              data.item.groupNumber,
              data.item.groupStyleIndex,
              data.item.styleIndex
            )
          "
          @false="
            update(
              data.item.name,
              data.item.rank,
              manualPerformanceStyles[data.item.style]?.source || '',
              false,
              data.item.style,
              data.item.groupNumber,
              data.item.groupStyleIndex,
              data.item.styleIndex
            )
          "
        ></CustomCheckbox>
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
@media (max-width: 500px) {
  .mobile {
    font-size: small;
  }
}
</style>
