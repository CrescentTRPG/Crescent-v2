<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BFormTextarea, BFormInput } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useCharacterStore } from '../../../stores/characterStore'

import CharacterSidebar from '../Build/CharacterSidebar.vue'
import BannerItem from '../Build/BannerItem.vue'
import ArchetypeSelector from '../Build/ArchetypeSelector.vue'
import CustomModal from '../../CustomModal.vue'

export default {
  setup(props, context) {
    const router = useRouter()
    const modal = ref(false)
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const armorLevelIcon = {
      Unarmored: 'gi-shirt',
      'Light Armor': 'gi-ninja-armor',
      'Medium Armor': 'gi-leather-armor',
      'Heavy Armor': 'gi-chest-armor'
    }
    const armorLevel = {
      '': 'Unarmored',
      mystic: 'Light Armor',
      priest: 'Light Armor',
      elementalist: 'Light Armor',
      sorcerer: 'Light Armor',
      nomad: 'Light Armor',
      rogue: 'Medium Armor',
      monk: 'Medium Armor',
      mage: 'Medium Armor',
      warden: 'Heavy Armor',
      paladin: 'Heavy Armor',
      breaker: 'Heavy Armor',
      augur: 'Heavy Armor'
    }

    return { designStore, modal, armorLevel, characterStore, armorLevelIcon }
  },

  methods: {
    updateIcon(name: string) {
      console.log(name)
      this.icon = name
    }
  },
  computed: {
    icon() {
      return this.armorLevelIcon[this.armorLevel[this.characterStore.getArchetype]]
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CharacterSidebar,
    BannerItem,
    ArchetypeSelector,
    BFormTextarea,
    CustomModal,
    BFormInput
  }
}
</script>

<template>
  <div class="archetype-container">
    <div :style="{ fontFamily: designStore.font }" class="banner-container">
      <div style="width: 14rem; display: flex; flex-direction: column">
        <v-icon :name="icon" scale="12" :style="{ color: designStore.primaryTheme }"></v-icon>
        <div style="display: flex; justify-content: center">
          <BFormInput
            disabled
            style="
              position: relative;
              bottom: 0.9rem;
              width: 80%;
              border: 2px solid;
              width: 90%;
              height: 100%;
              display: flex;
              flex-direction: row;
              padding: 0.5rem;
              padding-left: 0.75rem;
            "
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme,
              color: designStore.primaryText
            }"
            v-model="armorLevel[characterStore.archetype]"
          ></BFormInput>
        </div>
        <i
          class="bi bi-patch-question"
          :style="{ color: designStore.alertTheme }"
          style="
            margin-top: 0.25rem;
            font-size: 2rem;
            position: relative;
            left: 11rem;
            bottom: 7rem;
            width: 2rem;
          "
          @click="modal = !modal"
        ></i>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Armor Level" @close="modal = false">
      <template v-slot:body>
        Your character is entitled to: {{ armorLevel[characterStore.archetype] }}. This is
        determined by the archetype of your character.
      </template>
    </CustomModal>
  </div>
</template>

<style></style>
