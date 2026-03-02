<script lang="ts">
import BeingBuilt from '@/components/BeingBuilt.vue'
import CustomModal from '@/components/CustomModal.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import NotEntitled from '@/components/NotEntitled.vue'
import SelectAdventure from '@/components/SelectAdventure.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BNavbar, BNavItem } from 'bootstrap-vue-next'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BInputGroup from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroup.vue'
import { signOut } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import IconStackCloud from '../components/IconStackCloud.vue'
import SelectCharacter from '../components/SelectCharacter.vue'
import { auth, db } from '../firebase/config.js'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const userStore = useUserStore()
    const { subscriptionLevel } = storeToRefs(userStore)
    const modal = ref(false)
    const settingsModal = ref(false)

    const characters: Ref<Array<any>> = ref([])
    const nameList = computed(() => {
      let ret: Array<{ text: string; value: string }> = []
      characters.value.forEach((char) => {
        ret.push({ text: char.name, value: char.id })
      })
      return ret
    })

    async function sendSelected(invitation) {
      let docRef = doc(
        db,
        'User/' + invitation.gameMasterId + '/Adventure/' + invitation.adventureId
      )
      let adventure = { gameMasterId: invitation.gameMasterId, adventureId: invitation.adventureId }
      let ret = await getDoc(docRef)
      let ids = ret.data()?.characterIds
      ids.push(selectedChar.value)

      let uids = ret.data()?.userIds || []

      uids.push(userStore.getUserId)
      let charObjArr = nameList.value.filter((obj) => (obj.value = selectedChar.value))
      let names = ret.data()?.characterNames
      names.push(charObjArr[0].text)

      updateDoc(docRef, { characterIds: ids, characterNames: names, userIds: uids })
      deleteInvite(invitation)
      updateDoc(doc(db, 'User/' + useUserStore().id + '/Character/' + selectedChar.value), {
        adventure: adventure
      })
      modal.value = false
      alert('Added to Adventure!')
    }
    const selectedChar = ref('')
    function deleteInvite(invitation) {
      let inviteDocRef = doc(db, 'User/' + useUserStore().getUserId + '/Invites/' + invitation.id)
      deleteDoc(inviteDocRef)
    }
    function decline(invite) {
      deleteInvite(invite)
      modal.value = false
    }
    let unsub = () => {}
    const invites = computed(() => {
      return userStore.getInvites || []
    })
    onMounted(() => {
      userStore.getSubscriptionLevel()
      userStore.subscribeToInvites()
      let collectionRef = collection(db, 'User/' + useUserStore().getUserId + '/Character')
      unsub = onSnapshot(
        collectionRef,
        (snap) => {
          let results: Array<any> = []
          snap.docs.forEach((doc) => {
            results.push({ ...doc.data(), id: doc.id })
          })
          characters.value = results
        },
        (err) => {
          console.log(err.message)
        }
      )
    })
    onUnmounted(() => {
      userStore.unsubscribe()
      unsub()
    })
    const navPos = ref('character')
    const logout = async () => {
      error.value = null
      try {
        await signOut(auth)
      } catch (err: any) {
        console.log(err.message)
        error.value = err.message
      }
      router.push({ name: 'landing' })
      console.log('Signed Out')
    }
    function copy() {
      navigator.clipboard.writeText(userStore.getUserId)
      alert('Copied friend code to clipboard!')
    }
    return {
      logout,
      userStore,
      navPos,
      modal,
      characters,
      nameList,
      selectedChar,
      decline,
      sendSelected,
      subscriptionLevel,
      settingsModal,
      copy,
      invites
    }
  },
  computed: {
    width() {
      return window.innerWidth
    }
  },
  methods: {
    navItemStyle(item: string) {
      switch (item) {
        case 'character':
          if (this.navPos === 'character') {
            return '#c15be6'
          }
          return '#000000'
        case 'adventure':
          if (this.navPos == 'adventure') {
            return '#c15be6'
          }
          return '#000000'
        case 'browse':
          if (this.navPos == 'browse') {
            return '#c15be6'
          }
          return '#000000'
      }
    },
    navItemStyleBg(item: string) {
      switch (item) {
        case 'character':
          if (this.navPos === 'character') {
            return '#dfdfdf'
          }
          return '#f1eef1'
        case 'adventure':
          if (this.navPos == 'adventure') {
            return '#dfdfdf'
          }
          return '#f1eef1'
        case 'browse':
          if (this.navPos == 'browse') {
            return '#dfdfdf'
          }
          return '#f1eef1'
      }
    },
    async addCharacter(invitation) {
      if (this.characters.length < 2) {
        this.selectedChar = await useCharacterStore().addCharacter(useUserStore().getUserId)
        this.sendSelected(invitation)
      } else {
        alert('User is not entitled to more than two characters')
      }
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    SelectCharacter,
    IconStackCloud,
    BeingBuilt,
    SelectAdventure,
    CustomModal,
    DropdownSelect,
    NotEntitled,
    BFormInput,
    BInputGroup
  }
}
</script>

<template>
  <div class="fill">
    <div
      style="
        display: flex;
        justify-content: space-between;
        background-color: #f1eef1;
        height: 4.5rem;
      "
    >
      <div style="display: flex; justify-content: flex-start; height: 5rem">
        <IconStackCloud class="moon" style="color: #c2b172"></IconStackCloud>
        <span class="component"
          ><div style="width: 150%">Welcome {{ userStore.getDisplayName }}!</div>
          <div
            style="display: flex; justify-content: end; position: relative"
            class="sparkle-height"
          >
            <i class="bi bi-stars" style="color: #c2b172; position: absolute; z-index: 5"></i>
          </div>
        </span>
        <div class="dazzle" style="z-index: 1"></div>
        <div class="dazzle2"></div>
      </div>
      <div style="padding-right: 1rem; padding-top: 0.5rem; min-width: 8.5rem">
        <BButton class="button" style="margin-right: 0.25rem" @click="modal = true">
          <i class="bi bi-mailbox-flag" v-if="invites.length > 0" style="color: #c15be6"></i>
          <i class="bi bi-mailbox" v-else></i>
        </BButton>
        <BButton class="button" style="margin-right: 0.25rem" @click="settingsModal = true">
          <i class="bi bi-gear-fill"></i>
        </BButton>
        <BButton @click="logout()" class="button"> logout</BButton>
      </div>
    </div>
    <CustomModal
      title="Invites"
      :showModal="modal"
      @close="modal = false"
      background="#422c58"
      color="#dfdfdf"
      secondary="#c2b172"
    >
      <template v-slot:body>
        <div v-if="invites.length === 0">
          You haven't recieved any invites! <br /><br />If your Game master has access to create an
          adventure, they can invite you from the Party Tab by hitting "Invite to Adventure".
        </div>

        <div v-for="invite in invites" :key="invite">
          <div>
            You've been invited to an adventure! {{ invite.gameMasterDisplayName }} has invited you
            to be a part of the adventure "{{ invite.adventureName }}". Please select one of your
            characters to send on this adventure, or chose to create a brand new character for this
            adventure.
            <div
              style="
                display: flex;
                background: #dfdfdf;
                border: 2px solid;
                border-color: #c2b172;
                border-radius: 0.275rem;
              "
            >
              <DropdownSelect
                style="flex-grow: 1"
                :borderless="true"
                :options="nameList"
                background="#dfdfdf"
                color="#000000"
                borderColor="#c2b172"
                @selection="(selection) => (selectedChar = selection)"
              ></DropdownSelect>
              <BButton
                @click="sendSelected(invite)"
                style="
                  border-radius: 0;
                  background: #422c58;
                  border-left: 1px solid;
                  border-color: #c2b172;
                  border-top-right-radius: 0.275rem;
                  border-bottom-right-radius: 0.275rem;
                "
                >Send Selected Character</BButton
              >
            </div>
            <div style="display: flex; justify-content: end">
              <BButton
                style="
                  margin: 0.5rem;
                  border: 2px solid;
                  border-color: #c2b172;
                  background: #422c58;
                "
                :disabled="characters.length >= 2"
                @click="addCharacter(invite)"
                >Create and Send New Character</BButton
              >

              <BButton
                style="
                  margin: 0.5rem;
                  margin-right: 0;
                  margin-left: 0;

                  border: 2px solid;
                  border-color: #c2b172;
                  background: #422c58;
                "
                @click="decline(invite)"
                >Decline Invite</BButton
              >
            </div>

            Note: Sending a character on this adventure will give your game master full access and
            edit rights to your character sheet. Additionally, it will unlock a host of new features
            on this character's character sheet.
          </div>
        </div>
      </template>
    </CustomModal>
    <CustomModal
      title="Settings"
      :showModal="settingsModal"
      @close="settingsModal = false"
      background="#422c58"
      color="#dfdfdf"
      secondary="#c2b172"
    >
      <template v-slot:body>
        <i class="bi bi-person"></i> Friend Code:
        <BInputGroup style="border: 2px solid; border-radius: 0.5rem; border-color: #c2b172">
          <BFormInput
            :style="{
              background: '#dfdfdf',
              color: '#000000'
            }"
            disabled
            v-model="userStore.getUserId"
            type="password"
          ></BFormInput>
          <BButton @click="copy()"><i class="bi bi-copy"></i></BButton>
        </BInputGroup>
      </template>
    </CustomModal>
    <BNavbar
      style="
        background: #f1eef1;
        width: 100%;
        font-family: Bahnschrift;
        margin-top: 1rem;
        border: 2px solid #c2b172;
      "
    >
      <BNavItem
        :style="{ color: navItemStyle('character'), background: navItemStyleBg('character') }"
        @click="navPos = 'character'"
        class="navI"
        >Characters</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('adventure'), background: navItemStyleBg('adventure') }"
        @click="navPos = 'adventure'"
        class="navI"
        >Adventures</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('browse'), background: navItemStyleBg('browse') }"
        @click="navPos = 'browse'"
        class="navI"
        >Browse</BNavItem
      ></BNavbar
    >
    <SelectCharacter :charList="characters" v-if="navPos == 'character'"></SelectCharacter>
    <SelectAdventure
      v-if="navPos == 'adventure' && subscriptionLevel === 'Overlord'"
    ></SelectAdventure>
    <NotEntitled v-if="navPos == 'adventure' && subscriptionLevel != 'Overlord'"></NotEntitled>
    <BeingBuilt v-if="navPos == 'browse'"></BeingBuilt>
  </div>
</template>

<style>
.component {
  background-color: #422c58;
  padding: 1rem;
  padding-top: 0.5rem;
  font-size: 1.25rem;
  color: #dfdfdf;
  font-style: 'Bahnscrift';
  height: 5rem;
  font-family: 'Bahnschrift', sans-serif;
  text-wrap: wrap;
  margin-right: -2px;
  margin-left: -2px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.button {
  background-color: #422c58;
  border: none;
  color: #dfdfdf;
  font-family: 'Bahnschrift', sans-serif;
}
.navI {
  list-style-type: none;
  width: 33%;
  text-align: center;
}
.moon {
  font-size: 3.5rem;
  width: 3.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.sparkle-height {
  bottom: 2.25rem;
  left: 1.25rem;
}
@media (max-width: 600px) {
  /* CSS that should be displayed if width is equal to or less than 800px goes here */
  .component {
    background-color: #422c58;
    padding: 1rem;
    padding-top: 0.5rem;
    font-size: 1rem;
    color: #dfdfdf;
    font-style: 'Bahnscrift';
    height: 5rem;
    font-family: 'Bahnschrift', sans-serif;
    text-wrap: wrap;
    width: min-content;
    box-shadow: 5px -2px 5px #aaaaaa;
    margin-right: -2px;
    margin-left: -2px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .moon {
    font-size: 1.25rem;
    width: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding-top: 0.5rem;
  }
  .sparkle-height {
    bottom: 3rem;
    left: 1.25rem;
  }
}
.dazzle {
  width: 0;
  height: 0;
  border-left: 5rem solid #422c58;
  border-bottom: 5rem solid transparent;
}
.dazzle2 {
  width: 2rem;
  height: 5rem;
  transform: skew(-45deg);
  background: #c2b172;
  position: relative;
  right: 2.5rem;
}
.fill {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  background-color: #dfdfdf;
  min-height: 100vh;
  height: max-content;
}
</style>
