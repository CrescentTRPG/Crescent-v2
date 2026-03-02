<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import MultiStackIcon from '@/components/MultiStackIcon.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useMartialPerksStore } from '@/stores/martialPerksStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { usePerformanceStore } from '@/stores/performanceStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { useTraitsStore } from '@/stores/traitsStore.ts'
import { storeToRefs } from 'pinia'
import { ComputedRef, computed, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import {
  abilityPointViolation,
  combatStyleRankViolation,
  martialPerkRankViolation,
  skillsRankViolation,
  specializationRankViolation,
  spellGroupPurchaseLimiterViolationAgility,
  spellGroupPurchaseLimiterViolationCharisma,
  spellGroupPurchaseLimiterViolationHealth,
  spellGroupPurchaseLimiterViolationIntelligence,
  spellGroupPurchaseLimiterViolationPerception,
  spellGroupPurchaseLimiterViolationStrength,
  spellGroupPurchaseLimiterViolationWillpower,
  spellGroupRankLimiterViolation
} from '../Utility/RulesConstants.ts'
import RuleError from './Rulings/RuleError.vue'
import RulesLookingGood from './Rulings/RulesLookingGood.vue'
import RuleSuggestion from './Rulings/RuleSuggestion.vue'
import WelcomeMessage from './Rulings/WelcomeMessage.vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const skillStore = useSkillStore()
    const martialSkillsStore = useMartialSkillsStore()
    const martialPerksStore = useMartialPerksStore()
    const traitsStore = useTraitsStore()
    const spellsStore = useSpellStore()
    const { skills } = storeToRefs(skillStore)
    const { combatStyles, specializations } = storeToRefs(martialSkillsStore)
    const { martialPerks } = storeToRefs(martialPerksStore)
    const { totalAbilityPoints, spentAbilityPoints } = storeToRefs(characterStore)
    const { spellgroups } = storeToRefs(spellsStore)
    const modal = ref(false)

    const spellGroupPurchaseLimiter: ComputedRef<Array<string>> = computed((): Array<string> => {
      const groups: any = Object.values(spellgroups.value)

      let numXBased = {
        Charisma: { num: 0, groups: '' },
        Intelligence: { num: 0, groups: '' },
        Perception: { num: 0, groups: '' },
        Power: { num: 0, groups: '' },
        Willpower: { num: 0, groups: '' },
        Strength: { num: 0, groups: '' },
        Agility: { num: 0, groups: '' },
        Health: { num: 0, groups: '' }
      }

      groups.forEach((group) => {
        if (group.groupPurchaseLimiter != 'None') {
          numXBased[group.groupPurchaseLimiter].num += 1

          if (numXBased[group.groupPurchaseLimiter].groups.length == 0) {
            numXBased[group.groupPurchaseLimiter].groups = group.name
          } else {
            numXBased[group.groupPurchaseLimiter].groups += ', ' + group.name
          }
        }
      })

      let ret: Array<string> = []
      if (numXBased.Charisma.num * 2 > characterStore.attributes.charisma) {
        ret.push(
          spellGroupPurchaseLimiterViolationCharisma
            .replace('*NUM*', numXBased.Charisma.num + '')
            .replace('*NEEDNUM*', numXBased.Charisma.num * 2 + '') +
            '. The spell groups in question are: ' +
            numXBased.Charisma.groups
        )
      }
      if (numXBased.Intelligence.num * 2 > characterStore.attributes.intelligence) {
        ret.push(
          spellGroupPurchaseLimiterViolationIntelligence
            .replace('*NUM*', numXBased.Intelligence.num + '')
            .replace('*NEEDNUM*', numXBased.Intelligence.num * 2 + '') +
            '. The spell groups in question are: ' +
            numXBased.Intelligence.groups
        )
      }
      if (numXBased.Perception.num * 2 > characterStore.attributes.perception) {
        ret.push(
          spellGroupPurchaseLimiterViolationPerception
            .replace('*NUM*', numXBased.Perception.num + '')
            .replace('*NEEDNUM*', numXBased.Perception.num * 2 + '') +
            ' The spell groups in question are: ' +
            numXBased.Perception.groups
        )
      }
      if (numXBased.Willpower.num * 2 > characterStore.attributes.willpower) {
        ret.push(
          spellGroupPurchaseLimiterViolationWillpower
            .replace('*NUM*', numXBased.Willpower.num + '')
            .replace('*NEEDNUM*', numXBased.Willpower.num * 2 + '') +
            ' The spell groups in question are: ' +
            numXBased.Willpower.groups
        )
      }
      if (numXBased.Strength.num * 2 > characterStore.attributes.strength) {
        ret.push(
          spellGroupPurchaseLimiterViolationStrength
            .replace('*NUM*', numXBased.Strength.num + '')
            .replace('*NEEDNUM*', numXBased.Strength.num * 2 + '') +
            ' The spell groups in question are: ' +
            numXBased.Strength.groups
        )
      }
      if (numXBased.Agility.num * 2 > characterStore.attributes.agility) {
        ret.push(
          spellGroupPurchaseLimiterViolationAgility
            .replace('*NUM*', numXBased.Agility.num + '')
            .replace('*NEEDNUM*', numXBased.Agility.num * 2 + '') +
            ' The spell groups in question are: ' +
            numXBased.Agility.groups
        )
      }
      if (numXBased.Health.num * 2 > characterStore.attributes.health) {
        ret.push(
          spellGroupPurchaseLimiterViolationHealth
            .replace('*NUM*', numXBased.Health.num + '')
            .replace('*NEEDNUM*', numXBased.Health.num * 2 + '') +
            ' The spell groups in question are: ' +
            numXBased.Health.groups
        )
      }

      return ret
    })

    const tooManyAbilityPoints: ComputedRef<string> = computed((): string => {
      if (totalAbilityPoints.value < spentAbilityPoints.value) {
        return abilityPointViolation
          .replace('*NUM*', spentAbilityPoints.value + '')
          .replace('*NEEDNUM*', characterStore.totalAbilityPoints + '')
      }
      return ''
    })

    const spellGroupRankLimiter: ComputedRef<Array<string>> = computed((): Array<string> => {
      const groups: any = Object.values(spellgroups.value)

      let spellgroupMax = {}
      groups.forEach((group) => {
        let spells: any = Object.values(group.spells).sort((a: any, b: any) => a.rank - b.rank)
        spellgroupMax[group.name] = {
          rank: spells[spells.length - 1]?.rank,
          name: group.name,
          maxRank: characterStore.attributes[group.rankLimiter.toLowerCase()],
          limiter: group.rankLimiter
        }
      })

      let ret: Array<string> = []
      Object.values(spellgroupMax).forEach((spellgroup: any) => {
        if (spellgroup.rank > spellgroup.maxRank) {
          ret.push(
            spellGroupRankLimiterViolation
              .replace('*NUM*', spellgroup.rank)
              .replace('*NEEDNUM*', spellgroup.maxRank)
              .replace('*GROUP*', spellgroup.name)
              .replace('*LIMITER*', spellgroup.limiter)
          )
        }
      })
      return ret
    })

    const formatOptionsString = (combatStyles: Array<string>) => {
      let ret: string = ''
      combatStyles.forEach((style) => {
        ret += style + ' OR '
      })
      return ret.substring(0, ret.length - 4)
    }

    const specializationRank: ComputedRef<Array<string>> = computed((): Array<string> => {
      const groups: any = Object.values(specializations.value)

      let specializationsMax = {}
      groups.forEach((group) => {
        let max = 0
        let maxGroup = ''
        group.combatStyles.forEach((combatStyle) => {
          const rank = martialSkillsStore.combatStyles[combatStyle]?.rank || 0
          if (rank >= max) {
            max = rank
            maxGroup = combatStyle
          }
        })
        specializationsMax[group.name] = {
          rank: group.rank,
          name: group.name,
          maxRank: max,
          limiter: maxGroup,
          combatStyles: group.combatStyles
        }
      })

      let ret: Array<string> = []
      Object.values(specializationsMax).forEach((specialization: any) => {
        if (specialization.rank > specialization.maxRank) {
          ret.push(
            specializationRankViolation
              .replace('*NUM*', specialization.rank)
              .replace('*NEEDNUM*', specialization.maxRank)
              .replace('*SPECIALIZATION*', specialization.name)
              .replace('*COMBATSTYLES*', formatOptionsString(specialization.combatStyles))
          )
        }
      })
      return ret
    })

    const combatStylesRank: ComputedRef<Array<string>> = computed((): Array<string> => {
      const groups: Array<any> = Object.values(combatStyles.value)
      let combatStylesMax = {}
      groups.forEach((group) => {
        let max = 0
        let maxGroup = ''
        group.attributes.forEach((attribute: string) => {
          const rank = characterStore.attributes[attribute.toLowerCase()]
          if (rank >= max) {
            max = rank
            maxGroup = attribute
          }
        })
        combatStylesMax[group.skill] = {
          rank: group.rank,
          name: group.skill,
          maxRank: max,
          limiter: maxGroup,
          attributes: group.attributes
        }
      })

      let ret: Array<string> = []

      Object.values(combatStylesMax).forEach((combatStyle: any) => {
        if (combatStyle.rank > combatStyle.maxRank) {
          ret.push(
            combatStyleRankViolation
              .replace('*NUM*', combatStyle.rank)
              .replace('*NEEDNUM*', combatStyle.maxRank)
              .replace('*COMBATSTYLE*', combatStyle.name)
              .replace('*DOMINANT ATTRS*', formatOptionsString(combatStyle.attributes))
          )
        }
      })
      return ret
    })
    const shorthand: ComputedRef<string> = computed((): string => {
      if (spellGroupPurchaseLimiter.value.length >= 1) {
        return 'Error in Spells'
      } else if (spellGroupRankLimiter.value.length >= 1) {
        return 'Error in Spells'
      } else if (martialPerkRank.value != '') {
        return 'Error in Martial Perks'
      } else if (martialPerkOrder.value.length >= 1) {
        return 'Error in Martial Perks'
      } else if (specializationRank.value.length >= 1) {
        return 'Error in Martial Skills'
      } else if (combatStylesRank.value.length >= 1) {
        return 'Error in Martial Skills'
      } else if (skillsRank.value.length >= 1) {
        return 'Error in Skills'
      } else if (attributeSumViolation.value != '') {
        return 'Error in Core Stats'
      } else if (spellOrder.value.length >= 1) {
        return 'Error in Spells'
      } else {
        return ''
      }
    })

    const martialPerkRank: ComputedRef<string> = computed((): string => {
      const perks = Object.values(martialPerks.value)
      const maxPerkRank = perks.reduce(
        (acc: number, perk: any) => (perk.rank > acc ? perk.rank : acc),
        0
      )
      const limiter = Math.max(
        characterStore.attributes.strength,
        characterStore.attributes.agility
      )

      if (maxPerkRank * 2 > limiter) {
        return martialPerkRankViolation
          .replace('*NUM*', maxPerkRank + '')
          .replace('*NEEDNUM*', limiter + '')
      }
      return ''
    })

    const skillsRank: ComputedRef<Array<string>> = computed((): Array<string> => {
      const items: Array<any> = Object.values(skills.value)
      let skillMax = {}
      items.forEach((skill) => {
        let max = 0
        let maxGroup = ''

        const rank = characterStore.attributes[skill.attribute.toLowerCase()]
        if (rank >= max) {
          max = rank
          maxGroup = skill.attribute
        }
        skillMax[skill.skill] = {
          rank: skill.rank,
          name: skill.skill,
          maxRank: max,
          limiter: maxGroup,
          attribute: skill.attribute
        }
      })

      let ret: Array<string> = []

      Object.values(skillMax).forEach((skill: any) => {
        if (skill.rank > skill.maxRank) {
          ret.push(
            skillsRankViolation
              .replace('*NUM*', skill.rank)
              .replace('*NEEDNUM*', skill.maxRank)
              .replace('*SKILL*', skill.name)
              .replace('*ATTR*', skill.attribute)
          )
        }
      })
      return ret
    })
    const performanceStore = usePerformanceStore()

    const arcaneBatteryRank = computed(() => {
      return parseInt(spellsStore.arcaneBattery + '') >
        parseInt(characterStore.attributes.power + '')
        ? 'The character has selected ' +
            spellsStore.arcaneBattery +
            ' ranks of Arcane Battery, while their Power is only ' +
            characterStore.attributes.power +
            '. The maximum value a character can invest into Arcane Battery is Equal to their power stat.'
        : ''
    })
    const practicedPerformanceStylesViolation = computed(() => {
      let ret: Array<string> = []
      Object.values(performanceStore.practicedStyles).forEach((style) => {
        Object.values(style).forEach((ability: any) => {
          if (
            ability.style != performanceStore.performanceStyles.style1 &&
            ability.style != performanceStore.performanceStyles.style2 &&
            ability.style != performanceStore.performanceStyles.style3 &&
            ability.known
          ) {
            ret.push(
              'The character has practiced the ability: ' +
                ability.name +
                ' from the performance style: ' +
                ability.style +
                " when they haven't selected the style as one of their performance styles.  Either deselect the ability or select the corresponding performance style."
            )
          }
        })
      })
      return ret
    })
    const attrSum: ComputedRef<number> = computed((): number => {
      return Object.values(characterStore.attributes).reduce((acc, val) => acc + val, 0)
    })
    const maxAttrSum: ComputedRef<number> = computed((): number => {
      return Math.min(11, Math.floor(characterStore.totalAbilityPoints / 20)) + 38
    })
    const attributeSumViolation: ComputedRef<string> = computed((): string => {
      if (attrSum.value > maxAttrSum.value) {
        return (
          'You have allocated ' +
          Math.abs(attrSum.value - maxAttrSum.value) +
          ' too many points across your attributes'
        )
      }
      return ''
    })
    const attributeSumSuggestion: ComputedRef<string> = computed((): string => {
      if (attrSum.value < maxAttrSum.value) {
        return (
          'Suggestion: You have  ' +
          Math.abs(maxAttrSum.value - attrSum.value) +
          ' unused attribute points.  You can use these to increase the values of any attribute(Max 10)'
        )
      }
      return ''
    })

    const spellOrder: ComputedRef<Array<string>> = computed((): Array<string> => {
      let ret: Array<string> = []
      Object.values(spellgroups.value).forEach((group: any) => {
        let lastSpellRank: number = 0
        Object.values(group.spells)
          .sort((a: any, b: any) => a.rank - b.rank)
          .forEach((spell: any) => {
            if (spell.rank - lastSpellRank > 1) {
              ret.push(
                'Error in spellgroup ' +
                  group.name +
                  '! You have purchased ' +
                  spell.name +
                  ' (rank ' +
                  spell.rank +
                  ') ' +
                  ' out of order.  The next highest spell in that group is rank ' +
                  lastSpellRank +
                  '. In order to purchase a spell, you must first purchase the rank before it.'
              )
            }
            lastSpellRank = spell.rank
          })
      })
      return ret
    })

    const martialPerkOrder: ComputedRef<Array<string>> = computed((): Array<string> => {
      let ret: Array<string> = []

      let perks = Object.values(martialPerks.value).sort((a: any, b: any) => a.rank - b.rank)
      let lastRank: number = 0

      perks.forEach((perk: any) => {
        if (perk.rank - lastRank > 1) {
          ret.push(
            '! You have purchased ' +
              perk.name +
              ' (rank ' +
              perk.rank +
              ') ' +
              ' out of order.  The next highest perk is rank ' +
              lastRank +
              '. In order to purchase a perk, you must first have a perk from the rank below it.  The group does not matter.'
          )
        }
        lastRank = perk.rank
      })
      return ret
    })
    const exceptionalsMessages: ComputedRef<string> = computed((): string => {
      if (Object.values(characterStore.exceptionals).reduce((acc, val) => val + acc, 0) === 0) {
        return 'Suggestion: Your character has not added any exceptionals.  By default, characters get an exceptional in a single attribute.  These can be added in the Traits tab'
      }
      return ''
    })
    const imAbrandNewBaby: ComputedRef<string> = computed((): string => {
      if (spentAbilityPoints.value === 0) {
        return "Welcome to Crescent!  I'm here to help.  I'll give you tips and let you know if theres an error with your build. If you're completely new to Crescent checkout the Reference Tab and the far right.  This has all kinds of information regaurding how to make a character, how to play, and what abilities to take depending on what you are looking for! I reccomend searching for the new player guide and starting there!"
      }
      return ''
    })

    const pickArchetypeSuggestion: ComputedRef<string> = computed((): string => {
      if (spentAbilityPoints.value === 0) {
        return "You haven't selected an archetype. Archetypes are a powerful and influential bonus.  You can read about archetype abilities by selecting one and hitting the ?.  You may be familar with the idea of a class.  Archetypes do not function like classes since they do not restrict what kinds of abilities a character may select."
      }
      return ''
    })

    const addTraitSuggestionWarden: ComputedRef<string> = computed((): string => {
      if (
        characterStore.archetype === 'warden' &&
        !Object.keys(characterStore.traits).reduce(
          (acc: boolean, val: string) =>
            acc || val === 'Mundane Resistance' || val === 'Elemental Resistance',
          false
        )
      ) {
        return 'Suggestion: Your character is a Warden.  This means they get either Mundane or Elemental Resistance.  You may select one of these as a trait in the traits tab.'
      }
      return ''
    })

    const status: ComputedRef<Array<string>> = computed((): Array<string> => {
      let ret: Array<string> = []
      if (spellGroupPurchaseLimiter.value.length >= 1) {
        ret = ret.concat(spellGroupPurchaseLimiter.value)
      }
      if (spellGroupRankLimiter.value.length >= 1) {
        ret = ret.concat(spellGroupRankLimiter.value)
      }
      if (martialPerkRank.value != '') {
        ret.push(martialPerkRank.value)
      }
      if (martialPerkOrder.value.length >= 1) {
        ret = ret.concat(martialPerkOrder.value)
      }
      if (specializationRank.value.length >= 1) {
        ret = ret.concat(specializationRank.value)
      }
      if (combatStylesRank.value.length >= 1) {
        ret = ret.concat(combatStylesRank.value)
      }
      if (skillsRank.value.length >= 1) {
        ret = ret.concat(skillsRank.value)
      }
      if (attributeSumViolation.value != '') {
        ret.push(attributeSumViolation.value)
      }
      if (spellOrder.value.length >= 1) {
        ret = ret.concat(spellOrder.value)
      }
      if (imAbrandNewBaby.value != '') {
        ret.push(imAbrandNewBaby.value)
      }
      if (tooManyAbilityPoints.value != '') {
        ret.push(tooManyAbilityPoints.value)
      }
      if (exceptionalsMessages.value != '') {
        ret.push(exceptionalsMessages.value)
      }
      if (addTraitSuggestionWarden.value != '') {
        ret.push(addTraitSuggestionWarden.value)
      }
      if (attributeSumSuggestion.value != '') {
        ret.push(attributeSumSuggestion.value)
      }
      if (practicedPerformanceStylesViolation.value.length > 0) {
        ret = ret.concat(practicedPerformanceStylesViolation.value)
      }
      if (arcaneBatteryRank.value != '') {
        ret.push(arcaneBatteryRank.value)
      }
      if (ret.length < 1) {
        return ['Good']
      }
      return ret
    })
    return {
      designStore,
      status,
      modal,
      shorthand,
      practicedPerformanceStylesViolation,
      arcaneBatteryRank
    }
  },
  methods: {
    showModal() {
      this.modal = !this.modal
    }
  },
  components: {
    CustomModal,
    MultiStackIcon,
    RuleSuggestion,
    WelcomeMessage,
    RuleError,
    RulesLookingGood
  }
}
</script>

<template>
  <div style="display: flex; width: 18rem; cursor: pointer" @click="showModal()">
    <div class="dazzley2" :style="{ background: designStore.secondaryTheme }"></div>
    <div
      class="dazzley"
      :style="{ borderColor: designStore.primaryTheme }"
      style="border-left: 5rem solid transparent"
    ></div>
    <div
      class="verticalLine"
      :style="{ borderColor: designStore.secondaryTheme }"
      style="border-left-color: transparent"
    ></div>

    <div
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
      style="flex-grow: 1"
    >
      <div
        class="lil-margin"
        style="
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 3px solid;
        "
        :style="{ borderColor: designStore.primaryTheme }"
      >
        <div style="display: flex; justify-content: flex-start">
          <div
            style="align-self: center; font-size: large; margin-right: 1rem"
            :style="{
              fontFamily: designStore.titleFont
            }"
          >
            Build Status:
          </div>

          <div
            style="
              display: flex;
              margin-top: 0.5rem;
              margin-left: 5%;
              width: 4rem;
              font-family: sans-serif;
            "
          >
            <i
              class="bi bi-check2"
              style="
                font-size: x-large;
                align-self: center;
                z-index: 3;
                transform: scale(1.25, 1.25);
              "
              :style="{ color: designStore.inputText }"
              v-if="status[0] === 'Good'"
            ></i>
            <i
              class="bi bi-question"
              style="
                font-size: x-large;
                align-self: center;
                transform: scale(2, 2);
                z-index: 3;
                margin-top: -0.5rem;
              "
              :style="{ color: designStore.alertTheme }"
              v-if="
                status[0] != 'Good' &&
                (status[0].substring(0, 11) == 'Suggestion:' ||
                  status[0].substring(0, 7) == 'Welcome')
              "
            ></i>
            <i
              id="error"
              class="bi bi-exclamation"
              style="
                font-size: x-large;
                align-self: center;
                transform: scale(2, 2);
                z-index: 3;
                margin-top: -0.5rem;
              "
              :style="{ color: designStore.alertTheme }"
              v-if="
                status[0] != 'Good' &&
                status[0].substring(0, 11) != 'Suggestion:' &&
                status[0].substring(0, 7) != 'Welcome'
              "
            ></i>
            <div style="position: relative; right: 2.25rem">
              <MultiStackIcon outer="gi-heart-wings" inner="gi-plain-circle"></MultiStackIcon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Rules Status" @close="showModal()">
      <template v-slot:body>
        <div v-for="message in status" :key="message">
          <RulesLookingGood v-if="message === 'Good'"></RulesLookingGood>
          <WelcomeMessage
            v-else-if="message.substring(0, 7) === 'Welcome'"
            :message="message"
          ></WelcomeMessage>
          <div v-else>
            <RuleSuggestion
              v-if="message.substring(0, 11) === 'Suggestion:'"
              :message="message.substring(12)"
            ></RuleSuggestion>
            <div v-else>
              <RuleError :message="message"></RuleError>
            </div>
          </div>
        </div>
      </template>
    </CustomModal>
  </div>
</template>

<style scoped>
.verticalLine {
  display: none;
}
.dazzley {
  width: 0;
  height: 0;
  border-top: 5rem solid;
}
.dazzley2 {
  width: 2rem;
  height: 5rem;
  transform: skew(45deg);
  position: relative;
  left: 2.5rem;
}
.status {
  width: 60%;
  height: 4rem;
  display: block;
  overflow: hidden;
}
@media (max-width: 600px) {
  .status {
    display: none;
  }
  .lil-margin {
    margin-left: 0.5rem;
  }
  .dazzley {
    display: none;
  }
  .dazzley2 {
    display: none;
    background: #000000;
  }
  .verticalLine {
    border-left: 5px solid;
    height: 5rem;
    width: 0.2rem;
    display: inline;
  }
}
</style>
