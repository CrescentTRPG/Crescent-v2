<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import TitleWidget from '@/components/TitleWidget.vue'
import { BButton, BButtonGroup, BDropdown, BDropdownItem } from 'bootstrap-vue-next'
import { useTraitsStore } from '@/stores/traitsStore'
import AddTrait from './AddTrait.vue'
import CustomModal from '@/components/CustomModal.vue'
import TraitsTable from './TraitsTable.vue'
import { useCharacterStore } from '@/stores/characterStore'
import { storeToRefs } from 'pinia'
import AddCustomTrait from './AddCustomTrait.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
export default {
  setup(props, context) {
    const modal = ref(false)
    const customModal = ref(false)
    const designStore = useDesignStore()
    const traitStore = useTraitsStore()
    const selectedTrait = ref('')
    const stagedTrait = ref({})
    const tab = ref('corestats')
    const characterStore = useCharacterStore()
    const { traits } = storeToRefs(characterStore)
    const traitsMessage =
      'Not every character will have Traits. Traits do not consume Ability Points and may be positive or negative. Some base characters with certain archetypes will find it helpful to assign a trait to keep track of their bonuses. Otherwise talk to your game master about whether your character will have traits or not.'
    return {
      designStore,
      tab,
      traitsMessage,
      modal,
      traitStore,
      selectedTrait,
      stagedTrait,
      traits,
      customModal
    }
  },
  components: {
    TitleWidget,
    BButtonGroup,
    BButton,
    BDropdownItem,
    BDropdown,
    AddTrait,
    CustomModal,
    TraitsTable,
    AddCustomTrait
  },
  methods: {
    addTrait(name: string) {
      this.selectedTrait = name
      this.modal = true
    },
    update(trait: any, isDefault: boolean) {
      let characterTraits = { ...this.traits }
      characterTraits[trait.name] = trait
      if (trait.name.includes('Exceptional') && isDefault) {
        const attrArr = trait.name.split(' ')
        const attr = attrArr[attrArr.length - 1].toLowerCase()
        useCharacterStore().updateExceptionals(attr, trait.number)
      }
      if (trait.name.includes('Inferior') && isDefault) {
        const attrArr = trait.name.split(' ')
        const attr = attrArr[attrArr.length - 1].toLowerCase()
        useCharacterStore().updateExceptionals(attr, trait.number * -1)
      }
      this.traitStore.setTraits(characterTraits)
      this.modal = false
    }
  }
}
</script>
<template>
  <div>
    <TitleWidget title="Traits" :info-message="traitsMessage"></TitleWidget>
    <BButtonGroup
      class="bar"
      :style="{
        borderColor: designStore.secondaryTheme,
        '--bs-button-bg': designStore.inputBacking,
        '--bs-button-color': designStore.inputText,
        '--bs-button-border-color': designStore.secondaryTheme
      }"
    >
      <BButtonGroup
        style="width: 50%; border-radius: 0; justify-content: center"
        :style="{
          background: designStore.inputBacking
        }"
        class="indivs"
      >
        <BButton
          class="spacerButton"
          disabled
          :style="{
            background: designStore.inputBacking
          }"
        ></BButton>
        <BDropdown
          style="width: 50%; min-width: 10rem; max-width: 20rem"
          text="Add Premade Trait"
          :style="{
            background: designStore.inputBacking,
            '--bs-btn-bg': designStore.inputBacking,
            '--bs-btn-color': designStore.inputText,
            '--bs-btn-border-color': designStore.secondaryTheme,
            '--bs-btn-hover-color': designStore.inputText,
            '--bs-btn-hover-bg': designStore.inputBacking,
            '--bs-btn-hover-border-color': designStore.secondaryTheme,
            '--bs-btn-active-color': designStore.inputText,
            '--bs-btn-active-bg:': designStore.inputBacking,
            '--bs-btn-active-border-color': designStore.secondaryTheme,
            '--bs-dropdown-color': designStore.inputText,
            '--bs-dropdown-bg': designStore.inputBacking,
            '--bs-dropdown-link-hover-color': designStore.alertTheme,
            '--bs-dropdown-link-hover-bg': designStore.inputBacking,
            '--bs-dropdown-link-active-color': designStore.alertTheme,
            '--bs-dropdown-link-active-bg': designStore.primaryTheme,
            scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
          }"
        >
          <BDropdownItem @click="addTrait('Resistance')">Resistance</BDropdownItem>
          <BDropdownItem @click="addTrait('Immunity')">Immunity</BDropdownItem>
          <BDropdownItem @click="addTrait('Susceptibility')">Susceptibility</BDropdownItem>
          <BDropdownItem @click="addTrait('Vulnerability')">Vulnerability</BDropdownItem>
          <BDropdownItem @click="addTrait('Damage Reduction')">Damage Reduction</BDropdownItem>
          <BDropdownItem @click="addTrait('Damage Amplification')"
            >Damage Amplification</BDropdownItem
          >
          <BDropdownItem @click="addTrait('Armor DVs')">Armor Dvs</BDropdownItem>
          <BDropdownItem @click="addTrait('Shield DVs')">Shield Dvs</BDropdownItem>
          <BDropdownItem @click="addTrait('Bonus DVs')">Bonus Dvs</BDropdownItem>
          <BDropdownItem @click="addTrait('Movement DVs')">Movement Dvs</BDropdownItem>
          <BDropdownItem @click="addTrait('Status Effect Immunity')"
            >Status Effect Immunity</BDropdownItem
          >
          <BDropdownItem @click="addTrait('Extra Origin Skills')"
            >Extra Origin Skills</BDropdownItem
          >
          <BDropdownItem @click="addTrait('Bonus HP')">Bonus Hp</BDropdownItem>
          <BDropdownItem @click="addTrait('Bonus Mana')">Bonus Mana</BDropdownItem>
          <BDropdownItem @click="addTrait('Exceptional')">Exceptional</BDropdownItem>
          <BDropdownItem @click="addTrait('Inferior')">Inferior</BDropdownItem>
          <BDropdownItem @click="addTrait('Size Category')">Size Category</BDropdownItem>
          <BDropdownItem @click="addTrait('Bonus MP')">Bonus MP</BDropdownItem>
          <BDropdownItem @click="addTrait('Bonus Movespeed')">Bonus Movespeed</BDropdownItem>
          <BDropdownItem @click="addTrait('Flight Speed')">Flight Speed</BDropdownItem>
          <BDropdownItem @click="addTrait('Swim Speed')">Swim Speed</BDropdownItem>
          <BDropdownItem @click="addTrait('Burrowing Speed')">Burrowing Speed</BDropdownItem>
          <BDropdownItem @click="addTrait('Climbing Speed')">Climbing Speed</BDropdownItem>
        </BDropdown>
        <BButton
          class="spacerButton"
          disabled
          :style="{
            background: designStore.inputBacking
          }"
        ></BButton>
      </BButtonGroup>
      <BButton
        class="indivs"
        style="border: 1px solid; font-size: medium; border-top: 0px; border-bottom: 0px"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        @click="customModal = true"
        >Add Custom Trait</BButton
      ></BButtonGroup
    >

    <CustomModal :showModal="modal" :title="selectedTrait" @close="modal = false">
      <template v-slot:body>
        <AddTrait
          :trait="traitStore.manualTraits[selectedTrait]"
          @staged-trait="(trait) => (stagedTrait = trait)"
        ></AddTrait>
      </template>
      <template v-slot:footer>
        <div style="display: flex">
          <BButton
            style="margin-right: 1rem; border: 1px solid"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              fontFamily: designStore.font
            }"
            @click="update(stagedTrait, true)"
            >OK</BButton
          >
          <BButton
            style="border: 1px solid"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              fontFamily: designStore.font,
              borderColor: designStore.secondaryTheme
            }"
            @click="modal = false"
            >Cancel</BButton
          >
        </div>
      </template>
    </CustomModal>
    <CustomModal :showModal="customModal" title="Add Custom Trait" @close="customModal = false">
      <template v-slot:body>
        <AddCustomTrait @staged-trait="(trait) => (stagedTrait = trait)"></AddCustomTrait>
      </template>
      <template v-slot:footer>
        <div style="display: flex">
          <BButton
            style="margin-right: 1rem; border: 1px solid"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              fontFamily: designStore.font
            }"
            @click="update(stagedTrait, false)"
            >OK</BButton
          >
          <BButton
            style="border: 1px solid"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              fontFamily: designStore.font,
              borderColor: designStore.secondaryTheme
            }"
            @click="customModal = false"
            >Cancel</BButton
          >
        </div>
      </template>
    </CustomModal>
    <TraitsTable :traits="Object.values(traits)"></TraitsTable>
  </div>
</template>
<style>
.bar {
  width: 100%;
  border-radius: 0;
  border: 2px solid;
  border-left: 0;
  display: flex;
  justify-content: space-between;
}
.indivs {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  max-width: 50%;
  border-radius: 0;
}

.btn {
  --bs-btn-bg: inherit;
  --bs-btn-color: inherit;
  --bs-btn-border-color: inherit;
  --bs-btn-hover-color: inherit;
  --bs-btn-hover-bg: inherit;
  --bs-btn-hover-border-color: inherit;
  --bs-btn-active-color: inherit;
  --bs-btn-active-bg: inherit;
  --bs-btn-active-border-color: inherit;
  border: none;
}

.dropdown-menu {
  width: 100%;
  max-width: none !important;
  position: inherit;
  --bs-dropdown-color: inherit;
  --bs-dropdown-bg: inherit;
  --bs-dropdown-link-hover-color: inherit;
  --bs-dropdown-link-hover-bg: inherit;
  --bs-dropdown-link-active-color: inherit;
  --bs-dropdown-link-active-bg: inherit;
  overflow-y: scroll;
}
@media (max-width: 500px) {
  .spacerButton {
    display: none;
  }
}

@media (min-width: 1024px) {
  .dropdown-menu {
    /* max-width: 15rem !important; */
    /* margin-left: calc(7.094rem + ((((100vw - 15.094rem) / 2) - 24.453rem) / 2)); */
    position: inherit;
    --bs-dropdown-color: inherit;
    --bs-dropdown-bg: inherit;
    --bs-dropdown-link-hover-color: inherit;
    --bs-dropdown-link-hover-bg: inherit;
    --bs-dropdown-link-active-color: inherit;
    --bs-dropdown-link-active-bg: inherit;
    overflow-y: scroll;
  }
}
.dropdown-item {
  color: inherit;
  --bs-dropdown-link-hover-color: inherit;
  --bs-dropdown-link-hover-bg: inherit;
  --bs-dropdown-link-active-color: inherit;
  --bs-dropdown-link-active-bg: inherit;
}
.presentation {
  --bs-dropdown-link-active-color: inherit;
  --bs-dropdown-link-active-bg: inherit;
  --bs-dropdown-link-hover-color: inherit;
  --bs-dropdown-link-hover-bg: inherit;
}
::-webkit-scrollbar-button ::before ::after {
  display: none;
}
::-webkit-scrollbar {
  width: 0px; /* Adjust scrollbar width */
  height: 8px; /* Adjust scrollbar height */
}
</style>
