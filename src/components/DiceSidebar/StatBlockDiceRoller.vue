<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import DiceSidebar from './DiceSidebar.vue'
import { useSkillStore } from '@/stores/skillsStore'
export default {
  props: ['currentStatBlock'],
  setup(props, context) {
    let designStore = useDesignStore()
    const statusEffectsStore = useStatusEffectStore()
    function emitRolled(roll) {
      context.emit('rolled', roll)
    }

    function getExceptionals(type) {
      const baseExceptionalVal = parseInt('' + props.currentStatBlock.exceptionals[type])
      let max = 0

      const arr = Object.values(
        props.currentStatBlock.attributeStatusModifiers[type]['Add Exceptional(s)'] || {}
      )
      if (arr) {
        max += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal >= 0 ? baseExceptionalVal + max : max
    }
    function getInferiors(type) {
      let mod = 0

      const baseExceptionalVal = parseInt('' + props.currentStatBlock.exceptionals[type])

      const arr = Object.values(
        props.currentStatBlock.attributeStatusModifiers[type]['Add Inferior(s)'] || {}
      )
      if (arr) {
        mod += arr.reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
      }
      return baseExceptionalVal <= 0 ? (baseExceptionalVal - mod) * -1 : mod
    }

    function getPlaced(attribute) {
      let placed = 0

      if (props.currentStatBlock.diceStatusModifiers[attribute]) {
        if (props.currentStatBlock.diceStatusModifiers[attribute]['Override Placed Rolls']) {
          const max = Object.values(
            props.currentStatBlock.diceStatusModifiers[attribute]['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
        if (props.currentStatBlock.diceStatusModifiers[attribute]['Modify Placed Rolls']) {
          const max = Object.values(
            props.currentStatBlock.diceStatusModifiers[attribute]['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          if (max != -1000) {
            placed += max
          }
        }
      }
      if (
        (attribute === 'intelligence' || attribute === 'perception') &&
        props.currentStatBlock.statusEffects['Befuddled']
      ) {
        placed -= 1
      }
      if (attribute === 'agility' && props.currentStatBlock.statusEffects['Prone']) {
        placed -= 1
      }
      if (attribute === 'perception' && props.currentStatBlock.statusEffects['Blinded']) {
        placed -= 2
      }
      if (attribute === 'agility' && props.currentStatBlock.statusEffects['Pinned']) {
        return Math.min(placed, 0) - 2
      }
      if (
        (attribute === 'willpower' ||
          attribute === 'strength' ||
          attribute === 'health' ||
          attribute === 'agility') &&
        props.currentStatBlock.statusEffects['Stunned']
      )
        placed -= 1

      if (props.currentStatBlock.statusEffects['Fatigued']) {
        placed -= props.currentStatBlock.statusEffects['Fatigued'].rank
      }
      if (props.currentStatBlock.statusEffects['Sickened']) placed -= 1

      return placed
    }

    const attributes: ComputedRef<any> = computed(() => {
      let ret = {
        strength: {
          placed: getInferiors('strength') * -1 + getPlaced('strength'),
          exceptionalVal: getExceptionals('strength') - getInferiors('strength'),
          modifiers: [],
          name: 'strength',
          modifier: parseInt(props.currentStatBlock.attributes.strength + '')
        },
        agility: {
          placed: getInferiors('agility') * -1 + getPlaced('agility'),
          exceptionalVal: getExceptionals('agility') - getInferiors('agility'),
          modifiers: [],
          name: 'agility',
          modifier: parseInt(props.currentStatBlock.attributes.agility + '')
        },
        perception: {
          placed: getInferiors('perception') * -1 + getPlaced('perception'),
          exceptionalVal: getExceptionals('perception') - getInferiors('perception'),
          modifiers: [],
          name: 'perception',
          modifier: parseInt(props.currentStatBlock.attributes.perception + '')
        },
        willpower: {
          placed: getInferiors('willpower') * -1 + getPlaced('willpower'),
          exceptionalVal: getExceptionals('willpower') - getInferiors('willpower'),
          modifiers: [],
          name: 'willpower',
          modifier: parseInt(props.currentStatBlock.attributes.willpower + '')
        },
        health: {
          placed: getInferiors('health') * -1 + getPlaced('health'),
          exceptionalVal: getExceptionals('health') - getInferiors('health'),
          modifiers: [],
          name: 'health',
          modifier: parseInt(props.currentStatBlock.attributes.health + '')
        },
        intelligence: {
          placed: getInferiors('intelligence') * -1 + getPlaced('intelligence'),
          exceptionalVal: getExceptionals('intelligence') - getInferiors('intelligence'),
          modifiers: [],
          name: 'intelligence',
          modifier: parseInt(props.currentStatBlock.attributes.intelligence + '')
        },
        power: {
          exceptionalVal: getExceptionals('power') - getInferiors('power'),
          placed: getInferiors('power') * -1 + getPlaced('power'),
          modifiers: [],
          name: 'power',
          modifier: parseInt(props.currentStatBlock.attributes.power + '')
        },
        charisma: {
          exceptionalVal: getExceptionals('charisma') - getInferiors('charisma'),
          placed: getInferiors('charisma') * -1 + getPlaced('Charisma'),
          modifiers: [],
          name: 'charisma',
          modifier: parseInt(props.currentStatBlock.attributes.charisma + '')
        }
      }

      return ret
    })

    const attrs: ComputedRef<any> = computed(() => {
      let skills = getSkills()
      return { ...attributes.value, ...skills }
    })
    function getSkills() {
      const ret = {}
      const skillStore = useSkillStore()

      skillStore.getAllSkills.forEach((skill) => {
        const skillName = skill.skill
        const attribute = skill.attribute.toLowerCase()
        let placed = 0
        let inferior = 0
        let mod = props.currentStatBlock.skills[skillName]?.rank || 0
        mod += Math.floor(attributes?.value[attribute].modifier / 2) || 0
        inferior += getInferiors(attribute)

        placed += props.currentStatBlock.skills[skillName]?.isOrigin ? 1 : 0 || 0
        placed -= inferior
        if (props.currentStatBlock.diceStatusModifiers[skillName]) {
          if (props.currentStatBlock.diceStatusModifiers[skillName]['Override Placed Rolls']) {
            const max = Object.values(
              props.currentStatBlock.diceStatusModifiers[skillName]['Override Placed Rolls']
            ).reduce(
              (acc: number, mod: any) =>
                parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
              -1000
            )
            if (max != -1000) {
              placed += max
            }
          }
          if (props.currentStatBlock.diceStatusModifiers[skillName]['Modify Placed Rolls']) {
            const max = Object.values(
              props.currentStatBlock.diceStatusModifiers[skillName]['Modify Placed Rolls']
            ).reduce(
              (acc: number, mod: any) =>
                parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
              -1000
            )
            if (max != -1000) {
              placed += max
            }
          }
        }

        // placed += useprops.currentStatBlock().archetype === 'augur' ? 1 : 0

        if (props.currentStatBlock.statusEffects['Sickened']) placed -= 1

        if (skill.skill === 'Subtlety' && props.currentStatBlock.statusEffects['Invisible']) {
          placed += 2
        }
        ret[skill.skill] = {
          name: skill.skill,
          modifier: mod,
          placed: placed,
          attribute: skill.attribute
        }
      })
      return ret
    }

    function clearHistory() {
      statusEffectsStore.clearDiceHistory()
    }
    return {
      attrs,
      emitRolled,
      props
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
    :rollAs="props.currentStatBlock.name"
    :attrs="attrs"
    @rolled="
      (rollObj) => {
        emitRolled(rollObj)
      }
    "
  ></DiceSidebar>
</template>
<style scoped></style>
