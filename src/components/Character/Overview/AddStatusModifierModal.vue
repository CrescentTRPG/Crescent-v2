<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import GridSelect from '@/components/GridSelect.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useStatusEffectStore } from '@/stores/statusEffectStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, ref } from 'vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'

export default {
  props: ['modifierType', 'modifiers', 'modifyIsHidden'],
  emits: ['added'],
  setup(props, context) {
    const characterStore = useCharacterStore()
    const designStore = useDesignStore()
    const sufferingDamageType = ref('')
    const statusEffectsStore = useStatusEffectStore()
    const { manualStatusEffect } = storeToRefs(statusEffectsStore)
    const modAmount = ref(0)
    const modal = ref(false)
    const linkedStatus = ref('')
    const statuses: ComputedRef = computed(() => {
      let ret = ['']
      return ret.concat(Object.keys(characterStore.customStatusEffects))
    })
    function add() {
      props.modifyIsHidden(false)
      context.emit('added', {
        selectedMod: modifierToAdd.value,
        linkedStatus: linkedStatus.value,
        modAmount: modAmount.value,
        sufferingDamageType: sufferingDamageType.value
      })
      linkedStatus.value = ''
      modal.value = false
    }
    const damageTypes = [
      'Un-typed',
      'Fire',
      'Ice',
      'Lightning',
      'Force',
      'Toxic',
      'Stress',
      'Piercing',
      'Edged',
      'Blunt',
      'Blight',
      'Divine',
      'Pure Magic'
    ]
    const modifierOptions = [
      {
        name: 'Suffering',
        description:
          'Each instance of Suffering inflicts a d6 of a damage type at the start of a character’s turn until cleared. Targets under the effects of  suffering  can  remove all instances of it by expending their swift action.',
        icon: 'gi-bleeding-heart',
        value: 'Suffering'
      },
      {
        name: 'Barrier Regen',
        description:
          'At the start of the character’s turn, they regain barrier equal to the modifier amount.',
        icon: 'gi-heart-shield',
        value: 'Barrier Regen'
      },
      {
        name: 'Hp Regen',
        description:
          'At the start of the character’s turn, they regain hit points equal to the modifier amount.',
        icon: 'gi-heart-plus',
        value: 'Hp Regen'
      },
      {
        name: 'Modify Total Hp',
        description:
          'Add or subtract the value from total hp.  If this decreases your total below your current HP, that is also deducted to match. This number may be positive or negative',
        icon: 'gi-nested-hearts',
        value: 'Modify Base Hp'
      },
      {
        name: 'Override Total Hp',
        description:
          'Set your total HP to this value.  If this decreases your total below your current HP, that is also deducted to match. This number may only be positive',
        icon: 'gi-crowned-heart',
        value: 'Override Base Hp'
      },
      {
        name: 'Rot',
        description:
          'At the start of the character’s turn, they take 1d4 damage per stack of rot.  The value entry below is equivalent to the stacks of rot.',
        icon: 'gi-death-juice',
        value: 'Rot'
      },
      {
        name: 'Mana Regen',
        value: 'mana regen',
        description:
          'At the start of the character’s turn, they regain mana equal to the modifier value.',
        icon: 'gi-book-aura'
      },
      {
        name: 'Override Total Mana',
        value: 'override base mana',
        description:
          'Set your total Mana to this value.  If this decreases your total below your current mana, that is also deducted to match. This number may only be positive',
        icon: 'gi-spell-book'
      },
      {
        name: 'Modify Total Mana',
        value: 'modify base mana',
        description:
          'Modify your total Mana by this value.  If this decreases your total below your current mana, that is also deducted to match.  This number may be positive or negative',
        icon: 'gi-book-storm'
      },
      {
        name: 'Modify Shield Dvs',
        value: 'Modify Shield Dvs',
        description:
          'Modify your Shield DVs by this value. This number may be positive or negative',
        icon: 'gi-shield'
      },
      {
        name: 'Override Shield Dvs',
        value: 'Override Shield Dvs',
        description: 'Set your Shield DVs to this value. This number may only be positive',
        icon: 'gi-shield'
      },
      {
        name: 'Modify Armor Dvs',
        value: 'Modify Armor Dvs',
        description: 'Modify your Armor DVs by this value. This number may be positive or negative',
        icon: 'gi-visored-helm'
      },
      {
        name: 'Override Armor Dvs',
        value: 'Override Armor Dvs',
        description: 'Set your Armor DVs to this value. This number may only be positive',
        icon: 'gi-visored-helm'
      },
      {
        name: 'Modify Bonus Dvs',
        value: 'Modify Bonus Dvs',
        description: 'Modify your Bonus DVs by this value. This number may be positive or negative',
        icon: 'gi-vibrating-shield'
      },
      {
        name: 'Override Bonus Dvs',
        value: 'Override Bonus Dvs',
        description: 'Set your Bonus DVs to this value. This number may only be positive',
        icon: 'gi-vibrating-shield'
      },
      {
        name: 'Modify Movement Dvs',
        value: 'Modify Movement Dvs',
        description:
          'Modify your Movement DVs by this value. This number may be positive or negative',
        icon: 'gi-run'
      },
      {
        name: 'Override Movement Dvs',
        value: 'Override Movement Dvs',
        description: 'Set your Movement DVs to this value. This number may only be positive',
        icon: 'gi-run'
      },
      {
        name: 'Modify Mp',
        value: 'Modify Mp',
        description:
          'Modify your total MP by this value.  This number may be positive or negative, though your MP may not go below 0.',
        icon: 'gi-swords-emblem'
      },
      {
        name: 'Override Mp',
        value: 'Override Mp',
        description: 'Set your total MP to this value.  This number may only be positive',
        icon: 'gi-swords-emblem'
      },
      {
        name: 'Modify Swim Speed',
        value: 'Modify Swim',
        description:
          'Modify your swim speed by this value. This number may be positive or negative',
        icon: 'gi-whale-tail'
      },
      {
        name: 'Override Swim Speed',
        value: 'Override Swim',
        description: 'Set your swim speed to this value. This number may only be positive',
        icon: 'gi-whale-tail'
      },
      {
        name: 'Modify Flight Speed',
        value: 'Modify Flight',
        description:
          'Modify your flight speed by this value. This number may be positive or negative',
        icon: 'gi-angel-wings'
      },
      {
        name: 'Override Flight Speed',
        value: 'Override Flight',
        description: 'Set your flight speed to this value. This number may only be positive',
        icon: 'gi-angel-wings'
      },
      {
        name: 'Modify Climb Speed',
        value: 'Modify Climb',
        description:
          'Modify your climb speed by this value. This number may be positive or negative',
        icon: 'gi-gecko'
      },
      {
        name: 'Override Climb Speed',
        value: 'Override Climb',
        description: 'Set your climb speed to this value. This number may only be positive',
        icon: 'gi-gecko'
      },
      {
        name: 'Modify Burrow Speed',
        value: 'Modify Burrow',
        description:
          'Modify your burrow speed by this value. This number may be positive or negative',
        icon: 'gi-dig'
      },
      {
        name: 'Override Burrow Speed',
        value: 'Override Burrow',
        description: 'Set your burrow speed to this value. This number may only be positive',
        icon: 'gi-dig'
      },
      {
        name: 'Modify Land Speed',
        value: 'Modify Base',
        description:
          'Modify your land speed by this value. This number may be positive or negative',
        icon: 'gi-sprint'
      },
      {
        name: 'Override Land Speed',
        value: 'Override Base',
        description: 'Set your land speed to this value. This number may only be positive',
        icon: 'gi-sprint'
      },
      {
        name: 'Override Attribute',
        value: 'Override Attribute',
        description: 'Set the Atrribute score to this value. This number may only be positive',
        icon: 'gi-skills'
      },
      {
        name: 'Modify Attribute',
        value: 'Modify Attribute',
        description:
          'Modify the Attribute score by this value.  This number may be negative or positive',
        icon: 'gi-skills'
      },
      {
        name: 'Add Exceptional(s)',
        value: 'Add Exceptional(s)',
        description:
          'Grant the character an amount of exceptionals. This number may only be positive',
        icon: 'gi-polar-star'
      },
      {
        name: 'Add Inferior(s)',
        value: 'Add Inferior(s)',
        description:
          'Disadvantage the character with an amount of inferiors. This number may only be positive',
        icon: 'bi bi-arrow-down'
      }
    ]

    const filteredModifierOptions: ComputedRef = computed(() => {
      let ret: Array<{ name: string; description: string; icon: string }> = []
      ret = modifierOptions.filter((mod) => props.modifiers.includes(mod.value))
      return ret.sort((a, b) => {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
    })

    const modifierToAdd = ref('')
    return {
      designStore,
      props,
      sufferingDamageType,
      damageTypes,
      modAmount,
      linkedStatus,
      statuses,
      add,
      modal,
      filteredModifierOptions,
      modifierToAdd
    }
  },
  components: {
    BFormInput,
    BButton,
    BInputGroupText,
    DropdownSelect,
    CustomModal,
    GridSelect,
    TitleWidget,
    StatusModifierExplaination
  }
}
</script>
<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-top: -2rem">
      <div style="display: flex; flex-direction: column; width: 100%; margin-top: -2rem">
        <BButton
          @click="((modal = true), console.log('hi'), props.modifyIsHidden(true))"
          style="align-self: flex-end; position: relative; top: 4rem; right: 2rem"
          ><i class="bi bi-plus-lg"></i> Add Modifier</BButton
        >
        <TitleWidget
          class="expandingInput"
          title="Status Modifiers"
          style="width: 100%"
        ></TitleWidget>
      </div>
      <StatusModifierExplaination
        style="position: relative; top: 2.5rem"
      ></StatusModifierExplaination>
    </div>
    <CustomModal
      :show-modal="modal"
      @close="((modal = false), props.modifyIsHidden(false))"
      :title="'Add ' + props.modifierType + ' Status Modifier'"
    >
      <template v-slot:body>
        <GridSelect
          :options="filteredModifierOptions"
          :selected="modifierToAdd"
          :update-option="(val) => (modifierToAdd = val)"
        ></GridSelect>
      </template>

      <template v-slot:footer>
        <div
          class="addStatusContainer"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <div
            style="display: flex; flex-grow: 1"
            v-if="
              modifierToAdd === 'Suffering' ||
              modifierToAdd === 'Resistance' ||
              modifierToAdd === 'Susceptibility' ||
              modifierToAdd === 'Immunity' ||
              modifierToAdd === 'Vulnerability' ||
              modifierToAdd === 'Damage Reduction' ||
              modifierToAdd === 'Damage Amplification'
            "
          >
            <BInputGroupText
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              style="border-radius: 0"
              class="numMobile"
            >
              Damage Type:
            </BInputGroupText>
            <div class="nonMobileItem">Damage Type</div>

            <DropdownSelect
              class="dropdown-fill damage"
              style="border-left: 1px solid"
              :borderless="true"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              :default="sufferingDamageType"
              :options="damageTypes"
              @selection="(selection) => (sufferingDamageType = selection)"
            ></DropdownSelect>
          </div>
          <div
            class="num"
            style="width: 30%; border-left: 1px solid"
            :style="{
              background: designStore.inputBacking,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div class="nonMobileItem">Value</div>

            <BFormInput
              v-if="
                modifierToAdd !== 'Resistance' &&
                modifierToAdd !== 'Susceptibility' &&
                modifierToAdd !== 'Immunity' &&
                modifierToAdd !== 'Vulnerability'
              "
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              style="border: 0"
              type="number"
              placeholder="value"
              v-model="modAmount"
              class="num"
            ></BFormInput>
          </div>

          <div style="display: flex; flex-grow: 1">
            <BInputGroupText
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              style="border-radius: 0; min-width: 7rem"
              class="numMobile"
            >
              Link Status :
            </BInputGroupText>
            <div class="nonMobileItem">Linked Custom Status</div>

            <DropdownSelect
              class="dropdown-fill linkedStatus"
              style="border-left: 1px solid"
              :borderless="true"
              placeholder="If Linked, this modifier dissapears when its linked status is removed"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              :default="linkedStatus"
              :options="statuses"
              @selection="(selection) => (linkedStatus = selection)"
            ></DropdownSelect>
          </div>

          <div style="display: flex; flex-grow">
            <BFormInput
              v-if="
                modifierToAdd !== 'Resistance' &&
                modifierToAdd !== 'Susceptibility' &&
                modifierToAdd !== 'Immunity' &&
                modifierToAdd !== 'Vulnerability'
              "
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              type="number"
              placeholder="value"
              v-model="modAmount"
              class="numMobile"
            ></BFormInput>

            <BButton @click="add()" class="addButton">
              Add Modifier <i class="bi bi-plus-lg" @click="add()"></i
            ></BButton>
          </div>
        </div>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped>
.num {
  max-width: 5rem;
  border-radius: 0;
}

.numMobile {
  display: none;
}

.addStatusContainer {
  border: 2px solid;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  display: flex;
  margin-top: 1rem;
  width: 100%;
}
.modifierType {
  border-top-left-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}
.linkedStatus {
  border-radius: 0;
  border-bottom: 1px solid;
}
.dropdown-fill {
  max-height: 10rem;
  min-width: 6rem;
  flex: 1;
}
.addButton {
  border: none;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;

  padding-right: 0.5rem;
  width: 100%;
  font-size: medium;
}
.type {
  border-radius: 0;
}
.damage {
  border-radius: 0;
}
.nonMobileItem {
  position: absolute;
  margin-top: -1.5rem;
}
@media (max-width: 800px) {
  .modifierType {
    border-top-left-radius: 0rem;
    border-bottom-left-radius: 0rem;
  }
  .nonMobileItem {
    display: none;
    position: absolute;
    margin-top: -1.5rem;
  }
  .dropdown-fill {
    border-bottom: 1px solid;
  }
  .type {
    grid-row: 1 / 1;
    grid-column: span 2 / span 2;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    border-top-right-radius: 0.375rem;
    border-bottom: 1px solid;
  }
  .addStatusContainer {
    display: flex;
    flex-wrap: wrap;
  }
  .num {
    display: none;
  }
  .numMobile {
    border-radius: 0;
    border-right: 1px solid;
    border-bottom-left-radius: 0.375rem;
    display: block;
    max-width: 50%;
  }

  .damage {
    border-radius: 0;
    border-bottom: 1px solid;
  }
  .addButton {
    border: none;
    padding-top: 0.5rem;
    padding-left: 0.5rem;
    min-width: 8rem;
  }
}
</style>
