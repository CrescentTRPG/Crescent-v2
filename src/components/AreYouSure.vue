<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'

import CustomModal from '@/components/CustomModal.vue'
import { BButton } from 'bootstrap-vue-next'

export default {
  props: ['action', 'passedFunction', 'passedVal', 'passedVal2', 'rightClick'],
  setup(props, context) {
    const designStore = useDesignStore()
    const modalValue = ref(false)

    function onCloseAccept() {
      if (props.passedVal2) {
        props.passedFunction(props.passedVal, props.passedVal2)
      } else if (props.passedVal) {
        props.passedFunction(props.passedVal)
      } else {
        props.passedFunction()
      }
      modalValue.value = false
    }

    function onCloseIgnore() {
      modalValue.value = false
    }
    return {
      props,
      designStore,
      modalValue,
      onCloseAccept,
      onCloseIgnore
    }
  },
  components: {
    BButton,
    CustomModal
  }
}
</script>

<template>
  <div>
    <div @click="modalValue = true" v-if="!rightClick">
      <slot></slot>
    </div>
    <div @contextmenu="modalValue = true" v-if="rightClick">
      <slot></slot>
    </div>
    <CustomModal :showModal="modalValue" title="Are you Sure?" @close="modalValue = false">
      <template v-slot:body>
        <div>Are you sure you want to {{ props.action }}?</div>
      </template>
      <template v-slot:footer>
        <BButton
          @click="onCloseAccept()"
          style="border: 1px solid; margin-right: 1rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Yes I'm Sure</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="onCloseIgnore()"
          >Cancel</BButton
        ></template
      >
    </CustomModal>
  </div>
</template>

<style scoped>
.body {
  position: relative;
  margin-left: 2rem;
  margin-right: 2rem;
}
</style>
