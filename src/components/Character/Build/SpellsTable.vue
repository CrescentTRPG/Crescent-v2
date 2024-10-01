<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { useSpellStore } from '@/stores/spellsStore'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, ref } from 'vue'
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import CustomModal from '@/components/CustomModal.vue'
import CustomCheckbox from '../CustomCheckbox.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import ArrayTabs from '@/components/ArrayTabs.vue'

export default {
  setup() {
    const designStore = useDesignStore()
    const spellStore = useSpellStore()
    const { buildDisplaySpellgroups, buildDisplaySpells } = storeToRefs(spellStore)
    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'rank', label: 'Rank' },
      { key: 'spellgroup', label: 'Spellgroup' },
      { key: 'known', label: 'Known?' }
    ])
    const selectedTabs = ref([])
    const filterOn = ['name', 'grouping', 'rank', 'known', 'spellgroup']
    const filter = ref('')
    const spells = ref([])
    const modal = ref(false)
    const currentPage = ref(1)
    const perPage = ref(18)
    const currentModal = ref(0)
    const tabArray: ComputedRef<Array<any>> = computed((): Array<any> => {
      return buildDisplaySpellgroups.value.map((group) => ({
        name: group.name,
        index: group.index
      }))
    })
    const filteredArray: ComputedRef<Array<any>> = computed((): Array<any> => {
      let ret: Array<any> = []
      if (selectedTabs.value && selectedTabs.value.length > 0) {
        selectedTabs.value.forEach((tab: { name: string; index: number }) => {
          buildDisplaySpellgroups.value[tab.index].spells.forEach((spell) => {
            ret.push(spell)
          })
        })
        return ret
      }
      return buildDisplaySpells.value
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
      spellStore,
      fields,
      modal,
      spells,
      currentModal,
      buildDisplaySpells,
      buildDisplaySpellgroups
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
    update(name: any, id: any, rank: number, source: any, known: any, spellgroup: string) {
      let spellObj = {
        name: name,
        id: id,
        rank: rank,
        known: known,
        source: source,
        spellgroup: spellgroup
      }
      this.spellStore.setSpell(spellObj)
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
    <div
      style="
        font-size: x-large;
        margin-top: 1rem;
        padding: 0.5rem;
        display: flex;
        flex-direction: column;
      "
      :style="{
        fontFamily: designStore.titleFont,
        color: designStore.primaryText,
        background: designStore.primaryTheme
      }"
    >
      <div style="margin-left: 2rem">Spells</div>
      <span
        style="display: flex; margin-bottom: -1rem; margin-top: -1rem"
        :style="{ borderColor: designStore.secondaryTheme, color: designStore.secondaryTheme }"
      >
        <v-icon
          name="gi-abstract-119"
          style="position: relative; left: 0.25rem; top: 0.5rem"
        ></v-icon>
        <hr :style="{ borderColor: designStore.secondaryTheme }" />
        <v-icon
          name="gi-abstract-119"
          style="position: relative; right: 0.25rem; top: 0.5rem"
        ></v-icon>
      </span>
    </div>
    <ArrayTabs :tabs="tabArray" @selectedTabs="(tabs) => (selectedTabs = tabs)"></ArrayTabs>
    <BFormInput
      class="inputSearch"
      placeholder="Search..."
      v-model="filter"
      style="border-radius: 0; border: none; border-bottom: 2px solid"
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme
      }"
    ></BFormInput>
    <BTable
      @filtered="onFiltered"
      striped
      :style="{
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText,
        backgroundColor: designStore.inputBacking
      }"
      :sort-internal="true"
      :filter="filter"
      :filterable="filterOn"
      :per-page="perPage"
      :current-page="currentPage"
      headerTitle="Spells"
      class="tableClass"
      :fields="fields"
      :items="filteredArray"
    >
      <template #cell(name)="data">
        <div :style="{ background: designStore.inputBacking }">
          <BButton
            class="nameButton"
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
                :medallion="data.item.groupIcon"
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
        <div style="margin-left: 1rem">{{ data.item.rank }}</div>
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
              data.item.id || '',
              data.item.rank,
              data.item.source,
              true,
              data.item.spellgroup
            )
          "
          @false="
            update(
              data.item.name,
              data.item.id,
              data.item.rank,
              data.item.source,
              false,
              data.item.spellgroup
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
