<template>
  <div style="display: flex">
    <div style="flex-grow: 1"></div>
    <div class="container">
      <div v-for="(character, index) in characters" :key="index">
        <CharacterCard :character="character" :name="character.name"></CharacterCard>
      </div>
      <CharacterCard character="{}" name="New Character" :useImg="false"></CharacterCard>
    </div>
    <div style="flex-grow: 1"></div>
  </div>
</template>

<script>
import { ref } from 'vue'
import CharacterCard from './CharacterCard.vue'

export default {
  setup(props, context) {
    const characters = ref([])
    return { characters }
  },
  components: {
    CharacterCard
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0;
  min-width: 90% !important;
  flex-grow: 0;
}
</style>
