<script lang="ts">
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useDesignStore } from '../../stores/designStore.ts'

import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'

export default {
  props: ['openFile', 'linkProspect', 'isLinked', 'linkFile'],
  setup(props, context) {
    const designStore = useDesignStore()
    const linkRelation = ref('')
    return {
      designStore,
      props,
      linkRelation
    }
  },
  components: { BButton, BFormInput }
}
</script>

<template>
  <div style="display: flex">
    <BFormInput
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
      style="border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: 0"
      v-model="linkRelation"
      placeholder="relationship to..."
    ></BFormInput>
    <BButton
      style="
        border: 1px solid;
        padding: 0.25;
        font-size: large;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
      @click="linkFile(props.linkProspect.id, linkRelation)"
      ><i v-if="$props.isLinked" class="bi bi-check"></i><i v-else class="bi bi-link-45deg"></i
    ></BButton>
  </div>
</template>

<style></style>
