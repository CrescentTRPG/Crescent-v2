import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { useDesignStore } from './designStore.js'
import { useSkillStore } from './skillsStore.js'
import { db } from '@/firebase/config.js'
import { onSnapshot, doc, query, getDocs, updateDoc } from 'firebase/firestore'
import { useMartialSkillsStore } from './martialSkillsStore.js'
import { useMartialPerksStore } from './martialPerksStore.js'
import { useSpellStore } from './spellsStore.js'

interface Character {
  id: string
  name: string
  image: string
  archetype: string
  totalAbilityPoints: number
  originSkills: Array<string>
  adventure: any //map
  // traits: any //collection
  condition: any //map
  attributes: any //map
  exceptionals: any //map
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
export const useCharacterStore = defineStore('character', {
  state: () => ({
    characterRef: () => {},
    here: 0,
    loading: true,
    id: '',
    name: '',
    image: '',
    archetype: '',
    totalAbilityPoints: 10,
    originSkills: ['', ''],
    adventure: null,
    traits: null,
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
    exceptionals: null,
    effigies: null,
    faunaTransformations: null,
    performanceStyles: null,
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
    setId(id: string) {
      this.id = id
    },
    setLocalArchetype(archetype: string) {
      this.archetype = archetype
    },
    setLocalTotalAbilityPoints(totalAbilityPoints: number) {
      this.totalAbilityPoints = totalAbilityPoints
    },
    setLocalAttributes(attributes: any) {
      this.attributes = attributes
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
    },
    async setCharacter(character: Character, uid: string, cid) {
      const char = await useCollection('User/' + uid + '/Character/' + cid, character)
      console.log(char)
    },
    async addCharacter(uid: string) {
      const char = {
        name: '',
        image: '',
        archetype: '',
        totalAbilityPoints: 10,
        originSkills: ['', ''],
        adventure: null,
        condition: null,
        attributes: null,
        exceptionals: null
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
        icon: 'square',
        iconFill: 'check',
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
    async pullCharacterFromFirebase(uid: string, cid: string) {
      this.loading = true
      this.here = 1
      this.characterRef = onSnapshot(doc(db, 'User/' + uid + '/Character/' + cid), (doc) => {
        const character = {
          id: doc.data()?.id,
          name: doc.data()?.name,
          image: doc.data()?.image,
          archetype: doc.data()?.archetype,
          totalAbilityPoints: doc.data()?.totalAbilityPoints,
          originSkills: doc.data()?.originSkills,
          adventure: doc.data()?.adventure,
          condition: doc.data()?.condition,
          attributes: doc.data()?.attributes,
          exceptionals: doc.data()?.exceptionals
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
          iconFill: doc.data()?.design.iconFill,
          iconColor: doc.data()?.design.iconColor
        }
        useMartialPerksStore().setLocalPerkGain(doc.data()?.perkGain)
        useDesignStore().setLocalDesign(design)
        useSkillStore().pullCharacterSkillsFromFirebase()
        useSkillStore()
          .pullAllSkillsFromFirebase()
          .then(() => {
            useSkillStore().setEffectiveSkills()
          })
        useMartialSkillsStore().pullAllCombatStylesFromFirebase()
        useMartialSkillsStore().pullAllSpecializationsFromFirebase()
        useMartialSkillsStore().pullCharacterCombatStylesFromFirebase()
        useMartialSkillsStore().pullCharacterSpecializationsFromFirebase()
        useMartialPerksStore().pullManualMartialPerksFromFirebase()
        useMartialPerksStore().pullCharacterMartialPerksFromFirebase()
        useSpellStore().pullManualSpellgroupsFromFirebase()
        useSpellStore().pullCharacterSpellgroupsFromFirebase()
        this.delay(1000).then(() => {
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
    }
  },
  persist: true
})
