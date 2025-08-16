<script lang="ts">
import { computed, ComputedRef, onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useAdventureStore } from '@/stores/adventureStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import NewChatLine from './NewChatLine.vue'
import ChatBubble from './ChatBubble.vue'

export default {
  props: ['sender', 'senderId'],
  setup(props, context) {
    const adventureStore = useAdventureStore()
    const designStore = useDesignStore()
    const chats: ComputedRef<Array<any>> = computed(() => {
      return Object.values(adventureStore.chat).sort((a: any, b: any) => {
        return Date.parse(a.timestamp) - Date.parse(b.timestamp)
      })
    })
    return {
      props,
      designStore,
      adventureStore,
      chats
    }
  },
  components: { NewChatLine, ChatBubble }
}
</script>

<template>
  <div
    :style="{ fontFamily: designStore.font, background: designStore.inputBacking }"
    style="padding: 0.25rem; display: flex; flex-direction: column; justify-content: space-between"
  >
    <div
      style="
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        max-height: calc(100vh - 21.25rem);
      "
      class="chat-window"
    >
      <div v-for="chat in chats" :key="chat.timestamp">
        <ChatBubble :messageObj="chat"></ChatBubble>
      </div>
    </div>
    <NewChatLine
      :sender="props.sender"
      :senderId="props.senderId"
      style="justify-self: end"
    ></NewChatLine>
  </div>
</template>

<style>
.chat-window > div:last-child {
  scroll-snap-align: start;
}
</style>
