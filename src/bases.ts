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
  actionEconomy: 'default',
  powerLevel: 0,
  tags: []
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
