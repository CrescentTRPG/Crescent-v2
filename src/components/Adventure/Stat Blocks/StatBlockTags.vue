<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import ArrayTabsSingleSelect from './ArrayTabsSingleSelect.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { computed, ref } from 'vue'
import CustomModal from '@/components/CustomModal.vue'
import BasicInput from '@/components/Character/BasicInput.vue'
import { BFormTags } from 'bootstrap-vue-next'

export default {
  props: ['currentStatBlock', 'isEditing', 'updateTemp'],
  emits: ['version'],
  setup(props, context) {
    const designStore = useDesignStore()
    const statBlock = props.currentStatBlock
    const modal = ref(false)
    const tags = ref(props.currentStatBlock.tags)
    function close() {
      modal.value = false
      let newTemp = { ...props.currentStatBlock }
      newTemp.tags = tags.value
      props.updateTemp(newTemp)
    }
    return {
      designStore,
      statBlock,
      props,
      modal,
      tags,
      close
    }
  },
  components: { BFormTags, CustomModal }
}
</script>
<template>
  <div style="display: flex; flex-wrap: wrap; justify-content: end">
    <div v-for="t in tags" :key="t">
      <div
        class="statTag"
        :style="{
          background: designStore.alertTheme,
          color: designStore.inputBacking,
          borderColor: designStore.alertTheme
        }"
      >
        {{ t }}
      </div>
    </div>

    <div
      v-if="props.isEditing"
      @click="modal = true"
      class="statTag"
      style="cursor: pointer; display: flex; height: min-content"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
    >
      Edit Tags
    </div>

    <CustomModal :showModal="modal" title="Edit Tags" @close="close" :close-on-enter="true">
      <template v-slot:body>
        <BFormTags
          v-model="tags"
          input-id="tags-separators"
          :limit="10"
          :style="{
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText,
            '--tagBg': designStore.alertTheme
          }"
          separator=",;"
          placeholder="Enter new tags separated by comma or semicolon"
        ></BFormTags>
      </template>
    </CustomModal>
  </div>
</template>
<style>
.b-form-tag {
  background-color: var(--tagBg) !important;
}
.statTag {
  border-radius: 0.275rem;
  padding: 0.25rem;
  margin: 0.25rem;
  font-size: medium;
  border: 2px solid;
}
</style>
