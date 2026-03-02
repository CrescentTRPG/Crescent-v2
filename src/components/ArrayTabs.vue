<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { Ref, ref, watch } from 'vue'

import TabItem from './TabItem.vue'
import { BAccordion, BAccordionItem } from 'bootstrap-vue-next'

export default {
  emits: ['selectedTabs'],
  props: ['tabs', 'filteringMessage'],
  setup(props: any) {
    const designStore = useDesignStore()
    const selectedTabs: Ref<Array<any>> = ref([])
    watch(props, (newVal, oldVal) => {
      if (selectedTabs.value.length > 0) {
        let newSelectedTabs: Array<any> = []
        selectedTabs.value.forEach((tab) => {
          if (newVal.tabs.includes(tab)) {
            newSelectedTabs.push(tab)
          }
        })
        selectedTabs.value = newSelectedTabs
      }
    })
    return {
      designStore,
      selectedTabs,
      props
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
  <div>
    <div style="height: 0" class="dissapearsInMobile">
      <div
        style="
          display: flex;
          padding-right: 2.5rem;
          justify-content: flex-end;
          width: 100%;
          z-index: 4;
          padding-left: 16rem;
          overflow: hidden;
        "
      >
        <div v-for="(tab, i) in selectedTabs" :key="tab.index">
          <div
            v-if="i < 4"
            class="dissapearsInMobile"
            style="
              padding: 0.25rem;
              margin: 0.25rem;
              margin-top: 0.75rem;
              font-size: small;
              z-index: 4;
              border-radius: 0.375rem;
              text-wrap: nowrap;
            "
            :style="{ background: designStore.alertTheme }"
          >
            {{ tab.name }}
          </div>
        </div>
        <div
          v-if="selectedTabs.length > 4"
          style="
            padding: 0.25rem;
            margin: 0.25rem;
            margin-top: 0.75rem;
            font-size: small;
            z-index: 4;
            border-radius: 0.375rem;
            text-wrap: nowrap;
          "
          :style="{ background: designStore.alertTheme }"
        >
          + {{ selectedTabs.length - 4 }} more
        </div>
      </div>
    </div>
    <BAccordion
      class="accordion"
      :style="{
        color: LightenDarkenColor(designStore.inputText, -10),
        background: designStore.inputBacking,
        backgroundColor: LightenDarkenColor(designStore.inputBacking, -10),
        borderColor: designStore.secondaryTheme
      }"
    >
      <BAccordionItem
        style="width: inherit"
        :title="'Filter By ' + props.filteringMessage"
        :style="{
          color: designStore.inputText,
          background: designStore.sidebarBacking,
          borderColor: designStore.secondaryTheme
        }"
      >
        <div class="arrayTabz">
          <div
            v-for="tab in tabs"
            :key="tab.index"
            :style="{
              flex: tab.header ? '1 1 100%' : '1 1 7.5rem',
              fontSize: tab.header ? 'large' : 'medium',
              marginLeft: tab.header ? '-.5rem' : '0rem',
              marginRight: tab.header ? '-.5rem' : '0rem'
            }"
          >
            <TabItem
              v-if="tab.index >= 0 && tab.name"
              :tabName="tab.name"
              @true="addTab(tab)"
              @false="removeTab(tab)"
              style="width: 100%"
            ></TabItem>

            <hr
              v-else
              style="margin-bottom: 0.5rem"
              :style="{ color: designStore.secondaryTheme }"
            />
          </div>
        </div>
      </BAccordionItem>
    </BAccordion>
  </div>
</template>
<style>
.arrayTabz {
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
.dissapearsInMobile {
  pointer-events: none;
  display: block;
}
.accordion-button {
  position: relative;
  display: flex;
  align-items: center;
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
@media (max-width: 700px) {
  .dissapearsInMobile {
    display: none;
  }
}
</style>
