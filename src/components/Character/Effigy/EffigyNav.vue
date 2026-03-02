<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore.ts'
import { BNavItem, BNavbar } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDesignStore } from '../../../stores/designStore.ts'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const navPos = ref('build')
    const characterStore = useCharacterStore()
    return { designStore, navPos, characterStore }
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
  <div>
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
        >Core Stats</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('build'), background: designStore.inputBacking }"
        @click="switchTab('build')"
        class="navI"
      >
        <i class="bi bi-tools"></i>
        <div v-if="navPos === 'build'">Core Stats</div>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('abilities'), background: designStore.inputBacking }"
        @click="switchTab('abilities')"
        class="textI"
        >Abilities</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('abilities'), background: designStore.inputBacking }"
        @click="switchTab('abilities')"
        class="navI"
      >
        <i class="bi bi-view-list"></i>
        <div v-if="navPos === 'overview'">Abilities</div>
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
    </BNavbar>
  </div>
</template>

<style scoped>
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  margin-top: 1rem;
  border: 2px solid;
}
@media (max-width: 500px) {
  .navClass {
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
