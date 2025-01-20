<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore'

export default {
  props: ['medallion'],
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const tab = ref('corestats')
    return { designStore, tab, props }
  },

  methods: {},
  components: {}
}
</script>

<template>
  <div
    style="display: flex; justify-content: center"
    :style="{
      color: designStore.inputText,
      borderColor: designStore.secondaryTheme
    }"
  >
    <v-icon
      name="gi-abstract-119"
      style="position: relative; left: 0.25rem; align-self: center"
      :style="{ color: designStore.secondaryTheme }"
    ></v-icon>

    <hr
      :style="{ borderColor: designStore.secondaryTheme }"
      style="align-self: center; position: relative; top: 0rem"
    />

    <v-icon
      name="gi-moon"
      :style="{ color: designStore.secondaryTheme }"
      style="align-self: center; rotate: 180deg; position: relative; left: 0.2rem"
    ></v-icon>
    <v-icon
      v-if="props.medallion?.substring(0, 2) === 'gi'"
      :name="props.medallion"
      scale="2"
      :style="{ color: designStore.secondaryTheme }"
    ></v-icon>
    <i
      v-if="props.medallion?.substring(0, 2) === 'bi'"
      style="font-size: 1.75rem; padding-left: 0.2rem; padding-right: 0.2rem"
      :class="props.medallion"
      :style="{ color: designStore.secondaryTheme }"
    ></i>
    <v-icon
      name="gi-moon"
      :style="{ color: designStore.secondaryTheme }"
      style="align-self: center; position: relative; right: 0.2rem"
    ></v-icon>
    <hr
      :style="{ borderColor: designStore.secondaryTheme }"
      style="position: relative; top: 0.15rem"
    />
    <v-icon
      name="gi-abstract-119"
      style="position: relative; right: 0.25rem; align-self: center"
      :style="{ color: designStore.secondaryTheme }"
    ></v-icon>
  </div>
</template>

<style></style>
