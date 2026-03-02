<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import CustomModal from '@/components/CustomModal.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import ToggleSwitch from '@/components/ToggleSwitch.vue'
import { BInputGroup } from 'bootstrap-vue-next'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import BPopover from 'bootstrap-vue-next/src/components/BPopover.vue'
import BasicInput from '../BasicInput.vue'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'
import MiniArmorWidget from './MiniArmorWidget.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import AddStatusModifierModal from './AddStatusModifierModal.vue'

export default {
  props: [
    'secondaryHandheldPassives',
    'primaryHandheldPassives',
    'wornArmorPassives',
    'armorStatusModifiers',
    'statusEffects',
    'wornArmor',
    'wornShield',
    'addNewArmorStatusModifier',
    'removeArmorStatusModifier',
    'martialPerks',
    'traits',
    'moveDvs',
    'shieldDvs',
    'armorDvs',
    'bonusDvs',
    'totalDvs',
    'isEditing',
    'setDvs',
    'isDodging',
    'setIsDodging',
    'hasDodging'
  ],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
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
      return props.statusEffects['Pinned']?.description.length > 0 ? true : false
    })
    const isStunned: ComputedRef<boolean> = computed(() => {
      return props.statusEffects['Stunned']?.description.length > 0 ? true : false
    })

    const isProne: ComputedRef<boolean> = computed(() => {
      return props.statusEffects['Prone']?.description.length > 0 ? true : false
    })

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(props.armorStatusModifiers)
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })

      return ret
    })

    function addArmorStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount
      }
      props.addNewArmorStatusModifier(statusObj)
    }
    function removeModifier(modifierType, modAmount, linkedStatus) {
      props.removeArmorStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus
      })
    }

    const armorColor: ComputedRef<string> = computed(() => {
      if (
        props.armorStatusModifiers['Modify Armor Dvs'] ||
        props.armorStatusModifiers['Override Armor Dvs']
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
        props.armorStatusModifiers['Modify ' + type + ' Dvs'] ||
        props.armorStatusModifiers['Override ' + type + ' Dvs']
      ) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }
    const isHidden = ref(false)
    return {
      designStore,
      modal,
      modifierType,
      statusModifiersList,
      addArmorStatusModifier,
      removeModifier,
      armorColor,
      getColor,
      props,
      isHidden
    }
  },
  components: {
    MiniArmorWidget,
    CustomModal,
    ToggleSwitch,
    BInputGroup,
    BInputGroupText,
    StatusEffectItem,
    BPopover,
    BasicInput,
    AddStatusModifierModal
  }
}
</script>

<template>
  <div
    class="hoverableIconOnSidebar"
    @click="modal = !modal"
    style="width: 13.25rem; height: 10rem; margin-top: -0.65rem"
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
            :value="props.armorDvs"
          ></MiniArmorWidget>
          <MiniArmorWidget
            :color="getColor('Shield')"
            emblem="gi-shield"
            margin-top="-1.2rem"
            :value="props.shieldDvs"
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
          {{ props.totalDvs }}
        </div>

        <div class="lilDVs">
          <MiniArmorWidget
            :color="getColor('Move')"
            emblem="gi-run"
            margin-top="-1.4rem"
            :value="props.moveDvs"
          ></MiniArmorWidget>
          <MiniArmorWidget
            :color="getColor('Bonus')"
            emblem="gi-vibrating-shield"
            margin-top="-1.4rem"
            :value="props.bonusDvs"
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
    <CustomModal
      v-if="!props.isEditing"
      title="Modify Armor"
      :showModal="modal"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <div
          style="font-size: x-large; text-align: center; margin-top: -1rem; margin-bottom: 0.25rem"
        >
          {{ props.armorDvs }} Armor Dvs, {{ props.shieldDvs }} Shield Dvs, {{ props.moveDvs }} Move
          Dvs, {{ props.bonusDvs }} Bonus Dvs
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
          <BPopover
            :style="{
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            class="popover"
            :click="true"
            :close-on-hide="true"
            :delay="{ show: 0, hide: 0 }"
          >
            <template #target>
              <div
                :style="{
                  borderColor: designStore.secondaryTheme,
                  background: designStore.inputBacking,
                  color: designStore.inputText
                }"
                class="wornArmor"
              >
                {{ props.wornArmor.name }}
              </div>
            </template>
            <div
              style="padding: 0.5rem; border-radius: 0.25rem; max-width: 20rem"
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >
              {{
                'To Equip Armor, Navigate to the "Equipment" Page and add a piece of armor to your items.  Then you may equip the item in the equipped items banner on said equipment page.'
              }}
            </div>
          </BPopover>
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
          <BPopover
            :style="{
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
            class="popover"
            :click="true"
            :close-on-hide="true"
            :delay="{ show: 0, hide: 0 }"
          >
            <template #target>
              <div
                :style="{
                  borderColor: designStore.secondaryTheme,
                  background: designStore.inputBacking,
                  color: designStore.inputText
                }"
                class="equippedShield"
              >
                {{ props.wornShield.name }}
              </div>
            </template>
            <div
              style="padding: 0.5rem; border-radius: 0.25rem; max-width: 20rem"
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >
              {{
                'To Equip a Shield, Navigate to the "Equipment" Page and add a shield to your items.  Then you may equip the item as a secondary handheld in the equipped items banner on said equipment page.  Note that if you use both hands to hold a weapon you may be unable to equip a shield'
              }}
            </div>
          </BPopover>
        </div>
        <BInputGroup
          v-if="hasDodging"
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
            @true="props.setIsDodging(true)"
            @false="props.setIsDodging(false)"
            :value="props.isDodging"
          ></ToggleSwitch>
        </BInputGroup>

        <AddStatusModifierModal
          :modify-is-hidden="(val) => (isHidden = val)"
          :modifiers="modifierType"
          modifierType="Defense Values"
          @added="(val) => addArmorStatusModifier(val)"
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
      :is-hidden="isHidden"
      v-if="props.isEditing"
      title="Modify Dvs"
      :showModal="modal"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <BasicInput
          style="margin-bottom: 1rem"
          label="Armor Dvs"
          type="number"
          :value="props.armorDvs"
          :min="0"
          :max="999"
          @newValue="(val) => props.setDvs(val, props.shieldDvs, props.bonusDvs, props.moveDvs)"
        ></BasicInput>
        <BasicInput
          style="margin-bottom: 1rem"
          label="Shield Dvs"
          type="number"
          :value="props.shieldDvs"
          :min="0"
          :max="999"
          @newValue="(val) => props.setDvs(props.armorDvs, val, props.bonusDvs, props.moveDvs)"
        ></BasicInput>
        <BasicInput
          style="margin-bottom: 1rem"
          label="Bonus Dvs"
          type="number"
          :value="props.bonusDvs"
          :min="0"
          :max="999"
          @newValue="(val) => props.setDvs(props.armorDvs, props.shieldDvs, val, props.moveDvs)"
        ></BasicInput>
        <BasicInput
          label="Move Dvs"
          type="number"
          :value="props.moveDvs"
          :min="0"
          :max="999"
          @newValue="(val) => props.setDvs(props.armorDvs, props.shieldDvs, props.bonusDvs, val)"
        ></BasicInput>
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
  border: 1px solid;
  width: 100%;
}
.wornArmor {
  padding: 0.5rem;
  border-radius: 0;
  border: 1px solid;
  width: 100%;
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
    grid-area: 2 / 1 / 2 / 4;

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
