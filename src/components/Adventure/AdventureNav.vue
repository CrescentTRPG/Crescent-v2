<script lang="ts">
import { BNavItem, BNavbar } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDesignStore } from '../../stores/designStore.ts'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const navPos = ref('party')

    return { designStore, navPos }
  },
  computed: {
    width() {
      return window.innerWidth
    }
  },
  methods: {
    switchTab(tab: string) {
      this.navPos = tab
      this.$emit(tab)
    },

    navItemStyle(item: string) {
      if (item === this.navPos) {
        return this.designStore.getAlertTheme
      }
      return this.designStore.getInputText
    },
    navItemStyleBg(item: string) {
      if (item === this.navPos) {
        return this.designStore.pageBackdrop
      }
      return this.designStore.inputBacking
    }
  },
  components: {
    BNavbar,
    BNavItem
  }
}
</script>

<template>
  <div style="width: 100%">
    <BNavbar
      class="navClass"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.inputBacking,
        fontFamily: designStore.font
      }"
    >
      <BNavItem
        :style="{
          color: navItemStyle('party'),
          background: designStore.inputBacking
        }"
        @click="switchTab('party')"
        class="textI"
        >Party</BNavItem
      >
      <BNavItem
        :style="{
          color: navItemStyle('party'),
          background: designStore.inputBacking
        }"
        @click="switchTab('party')"
        class="navI"
      >
        <i class="bi bi-people"></i>
        <div v-if="navPos === 'party'">Party</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('combat'), background: designStore.inputBacking }"
        @click="switchTab('combat')"
        class="textI"
        >Combat</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('combat'), background: designStore.inputBacking }"
        @click="switchTab('combat')"
        class="navI"
      >
        <i class="bi bi-view-list"></i>
        <div v-if="navPos === 'combat'">Combat</div>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('statblocks'), background: designStore.inputBacking }"
        @click="switchTab('statblocks')"
        class="textI"
        >Stat Blocks</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('statblocks'), background: designStore.inputBacking }"
        @click="switchTab('statblocks')"
        class="navI"
        ><i class="bi bi-person-vcard"></i>
        <div v-if="navPos === 'statblocks'">Stat Blocks</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('items'), background: designStore.inputBacking }"
        @click="switchTab('items')"
        class="textI"
        >Items</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('items'), background: designStore.inputBacking }"
        @click="switchTab('items')"
        class="navI"
        ><i class="bi bi-backpack4"></i>
        <div v-if="navPos === 'items'">Items</div>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('notes'), background: designStore.inputBacking }"
        @click="switchTab('notes')"
      >
        <i class="bi bi-journal"></i>
        <div class="manText" v-if="navPos === 'notes'">notes</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('manual'), background: designStore.inputBacking }"
        @click="switchTab('manual')"
      >
        <i class="bi bi-book"></i>
        <div class="manText" v-if="navPos === 'Manual'">Manual</div>
      </BNavItem></BNavbar
    >
  </div>
</template>

<style scoped>
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  width: 100%;
  margin-top: 1rem;
  border: 2px solid;
}
@media (max-width: 500px) {
  .navClass {
    width: 100%;
    margin-top: 1rem;
    border: 2px solid;
  }
  .navI {
    padding-bottom: 0.5rem;
  }
  .textI {
    display: none;
  }
}
@media (min-width: 501px) {
  .navI {
    display: none;
  }
  .manText {
    display: none;
  }
}
.manText {
  padding-bottom: 0.5rem;
}
</style>
