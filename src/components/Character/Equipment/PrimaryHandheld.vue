<script lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'

import CustomModal from '@/components/CustomModal.vue'
import { BButton } from 'bootstrap-vue-next'

import DropdownSelect from '@/components/DropdownSelect.vue'
import { Item, useEquipmentStore } from '@/stores/equipmentStore.ts'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { storeToRefs } from 'pinia'
import EditItem from './EditItem.vue'
import ItemDisplay from './ItemDisplay.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const primaryHand = computed(() => {
      return equipment.value.primaryHand
    })
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
    const equipped = ref(equipmentStore.equipment.primaryHand)
    const armors: ComputedRef<Array<string>> = computed(() => {
      let weapons = Object.values(equipmentStore.equipment.items.Weapon)
      let ret: Array<string> = []
      weapons.forEach((weapon: any) => {
        ret.push(weapon.name)
      })
      return ret
    })
    const displayItem: ComputedRef = computed(() => {
      return equipped.value != '' ? true : false
    })
    function updatePrimaryHand(primary) {
      equipmentStore.updatePrimary(primary)
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
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      equipped,
      armors,
      equipmentStore,
      displayItem,
      updatePrimaryHand,
      primaryHand,
      saveEdits,
      editItem,
      editItemModal,
      itemToEdit,
      stagedItem
    }
  },
  components: {
    CustomModal,
    DropdownSelect,
    BInputGroupText,
    ItemDisplay,
    BButton,
    EditItem
  },
  watch: {
    primaryHand() {
      this.equipped = this.primaryHand
    }
  }
}
</script>

<template>
  <div>
    <div
      @click="modal = !modal"
      style="width: 13.5rem; height: 10rem; margin-top: 2rem"
      :style="{ fontFamily: designStore.font }"
      class="hoverableIconOnSidebar"
    >
      <div
        style="
          position: absolute;
          z-index: 4;
          margin-top: -1.5rem;
          margin-left: -0.5rem;
          margin-left: -0.5rem;
        "
      >
        <v-icon name="gi-hand" scale="12" style="transform: scale(-1.07, 1.05)"></v-icon>
      </div>
      <div
        style="position: absolute; z-index: 4; margin-top: -1.5rem; margin-left: -0.5rem"
        :style="{ color: designStore.primaryTheme }"
      >
        <v-icon name="gi-hand" scale="12" style="transform: scale(-1.05, 1)"></v-icon>
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
            style="z-index: 5; margin-right: -0.75rem; align-self: center; transform: scaleX(-1)"
            name="gi-magic-axe"
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
            style="
              z-index: 4;
              margin-left: -0.75rem;
              align-self: center;
              transform: rotate(-100deg);
            "
            name="gi-spinning-sword"
            scale="2"
          ></v-icon>
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
            Empty Primary Hand
          </div>
        </div>
      </div>

      <CustomModal title="Primary Hand" :showModal="modal" @close="modal = !modal">
        <template v-slot:body>
          <div
            style="
              font-size: x-large;
              text-align: center;
              margin-top: -1rem;
              margin-bottom: 0.25rem;
            "
          >
            Primary Hand
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
              class="primaryLabel"
              >Equipped Primary:
            </BInputGroupText>

            <DropdownSelect
              class="dropdown-fill"
              :borderless="true"
              :options="armors"
              :default="equipmentStore.equipment.primaryHand"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              @selection="(selection) => updatePrimaryHand(selection)"
              DropdownSelect
            ></DropdownSelect>
          </div>
          <ItemDisplay
            v-if="displayItem"
            :item="equipmentStore.equipment.items.Weapon[equipped]"
          ></ItemDisplay>
        </template>
        <template v-slot:footer>
          <BButton
            v-if="equipmentStore.equipment.primaryHand"
            style="border: 1px solid; margin-right: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="
              editItem(equipmentStore.equipment.items.Weapon[equipmentStore.equipment.primaryHand])
            "
            >Edit Item</BButton
          >
          <BButton
            v-if="equipmentStore.equipment.primaryHand"
            style="border: 1px solid; margin-right: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="equipmentStore.updatePrimary('')"
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
.primaryLabel {
  border: 0px;
  border-right: 2px solid;
  width: 11rem;
  border-radius: 0;
  margin-left: 0.25rem;
}
.dropdown-fill {
  margin-right: 0.25rem;
  width: calc(100% - 11.5rem);
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
