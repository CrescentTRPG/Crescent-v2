<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import getElement from 'bootstrap-vue-next/src/utils/getElement.js'
import { computed, onBeforeUnmount, onMounted, Ref, ref, watch } from 'vue'

export default {
  emit: ['selection'],
  props: ['options', 'default', 'background', 'color', 'borderless', 'label', 'borderColor'],
  setup(props, context) {
    const designStore = useDesignStore()
    const selectedOption = ref(props.default === undefined ? '' : props.default)
    const showDropdown = ref(false)
    const dropDown: any = ref(null)
    function emitSelection(selection) {
      showDropdown.value = false
      selectedOption.value = typeof selection === 'string' ? selection : selection.value
      context.emit('selection', selectedOption.value)
    }

    function closeDropdown(element) {
      let height =
        document.getElementById('inner')?.getBoundingClientRect().height || window.innerHeight

      document.getElementById('inner')
      if (height - element.target.getBoundingClientRect().bottom < 300) {
        document.getElementById('custom-menu')?.classList.add('wrap-up')
      } else {
        document.getElementById('custom-menu')?.classList.remove('wrap-up')
      }
      if (
        !(
          dropDown.value?.contains(element.target) ||
          element.target.className === 'bi bi-caret-down'
        )
      ) {
        showDropdown.value = false
        window.removeEventListener('click', closeDropdown)
      }
    }
    function openDropdown() {
      showDropdown.value = true

      window.addEventListener('click', closeDropdown)
    }
    watch(props, async (props, old) => {
      if (props.default != selectedOption.value) {
        selectedOption.value = props.default
      }
    })
    onBeforeUnmount(() => {
      window.removeEventListener('click', closeDropdown)
    })
    const scrollbarColor = computed(() => {
      return designStore.secondaryTheme + ' ' + designStore.primaryTheme
    })
    return {
      props,
      designStore,
      emitSelection,
      selectedOption,
      showDropdown,
      openDropdown,
      dropDown,
      scrollbarColor
    }
  }
}
</script>
<template>
  <div ref="dropDown">
    <div
      v-if="showDropdown"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
      class="dropdown-wrapper"
    >
      <div
        id="custom-menu"
        class="options-wrapper"
        :style="{ scrollbarColor: scrollbarColor, borderColor: designStore.secondaryTheme }"
      >
        <div v-for="item in props.options" :key="item">
          <div
            v-if="!item.segment"
            @click="emitSelection(item)"
            class="option"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              '--hover-color': designStore.alertTheme
            }"
          >
            {{ typeof item === 'string' ? item : item.text }}
          </div>
          <div
            v-else
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText
            }"
            style="cursor: default; padding-left: 0.5rem; font-style: oblique"
          >
            {{ typeof item === 'string' ? item : item.text }}
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="!props.borderless"
      @click="openDropdown()"
      class="dropdown-selected-option"
      :style="{
        background: props.background || designStore.inputBacking,
        color: props.color || designStore.inputText,
        borderColor: props.borderColor || designStore.secondaryTheme
      }"
    >
      <div style="width: 100%; text-align: inherit">
        {{
          typeof selectedOption === 'string'
            ? selectedOption.substring(0, 1).toUpperCase() + selectedOption.substring(1)
            : selectedOption
        }}
      </div>
      <i class="bi bi-caret-down" v-if="!showDropdown"></i>
      <i class="bi bi-caret-up" v-if="showDropdown"></i>
    </div>
    <div
      v-if="props.borderless"
      @click="openDropdown()"
      class="dropdown-borderless-option"
      :style="{
        background: props.background || designStore.inputBacking,
        color: props.color || designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="width: 100%; text-align: inherit">
        {{
          typeof selectedOption === 'string'
            ? selectedOption.substring(0, 1).toUpperCase() + selectedOption.substring(1)
            : selectedOption
        }}
        {{ props.label ? props.label : '' }}
      </div>
      <i class="bi bi-caret-down" v-if="!showDropdown"></i>
      <i class="bi bi-caret-up" v-if="showDropdown"></i>
    </div>
  </div>
</template>
<style scoped>
.dropdown-wrapper {
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
  width: 100%;
  position: relative;
  padding: 0rem;
  cursor: pointer;
  margin: 0 auto;
  max-height: inherit;
}
.options-wrapper {
  width: 100%;
  position: absolute;
  width: inherit;
  border: 2px solid;
  border-radius: 0;
  border-bottom-right-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
  overflow-y: auto;
  max-height: 20rem;
  transform: translateY(2.25rem) translateX(-0.25rem);
  z-index: 8;
}

.wrap-up {
  border: 2px solid;
  border-radius: 0;
  overflow-y: scroll;
  max-height: inherit;
  border-top-right-radius: 0.375rem;
  border-top-left-radius: 0.375rem;
  border-bottom: 0;
  transform: translateY(-100%);
}

.dropdown-selected-option {
  border-top-right-radius: inherit;
  border-top-left-radius: inherit;
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
  padding: 0.25rem;
  padding-left: 0.5rem;
  text-align: inherit;
  display: flex;
  justify-content: space-between;
  border-radius: 0.375rem;
  box-sizing: border-box;
  border: 2px solid;
  width: 100%;
}
.dropdown-borderless-option {
  padding: 0.25rem;
  padding-left: 0.5rem;
  text-align: inherit;
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  box-sizing: border-box;
  width: 100%;
}
.option:hover {
  --hover-color: blue;
  color: var(--hover-color) !important;
}
.option {
  padding: 0.25rem;
  text-align: center;
  padding-right: 1.25rem;
  position: relative;
}
</style>
