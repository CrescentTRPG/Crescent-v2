<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import GridSelect from '@/components/GridSelect.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { computed, ref } from 'vue'

export default {
  props: ['inOrder', 'updateInOrder'],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)

    function getColor(inOrder) {
      if (inOrder === props.inOrder) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }
    function getBoxShadow(inOrder) {
      if (inOrder === props.inOrder) {
        return '0px 0px 10px 3px ' + designStore.alertTheme
      }
      return 'none'
    }
    function updateRankOrder(inOrder) {
      props.updateInOrder(inOrder)
    }
    const icon = computed(() => {
      return props.inOrder ? 'gi-stairs-goal' : 'gi-card-pick'
    })
    const options = [
      {
        name: 'Rank Order Purchase',
        value: true,
        icon: 'gi-stairs-goal',
        description:
          'Players may only purchase spells of rank 1 higher than their maximum in the group.  All rank 0 abilities comes with the first spell purchased.'
      },
      {
        name: 'Any Order Purchase',
        icon: 'gi-card-pick',

        value: false,
        description: 'Players may purchase spells regaurdless of their rank.'
      }
    ]
    return {
      designStore,
      modal,
      updateRankOrder,
      getColor,
      getBoxShadow,
      icon,
      options
    }
  },

  components: {
    CustomModal,
    GridSelect
  }
}
</script>
<template>
  <div>
    <div
      style="
        display: flex;
        flex-direction: column;
        margin: 0.5rem;
        border-radius: 0.5rem;
        cursor: pointer;
      "
      class="hoverablePrimary"
      @click="modal = true"
      :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
    >
      <div style="text-align: center">Order</div>
      <div
        style="
          align-self: end;
          margin-bottom: 0.5rem;
          display: flex;
          z-index: 4;
          padding-right: 1rem;
          padding-left: 1rem;
          padding-right: 1rem;
        "
        :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
      >
        <v-icon :name="icon" scale="3"></v-icon>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Set Purchasing Rules" @close="modal = false">
      <template v-slot:body>
        <GridSelect
          :updateOption="updateRankOrder"
          :options="options"
          :selected="inOrder"
        ></GridSelect>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped>
.inOrderSelect {
  border: 3px solid;
  border-radius: 0.375rem;
  padding: 1rem;
  align-items: center;
  margin: 2rem;
}
.abilitySelectContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 900px) {
  .abilitySelectContainer {
    display: flex;
    flex-direction: column;
  }
}
</style>
