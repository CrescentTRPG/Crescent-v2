<script lang="ts">
import { BInputGroup, BFormInput, BInputGroupText } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useSkillStore } from '@/stores/skillsStore'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import CustomModal from '@/components/CustomModal.vue'
import { useUserStore } from '@/stores/userStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { useSpellStore } from '@/stores/spellsStore'
import HpWidget from './HpWidget.vue'
import ManaWidget from './ManaWidget.vue'
import ArmorWidget from './ArmorWidget.vue'
import MPWidget from './MPWidget.vue'
import { useCharacterComputedStore } from '@/stores/characterComputedStore'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { hpStatusModifiers } = storeToRefs(characterStore)
    const characterComputedStore = useCharacterComputedStore()
    const martialPerksStore = useMartialPerksStore()
    const { martialPerks } = storeToRefs(martialPerksStore)
    const {
      totalHp,
      secondaryHandheldPassives,
      primaryHandheldPassives,
      wornArmorPassives,
      totalMana,
      wornArmor,
      wornShield,
      armorDvs,
      moveDvs,
      shieldDvs,
      bonusDvs,
      totalDvs
    } = storeToRefs(characterComputedStore)
    return {
      designStore,
      modal,
      userStore,
      characterStore,
      totalHp,
      secondaryHandheldPassives,
      primaryHandheldPassives,
      wornArmorPassives,
      hpStatusModifiers,
      totalMana,
      wornArmor,
      wornShield,
      martialPerks,
      armorDvs,
      moveDvs,
      shieldDvs,
      bonusDvs,
      totalDvs
    }
  },
  components: {
    HpWidget,
    ManaWidget,
    ArmorWidget,
    MPWidget
  }
}
</script>

<template>
  <div class="mainContainer" :style="{ background: designStore.sidebarBacking }">
    <div class="bannerRowItemContainer" style="margin-left: -1.25rem">
      <HpWidget
        :secondaryHandheldPassives="secondaryHandheldPassives"
        :primaryHandheldPassives="primaryHandheldPassives"
        :wornArmorPassives="wornArmorPassives"
        :setCurrentAndBarrier="characterStore.setCurrentAndBarrierHP"
        :current-hp="characterStore.currentHp"
        :barrier-hp="characterStore.barrierHp"
        :hpStatusModifiers="hpStatusModifiers"
        :storeRef="characterStore"
        :statusEffects="characterStore.statusEffects"
        :traits="characterStore.traits"
        :totalHp="totalHp"
        :removeHpStatusModifier="characterStore.removeHpStatusModifier"
        :addNewHpStatusModifier="characterStore.addNewHpStatusModifier"
        class="bannerRowItem"
        style="margin-top: -0.5rem"
      ></HpWidget>
    </div>
    <div class="bannerRowItemContainer">
      <ManaWidget
        :removeManaStatusModifier="characterStore.removeManaStatusModifier"
        :addNewManaStatusModifier="characterStore.addNewManaStatusModifier"
        :totalMana="totalMana"
        :customStatusEffects="characterStore.customStatusEffects"
        :currentMana="characterStore.currentMana"
        :traits="characterStore.traits"
        :manaStatusModifiers="characterStore.manaStatusModifiers"
        :setCurrentMana="characterStore.setCurrentMana"
        :secondaryHandheldPassives="secondaryHandheldPassives"
        :primaryHandheldPassives="primaryHandheldPassives"
        :wornArmorPassives="wornArmorPassives"
        class="bannerRowItem"
        style="bottom: 0.25rem"
      ></ManaWidget>
    </div>
    <div class="bannerRowItemContainer" style="padding-left: 0.25rem">
      <ArmorWidget
        :armorDvs="armorDvs"
        :moveDvs="moveDvs"
        :shieldDvs="shieldDvs"
        :bonusDvs="bonusDvs"
        :totalDvs="totalDvs"
        :armorStatusModifiers="characterStore.armorStatusModifiers"
        :traits="characterStore.traits"
        :secondaryHandheldPassives="secondaryHandheldPassives"
        :primaryHandheldPassives="primaryHandheldPassives"
        :wornArmorPassives="wornArmorPassives"
        :statusEffects="characterStore.statusEffects"
        :wornArmor="wornArmor"
        :wornShield="wornShield"
        :martialPerks="martialPerks"
        :removeArmorStatusModifier="characterStore.removeArmorStatusModifier"
        :addNewArmorStatusModifier="characterStore.addNewArmorStatusModifier"
        class="bannerRowItem"
        style="bottom: 0.75rem"
      ></ArmorWidget>
    </div>
    <div class="bannerRowItemContainer" style="padding-left: 0.25rem">
      <MPWidget
        :mpStatusModifiers="characterStore.mpStatusModifiers"
        :addNewMpStatusModifier="characterStore.addNewMpStatusModifier"
        :removeMpStatusModifier="characterStore.removeMpStatusModifier"
        :getMp="characterStore.getMp"
        class="bannerRowItem"
        style="bottom: 1rem"
      ></MPWidget>
    </div>
  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 1px; /* Adjust scrollbar width */
  height: 8px; /* Adjust scrollbar height */
}
.mainContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  overflow: scroll;
  padding-left: 0.5rem;
  padding-bottom: 1.25rem;
  padding-top: 0.75rem;
}
.bannerRowItem {
  position: relative;
  bottom: 0.5rem;
  transform: scale(0.8, 0.8);
  margin-left: -3rem;
  margin-top: -1rem;
}
@media (max-width: 700px) {
  .bannerRowItem {
    position: relative;
    bottom: 0.5rem;
    transform: scale(0.7, 0.7);
    margin-left: -3rem;
    margin-top: -1rem;
  }
  .mainContainer {
    padding-bottom: 0.75rem;
    padding-top: 0.5rem;
  }
}
@media (max-width: 550px) {
  .bannerRowItem {
    position: relative;
    bottom: 0.5rem;
    transform: scale(0.6, 0.6);
    margin-left: -3rem;
    margin-top: -1rem;
  }
  .mainContainer {
    padding-bottom: 0rem;
    padding-top: 0rem;
    padding-left: 0.5rem;
  }
}
@media (max-width: 450px) {
  .bannerRowItem {
    position: relative;
    bottom: 0.5rem;
    transform: scale(0.5, 0.5);
    margin-left: -3rem;
    margin-top: -1rem;
  }
  .mainContainer {
    margin-bottom: -0.5rem;
    margin-top: -0.5rem;
    padding-left: 1rem;
  }
}

.bannerRowItemContainer {
  width: 6rem;
  height: 6rem;
  margin-bottom: 1rem;
}
</style>
