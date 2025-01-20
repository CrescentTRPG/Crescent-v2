<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { BForm, BFormInput, BFormTextarea, BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import IconPicker from '@/components/IconPicker.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import ActionCostDropdown from '@/components/ActionCostDropdown.vue'
import SearchForAbilityDropdown from '@/components/SearchForAbilityDropdown.vue'
export default {
  emits: ['stagedTrait'],
  setup(props, context) {
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const hasAbility = ref(false)
    const icon = ref('gi-dna1')
    const trait = ref({
      name: '',
      description: 'Write the trait description here',
      icon: 'gi-dna1'
    })
    const traitAbility = ref({
      isTrait: true,
      name: trait.value.name,
      actionCost: 'Core Action',
      area: 'Self',
      target: 'Character',
      duration: '1 Round',
      type: 'Instantaneous',
      resistance: 'N/A',
      description: 'trait description',
      groupIcon: icon
    })
    const emitTrait = () => {
      if (!hasAbility.value) {
        context.emit('stagedTrait', trait)
      } else {
        let newTrait = { ...trait.value, ability: traitAbility }
        context.emit('stagedTrait', newTrait)
      }
    }

    const updateHasAbility = (bool: boolean) => {
      hasAbility.value = bool
    }

    return {
      designStore,
      tab,
      props,
      emitTrait,
      trait,
      hasAbility,
      updateHasAbility,
      traitAbility
    }
  },
  components: {
    BInputGroup,
    BFormInput,
    BInputGroupText,
    IconPicker,
    ToggleSwitch,
    BFormTextarea,
    ActionCostDropdown,
    BForm,
    SearchForAbilityDropdown
  }
}
</script>
<template>
  <div>
    <div class="nameIcon">
      <div class="trait-name-container">
        <BInputGroupText
          class="trait-name-label"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          >Trait Name</BInputGroupText
        >
        <BFormInput
          @change="emitTrait()"
          v-model="trait.name"
          class="trait-name"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
        >
        </BFormInput>
      </div>
      <div
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          text-align: center;
          margin: 0.5rem;
        "
      >
        Trait Icon
        <IconPicker
          @change="emitTrait()"
          :style="{ background: designStore.inputBacking }"
          style="align-self: center; border-radius: 10px"
          :currentIcon="trait.icon"
          @selectedIcon="(icon) => (trait.icon = icon)"
          orientation="bottom"
        ></IconPicker>
      </div>
    </div>
    <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap">
      <BInputGroupText
        class="trait-label"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        >Trait Description</BInputGroupText
      ><BFormTextarea
        @change="emitTrait()"
        style="height: fit-content !important; border-top-left-radius: 0; min-height: 6rem"
        v-model="trait.description"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      ></BFormTextarea>
    </div>
    <BInputGroup
      style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; max-width: 12rem"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
      ><BInputGroupText
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        style="border-top: none; border-bottom: none; border-left: none"
        >Has Ability ?</BInputGroupText
      >
      <ToggleSwitch
        style="margin-top: 0.5rem; margin-left: 0.3rem"
        @true="updateHasAbility(true)"
        @false="updateHasAbility(false)"
      ></ToggleSwitch>
    </BInputGroup>
    <div v-if="hasAbility" style="margin-top: 1rem">
      <SearchForAbilityDropdown
        @ability="(ability) => (traitAbility = ability)"
      ></SearchForAbilityDropdown>
      <BForm
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <BFormInput
          v-model="traitAbility.name"
          @change="emitTrait()"
          placeholder="name"
          class="ability-form-item"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            '--bs-secondary-color': designStore.inputText
          }"
        ></BFormInput>
        <div
          class="abilityGrid"
          style="margin-top: 0rem"
          :style="{
            background: designStore.secondaryTheme,
            color: designStore.sidebarText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <ActionCostDropdown
            v-model="traitAbility.actionCost"
            @change="emitTrait()"
            class="grid__item"
          ></ActionCostDropdown>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Target:</div>
            <BFormInput
              @change="emitTrait()"
              v-model="traitAbility.target"
              placeholder="target"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Area:</div>
            <BFormInput
              @change="emitTrait()"
              v-model="traitAbility.area"
              placeholder="area"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Type:</div>
            <BFormInput
              @change="emitTrait()"
              v-model="traitAbility.type"
              placeholder="type"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Duration:</div>
            <BFormInput
              @change="emitTrait()"
              v-model="traitAbility.duration"
              placeholder="duration"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
          <div
            class="ability-item"
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText
            }"
          >
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">
              Resistance:
            </div>
            <BFormInput
              @change="emitTrait()"
              v-model="traitAbility.resistance"
              placeholder="resistance"
              :style="{
                background: designStore.sidebarBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.sidebarText,
                '--bs-secondary-color': designStore.sidebarText
              }"
              style="border: none; border-radius: 0"
            ></BFormInput>
          </div>
        </div>
        <BFormTextarea
          @change="emitTrait()"
          placeholder="description"
          v-model="traitAbility.description"
          class="ability-form-last-item"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
          style="border-top: 0; min-height: 6rem"
        ></BFormTextarea>
      </BForm>
    </div>
  </div>
</template>
<style>
.ability-form-item {
  border-radius: 0;
  border: 1px solid;
  border-bottom: 0;
}
.ability-form-last-item {
  border-radius: 0;
  border: 1px solid;
}
.form-check-input {
  --bs-form-check-bg: inherit;
  color: inherit;
  border-color: inherit;
}
.form-check {
  --bs-form-check-bg: inherit;
  color: inherit;
  background-color: inherit;
  border-color: inherit;
}
.form-check-input:checked {
  --bs-form-check-bg: inherit;
  color: inherit;
  --input-bg: inherit;
  background-color: var(--input-bg);
  border-color: inherit;
  background-image: none;
}
.nested-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.trait-name-label {
  height: 4rem;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-right: 0;
}

.trait-name {
  height: 4rem;
  min-height: 2rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  flex-grow: 1;
}

.trait-name-container {
  margin-top: 1.5rem;
  display: flex;
  align-self: center;
  width: 100%;
}

.trait-label {
  align-self: flex-end;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: 0;
}

.nameIcon {
  display: flex;
  margin-top: -1rem;
}

.ability-item {
  display: flex;
  justify-content: flex-start;
  height: 100%;
  padding-right: 0.5rem;
}

.ability-item-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: fit-content;
}
@media (min-width: 1024px) {
  .nested-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 650px) {
  .trait-name {
    height: fit-content;
    border-bottom-left-radius: 0.375rem;
  }
  .trait-name-label {
    height: fit-content;
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-right: 1px solid;
    border-bottom: 0;
  }
  .trait-name-container {
    flex-wrap: wrap;
    margin-bottom: 0.5rem;
  }
  .nested-grid {
    margin-top: -1rem;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  @media (max-width: 450px) {
    .nameIcon {
      flex-wrap: wrap-reverse;
      justify-content: flex-end;
    }
    .trait-name-container {
      margin-bottom: 0rem;
      margin-top: -2.5rem;
    }
    .ability-item {
      flex-wrap: wrap;
    }
  }
}
</style>
