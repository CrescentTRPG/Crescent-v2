<template>
  <div style="display: flex">
    <div style="flex-grow: 1"></div>
    <div class="container">
      <CharacterCard
        v-for="(adventure, index) in adventures"
        :key="index"
        :character="adventure"
        :name="adventure.name"
        :image="adventure.image"
        :useImg="true"
        @click="selectAdventure(adventure)"
      >
      </CharacterCard>
      <CharacterCard
        character="{}"
        name="New Adventure"
        :useImg="false"
        @click="addNewAdventure()"
      ></CharacterCard>
    </div>
    <div style="flex-grow: 1"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import CharacterCard from './CharacterCard.vue'

import { useUserStore } from '../stores/userStore'
import { getCollection, getCollectionOnce } from '../composable/getCollection'
import { db } from '@/firebase/config.js'
import { onSnapshot, collection } from 'firebase/firestore'
import { useDesignStore } from '@/stores/designStore'
import { useAdventureStore } from '@/stores/adventureStore'

export default {
  setup(props, context) {
    const adventures = ref([])
    const router = useRouter()
    const adventureStore = useAdventureStore()
    function addNewAdventure() {
      if (useUserStore().subscriptionLevel === 'Overlord') {
        adventureStore.addAdventure()
      } else {
        alert('HOW DARE YOU TRY AND HOLD THE POWERS OF A GOD')
      }
    }
    function selectAdventure(adventure) {
      console.log(adventure)
      adventureStore.setLocalAdventure(adventure)
      this.router.push({ name: 'adventure' })
    }
    onMounted(() => {
      let collectionRef = collection(db, 'User/' + useUserStore().getUserId + '/Adventure')
      onSnapshot(
        collectionRef,
        (snap) => {
          let results = []
          snap.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id })
          })
          adventures.value = results
        },
        (err) => {
          console.log(err.message)
        }
      )
      //adventures.value = await getCollectionOnce('User/' + useUserStore().getUserId + '/Character')
    })
    return { adventures, router, addNewAdventure, selectAdventure }
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
