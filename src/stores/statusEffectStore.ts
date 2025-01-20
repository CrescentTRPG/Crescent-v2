import { defineStore } from 'pinia'
import { useCharacterStore } from './characterStore.js'
import { useUserStore } from './userStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useSkillStore } from './skillsStore.js'
import { useEquipmentStore } from './equipmentStore.js'

export const useStatusEffectStore = defineStore('StatusEffect', {
  state: () => ({
    manualStatusEffect: {},
    diceRollHistory: {}
  }),
  getters: {
    getSkills() {
      const characterStore = useCharacterStore()
      const ret = {}
      const skillStore = useSkillStore()

      skillStore.getEffectiveSkills.forEach((skill) => {
        let placed = 0
        let inferior = 0
        let mod = skill.rank
        if (skill.attribute === 'Agility') {
          mod += Math.floor(this.getAgility / 2)
          inferior += this.getAgilityInferiors
        }
        if (skill.attribute === 'Strength') {
          mod += Math.floor(this.getStrength / 2)
          inferior += this.getStrengthInferiors
        }
        if (skill.attribute === 'Health') {
          mod += Math.floor(this.getHealth / 2)
          inferior += this.getHealthInferiors
        }
        if (skill.attribute === 'Perception') {
          mod += Math.floor(this.getPerception / 2)
          inferior += this.getPerceptionInferiors
        }
        if (skill.attribute === 'Willpower') {
          mod += Math.floor(this.getWillpower / 2)
          inferior += this.getWillpowerInferiors
        }
        if (skill.attribute === 'Charisma') {
          mod += Math.floor(this.getCharisma / 2)
          inferior += this.getCharismaInferiors
        }
        if (skill.attribute === 'Intelligence') {
          mod += Math.floor(this.getIntelligence / 2)
          inferior += this.getIntelligenceInferiors
        }
        if (skill.attribute === 'Power') {
          mod += Math.floor(this.getPower / 2)
          inferior += this.getPowerInferiors
        }
        if (
          useEquipmentStore().getArmorSpecs?.equippedStats.passives[
            'Add Placed Rolls ' + skill.skill
          ]
        ) {
          placed = Math.max(
            placed,
            parseInt(
              useEquipmentStore().getArmorSpecs?.equippedStats.passives[
                'Add Placed Rolls ' + skill.skill
              ].modAmount
            )
          )
        }
        if (
          useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
            'Add Placed Rolls ' + skill.skill
          ]
        ) {
          placed = Math.max(
            placed,
            parseInt(
              useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
                'Add Placed Rolls ' + skill.skill
              ].modAmount
            )
          )
        }
        if (
          useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
            'Add Placed Rolls ' + skill.skill
          ]
        ) {
          placed = Math.max(
            placed,
            parseInt(
              useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
                'Add Placed Rolls ' + skill.skill
              ].modAmount
            )
          )
        }
        placed += skill.isOrigin ? 1 : 0
        placed -= inferior
        const skillName = skill.skill.toLowerCase()
        if (characterStore.diceStatusModifiers[skillName]) {
          if (characterStore.diceStatusModifiers[skillName]['Override Placed Rolls']) {
            const max = Object.values(
              characterStore.diceStatusModifiers[skillName]['Override Placed Rolls']
            ).reduce(
              (acc: number, mod: any) =>
                parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
              -1000
            )
            if (max != -1000) {
              placed += max
            }
          }
          if (characterStore.diceStatusModifiers[skillName]['Modify Placed Rolls']) {
            const max = Object.values(
              characterStore.diceStatusModifiers[skillName]['Modify Placed Rolls']
            ).reduce(
              (acc: number, mod: any) =>
                parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
              -1000
            )
            if (max != -1000) {
              placed += max
            }
          }
        }

        placed += useCharacterStore().archetype === 'augur' ? 1 : 0

        if (characterStore.statusEffects['Sickened']) placed -= 1

        if (skill.skill === 'Subtlety' && characterStore.statusEffects['Invisible']) {
          placed += 2
        }
        ret[skill.skill] = {
          name: skill.skill,
          modifier: mod,
          placed: placed,
          attribute: skill.attribute
        }
      })
      return ret
    },
    getStrengthPlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Strength']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Strength']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Strength']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Strength']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Strength']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Placed Rolls Strength'
            ].modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['strength']) {
        if (characterStore.diceStatusModifiers['strength']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['strength']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['strength']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['strength']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Stunned']) placed -= 1

      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getAgilityPlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Agility']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Agility']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Agility']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Agility']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Agility']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Placed Rolls Agility'
            ].modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['agility']) {
        if (characterStore.diceStatusModifiers['agility']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['agility']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['agility']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['agility']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Prone']) {
        placed -= 1
      }
      if (characterStore.statusEffects['Pinned']) {
        return Math.min(placed, 0) - 2
      }
      if (characterStore.statusEffects['Stunned']) placed -= 1

      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getHealthPlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Health']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Health']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Health']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Health']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Health']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Health']
              .modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['health']) {
        if (characterStore.diceStatusModifiers['health']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['health']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['health']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['health']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Stunned']) placed -= 1

      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getPerceptionPlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Perception']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Perception']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Perception']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Placed Rolls Perception'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Perception']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Placed Rolls Perception'
            ].modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['perception']) {
        if (characterStore.diceStatusModifiers['perception']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['perception']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['perception']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['perception']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Befuddled']) {
        placed -= 1
      }
      if (characterStore.statusEffects['Blinded']) {
        placed -= 2
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getWillpowerPlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Willpower']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Willpower']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Willpower']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Placed Rolls Willpower'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Willpower']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Placed Rolls Willpower'
            ].modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['willpower']) {
        if (characterStore.diceStatusModifiers['willpower']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['willpower']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['willpower']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['willpower']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Stunned']) placed -= 1

      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getCharismaPlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Charisma']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Charisma']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Charisma']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Charisma']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Charisma']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Placed Rolls Charisma'
            ].modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['charisma']) {
        if (characterStore.diceStatusModifiers['charisma']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['charisma']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['charisma']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['charisma']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getIntelligencePlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Intelligence']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives[
              'Add Placed Rolls Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Intelligence']
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Placed Rolls Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
          'Add Placed Rolls Intelligence'
        ]
      ) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Placed Rolls Intelligence'
            ].modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['intelligence']) {
        if (characterStore.diceStatusModifiers['intelligence']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['intelligence']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            0 - 1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['intelligence']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['intelligence']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Befuddled']) {
        placed -= 1
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getPowerPlaced() {
      const characterStore = useCharacterStore()
      let placed = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Power']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Placed Rolls Power']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Power']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Placed Rolls Power']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Power']) {
        placed = Math.max(
          placed,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Placed Rolls Power']
              .modAmount
          )
        )
      }
      if (characterStore.diceStatusModifiers['power']) {
        if (characterStore.diceStatusModifiers['power']['Override Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['power']['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (characterStore.diceStatusModifiers['power']['Modify Placed Rolls']) {
          const max = Object.values(
            characterStore.diceStatusModifiers['power']['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (characterStore.statusEffects['Fatigued']) {
        placed -= characterStore.statusEffects['Fatigued'].rank
      }
      if (characterStore.statusEffects['Sickened']) placed -= 1

      return placed
    },
    getStrengthExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.strength
      let max = 0
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Strength']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Strength']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Strength']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Strength'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Exceptional(s) Strength']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Strength'
            ].modAmount
          )
        )
      }
      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.strength['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }

      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    getAgilityExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.agility
      let max = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Agility']) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Agility']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Agility']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Agility'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Exceptional(s) Agility']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Agility'
            ].modAmount
          )
        )
      }
      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.agility['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max = arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    gethealthExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.health
      let max = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Health']) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Health']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Health']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Health']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Exceptional(s) Health']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Health'
            ].modAmount
          )
        )
      }
      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.health['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max = arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    getWillpowerExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.willpower
      let max = 0
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Willpower']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives[
              'Add Exceptional(s) Willpower'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Willpower']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Willpower'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
          'Add Exceptional(s) Willpower'
        ]
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Willpower'
            ].modAmount
          )
        )
      }
      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.willpower['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    getperceptionExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.perception
      let max = 0
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Perception']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives[
              'Add Exceptional(s) Perception'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Perception']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Perception'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
          'Add Exceptional(s) Perception'
        ]
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Perception'
            ].modAmount
          )
        )
      }
      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.perception['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    getCharismaExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.charisma
      let max = 0
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Charisma']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Charisma']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Charisma']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Charisma'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Exceptional(s) Charisma']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Charisma'
            ].modAmount
          )
        )
      }
      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.charisma['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    getIntelligenceExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.intelligence
      let max = 0
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Intelligence']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives[
              'Add Exceptional(s) Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
          'Add Exceptional(s) Intelligence'
        ]
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
          'Add Exceptional(s) Intelligence'
        ]
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Intelligence'
            ].modAmount
          )
        )
      }
      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.intelligence['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max = arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    getPowerExceptionals() {
      const baseExceptionalVal = useCharacterStore().exceptionals.power
      let max = 0
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Power']) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Exceptional(s) Power']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Power']) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Exceptional(s) Power']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Exceptional(s) Power']
      ) {
        max = Math.max(
          max,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Exceptional(s) Power'
            ].modAmount
          )
        )
      }

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.power['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    },
    getStrengthInferiors() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Strength']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Strength']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Strength']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Strength']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Strength']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Inferior(s) Strength'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.strength

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.strength['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getAgilityInferiors() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Agility']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Agility']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Agility']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Agility']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Agility']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Agility']
              .modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.agility

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.agility['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getHealthInferiors() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Health']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Health']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Health']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Health']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Health']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Health']
              .modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.health

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.health['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getWillpowerInferiors() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Willpower']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Willpower']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Willpower']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Willpower']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Willpower']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Inferior(s) Willpower'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.willpower

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.willpower['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getPerceptionInferiors() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Perception']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Perception']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Perception']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Inferior(s) Perception'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Perception']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Inferior(s) Perception'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.perception

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.perception['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getCharismaInferiors() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Charisma']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Charisma']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Charisma']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Charisma']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Charisma']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Inferior(s) Charisma'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.charisma

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.charisma['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getIntelligenceInferiors() {
      let mod = -1000
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Intelligence']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives[
              'Add Inferior(s) Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Intelligence']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Add Inferior(s) Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
          'Add Inferior(s) Intelligence'
        ]
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Inferior(s) Intelligence'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.intelligence

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.intelligence['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getPowerInferiors() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Strength']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Add Inferior(s) Strength']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Strength']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Add Inferior(s) Strength']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Add Inferior(s) Strength']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Add Inferior(s) Strength'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      const baseExceptionalVal = useCharacterStore().exceptionals.power

      const arr = Object.values(
        useCharacterStore().attributeStatusModifiers.power['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    },
    getStrength() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Strength']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Strength']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Strength']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Strength']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Strength']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Modify Attribute Strength'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.strength['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.strength['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod += max
        }
      }

      if (useCharacterStore().attributeStatusModifiers.strength['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.strength['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.strength + mod
      }
      return useCharacterStore().attributes.strength + mod
    },
    getAgility() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Agility']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Agility']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Agility']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Agility']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Agility']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Modify Attribute Agility'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.agility['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.agility['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod = max
        }
      }

      if (useCharacterStore().attributeStatusModifiers.agility['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.agility['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.agility + mod
      }
      return useCharacterStore().attributes.agility + mod
    },
    getPerception() {
      let mod = -1000
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Perception']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Perception']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Perception']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Modify Attribute Perception'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Perception']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Modify Attribute Perception'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.perception['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.perception['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod = max
        }
      }

      if (useCharacterStore().attributeStatusModifiers.perception['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.perception['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.perception + mod
      }
      return useCharacterStore().attributes.perception + mod
    },
    getWillpower() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Willpower']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Willpower']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Willpower']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Modify Attribute Willpower'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Willpower']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Modify Attribute Willpower'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.willpower['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.willpower['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod = max
        }
      }

      if (useCharacterStore().attributeStatusModifiers.willpower['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.willpower['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.willpower + mod
      }
      return useCharacterStore().attributes.willpower + mod
    },
    getHealth() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Health']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Health']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Health']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Health']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Health']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Health']
              .modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.health['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.health['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod = max
        }
      }
      if (useCharacterStore().attributeStatusModifiers.health['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.health['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.health + mod
      }
      return useCharacterStore().attributes.health + mod
    },
    getIntelligence() {
      let mod = -1000
      if (
        useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Intelligence']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives[
              'Modify Attribute Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Intelligence']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives[
              'Modify Attribute Intelligence'
            ].modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
          'Modify Attribute Intelligence'
        ]
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Modify Attribute Intelligence'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.intelligence['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.intelligence['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod = max
        }
      }
      if (useCharacterStore().attributeStatusModifiers.intelligence['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.intelligence['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.intelligence + mod
      }
      return useCharacterStore().attributes.intelligence + mod
    },
    getPower() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Power']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Power']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Power']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Power']
              .modAmount
          )
        )
      }
      if (useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Power']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Power']
              .modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.power['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.power['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod = max
        }
      }
      if (useCharacterStore().attributeStatusModifiers.power['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.power['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.power + mod
      }
      return useCharacterStore().attributes.power + mod
    },
    getCharisma() {
      let mod = -1000
      if (useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Charisma']) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getArmorSpecs?.equippedStats.passives['Modify Attribute Charisma']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Charisma']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getPrimarySpecs?.equippedStats.passives['Modify Attribute Charisma']
              .modAmount
          )
        )
      }
      if (
        useEquipmentStore().getSecondarySpecs?.equippedStats.passives['Modify Attribute Charisma']
      ) {
        mod = Math.max(
          mod,
          parseInt(
            useEquipmentStore().getSecondarySpecs?.equippedStats.passives[
              'Modify Attribute Charisma'
            ].modAmount
          )
        )
      }
      if (mod === -1000) {
        mod = 0
      }
      if (useCharacterStore().attributeStatusModifiers.charisma['Modify Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.charisma['Modify Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          mod = max
        }
      }

      if (useCharacterStore().attributeStatusModifiers.charisma['Override Attribute']) {
        const max = Object.values(
          useCharacterStore().attributeStatusModifiers.charisma['Override Attribute']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        return max > 0 ? max + mod : useCharacterStore().attributes.charisma + mod
      }
      return useCharacterStore().attributes.charisma + mod
    }
  },
  actions: {
    async setManualStatusEffect(StatusEffect: any) {
      this.manualStatusEffect = StatusEffect
    },
    addStatus(status, check, duration, icon, description, rank, damageType) {
      useCharacterStore().addBasicStatus(status, {
        name: status,
        checkToBreak: check,
        duration: duration,
        icon: icon,
        damageType: damageType,
        description: description,
        linkedModifiers: [],
        isBasic: true,
        rank: rank
      })
    },
    addDiceRollHistory(history: any) {
      this.diceRollHistory = history
    },
    clearDiceHistory() {
      this.diceRollHistory = {}
    }
  },
  persist: true
})
