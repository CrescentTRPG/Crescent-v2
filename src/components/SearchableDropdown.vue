<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { onKeyStroke } from '@vueuse/core'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import { computed, ComputedRef, ref } from 'vue'

export default {
  emits: ['select', 'index'],
  props: ['options', 'borders', 'searchS'],
  setup(props, context) {
    const designStore = useDesignStore()
    const search = ref(props.searchS || '')
    const filteredOptions: ComputedRef<Array<string>> = computed(() => {
      if (search.value === '') return props.options
      else {
        return props.options.filter((option: string) =>
          option.toLowerCase().includes(search.value.toLowerCase())
        )
      }
    })

    const value = ref('')
    const menuExpanded = ref(false)
    function select(option: string) {
      value.value = option
      search.value = option
      menuExpanded.value = false
      context.emit('select', value.value)
    }
    function closeMenu(type) {
      if (type === 'delete') {
        if (search.value.length === 0) menuExpanded.value = false
      } else if (type === 'enter') {
        select(search.value)
      } else {
        menuExpanded.value = false
      }
    }
    const dropDownSelect = ''
    return {
      search,
      designStore,
      value,
      dropDownSelect,
      props,
      menuExpanded,
      filteredOptions,
      select,
      closeMenu
    }
  },
  components: {
    BFormInput,
    BButton
  }
}
</script>
<template>
  <div style="display: block; position: relative; flex-direction: column; width: 100%">
    <div style="display: flex">
      <BFormInput
        @keydown.enter="closeMenu('enter')"
        @keydown.delete="closeMenu('delete')"
        @keydown.escape.prevent="closeMenu('escape')"
        v-if="borders === 'left'"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        v-model="search"
        @click="menuExpanded = true"
        style="
          position: relative;
          z-index: 2;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        "
      ></BFormInput>
      <BFormInput
        @keydown.enter="closeMenu('enter')"
        @keydown.delete="closeMenu('delete')"
        @keydown.escape.prevent="closeMenu('escape')"
        v-if="borders === 'none'"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        v-model="search"
        @click="menuExpanded = true"
        style="position: relative; z-index: 2; border-radius: 0"
      ></BFormInput>
      <BButton
        v-if="menuExpanded"
        @click="select(search)"
        style="border: 1px solid; border-radius: 0"
        :style="{ borderColor: designStore.secondaryTheme }"
        >Confirm</BButton
      >
    </div>
    <div
      class="menu"
      v-if="menuExpanded"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div
        v-for="option in filteredOptions"
        @click="select(option)"
        :key="option"
        class="menuOption"
        :style="{
          '--hover-bg': designStore.inputBacking,
          '--hover-text': designStore.alertTheme
        }"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>
<style>
.menu {
  width: 100%;
  position: absolute;
  z-index: 10;
  overflow-y: scroll;
  max-height: 12.75rem;
  padding: 0.5rem;
  border: 1px solid;
}
.menuOption {
  width: inherit;
  cursor: pointer;
}
.menuOption:hover {
  --hover-bg: blue;
  --hover-text: white cursor: pointer;
  background: var(--hover-bg);
  color: var(--hover-text);
}
</style>
