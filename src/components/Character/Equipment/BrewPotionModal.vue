<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { Item, Potion, useEquipmentStore } from '@/stores/equipmentStore.ts'

import EditItem from './EditItem.vue'
import _ from 'lodash'

import { useSkillStore } from '@/stores/skillsStore.ts'
import GridSelect from '@/components/GridSelect.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import AlchemicalIngredient from '@/components/Manual/Rules/Special Reference Pages/AlchemicalIngredient.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { group } from 'console'
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import EditAbility from '@/components/EditAbility.vue'
import CustomCheckbox from '../CustomCheckbox.vue'
import BuyPotionModal from './BuyPotionModal.vue'
import MakePotionWithSkill from './MakePotionWithSkill.vue'
import BasicInput from '../BasicInput.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'

export default {
  emits: ['ability', 'closeModal'],
  props: ['showModal', 'adventureMode'],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const equipmentStore = useEquipmentStore()
    const { alchemicalIngredients } = storeToRefs(equipmentStore)
    const skillStore = useSkillStore()
    const { skills } = storeToRefs(skillStore)
    const ignoreSkillUnlocks = ref(props.adventureMode)
    const stagedItem: Ref<Potion> = ref({
      name: 'Potion of Nothingness',
      count: 0,
      description: '',
      type: 'Potion',
      isAttuneable: false,
      holder: props.adventureMode ? '' : characterStore.id,
      holderType: props.adventureMode ? '' : 'Character',
      isAttuned: false,
      equippedStats: {
        ability: {
          name: ''
        },
        passives: {},
        material: '',
        enchantments: {},
        technicalAddons: {},
        materialCoverings: {}
      },
      ingredients: [],
      ability: {
        name: ''
      }
    })

    const alchemyRank = computed(() => {
      if (skills.value['Alchemy']) return skills.value['Alchemy'].rank
      return 0
    })

    const indegredientList = computed(() => {
      let ret: string[] = []
      ret.push(reagent.value)
      ret.push(base.value)
      return ret.concat(mutagens.value)
    })

    function getMutagenDescriptors() {
      let des = ''
      mutagens.value.forEach((m) => {
        if (alchemicalIngredients.value.mutagens[m].metadata.descriptor)
          des += alchemicalIngredients.value.mutagens[m].metadata.descriptor + ' '
      })
      return des
    }
    const isHidden = ref(false)
    const computedName = computed(() => {
      const targ = alchemicalIngredients.value.bases[base.value].metadata.target
      const area = alchemicalIngredients.value.bases[base.value].metadata.area
      const damage = alchemicalIngredients.value.reagents[reagent.value]?.metadata.damage
      const heal =
        alchemicalIngredients.value.reagents[reagent.value]?.metadata.heal ||
        alchemicalIngredients.value.reagents[reagent.value]?.metadata.overheal
      const manaGain = alchemicalIngredients.value.reagents[reagent.value]?.metadata.manaGain
      const manaDrain = alchemicalIngredients.value.reagents[reagent.value]?.metadata.manaDrain
      const adj =
        difficultyScore.value > 25
          ? 'Mythical '
          : difficultyScore.value > 20
            ? 'Legendary '
            : difficultyScore.value >= 18
              ? 'Supreme  '
              : difficultyScore.value >= 16
                ? 'Grand  '
                : difficultyScore.value >= 14
                  ? 'Greater '
                  : ''

      let baseName =
        targ === 'User' && area === 'Single Weapon'
          ? 'Lathered '
          : targ === 'Thrown'
            ? area === 'Single Target'
              ? 'Thrown '
              : 'Exploding '
            : area === 'Single Weapon'
              ? 'Lathered '
              : ''
      let reagentText = damage
        ? 'Killing'
        : heal
          ? 'Healing'
          : manaGain
            ? 'Arcane Energy'
            : manaDrain
              ? 'Arcane Depletion'
              : ''
      let extendedText = durationMultiplier() > 1 ? 'Extended ' : ''
      let oppositeText = isOpposite() ? 'Reversed ' : ''

      let mutagenText =
        mutagens.value.length >= 1 ? getMutagenDescriptors() : !reagent.value ? 'Nothing?' : ''
      if (reagentText) {
        return (
          adj + oppositeText + extendedText + baseName + mutagenText + 'Potion of ' + reagentText
        )
      }

      return adj + oppositeText + extendedText + baseName + 'Potion of ' + mutagenText + reagentText
    })

    const duration = computed(() => {
      if (reagent.value) {
        if (durationMultiplier() > 1)
          return getMultipliedDuration('instantaneous', durationMultiplier())
        else return 'instantaneous'
      } else {
        if (mutagens.value.length >= 1) {
          let shortestDur = mutagens.value.reduce((a, b) =>
            isShorterDuration(
              alchemicalIngredients.value.mutagens[a].metadata.duration || '',
              alchemicalIngredients.value.mutagens[b].metadata.duration || ''
            )
              ? a
              : b
          )
          if (durationMultiplier() > 1)
            return getMultipliedDuration(
              alchemicalIngredients.value.mutagens[shortestDur].metadata.duration,
              durationMultiplier()
            )
          else return alchemicalIngredients.value.mutagens[shortestDur].metadata.duration
        } else {
          return 'instantaneous'
        }
      }
    })
    const damageType = computed(() => {
      let dmg = ''
      mutagens.value.forEach((ing) => {
        if (alchemicalIngredients.value.mutagens[ing].metadata.damageType) {
          dmg = alchemicalIngredients.value.mutagens[ing].metadata.damageType
        }
      })
      return ' ' + (dmg || 'toxic')
    })
    const groupedEffects = computed(() => {
      let effects = {}
      mutagens.value.forEach((mutagen) => {
        if (effects[alchemicalIngredients.value.mutagens[mutagen].metadata.duration]) {
          effects[alchemicalIngredients.value.mutagens[mutagen].metadata.duration].push(mutagen)
        } else {
          effects[alchemicalIngredients.value.mutagens[mutagen].metadata.duration] = [mutagen]
        }
      })
      return effects
    })
    function getDurationIndex(duration, arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].duration === duration) {
          return i
        }
      }
      return -1
    }
    function getIngredientArr(duration) {
      let ret: any[] = []
      groupedEffects.value[duration].forEach((key) => {
        ret.push(alchemicalIngredients.value.mutagens[key])
      })
      return ret
    }
    const sortedGroupedEffects = computed(() => {
      let ret: Array<{ duration: any; ingredients: any }> = []
      let keys = Object.keys(groupedEffects.value).filter((key) => key != 'undefined')
      console.log(keys)
      keys.forEach((key) => {
        if (ret.length === 0) {
          ret.unshift({
            duration: key,
            ingredients: getIngredientArr(key)
          })
        } else {
          for (let i = 0; i <= ret.length; i++) {
            if (i === ret.length) {
              ret.splice(i, 0, {
                duration: key,
                ingredients: getIngredientArr(key)
              })
              break
            } else if (
              isShorterDuration(
                key.toLocaleLowerCase(),
                ret[i].ingredients[0].metadata.duration?.toLocaleLowerCase()
              )
            ) {
              ret.splice(i, 0, {
                duration: key,
                ingredients: getIngredientArr(key)
              })
              break
            }
          }
        }
      })
      return ret
    })

    function isShorterDuration(key, comp) {
      if (key === 'instantaneous') return true
      if (comp === 'instantaneous') return false
      else if (key.includes('round') && !comp.includes('round')) return true
      else if (comp.includes('round') && key.includes('round'))
        return parseInt(comp) - parseInt(key) > 0
      else if (comp.includes('round') && !key.includes('round')) return false
      else if (key.includes('minute') && !comp.includes('minute')) return true
      else if (comp.includes('minute') && key.includes('minute'))
        return parseInt(comp) - parseInt(key) > 0
      else if (comp.includes('minute') && !key.includes('minute')) return false
      else return false
    }
    function hasDamageToSuffering() {
      let ret = false
      mutagens.value.forEach((mutagen) => {
        if (alchemicalIngredients.value.mutagens[mutagen].metadata.damageToSuffering) {
          ret = true
        }
      })
      return ret
    }

    function durationMultiplier() {
      let ret = 1
      mutagens.value.forEach((mutagen) => {
        if (alchemicalIngredients.value.mutagens[mutagen].metadata.durationMultiplier) {
          ret = alchemicalIngredients.value.mutagens[mutagen].metadata.durationMultiplier
        }
      })
      return ret
    }

    function oppositeDurationMultiplier() {
      let ret = 1
      mutagens.value.forEach((mutagen) => {
        if (alchemicalIngredients.value.mutagens[mutagen].metadata.oppositeDurationMultiplier) {
          ret = alchemicalIngredients.value.mutagens[mutagen].metadata.oppositeDurationMultiplier
        }
      })
      return ret
    }

    function isOpposite() {
      mutagens.value.forEach((mutagen) => {
        if (alchemicalIngredients.value.mutagens[mutagen].metadata.causeOpposite) {
          return true
        }
      })
      return false
    }
    const description = computed(() => {
      let ret = ''
      let dMul = durationMultiplier()
      let dts = hasDamageToSuffering()
      let hts = false

      const oppositie = isOpposite()
      if (oppositie) {
        dMul = oppositeDurationMultiplier()
        if (dts) hts = true
        dts = false
      }
      if (alchemicalIngredients.value.bases[base.value].metadata['to-hit']) {
        ret += 'Make a to hit roll, on hit the following effects apply... \n'
      } else if (alchemicalIngredients.value.bases[base.value].metadata.area === 'Single Weapon') {
        ret +=
          'Targets struck with a weapon lathered in this potion have the following applied on hit... \n'
      } else {
        ret +=
          ' Targets may make a HEA save of ' +
          difficultyScore.value +
          ', on failure the following effects apply... \n'
      }
      if (alchemicalIngredients.value.reagents[reagent.value]?.metadata.heal) {
        if (hts) {
          ret +=
            ' Affected target(s) have ' +
            alchemicalIngredients.value.reagents[reagent.value]?.metadata.heal.split('d')[0] +
            ' stack(s) of healing suffering applied. '
        } else {
          ret +=
            ' Affected target(s) heal ' +
            alchemicalIngredients.value.reagents[reagent.value]?.metadata.heal +
            '. '
        }
      } else if (alchemicalIngredients.value.reagents[reagent.value]?.metadata.overheal) {
        if (hts) {
          ret +=
            ' Affected target(s) have ' +
            alchemicalIngredients.value.reagents[reagent.value]?.metadata.heal.split('d')[0] +
            ' stack(s) of healing suffering applied and any excess healing is converted to an HP shield that lasts for the next minute (non stacking). '
        } else {
          ret +=
            ' Affected target(s) heal ' +
            alchemicalIngredients.value.reagents[reagent.value]?.metadata.overheal +
            ' and any excess is converted to an HP shield that lasts for the next minute. '
        }
      } else if (alchemicalIngredients.value.reagents[reagent.value]?.metadata.damage) {
        if (dts) {
          ret +=
            ' Affected target(s) have ' +
            alchemicalIngredients.value.reagents[reagent.value]?.metadata.damage.split('d')[0] +
            damageType.value +
            ' stack(s) of suffering applied. '
        } else {
          ret +=
            ' Affected target(s) take ' +
            alchemicalIngredients.value.reagents[reagent.value]?.metadata.damage +
            damageType.value +
            ' damage. '
        }
      } else if (alchemicalIngredients.value.reagents[reagent.value]?.metadata.manaGain) {
        ret +=
          ' Affected Target(s) regain ' +
          alchemicalIngredients.value.reagents[reagent.value]?.metadata.manaGain +
          ' mana. '
      } else if (alchemicalIngredients.value.reagents[reagent.value]?.metadata.manaDrain) {
        ret +=
          ' Affected Target(s) lose ' +
          alchemicalIngredients.value.reagents[reagent.value]?.metadata.manaDrain +
          ' mana. '
      }
      sortedGroupedEffects.value.forEach((element) => {
        let num = 0
        if (element.duration === 'instantaneous') {
          if (reagent.value)
            ret += ' Additionally, ' + getMutagenGroupingDescription(element.ingredients, oppositie)
          else {
            if (num === 0) {
              ret += '\n'
              num++
              let val = getMutagenGroupingDescription(element.ingredients, oppositie)
              ret += val.charAt(0).toUpperCase() + val.slice(1) + '\n'
            } else {
              ret += getMutagenGroupingDescription(element.ingredients, oppositie) + '\n'
            }
          }
        } else {
          if (num === 0) {
            ret += '\n'
            num++
          }
          if (typeof dMul != 'number') {
            ret +=
              'The following effects apply for a ' +
              element.duration +
              ' amount of time' +
              ': ' +
              getMutagenGroupingDescription(element.ingredients, oppositie) +
              '\n'
          } else {
            if (element.duration) {
              ret +=
                'The following effects apply for ' +
                getMultipliedDuration(element.duration, dMul) +
                ': ' +
                getMutagenGroupingDescription(element.ingredients, oppositie) +
                '\n'
            }
          }
        }
      })
      if (damageType.value != ' toxic') {
        if (damageType.value.length > 1) {
          ret +=
            '\n\n Note that this potion alters damage type: ' +
            damageType.value +
            ' These change the damage type of a potion, and base weapon damage if lathered. If there are multiple types, the type is chosen at the time of creation.'
        }
      }
      return ret
    })
    function getMultipliedDuration(duration, multiplier) {
      if (duration === 'instantaneous') {
        return multiplier + ' rounds'
      }
      let num = parseInt(duration) * multiplier
      return num + ' ' + duration.split(' ')[1]
    }

    function getMutagenGroupingDescription(mutagens, isOpposite) {
      let ret = ''
      mutagens.forEach((mutagen) => {
        if (isOpposite) {
          ret += mutagen.metadata.opposite + ' AND '
        } else if (mutagen.metadata.useEffects) ret += mutagen.effects + ' AND '
        else if (mutagen.metadata.bonusDvs) {
          ret += 'the target gains ' + mutagen.metadata.bonusDvs + ' Bonus Dvs AND '
        } else if (mutagen.metadata.applyStatus) {
          ret += 'the target becomes ' + mutagen.metadata.applyStatus + ' AND '
        }
      })
      return ret.substring(0, ret.length - 5) + '.'
    }

    const target = computed(() => {
      return alchemicalIngredients.value.bases[base.value].metadata.target
    })

    const area = computed(() => {
      return alchemicalIngredients.value.bases[base.value].metadata.area
    })
    const difficultyScore = computed(() => {
      let mutagenScore =
        mutagens.value.reduce(
          (acc, x) => acc + alchemicalIngredients.value.mutagens[x]?.difficulty || 0,
          0
        ) || 0
      let ret =
        10 +
        alchemicalIngredients.value.bases[base.value].difficulty +
        (alchemicalIngredients.value.reagents[reagent.value]?.difficulty || 0) +
        mutagenScore

      return ret
    })

    const resistance = computed(() => {
      if (
        (alchemicalIngredients.value.bases[base.value].metadata.target === 'Thrown' &&
          alchemicalIngredients.value.bases[base.value].metadata.area === 'Single Target') ||
        alchemicalIngredients.value.bases[base.value].metadata.area === 'Single Weapon'
      ) {
        return 'N/A'
      } else return difficultyScore.value + ' HEA Save'
    })
    const actionCost = ref('Swift Action')
    const type = ref('Consumable')

    function amountOfIngredient(ingredient) {
      const ingredients = Object.values(equipmentStore.equipment.items.Ingredient) as Array<Item>
      let count = ingredients.reduce(
        (acc, item) => (item.name === ingredient ? acc + item.count : acc),
        0
      )
      return count
    }

    const basesOptions = computed(() => {
      return Object.values(alchemicalIngredients.value.bases)
        .map((ingredient: any) => {
          return {
            name: ingredient.name + ' (' + ingredient.difficulty + ')',
            value: ingredient.name,
            icon: ingredient.icon,
            description: ingredient.effects,
            disabled: ignoreSkillUnlocks.value ? false : alchemyRank.value < ingredient.difficulty,
            disabledMessage: 'Unlocks at rank ' + ingredient.difficulty,
            number: amountOfIngredient(ingredient.name),
            difficulty: ingredient.difficulty
          }
        })
        .sort((a, b) => {
          if (a.difficulty < b.difficulty) return -1
          if (b.difficulty < a.difficulty) return 1
          if (a.disabled && b.disabled) return a.name.localeCompare(b.name)
          else if (a.disabled) return 1
          else if (b.disabled) return -1
          return a.name.localeCompare(b.name)
        })
    })

    const reagentsOptions = computed(() => {
      return [
        {
          name: 'No Reagent',
          value: '',
          icon: 'gi-cancel',
          description: 'No Reagent',
          disabled: false,
          number: -1,
          difficulty: ''
        }
      ].concat(
        Object.values(alchemicalIngredients.value.reagents)
          .map((ingredient: any) => {
            return {
              name: ingredient.name + ' (' + ingredient.difficulty + ')',
              value: ingredient.name,
              icon: ingredient.icon,
              description: ingredient.effects,
              disabled: ignoreSkillUnlocks.value
                ? false
                : alchemyRank.value < ingredient.difficulty,
              number: amountOfIngredient(ingredient.name),
              difficulty: ingredient.difficulty
            }
          })
          .sort((a, b) => {
            if (a.difficulty < b.difficulty) return -1
            if (b.difficulty < a.difficulty) return 1
            if (a.disabled && b.disabled) return a.name.localeCompare(b.name)
            else if (a.disabled) return 1
            else if (b.disabled) return -1
            return a.name.localeCompare(b.name)
          })
      )
    })

    const mutagensOptions = computed(() => {
      return Object.values(alchemicalIngredients.value.mutagens)
        .map((ingredient: any) => {
          return {
            name: ingredient.name + ' (' + ingredient.difficulty + ')',
            value: ingredient.name,
            icon: ingredient.icon,
            description: ingredient.effects,
            disabled: ignoreSkillUnlocks.value ? false : alchemyRank.value < ingredient.difficulty,
            number: amountOfIngredient(ingredient.name),
            difficulty: ingredient.difficulty
          }
        })
        .sort((a, b) => {
          if (a.difficulty < b.difficulty) return -1
          if (b.difficulty < a.difficulty) return 1
          if (a.disabled && b.disabled) return a.name.localeCompare(b.name)
          else if (a.disabled) return 1
          else if (b.disabled) return -1
          return a.name.localeCompare(b.name)
        })
    })
    const showBaseModal = ref(false)
    const showReagentModal = ref(false)
    const showMutagenModal = ref(false)
    const base = ref('Water')
    const reagent = ref('')
    const mutagens: Ref<string[]> = ref([])
    function updateBase(newBase) {
      base.value = newBase
      showBaseModal.value = false
      isHidden.value = false
    }
    function updateReagent(newReagent) {
      if (reagent.value === newReagent) {
        reagent.value = ''
      } else {
        reagent.value = newReagent
      }
      isHidden.value = false
      showReagentModal.value = false
    }
    function updateMutagens(newMutagen) {
      if (mutagens.value.includes(newMutagen)) {
        mutagens.value = mutagens.value.filter((a) => a !== newMutagen)
      } else {
        mutagens.value.push(newMutagen)
      }
    }
    const editMode = ref(false)
    const abilityEdits = ref({
      target: '',
      duration: '',
      area: '',
      actionCost: '',
      type: '',
      resistance: '',
      description: '',
      name: ''
    })
    const name = ref('Generated Potion')
    function clearAll() {
      abilityEdits.value = {
        target: '',
        duration: '',
        area: '',
        actionCost: '',
        type: '',
        resistance: '',
        description: '',
        name: ''
      }
      reagent.value = ''
      base.value = 'Water'
      mutagens.value = []
    }
    function revert() {
      abilityEdits.value = {
        target: '',
        duration: '',
        area: '',
        actionCost: '',
        type: '',
        resistance: '',
        description: '',
        name: ''
      }
      editMode.value = false
    }
    function switchEditMode() {
      abilityEdits.value.target = abilityEdits.value.target || target.value
      abilityEdits.value.duration = abilityEdits.value.duration || duration.value
      abilityEdits.value.area = abilityEdits.value.area || area.value
      abilityEdits.value.actionCost = abilityEdits.value.actionCost || actionCost.value
      abilityEdits.value.type = abilityEdits.value.type || type.value
      abilityEdits.value.name = abilityEdits.value.name || computedName.value
      abilityEdits.value.description = abilityEdits.value.description || description.value
      abilityEdits.value.resistance = abilityEdits.value.resistance || resistance.value
      editMode.value = true
    }

    function dispatchMakePotion() {
      makePotionModal.value = true
    }
    const hasSameIngredients = computed(() => {
      let ingredients = indegredientList.value.filter((a) => a != '')
      if (props.adventureMode) {
        let arr1 = [...ingredients].sort()
        let arr2 = [
          ...(useAdventureStore().equipment.items.Potion[
            abilityEdits.value.name || computedName.value
          ]?.ingredients || [])
        ].sort()
        console.log(arr1, arr2)
        if (arr1.length != arr2.length) {
          return false
        } else {
          for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
              return false
            }
          }
        }
        return countPotionInAdventure.value > 0 && true
      }
      return false
    })
    const countPotionInAdventure = computed(() => {
      if (props.adventureMode) {
        return useAdventureStore().equipment.items.Potion[
          abilityEdits.value.name || computedName.value
        ]
          ? useAdventureStore().equipment.items.Potion[
              abilityEdits.value.name || computedName.value
            ].count
          : 0
      } else {
        return false
      }
    })
    function addPotionToAdventure() {
      let newCount = parseInt(count.value + '')
      if (countPotionInAdventure.value) {
        newCount =
          useAdventureStore().equipment.items.Potion[abilityEdits.value.name || computedName.value]
            .count + newCount
      }
      let ingredients = indegredientList.value.filter((a) => a != '')

      let newPotion: Potion = {
        name: abilityEdits.value.name || computedName.value,
        count: newCount,
        description: 'Potion containing the ingredients ' + ingredients,
        type: 'Potion',
        holder: '',
        holderType: '',
        isAttuneable: false,
        isAttuned: false,
        equippedStats: {
          ability: { name: '' },
          passives: {},
          material: '',
          enchantments: {},
          technicalAddons: {},
          materialCoverings: {}
        },
        ingredients: ingredients,
        ability: {
          name: abilityEdits.value.name || computedName.value,
          area: abilityEdits.value.area || area.value,
          duration: abilityEdits.value.duration || duration.value,
          target: abilityEdits.value.target || target.value,
          resistance: abilityEdits.value.resistance || resistance.value,
          cost: 'Consumable',
          description: abilityEdits.value.description || description.value,
          groupIcon: 'gi-standing-potion',
          rank: '',
          actionCost: abilityEdits.value.actionCost || actionCost.value,
          type: abilityEdits.value.type || type.value
        }
      }
      useAdventureStore().addItem(newPotion)
      context.emit('closeModal')
    }
    const count = ref(1)
    const buyPotionModal = ref(false)
    const makePotionModal = ref(false)
    function dispatchBuyPotion() {
      buyPotionModal.value = true
    }
    function closeAndClear() {
      buyPotionModal.value = false
      clearAll()
      context.emit('closeModal')
    }
    return {
      stagedItem,
      designStore,
      indegredientList,
      basesOptions,
      props,
      showBaseModal,
      showMutagenModal,
      showReagentModal,
      reagentsOptions,
      mutagensOptions,
      updateBase,
      difficultyScore,
      updateReagent,
      updateMutagens,
      context,
      dispatchMakePotion,
      alchemicalIngredients,
      addPotionToAdventure,
      base,
      count,
      reagent,
      mutagens,
      target,
      area,
      description,
      groupedEffects,
      sortedGroupedEffects,
      resistance,
      editMode,
      switchEditMode,
      abilityEdits,
      name,
      revert,
      duration,
      actionCost,
      type,
      ignoreSkillUnlocks,
      dispatchBuyPotion,
      buyPotionModal,
      computedName,
      damageType,
      clearAll,
      closeAndClear,
      makePotionModal,
      isHidden,
      hasSameIngredients,
      countPotionInAdventure
    }
  },
  components: {
    BButton,
    CustomModal,
    GridSelect,
    IconDisplay,
    TitleMedallion,
    AbilityDisplay,
    EditAbility,
    CustomCheckbox,
    BuyPotionModal,
    MakePotionWithSkill,
    BasicInput
    // TitleWidget
  }
}
</script>

<template>
  <div>
    <CustomModal
      :is-hidden="isHidden"
      :showModal="props.showModal"
      title="Brew Potion"
      @close="context.emit('closeModal')"
    >
      <template v-slot:body>
        <div>
          <div>
            <div
              v-if="!props.adventureMode"
              style="display: flex; padding: 0.5rem; justify-content: flex-end; font-size: small"
              :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >
              <div>Ignore Skill Unlocks</div>
              <div style="width: 3rem">
                <CustomCheckbox
                  style="
                    margin-top: -0.65rem;
                    padding-left: 1rem;
                    transform: scale(0.75, 0.75);
                    height: 2rem;
                  "
                  :is-checked="ignoreSkillUnlocks"
                  @true="() => (ignoreSkillUnlocks = true)"
                  @false="() => (ignoreSkillUnlocks = false)"
                ></CustomCheckbox>
              </div>
            </div>
            <div class="basesAndReagents">
              <div
                style="flex-grow: 1; padding: 0.5rem; border: 1px solid; width: 50%"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText,
                  borderColor: designStore.secondaryTheme
                }"
              >
                <TitleMedallion title="Base"></TitleMedallion>
                <div
                  style="display: flex; padding-left: 1rem; padding-right: 1rem"
                  @click="((showBaseModal = true), (isHidden = true))"
                >
                  <div
                    style="
                      display: flex;
                      justify-content: center;
                      flex-direction: column;
                      min-width: 6rem;
                    "
                  >
                    <IconDisplay
                      style="align-self: center"
                      scale="3"
                      :icon="alchemicalIngredients.bases[base].icon"
                    ></IconDisplay>
                    <div style="align-self: center; text-wrap-style: balance; text-align: center">
                      {{
                        alchemicalIngredients.bases[base].name +
                        ' (' +
                        alchemicalIngredients.bases[base].difficulty +
                        ')'
                      }}
                    </div>
                  </div>
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      margin-left: 0.5rem;
                    "
                  >
                    {{ alchemicalIngredients.bases[base].effects }}
                  </div>
                </div>
              </div>
              <div
                style="flex-grow: 1; padding: 0.5rem; border: 1px solid; width: 50%"
                :style="{
                  background: designStore.sidebarBacking,
                  color: designStore.sidebarText,
                  borderColor: designStore.secondaryTheme
                }"
              >
                <TitleMedallion title="Reagent"></TitleMedallion>
                <div
                  style="display: flex; padding-left: 1rem; padding-right: 1rem"
                  @click="((showReagentModal = true), (isHidden = true))"
                >
                  <div style="display: flex; justify-content: center; flex-direction: column">
                    <IconDisplay
                      style="align-self: center"
                      scale="3"
                      :icon="alchemicalIngredients.reagents[reagent]?.icon || 'gi-cancel'"
                    ></IconDisplay>
                    <div
                      style="
                        align-self: center;
                        text-wrap-style: balance;
                        text-align: center;
                        min-width: 6rem;
                      "
                    >
                      {{
                        (alchemicalIngredients.reagents[reagent]?.name || 'None') +
                        (alchemicalIngredients.reagents[reagent]?.name
                          ? ' (' + alchemicalIngredients.reagents[reagent].difficulty + ')'
                          : '')
                      }}
                    </div>
                  </div>
                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      margin-left: 0.5rem;
                    "
                  >
                    {{ alchemicalIngredients.reagents[reagent]?.effects || 'No Reagent selected' }}
                  </div>
                </div>
              </div>
            </div>
            <div @click="showMutagenModal = true">
              <TitleMedallion
                style="margin-top: 1rem"
                :color="designStore.primaryText"
                title="Mutagens"
                :button-icon="'gi-spanner'"
                :button-function="() => (showMutagenModal = true)"
                ><template v-slot:dropdown>
                  <BButton
                    @click="showMutagenModal = true"
                    style="
                      margin-bottom: 0;
                      margin-top: -0.25rem;
                      font-size: large;
                      display: flex;
                      border: 1px solid;
                    "
                    :style="{
                      background: designStore.primaryTheme,
                      color: designStore.primaryText,
                      borderColor: designStore.secondaryTheme
                    }"
                    >Manage<IconDisplay
                      style="padding-left: 0.25rem"
                      icon="gi-spanner"
                    ></IconDisplay
                  ></BButton> </template
              ></TitleMedallion>
              <div class="mutagens">
                <div
                  v-for="mutagen in mutagens"
                  :key="mutagen"
                  style="display: grid; padding: 0.25rem; grid-template-columns: 1fr 3fr"
                >
                  <div style="display: flex; justify-content: center; flex-direction: column">
                    <IconDisplay
                      scale="3"
                      style="align-self: center"
                      :icon="alchemicalIngredients.mutagens[mutagen]?.icon"
                    ></IconDisplay>
                    <div
                      style="
                        align-self: center;
                        text-wrap-style: balance;
                        text-align: center;
                        min-width: 6rem;
                      "
                    >
                      {{
                        alchemicalIngredients.mutagens[mutagen]?.name +
                        ' (' +
                        alchemicalIngredients.mutagens[mutagen]?.difficulty +
                        ')'
                      }}
                    </div>
                  </div>

                  <div
                    style="
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      margin-left: 0.5rem;
                    "
                  >
                    {{ alchemicalIngredients.mutagens[mutagen]?.effects || 'No Reagent selected' }}
                  </div>
                </div>
                <div
                  v-if="mutagens.length === 0"
                  style="padding-left: 1.5rem; padding-bottom: 1.5rem"
                >
                  No Mutagens Added
                </div>
              </div>
            </div>
          </div>
          <BButton
            v-if="!editMode"
            @click="switchEditMode()"
            style="position: absolute; right: 2rem; border: 1px solid; z-index: 3; margin-top: 1rem"
            :style="{
              borderColor: designStore.secondaryTheme,
              background: designStore.primaryTheme
            }"
          >
            Edit <i class="bi-pen"></i>
          </BButton>

          <TitleMedallion
            :color="designStore.primaryText"
            :title="abilityEdits.name || computedName"
          ></TitleMedallion>
          <div
            v-if="abilityEdits.target || abilityEdits.actionCost"
            :style="{ color: designStore.alertTheme }"
            style="position: absolute; margin-top: -1rem; margin-left: 3rem; font-size: small"
          >
            Re-Generation disabled by Edit
          </div>
          <AbilityDisplay
            v-if="!editMode"
            style="margin-top: 2rem"
            :description="abilityEdits.description || description"
            :area="abilityEdits.area || area"
            :action-cost="abilityEdits.actionCost || actionCost"
            :duration="abilityEdits.duration || duration"
            :medallion="'gi-standing-potion'"
            :target="abilityEdits.target || target"
            :resistance="abilityEdits.resistance || resistance"
            :type="abilityEdits.type || type"
            :title="abilityEdits.name || name"
          ></AbilityDisplay>
          <EditAbility
            @edited="(val) => (abilityEdits = val)"
            :showRank="false"
            v-else
            :type-prop="abilityEdits.type"
            :resistance-prop="abilityEdits.resistance"
            :action-cost-prop="abilityEdits.actionCost"
            :area-prop="abilityEdits.area"
            :description-prop="abilityEdits.description"
            :target-prop="abilityEdits.target"
            :duration-prop="abilityEdits.duration"
            :name-prop="abilityEdits.name"
            :revertFunction="revert"
            :buttonFunction="
              () => {
                editMode = false
              }
            "
          ></EditAbility>
        </div>
      </template>
      <template v-slot:footer>
        <div
          v-if="hasSameIngredients"
          :style="{ color: designStore.alertTheme }"
          style="margin-right: 0.5rem"
        >
          Matching Potion Detected
        </div>
        <BButton
          v-if="!props.adventureMode"
          style="border: 1px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="(dispatchMakePotion(), (isHidden = true))"
          >Brew Potion ({{ difficultyScore }} Alchemy Check)</BButton
        >
        <BButton
          v-if="!props.adventureMode"
          style="border: 1px solid; margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="(dispatchBuyPotion(), (isHidden = true))"
          >Buy Potion</BButton
        >
        <BasicInput
          v-if="props.adventureMode"
          label="Amount to Add"
          :value="count"
          type="number"
        ></BasicInput>
        <BButton
          @click="addPotionToAdventure()"
          v-if="props.adventureMode"
          :disabled="countPotionInAdventure && !hasSameIngredients"
          style="border: 1px solid; margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          >Add {{ hasSameIngredients ? ' to Existing ' : '' }} Potion(s)
        </BButton>
        <BButton
          style="border: 1px solid; margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="(clearAll(), context.emit('closeModal'))"
          >Cancel and Discard</BButton
        >
      </template>
    </CustomModal>
    <CustomModal
      :showModal="showBaseModal"
      title="Select Base"
      @close="((showBaseModal = false), (isHidden = false))"
    >
      <template v-slot:body>
        <GridSelect
          :options="basesOptions"
          :update-option="updateBase"
          :selected="base"
          :use-disabled-message="true"
        ></GridSelect
      ></template>
      <template v-slot:footer>Difficulty Score: {{ difficultyScore }} </template>
    </CustomModal>
    <CustomModal
      :showModal="showReagentModal"
      title="Select up to one Reagent"
      @close="((showReagentModal = false), (isHidden = false))"
    >
      <template v-slot:body>
        <GridSelect
          :selected="reagent"
          :options="reagentsOptions"
          :update-option="updateReagent"
        ></GridSelect
      ></template>
      <template v-slot:footer>Difficulty Score: {{ difficultyScore }} </template>
    </CustomModal>
    <CustomModal
      :showModal="showMutagenModal"
      title="Select Mutagens"
      @close="((showMutagenModal = false), (isHidden = false))"
    >
      <template v-slot:body>
        <GridSelect
          :options="mutagensOptions"
          :selected="mutagens"
          :update-option="updateMutagens"
          :multiSelect="true"
        ></GridSelect
      ></template>
      <template v-slot:footer>Difficulty Score: {{ difficultyScore }} </template>
    </CustomModal>

    <MakePotionWithSkill
      :modifyIsHidden="(val) => (isHidden = val)"
      :close-and-clear-brew="closeAndClear"
      :ability="{
        name: abilityEdits.name || computedName,
        area: abilityEdits.area || area,
        duration: abilityEdits.duration || duration,
        target: abilityEdits.target || target,
        resistance: abilityEdits.resistance || resistance,
        cost: 'Consumable',
        description: abilityEdits.description || description,
        groupIcon: 'gi-standing-potion',
        rank: '',
        actionCost: abilityEdits.actionCost || actionCost,
        type: abilityEdits.type || type
      }"
      :name="abilityEdits.name || computedName"
      :difficulty="difficultyScore"
      :ingredients="indegredientList.filter((a) => a != '')"
      :showModal="makePotionModal"
      @closeModal="makePotionModal = false"
    ></MakePotionWithSkill>
    <BuyPotionModal
      :modifyIsHidden="(val) => (isHidden = val)"
      :close-and-clear-brew="closeAndClear"
      :ability="{
        name: abilityEdits.name || computedName,
        area: abilityEdits.area || area,
        duration: abilityEdits.duration || duration,
        target: abilityEdits.target || target,
        resistance: abilityEdits.resistance || resistance,
        cost: 'Consumable',
        description: abilityEdits.description || description,
        groupIcon: 'gi-standing-potion',
        rank: '',
        actionCost: abilityEdits.actionCost || actionCost,
        type: abilityEdits.type || type
      }"
      :name="abilityEdits.name || computedName"
      :ingredients="indegredientList.filter((a) => a != '')"
      :showModal="buyPotionModal"
      @closeModal="buyPotionModal = false"
    ></BuyPotionModal>
  </div>
</template>

<style>
.mutagens {
  display: grid;

  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 900px) {
  .basesAndReagents {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
  .mutagens {
    display: flex;
    flex-direction: column;
  }
}

.basesAndReagents {
  display: flex;

  flex-direction: row;
}
</style>
