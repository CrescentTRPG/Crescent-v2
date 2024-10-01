<script lang="ts">
import { BButton } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore'

export default {
  emits: ['currentPage'],
  props: ['perPage', 'totalRows', 'max'],
  setup(props) {
    const currentPage = ref(1)
    const designStore = useDesignStore()
    const tab = ref('corestats')
    return { designStore, tab, props, currentPage }
  },
  computed: {
    numTabs() {
      return Math.ceil(this.props.totalRows / this.props.perPage)
    },
    currentTabs() {
      // [ max 5 + ...] or list as given
      let ret: Array<number> = []
      for (
        let i = Math.max(this.currentPage - 2, 1);
        i <= Math.min(Math.max(this.currentPage + 1, 4), this.numTabs);
        i++
      ) {
        ret.push(i)
      }
      return ret
    }
  },
  methods: {
    itemStyle(item: number) {
      if (item === this.currentPage) {
        return this.designStore.getAlertTheme
      }
      return this.designStore.getInputText
    },
    decreaseTab() {
      this.switchTab(Math.max(1, this.currentPage - 1))
    },
    increaseTab() {
      this.switchTab(Math.min(this.numTabs, this.currentPage + 1))
    },
    fastForward() {
      this.switchTab(this.numTabs)
    },
    fastBackward() {
      this.switchTab(1)
    },
    switchTab(tab: number) {
      this.currentPage = tab
      this.$emit('currentPage', this.currentPage)
    }
  },
  components: {
    BButton
  }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: row; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      class="navClass"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.inputBacking,
        color: designStore.inputText
      }"
    >
      <BButton
        @click="fastBackward()"
        class="navItem"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        ><i class="bi bi-skip-backward"></i
      ></BButton>
      <BButton
        @click="decreaseTab()"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        class="navItem"
        ><i class="bi bi-caret-left"></i
      ></BButton>
      <BButton
        v-if="currentTabs[0] > 1"
        disabled
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        class="navItem"
        ><i class="bi bi-three-dots"></i
      ></BButton>
      <div v-for="i in currentTabs" :key="i">
        <BButton
          :style="{ background: designStore.inputBacking, color: itemStyle(i) }"
          @click="switchTab(i)"
          class="navItem"
          style="padding-left: 1rem; padding-right: 1rem"
          >{{ i }}</BButton
        >
      </div>
      <BButton
        v-if="currentTabs[3] < numTabs"
        disabled
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        class="navItem"
        ><i class="bi bi-three-dots"></i
      ></BButton>
      <BButton
        @click="increaseTab()"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        class="navItem"
        ><i class="bi bi-caret-right"></i
      ></BButton>

      <BButton
        @click="fastForward()"
        :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        class="navItem"
        ><i class="bi bi-skip-forward"></i
      ></BButton>
    </div>
  </div>
</template>

<style scoped>
.navClass {
  width: 100%;
  border-top: 2px solid;
  border-bottom: 2px solid;
  display: flex;
  justify-content: space-between;
}
li {
  list-style-type: none;
  text-align: center;
}
.navItem {
  padding: 0rem;
  min-width: 2rem;
  border: none;
}
</style>
