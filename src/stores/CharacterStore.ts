import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { useDesignStore } from './designStore.js'
import { useSkillStore } from './skillsStore.js'
import { db } from '@/firebase/config.js'
import { onSnapshot, doc, query, getDocs, updateDoc } from 'firebase/firestore'
import { useMartialSkillsStore } from './martialSkillsStore.js'
import { useMartialPerksStore } from './martialPerksStore.js'
import { useSpellStore } from './spellsStore.js'
import { useManualStore } from './manualStore.js'
import { useUserStore } from './userStore.js'
import { Details } from '@/components/Character/Details/CoreTraits.vue'
import { useEquipmentStore } from './equipmentStore.js'
import { usePerformanceStore } from './performanceStore.js'
import { DEFAULT_CHARCTER, DEFAULT_DESIGN } from '@/bases.js'
import { useEffigyStore } from './effigyStore.js'
import { useAdventureStore } from './adventureStore.js'
import { useJournalStore } from './journalStore.ts'
import _ from 'lodash'
import { nextTick } from 'vue'
import { resolve } from 'path'

interface Character {
  id: string
  name: string
  image: string
  archetype: string
  backstory: string
  totalAbilityPoints: number
  originSkills: Array<string>
  adventure: any //map
  traits: any
  motivation: string
  condition: any //map
  details: Details
  attributes: any //map
  exceptionals: any //map
  currentHp: number
  barrierHp: number
  currentMana: number
  overviewValues: any
  showNewPlayerGuide: boolean
  stressedExceptionals: any
  // effigies: any //collection
  // faunaTransformations: any //collection
  // performanceStyles: any //collection
  // journal: any //collection
  // details: any //map
  // inventory: any //collection
  // skills: any //collection
  // martialSkills: any //collection
  // spells: any //collection
  // martialPerks: any //collection
  // martialAttacks: any //collection
}

interface HpModifier {
  modAmount: number
  sufferingDamageType: string
  linkedStatus: string
  modifierType: string
}

export interface GenericModifier {
  modAmount: number
  linkedStatus: string
  modifierType: string
}

interface AttributeModifier {
  modAmount: number
  linkedStatus: string
  modifierType: string
  attribute: string
}
interface DiceModifier {
  modAmount: number
  linkedStatus: string
  modifierType: string
  target: string
}

export const useCharacterStore = defineStore('character', {
  state: () => ({
    characterRef: () => {},
    here: 0,
    loading: true,
    showNewPlayerGuide: true,
    newPlayerGuideStep: 0,
    id: '',
    name: '',
    backstory: '',
    image: '',
    archetype: '',
    traits: {},
    motivation: '',
    details: {
      age: '',
      weight: '',
      hairColor: '',
      eyeColor: '',
      height: '',
      background: '',
      strengths: '',
      goal: '',
      weaknesses: '',
      shorthandDescriptors: ''
    },
    statusEffects: {},
    customStatusEffects: {},
    hpStatusModifiers: {},
    manaStatusModifiers: {},
    armorStatusModifiers: {},
    attributeStatusModifiers: {
      strength: {},
      agility: {},
      health: {},
      willpower: {},
      perception: {},
      intelligence: {},
      charisma: {},
      power: {}
    },
    diceStatusModifiers: {
      strength: {},
      agility: {},
      health: {},
      willpower: {},
      perception: {},
      intelligence: {},
      charisma: {},
      power: {},
      acrobatics: {},
      alchemy: {},
      awareness: {},
      crafting: {},
      fitness: {},
      interpersonal: {},
      knowledge: {},
      metamagic: {},
      might: {},
      performance: {},
      subtlety: {}
    },
    stressedExceptionals: {},
    mpStatusModifiers: {},
    movementStatusModifiers: {},
    currentHp: 0,
    currentMana: 0,
    barrierHp: 0,
    spentAbilityPoints: 0,
    totalAbilityPoints: 10,
    originSkills: ['', ''],
    adventure: { gameMasterId: null, adventureId: null },
    condition: null,
    attributes: {
      strength: 0,
      agility: 0,
      perception: 0,
      willpower: 0,
      health: 0,
      intelligence: 0,
      power: 0,
      charisma: 0
    },
    plannedCoreAction: {
      ability: { spellgroup: '', groupIcon: '', name: '' },
      rogueActions: []
    },
    plannedSwiftAction: {
      ability: { spellgroup: '', groupIcon: '', name: '' },
      rogueActions: []
    },
    plannedReaction: {
      ability: { spellgroup: '', groupIcon: '', name: '' },
      rogueActions: []
    },
    plannedMovementAction: {
      ability: { spellgroup: '', groupIcon: '', name: '' },
      rogueActions: []
    },
    exceptionals: {
      strength: 0,
      agility: 0,
      perception: 0,
      willpower: 0,
      health: 0,
      intelligence: 0,
      power: 0,
      charisma: 0
    },
    effigies: {},
    faunaTransformations: null,
    journal: null,
    inventory: null,
    skills: null,
    martialSkills: null,
    spells: null,
    martialPerks: null,
    martialAttacks: {},
    overviewValues: {
      //   totalHp: 0,
      //   totalMana: 0,
      //   bonusDvs: 0,
      //   armorDvs: 0,
      //   mp: 0,
      //   shieldDvs: 0,
      //   moveDvs: 0,
      isDodging: false
      //   base: 30,
      //   flight: 0,
      //   climbing: 0,
      //   swimming: 0,
      //   burrowing: 0,
      //   attributes: {
      //     strength: 0,
      //     agility: 0,
      //     perception: 0,
      //     willpower: 0,
      //     health: 0,
      //     intelligence: 0,
      //     power: 0,
      //     charisma: 0
      //   },
      //   exceptionals: {
      //     strength: 0,
      //     agility: 0,
      //     perception: 0,
      //     willpower: 0,
      //     health: 0,
      //     intelligence: 0,
      //     power: 0,
      //     charisma: 0
      //   },
      //   inferiors: {
      //     strength: 0,
      //     agility: 0,
      //     perception: 0,
      //     willpower: 0,
      //     health: 0,
      //     intelligence: 0,
      //     power: 0,
      //     charisma: 0
      //   }
    }
  }),
  getters: {
    getLocalCharacter() {},
    getAgility: (state): number => state.attributes.agility,
    getCharacterId: (state): string => state.id,
    getArchetype: (state): string => state.archetype,
    getAttributes: (state): any => state.attributes,
    getOriginSkills: (state): Array<string> => state.originSkills,
    getMp: (state): number => {
      const combatStyles = useMartialSkillsStore().combatStyles
      const equipmentStore = useEquipmentStore()
      const styles = Object.values(combatStyles)
      let ret = styles.reduce((acc: number, style: any) => (style.rank > acc ? style.rank : acc), 0)
      if (state.mpStatusModifiers['Override Mp']) {
        const max = Object.values(state.mpStatusModifiers['Override Mp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          ret = max
        }
      }
      if (state.traits['Modified MP']) {
        ret += parseInt(state.traits['Modified MP'].number)
      }
      if (equipmentStore.getWornArmorPassives['Override Mp']) {
        ret = parseInt(equipmentStore.getWornArmorPassives['Override Mp']?.modAmount)
      }
      if (equipmentStore.getPrimaryHandheldPassives['Override Mp']) {
        ret = parseInt(equipmentStore.getPrimaryHandheldPassives['Override Mp']?.modAmount)
      }
      if (equipmentStore.getSecondaryHandheldPassives['Override Mp']) {
        ret = parseInt(equipmentStore.getSecondaryHandheldPassives['Override Mp']?.modAmount)
      }
      let modifier = -1000

      if (equipmentStore.getWornArmorPassives['Modify Mp']) {
        modifier = Math.max(
          parseInt(equipmentStore.getWornArmorPassives['Modify Mp']?.modAmount),
          modifier
        )
      }
      if (equipmentStore.getPrimaryHandheldPassives['Modify Mp']) {
        modifier = Math.max(
          parseInt(equipmentStore.getPrimaryHandheldPassives['Modify Mp']?.modAmount),
          modifier
        )
      }
      if (equipmentStore.getSecondaryHandheldPassives['Modify Mp']) {
        modifier = Math.max(
          parseInt(equipmentStore.getSecondaryHandheldPassives['Modify Mp']?.modAmount),
          modifier
        )
      }
      if (modifier == -1000) {
        modifier = 0
      }

      if (state.mpStatusModifiers['Modify Mp']) {
        const max = Object.values(state.mpStatusModifiers['Modify Mp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      return Math.max(ret + modifier, 0)
    }
  },
  actions: {
    addMartialAttack(weaponAttacks) {
      this.martialAttacks = weaponAttacks
      this.setMartialAttacks()
    },
    setShowNewPlayerGuide(showNewPlayerGuide: boolean) {
      this.showNewPlayerGuide = showNewPlayerGuide
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          showNewPlayerGuide: false
        }
      )
    },
    flipExceptional(index, newVal, attr) {
      if (newVal) {
        if (this.stressedExceptionals[attr]) {
          this.stressedExceptionals[attr][index] = { index: index, used: true }
        } else {
          this.stressedExceptionals[attr] = {}
          this.stressedExceptionals[attr][index] = { index: index, used: true }
        }
      } else {
        delete this.stressedExceptionals[attr][index]
        console.log(this.stressedExceptionals)
      }
      this.setStressedExceptionals(this.stressedExceptionals)
    },
    incrementNewPlayerGuideStep() {
      this.newPlayerGuideStep += 1
      if (this.newPlayerGuideStep > 22) {
        this.showNewPlayerGuide = false
        const ret = updateDoc(
          doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
          {
            showNewPlayerGuide: false
          }
        )
      }
    },
    removeMartialAttack(name) {
      delete this.martialAttacks[name]
      this.setMartialAttacks()
    },
    setLocalMartialAttacks(attacks) {
      this.martialAttacks = attacks
    },
    addBasicStatus(status, statusObj) {
      this.statusEffects[status] = statusObj
      this.updateStatusEffects()
    },
    removeMovementStatusModifier(modifier: GenericModifier) {
      const modRef = this.movementStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(this.movementStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete this.movementStatusModifiers[modifier.modifierType]
      }
      this.updateStatusModifiers()
    },
    addNewMovementStatusModifier(modifier: GenericModifier) {
      const modRef = this.movementStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      this.movementStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        this.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'Move: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      this.updateStatusModifiers()
    },
    removeDiceStatusModifier(modifier: DiceModifier) {
      const attribute = modifier.target.toLowerCase()
      console.log(this.diceStatusModifiers, attribute)

      const modRef = this.diceStatusModifiers[attribute][modifier.modifierType]
      const pos = modifier.modAmount + ' '
      console.log(modRef, pos)
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (
        (
          (this.diceStatusModifiers[attribute] &&
            Object.values(this.diceStatusModifiers[attribute][modifier.modifierType])) ||
          {}
        ).length == 0
      ) {
        delete this.attributeStatusModifiers[attribute][modifier.modifierType]
      }
      this.updateStatusModifiers()
    },
    // setTotalHp(hp) {
    //   this.overviewValues.totalHp = hp
    //   this.setOverviewValues()
    // },
    // setTotalMana(mana) {
    //   this.overviewValues.totalMana = mana
    //   this.setOverviewValues()
    // },
    // setBonusDvs(dvs) {
    //   this.overviewValues.bonusDvs = dvs
    //   this.setOverviewValues()
    // },
    // setMp(mp) {
    //   this.overviewValues.mp = mp
    //   this.setOverviewValues()
    // },
    // setShieldDvs(dvs) {
    //   this.overviewValues.shieldDvs = dvs
    //   this.setOverviewValues()
    // },
    // setMoveDvs(dvs) {
    //   this.overviewValues.moveDvs = dvs
    //   this.setOverviewValues()
    // },
    setIsDodging(isDodging) {
      if (!this.overviewValues) {
        this.overviewValues = {
          isDodging: false
        }
      }
      this.overviewValues.isDodging = isDodging
      this.setOverviewValues()
    },
    addNewDiceStatusModifier(modifier: DiceModifier) {
      const attribute = modifier.target.toLowerCase()
      const modRef = this.diceStatusModifiers[attribute][modifier.modifierType]
      const pos = modifier.modAmount + ' '
      this.diceStatusModifiers[attribute][modifier.modifierType] = {
        ...modRef,
        [pos]: modifier
      }
      if (modifier.linkedStatus) {
        this.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'Roll, ' + attribute + ': ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      this.updateStatusModifiers()
    },

    removeAttributeStatusModifier(modifier: AttributeModifier) {
      const attribute = modifier.attribute.toLowerCase()
      console.log(this.attributeStatusModifiers, attribute)
      this.resolveStressedExceptionals(modifier)

      const modRef = this.attributeStatusModifiers[attribute][modifier.modifierType]
      const pos = modifier.modAmount + ' '
      console.log(modRef, pos)
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (
        (
          (this.attributeStatusModifiers[attribute] &&
            modifier.modifierType &&
            Object.values(this.attributeStatusModifiers[attribute][modifier.modifierType])) ||
          {}
        ).length == 0
      ) {
        delete this.attributeStatusModifiers[attribute][modifier.modifierType]
      }

      this.updateStatusModifiers()
    },
    addNewAttributeStatusModifier(modifier: AttributeModifier) {
      const attribute = modifier.attribute.toLowerCase()
      const modRef = this.attributeStatusModifiers[attribute][modifier.modifierType]
      const pos = modifier.modAmount + ' '
      this.attributeStatusModifiers[attribute][modifier.modifierType] = {
        ...modRef,
        [pos]: modifier
      }
      if (modifier.linkedStatus) {
        this.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'attribute, ' + attribute + ': ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      this.updateStatusModifiers()
      if (modifier.modifierType.includes('Exceptional')) {
        this.resolveStressedExceptionals(modifier)
      }
    },
    resolveStressedExceptionals(modifier) {
      interface stressor {
        index: number
      }
      let stressedExceptionals: stressor[] = []
      if (this.stressedExceptionals[modifier.attribute]) {
        stressedExceptionals = Object.values(
          this.stressedExceptionals[modifier.attribute]
        ) as stressor[]
      }

      let counter = modifier.modAmount
      if (stressedExceptionals.length > 0) {
        const maxLength = stressedExceptionals.reduce((a: stressor, b: stressor) =>
          a.index > b.index ? a : b
        )
        console.log(maxLength)
        for (
          let i = parseInt('' + this.exceptionals[modifier.attribute.toLowerCase()]);
          i <= maxLength.index;
          i++
        ) {
          if (stressedExceptionals[i]) {
            delete this.stressedExceptionals[modifier.attribute][i]
            counter--
          }
          if (counter == 0) {
            break
          }
        }
      }
    },
    removeMpStatusModifier(modifier: GenericModifier) {
      const modRef = this.mpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(this.mpStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete this.mpStatusModifiers[modifier.modifierType]
      }
      this.updateStatusModifiers()
    },
    addNewMpStatusModifier(modifier: GenericModifier) {
      const modRef = this.mpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      this.mpStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        this.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'Mp: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      this.updateStatusModifiers()
    },
    removeManaStatusModifier(modifier: GenericModifier) {
      const modRef = this.manaStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      console.log(modRef, pos)
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(this.manaStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete this.manaStatusModifiers[modifier.modifierType]
      }
      this.updateStatusModifiers()
    },
    addNewManaStatusModifier(modifier: GenericModifier) {
      const modRef = this.manaStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      this.manaStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        this.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'Mana: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      this.updateStatusModifiers()
    },
    removeArmorStatusModifier(modifier: GenericModifier) {
      const modRef = this.armorStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) delete modRef[pos]
      if (Object.values(this.armorStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete this.armorStatusModifiers[modifier.modifierType]
      }
      this.updateStatusModifiers()
    },
    addNewArmorStatusModifier(modifier: GenericModifier) {
      const modRef = this.armorStatusModifiers[modifier.modifierType]

      const pos = modifier.modAmount + ' '
      this.armorStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        this.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'Armor: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      this.updateStatusModifiers()
    },
    removeHpStatusModifier(modifier: HpModifier) {
      const modRef = this.hpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(this.hpStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete this.hpStatusModifiers[modifier.modifierType]
      }
      this.updateStatusModifiers()
    },
    addNewHpStatusModifier(modifier: HpModifier) {
      const modRef = this.hpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      this.hpStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        this.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'HP: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      this.updateStatusModifiers()
    },
    setLocalCurrentandBarrierHp(newHP, newBarrier) {
      this.currentHp = newHP
      this.barrierHp = newBarrier
    },
    setLocalMana(mana: number) {
      this.currentMana = mana
    },
    setLocalMotivation(motivation: string) {
      this.motivation = motivation
    },
    setLocalBackstory(backstory: string) {
      this.backstory = backstory
    },
    addCustomStatus(status: any) {
      this.customStatusEffects[status.name] = status
      this.updateStatusEffects()
    },
    removeStatus(name: string) {
      if (this.customStatusEffects[name]) {
        this.removeLinkedModifiers(this.customStatusEffects[name])
        delete this.customStatusEffects[name]
      }
      if (this.statusEffects[name]) {
        delete this.statusEffects[name]
      }
      this.updateStatusEffects()
    },
    removeLinkedModifiers(customStatus: any) {
      customStatus.linkedModifiers.forEach((mod) => {
        const modArr = mod.split(':')
        switch (modArr[0]) {
          case 'HP':
            this.removeHpStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1)),
              sufferingDamageType: ''
            })
            break
          case 'Mana':
            this.removeManaStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
            break
          case 'Mp':
            this.removeMpStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
            break
          case 'Move':
            this.removeMovementStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
            break
          case 'Armor':
            this.removeArmorStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
        }
        if (modArr[0].includes('Roll')) {
          this.removeDiceStatusModifier({
            linkedStatus: '',
            modifierType: modArr[1].substring(1, modArr[1].length - 1),
            modAmount: parseInt(modArr[2].substring(1)),
            target:
              modArr[0].substring(6, 7).toUpperCase() + modArr[0].substring(7, modArr[0].length)
          })
        } else {
          const attr = modArr[0].split(',')[1]
          if (attr) {
            this.removeAttributeStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1)),
              attribute: attr.substring(1)
            })
          }
        }
      })
    },
    setId(id: string) {
      this.id = id
    },
    setPlannedCoreAction(action: any) {
      this.plannedCoreAction.ability = action
    },
    setPlannedReaction(action: any) {
      this.plannedReaction.ability = action
    },
    setPlannedMovementAction(action: any) {
      this.plannedMovementAction.ability = action
    },
    setPlannedSwiftAction(action: any) {
      this.plannedSwiftAction.ability = action
    },
    setLocalArchetype(archetype: string) {
      this.archetype = archetype
    },
    setName(name: string) {
      this.name = name
    },
    setImage(image: string) {
      this.image = image
    },
    setLocalTotalAbilityPoints(totalAbilityPoints: number) {
      this.totalAbilityPoints = totalAbilityPoints
    },
    setLocalSpentAbilityPoints(spentAbilityPoints: number) {
      this.spentAbilityPoints = spentAbilityPoints
    },
    setLocalTraits(traits: any) {
      this.traits = traits
    },
    setLocalAttributes(attributes: any) {
      this.attributes = attributes
    },
    setLocalDetails(details: Details) {
      this.details = details
    },
    updateExceptionals(exceptional: string, exceptionalValue: number) {
      const copy = _.cloneDeep(this.exceptionals)
      copy[exceptional] = exceptionalValue
      console.log(copy, exceptionalValue)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          exceptionals: copy
        }
      )
    },
    setLocalExceptionals(exceptionals: any) {
      this.exceptionals = exceptionals
    },
    setLocalOrigin(origin: Array<string>) {
      this.originSkills = origin
    },
    setLocalCharacter(character: Character) {
      this.id = character.id
      this.details = character.details
      this.name = character.name
      this.image = character.image
      this.archetype = character.archetype
      this.totalAbilityPoints = character.totalAbilityPoints
      this.originSkills = character.originSkills
      this.adventure = character.adventure
      this.condition = character.condition
      this.attributes = character.attributes
      this.exceptionals = character.exceptionals
      this.traits = character.traits
      this.currentHp = character.currentHp
      this.barrierHp = character.barrierHp
      this.currentMana = character.currentMana
      this.motivation = character.motivation
      this.overviewValues = character.overviewValues
      this.showNewPlayerGuide = character.showNewPlayerGuide
      this.stressedExceptionals = character.stressedExceptionals || {}
    },
    async setCharacter(character: Character, uid: string, cid) {
      const char = await useCollection('User/' + this.getUser() + '/Character/' + cid, character)
      console.log(char)
    },
    async addCharacter(uid: string) {
      const char = DEFAULT_CHARCTER
      const defaultDesign = DEFAULT_DESIGN
      const ret = await useCollection('User/' + uid + '/Character', char)
      ret && this.setId(ret.id)

      useDesignStore().setDesign(defaultDesign, uid, false)
      updateDoc(doc(db, 'User/' + uid + '/Character/' + this.getCharacterId), {
        id: this.getCharacterId
      })
      console.log(ret)
      return this.getCharacterId
    },
    unsubscribe() {
      this.characterRef()
    },
    async updateCharacterFromAdventure(char: any) {
      const character = {
        id: char.id,
        name: char.name,
        image: char.image,
        details: char.details || {},
        archetype: char.archetype,
        backstory: char.backstory,
        motivation: char.motivation,
        totalAbilityPoints: char.totalAbilityPoints,
        originSkills: char.originSkills,
        adventure: char.adventure,
        condition: char.condition,
        showNewPlayerGuide: char.showNewPlayerGuide === undefined ? true : char.showNewPlayerGuide,
        attributes: char.attributes,
        exceptionals: char.exceptionals,
        traits: char.traits || {},
        currentHp: char.currentHp || 0,
        barrierHp: char.barrierHp || 0,
        currentMana: char.currentMana || 0,
        overviewValues: char.overviewValues || {},
        stressedExceptionals: char.stressedExceptionals || {}
      }
      this.statusEffects = char.statusEffects
      this.setLocalCharacter(character)
      this.setLocalMartialAttacks(char.martialAttacks || {})
      useMartialPerksStore().setLocalPerkGain(char.perkGain)
      useDesignStore().setLocalDesign(char.design)
      useSkillStore().setCharacterSkillsFromFirebase(char.skills)
      useMartialSkillsStore().setCharacterCombatStylesFromFirebase(char.combatStyles)
      useMartialSkillsStore().setCharacterSpecializationsFromFirebase(char.specializations)
      useMartialPerksStore().pullManualMartialPerksFromFirebase()
      useMartialPerksStore().setCharacterMartialPerksFromFirebase(char.martialPerks)
      useSpellStore().setCharacterSpellgroupsFromFirebase(char.spellgroups)
      await useSpellStore().pullManualSpellgroupsFromFirebase()
      useMartialPerksStore().setUpBuildDisplay(char.perkChanged)
      useMartialSkillsStore().setUpBuildSpecializationDisplay(char.specializationChanged)
      useMartialSkillsStore().setUpBuildDisplay(char.combatStyleChanged)
      useSkillStore().setUpBuildDisplay(char.skillChanged)
      useEquipmentStore().setLocalEquipment(char.equipment)
      useEquipmentStore().setArmorsWithAbilities(char.armorsWithAbilities || [''])
      useEquipmentStore().setGenericsWithAbilities(char.genericsWithAbilitites || [''])
      useEquipmentStore().setWeaponsWithAbilities(char.weaponsWithAbilitites || [''])
      useEquipmentStore().setShieldsWithAbilities(char.shieldsWithAbilitites || [''])
      usePerformanceStore().setLocalPracticedStyles(char.practicedStyles)
      usePerformanceStore().setLocalPerformanceStyles(char.performanceStyles)
      usePerformanceStore().setUpBuildDisplay(char.performanceStyleChanged)
      useEffigyStore().setLocalEffigies(char.effigies || {})
    },
    async setCharacterFromAdventure(char: any) {
      this.loading = true
      useSpellStore().clearBuildDisplayOnly()
      useMartialPerksStore().clearBuildDisplay()
      useMartialSkillsStore().clearMartialSkillsBuild()
      useSkillStore().clearEffectiveSkills()
      const character = {
        id: char.id,
        name: char.name,
        image: char.image,
        details: char.details || {},
        archetype: char.archetype,
        backstory: char.backstory,
        motivation: char.motivation,
        totalAbilityPoints: char.totalAbilityPoints,
        originSkills: char.originSkills,
        adventure: char.adventure,
        condition: char.condition,
        attributes: char.attributes,
        exceptionals: char.exceptionals,
        traits: char.traits || {},
        currentHp: char.currentHp || 0,
        barrierHp: char.barrierHp || 0,
        currentMana: char.currentMana || 0,
        showNewPlayerGuide: char.showNewPlayerGuide === undefined ? true : char.showNewPlayerGuide,
        overviewValues: char.overviewValues || {},
        stressedExceptionals: char.stressedExceptionals || {}
      }
      this.statusEffects = char.statusEffects
      this.setLocalCharacter(character)
      this.setLocalMartialAttacks(char.martialAttacks || {})

      useMartialPerksStore().setLocalPerkGain(char.perkGain)
      useDesignStore().setLocalDesign(char.design)
      useSkillStore().setCharacterSkillsFromFirebase(char.skills)
      useMartialSkillsStore().setCharacterCombatStylesFromFirebase(char.combatStyles)
      useMartialSkillsStore().setCharacterSpecializationsFromFirebase(char.specializations)
      useMartialPerksStore().setCharacterMartialPerksFromFirebase(char.martialPerks)
      useSpellStore().setCharacterSpellgroupsFromFirebase(char.spellgroups)
      useSpellStore().setUpBuildDisplay(char.spellChanged)
      useMartialPerksStore().setUpBuildDisplay(char.perkChanged)
      useMartialSkillsStore().setUpBuildSpecializationDisplay(char.specializationChanged)
      useMartialSkillsStore().setUpBuildDisplay(char.combatStyleChanged)
      useSkillStore().setUpBuildDisplay(char.skillChanged)
      useEquipmentStore().setLocalEquipment(char.equipment)
      useEquipmentStore().setArmorsWithAbilities(char.armorsWithAbilities || [''])
      useEquipmentStore().setGenericsWithAbilities(char.genericsWithAbilitites || [''])
      useEquipmentStore().setWeaponsWithAbilities(char.weaponsWithAbilitites || [''])
      useEquipmentStore().setShieldsWithAbilities(char.shieldsWithAbilitites || [''])
      usePerformanceStore().setLocalPracticedStyles(char.practicedStyles)
      usePerformanceStore().setLocalPerformanceStyles(char.performanceStyles)
      usePerformanceStore().setUpBuildDisplay(char.performanceStyleChanged)
      useEffigyStore().setLocalEffigies(char.effigies || {})

      this.delay(2000).then(() => {
        useCharacterStore().setLoadingFalse()
      })
    },
    async dispatchHardReset() {
      this.loading = true
      useMartialPerksStore().buildDisplayMartialPerks = []
      useMartialSkillsStore().buildDisplaySpecializations = []
      useMartialSkillsStore().buildDisplayCombatStyles = []
      useSpellStore().buildDisplaySpells = []
      useSpellStore().buildDisplaySpellgroups = []
      useSkillStore().effectiveSkills = []
      useMartialPerksStore().setUpBuildDisplayFromScratch()
      useMartialSkillsStore().setUpBuildDisplayFromScratch()
      useSkillStore().setEffectiveSkills()
      useSpellStore().setUpBuildDisplayFromScratch()
      this.delay(2000).then(() => {
        this.setLoadingFalse()
      })
    },
    async pullCharacterFromFirebase(uid: string, cid: string, fromScratch = false) {
      this.loading = true
      this.here = 1
      useManualStore().pullManualFromFirebase()

      this.characterRef = onSnapshot(doc(db, 'User/' + uid + '/Character/' + cid), (doc) => {
        const character = {
          id: doc.data()?.id,
          name: doc.data()?.name,
          image: doc.data()?.image,
          details: doc.data()?.details || {},
          archetype: doc.data()?.archetype,
          backstory: doc.data()?.backstory,
          motivation: doc.data()?.motivation,
          totalAbilityPoints: doc.data()?.totalAbilityPoints,
          originSkills: doc.data()?.originSkills,
          adventure: doc.data()?.adventure,
          condition: doc.data()?.condition,
          attributes: doc.data()?.attributes,
          exceptionals: doc.data()?.exceptionals,
          traits: doc.data()?.traits || {},
          currentHp: doc.data()?.currentHp || 0,
          barrierHp: doc.data()?.barrierHp || 0,
          currentMana: doc.data()?.currentMana || 0,
          overviewValues: doc.data()?.overviewValues || {},
          showNewPlayerGuide: doc.data()?.showNewPlayerGuide === undefined ? true : false,
          stressedExceptionals: doc.data()?.stressedExceptionals || {}
        }
        this.backstory = doc.data()?.backstory || ''
        this.setLocalCharacter(character)
        const design = {
          primaryTheme: doc.data()?.design.primaryTheme,
          secondaryTheme: doc.data()?.design.secondaryTheme,
          inputBacking: doc.data()?.design.inputBacking,
          sidebarBacking: doc.data()?.design.sidebarBacking,
          sidebarText: doc.data()?.design.sidebarText,
          inputText: doc.data()?.design.inputText,
          primaryText: doc.data()?.design.primaryText,
          pageBackdrop: doc.data()?.design.pageBackdrop,
          alertTheme: doc.data()?.design.alertTheme,
          font: doc.data()?.design.font,
          titleFont: doc.data()?.design.titleFont,
          icon: doc.data()?.design.icon,
          charIcon: doc.data()?.design.charIcon,
          charIconFlair: doc.data()?.design.charIconFlair,
          iconFill: doc.data()?.design.iconFill,
          iconColor: doc.data()?.design.iconColor
        }
        this.statusEffects = doc.data()?.statusEffects || {}
        this.effigies = doc.data()?.effigies || {}
        this.customStatusEffects = doc.data()?.customStatusEffects || {}
        this.setLocalMartialAttacks(doc.data()?.martialAttacks || {})
        useSpellStore().setCharacterSpellgroupsFromFirebase(doc.data()?.spells)
        useSpellStore().setLocalArcaneBattery(doc.data()?.arcaneBattery || 0)
        useMartialPerksStore().setLocalPerkGain(doc.data()?.perkGain)
        useDesignStore().setLocalDesign(design)
        useSkillStore().setCharacterSkillsFromFirebase(doc.data()?.skills)
        useMartialSkillsStore().setCharacterCombatStylesFromFirebase(doc.data()?.combatStyles)
        useMartialSkillsStore().setCharacterSpecializationsFromFirebase(doc.data()?.specializations)
        useMartialPerksStore().pullManualMartialPerksFromFirebase()
        useMartialPerksStore().setCharacterMartialPerksFromFirebase(doc.data()?.perks)
        useAdventureStore().setLocalAdventureFromCharacter(doc.data()?.adventure || {})
        useMartialPerksStore().setUpBuildDisplay(doc.data()?.perkChanged)
        useMartialSkillsStore().setUpBuildSpecializationDisplay(doc.data()?.specializationChanged)
        useMartialSkillsStore().setUpBuildDisplay(doc.data()?.combatStyleChanged)
        useSkillStore().setUpBuildDisplay(doc.data()?.skillChanged)
        useEquipmentStore().setLocalEquipment(doc.data()?.equipment)
        useEquipmentStore().setArmorsWithAbilities(doc.data()?.armorsWithAbilities || [''])
        useEquipmentStore().setGenericsWithAbilities(doc.data()?.genericsWithAbilitites || [''])
        useEquipmentStore().setWeaponsWithAbilities(doc.data()?.weaponsWithAbilitites || [''])
        useEquipmentStore().setShieldsWithAbilities(doc.data()?.shieldsWithAbilitites || [''])
        usePerformanceStore().setLocalPracticedStyles(doc.data()?.practicedStyles)
        usePerformanceStore().setLocalPerformanceStyles(doc.data()?.performanceStyles)
        usePerformanceStore().setUpBuildDisplay(doc.data()?.performanceStyleChanged)
        useEffigyStore().setLocalEffigies(doc.data()?.effigies || {})
        console.log(
          !character.adventure?.adventureId,
          useSpellStore().buildDisplaySpellgroups.length > 1,
          useSpellStore().buildDisplaySpellgroups
        )
        if (
          !character.adventure?.adventureId ||
          useSpellStore().buildDisplaySpellgroups.length > 1
        ) {
          useSpellStore().setUpBuildDisplay(doc.data()?.spellChanged)
        }

        if (doc.data()?.entryMap) {
          useJournalStore().setEntryMapFromFirebase(doc.data()?.entryMap)
        } else {
          useJournalStore().setEntryMapFromFirebase({
            entryIds: []
          })
        }
        if (doc.data()?.journalIdKey) {
          useJournalStore().setJournalIdKeyFromFirebase(doc.data()?.journalIdKey)
          if (
            useJournalStore().openFile.id &&
            !useJournalStore().journalIdKey[useJournalStore().openFile.id]
          ) {
            useJournalStore().clearOpenFileAndBookmarks()
            alert(
              'Cleared Bookmarks and Open File!  Navigating between new adventures and charcters will do this!'
            )
          }
        } else {
          useJournalStore().setJournalIdKeyFromFirebase({})
          if (
            useJournalStore().openFile.id &&
            !useJournalStore().journalIdKey[useJournalStore().openFile.id]
          ) {
            useJournalStore().clearOpenFileAndBookmarks()
            alert(
              'Cleared Bookmarks and Open File!  Navigating between new adventures and charcters will do this!'
            )
          }
        }
        if (!doc.data()?.adventure?.adventureId) {
          useJournalStore().setCalendarFromDatabase({
            days: {},
            sections: { 0: {}, names: ['month'] },
            dateFormula: '',
            miniPickerFormula: '',
            organizedBy: '',
            itemsInARow: 7,
            titleSectionFormula: '',
            holidays: {}
          })
        }

        this.delay(2000).then(() => {
          useCharacterStore().setLoadingFalse()
        })
      })
    },
    delay(time: number) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    setLoadingFalse() {
      this.loading = false
    },
    clearCharacterNameAndID() {
      this.id = ''
      this.name = 'Crescent Character'
    },
    async setArchetype(archetype: string, uid: string, cid: string) {
      this.setLocalArchetype(archetype)
      const ret = updateDoc(doc(db, 'User/' + this.getUser() + '/Character/' + cid), {
        archetype: archetype
      })
      console.log(ret)
    },
    async setTotalAbilityPoints(totalAbilityPoints: number, uid: string, cid: string) {
      this.setLocalTotalAbilityPoints(totalAbilityPoints)
      const ret = updateDoc(doc(db, 'User/' + this.getUser() + '/Character/' + cid), {
        totalAbilityPoints: totalAbilityPoints
      })
      console.log(ret)
    },
    async setOrigin(origin: Array<string>, uid: string, cid: string) {
      console.log(origin)
      this.setLocalOrigin(origin)
      const ret = updateDoc(doc(db, 'User/' + this.getUser() + '/Character/' + cid), {
        originSkills: origin
      })
      console.log(ret)
    },
    async setAttribute(attributes: any, uid: string, cid: string) {
      this.setLocalAttributes(attributes)
      const ret = updateDoc(doc(db, 'User/' + this.getUser() + '/Character/' + cid), {
        attributes: attributes
      })
      console.log(ret)
    },
    async setExceptionals(exceptionals: any) {
      this.setLocalExceptionals(exceptionals)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          exceptionals: exceptionals
        }
      )
    },
    async setStressedExceptionals(exceptionals: any) {
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          stressedExceptionals: exceptionals
        }
      )
    },
    async setCurrentAndBarrierHP(currentHp: number, barrierHp: number) {
      this.setLocalCurrentandBarrierHp(currentHp, barrierHp)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          currentHp: currentHp,
          barrierHp: barrierHp
        }
      )
    },
    async setCurrentMana(currentMana: number) {
      this.setLocalMana(currentMana)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          currentMana: currentMana
        }
      )
    },
    async setCharacterName(name: string) {
      this.setName(name)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          name: name
        }
      )
    },
    async setDetails(details: Details) {
      this.setLocalDetails(details)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          details: details
        }
      )
    },
    async setMotivation(motivation: string) {
      this.setLocalMotivation(motivation)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          motivation: motivation
        }
      )
    },
    async setBackstory(backstory: string) {
      this.setLocalBackstory(backstory)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          backstory: backstory
        }
      )
    },
    async setcharacterImage(image: string) {
      this.setImage(image)
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          image: image
        }
      )
    },
    async setMartialAttacks() {
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          martialAttacks: this.martialAttacks
        }
      )
    },
    getUser() {
      let uid = useUserStore().id
      if (this.adventure.gameMasterId === uid) {
        uid = useAdventureStore().currentViewedUserId || uid
      }
      return uid
    },
    async setOverviewValues() {
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          overviewValues: this.overviewValues
        }
      )
    },

    async updateStatusEffects() {
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          statusEffects: this.statusEffects,
          customStatusEffects: this.customStatusEffects
        }
      )
    },
    async updateStatusModifiers() {
      const ret = updateDoc(
        doc(db, 'User/' + this.getUser() + '/Character/' + this.getCharacterId),
        {
          hpStatusModifiers: this.hpStatusModifiers,
          armorStatusModifiers: this.armorStatusModifiers,
          movementStatusModifiers: this.movementStatusModifiers,
          attributeStatusModifiers: this.attributeStatusModifiers,
          diceStatusModifiers: this.diceStatusModifiers,
          mpStatusModifiers: this.mpStatusModifiers,
          manaStatusModifiers: this.manaStatusModifiers,
          customStatusEffects: this.customStatusEffects
        }
      )
    }
  },
  persist: true
})
