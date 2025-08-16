<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore'
import { BFormSelect } from 'bootstrap-vue-next'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { computed, ComputedRef, ref } from 'vue'
import { usePerformanceStore } from '@/stores/performanceStore'
import { storeToRefs } from 'pinia'
import { useSkillStore } from '@/stores/skillsStore'
import BNavbar from 'bootstrap-vue-next/src/components/BNavbar/BNavbar.vue'
import BNavItem from 'bootstrap-vue-next/src/components/BNav/BNavItem.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { useCharacterStore } from '@/stores/characterStore'
import BTable from 'bootstrap-vue-next/src/components/BTable/BTable.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import CustomModal from '@/components/CustomModal.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { useAdventureStore } from '@/stores/adventureStore'

export default {
  props: ['select', 'plan', 'fight', 'rm'],
  setup(props, context) {
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const { combats } = storeToRefs(adventureStore)
    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'tags', 'difficulty']
    const filter = ref('')

    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'difficulty', label: 'Difficulty' },
      { key: 'tags', label: 'Tags' },
      { key: 'actions', label: 'Actions' }

      // { key: 'adaptations', label: 'Adaptations' },
      // { key: 'Traits', label: 'Traits' },
    ])

    function remove(id) {
      props.rm(id)
    }

    const combatsArr: ComputedRef<Array<any>> = computed(() => {
      return Object.values(combats.value)
    })
    const totalRows = ref(combatsArr.value.length)

    return {
      designStore,
      props,
      combatsArr,
      filterOn,
      filter,
      fields,
      totalRows,
      currentPage,
      currentModal,
      adventureStore,
      perPage,
      remove
    }
  },
  components: {
    BButton,
    BTable,
    CustomPagination,
    BFormInput
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
      class="tableClass mobile"
      :fields="fields"
      :items="combatsArr"
      show-empty
    >
      <template v-slot:empty>
        <div style="display: flex; justify-content: center; margin-bottom: 0.5rem; flex-wrap: wrap">
          <div style="margin-top: 0.5rem">
            You don't have any planned combats, plan some by clicking
          </div>
          <BButton
            @click="plan"
            style="border-radius: 0; font-size: large; border: 2px solid; margin-left: 0.5rem"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText,
              borderColor: designStore.secondaryTheme,
              boxShadow:
                'inset 0px 0px 0px 3px ' + LightenDarkenColor(designStore.sidebarBacking, 10)
            }"
          >
            <v-icon name="gi-notebook" scale="1.5" style="transform: scaleX(1)"></v-icon> Plan New
            Combat <v-icon name="gi-id-card" scale="1.5" style="transform: scaleX(-1)"></v-icon
          ></BButton>
        </div>
      </template>
      <template #cell(name)="data">
        <div>
          <BButton
            class="nameButton mobile"
            style="
              border: 1px solid;
              width: 100%;
              border: 2px solid;
              text-align: left;
              cursor: pointer;
            "
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="props.select(data.item)"
            >{{ data.item.name }}</BButton
          >
        </div>
      </template>

      <template #cell(powerLevel)="data">
        <PowerLevelIcon
          style="margin-top: -0.15rem; margin-bottom: 0.5rem"
          :powerLevel="data.item.powerLevel"
          :currentStatBlock="data.item"
        ></PowerLevelIcon>
      </template>
      <template #cell(tags)="data">
        <div style="display: flex">
          <div v-for="t in data.item.tags" :key="t">
            <div
              class="statTag"
              :style="{
                background: designStore.alertTheme,
                color: designStore.inputBacking,
                borderColor: designStore.alertTheme
              }"
            >
              {{ t }}
            </div>
          </div>
        </div>
      </template>
      <template #cell(actions)="data">
        <BButton
          style="border: 2px solid; margin-right: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="props.fight(data.item)"
          >Fight<i @click="props.fight(data.item)" class="bi bi-exclamation-lg"></i
        ></BButton>
        <BButton
          style="border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="remove(data.item.id)"
          ><i @click="remove(data.item.id)" class="bi bi-x-lg"></i
        ></BButton>
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
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  width: 100%;
  border: 2px solid;
  border-left: 0px;
  border-right: 0px;
}
@media (max-width: 500px) {
  .navClass {
    width: 100%;
    border: 2px solid;
  }
  .navI {
    padding-bottom: 0.5rem;
  }
  .textI {
    display: none;
  }
}
@media (min-width: 501px) {
  .navI {
    display: none;
  }
  .manText {
    display: none;
  }
}
.manText {
  padding-bottom: 0.5rem;
}
</style>
