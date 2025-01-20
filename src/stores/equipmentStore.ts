import { defineStore } from 'pinia'
import { useCharacterStore } from './characterStore.js'
import { useUserStore } from './userStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'

export interface Item {
  name: string
  count: number
  description: string
  type: string
  isAttuneable: boolean
  isAttuned: boolean
  equippedStats: Equippable
}
export enum itemType {
  Generic,
  Armor,
  Shield,
  Weapon,
  Ingredient,
  Potion
}
interface Equippable {
  ability: { name: string }
  passives: {}
  material: string
  enchantments: {}
  technicalAddons: {}
  materialCoverings: {}
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
    }
  }),
  getters: {
    getArmorSpecs: (state): Item => state.equipment.items.Armor[state.equipment.wornArmor],
    getPrimarySpecs: (state): Item => state.equipment.items.Weapon[state.equipment.primaryHand],
    getSecondarySpecs: (state): Item =>
      state.equipment.items.Shield[state.equipment.secondaryHand] ||
      state.equipment.items.Weapon[state.equipment.secondaryHand],
    getAbilitites(state) {
      console.log(state.armorsWithAbilities)
      const ret = state.armorsWithAbilities
        .concat(state.genericsWithAbilitites)
        .concat(state.shieldsWithAbilitites)
        .concat(state.weaponsWithAbilitites)
        .map((name) => {
          let obj = undefined
          if (name != '') {
            if (state.equipment.items.Generic[name]?.type === 'Generic') {
              obj = state.equipment.items.Generic[name].equippedStats.ability
            }
            if (state.equipment.items.Armor[name]?.type === 'Armor') {
              obj = state.equipment.items.Armor[name].equippedStats.ability
            }
            if (state.equipment.items.Weapon[name]?.type === 'Weapon') {
              obj = state.equipment.items.Weapon[name].equippedStats.ability
            }
            if (state.equipment.items.Shield[name]?.type === 'Shield') {
              obj = state.equipment.items.Shield[name].equippedStats.ability
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
    updateWornArmor(equipped: string) {
      this.equipment.wornArmor = equipped
      this.setEquipment(this.equipment)
    },
    updatePrimary(equipped: string) {
      this.equipment.primaryHand = equipped
      this.setEquipment(this.equipment)
    },
    updateSecondary(equipped: string) {
      this.equipment.secondaryHand = equipped
      this.setEquipment(this.equipment)
    },
    editInPlace(item: Item) {
      this.equipment.items[item.type][item.name] = item
      this.setEquipment(this.equipment)
    },
    addItem(item: Item) {
      console.log(item)
      this.equipment.items[item.type][item.name] = item
      if (item.equippedStats.ability.name && (!item.isAttuneable || item.isAttuned)) {
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
      this.setEquipment(this.equipment)
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
      delete this.equipment.items[item.type][item.name]
      this.setEquipment(this.equipment)
    },
    setCoins(coins) {
      this.equipment.coins = coins
      this.setEquipment(this.equipment)
    },
    async setEquipment(equipment: any) {
      this.setLocalEquipment(equipment)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { equipment: equipment }
      )
      console.log(ret)
    }
  },
  persist: true
})
