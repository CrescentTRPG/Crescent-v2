<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import CustomModal from '@/components/CustomModal.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import BasicInput from '../BasicInput.vue'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import AddStatusModifierModal from './AddStatusModifierModal.vue'

export default {
  props: [
    'mpStatusModifiers',
    'removeMpStatusModifier',
    'addNewMpStatusModifier',
    'getMp',
    'setMp',
    'isEditing'
  ],
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
    const isHidden = ref(false)
    return {
      designStore,
      modal,
      modifierType,
      statusModifiersList,
      addMpStatusModifier,
      removeModifier,
      getColor,
      props,
      isHidden
    }
  },
  components: {
    CustomModal,

    StatusEffectItem,
    BasicInput,
    AddStatusModifierModal
  }
}
</script>

<template>
  <div
    @click="modal = !modal"
    class="hoverableIconOnSidebar"
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
    <CustomModal
      :is-hidden="isHidden"
      v-if="!isEditing"
      title="Modify MP "
      :showModal="modal"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <div style="font-size: x-large; text-align: center; margin-bottom: 0.25rem">
          {{ props.getMp }} Martial Points
        </div>

        <AddStatusModifierModal
          :modify-is-hidden="(val) => (isHidden = val)"
          :modifiers="modifierType"
          modifierType="Modify Mp"
          @added="(val) => addMpStatusModifier(val)"
        ></AddStatusModifierModal>

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
    <CustomModal
      v-if="props.isEditing"
      title="Modify MP"
      :showModal="modal"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <BasicInput
          style="margin-bottom: 1rem"
          label="MP"
          type="number"
          :value="props.getMp"
          :min="0"
          :max="999"
          @newValue="(val) => props.setMp(val)"
        ></BasicInput>
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
