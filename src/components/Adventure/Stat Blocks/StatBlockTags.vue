<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { BFormTags } from 'bootstrap-vue-next'
import { ref } from 'vue'

export default {
  props: ['currentStatBlock', 'isEditing', 'updateTemp', 'useStringOverArray', 'justReturnTags'],
  emits: ['version'],
  setup(props, context) {
    const designStore = useDesignStore()
    const statBlock = props.currentStatBlock
    const modal = ref(false)
    const tags = ref(
      props.useStringOverArray ? props.currentStatBlock.tags.split('') : props.currentStatBlock.tags
    )
    function close() {
      modal.value = false
      let newTemp = { ...props.currentStatBlock }
      newTemp.tags = props.useStringOverArray ? tags.value.join(',') : tags.value
      if (props.justReturnTags) {
        props.updateTemp(newTemp.tags)
      } else {
        props.updateTemp(newTemp)
      }
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
        v-if="t"
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
      class="statTag hoverablePrimary"
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
