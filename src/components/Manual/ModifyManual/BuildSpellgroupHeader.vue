<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { ref } from 'vue'
import BasicInput from '../../Character/BasicInput.vue'
import CustomModal from '../../CustomModal.vue'
import DropdownSelect from '../../DropdownSelect.vue'
import FancyDecor from '../../FancyDecor.vue'
import IconPicker from '../../IconPicker.vue'
import RibbonTitle from '../../RibbonTitle.vue'
import SelectCost from './SelectCost.vue'
import SelectResouceGain from './SelectResouceGain.vue'
import SelectSpellgroupOrder from './SelectSpellgroupOrder.vue'

export default {
  props: ['spellgroup', 'updateSpellgroup'],
  emits: ['nameChange'],
  setup(props, context) {
    const designStore = useDesignStore()
    const nameModal = ref(false)
    const attributes = [
      { text: 'Agility', value: 'Agility' },
      { text: 'Strength', value: 'Strength' },
      { text: 'Health', value: 'Health' },
      { text: 'Willpower', value: 'Willpower' },
      { text: 'Charisma', value: 'Charisma' },
      { text: 'Intelligence', value: 'Intelligence' },
      { text: 'Perception', value: 'Perception' },
      { text: 'Power', value: 'Power' },
      { text: 'None', value: '' }
    ]

    function updateName(val) {
      let newSpellgroup = { ...props.spellgroup, name: val }
      //props.updateSpellgroup(newSpellgroup)
      nameModal.value = false
      context.emit('nameChange', val)
    }

    function updateIcon(val) {
      let newSpellgroup = { ...props.spellgroup, groupIcon: val }
      props.updateSpellgroup(newSpellgroup)
    }

    function updateRankLimiter(val) {
      let newSpellgroup = { ...props.spellgroup, rankLimiter: val }
      props.updateSpellgroup(newSpellgroup)
      nameModal.value = false
    }

    function updateInOrder(val) {
      let newSpellgroup = { ...props.spellgroup, inOrder: val }
      props.updateSpellgroup(newSpellgroup)
    }
    function updateResource(val) {
      let newSpellgroup = { ...props.spellgroup, resource: val }
      props.updateSpellgroup(newSpellgroup)
    }
    function updateManaGain(val) {
      let newSpellgroup = { ...props.spellgroup, manaGain: val }
      props.updateSpellgroup(newSpellgroup)
    }
    function updateFlatCost(val) {
      let newSpellgroup = { ...props.spellgroup, flatCost: val }
      props.updateSpellgroup(newSpellgroup)
    }
    function updateBaseCost(val) {
      let newSpellgroup = { ...props.spellgroup, baseCost: val }
      props.updateSpellgroup(newSpellgroup)
    }

    function updateGroupPurchaseLimiter(val) {
      let newSpellgroup = { ...props.spellgroup, groupPurchaseLimiter: val }
      props.updateSpellgroup(newSpellgroup)
      nameModal.value = false
    }
    return {
      designStore,
      attributes,
      nameModal,
      updateName,
      updateIcon,
      updateRankLimiter,
      updateGroupPurchaseLimiter,
      updateInOrder,
      updateResource,
      updateManaGain,
      updateFlatCost,
      updateBaseCost
    }
  },

  components: {
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    DropdownSelect,
    BasicInput,
    CustomModal,
    RibbonTitle,
    IconPicker,
    FancyDecor,
    SelectSpellgroupOrder,
    SelectResouceGain,
    SelectCost
  }
}
</script>
<template>
  <div>
    <div style="display: flex; justify-content: space-between; z-index: 3">
      <div style="display: flex; flex-wrap: wrap; width: 100%">
        <RibbonTitle
          @click="nameModal = true"
          style="
            height: fit-content;
            align-self: end;
            margin: 1rem;
            margin-right: 0;
            z-index: 5;
            cursor: pointer;
          "
          :enableHover="true"
          :background="designStore.primaryTheme"
          :textColor="designStore.primaryText"
          :title="spellgroup.name === 'New Spellgroup' ? 'Spellgroup Name Here' : spellgroup.name"
        ></RibbonTitle>
        <CustomModal :showModal="nameModal" title="Edit Spellgroup Name" @close="nameModal = false">
          <template v-slot:body>
            <div>
              <BasicInput
                @newValue="(val) => updateName(val)"
                :label="'name'"
                :value="spellgroup.name"
              ></BasicInput>
            </div>
          </template>
        </CustomModal>
        <div style="display: flex; flex-grow: 1">
          <div style="display: flex; width: 100%; justify-content: end">
            <SelectCost
              style="z-index: 4"
              :baseCost="spellgroup.baseCost"
              :flatCost="spellgroup.flatCost"
              :updateFlatCost="updateFlatCost"
              :updateBaseCost="updateBaseCost"
            ></SelectCost>
            <SelectSpellgroupOrder
              style="z-index: 4"
              :inOrder="spellgroup.inOrder"
              :updateInOrder="updateInOrder"
            ></SelectSpellgroupOrder>

            <SelectResouceGain
              style="z-index: 4"
              :resource="spellgroup.resource || 'none'"
              :updateResource="updateResource"
              :manaGain="spellgroup.manaGain"
              :updateManaGain="updateManaGain"
            ></SelectResouceGain>

            <div
              style="
                display: flex;
                flex-direction: column;
                margin: 0.5rem;
                border-radius: 0.5rem;
                z-index: 4;
              "
              :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
            >
              <div style="text-align: center">Icon</div>
              <IconPicker
                :style="{ background: designStore.inputBacking, color: designStore.inputText }"
                style="align-self: center; border-radius: 10px; margin: 0.5rem; margin-top: 0"
                :currentIcon="spellgroup.groupIcon"
                @selectedIcon="(icon) => updateIcon(icon)"
                orientation="left"
              ></IconPicker>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      style="
        flex-grow: 1;
        height: 3.5rem;
        position: relative;
        flex-grow: 1;
        z-index: 1rem;
        margin-top: -4rem;
      "
      :style="{ background: designStore.sidebarBacking, color: designStore.inputText }"
    ></div>
    <div style="display: flex; flex-wrap: wrap; flex-grow: 1" class="arrangeLimiters">
      <div style="flex-grow: 1">
        <FancyDecor
          style="flex-grow: 1"
          :background="designStore.inputBacking"
          icon="gi-classical-knowledge"
          :color="designStore.inputText"
          text="Group Purchase Limiter"
          width="19rem"
          :hasExplanation="true"
          info="A Group Purchase Limiter is an attribute that defines what category of spellgroups it falls under.  Divine Groups are Charisma based and Elemental / Core Magics are Intelligence based.  You may create your own categories based around different attributes and define them how you wish.  Within a category, users may get a number of spellgroups in the category equal to (Attribute Score of Group Purchase Limiter)/2"
        >
          <template v-slot:body>
            <DropdownSelect
              :default="spellgroup.groupPurchaseLimiter || 'None'"
              :options="attributes"
              style="flex-grow: 1"
              @selection="(limiter) => updateGroupPurchaseLimiter(limiter)"
            ></DropdownSelect></template
        ></FancyDecor>
      </div>
      <div style="flex-grow: 1">
        <FancyDecor
          :background="designStore.inputBacking"
          icon="gi-podium-winner"
          :color="designStore.inputText"
          text="Rank Limiter"
          width="19rem"
          :hasExplanation="true"
          info="A Rank Limiter is the attribute that caps the maximum rank a character may buy in this spellgroup.  Ex:  If the Rank Limiter is Power and a character has a Power of 4, the highest rank spell they may purchase in this spellgroup is 4.  It is also traditionally the Attribute use to set checks in a spellgroup, though you may define this elsewise in the spells description."
        >
          <template v-slot:body>
            <DropdownSelect
              :default="spellgroup.rankLimiter || 'None'"
              :options="attributes"
              style="flex-grow: 1"
              @selection="(limiter) => updateRankLimiter(limiter)"
            ></DropdownSelect></template
        ></FancyDecor>
      </div>
    </div>
  </div>
</template>
<style>
.arrangeLimiters {
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
}
</style>
