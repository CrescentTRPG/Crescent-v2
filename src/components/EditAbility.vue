<script lang="ts">
import AreaDropdown from '@/components/AreaDropdown.vue'
import DurationDropdown from '@/components/DurationDropdown.vue'
import TargetDropdown from '@/components/TargetDropdown.vue'
import TypeDropdown from '@/components/TypeDropdown.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { BForm } from 'bootstrap-vue-next'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import _ from 'lodash'
import { onMounted, ref } from 'vue'
import ActionCostDropdown from './ActionCostDropdown.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'

export default {
  props: [
    'nameProp',
    'areaProp',
    'durationProp',
    'targetProp',
    'typeProp',
    'resistanceProp',
    'actionCostProp',
    'descriptionProp',
    'rankProp',
    'targets',
    'types',
    'durations',
    'showRank',
    'buttonFunction',
    'revertFunction'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)

    const name = ref('')
    const actionCost = ref('')
    const area = ref('')
    const target = ref('')
    const duration = ref('')
    const type = ref('')
    const resistance = ref('')
    const description = ref('')
    const rank = ref('')
    onMounted(() => {
      name.value = props.nameProp || ''
      actionCost.value = props.actionCostProp || ''
      area.value = props.areaProp || ''
      target.value = props.targetProp || ''
      duration.value = props.durationProp || ''
      type.value = props.typeProp || ''
      resistance.value = props.resistanceProp || ''
      description.value = props.descriptionProp || ''
      rank.value = props.rankProp || 0
    })

    const mode = ref(false)
    const ogName = ref('')

    function updateAbility() {
      context.emit('edited', {
        name: name,
        actionCost: actionCost,
        target: target,
        area: area,
        duration: duration,
        type: type,
        resistance: resistance,
        description: description,
        rank: rank
      })
    }

    return {
      designStore,
      props,
      modal,
      ogName,
      updateAbility,
      mode,
      name,
      duration,
      actionCost,
      target,
      area,
      type,
      resistance,
      description,
      rank
    }
  },

  components: {
    // BFormInput,
    // IconPicker,
    BFormInput,
    BForm,
    ActionCostDropdown,
    BFormTextarea,
    TypeDropdown,
    TargetDropdown,
    AreaDropdown,
    DurationDropdown,
    BButton
  }
}
</script>
<template>
  <div>
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
          @change="updateAbility()"
          v-model="name"
          placeholder="New Ability"
          style="border-left: 0; border-top: 0"
          class="ability-form-item"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText
          }"
        ></BFormInput>
        <div v-if="showRank" style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">
          Rank:
        </div>

        <BFormInput
          @change="updateAbility()"
          v-if="showRank"
          v-model="rank"
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
        <BButton
          @click="props.revertFunction()"
          style="border: 1px solid; z-index: 3; margin: 0.5rem; margin-right: 0.5rem"
          :style="{
            borderColor: designStore.secondaryTheme,
            background: designStore.primaryTheme
          }"
        >
          Revert
        </BButton>
        <BButton
          @click="props.buttonFunction"
          style="
            border: 1px solid;
            z-index: 3;
            margin: 0.5rem;

            display: flex;
          "
          :style="{
            borderColor: designStore.secondaryTheme,
            background: designStore.primaryTheme
          }"
          >Save
        </BButton>
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
          <ActionCostDropdown @change="updateAbility()" v-model="actionCost"></ActionCostDropdown>
        </div>

        <div
          class="ability-item"
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText
          }"
        >
          <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Target:</div>
          <TargetDropdown @change="updateAbility()" v-model="target"></TargetDropdown>
        </div>
        <div
          class="ability-item"
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText
          }"
        >
          <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Area:</div>
          <AreaDropdown @change="updateAbility()" v-model="area"></AreaDropdown>
        </div>
        <div
          class="ability-item"
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText
          }"
        >
          <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Type:</div>
          <TypeDropdown @change="updateAbility()" v-model="type"></TypeDropdown>
        </div>
        <div
          class="ability-item"
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText
          }"
        >
          <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Duration:</div>
          <DurationDropdown @change="updateAbility()" v-model="duration"></DurationDropdown>
        </div>
        <div
          class="ability-item"
          :style="{
            background: designStore.sidebarBacking,
            color: designStore.sidebarText
          }"
        >
          <div style="align-self: center; text-wrap: nowrap; padding-left: 0.5rem">Resistance:</div>
          <BFormInput
            @change="updateAbility()"
            v-model="resistance"
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
        @change="updateAbility()"
        placeholder="description"
        v-model="description"
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
  </div>
</template>
<style></style>
