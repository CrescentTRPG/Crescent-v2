<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { computed, ref } from 'vue'

import { BAccordion, BAccordionItem } from 'bootstrap-vue-next'
import TabItem from '@/components/TabItem.vue'

export default {
  emits: ['selectedTab'],
  props: ['tabs', 'filteringMessage', 'default', 'currentVersion'],
  setup(props: any) {
    const designStore = useDesignStore()
    const selectedTab = ref('')
    const title = computed(() => {
      return props.currentVersion ? 'Current Version: ' + props.currentVersion : 'Version Control'
    })
    selectedTab.value = props.default?.defaultVersion
    return {
      designStore,
      props,
      title
    }
  },
  methods: {
    selectTab(tab: string) {
      this.$emit('selectedTab', tab)
    },

    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  },
  components: { TabItem, BAccordion, BAccordionItem }
}
</script>
<template>
  <BAccordion
    class="accordion"
    style="width: 100%"
    :style="{
      color: LightenDarkenColor(designStore.inputText, -10),
      background: designStore.inputBacking,
      backgroundColor: LightenDarkenColor(designStore.inputBacking, -10),
      borderColor: designStore.secondaryTheme
    }"
  >
    <BAccordionItem
      :title="title"
      :style="{
        color: designStore.inputText,
        background: designStore.sidebarBacking,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div class="arrayTabs">
        <TabItem
          v-for="tab in tabs"
          :key="tab"
          :tabName="tab"
          :chosen="props.currentVersion === tab"
          :useSingleSelect="true"
          @true="selectTab(tab)"
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
