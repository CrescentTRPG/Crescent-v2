import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { useDesignStore } from './designStore.js'
import { useSkillStore } from './skillsStore.js'
import { db } from '@/firebase/config.js'
import { onSnapshot, doc, query, getDocs, updateDoc } from 'firebase/firestore'

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
    id: '',
    name: '',
    image: '',
    archetype: '',
    totalAbilityPoints: 10,
    originSkills: ['', ''],
    adventure: null,
    traits: null,
    condition: null,
    attributes: { strength: 0 },
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
    setLocalAttributes(attributes: any) {
      this.attributes = attributes
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
      let char = await useCollection('User/' + uid + '/Character/' + cid, character)
      console.log(char)
    },
    async addCharacter(uid: string) {
      let char = {
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
        primaryText: '#dfdfdf',
        pageBackdrop: '#dfdfdf',
        alertTheme: '#c15be6',
        font: 'Bahnschrift',
        titleFont: 'Bahnschrift',
        icon: 'square',
        iconFill: 'check',
        iconColor: '#000000'
      }
      let ret = await useCollection('User/' + uid + '/Character', char)
      ret && this.setId(ret.id)

      useDesignStore().setDesign(defaultDesign, uid, this.getCharacterId)
      updateDoc(doc(db, 'User/' + uid + '/Character/' + this.getCharacterId), {
        id: this.getCharacterId
      })
      console.log(ret)
    },
    async pullCharacterFromFirebase(uid: string, cid: string) {
      onSnapshot(doc(db, 'User/' + uid + '/Character/' + cid), (doc) => {
        let character = {
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
        let design = {
          primaryTheme: doc.data()?.design.primaryTheme,
          secondaryTheme: doc.data()?.design.secondaryTheme,
          inputBacking: doc.data()?.design.inputBacking,
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
        useDesignStore().setLocalDesign(design)
        useSkillStore().pullCharacterSkillsFromFirebase()
        useSkillStore().pullAllSkillsFromFirebase()
      })
    },
    async setArchetype(archetype: string, uid: string, cid: string) {
      this.setLocalArchetype(archetype)
      let ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), { archetype: archetype })
      console.log(ret)
    },
    async setAttribute(attributes: string, uid: string, cid: string) {
      this.setLocalAttributes(attributes)
      let ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), { attributes: attributes })
      console.log(ret)
    }
  },
  persist: true
})
