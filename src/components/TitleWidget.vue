<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import CustomModal from './CustomModal.vue'
import { ref } from 'vue'
import RuleError from './Character/Build/Rulings/RuleError.vue'
import RuleSuggestion from './Character/Build/Rulings/RuleSuggestion.vue'

export default {
  props: [
    'title',
    'infoMessage',
    'spent',
    'total',
    'units',
    'status',
    'statusMessages',
    'statusTitle',
    'noFlair',
    'suggestionKey'
  ],
  setup(props) {
    const modal = ref(false)
    const statusModal = ref(false)
    const designStore = useDesignStore()
    return { designStore, props, modal, statusModal }
  },
  components: {
    CustomModal,
    RuleError,
    RuleSuggestion
  }
}
</script>
<template>
  <div
    style="
      font-size: x-large;
      margin-top: 1rem;
      padding: 0.5rem;
      display: flex;
      flex-direction: column;
    "
    :style="{
      fontFamily: designStore.titleFont,
      color: designStore.primaryText,
      background: designStore.primaryTheme
    }"
  >
    <div style="display: flex; flex-direction: row; justify-content: space-between">
      <div style="margin-left: 2rem">{{ props.title }}</div>
      <div style="display: flex">
        <div v-if="units" style="margin-right: 1rem; font-size: large">
          {{ spent }} / {{ total }} {{ units }}
        </div>
        <div v-if="infoMessage">
          <i
            class="bi bi-patch-question"
            style="margin-right: 2rem; cursor: pointer"
            :style="{ color: designStore.alertTheme }"
            @click="modal = true"
          ></i>
        </div>
        <div v-if="status">
          <div style="margin-right: 1rem; font-size: medium; display: flex">
            <div
              v-if="status === 'bi bi-patch-question'"
              style="text-align: center; align-self: center; margin-right: 0.5rem"
            >
              Build Suggestion:
            </div>
            <div
              v-if="status === 'bi bi-patch-exclamation'"
              style="text-align: center; align-self: center; margin-right: 0.5rem"
            >
              Build Error:
            </div>
            <i
              :class="status"
              style="margin-right: 2rem; cursor: pointer; font-size: x-large"
              :style="{ color: designStore.alertTheme }"
              @click="statusModal = true"
            ></i>
          </div>
        </div>
      </div>
    </div>
    <span
      v-if="!props.noFlair"
      style="display: flex; margin-bottom: -1rem; margin-top: -1rem"
      :style="{ borderColor: designStore.secondaryTheme, color: designStore.secondaryTheme }"
    >
      <v-icon
        name="gi-abstract-119"
        style="position: relative; left: 0.25rem; top: 0.5rem"
      ></v-icon>
      <hr :style="{ borderColor: designStore.secondaryTheme }" />
      <v-icon
        name="gi-abstract-119"
        style="position: relative; right: 0.25rem; top: 0.5rem"
      ></v-icon>
    </span>
    <CustomModal :showModal="modal" :title="title" @close="modal = false">
      <template v-slot:body>
        <div>{{ infoMessage }}</div>
      </template>
    </CustomModal>
    <CustomModal :showModal="statusModal" :title="statusTitle" @close="statusModal = false">
      <template v-slot:body>
        <div v-for="message in props.statusMessages" :key="message">
          <RuleSuggestion
            v-if="message.includes(props.suggestionKey)"
            :message="message"
          ></RuleSuggestion>
          <RuleError v-else :message="message"></RuleError>
        </div>
      </template>
    </CustomModal>
  </div>
</template>
<style></style>
