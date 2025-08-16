<script lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../stores/designStore'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import StatBlockQuickReference from './StatBlockQuickReference.vue'
import { ComputedRef } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'
import { useRoute, useRouter } from 'vue-router'
import { useAdventureStore } from '@/stores/adventureStore'
import { clearIndexedDbPersistence } from 'firebase/firestore'
import { usePartyStore } from '@/stores/partyStore'
import { idText } from 'typescript'

export default {
  emits: ['render'],
  props: ['character', 'editable', 'initiative'],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()

    const adventureStore = useAdventureStore()
    const userId = computed(() => {
      const cIds = adventureStore.characterIds
      for (let i = 0; i < cIds.length; i++) {
        if (cIds[i] === props.character.id) {
          return adventureStore.userIds[i]
        }
      }
      return ''
    })
    const wornArmorPassives = computed(() => {
      return (
        props.character.equipment.items.Armor[props.character.equipment.wornArmor]?.equippedStats
          ?.passives || {}
      )
    })

    const primaryHandheldPassives = computed(() => {
      return (
        props.character.equipment.items.Weapon[props.character.equipment.primaryHand]?.equippedStats
          ?.passives || {}
      )
    })

    const secondaryHandheldPassives = computed(() => {
      return (
        props.character.equipment.items.Shield[props.character.equipment.secondaryHand]
          ?.equippedStats?.passives ||
        props.character.equipment.items.Weapon[props.character.equipment.secondaryHand]
          ?.equippedStats?.passives ||
        {}
      )
    })

    function getPerkAndSkillGain() {
      const perks = props.character.perkGain
      let perkBonus = 0
      if (perks[0] == 'movespeed') {
        perkBonus += 2
      }
      if (perks[1] == 'movespeed') {
        perkBonus += 4
      }
      if (perks[2] == 'movespeed') {
        perkBonus += 6
      }
      if (perks[3] == 'movespeed') {
        perkBonus += 8
      }
      if (perks[4] == 'movespeed') {
        perkBonus += 10
      }
      return perkBonus
    }

    function getPerkAndSkillGainHp() {
      const perks = props.character.perkGain || ['', '', '', '', '']
      let perkBonus = 0
      if (perks[0] == 'hitpoints') {
        perkBonus += 3
      }
      if (perks[1] == 'hitpoints') {
        perkBonus += 6
      }
      if (perks[2] == 'hitpoints') {
        perkBonus += 9
      }
      if (perks[3] == 'hitpoints') {
        perkBonus += 12
      }
      if (perks[4] == 'hitpoints') {
        perkBonus += 15
      }
      return perkBonus
    }

    const totalHp = computed(() => {
      let ret = 0
      const level = Math.floor(props.character.totalAbilityPoints / 10)
      if (level < 3) {
        ret = 10 + level * 8
      } else if (level < 15) {
        ret = 34 + (level - 3) * 4
      } else if (level < 40) {
        ret = 82 + (level - 15) * 2
      } else {
        ret = Math.floor(152 + (level - 40) * 0.1)
      }
      ret += getPerkAndSkillGainHp()
      if (props.character.traits['Modified HP']) {
        ret += parseInt(props.character.traits['Modified HP'].number)
      }
      if (wornArmorPassives.value['Override Base Hp']) {
        ret = parseInt(wornArmorPassives.value['Override Base Hp'].modAmount)
      }
      if (primaryHandheldPassives.value['Override Base Hp']) {
        ret = parseInt(primaryHandheldPassives.value['Override Base Hp'].modAmount)
      }
      if (secondaryHandheldPassives.value['Override Base Hp']) {
        ret = parseInt(secondaryHandheldPassives.value['Override Base Hp'].modAmount)
      }
      if (props.character.hpStatusModifiers['Override Base Hp']) {
        const max = Object.values(props.character.hpStatusModifiers['Override Base Hp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          ret = max
        }
      }
      let modifier = -1000
      if (wornArmorPassives.value['Modify Base Hp']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Base Hp']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Base Hp']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Base Hp']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Base Hp']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Base Hp']?.modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }

      if (props.character.hpStatusModifiers['Modify Base Hp']) {
        const max = Object.values(props.character.hpStatusModifiers['Modify Base Hp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      const hp = Math.max(ret + modifier, 0)
      // props.character.setTotalHp(hp)
      return hp
    })

    const totalMana = computed(() => {
      let sum = 0
      sum += props.character.arcaneBattery * 2
      const groups: Array<any> = Object.values(props.character.spellgroups)
      groups.forEach((spellgroup: any) => {
        const maxRank = Object.values(spellgroup?.spells)?.reduce(
          (acc: number, spell: any) => (spell.rank > acc ? spell.rank : acc),
          0
        )

        sum += spellgroup?.manaGain * maxRank
      })

      if (props.character.traits['Modified Mana']) {
        sum += parseInt(props.character.traits['Modified Mana'].number)
      }

      if (wornArmorPassives.value['Override Base Mana']) {
        sum = parseInt(wornArmorPassives.value['Override Base Mana'].modAmount)
      }

      if (primaryHandheldPassives.value['Override Base Mana']) {
        sum = parseInt(primaryHandheldPassives.value['Override Base Mana'].modAmount)
      }
      if (secondaryHandheldPassives.value['Override Base Mana']) {
        sum = parseInt(secondaryHandheldPassives.value['Override Base Mana'].modAmount)
      }
      if (props.character.manaStatusModifiers['override base mana']) {
        const max = Object.values(props.character.manaStatusModifiers['override base mana']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          sum = max
        }
      }
      let modifier = -1000
      if (wornArmorPassives.value['Modify Base Mana']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Base Mana'].modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Base Mana']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Base Mana'].modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Base Mana']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Base Mana'].modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }

      if (props.character.manaStatusModifiers['modify base mana']) {
        const baseModifier = props.character.manaStatusModifiers['modify base mana']

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
      // props.character.setTotalMana(m)
      return m
    })

    const wornArmor = computed(() => {
      return (
        props.character.equipment.items.Armor[props.character.equipment.wornArmor] || {
          equippedStats: { value: 0 },
          name: 'No Armor'
        }
      )
    })

    const wornShield = computed(() => {
      return (
        props.character.equipment.items.Shield[props.character.equipment.secondaryHand] || {
          equippedStats: { value: 0 },
          name: 'No Shield'
        }
      )
    })

    const isPinned: ComputedRef<boolean> = computed(() => {
      return props.character.statusEffects['Pinned']?.description.length > 0 ? true : false
    })
    const isStunned: ComputedRef<boolean> = computed(() => {
      return props.character.statusEffects['Stunned']?.description.length > 0 ? true : false
    })

    const isProne: ComputedRef<boolean> = computed(() => {
      return props.character.statusEffects['Prone']?.description.length > 0 ? true : false
    })

    const isSlowed: ComputedRef<boolean> = computed(() => {
      return props.character.statusEffects['Slowed']?.description.length > 0 ? true : false
    })

    const moveDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (wornArmorPassives.value['Modify Move Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Move Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Move Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Move Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Move Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Move Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }
      if (props.character.armorStatusModifiers['Modify Move Dvs']) {
        const max = Object.values(props.character.armorStatusModifiers['Modify Move Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (props.character.armorStatusModifiers['Override Move Dvs']) {
        const max = Object.values(props.character.armorStatusModifiers['Override Move Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return isStunned.value || isPinned.value ? 0 : Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Move Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : parseInt(wornArmorPassives.value['Override Move Dvs']?.modAmount) + modifier
      }
      if (primaryHandheldPassives.value['Override Move Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : parseInt(primaryHandheldPassives.value['Override Move Dvs']?.modAmount) + modifier
      }
      if (secondaryHandheldPassives.value['Override Move Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : parseInt(secondaryHandheldPassives.value['Override Move Dvs']?.modAmount) + modifier
      }
      const perks = Object.values(props.character.martialPerks || {})
      if (props.character.overviewValues.isDodging) {
        return isStunned.value || isPinned.value
          ? 0
          : perks.reduce((acc: number, perk: any) => (perk.rank > acc ? perk.rank : acc), 0) +
              15 +
              modifier
      }

      if (props.character.traits['Movement Dvs']) {
        return isStunned.value || isPinned.value
          ? 0
          : Math.max(parseInt(props.character.traits['Movement Dvs'].number) + modifier)
      }
      return isStunned.value || isPinned.value || isProne.value ? 0 : 10 + modifier
    })
    const armorDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (props.character.overviewValues.isDodging) {
        return 0
      }
      if (wornArmorPassives.value['Modify Armor Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Armor Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Armor Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Armor Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Armor Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Armor Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier === -1000) {
        modifier = 0
      }

      if (props.character.armorStatusModifiers['Modify Armor Dvs']) {
        const max = Object.values(props.character.armorStatusModifiers['Modify Armor Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (props.character.armorStatusModifiers['Override Armor Dvs']) {
        const max = Object.values(
          props.character.armorStatusModifiers['Override Armor Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Armor Dvs']) {
        return Math.max(
          parseInt(wornArmorPassives.value['Override Armor Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (primaryHandheldPassives.value['Override Armor Dvs']) {
        return Math.max(
          parseInt(primaryHandheldPassives.value['Override Armor Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (secondaryHandheldPassives.value['Override Armor Dvs']) {
        return Math.max(
          parseInt(secondaryHandheldPassives.value['Override Armor Dvs']?.modAmount) + modifier,
          0
        )
      }

      if (props.character.traits['Armor Dvs']) {
        return Math.max(
          Math.max(
            parseInt(props.character.traits['Armor Dvs'].number) + modifier,
            parseInt(wornArmor.value.equippedStats?.value + '')
          ),
          0
        )
      }
      return Math.max(parseInt(wornArmor.value.equippedStats?.value + '') + modifier, 0)
    })

    const bonusDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (wornArmorPassives.value['Modify Bonus Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Bonus Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Bonus Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Bonus Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Bonus Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Bonus Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier === -1000) {
        modifier = 0
      }
      if (props.character.armorStatusModifiers['Modify Bonus Dvs']) {
        const max = Object.values(props.character.armorStatusModifiers['Modify Bonus Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.character.armorStatusModifiers['Override Bonus Dvs']) {
        const max = Object.values(
          props.character.armorStatusModifiers['Override Bonus Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Bonus Dvs']) {
        return Math.max(
          parseInt(wornArmorPassives.value['Override Bonus Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (primaryHandheldPassives.value['Override Bonus Dvs']) {
        return Math.max(
          parseInt(primaryHandheldPassives.value['Override Bonus Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (secondaryHandheldPassives.value['Override Bonus Dvs']) {
        return Math.max(
          parseInt(secondaryHandheldPassives.value['Override Bonus Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (props.character.traits['Bonus Dvs']) {
        return Math.max(parseInt(props.character.traits['Bonus Dvs'].number) + modifier, 0)
      }
      return Math.max(modifier, 0)
    })

    const shieldDvs: ComputedRef<number> = computed(() => {
      let modifier = -1000
      if (props.character.overviewValues.isDodging) {
        return 0
      }
      if (wornArmorPassives.value['Modify Shield Dvs']) {
        modifier = Math.max(
          parseInt(wornArmorPassives.value['Modify Shield Dvs']?.modAmount),
          modifier
        )
      }
      if (primaryHandheldPassives.value['Modify Shield Dvs']) {
        modifier = Math.max(
          parseInt(primaryHandheldPassives.value['Modify Shield Dvs']?.modAmount),
          modifier
        )
      }
      if (secondaryHandheldPassives.value['Modify Shield Dvs']) {
        modifier = Math.max(
          parseInt(secondaryHandheldPassives.value['Modify Shield Dvs']?.modAmount),
          modifier
        )
      }
      if (modifier === -1000) {
        modifier = 0
      }
      if (props.character.armorStatusModifiers['Modify Shield Dvs']) {
        const max = Object.values(props.character.armorStatusModifiers['Modify Shield Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.character.armorStatusModifiers['Override Shield Dvs']) {
        const max = Object.values(
          props.character.armorStatusModifiers['Override Shield Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }
      if (wornArmorPassives.value['Override Shield Dvs']) {
        return Math.max(
          parseInt(wornArmorPassives.value['Override Shield Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (primaryHandheldPassives.value['Override Shield Dvs']) {
        return Math.max(
          parseInt(primaryHandheldPassives.value['Override Shield Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (secondaryHandheldPassives.value['Override Shield Dvs']) {
        return Math.max(
          parseInt(secondaryHandheldPassives.value['Override Shield Dvs']?.modAmount) + modifier,
          0
        )
      }
      if (props.character.traits['Shield Dvs']) {
        return Math.max(
          Math.max(
            props.character.traits['Shield Dvs'].number + modifier,
            parseInt(wornShield.value.equippedStats?.value + '')
          ),
          0
        )
      }
      return Math.max(parseInt(wornShield.value.equippedStats?.value + '') + modifier, 0)
    })
    const totalDvs: ComputedRef<number> = computed(() => {
      return (
        parseInt(armorDvs.value + '') +
        parseInt(shieldDvs.value + '') +
        parseInt(moveDvs.value + '') +
        parseInt(bonusDvs.value + '')
      )
    })

    function edit() {
      context.emit('render')
      useCharacterStore().setCharacterFromAdventure(props.character)
    }
    function removeStatus(name) {
      usePartyStore().removeStatus(name, props.character.id, userId.value)
    }
    function removeCustomStatus(name) {
      usePartyStore().removeCustomStatus(name, props.character.id, userId.value)
    }
    function addStatus(
      basicStatus,
      basicCheckToBreak,
      basicDuration,
      basicStatusRank,
      icon,
      description,
      damageType,
      id
    ) {
      usePartyStore().addBasicStatus(
        basicStatus,
        {
          name: basicStatus,
          checkToBreak: basicCheckToBreak,
          duration: basicDuration,
          icon: icon,
          damageType: damageType,
          description: description,
          linkedModifiers: [],
          isBasic: true,
          rank: basicStatusRank
        },
        id,
        userId.value
      )
    }
    function addCustomStatus(status, checkToBreak, duration, icon, description, id) {
      usePartyStore().addCustomStatus(
        {
          name: status,
          checkToBreak: checkToBreak,
          duration: duration,
          icon: icon,
          description: description,
          linkedModifiers: [],
          isBasic: false
        },
        id,
        userId.value
      )
    }
    return {
      designStore,
      modal,
      props,
      totalHp,
      wornArmorPassives,
      secondaryHandheldPassives,
      primaryHandheldPassives,
      totalMana,
      totalDvs,
      edit,
      addStatus,
      removeStatus,
      addCustomStatus,
      removeCustomStatus,
      adventureStore
    }
  },
  components: {
    StatBlockQuickReference
  }
}
</script>

<template>
  <div style="height: fit-content">
    <StatBlockQuickReference
      :id="props.character.id"
      :image="props.character.image"
      :name="props.character.name"
      :archetype="props.character.archetype"
      :level="Math.floor(props.character.totalAbilityPoints / 10)"
      :statusEffects="props.character.statusEffects"
      :currentHp="props.character.currentHp"
      :totalHp="totalHp"
      :currentMana="props.character.currentMana"
      :totalMana="totalMana"
      :secondaryHandheldPassives="secondaryHandheldPassives"
      :primaryHandheldPassives="primaryHandheldPassives"
      :wornArmorPassives="wornArmorPassives"
      :wornArmor="props.character.wornArmor"
      :wornShield="props.character.wornShield"
      :totalDvs="totalDvs"
      :armorStatusModifiers="{}"
      :addNewArmorStatusModifier="() => {}"
      :removeArmorStatusModifier="() => {}"
      :traits="props.character.traits || {}"
      :editable="props.editable"
      :edit="edit"
      :addStatus="addStatus"
      :addCustomStatus="addCustomStatus"
      :removeCustomStatus="removeCustomStatus"
      :customStatusEffects="props.character.customStatusEffects"
      :removeStatus="removeStatus"
      :initiative="props.initiative"
      :changeInitiative="adventureStore.addCharacterInitiative"
      :agi="props.character.attributes.agility"
      :keyVal="props.character.id"
    ></StatBlockQuickReference>
  </div>
</template>

<style></style>
