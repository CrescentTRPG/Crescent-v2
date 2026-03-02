<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { ref } from 'vue'
import CustomModal from './CustomModal.vue'

export default {
  props: ['text', 'background', 'color', 'icon', 'width', 'hasExplanation', 'info', 'justifyText'],
  setup(props, context) {
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const modal = ref(false)
    const size = ref(window.innerWidth > 600 ? 3.5 : 1.25)
    window.addEventListener('resize', function () {
      if (window.innerWidth < 600) {
        size.value = 1.5
      } else {
        size.value = 3
      }
    })
    return {
      userStore,
      designStore,
      props,
      size,
      modal
    }
  },
  components: { CustomModal },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  }
}
</script>
<template>
  <div>
    <div class="fancyDecor" :style="{ background: props.background, color: props.color }">
      <div
        class="labelStyling"
        :style="{
          width: props.width,
          minWidth: props.width,
          justifyContent: props.justifyText || 'center'
        }"
      >
        <div style="align-self: center">{{ props.text }}</div>
        <v-icon
          v-if="icon.substring(0, 2) === 'gi'"
          :scale="size"
          :name="props.icon"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
        <i
          v-if="icon.substring(0, 2) === 'bi'"
          style="padding-left: 0.5rem"
          :style="{ fontSize: size + 'rem', color: designStore.secondaryTheme }"
          :class="icon"
        ></i>
        <i
          v-if="hasExplanation"
          class="bi bi-patch-question hoverableTransparantRadial"
          :style="{ color: designStore.alertTheme }"
          style="font-size: x-large; align-self: center; cursor: pointer"
          @click="modal = true"
        ></i>
      </div>
      <section style="flex-grow: 1; align-self: center; min-width: 8rem">
        <slot name="body"> </slot>
      </section>
    </div>
    <CustomModal :showModal="modal" :title="text" @close="modal = false">
      <template v-slot:body>
        <div>
          {{ info }}
        </div>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped>
.fancyDecor {
  font-size: large;
  display: flex;
  padding: 0.5rem;
}
.labelStyling {
  display: flex;
  align-self: center;
  justify-content: center;
}
@media (max-width: 1200px) {
  .fancyDecor {
    font-size: medium;
    display: flex;
    padding: 0.5rem;
  }
  @media (max-width: 500px) {
    .fancyDecor {
      font-size: medium;
      display: flex;
      padding: 0.5rem;
      flex-wrap: wrap;
    }
    .labelStyling {
      justify-content: start;
    }
  }
}
</style>
