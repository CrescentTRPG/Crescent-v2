export const DEFAULT_CHARCTER = {
  name: 'Crescent Character',
  image: '',
  archetype: '',
  totalAbilityPoints: 10,
  originSkills: ['', ''],
  adventure: { gameMasterId: null, adventureId: null },
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
  arcaneBattery: 0,
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

export interface ShareObject {
  [key: string]: SharedPlayer
}
export interface SharedPlayer {
  id: string
  name: string
}

export interface LineData {
  [key: string]: { event: string; description: string; date: string; linkedEntries: LinkedEntryMap }
}
export interface LinkedEntryMap {
  [key: string]: LinkedEntry
}

export interface LinkedEntry {
  id: string
  name: string
  relationship: string
}

export interface JournalEntry {
  shared: undefined | ShareObject | null
  type: string
  name: string
  journalEntryData: HTMLJournalEntry | BioEntry | ImageEntry | TimeLine
  tags: string
  linkedEntries: LinkedEntryMap
  linkedBy: LinkedEntryMap
  id?: string
}

export interface Day {
  key: number
  name: string | undefined
}
export interface Days {
  [key: number]: Day
}

export interface Section {
  subSection: Array<any>
  name: string
  key: number
  arrangedVals: Array<number>
  numSubsections: number
}
export interface Sections {
  [key: number]: Section
  names: String[]
}
export interface Holiday {
  id: number
  index: number
  icon: string
  name: ''
  dateObj?: any
}

export interface Year {
  subSection: Array<any>
  key: number
  largestSectionName: ''
}

export interface HTMLJournalEntry {
  data: HTMLElement | string
}
export interface BioEntry {
  oneLiner: string
  date: number
  dateLabel: string
  image: string
  description: HTMLJournalEntry
}
export interface ImageEntry {
  image: string
  iconData?: IconData
}

export interface IconData {
  [key: number]: IconStuff
}

export interface IconStuff {
  x: number
  y: number
  color: string
  icon: string
  title: string
  description: string
  scale: number
  titleHoverAlways: boolean
}

export interface EventEntry {
  image: string
}
export interface TimeLine {
  lineData: LineData
  events: string[]
}
export enum AbilityType {
  Spellgroup,
  MartialPerk,
  CombatStyle,
  Specialization
}
export const JOUNRAL_ENTRY: JournalEntry = {
  shared: null,
  type: 'html',
  name: 'New Journal Entry',
  journalEntryData: { data: '<p></p>' },
  tags: '',
  linkedEntries: {},
  linkedBy: {}
}

export interface MartialAttack {
  name: string
  icon: string
  mp: number
  description: string
  actionCost: 'Core Action'
  attackObj: AttackDetails
}
export interface AttackDetails {
  [key: string]: StrikeInfo | Universal
  'Next Successful Strike': StrikeInfo
  'Universal Skills': Universal
}
export interface Universal {
  forceTypeMalleableToBe: undefined | string
  increasedCosts: number
  modeObj: Mode
  modes: string[]
  rollstring: string
  skills: any
  modifiesSomeCosts: number
  modifiesSomeCostsSkill: string
  increasedCostsSkill: string
}
export interface Condition {
  [key: string]: {
    alternateAppliesStatus: any
    alternateCausesSave: string | undefined
    alternateDamageString: string | undefined
    alternateMinWeaponDamage: number
    alternateRollstring: string
    condition: string
    useCondition: boolean
  }
}
export interface Mode {
  [key: string]: {
    conditionObj: Condition
    alternateRollstring: string
    rollstring: string
  }
}
export const DEFAULT_WEAPON_ATTACK: MartialAttack = {
  name: '',
  icon: 'gi-saber-pistol',
  mp: 0,
  description: '',
  actionCost: 'Core Action',
  attackObj: {
    'Next Successful Strike': {
      conditionObj: {},
      hand: '',
      handRestriction: '',
      modeObj: {},
      modes: [''],
      rollstring: '',
      skills: {},
      specialization: '',
      mirrors: '',
      alternateRollstring: ''
    },
    'Universal Skills': {
      forceTypeMalleableToBe: '',
      increasedCosts: 0,
      modeObj: {},
      modes: [],
      rollstring: '',
      skills: {},
      modifiesSomeCosts: 0,
      modifiesSomeCostsSkill: '',
      increasedCostsSkill: ''
    },
    'Strike 1': {
      conditionObj: {},
      hand: 'Primary',
      handRestriction: '',
      modeObj: {},
      modes: [''],
      rollstring: '',
      skills: {},
      specialization: '',
      mirrors: '',
      alternateRollstring: ''
    }
  }
}

export interface StrikeInfo {
  conditionObj: Condition
  hand: string
  handRestriction: string
  modeObj: Mode
  modes: string[]
  rollstring: string
  skills: any
  specialization: string
  mirrors: undefined | string
  alternateRollstring: undefined | string
}
export const ABILITY_ENTRY: AbilityEntry = {
  name: 'ability',
  groupIcon: 'gi-uncertainty',
  rank: 1,
  type: 'MartialPerk',
  playerAccessible: {
    allPlayers: false,
    specificPlayers: null
  },
  statBlockAccessible: false,
  source: 'custom'
}
export interface AbilityEntry {
  name: string
  groupIcon: string
  rank: number
  type: string
  playerAccessible: {
    allPlayers: boolean
    specificPlayers: null | string[]
  }
  statBlockAccessible: boolean
  source: string
}
export const ABILITY_ENTRY_SPELLGROUP = {
  ...ABILITY_ENTRY,
  type: 'Spellgroup',
  rankLimiter: 'Power',
  groupPurchaseLimiter: 'Intelligence',
  inOrder: true,
  spells: {},
  manaGain: 1,
  resource: 'mana',
  flatCost: false,
  baseCost: 1
}
export const ABILITY_ENTRY_COMBAT_STYLE = {
  ...ABILITY_ENTRY,
  type: 'CombatStyle',
  attributes: [],
  skills: {},
  baseCost: 1
}

export const ABILITY_ENTRY_SPECIALIZATION = {
  ...ABILITY_ENTRY,
  type: 'Specialization',
  combatStyles: [],
  skills: {},
  baseCost: 1
}

export const ABILITY_ENTRY_MARTIAL_PERK = {
  ...ABILITY_ENTRY,
  type: 'MartialPerk',
  baseCost: 3,
  ability: {}
}
export const DEFAULT_EFFIGY = {
  ...DEFAULT_CHARCTER,
  name: 'New Effigy',
  groupIcon: 'gi-uncertainty',
  level: 1,
  isAscendant: false,
  formed: false,
  effigyType: '',
  movementType: '',
  majorBonuses: {},
  minorBonuses: {},
  chosenResistance: '',
  chosenSucceptibility: '',
  chosenImmunity: '',
  chosenVulnerability: '',
  damageType: '',
  base: 0,
  flight: 0,
  swim: 0,
  climb: 0,
  burrow: 0,
  statusEffects: {},
  attributeStatusModifiers: {
    strength: {},
    agility: {},
    perception: {},
    willpower: {},
    health: {},
    intelligence: {},
    power: {},
    charisma: {}
  },
  armorStatusModifiers: {},
  hpStatusModifiers: {},
  manaStatusModifiers: {},
  mpStatusModifiers: {},
  movementStatusModifiers: {},
  customStatusEffects: {},
  diceStatusModifiers: {},
  totalMana: 0,
  armorDvs: 0,
  moveDvs: 10,
  shieldDvs: 0,
  bonusDvs: 0,
  mp: 0
}

export const DEFAULT_STAT_BLOCK = {
  ...DEFAULT_CHARCTER,
  statusEffects: {},
  totalMana: 0,
  totalHp: 0,
  armorDvs: 0,
  moveDvs: 10,
  shieldDvs: 0,
  bonusDvs: 0,
  mp: 0,
  actionEconomy: 'default',
  powerLevel: 0,
  tags: [],
  defaultVersion: 'Default Version',
  stressedExceptionals: {},
  armorStatusModifiers: {},
  hpStatusModifiers: {},
  manaStatusModifiers: {},
  mpStatusModifiers: {},
  movementStatusModifiers: {},
  customStatusEffects: {},
  diceStatusModifiers: {},
  attributeStatusModifiers: {
    strength: {},
    agility: {},
    perception: {},
    willpower: {},
    health: {},
    intelligence: {},
    power: {},
    charisma: {}
  },
  base: 30,
  flight: 0,
  swimming: 0,
  climbing: 0,
  burrowing: 0,
  versions: [],
  currentVersion: '',
  versionObjs: {},
  journalEntry: {},
  icon: ''
}

export const DEFAULT_COMBAT = {
  combatants: {},
  initiative: {},
  notes: '',
  tags: [],
  name: 'Default Combat'
}

export const DEFAULT_DESIGN = {
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
export const oneToTen = [
  { value: 0, text: '0' },
  { value: 1, text: '1' },
  { value: 2, text: '2' },
  { value: 3, text: '3' },
  { value: 4, text: '4' },
  { value: 5, text: '5' },
  { value: 6, text: '6' },
  { value: 7, text: '7' },
  { value: 8, text: '8' },
  { value: 9, text: '9' },
  { value: 10, text: '10' }
]

export function deepCopy(obj) {
  let copy

  // Handle the 3 simple types, and null or undefined
  if (null == obj || 'object' != typeof obj) return obj

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = deepCopy(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}

    for (const attr in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, attr)) copy[attr] = deepCopy(obj[attr])
    }
    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}
