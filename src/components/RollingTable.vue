<script lang="ts">
import { useUserStore } from '../stores/userStore.ts'
import { BTable } from 'bootstrap-vue-next'
import CustomModal from '@/components/CustomModal.vue'
import { ref, onMounted, toRaw, watch } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
import { storeToRefs } from 'pinia'
import TitleWidget from '@/components/TitleWidget.vue'

export default {
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    //const skills = ref(skillStore.getSkills)
    //const allSkills: any = ref(skillStore.getAllSkills)
    const rollingTableInfo =
      'You may find it useful to set up rolling tables.  Rolling tables allow a game master to quickly generate random content.  This could be random events, npc generators, random loot, whatever you want!'
    const filter = ref('')
    const filterOn = ['name']
    const currentPage = ref(1)
    const totalRows = ref(0)
    const perPage = ref(10)
    const fields = ref([
      { key: 'name', label: 'Name', sortable: true },
      { key: 'actions', label: 'Actions' }
    ])
    const modal = ref(false)
    const currentModal = ref(0)
    return {
      designStore,

      userStore,
      fields,
      filter,
      filterOn,
      currentPage,
      totalRows,
      modal,
      currentModal,
      rollingTableInfo
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
    tableBg(num: number) {
      console.log(parseInt(this.designStore.inputBacking.substring(1), 16))

      if (num % 2 === 0) {
        if (parseInt(this.designStore.inputBacking.substring(1), 16) >= 3000000) {
          return this.LightenDarkenColor(this.designStore.inputBacking, 10)
        }
        return this.LightenDarkenColor(this.designStore.inputBacking, -10)
      }
      return this.designStore.inputBacking
    },
    tableTxt(num: number) {
      return this.designStore.inputText
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    delay(time: number) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  components: {
    TitleWidget,
    BTable
  }
}
</script>

<template>
  <div
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <TitleWidget title="Rolling Tables" :info-message="rollingTableInfo"></TitleWidget>
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
    ></BTable>
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
