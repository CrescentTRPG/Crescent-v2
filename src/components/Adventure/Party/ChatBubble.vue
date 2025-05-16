<script lang="ts">
import { computed, ComputedRef, onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useUserStore } from '@/stores/userStore'
import IconDisplay from '@/components/IconDisplay.vue'
import { useAdventureStore } from '@/stores/adventureStore'

export default {
  props: ['messageObj'],
  setup(props, context) {
    const designStore = useDesignStore()
    const userStore = useUserStore()

    const isSender = computed(() => {
      return userStore.getUserId === props.messageObj.fromId
    })
    const alignment = computed(() => {
      return isSender.value ? 'flex-end' : 'flex-start'
    })
    const textAlignment = computed(() => {
      return isSender.value ? 'end' : 'start'
    })
    const bubbleBackground = computed(() => {
      return isSender.value ? designStore.getPrimaryTheme : designStore.sidebarBacking
    })
    const bubbleText = computed(() => {
      return isSender.value ? designStore.primaryText : designStore.sidebarText
    })
    const border = computed(() => {
      return props.messageObj.isStarred ? '2px solid ' + designStore.alertTheme : 'none'
    })
    function starMessage(bool) {
      useAdventureStore().editChat({ ...props.messageObj, isStarred: bool })
    }

    return {
      props,
      designStore,
      alignment,
      textAlignment,
      bubbleText,
      bubbleBackground,
      border,
      isSender,
      starMessage
    }
  },
  components: { IconDisplay }
}
</script>

<template>
  <div style="display: flex" :style="{ justifyContent: alignment }">
    <div style="display: flex; flex-direction: column; width: fit-content; max-width: 90%">
      <!-- <div
        style="
          font-size: x-small;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          margin-bottom: -0.25rem;
          display: flex;
          flex-direction: column;
        "
        :style="{ textAlign: textAlignment, color: designStore.inputText }"
      >
        <div style="font-size: small">{{ props.messageObj.from }}</div>
      </div> -->
      <div
        style="
          padding: 0.25rem;
          padding-right: 0.5rem;
          margin: 0.25rem;
          display: flex;
          border-radius: 0.3rem;
          width: fit-content;
          cursor: pointer;
        "
        @click="starMessage(!props.messageObj.isStarred)"
        :style="{
          fontFamily: designStore.font,
          background: bubbleBackground,
          color: bubbleText,
          alignSelf: textAlignment,
          border: border
        }"
      >
        <div
          style="position: absolute; z-index: 4; margin-top: -1rem"
          v-if="isSender && props.messageObj.isStarred"
        >
          <v-icon
            :style="{ color: designStore.alertTheme }"
            style="position: absolute; font-size: 2rem; margin-left: -2rem; transform: scaleX(-1)"
            scale="2.25"
            name="gi-riposte"
          ></v-icon>
        </div>
        <div style="display: flex">
          <IconDisplay
            :icon="messageObj.fromIcon"
            :color="designStore.secondaryTheme"
            size="1.75rem"
            scale="1.75"
          ></IconDisplay>
          <div style="display: flex; flex-direction: column">
            <div style="font-size: small" :style="{ fontFamily: designStore.titleFont }">
              {{ props.messageObj.from }}
            </div>
            <div style="text-align: end">{{ props.messageObj.message }}</div>
          </div>
          <div
            style="width: 2rem; margin-top: -1.1rem"
            v-if="!isSender && props.messageObj.isStarred"
          >
            <v-icon
              :style="{ color: designStore.alertTheme }"
              style="position: absolute; font-size: 2rem; margin-left: 1rem"
              scale="2.25"
              name="gi-riposte"
            ></v-icon>
          </div>
        </div>
      </div>
      <div
        style="
          font-size: x-small;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          margin-top: -0.25rem;
        "
        :style="{ textAlign: textAlignment, color: designStore.inputText }"
      >
        {{ props.messageObj.timestamp }}
      </div>
    </div>
  </div>
</template>

<style></style>
