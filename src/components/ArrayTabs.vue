<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { Ref, ref } from 'vue'

import TabItem from './tabItem.vue'
import { BAccordion, BAccordionItem } from 'bootstrap-vue-next'

export default {
  emits: ['selectedTabs'],
  props: ['tabs'],
  setup(props: any) {
    const designStore = useDesignStore()
    const selectedTabs: Ref<Array<any>> = ref([])
    return {
      designStore,
      selectedTabs
    }
  },
  methods: {
    addTab(tab: { name: string; index: number }) {
      this.selectedTabs.push(tab)
      this.$emit('selectedTabs', this.selectedTabs)
    },
    removeTab(tab: { name: string; index: number }) {
      const index = this.selectedTabs.findIndex((foundTab) => foundTab.index === tab.index)
      this.selectedTabs = this.selectedTabs
        .slice(0, index)
        .concat(this.selectedTabs.slice(index + 1, this.selectedTabs.length))
      this.$emit('selectedTabs', this.selectedTabs)
    }
  },
  components: { TabItem, BAccordion, BAccordionItem }
}
</script>
<template>
  <BAccordion
    class="accordion"
    :style="{
      color: designStore.sidebarText,
      background: designStore.inputBacking,
      backgroundColor: designStore.sidebarBacking,
      borderColor: designStore.secondaryTheme
    }"
  >
    <BAccordionItem
      title="Filter By Spellgroups"
      :style="{
        color: designStore.inputText,
        background: designStore.sidebarBacking,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div class="arrayTabs">
        <TabItem
          v-for="tab in tabs"
          :key="tab.index"
          :tabName="tab.name"
          @true="addTab(tab)"
          @false="removeTab(tab)"
          style="flex: 1 1 7.5rem"
        ></TabItem>
      </div>
    </BAccordionItem>
  </BAccordion>
</template>
<style>
.arrayTabs {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.accordion {
  --bs-accordion-active-color: color !important;
  --bs-accordion-active-bg: background !important;
  --bs-accordion-btn-bg: background;
  --bs-accordion-btn-color: color !important;
  --bs-accordion-bg: background !important;
  --bs-accordion-color: color !important;
  --bs-body-background: background !important;
  border-bottom: 2px solid;
  border-top: 2px solid;
  border-radius: 0rem;
}
.accordion-button {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--bs-accordion-btn-padding-y) var(--bs-accordion-btn-padding-x);
  font-size: 1rem;
  text-align: left;
  background-color: inherit !important;
  border: 0;
  border-radius: 0;
  overflow-anchor: none;
  transition: var(--bs-accordion-transition);
}

.accordion-item {
  color: color;
  background-color: transparent;
  border: none;
}
</style>
