<script lang="ts">
import CustomPagination from '@/components/CustomPagination.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, ref } from 'vue'
import PowerLevelIcon from './PowerLevelIcon.vue'

export default {
  props: ['select', 'add', 'hideRm', 'usePlus'],
  setup(props, context) {
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const { statBlocks } = storeToRefs(adventureStore)
    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'tags', 'powerLevel']
    const filter = ref('')

    const fields = ref(
      props.hideRm
        ? [
            { key: 'name', label: 'Name' },
            { key: 'powerLevel', label: 'Power Level' },
            { key: 'tags', label: 'Tags' }

            // { key: 'adaptations', label: 'Adaptations' },
            // { key: 'Traits', label: 'Traits' },
          ]
        : [
            { key: 'name', label: 'Name' },
            { key: 'powerLevel', label: 'Power Level' },
            { key: 'tags', label: 'Tags' },
            { key: 'actions', label: 'Actions' }

            // { key: 'adaptations', label: 'Adaptations' },
            // { key: 'Traits', label: 'Traits' },
          ]
    )

    function remove(id) {
      adventureStore.removeStatBlock(id)
    }

    const StatBlocksArr: ComputedRef<Array<any>> = computed(() => {
      return Object.values(statBlocks.value)
    })
    const totalRows = ref(StatBlocksArr.value.length)

    return {
      designStore,
      props,
      StatBlocksArr,
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
    BFormInput,
    PowerLevelIcon
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
    <div style="display: flex">
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
    </div>
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
      :items="StatBlocksArr"
      show-empty
    >
      <template v-slot:empty>
        <div style="display: flex; justify-content: center; margin-bottom: 0.5rem; flex-wrap: wrap">
          <div style="margin-top: 0.5rem">
            This Table is Empty, try adding some values by clicking
          </div>
          <BButton
            style="border-radius: 0; font-size: large; border: 2px solid; margin-left: 1rem"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText,
              borderColor: designStore.secondaryTheme,
              boxShadow:
                'inset 0px 0px 0px 3px ' + LightenDarkenColor(designStore.sidebarBacking, 10)
            }"
            @click="props.add()"
          >
            <v-icon name="gi-spiked-dragon-head" scale="1.5" style="transform: scaleX(1)"></v-icon>
            Add New Stat Block
            <v-icon name="gi-high-punch" scale="1.5" style="transform: scaleX(-1)"></v-icon
          ></BButton>
        </div>
      </template>
      <template #cell(name)="data">
        <div style="display: flex; flex-direction: column; justify-content: center; height: 3.5rem">
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
          >
            <i class="bi bi-plus-lg" style="margin-right: 0.25rem" v-if="props.usePlus"></i
            >{{ data.item.name }}</BButton
          >
        </div>
      </template>

      <template #cell(powerLevel)="data">
        <PowerLevelIcon
          class="powerLevel"
          style="margin-top: 0rem; margin-bottom: 0.75rem"
          :powerLevel="data.item.powerLevel"
          :currentStatBlock="data.item"
          :icon="data.item.icon"
        ></PowerLevelIcon>
      </template>
      <template #cell(tags)="data">
        <div style="display: flex; flex-wrap: wrap">
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
      <template #cell(actions)="data" v-if="!hideRm">
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
.statTag {
  font-size: medium;
}
.navClass {
  width: 100%;
  border: 2px solid;
  border-left: 0px;
  border-right: 0px;
}

@media (max-width: 500px) {
  .powerLevel {
    transform: scale(75%);
  }
  .statTag {
    font-size: x-small;
  }
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
