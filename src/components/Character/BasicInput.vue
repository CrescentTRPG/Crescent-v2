<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../stores/designStore'
import { BForm, BFormInput, BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import { onKeyPressed, onKeyStroke } from '@vueuse/core'

export default {
  props: ['label', 'value', 'type', 'max', 'min', 'width'],
  emits: ['newValue'],
  setup(props, context) {
    const designStore = useDesignStore()

    const val = ref(props.value)
    function newValue(value) {
      context.emit('newValue', value)
    }
    return {
      designStore,
      val,
      props,
      newValue
    }
  },
  components: {
    BInputGroup,
    BFormInput,
    BInputGroupText
  }
}
</script>

<template>
  <div>
    <BInputGroup
      style="border: 3px solid; border-radius: 10px"
      :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
    >
      <BInputGroupText
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          width: props.width || 'fit-content'
        }"
        >{{ props.label }}</BInputGroupText
      >
      <BFormInput
        class="inputColorBackdrop"
        @keydown.enter="newValue(val)"
        :id="label + ' input'"
        v-if="props.type === 'number'"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        type="number"
        :min="props.min"
        :max="props.max"
        v-model="val"
        @change="newValue(val)"
      ></BFormInput>
      <BFormInput
        class="inputColorBackdrop"
        @keydown.enter="newValue(val)"
        v-if="props.type != 'number'"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        :type="type"
        v-model="val"
        @change="newValue(val)"
      ></BFormInput>
    </BInputGroup>
  </div>
</template>

<style scoped></style>
