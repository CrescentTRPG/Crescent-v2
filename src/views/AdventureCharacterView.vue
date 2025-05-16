<template>
  <div>
    <BButton @click="router.push({ name: 'adventure' })">Return To Adventure</BButton>
    <CharacterView style="position: relative; top: 5rem"></CharacterView>
  </div>
</template>

<script lang="ts">
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import CharacterView from './CharacterView.vue'
import { useRouter } from 'vue-router'

export default {
  setup(props, context) {
    let router = useRouter()

    return { router }
  },
  components: {
    CharacterView,
    BButton
  }
}
</script>

<style></style>
