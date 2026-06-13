<script lang="ts">
import { computed, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import GridDiplayAttr from '@/components/Character/Overview/GridDiplayAttr.vue'
import { useUserStore } from '@/stores/userStore.ts'
import _ from 'lodash'

export default {
  props: [
    'currentStatBlock',
    'isEditing',
    'updateTemp',
    'removeAttributeStatusModifier',
    'wornArmorPassives',
    'secondaryHandheldPassives',
    'primaryHandheldPassives'
  ],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()

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

    function flipExceptional(index, newVal, attr) {
      let newTemp = _.cloneDeep(props.currentStatBlock)
      if (!newTemp.stressedExceptionals) {
        newTemp.stressedExceptionals = {}
      }

      if (newVal) {
        if (newTemp.stressedExceptionals[attr]) {
          newTemp.stressedExceptionals[attr][index] = { index: index, used: true }
        } else {
          newTemp.stressedExceptionals[attr] = {}
          newTemp.stressedExceptionals[attr][index] = { index: index, used: true }
        }
      } else {
        delete newTemp.stressedExceptionals[attr][index]
        console.log(newTemp.stressedExceptionals)
      }
      props.updateTemp(newTemp)
    }

    function addAttributeStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }

      const attribute = modifier.attribute.toLowerCase()
      const modRef = newTemp.attributeStatusModifiers[attribute][modifier.modifierType]
      const pos = modifier.modAmount + ' '
      newTemp.attributeStatusModifiers[attribute][modifier.modifierType] = {
        ...modRef,
        [pos]: modifier
      }
      if (modifier.linkedStatus) {
        newTemp.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'attribute, ' + attribute + ': ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      props.updateTemp(newTemp)
    }
    function update(attr, val) {
      let newTemp = { ...props.currentStatBlock }
      newTemp.attributes[attr] = val
      props.updateTemp(newTemp)
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
    const strUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Strength || {}
    })
    const agiUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Agility || {}
    })
    const heaUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Health || {}
    })
    const perUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Perception || {}
    })
    const powUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Power || {}
    })
    const intUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Intelligence || {}
    })
    const chaUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Charisma || {}
    })
    const wilUsed = computed(() => {
      return props.currentStatBlock.stressedExceptionals?.Willpower || {}
    })

    return {
      designStore,
      modal,
      userStore,
      getExceptionals,
      addAttributeStatusModifier,
      getInferiors,
      update,
      props,
      flipExceptional,
      strUsed,
      agiUsed,
      heaUsed,
      perUsed,
      powUsed,
      intUsed,
      chaUsed,
      wilUsed,
      getAttrVal
    }
  },
  components: { GridDiplayAttr }
}
</script>

<template>
  <div
    class="attributesCont"
    style="border-bottom: 3px solid"
    :style="{ background: designStore.inputBacking, borderColor: designStore.secondaryTheme }"
  >
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Strength"
      attr-shorthand="STR"
      :exceptionals="getExceptionals('strength')"
      :inferiors="getInferiors('strength')"
      :value="getAttrVal('strength')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      :use-exceptional="flipExceptional"
      :used-exceptionals="strUsed"
      @updateAttr="(val) => update('strength', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Agility"
      attr-shorthand="AGI"
      :exceptionals="getExceptionals('agility')"
      :inferiors="getInferiors('agility')"
      :value="getAttrVal('agility')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      :use-exceptional="flipExceptional"
      :used-exceptionals="agiUsed"
      @updateAttr="(val) => update('agility', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Health"
      attr-shorthand="HEA"
      :exceptionals="getExceptionals('health')"
      :inferiors="getInferiors('health')"
      :value="getAttrVal('health')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :used-exceptionals="heaUsed"
      :is-editable-attr="isEditing"
      :use-exceptional="flipExceptional"
      @updateAttr="(val) => update('health', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Willpower"
      attr-shorthand="WIL"
      :exceptionals="getExceptionals('willpower')"
      :inferiors="getInferiors('willpower')"
      :value="getAttrVal('willpower')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :used-exceptionals="wilUsed"
      :is-editable-attr="isEditing"
      :use-exceptional="flipExceptional"
      @updateAttr="(val) => update('willpower', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Perception"
      attr-shorthand="PER"
      :exceptionals="getExceptionals('perception')"
      :inferiors="getInferiors('perception')"
      :value="getAttrVal('perception')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :used-exceptionals="perUsed"
      :is-editable-attr="isEditing"
      :use-exceptional="flipExceptional"
      @updateAttr="(val) => update('perception', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Charisma"
      attr-shorthand="CHA"
      :exceptionals="getExceptionals('charisma')"
      :inferiors="getInferiors('charisma')"
      :value="getAttrVal('charisma')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :used-exceptionals="chaUsed"
      :is-editable-attr="isEditing"
      :use-exceptional="flipExceptional"
      @updateAttr="(val) => update('charisma', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Intelligence"
      attr-shorthand="INT"
      :exceptionals="getExceptionals('intelligence')"
      :inferiors="getInferiors('intelligence')"
      :value="getAttrVal('intelligence')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :used-exceptionals="intUsed"
      :is-editable-attr="isEditing"
      :use-exceptional="flipExceptional"
      @updateAttr="(val) => update('intelligence', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Power"
      attr-shorthand="PWR"
      :exceptionals="getExceptionals('power')"
      :inferiors="getInferiors('power')"
      :value="getAttrVal('power')"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :used-exceptionals="powUsed"
      :use-exceptional="flipExceptional"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('power', val)"
    ></GridDiplayAttr>
  </div>
</template>

<style scoped>
.attributesCont {
  display: flex;
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  justify-content: space-evenly;
}
.gridDisplay {
  display: block;
}
.fullDisplay {
  display: none;
}

@media (max-width: 1200px) {
  .fullDisplay {
    display: none;
  }
  .attributesCont {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: 1fr min-content;
    column-gap: 0;
    justify-items: center;
  }
  .gridDisplay {
    display: block;
  }
}
</style>
