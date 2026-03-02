<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, ref } from 'vue'
import StatusEffectItem from '../Character/Overview/StatusEffectItem.vue'
import StatusModifierExplaination from '../Character/Overview/StatusModifierExplaination.vue'
import TitleWidget from '../TitleWidget.vue'

export default {
  setup() {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { diceStatusModifiers } = storeToRefs(characterStore)

    const modAmount = ref(0)
    const modifierType = [
      'Modify Placed Rolls',
      'Modify Displaced Rolls',
      'Override Placed Rolls',
      'Override Displaced Rolls'
    ]
    const attributes = [
      'Strength',
      'Agility',
      'Health',
      'Willpower',
      'Perception',
      'Charisma',
      'Intelligence',
      'Power',
      'Acrobatics',
      'Alchemy',
      'Awareness',
      'Crafting',
      'Fitness',
      'Knowledge',
      'Interpersonal',
      'Metamagic',
      'Might',
      'Subtlety',
      'Performance'
    ]
    const selectedMod = ref('add New Modifier')
    const targetAttribute = ref('')
    const linkedStatus = ref('')
    const statuses: ComputedRef = computed(() => {
      let ret = ['']
      return ret.concat(Object.keys(characterStore.customStatusEffects))
    })
    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let ret = []
      let allModifiers = Object.values(diceStatusModifiers.value)
      allModifiers.forEach((modifier) => {
        let modifiers = Object.values(modifier)
        modifiers.forEach((modGroup: any) => {
          ret = ret.concat(Object.values(modGroup))
        })
      })
      return ret
    })

    function addStatusModifier() {
      let statusObj = {
        modifierType: selectedMod.value,
        linkedStatus: linkedStatus.value,
        modAmount: modAmount.value,
        target: targetAttribute.value
      }
      linkedStatus.value = ''
      characterStore.addNewDiceStatusModifier(statusObj)
    }
    function removeModifier(modifierType, modAmount, linkedStatus, target) {
      characterStore.removeDiceStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus,
        target: target
      })
    }
    return {
      selectedMod,
      modifierType,
      targetAttribute,
      linkedStatus,
      statuses,
      statusModifiersList,
      modAmount,
      designStore,
      removeModifier,
      attributes,
      addStatusModifier
    }
  },
  components: {
    StatusEffectItem,
    StatusModifierExplaination,
    BFormInput,
    BFormSelect,
    TitleWidget,
    BButton
  }
}
</script>
<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <TitleWidget title="Roll Status Modifiers" style="width: 100%"></TitleWidget>
      <StatusModifierExplaination
        style="position: relative; top: 2.5rem"
      ></StatusModifierExplaination>
    </div>
    <div>
      <div style="text-align: end">Add New Modifier</div>
      <div>Modifier Type</div>
      <BFormSelect
        v-model="selectedMod"
        :options="modifierType"
        style="border: 3px solid; border-radius: 10px; margin-bottom: 0.5rem"
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.inputBacking,
          color: designStore.inputText
        }"
      ></BFormSelect>
      <div>Target Roll</div>
      <BFormSelect
        v-model="targetAttribute"
        :options="attributes"
        style="border: 3px solid; border-radius: 10px; margin-bottom: 0.5rem"
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.inputBacking,
          color: designStore.inputText
        }"
      ></BFormSelect>
      <div>Modifier Amount</div>

      <BFormInput
        style="border: 3px solid; border-radius: 10px; margin-bottom: 0.5rem"
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.inputBacking,
          color: designStore.inputText
        }"
        type="number"
        placeholder="value"
        v-model="modAmount"
        class="num"
        min="0"
      ></BFormInput>
      <div>Linked Status</div>

      <BFormSelect
        v-model="linkedStatus"
        :options="statuses"
        placeholder="Linked Status"
        style="border: 3px solid; border-radius: 10px; margin-bottom: 0.5rem"
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.inputBacking,
          color: designStore.inputText
        }"
      ></BFormSelect>
      <div style="display: flex; justify-content: end">
        <BButton
          @click="addStatusModifier()"
          style="padding: 0.5rem; border: 3px solid; border-radius: 10px; cursor: pointer"
          :style="{
            borderColor: designStore.secondaryTheme,
            background: designStore.primaryTheme,
            color: designStore.primaryText
          }"
          ><i class="bi bi-plus-lg" style="pointer-events: none"></i
        ></BButton>
      </div>
      <hr
        :style="{
          color: designStore.secondaryTheme
        }"
      />
    </div>

    <div v-for="mod in statusModifiersList" :key="mod">
      <StatusEffectItem
        @delete="removeModifier(mod.modifierType, mod.modAmount, mod.linkedStatus, mod.target)"
        :modifierType="mod.modifierType"
        :modAmount="mod.modAmount"
        :linkedStatus="mod.linkedStatus"
        :target="mod.target"
      ></StatusEffectItem>
    </div>
    <div
      style="
        min-height: 10rem;
        position: sticky;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      "
    ></div>
  </div>
</template>
<style></style>
