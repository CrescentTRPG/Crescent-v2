import { defineStore } from 'pinia'

interface Character {
  id: String
  name: String
  image: String
  archetype: String
  totalAbilityPoints: number
  originSkills: Array<String>
  adventure: any //map
  traits: any //collection
  condition: any //map
  attributes: any //map
  exceptionals: any //map
  efiigies: any //collection
  faunaTransformations: any //collection
  performanceStyles: any //collection
  journal: any //collection
  design: any //map
  details: any //map
  inventory: any //collection
  skills: any //collection
  martialSkills: any //collection
  spells: any //collection
  martialPerks: any //collection
  martialAttacks: any //collection
}
export const useCharacterStore = defineStore('character', {
  state: () => ({
    name: '',
    image: '',
    archetype: '',
    totalAbilityPoints: 10,
    originSkills: ['', ''],
    adventure: null,
    traits: null,
    condition: null,
    attributes: null,
    exceptionals: null,
    effigies: null,
    faunaTransformations: null,
    performanceStyles: null,
    journal: null,
    design: null,
    inventory: null,
    skills: null,
    martialSkills: null,
    spells: null,
    martialPerks: null,
    martialAttacks: null
  }),
  getters: {},
  actions: {
    setDisplayName(displayName: string) {
      this.displayName = displayName
    },
    setEmail(email: string) {
      this.email = email
    }
  },
  persist: true
})
