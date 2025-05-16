<script lang="ts">
import { computed, ComputedRef, onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useAdventureStore } from '@/stores/adventureStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { BFormTextarea } from 'bootstrap-vue-next'

export default {
  props: ['sender', 'senderId'],
  setup(props, context) {
    const adventureStore = useAdventureStore()
    const designStore = useDesignStore()

    const message = ref('')

    function sendChat() {
      if (message.value.length > 0) {
        adventureStore.addChat(
          message.value,
          props.sender,
          props.senderId,
          false,
          [],
          designStore.charIcon
        )
        message.value = ''
      }
    }
    return {
      props,
      designStore,
      adventureStore,
      message,
      sendChat
    }
  },
  components: { BButton, BFormTextarea }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }" style="display: flex">
    <BFormTextarea
      v-model="message"
      placeholder="New Chat..."
      style="
        white-space: pre-line;
        border: 2px solid;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      "
      :style="{
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        '--bs-secondary-color': designStore.inputText
      }"
    ></BFormTextarea>
    <BButton
      @click="sendChat()"
      :style="{
        color: designStore.primaryText,
        background: designStore.primaryTheme,
        borderColor: designStore.secondaryTheme
      }"
      style="border-top-left-radius: 0; border-bottom-left-radius: 0"
      >Send</BButton
    >
  </div>
</template>

<style></style>
