<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { computed, ComputedRef, ref, watch } from 'vue'
import _ from 'lodash'
import WeaponSkillDisplay from './WeaponSkillDisplay.vue'
import CustomModal from '@/components/CustomModal.vue'

export default {
  props: [
    'name',
    'use',
    'icon',
    'plus',
    'skillObj',
    'increasedCosts',
    'maxSkillRank',
    'universalModifiesSomeCosts',
    'mpAllocated',
    'update'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const minCost = computed(() => {
      return (
        props.skillObj.skillStats.mpCost ||
        (props.skillObj.skillStats.modes &&
          props.skillObj.skillStats[props.skillObj.skillStats.modes[0]].mpCost)
      )
    })
    const min: ComputedRef<number> = computed(() => {
      if (props.skillObj.costMalleable) {
        return minCost.value + props.skillObj.skillStats.costMalleable + props.increasedCosts
      }
      return minCost.value + props.increasedCosts
    })
    const costPerRank = computed(() => {
      return (
        props.skillObj.skillStats.additionalMpCost ||
        (props.skillObj.skillStats.modes &&
          props.skillObj.skillStats[props.skillObj.skillStats.modes[0]].additionalMpCost) ||
        props.skillObj.skillStats.mpCost ||
        (props.skillObj.skillStats.modes &&
          props.skillObj.skillStats[props.skillObj.skillStats.modes[0]].mpCost)
      )
    })
    const localModifiedCost = ref(props.universalModifiesSomeCosts)
    const localIncreasedCosts = ref(props.skillObj.skillStats.increasedCosts)
    const rankCost: ComputedRef<number> = computed(() => {
      if (props.skillObj.skillStats.costMalleable) {
        return costPerRank.value + props.universalModifiesSomeCosts + props.increasedCosts
      }

      return costPerRank.value + props.increasedCosts
    })
    function getDropdownArray() {
      let arr = [{ value: min.value, text: min.value + ' MP' }]
      let compound = props.skillObj.skillStats.isCompoundingCost ? props.increasedCosts : 0
      for (
        let i = min.value + rankCost.value + compound;
        i <= props.maxSkillRank;
        i += rankCost.value + compound
      ) {
        arr.push({ value: i, text: i + ' MP' })
        compound = props.skillObj.skillStats.isCompoundingCost ? compound + props.increasedCosts : 0
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
    const showModal = ref(false)
    return {
      designStore,
      props,
      getDropdownArray,
      purchase,
      showModal
    }
  },
  components: { IconDisplay, DropdownSelect, WeaponSkillDisplay, CustomModal }
}
</script>
<template>
  <div>
    <div
      style="margin: 0.5rem; width: fit-content; height: fit-content"
      class="ItemsContainer"
      :style="{ background: designStore.inputBacking }"
    >
      <div style="display: flex; justify-content: center">
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          "
        >
          <div style="z-index: 5">
            <div
              style="font-size: small; z-index: 3; margin-bottom: -2rem"
              :style="{ color: designStore.inputText }"
              v-if="props.use === 'Passive'"
            >
              {{ props.use }}
            </div>
            <DropdownSelect
              v-else
              :color="designStore.primaryText"
              :background="designStore.primaryTheme"
              :border-color="designStore.secondaryTheme"
              :options="getDropdownArray()"
              label="MP"
              style="
                width: 4rem;
                text-align: end;
                z-index: 4;
                margin-bottom: -2rem;
                z-index: 5;
                align-self: center;
              "
              :default="props.mpAllocated"
              @selection="(selection) => purchase(selection)"
            ></DropdownSelect>
          </div>
          <IconDisplay
            style="z-index: 3"
            :icon="props.icon"
            scale="4.5"
            :style="{ color: designStore.secondaryTheme }"
          ></IconDisplay>
          <div
            @click="showModal = true"
            class="hoverableTransparantLinear"
            style="
              font-size: small;
              z-index: 4;
              padding: 0.25rem;
              width: fit-content;
              border-radius: 0.5rem;
              margin-top: 3.75rem;
              text-align: center;
              position: absolute;
              cursor: pointer;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ props.name }} <i v-if="props.plus" class="bi bi-plus"></i>
          </div>
        </div>
      </div>
    </div>
    <CustomModal
      :showModal="showModal"
      @close="showModal = false"
      title="View Base Attack Modifier"
    >
      <template v-slot:body>
        <WeaponSkillDisplay
          style="padding: 0.5rem; border-radius: 0.25rem"
          :no-shadow="true"
          :skill-obj="props.skillObj"
        ></WeaponSkillDisplay>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped>
.ItemsContainer {
  z-index: 2;
  margin: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.displayContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  padding-top: 0.5rem;
}
@media (max-width: 600px) {
  .displayContainer {
    padding-top: 0;
  }
  .ItemsContainer {
    z-index: 2;
    margin: 0.25rem;
    padding-top: 0rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 3rem;
  }
  .disappearingMobileItems {
    display: none;
  }
}
</style>
