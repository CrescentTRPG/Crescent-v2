<script lang="ts">
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { BButton } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { Ref, ref } from 'vue'
import CustomModal from '../CustomModal.vue'
import { BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import BasicInput from '../Character/BasicInput.vue'

export default {
  setup(props: any) {
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const { settings } = storeToRefs(adventureStore)
    const settingsModal = ref(false)
    const maxChats = ref(settings.value.maxChats)
    const initiativeDisplayNumericHp: Ref<boolean> = ref(
      settings.value.initiativeDisplayNumericHp || false
    )
    const initiativeDisplayNumericMana: Ref<boolean> = ref(
      settings.value.initiativeDisplayNumericMana || false
    )
    const initiativeDisplayHp: Ref<boolean> = ref(settings.value.initiativeDisplayHp || true)
    const initiativeDisplayMana: Ref<boolean> = ref(settings.value.initiativeDisplayMana || true)
    const initiativeDisplayEnemyTraits: Ref<boolean> = ref(
      settings.value.initiativeDisplayEnemyTraits
    )
    const initiativeDisplayCharacterTraits: Ref<boolean> = ref(
      settings.value.initiativeDisplayCharacterTraits
    )
    const initiativeDefaultExpanded: Ref<boolean> = ref(settings.value.initiativeDefaultExpanded)
    const allowApplyStatusToCharacter: Ref<boolean> = ref(
      settings.value.allowApplyStatusToCharacter
    )
    const allowApplyStatusToEnemy: Ref<boolean> = ref(settings.value.allowApplyStatusToEnemy)

    function updateSettings() {
      const val = {
        maxChats: maxChats.value,
        initiativeDisplayNumericHp: initiativeDisplayNumericHp.value,
        initiativeDisplayNumericMana: initiativeDisplayNumericMana.value,
        initiativeDisplayHp: initiativeDisplayHp.value,
        initiativeDisplayMana: initiativeDisplayMana.value,
        initiativeDisplayEnemyTraits: initiativeDisplayEnemyTraits.value,
        initiativeDisplayCharacterTraits: initiativeDisplayCharacterTraits.value,
        initiativeDefaultExpanded: initiativeDefaultExpanded.value,
        allowApplyStatusToCharacter: allowApplyStatusToCharacter.value,
        allowApplyStatusToEnemy: allowApplyStatusToEnemy.value
      }
      adventureStore.updateSettings(val)
    }
    return {
      designStore,
      settings,
      props,
      adventureStore,
      settingsModal,
      maxChats,
      initiativeDisplayNumericHp,
      initiativeDisplayNumericMana,
      initiativeDisplayHp,
      initiativeDisplayMana,
      initiativeDisplayEnemyTraits,
      initiativeDisplayCharacterTraits,
      initiativeDefaultExpanded,
      allowApplyStatusToCharacter,
      allowApplyStatusToEnemy,
      updateSettings
    }
  },
  components: { BButton, CustomModal, BInputGroup, BInputGroupText, ToggleSwitch, BasicInput }
}
</script>
<template>
  <div>
    <BButton
      @click="settingsModal = true"
      class="button shrinkingButton"
      style="margin-right: 0.25rem; margin-bottom: 1rem"
      :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
    >
      <i class="bi bi-gear-fill"></i>
    </BButton>
    <CustomModal title="Settings" :showModal="settingsModal" @close="settingsModal = false">
      <template v-slot:body>
        <BasicInput
          label="Max Chats in Chatbox"
          :value="maxChats"
          type="number"
          :max="500"
          :min="0"
          @newValue="(val) => (maxChats = val)"
        ></BasicInput>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Display Numeric Mana to Characters</BInputGroupText
          >
          <ToggleSwitch
            :value="initiativeDisplayNumericMana"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((initiativeDisplayNumericMana = true), updateSettings())"
            @false="((initiativeDisplayNumericMana = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Display Numeric HP to Characters</BInputGroupText
          >
          <ToggleSwitch
            :value="initiativeDisplayNumericHp"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((initiativeDisplayNumericHp = true), updateSettings())"
            @false="((initiativeDisplayNumericHp = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Allow Players to see other's HP</BInputGroupText
          >
          <ToggleSwitch
            :value="initiativeDisplayHp"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((initiativeDisplayHp = true), updateSettings())"
            @false="((initiativeDisplayHp = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Allow Players to see other's Mana</BInputGroupText
          >
          <ToggleSwitch
            :value="initiativeDisplayMana"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((initiativeDisplayMana = true), updateSettings())"
            @false="((initiativeDisplayMana = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>

        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Allow Players to see enemy traits</BInputGroupText
          >
          <ToggleSwitch
            :value="initiativeDisplayEnemyTraits"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((initiativeDisplayEnemyTraits = true), updateSettings())"
            @false="((initiativeDisplayEnemyTraits = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Allow Players to see other character's traits</BInputGroupText
          >
          <ToggleSwitch
            :value="initiativeDefaultExpanded"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((initiativeDisplayCharacterTraits = true), updateSettings())"
            @false="((initiativeDisplayCharacterTraits = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Default Expanded Dropdowns on Initiative Tracker</BInputGroupText
          >
          <ToggleSwitch
            :value="initiativeDefaultExpanded"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((initiativeDefaultExpanded = true), updateSettings())"
            @false="((initiativeDefaultExpanded = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Allow Players to apply Statuses to other Players</BInputGroupText
          >
          <ToggleSwitch
            :value="allowApplyStatusToCharacter"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="((allowApplyStatusToCharacter = true), updateSettings())"
            @false="((allowApplyStatusToCharacter = false), updateSettings())"
          ></ToggleSwitch>
        </BInputGroup>
        <BInputGroup
          style="margin-top: 1rem; border: 1px solid; border-radius: 0.3rem; width: fit-content"
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
            >Allow Players to apply Statuses to Enemies</BInputGroupText
          >
          <ToggleSwitch
            :value="allowApplyStatusToEnemy"
            style="margin-top: 0.5rem; margin-left: 0.3rem; max-width: 5rem"
            @true="allowApplyStatusToEnemy = true"
            @false="allowApplyStatusToEnemy = false"
          ></ToggleSwitch>
        </BInputGroup>
      </template>
    </CustomModal>
  </div>
</template>
<style>
.shrinkingButton {
  margin-right: 0.25rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}
@media (max-width: 450px) {
  .shrinkingButton {
    border: none;
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }
}
</style>
