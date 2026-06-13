<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { useStatusEffectStore } from '@/stores/statusEffectStore.ts'
import { computed, ComputedRef } from 'vue'
import DiceSidebar from './DiceSidebar.vue'
export default {
  props: [
    'currentStatBlock',
    'omitRollingAs',
    'secondaryHandheldPassives',
    'wornArmorPassives',
    'primaryHandheldPassives'
  ],
  setup(props, context) {
    let designStore = useDesignStore()
    const statusEffectsStore = useStatusEffectStore()
    function emitRolled(roll) {
      context.emit('rolled', roll)
    }

    function getExceptionals(type) {
      let attr = type.substring(0, 1).toUpperCase() + type.substring(1)
      let execs = props.currentStatBlock.stressedExceptionals
        ? props.currentStatBlock.stressedExceptionals[attr] || {}
        : {}
      const spentExceptionals = Object.values(execs)
      let spentExceptionalCount = 0

      for (let i = 0; i < spentExceptionals.length; i++) {
        spentExceptionalCount += 1
      }
      let armorPassives = props.wornArmorPassives[
        'Add Exceptional(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Add Exceptional(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0

      let primaryPassives = props.primaryHandheldPassives[
        'Add Exceptional(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Add Exceptional(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0
      let secondaryPassives = props.secondaryHandheldPassives[
        'Add Exceptional(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Add Exceptional(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0

      const baseExceptionalVal =
        parseInt('' + props.currentStatBlock.exceptionals[type]) +
        armorPassives +
        primaryPassives +
        secondaryPassives

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
      return baseExceptionalVal >= 0
        ? baseExceptionalVal + max - spentExceptionalCount
        : max - spentExceptionalCount
    }
    function getInferiors(type) {
      let mod = 0
      let armorPassives = props.wornArmorPassives[
        'Add Inferior(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Add Inferior(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0

      let primaryPassives = props.primaryHandheldPassives[
        'Add Inferior(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Add Inferior(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0
      let secondaryPassives = props.secondaryHandheldPassives[
        'Add Inferior(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Add Inferior(s) ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0
      const baseExceptionalVal =
        parseInt('' + props.currentStatBlock.exceptionals[type]) -
        armorPassives -
        primaryPassives -
        secondaryPassives
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
      let armorPassives = props.wornArmorPassives[
        'Add Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Add Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
            ].modAmount
          )
        : 0
      let primaryPassives = props.primaryHandheldPassives[
        'Add Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Add Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
            ].modAmount
          )
        : 0
      let secondaryPassives = props.secondaryHandheldPassives[
        'Add Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Add Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
            ].modAmount
          )
        : 0
      const maxEquipPlaced = Math.max(primaryPassives, Math.max(armorPassives, secondaryPassives))

      armorPassives = props.wornArmorPassives[
        'Override Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Override Placed Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      primaryPassives = props.primaryHandheldPassives[
        'Override Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Override Placed Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      secondaryPassives = props.secondaryHandheldPassives[
        'Override Placed Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Override Placed Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      const maxEquipOverridePlaced = Math.max(
        primaryPassives,
        Math.max(armorPassives, secondaryPassives)
      )
      armorPassives = props.wornArmorPassives[
        'Add Displaced Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Add Displaced Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      primaryPassives = props.primaryHandheldPassives[
        'Add Displaced Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Add Displaced Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      secondaryPassives = props.secondaryHandheldPassives[
        'Add Displaced Rolls ' + attribute.substring(0, 1).toUpperCase() + attribute.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Add Displaced Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      const maxDisplacedEquip = Math.max(
        primaryPassives,
        Math.max(armorPassives, secondaryPassives)
      )
      armorPassives = props.wornArmorPassives[
        'Override Displaced Rolls ' +
          attribute.substring(0, 1).toUpperCase() +
          attribute.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Override Displaced Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      primaryPassives = props.primaryHandheldPassives[
        'Override Displaced Rolls ' +
          attribute.substring(0, 1).toUpperCase() +
          attribute.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Override Displaced Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      secondaryPassives = props.secondaryHandheldPassives[
        'Override Displaced Rolls ' +
          attribute.substring(0, 1).toUpperCase() +
          attribute.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Override Displaced Rolls ' +
                attribute.substring(0, 1).toUpperCase() +
                attribute.substring(1)
            ].modAmount
          )
        : 0
      const maxDisplacedOverrideEquip = Math.max(
        primaryPassives,
        Math.max(armorPassives, secondaryPassives)
      )
      if (props.currentStatBlock.diceStatusModifiers[attribute]) {
        if (props.currentStatBlock.diceStatusModifiers[attribute]['Override Placed Rolls']) {
          const max = Object.values(
            props.currentStatBlock.diceStatusModifiers[attribute]['Override Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          placed += Math.max(max, maxEquipOverridePlaced)
          placed -= maxDisplacedOverrideEquip
        }
        if (props.currentStatBlock.diceStatusModifiers[attribute]['Modify Placed Rolls']) {
          let max = Object.values(
            props.currentStatBlock.diceStatusModifiers[attribute]['Modify Placed Rolls']
          ).reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )
          max = Math.max(max, maxEquipPlaced)
          placed += max
          placed -= maxDisplacedEquip
        }
      } else {
        placed += maxEquipOverridePlaced
        placed -= maxDisplacedOverrideEquip
        placed += maxEquipPlaced
        placed -= maxDisplacedEquip
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
    function getAttrVal(type) {
      let ret = props.currentStatBlock.attributes[type]
      let armorPassives = props.wornArmorPassives[
        'Override Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Override Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0

      let primaryPassives = props.primaryHandheldPassives[
        'Override Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Override Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0
      let secondaryPassives = props.secondaryHandheldPassives[
        'Override Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Override Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0
      if (armorPassives || primaryPassives || secondaryPassives) {
        ret = Math.max(Math.max(armorPassives, secondaryPassives), primaryPassives)
      }
      armorPassives = props.wornArmorPassives[
        'Modify Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.wornArmorPassives[
              'Modify Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0

      primaryPassives = props.primaryHandheldPassives[
        'Modify Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.primaryHandheldPassives[
              'Modify Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0
      secondaryPassives = props.secondaryHandheldPassives[
        'Modify Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
      ]
        ? parseInt(
            props.secondaryHandheldPassives[
              'Modify Attribute ' + type.substring(0, 1).toUpperCase() + type.substring(1)
            ].modAmount
          )
        : 0
      return (ret += primaryPassives + secondaryPassives + armorPassives)
    }
    const attributes: ComputedRef<any> = computed(() => {
      let ret = {
        strength: {
          placed: getInferiors('strength') * -1 + getPlaced('strength'),
          exceptionalVal: getExceptionals('strength') - getInferiors('strength'),
          modifiers: [],
          name: 'strength',
          modifier: getAttrVal('strength')
        },
        agility: {
          placed: getInferiors('agility') * -1 + getPlaced('agility'),
          exceptionalVal: getExceptionals('agility') - getInferiors('agility'),
          modifiers: [],
          name: 'agility',
          modifier: getAttrVal('agility')
        },
        perception: {
          placed: getInferiors('perception') * -1 + getPlaced('perception'),
          exceptionalVal: getExceptionals('perception') - getInferiors('perception'),
          modifiers: [],
          name: 'perception',
          modifier: getAttrVal('perception')
        },
        willpower: {
          placed: getInferiors('willpower') * -1 + getPlaced('willpower'),
          exceptionalVal: getExceptionals('willpower') - getInferiors('willpower'),
          modifiers: [],
          name: 'willpower',
          modifier: getAttrVal('willpower')
        },
        health: {
          placed: getInferiors('health') * -1 + getPlaced('health'),
          exceptionalVal: getExceptionals('health') - getInferiors('health'),
          modifiers: [],
          name: 'health',
          modifier: getAttrVal('health')
        },
        intelligence: {
          placed: getInferiors('intelligence') * -1 + getPlaced('intelligence'),
          exceptionalVal: getExceptionals('intelligence') - getInferiors('intelligence'),
          modifiers: [],
          name: 'intelligence',
          modifier: getAttrVal('intelligence')
        },
        power: {
          exceptionalVal: getExceptionals('power') - getInferiors('power'),
          placed: getInferiors('power') * -1 + getPlaced('power'),
          modifiers: [],
          name: 'power',
          modifier: getAttrVal('power')
        },
        charisma: {
          exceptionalVal: getExceptionals('charisma') - getInferiors('charisma'),
          placed: getInferiors('charisma') * -1 + getPlaced('Charisma'),
          modifiers: [],
          name: 'charisma',
          modifier: getAttrVal('charisma')
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
        let armorPassives = props.wornArmorPassives[
          'Add Placed Rolls ' + skillName.substring(0, 1).toUpperCase() + skillName.substring(1)
        ]
          ? parseInt(
              props.wornArmorPassives[
                'Add Placed Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        let primaryPassives = props.primaryHandheldPassives[
          'Add Placed Rolls ' + skillName.substring(0, 1).toUpperCase() + skillName.substring(1)
        ]
          ? parseInt(
              props.primaryHandheldPassives[
                'Add Placed Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        let secondaryPassives = props.secondaryHandheldPassives[
          'Add Placed Rolls ' + skillName.substring(0, 1).toUpperCase() + skillName.substring(1)
        ]
          ? parseInt(
              props.secondaryHandheldPassives[
                'Add Placed Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        const maxEquipPlaced = Math.max(primaryPassives, Math.max(armorPassives, secondaryPassives))
        armorPassives = props.wornArmorPassives[
          'Override Placed Rolls ' +
            skillName.substring(0, 1).toUpperCase() +
            skillName.substring(1)
        ]
          ? parseInt(
              props.wornArmorPassives[
                'Override Placed Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        primaryPassives = props.primaryHandheldPassives[
          'Override Placed Rolls ' +
            skillName.substring(0, 1).toUpperCase() +
            skillName.substring(1)
        ]
          ? parseInt(
              props.primaryHandheldPassives[
                'Override Placed Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        secondaryPassives = props.secondaryHandheldPassives[
          'Override Placed Rolls ' +
            skillName.substring(0, 1).toUpperCase() +
            skillName.substring(1)
        ]
          ? parseInt(
              props.secondaryHandheldPassives[
                'Override Placed Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        const maxEquipOverridePlaced = Math.max(
          primaryPassives,
          Math.max(armorPassives, secondaryPassives)
        )
        armorPassives = props.wornArmorPassives[
          'Add Displaced Rolls ' + skillName.substring(0, 1).toUpperCase() + skillName.substring(1)
        ]
          ? parseInt(
              props.wornArmorPassives[
                'Add Displaced Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        primaryPassives = props.primaryHandheldPassives[
          'Add Displaced Rolls ' + skillName.substring(0, 1).toUpperCase() + skillName.substring(1)
        ]
          ? parseInt(
              props.primaryHandheldPassives[
                'Add Displaced Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        secondaryPassives = props.secondaryHandheldPassives[
          'Add Displaced Rolls ' + skillName.substring(0, 1).toUpperCase() + skillName.substring(1)
        ]
          ? parseInt(
              props.secondaryHandheldPassives[
                'Add Displaced Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        const maxDisplacedEquip = Math.max(
          primaryPassives,
          Math.max(armorPassives, secondaryPassives)
        )
        armorPassives = props.wornArmorPassives[
          'Override Displaced Rolls ' +
            skillName.substring(0, 1).toUpperCase() +
            skillName.substring(1)
        ]
          ? parseInt(
              props.wornArmorPassives[
                'Override Displaced Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        primaryPassives = props.primaryHandheldPassives[
          'Override Displaced Rolls ' +
            skillName.substring(0, 1).toUpperCase() +
            skillName.substring(1)
        ]
          ? parseInt(
              props.primaryHandheldPassives[
                'Override Displaced Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        secondaryPassives = props.secondaryHandheldPassives[
          'Override Displaced Rolls ' +
            skillName.substring(0, 1).toUpperCase() +
            skillName.substring(1)
        ]
          ? parseInt(
              props.secondaryHandheldPassives[
                'Override Displaced Rolls ' +
                  skillName.substring(0, 1).toUpperCase() +
                  skillName.substring(1)
              ].modAmount
            )
          : 0
        const maxDisplacedOverrideEquip = Math.max(
          primaryPassives,
          Math.max(armorPassives, secondaryPassives)
        )
        if (props.currentStatBlock.diceStatusModifiers[skillName]) {
          if (props.currentStatBlock.diceStatusModifiers[skillName]['Override Placed Rolls']) {
            let max = Object.values(
              props.currentStatBlock.diceStatusModifiers[skillName]['Override Placed Rolls']
            ).reduce(
              (acc: number, mod: any) =>
                parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
              -1000
            )
            max = Math.max(max, maxEquipOverridePlaced)
            placed += max
            placed -= maxDisplacedOverrideEquip
          }
          if (props.currentStatBlock.diceStatusModifiers[skillName]['Modify Placed Rolls']) {
            let max = Object.values(
              props.currentStatBlock.diceStatusModifiers[skillName]['Modify Placed Rolls']
            ).reduce(
              (acc: number, mod: any) =>
                parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
              -1000
            )
            max = Math.max(max, maxEquipPlaced)
            placed += max
            placed -= maxDisplacedEquip
          }
        } else {
          placed += maxEquipOverridePlaced
          placed -= maxDisplacedOverrideEquip
          placed += maxEquipPlaced
          placed -= maxDisplacedEquip
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
    :rollAs="props.omitRollingAs! && props.currentStatBlock.name"
    :attrs="attrs"
    @rolled="
      (rollObj) => {
        emitRolled(rollObj)
      }
    "
  ></DiceSidebar>
</template>
<style scoped></style>
