<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BPopover from 'bootstrap-vue-next/src/components/BPopover.vue'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, ref, watch } from 'vue'

export default {
  props: [
    'name',
    'isDropdown',
    'purchased',
    'minCost',
    'costPerRank',
    'maxSkillRank',
    'description',
    'additionalMpCost',
    'costMalleable',
    'universalModifiesSomeCosts',
    'increasedCosts',
    'isCompoundingCost'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const min: ComputedRef<number> = computed(() => {
      if (props.costMalleable) {
        return props.minCost + props.costMalleable + props.increasedCosts
      }
      return props.minCost + props.increasedCosts
    })

    const rankCost: ComputedRef<number> = computed(() => {
      if (props.costMalleable) {
        return props.costPerRank + props.universalModifiesSomeCosts + props.increasedCosts
      }

      return props.costPerRank + props.increasedCosts
    })
    const localModifiedCost = ref(props.universalModifiesSomeCosts)
    const localIncreasedCosts = ref(props.increasedCosts)

    function purchase(selection) {
      context.emit('selection', selection)
      let ranks = 1 + (selection - min.value) / rankCost.value
      if (props.costMalleable) {
        ranks = 1 + (selection - min.value) / (rankCost.value + localModifiedCost.value)
      }
      if (props.isCompoundingCost) {
        let rank = 1
        let j = 0
        for (let i = min.value; i < selection; i += rankCost.value + j) {
          j = j + 1
          rank++
        }
        ranks = rank
      }
      context.emit('setRank', ranks)
    }

    function getDropdownArray() {
      let arr = [{ value: min.value, text: min.value + ' MP' }]
      let compound = props.isCompoundingCost ? props.increasedCosts : 0
      for (
        let i = min.value + rankCost.value + compound;
        i <= props.maxSkillRank;
        i += rankCost.value + compound
      ) {
        arr.push({ value: i, text: i + ' MP' })
        compound = props.isCompoundingCost ? compound + props.increasedCosts : 0
      }
      return arr
    }
    watch(props, async (props, old) => {
      if (props.universalModifiesSomeCosts != localModifiedCost.value) {
        const ranks = props.purchased / (props.costPerRank + localModifiedCost.value)
        localModifiedCost.value = props.universalModifiesSomeCosts
        context.emit('selection', ranks * rankCost.value)
        context.emit('setRank', ranks)
      } else {
        if (props.increasedCosts != localIncreasedCosts.value) {
          if (props.isCompoundingCost) {
            localIncreasedCosts.value = props.increasedCosts
            context.emit('setRank', 1)

            context.emit('selection', rankCost.value)
          } else {
            const ranks = props.purchased / (props.costPerRank + localIncreasedCosts.value)
            localIncreasedCosts.value = props.increasedCosts
            context.emit('selection', ranks * rankCost.value)
            context.emit('setRank', ranks)
          }
        }
      }
    })
    return { designStore, props, getDropdownArray, context, purchase, rankCost }
  },
  components: { DropdownSelect, BPopover }
}
</script>
<template>
  <div
    :style="{
      fontFamily: designStore.font,
      color: designStore.primaryText,
      background: designStore.primaryTheme,
      borderColor: designStore.secondaryTheme,
      '--bs-secondary-color': designStore.inputText
    }"
    style="
      border-radius: 0.375rem;
      margin: 0.5rem;
      padding: 0.25rem;
      padding-right: 0.5rem;
      align-items: center;
      cursor: grab;
      display: flex;
      justify-content: space-between;
    "
  >
    <i class="bi bi-grip-vertical"></i>
    <BPopover
      :style="{
        background: designStore.primaryTheme,
        borderColor: designStore.secondaryTheme
      }"
      class="popover"
      :click="true"
      :close-on-hide="true"
      :delay="{ show: 0, hide: 0 }"
      style="width: 20rem; cursor: pointer"
    >
      <template #target>
        <div
          :style="{ '--hover-color': designStore.alertTheme }"
          class="skilltext"
          v-if="!props.isDropdown"
        >
          {{ props.name + '  ' + props.purchased + ' MP ' }}
        </div>
        <div
          :style="{ '--hover-color': designStore.alertTheme }"
          class="skilltext"
          v-if="props.isDropdown"
        >
          {{ props.name }}
        </div>
      </template>
      <div
        style="padding: 0.5rem; border-radius: 0.25rem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
      >
        {{ props.description }}
      </div>
    </BPopover>

    <DropdownSelect
      :color="designStore.primaryText"
      :background="designStore.primaryTheme"
      :borderless="true"
      :options="getDropdownArray()"
      label="MP"
      style="width: 4rem; text-align: end"
      v-if="props.isDropdown"
      :default="props.purchased"
      @selection="(selection) => purchase(selection)"
    ></DropdownSelect>

    <i class="bi bi-x-lg" @click="context.emit('kill')"></i>
  </div>
</template>
<style scoped>
.skilltext:hover {
  --hover-color: blue;
  color: var(--hover-color);
}
</style>
