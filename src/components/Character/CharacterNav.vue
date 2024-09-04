<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../stores/designStore'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const navPos = ref('build')

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
    BButton,
    BNavbar,
    BNavItem,
    BCard
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
        :style="{ color: navItemStyle('build'), background: designStore.inputBacking }"
        @click="switchTab('build')"
        class="textI"
        >Build</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('build'), background: designStore.inputBacking }"
        @click="switchTab('build')"
        class="navI"
      >
        <i class="bi bi-tools"></i>
        <div v-if="navPos === 'build'">Build</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('overview'), background: designStore.inputBacking }"
        @click="switchTab('overview')"
        class="textI"
        >Overview</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('overview'), background: designStore.inputBacking }"
        @click="switchTab('overview')"
        class="navI"
      >
        <i class="bi bi-view-list"></i>
        <div v-if="navPos === 'overview'">Overview</div>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('details'), background: designStore.inputBacking }"
        @click="switchTab('details')"
        class="textI"
        >Details</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('details'), background: designStore.inputBacking }"
        @click="switchTab('details')"
        class="navI"
        ><i class="bi bi-person-vcard"></i>
        <div v-if="navPos === 'details'">Details</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('equipment'), background: designStore.inputBacking }"
        @click="switchTab('equipment')"
        class="textI"
        >Equipment</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('equipment'), background: designStore.inputBacking }"
        @click="switchTab('equipment')"
        class="navI"
        ><i class="bi bi-backpack4"></i>
        <div v-if="navPos === 'equipment'">Equipment</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('journal'), background: designStore.inputBacking }"
        @click="switchTab('journal')"
      >
        <i class="bi bi-journal"></i>
        <div class="manText" v-if="navPos === 'journal'">Journal</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('manual'), background: designStore.inputBacking }"
        @click="switchTab('manual')"
      >
        <i class="bi bi-book"></i>
        <div class="manText" v-if="navPos === 'manual'">Manual</div>
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
