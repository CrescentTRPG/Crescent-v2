<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../../stores/designStore'
import { useUserStore } from '@/stores/userStore'
import { useAdventureStore } from '@/stores/adventureStore'
import { usePartyStore } from '@/stores/partyStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import CustomModal from '@/components/CustomModal.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import CharacterComputedShell from '../../../Adventure/CharacterComputedShell.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useCharacterStore } from '@/stores/characterStore'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { validateHeaderValue } from 'http'
import ChatWindow from '@/components/Adventure/Party/ChatWindow.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const partyStore = usePartyStore()
    const { characterObjects } = storeToRefs(partyStore)
    const characterStore = useCharacterStore()
    const userToAdd = ref('')
    function addUserToAdventure() {
      partyStore.inviteUserToAddCharacter(userToAdd.value)
      modal.value = false
      userToAdd.value = ''
    }
    const currentChar = ref({})
    const charId = ref('')
    const showParty = ref(true)
    let handle = () => {}
    function renderCharacter(char) {
      showParty.value = false
      currentChar.value = char
      charId.value = char.id
      handle = watch(
        characterObjects,
        async (newCharacterObjects, oldCharacterObjects) => {
          if (charId.value && currentChar.value != newCharacterObjects[charId.value].value) {
            currentChar.value = newCharacterObjects[charId.value]
            characterStore.updateCharacterFromAdventure(currentChar.value)
          }
        },
        { deep: true }
      )
    }
    function exit() {
      showParty.value = true
      handle()
      useDesignStore().setLocalDesign(adventureStore.design)
    }
    return {
      designStore,
      modal,
      userStore,
      adventureStore,
      userToAdd,
      partyStore,
      addUserToAdventure,
      renderCharacter,
      showParty,
      exit,
      props,
      characterStore
    }
  },
  components: {
    CharacterComputedShell,
    TitleWidget,
    ChatWindow
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <div v-if="showParty">
      <TitleWidget title="Characters"></TitleWidget>
      <div class="partyContainer">
        <div class="partyCharactersContainer">
          <div
            v-for="(character, index) in Object.values(partyStore.characterObjects)"
            :key="index"
          >
            <CharacterComputedShell
              :editable="false"
              @render="renderCharacter(character)"
              :character="character || {}"
            ></CharacterComputedShell>
          </div>
        </div>
        <ChatWindow :sender="characterStore.name" :senderId="userStore.getUserId"></ChatWindow>
      </div>
    </div>
  </div>
</template>

<style>
.partyCharactersContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.partyContainer {
  display: grid;
  grid-template-columns: 2fr 1fr;
}
@media (max-width: 1400px) {
  .partyCharactersContainer {
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 800px) {
    .partyContainer {
      display: flex;
      flex-direction: column-reverse;
    }
  }
}
</style>
