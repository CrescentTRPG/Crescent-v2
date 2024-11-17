<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore'
import { BDropdown, BDropdownItem } from 'bootstrap-vue-next'
export default {
  props: ['selectedValue'],
  setup(props, context) {
    const designStore = useDesignStore()
    const send = (num) => {
      console.log(num)
      context.emit('selected', num)
    }
    return { designStore, send }
  }
}
</script>
<template>
  <div>
    <select
      class="indivs"
      style="border-radius: 0.375rem; padding: 0.5rem; min-width: 4rem"
      :style="{
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText
      }"
      :value="selectedValue"
    >
      <option @click="send(0)">0</option>
      <option @click="send(1)">1</option>
      <option @click="send(2)">2</option>
      <option @click="send(3)">3</option>
      <option @click="send(4)">4</option>
      <option @click="send(5)">5</option>
      <option @click="send(6)">6</option>
      <option @click="send(7)">7</option>
      <option @click="send(8)">8</option>
      <option @click="send(9)">9</option>
      <option @click="send(10)">10</option>
    </select>
  </div>
</template>
<style scoped>
.indivs {
  width: 4rem;
  font-size: large;
  border: 2px solid;
  border-radius: 0.375rem;
}
</style>
