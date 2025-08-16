<template>
  <div id="main">
    <v-icon
      :style="{ color: designStore.secondaryTheme }"
      name="gi-hourglass"
      scale="1.25"
      style="position: absolute; z-index: 2; translate: -0.45rem 1.25rem; transform: rotate(-30deg)"
    ></v-icon>
    <v-icon
      scale="2"
      :style="{ color: designStore.inputBacking }"
      name="gi-plain-circle"
      style="position: absolute; z-index: 3; translate: 0.2rem 0.2rem"
    ></v-icon>
    <v-icon
      scale="2.35"
      :style="{ color: designStore.secondaryTheme }"
      name="gi-plain-circle"
      style="position: absolute; z-index: 2; translate: 0.05rem -0.1rem"
    ></v-icon>
    <!-- <v-icon
      scale="2"
      :style="{ color: designStore.secondaryTheme }"
      name="gi-circle-claws"
      style="position: absolute; z-index: 4"
    ></v-icon> -->
    <div
      @click="modal = true"
      style="
        position: relative;
        z-index: 4;
        padding: 0rem;
        padding-top: 0.55rem;
        padding-left: 0.2rem;
        width: 2.65rem;
        font-size: large;
        display: flex;
        justify-content: center;
        cursor: pointer;
      "
      :style="{ color: designStore.inputText, fontFamily: designStore.titleFont }"
    >
      <div>
        {{ props.initiative }}
      </div>
    </div>
    <CustomModal :showModal="modal" title="Alter Initiative" @close="modal = false">
      <template v-slot:body>
        <BasicInput
          label="Initiative"
          :value="init"
          type="number"
          :max="100"
          :min="0"
          @newValue="(val) => (init = val)"
        ></BasicInput>
      </template>
      <template v-slot:footer>
        <BButton @click="updateInitiative()">Set New Initiative</BButton>
        <BButton>Cancel</BButton>
      </template>
    </CustomModal>
    <!-- <svg src="../assets/5Mox5f01.svg"></svg>> -->
  </div>
</template>

<script lang="ts">
import BasicInput from '@/components/Character/BasicInput.vue'
import CustomModal from '@/components/CustomModal.vue'
import { useDesignStore } from '@/stores/designStore'
import { useInitiativeStore } from '@/stores/initiativeStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { onMounted, ref } from 'vue'

export default {
  props: ['initiative', 'changeInitiative', 'name', 'keyVal', 'agi'],
  setup(props, context) {
    const designStore = useDesignStore()
    const init = ref(0)
    const modal = ref(false)
    onMounted(() => {
      init.value = props.initiative
    })
    function updateInitiative() {
      props.changeInitiative(props.keyVal, init.value, props.agi)
    }
    return {
      designStore,
      props,
      init,
      modal,
      updateInitiative
    }
  },
  components: { CustomModal, BButton, BasicInput }
}
</script>

<style></style>
