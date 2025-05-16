<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import CustomModal from '@/components/CustomModal.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  props: ['mpStatusModifiers', 'removeMpStatusModifier', 'addNewMpStatusModifier', 'getMp'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const modifierType = ['Modify Mp', 'Override Mp']

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(props.mpStatusModifiers)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })
      console.log(ret)

      return ret
    })
    function getColor() {
      if (props.mpStatusModifiers['Override Mp'] || props.mpStatusModifiers['Modify Mp']) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }
    function addMpStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount
      }

      props.addNewMpStatusModifier(statusObj)
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      props.removeMpStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }

    return {
      designStore,
      modal,
      modifierType,
      statusModifiersList,
      addMpStatusModifier,
      removeModifier,
      getColor,
      props
    }
  },
  components: {
    TitleWidget,
    CustomModal,
    AddStatusEffectWidget,
    StatusModifierExplaination,
    StatusEffectItem
  }
}
</script>

<template>
  <div
    @click="modal = !modal"
    style="
      width: 12.5rem;
      height: 10rem;
      margin-top: -1rem;
      margin-bottom: 1.5rem;
      align-items: center;
    "
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="position: absolute; z-index: 5; transform: scale(1.25, 1)"
      :style="{ color: designStore.primaryTheme }"
    >
      <v-icon name="gi-swords-emblem" scale="10"></v-icon>
    </div>
    <div class="heartTxt">
      <div
        style="display: flex; flex-direction: column; margin-top: 4.5rem"
        :style="{
          color: getColor()
        }"
      >
        <div style="display: flex; justify-content: center">{{ props.getMp }}</div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: getColor() }"
          style="font-size: 1.5rem; align-self: center; margin-top: -1rem"
        >
          MP
        </div>
      </div>
    </div>
    <div
      style="position: relative; right: 0.5rem; top: -0.25rem; z-index: 4; transform: scale(1.2, 1)"
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-swords-emblem" scale="10.75"></v-icon>
    </div>
    <CustomModal title="Modify MP " :showModal="modal" @close="modal = !modal">
      <template v-slot:body>
        <div style="font-size: x-large; text-align: center; margin-bottom: 0.25rem">
          {{ props.getMp }} Martial Points
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: -1.5rem">
          <TitleWidget title="Status Modifiers" style="width: 100%"></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>
        <AddStatusEffectWidget
          :modifierType="modifierType"
          @added="(addedVal) => addMpStatusModifier(addedVal)"
        ></AddStatusEffectWidget>

        <div v-for="mod in statusModifiersList" :key="mod">
          <StatusEffectItem
            @delete="removeModifier(mod.modifierType, mod.modAmount, mod.linkedStatus)"
            :modifierType="mod.modifierType"
            :modAmount="mod.modAmount"
            :linkedStatus="mod.linkedStatus"
          ></StatusEffectItem>
        </div>
      </template>
    </CustomModal>
  </div>
</template>

<style scoped>
.heartTxt {
  position: absolute;
  font-size: 3rem;
  z-index: 5;
  margin-top: -0.5rem;
  width: 12.5rem;
}
@media (max-width: 600px) {
}
</style>
