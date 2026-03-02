<script lang="ts">
import { useDesignStore } from '../../../../stores/designStore.ts'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const checked = false
    return { designStore, checked }
  },
  components: {},
  methods: {
    click() {
      this.checked = !this.checked
      this.$emit(this.checked + '')
    }
  }
}
</script>

<template>
  <div>
    <input
      @click="click()"
      type="checkbox"
      class="switch_2"
      :style="{
        '--line': designStore.sidebarText,
        '--alert': designStore.alertTheme,
        '--text': designStore.sidebarText
      }"
      :checked="checked"
    />
  </div>
</template>

<style scoped>
/* Switch 2 Specific Style Start */

input[type='checkbox'].switch_2 {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 1rem;
  height: 0.25rem;
  border-radius: 0.25rem;
  position: relative;
  outline: 0;
  cursor: pointer;
}

input[type='checkbox'].switch_2:before,
input[type='checkbox'].switch_2:after {
  position: absolute;
  content: '';
  -webkit-transition: all 0.25s;
  transition: all 0.25s;
}

input[type='checkbox'].switch_2:before {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--alert);
  border: 3px solid var(--text);
  border-radius: 50%;
  top: -1rem;
}

input[type='checkbox'].switch_2:after {
  width: 1.5rem;
  height: 1.5rem;
  background: var(--text);
  border-radius: 50%;
  top: -1rem;
  -webkit-transform: scale(1);
  transform: scale(1);
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

input[type='checkbox'].switch_2:checked:before {
}

input[type='checkbox'].switch_2:checked:after {
  -webkit-transform: scale(0);
  transform: scale(0);
}
</style>
