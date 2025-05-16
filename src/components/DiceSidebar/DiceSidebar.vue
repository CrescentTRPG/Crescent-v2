<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore'
import { useDesignStore } from '@/stores/designStore'
import BNavItem from 'bootstrap-vue-next/src/components/BNav/BNavItem.vue'
import BNavbar from 'bootstrap-vue-next/src/components/BNavbar/BNavbar.vue'
import { computed, ComputedRef, Ref, ref } from 'vue'
import TitleWidget from '../TitleWidget.vue'
import AttributeSkillRoller from './AttributeSkillRoller.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { storeToRefs } from 'pinia'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import GuiDice from './GuiDice.vue'

import MultifactedTextRoller from './MultifactedTextRoller.vue'
import RollerPickerTab from './RollerPickerTab.vue'
import RollModifiers from './RollModifiers.vue'
import MartialDieRoller from './MartialDieRoller.vue'
import TitleMedallion from '../TitleMedallion.vue'

interface RollAttr {
  modifier: number
  name: string
  modifiers: Array<string>
  exceptionalVal: number
}

export default {
  setup(props, context) {
    let designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const statusEffectsStore = useStatusEffectStore()
    //rollsObj = {"roll group": str: "original string", subtotal: number, resultsArr: [{operator: '', dVal, isD, val, accepted, rejected}]}

    const rollDisplay = ref({})
    const sortedRollDisplayArray = computed(() => {
      let ret = Object.values(rollDisplay.value)
      ret = ret.sort((a: any, b: any) => {
        let aVal = JSON.parse(JSON.stringify(a))
        let bVal = JSON.parse(JSON.stringify(b))
        let aindex = aVal.str.indexOf('|')
        let bindex = bVal.str.indexOf('|')
        if (aindex > 0 && bindex > 0) {
          let aKey =
            aVal.str.indexOf('Roll') < 0
              ? aVal.str.indexOf('Strike') + 6
              : aVal.str.indexOf('Roll') + 4
          let bKey =
            bVal.str.indexOf('Roll') < 0
              ? bVal.str.indexOf('Strike') + 6
              : bVal.str.indexOf('Roll') + 4
          let aNum = parseInt(aVal.str.substring(aKey, aindex))
          let bNum = parseInt(bVal.str.substring(bKey, bindex))
          if (aNum === bNum) {
            if (aVal.label === 'Perception') return 1
            else if (bVal.label == 'Perception') return 1
          }
          return aNum - bNum
        } else if (aindex > 0) {
          return 1
        } else {
          return -1
        }
      })
      return ret
    })
    const rolltitle = ref('')
    const override = ref('')
    const {
      diceRollHistory,
      getStrength,
      getAgility,
      getPerception,
      getHealth,
      getCharisma,
      getIntelligence,
      getPower,
      getWillpower,
      getStrengthExceptionals,
      getStrengthInferiors,
      getAgilityExceptionals,
      getAgilityInferiors,
      getHealthInferiors,
      gethealthExceptionals,
      getWillpowerExceptionals,
      getWillpowerInferiors,
      getPerceptionInferiors,
      getperceptionExceptionals,
      getCharismaExceptionals,
      getCharismaInferiors,
      getIntelligenceExceptionals,
      getIntelligenceInferiors,
      getPowerExceptionals,
      getPowerInferiors,
      getStrengthPlaced,
      getAgilityPlaced,
      getHealthPlaced,
      getCharismaPlaced,
      getIntelligencePlaced,
      getPerceptionPlaced,
      getPowerPlaced,
      getWillpowerPlaced,
      getSkills
    } = storeToRefs(statusEffectsStore)

    const { attributes, exceptionals } = storeToRefs(characterStore)

    const navPos = ref('roll')

    const attrs: ComputedRef<any> = computed(() => {
      let attrs = {
        strength: {
          placed: getStrengthInferiors.value * -1 + getStrengthPlaced.value,
          exceptionalVal: getStrengthExceptionals.value - getStrengthInferiors.value,
          modifiers: [],
          name: 'strength',
          modifier: getStrength.value
        },
        agility: {
          placed: getAgilityInferiors.value * -1 + getAgilityPlaced.value,
          exceptionalVal: getAgilityExceptionals.value - getAgilityInferiors.value,
          modifiers: [],
          name: 'agility',
          modifier: getAgility.value
        },
        perception: {
          placed: getPerceptionInferiors.value * -1 + getPerceptionPlaced.value,
          exceptionalVal: getperceptionExceptionals.value - getPerceptionInferiors.value,
          modifiers: [],
          name: 'perception',
          modifier: getPerception.value
        },
        willpower: {
          placed: getWillpowerInferiors.value * -1 + getWillpowerPlaced.value,
          exceptionalVal: getWillpowerExceptionals.value,
          modifiers: [],
          name: 'willpower',
          modifier: getWillpower.value
        },
        health: {
          placed: getHealthInferiors.value * -1 + getHealthPlaced.value,
          exceptionalVal: gethealthExceptionals.value,
          modifiers: [],
          name: 'health',
          modifier: getHealth.value
        },
        intelligence: {
          placed: getIntelligenceInferiors.value * -1 + getIntelligencePlaced.value,
          exceptionalVal: getIntelligenceExceptionals.value - getIntelligenceInferiors.value,
          modifiers: [],
          name: 'intelligence',
          modifier: getIntelligence.value
        },
        power: {
          exceptionalVal: getPowerExceptionals.value - getPowerInferiors.value,
          placed: getPowerInferiors.value * -1 + getPowerPlaced.value,
          modifiers: [],
          name: 'power',
          modifier: getPower.value
        },
        charisma: {
          exceptionalVal: getCharismaExceptionals.value - getCharismaInferiors.value,
          placed: getCharismaInferiors.value * -1 + getCharismaPlaced.value,
          modifiers: [],
          name: 'charisma',
          modifier: getCharisma.value
        }
      }
      let skills = getSkills.value
      attrs = { ...attrs, ...skills }
      return attrs
    })

    const rollerType = ref('attributes')

    function setTitle(title: string) {
      rolltitle.value = title
    }

    function switchTab(tab: string) {
      navPos.value = tab
    }
    function switchRoller(tab: string) {
      rollerType.value = tab
    }
    function navItemStyle(item: string) {
      if (item === navPos.value) {
        return designStore.getAlertTheme
      }
      return designStore.getInputText
    }
    function rollerItemStyle(item: string) {
      if (item === rollerType.value) {
        return designStore.getAlertTheme
      }
      return designStore.getPrimaryText
    }
    function navItemStyleBg(item: string) {
      if (item === navPos.value) {
        return designStore.pageBackdrop
      }
      return designStore.inputBacking
    }

    function stageRollString(rollString: string) {
      //rollsObj = {"roll group": str: "original string", subtotal: number, resultsArr: [{operator: '', dVal, isD, val, accepted, rejected}]}
      // : string | {str: string, subtotal: number, resultsArr: Array<{operator: string, dVal: number, val: number, isD: boolean, accepted: Array<number>, rejected: Array<number>}>}
      let arr: Array<string> = []
      let innerArr: Array<string> = []
      let rollsObj = processRollString(rollString)

      rollDisplay.value = rollsObj
      const time = new Date().toDateString() + ': ' + new Date().toTimeString().substring(0, 8)
      let rollHistoryPackage = diceRollHistory.value
      rollHistoryPackage[time] = { rollsObj: rollsObj, timestamp: time, rolltitle: rolltitle.value }
      context.emit('rolled', rollHistoryPackage[time])
      statusEffectsStore.addDiceRollHistory(rollHistoryPackage)
    }

    function processRollString(rollString: string) {
      let rollsArr: Array<string> | string = createRollsArray(rollString)

      if (typeof rollsArr === 'string') {
        return rollsArr
      }
      let rollsObj = {}
      rollsArr.forEach((rollI) => {
        let roll = rollI
        const labelStart = roll.indexOf('#')
        const labelEnd = roll.lastIndexOf('#')
        if (labelStart > -1 && labelEnd > -1) {
          roll = roll.substring(0, labelStart) || ''
          roll = roll + (rollI.substring(labelEnd + 1) || '')
        }

        rollsObj[roll] = {
          str: roll,
          subtotal: 0,
          resultsArr: [],
          leadingOperator: '+',
          minValue: 0,
          label: rollI.substring(labelStart + 1, labelEnd)
        }
      })
      rollsArr.forEach((rollI) => {
        let roll = rollI
        const labelStart = roll.indexOf('#')
        const labelEnd = roll.lastIndexOf('#')
        if (labelStart > -1 && labelEnd > -1) {
          roll = roll.substring(0, labelStart) || ''
          roll = roll + (rollI.substring(labelEnd + 1) || '')
        }
        const rawRoll = roll.substring(roll.indexOf('|') + 1) || roll

        let rollArr = splitDie(rawRoll)
        let prevDieNum = 1
        let len = rollArr.length
        let i = 0
        if (rollArr[i] === '-!') {
          rollsObj[roll].leadingOperator = '-'
          rollsObj[roll].str = roll.substring(2)
          i++
        }
        if (rollArr[i] === '--') {
          rollsObj[roll].leadingOperator = '--'
          rollsObj[roll].str = roll.substring(2)
          i++
        }
        if (rollArr[i] === '++') {
          rollsObj[roll].leadingOperator = '++'
          rollsObj[roll].str = roll.substring(2)
          i++
        }
        if (rollArr[i] === '+!') {
          rollsObj[roll].leadingOperator = '+'
          rollsObj[roll].str = roll.substring(2)
          i++
        }

        for (; i < len; i++) {
          if (rollArr[i].includes('Roll')) {
            i++
          }
          if (rollArr[i] === '+') {
            i++
            if (i < len) {
              let rollObj = processValue(rollArr[i])
              if (typeof rollObj === 'string') {
                return rollObj
              } else {
                if (rollObj.minValue === 0 || rollObj.minValue < rollObj.val) {
                  rollsObj[roll].subtotal = rollsObj[roll].subtotal + rollObj.val
                  rollsObj[roll].resultsArr.push({ ...rollObj, operator: '+' })
                } else {
                  rollsObj[roll].subtotal = rollsObj[roll].subtotal + rollObj.minValue
                  rollsObj[roll].resultsArr.push({ ...rollObj, operator: '+' })
                }
              }
            } else {
              return 'Expected value following operator: +'
            }
          } else if (rollArr[i] === '-') {
            i++
            if (i < len) {
              let rollObj = processValue(rollArr[i])
              if (typeof rollObj === 'string') {
                return rollObj
              } else {
                if (rollObj.minValue === 0 || rollObj.minValue < rollObj.val) {
                  rollsObj[roll].subtotal = rollsObj[roll].subtotal - rollObj.val
                  rollsObj[roll].resultsArr.push({ ...rollObj, operator: '-' })
                } else {
                  rollsObj[roll].subtotal = rollsObj[roll].subtotal - rollObj.minValue
                  rollsObj[roll].resultsArr.push({ ...rollObj, operator: '-' })
                }
              }
            } else {
              return 'Expected value following operator: -'
            }
          } else if (rollArr[i] === '++') {
            i++
            if (i < len) {
              let rollObj = processValue(rollArr[i])
              if (typeof rollObj === 'string') {
                return rollObj
              } else {
                rollsObj[roll].subtotal = rollsObj[roll].subtotal + rollObj.val * prevDieNum
                rollsObj[roll].resultsArr.push({ ...rollObj, operator: '++' })
              }
            } else {
              return 'Expected value following operator: ++'
            }
          } else if (rollArr[i] === '--') {
            i++
            if (i < len) {
              let rollObj = processValue(rollArr[i])
              if (typeof rollObj === 'string') {
                return rollObj
              } else {
                rollsObj[roll].subtotal = rollsObj[roll].subtotal - rollObj.val * prevDieNum
                rollsObj[roll].resultsArr.push({ ...rollObj, operator: '--' })
              }
            } else {
              return 'Expected value following operator: --'
            }
          } else {
            if (i < len) {
              let rollObj = processValue(rollArr[i])
              if (typeof rollObj === 'string') {
                return rollObj
              } else {
                if (rollObj.minValue === 0 || rollObj.minValue < rollObj.val) {
                  rollsObj[roll].subtotal = rollsObj[roll].subtotal + rollObj.val
                  rollsObj[roll].resultsArr.push({ ...rollObj, operator: '' })
                } else {
                  rollsObj[roll].subtotal = rollsObj[roll].subtotal + rollObj.minValue
                  rollsObj[roll].resultsArr.push({ ...rollObj, operator: '+' })
                }
              }
            } else {
              return 'Did...did you write anything?'
            }
          }
          if (i === len - 1 && rollsObj[roll].leadingOperator === '-') {
            rollsObj[roll].subtotal = rollsObj[roll].subtotal * -1
          }
        }
      })

      //rollsObj = {"roll group": str: "original string", subtotal: number, resultsArr: [{operator: '', dVal, isD, val, accepted, rejected}]}
      return rollsObj
    }

    function processValue(rollString: string) {
      //5d6, val, [accepted], [rejected], isD,dValue
      let ret: {
        dVal: number
        isD: boolean
        val: number
        accepted: Array<number>
        rejected: Array<number>
        minValue: number
      } = { dVal: 0, isD: false, val: 0, accepted: [], rejected: [], minValue: 0 }
      if (rollString.includes('d')) {
        ret.isD = true
        let minValue = 0
        if (rollString.includes('}')) {
          minValue = parseInt(rollString.substring(1, rollString.indexOf('}')))
          rollString = rollString.substring(rollString.indexOf('}') + 1)
        }
        ret.minValue = minValue
        if (rollString.includes('*-')) {
          // DISPLACED ROLLS
          let vals = rollString.split('*-')
          if (vals[1] === '') {
            return 'Invalid Roll, displaced rolls need to be in this format [number]d[die size]*-[number].'
          }
          const displacedAmount = parseInt(vals[vals.length - 1])
          vals = rollString.split('d')
          const dieSize = parseInt(vals[1].substring(0, vals[1].indexOf('*')))
          ret.dVal = dieSize
          const numRolls = parseInt(vals[0])
          let values = rollDice(dieSize, 0, displacedAmount, numRolls)
          ret.val = values.val
          ret.accepted = values.accepted
          ret.rejected = values.rejected
          return ret
        } else if (rollString.includes('*')) {
          let vals = rollString.split('*')
          if (vals[1] === '') {
            return 'Invalid Roll, placed rolls need to be in this format [number]d[die size]*-[number].'
          }
          const placedAmount = parseInt(vals[vals.length - 1])
          vals = rollString.split('d')
          const dieSize = parseInt(vals[1].substring(0, vals[1].indexOf('*')))
          ret.dVal = dieSize
          const numRolls = parseInt(vals[0])
          let values = rollDice(dieSize, placedAmount, 0, numRolls)
          ret.val = values.val
          ret.accepted = values.accepted
          ret.rejected = values.rejected
          return ret
        } else {
          const vals = rollString.split('d')
          const dieSize = parseInt(vals[1])
          const numRolls = parseInt(vals[0])
          ret.dVal = dieSize
          let values = rollDice(dieSize, 0, 0, numRolls)
          ret.val = values.val
          ret.accepted = values.accepted
          ret.rejected = values.rejected
          return ret
        }
      } else {
        return {
          val: parseInt(rollString),
          isD: false,
          dVal: 0,
          accepted: [],
          rejected: [],
          minValue: 0
        }
      }
    }

    function rollDice(dieSize, placedAmount, displacedAmount, numRolls) {
      let ret = { val: 0, accepted: [], rejected: [] }
      let rolls: Array<number> = []
      for (let i = 0; i < numRolls + placedAmount + displacedAmount; i++) {
        rolls.push(rollDie(dieSize))
      }
      rolls.sort(function (a, b) {
        return a - b
      })
      if (displacedAmount > 0) {
        const accepted = rolls.slice(0, numRolls)
        const rejected = rolls.slice(numRolls, displacedAmount + numRolls)
        return {
          val: accepted.reduce((partialSum, a) => partialSum + a, 0),
          accepted: accepted,
          rejected: rejected
        }
      } else if (placedAmount > 0) {
        const accepted = rolls.slice(placedAmount)
        const rejected = rolls.slice(0, placedAmount)
        return {
          val: accepted.reduce((partialSum, a) => partialSum + a, 0),
          accepted: accepted,
          rejected: rejected
        }
      } else {
        return {
          val: rolls.reduce((partialSum, a) => partialSum + a, 0),
          accepted: rolls,
          rejected: []
        }
      }
    }

    function rollDie(dieSize: number) {
      return Math.floor(Math.random() * dieSize) + 1
    }

    function splitDie(rollStr: string) {
      let ret: Array<string> = []
      let prev = 0
      for (let i = 0; i < rollStr.length; i++) {
        if (rollStr[i] === '+') {
          if (rollStr[i + 1] === '+') {
            ret.push(rollStr.slice(prev, i))
            ret.push('++')
            i++
            prev = i + 1
          } else if (rollStr[i + 1] === '!') {
            ret.push(rollStr.slice(prev, i))
            ret.push('+!')
            i++
            prev = i + 1
          } else {
            ret.push(rollStr.slice(prev, i))
            ret.push('+')
            prev = i + 1
          }
        } else if (rollStr[i] === '-') {
          if (!(i > 0 && rollStr[i - 1] === '*')) {
            if (rollStr[i + 1] === '-') {
              ret.push(rollStr.slice(prev, i))
              ret.push('--')
              i++
              prev = i + 1
            } else if (rollStr[i + 1] === '!') {
              ret.push(rollStr.slice(prev, i))
              ret.push('-!')
              i++
              prev = i + 1
            } else {
              ret.push(rollStr.slice(prev, i))
              ret.push('-')
              prev = i + 1
            }
          }
        }
      }
      ret.push(rollStr.slice(prev, rollStr.length))
      if (ret[0] === '') {
        return ret.slice(1)
      }
      return ret
    }

    function createRollsArray(rollString: string) {
      let str = rollString.replace(/ /g, '')

      let rollsArr: Array<string> = []
      let rollCountObj = {}
      if (rollString.includes('(')) {
        let leadingMod = ''
        while (str.length > 0) {
          if (str[0] === '(') {
            let end = str.indexOf(')')
            if (end < 0) {
              return 'Error: missing closing parenthesis'
            } else {
              let nextRoll = leadingMod + str.substring(1, end)
              if (nextRoll) {
                if (leadingMod != '') {
                  leadingMod += '!'
                }
                rollCountObj[nextRoll] = rollCountObj[nextRoll] ? rollCountObj[nextRoll] + 1 : 1
                if (nextRoll.includes('Strike')) {
                  if (nextRoll.indexOf('Strike') >= 0) {
                    nextRoll = nextRoll.replace('Strike', 'Strike ')
                  }
                  rollsArr.push(nextRoll)
                } else {
                  rollsArr.push('Roll' + rollCountObj[nextRoll] + ' | ' + nextRoll)
                }
              }
              if (end == str.length) {
                return rollsArr
              }
              str = str.substring(end + 1)
              leadingMod = ''
            }
          } else {
            let end = str.indexOf('(')
            if (end < 0) {
              end = str.length
              if (leadingMod + str.substring(0, end)) {
                if (leadingMod != '') {
                  leadingMod += '!'
                }
                rollsArr.push(leadingMod + str.substring(0, end))
              }
            }
            if (end == str.length) {
              return rollsArr
            }
            if (str[end - 1] == '-') {
              if (str[end - 2] == '-') {
                leadingMod = '--'
              }
              leadingMod = '-'
            } else if (str[end - 1] == '+') {
              if (str[end - 2] == '+') {
                leadingMod = '++'
              }
              leadingMod = '+'
            } else {
              leadingMod = ''
            }
            if (str.substring(0, end - leadingMod.length)) {
              rollsArr.push(str.substring(0, end - leadingMod.length))
            }

            str = str.substring(end)
          }
        }
      } else {
        rollsArr.push(str)
      }
      return rollsArr
    }

    function clearHistory() {
      statusEffectsStore.clearDiceHistory()
    }

    return {
      clearHistory,
      switchTab,
      navItemStyle,
      navItemStyleBg,
      designStore,
      navPos,
      attributes,
      attrs,
      stageRollString,
      rollDisplay,
      override,
      switchRoller,
      rollerType,
      rollerItemStyle,
      setTitle,
      rolltitle,
      sortedRollDisplayArray,
      diceRollHistory
    }
  },
  components: {
    BNavbar,
    BNavItem,
    TitleWidget,
    BButton,
    AttributeSkillRoller,
    GuiDice,
    MultifactedTextRoller,
    RollerPickerTab,
    RollModifiers,
    MartialDieRoller
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
    }
  }
}
</script>
<template>
  <div class="mainMenu" :style="{ fontFamily: designStore.font, scrollbarColor: scrollbarColor }">
    <BNavbar
      style="margin-bottom: 0.5rem; margin-top: 0rem"
      class="navClass"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.inputBacking,
        fontFamily: designStore.font
      }"
    >
      <BNavItem
        :style="{ color: navItemStyle('roll'), background: designStore.inputBacking }"
        @click="switchTab('roll')"
        class="textI"
        >Roll Dice</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle(' roll'), background: designStore.inputBacking }"
        @click="switchTab('roll')"
        class="navI"
      >
        <div v-if="navPos === ' roll'">Roll Dice</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle(' modifiers'), background: designStore.inputBacking }"
        @click="switchTab('modifiers')"
        class="textI"
      >
        Roll Modifiers</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('modifiers'), background: designStore.inputBacking }"
        @click="switchTab('modifiers')"
        class="navI"
      >
        <div v-if="navPos === 'overview'">Status Modifiers</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle(' history'), background: designStore.inputBacking }"
        @click="switchTab('history')"
        class="textI"
      >
        Roll History</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('history'), background: designStore.inputBacking }"
        @click="switchTab('history')"
        class="navI"
      >
        <div v-if="navPos === 'overview'">Roll History</div>
      </BNavItem>
    </BNavbar>
    <div
      v-if="navPos === 'roll'"
      style="
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
      "
    >
      <BNavbar
        style="margin-bottom: 0.5rem; margin-top: -0.5rem; width: 100%"
        :style="{
          fontFamily: designStore.font
        }"
      >
        <BNavItem
          :style="{ color: rollerItemStyle('attributes') }"
          @click="switchRoller('attributes')"
          v-if="rollerType === 'attributes'"
        >
          <RollerPickerTab icon="gi-skills"></RollerPickerTab>
        </BNavItem>
        <BNavItem
          v-if="rollerType !== 'attributes'"
          :style="{ color: rollerItemStyle('attributes') }"
          @click="switchRoller('attributes')"
        >
          <v-icon scale="1.5" name="gi-skills"></v-icon>
        </BNavItem>
        <BNavItem
          :style="{ color: rollerItemStyle('martial') }"
          @click="switchRoller('martial')"
          v-if="rollerType === 'martial'"
        >
          <RollerPickerTab icon="gi-bowman"></RollerPickerTab>
        </BNavItem>
        <BNavItem
          v-if="rollerType !== 'martial'"
          :style="{ color: rollerItemStyle('martial') }"
          @click="switchRoller('martial')"
        >
          <v-icon scale="1.5" name="gi-bowman"></v-icon>
        </BNavItem>
        <BNavItem
          v-if="rollerType !== 'text'"
          :style="{ color: rollerItemStyle('text') }"
          @click="switchRoller('text')"
        >
          <v-icon scale="1.5" name="gi-quill"></v-icon
        ></BNavItem>
        <BNavItem
          v-if="rollerType === 'text'"
          :style="{ color: rollerItemStyle('text') }"
          @click="switchRoller('text')"
        >
          <RollerPickerTab icon="gi-quill"></RollerPickerTab>
        </BNavItem>
        <BNavItem
          v-if="rollerType !== 'gui'"
          :style="{ color: rollerItemStyle('gui') }"
          @click="switchRoller('gui')"
        >
          <v-icon scale="1.5" name="gi-jigsaw-box"></v-icon>
        </BNavItem>
        <BNavItem
          v-if="rollerType === 'gui'"
          :style="{ color: rollerItemStyle('gui') }"
          @click="switchRoller('gui')"
        >
          <RollerPickerTab icon="gi-jigsaw-box"></RollerPickerTab>
        </BNavItem>
      </BNavbar>
      <div>
        <AttributeSkillRoller
          v-if="rollerType === 'attributes'"
          :attributes="attrs"
          :skills="attributes"
          @as="(title) => setTitle(title)"
          @rollString="(rollString) => stageRollString(rollString)"
        ></AttributeSkillRoller>
        <MartialDieRoller
          v-if="rollerType === 'martial'"
          :attributes="attrs"
          :skills="attributes"
          @as="(title) => setTitle(title)"
          @rollString="(rollString) => stageRollString(rollString)"
        ></MartialDieRoller>
        <MultifactedTextRoller
          v-if="rollerType === 'text'"
          @rollString="
            (rollString) => {
              setTitle('')
              stageRollString(rollString)
            }
          "
          style="margin-bottom: 0.5rem"
        ></MultifactedTextRoller>
        <GuiDice
          @rollString="
            (rollString) => {
              setTitle('')
              stageRollString(rollString)
            }
          "
          v-if="rollerType === 'gui'"
        ></GuiDice>
      </div>
      <div :style="{ background: designStore.primaryTheme }">
        <TitleWidget
          title="Rolled Results"
          style="margin-top: -0.05rem; margin-bottom: -0.5rem"
        ></TitleWidget>
        <!-- rollsObj = {"roll group": str: "original string", subtotal: number, resultsArr: [{operator: '', dVal, isD, val, accepted, rejected}]} -->
        <div style="overflow-y: auto; margin-left: 0.5rem">
          <div
            id="here"
            v-for="(display, index) in sortedRollDisplayArray as Array<any>"
            style="position: relative"
            :style="{ color: designStore.primaryText }"
            :key="index"
          >
            <div v-if="display.label === 'Perception'">
              <div>{{ display.str.substring(0, display.str.indexOf('|')) || '' }}</div>
              <hr
                style="margin-top: 0.25rem; margin-bottom: 0rem"
                :style="{ color: designStore.secondaryTheme }"
              />
            </div>
            <div
              style="
                font-size: x-large;
                padding-left: 0.5rem;
                width: 95%;
                position: absolute;
                display: flex;
                justify-content: flex-end;
                margin-left: 0.5rem;
              "
            >
              <div>= {{ display.subtotal }}</div>
            </div>
            <div
              v-if="!override"
              style="display: flex; align-items: center; flex-wrap: wrap; width: 90%"
            >
              <div style="display: flex; align-items: center; width: 90%">
                <div style="font-size: large" v-if="display.label">{{ display.label }}:</div>
                <div v-else>
                  <div style="font-size: large" v-if="rolltitle">{{ rolltitle }}:</div>
                </div>
                <div
                  style="
                    font-size: large;
                    padding-right: 0.5rem;
                    border-radius: 0.275rem;
                    width: 85%;
                    white-space: pre-wrap;
                  "
                >
                  {{ display.leadingOperator == '-' ? display.leadingOperator : ' ' }}
                  { {{ display.str.substring(display.str.indexOf('|') + 1) || display.str }} }
                </div>
              </div>
              <div
                v-for="group in display.resultsArr"
                :key="group"
                style="
                  display: flex;
                  font-size: medium;
                  padding-right: 0.5rem;
                  padding-left: 0.5rem;
                  border: 2px solid;
                  border-radius: 0.275rem;
                  margin-right: 0.5rem;
                  margin-bottom: 0.25rem;
                  max-width: 17.5rem;
                  flex-wrap: wrap;
                "
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  borderColor: designStore.secondaryTheme
                }"
              >
                <div style="display: flex; flex-wrap: wrap" v-if="group.isD">
                  <div v-if="group.minValue > 0">
                    {{ group.operator }}d{{ group.dVal }}'s{{ group.accepted }}( min
                    {{ group.minValue }} )
                  </div>
                  <div v-else>{{ group.operator }}d{{ group.dVal }}'s{{ group.accepted }}</div>
                  <div v-if="group.rejected.length > 0" :style="{ color: designStore.alertTheme }">
                    {{ group.rejected }}
                  </div>
                </div>
                <div style="display: flex; flex-wrap: wrap" v-if="!group.isD">
                  <div>{{ group.operator }} {{ group.val }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="navPos === 'history'">
      <div
        style="
          display: flex;
          justify-content: flex-end;
          z-index: 8;
          margin-right: 2rem;
          margin-bottom: -2rem;
        "
      >
        <BButton
          style="border: 1px solid; z-index: 8"
          :style="{
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme,
            color: designStore.primaryText
          }"
          @click="clearHistory()"
          >Clear</BButton
        >
      </div>
      <TitleWidget title="Roll History" style="margin-top: -1rem"></TitleWidget>
      <div style="overflow-y: auto; margin-left: 0.5rem">
        <div
          v-for="(roll, index) in Object.values(diceRollHistory).reverse() as Array<any>"
          :key="index"
        >
          <div style="font-size: small">{{ roll.timestamp }}</div>
          <hr
            style="margin-bottom: -0.25rem; margin-top: 0.25rem"
            :style="{ color: designStore.secondaryTheme }"
          />
          <div
            id="here"
            v-for="(display, index) in Object.values(roll.rollsObj) as Array<any>"
            style="position: relative"
            :style="{ color: designStore.primaryText }"
            :key="index"
          >
            <div
              style="
                font-size: x-large;
                padding-left: 0.5rem;
                width: 95%;
                position: absolute;
                display: flex;
                justify-content: flex-end;
                margin-left: 0.5rem;
              "
            >
              <div>= {{ display.subtotal }}</div>
            </div>
            <div
              v-if="!override"
              style="display: flex; align-items: center; flex-wrap: wrap; width: 90%"
            >
              <div style="display: flex; align-items: center; width: 90%">
                <div style="font-size: large" v-if="roll.rolltitle">{{ roll.rolltitle }}:</div>
                <div
                  style="
                    font-size: large;
                    padding-right: 0.5rem;
                    border-radius: 0.275rem;
                    width: 85%;
                    white-space: pre-wrap;
                  "
                >
                  {{ display.leadingOperator == '-' ? display.leadingOperator : ' ' }}
                  { {{ display.str }} }
                </div>
              </div>
              <div
                v-for="group in display.resultsArr"
                :key="group"
                style="
                  display: flex;
                  font-size: medium;
                  padding-right: 0.5rem;
                  padding-left: 0.5rem;
                  border: 2px solid;
                  border-radius: 0.275rem;
                  margin-right: 0.5rem;
                  margin-bottom: 0.25rem;
                  max-width: 17.5rem;
                  flex-wrap: wrap;
                "
                :style="{
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  borderColor: designStore.secondaryTheme
                }"
              >
                <div style="display: flex; flex-wrap: wrap" v-if="group.isD">
                  <div>{{ group.operator }}d{{ group.dVal }}'s{{ group.accepted }}</div>
                  <div v-if="group.rejected.length > 0" :style="{ color: designStore.alertTheme }">
                    {{ group.rejected }}
                  </div>
                </div>
                <div style="display: flex; flex-wrap: wrap" v-if="!group.isD">
                  <div>{{ group.operator }} {{ group.val }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="navPos === 'modifiers'"><RollModifiers></RollModifiers></div>
  </div>
</template>
<style scoped>
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  width: 100%;
  margin-top: 1rem;
  border: 2px solid;
}
.mainMenu {
  height: 85vh;
}
@media (max-width: 500px) {
  .mainMenu {
    margin-right: 0.75rem;
  }
  .navClass {
    width: 100%;
    margin-top: 1rem;
    border: 2px solid;
  }
  .navI {
    padding-bottom: 0.5rem;
  }
  .textI {
    display: none;
  }
}
@media (min-width: 501px) {
  .navI {
    display: none;
  }
  .manText {
    display: none;
  }
}
.manText {
  padding-bottom: 0.5rem;
}
</style>
