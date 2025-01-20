<script lang="ts">
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
    BFormSelect,
    BInputGroupText
  }
}
</script>
<template>
  <div
    class="addStatusContainer"
    :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
  >
    <div style="display: flex; width: 100%">
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
      <BFormSelect
        class="type"
        v-model="selectedMod"
        :options="props.modifierType"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
      ></BFormSelect>
    </div>
    <div
      style="display: flex; width: 100%"
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
      <BFormSelect
        class="damage"
        v-model="sufferingDamageType"
        :options="damageTypes"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
      ></BFormSelect>
    </div>

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
      class="num"
    ></BFormInput>
    <div style="display: flex; width: 100%">
      <BInputGroupText
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        style="border-radius: 0"
        class="numMobile"
      >
        Link Status :
      </BInputGroupText>
      <BFormSelect
        v-model="linkedStatus"
        :options="statuses"
        placeholder="Linked Status"
        class="linkedStatus"
        :style="{
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme
        }"
      ></BFormSelect>
    </div>

    <div style="display: flex; width: 100%">
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
        Add Status <i class="bi bi-plus-lg" @click="add()"></i
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
  display: flex;
}
.linkedStatus {
  border-radius: 0;
  border-bottom: 1px solid;
}
.addButton {
  border: none;
  padding-top: 0.5rem;
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
@media (max-width: 800px) {
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
