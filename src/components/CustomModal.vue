<script lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { onKeyStroke, useEventListener, useFocus } from '@vueuse/core'

import { useDesignStore } from '../stores/designStore'

export default {
  emits: ['close'],
  props: ['showModal', 'title', 'background', 'color', 'secondary', 'closeOnEnter'],
  setup(props, context) {
    const designStore = useDesignStore()
    const element = ref<HTMLElement | null>(null)

    onKeyStroke('Escape', () => {
      if (props.showModal) {
        context.emit('close')
      }
    })

    onKeyStroke('Enter', () => {
      if (props.closeOnEnter && props.showModal) context.emit('close')
    })
    const hoverShade = computed(() => {
      const r = parseInt(designStore.alertTheme.substring(1, 3), 16)
      const g = parseInt(designStore.alertTheme.substring(3, 5), 16)
      const b = parseInt(designStore.alertTheme.substring(5, 7), 16)
      return 'rgb(' + r + ',' + g + ',' + b + ',.3)'
    })

    return { designStore, props, element, hoverShade }
  },
  computed: {
    scrollbarColor() {
      let sec = this.props.secondary || this.designStore.secondaryTheme
      let prim = this.props.background || this.designStore.primaryTheme
      return sec + ' ' + prim
    }
  },
  methods: {
    close(event: any) {
      if (event.target.id == 'outer') {
        this.$emit('close')
      }
    }
  }
}
</script>

<template>
  <Teleport to="#modal">
    <Transition name="modal">
      <div
        class="modal-bg"
        v-if="props.showModal"
        @click="close"
        id="outer"
        :style="{
          '--hover-color': hoverShade,
          '--hover-blend': designStore.primaryTheme
        }"
      >
        <div
          id="inner"
          class="modale"
          style="padding: 1rem"
          :style="{
            background: props.background || designStore.primaryTheme,
            color: props.color || designStore.primaryText,
            fontFamily: designStore.font
          }"
        >
          <div
            style="overflow-y: auto; max-height: 40rem; overscroll-behavior: contain"
            :style="{ scrollbarColor: scrollbarColor }"
          >
            <span
              style="
                display: flex;
                justify-content: space-between;
                margin-left: 2rem;
                margin-right: 2rem;
                font-size: large;
                position: relative;
                top: 0.25rem;
              "
              :style="{ fontFamily: designStore.titleFont }"
              ><span>{{ props.title }}</span> <i @click="$emit('close')" class="bi bi-x-lg"></i
            ></span>
            <span
              style="display: flex"
              :style="{
                borderColor: props.secondary || designStore.secondaryTheme,
                color: props.secondary || designStore.secondaryTheme
              }"
            >
              <v-icon name="gi-abstract-119" style="position: relative; left: 0.25rem"></v-icon>
              <hr :style="{ borderColor: props.secondary || designStore.secondaryTheme }" />
              <v-icon name="gi-abstract-119" style="position: relative; right: 0.25rem"></v-icon>
            </span>
            <section class="modal-body">
              <slot name="body"> This is the default body! </slot>
            </section>

            <footer class="modal-footer">
              <slot name="footer"> </slot>
            </footer>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style>
.modal-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;

  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 10rem;
  overflow: hidden;
}

hr {
  display: block;
  height: 1px;
  border: 0;
  border: 1px solid;
  margin: 1em 0;
  padding: 0;
  width: 100%;

  opacity: 1;
  position: relative;
  bottom: 0.5rem;
}

.modale {
  position: relative;
  bottom: 4rem;
  padding: 1rem;
  border-radius: 1rem;
  width: 80%;
  max-width: 60rem;
  min-height: 10rem;
  height: fit-content;
  max-height: calc(100vh - 5%);
}

.modal-body {
  position: relative;
  margin-left: 2rem;
  margin-right: 2rem;
}
.modal-footer {
  flex-direction: row;
  justify-content: flex-end;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 1rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.bi-x-lg:hover {
  opacity: 0.5;
}

.bi-plus-lg:hover {
  opacity: 0.5;
}

::-webkit-scrollbar-button ::before ::after {
  display: none;
}
::-webkit-scrollbar {
  width: 0px; /* Adjust scrollbar width */
  height: 8px; /* Adjust scrollbar height */
}
@media (max-width: 600px) {
  .modale {
    position: relative;
    bottom: 4rem;
    padding: 1rem;
    border-radius: 1rem;
    width: 95%;
    max-width: 60rem;
    min-height: 10rem;
    height: fit-content;
    max-height: calc(100vh - 5%);
  }
}
@media (hover: hover) {
  button:hover {
    background-image: linear-gradient(var(--hover-blend), var(--hover-color)) !important;
  }
}
</style>
