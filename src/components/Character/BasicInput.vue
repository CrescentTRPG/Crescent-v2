<script lang="ts">
import { BFormInput, BInputGroup, BInputGroupText } from 'bootstrap-vue-next'
import { ref, watch } from 'vue'
import { useDesignStore } from '../../stores/designStore.ts'

export default {
  props: [
    'label',
    'value',
    'type',
    'max',
    'min',
    'width',
    'placeholder',
    'labelAbove',
    'borderless'
  ],
  emits: ['newValue'],
  setup(props, context) {
    const designStore = useDesignStore()

    const val = ref(props.value)
    function newValue(value) {
      context.emit('newValue', value)
    }

    watch(props, async (props, old) => {
      val.value = props.value
    })
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
    <div v-if="props.label">
      <div v-if="props.labelAbove" style="display: flex; flex-direction: column">
        <div style="padding-left: 0.5rem">{{ label }}</div>
        <BInputGroup
          style="border: 3px solid; border-radius: 10px"
          :style="{
            border: props.borderless ? 'none' : '3px solid',
            borderColor: designStore.secondaryTheme,
            background: designStore.primaryTheme
          }"
        >
          <BFormInput
            :ref="label + type"
            class="inputColorBackdrop"
            :placeholder="props.placeholder"
            @keydown.enter="newValue(val)"
            :id="label + ' input'"
            v-if="props.type === 'number'"
            :style="{
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme,
              color: designStore.inputText
            }"
            type="number"
            :min="props.min"
            :max="props.max"
            v-model="val"
            @change="newValue(val)"
          ></BFormInput>
          <BFormInput
            :ref="label + type"
            class="inputColorBackdrop"
            @keydown.enter="newValue(val)"
            :placeholder="props.placeholder"
            v-if="props.type != 'number'"
            :style="{
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme,
              color: designStore.inputText
            }"
            :type="type"
            v-model="val"
            @change="newValue(val)"
          ></BFormInput>
        </BInputGroup>
      </div>
      <BInputGroup
        v-else
        style="border: 3px solid; border-radius: 10px"
        :style="{
          border: props.borderless ? 'none' : '3px solid',
          borderColor: designStore.secondaryTheme,
          background: designStore.primaryTheme
        }"
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
          :ref="label + type"
          class="inputColorBackdrop"
          :placeholder="props.placeholder"
          @keydown.enter="newValue(val)"
          :id="label + ' input'"
          v-if="props.type === 'number'"
          :style="{
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText
          }"
          type="number"
          :min="props.min"
          :max="props.max"
          v-model="val"
          @change="newValue(val)"
        ></BFormInput>
        <BFormInput
          :ref="label + type"
          class="inputColorBackdrop"
          @keydown.enter="newValue(val)"
          :placeholder="props.placeholder"
          v-if="props.type != 'number'"
          :style="{
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText
          }"
          :type="type"
          v-model="val"
          @change="newValue(val)"
        ></BFormInput>
      </BInputGroup>
    </div>
    <div v-else>
      <BFormInput
        :ref="label + type"
        class="inputColorBackdrop"
        :placeholder="props.placeholder"
        @keydown.enter="newValue(val)"
        :id="label + ' input'"
        v-if="props.type === 'number'"
        :style="{
          background: designStore.inputBacking,
          border: props.borderless ? 'none' : '3px solid',

          borderColor: designStore.secondaryTheme,

          color: designStore.inputText
        }"
        type="number"
        :min="props.min"
        :max="props.max"
        v-model="val"
        @change="newValue(val)"
      ></BFormInput>
      <BFormInput
        :ref="label + type"
        class="inputColorBackdrop"
        @keydown.enter="newValue(val)"
        :placeholder="props.placeholder"
        v-if="props.type != 'number'"
        :style="{
          background: designStore.inputBacking,
          border: props.borderless ? 'none' : '3px solid',

          borderColor: designStore.secondaryTheme,

          color: designStore.inputText
        }"
        :type="type"
        v-model="val"
        @change="newValue(val)"
      ></BFormInput>
    </div>
  </div>
</template>

<style scoped></style>
