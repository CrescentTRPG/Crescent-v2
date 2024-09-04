<script lang="ts">
import { useRouter } from 'vue-router'
import {
  BButton,
  BCard,
  BNavItem,
  BNavbar,
  BFormInput,
  BInputGroup,
  BInputGroupText
} from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import CustomModal from '../../CustomModal.vue'

export default {
  props: ['attribute', 'attributeValue', 'exceptionalValue'],
  setup(props, context) {
    const router = useRouter()
    const attributeValue = ref(0)
    const exceptionalValue = ref(0)
    const designStore = useDesignStore()
    const modal = ref(false)
    return { designStore, modal, attributeValue, exceptionalValue }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CustomModal,
    BFormInput,
    BInputGroup,
    BInputGroupText
  }
}
</script>

<template>
  <div
    class="attr"
    :style="{
      fontFamily: designStore.font,
      background: designStore.primaryTheme,
      color: designStore.primaryText
    }"
    @click="modal = !modal"
  >
    <div class="innerAttr">
      <div style="align-self: center">{{ $props.attribute }}</div>
      <div style="align-self: center; font-size: 3rem">{{ $props.attributeValue }}</div>
    </div>
    <CustomModal :showModal="modal" :title="$props.attribute" @close="modal = false">
      <template v-slot:body>
        <BInputGroup
          style="border: 3px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BInputGroupText
            style="width: 7rem"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >Attribute</BInputGroupText
          >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="0"
            max="10"
            v-model="attributeValue"
          ></BFormInput>
        </BInputGroup>
        <BInputGroup
          style="border: 3px solid; border-radius: 10px"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BInputGroupText
            style="width: 7rem"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >Exceptional</BInputGroupText
          >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="-10"
            max="10"
            v-model="exceptionalValue"
          ></BFormInput>
        </BInputGroup>
      </template>
    </CustomModal>
  </div>
</template>

<style>
.attr {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  height: 7rem;
  width: 7rem;
  display: flex;
  justify-content: center;
  flex-direction: row;
  border-radius: 0.5rem;
}
.innerAttr {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0.5rem;
}
</style>
