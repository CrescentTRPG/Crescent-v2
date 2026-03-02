import { db } from '@/firebase/config.js'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { computed, ComputedRef } from 'vue'
import { useCharacterStore } from './characterStore.js'
import { useMartialPerksStore } from './martialPerksStore.js'
import { useSkillStore } from './skillsStore.js'
import { useEquipmentStore } from './equipmentStore.js'
import { useSpellStore } from './spellsStore.js'
export const useCharacterComputedStore = defineStore('characterComputed', () => {
  const characterStore = useCharacterStore()
  const martialPerksStore = useMartialPerksStore()
  const skillsStore = useSkillStore()
  const equipmentStore = useEquipmentStore()
  const wornArmorPassives = computed(() => {
    return (
      equipmentStore.equipment.items.Armor[equipmentStore.equipment.wornArmor]?.equippedStats
        ?.passives || {}
    )
  })

  const primaryHandheldPassives = computed(() => {
    return (
      equipmentStore.equipment.items.Weapon[equipmentStore.equipment.primaryHand]?.equippedStats
        ?.passives || {}
    )
  })

  const secondaryHandheldPassives = computed(() => {
    return (
      equipmentStore.equipment.items.Shield[equipmentStore.equipment.secondaryHand]?.equippedStats
        ?.passives ||
      equipmentStore.equipment.items.Weapon[equipmentStore.equipment.secondaryHand]?.equippedStats
        ?.passives ||
      {}
    )
  })
  function getPerkAndSkillGainHp() {
    const perks = martialPerksStore.perkGain
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

    const skillBonus = skillsStore.skills['Fitness']?.skill
      ? skillsStore.skills['Fitness'].rank * 3
      : 0
    return perkBonus + skillBonus
  }
  function setNewCurrentHpValue(val = characterStore.currentHp) {
    const finalBarrier = characterStore.barrierHp

    characterStore.setCurrentAndBarrierHP(Math.min(parseInt(val + ''), totalHp.value), finalBarrier)
  }
  const totalHp = computed(() => {
    let ret = 0
    const level = Math.floor(characterStore.totalAbilityPoints / 10)
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
    if (characterStore.traits['Modified HP']) {
      ret += parseInt(characterStore.traits['Modified HP'].number)
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
    if (characterStore.hpStatusModifiers['Override Base Hp']) {
      const max = Object.values(characterStore.hpStatusModifiers['Override Base Hp']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        0
      )
      if (max > 0) {
        ret = max
      }
    }
    let modifier = -1000
    if (wornArmorPassives.value['Modify Base Hp']) {
      modifier = Math.max(parseInt(wornArmorPassives.value['Modify Base Hp']?.modAmount), modifier)
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

    if (characterStore.hpStatusModifiers['Modify Base Hp']) {
      const max = Object.values(characterStore.hpStatusModifiers['Modify Base Hp']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier = modifier + max
      }
    }
    if (characterStore.currentHp > ret + modifier) {
      setNewCurrentHpValue(parseInt(ret + modifier + ''))
    }
    const hp = Math.max(ret + modifier, 0)
    // characterStore.setTotalHp(hp)
    return hp
  })
  const unmoddedTotalHp = computed(() => {
    let ret = 0
    const level = Math.floor(characterStore.totalAbilityPoints / 10)
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
    let modifier = -1000
    if (wornArmorPassives.value['Modify Base Hp']) {
      modifier = Math.max(parseInt(wornArmorPassives.value['Modify Base Hp']?.modAmount), modifier)
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

    if (characterStore.currentHp > ret + modifier) {
      setNewCurrentHpValue(parseInt(ret + modifier + ''))
    }
    const hp = Math.max(ret + modifier, 0)
    // characterStore.setTotalHp(hp)
    return hp
  })
  const spellStore = useSpellStore()
  const totalMana = computed(() => {
    let sum = 0
    sum += spellStore.arcaneBattery * 2
    const groups: Array<any> = Object.values(spellStore.spellgroups)
    groups.forEach((spellgroup: any) => {
      let maxRank = Object.values(spellgroup?.spells)?.reduce(
        (acc: number, spell: any) => (spell.rank > acc ? spell.rank : acc),
        0
      )
      if (!spellgroup.inOrder && spellgroup.flatCost) {
        maxRank = Object.values(spellgroup?.spells)?.reduce((acc: number, spell: any) => acc + 1, 0)
      }

      sum += spellgroup?.manaGain * maxRank
    })

    if (characterStore.traits['Modified Mana']) {
      sum += parseInt(characterStore.traits['Modified Mana'].number)
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
    if (characterStore.manaStatusModifiers['override base mana']) {
      const max = Object.values(characterStore.manaStatusModifiers['override base mana']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        0
      )
      if (max > 0) {
        sum = max
      }
    }
    let modifier = -1000
    if (wornArmorPassives.value['Modify Base Mana']) {
      modifier = Math.max(parseInt(wornArmorPassives.value['Modify Base Mana'].modAmount), modifier)
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

    if (characterStore.manaStatusModifiers['modify base mana']) {
      const baseModifier = characterStore.manaStatusModifiers['modify base mana']

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

    if (characterStore.currentMana > sum + modifier) {
      characterStore.setCurrentMana(
        Math.min(parseInt(characterStore.currentMana + ''), totalMana.value)
      )
    }
    const m = sum + modifier
    // characterStore.setTotalMana(m)
    return m
  })

  const wornArmor = computed(() => {
    return (
      equipmentStore.equipment.items.Armor[equipmentStore.equipment.wornArmor] || {
        equippedStats: { value: 0 },
        name: 'No Armor'
      }
    )
  })

  const wornShield = computed(() => {
    return (
      equipmentStore.equipment.items.Shield[equipmentStore.equipment.secondaryHand] || {
        equippedStats: { value: 0 },
        name: 'No Shield'
      }
    )
  })

  const isPinned: ComputedRef<boolean> = computed(() => {
    return characterStore.statusEffects['Pinned']?.description.length > 0 ? true : false
  })
  const isStunned: ComputedRef<boolean> = computed(() => {
    return characterStore.statusEffects['Stunned']?.description.length > 0 ? true : false
  })

  const isProne: ComputedRef<boolean> = computed(() => {
    return characterStore.statusEffects['Prone']?.description.length > 0 ? true : false
  })

  const isSlowed: ComputedRef<boolean> = computed(() => {
    return characterStore.statusEffects['Slowed']?.description.length > 0 ? true : false
  })

  const moveDvs: ComputedRef<number> = computed(() => {
    let modifier = -1000
    if (wornArmorPassives.value['Modify Move Dvs']) {
      modifier = Math.max(parseInt(wornArmorPassives.value['Modify Move Dvs']?.modAmount), modifier)
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
    if (characterStore.armorStatusModifiers['Modify Move Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Modify Move Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier = modifier + max
      }
    }
    if (characterStore.armorStatusModifiers['Override Move Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Override Move Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
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
    const perks = Object.values(martialPerksStore.martialPerks)
    if (
      martialPerksStore.martialPerks['Dodging']?.known &&
      characterStore.overviewValues.isDodging
    ) {
      return isStunned.value || isPinned.value
        ? 0
        : perks.reduce((acc: number, perk: any) => (perk.rank > acc ? perk.rank : acc), 0) +
            15 +
            modifier
    }

    if (characterStore.traits['Movement Dvs']) {
      return isStunned.value || isPinned.value
        ? 0
        : Math.max(parseInt(characterStore.traits['Movement Dvs'].number) + modifier)
    }
    return isStunned.value || isPinned.value || isProne.value ? 0 : 10 + modifier
  })
  const armorDvs: ComputedRef<number> = computed(() => {
    let modifier = -1000
    if (
      martialPerksStore.martialPerks['Dodging']?.known &&
      characterStore.overviewValues.isDodging
    ) {
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

    if (characterStore.armorStatusModifiers['Modify Armor Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Modify Armor Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier = modifier + max
      }
    }
    if (characterStore.armorStatusModifiers['Override Armor Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Override Armor Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
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

    if (characterStore.traits['Armor Dvs']) {
      return Math.max(
        Math.max(
          parseInt(characterStore.traits['Armor Dvs'].number) + modifier,
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
    if (characterStore.armorStatusModifiers['Modify Bonus Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Modify Bonus Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier = modifier + max
      }
    }

    if (characterStore.armorStatusModifiers['Override Bonus Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Override Bonus Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
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
    if (characterStore.traits['Bonus Dvs']) {
      return Math.max(parseInt(characterStore.traits['Bonus Dvs'].number) + modifier, 0)
    }
    return Math.max(modifier, 0)
  })

  const shieldDvs: ComputedRef<number> = computed(() => {
    let modifier = -1000
    if (
      martialPerksStore.martialPerks['Dodging']?.known &&
      characterStore.overviewValues.isDodging
    ) {
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
    if (characterStore.armorStatusModifiers['Modify Shield Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Modify Shield Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier = modifier + max
      }
    }

    if (characterStore.armorStatusModifiers['Override Shield Dvs']) {
      const max = Object.values(characterStore.armorStatusModifiers['Override Shield Dvs']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
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
    if (characterStore.traits['Shield Dvs']) {
      return Math.max(
        Math.max(
          characterStore.traits['Shield Dvs'].number + modifier,
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
  function getPerkAndSkillGain() {
    const perks = martialPerksStore.perkGain
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

    const skillBonus = skillsStore.skills['Acrobatics']?.skill
      ? skillsStore.skills['Acrobatics'].rank * 2
      : 0
    return perkBonus + skillBonus
  }

  const base: ComputedRef<number> = computed(() => {
    let modifier = -1000
    const perkAndSkillGain = getPerkAndSkillGain()
    if (wornArmorPassives.value['Modify Movespeed']) {
      modifier = Math.max(
        parseInt(wornArmorPassives.value['Modify Movespeed']?.modAmount),
        modifier
      )
    }
    if (secondaryHandheldPassives.value['Modify Movespeed']) {
      modifier = Math.max(
        parseInt(secondaryHandheldPassives.value['Modify Movespeed']?.modAmount),
        modifier
      )
    }
    if (primaryHandheldPassives.value['Modify Movespeed']) {
      modifier = Math.max(
        parseInt(primaryHandheldPassives.value['Modify Movespeed']?.modAmount),
        modifier
      )
    }
    if (modifier === -1000) {
      modifier = 0
    }
    if (characterStore.movementStatusModifiers['Modify Base']) {
      const max = Object.values(characterStore.movementStatusModifiers['Modify Base']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier = modifier + max
      }
    }

    if (characterStore.movementStatusModifiers['Override Base']) {
      const max = Object.values(characterStore.movementStatusModifiers['Override Base']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        0
      )
      if (max > 0) {
        return isPinned.value || isStunned.value
          ? 0
          : isProne.value || isSlowed.value
            ? Math.floor(Math.max(max + modifier, 0) / 2)
            : Math.max(max + modifier, 0)
      }
    }
    if (wornArmorPassives.value['Override Movespeed']) {
      const speed = parseInt(wornArmorPassives.value['Override Movespeed']?.modAmount)
      return isPinned.value || isStunned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor(Math.max(speed + modifier, 0) / 2)
          : Math.max(speed + modifier, 0)
    }
    if (secondaryHandheldPassives.value['Override Movespeed']) {
      const speed = parseInt(secondaryHandheldPassives.value['Override Movespeed']?.modAmount)
      return isPinned.value || isStunned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor(Math.max(speed + modifier, 0) / 2)
          : Math.max(speed + modifier, 0)
    }
    if (primaryHandheldPassives.value['Override Movespeed']) {
      const speed = parseInt(primaryHandheldPassives.value['Override Movespeed']?.modAmount)
      return isPinned.value || isStunned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.floor(Math.max(speed + modifier, 0) / 2)
          : Math.max(speed + modifier, 0)
    }

    if (characterStore.traits['Modified Movespeed']) {
      return isPinned.value || isStunned.value
        ? 0
        : isProne.value || isSlowed.value
          ? Math.max(
              parseInt(characterStore.traits['Modified Movespeed'].number) +
                modifier +
                perkAndSkillGain +
                30
            ) / 2
          : Math.max(
              parseInt(characterStore.traits['Modified Movespeed'].number) +
                modifier +
                perkAndSkillGain +
                30
            )
    }
    return isStunned.value || isPinned.value
      ? 0
      : isProne.value || isSlowed.value
        ? Math.floor((30 + modifier + perkAndSkillGain) / 2)
        : 30 + modifier + perkAndSkillGain
  })

  const flight: ComputedRef<number> = computed(() => {
    let speed = 0
    let modifier = -1000
    if (wornArmorPassives.value['Modify Flightspeed']) {
      modifier = Math.max(
        parseInt(wornArmorPassives.value['Modify Flightspeed']?.modAmount),
        modifier
      )
    }
    if (secondaryHandheldPassives.value['Modify Flightspeed']) {
      modifier = Math.max(
        parseInt(secondaryHandheldPassives.value['Modify Flightspeed']?.modAmount),
        modifier
      )
    }
    if (primaryHandheldPassives.value['Modify Flightspeed']) {
      modifier = Math.max(
        parseInt(primaryHandheldPassives.value['Modify Flightspeed']?.modAmount),
        modifier
      )
    }

    if (modifier === -1000) {
      modifier = 0
    }
    if (characterStore.traits['Flight ']) {
      speed = parseInt(characterStore.traits['Flight Speed'].number)
    }
    if (characterStore.traits['Flight Speed']) {
      speed += parseInt(characterStore.traits['Flight Speed'].number)
    }

    if (characterStore.movementStatusModifiers['Override Flight']) {
      const max = Object.values(characterStore.movementStatusModifiers['Override Flight']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        0
      )
      if (max > 0) {
        speed = max
      }
    }
    if (wornArmorPassives.value['Override Flightspeed']) {
      speed = parseInt(wornArmorPassives.value['Override Flightspeed']?.modAmount)
    }
    if (secondaryHandheldPassives.value['Override Flightspeed']) {
      speed = parseInt(secondaryHandheldPassives.value['Override Flightspeed']?.modAmount)
    }
    if (primaryHandheldPassives.value['Override Flightspeed']) {
      speed = parseInt(primaryHandheldPassives.value['Override Flightspeed']?.modAmount)
    }
    if (characterStore.movementStatusModifiers['Modify Flight']) {
      const max = Object.values(characterStore.movementStatusModifiers['Modify Flight']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier += max
      }
    }
    if (speed > 0) {
      speed += getPerkAndSkillGain()
    }
    if (characterStore.statusEffects['Ethereal']) {
      speed = base.value
    }
    speed += modifier

    return isStunned.value || isPinned.value
      ? 0
      : isProne.value || isSlowed.value
        ? Math.floor(speed / 2)
        : speed
  })
  const climbing: ComputedRef<number> = computed(() => {
    let speed = 0
    let modifier = -1000
    if (wornArmorPassives.value['Modify Climbspeed']) {
      modifier = Math.max(
        parseInt(wornArmorPassives.value['Modify Climbspeed']?.modAmount),
        modifier
      )
    }
    if (secondaryHandheldPassives.value['Modify Climbspeed']) {
      modifier = Math.max(
        parseInt(secondaryHandheldPassives.value['Modify Climbspeed']?.modAmount),
        modifier
      )
    }
    if (primaryHandheldPassives.value['Modify Climbspeed']) {
      modifier = Math.max(
        parseInt(primaryHandheldPassives.value['Modify Climbspeed']?.modAmount),
        modifier
      )
    }

    if (modifier === -1000) {
      modifier = 0
    }
    if (characterStore.traits['Climbing Speed']) {
      speed = parseInt(characterStore.traits['Climbing Speed'].number)
    }
    if (characterStore.movementStatusModifiers['Override Climb']) {
      const max = Object.values(characterStore.movementStatusModifiers['Override Climb']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        0
      )
      if (max > 0) {
        speed = max
      }
    }
    if (characterStore.traits['Climbing Speed']) {
      speed += parseInt(characterStore.traits['Climbing Speed'].number)
    }
    if (wornArmorPassives.value['Override Climbspeed']) {
      speed = parseInt(wornArmorPassives.value['Override Climbspeed']?.modAmount)
    }
    if (secondaryHandheldPassives.value['Override Climbspeed']) {
      speed = parseInt(secondaryHandheldPassives.value['Override Climbspeed']?.modAmount)
    }
    if (primaryHandheldPassives.value['Override Climbspeed']) {
      speed = parseInt(primaryHandheldPassives.value['Override Climbspeed']?.modAmount)
    }
    if (characterStore.movementStatusModifiers['Modify Climb']) {
      const max = Object.values(characterStore.movementStatusModifiers['Modify Climb']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier += max
      }
    }
    speed += modifier
    if (speed > 0) {
      speed += getPerkAndSkillGain()
    }

    return isStunned.value || isPinned.value
      ? 0
      : isProne.value || isSlowed.value
        ? Math.floor(speed / 2)
        : speed
  })
  const swimming: ComputedRef<number> = computed(() => {
    let speed = 0
    let modifier = -1000
    if (wornArmorPassives.value['Modify Swimspeed']) {
      modifier = Math.max(
        parseInt(wornArmorPassives.value['Modify Swimspeed']?.modAmount),
        modifier
      )
    }
    if (secondaryHandheldPassives.value['Modify Swimspeed']) {
      modifier = Math.max(
        parseInt(secondaryHandheldPassives.value['Modify Swimspeed']?.modAmount),
        modifier
      )
    }
    if (primaryHandheldPassives.value['Modify Swimspeed']) {
      modifier = Math.max(
        parseInt(primaryHandheldPassives.value['Modify Swimspeed']?.modAmount),
        modifier
      )
    }

    if (modifier === -1000) {
      modifier = 0
    }
    if (characterStore.traits['Swim Speed']) {
      speed = parseInt(characterStore.traits['Swim Speed'].number)
    }
    if (characterStore.movementStatusModifiers['Override Swim']) {
      const max = Object.values(characterStore.movementStatusModifiers['Override Swim']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        0
      )
      if (max > 0) {
        speed = max
      }
    }
    if (wornArmorPassives.value['Override Swimspeed']) {
      speed = parseInt(wornArmorPassives.value['Override Swimspeed']?.modAmount)
    }
    if (secondaryHandheldPassives.value['Override Swimspeed']) {
      speed = parseInt(secondaryHandheldPassives.value['Override Swimspeed']?.modAmount)
    }
    if (primaryHandheldPassives.value['Override Swimspeed']) {
      speed = parseInt(primaryHandheldPassives.value['Override Swimspeed']?.modAmount)
    }
    if (characterStore.movementStatusModifiers['Modify Swim']) {
      const max = Object.values(characterStore.movementStatusModifiers['Modify Swim']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier += max
      }
    }
    speed += modifier
    if (speed > 0) {
      speed += getPerkAndSkillGain()
    }

    return isStunned.value || isPinned.value
      ? 0
      : isProne.value || isSlowed.value
        ? Math.floor(speed / 2)
        : speed
  })
  const burrowing: ComputedRef<number> = computed(() => {
    let speed = 0
    let modifier = -1000
    if (wornArmorPassives.value['Modify Burrowspeed']) {
      modifier = Math.max(
        parseInt(wornArmorPassives.value['Modify Burrowspeed']?.modAmount),
        modifier
      )
    }
    if (secondaryHandheldPassives.value['Modify Burrowspeed']) {
      modifier = Math.max(
        parseInt(secondaryHandheldPassives.value['Modify Burrowspeed']?.modAmount),
        modifier
      )
    }
    if (primaryHandheldPassives.value['Modify Burrowspeed']) {
      modifier = Math.max(
        parseInt(primaryHandheldPassives.value['Modify Burrowspeed']?.modAmount),
        modifier
      )
    }

    if (modifier === -1000) {
      modifier = 0
    }
    if (characterStore.traits['Burrowing Speed']) {
      speed = parseInt(characterStore.traits['Burrowing Speed'].number)
    }
    if (characterStore.movementStatusModifiers['Override Burrow']) {
      const max = Object.values(characterStore.movementStatusModifiers['Override Burrow']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        0
      )
      if (max > 0) {
        speed = max
      }
    }
    if (wornArmorPassives.value['Override Burrowspeed']) {
      speed = parseInt(wornArmorPassives.value['Override Burrowspeed']?.modAmount)
    }
    if (secondaryHandheldPassives.value['Override Burrowspeed']) {
      speed = parseInt(secondaryHandheldPassives.value['Override Burrowspeed']?.modAmount)
    }
    if (primaryHandheldPassives.value['Override Burrowspeed']) {
      speed = parseInt(primaryHandheldPassives.value['Override Burrowspeed']?.modAmount)
    }
    if (characterStore.movementStatusModifiers['Modify Burrow']) {
      const max = Object.values(characterStore.movementStatusModifiers['Modify Burrow']).reduce(
        (acc: number, mod: any) => (parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc),
        -1000
      )
      if (max != -1000) {
        modifier += max
      }
    }
    speed += modifier
    if (speed > 0) {
      speed += getPerkAndSkillGain()
    }

    return isStunned.value || isPinned.value
      ? 0
      : isProne.value || isSlowed.value
        ? Math.floor(speed / 2)
        : speed
  })
  return {
    totalMana,
    totalHp,
    wornArmorPassives,
    primaryHandheldPassives,
    secondaryHandheldPassives,
    wornArmor,
    wornShield,
    moveDvs,
    shieldDvs,
    armorDvs,
    bonusDvs,
    totalDvs,
    base,
    climbing,
    flight,
    burrowing,
    swimming,
    isSlowed,
    isPinned,
    isProne,
    isStunned
  }
})
