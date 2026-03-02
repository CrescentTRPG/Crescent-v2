<script lang="ts">
import BasicInput from '@/components/Character/BasicInput.vue'
import CustomModal from '@/components/CustomModal.vue'
import GridSelect from '@/components/GridSelect.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { computed, ref } from 'vue'

export default {
  props: ['flatCost', 'updateFlatCost', 'baseCost', 'updateBaseCost'],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)

    function updateCostType(cost) {
      props.updateFlatCost(cost)
    }
    function updateBaseCostHelper(cost) {
      if (cost > 0) {
        props.updateBaseCost(cost)
      } else {
        alert('Cost must be greater than 0!')
      }
    }
    const icon = computed(() => {
      return props.flatCost ? 'gi-token' : 'gi-growth'
    })

    const options = [
      {
        name: 'Flat Cost',
        value: true,
        icon: 'gi-token',
        description: "Every Spell, regaurdless of rank, will cost the spellgroup's base cost"
      },
      {
        name: 'Rank Cost',
        icon: 'gi-growth',
        value: false,
        description: "Every Spell will cost (the spellgroup's base cost)*(the rank of the spell)"
      }
    ]

    return {
      designStore,
      modal,
      icon,
      props,
      updateCostType,
      updateBaseCostHelper,
      options
    }
  },

  components: {
    CustomModal,
    IconDisplay,
    GridSelect,
    BasicInput
  }
}
</script>
<template>
  <div>
    <div
      style="
        cursor: pointer;
        display: flex;
        flex-direction: column;
        margin: 0.5rem;
        border-radius: 0.5rem;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        height: 80%;
      "
      class="hoverablePrimary"
      @click="modal = true"
      :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
    >
      <div style="text-align: center">Cost</div>
      <div
        style="margin-bottom: 0.5rem; display: flex; z-index: 4; justify-content: center"
        :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
      >
        <div style="display: flex; justify-content: center">
          <IconDisplay
            style="position: absolute; margin-top: -0.35rem"
            :icon="icon"
            size="3.5rem"
            :scale="4"
          ></IconDisplay>
          <div
            v-if="props.baseCost > 0"
            style="
              position: relative;
              z-index: 4;
              padding: 0.5rem;
              border-radius: 0.5rem;
              border: 2px solid;
              align-self: center;
              margin-top: 1rem;
              padding-top: 0.25rem;
              padding-bottom: 0.225rem;
            "
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{ props.baseCost }}
          </div>
        </div>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Select Cost Structure" @close="modal = false">
      <template v-slot:body>
        <GridSelect
          :updateOption="updateCostType"
          :options="options"
          :selected="flatCost"
        ></GridSelect>
        <BasicInput
          label="Base Cost"
          :value="baseCost"
          :min="0"
          :max="100"
          style="flex-grow: 1"
          type="number"
          @newValue="
            (val) => {
              updateBaseCostHelper(val)
            }
          "
        ></BasicInput>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped></style>
