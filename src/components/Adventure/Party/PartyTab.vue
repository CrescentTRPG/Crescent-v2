<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { usePartyStore } from '@/stores/partyStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import CharacterView from '@/views/CharacterView.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import CharacterComputedShell from '../CharacterComputedShell.vue'
import ChatWindow from './ChatWindow.vue'
import { useEquipmentStore } from '@/stores/equipmentStore.ts'

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
    const renderedCharUserId = ref('')
    const showParty = ref(true)
    let handle = () => {}
    function renderCharacter(char) {
      showParty.value = false
      currentChar.value = char
      charId.value = char.id
      let loc = -1

      for (let i = 0; i < adventureStore.characterIds.length; i++) {
        if (charId.value === adventureStore.characterIds[i]) {
          loc = i
        }
      }
      renderedCharUserId.value = adventureStore.userIds[loc]
      adventureStore.setCurrentViewedUserId(renderedCharUserId.value)
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
      characterStore.clearCharacterNameAndID()
      adventureStore.setCurrentViewedUserId('')
      adventureStore.resetEquipment()
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
      renderedCharUserId
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
        style="
          border: 2px solid;
          position: absolute;
          right: 2rem;
          font-size: small;
          margin-top: 0.25rem;
        "
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
          <div
            v-if="adventureStore.characterIds.length < 1"
            style="
              align-self: center;
              display: flex;
              justify-content: center;
              padding: 1rem;
              margin: 1rem;
            "
            :style="{ background: designStore.inputBacking }"
          >
            <v-icon scale="3" name="gi-pikeman" style="align-self: center"></v-icon>

            <div style="align-self: center; display: flex; flex-direction: column">
              <div style="align-self: center; padding: 0.25rem">
                Try inviting some characters to this adventure by clicking
              </div>
              <BButton
                v-if="!props.isCharacter"
                @click="modal = true"
                style="border: 2px solid; font-size: small; margin-top: 0.25rem; margin: 0.5rem"
                :style="{
                  background: designStore.primaryTheme,
                  color: designStore.primaryText,
                  borderColor: designStore.secondaryTheme
                }"
                >Invite to Adventure <i class="bi bi-envelope"></i
              ></BButton>
            </div>
            <v-icon
              scale="3"
              name="gi-fairy"
              style="align-self: center; transform: scale(-1, 1)"
            ></v-icon>
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
      <CharacterView
        :userId="renderedCharUserId"
        v-if="!props.isCharacter"
        :isGameMaster="true"
        :exit="exit"
      ></CharacterView>
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
