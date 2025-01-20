<script lang="ts">
export default {
  props: [
    'modifierType',
    'modAmount',
    'linkedStatus',
    'unlockableCondition',
    'target',
    'isNotRemovable'
  ],
  setup(props, context) {
    function deleteStatusModifier() {
      context.emit('delete')
    }
    return {
      props,
      deleteStatusModifier
    }
  }
}
</script>
<template>
  <div style="display: flex; justify-content: space-between; margin-left: 1rem; flex-wrap: wrap">
    <div style="display: flex">
      <div class="xer">
        <i class="bi bi-x-lg" @click="deleteStatusModifier()"></i>
      </div>

      <div class="dot">❖</div>
      <div class="listItem">{{ modifierType }} ( {{ modAmount }} {{ props.target }} )</div>
      <div class="listItem" v-if="unlockableCondition">{{ unlockableCondition }}</div>
    </div>
    <div class="listItem">Source: {{ linkedStatus || 'None' }}</div>
  </div>
</template>
<style>
.listItem {
  padding: 0.5rem;
  margin-top: -0.25rem;
  margin-left: auto;
}
.dot {
  font-size: x-large;
  margin-left: 1rem;
}
.xer {
  font-size: x-large;
}
@media (max-width: 600px) {
  .listItem {
    font-size: small;
  }
  .dot {
    font-size: large;
    margin-left: 0.25rem;
  }
  .xer {
    font-size: large;
    margin-left: -1.5rem;
  }
}
</style>
