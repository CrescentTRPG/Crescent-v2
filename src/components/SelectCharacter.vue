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
import { useRouter } from 'vue-router'
import { useCharacterStore } from '../stores/characterStore.ts'
import { useUserStore } from '../stores/userStore.ts'
import CharacterCard from './CharacterCard.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { usePerformanceStore } from '@/stores/performanceStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'

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
      if (
        this.props.charList.length < 2 ||
        useUserStore().subscriptionLevel === 'Overlord' ||
        useUserStore().subscriptionLevel === 'Lord'
      ) {
        useCharacterStore().addCharacter(useUserStore().getUserId)
      } else {
        alert('User is not entitled to more than two characters')
      }
    },
    selectCharacter(character) {
      useAdventureStore().unsubscribe()
      usePerformanceStore().clearPerformance()
      useFaunaStore().clearFauna()
      useSpellStore().clearBuildDisplay()
      useMartialPerksStore().clearBuildDisplay()
      useMartialSkillsStore().clearMartialSkillsBuild()
      useSkillStore().clearEffectiveSkills()
      useCharacterStore().setLocalCharacter(character)
      useCharacterStore().setLocalSpentAbilityPoints(0)
      useAdventureStore().clearImportantAdventureInfo()
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
