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
