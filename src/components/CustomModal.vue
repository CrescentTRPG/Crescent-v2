<script lang="ts">
import { useDesignStore } from '../stores/designStore'

export default {
  emits: ['close'],
  props: ['showModal', 'title'],
  setup(props) {
    const designStore = useDesignStore()
    return { designStore, props }
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
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
      <div class="modal-bg" v-if="props.showModal" @click="close" id="outer">
        <div
          id="inner"
          class="modale"
          style="padding: 1rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            fontFamily: designStore.font
          }"
        >
          <div
            style="overflow-y: auto; max-height: 40rem"
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
                borderColor: designStore.secondaryTheme,
                color: designStore.secondaryTheme
              }"
            >
              <v-icon name="gi-abstract-119" style="position: relative; left: 0.25rem"></v-icon>
              <hr :style="{ borderColor: designStore.secondaryTheme }" />
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

::-webkit-scrollbar-button ::before ::after {
  display: none;
}
::-webkit-scrollbar {
  width: 0px; /* Adjust scrollbar width */
  height: 8px; /* Adjust scrollbar height */
}
</style>
