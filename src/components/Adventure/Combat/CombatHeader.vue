<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { onMounted, Ref, ref } from 'vue'

import CustomModal from '@/components/CustomModal.vue'
import BasicInput from '@/components/Character/BasicInput.vue'
import StatBlockTags from '../Stat Blocks/StatBlockTags.vue'

export default {
  props: ['combat', 'isEditing', 'updateTemp', 'toggleCombatants'],
  setup(props, context) {
    const designStore = useDesignStore()
    const name = ref('')
    const tags: Ref<Array<String>> = ref([])
    const powerLevel: Ref<Number> = ref(0)
    const modal = ref(false)
    onMounted(() => {
      name.value = props.combat.name
      tags.value = props.combat.tags
    })
    function editName(val) {
      name.value = val
      let newTemp = { ...props.combat, name: val }
      props.updateTemp(newTemp)
    }

    const showDice = ref(false)

    return {
      designStore,
      props,
      name,
      modal,
      editName,
      showDice
    }
  },
  components: {
    CustomModal,
    BasicInput,
    StatBlockTags
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
          {{ name }}
        </div>
      </div>
      <div style="display: flex">
        <StatBlockTags
          :updateTemp="props.updateTemp"
          :currentStatBlock="props.combat"
          :isEditing="props.isEditing"
        ></StatBlockTags>
      </div>
    </div>
    <div style="display: flex; justify-content: space-between; width: 100%" v-else>
      <div style="display: flex">
        <div
          :style="{ color: designStore.primaryText }"
          style="font-size: xx-large; padding-right: 0.5rem"
        >
          {{ name }}
        </div>
      </div>
      <div style="display: flex">
        <StatBlockTags
          :updateTemp="props.updateTemp"
          :currentStatBlock="props.combat"
          :isEditing="props.isEditing"
        ></StatBlockTags>
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
