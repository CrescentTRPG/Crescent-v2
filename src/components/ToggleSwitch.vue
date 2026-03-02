<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'
export default {
  props: ['value'],
  setup(props, context) {
    const error = ref(null)
    const designStore = useDesignStore()
    const checked = props.value || false
    return { designStore, checked }
  },
  methods: {
    click() {
      this.checked = !this.checked
      this.$emit(this.checked + '')
    }
  },
  components: {}
}
</script>

<template>
  <div class="switch_box">
    <input
      @click="click()"
      type="checkbox"
      class="switch_2"
      :style="{
        '--line': designStore.inputText,
        '--alert': designStore.alertTheme,
        '--text': designStore.inputText
      }"
      :checked="checked"
    />
  </div>
</template>

<style scoped>
.wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  width: 4rem;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-transform: translateY(-50%);
  transform: translateY(-50%);
}

.switch_box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  max-width: 4rem;
  min-width: 4rem;
  height: 1rem;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

/* Switch 2 Specific Style Start */

input[type='checkbox'].switch_2 {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 3rem;
  height: 0.25rem;
  background: var(--line);
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
  width: 1rem;
  height: 1rem;
  background: var(--alert);
  border: 1px solid var(--text);
  border-radius: 50%;
  top: -0.3rem;
  -webkit-transform: translateX(0%);
  transform: translateX(0%);
}

input[type='checkbox'].switch_2:after {
  width: 1rem;
  height: 1rem;
  background: var(--text);
  border-radius: 50%;
  top: -0.3rem;
  -webkit-transform: scale(1) translateX(0%);
  transform: scale(1) translateX(0%);
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;
}

input[type='checkbox'].switch_2:checked:before {
  left: calc(100% - 1rem);
}

input[type='checkbox'].switch_2:checked:after {
  left: 2rem;
  -webkit-transform: scale(0);
  transform: scale(0);
}

/* Switch 2 Specific Style End */
</style>
