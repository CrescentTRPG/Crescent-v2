<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import TitleWidget from '../../TitleWidget.vue'
import CustomAbilityTable from './CustomAbilityTable.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import {
  ABILITY_ENTRY,
  ABILITY_ENTRY_COMBAT_STYLE,
  ABILITY_ENTRY_MARTIAL_PERK,
  ABILITY_ENTRY_SPECIALIZATION,
  ABILITY_ENTRY_SPELLGROUP
} from '@/bases.ts'
import _ from 'lodash'
import { useManualStore } from '@/stores/manualStore.ts'
import { storeToRefs } from 'pinia'
import CustomModal from '../../CustomModal.vue'
import AbilityTypeSelect from './AbilityTypeSelect.vue'
import BuildSpellgroup from './BuildSpellgroup.vue'
import AreYouSure from '../../AreYouSure.vue'

export default {
  props: ['isCharacter'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const manualStore = useManualStore()
    const { stagedAbilityEntry } = storeToRefs(manualStore)
    const designStore = useDesignStore()
    const navPos = ref('table')
    const abilityType = ref('')
    function switchTab(tab: string) {
      navPos.value = tab
    }
    function editAbilityEntry(name) {
      manualStore.updateStagedAbilityEntry(_.cloneDeep(manualStore.customAbilities[name]))
      navPos.value = stagedAbilityEntry.value.type
    }
    function updateAbilityEntry(newAbility) {
      manualStore.updateStagedAbilityEntry(newAbility)
    }
    function goBack() {
      navPos.value = 'table'
    }
    function save() {
      manualStore.saveStagedCustomAbiity(stagedAbilityEntry.value)
      manualStore.updateStagedAbilityEntry(_.cloneDeep(ABILITY_ENTRY))
      goBack()
    }
    function closeModalAndLoadBuildPage() {
      modal.value = false
      switch (abilityType.value) {
        case 'Spellgroup':
          manualStore.updateStagedAbilityEntry(
            _.cloneDeep({ ...ABILITY_ENTRY_SPELLGROUP, name: 'New Spellgroup' })
          )
          break
        case 'MartialPerk':
          manualStore.updateStagedAbilityEntry(_.cloneDeep(ABILITY_ENTRY_MARTIAL_PERK))
          break
        case 'CombatStyle':
          manualStore.updateStagedAbilityEntry(_.cloneDeep(ABILITY_ENTRY_COMBAT_STYLE))
          break

        case 'Specialization':
          manualStore.updateStagedAbilityEntry(_.cloneDeep(ABILITY_ENTRY_SPECIALIZATION))
          break
      }
      navPos.value = abilityType.value
    }
    return {
      designStore,
      modal,
      userStore,
      props,
      editAbilityEntry,
      switchTab,
      navPos,
      abilityType,
      closeModalAndLoadBuildPage,
      stagedAbilityEntry,
      updateAbilityEntry,
      goBack,
      save
    }
  },
  components: {
    TitleWidget,
    CustomAbilityTable,
    BButton,
    CustomModal,
    AbilityTypeSelect,
    BuildSpellgroup,
    AreYouSure
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <div v-if="navPos === 'table'">
      <BButton
        @click="modal = true"
        style="
          border: 2px solid;
          position: absolute;
          right: 2rem;
          font-size: small;
          margin-top: 0.25rem;
        "
        class="hoverableTransparantLinear"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        >Build Custom Abiltiies <v-icon name="gi-quill"></v-icon
      ></BButton>
      <title-widget title="Custom Abilities"></title-widget>

      <CustomAbilityTable :edit="editAbilityEntry"></CustomAbilityTable>
    </div>
    <BuildSpellgroup
      :spellgroup="stagedAbilityEntry"
      :updateSpellgroup="updateAbilityEntry"
      v-if="navPos === 'Spellgroup'"
    ></BuildSpellgroup>
    <CustomModal :showModal="modal" title="Select Ability Type" @close="modal = false">
      <template v-slot:body>
        <AbilityTypeSelect
          :type="abilityType"
          :update="(val) => (abilityType = val)"
        ></AbilityTypeSelect
      ></template>
      <template v-slot:footer>
        <BButton
          style="border: 1px solid; margin-right: 1rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="closeModalAndLoadBuildPage()"
          >Start Creating</BButton
        >
        <BButton
          style="border: 1px solid; margin-right: 1rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="modal = false"
          >Cancel</BButton
        ></template
      >
    </CustomModal>
    <div
      v-if="navPos != 'table'"
      style="
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid;
        position: fixed;
        width: calc(Max(100% - 9rem, 83%));
        bottom: 0;
        z-index: 5;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="display: flex; justify-content: flex-end; margin: 0.2rem">
        <BButton
          class="footerButtons"
          style="margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="save()"
        >
          <i class="bi bi-floppy"></i>
          <div style="margin-left: 0.5rem" class="discardText">Save</div>
          <div class="goBackText">and Go Back</div>
        </BButton>
        <AreYouSure action="discard all changes and return to the table" :passedFunction="goBack">
          <BButton
            class="footerButtons"
            style="margin-left: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <i class="bi bi-arrow-90deg-left"></i>
            <div class="discardText">Return</div>
            <div class="goBackText"></div>
          </BButton>
        </AreYouSure>
      </div>
    </div>
  </div>
</template>

<style>
.manualPage {
  display: flex;
}
.manualPageContents {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
</style>
