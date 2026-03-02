<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { BFormInput } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { computed, onBeforeUnmount, Ref, ref, watch } from 'vue'

export default {
  emit: ['selection'],
  props: [
    'options',
    'default',
    'background',
    'color',
    'borderless',
    'label',
    'borderColor',
    'header',
    'headerBackdrop',
    'headerColor',
    'disabled',
    'disabledMessage',
    'overrideDown',
    'writeIn',
    'overrideDisplay',
    'squared',
    'placeholder'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const selectedOption = ref(props.default === undefined ? '' : props.default)
    const showDropdown = ref(false)
    const dropDown: any = ref(null)
    const writeInVal: Ref<string> = ref('')
    function emitSelection(selection) {
      showDropdown.value = false
      selectedOption.value = typeof selection === 'string' ? selection : selection.value
      context.emit('selection', selectedOption.value)
    }

    function closeDropdown(element) {
      let height =
        document.getElementById('inner')?.getBoundingClientRect().height || window.innerHeight

      document.getElementById('inner')
      if (height - element.target.getBoundingClientRect().bottom < 300 && !props.overrideDown) {
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
      if (!props.disabled) {
        showDropdown.value = true

        window.addEventListener('click', closeDropdown)
      }
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
    const hoverShade = computed(() => {
      const r = parseInt(designStore.alertTheme.substring(1, 3), 16)
      const g = parseInt(designStore.alertTheme.substring(3, 5), 16)
      const b = parseInt(designStore.alertTheme.substring(5, 7), 16)
      return 'rgb(' + r + ',' + g + ',' + b + ',.3)'
    })

    function publishWriteIn() {
      emitSelection(writeInVal.value)
    }

    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    return {
      props,
      designStore,
      emitSelection,
      selectedOption,
      showDropdown,
      openDropdown,
      dropDown,
      scrollbarColor,
      hoverShade,
      lightenDarkenColor,
      writeInVal,
      publishWriteIn
    }
  },
  components: {
    BFormInput,
    BButton
  }
}
</script>
<template>
  <div>
    <div
      v-if="props.header"
      style="
        font-size: large;
        min-width: fit-content;
        width: 45%;
        text-align: center;
        padding: 0.25rem;
        border-top-left-radius: 0.35rem;
        border-top-right-radius: 0.35rem;
        border: 2px solid;
        border-bottom: 0;
      "
      :style="{
        background: props.headerBackdrop,
        color: props.headerColor,
        borderColor: designStore.secondaryTheme
      }"
    >
      {{ props.header }}
    </div>

    <div
      ref="dropDown"
      :style="{
        '--backdrop-color': props.background,
        '--hover-color': hoverShade
      }"
    >
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
          <div v-if="props.writeIn" style="display: flex">
            <BFormInput
              :placeholder="writeInVal || 'write your own...'"
              style="border-radius: 0"
              v-model="writeInVal"
            ></BFormInput
            ><BButton
              @click="publishWriteIn"
              :style="{ color: designStore.primaryText, background: designStore.primaryTheme }"
              style="border-radius: 0"
              ><i class="bi bi-check"></i
            ></BButton>
          </div>
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
      <div v-if="props.disabled">
        <div
          v-if="props.borderless"
          class="dropdown-borderless-option disabled-option"
          :class="props.squared ? 'squared' : 'rounded'"
          :style="{
            background: lightenDarkenColor(designStore.inputBacking, -10),
            color: props.color || designStore.inputText,
            borderColor: props.borderColor || designStore.secondaryTheme,
            'border-top-left-radius': props.header ? 0 : ''
          }"
        >
          <div style="width: 100%; text-align: inherit">
            {{ disabledMessage }}
          </div>
          <i class="bi bi-caret-down" v-if="!showDropdown"></i>
          <i class="bi bi-caret-up" v-if="showDropdown"></i>
        </div>
        <div
          v-else
          class="dropdown-selected-option disabled-option"
          :class="props.squared ? 'squared' : 'rounded'"
          :style="{
            background: props.background
              ? lightenDarkenColor(props.background, -10)
              : lightenDarkenColor(designStore.inputBacking, -10),
            color: props.color || designStore.inputText,
            borderColor: props.borderColor || designStore.secondaryTheme,
            'border-top-left-radius': props.header ? 0 : ''
          }"
        >
          <div style="width: 100%; text-align: inherit">
            {{ disabledMessage }}
          </div>
          <i class="bi bi-caret-down" v-if="!showDropdown"></i>
          <i class="bi bi-caret-up" v-if="showDropdown"></i>
        </div>
      </div>
      <div v-else>
        <div
          v-if="!props.borderless"
          @click="openDropdown()"
          class="dropdown-selected-option"
          :class="props.squared ? 'squared' : 'rounded'"
          :style="{
            background: props.background || designStore.inputBacking,
            color: props.color || designStore.inputText,
            borderColor: props.borderColor || designStore.secondaryTheme,
            'border-top-left-radius': props.header ? 0 : ''
          }"
        >
          <div style="width: 100%; text-align: inherit">
            {{
              props.overrideDisplay
                ? props.overrideDisplay
                : typeof selectedOption === 'string'
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
          :class="props.squared ? 'squared' : 'rounded'"
          :style="{
            background: props.background || designStore.inputBacking,
            color: props.color || designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <div style="width: 100%; text-align: inherit">
            <div
              v-if="props.placeholder && selectedOption === ''"
              style="
                text-align: end;
                font-size: small;
                padding-left: 0.25rem;
                padding-right: 0.25rem;
                position: relative;
                top: 0.75rem;
              "
            >
              {{ props.placeholder }}
            </div>
            {{
              props.overrideDisplay
                ? props.overrideDisplay
                : typeof selectedOption === 'string'
                  ? selectedOption.substring(0, 1).toUpperCase() + selectedOption.substring(1)
                  : selectedOption
            }}
            {{ props.label ? props.label : '' }}
          </div>
          <i class="bi bi-caret-down" v-if="!showDropdown"></i>
          <i class="bi bi-caret-up" v-if="showDropdown"></i>
        </div>
      </div>
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
  box-sizing: border-box;
  border: 2px solid;
  width: 100%;
  overflow: hidden;
  max-height: 2.35rem;
}
.disabled-option {
  cursor: not-allowed;
}
.dropdown-selected-option:hover {
  background-image: linear-gradient(var(--backdrop-color), var(--hover-color)) !important;
}
.rounded {
  border-radius: 0.375rem;
}
.squared {
  border-radius: 0;
}
.dropdown-borderless-option {
  padding: 0.25rem;
  padding-left: 0.5rem;
  text-align: inherit;
  display: flex;
  justify-content: space-between;
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
