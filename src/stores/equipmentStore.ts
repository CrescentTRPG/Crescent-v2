import { defineStore } from 'pinia'
import { useCharacterStore } from './characterStore.js'
import { useUserStore } from './userStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useSkillStore } from './skillsStore.js'
import _ from 'lodash'

export interface Item {
  name: string
  count: number
  description: string
  type: string
  isAttuneable: boolean
  isAttuned: boolean
  equippedStats: Equippable
  holder: string
  holderType: string
}

export interface Potion extends Item {
  name: string
  ingredients: string[] | []
  ability:
    | {
        name: string
        area: string
        duration: string
        target: string
        resistance: string
        cost: string
        description: string
        groupIcon: string
        rank: string
        actionCost: string
        type: string
      }
    | { name: string }
}
export enum itemType {
  Generic,
  Armor,
  Shield,
  Weapon,
  Ingredient,
  Potion
}
export interface Passive {
  modAmount: number
  damageType: string
  name: string
}
export interface Equippable {
  ability: { name: string }
  passives: {}
  material: string
  enchantments: {}
  technicalAddons: {}
  materialCoverings: {}
  equippedStats: any
}
export interface Armor extends Equippable {
  value: number
  weight: string
}
export interface Shield extends Equippable {
  value: number
}
export interface Weapon extends Equippable {
  hands: number
  range: number
  strReq: number
  damageString: string
  specializations: Array<string>
  combatStyles: Array<string>
  isMusical: boolean
  isCustom: boolean
  weaponDamageTypes: Array<string>
}
export interface Coin {
  name: string

  amount: number
  exchangeRate: number
}

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    armorsWithAbilities: [''],
    genericsWithAbilitites: [''],
    shieldsWithAbilitites: [''],
    weaponsWithAbilitites: [''],
    potionsWithAbilities: [''],
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
    alchemicalIngredients: { bases: {}, reagents: {}, mutagens: {} }
  }),
  getters: {
    getArmorSpecs: (state): Item => state.equipment.items.Armor[state.equipment.wornArmor],
    getPrimarySpecs: (state): Item => state.equipment.items.Weapon[state.equipment.primaryHand],
    getWornArmorPassives: (state) => {
      return state.equipment.items.Armor[state.equipment.wornArmor]?.equippedStats?.passives || {}
    },
    getPrimaryHandheldPassives: (state) => {
      return (
        state.equipment.items.Weapon[state.equipment.primaryHand]?.equippedStats?.passives || {}
      )
    },
    getSecondaryHandheldPassives: (state) => {
      return (
        state.equipment.items.Shield[state.equipment.secondaryHand]?.equippedStats?.passives ||
        state.equipment.items.Weapon[state.equipment.secondaryHand]?.equippedStats?.passives ||
        {}
      )
    },
    getAllItems: (context) => {
      return Object.values(context.equipment.items.Generic)
        .concat(Object.values(context.equipment.items.Armor))
        .concat(Object.values(context.equipment.items.Weapon))
        .concat(Object.values(context.equipment.items.Shield)) as Array<Item>
    },
    getTotalAttuneableItems: (context) => {
      return useSkillStore().skills['Crafting']?.rank === 10 ? 7 : 6
    },
    getNumberofAttunedItems: (context) => {
      const items: Array<Item> = Object.values(context.equipment.items.Generic)
        .concat(Object.values(context.equipment.items.Armor))
        .concat(Object.values(context.equipment.items.Weapon))
        .concat(Object.values(context.equipment.items.Shield)) as any

      return items.reduce((acc: number, val: Item) => (val.isAttuned ? acc + 1 : acc), 0)
    },
    getSecondarySpecs: (state): Item =>
      state.equipment.items.Shield[state.equipment.secondaryHand] ||
      state.equipment.items.Weapon[state.equipment.secondaryHand],
    getAbilitites(state) {
      const ret = state.armorsWithAbilities
        .concat(state.genericsWithAbilitites)
        .concat(state.shieldsWithAbilitites)
        .concat(state.weaponsWithAbilitites)
        .concat(state.potionsWithAbilities)
        .map((name) => {
          let obj = undefined
          if (name != '') {
            if (state.equipment.items.Generic[name]?.type === 'Generic') {
              obj = {
                ...state.equipment.items.Generic[name].equippedStats.ability,
                isEquipment: true
              }
            }
            if (state.equipment.items.Armor[name]?.type === 'Armor') {
              obj = {
                ...state.equipment.items.Armor[name].equippedStats.ability,
                isEquipment: true
              }
            }
            if (state.equipment.items.Weapon[name]?.type === 'Weapon') {
              obj = {
                ...state.equipment.items.Weapon[name].equippedStats.ability,
                isEquipment: true
              }
            }
            if (state.equipment.items.Shield[name]?.type === 'Shield') {
              obj = {
                ...state.equipment.items.Shield[name].equippedStats.ability,
                isEquipment: true
              }
            }
            if (state.equipment.items.Potion[name]?.type === 'Potion') {
              obj = {
                ...state.equipment.items.Potion[name].ability,
                isEquipment: true
              }
            }
            return obj
          }
        })
      return ret.filter((item) => item != undefined)
    }
  },
  actions: {
    async setLocalEquipment(equipment: any) {
      this.equipment = equipment
    },
    setAlchemicalIngredientsFromFirebase(ingredients) {
      this.alchemicalIngredients = ingredients
    },
    async setArmorsWithAbilities(armorsWithAbilities: any) {
      this.armorsWithAbilities = armorsWithAbilities
    },
    async setShieldsWithAbilities(shieldsWithAbilitites: any) {
      this.shieldsWithAbilitites = shieldsWithAbilitites
    },
    async setPotionsWithAbilities(potionsWithAbilities: any) {
      this.potionsWithAbilities = potionsWithAbilities
    },
    async setWeaponsWithAbilities(weaponsWithAbilitites: any) {
      this.weaponsWithAbilitites = weaponsWithAbilitites
    },
    async setGenericsWithAbilities(genericsWithAbilitites: any) {
      this.genericsWithAbilitites = genericsWithAbilitites
    },
    updateWornArmor(equipped: string) {
      this.equipment.wornArmor = equipped
      this.setEquipmentInFirebase(this.equipment)
    },
    updatePrimary(equipped: string) {
      this.equipment.primaryHand = equipped
      this.setEquipmentInFirebase(this.equipment)
    },
    updateSecondary(equipped: string) {
      this.equipment.secondaryHand = equipped
      this.setEquipmentInFirebase(this.equipment)
    },
    editInPlace(item: Item) {
      this.equipment.items[item.type][item.name] = item
      this.setEquipmentInFirebase(this.equipment)
    },
    addItem(item: Item | Potion) {
      if (item.equippedStats?.ability?.name && (!item.isAttuneable || item.isAttuned)) {
        if (item.type === 'Generic') {
          this.genericsWithAbilitites.unshift(item.name)
        }
        if (item.type === 'Armor') {
          this.armorsWithAbilities.unshift(item.name)
        }
        if (item.type === 'Weapon') {
          console.log('here')
          this.weaponsWithAbilitites.unshift(item.name)
        }
        if (item.type === 'Shield') {
          this.shieldsWithAbilitites.unshift(item.name)
        }
      }
      if (item.type === 'Potion') {
        this.potionsWithAbilities.unshift(item.name)
      }
      const newEquip = _.cloneDeep(this.equipment)
      newEquip.items[item.type][item.name] = item

      this.setEquipmentInFirebase(newEquip)
    },
    increaseItemAmount(name, amount, type) {
      const newEquip = _.cloneDeep(this.equipment)

      newEquip.items[type][name].count = this.equipment.items[type][name].count + amount
      this.setEquipmentInFirebase(newEquip)
    },
    removeItem(item: Item, unequip = false) {
      if (item.type === 'Armor' && item.name === this.equipment.wornArmor && unequip) {
        this.equipment.wornArmor = ''
      }
      if (item.equippedStats.ability.name && (!item.isAttuneable || item.isAttuned)) {
        if (item.type === 'Generic') {
          this.genericsWithAbilitites = this.genericsWithAbilitites.filter(
            (word) => word != item.name
          )
        }
        if (item.type === 'Armor') {
          this.armorsWithAbilities = this.armorsWithAbilities.filter((word) => word != item.name)
        }
        if (item.type === 'Weapon') {
          this.weaponsWithAbilitites = this.weaponsWithAbilitites.filter(
            (word) => word != item.name
          )
        }
        if (item.type === 'Shield') {
          this.shieldsWithAbilitites = this.shieldsWithAbilitites.filter(
            (word) => word != item.name
          )
        }
      }
      if (item.type === 'Potion') {
        this.potionsWithAbilities = this.potionsWithAbilities.filter((word) => word != item.name)
      }
      delete this.equipment.items[item.type][item.name]
      this.setEquipmentInFirebase(this.equipment)
    },
    setCoins(coins) {
      this.equipment.coins = coins
      this.setEquipmentInFirebase(this.equipment)
    },
    async setEquipment(equipment: any) {
      this.setLocalEquipment(equipment)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        {
          equipment: equipment,
          armorsWithAbilities: this.armorsWithAbilities,
          shieldsWithAbilitites: this.shieldsWithAbilitites,
          weaponsWithAbilitites: this.weaponsWithAbilitites,
          genericsWithAbilitites: this.genericsWithAbilitites,
          potionsWithAbilities: this.potionsWithAbilities
        }
      )
      console.log(ret)
    },
    async setEquipmentInFirebase(equipment: any) {
      const ret = updateDoc(
        doc(
          db,
          'User/' +
            useCharacterStore().getUser() +
            '/Character/' +
            useCharacterStore().getCharacterId
        ),
        {
          equipment: equipment,
          armorsWithAbilities: this.armorsWithAbilities,
          shieldsWithAbilitites: this.shieldsWithAbilitites,
          weaponsWithAbilitites: this.weaponsWithAbilitites,
          genericsWithAbilitites: this.genericsWithAbilitites,
          potionsWithAbilities: this.potionsWithAbilities
        }
      )
      console.log(ret)
    }
  },
  persist: true
})
