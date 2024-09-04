<template>
  <div style="display: flex">
    <div style="flex-grow: 1"></div>
    <div class="container">
      <CharacterCard
        v-for="(character, index) in characters"
        :key="index"
        :character="character"
        :name="character.name"
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

export default {
  setup(props, context) {
    const characters = ref([])
    const router = useRouter()
    onMounted(() => {
      let collectionRef = collection(db, 'User/' + useUserStore().getUserId + '/Character')
      onSnapshot(
        collectionRef,
        (snap) => {
          let results = []
          snap.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id })
          })
          characters.value = results
        },
        (err) => {
          console.log(err.message)
        }
      )
      //characters.value = await getCollectionOnce('User/' + useUserStore().getUserId + '/Character')
    })
    return { characters, router }
  },
  components: {
    CharacterCard
  },
  methods: {
    addCharacter() {
      useCharacterStore().addCharacter(useUserStore().getUserId)
    },
    selectCharacter(character) {
      useCharacterStore().setLocalCharacter(character)
      useCharacterStore().pullCharacterFromFirebase(useUserStore().getUserId, character.id)
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
