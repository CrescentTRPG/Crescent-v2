<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useSpellStore } from '@/stores/spellsStore'
import CustomModal from '@/components/CustomModal.vue'
import { BFormInput, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import { useEquipmentStore } from '@/stores/equipmentStore'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const spellsStore = useSpellStore()
    const { spellgroups } = storeToRefs(spellsStore)
    const { currentMana, manaStatusModifiers } = storeToRefs(characterStore)
    const manaMod = ref(0)
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const modifierType = ['mana regen', 'modify base mana', 'override base mana']
    const currentManaCopy = ref(currentMana.value)

    function addManaStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount
      }

      characterStore.addNewManaStatusModifier(statusObj)
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      characterStore.removeManaStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }

    function getColor() {
      if (
        manaStatusModifiers.value['override base mana'] ||
        manaStatusModifiers.value['modify base mana']
      ) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }

    function getCurrentColor() {
      if (manaStatusModifiers.value['mana regen']) {
        return designStore.alertTheme
      }
      return designStore.primaryText
    }
    const wornArmorPassives = computed(() => {
      return equipment.value.items.Armor[equipment.value.wornArmor]?.equippedStats?.passives || {}
    })

    const primaryHandheldPassives = computed(() => {
      return (
        equipment.value.items.Weapon[equipment.value.primaryHand]?.equippedStats?.passives || {}
      )
    })

    const secondaryHandheldPassives = computed(() => {
      return (
        equipment.value.items.Shield[equipment.value.secondaryHand]?.equippedStats?.passives ||
        equipment.value.items.Weapon[equipment.value.secondaryHand]?.equippedStats?.passives ||
        {}
      )
    })

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(manaStatusModifiers.value)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })
      console.log(ret)

      return ret
    })

    const statuses: ComputedRef = computed(() => {
      let ret = ['']
      return ret.concat(Object.keys(characterStore.customStatusEffects))
    })

    const totalMana: ComputedRef = computed(() => {
      let sum = 0

      let groups: Array<any> = Object.values(spellsStore.spellgroups)
      groups.forEach((spellgroup: any) => {
        const maxRank = Object.values(spellgroup?.spells)?.reduce(
          (acc: number, spell: any) => (spell.rank > acc ? spell.rank : acc),
          0
        )

        sum += spellgroup?.manaGain * maxRank
      })
      if (characterStore.traits['Bonus Mana']) {
        sum += parseInt(characterStore.traits['Bonus Mana'].number)
      }
      if (wornArmorPassives.value['Override Base Mana']) {
        sum = parseInt(wornArmorPassives.value['Override Base Mana'].modAmount)
      }
      if (primaryHandheldPassives.value['Override Base Mana']) {
        sum = parseInt(primaryHandheldPassives.value['Override Base Mana'].modAmount)
      }
      if (secondaryHandheldPassives.value['Override Base Mana']) {
        sum = parseInt(secondaryHandheldPassives.value['Override Base Mana'].modAmount)
      }
      if (manaStatusModifiers.value['override base mana']) {
        let max = Object.values(manaStatusModifiers.value['override base mana']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          sum = max
        }
      }
      let modifier = -1000
      if (wornArmorPassives.value['Modify Base Mana']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Base Mana'].modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Base Mana']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Base Mana'].modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Base Mana']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Base Mana'].modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }

      if (manaStatusModifiers.value['modify base mana']) {
        const baseModifier = manaStatusModifiers.value['modify base mana']

        if (baseModifier) {
          let arr = Object.values(baseModifier)
          console.log(arr)
          let max = arr.reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )

          if (max != -1000) {
            modifier = modifier + max
          }
        }
      }

      if (currentMana.value > sum + modifier) {
        setNewCurrentValue(parseInt(sum + ''))
      }
      return sum + modifier
    })

    function gainMana() {
      const finalMana = currentMana.value + parseInt(manaMod.value + '')
      characterStore.setCurrentMana(Math.min(finalMana, totalMana.value))
    }

    function loseMana() {
      const finalMana = currentMana.value - manaMod.value
      characterStore.setCurrentMana(finalMana)
    }

    function setNewCurrentValue(mana = currentManaCopy.value) {
      characterStore.setCurrentMana(Math.min(parseInt(mana + ''), totalMana.value))
    }
    function showModal() {
      modal.value = true
    }

    return {
      removeModifier,
      addManaStatusModifier,
      statusModifiersList,
      designStore,
      modal,
      userStore,
      characterStore,
      currentMana,
      manaMod,
      currentManaCopy,

      statuses,
      totalMana,
      modifierType,
      gainMana,
      loseMana,
      setNewCurrentValue,
      showModal,
      getColor,
      getCurrentColor
    }
  },
  components: {
    CustomModal,
    BInputGroup,
    BFormInput,
    BButton,
    StatusModifierExplaination,
    TitleWidget,
    StatusEffectItem,
    AddStatusEffectWidget
  }
}
</script>

<template>
  <div
    style="width: 13.5rem; height: 10rem; margin-top: -1rem"
    :style="{ fontFamily: designStore.font }"
    @click="showModal()"
  >
    <div
      style="
        position: absolute;
        font-size: 9rem;
        z-index: 5;
        margin-left: 2rem;
        margin-top: -1.5rem;
        transform: scale(1.2, 1);
      "
      :style="{ color: designStore.primaryTheme }"
    >
      <i class="bi bi-book-fill"></i>
    </div>
    <div
      style="
        position: absolute;
        font-size: 10rem;
        z-index: 4;
        margin-left: 1.5rem;
        margin-top: -2rem;
        transform: scale(1.1, 1);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <i class="bi bi-book-fill"></i>
    </div>

    <div class="manaTxt">
      <div style="display: flex; flex-direction: column; margin-top: 0.75rem">
        <div style="display: flex; flex-direction: row; justify-content: center">
          <div style="display: flex; flex-direction: column" :style="{ color: getCurrentColor() }">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
            >
              <div style="display: flex" class="bigText">{{ currentMana }}</div>
            </div>
            <div style="align-self: center; font-size: 0.75rem" class="liltext">Current</div>
          </div>
          <i
            class="bi bi-slash-lg"
            style="
              align-self: center;
              font-size: 3rem;
              transform: skew(25deg);
              margin-right: -0.75rem;
              margin-left: -0.5rem;
            "
            :style="{ color: designStore.secondaryTheme }"
          ></i>
          <div style="display: flex; flex-direction: column" :style="{ color: getColor() }">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
            >
              <div style="display: flex" class="bigText">{{ totalMana }}</div>
            </div>
            <div style="align-self: center; font-size: 0.75rem" class="liltext">Total</div>
          </div>
        </div>
        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 2.25rem; align-self: center; margin-top: -1rem"
        >
          Mana
        </div>
      </div>
    </div>
    <CustomModal title="Modify Mana" :showModal="modal" @close="modal = !modal">
      <template v-slot:body>
        <div
          style="font-size: x-large; text-align: center; margin-top: -1rem; margin-bottom: 0.25rem"
        >
          {{ currentMana }} Current / {{ totalMana }} Total
        </div>
        <TitleWidget title="Modify Values" style="margin-top: -1.5rem"></TitleWidget>

        <BInputGroup
          style="border: 2px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="0"
            v-model="manaMod"
          ></BFormInput>

          <BButton
            style="width: 5rem; padding-top: 0.5rem; padding-left: 0.5rem"
            @click="gainMana()"
            >Gain</BButton
          >
          <BButton
            style="padding-top: 0.5rem; padding-left: 0.5rem; border-left: 1px solid; width: 5.5rem"
            :style="{ borderColor: designStore.secondaryTheme }"
            @click="loseMana()"
            >Lose</BButton
          >
        </BInputGroup>
        <TitleWidget title="Override Values" style="margin-top: -1rem"></TitleWidget>

        <BInputGroup
          style="border: 2px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="0"
            v-model="currentManaCopy"
          ></BFormInput>

          <BButton
            style="
              width: 10.5rem;
              padding-top: 0.5rem;
              padding-left: 0.5rem;
              border-left: 1px solid;
            "
            :style="{ borderColor: designStore.secondaryTheme }"
            @click="setNewCurrentValue()"
            >Set New Value</BButton
          >
        </BInputGroup>
        <div style="display: flex; justify-content: space-between; margin-top: -2rem">
          <TitleWidget title="Status Modifiers" style="width: 100%"></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>

        <AddStatusEffectWidget
          :modifierType="modifierType"
          @added="(addedVal) => addManaStatusModifier(addedVal)"
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
.manaTxt {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
@media (max-width: 600px) {
}
@media (max-width: 700px) {
  .liltext {
    display: none;
  }
  .bigText {
    font-size: 2.5rem;
  }
}
</style>
