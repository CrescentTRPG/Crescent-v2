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
import { useTraitsStore } from './traitsStore.js'
import { useUserStore } from './userStore.js'
import { Details } from '@/components/Character/Details/CoreTraits.vue'
import { useEquipmentStore } from './equipmentStore.js'
import { usePerformanceStore } from './performanceStore.js'

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

interface GenericModifier {
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
    mpStatusModifiers: {},
    movementStatusModifiers: {},
    currentHp: 0,
    currentMana: 0,
    barrierHp: 0,
    spentAbilityPoints: 0,
    totalAbilityPoints: 10,
    originSkills: ['', ''],
    adventure: null,
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
      ability: {},
      rogueActions: []
    },
    plannedSwiftAction: {
      ability: {},
      rogueActions: []
    },
    plannedReaction: {
      ability: {},
      rogueActions: []
    },
    plannedMovementAction: {
      ability: {},
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
    effigies: null,
    faunaTransformations: null,
    journal: null,
    inventory: null,
    skills: null,
    martialSkills: null,
    spells: null,
    martialPerks: null,
    martialAttacks: null
  }),
  getters: {
    getLocalCharacter() {},
    getAgility: (state): number => state.attributes.agility,
    getCharacterId: (state): string => state.id,
    getArchetype: (state): string => state.archetype,
    getAttributes: (state): any => state.attributes,
    getOriginSkills: (state): Array<string> => state.originSkills
  },
  actions: {
    addBasicStatus(status, statusObj) {
      this.statusEffects[status] = statusObj
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
    },
    removeAttributeStatusModifier(modifier: AttributeModifier) {
      const attribute = modifier.attribute.toLowerCase()
      console.log(this.attributeStatusModifiers, attribute)

      const modRef = this.attributeStatusModifiers[attribute][modifier.modifierType]
      const pos = modifier.modAmount + ' '
      console.log(modRef, pos)
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (
        (
          (this.attributeStatusModifiers[attribute] &&
            Object.values(this.attributeStatusModifiers[attribute][modifier.modifierType])) ||
          {}
        ).length == 0
      ) {
        delete this.attributeStatusModifiers[attribute][modifier.modifierType]
      }
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
    },
    removeManaStatusModifier(modifier: GenericModifier) {
      console.log(modifier.modifierType)
      const modRef = this.manaStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      console.log(modRef, pos)
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(this.manaStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete this.manaStatusModifiers[modifier.modifierType]
      }
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
    },
    removeArmorStatusModifier(modifier: GenericModifier) {
      const modRef = this.armorStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) delete modRef[pos]
      if (Object.values(this.armorStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete this.armorStatusModifiers[modifier.modifierType]
      }
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
      console.log(this.customStatusEffects)
      this.customStatusEffects[status.name] = status
    },
    removeStatus(name: string) {
      if (this.customStatusEffects[name]) {
        this.removeLinkedModifiers(this.customStatusEffects[name])
        delete this.customStatusEffects[name]
      }
      if (this.statusEffects[name]) {
        delete this.statusEffects[name]
      }
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
        const attr = modArr[0].split(',')[1]
        if (attr) {
          this.removeAttributeStatusModifier({
            linkedStatus: '',
            modifierType: modArr[1].substring(1, modArr[1].length - 1),
            modAmount: parseInt(modArr[2].substring(1)),
            attribute: attr.substring(1)
          })
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
      this.exceptionals[exceptional] = exceptionalValue
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          exceptionals: this.exceptionals
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
    },
    async setCharacter(character: Character, uid: string, cid) {
      const char = await useCollection('User/' + uid + '/Character/' + cid, character)
      console.log(char)
    },
    async addCharacter(uid: string) {
      const char = {
        name: 'Crescent Character',
        image: '',
        archetype: '',
        totalAbilityPoints: 10,
        originSkills: ['', ''],
        adventure: null,
        backstory: '',
        creatures: {},
        barrierHp: 0,
        currentHp: 0,
        currentMana: 0,
        equipment: {
          coins: {
            '0': { name: 'Copper', amount: 0, exchangeRate: 10, num: 0 },
            '1': { name: 'Silver', amount: 0, exchangeRate: 10, num: 1 },
            '2': { name: 'Gold', amount: 0, exchangeRate: 10, num: 2 },
            '3': { name: 'Platninum', amount: 0, exchangeRate: 10, num: 3 }
          },
          wornArmor: '',
          primaryHand: '',
          secondaryHand: '',
          attunedItems: [],
          items: {
            Generic: {},
            Armor: {},
            Shield: {},
            Weapon: {},
            Ingredient: {},
            Potion: {}
          }
        },
        combatStyleChanged: {},
        performanceStyleChanged: {},
        performanceStyles: {},
        practicedStyles: {},
        skillChanged: {},
        skills: {},
        specializationChanged: {},
        specializations: {},
        spellChanged: {},
        spells: {},

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
        motivation: '',
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
        traits: {},
        perks: {},
        combatStyles: {},
        perkChanged: {},
        perkGain: ['', '', '', '', '']
      }
      const defaultDesign = {
        primaryTheme: '#422c58',
        secondaryTheme: '#c2b172',
        inputBacking: '#f1eef1',
        inputText: '#000000',
        sidebarBacking: '#e7e2e9',
        sidebarText: '#000000',
        primaryText: '#dfdfdf',
        pageBackdrop: '#dfdfdf',
        alertTheme: '#c15be6',
        font: 'Bahnschrift',
        titleFont: 'Bahnschrift',
        icon: 'bi bi-square',
        iconFill: 'bi bi-check',
        charIconFlair: 'bi bi-stars',
        charIcon: 'bi bi-moon-stars-fill',
        iconColor: '#000000'
      }
      const ret = await useCollection('User/' + uid + '/Character', char)
      ret && this.setId(ret.id)

      useDesignStore().setDesign(defaultDesign, uid, this.getCharacterId)
      updateDoc(doc(db, 'User/' + uid + '/Character/' + this.getCharacterId), {
        id: this.getCharacterId
      })
      console.log(ret)
    },
    unsubscribe() {
      this.characterRef()
    },
    async pullCharacterFromFirebase(uid: string, cid: string, fromScratch = false) {
      this.loading = true
      this.here = 1
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
          currentMana: doc.data()?.currentMana || 0
        }
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
        useManualStore().pullManualFromFirebase()
        useMartialPerksStore().setLocalPerkGain(doc.data()?.perkGain)
        useDesignStore().setLocalDesign(design)
        useSkillStore().setCharacterSkillsFromFirebase(doc.data()?.skills)
        useMartialSkillsStore().setCharacterCombatStylesFromFirebase(doc.data()?.combatStyles)
        useMartialSkillsStore().setCharacterSpecializationsFromFirebase(doc.data()?.specializations)
        useMartialPerksStore().pullManualMartialPerksFromFirebase()
        useMartialPerksStore().setCharacterMartialPerksFromFirebase(doc.data()?.perks)
        useSpellStore().setCharacterSpellgroupsFromFirebase(doc.data()?.spells)
        useSpellStore().pullManualSpellgroupsFromFirebase()

        useSpellStore().setUpBuildDisplay(doc.data()?.spellChanged)
        useMartialPerksStore().setUpBuildDisplay(doc.data()?.perkChanged)
        useMartialSkillsStore().setUpBuildSpecializationDisplay(doc.data()?.specializationChanged)
        useMartialSkillsStore().setUpBuildDisplay(doc.data()?.combatStyleChanged)
        useSkillStore().setUpBuildDisplay(doc.data()?.skillChanged)
        useEquipmentStore().setLocalEquipment(doc.data()?.equipment)
        usePerformanceStore().setLocalPracticedStyles(doc.data()?.practicedStyles)
        usePerformanceStore().setLocalPerformanceStyles(doc.data()?.performanceStyles)
        usePerformanceStore().setUpBuildDisplay(doc.data()?.performanceStyleChanged)
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
    async setArchetype(archetype: string, uid: string, cid: string) {
      this.setLocalArchetype(archetype)
      const ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), { archetype: archetype })
      console.log(ret)
    },
    async setTotalAbilityPoints(totalAbilityPoints: number, uid: string, cid: string) {
      this.setLocalTotalAbilityPoints(totalAbilityPoints)
      const ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), {
        totalAbilityPoints: totalAbilityPoints
      })
      console.log(ret)
    },
    async setOrigin(origin: Array<string>, uid: string, cid: string) {
      console.log(origin)
      this.setLocalOrigin(origin)
      const ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), { originSkills: origin })
      console.log(ret)
    },
    async setAttribute(attributes: any, uid: string, cid: string) {
      this.setLocalAttributes(attributes)
      const ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), {
        attributes: attributes
      })
      console.log(ret)
    },
    async setExceptionals(exceptionals: any) {
      this.setLocalExceptionals(exceptionals)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          exceptionals: exceptionals
        }
      )
    },
    async setCurrentAndBarrierHP(currentHp: number, barrierHp: number) {
      this.setLocalCurrentandBarrierHp(currentHp, barrierHp)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          currentHp: currentHp,
          barrierHp: barrierHp
        }
      )
    },
    async setCurrentMana(currentMana: number) {
      this.setLocalMana(currentMana)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          currentMana: currentMana
        }
      )
    },
    async setCharacterName(name: string) {
      this.setName(name)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          name: name
        }
      )
    },
    async setDetails(details: Details) {
      this.setLocalDetails(details)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          details: details
        }
      )
    },
    async setMotivation(motivation: string) {
      this.setLocalMotivation(motivation)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          motivation: motivation
        }
      )
    },
    async setBackstory(backstory: string) {
      this.setLocalBackstory(backstory)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          backstory: backstory
        }
      )
    },
    async setcharacterImage(image: string) {
      this.setImage(image)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + this.getCharacterId),
        {
          image: image
        }
      )
    }
  },
  persist: true
})
