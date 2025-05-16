<template>
  <div style="display: flex">
    <div style="flex-grow: 1"></div>
    <div class="container">
      <CharacterCard
        v-for="(character, index) in props.charList"
        :key="index"
        :character="character"
        :name="character.name"
        :image="character.image"
        :useImg="true"
        @click="selectCharacter(character)"
      >
      </CharacterCard>
      <CharacterCard
        character="{}"
        name="New Character"
        :useImg="false"
        @click="addCharacter()"
      ></CharacterCard>
    </div>
    <div style="flex-grow: 1"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CharacterCard from './CharacterCard.vue'
import { useCharacterStore } from '../stores/characterStore'
import { useUserStore } from '../stores/userStore'
import { getCollection, getCollectionOnce } from '../composable/getCollection'
import { db } from '@/firebase/config.js'
import { onSnapshot, collection } from 'firebase/firestore'
import { useDesignStore } from '@/stores/designStore'
import { useSpellStore } from '@/stores/spellsStore'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import { useSkillStore } from '@/stores/skillsStore'
import { useFaunaStore } from '@/stores/faunaStore'
import { usePerformanceStore } from '@/stores/performanceStore'

export default {
  props: ['charList'],
  setup(props, context) {
    const router = useRouter()

    return { router, props }
  },
  components: {
    CharacterCard
  },
  methods: {
    addCharacter() {
      if (this.props.charList.length < 2) {
        useCharacterStore().addCharacter(useUserStore().getUserId)
      } else {
        alert('User is not entitled to more than two characters')
      }
    },
    selectCharacter(character) {
      usePerformanceStore().clearPerformance()
      useFaunaStore().clearFauna()
      useSpellStore().clearBuildDisplay()
      useMartialPerksStore().clearBuildDisplay()
      useMartialSkillsStore().clearMartialSkillsBuild()
      useSkillStore().clearEffectiveSkills()
      useCharacterStore().setLocalCharacter(character)
      this.router.push({ name: 'character' })
    }
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
