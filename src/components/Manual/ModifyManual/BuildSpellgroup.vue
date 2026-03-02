<script lang="ts">
import AreaDropdown from '@/components/AreaDropdown.vue'
import DurationDropdown from '@/components/DurationDropdown.vue'
import TargetDropdown from '@/components/TargetDropdown.vue'
import TypeDropdown from '@/components/TypeDropdown.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { BButton, BForm } from 'bootstrap-vue-next'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import _ from 'lodash'
import { ref } from 'vue'
import ActionCostDropdown from '../../ActionCostDropdown.vue'
import CustomModal from '../../CustomModal.vue'
import TitleWidget from '../../TitleWidget.vue'
import BuildSpellgroupHeader from './BuildSpellgroupHeader.vue'
import NewCustomSpellgroupTable from './NewCustomSpellgroupTable.vue'

export default {
  props: ['spellgroup', 'updateSpellgroup'],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)

    const newAbility = ref({
      name: '',
      actionCost: 'Core Action',
      area: 'Self',
      target: 'Character',
      duration: '1 Round',
      type: 'Evocation',
      resistance: 'N/A',
      description: '',
      rank: 0,
      spellgroup: props.spellgroup.name
    })
    function edit(spell) {
      mode.value = true
      newAbility.value = _.cloneDeep(spell)
      ogName.value = newAbility.value.name
      modal.value = true
    }
    const mode = ref(false)
    const ogName = ref('')
    function deleteSpell(name) {
      let newSpells = _.cloneDeep(props.spellgroup.spells)
      delete newSpells[name]
      let newSpellgroup = { ...props.spellgroup, spells: newSpells }
      props.updateSpellgroup(newSpellgroup)
    }

    function updateSpell() {
      if (
        props.spellgroup.spells[newAbility.value.name] &&
        ((mode.value && ogName.value != newAbility.value.name) || !mode.value)
      ) {
        alert(
          'A spell of this name already Exists!!! Spell names within the spellgroup must be unique!!!'
        )
      } else {
        if (newAbility.value.name && newAbility.value.rank >= 0) {
          let newSpells = _.cloneDeep(props.spellgroup.spells)
          newSpells[newAbility.value.name] = newAbility.value
          if (ogName.value !== newAbility.value.name && mode.value) {
            delete newSpells[ogName.value]
          }
          let newSpellgroup = { ...props.spellgroup, spells: newSpells }
          props.updateSpellgroup(newSpellgroup)

          modal.value = false
          mode.value = false
          ogName.value = ''
          newAbility.value = {
            name: '',
            actionCost: 'Core Action',
            area: 'Self',
            target: 'Caster',
            duration: '1 Round',
            type: 'Evocation',
            resistance: 'N/A',
            description: '',
            rank: 0,
            spellgroup: props.spellgroup.name
          }
        } else if (!newAbility.value.name) {
          alert('Ability must have name!')
        } else {
          alert('Ability must have rank >= 0!')
        }
      }
    }
    function openAdd() {
      mode.value = false
      modal.value = true
    }
    function changeSpells(val) {
      let newSpells = _.cloneDeep(props.spellgroup.spells)
      Object.keys(newSpells).forEach((key) => {
        newSpells[key].spellgroup = val
      })
      let spellgroupCopy = _.cloneDeep(props.spellgroup)
      spellgroupCopy.spells = newSpells
      spellgroupCopy.name = val
      props.updateSpellgroup(spellgroupCopy)
    }

    return {
      designStore,
      props,
      modal,
      updateSpell,
      newAbility,
      edit,
      deleteSpell,
      ogName,
      mode,
      openAdd,
      changeSpells
    }
  },

  components: {
    // BFormInput,
    // IconPicker,
    BButton,
    // BFormTextarea,
    TitleWidget,
    BuildSpellgroupHeader,
    NewCustomSpellgroupTable,
    CustomModal,
    BFormInput,
    BForm,
    ActionCostDropdown,
    BFormTextarea,
    TypeDropdown,
    TargetDropdown,
    AreaDropdown,
    DurationDropdown
  }
}
</script>
<template>
  <div>
    <TitleWidget title="Build New Spellgroup"></TitleWidget>

    <BuildSpellgroupHeader
      @nameChange="(val) => changeSpells(val)"
      :spellgroup="props.spellgroup"
      :update-spellgroup="props.updateSpellgroup"
    ></BuildSpellgroupHeader>
    <BButton
      class=""
      @click="openAdd()"
      style="
        border: 2px solid;
        position: absolute;
        right: 2rem;
        font-size: small;
        margin-top: 1.2rem;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
      >Add New Spell <i class="bi bi-plus"></i
    ></BButton>
    <TitleWidget title="Spells"></TitleWidget>
    <NewCustomSpellgroupTable
      :updateSpell="edit"
      :delete-spell="deleteSpell"
      :spells="Object.values(spellgroup.spells).sort((a: any, b: any) => a.rank - b.rank)"
      :icon="spellgroup.groupIcon"
    ></NewCustomSpellgroupTable>
    <CustomModal
      :show-modal="modal"
      @close="modal = false"
      :title="mode ? 'Edit Spell' : 'Add Spell'"
    >
      <template v-slot:body>
        <BForm
          style="padding-bottom: 1rem"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <div style="display: flex">
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Name:</div>

            <BFormInput
              v-model="newAbility.name"
              placeholder="New Spell"
              style="border-left: 0; border-top: 0"
              class="ability-form-item"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme,
                '--bs-secondary-color': designStore.inputText
              }"
            ></BFormInput>
            <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Rank:</div>

            <BFormInput
              v-model="newAbility.rank"
              type="number"
              :min="0"
              style="border-left: 0; border-top: 0"
              class="ability-form-item"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme,
                '--bs-secondary-color': designStore.inputText
              }"
            ></BFormInput>
          </div>
          <div
            class="abilityGrid"
            style="margin-top: 0rem"
            :style="{
              background: designStore.secondaryTheme,
              color: designStore.sidebarText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div
              class="ability-item"
              :style="{
                background: designStore.sidebarBacking,
                color: designStore.sidebarText
              }"
            >
              <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">
                Action Cost:
              </div>
              <ActionCostDropdown v-model="newAbility.actionCost"></ActionCostDropdown>
            </div>

            <div
              class="ability-item"
              :style="{
                background: designStore.sidebarBacking,
                color: designStore.sidebarText
              }"
            >
              <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Target:</div>
              <TargetDropdown v-model="newAbility.target"></TargetDropdown>
            </div>
            <div
              class="ability-item"
              :style="{
                background: designStore.sidebarBacking,
                color: designStore.sidebarText
              }"
            >
              <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Area:</div>
              <AreaDropdown v-model="newAbility.area"></AreaDropdown>
            </div>
            <div
              class="ability-item"
              :style="{
                background: designStore.sidebarBacking,
                color: designStore.sidebarText
              }"
            >
              <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Type:</div>
              <TypeDropdown v-model="newAbility.type"></TypeDropdown>
            </div>
            <div
              class="ability-item"
              :style="{
                background: designStore.sidebarBacking,
                color: designStore.sidebarText
              }"
            >
              <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">
                Duration:
              </div>
              <DurationDropdown v-model="newAbility.duration"></DurationDropdown>
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
                v-model="newAbility.resistance"
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
            placeholder="description"
            v-model="newAbility.description"
            class="ability-form-last-item"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme,
              '--bs-secondary-color': designStore.inputText
            }"
            style="border-top: 0; min-height: 14rem"
          ></BFormTextarea>
        </BForm>
      </template>
      <template v-slot:footer>
        <BButton
          class="hoverablePrimary"
          @click="updateSpell()"
          style="border: 2px solid; margin-top: 1.2rem; margin-right: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          >Save <i class="bi bi-floppy"></i>
        </BButton>
        <BButton
          class="hoverablePrimary"
          @click="modal = false"
          style="border: 2px solid; margin-top: 1.2rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          >Close <i class="bi bi-x-circle"></i>
        </BButton>
      </template>
    </CustomModal>
  </div>
</template>
<style></style>
