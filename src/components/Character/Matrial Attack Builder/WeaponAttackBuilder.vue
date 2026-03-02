<script lang="ts">
import IconPicker from '@/components/IconPicker.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { useEquipmentStore, Weapon } from '@/stores/equipmentStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import { storeToRefs } from 'pinia'
import { computed, Ref, ref } from 'vue'
import MartialAttackDisplay from './MartialAttackDisplay.vue'
import MartialSkillTabs from './MartialSkillTabs.vue'
import RollstringLineup from './RollstringLineup.vue'
import WeaponStrike from './WeaponStrike.vue'

export default {
  emits: ['saved'],
  setup(props, context) {
    const designStore = useDesignStore()
    const equipmentStore = useEquipmentStore()
    const name = ref('')
    const icon = ref('gi-tec-9')

    const spentMp = computed(() => {
      let ret = 0
      Object.values(weaponAttack.value).forEach((attack) => {
        attack.skills.forEach((skill) => {
          ret += skill.purchasedMp
        })
      })
      return ret
    })

    function onDrop(loc) {
      let mode = ''
      let modes: Array<String> = ['']
      if (draggedItem.value.skillStats.modes) {
        mode = draggedItem.value.skillStats.modes[0]
        modes = draggedItem.value.skillStats.modes
        weaponAttack.value[loc].modes = modes
      }

      if (
        draggedItem.value.skillStats.type === 'All Strikes' ||
        draggedItem.value.skillStats.type === 'All Successful Strikes' ||
        draggedItem.value.skillStats.type === 'Executes an Action' ||
        draggedItem.value.skillStats.type === 'Passive' ||
        draggedItem.value.skillStats[mode]?.type === 'All Strikes' ||
        draggedItem.value.skillStats[mode]?.type === 'All Successful Strikes' ||
        draggedItem.value.skillStats[mode]?.type === 'Executes an Action' ||
        draggedItem.value.skillStats[mode]?.type === 'Passive'
      ) {
        if (loc != 'Universal Skills') {
          alert(
            "This skill applies to all skills.  I've gone ahead and put this in Universal Skills for you"
          )
        }
        //weaponAttack.value[loc].modes = modes
        Object.keys(weaponAttack.value).forEach((attack) => {
          weaponAttack.value[attack].modes = modes
        })
        if (draggedItem.value.skillStats.forceTypeMalleableToBe) {
          weaponAttack.value[loc].forceTypeMalleableToBe =
            draggedItem.value.skillStats.forceTypeMalleableToBe
          shiftTypes()
        }
        let vals = ''
        //MULTI ATTACK

        if (
          draggedItem.value.skillStats.grantsNewStrike ||
          draggedItem.value.skillStats[mode]?.grantsNewStrike
        ) {
          const strike =
            draggedItem.value.skillStats.grantsNewStrike ||
            draggedItem.value.skillStats[mode]?.grantsNewStrike
          if (strike === 'Any') {
            let num = Object.keys(weaponAttack.value).length - 1
            vals = 'Strike ' + num
            weaponAttack.value[vals] = {
              skills: [],
              grantsStrike: vals,
              strikeType: strike,
              modes: [''],
              modeObj: {},
              hand: 'Primary',
              handRestriction: 'any'
            }
          }
          if (strike === 'Offhand') {
            if ((equipmentStore.getSecondarySpecs.equippedStats as Weapon).damageString != '') {
              let num = Object.keys(weaponAttack.value).length - 1
              vals = 'Strike ' + num
              weaponAttack.value[vals] = {
                skills: [],
                grantsStrike: vals,
                strikeType: strike,
                modes: [''],
                modeObj: {},
                hand: 'Offhand',
                handRestriction: 'Offhand'
              }
            } else {
              alert('Are you sure you have an Offhand weapon?')
              return
            }
          }
          //MIRRORS STRIKE
          if (
            draggedItem.value.skillStats.newStrikeMirror ||
            draggedItem.value.skillStats[mode]?.newStrikeMirror
          ) {
            weaponAttack.value[vals] = {
              skills: [],
              grantsStrike: vals,
              mirrorsStrike: 1,
              mirrors:
                draggedItem.value.skillStats.newStrikeMirror ||
                draggedItem.value.skillStats[mode]?.newStrikeMirror,
              strikeType: strike,
              modes: modes || [''],
              hand: 'Offhand',
              handRestriction: 'Offhand'
            }
          }
        }
        if (
          draggedItem.value.skillStats.modifiesSomeCosts ||
          draggedItem.value.skillStats[mode]?.modifiesSomeCosts
        ) {
          weaponAttack.value['Universal' + ' Skills'].modifiesSomeCosts =
            draggedItem.value.skillStats.modifiesSomeCosts ||
            draggedItem.value.skillStats[mode]?.modifiesSomeCosts
        }
        if (
          draggedItem.value.skillStats.increasesCostOfAllEffects ||
          draggedItem.value.skillStats[mode]?.increasesCostOfAllEffects
        ) {
          weaponAttack.value['Universal' + ' Skills'].increasedCosts =
            draggedItem.value.skillStats.increasesCostOfAllEffects ||
            draggedItem.value.skillStats[mode]?.increasesCostOfAllEffects
        }
        let increase = weaponAttack.value['Universal Skills'].increasedCosts

        if (draggedItem.value.skillStats.type === 'Passive') {
          increase = 0
        }
        if (draggedItem.value.skillStats[mode]?.type === 'Passive') {
          increase = 0
        }
        let mpCost = draggedItem.value.skillStats[mode]
          ? draggedItem.value.skillStats[mode].mpCost
          : draggedItem.value.skillStats.mpCost
        weaponAttack.value['Universal' + ' Skills'].skills.push({
          ...draggedItem.value,
          rank: 1,
          purchasedMp:
            draggedItem.value.purchasedMp > 0
              ? draggedItem.value.purchasedMp
              : draggedItem.value.skillStats.costMalleable
                ? mpCost + weaponAttack.value['Universal Skills'].modifiesSomeCosts + increase
                : mpCost + increase || 0,
          grantsStrike: vals,
          modes: modes || ['']
        })
      } else if (
        draggedItem.value.skillStats.type === 'Next Successful Strike' ||
        draggedItem.value.skillStats[mode]?.type === 'Next Successful Strike'
      ) {
        if (
          loc != 'Next Successful Strike' &&
          !(
            weaponAttack.value['Universal Skills'].forceTypeMalleableToBe &&
            draggedItem.value.skillStats.typeMalleable
          )
        ) {
          alert(
            "This skill applies on Next Successful Strike.  I've gone ahead and put it there for you."
          )
        }
        loc = 'Next Successful Strike'
        weaponAttack.value[loc].modes = modes
        if (draggedItem.value.skillStats.typeMalleable) {
          let type = weaponAttack.value['Universal Skills'].forceTypeMalleableToBe
          if (
            type === 'All Strikes' ||
            type === 'All Successful Strikes' ||
            type === 'Executes an Action' ||
            type === 'Passive' ||
            type === 'All Strikes' ||
            type === 'All Successful Strikes' ||
            type === 'Executes an Action' ||
            type === 'Passive'
          ) {
            loc = 'Universal Skills'
          }
        }
        let mpCost = draggedItem.value.skillStats[mode]
          ? draggedItem.value.skillStats[mode].mpCost
          : draggedItem.value.skillStats.mpCost
        weaponAttack.value[loc].skills.push({
          ...draggedItem.value,
          rank: 1,
          purchasedMp:
            draggedItem.value.purchasedMp > 0
              ? draggedItem.value.purchasedMp
              : draggedItem.value.skillStats.costMalleable
                ? mpCost +
                  weaponAttack.value['Universal Skills'].modifiesSomeCosts +
                  weaponAttack.value['Universal Skills'].increasedCosts
                : mpCost + weaponAttack.value['Universal Skills'].increasedCosts || 0,
          rollstring: ''
        })
        removeFromLoc(prevLoc.value)
      } else {
        if (
          loc === 'Next Successful Strike' &&
          !(
            weaponAttack.value['Universal Skills'].forceTypeMalleableToBe &&
            draggedItem.value.skillStats.typeMalleable
          )
        ) {
          alert(
            "This skill doesn't apply on next successful strike!  Drag it onto a specific Strike!"
          )
        } else if (
          loc === 'Universal Skills' &&
          !(
            weaponAttack.value['Universal Skills'].forceTypeMalleableToBe &&
            draggedItem.value.skillStats.typeMalleable
          )
        ) {
          alert('This skill is not Universal!  Drag it onto a specific Strike')
        } else {
          if (draggedItem.value.skillStats.type) {
            weaponAttack.value[loc].skills.push({
              ...draggedItem.value,
              rank: 1,
              purchasedMp:
                draggedItem.value.purchasedMp > 0
                  ? draggedItem.value.purchasedMp
                  : draggedItem.value.skillStats.costMalleable
                    ? draggedItem.value.skillStats.mpCost +
                      weaponAttack.value['Universal Skills'].modifiesSomeCosts +
                      weaponAttack.value['Universal Skills'].increasedCosts
                    : draggedItem.value.skillStats.mpCost +
                        weaponAttack.value['Universal Skills'].increasedCosts || 0,
              rollstring: ''
            })
          }
          if (draggedItem.value.skillStats[mode]?.type) {
            weaponAttack.value[loc].skills.push({
              ...draggedItem.value,
              rank: 1,
              purchasedMp:
                draggedItem.value.purchasedMp > 0
                  ? draggedItem.value.purchasedMp
                  : draggedItem.value.skillStats.costMalleable
                    ? draggedItem.value.skillStats[mode].mpCost +
                      weaponAttack.value['Universal Skills'].modifiesSomeCosts +
                      weaponAttack.value['Universal Skills'].increasedCosts
                    : draggedItem.value.skillStats[mode].mpCost +
                        weaponAttack.value['Universal Skills'].increasedCosts || 0,
              rollstring: ''
            })
          }
          removeFromLoc(prevLoc.value)
        }
      }
    }
    const conditionStateObj = ref({})
    function removeFromLoc(loc) {
      if (loc != '') {
        weaponAttack.value[loc].skills.splice(getIndex(loc, draggedItem.value), 1)
      }
      prevLoc.value = ''
    }
    function kill(loc, name) {
      if (loc != '') {
        let skillIndex = [getIndex(loc, { name: name })]
        let grantedStrike = weaponAttack.value[loc].skills[skillIndex].grantsStrike

        if (grantedStrike) {
          delete weaponAttack.value[grantedStrike]
        }
        if (weaponAttack.value[loc].skills[skillIndex].skillStats.modifiesSomeCosts) {
          weaponAttack.value[loc].modifiesSomeCosts = 0
        }
        if (weaponAttack.value[loc].skills[skillIndex].skillStats.increasesCostOfAllEffects) {
          weaponAttack.value[loc].increasedCosts = 0
        }
        if (weaponAttack.value[loc].skills[skillIndex].skillStats.forceTypeMalleableToBe) {
          weaponAttack.value[loc].forceTypeMalleableToBe = ''
          resolveTypes()
        }

        weaponAttack.value[loc].skills.splice(getIndex(loc, { name: name }), 1)
      }

      prevLoc.value = ''
    }
    function shiftTypes() {
      let attacks = Object.keys(weaponAttack.value)
      let killObj = {}

      Object.keys(weaponAttack.value).forEach((attack) => {
        killObj[attack] = []
      })
      let loc = ''
      let type = weaponAttack.value['Universal Skills'].forceTypeMalleableToBe
      if (
        type === 'All Strikes' ||
        type === 'All Successful Strikes' ||
        type === 'Executes an Action' ||
        type === 'Passive' ||
        type === 'All Strikes' ||
        type === 'All Successful Strikes' ||
        type === 'Executes an Action' ||
        type === 'Passive'
      ) {
        loc = 'Universal Skills'
      } else if (type === 'Next Successful Strike') {
        loc = 'Next Successful Strike'
      } else {
        loc = 'Strike 1'
      }
      attacks.forEach((attack) => {
        weaponAttack.value[attack].skills.forEach((skill) => {
          if (attack != weaponAttack.value[loc].forceTypeMalleableToBe) {
            if (skill.skillStats.typeMalleable) {
              weaponAttack.value[loc].skills.push(skill)

              killObj[attack].push(skill.name)
            }
          }
        })
      })

      Object.keys(killObj).forEach((loc) => {
        killObj[loc].forEach((name) => {
          kill(loc, name)
        })
      })
    }
    function resolveTypes() {
      let attacks = Object.keys(weaponAttack.value)
      let killUniversal: Array<any> = []
      attacks.forEach((attack) => {
        weaponAttack.value[attack].skills.forEach((skill) => {
          if (attack === 'Universal Skills') {
            let type = skill.skillStats.type

            if (
              type !== 'All Strikes' &&
              type !== 'All Successful Strikes' &&
              type !== 'Executes an Action' &&
              type !== 'Passive' &&
              type !== 'All Strikes' &&
              type !== 'All Successful Strikes' &&
              type !== 'Executes an Action' &&
              type !== 'Passive'
            ) {
              if (type === 'Next Successful Strike') {
                //Next Successful Strike
                weaponAttack.value['Next Successful Strike'].skills.push(skill)
              } else {
                weaponAttack.value['Strike 1'].skills.push(skill)
              }
              killUniversal.push(skill.name)
            }
          }
        })
      })

      killUniversal.forEach((name) => {
        kill('Universal Skills', name)
      })
    }
    function getIndex(loc, skill) {
      let index = 0
      let ret = -1
      weaponAttack.value[loc].skills.forEach((s) => {
        if (s.name === skill.name) {
          ret = index
        }
        index++
      })
      return ret
    }

    function getSkillObj(attack: string, mode: string, skills) {
      const primary = equipmentStore.getPrimarySpecs
      const secondary = equipmentStore.getSecondarySpecs

      let weaponDamage = (primary.equippedStats as Weapon).damageString
      if (weaponAttack.value[attack].hand === 'Offhand') {
        weaponDamage = (secondary.equippedStats as Weapon).damageString || ''
      }
      //toHit
      let attacks = []
      let placedRollsNum = 0
      let modifier: number = 0
      let alternateMinWeaponDamage = 0
      let minWeaponDamage = 0
      let causesSave = ''
      let alternateCausesSave = ''
      let damageString = ''
      let alternateDamageString = ''
      let appliesStatus = {}
      let alternateAppliesStatus = {}
      let conditions: Array<string> = []
      let conditionObj = {}
      let rollstring = ''
      let alternateRollstring = ''
      let skillsArr = weaponAttack.value[attack].skills
      let overrideWeaponDamage = ''
      if (skills.length > 0) {
        skillsArr = skills
      }

      skillsArr.forEach((skill) => {
        if (skill.skillStats.overrideDamageDice) {
          overrideWeaponDamage = skill.skillStats.overrideDamageDice
        }
        if (skill.skillStats[mode]?.overrideDamageDice) {
          overrideWeaponDamage = skill.skillStats[mode]?.overrideDamageDice
        }
        let rank = skill.rank
        if (skill.skillStats?.costType === 'activation + rank') {
          rank = (skill.purchasedMp - skill.skillStats.mpCost) / skill.skillStats.additionalMpCost
        }

        if (skill.skillStats[mode]?.modifyToHit) {
          if ((skill.skillStats[mode].modifyToHit + '').includes('*')) {
            placedRollsNum += getPlaced(skill.skillStats[mode].modifyToHit, rank)
          } else {
            if (skill.skillStats[mode]?.modifyToHit === 'rank') {
              modifier += parseInt(rank + '')
            } else {
              modifier += parseInt(skill.skillStats[mode].modifyToHit + '')
            }
          }
        }
        if (skill.skillStats?.modifyToHit) {
          if ((skill.skillStats.modifyToHit + '').includes('*')) {
            placedRollsNum += getPlaced(skill.skillStats.modifyToHit, rank)
          } else {
            if (skill.skillStats?.modifyToHit === 'rank') {
              modifier += parseInt(rank + '')
            } else {
              modifier += parseInt(skill.skillStats.modifyToHit + '')
            }
          }
        }
        if (skill.skillStats?.minWeaponDamage) {
          minWeaponDamage += skill.skillStats.minWeaponDamage
        }
        if (skill.skillStats[mode]?.minWeaponDamage) {
          minWeaponDamage += skill.skillStats[mode].minWeaponDamage
        }

        if (skill.skillStats?.causesSave) {
          causesSave += skill.skillStats.causesSave + '&'
        }
        if (skill.skillStats[mode]?.causesSave) {
          causesSave += skill.skillStats[mode].causesSave + '&'
        }
        if (skill.skillStats?.damageString || skill.skillStats[mode]?.damageString) {
          if (
            skill.skillStats?.damageString === 'weaponDamage' ||
            skill.skillStats[mode]?.damageString === 'weaponDamage'
          ) {
            // let ranks =
            //   skill.purchasedMp / (skill.skillStats.mpCost || skill.skillStats[mode].mpCost)
            for (let i = 0; i < rank; i++) {
              if (overrideWeaponDamage) {
                rollstring += ' + ' + overrideWeaponDamage
              } else {
                rollstring += ' + ' + weaponDamage
              }
            }
          } else {
            if (skill.skillStats[mode]) {
              let numDice = parseInt(skill.skillStats[mode].damageString.split('d')[0])
              let additionalDamage =
                skill.skillStats[mode].costType === 'rank'
                  ? numDice * rank +
                    skill.skillStats[mode].damageString.substring((numDice + '').length)
                  : numDice + skill.skillStats[mode].damageString.substring((numDice + '').length)
              rollstring += ' + ' + additionalDamage
            } else {
              let numDice = parseInt(skill.skillStats.damageString.split('d')[0])
              let additionalDamage =
                skill.skillStats.costType === 'rank'
                  ? numDice * rank + skill.skillStats.damageString.substring((numDice + '').length)
                  : numDice + skill.skillStats.damageString.substring((numDice + '').length)
              rollstring += ' + ' + additionalDamage
            }
          }
        }

        if (
          skill.skillStats?.appliesStatus &&
          Object.keys(skill.skillStats.appliesStatus).length >= 0
        ) {
          appliesStatus = { ...appliesStatus, ...skill.skillStats.appliesStatus }
        }

        if (
          skill.skillStats[mode]?.appliesStatus &&
          Object.keys(skill.skillStats[mode].appliesStatus).length >= 0
        ) {
          appliesStatus = { ...appliesStatus, ...skill.skillStats[mode].appliesStatus }
        }

        if (skill.skillStats?.condition) {
          if (!conditions.includes(skill.skillStats.condition)) {
            conditionObj[skill.skillStats.condition] = {
              condition: skill.skillStats.condition,
              alternateDamageString: '',
              alternateMinWeaponDamage: 0,
              alternateAppliesStatus: {},
              alternateCausesSave: '',
              useCondition: false,
              alternateRollstring: alternateRollstring || ''
            }
          }
          if (
            skill.skillStats.alternateAppliesStatus &&
            Object.keys(skill.skillStats?.alternateAppliesStatus).length >= 0
          ) {
            conditionObj[skill.skillStats.condition].alternateAppliesStatus = {
              ...alternateAppliesStatus,
              ...skill.skillStats.alternateAppliesStatus
            }
          }
          if (skill.skillStats.alternateDamageString) {
            if (skill.skillStats.alternateDamageString === 'weaponDamage') {
              for (let i = 0; i < rank; i++) {
                if (overrideWeaponDamage) {
                  conditionObj[skill.skillStats.condition].alternateRollstring +=
                    ' + ' + overrideWeaponDamage
                } else {
                  conditionObj[skill.skillStats.condition].alternateRollstring +=
                    ' + ' + weaponDamage
                }
              }
            } else {
              let numDice = parseInt(skill.skillStats.alternateDamageString.split('d')[0])
              let additionalDamage =
                skill.skillStats.costType === 'rank'
                  ? numDice * rank +
                    skill.skillStats.alternateDamageString.substring((numDice + '').length)
                  : numDice +
                    skill.skillStats.alternateDamageString.substring((numDice + '').length)
              conditionObj[skill.skillStats.condition].alternateRollstring +=
                ' + ' + additionalDamage
            }
          }
          if (skill.skillStats.alternateMinWeaponDamage) {
            conditionObj[skill.skillStats.condition].alternateMinWeaponDamage +=
              skill.skillStats.alternateMinWeaponDamage
          }

          if (skill.skillStats.alternateCausesSave) {
            conditionObj[skill.skillStats.condition].alternateCausesSave +=
              skill.skillStats.alternateCausesSave + '&'
          }
        }
        if (skill.skillStats[mode]?.condition) {
          if (!conditions.includes(skill.skillStats[mode].condition)) {
            conditionObj[skill.skillStats[mode].condition] = {
              condition: skill.skillStats[mode].condition,
              alternateDamageString: '',
              alternateMinWeaponDamage: 0,
              alternateAppliesStatus: {},
              useCondition: false,
              alternateCausesSave: '',
              alternateRollstring: alternateRollstring || ''
            }
          }
          if (
            skill.skillStats[mode].alternateAppliesStatus &&
            Object.keys(skill.skillStats[mode]?.alternateAppliesStatus).length >= 0
          ) {
            conditionObj[skill.skillStats[mode].condition].alternateAppliesStatus = {
              ...alternateAppliesStatus,
              ...skill.skillStats[mode].alternateAppliesStatus
            }
          }
          if (skill.skillStats[mode].alternateDamageString) {
            if (skill.skillStats[mode].alternateDamageString === 'weaponDamage') {
              for (let i = 0; i < rank; i++) {
                if (overrideWeaponDamage) {
                  conditionObj[skill.skillStats[mode].condition].alternateRollstring +=
                    ' + ' + overrideWeaponDamage
                } else {
                  conditionObj[skill.skillStats[mode].condition].alternateRollstring +=
                    ' + ' + weaponDamage
                }
              }
            } else {
              let numDice = parseInt(skill.skillStats[mode].alternateDamageString.split('d')[0])
              let additionalDamage =
                skill.skillStats[mode].costType === 'rank'
                  ? numDice * rank +
                    skill.skillStats[mode].alternateDamageString.substring((numDice + '').length)
                  : numDice +
                    skill.skillStats[mode].alternateDamageString.substring((numDice + '').length)
              conditionObj[skill.skillStats[mode].condition].alternateRollstring +=
                ' + ' + additionalDamage
            }
          }
          if (skill.skillStats[mode].alternateMinWeaponDamage) {
            conditionObj[skill.skillStats[mode].condition].alternateMinWeaponDamage +=
              skill.skillStats[mode].alternateMinWeaponDamage
          }

          if (skill.skillStats[mode].alternateCausesSave) {
            conditionObj[skill.skillStats[mode].condition].alternateCausesSave +=
              skill.skillStats[mode].alternateCausesSave + '&'
          }
        }
      })

      conditionStateObj.value = conditionObj
      return {
        placedRollsNum: placedRollsNum,
        modifier: modifier,
        alternateMinWeaponDamage: alternateMinWeaponDamage,
        minWeaponDamage: minWeaponDamage,
        causesSave: causesSave,
        alternateCausesSave: alternateCausesSave,
        damageString: damageString,
        alternateDamageString: alternateDamageString,
        alternateAppliesStatus: alternateAppliesStatus,
        appliesStatus: appliesStatus,
        alternateRollstring: alternateRollstring,
        rollstring: rollstring,
        conditionObj: conditionObj,
        overrideWeaponDamage: overrideWeaponDamage,
        weaponDamage: weaponDamage
      }
    }

    function attemptGeneration() {
      let universalObj = getSkillObj('Universal Skills', '', [])

      Object.keys(weaponAttack.value).forEach((attack) => {
        if (attack != 'Universal Skills' && attack != 'Next Successful Strike') {
          let useMode = weaponAttack.value[attack].modes.length > 1
          weaponAttack.value[attack].modes.forEach((mode) => {
            if (useMode) {
              universalObj = getSkillObj('Universal Skills', mode, [])
            }
            let currentAttack
            if (weaponAttack.value[attack].mirrors === '*') {
              currentAttack = getSkillObj('Strike 1', mode, [])
            } else if (weaponAttack.value[attack].mirrors) {
              let skills = weaponAttack.value[attack].skills
              let skillsToFilterOn = weaponAttack.value[attack].mirrors.split(':')
              let filteredSkills = weaponAttack.value['Strike 1'].skills.filter(
                (skill: { name: String }) => skillsToFilterOn.includes(skill.name)
              )
              skills = skills.concat(filteredSkills)
              currentAttack = getSkillObj(attack, mode, skills)
            } else {
              currentAttack = getSkillObj(attack, mode, [])
            }
            weaponAttack.value[attack].conditionObj = currentAttack.conditionObj

            if (useMode) {
              if (!weaponAttack.value[attack].modeObj[mode]) {
                weaponAttack.value[attack].modeObj[mode] = {
                  conditionObj: {},
                  rollstring: '',
                  alternateRollstring: ''
                }
              }
              weaponAttack.value[attack].modeObj[mode].conditionObj = currentAttack.conditionObj
            }

            //Damage
            weaponAttack.value[attack].rollstring =
              currentAttack.rollstring + universalObj.rollstring
            if (useMode) {
              weaponAttack.value[attack].modeObj[mode].rollstring =
                currentAttack.rollstring + universalObj.rollstring
            }
            if (currentAttack.alternateRollstring || universalObj.alternateRollstring)
              if (useMode) {
                weaponAttack.value[attack].modeObj[mode].alternateRollstring =
                  currentAttack.alternateRollstring + universalObj.alternateRollstring
              }
            weaponAttack.value[attack].alternateRollstring =
              currentAttack.alternateRollstring + universalObj.alternateRollstring

            //To Hit
            let placedString = ''
            let modifierStr = ''
            if (currentAttack.placedRollsNum > 0 || universalObj.placedRollsNum > 0) {
              placedString += '*' + (currentAttack.placedRollsNum + universalObj.placedRollsNum)
            }
            if (currentAttack.modifier > 0 || universalObj.modifier > 0) {
              modifierStr += ' + ' + (currentAttack.modifier + universalObj.modifier)
            }
            weaponAttack.value[attack].rollstring =
              weaponAttack.value[attack].rollstring + ' | PER' + placedString + modifierStr
            if (useMode) {
              weaponAttack.value[attack].modeObj[mode].rollstring =
                weaponAttack.value[attack].modeObj[mode].rollstring +
                ' | PER' +
                placedString +
                modifierStr
            }
            if (currentAttack.causesSave || universalObj.causesSave) {
              let save = currentAttack.causesSave + universalObj.causesSave
              save = save.substring(0, save.length - 1)
              if (useMode) {
                weaponAttack.value[attack].modeObj[mode].rollstring =
                  weaponAttack.value[attack].rollstring + ' | ' + save
              }
              weaponAttack.value[attack].rollstring =
                weaponAttack.value[attack].rollstring + ' | ' + save
            }
            placedString = ''
            modifierStr = ''

            //weapon damage
            let weaponDamage = currentAttack.weaponDamage
            if (currentAttack.overrideWeaponDamage) {
              weaponDamage = currentAttack.overrideWeaponDamage
            } else if (universalObj.overrideWeaponDamage) {
              weaponDamage = universalObj.overrideWeaponDamage
            }
            weaponAttack.value[attack].rollstring =
              weaponDamage + weaponAttack.value[attack].rollstring
            if (useMode) {
              weaponAttack.value[attack].modeObj[mode].rollstring =
                weaponDamage + weaponAttack.value[attack].modeObj[mode].rollstring
            }

            // CONDITIONs
            if (currentAttack.conditionObj && Object.keys(currentAttack.conditionObj).length > 0) {
              Object.keys(currentAttack.conditionObj).forEach((condition) => {
                //weapon damage

                weaponAttack.value[attack].conditionObj[condition].alternateRollstring =
                  weaponDamage +
                  weaponAttack.value[attack].conditionObj[condition].alternateRollstring
                if (useMode) {
                  weaponAttack.value[attack].modeObj[mode].conditionObj[
                    condition
                  ].alternateRollstring =
                    weaponDamage +
                    weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                      .alternateRollstring
                }

                let obj = weaponAttack.value[attack].conditionObj[condition] || ''

                //check for to hit and saves
                if (obj) {
                  if (currentAttack.placedRollsNum > 0 || universalObj.placedRollsNum > 0) {
                    placedString +=
                      '*' + (currentAttack.placedRollsNum + universalObj.placedRollsNum)
                  }
                  if (currentAttack.modifier > 0 || universalObj.modifier > 0) {
                    modifierStr += ' + ' + (currentAttack.modifier + universalObj.modifier)
                  }
                  if (useMode) {
                    weaponAttack.value[attack].modeObj[mode].conditionObj[
                      condition
                    ].alternateRollstring =
                      weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                        .alternateRollstring +
                      ' | PER' +
                      placedString +
                      modifierStr
                  }
                  weaponAttack.value[attack].conditionObj[condition].alternateRollstring =
                    weaponAttack.value[attack].conditionObj[condition].alternateRollstring +
                    ' | PER' +
                    placedString +
                    modifierStr
                  if (
                    obj.alternateCausesSave ||
                    universalObj.conditionObj[condition]?.alternateCausesSave
                  ) {
                    let save =
                      obj.alternateCausesSave +
                      universalObj.conditionObj[condition]?.alternateCausesSave
                    save = save.substring(0, save.length - 1)
                    weaponAttack.value[attack].conditionObj[condition].alternateRollstring =
                      weaponAttack.value[attack].conditionObj[condition].alternateRollstring +
                      ' | ' +
                      save
                    if (useMode) {
                      weaponAttack.value[attack].modeObj[mode].conditionObj[
                        condition
                      ].alternateRollstring =
                        weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                          .alternateRollstring +
                        ' | ' +
                        save
                    }
                  } else if (currentAttack.causesSave || universalObj.causesSave) {
                    let save = currentAttack.causesSave + universalObj.causesSave
                    save = save.substring(0, save.length - 1)
                    weaponAttack.value[attack].conditionObj[condition].alternateRollstring =
                      weaponAttack.value[attack].conditionObj[condition].alternateRollstring +
                      ' | ' +
                      save
                    if (useMode) {
                      weaponAttack.value[attack].modeObj[mode].conditionObj[
                        condition
                      ].alternateRollstring =
                        weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                          .alternateRollstring +
                        ' | ' +
                        save
                    }
                  }
                }
              })
            }
          })
        } else if (attack === 'Next Successful Strike') {
          let useMode = weaponAttack.value[attack].modes.length > 1
          let currentAttack = getSkillObj(attack, '', [])
          weaponAttack.value[attack].conditionObj = currentAttack.conditionObj
          weaponAttack.value[attack].modes.forEach((mode) => {
            currentAttack = getSkillObj(attack, mode, [])
            if (useMode) {
              if (!weaponAttack.value[attack].modeObj[mode]) {
                weaponAttack.value[attack].modeObj[mode] = {
                  conditionObj: {},
                  rollstring: '',
                  alternateRollstring: ''
                }
              }
              weaponAttack.value[attack].modeObj[mode].conditionObj = currentAttack.conditionObj
            }

            if (currentAttack.causesSave) {
              let save = currentAttack.causesSave
              save = save.substring(0, save.length - 1)
              weaponAttack.value[attack].rollstring = save
              if (useMode) {
                weaponAttack.value[attack].modeObj[mode].rollstring = save
              }
            }
            if (currentAttack.conditionObj) {
              Object.keys(currentAttack.conditionObj).forEach((condition) => {
                weaponAttack.value[attack].conditionObj[condition].alternateRollstring = ''
                let obj = weaponAttack.value[attack].conditionObj[condition] || ''
                //check for to hit and saves
                if (obj) {
                  if (obj.alternateCausesSave) {
                    let save = obj.alternateCausesSave
                    save = save.substring(0, save.length - 1)
                    weaponAttack.value[attack].conditionObj[condition].alternateRollstring =
                      weaponAttack.value[attack].conditionObj[condition].alternateRollstring + save
                    if (useMode) {
                      weaponAttack.value[attack].modeObj[mode].conditionObj[
                        condition
                      ].alternateRollstring =
                        weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                          .alternateRollstring + save
                    }
                  } else if (currentAttack.causesSave) {
                    let save = currentAttack.causesSave
                    save = save.substring(0, save.length - 1)
                    weaponAttack.value[attack].conditionObj[condition].alternateRollstring =
                      weaponAttack.value[attack].conditionObj[condition].alternateRollstring + save
                    if (useMode) {
                      weaponAttack.value[attack].modeObj[mode].conditionObj[
                        condition
                      ].alternateRollstring =
                        weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                          .alternateRollstring + save
                    }
                  }
                }
              })
            }
            if (
              weaponAttack.value[attack].modeObj[mode] &&
              weaponAttack.value[attack].modeObj[mode].conditionObj
            ) {
              Object.keys(weaponAttack.value[attack].modeObj[mode].conditionObj).forEach(
                (condition) => {
                  weaponAttack.value[attack].modeObj[mode].conditionObj[
                    condition
                  ].alternateRollstring = ''
                  let obj = weaponAttack.value[attack].modeObj[mode].conditionObj[condition] || ''
                  //check for to hit and saves
                  if (obj) {
                    if (obj.alternateCausesSave) {
                      let save = obj.alternateCausesSave
                      save = save.substring(0, save.length - 1)

                      weaponAttack.value[attack].modeObj[mode].conditionObj[
                        condition
                      ].alternateRollstring =
                        weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                          .alternateRollstring + save
                    } else if (currentAttack.causesSave) {
                      let save = currentAttack.causesSave
                      save = save.substring(0, save.length - 1)
                      weaponAttack.value[attack].modeObj[mode].conditionObj[
                        condition
                      ].alternateRollstring =
                        weaponAttack.value[attack].modeObj[mode].conditionObj[condition]
                          .alternateRollstring + save
                    }
                  }
                }
              )
            }
          })
        }
      })
    }

    function getPlaced(modifyToHit, rank) {
      let placed = modifyToHit.substring(1)
      if (placed === 'rank') {
        return rank
      } else {
        return parseInt(placed)
      }
    }

    const prevLoc = ref('')
    const weaponAttack = ref({
      'Strike 1': { skills: [], modes: [''], modeObj: {}, hand: 'Primary', handRestriction: 'any' },
      'Universal Skills': {
        skills: [],
        modes: [''],
        modeObj: {},
        modifiesSomeCosts: 0,
        increasedCosts: 0,
        forceTypeMalleableToBe: ''
      },
      'Next Successful Strike': { skills: [], modes: [''], modeObj: {} }
    })
    const items: Ref<Array<any>> = ref([])
    const draggedItem = ref({
      name: 'poopy',
      purchasedMp: 0,
      rank: 1,
      rollstring: '',
      conditionObj: { condition: { alternateRollstring: '' } },
      skillStats: {
        mpCost: 1,
        type: 'Altered Strike',
        grantsNewStrike: '',
        newStrikeMirror: '',
        modes: [''],
        costMalleable: false,
        modifiesSomeCosts: 0,
        increasesCostOfAllEffects: 0,
        forceTypeMalleableToBe: '',
        typeMalleable: false
      }
    })
    const characterStore = useCharacterStore()
    const { getMp } = storeToRefs(characterStore)

    function save() {
      if (characterStore.martialAttacks[name.value]) {
        alert('Name is Taken!')
      } else if (name.value === '') {
        alert('Name is required!')
      } else {
        let attacks = characterStore.martialAttacks
        attacks[name.value] = {
          name: name.value,
          attackObj: weaponAttack.value,
          mp: spentMp.value,
          description: description.value,
          icon: icon.value,
          actionCost: 'Core Action'
        }

        characterStore.addMartialAttack(attacks)
        context.emit('saved')
      }
    }
    const description = ref('')
    return {
      designStore,
      props,
      name,
      items,
      onDrop,
      prevLoc,
      draggedItem,
      removeFromLoc,
      kill,
      weaponAttack,
      attemptGeneration,
      conditionStateObj,
      description,
      spentMp,
      save,
      getMp,
      icon
    }
  },
  components: {
    BFormInput,
    MartialSkillTabs,
    WeaponStrike,
    BFormTextarea,
    RollstringLineup,
    BButton,
    MartialAttackDisplay,
    TitleWidget,
    IconPicker
  }
}
</script>
<template>
  <div>
    <TitleWidget
      title="Weapon Attack Builder"
      info-message="My eyeballs are slimy"
      :spent="spentMp"
      :total="getMp"
      units="MP"
    ></TitleWidget>
    <div
      style="display: flex; border-bottom: 2px solid"
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        '--bs-secondary-color': designStore.inputText
      }"
    >
      <BFormInput
        v-model="name"
        placeholder="Weapon Attack Name"
        style="border-radius: 0; border: none; font-size: larger"
        :style="{
          fontFamily: designStore.font,
          color: designStore.inputText,
          background: designStore.inputBacking,
          borderColor: designStore.secondaryTheme,
          '--bs-secondary-color': designStore.inputText
        }"
      ></BFormInput>
      <IconPicker
        :style="{ background: designStore.inputBacking }"
        style="align-self: center; border-radius: 10px; margin: 0.5rem"
        :currentIcon="icon"
        @selectedIcon="(newIcon) => (icon = newIcon)"
        orientation="left"
        :color="designStore.iconColor"
      ></IconPicker>
    </div>
    <div class="builderContainer">
      <div style="display: flex; flex-grow: 1; flex-direction: column">
        <div style="width: 100%; display: flex; flex-direction: row; flex-wrap: wrap">
          <div
            v-for="attack in Object.keys(weaponAttack).filter(
              (key) => key != 'Universal Skills' && key != 'Next Successful Strike'
            )"
            :key="attack"
            style="flex-grow: 1"
          >
            <WeaponStrike
              v-if="attack != 'Universal Skills' && attack != 'Next Successful Strike'"
              style="height: 100%; width: 100%"
              :strike="attack"
              :increasedCosts="weaponAttack['Universal Skills'].increasedCosts"
              :skills="weaponAttack[attack].skills"
              :universalModifiesSomeCosts="weaponAttack['Universal Skills'].modifiesSomeCosts"
              :hand="weaponAttack[attack].hand"
              :handRestriction="weaponAttack[attack].handRestriction"
              @newHand="(hand) => (weaponAttack[attack].hand = hand)"
              @drop="onDrop(attack)"
              @dragenter.prevent
              @dragover.prevent
              @remove="(loc) => (prevLoc = loc)"
              @kill="(loc, name) => kill(loc, name)"
              @draggedItem="(item) => (draggedItem = item)"
            ></WeaponStrike>
          </div>
        </div>

        <div
          style="
            display: flex;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid;
            padding-left: 0.5rem;
          "
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText,
            scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
          }"
        >
          <WeaponStrike
            style="height: 100%; width: 100%"
            strike="Next Successful Strike"
            :universalModifiesSomeCosts="weaponAttack['Universal Skills'].modifiesSomeCosts"
            :skills="weaponAttack['Next Successful Strike'].skills"
            :increasedCosts="weaponAttack['Universal Skills'].increasedCosts"
            @drop="onDrop('Next Successful Strike')"
            @dragenter.prevent
            @dragover.prevent
            @remove="(loc) => (prevLoc = loc)"
            @kill="(loc, name) => kill(loc, name)"
            @draggedItem="(item) => (draggedItem = item)"
          ></WeaponStrike>
        </div>
        <div
          style="
            display: flex;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid;
            padding-left: 0.5rem;
          "
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme,
            '--bs-secondary-color': designStore.inputText,
            scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
          }"
        >
          <WeaponStrike
            style="height: 100%; width: 100%"
            strike="Universal Skills"
            :skills="weaponAttack['Universal Skills'].skills"
            :universalModifiesSomeCosts="weaponAttack['Universal Skills'].modifiesSomeCosts"
            :increasedCosts="weaponAttack['Universal Skills'].increasedCosts"
            @drop="onDrop('Universal Skills')"
            @dragenter.prevent
            @dragover.prevent
            @remove="(loc) => (prevLoc = loc)"
            @kill="(loc, name) => kill(loc, name)"
            @draggedItem="(item) => (draggedItem = item)"
          ></WeaponStrike>
        </div>
        <BButton
          @click="attemptGeneration()"
          style="border-radius: 0"
          :style="{
            fontFamily: designStore.titleFont,
            color: designStore.primaryText,
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme
          }"
          >Attempt Generation</BButton
        >
        <BFormTextarea
          v-model="description"
          style="border-radius: 0"
          :style="{
            fontFamily: designStore.font,
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
          placeholder="description"
        ></BFormTextarea>
        <div v-for="attack in Object.keys(weaponAttack)" :key="attack">
          <RollstringLineup
            :attack="attack"
            :weapon-attack="weaponAttack"
            :condition-obj="weaponAttack[attack].conditionObj"
            :rollstring="weaponAttack[attack].rollstring"
            :modes="weaponAttack[attack].modes"
            :modeObj="weaponAttack[attack].modeObj"
            :useMode="weaponAttack[attack].modes.length > 1"
          ></RollstringLineup>
        </div>
      </div>
      <div>
        <MartialSkillTabs @draggedItem="(item) => (draggedItem = item)"></MartialSkillTabs>
      </div>
    </div>
    <div
      style="font-size: x-large; padding: 0.5rem; display: flex; justify-content: space-between"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        font: designStore.titleFont
      }"
    >
      <div style="width: 12.5rem">Sample Display</div>
      <BButton
        style="
          border: 2px solid;

          font-size: large;
        "
        :style="{
          fontFamily: designStore.titleFont,
          color: designStore.primaryText,
          background: designStore.primaryTheme,
          borderColor: designStore.secondaryTheme
        }"
        @click="save()"
        ><div style="display: flex; text-align: center; justify-content: center">
          SAVE ATTACK
        </div></BButton
      >
    </div>
    <MartialAttackDisplay
      :description="description"
      :weaponAttack="weaponAttack"
      :title="name"
      :icon="icon"
    ></MartialAttackDisplay>
  </div>
</template>
<style scoped>
.builderContainer {
  display: flex;
  height: min-content;
}
@media (max-width: 600px) {
  .builderContainer {
    display: flex;
    flex-direction: column-reverse;
    height: min-content;
  }
}
</style>
