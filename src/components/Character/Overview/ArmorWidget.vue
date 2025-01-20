<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import MiniArmorWidget from './MiniArmorWidget.vue'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'
import { BButton, BFormInput, BFormSelect, BInputGroup } from 'bootstrap-vue-next'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import CustomCheckbox from '../CustomCheckbox.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { useEquipmentStore } from '@/stores/equipmentStore'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const { armorStatusModifiers, statusEffects } = storeToRefs(characterStore)
    const martialPerksStore = useMartialPerksStore()
    const { martialPerks } = storeToRefs(martialPerksStore)
    const isDodging = ref(false)
    const modifierType = [
      'Modify Armor Dvs',
      'Modify Shield Dvs',
      'Modify Move Dvs',
      'Modify Bonus Dvs',
      'Override Armor Dvs',
      'Override Shield Dvs',
      'Override Move Dvs',
      'Override Bonus Dvs'
    ]

    const isPinned: ComputedRef<boolean> = computed(() => {
      return statusEffects.value['Pinned']?.description.length > 0 ? true : false
    })
    const isStunned: ComputedRef<boolean> = computed(() => {
      return statusEffects.value['Stunned']?.description.length > 0 ? true : false
    })
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

    const isProne: ComputedRef<boolean> = computed(() => {
      return statusEffects.value['Prone']?.description.length > 0 ? true : false
    })

    const wornArmor = computed(() => {
      return (
        equipment.value.items.Armor[equipment.value.wornArmor] || {
          equippedStats: { value: 0 },
          name: 'No Armor'
        }
      )
    })

    const wornShield = computed(() => {
      return (
        equipment.value.items.Shield[equipment.value.secondaryHand] || {
          equippedStats: { value: 0 },
          name: 'No Shield'
        }
      )
    })

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(armorStatusModifiers.value)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })
      console.log(ret)

      return ret
    })

    function addArmorStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount
      }
      characterStore.addNewArmorStatusModifier(statusObj)
    }
    function removeModifier(modifierType, modAmount, linkedStatus) {
      characterStore.removeArmorStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }

    const moveDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (wornArmorPassives.value['Modify Move Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Move Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Move Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Move Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Move Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Move Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }
      if (armorStatusModifiers.value['Modify Move Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Modify Move Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (armorStatusModifiers.value['Override Move Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Override Move Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return isStunned.value || isPinned.value ? 0 : Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Move Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : parseInt(wornArmorPassives.value['Override Move Dvs']?.modAmount) + modifier
      }
      if (primaryHandheldPassives.value['Override Move Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : parseInt(primaryHandheldPassives.value['Override Move Dvs']?.modAmount) + modifier
      }
      if (secondaryHandheldPassives.value['Override Move Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : parseInt(secondaryHandheldPassives.value['Override Move Dvs']?.modAmount) + modifier
      }
      const perks = Object.values(martialPerks.value)
      if (isDodging.value) {
        return isStunned.value || isPinned.value
          ? 0
          : perks.reduce((acc: number, perk: any) => (perk.rank > acc ? perk.rank : acc), 0) +
              15 +
              modifier
      }

      if (characterStore.traits['Movement Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : Math.max(parseInt(characterStore.traits['Movement Dvs'].number) + modifier)
      }
      return isStunned.value || isPinned.value || isProne.value ? 0 : 10 + modifier
    })
    const armorColor: ComputedRef<string> = computed(() => {
      if (
        armorStatusModifiers.value['Modify Armor Dvs'] ||
        armorStatusModifiers.value['Override Armor Dvs']
      ) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    })

    function getColor(type) {
      if (type === 'Move' && (isStunned.value || isPinned.value || isProne.value)) {
        return designStore.alertTheme
      }
      if (
        armorStatusModifiers.value['Modify ' + type + ' Dvs'] ||
        armorStatusModifiers.value['Override ' + type + ' Dvs']
      ) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }

    const armorDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (isDodging.value) {
        return 0
      }
      if (wornArmorPassives.value['Modify Armor Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Armor Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Armor Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Armor Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Armor Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Armor Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier === -1000) {
        modifier = 0
      }

      if (armorStatusModifiers.value['Modify Armor Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Modify Armor Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (armorStatusModifiers.value['Override Armor Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Override Armor Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Armor Dvs']) {
        return Math.max(
          parseInt(wornArmorPassives.value['Override Armor Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (primaryHandheldPassives.value['Override Armor Dvs']) {
        return Math.max(
          parseInt(primaryHandheldPassives.value['Override Armor Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (secondaryHandheldPassives.value['Override Armor Dvs']) {
        return Math.max(
          parseInt(secondaryHandheldPassives.value['Override Armor Dvs']?.modAmount) + modifier,
          0
        )
      }

      if (characterStore.traits['Armor Dvs']) {
        return Math.max(
          Math.max(
            parseInt(characterStore.traits['Armor Dvs'].number) + modifier,
            wornArmor.value?.equippedStats?.value
          ),
          0
        )
      }
      return Math.max(wornArmor.value?.equippedStats?.value, 0)
    })

    const bonusDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (wornArmorPassives.value['Modify Bonus Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Bonus Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Bonus Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Bonus Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Bonus Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Bonus Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier === -1000) {
        modifier = 0
      }
      if (armorStatusModifiers.value['Modify Bonus Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Modify Bonus Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (armorStatusModifiers.value['Override Bonus Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Override Bonus Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Bonus Dvs']) {
        return Math.max(
          parseInt(wornArmorPassives.value['Override Bonus Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (primaryHandheldPassives.value['Override Bonus Dvs']) {
        return Math.max(
          parseInt(primaryHandheldPassives.value['Override Bonus Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (secondaryHandheldPassives.value['Override Bonus Dvs']) {
        return Math.max(
          parseInt(secondaryHandheldPassives.value['Override Bonus Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (characterStore.traits['Bonus Dvs']) {
        return Math.max(parseInt(characterStore.traits['Bonus Dvs'].number) + modifier, 0)
      }
      return 0
    })

    const shieldDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (isDodging.value) {
        return 0
      }
      if (wornArmorPassives.value['Modify Shield Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Shield Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Shield Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Shield Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Shield Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Shield Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier === -1000) {
        modifier = 0
      }
      if (armorStatusModifiers.value['Modify Shield Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Modify Shield Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (armorStatusModifiers.value['Override Shield Dvs']) {
        let max = Object.values(armorStatusModifiers.value['Override Shield Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Shield Dvs']) {
        return Math.max(
          parseInt(wornArmorPassives.value['Override Shield Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (primaryHandheldPassives.value['Override Shield Dvs']) {
        return Math.max(
          parseInt(primaryHandheldPassives.value['Override Shield Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (secondaryHandheldPassives.value['Override Shield Dvs']) {
        return Math.max(
          parseInt(secondaryHandheldPassives.value['Override Shield Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (characterStore.traits['Shield Dvs']) {
        return Math.max(
          Math.max(
            characterStore.traits['Shield Dvs'].number + modifier,
            wornShield.value.equippedStats.value
          ),
          0
        )
      }
      return Math.max(wornShield.value.equippedStats.value, 0)
    })
    const totalDvs: ComputedRef<number> = computed(() => {
      return (
        parseInt(armorDvs.value + '') +
        parseInt(shieldDvs.value + '') +
        parseInt(moveDvs.value + '') +
        parseInt(bonusDvs.value + '')
      )
    })
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      moveDvs,
      armorDvs,
      bonusDvs,
      shieldDvs,
      totalDvs,
      modifierType,
      isDodging,
      statusModifiersList,
      addArmorStatusModifier,
      removeModifier,
      armorColor,
      getColor,
      wornArmor,
      wornShield
    }
  },
  components: {
    MiniArmorWidget,
    CustomModal,
    BFormInput,
    ToggleSwitch,
    BInputGroup,
    BInputGroupText,
    StatusModifierExplaination,
    TitleWidget,
    StatusEffectItem,
    AddStatusEffectWidget
  }
}
</script>

<template>
  <div
    @click="modal = !modal"
    style="width: 13.5rem; height: 10rem; margin-top: -0.65rem"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      style="
        position: absolute;
        font-size: 10rem;
        z-index: 5;
        margin-left: 1.5rem;
        margin-top: -1.5rem;
        transform: scale(1.1, 0.95);
      "
      :style="{ color: designStore.primaryTheme }"
    >
      <i class="bi bi-shield-fill"></i>
    </div>
    <div
      style="
        position: absolute;
        font-size: 11rem;
        z-index: 4;
        margin-left: 1rem;
        margin-top: -2rem;
        transform: scale(1, 0.95);
      "
      :style="{ color: designStore.secondaryTheme }"
    >
      <i class="bi bi-shield-fill"></i>
    </div>
    <div class="shieldTxt" :style="{ color: designStore.primaryText }">
      <div style="display: flex; flex-direction: column; margin-top: 0.75rem">
        <div class="lilDVs">
          <MiniArmorWidget
            :color="getColor('Armor')"
            emblem="gi-visored-helm"
            margin-top="-1.2rem"
            :value="armorDvs"
          ></MiniArmorWidget>
          <MiniArmorWidget
            :color="getColor('Shield')"
            emblem="gi-shield"
            margin-top="-1.2rem"
            :value="shieldDvs"
          ></MiniArmorWidget>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: center;
            margin-top: -1rem;
            margin-bottom: -0.75rem;
            font-size: 3rem;
          "
        >
          {{ totalDvs }}
        </div>

        <div class="lilDVs">
          <MiniArmorWidget
            :color="getColor('Move')"
            emblem="gi-run"
            margin-top="-1.4rem"
            :value="moveDvs"
          ></MiniArmorWidget>
          <MiniArmorWidget
            :color="getColor('Bonus')"
            emblem="gi-vibrating-shield"
            margin-top="-1.4rem"
            :value="bonusDvs"
          ></MiniArmorWidget>
        </div>

        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: 1.75rem; align-self: center; margin-top: -2.75rem"
        >
          Dvs
        </div>
      </div>
    </div>
    <CustomModal title="Modify Armor" :showModal="modal" @close="modal = !modal">
      <template v-slot:body>
        <div
          style="font-size: x-large; text-align: center; margin-top: -1rem; margin-bottom: 0.25rem"
        >
          {{ armorDvs }} Armor Dvs, {{ shieldDvs }} Shield Dvs, {{ moveDvs }} Move Dvs,
          {{ bonusDvs }} Bonus Dvs
        </div>
        <div class="equipment">
          <BInputGroupText
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
            class="wornArmorLabel"
            >Armor:
          </BInputGroupText>
          <BFormInput
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
            class="wornArmor"
            v-model="wornArmor.name"
            disabled
          ></BFormInput>
          <BInputGroupText
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
            class="equippedShieldLabel"
          >
            Shield:
          </BInputGroupText>
          <BFormInput
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.inputBacking,
              color: designStore.inputText
            }"
            class="equippedShield"
            v-model="wornShield.name"
            disabled
          ></BFormInput>
        </div>
        <BInputGroup
          style="border: 2px solid; border-radius: 10px; margin-bottom: 1rem; width: 12rem"
          :style="{
            borderColor: designStore.secondaryTheme,
            background: designStore.inputBacking,
            color: designStore.inputText
          }"
        >
          <BInputGroupText
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            style="padding: 0.5rem"
            >Is Dodging?</BInputGroupText
          >
          <ToggleSwitch
            style="margin-top: 0.75rem"
            @true="isDodging = true"
            @false="isDodging = false"
            :value="isDodging"
          ></ToggleSwitch>
        </BInputGroup>

        <div style="display: flex; justify-content: space-between; margin-top: -1.5rem">
          <TitleWidget title="Status Modifiers" style="width: 100%"></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>
        <AddStatusEffectWidget
          :modifierType="modifierType"
          @added="(addedVal) => addArmorStatusModifier(addedVal)"
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
.equipment {
  margin-bottom: 1rem;
  display: flex;
}
.equippedShieldLabel {
  padding: 0.5rem;
  border-radius: 0;
}
.equippedShield {
  padding: 0.5rem;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.wornArmor {
  padding: 0.5rem;
  border-radius: 0;
}
.wornArmorLabel {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  padding: 0.5rem;
}
.shieldTxt {
  position: absolute;
  font-size: 2rem;
  z-index: 5;
  width: 13rem;
}
.lilDVs {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: medium;
}
@media (max-width: 800px) {
  .equipment {
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .equippedShieldLabel {
    padding: 0.5rem;
    border-radius: 0.375rem;
    border-top-left-radius: 0;

    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .equippedShield {
    text-overflow: ellipsis;
    grid-area: 2 / 2 / 3 / 4;
    border-bottom-right-radius: 0.375rem;
    padding: 0.5rem;
    border-top-right-radius: 0;

    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .wornArmor {
    border-radius: 0;
    border-top-right-radius: 0.375rem;
    text-overflow: ellipsis;
    grid-area: 1 / 2 / 2 / 4;

    padding: 0.5rem;
  }
  .wornArmorLabel {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;

    padding: 0.5rem;
  }
}
</style>
