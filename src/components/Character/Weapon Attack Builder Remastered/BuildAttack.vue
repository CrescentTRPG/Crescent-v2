<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { storeToRefs } from 'pinia'
import { computed, onMounted, Ref, ref } from 'vue'
import MartialAttackTable from '../Matrial Attack Builder/MartialAttackTable.vue'
import { Weapon } from '@/stores/equipmentStore.ts'
import GridSelect from '@/components/GridSelect.vue'
import CustomModal from '@/components/CustomModal.vue'
import BuildStrike from './BuildStrike.vue'
import { lightenDarkenColor } from '../../../Utility.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import StrikeModifierDisplay from './StrikeModifierDisplay.vue'
import { DEFAULT_WEAPON_ATTACK, MartialAttack, StrikeInfo } from '@/bases.ts'
import _ from 'lodash'
import MartialAttackDisplay from '../Matrial Attack Builder/MartialAttackDisplay.vue'
import { BFormInput, BFormInvalidFeedback } from 'bootstrap-vue-next'
import BForm from 'bootstrap-vue-next/src/components/BForm/BForm.vue'

export default {
  props: [
    'primary',
    'secondary',
    'updateAttack',
    'attack',
    'specializations',
    'combatStyles',
    'goBack',
    'saved'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const martialSkillsStore = useMartialSkillsStore()
    const { allSpecializations, allCombatStyles, specializations, combatStyles } =
      storeToRefs(martialSkillsStore)
    const weaponAttack: Ref<MartialAttack> = ref(_.cloneDeep(props.attack))
    const characterStore = useCharacterStore()
    const conditionStateObj = ref({})
    onMounted(() => {
      attemptGeneration()
    })
    function getPlaced(modifyToHit, rank) {
      let placed = modifyToHit.substring(1)
      if (placed === 'rank') {
        return rank
      } else {
        return parseInt(placed)
      }
    }
    const spentMpObject = computed(() => {
      let obj = { total: 0 }
      Object.values(weaponAttack.value.attackObj).forEach((attack) => {
        attack.skills.forEach((skill) => {
          obj.total += skill.purchasedMp
          obj[skill.skillStats.origin] = (obj[skill.skillStats.origin] || 0) + skill.purchasedMp
        })
      })
      return obj
    })
    function getSkillObj(attack: string, mode: string, skills) {
      const primary = props.primary
      const secondary = props.secondary

      let weaponDamage = (primary.equippedStats as Weapon).damageString
      if ((weaponAttack.value.attackObj[attack] as StrikeInfo).hand === 'Offhand') {
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
      let skillsArr = Object.values(weaponAttack.value.attackObj[attack].skills) as any
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
    const typeMalleableObj = ref({})
    function addToTypeMalleable(skill) {
      typeMalleableObj.value[skill.name] = skill
    }
    const typeMalleableApplyToAllSkills = computed(() => {
      return Object.values(weaponAttack.value.attackObj['Universal Skills'].skills).reduce(
        (acc, val: any) => acc || val.skillStats.forceTypeMalleableToBe?.includes('All'),
        false
      )
    })
    function rmTypeMalleable(name) {
      delete typeMalleableObj.value[name]
    }

    function attemptGeneration() {
      let universalObj = getSkillObj('Universal Skills', '', [])
      Object.keys(weaponAttack.value.attackObj).forEach((attack) => {
        let attackRef: any = weaponAttack.value.attackObj[attack]
        if (attack != 'Universal Skills' && attack != 'Next Successful Strike') {
          let useMode = attackRef.modes.length > 1
          attackRef.modes.forEach((mode) => {
            if (useMode) {
              universalObj = getSkillObj('Universal Skills', mode, [])
            }
            let currentAttack
            if (attackRef.mirrors === '*') {
              currentAttack = getSkillObj('Strike 1', mode, [])
            } else if (attackRef.mirrors) {
              let skills = Object.values(attackRef.skills)
              let skillsToFilterOn = attackRef.mirrors?.split(':')
              if (skillsToFilterOn[0].includes('Lethal')) {
                skillsToFilterOn[0] = 'Lethal'
              }
              let filteredSkills = Object.values(
                weaponAttack.value.attackObj['Strike 1'].skills
              ).filter((skill: any) =>
                skillsToFilterOn ? skillsToFilterOn.includes(skill.name) : false
              )
              skills = skills.concat(filteredSkills)
              currentAttack = getSkillObj(attack, mode, skills)
            } else {
              currentAttack = getSkillObj(attack, mode, [])
            }
            attackRef.conditionObj = currentAttack.conditionObj

            if (useMode) {
              if (!attackRef.modeObj[mode]) {
                attackRef.modeObj[mode] = {
                  conditionObj: {},
                  rollstring: '',
                  alternateRollstring: ''
                }
              }
              attackRef.modeObj[mode].conditionObj = currentAttack.conditionObj
            }

            //Damage
            attackRef.rollstring = currentAttack.rollstring + universalObj.rollstring
            if (useMode) {
              attackRef.modeObj[mode].rollstring =
                currentAttack.rollstring + universalObj.rollstring
            }
            if (currentAttack.alternateRollstring || universalObj.alternateRollstring)
              if (useMode) {
                attackRef.modeObj[mode].alternateRollstring =
                  currentAttack.alternateRollstring + universalObj.alternateRollstring
              }
            attackRef.alternateRollstring =
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
            attackRef.rollstring = attackRef.rollstring + ' | PER' + placedString + modifierStr
            if (useMode) {
              attackRef.modeObj[mode].rollstring =
                attackRef.modeObj[mode].rollstring + ' | PER' + placedString + modifierStr
            }
            if (currentAttack.causesSave || universalObj.causesSave) {
              let save = currentAttack.causesSave + universalObj.causesSave
              save = save.substring(0, save.length - 1)
              if (useMode) {
                attackRef.modeObj[mode].rollstring = attackRef.rollstring + ' | ' + save
              }
              attackRef.rollstring = attackRef.rollstring + ' | ' + save
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
            attackRef.rollstring = weaponDamage + attackRef.rollstring
            if (useMode) {
              attackRef.modeObj[mode].rollstring = weaponDamage + attackRef.modeObj[mode].rollstring
            }

            // CONDITIONs
            if (currentAttack.conditionObj && Object.keys(currentAttack.conditionObj).length > 0) {
              Object.keys(currentAttack.conditionObj).forEach((condition) => {
                //weapon damage

                attackRef.conditionObj[condition].alternateRollstring =
                  weaponDamage + attackRef.conditionObj[condition].alternateRollstring
                if (useMode) {
                  attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                    weaponDamage +
                    attackRef.modeObj[mode].conditionObj[condition].alternateRollstring
                }

                let obj = attackRef.conditionObj[condition] || ''

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
                    attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                      attackRef.modeObj[mode].conditionObj[condition].alternateRollstring +
                      ' | PER' +
                      placedString +
                      modifierStr
                  }
                  attackRef.conditionObj[condition].alternateRollstring =
                    attackRef.conditionObj[condition].alternateRollstring +
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
                    attackRef.conditionObj[condition].alternateRollstring =
                      attackRef.conditionObj[condition].alternateRollstring + ' | ' + save
                    if (useMode) {
                      attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                        attackRef.modeObj[mode].conditionObj[condition].alternateRollstring +
                        ' | ' +
                        save
                    }
                  } else if (currentAttack.causesSave || universalObj.causesSave) {
                    let save = currentAttack.causesSave + universalObj.causesSave
                    save = save.substring(0, save.length - 1)
                    attackRef.conditionObj[condition].alternateRollstring =
                      attackRef.conditionObj[condition].alternateRollstring + ' | ' + save
                    if (useMode) {
                      attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                        attackRef.modeObj[mode].conditionObj[condition].alternateRollstring +
                        ' | ' +
                        save
                    }
                  }
                }
              })
            }
          })
        } else if (attack === 'Next Successful Strike') {
          let useMode = attackRef.modes.length > 1
          let currentAttack = getSkillObj(attack, '', [])
          attackRef.conditionObj = currentAttack.conditionObj
          attackRef.modes.forEach((mode) => {
            currentAttack = getSkillObj(attack, mode, [])
            if (useMode) {
              if (!weaponAttack.value.attackObj.value[attack].modeObj[mode]) {
                attackRef.modeObj[mode] = {
                  conditionObj: {},
                  rollstring: '',
                  alternateRollstring: ''
                }
              }
              attackRef.modeObj[mode].conditionObj = currentAttack.conditionObj
            }

            if (currentAttack.causesSave) {
              let save = currentAttack.causesSave
              save = save.substring(0, save.length - 1)
              attackRef.rollstring = save
              if (useMode) {
                attackRef.modeObj[mode].rollstring = save
              }
            }
            if (currentAttack.conditionObj) {
              Object.keys(currentAttack.conditionObj).forEach((condition) => {
                attackRef.conditionObj[condition].alternateRollstring = ''
                let obj = attackRef.conditionObj[condition] || ''
                //check for to hit and saves
                if (obj) {
                  if (obj.alternateCausesSave) {
                    let save = obj.alternateCausesSave
                    save = save.substring(0, save.length - 1)
                    attackRef.conditionObj[condition].alternateRollstring =
                      attackRef.conditionObj[condition].alternateRollstring + save
                    if (useMode) {
                      attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                        attackRef.modeObj[mode].conditionObj[condition].alternateRollstring + save
                    }
                  } else if (currentAttack.causesSave) {
                    let save = currentAttack.causesSave
                    save = save.substring(0, save.length - 1)
                    attackRef.conditionObj[condition].alternateRollstring =
                      attackRef.conditionObj[condition].alternateRollstring + save
                    if (useMode) {
                      attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                        attackRef.modeObj[mode].conditionObj[condition].alternateRollstring + save
                    }
                  }
                }
              })
            }
            if (attackRef.modeObj[mode] && attackRef.modeObj[mode].conditionObj) {
              Object.keys(attackRef.modeObj[mode].conditionObj).forEach((condition) => {
                attackRef.modeObj[mode].conditionObj[condition].alternateRollstring = ''
                let obj = attackRef.modeObj[mode].conditionObj[condition] || ''
                //check for to hit and saves
                if (obj) {
                  if (obj.alternateCausesSave) {
                    let save = obj.alternateCausesSave
                    save = save.substring(0, save.length - 1)

                    attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                      attackRef.modeObj[mode].conditionObj[condition].alternateRollstring + save
                  } else if (currentAttack.causesSave) {
                    let save = currentAttack.causesSave
                    save = save.substring(0, save.length - 1)
                    attackRef.modeObj[mode].conditionObj[condition].alternateRollstring =
                      attackRef.modeObj[mode].conditionObj[condition].alternateRollstring + save
                  }
                }
              })
            }
          })
        }
      })
    }
    const universalSkills = computed(() => {
      return Object.values(allPossibleSkillsObj.value)
        .filter(
          (s: any) =>
            s?.skillStats.type === 'Passive' ||
            s?.skillStats.type === 'All Successful Strikes' ||
            s?.skillStats.type === 'All Strikes' ||
            (s?.skillStats.type === 'Executes an Action' && s?.skillStats.grantsNewStrike === '')
        )
        .map((skill: any) => {
          return {
            name: skill.name,
            nameDecorator: '(' + skill.mp_cost + ')',
            value: skill,
            icon: skill.icon,
            description: skill.description,
            disabled: false
          }
        })
    })
    const allPossibleSkillsObj = computed(() => {
      let val = {}
      props.primary.equippedStats.specializations.forEach((spec) => {
        val = { ...val, ...allSpecializations.value[spec].skills }
      })
      props.secondary?.equippedStats.specializations.forEach((spec) => {
        val = { ...val, ...allSpecializations.value[spec].skills }
      })

      props.primary.equippedStats.combatStyles.forEach((style) => {
        val = { ...val, ...allCombatStyles.value[style].skills }
      })

      props.secondary?.equippedStats.combatStyles.forEach((style) => {
        val = { ...val, ...allCombatStyles.value[style].skills }
      })
      return val
    })
    const createStrikeSkills = computed(() => {
      let primarySkills = Object.values(
        allSpecializations.value[props.primary.equippedStats.specializations[0]].skills
      )
        .concat(
          Object.values(allCombatStyles.value[props.primary.equippedStats.combatStyles[0]].skills)
        )
        .filter(
          (s: any) =>
            s?.skillStats.grantsNewStrike === 'Any' || s?.skillStats.grantsNewStrike === 'Primary'
        )
      if (props.secondary) {
        const secondarySkills = Object.values(
          allSpecializations.value[props.secondary?.equippedStats.specializations[0]]?.skills || {}
        )
          .concat(
            Object.values(
              allCombatStyles.value[props.secondary.equippedStats.combatStyles[0]].skills
            )
          )
          .filter((s: any) => s?.skillStats.grantsNewStrike === 'Offhand')
        primarySkills = primarySkills.concat(secondarySkills)
      }

      return primarySkills.map((skill: any) => {
        return {
          name: skill.name + '(' + skill.mp_cost + ')',
          value: skill,
          icon: skill.icon,
          description: skill.description,
          disabled: false
        }
      })
    })
    function createStrike(skill) {
      let attackCp = _.cloneDeep(weaponAttack.value)
      let newNum = Object.keys(attackCp.attackObj).length - 1
      attackCp.attackObj['Strike ' + newNum] = {
        conditionObj: {},
        hand: 'Primary',
        handRestriction: '',
        modeObj: {},
        modes: [''],
        rollstring: '',
        skills: {},
        specialization: '',
        mirrors: skill.skillStats.newStrikeMirror || undefined,
        alternateRollstring: undefined
      }
      if (skill.skillStats.grantsNewStrike === 'Offhand') {
        attackCp.attackObj['Strike ' + newNum] = {
          conditionObj: {},
          hand: 'Offhand',
          handRestriction: 'Offhand',
          modeObj: {},
          modes: [''],
          rollstring: '',
          skills: {},
          specialization: undefined,
          mirrors: skill.skillStats.newStrikeMirror || undefined,
          alternateRollstring: undefined
        }
      } else if (skill.skillStats.grantsNewStrike === 'Primary') {
        attackCp.attackObj['Strike ' + newNum] = {
          conditionObj: {},
          hand: 'Primary',
          handRestriction: 'Primary',
          modeObj: {},
          modes: [''],
          rollstring: '',
          skills: {},
          specialization: undefined,
          mirrors: skill.skillStats.newStrikeMirror || undefined,
          alternateRollstring: undefined
        }
      }

      attackCp.attackObj['Strike ' + newNum].skills[skill.name] = {
        ...skill,
        purchasedMp:
          skill.skillStats.mpCost ||
          (skill.skillStats.modes && skill.skillStats[skill.skillStats.modes[0]].mpCost)
      }
      if (skill.skillStats.heavyCostsMore) {
        switch (attackCp.attackObj['Strike ' + newNum].hand) {
          case 'Primary':
            if (props.primary.equippedStats.combatStyles[0] === 'Heavy') {
              attackCp.attackObj['Strike ' + newNum].skills[skill.name].purchasedMp +=
                skill.skillStats.additionalMpCost
            }
            break
          case 'Offhand':
            if (props.secondary.equippedStats.combatStyles[0] === 'Heavy') {
              attackCp.attackObj['Strike ' + newNum].skills[skill.name].purchasedMp +=
                skill.skillStats.additionalMpCost
            }
            break
        }
      }
      switch (attackCp.attackObj['Strike ' + newNum].hand) {
        case 'Primary':
          if (
            skill.skillStats.costMalleable &&
            props.primary.equippedStats.specializations[0] ===
              attackCp.attackObj['Universal Skills'].modifiesSomeCostsSkill &&
            attackCp.attackObj['Universal Skills'].modifiesSomeCosts
          ) {
            attackCp.attackObj['Strike ' + newNum].skills[skill.name].purchasedMp +=
              attackCp.attackObj['Universal Skills'].modifiesSomeCosts
          }
          break
        case 'Offhand':
          if (
            skill.skillStats.costMalleable &&
            props.secondary.equippedStats.specializations[0] ===
              attackCp.attackObj['Universal Skills'].modifiesSomeCostsSkill &&
            attackCp.attackObj['Universal Skills'].modifiesSomeCosts
          ) {
            attackCp.attackObj['Strike ' + newNum].skills[skill.name].purchasedMp +=
              attackCp.attackObj['Universal Skills'].modifiesSomeCosts
          }
          break
      }
      updateWeaponAttack(attackCp)
      showModal.value = false
    }
    function updateWeaponAttack(attack) {
      weaponAttack.value = attack
      props.updateAttack(weaponAttack.value)
      attemptGeneration()
    }
    function deleteStrike(strikeKey) {
      delete weaponAttack.value.attackObj[strikeKey]
      props.updateAttack(weaponAttack.value)
      attemptGeneration()
    }

    const maxSpecRank = computed(() => {
      return props.primary.equippedStats.specializations
        .concat(props.secondary?.equippedStats.specializations || [])
        .reduce(
          (acc, curr) =>
            specializations.value[curr].rank > acc ? specializations.value[curr].rank : acc,
          0
        )
    })
    const maxCombatStyleRank = computed(() => {
      return props.primary.equippedStats.combatStyles
        .concat(props.secondary?.equippedStats.combatStyles || [])
        .reduce(
          (acc, curr) =>
            combatStyles.value[curr].rank > acc ? combatStyles.value[curr].rank : acc,
          0
        )
    })
    const showModal = ref(false)
    const showUniversalModal = ref(false)
    const saveModal = ref(false)
    const description = ref('')
    const icon = ref(props.primary.icon)
    const spentMp = computed(() => {
      let ret = 0
      Object.values(weaponAttack.value.attackObj).forEach((attack) => {
        Object.values(attack.skills).forEach((skill: any) => {
          ret += skill.purchasedMp || 0
        })
      })
      return ret
    })
    function replaceUndefinedInPlace(obj) {
      if (obj === null || typeof obj !== 'object') return

      for (const key in obj) {
        if (obj[key] === undefined) {
          obj[key] = ''
        } else if (typeof obj[key] === 'object') {
          replaceUndefinedInPlace(obj[key])
        }
      }
    }
    function save(name) {
      let obj = weaponAttack.value.attackObj
      replaceUndefinedInPlace(obj)
      if (validName.value) {
        let attacks = characterStore.martialAttacks
        attacks[name] = {
          name: name,
          attackObj: obj,
          mp: spentMp.value,
          description: description.value,
          icon: icon.value,
          actionCost: 'Core Action'
        }
        saveModal.value = false

        characterStore.addMartialAttack(attacks)
        props.goBack()
      }
    }
    const name = ref('')
    const attackName = ref('')
    const triedToSave = ref(false)
    function openSaveModal() {
      saveModal.value = true
    }
    function overrideUniversalSkills(skillObj) {
      let attackCp = _.cloneDeep(weaponAttack.value)
      if (attackCp.attackObj['Universal Skills'].skills[skillObj.name]) {
        delete attackCp.attackObj['Universal Skills'].skills[skillObj.name]
      } else {
        let newSkill = allPossibleSkillsObj.value[skillObj.name]
        let attributes = []
        props.primary.equippedStats.combatStyles.forEach(
          (style) => (attributes = attributes.concat(allCombatStyles.value[style].attributes))
        )
        let minCost =
          newSkill.skillStats.mpCost ||
          (newSkill.skillStats.modes && newSkill.skillStats[newSkill.skillStats.modes[0]].mpCost)
        attackCp.attackObj['Universal Skills'].skills[skillObj.name] = {
          ...newSkill,
          purchasedMp: minCost,
          name: skillObj.name,
          rank: 1,
          attributes: attributes.length === 0 ? undefined : attributes
        }
      }
      updateWeaponAttack(attackCp)
    }

    function editSkill(skillName, skill) {
      let attackTemp = _.cloneDeep(props.attack)
      attackTemp.attackObj['Universal Skills'].skills[skillName] = skill
      updateWeaponAttack(attackTemp)
    }

    const validName = computed(() => {
      if (name.value != '') {
        if (!characterStore.martialAttacks[name.value]) {
          return true
        }
      }
      return !triedToSave.value
    })

    return {
      designStore,
      props,
      lightenDarkenColor,
      allSpecializations,
      allCombatStyles,
      weaponAttack,
      updateWeaponAttack,
      createStrikeSkills,
      createStrike,
      showModal,
      deleteStrike,
      showUniversalModal,
      overrideUniversalSkills,
      universalSkills,
      maxCombatStyleRank,
      maxSpecRank,
      editSkill,
      spentMpObject,
      addToTypeMalleable,
      typeMalleableObj,
      typeMalleableApplyToAllSkills,
      rmTypeMalleable,
      attackName,
      openSaveModal,
      save,
      saveModal,
      description,
      spentMp,
      icon,
      name,
      validName,
      triedToSave
    }
  },
  components: {
    TitleWidget,
    BuildStrike,
    StrikeModifierDisplay,
    BButton,
    CustomModal,
    GridSelect,
    MartialAttackDisplay,
    BFormInput,
    BForm,
    BFormInvalidFeedback
  }
}
</script>
<template>
  <div>
    <div
      style="display: flex; justify-content: end"
      :style="{ background: designStore.primaryTheme }"
    >
      <TitleWidget style="flex-grow: 1" title="New Attack"></TitleWidget>
      <div
        class="hoverableTransparantRadial"
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          cursor: pointer;
          border-radius: 0.3rem;
        "
        @click="showUniversalModal = true"
      >
        <i
          :style="{ color: designStore.secondaryTheme }"
          style="font-size: 1rem; text-align: right"
          class="bi bi-pen-fill"
        ></i>
        <div
          style="text-wrap: wrap; width: 5rem; text-align: center"
          :style="{ color: designStore.primaryText }"
        >
          Edit Base Attack
        </div>
      </div>

      <StrikeModifierDisplay
        v-for="skill in weaponAttack.attackObj['Universal Skills'].skills"
        :key="skill.name"
        :icon="skill.icon"
        :name="skill.name"
        :use="skill.mp_cost"
        :maxSkillRank="(skill as any).attributes ? maxCombatStyleRank : maxSpecRank"
        :skillObj="skill"
        :mpAllocated="(skill as any).purchasedMp"
        :update="editSkill"
        :increasedCosts="attack.attackObj['Universal Skills'].increasedCosts"
      ></StrikeModifierDisplay>
    </div>
    <div :style="{ background: designStore.sidebarBacking }">
      <BuildStrike
        v-for="strikeKey in Object.keys(weaponAttack.attackObj).filter(
          (a) => a != 'Next Successful Strike' && a != 'Universal Skills'
        )"
        :key="strikeKey"
        :name="strikeKey"
        :attack="weaponAttack"
        :primary="props.primary"
        :secondary="props.secondary"
        :strikeObj="weaponAttack.attackObj[strikeKey]"
        :updateAttack="updateWeaponAttack"
        :specializations="specializations"
        :combatStyles="combatStyles"
        :deleteStrike="() => deleteStrike(strikeKey)"
        :addToTypeMalleable="addToTypeMalleable"
        :typeMalleableObj="typeMalleableObj"
        :typeMalleableApplyToAllSkills="typeMalleableApplyToAllSkills"
        :rmTypeMalleable="rmTypeMalleable"
        :increasedCosts="attack.attackObj['Universal Skills'].increasedCosts"
        :someModifiedCosts="attack"
      ></BuildStrike>
    </div>
    <div style="display: flex; justify-content: center">
      <BButton
        class="hoverableTransparantLinear"
        style="
          border-top-left-radius: 0;
          border: 3px solid;
          border-top: 0;
          border-top-right-radius: 0;
          font-size: large;
          width: 50%;
        "
        :style="{
          borderColor: designStore.primaryTheme,
          color: designStore.sidebarText,
          background: designStore.sidebarBacking,
          boxShadow: 'inset 0px 5px 2px 1px ' + lightenDarkenColor(designStore.sidebarBacking, -25)
        }"
        @click="showModal = true"
      >
        Add Strike <v-icon name="gi-upgrade" scale="1.5"></v-icon
      ></BButton>
    </div>
    <CustomModal :showModal="showModal" @close="showModal = false" title="Add New Strike">
      <template v-slot:body>
        <GridSelect
          :updateOption="createStrike"
          :options="createStrikeSkills"
          :selected="[]"
        ></GridSelect>
      </template>
    </CustomModal>
    <CustomModal
      :showModal="showUniversalModal"
      @close="showUniversalModal = false"
      title="Edit Attack Modifiers"
    >
      <template v-slot:body>
        <GridSelect
          :updateOption="overrideUniversalSkills"
          :options="universalSkills"
          :multiSelect="true"
          :selected="
            universalSkills.filter((skill) =>
              Object.keys(weaponAttack.attackObj['Universal Skills'].skills).includes(skill.name)
            )
          "
        ></GridSelect>
      </template>
    </CustomModal>
    <div
      style="
        display: flex;
        justify-content: space-between;
        border-top: 2px solid;
        position: fixed;
        width: calc(Max(100% - 9rem, 83%));
        bottom: 0;
        z-index: 5;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <CustomModal :show-modal="saveModal" @close="saveModal = false" title="Save New Attack">
        <template v-slot:body>
          Summary
          <MartialAttackDisplay
            title="New Attack"
            :description="description"
            :mp="spentMp"
            :icon="icon"
            :weaponAttack="weaponAttack.attackObj"
          ></MartialAttackDisplay>
        </template>
        <template v-slot:footer>
          <div>
            <BForm
              @submit="save(name)"
              style="
                display: flex;
                flex-direction: column;
                margin-top: -1rem;
                margin-bottom: 0.5rem;
              "
              ><div style="display: flex">
                <BFormInput :placeholder="'New Attack Name'" v-model="name"></BFormInput>
                <BButton @click="triedToSave = true" style="width: 10rem" type="submit"
                  >Save Attack</BButton
                >
              </div>
              <BFormInvalidFeedback :state="validName" :style="{ color: designStore.alertTheme }"
                >Name Field Must Be filled out and not already taken by another
                Attack</BFormInvalidFeedback
              ></BForm
            >
          </div>
        </template>
      </CustomModal>
      <div style="display: flex; margin: 0.2rem; margin-left: 0.5rem">
        <div
          :style="{ fontFamily: designStore.titleFont, color: designStore.primaryText }"
          style="font-size: x-large"
        >
          {{ spentMp }} Mp / {{ maxCombatStyleRank }} MP
        </div>
      </div>
      <div style="display: flex; justify-content: end; margin-right: 0.5rem">
        <BButton
          class="footerButtons"
          style="margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="openSaveModal()"
        >
          <i class="bi bi-floppy"></i>
          <div style="margin-left: 0.5rem" class="discardText">Save</div>
          <div class="goBackText">and Go Back</div>
        </BButton>
        <BButton
          class="footerButtons"
          style="margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="goBack()"
        >
          <i class="bi bi-arrow-90deg-left"></i>
          <div class="discardText">Return</div>
          <div class="goBackText"></div>
        </BButton>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
