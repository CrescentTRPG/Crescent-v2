export const DEFAULT_EXAMPLE_CHARACTER = {
  name: 'Example Character',
  image: '',
  archetype: 'Elementalist',
  totalAbilityPoints: 10,
  originSkills: ['', ''],
  adventure: { gameMasterId: null, adventureId: null },
  backstory: '',
  creatures: {},
  barrierHp: 0,
  currentHp: 18,
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
  perkGain: ['', '', '', '', ''],
  statusEffects: {},
  totalMana: 0,
  totalHp: 18,
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

export const pyromaniac = {
  archetype: 'Elementalist',
  archetypeDescription:
    '<p>There are alot of good choices for an archetype for this character.  For this character, I selected <i>Elementalist</i>.  I saw them as a highly damaging squishy character and being an elementalist would naturally make all their attacks cause fire suffering giving them an even greater edge on damage.  Some other good choices for their Archetype include: Mystic, Nomad, or Mage.</p>',
  buildName: 'Pyromaniac',
  buildDescription:
    '<p><h5>1/5 Difficulty</h5></br>This character is all about: "How can I cast big fire as soon as possible?".  Upsides: This character will deal more damage than almost any other level one character and is pretty simple to play. Downsides: This character is squishy and lacks variety in their actions.</p>',
  atributeDescriptions:
    '<p>This Character should prioritize <i>Power</i>, then <i>Perception</i>, then <i>Intelligence</i>.<hr> This Character Prioritizes <i>Power</i>, since all spellcasters use <i>Power</i> as the modifier for their spells resistance checks.  They also prioritize <i>Power</i> since it restricts the maximum spell rank they can have.</br></br> This Character Prioritizes <i>Perception</i>, since once they run out of mana they will be restricted to their cantrip which requires a to hit roll. </br></ br></br>This Character Prioritizes <i>Intelligence</i>, since once they level, as an elementalist they will likely want to aquire more elemental spellgroups.  The purchasing of multiple elemental and core magics groups are limited by Intelligence.</p>',
  originSkills: ['Metamagic', 'Knowledge'],
  originSkillsDescription:
    '<p>This character may have no ability points allocated in skills, but they still get to pick their origin skills. For this chatacter I have selected Metamagic and Knowledge.  They have high Intelligence and Power, making these skills natural choices.  They may choose to use metamagic to modify their magical spells, in which case the placed roll will be of great use. This character can make use of knowledge immediately to stabalize their teammates, solve puzzles, and try and recall lore or information. In the future they can also invest points in it should they wish to heal themselves or others through medicine.</p>',
  exceptional: 'Willpower',
  lunarMotivation: 'Domination',
  lunarMotivationDescription:
    'Any character build may have any motivation.  In this example, Pyromanic thirsts for power. As a child, they felt what it was like to be weak.  Older and stronger kids picked on them; they were never quite popular amongst the other school children.  When their magical abilities awakened as a teen, suddenly everyone respected them. Pyromaniac chases power and so chases not only respect, but subservience. They believe that others are closeminded and undeserving of Power. That through their leadership, everyone would be better off.',
  equipment:
    'Pyromaniac has Light Iron Armor (provides 3 armor DVs) and an Iron Shield (provides 1 shield DV)',

  exceptionalDescription:
    "<p> Exceptionals provide a static +1 bonus to the associated stat and can be stressed for a powerful once per day reaction.  </br></br>This character is fairly exposed, so it's natural to give them one of the defensive reactions to combat that. Since this character is a spellcaster and most effects that can stop you from casting are <i>Willpower</i> based, I've gone with an <i>Exceptional Willpower</i>.</p>",
  abilitiesDesciption:
    "<p>For this character, I chose to purchase four spells vertically in pyromancy to go straight to fireball.  Firebolt is their rank 0 ability which is a simple roll to hit damaging spell.  Firepick-1 may be useful to get them out of a bind, or past a locked door.  Hand of Flame-2 would be useful if they found themselves in a combat where Fireball isn't quite appropriate.  Flashbang-3 would be useful in a grand escape, or perhaps a situation where they want to disorient instead of kill.  Fireball-4 is a classic, big damaging AOE. </br></br>On a standard round of combat, this character might decide to firebolt a target dealing 2d10 fire damage on hit and applying a stack of fire suffering from their archetype. </br></br> You can reference a mock of the characters overview page in the overview tab in this very example! </br> </br></p>",
  stats: {
    ...DEFAULT_EXAMPLE_CHARACTER,
    attributes: {
      strength: 2,
      agility: 4,
      perception: 6,
      willpower: 5,
      health: 5,
      intelligence: 6,
      power: 7,
      charisma: 3
    },
    exceptionals: {
      strength: 0,
      agility: 0,
      perception: 0,
      willpower: 1,
      health: 0,
      intelligence: 0,
      power: 0,
      charisma: 0
    },
    traits: {
      'Bonus Exceptional Willpower': {
        number: '1',
        description:
          'The character has 1 natural Exceptional Willpower(s). Exceptionals grant a static bonus to their associated Attribute and may be stressed for powerful effects...',
        name: 'Bonus Exceptional Willpower',
        ability: {
          type: 'Instantaneous',
          area: 'Self',
          duration: '1 Round',
          actionCost: 'Reaction',
          target: 'Character',
          rank: 'NA',
          description: 'The character automatically makes the attempted resistance check.',
          group: 'Trait Actions',
          resistance: 'N/A',
          name: 'Stress Exceptional Willpower'
        },
        icon: 'gi-inner-self'
      }
    },
    totalMana: 4,
    currentMana: 4,
    armorDvs: 3,
    shieldDvs: 1,

    spells: {
      Pyromancy: {
        inOrder: true,
        baseCost: 1,
        name: 'Pyromancy',
        groupPurchaseLimiter: 'Intelligence',
        groupIcon: 'gi-small-fire',

        spells: {
          Firebolt: {
            resistance: 'Fire',
            area: 'Single Target',
            target: "LOS 40'",
            rank: 0,
            name: 'Firebolt',
            duration: 'Instantaneous',
            actionCost: 'Core Action',
            type: 'Evocation',
            spellgroup: 'Pyromancy',
            description:
              'Caster makes a ranged attack roll, firing an arc of flame from their fingertips inflicting (Rank/2)d10 fire damage to the target on hit. '
          },
          Firepick: {
            rank: 1,
            spellgroup: 'Pyromancy',
            area: 'Single Target',
            type: 'Continuous',
            resistance: 'Fire',
            target: "LOS 10' + 5'/F",
            actionCost: 'Core Action',
            name: 'Firepick',
            duration: '1 +1/F Minutes',
            description:
              "Caster makes a ranged attack roll, inflicting 1 + 1/2F d10 fire damage if used against a living target. The effect's common usage is carving in solid structures. When utilized, the firepick gives 1 + 2/F placed rolls on crafting checks, given some time, can carve a hole through a door, break a lock, weld, melt metal and even cauterize minor wounds. "
          },
          'Hand of Flame': {
            duration: '4 + 2/F Rounds',
            area: "5' Sphere",
            actionCost: 'Core Action',
            description:
              'Immediately upon casting this spell, and then as a Swift Action during all later turns, the caster can make a ranged attack roll with a floating hand made of fire (Provided they are within the LOS), inflicting 3 + 1/2F d6 fire damage on hit.',
            rank: 2,
            spellgroup: 'Pyromancy',
            type: 'Continuous',
            target: "LOS 40' + 20'/F",
            name: 'Hand of Flame',
            resistance: 'Fire'
          },
          Flashbang: {
            area: "20' + 5'/F",
            name: 'Flashbang',
            spellgroup: 'Pyromancy',
            rank: 3,
            actionCost: 'Core Action',
            target: "LOS 30 + 15/F'",
            description:
              "Caster creates an explosion of energy that leaves those within 20' + 5'/F of the radius blinded and Deafened on a failed HEA check. On a successful check, targets may choose whether they are blinded or Deafened. Affected targets can re-attempt with a swift action to remove one of the effects. ",
            type: 'Continuous',
            resistance: 'HEA',
            duration: '1 + 1/F Minute'
          },
          Fireball: {
            description:
              'Caster condenses energy into a single spark that flies to the targeted area. Energy is then violently released, inflicting 8 + 1/F d6 fire damage with a HEA save for half damage. The fireball ignites flammable objects and targets, inflicting an instance of suffering (Fire) to targets that fail the save. ',
            actionCost: 'Core Action',
            resistance: 'HEA,Fire',
            duration: 'Instantaneous',
            type: 'Evocation',
            target: "LOS 60 + 25/F'",
            spellgroup: 'Pyromancy',
            rank: 4,
            name: 'Fireball',
            area: "20 + 5/F' Radius"
          }
        },
        manaGain: 1,
        rankLimiter: 'Power',
        source: 'Base'
      }
    }
  }
}

export const ScarletThorn = {
  archetype: 'Rogue',
  archetypeDescription:
    '<p>I envisioned Scarlet Thorn as a support who is great at disabling opponents and assisting teamates.  I specifically chose groups with lots of swift actions by giving them Performance and Flora, making Rogue a natural fit.  Other good archetypes for this character include Nomad and Monk since both provide powerful reactions to save teammates.</p>',
  buildName: 'Scarlet Thorn',
  buildDescription:
    '<p><h5>3/5 Difficulty</h5></br>Simultaneously Beloved and Bemoaned, Scarlet Thorn is the epitome of a character that excells at buffing and debuffing, with the option to heal thrown in as well. They do not work well working alone, but are great within a team.</p>',
  atributeDescriptions:
    '<p>This Character should prioritize <i>Charisma</i>, then <i>Power</i>. <hr> This Character Prioritizes <i>Charisma</i>, as it is the modifier setting their Performance Checks.  Having a high <i>Charisma</i> also syngergizes with their exceptional charsima and it leaves room for this character to get more <i>Charisma</i> based spellgroups in the future.</br></br> This Character Prioritizes <i>Power</i>, since spellcasters use <i>Power</i> as the modifier for their spells resistance checks.  They also prioritize <i>Power</i> since it restricts the maximum spell rank they can have.</br> </p>',
  originSkills: ['Performance', 'Interpersonal'],
  originSkillsDescription:
    "<p>This Character prioritizes <i>Charisma</i> more than any other, so it's only natural that they get placed rolls in both <i>Charisma</i> based skills.</p>",
  exceptional: 'Charisma',
  lunarMotivation: 'Immortality',
  lunarMotivationDescription:
    'Any character build may have any motivation.  In this example, Scarlet Thorn loves the spotlight.  Scarlet Thorn wants to walk into a room and hear an audible gasp and a collective whisper.  They want to hear their name whispered in hushed tones and known accross history.  The ultimate glory would be to have monuments, likenesses crafted, legacy...',

  equipment:
    'Scarlet Thorn has Medium Iron Armor (provides 5 armor DVs) and an Iron Shield (provides 1 shield DV)',
  exceptionalDescription:
    '<p> Exceptionals provide a static +1 bonus to the associated stat and can be stressed for a powerful once per day reaction.  </br></br>An <i>Exceptional Charisma</i> will give the character the opportunity to protect themselves or others using their excellent <i>Charisma</i> Score.</p>',
  abilitiesDesciption:
    '<p>This Character put 2 ranks in Performance with a Vocal Specialization, 2 ranks into Flora, Selected the Arcana Spell Sear, and put their final rank into Turmoil. </br></br>On a standard round of Combat, Scarlet Thorn may decide to use their performance ability Rap to knock enemies prone and give them a displaced roll on their next attack roll.  Since this is a swift action and they are a <i>Rogue</i> they can use this up to four times.  They also might chose to Heal their allies with Lazarite Growth -2 or use Screamo to bolster allies or weaken the Saves enemies dish out.  If they have to, they can attack with Sear-0.</p>',
  stats: {
    ...DEFAULT_EXAMPLE_CHARACTER,
    attributes: {
      strength: 4,
      agility: 5,
      perception: 2,
      willpower: 6,
      health: 5,
      intelligence: 3,
      power: 6,
      charisma: 7
    },
    exceptionals: {
      strength: 0,
      agility: 0,
      perception: 0,
      willpower: 0,
      health: 0,
      intelligence: 0,
      power: 0,
      charisma: 1
    },
    skills: {
      Performance: {
        skill: 'Performance',
        id: '',
        rank: 2,
        source: 'Base',
        attribute: 'Charisma'
      }
    },
    practicedStyles: {
      Vocal: {
        Rap: {
          resistance: 'AGI',
          type: 'Activated',
          target: "LOS 80'",
          rank: 2,
          description:
            'Pointing out flaws with their beats, the character contests their CHA against the AGI of the target,\nknocking them prone and giving them a displaced roll on their next attack roll on success.',
          actionCost: 'Swift Action',
          duration: '1 Round',
          passive: false,
          name: 'Rap',
          area: 'Single Target',
          known: false,
          groupIcon: 'gi-sing',

          source: 'base',
          style: 'Vocal'
        },
        Screamo: {
          passive: false,
          description:
            'Twisting the flow of reality with their voice, the character gives the target a displaced roll or + 2 bonus on\nsetting resistance checks until the start of the character’s next turn.',
          actionCost: 'Swift Action',
          duration: 'Instantaneous',
          target: "LOS 10'*Rank",
          area: 'Single Target',
          type: 'Activated',
          name: 'Screamo',
          resistance: 'N/A',
          groupIcon: 'gi-sing',
          rank: 2,
          known: false,
          source: 'base',
          style: 'Vocal'
        }
      }
    },
    traits: {
      'Bonus Exceptional Charisma': {
        description:
          'The character has 1 natural exceptional Charisma(s). Exceptionals grant a static bonus to their associated Attribute and may be stressed for powerful effects...',
        name: 'Bonus Exceptional Charisma',
        number: '1',
        icon: 'gi-discussion',
        ability: {
          type: 'Instantaneous',
          target: "LOS 40'",
          rank: 'NA',
          area: 'Single Target',
          description:
            "The target gains a penalty on to hit rolls equivalent to the character's <i>Charisma</i> until the start of their next turn.",
          actionCost: 'Reaction',
          resistance: 'N/A',
          name: 'Stress Exceptional Charisma',
          group: 'Trait Actions',
          duration: '1 Round'
        }
      }
    },
    totalMana: 3,
    currentMana: 3,
    armorDvs: 5,
    shieldDvs: 1,
    spells: {
      Flora: {
        inOrder: true,
        baseCost: 1,
        name: 'Flora',
        groupPurchaseLimiter: 'Charisma',
        groupIcon: 'gi-vine-whip',
        spells: {
          'Seed Scatter': {
            area: "15' + 5'/F Line",
            description:
              "Caster directs a stream of leaves outwards, originating from their hands and striking anything in the stream's path, AGI save to negate. Any targets hit by the stream are pushed ten feet back and knocked prone. ",
            type: 'Focus',
            actionCost: 'Core Action',
            rank: 1,
            name: 'Seed Scatter',
            resistance: 'AGI',
            spellgroup: 'Flora',
            target: 'Caster',
            duration: '4 + 2/F Rounds'
          },
          'Rampant Verdance': {
            type: 'Evocation',
            duration: 'Plant Lifespan',
            area: 'Special',
            target: "LOS 40'",
            resistance: 'N/A',
            actionCost: 'Swift Action',
            name: 'Rampant Verdance',
            description:
              'Caster concentrates on a (Rank * 5) radius. Plant life begins to erupt in the area, if it is physically impossible the plant life instead immediately dies upon eruption this restriction holds true for all spells in this group that rely upon plantlife. ',
            rank: 0,
            spellgroup: 'Flora'
          },
          'Lazarite Growth': {
            area: "10' + 5'/F Radius",
            name: 'Lazarite Growth',
            spellgroup: 'Flora',
            actionCost: 'Swift Action',
            description:
              'Caster infuses energy into an area- reviving plants and healing targets. All targets recover 3d4 + 2/F d4 HP - in addition to automatically bringing any non-sentient dead plant matter back to life . When revived or reinfused with life, plants are adapted to the surroundings in such a way that they are capable of surviving, however extreme. Sentient plants recover 4 + 2/F d10 HP (Including those under the effect of Plantkin) from this spell. ',
            resistance: 'N/A',
            rank: 2,
            duration: 'Plant Lifespan',
            type: 'Evocation',
            target: "LOS 100' + 50'/F"
          }
        },
        manaGain: 1,
        rankLimiter: 'Power',
        source: 'Base'
      },
      Turmoil: {
        inOrder: true,
        baseCost: 1,
        name: 'Turmoil',
        groupPurchaseLimiter: 'Charisma',
        groupIcon: 'gi-unstable-orb',
        spells: {
          'Primordial Sphere': {
            spellgroup: 'Turmoil',
            area: 'Self',
            actionCost: 'Swift Action',
            duration: 'Instantaneous',
            description:
              "Caster surrounds themselves in a sphere of raw chaotic energy, granting themselves their choice of mundane resistance or elemental resistance until the start of their next turn. However, whichever resistance they don't choose, they become susceptible to. ",
            target: 'Caster',
            name: 'Primordial Sphere',
            rank: 0,
            type: 'Evocation',
            resistance: 'N/A'
          },
          Ignition: {
            type: 'Evocation',
            area: 'Single Target',
            spellgroup: 'Turmoil',
            target: "LOS 40' + 20'/F",
            actionCost: 'Reactionary',
            rank: 1,
            name: 'Ignition',
            description:
              'As a reaction to a skill check, save/check, or attack roll, roll 1d4. Caster may choose to add this to the rolled value. ',
            duration: 'Instantaneous',
            resistance: 'N/A'
          }
        },
        manaGain: 1,
        rankLimiter: 'Power',
        source: 'Base'
      },
      Arcana: {
        baseCost: 3,
        flatCost: true,
        groupIcon: 'gi-magic-palm',
        groupPurchaseLimiter: 'None',
        inOrder: true,
        manaGain: 0,
        name: 'Arcana',
        rankLimiter: 'Power',
        spells: {
          Sear: {
            actionCost: 'Core Action',
            area: "(Spell Rank)' Radius",
            description:
              'Caster concentrates their arcane energy in a specific area, searing those inside with (Spell Rank/2) d6 adaptive damage. HEA save to halve the damage.',
            duration: 'Instantaneous',
            name: 'Sear',
            rank: 0,
            resistance: 'HEA',
            spellgroup: 'Arcana',
            target: "LOS 30'",
            type: 'Evocation'
          }
        },

        source: 'Base'
      }
    }
  }
}

export const IronBlade = {
  archetype: 'Warden',
  archetypeDescription:
    '<p>For Iron Blade, I chose Warden.  This will make them naturally tanky against their choice of mundane or elemental damage</p>',
  buildName: 'Iron Blade',
  buildDescription:
    '<p><h5>2/5 Difficulty</h5></br>Iron Blade is a Martial Warden, they carry a sword and are adept at both protecting their allies and tanking damage. The Iron Blade is pretty good at dealing and mitigating damage, but their weakness lies in facing opponents with mind altering effects, or perhaps a simple riddle</p>',
  atributeDescriptions:
    '<p>This Character should prioritize <i>Strength</i> and <i>Perception</i>. <hr> This Character Prioritizes <i>Strength</i>, as it is the modifier for setting their Sword skills and martial perks.  It also limits the maximum rank martial perk they may know.</br></br> This Character Prioritizes <i>Perception</i> since they rely on rolls to hit to deal damage</br> </p>',
  originSkills: ['Might', 'Awareness'],
  originSkillsDescription:
    '<p>This character wants to to be great at studying their surroundings and performing feats of Brawn, so I have selected Awareness and Might as their origin skills.</p>',
  exceptional: 'Health',
  equipment:
    'Iron Blade has a standard iron bastard sword(2d8) which takes up both of their hands and has Heavy Iron Armor (provides 7 armor DVs)',
  lunarMotivation: 'Kinship',
  lunarMotivationDescription:
    'Any character build may have any motivation.  In this example, Iron Blade has a family that they care deeply for.  In the wake of the nefarious blight sweeping their lands, someone must stand in its way.  Iron Blade does so with a heavy heart, hoping that they can return, but for now takes comfort in the found family of their adventuring party.',

  exceptionalDescription:
    '<p> Exceptionals provide a static +1 bonus to the associated stat and can be stressed for a powerful once per day reaction.  </br></br>An <i>Exceptional Health</i> will give the character a great defensive reaction to help them tank damage.</p>',
  abilitiesDesciption:
    '<p>This character put two ranks in Heavy Weapons, two ranks in Swords, took the Martial Perk Mitigative-1, and put one rank in Fitness</br></br>On a standard round of combat, this character might decide to attack with their sword investing all their MP into their Swords Skill Lethal IV. They would make a roll to hit and If their Perception roll exceeds or meets the targets dvs deal 2d8 (base damage of their bastard sword) + 8 (from the 2 ranks in Lethal IV). Note that MP replenishes for each <i>Weapon Attack</i>, so they may do this attack each turn.</br></br>Another powerful ability they have is the Mitigative perk, this lets them reactionarily boost DVS, reduce damage, or take a hit for someone else.   </br></br> You can reference a mock of the characters overview page in the overview tab in this very example! </br> </br></p>',
  stats: {
    ...DEFAULT_EXAMPLE_CHARACTER,
    attributes: {
      strength: 7,
      agility: 5,
      perception: 6,
      willpower: 5,
      health: 6,
      intelligence: 3,
      power: 2,
      charisma: 4
    },
    exceptionals: {
      strength: 0,
      agility: 0,
      perception: 0,
      willpower: 0,
      health: 1,
      intelligence: 0,
      power: 0,
      charisma: 0
    },
    traits: {
      'Bonus Exceptional Health': {
        icon: 'gi-broccoli',
        name: 'Bonus Exceptional Health',
        number: '1',
        description:
          'The character has 1 natural exceptional Health(s). Exceptionals grant a static bonus to their associated Attribute and may be stressed for powerful effects...',
        ability: {
          rank: 'NA',
          name: 'Stress Exceptional Health',
          group: 'Trait Actions',
          resistance: 'N/A',
          description: 'The character automatically critically succeds a Health check or save.',
          target: 'Character',
          actionCost: 'Reaction',
          duration: '1 Round',
          type: 'Instantaneous',
          area: 'Self'
        }
      }
    },
    totalHp: 24,
    currentHp: 24,
    totalMana: 0,
    currentMana: 0,
    armorDvs: 7,
    mp: 2,
    shieldDvs: 0,
    spells: {},
    perkGain: ['hitpoints', '', '', '', ''],
    perks: {
      Mitigative: {
        name: 'Mitigative',
        rank: 1,
        known: true,
        source: 'Base',
        perkGroup: 'Defensive Perks'
      }
    },
    combatStyles: {
      Heavy: {
        groupIcon: 'gi-strong-man',
        index: 0,
        id: '',
        name: 'Heavy',
        source: 'Base',
        rank: 2,
        attributes: ['Strength']
      }
    },
    specializations: {
      Swords: {
        combatStyles: ['Heavy', 'Versatile'],
        id: '',
        source: 'Base',
        rank: 2,
        name: 'Swords'
      }
    },
    skills: {
      Fitness: { rank: 1, source: 'Base', skill: 'Fitness', id: '', attribute: 'Health' }
    }
  }
}

export const SureShot = {
  archetype: 'Mystic',
  archetypeDescription:
    '<p>For Sure Shot, I chose Mystic.  Sure Shot is built around Mystic to deliver three ultra powerful attacks per day.</p>',
  buildName: 'Sure Shot',
  buildDescription:
    "<p><h5>4/5 Difficulty</h5></br>Sure Shot is a Mystic Archer.  They have the power to imbue three attacks per day with intense magical force.  They aren't quite tanky nor squishy and are extremely dependant on rolls to hit.  Choosing the martial perk Dodging-1 gave them higher DVs, however it also made them weaker to effects like prone and pin. They are also especially weak to Health Saves.</p>",
  atributeDescriptions:
    '<p>This Character should prioritize <i>Perception</i>, then <i>Agility</i> and <i>Power</i>. <hr> This Character Prioritizes <i>Perception</i> since as a Mystic, they imbue Magical energy into to-hit rolls and make that attack an all or nothing blow.</br></br> This Character Prioritizes <i>Agility</i> since it is the Modifier and Rank Cap for their Bow Skills as well as Martial Perks.</br></br>This Character Prioritizes <i>Power</i>, since it caps the maximum rank spell they can learn, thought they definately prioritize it less than the other two Attributes.</br> </p>',
  originSkills: ['Sublety', 'Awareness'],
  originSkillsDescription:
    '<p>I envision that this character wants to be able to sneak around, so putting their origin skills as Sublety and Awareness will help them accomplish this.</p>',
  exceptional: 'Perception',
  lunarMotivation: 'Ideology',
  lunarMotivationDescription:
    "Any character build may have any motivation.  In this example, Sure Shot is a member of a rebel group whos aim is to dethrone the crown.  They believe the current King to be a fraud, a duplicate puppet planted by a shadow organization.  Sure Shot's moral code compells them to right this wrong. They seek to get close to the King for an opportunity...",

  equipment:
    "Sure Shot has a standard iron longbow(1d10) which takes up both of their hands and has Light Iron Armor (provides 3 armor DVs), though it doesn't get much use due to their dodging Ability",
  exceptionalDescription:
    '<p> Exceptionals provide a static +1 bonus to the associated stat and can be stressed for a powerful once per day reaction.  </br></br>An <i>Exceptional Perception</i> will help provide assurance that their mystic shot will hit.</p>',
  abilitiesDesciption:
    "<p>Sure Shot has 2 ranks in Versatile Combat Style, 1 Rank in Bows, 1 rank in the Light Spellgroup, 1 rank in the Tempest Spellgroup and 1 rank in the Charms Spellgroup.</br></br>Sure Shot has good damage and utility. On a standard turn, they will likely be looking to use a mystic charge. By selecting many different spellgroups to put a single rank in, they have several different options for their mystic shot.</ br></br>Ther base Attack will deal 1d10(longbow) + 4(2 ranks of Lethal II).  On top of this they can add a few different mystic options...</br><h5>Piercing Light</h5>Their most damaging choice.  This will add 2d8 divine damage to the attack and blind the struck target.</br></br><h5>Daze</h5>A powerful disabling choice.  If an enemy has cast a focus ability, this will disrupt that.  Additionally it will give them a displaced roll on Perception and Intelligence Checks (Remember that to hit rolls are Perception Checks!).</br></br><h5>Lightning Whip</h5>This may be more niche, but still very useful when you need it.  This will make the attack pull the opponent back next to you.  Given that your bow has a range of 80', That's a big distance to be pulled!  You can snipe an enemy from far away to pull them into the center of your party.</br></br>When you are under fire, Dodging provides a very useful reaction.  It will let you contest an attack roll with an attack roll of your own, sniping the attack out of the way.</br><hr>Remember that until this characters levels and puts more ranks in bows, our 1 Rank in bows is primarily to have access to the passive Recurve.  If a shot misses, Recurve allows the character to redirect it to a different enemy, or in the case of reactionary movement, back at the same enemy but this time with a displaced roll.</br></br>Note: Since this character only has one rank in the Light spellgroup, their Rank-0 ability Guiding Light does not yet deal any damage.  The ability does Rank/2 d8 damage.  Since we only have one rank in that particular spellgroup, and Crescent always rounds number down, the ability does 0d8 damage!  This ability will deal damage in later levels once the character has purchased at least a rank 2 ability in the spellgroup.</br></br>You can reference a mock of the characters overview page in the overview tab in this very example! </br> </br></p>",
  stats: {
    ...DEFAULT_EXAMPLE_CHARACTER,
    attributes: {
      strength: 4,
      agility: 6,
      perception: 7,
      willpower: 5,
      health: 3,
      intelligence: 2,
      power: 6,
      charisma: 5
    },
    exceptionals: {
      strength: 0,
      agility: 0,
      perception: 1,
      willpower: 0,
      health: 0,
      intelligence: 0,
      power: 0,
      charisma: 0
    },
    traits: {
      'Bonus Exceptional Perception': {
        description:
          'The character has 1 natural exceptional Perception(s). Exceptionals grant a static bonus to their associated Attribute and may be stressed for powerful effects...',
        name: 'Bonus Exceptional Perception',
        ability: {
          area: 'Self',
          actionCost: 'Reaction',
          type: 'Instantaneous',
          description:
            'The character does not roll on their next attack roll - they instead automatically hit (within reason.)',
          group: 'Trait Actions',
          name: 'Stress Exceptional Perception',
          resistance: 'N/A',
          rank: 'NA',
          duration: '1 Round',
          target: 'Character'
        },
        icon: 'gi-angry-eyes',
        number: '1'
      }
    },
    totalHp: 21,
    currentHp: 21,
    totalMana: 3,
    currentMana: 3,
    moveDvs: 16,
    armorDvs: 0,
    shieldDvs: 0,
    spells: {
      Tempest: {
        inOrder: true,
        name: 'Tempest',
        groupPurchaseLimiter: 'Charisma',
        manaGain: 1,
        source: 'Base',
        rankLimiter: 'Power',
        spells: {
          'Lightning Whip': {
            spellgroup: 'Tempest',
            actionCost: 'Swift Action',
            type: 'Evocation',
            description:
              "Caster produces a whip of pure lightning energy, pulling a target toward themselves by making a melee attack roll with (Rank*10)' reach. ",
            area: 'Single Target',
            duration: 'Instantaneous',
            name: 'Lightning Whip',
            target: "LOS (Rank*10)'",
            rank: 0,
            known: true,
            resistance: 'N/A'
          },
          Zap: {
            spellgroup: 'Tempest',
            actionCost: 'Swift Action',
            description:
              "Caster teleports LOS 10' + 5'/F inflicting 1 + 1/2F d10 lightning damage to all targets within 5' of the caster upon arrival. ",
            rank: 1,
            duration: 'Instantaneous',
            name: 'Zap',
            area: 'Self',
            target: "LOS 10' + 10'/F",
            resistance: 'N/A',
            type: 'Evocation'
          }
        },
        baseCost: 1,
        groupIcon: 'gi-zeus-sword'
      },
      Charms: {
        name: 'Charms',
        groupIcon: 'gi-charm',
        inOrder: true,
        groupPurchaseLimiter: 'Intelligence',
        source: 'Base',
        spells: {
          Daze: {
            resistance: 'WIL',
            known: true,
            description:
              "Target loses (Rank) memloc'd locations, loses grip of any active focus spells it is maintaining, and is befuddled for 1 + (Rank/5) rounds, WIL save to negate. Resisting this effect allows the target to automatically succeed on saves against Daze for the next 4 rounds. ",
            target: "LOS 40'",
            spellgroup: 'Charms',
            type: 'Continuous',
            area: 'Single Target',
            actionCost: 'Core Action',
            rank: 0,
            duration: '1 + (Rank/5) Rounds',
            name: 'Daze'
          },
          'Shadow Thought': {
            spellgroup: 'Charms',
            resistance: 'WIL,Charm',
            target: 'Touch',
            area: 'Single Target',
            actionCost: 'Core Action',
            type: 'Continuous',
            name: 'Shadow Thought',
            duration: '8 + 1/F Hours',
            rank: 1,
            description:
              "Target's course of action may be influenced by the caster, as long as the changes do not conflict with the target's wishes, the target receives an inferior WIL, displaced roll on all skill checks for the duration of the ability, and they struggle to form their thoughts, WIL save to negate. "
          }
        },
        manaGain: 1,
        baseCost: 1,
        rankLimiter: 'Power'
      },
      Light: {
        rankLimiter: 'Power',
        source: 'Base',
        baseCost: 1,
        manaGain: 1,
        groupPurchaseLimiter: 'Charisma',
        spells: {
          'Piercing Light': {
            target: "LOS 80' + 10'/F",
            type: 'Continuous',
            area: '1 + 1/2F Targets',
            description:
              "A lance of light flies from the caster's fingertips, inflicting 2 + 1/F d8 divine damage, HEA save for half damage and to negate being blinded until the end of their next turn. ",
            duration: '1 + 1/2F Rounds',
            name: 'Piercing Light',
            rank: 1,
            actionCost: 'Core Action',
            spellgroup: 'Light',
            resistance: 'HEA,Divine'
          },
          'Guiding Light': {
            known: true,
            spellgroup: 'Light',
            rank: 0,
            target: "LOS 40'",
            type: 'Evocation',
            actionCost: 'Core Action',
            duration: 'Instantaneous',
            resistance: 'Divine',
            area: 'Single Target',
            description:
              "Caster makes a ranged attack roll, firing an arc of light from their fingertips inflicting (Rank/2)d8 Divine damage to the target on hit. The light sticks to the target, negating stealth, invisibility, or any attempt to take cover until the end of the caster's next turn. ",
            name: 'Guiding Light'
          }
        },
        name: 'Light',
        inOrder: true,
        groupIcon: 'gi-ball-glow'
      }
    },
    perkGain: ['hitpoints', '', '', '', ''],
    perks: {
      Dodging: {
        charges: 0,
        chargesSpent: 0,
        rank: 1,
        name: 'Dodging',
        perkGroup: 'Defensive Perks',
        known: true,
        source: 'Base'
      }
    },
    combatStyles: {
      Versatile: {
        id: 'Versatile',
        index: 1,
        skill: 'Versatile',
        source: 'Base',
        rank: 2,
        attributes: ['Strength', 'Agility']
      }
    },
    specializations: {
      Bows: { rank: 1, index: 1, source: 'Base', id: '', combatStyles: ['Versatile'], name: 'Bows' }
    },
    skills: {}
  }
}

export const DevoutProtector = {
  archetype: 'Priest',
  archetypeDescription:
    '<p>For Devout Protector, I chose Priest. Devout Protector has a few low range, touch and a self cast spell that benefit from being able to be casted on allies and at greater range.  Some other good choices for their archetype include Sorcerer, Nomad and Mage.</p>',
  buildName: 'Devout Protector',
  buildDescription:
    "<p><h5>1/5 Difficulty</h5></br>Devout protector is a support through and through.  They have multiple methods of healing as well as great defensive buffs to grant their allies.  In a pinch, they can attack but it isn't their focus.</p>",
  atributeDescriptions:
    '<p>This Character should prioritize <i>Power</i>, then <i>Charisma</i> and <i>Perception</i>. <hr> This Character Prioritizes <i>Power</i> since as a Caster, it sets all their resistance checks and restricts the highest rank spell the character can learn</br></br> This Character Prioritizes <i>Charisma</i> since it restricts how many Divine Spellgroups the character can learn and many of the divine groups have great supportive potential.</br></br>This Character Prioritizes <i>Perception</i>, since their only attack involves a roll to hit, though as a support who is built around protecting rather than harming they prioritize it less than the other two Attributes.</br> </p>',
  originSkills: ['Interpersonal', 'Knowledge'],
  originSkillsDescription:
    '<p>I envision that this character is both book smart and personable.  Placed rolls in both these skills will help accomplish that.</p>',
  exceptional: 'Perception',
  lunarMotivation: 'Sacrifice',
  lunarMotivationDescription:
    'Any character build may have any motivation.  In this example, Devout Protector was raised to believe that they are a gift for others.  For better or for worse they give their whole heart to others and have difficulty advocating for their own interests.  They have a poor sense of self and have a tendency to attach themself to people they feel need help.',

  equipment:
    'Devout Protector has Iron Medium Iron Armor (provides 5 armor DVs) and an Iron Shield (provides 1 shield DV)',
  exceptionalDescription:
    '<p> Exceptionals provide a static +1 bonus to the associated stat and can be stressed for a powerful once per day reaction.  </br></br>An <i>Exceptional Agility</i> will help make up for their low <i>Agility</i> and allow them to automatically save an AGI check.</p>',
  abilitiesDesciption:
    '<p>Devout Protector has 2 ranks in the Life Spellgroup, 2 ranks in the Equillibrium Spellgroup, 2 ranks in the Terramancy Spellgroup, and a final rank in Knowledge.</br></br>A great move at the start of Combat is to cast Honor Guard Life-2, this will buff the defenses of your allies.</br></br> Should they need to do damage, they can cast twilight flurry firing a multicolored ray.  On hit, it deals 1d10 Pure Magic Damage.  As the character gains more ranks in Equillibrium, Twilight Flurry will cast more rays at a time</br></br>A fun interaction this character has is that because they are a priest, they can cast Earth Shield-1 on other players.  Earth shield will block LOS Abilities until it is destroyed and effectively take a hit for the character.</br></br>You can reference a mock of the characters overview page in the overview tab in this very example! </br> </br></p>',
  stats: {
    ...DEFAULT_EXAMPLE_CHARACTER,
    attributes: {
      strength: 2,
      agility: 3,
      perception: 6,
      willpower: 5,
      health: 5,
      intelligence: 4,
      power: 7,
      charisma: 6
    },
    exceptionals: {
      strength: 0,
      agility: 1,
      perception: 0,
      willpower: 0,
      health: 0,
      intelligence: 0,
      power: 0,
      charisma: 0
    },
    traits: {
      'Bonus Exceptional Agility': {
        ability: {
          description: 'The character automatically critically succeds an Agility check or save.',
          target: 'Character',
          group: 'Trait Actions',
          resistance: 'N/A',
          duration: '1 Round',
          rank: 'NA',
          name: 'Stress Exceptional Agility',
          actionCost: 'Reaction',
          type: 'Instantaneous',
          area: 'Self'
        },
        description:
          'The character has 1 natural exceptional Agility(s). Exceptionals grant a static bonus to their associated Attribute and may be stressed for powerful effects...',
        name: 'Bonus Exceptional Agility',
        number: '1',
        icon: 'gi-acrobatic'
      }
    },
    totalHp: 18,
    currentHp: 18,
    totalMana: 6,
    currentMana: 6,
    moveDvs: 10,
    armorDvs: 5,
    shieldDvs: 1,
    spells: {
      Life: {
        groupPurchaseLimiter: 'Charisma',
        name: 'Life',
        spells: {
          'Healing Touch': {
            area: 'Single Target',
            spellgroup: 'Life',
            name: 'Healing Touch',
            target: 'Touch',
            duration: 'Instantaneous',
            actionCost: 'Core Action',
            rank: 1,
            description:
              'Caster touches an object or living creature and activates one of the following effects: \\nObject: A small object is restored to pristine condition, reversing any damage caused in the last hour. This cannot influence magic items, any sentient item has a WIL save to negate. \\nCreature: The target recovers 2 + 1/F d10 HP. ',
            resistance: 'N/A',
            type: 'Evocation'
          },
          'Helping Hand': {
            known: true,
            spellIndex: 209,
            type: 'Focus',
            name: 'Helping Hand',
            groupSpellIndex: 0,
            area: 'Single Target',
            rank: 0,
            spellgroup: 'Life',
            groupNumber: 13,
            actionCost: 'Core Action',
            target: 'Touch',
            duration: '1 + 1/F Minutes',
            resistance: 'N/A',
            description:
              'Caster aids the target by granting them a placed roll on the next attack roll, resistance check/save, or skill check of choice. The caster may use this ability (Rank) times per day. '
          },
          'Honor Guard': {
            spellgroup: 'Life',
            area: '6 + 1/F Targets',
            resistance: 'N/A',
            duration: '1 + /F Minutes',
            name: 'Honor Guard',
            description:
              'A sigil is affixed to the target, creating a 12 + 5/F temporary HP barrier. The barrier provides the targets with 2 + 1/2F bonus DVs until broken.',
            actionCost: 'Swift Action',
            rank: 2,
            target: "LOS 10' + 5'/F",
            type: 'Focus'
          }
        },
        baseCost: 1,
        rankLimiter: 'Power',
        inOrder: true,
        manaGain: 1,
        groupIcon: 'gi-cherish',
        source: 'Base'
      },
      Equilibrium: {
        inOrder: true,
        groupPurchaseLimiter: 'Charisma',
        source: 'Base',
        spells: {
          'Energy Transfer': {
            actionCost: 'Core Action',
            duration: 'Instantaneous',
            description:
              "Caster's essence reaches out towards up to 3 + 1/F willing targets, re-distributing their magical energies as they see fit. Caster may freely rearrange the mana pools of the targets, though a single target's maximum mana cannot exceed their normal maximum.",
            name: 'Energy Transfer',
            type: 'Evocation',
            area: '3 + 1/F Targets',
            rank: 2,
            target: "LOS 40' + 20'/F",
            spellgroup: 'Equilibrium',
            resistance: 'N/A'
          },
          'Life Transfer': {
            spellgroup: 'Equilibrium',
            area: '3 + 1/F Targets',
            description:
              "Caster's essence reaches out towards up to 3 + 1/F willing targets, re-distributing their life energies as they see fit. Caster may freely rearrange the HP pools of the targets, though a single target's maximum HP cannot exceed their normal maximum. The caster must use the HP pools of the target and cannot transfer temporary barriers. ",
            actionCost: 'Core Action',
            resistance: 'N/A',
            rank: 1,
            duration: 'Instantaneous',
            name: 'Life Transfer',
            type: 'Evocation',
            target: "LOS 40' + 20'/F"
          },
          'Twilight Flurry': {
            known: true,
            actionCost: 'Core Action',
            groupNumber: 8,
            spellIndex: 129,
            description:
              'Caster makes a series of ranged attack rolls, firing (rank/2) arcs of multi-coloured rays from their fingertips inflicting 1d10 Pure_Magic damage to the target on hit. ',
            spellgroup: 'Equilibrium',
            name: 'Twilight Flurry',
            area: 'Single Target',
            rank: 0,
            type: 'Evocation',
            duration: 'Instantaneous',
            groupSpellIndex: 0,
            resistance: 'Pure_Magic',
            target: "LOS 40'"
          }
        },
        name: 'Equilibrium',
        rankLimiter: 'Power',
        groupIcon: 'gi-circling-fish',
        manaGain: 1,
        baseCost: 1
      },
      Terramancy: {
        inOrder: true,
        spells: {
          Reduction: {
            name: 'Reduction',
            spellgroup: 'Terramancy',
            description:
              "An earthen aura surrounds the target's body. This spell is cast in reaction to the caster or a nearby target being hit by an attack that inflicts mundane damage, reducing the damage by half. ",
            actionCost: 'Reactionary',
            target: "LOS 20' + 5'/F",
            duration: 'Instantaneous',
            resistance: 'N/A',
            area: 'Single Attack',
            rank: 2,
            type: 'Evocation'
          },
          'Earth Shield': {
            rank: 1,
            actionCost: 'Swift Action',
            name: 'Earth Shield',
            type: 'Continuous',
            area: 'Self',
            spellgroup: 'Terramancy',
            target: 'Caster',
            resistance: 'N/A',
            description:
              "Caster manipulates existing stone, earth, or similar substances to create a mobile shield between the target and others. This shield has a HP pool of 8 + 5/F HP. This effect breaks LOS between the target and others; this barrier does not inhibit the wielder's LOS to others. ",
            duration: '4 + 2/F Rounds'
          },
          Harden: {
            type: 'Continuous',
            spellIndex: 313,
            groupSpellIndex: 0,
            rank: 0,
            actionCost: 'Swift Action',
            duration: '1 Round',
            resistance: 'N/A',
            area: 'Willing Target',
            known: true,
            name: 'Harden',
            target: "LOS 40'",
            description:
              "Caster creates a protective barrier composed of earth and rocks around a willing target, granting them (Rank/2) bonus DVs until the start of the character's next turn. ",
            groupNumber: 19,
            spellgroup: 'Terramancy'
          }
        },
        groupIcon: 'gi-mountaintop',
        source: 'Base',
        groupPurchaseLimiter: 'Intelligence',
        rankLimiter: 'Power',
        manaGain: 1,
        name: 'Terramancy',
        baseCost: 1
      }
    },
    perkGain: ['', '', '', '', ''],
    perks: {},
    combatStyles: {},
    specializations: {},
    skills: {
      Knowledge: {
        skill: 'Knowledge',
        index: 6,
        id: '',
        attribute: 'Intelligence',
        rank: 1,
        source: 'Base'
      }
    }
  }
}

export const PoisonBlade = {
  archetype: 'Augur',
  archetypeDescription:
    '<p>For Poison Blade, I chose Augur. This will synergize with their alchemy checks and give them strong dvs.  Another good archetype choice is Monk</p>',
  buildName: 'Poison Blade',
  buildDescription:
    '<p><h5>5/5 Difficulty</h5></br>Poison Blade is a Jack of all Trades. They can support, they can deal damage, and they can provide utility.  Their weakness is that the only defense they have is their DVs, and once they run out of potions and traps they are significantly weaker.</p>',
  atributeDescriptions:
    "<p>This Character should prioritize <i>Agility</i>, then <i>Willpower</i> and <i>Perception</i>. <hr> This Character Prioritizes <i>Agility</i> since as a Light Weapons User, it sets all their resistance checks and restricts the highest rank the character can learn in their Weapon Skills.</br></br> This Character Prioritizes <i>Willpower</i> since Alchemy's Dominant Stat is Willpower.</br></br>This Character Prioritizes <i>Perception</i>, since their attacks involve rolls to hit. Once they get better at alchemy they can throw potions that explode in an AOE.</br> </p>",
  originSkills: ['Alchemy', 'Acrobatics'],
  originSkillsDescription:
    '<p>As an Alchemist, the placed roll in Alchemy is a no-brainer. Additionally, I envisioned this character to be nimble, so the placed roll in Acrobatics reflects this.</p>',
  lunarMotivation: 'Envy',
  lunarMotivationDescription:
    'Any character build may have any motivation.  In this example, Poison Blade is motivated by their past as a street urchin. They feel resentful towords the elite born into wealth and want to claw back whatever they can.  They have troubled relationships with anyone they percieve as undeserving and are prone to theft.',

  exceptional: 'Intelligence',
  equipment:
    'Poison Blade wields a standard Iron Dagger (1d6) in both hands and wears Heavy Iron Armor (provides 7 armor DVs).  With their spare starting funds they may have made a couple of 1d6 imbibed healing poitions, a few thrown potions that deal 1d6 toxic damage and make the target Prone.',
  exceptionalDescription:
    '<p>Exceptionals provide a static +1 bonus to the associated stat and can be stressed for a powerful once per day reaction.  </br></br>An <i>Exceptional Intelligence</i> will be put to great use by a character whose focus is skill checks..</p>',
  abilitiesDesciption:
    '<p>Poison Blade has 2 ranks in the Light Combat Style, 1 rank in the Knives Specialization, 2 ranks Alchemy, and The Martial Perk Traps-1.</br></br>On a typical round of combat, Poison Blade might attack with their knives allocating 1MP to Offhand Attack (Light Combat Style) and 1MP to Lethal Barrage II (Knives Specialization).  This allows them to make two attacks, both dealing 1d6 (Base Daggar Damage) + 2(Lethal Barrage II).  They also may chose to place a trap or throw a poisoning potion as a swift action.  Remember that to utilize potions the Poison Blade needs to prepare them in advance before comabt.</br></br>Poision Blade is named Poison Blade for flavor but their Alchemy potions can do a lot more than just hurt. They can make healing potions, damaging potions, utility potions etc.  Alchemy is a creative process, Alchemist pick ingredients and build the potions of their dreams.  See <i>Alchemy</i> and <i>Alchemical Ingredients</i> for more details</br></br>You can reference a mock of the characters overview page in the overview tab in this very example! </br> </br></p>',
  stats: {
    ...DEFAULT_EXAMPLE_CHARACTER,
    attributes: {
      strength: 3,
      agility: 7,
      perception: 6,
      willpower: 6,
      health: 5,
      intelligence: 4,
      power: 2,
      charisma: 5
    },
    exceptionals: {
      strength: 0,
      agility: 0,
      perception: 0,
      willpower: 0,
      health: 0,
      intelligence: 1,
      power: 0,
      charisma: 0
    },
    traits: {
      'Bonus Exceptional Intelligence': {
        description:
          'The character has 1 natural exceptional Intelligence(s). Exceptionals grant a static bonus to their associated Attribute and may be stressed for powerful effects...',
        name: 'Bonus Exceptional Intelligence',
        number: '1',
        icon: 'gi-smart',
        ability: {
          rank: 'NA',
          type: 'Instantaneous',
          target: 'Character',
          actionCost: 'Reaction',
          resistance: 'N/A',
          area: 'Self',
          name: 'Stress Exceptional Intelligence',
          description:
            'In a spurt of innovation, the character automatically critically succeeds a skill check.',
          group: 'Trait Actions',
          duration: '1 Round'
        }
      }
    },
    totalHp: 18,
    currentHp: 18,
    totalMana: 0,
    currentMana: 0,
    base: 32,
    moveDvs: 10,
    armorDvs: 7,
    shieldDvs: 0,
    spells: {},
    perkGain: ['movespeed', '', '', '', ''],
    perks: {
      Traps: {
        known: true,
        chargesSpent: 0,
        charges: 4,
        perkIndex: 10,
        name: 'Traps',
        rank: 1,
        source: 'Base',
        perkGroup: 'Utility Perks'
      }
    },
    combatStyles: {
      Light: {
        skill: 'Light',
        index: 0,
        attributes: ['Agility'],
        source: 'Base',
        rank: 2,
        id: 'Light',
        groupIcon: 'gi-body-balance'
      }
    },
    specializations: {
      Knives: {
        id: '',
        rank: 1,
        index: 6,
        combatStyles: ['Light'],
        name: 'Knives',
        source: 'Base',
        groupIcon: 'gi-body-balance'
      }
    },
    skills: {
      Alchemy: {
        attribute: 'Willpower',
        skill: 'Alchemy',
        rank: 2,
        id: '',
        source: 'Base',
        index: 1
      }
    }
  }
}
