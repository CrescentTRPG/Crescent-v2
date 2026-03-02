<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, ref } from 'vue'
import MartialAttackDisplay from './MartialAttackDisplay.vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { martialAttacks } = storeToRefs(characterStore)
    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'type', 'isAttuned']
    const filter = ref('')
    const viewAttackModal = ref(false)

    const fields = ref([
      { key: 'name', label: 'Name' },
      { key: 'mp', label: 'MP' },
      { key: 'description', label: 'Description' },
      { key: 'actions', label: 'Actions' }

      // { key: 'adaptations', label: 'Adaptations' },
      // { key: 'Traits', label: 'Traits' },
    ])
    function showModal(index) {
      currentModal.value = index
      viewAttackModal.value = true
    }

    const martialAttacksArr: ComputedRef<Array<any>> = computed(() => {
      return Object.values(martialAttacks.value)
    })
    const totalRows = ref(martialAttacksArr.value.length)

    return {
      designStore,
      props,
      martialAttacksArr,
      filterOn,
      filter,
      fields,
      totalRows,
      viewAttackModal,
      currentPage,
      currentModal,
      characterStore,
      perPage,
      showModal
    }
  },
  components: {
    BButton,
    BTable,
    CustomPagination,
    CustomModal,
    MartialAttackDisplay,
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
      headerTitle="Abilities"
      class="tableClass mobile"
      :fields="fields"
      :items="martialAttacksArr"
    >
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
            @click="showModal(data.index)"
            >{{ data.item.name }}</BButton
          >
          <CustomModal
            :showModal="viewAttackModal && currentModal == data.index"
            :title="data.item.name"
            @close="viewAttackModal = false"
          >
            <template v-slot:body>
              <MartialAttackDisplay
                :description="data.item.description"
                :weaponAttack="data.item.attackObj"
                :icon="data.item.icon || 'gi-tec-9'"
              ></MartialAttackDisplay>
            </template>
          </CustomModal>
        </div>
      </template>

      <template #cell(actions)="data">
        <BButton
          style="border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="characterStore.removeMartialAttack(data.item.name)"
          ><i @click="characterStore.removeMartialAttack(data.item.name)" class="bi bi-x-lg"></i
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
