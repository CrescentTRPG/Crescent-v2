<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import FancyDecor from '@/components/FancyDecor.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { computed, ref } from 'vue'

export default {
  props: ['resource', 'updateResource', 'manaGain', 'updateManaGain'],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)
    function updateManaGainHelper(manaGain) {
      let mana = parseInt(manaGain + '')
      if (props.resource === 'none' && manaGain > 0) {
        alert('You cannot have spells generate resource without a defined resource')
      } else {
        props.updateManaGain(mana)
      }
    }
    function updateResourceHelper(resource) {
      if (resource === 'none') {
        manaInput.value = 0
        updateManaGainHelper(0)
      }
      props.updateResource(resource)
    }
    const icon = computed(() => {
      return props.resource === 'mana' ? 'bi bi-book-fill' : 'bi bi-x'
    })
    const manaInput = ref(props.manaGain)
    return {
      designStore,
      modal,
      icon,
      props,
      updateResourceHelper,
      updateManaGainHelper,
      manaInput
    }
  },

  components: {
    CustomModal,
    FancyDecor,
    DropdownSelect,
    IconDisplay,
    BFormInput
  }
}
</script>
<template>
  <div>
    <div
      style="
        cursor: pointer;
        display: flex;
        flex-direction: column;
        margin: 0.5rem;
        border-radius: 0.5rem;
        padding-left: 0.35rem;
        padding-right: 0.35rem;
        height: 80%;
      "
      class="hoverablePrimary"
      @click="modal = true"
      :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
    >
      <div style="text-align: center">Resource</div>
      <div
        style="margin-bottom: 0.5rem; display: flex; z-index: 4; justify-content: center"
        :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
      >
        <div style="display: flex; justify-content: center">
          <IconDisplay style="position: absolute" :icon="icon" size="3.5rem"></IconDisplay>
          <div
            v-if="props.manaGain > 0"
            style="
              position: relative;
              z-index: 4;
              padding: 0.5rem;
              border-radius: 0.5rem;
              border: 2px solid;
              align-self: center;
              margin-top: 1rem;
              padding-top: 0.25rem;
              padding-bottom: 0.225rem;
            "
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{ props.manaGain }}
          </div>
        </div>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Set Resource Gain" @close="modal = false">
      <template v-slot:body>
        <FancyDecor
          text="Resource Type"
          :background="designStore.primaryTheme"
          :color="designStore.primaryText"
          width="15rem"
          icon="bi bi-book-fill"
        >
          <template v-slot:body>
            <DropdownSelect
              :color="designStore.inputText"
              @selection="(selection) => updateResourceHelper(selection)"
              :default="props.resource"
              :options="['mana', 'none']"
              class="fancySelect"
            ></DropdownSelect>
          </template>
        </FancyDecor>
        <div
          style="
            text-align: end;
            margin-top: -1.5rem;
            margin-bottom: 1rem;
            font-size: small;
            margin-right: 0.5rem;
          "
        >
          The type of resource the spellgroup grants when purchased.
        </div>

        <FancyDecor
          text="Resource Gain"
          :background="designStore.primaryTheme"
          :color="designStore.primaryText"
          width="15rem"
          icon="gi-sparkles"
        >
          <template v-slot:body>
            <BFormInput
              type="number"
              v-model="manaInput"
              style="border: 2px solid; margin-right: 0.5rem"
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              @change="updateManaGainHelper(manaInput)"
            ></BFormInput>
          </template>
        </FancyDecor>
        <div
          style="
            text-align: end;
            margin-top: -0.5rem;
            margin-bottom: 2rem;
            margin-left: 40%;
            font-size: small;
            margin-right: 0.5rem;
          "
        >
          The amount of resource each spell or spell rank grants when purchased. Groups That must be
          purchased in rank order only grant resource at each new rank.
        </div>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped></style>
