<script lang="ts">
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import ArmorWidget from '@/components/Character/Overview/ArmorWidget.vue'
import HpWidget from '@/components/Character/Overview/HpWidget.vue'
import ManaWidget from '@/components/Character/Overview/ManaWidget.vue'
import MPWidget from '@/components/Character/Overview/MPWidget.vue'
import { useCharacterComputedStore } from '@/stores/characterComputedStore.ts'

export default {
  props: [
    'isEditing',
    'currentStatBlock',
    'updateTemp',
    'removeArmorStatusModifier',
    'removeManaStatusModifier',
    'removeMpStatusModifier',
    'removeHpStatusModifier',
    'isStunned',
    'isPinned',
    'isProne',
    'isSlowed'
  ],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterComputedStore = useCharacterComputedStore()
    const wornArmorPassives = computed(() => {
      return (
        props.currentStatBlock.equipment.items.Armor[props.currentStatBlock.equipment.wornArmor]
          ?.equippedStats?.passives || {}
      )
    })
    const primaryHandheldPassives = computed(() => {
      return (
        props.currentStatBlock.equipment.items.Weapon[props.currentStatBlock.equipment.primaryHand]
          ?.equippedStats?.passives || {}
      )
    })
    const secondaryHandheldPassives = computed(() => {
      return (
        props.currentStatBlock.equipment.items.Shield[
          props.currentStatBlock.equipment.secondaryHand
        ]?.equippedStats?.passives ||
        props.currentStatBlock.equipment.items.Weapon[
          props.currentStatBlock.equipment.secondaryHand
        ]?.equippedStats?.passives ||
        {}
      )
    })
    const armorDvs: ComputedRef<number> = computed(() => {
      if (props.isEditing) {
        return props.currentStatBlock.armorDvs
      }
      let modifier = 0
      if (props.currentStatBlock?.overviewValues?.isDodging) {
        return 0
      }

      if (props.currentStatBlock.armorStatusModifiers['Modify Armor Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Modify Armor Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.currentStatBlock.armorStatusModifiers['Override Armor Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Override Armor Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }

      let baseArmorVal = props.currentStatBlock.traits['Armor DVs']
        ? props.currentStatBlock.traits['Armor DVs']?.number
        : props.currentStatBlock.armorDvs

      return Math.max(baseArmorVal + modifier, 0)
    })
    const bonusDvs: ComputedRef<number> = computed(() => {
      if (props.isEditing) {
        return props.currentStatBlock.bonusDvs
      }
      let modifier = 0
      if (props.currentStatBlock.armorStatusModifiers['Modify Bonus Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Modify Bonus Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.currentStatBlock.armorStatusModifiers['Override Bonus Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Override Bonus Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }

      return Math.max(props.currentStatBlock.bonusDvs + modifier, 0)
    })
    const shieldDvs: ComputedRef<number> = computed(() => {
      if (props.isEditing) {
        return props.currentStatBlock.shieldDvs
      }
      let modifier = 0
      if (props.currentStatBlock?.overviewValues?.isDodging) {
        return 0
      }

      if (props.currentStatBlock.armorStatusModifiers['Modify Shield Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Modify Shield Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.currentStatBlock.armorStatusModifiers['Override Shield Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Override Shield Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }

      return Math.max(parseInt(props.currentStatBlock.shieldDvs + '') + modifier, 0)
    })

    const moveDvs: ComputedRef<number> = computed(() => {
      if (props.isEditing) {
        return props.currentStatBlock.moveDvs
      }
      let modifier = 0

      if (props.currentStatBlock.armorStatusModifiers['Modify Move Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Modify Move Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (props.currentStatBlock.armorStatusModifiers['Override Move Dvs']) {
        const max = Object.values(
          props.currentStatBlock.armorStatusModifiers['Override Move Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return props.isStunned || props.isPinned ? 0 : Math.max(max + modifier, 0)
        }
      }

      const perks = Object.values(props.currentStatBlock.perks)
      if (props.currentStatBlock?.overviewValues?.isDodging) {
        return props.isStunned || props.isPinned
          ? 0
          : perks.reduce((acc: number, perk: any) => (perk.rank > acc ? perk.rank : acc), 0) +
              15 +
              modifier
      }

      return props.isStunned || props.isPinned || props.isProne
        ? 0
        : props.currentStatBlock.moveDvs + modifier
    })
    const totalDvs = computed(() => {
      return moveDvs.value + armorDvs.value + shieldDvs.value + bonusDvs.value
    })
    const totalHp = computed(() => {
      let ret = props.currentStatBlock.totalHp
      if (props.currentStatBlock.minorBonuses) {
        ret = characterComputedStore.totalHp / 2
      }

      if (props.currentStatBlock.hpStatusModifiers['Override Base Hp']) {
        const max = Object.values(
          props.currentStatBlock.hpStatusModifiers['Override Base Hp']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          ret = max
        }
      }
      let modifier = 0

      if (props.currentStatBlock.hpStatusModifiers['Modify Base Hp']) {
        const max = Object.values(
          props.currentStatBlock.hpStatusModifiers['Modify Base Hp']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (props.currentStatBlock.currentHp > ret + modifier) {
        setCurrentAndBarrierHP(parseInt(ret + modifier + ''), props.currentStatBlock.barrierHp)
      }
      const hp = Math.max(ret + modifier, 0)
      return hp
    })

    const totalMana = computed(() => {
      let sum = props.currentStatBlock.totalMana

      if (props.currentStatBlock.manaStatusModifiers['override base mana']) {
        const max = Object.values(
          props.currentStatBlock.manaStatusModifiers['override base mana']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          sum = max
        }
      }
      let modifier = 0

      if (props.currentStatBlock.manaStatusModifiers['modify base mana']) {
        const baseModifier = props.currentStatBlock.manaStatusModifiers['modify base mana']

        if (baseModifier) {
          const arr = Object.values(baseModifier)
          const max = arr.reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )

          if (max != -1000) {
            modifier = modifier + max
          }
        }
      }

      if (props.currentStatBlock.currentMana > sum + modifier) {
        setCurrentMana(Math.min(parseInt(props.currentStatBlock.currentMana + ''), totalMana.value))
      }
      const m = sum + modifier
      return m
    })

    const mp = computed(() => {
      let sum = props.currentStatBlock.mp

      if (props.currentStatBlock.mpStatusModifiers['Override Mp']) {
        const max = Object.values(props.currentStatBlock.manaStatusModifiers['Override Mp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          sum = max
        }
      }
      let modifier = 0

      if (props.currentStatBlock.mpStatusModifiers['Modify Mp']) {
        const baseModifier = props.currentStatBlock.mpStatusModifiers['Modify Mp']

        if (baseModifier) {
          const arr = Object.values(baseModifier)
          const max = arr.reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )

          if (max != -1000) {
            modifier = modifier + max
          }
        }
      }

      const m = sum + modifier
      return m
    })

    function setCurrentMana(mana) {
      let newTemp = { ...props.currentStatBlock, currentMana: mana }
      props.updateTemp(newTemp)
    }
    function addNewMpStatusModifier(modifier) {
      const modRef = props.currentStatBlock.mpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      let newTemp = { ...props.currentStatBlock }
      newTemp.mpStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        newTemp.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'Mp: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      props.updateTemp(newTemp)
    }

    function setCurrentAndBarrierHP(currentHp: number, barrierHp: number) {
      let newTemp = { ...props.currentStatBlock }
      newTemp.currentHp = currentHp
      newTemp.barrierHp = barrierHp
      props.updateTemp(newTemp)
    }
    function addNewHpStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.hpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      newTemp.hpStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        newTemp.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'HP: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      props.updateTemp(newTemp)
    }

    function addNewManaStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.manaStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      newTemp.manaStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        newTemp.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'HP: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      props.updateTemp(newTemp)
    }

    function addNewArmorStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.armorStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      newTemp.armorStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        newTemp.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'HP: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      props.updateTemp(newTemp)
    }

    function setHp(current: any, total: any) {
      let newTemp = { ...props.currentStatBlock }
      newTemp.currentHp = parseInt(current + '')
      newTemp.totalHp = parseInt(total + '')
      props.updateTemp(newTemp)
    }
    function setMana(current: any, total: any) {
      let newTemp = { ...props.currentStatBlock }
      newTemp.currentMana = parseInt(current + '')
      newTemp.totalMana = parseInt(total + '')
      props.updateTemp(newTemp)
    }
    function setDvs(armor: any, shield: any, bonus: any, move: any) {
      let newTemp = { ...props.currentStatBlock }
      newTemp.armorDvs = parseInt(armor + '')
      newTemp.shieldDvs = parseInt(shield + '')
      newTemp.bonusDvs = parseInt(bonus + '')
      newTemp.moveDvs = parseInt(move + '')

      props.updateTemp(newTemp)
    }
    function setMp(mp: any) {
      let newTemp = { ...props.currentStatBlock }
      newTemp.mp = parseInt(mp + '')

      props.updateTemp(newTemp)
    }
    return {
      designStore,
      modal,
      userStore,
      wornArmorPassives,
      primaryHandheldPassives,
      secondaryHandheldPassives,
      props,
      totalDvs,
      setCurrentMana,
      addNewMpStatusModifier,
      setCurrentAndBarrierHP,
      addNewHpStatusModifier,
      addNewManaStatusModifier,
      addNewArmorStatusModifier,
      setHp,
      setMana,
      setDvs,
      setMp,
      armorDvs,
      bonusDvs,
      shieldDvs,
      moveDvs,
      totalHp,
      totalMana,
      mp
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
  <div>
    <div class="bannerTime">
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
            :setCurrentAndBarrier="setCurrentAndBarrierHP"
            :current-hp="props.currentStatBlock.currentHp"
            :barrier-hp="props.currentStatBlock.barrierHp"
            :hpStatusModifiers="props.currentStatBlock.hpStatusModifiers"
            :statusEffects="props.currentStatBlock.statusEffects"
            :traits="props.currentStatBlock.traits"
            :totalHp="totalHp"
            :removeHpStatusModifier="props.removeHpStatusModifier"
            :addNewHpStatusModifier="addNewHpStatusModifier"
            :isEditing="props.isEditing"
            class="bannerItem"
            :setHp="setHp"
          ></HpWidget>
          <ManaWidget
            :removeManaStatusModifier="props.removeManaStatusModifier"
            :addNewManaStatusModifier="addNewManaStatusModifier"
            :totalMana="totalMana"
            :customStatusEffects="props.currentStatBlock.customStatusEffects"
            :currentMana="props.currentStatBlock.currentMana"
            :traits="props.currentStatBlock.traits"
            :manaStatusModifiers="props.currentStatBlock.manaStatusModifiers"
            :setCurrentMana="setCurrentMana"
            :secondaryHandheldPassives="secondaryHandheldPassives"
            :primaryHandheldPassives="primaryHandheldPassives"
            :wornArmorPassives="wornArmorPassives"
            :isEditing="props.isEditing"
            :setMana="setMana"
            class="bannerItem"
          ></ManaWidget>
          <ArmorWidget
            :armorDvs="armorDvs"
            :moveDvs="moveDvs"
            :shieldDvs="shieldDvs"
            :bonusDvs="bonusDvs"
            :totalDvs="totalDvs"
            :traits="props.currentStatBlock.traits"
            :armorStatusModifiers="props.currentStatBlock.armorStatusModifiers"
            :secondaryHandheldPassives="secondaryHandheldPassives"
            :primaryHandheldPassives="primaryHandheldPassives"
            :wornArmorPassives="wornArmorPassives"
            :statusEffects="props.currentStatBlock.statusEffects"
            :wornArmor="props.currentStatBlock.equipment.wornArmor"
            :wornShield="''"
            :martialPerks="props.currentStatBlock.perks"
            :removeArmorStatusModifier="props.removeArmorStatusModifier"
            :addNewArmorStatusModifier="addNewArmorStatusModifier"
            :isEditing="props.isEditing"
            :setDvs="setDvs"
            class="bannerItem"
          ></ArmorWidget>
          <MPWidget
            :mpStatusModifiers="props.currentStatBlock.mpStatusModifiers"
            :addNewMpStatusModifier="addNewMpStatusModifier"
            :removeMpStatusModifier="props.removeMpStatusModifier"
            :getMp="mp"
            class="bannerItem"
            style="margin-left: 0.5rem"
            :isEditing="props.isEditing"
            :setMp="setMp"
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
    </div>
    <div class="mobileBannnerTime">
      <div class="mainMobileBannerContainer" :style="{ background: designStore.sidebarBacking }">
        <div class="bannerRowItemContainer" style="margin-left: -1.5rem">
          <HpWidget
            :secondaryHandheldPassives="secondaryHandheldPassives"
            :primaryHandheldPassives="primaryHandheldPassives"
            :wornArmorPassives="wornArmorPassives"
            :setCurrentAndBarrier="setCurrentAndBarrierHP"
            :current-hp="props.currentStatBlock.currentHp"
            :barrier-hp="props.currentStatBlock.barrierHp"
            :hpStatusModifiers="props.currentStatBlock.hpStatusModifiers"
            :statusEffects="props.currentStatBlock.statusEffects"
            :traits="props.currentStatBlock.traits"
            :totalHp="totalHp"
            :removeHpStatusModifier="props.removeHpStatusModifier"
            :addNewHpStatusModifier="addNewHpStatusModifier"
            :isEditing="props.isEditing"
            class="bannerRowItem"
            :setHp="setHp"
            style="margin-top: -0.5rem"
          ></HpWidget>
        </div>
        <div class="bannerRowItemContainer">
          <ManaWidget
            :removeManaStatusModifier="props.removeManaStatusModifier"
            :addNewManaStatusModifier="addNewManaStatusModifier"
            :totalMana="totalMana"
            :customStatusEffects="props.currentStatBlock.customStatusEffects"
            :currentMana="props.currentStatBlock.currentMana"
            :traits="props.currentStatBlock.traits"
            :manaStatusModifiers="props.currentStatBlock.manaStatusModifiers"
            :setCurrentMana="setCurrentMana"
            :secondaryHandheldPassives="secondaryHandheldPassives"
            :primaryHandheldPassives="primaryHandheldPassives"
            :wornArmorPassives="wornArmorPassives"
            :isEditing="props.isEditing"
            :setMana="setMana"
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
            :traits="props.currentStatBlock.traits"
            :armorStatusModifiers="props.currentStatBlock.armorStatusModifiers"
            :secondaryHandheldPassives="secondaryHandheldPassives"
            :primaryHandheldPassives="primaryHandheldPassives"
            :wornArmorPassives="wornArmorPassives"
            :statusEffects="props.currentStatBlock.statusEffects"
            :wornArmor="props.currentStatBlock.equipment.wornArmor"
            :wornShield="''"
            :martialPerks="props.currentStatBlock.perks"
            :removeArmorStatusModifier="props.removeArmorStatusModifier"
            :addNewArmorStatusModifier="addNewArmorStatusModifier"
            :isEditing="props.isEditing"
            :setDvs="setDvs"
            style="bottom: 0.75rem"
            class="bannerRowItem"
          ></ArmorWidget>
        </div>
        <div class="bannerRowItemContainer" style="padding-left: 0.25rem">
          <MPWidget
            :mpStatusModifiers="props.currentStatBlock.mpStatusModifiers"
            :addNewMpStatusModifier="addNewMpStatusModifier"
            :removeMpStatusModifier="props.removeMpStatusModifier"
            :getMp="mp"
            class="bannerRowItem"
            style="bottom: 1rem"
            :isEditing="props.isEditing"
            :setMp="setMp"
          ></MPWidget>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobileBannnerTime {
  display: none;
  width: 100%;
}
::-webkit-scrollbar {
  width: 1px; /* Adjust scrollbar width */
  height: 8px; /* Adjust scrollbar height */
}
.mainMobileBannerContainer {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  padding-left: 3.5rem;
  padding-top: 0.75rem;
  height: 10.5rem;
}
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
.bannerRowItem {
  position: relative;
  bottom: 0.5rem;
  transform: scale(0.8, 0.8);
  margin-left: -3rem;
  margin-top: -1rem;
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
@media (max-width: 800px) {
  .mobileBannnerTime {
    display: block;
  }
}
@media (max-width: 700px) {
  .bannerRowItemContainer {
    width: 5rem;
    height: 5rem;
    padding-bottom: 1rem;
  }
  .bannerRowItem {
    position: relative;
    bottom: 0.5rem;
    transform: scale(0.7, 0.7);
    margin-top: -1rem;
  }
  .mainMobileBannerContainer {
    padding-bottom: 0.75rem;
    padding-top: 0.5rem;
    padding-left: 0rem;
    height: 10rem;
  }
}
@media (max-width: 600px) {
  .mainMobileBannerContainer {
    padding-bottom: 0.75rem;
    padding-top: 0.5rem;
    height: 8.5rem;
  }
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

  @media (max-width: 550px) {
    .bannerRowItem {
      position: relative;
      bottom: 0.5rem;
      transform: scale(0.6, 0.6);
      margin-left: -3rem;
      margin-top: -1rem;
    }
    .mainMobileBannerContainer {
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
    .mainMobileBannerContainer {
      margin-bottom: -0.5rem;
      margin-top: -0.5rem;
      padding-left: 1rem;
    }
  }

  .bannerRowItemContainer {
    width: 6rem;
    height: 6rem;
    padding-bottom: 1rem;
  }
}
</style>
