<script lang="ts">
export default {
  props: ['modifierType', 'modAmount', 'damageType', 'deleteable'],
  setup(props, context) {
    const isDeleteable = props.deleteable != undefined ? props.deleteable : true
    function deletePassive() {
      context.emit('delete')
    }
    return {
      props,
      deletePassive,
      isDeleteable
    }
  }
}
</script>
<template>
  <div style="display: flex; justify-content: space-between; margin-left: 1rem; flex-wrap: wrap">
    <div style="display: flex">
      <i
        v-if="isDeleteable"
        class="bi bi-x-lg"
        style="font-size: x-large"
        @click="deletePassive()"
      ></i>

      <div style="font-size: x-large; margin-left: 1rem">❖</div>

      <div
        class="listItem"
        v-if="
          modifierType != 'Resistance' &&
          modifierType != 'Susceptibility' &&
          modifierType != 'Immunity' &&
          modifierType != 'Vulnerability'
        "
      >
        {{ modifierType }} ( {{ modAmount }} )
      </div>

      <div class="listItem" v-if="damageType">{{ damageType }}</div>
      <div
        class="listItem"
        style="padding-left: 0"
        v-if="
          modifierType === 'Resistance' ||
          modifierType === 'Susceptibility' ||
          modifierType === 'Immunity' ||
          modifierType === 'Vulnerability'
        "
      >
        {{ modifierType }}
      </div>
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
