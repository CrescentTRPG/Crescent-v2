<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import CharacterSidebar from '../Build/CharacterSidebar.vue'
import AttributeWidget from '../Build/AttributeWidget.vue'

export default {
  setup(props, context) {
    const router = useRouter()
    const designStore = useDesignStore()
    return { designStore }
  },

  methods: {},
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CharacterSidebar,

    AttributeWidget
  }
}
</script>

<template>
  <div class="attrGrid" :style="{ fontFamily: designStore.font }">
    <div class="attrQuad">
      <div class="attrDuo">
        <AttributeWidget attribute="Strength" attributeValue="10"></AttributeWidget>
        <AttributeWidget attribute="Agility" attributeValue="10"></AttributeWidget>
      </div>
      <div class="attrDuo">
        <AttributeWidget attribute="Health" attributeValue="10"></AttributeWidget>
        <AttributeWidget attribute="Perception" attributeValue="10"></AttributeWidget>
      </div>
    </div>
    <div class="attrQuad">
      <div class="attrDuo">
        <AttributeWidget attribute="Willpower" attributeValue="10"></AttributeWidget>
        <AttributeWidget attribute="Charisma" attributeValue="10"></AttributeWidget>
      </div>
      <div class="attrDuo">
        <AttributeWidget attribute="Intelligence" attributeValue="10"></AttributeWidget>
        <AttributeWidget attribute="Power" attributeValue="10"></AttributeWidget>
      </div>
    </div>
  </div>
</template>

<style>
.attrGrid {
  height: fit-content;
  width: 90%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-left: 1rem;
  max-width: 80rem;
}
.attrQuad {
  flex-wrap: wrap;
  width: 50%;
  justify-content: flex-start;
  display: flex;
  min-width: 14rem;
  flex-grow: 1;
}
.attrDuo {
  min-width: 14rem;
  width: 50%;
  justify-content: space-around;
  display: flex;
  margin-bottom: 1rem;
  flex-grow: 1;
}
@media (min-width: 1500px) {
  .attrQuad {
    width: 50%;
    margin-bottom: 0rem;
  }
}
@media (min-width: 600px) {
  .attrGrid {
    margin-top: 1rem;
  }
}
@media (max-width: 82rem) {
  .attrGrid {
    max-width: 42rem;
  }
}
@media (max-width: 35rem) {
  .attrGrid {
    max-width: 20rem;
  }
}
</style>
