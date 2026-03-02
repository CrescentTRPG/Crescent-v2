<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BFormInput, BTable } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import CustomPagination from '@/components/CustomPagination.vue'

import ArrayTabs from '@/components/ArrayTabs.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { Item, useEquipmentStore } from '@/stores/equipmentStore.ts'
import BButtonGroup from 'bootstrap-vue-next/src/components/BButton/BButtonGroup.vue'
import CustomCheckbox from '../CustomCheckbox.vue'
import EditItem from './EditItem.vue'
import ItemDisplay from './ItemDisplay.vue'
import NewItem from './NewItem.vue'
import BrewPotionModal from './BrewPotionModal.vue'

export default {
  emits: ['ability'],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const equipmentStore = useEquipmentStore()
    const { equipment, getNumberofAttunedItems, getTotalAttuneableItems } =
      storeToRefs(equipmentStore)
    const stagedItem: Ref<Item> = ref({
      name: '',
      count: 0,
      description: '',
      type: 'Generic',
      isAttuneable: false,
      isAttuned: false,
      equippedStats: {
        ability: {
          name: ''
        },
        passives: {},
        material: '',
        enchantments: {},
        technicalAddons: {},
        materialCoverings: {}
      }
    })
    const itemToEdit = ref({})
    const viewItemModal = ref(false)
    const editItemModal = ref(false)

    const addModal = ref(false)

    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'type', 'isAttuned']
    const filter = ref('')
    const fields = ref([
      { key: 'name', label: 'Item' },
      { key: 'count', label: 'Amount' },
      { key: 'type', label: 'Type' },
      { key: 'isAttuned', label: 'Attuned?', sortable: true }
    ])
    function showModal(index) {
      currentModal.value = index
      viewItemModal.value = true
    }
    const genericItems: ComputedRef<Array<any>> = computed(() => {
      return Object.values(equipment.value.items.Generic)
    })
    const weapons: ComputedRef<Array<any>> = computed(() => {
      return Object.values(equipment.value.items.Weapon)
    })
    const armor: ComputedRef<Array<any>> = computed(() => {
      return Object.values(equipment.value.items.Armor)
    })
    const shields: ComputedRef<Array<any>> = computed(() => {
      return Object.values(equipment.value.items.Shield)
    })
    const potions: ComputedRef<Array<any>> = computed(() => {
      return Object.values(equipment.value.items.Potion)
    })
    const ingredients: ComputedRef<Array<any>> = computed(() => {
      return Object.values(equipment.value.items.Ingredient)
    })
    const items: ComputedRef<Array<any>> = computed(() => {
      if (selectedTabs.value.length === 0) {
        return genericItems.value.concat(
          weapons.value
            .concat(
              armor.value.concat(shields.value.concat(potions.value.concat(ingredients.value)))
            )
            .sort((a: any, b: any) => {
              if (a.rank === b.rank) {
                let aCode = a.name.charCodeAt(0)
                let bCode = b.name.charCodeAt(0)
                if (aCode - bCode == 0) {
                  aCode = a.name.charCodeAt(1)
                  bCode = b.name.charCodeAt(1)
                  if (aCode - bCode == 0) {
                    aCode = a.name.charCodeAt(2)
                    bCode = b.name.charCodeAt(2)
                  }
                }
                return aCode - bCode
              }
              return a.rank - b.rank
            })
        )
      } else {
        let ret = Object.values(equipment.value.items[selectedTabs.value[0].name])
        selectedTabs.value.forEach((type) => {
          ret.concat(Object.values(equipment.value.items[type.name]))
        })
        return ret.sort((a: any, b: any) => {
          if (a.rank === b.rank) {
            let aCode = a.name.charCodeAt(0)
            let bCode = b.name.charCodeAt(0)
            if (aCode - bCode == 0) {
              aCode = a.name.charCodeAt(1)
              bCode = b.name.charCodeAt(1)
              if (aCode - bCode == 0) {
                aCode = a.name.charCodeAt(2)
                bCode = b.name.charCodeAt(2)
              }
            }
            return aCode - bCode
          }
          return a.rank - b.rank
        })
      }
    })
    function addItem() {
      if (!equipmentStore.equipment.items[stagedItem.value.type][stagedItem.value.name]?.name) {
        equipmentStore.addItem(stagedItem.value)
        addModal.value = false
      } else {
        alert(
          'An item of type: "' +
            stagedItem.value.type +
            '" with that name already exists.  Did you mean to edit that item instead?  If not, please make the names of items in your equipment unique.'
        )
      }
    }
    function editItem(item) {
      itemToEdit.value = item
      viewItemModal.value = false
      editItemModal.value = true
    }

    const deleteModal = ref(false)
    const itemToDelete = ref({
      name: '',
      count: 0,
      description: '',
      type: 'Generic',
      isAttuneable: false,
      isAttuned: false,
      equippedStats: {
        ability: {
          name: ''
        },
        passives: {},
        material: '',
        enchantments: {},
        technicalAddons: {},
        materialCoverings: {}
      }
    })
    function deleteItem(item) {
      itemToDelete.value = item
      viewItemModal.value = false
      deleteModal.value = true
    }

    function deleteForReal() {
      equipmentStore.removeItem(itemToDelete.value, true)
      deleteModal.value = false
    }

    function editAttuned(item, newVal) {
      item.isAttuned = newVal
      equipmentStore.editInPlace(item)
    }

    function saveEdits(newItem, oldItem) {
      equipmentStore.removeItem(oldItem)
      equipmentStore.addItem(newItem)
      itemToEdit.value = {}

      editItemModal.value = false
    }

    function getMedallion(group: string) {
      switch (group) {
        case 'Weapon':
          return 'gi-all-for-one'
        case 'Generic':
          return 'gi-cube'
        case 'Shield':
          return 'gi-shield'
        case 'Armor':
          return 'gi-armor-vest'
        case 'Ingredient':
          return 'gi-super-mushroom'
        case 'Potion':
          return 'gi-drink-me'
      }
    }

    function setStagedItem(item: Item) {
      stagedItem.value = item
    }

    const tabs = [
      { name: 'Armor', index: 1 },
      { name: 'Shield', index: 2 },
      { name: 'Weapon', index: 3 },
      { name: 'Generic', index: 4 },
      { name: 'Ingredient', index: 5 },
      { name: 'Potion', index: 6 }
    ]

    const selectedTabs: Ref<Array<any>> = ref([])

    const totalRows = ref(items?.value?.length)

    const brewPotionModal = ref(false)
    return {
      designStore,
      userStore,
      characterStore,
      currentPage,
      perPage,
      currentModal,
      getMedallion,
      modal,
      filterOn,
      filter,
      fields,
      totalRows,
      selectedTabs,
      infoModal,
      tabs,
      items,
      stagedItem,
      addModal,
      addItem,
      setStagedItem,
      viewItemModal,
      editItemModal,
      itemToEdit,
      showModal,
      editItem,
      saveEdits,
      deleteItem,
      deleteForReal,
      deleteModal,
      itemToDelete,
      editAttuned,
      getNumberofAttunedItems,
      getTotalAttuneableItems,
      brewPotionModal
    }
  },
  components: {
    BFormInput,
    CustomCheckbox,
    CustomPagination,
    BTable,
    TitleWidget,
    ArrayTabs,
    BButton,
    BButtonGroup,
    CustomModal,
    NewItem,
    ItemDisplay,
    EditItem,
    BrewPotionModal
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
    :style="{ borderColor: designStore.secondaryTheme }"
  >
    <TitleWidget
      title="Items"
      :total="getTotalAttuneableItems"
      units="Attuned Items"
      :spent="getNumberofAttunedItems"
    ></TitleWidget>
    <BButtonGroup
      class="bar"
      :style="{
        borderColor: designStore.secondaryTheme,
        '--bs-button-bg': designStore.inputBacking,
        '--bs-button-color': designStore.inputText,
        '--bs-button-border-color': designStore.secondaryTheme
      }"
    >
      <BButton
        class="indivs"
        disabled
        style="border: 1px solid; font-size: medium; border-top: 0px; border-bottom: 0px"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        >Add Craftable Item</BButton
      >
      <BButton
        @click="brewPotionModal = true"
        class="indivs"
        style="border: 1px solid; font-size: medium; border-top: 0px; border-bottom: 0px"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        >Brew Potion</BButton
      >
      <BButton
        @click="addModal = true"
        class="indivs inputColorBackdrop"
        style="
          border: 1px solid;
          font-size: medium;
          border-top: 0px;
          border-bottom: 0px;
          border-right: 1px;
        "
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        >Add Item</BButton
      ></BButtonGroup
    >

    <ArrayTabs
      filteringMessage="Item Type"
      :tabs="tabs"
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
      headerTitle="Abilities"
      class="tableClass mobile"
      :fields="fields"
      :items="items"
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
            >{{ data.item.name }}</BButton
          >
          <CustomModal
            :showModal="viewItemModal && currentModal == data.index"
            :title="data.item.name"
            @close="viewItemModal = false"
          >
            <template v-slot:body>
              <ItemDisplay :item="data.item"></ItemDisplay>
            </template>
            <template v-slot:footer
              ><BButton
                style="border: 1px solid; margin-right: 0.5rem"
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                @click="editItem(data.item)"
                >Edit Item</BButton
              ><BButton
                style="border: 1px solid"
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                @click="deleteItem(data.item)"
                >Delete Item</BButton
              >
            </template>
          </CustomModal>
        </div>
      </template>
      <template #cell(type)="data">
        <div class="fullGroup">
          {{ data.item.type }}
        </div>
        <div class="iconGroup">
          <v-icon scale="1.5" :name="getMedallion(data.item.type)"></v-icon>
        </div>
      </template>
      <template #cell(rank)="data">
        <div style="margin-left: 1rem; margin-top: 0.5rem">{{ data.item.rank }}</div>
      </template>
      <template #cell(isAttuned)="data">
        <div style="display: flex; justify-content: center; flex-direction: column; height: 100%">
          <CustomCheckbox
            v-if="data.item.isAttuneable"
            :overrideBox="''"
            :overrideFill="''"
            :isChecked="data.item.isAttuned"
            style="
              position: relative;
              bottom: 0rem;
              margin-left: 1rem;
              height: 0rem;
              width: inherit;
            "
            :update="0"
            @true="editAttuned(data.item, true)"
            @false="editAttuned(data.item, false)"
          ></CustomCheckbox>
          <div v-else style="margin-left: 1rem">N/A</div>
        </div>
      </template>
      <!-- <template #cell(actions)="data">
       
      </template> -->
    </BTable>
    <BrewPotionModal
      :showModal="brewPotionModal"
      @close-modal="brewPotionModal = false"
    ></BrewPotionModal>

    <CustomPagination
      @currentPage="(page) => (currentPage = page)"
      :currentPage="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
    ></CustomPagination>
    <CustomModal :showModal="addModal" title="Add Item" @close="addModal = false">
      <template v-slot:body>
        <NewItem @staged-item="(item) => setStagedItem(item)"></NewItem>
      </template>
      <template v-slot:footer
        ><BButton
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="addItem()"
          >Add Item</BButton
        >
      </template>
    </CustomModal>
    <CustomModal
      :showModal="deleteModal"
      :title="'Delete ' + itemToDelete.name"
      @close="deleteModal = false"
    >
      <template v-slot:body>
        Are you sure you want to delete: {{ itemToDelete.name }}? This action is irreversible.
      </template>
      <template v-slot:footer
        ><BButton
          style="border: 1px solid; margin-right: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="deleteForReal()"
          >Yes Delete</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="deleteModal = false"
          >Please Don't</BButton
        >
      </template>
    </CustomModal>
    <CustomModal :showModal="editItemModal" title="Edit Item" @close="editItemModal = false">
      <template v-slot:body>
        <EditItem
          @staged-item="(staged) => (stagedItem = staged)"
          :passedItem="itemToEdit"
        ></EditItem>
      </template>
      <template v-slot:footer
        ><BButton
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="saveEdits(stagedItem, itemToEdit)"
          >Edit</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="editItemModal = false"
          >Cancel</BButton
        >
      </template>
    </CustomModal>
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
