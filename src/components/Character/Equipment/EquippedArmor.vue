<script lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'

import CustomModal from '@/components/CustomModal.vue'
import { BButton, BFormInput, BFormSelect, BInputGroup } from 'bootstrap-vue-next'

import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { Item, useEquipmentStore } from '@/stores/equipmentStore'
import ItemDisplay from './ItemDisplay.vue'
import { storeToRefs } from 'pinia'
import EditItem from './EditItem.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const wornArmor = computed(() => {
      return equipment.value.wornArmor
    })
    const equipped = ref(equipmentStore.equipment.wornArmor)
    const armors: ComputedRef<Array<string>> = computed(() => {
      let armors = Object.values(equipmentStore.equipment.items.Armor)
      let ret: Array<string> = []
      armors.forEach((armor: any) => {
        ret.push(armor.name)
      })
      return ret
    })
    const displayItem: ComputedRef = computed(() => {
      return equipped.value != '' ? true : false
    })
    function updateEquippedArmor(armor) {
      equipmentStore.updateWornArmor(armor)
    }
    const itemToEdit = ref({})
    const editItemModal = ref(false)
    function saveEdits(newItem, oldItem) {
      equipmentStore.removeItem(oldItem)
      equipmentStore.addItem(newItem)
      itemToEdit.value = {}

      editItemModal.value = false
    }
    function editItem(item) {
      itemToEdit.value = item
      modal.value = false
      editItemModal.value = true
    }
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
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      equipped,
      armors,
      equipmentStore,
      displayItem,
      updateEquippedArmor,
      wornArmor,
      saveEdits,
      itemToEdit,
      editItem,
      editItemModal,
      stagedItem
    }
  },
  components: {
    CustomModal,
    BInputGroupText,
    ItemDisplay,
    BButton,
    EditItem,
    DropdownSelect
  },
  watch: {
    wornArmor() {
      this.equipped = this.wornArmor
    }
  }
}
</script>

<template>
  <div>
    <div
      @click="modal = !modal"
      style="width: 13.5rem; height: 10rem; margin-top: -0.65rem; margin-left: -0.5rem"
      :style="{ fontFamily: designStore.font }"
      class="hoverableIconOnSidebar"
    >
      <div style="position: absolute; z-index: 4; margin-top: -1.5rem; margin-left: -0.5rem">
        <v-icon name="gi-armor-vest" scale="12" style="transform: scale(1.13, 1.05)">></v-icon>
      </div>
      <div
        style="position: absolute; z-index: 4; margin-top: -1.5rem; margin-left: -0.5rem"
        :style="{ color: designStore.primaryTheme }"
      >
        <v-icon name="gi-armor-vest" style="transform: scale(1.1, 1)" scale="12"></v-icon>
      </div>

      <div
        style="
          position: absolute;
          font-size: 11rem;
          z-index: 3;
          margin-left: 1rem;
          margin-top: -2rem;
          transform: scale(1, 0.95);
        "
        :style="{ color: designStore.secondaryTheme }"
      >
        <i class="bi bi-armor-vest"></i>
      </div>
      <div
        style="
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: center;
          padding-top: 2rem;
        "
      >
        <div style="display: flex; justify-content: center" v-if="displayItem">
          <v-icon
            style="z-index: 5; margin-right: -1.25rem; align-self: center"
            name="gi-belt-armor"
            scale="2"
          ></v-icon>
          <div
            style="
              text-wrap: wrap;
              font-size: medium;
              width: fit-content;
              text-align: center;
              max-width: 6.5rem;
              z-index: 5;
              border-radius: 10px;
              padding: 0.25rem;
              border: 2px solid;
            "
            :style="{
              color: designStore.primaryText,
              fontFamily: designStore.titleFont,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{ equipped }}
          </div>
          <v-icon
            style="z-index: 4; margin-left: -1.25rem; align-self: center; transform: scaleX(-1)"
            name="gi-belt-armor"
            scale="2"
          ></v-icon>
        </div>
        <div style="display: flex; justify-content: center" v-if="displayItem">
          <div>
            <v-icon
              style="
                z-index: 5;
                align-self: center;
                position: absolute;
                margin-left: -1.1rem;
                transform: scale(2.2, 1.78);
              "
              name="gi-shield"
              scale="2"
            ></v-icon>
            <v-icon
              :style="{ color: designStore.primaryTheme }"
              style="
                z-index: 5;
                align-self: center;
                position: absolute;
                margin-left: -1.1rem;
                transform: scale(2, 1.5);
              "
              name="gi-shield"
              scale="2"
            ></v-icon>
          </div>
        </div>
        <div style="display: flex; justify-content: center" v-if="displayItem">
          <div
            style="
              text-wrap: wrap;
              font-size: large;
              width: fit-content;
              text-align: center;
              max-width: 6.5rem;
              z-index: 5;
              border-radius: 10px;
              padding: 0.25rem;
            "
            :style="{
              color: designStore.primaryText,
              fontFamily: designStore.titleFont,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{
              equipmentStore.equipment.items.Armor[equipped]?.equippedStats?.value
                ? equipmentStore.equipment.items.Armor[equipped]?.equippedStats?.value
                : 0
            }}
          </div>
        </div>
        <div style="display: flex; justify-content: center">
          <div
            v-if="!displayItem"
            style="
              max-width: 6rem;
              text-align: center;
              z-index: 5;
              border: 2px solid;
              border-radius: 5px;
              font-size: medium;
              padding: 0.25rem;
            "
            :style="{
              color: designStore.primaryText,
              fontFamily: designStore.titleFont,
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme
            }"
          >
            No Armor Equipped
          </div>
        </div>
      </div>

      <CustomModal title="Equipped Armor" :showModal="modal" @close="modal = !modal">
        <template v-slot:body>
          <div
            style="
              font-size: x-large;
              text-align: center;
              margin-top: -1rem;
              margin-bottom: 0.25rem;
            "
          >
            Armor
          </div>
          <div
            style="border: 2px solid; border-radius: 0.5rem; display: flex; margin-bottom: 1rem"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
          >
            <BInputGroupText
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              class="armorLabel"
              >Equipped Armor:
            </BInputGroupText>
            <!-- <BFormSelect
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
              style="padding: 0.5rem"
              :options="armors"
              v-model="equipped"
              @change="updateEquippedArmor()"
            ></BFormSelect> -->
            <DropdownSelect
              class="dropdown-fill"
              :borderless="true"
              :options="armors"
              :default="equipmentStore.equipment.wornArmor"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              @selection="(selection) => updateEquippedArmor(selection)"
              DropdownSelect
            ></DropdownSelect>
          </div>
          <ItemDisplay
            v-if="displayItem"
            :item="equipmentStore.equipment.items.Armor[equipped]"
          ></ItemDisplay>
        </template>
        <template v-slot:footer>
          <BButton
            v-if="equipmentStore.equipment.wornArmor"
            style="border: 1px solid; margin-right: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="
              editItem(equipmentStore.equipment.items.Armor[equipmentStore.equipment.wornArmor])
            "
            >Edit Item</BButton
          >
          <BButton
            v-if="equipmentStore.equipment.wornArmor"
            style="border: 1px solid; margin-right: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="equipmentStore.updateWornArmor('')"
            >Unequip</BButton
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
  </div>
</template>

<style scoped>
.armorLabel {
  border: 0px;
  border-right: 2px solid;
  width: 9.5rem;
  border-radius: 0;
  margin-left: 0.25rem;
}
.dropdown-fill {
  margin-right: 0.25rem;
  width: calc(100% - 10rem);
  flex-grow: 1;
}
.armorTxt {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
.lilDVs {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: medium;
}
@media (max-width: 600px) {
}
</style>
