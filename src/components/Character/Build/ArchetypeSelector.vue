<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BFormSelect } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'

import CharacterSidebar from '../Build/CharacterSidebar.vue'
import BannerItem from '../Build/BannerItem.vue'

export default {
  setup(props, context) {
    const router = useRouter()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const userStore = useUserStore()
    const archetype = ref(JSON.parse(JSON.stringify(characterStore.archetype)))
    const options = [
      { value: 'augur', text: 'Augur' },
      { value: 'breaker', text: 'Breaker' },
      { value: 'warden', text: 'Warden' },
      { value: 'paladin', text: 'Paladin' },
      { value: 'mage', text: 'Mage' },
      { value: 'monk', text: 'Monk' },
      { value: 'rogue', text: 'Rogue' },
      { value: 'mystic', text: 'Mystic' },
      { value: 'nomad', text: 'Nomad' },
      { value: 'priest', text: 'Priest' },
      { value: 'elementalist', text: 'Elementalist' },
      { value: 'sorcerer', text: 'Sorcerer' }
    ]
    return { designStore, archetype, options, characterStore, userStore }
  },
  created() {
    this.$emit(this.archetype)
  },
  watch: {
    archetype() {
      this.$emit(this.archetype)
    }
  },
  methods: {
    selectArchetype(archetype: string) {
      this.$emit(archetype)
      this.characterStore.setArchetype(
        archetype,
        this.userStore.getUserId,
        this.characterStore.getCharacterId
      )
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CharacterSidebar,
    BannerItem,
    BFormSelect
  }
}
</script>

<template>
  <div :style="{ fontFamily: designStore.font }" class="archetype-selector">
    <BFormSelect
      v-model="archetype"
      :options="options"
      style="border: 2px solid; cursor: pointer"
      :style="{
        background: designStore.primaryTheme,
        borderColor: designStore.secondaryTheme,
        color: designStore.primaryText,
        fontFamily: designStore.titleFont
      }"
      @change="selectArchetype(archetype)"
    ></BFormSelect>
  </div>
</template>

<style>
.archetype-selector {
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: row;
}
</style>
