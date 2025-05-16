<script lang="ts">
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'
import CustomModal from '@/components/CustomModal.vue'
import CustomCheckbox from '../CustomCheckbox.vue'
import { ref, toRaw } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { storeToRefs } from 'pinia'
import { useMartialPerksStore } from '../../../stores/martialPerksStore'
import AbilityDisplay from '../../AbilityDisplay.vue'
import CustomPagination from '../../CustomPagination.vue'
import TitleWidget from '@/components/TitleWidget.vue'

interface Skill {
  skill: string
  rank: number
  source: string
}

export default {
  setup(props, context) {
    const userStore = useUserStore()
    const characterStore = useCharacterStore()
    const designStore = useDesignStore()
    const martialPerkStore = useMartialPerksStore()
    const { martialPerks, manualMartialPerks, buildDisplayMartialPerks } =
      storeToRefs(martialPerkStore)
    //const martialPerks = ref(martialPerkStore.getSkills)
    //const manualMartialPerks: any = ref(martialPerkStore.getAllSkills)
    const buildDisplayMartialPerksClone: any = ref(
      structuredClone(toRaw(buildDisplayMartialPerks.value))
    )
    const martialPerksMessage =
      "Martial Perks lend variety to a Martial character's turn, though anyone with enough Agility or Strength may purchase them.  To buy a Martial Perk, a character must have purchased a perk of one rank lower (when possible) and the character must have at least (Perk Rank * 2) Agility or Strength.  Like every ability group whose rank caps at 5 instead of 10, Martial Perks have a base cost of 3."
    const modal = ref(false)
    const currentModal = ref(0)
    const options = [
      { value: '0', text: '0' },
      { value: '1', text: '1' },
      { value: '2', text: '2' },
      { value: '3', text: '3' },
      { value: '4', text: '4' },
      { value: '5', text: '5' },
      { value: '6', text: '6' },
      { value: '7', text: '7' },
      { value: '8', text: '8' },
      { value: '9', text: '9' },
      { value: '10', text: '10' }
    ]

    let singleSortBy = { key: 'Rank', order: 'asc' }
    const filter = ref('')
    const filterOn = ['name', 'perkGroup', 'rank', 'known']
    const currentPage = ref(1)
    const totalRows = ref(buildDisplayMartialPerksClone.value?.length)
    const perPage = ref(10)
    const fields = ref([
      { key: 'name', label: 'Perk' },
      { key: 'perkGroup', label: 'Perk Group' },
      { key: 'rank', label: 'Rank', sortable: true },
      { key: 'known', label: 'Known?', sortable: true }
    ])
    return {
      totalRows,
      filterOn,
      filter,
      currentPage,
      perPage,
      designStore,
      characterStore,
      singleSortBy,
      buildDisplayMartialPerks,
      userStore,
      martialPerkStore,
      fields,
      martialPerks,
      manualMartialPerks,
      buildDisplayMartialPerksClone,
      options,
      modal,
      currentModal,
      martialPerksMessage
    }
  },
  watch: {
    buildDisplayMartialPerks() {
      this.buildDisplayMartialPerksClone = ref(
        structuredClone(toRaw(this.buildDisplayMartialPerks))
      )
    }
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
    getMedallion(group: string) {
      switch (group) {
        case 'Offensive Perks':
          return 'gi-swords-power'
        case 'Defensive Perks':
          return 'gi-heavy-helm'
        case 'Utility Perks':
          return 'gi-gear-hammer'
        case 'Supportive Perks':
          return 'gi-heart-shield'
      }
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    update(name: any, rank: number, source: any, known: any, perkGroup: string, perkIndex: number) {
      let perkObj = {
        name: name,
        rank: rank,
        known: known,
        source: source,
        perkGroup: perkGroup,
        perkIndex: perkIndex
      }
      this.martialPerkStore.setMartialPerk(perkObj)
    },
    formatHTML(description: string) {
      let sections = description.split('\\n')
      let ret
      if (sections.length === 1) {
        return '<div>' + description + '</div>'
      } else {
        ret = '<div style="margin-bottom: .25rem">' + sections[0] + '</div>'
        sections.shift()
        sections.forEach((s) => {
          ret +=
            '<li style="padding-left: 1rem; margin-bottom: .25rem;list-style-type:none;text-indent: -1rem ;">' +
            '❖ ' +
            s +
            '</li>'
        })
      }
      return ret
    }
  },
  components: {
    BButton,
    BTable,
    CustomModal,
    CustomCheckbox,
    BFormInput,
    AbilityDisplay,
    CustomPagination,
    TitleWidget
  }
}
</script>

<template>
  <div
    id="BuildTab"
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <TitleWidget title="Martial Perks" :info-message="martialPerksMessage"></TitleWidget>
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
      :current-page="currentPage"
      striped
      :sort-internal="true"
      :filter="filter"
      :filterable="filterOn"
      :per-page="perPage"
      :items="buildDisplayMartialPerksClone"
      :fields="fields"
      :style="{
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText,
        backgroundColor: designStore.inputBacking,
        '--bs-table-striped-bg': tableBg()
      }"
      headerTitle="Martial Perks"
      class="tableClass"
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
                :medallion="getMedallion(data.item.perkGroup as string)"
                :description="data.item.description"
                :area="data.item.area"
                :duration="data.item.duration"
                :action-cost="data.item.actionCost"
                :resistance="data.item.resistance"
                :target="data.item.target"
                :type="data.item.type"
              ></AbilityDisplay>
              <!-- <div v-html="formatHTML(data.item.description)"></div> -->
              <!-- <div style="white-space: pre; text-wrap: wrap;">{{ data.item.description.replace("\\n", `\n\n❖ `).replaceAll("\\n", `\n❖ `) }}</div> -->
            </template>
          </CustomModal>
        </div>
      </template>
      <template #cell(known)="data">
        <div>
          <CustomCheckbox
            :overrideBox="''"
            :overrideFill="''"
            :isChecked="buildDisplayMartialPerks[data.item.perkIndex as number].known || false"
            style="margin-left: 0.5rem; margin-right: 1rem"
            :update="data.index"
            @true="
              update(
                data.item.name,
                data.item.rank as number,
                data.item.source,
                true,
                data.item.perkGroup as string,
                data.item.perkIndex as number
              )
            "
            @false="
              update(
                data.item.name,
                data.item.rank as number,
                data.item.source,
                false,
                data.item.perkGroup as string,
                data.item.perkIndex as number
              )
            "
          ></CustomCheckbox>
        </div>
      </template>
      <template #cell(rank)="data">
        <div style="margin-left: 1rem">{{ data.item.rank }}</div>
      </template>
      <template #cell(perkGroup)="data">
        {{ data.item.perkGroup }}
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

<style scoped>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-emphasis-color: color;
  --bs-table-color-type: color !important;
  margin-bottom: 0;
}
@media (max-width: 600px) {
  .tableClass {
    font-size: small;
  }
  .nameButton {
    font-size: small;
  }
}

.inputSearch {
  --bs-primary: color !important;
}
</style>
