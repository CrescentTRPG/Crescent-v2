<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useUserStore } from '@/stores/userStore'
import { useAdventureStore } from '@/stores/adventureStore'
import { usePartyStore } from '@/stores/partyStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import CustomModal from '@/components/CustomModal.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import CharacterComputedShell from '../CharacterComputedShell.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import CharacterView from '@/views/CharacterView.vue'
import { useCharacterStore } from '@/stores/characterStore'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { validateHeaderValue } from 'http'
import ChatWindow from './ChatWindow.vue'

export default {
  props: ['isCharacter'],
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
      props
    }
  },
  components: {
    BButton,
    CustomModal,
    BFormInput,
    CharacterComputedShell,
    TitleWidget,
    CharacterView,
    ChatWindow
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }">
    <div v-if="showParty">
      <BButton
        v-if="!props.isCharacter"
        @click="modal = true"
        style="border: 2px solid; margin: 0.25rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        >Invite to Adventure <i class="bi bi-envelope"></i
      ></BButton>
      <CustomModal :showModal="modal" title="Invite to Adventure" @close="modal = false">
        <template v-slot:body>
          <div>
            Enter another user's friend code to invite them to the adventure. Once the invititation
            is sent, the user will be able to accept the invite and chose what character to add to
            this adventure from their home page. A user's friend code can be found in their
            settings.
          </div>
          <BFormInput
            style="margin-top: 0.5rem"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            v-model="userToAdd"
          ></BFormInput>
        </template>
        <template v-slot:footer>
          <BButton
            @click="addUserToAdventure()"
            style="border: 2px solid; margin: 0.25rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            >Add User To Adventure</BButton
          >
          <BButton
            @click="modal = false"
            style="border: 2px solid; margin: 0.25rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            >Cancel</BButton
          >
        </template>
      </CustomModal>
      <TitleWidget title="Characters"></TitleWidget>
      <div style="display: grid; grid-template-columns: 2fr 1fr">
        <div class="partyCharactersContainer">
          <div
            v-for="(character, index) in Object.values(partyStore.characterObjects)"
            :key="index"
          >
            <CharacterComputedShell
              :editable="!props.isCharacter"
              @render="renderCharacter(character)"
              :character="character || {}"
            ></CharacterComputedShell>
          </div>
        </div>
        <ChatWindow
          sender="GM"
          :senderId="userStore.getUserId"
          :style="{ background: designStore.inputBacking }"
          style="width: 100%; display: flex; flex-direction: column"
        ></ChatWindow>
      </div>
    </div>
    <div v-else>
      <CharacterView v-if="!props.isCharacter" :isGameMaster="true" :exit="exit"></CharacterView>
    </div>
  </div>
</template>

<style>
.partyCharactersContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 12.5rem;
}
@media (max-width: 1400px) {
  .partyCharactersContainer {
    display: flex;
    flex-direction: column;
  }
}
</style>
