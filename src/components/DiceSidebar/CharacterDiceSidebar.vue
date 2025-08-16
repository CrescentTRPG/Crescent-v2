<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore'
import { useDesignStore } from '@/stores/designStore'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import DiceSidebar from './DiceSidebar.vue'
export default {
  setup(props, context) {
    let designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const statusEffectsStore = useStatusEffectStore()
    function emitRolled(roll) {
      context.emit('rolled', roll)
    }
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
          exceptionalVal: getWillpowerExceptionals.value - getWillpowerInferiors.value,
          modifiers: [],
          name: 'willpower',
          modifier: getWillpower.value
        },
        health: {
          placed: getHealthInferiors.value * -1 + getHealthPlaced.value,
          exceptionalVal: gethealthExceptionals.value - getHealthInferiors.value,
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

    function clearHistory() {
      statusEffectsStore.clearDiceHistory()
    }

    return {
      clearHistory,

      designStore,
      navPos,
      attributes,
      attrs,
      emitRolled,
      diceRollHistory
    }
  },
  components: {
    DiceSidebar
  },
  computed: {}
}
</script>
<template>
  <DiceSidebar
    :attrs="attrs"
    @rolled="
      (rollObj) => {
        emitRolled(rollObj)
      }
    "
  ></DiceSidebar>
</template>
<style scoped></style>
