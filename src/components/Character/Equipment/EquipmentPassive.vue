<script lang="ts">
export default {
  props: ['modifierType', 'modAmount', 'unlockableCondition', 'target', 'isNotRemovable'],
  setup(props, context) {
    function removePassive() {
      context.emit('delete')
    }
    return {
      props,
      removePassive
    }
  }
}
</script>
<template>
  <div style="display: flex; justify-content: space-between; margin-left: 1rem; flex-wrap: wrap">
    <div style="display: flex">
      <i class="bi bi-x-lg" style="font-size: x-large" @click="removePassive()"></i>

      <div style="font-size: x-large; margin-left: 1rem">❖</div>
      <div class="listItem">{{ modifierType }} ( {{ modAmount }} {{ props.target }} )</div>
      <div class="listItem" v-if="unlockableCondition">{{ unlockableCondition }}</div>
    </div>
  </div>
</template>
<style>
.listItem {
  padding: 0.5rem;
  margin-top: -0.25rem;
  margin-left: auto;
}
</style>
