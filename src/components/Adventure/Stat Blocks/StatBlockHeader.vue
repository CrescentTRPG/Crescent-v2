<script lang="ts">
import BasicInput from '@/components/Character/BasicInput.vue'
import CustomModal from '@/components/CustomModal.vue'
import StatBlockDiceRoller from '@/components/DiceSidebar/StatBlockDiceRoller.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { BButton } from 'bootstrap-vue-next'
import BOffcanvas from 'bootstrap-vue-next/src/components/BOffcanvas/BOffcanvas.vue'
import { onMounted, Ref, ref } from 'vue'
import PowerLevelDisplay from './PowerLevelDisplay.vue'
import StatBlockTags from './StatBlockTags.vue'

export default {
  props: ['currentStatBlock', 'isEditing', 'updateTemp', 'useIconInsteadOfPowerLevel'],
  setup(props, context) {
    const designStore = useDesignStore()
    const name = ref('')
    const tags: Ref<Array<String>> = ref([])
    const powerLevel: Ref<Number> = ref(0)
    const modal = ref(false)
    onMounted(() => {
      name.value = props.currentStatBlock.name
      tags.value = props.currentStatBlock.tags
      powerLevel.value = props.currentStatBlock.powerLevel
    })
    function editName(val) {
      name.value = val
      let newTemp = { ...props.currentStatBlock, name: val }
      props.updateTemp(newTemp)
    }

    function sendPower(level) {
      context.emit('power', level)
    }
    function sendPowerIcon(level) {
      context.emit('powerIcon', level)
    }
    function sendOverrideIcon(level) {
      context.emit('overrideIcon', level)
    }
    function sendOverridePower(level) {
      context.emit('overridePowerLevel', level)
    }
    const showDice = ref(false)

    return {
      designStore,
      props,
      name,
      modal,
      editName,
      sendPower,
      showDice,
      sendOverrideIcon,
      sendPowerIcon,
      sendOverridePower
    }
  },
  components: {
    PowerLevelDisplay,
    CustomModal,
    BasicInput,
    StatBlockTags,
    BOffcanvas,
    StatBlockDiceRoller,
    BButton,
    IconDisplay
  }
}
</script>
<template>
  <div
    style="
      display: flex;
      justify-content: space-between;
      padding: 0.75rem;
      border-bottom: 2px solid;
    "
    :style="{ background: designStore.primaryTheme, borderColor: designStore.secondaryTheme }"
  >
    <div style="display: flex; justify-content: space-between; width: 100%" v-if="props.isEditing">
      <div style="display: flex">
        <div
          @click="modal = true"
          class="nameTextSize"
          :style="{ color: designStore.primaryText }"
          style="padding-right: 0.5rem; cursor: pointer"
        >
          {{ props.currentStatBlock.name }}
        </div>

        <PowerLevelDisplay
          :current-stat-block="props.currentStatBlock"
          style="margin-top: -0.25rem; margin-right: 2rem"
          @power="(level) => sendPower(level)"
          @overridePowerLevel="(level) => sendOverridePower(level)"
          @powerIcon="(icon) => sendPowerIcon(icon)"
          @overrideIcon="(icon) => sendOverrideIcon(icon)"
        ></PowerLevelDisplay>
      </div>
      <div style="display: flex">
        <StatBlockTags
          :updateTemp="props.updateTemp"
          :currentStatBlock="props.currentStatBlock"
          :isEditing="props.isEditing"
        ></StatBlockTags>
        <div>
          <BButton
            @click="showDice = !showDice"
            class="diceButton"
            style="border: 2px solid; padding: 0.25rem; padding-right: 0.5rem; padding-left: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <i class="bi bi-dice-6"></i>
          </BButton>
          <BOffcanvas
            v-model="showDice"
            placement="end"
            :backdrop="true"
            shadow="false"
            :teleportDisabled="false"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              '--bs-btn-close-color': designStore.primaryText
            }"
          >
            <StatBlockDiceRoller :currentStatBlock="props.currentStatBlock"></StatBlockDiceRoller>
          </BOffcanvas>
        </div>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; width: 100%" v-else>
      <div style="display: flex">
        <div
          :style="{ color: designStore.primaryText }"
          style="font-size: xx-large; padding-right: 0.5rem"
        >
          {{ props.currentStatBlock.name }}
        </div>

        <PowerLevelDisplay
          v-if="!props.useIconInsteadOfPowerLevel"
          :currentStatBlock="props.currentStatBlock"
          style="margin-top: -0.25rem; margin-right: 2rem"
          @power="(level) => sendPower(level)"
          @overridePowerLevel="(level) => sendOverridePower(level)"
          @powerIcon="(icon) => sendPowerIcon(icon)"
          @overrideIcon="(icon) => sendOverrideIcon(icon)"
        ></PowerLevelDisplay>
        <div v-else>
          <IconDisplay
            size="xx-large"
            scale="3"
            :color="designStore.secondaryTheme"
            :icon="props.currentStatBlock.groupIcon"
          ></IconDisplay>
        </div>
      </div>
      <div style="display: flex">
        <StatBlockTags
          :updateTemp="props.updateTemp"
          :currentStatBlock="props.currentStatBlock"
          :isEditing="props.isEditing"
        ></StatBlockTags>
        <div>
          <BButton
            @click="showDice = !showDice"
            class="diceButton"
            style="border: 2px solid; padding: 0.25rem; padding-right: 0.5rem; padding-left: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <i class="bi bi-dice-6"></i>
          </BButton>
          <BOffcanvas
            v-model="showDice"
            placement="end"
            :backdrop="true"
            shadow="false"
            :teleportDisabled="false"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              '--bs-btn-close-color': designStore.primaryText
            }"
          >
            <StatBlockDiceRoller :currentStatBlock="props.currentStatBlock"></StatBlockDiceRoller>
          </BOffcanvas>
        </div>
      </div>
    </div>

    <CustomModal :showModal="modal" title="Edit Name" @close="modal = false" :close-on-enter="true">
      <template v-slot:body>
        <BasicInput label="Name" :value="name" @newValue="(val) => editName(val)"></BasicInput>
      </template>
    </CustomModal>
  </div>
</template>
<style>
.nameTextSize {
  font-size: xx-large;
}
@media (max-width: 800px) {
  .nameTextSize {
    font-size: x-large;
    text-align: center;
  }
}
@media (max-width: 600px) {
  .nameTextSize {
    font-size: large;
    text-align: center;
  }
}
</style>
