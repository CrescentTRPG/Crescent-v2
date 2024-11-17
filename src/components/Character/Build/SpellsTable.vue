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
import TitleWidget from '@/components/TitleWidget.vue'

export default {
  setup() {
    const designStore = useDesignStore()
    const spellStore = useSpellStore()
    const { buildDisplaySpellgroups, buildDisplaySpells, manualSpellgroups } =
      storeToRefs(spellStore)
    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'rank', label: 'Rank', sortable: true },
      { key: 'spellgroup', label: 'Spellgroup' },
      { key: 'known', label: 'Known?', sortable: true }
    ])
    const spellsMessage =
      'In order to buy spells, characters will need Power and Intelligence or Charisma.  Intelligence and Charisma limit how many spellgroups a character may know.  Every two points in Intelligence gives the charater the ability to select another Intelligence based spellgroup (Elemental and Core Magics).  Every two ranks in Charisma gives the character the ability to select another Charisma Based spellgroup (Divine Magics).  In order to gain new ranks in a spellgroup, a character must have purchased the rank below it and have equal to or greater Power.  Each new rank a character buys earns them mana.  The rank 0 spell is not bought, but comes free when you purchase the rank 1. The only exception to this rule is Arcana, whose spells all cost 3 ability points and they do not require Charisma or Intelligence to purchase.'
    const selectedTabs = ref([])
    const filterOn = ['name', 'grouping', 'rank', 'known', 'spellgroup']
    const filter = ref('')
    const spells = ref([])
    const modal = ref(false)
    const spellgroupModal = ref(false)
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
      buildDisplaySpellgroups,
      manualSpellgroups,
      spellsMessage,
      spellgroupModal
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
    ArrayTabs,
    TitleWidget
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
      spellgroup: string,
      groupNumber: number,
      groupSpellIndex: number,
      spellIndex: number
    ) {
      let spellObj = {
        name: name,
        rank: rank,
        known: known,
        source: source,
        spellgroup: spellgroup,
        groupNumber: groupNumber,
        groupSpellIndex: groupSpellIndex,
        spellIndex: spellIndex
      }
      this.spellStore.setSpell(spellObj)
    },
    deleteSpell(
      name: any,
      rank: number,
      source: any,
      known: any,
      spellgroup: string,
      groupNumber: number,
      groupSpellIndex: number,
      spellIndex: number
    ) {
      let spellObj = {
        name: name,
        rank: rank,
        known: known,
        source: source,
        spellgroup: spellgroup,
        groupNumber: groupNumber,
        groupSpellIndex: groupSpellIndex,
        spellIndex: spellIndex
      }
      this.spellStore.removeSpell(spellObj)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    showSpellgroupModal(id: number) {
      this.currentModal = id
      this.spellgroupModal = !this.spellgroupModal
    }
  }
}
</script>
<template>
  <div>
    <TitleWidget title="Spells" :info-message="spellsMessage"></TitleWidget>
    <ArrayTabs
      filteringMessage="Spellgroup"
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
      headerTitle="Spells"
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
                :medallion="manualSpellgroups[data.item.spellgroup].groupIcon"
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
      <template #cell(spellgroup)="data">
        <div style="margin-top: 0.5rem; cursor: pointer" @click="showSpellgroupModal(data.index)">
          {{ data.item.spellgroup }}
        </div>
        <CustomModal
          :showModal="spellgroupModal && currentModal == data.index"
          :title="data.item.spellgroup"
          @close="showSpellgroupModal(data.index)"
        >
          <template v-slot:body>
            <div>
              {{ data.item.spellgroup }} is a(n)
              {{ buildDisplaySpellgroups[data.item.groupNumber].groupPurchaseLimiter }} based
              spellgroup. A character may know ({{
                buildDisplaySpellgroups[data.item.groupNumber].groupPurchaseLimiter
              }}
              / 2) {{ buildDisplaySpellgroups[data.item.groupNumber].groupPurchaseLimiter }} based
              spellgroups. Additionally, in order to purchase a rank of {{ data.item.spellgroup }},
              the character needs to have equal to or higher
              {{ buildDisplaySpellgroups[data.item.groupNumber].rankLimiter }}, and must have
              purchased the rank below it.
            </div>
          </template>
        </CustomModal>
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
              manualSpellgroups[data.item.spellgroup].source,
              true,
              data.item.spellgroup,
              data.item.groupNumber,
              data.item.groupSpellIndex,
              data.item.spellIndex
            )
          "
          @false="
            deleteSpell(
              data.item.name,
              data.item.rank,
              manualSpellgroups[data.item.spellgroup].source,
              false,
              data.item.spellgroup,
              data.item.groupNumber,
              data.item.groupSpellIndex,
              data.item.spellIndex
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
