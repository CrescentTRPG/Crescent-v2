<script lang="ts">
import { useCharacterComputedStore } from '@/stores/characterComputedStore.ts'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import ArmorWidget from './ArmorWidget.vue'
import HpWidget from './HpWidget.vue'
import ManaWidget from './ManaWidget.vue'
import MPWidget from './MPWidget.vue'

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
  <div
    class="banner"
    style=""
    :style="{ background: designStore.sidebarBacking, color: designStore.secondaryTheme }"
  >
    <span
      style="display: flex; margin-bottom: -1.5rem"
      :style="{ borderColor: designStore.secondaryTheme, color: designStore.secondaryTheme }"
    >
      <v-icon name="gi-abstract-119" style="position: relative; left: 0.25rem"></v-icon>
      <hr :style="{ borderColor: designStore.secondaryTheme }" />
      <v-icon name="gi-abstract-119" style="position: relative; right: 0.25rem"></v-icon>
    </span>
    <div
      style="
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        width: 100%;
        padding-top: 1rem;
      "
    >
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
        class="bannerItem"
      ></HpWidget>
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
        class="bannerItem"
      ></ManaWidget>
      <ArmorWidget
        :armorDvs="armorDvs"
        :moveDvs="moveDvs"
        :shieldDvs="shieldDvs"
        :bonusDvs="bonusDvs"
        :totalDvs="totalDvs"
        :traits="characterStore.traits"
        :armorStatusModifiers="characterStore.armorStatusModifiers"
        :secondaryHandheldPassives="secondaryHandheldPassives"
        :primaryHandheldPassives="primaryHandheldPassives"
        :wornArmorPassives="wornArmorPassives"
        :statusEffects="characterStore.statusEffects"
        :wornArmor="wornArmor"
        :wornShield="wornShield"
        :martialPerks="martialPerks"
        :removeArmorStatusModifier="characterStore.removeArmorStatusModifier"
        :addNewArmorStatusModifier="characterStore.addNewArmorStatusModifier"
        :setIsDodging="characterStore.setIsDodging"
        :is-dodging="
          (martialPerks['Dodging']?.known && characterStore.overviewValues.isDodging) || false
        "
        :has-dodging="martialPerks['Dodging']?.known"
        class="bannerItem"
      ></ArmorWidget>
      <MPWidget
        :mpStatusModifiers="characterStore.mpStatusModifiers"
        :addNewMpStatusModifier="characterStore.addNewMpStatusModifier"
        :removeMpStatusModifier="characterStore.removeMpStatusModifier"
        :getMp="characterStore.getMp"
        class="bannerItem"
        style="margin-left: 0.5rem"
      ></MPWidget>
    </div>
  </div>
  <div :style="{ color: designStore.secondaryTheme }">
    <div class="banner-emblem-bi" v-if="designStore.charIcon.substring(0, 2) === 'bi'">
      <i :class="designStore.charIcon"></i>
    </div>
    <div class="banner-emblem-gi" v-if="designStore.charIcon.substring(0, 2) === 'gi'">
      <v-icon scale="3" :name="designStore.charIcon"></v-icon>
    </div>
  </div>
  <div class="arrow-down" :style="{ borderTopColor: designStore.sidebarBacking }"></div>
  <div
    class="banner-extension"
    :style="{ background: designStore.secondaryTheme, borderColor: designStore.secondaryTheme }"
  ></div>
  <div
    class="arrow-down-secondary"
    style="z-index: 2; position: relative"
    :style="{ borderTopColor: designStore.secondaryTheme }"
  ></div>
</template>

<style scoped>
.banner-emblem-gi {
  position: absolute;
  z-index: 5;
  left: 5.25rem;
  margin-top: -0.5rem;
}
.banner-emblem-bi {
  font-size: 2.5rem;
  position: absolute;
  z-index: 5;
  left: 5.75rem;
  display: flex;
  margin-top: -0.5rem;
}
.banner {
  border-left: 3px solid;
  border-right: 3px solid;
  width: 13.75rem;
  box-sizing: border-box;
}
.banner-extension {
  border-left: 3px solid;
  border-right: 3px solid;
  width: 13.75rem;
  padding: 0.5rem;
  box-sizing: border-box;
  z-index: 2;
  position: relative;
  height: 1rem;
}
.arrow-down {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6.7rem solid transparent;
  border-right: 6.7rem solid transparent;
  z-index: 4;
  border-top: 4rem solid;
  margin-left: 3px;
}
.arrow-down-secondary {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 6.875rem solid transparent;
  border-right: 6.875rem solid transparent;
  z-index: 4;
  border-top: 4rem solid;
}
.bannerItem {
  cursor: pointer;
  padding-left: 0.25rem;
}
@media (max-width: 600px) {
  .banner-emblem-gi {
    left: 1rem;
  }
  .banner-emblem-bi {
    left: 2.8rem;
    margin-top: -1.5rem;
  }
  .bannerItem {
    margin-top: -1rem;
    margin-bottom: -3rem;
    margin-left: -2.75rem;
    transform: scale(0.65);
  }
  .banner {
    width: 8rem;
  }
  .banner-extension {
    width: 8rem;
    height: 1rem;
  }
  .arrow-down {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 3.85rem solid transparent;
    border-right: 3.85rem solid transparent;
    z-index: 4;
    border-top: 3.85rem solid;
  }
  .arrow-down-secondary {
    position: absolute;
    width: 0;
    height: 0;
    border-left: 4rem solid transparent;
    border-right: 4rem solid transparent;
    z-index: 4;
    border-top: 4rem solid;
  }
}
</style>
