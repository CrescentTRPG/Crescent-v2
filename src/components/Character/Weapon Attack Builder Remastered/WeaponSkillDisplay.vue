<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import FancyDecor from '@/components/FancyDecor.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { BButton } from 'bootstrap-vue-next'
import { lightenDarkenColor } from '../../../Utility.ts'
import _ from 'lodash'
import { computed, ComputedRef, ref, watch } from 'vue'

export default {
  props: [
    'skillObj',
    'mpAllocated',
    'update',
    'remove',
    'increasedCosts',
    'universalModifiesSomeCosts',
    'maxSkillRank',
    'noShadow'
  ],
  setup(props, context) {
    const minCost = computed(() => {
      return (
        props.skillObj.skillStats.mpCost ||
        (props.skillObj.skillStats.modes &&
          props.skillObj.skillStats[props.skillObj.skillStats.modes[0]].mpCost)
      )
    })
    const min: ComputedRef<number> = computed(() => {
      if (props.skillObj.costMalleable) {
        return minCost.value + (props.universalModifiesSomeCosts || 0) + (props.increasedCosts || 0)
      }
      return minCost.value + (props.increasedCosts || 0)
    })
    const costPerRank = computed(() => {
      return (
        props.skillObj.skillStats.additionalMpCost ||
        (props.skillObj.skillStats.modes?.length > 1 &&
          props.skillObj.skillStats[props.skillObj.skillStats.modes[0]].additionalMpCost) ||
        props.skillObj.skillStats.mpCost ||
        (props.skillObj.skillStats.modes?.length > 1 &&
          props.skillObj.skillStats[props.skillObj.skillStats.modes[0]].mpCost)
      )
    })
    const localModifiedCost = ref(props.universalModifiesSomeCosts)
    const localIncreasedCosts = ref(props.skillObj.skillStats.increasedCosts)
    const rankCost: ComputedRef<number> = computed(() => {
      if (props.skillObj.skillStats.costMalleable) {
        return costPerRank.value + props.universalModifiesSomeCosts + (props.increasedCosts || 0)
      }

      return costPerRank.value + (props.increasedCosts || 0)
    })
    function getDropdownArray() {
      let arr = [{ value: min.value, text: min.value + ' MP' }]
      let compound = props.skillObj.skillStats.isCompoundingCost ? props.increasedCosts || 0 : 0
      for (
        let i = min.value + rankCost.value + compound;
        i <= props.maxSkillRank;
        i += rankCost.value + compound
      ) {
        arr.push({ value: i, text: i + ' MP' })
        compound = props.skillObj.skillStats.isCompoundingCost
          ? compound + (props.increasedCosts || 0)
          : 0
      }
      return arr
    }
    function purchase(selection) {
      console.log(selection)
      let ranks = 1 + (selection - min.value) / rankCost.value
      if (props.skillObj.skillStats.costMalleable) {
        ranks = 1 + (selection - min.value) / (rankCost.value + localModifiedCost.value)
      }
      if (props.skillObj.skillStats.isCompoundingCost) {
        let rank = 1
        let j = 0
        for (let i = min.value; i < selection; i += rankCost.value + j) {
          j = j + 1
          rank++
        }
        ranks = rank
      }
      let skillObjCp = _.cloneDeep(props.skillObj)
      skillObjCp.rank = ranks
      skillObjCp.purchasedMp = selection
      skillObjCp.skillStats.rank = ranks

      props.update(skillObjCp.name, skillObjCp)
    }
    watch(props, async (props, old) => {
      if (props.universalModifiesSomeCosts != localModifiedCost.value) {
        const ranks =
          props.skillObj.skillStats.purchased / (costPerRank.value + localModifiedCost.value)
        localModifiedCost.value = props.universalModifiesSomeCosts
        context.emit('selection', ranks * rankCost.value)
        context.emit('setRank', ranks)
      } else {
        if (props.skillObj.skillStats.increasedCosts != localIncreasedCosts.value) {
          if (props.skillObj.skillStats.isCompoundingCost) {
            localIncreasedCosts.value = props.increasedCosts
            context.emit('setRank', 1)

            context.emit('selection', rankCost.value)
          } else {
            const ranks =
              props.skillObj.skillStats.purchased / (costPerRank.value + localIncreasedCosts.value)
            localIncreasedCosts.value = props.increasedCosts
            context.emit('selection', ranks * rankCost.value)
            context.emit('setRank', ranks)
          }
        }
      }
    })
    const designStore = useDesignStore()
    return {
      designStore,
      props,
      lightenDarkenColor,
      getDropdownArray,
      purchase,
      min,
      rankCost,
      minCost
    }
  },
  components: { IconDisplay, DropdownSelect }
}
</script>
<template>
  <div
    style="
      margin: 0.25rem;
      margin-top: 0.75rem;
      padding: 0.25rem;
      box-shadow: 1px 1px 2px 1px rgb(0, 0, 0, 0.3);
    "
    :style="{
      background: designStore.inputBacking,
      color: designStore.inputText,
      boxShadow: props.noShadow
        ? ''
        : '1px 1px 3px 2px ' + lightenDarkenColor(designStore.inputBacking, -25)
    }"
  >
    <div style="position: absolute; display: flex">
      <div
        v-if="props.remove"
        @click="props.remove(skillObj.name)"
        style="
          position: relative;
          margin-top: -0.75rem;
          margin-left: -0.75rem;
          padding: 0.25rem;
          border-radius: 0.3rem;
          padding-top: 0rem;
          padding-bottom: 0rem;
        "
        :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
      >
        <i class="bi bi-x-lg" style="font-size: small"></i>
      </div>
    </div>
    <div style="display: flex; justify-content: end" v-if="props.update">
      <div style="position: absolute; display: flex">
        <DropdownSelect
          v-if="skillObj.mp_cost.toLowerCase().includes('rank')"
          :color="designStore.primaryText"
          :background="designStore.primaryTheme"
          :borderless="true"
          :options="getDropdownArray()"
          label="MP"
          style="width: 4rem; text-align: end; z-index: 4; margin-top: 0.5rem"
          :default="props.mpAllocated"
          @selection="(selection) => purchase(selection)"
        ></DropdownSelect>
        <div
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          style="
            padding: 0.25rem;
            border-radius: 0.25rem;
            margin-top: 0.1rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            text-align: end;
            z-index: 4;
            margin-top: 0.5rem;
          "
          v-else-if="skillObj.purchasedMp > 0"
        >
          {{ skillObj.purchasedMp + ' MP' }}
        </div>
        <div v-else style="padding-right: 2rem">
          {{ skillObj.mp_cost }}
        </div>
      </div>
    </div>
    <div style="display: flex; padding: 0.35rem; padding-bottom: 0">
      <div
        style="font-size: large; align-self: center; text-wrap: nowrap"
        :style="{ fontFamily: designStore.titleFont }"
      >
        {{ props.skillObj.name }}
      </div>
      <IconDisplay
        :icon="props.skillObj.icon"
        scale="2"
        :style="{ color: designStore.secondaryTheme }"
      ></IconDisplay>
      <hr
        :style="{ borderColor: designStore.secondaryTheme }"
        style="align-self: center; position: relative; top: 0rem"
      />
      <v-icon
        name="gi-abstract-119"
        :style="{ color: designStore.secondaryTheme }"
        style="position: relative; right: 0.25rem; top: 0.5rem"
      ></v-icon>
    </div>
    <div style="margin-left: 0.75rem; margin-right: 0.75rem">{{ props.skillObj.description }}</div>
  </div>
</template>
<style scoped></style>
