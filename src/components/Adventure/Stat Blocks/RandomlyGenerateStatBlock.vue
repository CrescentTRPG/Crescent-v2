<script lang="ts">
import BasicInput from '@/components/Character/BasicInput.vue'
import CustomModal from '@/components/CustomModal.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { ManualMartialPerk, useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { ManualSpell, useSpellStore } from '@/stores/spellsStore.ts'
import { useTraitsStore } from '@/stores/traitsStore.ts'
import { BButton } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

export default {
  props: ['updateFromRandom', 'currentStatBlock'],
  setup(props, context) {
    const designStore = useDesignStore()
    const skillsStore = useSkillStore()
    const spellsStore = useSpellStore()
    const traitsStore = useTraitsStore()
    const martialPerksStore = useMartialPerksStore()
    const { manualMartialPerks } = storeToRefs(martialPerksStore)
    const pointsVal = ref(0)
    const profileVal = ref('')
    const martialSkillsStore = useMartialSkillsStore()
    const { manualTraits } = storeToRefs(traitsStore)
    const { allSkills } = storeToRefs(skillsStore)
    const { allCombatStyles, allSpecializations } = storeToRefs(martialSkillsStore)
    const { manualSpellgroups } = storeToRefs(spellsStore)
    function getRandomProfile() {
      let rand = Math.ceil(Math.random() * 4)
      switch (rand) {
        case 1:
          return 'Martial'
        case 2:
          return 'Skill'
        case 3:
          return 'Skill'
        case 4:
          return 'Caster'
      }
    }
    function getArmor(points) {
      if (points < 40) {
        return Math.floor(Math.random() * 6) + 3
      } else if (points < 80) {
        return Math.floor(Math.random() * 8) + 3
      } else return Math.floor(Math.random() * 10) + 3
    }
    function getShield(points) {
      if (points < 40) {
        return Math.floor(Math.random() * 2)
      } else if (points < 80) {
        return Math.floor(Math.random() * 3)
      } else return Math.floor(Math.random() * 4)
    }
    function getHp(profile, points) {
      let ret = 0
      const level = Math.floor(points / 10)
      if (level < 3) {
        ret = 10 + level * 10
      } else if (level < 15) {
        ret = 34 + (level - 3) * 5
      } else if (level < 40) {
        ret = 82 + (level - 15) * 3
      } else {
        ret = Math.floor(152 + (level - 40))
      }
      let profileGen = 0
      if (profile === 'Martial') {
        profileGen = Math.floor(300 * Math.random() + 50) / 100
      }
      if (profile === 'Caster') {
        profileGen = Math.floor(150 * Math.random() + 50) / 100
      } else {
        profileGen = Math.floor(200 * Math.random() + 50) / 100
      }
      return Math.floor(ret * profileGen)
    }
    function getMana(startingpoints) {
      if (startingpoints === 0) {
        return 0
      }
      let spellPoints = startingpoints
      let ret = 0
      if (spellPoints < 30) {
        ret = spellPoints / 3
        spellPoints -= 30
      }
      if (spellPoints > 0 && spellPoints < 100) {
        ret = spellPoints / 5
        spellPoints -= 100
      }
      if (spellPoints > 0 && spellPoints < 400) {
        ret = spellPoints / 8
        spellPoints -= 400
      }
      if (spellPoints > 0) {
        ret = spellPoints / 10
      }

      return Math.ceil((ret * Math.ceil(Math.random() * 3)) / 2 + 0.1)
    }
    function getAttributes(statBlock) {
      let minStrength = 0
      let minAgility = 0
      let minHealth = 0
      let minWillpower = 0
      let minPower = 0
      let minIntelligence = 0
      let minCharisma = 0
      let minPerception = 0
      if (statBlock.combatStyles) {
        Object.values(statBlock.combatStyles).forEach((combatStyle: any) => {
          if (combatStyle.attributes.includes('Strength')) {
            minStrength = Math.max(combatStyle.rank, minStrength)
          } else if (combatStyle.attributes.includes('Agility')) {
            minAgility = Math.max(combatStyle.rank, minAgility)
          }
        })
      }
      if (statBlock.spells) {
        Object.values(statBlock.spells).forEach((spellgroup: any) => {
          if (spellgroup.rankLimiter === 'Power') {
            const maxRank = Object.values(spellgroup.spells).reduce(
              (acc: number, spell: any) => (spell.rank > acc ? spell.rank : acc),
              0
            )
            minPower = Math.max(maxRank, minPower)
          }
          if (spellgroup.groupPurchaseLimiter === 'Charisma') {
            minCharisma += 2
          } else if (spellgroup.groupPurchaseLimiter === 'Intelligence') {
            minIntelligence += 2
          }
        })
      }
      if (statBlock.skills) {
        Object.values(statBlock.skills).forEach((skill: any) => {
          if (skill.attribute === 'Agility') {
            minAgility = Math.max(skill.rank, minAgility)
          } else if (skill.attribute === 'Power') {
            minPower = Math.max(skill.rank, minPower)
          } else if (skill.attribute === 'Strength') {
            minStrength = Math.max(skill.rank, minStrength)
          } else if (skill.attribute === 'Health') {
            minHealth = Math.max(skill.rank, minHealth)
          } else if (skill.attribute === 'Charisma') {
            minCharisma = Math.max(skill.rank, minCharisma)
          } else if (skill.attribute === 'Intelligence') {
            minIntelligence = Math.max(skill.rank, minIntelligence)
          } else if (skill.attribute === 'Willpower') {
            minWillpower = Math.max(skill.rank, minWillpower)
          } else if (skill.attribute === 'Perception') {
            minStrength = Math.max(skill.rank, minPerception)
          }
        })
      }
      let attrRet = {
        strength: Math.min(10, minStrength + Math.floor(Math.random() * (10 - minStrength))),
        agility: Math.min(10, minAgility + Math.floor(Math.random() * (10 - minAgility))),
        health: Math.min(10, minHealth + Math.floor(Math.random() * (10 - minHealth))),
        willpower: Math.min(10, minWillpower + Math.floor(Math.random() * (10 - minWillpower))),
        perception: Math.min(10, minPerception + Math.floor(Math.random() * (10 - minPerception))),
        charisma: Math.min(10, minCharisma + Math.floor(Math.random() * (10 - minCharisma))),
        intelligence: Math.min(
          10,
          minIntelligence + Math.floor(Math.random() * (10 - minIntelligence))
        ),
        power: Math.min(10, minPower + Math.floor(Math.random() * (10 - minPower)))
      }
      return attrRet
    }
    function getTraits(numTraits, points) {
      let traitCount = numTraits
      if (numTraits === 'Random') {
        traitCount = Math.floor(Math.random() * 10)
      }
      let traits = {}
      let exceptionals = {
        strength: 0,
        agility: 0,
        perception: 0,
        willpower: 0,
        health: 0,
        intelligence: 0,
        power: 0,
        charisma: 0
      }
      let pointSwing = points
      let positiveTraits = ['Resistance', 'Exceptional', 'Damage Reduction', 'Immunity']
      let negativeTriats = ['Susceptibility', 'Vulnerability', 'Inferior', 'Damage Amplification']
      while (traitCount > 0) {
        let rand = Math.floor(Math.random() * 4)
        let traitArr: Array<any> = []
        let randomTrait: any = {}

        if (pointSwing > 0) {
          traitArr = Object.values(manualTraits.value[positiveTraits[rand]]).filter(
            (trait) => trait !== 'true'
          )
          if (positiveTraits[rand] === 'Exceptional') {
            pointSwing -= 10
          } else if (
            positiveTraits[rand] === 'Resistance' ||
            positiveTraits[rand] === 'Damage Reduction'
          ) {
            pointSwing -= 15
          } else {
            pointSwing -= 30
          }
          randomTrait = traitArr[Math.floor(Math.random() * traitArr.length)]
          if (randomTrait?.name.includes('Strength')) exceptionals.strength += 1
          if (randomTrait?.name.includes('Agility')) exceptionals.agility += 1
          if (randomTrait?.name.includes('Perception')) exceptionals.perception += 1
          if (randomTrait?.name.includes('Willpower')) exceptionals.willpower += 1
          if (randomTrait?.name.includes('Health')) exceptionals.health += 1
          if (randomTrait?.name.includes('Intelligence')) exceptionals.intelligence += 1
          if (randomTrait?.name.includes('Power')) exceptionals.power += 1
          if (randomTrait?.name.includes('Charisma')) exceptionals.charisma += 1
        }
        if (pointSwing < 0) {
          traitArr = Object.values(manualTraits.value[negativeTriats[rand]])
          if (positiveTraits[rand] === 'Inferior') {
            pointSwing += 10
          } else if (
            positiveTraits[rand] === 'Susceptibility' ||
            positiveTraits[rand] === 'Damage Amplification'
          ) {
            pointSwing += 15
          } else {
            pointSwing += 30
          }
          randomTrait = traitArr[Math.floor(Math.random() * traitArr.length)]
          if (randomTrait?.name.includes('Strength')) exceptionals.strength -= 1
          if (randomTrait?.name.includes('Agility')) exceptionals.agility -= 1
          if (randomTrait?.name.includes('Perception')) exceptionals.perception -= 1
          if (randomTrait?.name.includes('Willpower')) exceptionals.willpower -= 1
          if (randomTrait?.name.includes('Health')) exceptionals.health -= 1
          if (randomTrait?.name.includes('Intelligence')) exceptionals.intelligence -= 1
          if (randomTrait?.name.includes('Power')) exceptionals.power -= 1
          if (randomTrait?.name.includes('Charisma')) exceptionals.charisma -= 1
        }
        if (positiveTraits[rand] === 'Exceptional' || positiveTraits[rand] === 'Inferior') {
          randomTrait.number = props.currentStatBlock.traits[randomTrait.name]
            ? props.currentStatBlock.traits[randomTrait.name].number + 1
            : 1
        } else if (
          positiveTraits[rand] === 'Damage Reduction' ||
          positiveTraits[rand] === 'Damage Amplification'
        ) {
          randomTrait.number = Math.ceil(Math.random() * 3)
        }
        traits[randomTrait.name] = randomTrait
        traitCount--
      }
      return { traits: traits, exceptionals: exceptionals }
    }
    function getMartialPoints(combatStyles) {
      let styles: Array<any> = Object.values(combatStyles.combatStyles) || []
      let rank = 0

      styles.forEach((style) => {
        rank = Math.max(style.rank, rank)
      })

      return rank
    }
    function getRandom(profileDefault, pointDefault) {
      let profile = profileDefault
      if (!profile) {
        profile = getRandomProfile()
      }
      let points = pointDefault
      if (!points) {
        points = Math.round(Math.round(Math.random() * 5000) / 10)
      }
      let combatStyles
      let styleArr: Array<any>
      let specializations
      let perks
      let skills
      let spells
      let skillSwitch = Math.ceil(Math.random() * 2)
      let splatSwitch = Math.ceil(Math.random() * 5)
      let mana = 0
      let traits: any = {}
      let armor = getArmor(points)
      let shield = getShield(points)

      let hp = getHp(profile, points)
      switch (profile) {
        case 'Martial':
          combatStyles = getCombatStyles(points, profile)
          styleArr = Object.values(combatStyles.combatStyles)
          if (styleArr.length > 0) {
            specializations = getSpecializations(
              combatStyles.pointRemainder,
              profile,
              styleArr[0].name,
              styleArr[0].rank
            )
          }
          perks = getPerks(specializations?.pointRemainder || combatStyles.pointRemainder, profile)
          skills = getSkills(perks.pointRemainder, profile)
          spells = getSpells(skills.pointRemainder, profile)
          mana = getMana(skills.pointRemainder - spells.pointRemainder)
          traits = getTraits('Random', spells.pointRemainder)
          break
        case 'Skill':
          skills = getSkills(points, profile)
          if (skillSwitch === 1) {
            combatStyles = getCombatStyles(skills.pointRemainder, profile)
            styleArr = Object.values(combatStyles.combatStyles)
            if (styleArr.length > 0)
              specializations = getSpecializations(
                combatStyles.pointRemainder,
                profile,
                styleArr[0].name,
                styleArr[0].rank
              )
            perks = getPerks(
              specializations?.pointRemainder || combatStyles.pointRemainder,
              profile
            )
            spells = getSpells(perks.pointRemainder, profile)
            mana = getMana(perks.pointRemainder - perks.pointRemainder)
            traits = getTraits('Random', spells.pointRemainder)
          } else {
            spells = getSpells(skills.pointRemainder, profile)
            mana = getMana(skills.pointRemainder - spells.pointRemainder)
            combatStyles = getCombatStyles(spells.pointRemainder, profile)
            styleArr = Object.values(combatStyles.combatStyles)
            if (styleArr.length > 0)
              specializations = getSpecializations(
                combatStyles.pointRemainder,
                profile,
                styleArr[0].name,
                styleArr[0].rank
              )
            perks = getPerks(
              specializations?.pointRemainder || combatStyles.pointRemainder,
              profile
            )
            traits = getTraits('Random', perks.pointRemainder)
          }
          break
        case 'Caster':
          spells = getSpells(points, profile)
          mana = getMana(points - spells.pointRemainder)
          skills = getSkills(spells.pointRemainder, profile)
          combatStyles = getCombatStyles(skills.pointRemainder, profile)
          styleArr = Object.values(combatStyles.combatStyles)
          if (styleArr.length > 0)
            specializations = getSpecializations(
              combatStyles.pointRemainder,
              profile,
              styleArr[0].name,
              styleArr[0].rank
            )
          perks = getPerks(specializations?.pointRemainder || combatStyles.pointRemainder, profile)
          traits = getTraits('Random', perks.pointRemainder)
          break
      }
      let mp = getMartialPoints(combatStyles)
      let newTemp = {
        ...props.currentStatBlock,
        spells: spells?.spells || {},
        skills: skills?.skills || {},
        perks: perks?.perks || {},
        specializations: specializations?.specializations || {},
        combatStyles: combatStyles?.combatStyles || {},
        traits: traits.traits,
        exceptionals: traits.exceptionals,
        totalHp: hp,
        currentHp: hp,
        totalMana: mana,
        currentMana: mana,
        armorDvs: armor,
        shieldDvs: shield,
        mp: mp
      }
      let attributes = getAttributes(newTemp)
      newTemp = { ...newTemp, attributes: attributes }
      props.updateFromRandom(newTemp)
    }
    //combat Styles, Specializations, Perks, Elemental Spells, Divine Spells, Skills
    function getSpells(points, profile) {
      let spells = {}
      let genAmount = 0
      if (profile === 'Caster') {
        genAmount += Math.min(
          Math.round(Math.round(points / 25 + 1) + points / (Math.random() * 100)),
          10
        )
      } else {
        genAmount += Math.min(Math.round(points / (Math.random() * 100)), 10)
      }

      let tempPoints = points
      let dupCount = 0
      let i = 1
      let groupCount = 0
      while (groupCount < genAmount && dupCount < 2 && tempPoints > 1) {
        let group = getRandomSpellgroup()
        if (spells[group]?.name) {
          dupCount++
          if (dupCount > 2) {
            return { spells: spells, pointRemainder: tempPoints }
          }
        } else {
          let highRank = 10
          if (group === 'Fauna' || group === 'Effigy') {
            highRank = 5
          }
          if (manualSpellgroups.value[group]?.flatCost) {
            //flat cost group
            let max = Math.min(
              manualSpellgroups.value[group].spells.length - 2,
              Math.floor(points / manualSpellgroups.value[group].baseCost)
            )
            let num = Math.min(Math.ceil(Math.random() * max), 4)
            let spellsObj = {}
            for (let i = 1; i <= num; i++) {
              let spell: ManualSpell = getSpellInGroup(group)
              spellsObj[spell.name] = { ...spell, known: true }
              tempPoints -= manualSpellgroups.value[group].baseCost
            }
            spells[group] = { ...manualSpellgroups.value[group], spells: spellsObj }
          } else {
            // rank group, with buy spells in order up to random rank ex: 1,2,3,4
            let max = Math.min(
              rankSub(points, 0, 0, manualSpellgroups.value[group].baseCost),
              highRank
            )
            let ranks = Math.ceil(Math.random() * max)
            let spellsObj = {}
            for (let i = 1; i <= ranks; i++) {
              let spell: ManualSpell = getSpellAtRankInGroup(i, group)

              spellsObj[spell.name] = { ...spell, known: true }
            }
            tempPoints -= rankSum(ranks)

            spells[group] = { ...manualSpellgroups.value[group], spells: spellsObj }
          }
          groupCount++
        }
      }
      return { spells: spells, pointRemainder: tempPoints }
    }
    function getPerks(points, profile) {
      let perks = {}
      let genAmount = 0
      if (profile === 'Martial') {
        genAmount += Math.min(
          Math.round(Math.round(points / 25 + 1) + points / (Math.random() * 100)),
          10
        )
      } else {
        genAmount += Math.min(Math.round(points / (Math.random() * 100)), 5)
      }

      let tempPoints = points
      let dupCount = 0
      let i = 1
      let perkCount = 0
      while (tempPoints >= 3 && perkCount < genAmount) {
        while (i * 3 > tempPoints) {
          i--
          i = Math.ceil(Math.random() * i)
        }
        if (i === 6) {
          i = Math.max(Math.floor(Math.random() * i), 1)
        }
        let perk: ManualMartialPerk = getRandomPerkAtRank(i)
        if (perks[perk.name]) {
          dupCount++
          if (dupCount > 3) {
            return { perks: perks, pointRemainder: tempPoints }
          }
        } else {
          perks[perk.name] = { ...perk, known: true }
          tempPoints -= i * 3
          perkCount++
        }
        i++
      }
      return { perks: perks, pointRemainder: tempPoints }
    }
    function getSkills(points, profile) {
      let skills = {}
      let genAmount = 0
      if (profile === 'Skill') {
        genAmount += Math.min(Math.round(2 + points / (Math.random() * 100)), 5)
      } else {
        genAmount += Math.min(Math.round(0.5 + points / (Math.random() * 100)), 3)
      }

      let tempPoints = points
      let dupCount = 0
      for (let i = 0; i < genAmount; i++) {
        let skill: string = getRandomSkill()
        let skillObj = getRankAndPointRemainder(10, 1, tempPoints)
        if (skills[skill]?.rank) {
          i--
          dupCount++
          if (dupCount > 2) {
            return { skills: skills, pointRemainder: tempPoints }
          }
        } else {
          tempPoints -= skillObj.points
          skills[allSkills.value[skill].skill] = { ...allSkills.value[skill], rank: skillObj.rank }
        }
      }
      return { skills: skills, pointRemainder: tempPoints }
    }
    function getSpecializations(points, profile, combatStyle, max) {
      if (combatStyle === 'none') {
        return { specializations: {}, pointRemainder: points }
      }
      let specializations = {}
      let genAmount = 0
      if (profile === 'Martial') {
        genAmount += Math.round(0.45 + points / (Math.random() * 200 + 100))
      } else {
        genAmount += Math.min(Math.round(points / (Math.random() * 100)), 1)
      }
      let dupCount = 0

      let tempPoints = points
      for (let i = 0; i < genAmount; i++) {
        let style = getRandomSpecializationWithStyle(combatStyle)
        let skillObj = getRankAndPointRemainder(max, 1, tempPoints)
        if (specializations[style.name]?.rank) {
          i--
          dupCount++
          if (dupCount > 2) {
            return { specializations: specializations, pointRemainder: tempPoints }
          }
        } else {
          tempPoints -= skillObj.points
          specializations[style.name] = { ...style, rank: skillObj.rank }
        }
      }
      return { specializations: specializations, pointRemainder: tempPoints }
    }
    function getCombatStyles(points, profile) {
      let combatStyles = {}
      let genAmount = 0
      if (profile === 'Martial') {
        genAmount += Math.round(1 + points / (Math.random() * 1000 + 300))
      } else if (profile === 'Skill') {
        genAmount += Math.min(Math.round(0.4 + points / (Math.random() * 100)), 1)
      } else if (profile === 'Splat') {
        genAmount += Math.min(Math.round(0.3 + points / (Math.random() * 100)), 1)
      } else {
        genAmount += Math.min(Math.round(points / (Math.random() * 200)), 1)
      }
      let tempPoints = points
      let dupCount = 0
      for (let i = 0; i < genAmount; i++) {
        let style: string = getRandomCombatStyle()
        let styleObj = getRankAndPointRemainder(10, 1, tempPoints)
        if (combatStyles[style]?.rank) {
          i--
          dupCount++
          if (dupCount > 2) {
            return { combatStyles: combatStyles, pointRemainder: tempPoints }
          }
        } else {
          tempPoints -= styleObj.points
          combatStyles[style] = { ...allCombatStyles.value[style], rank: styleObj.rank }
        }
      }
      return { combatStyles: combatStyles, pointRemainder: tempPoints }
    }

    function getRandomCombatStyle(): string {
      let styles = Object.keys(allCombatStyles.value)
      let style = Math.floor(Math.random() * styles.length)
      return styles[style]
    }
    function getRandomSpellgroup(): string {
      let groups = Object.keys(manualSpellgroups.value)
      let group = Math.floor(Math.random() * groups.length)
      return groups[group]
    }
    function getSpellInGroup(group): ManualSpell {
      let spells: Array<ManualSpell> = Object.values(manualSpellgroups.value[group])
      let spell = Math.floor(Math.random() * spells.length)
      return spells[spell]
    }
    function getSpellAtRankInGroup(rank, group): ManualSpell {
      let spells: Array<ManualSpell> = Object.values(manualSpellgroups.value[group].spells)
      spells = spells.filter((a: any) => a.rank === rank)
      let spell = Math.floor(Math.random() * spells.length)
      return spells[spell]
    }
    function getRandomPerkAtRank(rank): ManualMartialPerk {
      let perks: Array<ManualMartialPerk> = Object.values(manualMartialPerks.value)
      perks = perks.filter((a: any) => a.rank === rank)
      let perk = Math.floor(Math.random() * perks.length)
      return perks[perk]
    }
    function getRandomSkill(): string {
      let skills = Object.keys(allSkills.value)
      let skill = Math.floor(Math.random() * skills.length)
      return skills[skill]
    }
    function getRandomSpecializationWithStyle(style) {
      let specializations = Object.values(allSpecializations.value)
      specializations = specializations.filter((a: any) => a.combatStyles.includes(style))
      let spec = Math.floor(Math.random() * specializations.length)
      return specializations[spec]
    }
    function getRankAndPointRemainder(groupMaxRank, baseCost, points) {
      let maxRank = Math.min(groupMaxRank, rankSub(points, 0, 0, baseCost))

      let ranks = Math.ceil(Math.random() * maxRank)
      let min = Math.ceil(Math.min(points / (20 * baseCost), maxRank - 2))
      ranks = Math.max(min, ranks)
      return { points: rankSum(ranks), rank: ranks }
    }
    function rankSum(val: number) {
      if (val == 0) {
        return 0
      }
      if (val == 1) {
        return 1
      } else {
        return val + rankSum(val - 1)
      }
    }
    function rankSub(val: number, valueToSubtract: number, acc: number, baseCost: number) {
      if (val - valueToSubtract === 0) {
        return acc
      }
      if (val - (valueToSubtract + acc + 1) < 0) {
        return acc
      } else {
        return rankSub(val, valueToSubtract + acc + baseCost, acc + baseCost, baseCost)
      }
    }
    function getTypeColor(type) {
      if (type === profileVal.value) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }
    function getTypeBoxShadow(type) {
      if (type === profileVal.value) {
        return '0px 0px 10px 3px ' + designStore.alertTheme
      }
      return 'none'
    }
    function updateType(type) {
      profileVal.value = type
    }

    const modal = ref(false)
    return {
      designStore,
      props,
      getRandom,
      profileVal,
      pointsVal,
      modal,
      getTypeColor,
      getTypeBoxShadow,
      updateType
    }
  },
  components: { BButton, CustomModal, BasicInput, TitleMedallion }
}
</script>
<template>
  <BButton
    @click="modal = true"
    class="footerButtons"
    :style="{ color: designStore.primaryText, borderColor: designStore.secondaryTheme }"
  >
    <v-icon
      name="gi-dice-fire"
      scale="1.5"
      class="randomDie"
      :style="{ color: designStore.primaryText }"
    ></v-icon>
    <div class="goBackText">Randomize Stat Block</div>
  </BButton>
  <CustomModal :show-modal="modal" @close="modal = false" title="Randomize Stat Block">
    <template v-slot:body>
      <TitleMedallion
        title="Randomization profile"
        :color="designStore.primaryText"
      ></TitleMedallion>
      <div class="typeSelectContainer">
        <div
          @click="updateType('Caster')"
          class="randomTypeSelect hoverableTransparantLinear"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: getTypeColor('Caster'),
            boxShadow: getTypeBoxShadow('Caster')
          }"
        >
          <TitleMedallion title="Caster"></TitleMedallion>
          <div style="display: flex; justify-content: space-between">
            <v-icon name="gi-magic-palm" scale="5"></v-icon>
            <div style="text-align: end; align-self: center">Prioritize Spells and Mana</div>
          </div>
        </div>
        <div
          class="randomTypeSelect hoverableTransparantLinear"
          @click="updateType('Martial')"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: getTypeColor('Martial'),
            boxShadow: getTypeBoxShadow('Martial')
          }"
        >
          <TitleMedallion title="Martial"></TitleMedallion>

          <div style="display: flex; justify-content: space-between">
            <v-icon name="gi-swordman" scale="5"></v-icon>
            <div style="text-align: end; align-self: center">
              Prioritize Martial skills and perks
            </div>
          </div>
        </div>
        <div
          class="randomTypeSelect hoverableTransparantLinear"
          @click="updateType('')"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: getTypeColor(''),
            boxShadow: getTypeBoxShadow('')
          }"
        >
          <TitleMedallion title="Random"></TitleMedallion>

          <div style="display: flex; justify-content: space-between">
            <v-icon name="gi-card-random" scale="5"></v-icon>
            <div style="text-align: end; align-self: center">Randomize Profile</div>
          </div>
        </div>
        <div
          class="randomTypeSelect hoverableTransparantLinear"
          @click="updateType('Skill')"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: getTypeColor('Skill'),
            boxShadow: getTypeBoxShadow('Skill')
          }"
        >
          <TitleMedallion title="Skill"></TitleMedallion>

          <div style="display: flex; justify-content: space-between">
            <v-icon name="gi-juggler" scale="5"></v-icon>
            <div style="text-align: end; align-self: center">Prioritize Skills</div>
          </div>
        </div>
      </div>
      <BasicInput
        style="margin-top: 2rem"
        label="Points"
        :value="pointsVal"
        type="number"
        :max="50000"
        :min="0"
        @newValue="(val) => (pointsVal = val)"
      ></BasicInput>
    </template>
    <template v-slot:footer>
      <BButton
        style="border: 1px solid; margin-right: 1rem"
        :style="{ borderColor: designStore.secondaryTheme }"
        @click="getRandom(profileVal, pointsVal)"
        >Randomize from Input</BButton
      ><BButton
        style="border: 1px solid; margin-right: 1rem"
        :style="{ borderColor: designStore.secondaryTheme }"
        @click="getRandom('', '')"
        >True Random</BButton
      >
      <BButton
        style="border: 1px solid; margin-right: 1rem"
        :style="{ borderColor: designStore.secondaryTheme }"
        @click="modal = false"
        >Cancel</BButton
      ></template
    >
  </CustomModal>
</template>
<style>
.randomTypeSelect {
  border: 3px solid;
  border-radius: 0.375rem;
  padding: 1rem;
  align-items: center;
  margin: 2rem;
  margin-bottom: 0rem;
}
.typeSelectContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 900px) {
  .typeSelectContainer {
    display: flex;
    flex-direction: column;
  }
}
.randomDie {
  margin: -0.25rem;
  margin-right: 0.25rem;
}
@media (max-width: 1000px) {
  .randomDie {
    margin-right: -0.25rem;
  }
}
</style>
