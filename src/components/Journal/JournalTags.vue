<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { BFormTags } from 'bootstrap-vue-next'
import { ref } from 'vue'

export default {
  props: ['tagsOg', 'updateTemp'],
  emits: ['version'],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)
    const tags = ref(props.tagsOg)
    function close() {
      modal.value = false
      props.updateTemp(tags.value)
    }
    return {
      designStore,
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
  <div style="display: flex; justify-content: flex-start; flex-wrap: wrap; height: 2.75rem">
    <div
      @click="modal = true"
      class="journalTag hoverablePrimary"
      style="cursor: pointer; display: flex; height: min-content"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
    >
      Edit Tags
    </div>
    <div v-for="t in tags" :key="t">
      <div
        v-if="t"
        class="journalTag"
        :style="{
          background: designStore.alertTheme,
          color: designStore.inputBacking,
          borderColor: designStore.alertTheme
        }"
      >
        {{ t }}
      </div>
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
.journalTag {
  border-radius: 0.275rem;
  padding: 0.25rem;
  margin: 0.25rem;
  font-size: medium;
  border: 2px solid;
  text-wrap: nowrap;
}
</style>
