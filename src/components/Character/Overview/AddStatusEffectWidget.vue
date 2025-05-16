<script lang="ts">
import DropdownSelect from '@/components/DropdownSelect.vue'
import { useCharacterStore } from '@/stores/characterStore'
import { useDesignStore } from '@/stores/designStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { computed, ComputedRef, ref } from 'vue'

export default {
  props: ['modifierType'],
  emits: ['added'],
  setup(props, context) {
    const characterStore = useCharacterStore()
    const designStore = useDesignStore()
    const selectedMod = ref('')
    const sufferingDamageType = ref('')
    const modAmount = ref(0)
    const linkedStatus = ref('')
    const statuses: ComputedRef = computed(() => {
      let ret = ['']
      return ret.concat(Object.keys(characterStore.customStatusEffects))
    })
    function add() {
      context.emit('added', {
        selectedMod: selectedMod.value,
        linkedStatus: linkedStatus.value,
        modAmount: modAmount.value,
        sufferingDamageType: sufferingDamageType.value
      })
      linkedStatus.value = ''
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
    return {
      designStore,
      props,
      selectedMod,
      sufferingDamageType,
      damageTypes,
      modAmount,
      linkedStatus,
      statuses,
      add
    }
  },
  components: {
    BFormInput,
    BButton,
    BInputGroupText,
    DropdownSelect
  }
}
</script>
<template>
  <div
    class="addStatusContainer"
    :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
  >
    <div style="display: flex; flex-grow: 1">
      <BInputGroupText
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        style="border-radius: 0; border-top-left-radius: 0.375rem"
        class="numMobile"
      >
        Modifier :
      </BInputGroupText>
      <div class="nonMobileItem">Modifier Type</div>
      <DropdownSelect
        class="dropdown-fill modifierType"
        :borderless="true"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
        :default="selectedMod"
        :options="props.modifierType"
        @selection="(selection) => (selectedMod = selection)"
      ></DropdownSelect>
    </div>
    <div
      style="display: flex; flex-grow: 1"
      v-if="
        selectedMod === 'Suffering' ||
        selectedMod === 'Resistance' ||
        selectedMod === 'Susceptibility' ||
        selectedMod === 'Immunity' ||
        selectedMod === 'Vulnerability' ||
        selectedMod === 'Damage Reduction' ||
        selectedMod === 'Damage Amplification'
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
          selectedMod !== 'Resistance' &&
          selectedMod !== 'Susceptibility' &&
          selectedMod !== 'Immunity' &&
          selectedMod !== 'Vulnerability'
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
      <div class="nonMobileItem">Linked Status</div>

      <DropdownSelect
        class="dropdown-fill linkedStatus"
        style="border-left: 1px solid"
        :borderless="true"
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
          selectedMod !== 'Resistance' &&
          selectedMod !== 'Susceptibility' &&
          selectedMod !== 'Immunity' &&
          selectedMod !== 'Vulnerability'
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
  border-radius: 10px;
  margin-bottom: 1rem;
  margin-top: 1rem;
  display: flex;
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
