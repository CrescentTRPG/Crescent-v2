<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

export default {
  props: ['switchTab', 'navPos', 'openCombatant', 'combatants'],
  setup(props, context) {
    const designStore = useDesignStore()

    return { designStore, props }
  },
  computed: {
    width() {
      return window.innerWidth
    }
  },
  methods: {
    navItemStyle(item: string) {
      if (item === this.props.navPos) {
        return this.designStore.getAlertTheme
      }
      return this.designStore.getInputText
    },
    navItemStyleBg(item: string) {
      if (item === this.props.navPos) {
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
      style="border-right: 1px solid"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.inputBacking,
        fontFamily: designStore.font
      }"
    >
      <BNavItem
        :style="{ color: navItemStyle('notes'), background: designStore.inputBacking }"
        @click="props.switchTab('notes')"
        class="textI"
        >Notes</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('notes'), background: designStore.inputBacking }"
        @click="props.switchTab('notes')"
        class="navI"
      >
        <i class="bi bi-stickies"></i>
        <div v-if="props.navPos === 'notes'">Notes</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('list'), background: designStore.inputBacking }"
        @click="props.switchTab('list')"
        class="textI optionalItem"
        >Combatant List</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('list'), background: designStore.inputBacking }"
        @click="props.switchTab('list')"
        class="navI optionalItem"
      >
        <i class="bi bi-card-list"></i>
        <div v-if="props.navPos === 'list'">Combatant List</div>
      </BNavItem>
      <BNavItem
        v-if="props.openCombatant?.name"
        :style="{ color: navItemStyle('combatant'), background: designStore.inputBacking }"
        @click="props.switchTab('combatant')"
        class="textI"
        >{{ props.openCombatant.name }}</BNavItem
      >
      <BNavItem
        v-if="props.openCombatant?.name"
        :style="{ color: navItemStyle('combatant'), background: designStore.inputBacking }"
        @click="props.switchTab('combatant')"
        class="navI"
      >
        <i class="bi bi-person-vcard"></i>
        <div v-if="props.navPos === 'combatant'">{{ props.openCombatant.name }}</div>
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
  width: 100%;
  margin-top: 1rem;
  border: 2px solid;
}
.optionalItem {
  display: none;
}
@media (max-width: 1500px) {
  .optionalItem {
    display: block;
  }
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
