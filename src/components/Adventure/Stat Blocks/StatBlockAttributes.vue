<script lang="ts">
import { computed, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useUserStore } from '@/stores/userStore'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import { storeToRefs } from 'pinia'
import { get } from 'node_modules/bootstrap-vue-next/dist/src/utils'
import GridDiplayAttr from '@/components/Character/Overview/GridDiplayAttr.vue'

export default {
  props: ['currentStatBlock', 'isEditing', 'updateTemp', 'removeAttributeStatusModifier'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()

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

    return {
      designStore,
      modal,
      userStore,
      getExceptionals,
      addAttributeStatusModifier,
      getInferiors,
      update,
      props
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
      :value="props.currentStatBlock.attributes.strength"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('strength', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Agility"
      attr-shorthand="AGI"
      :exceptionals="getExceptionals('agility')"
      :inferiors="getInferiors('agility')"
      :value="props.currentStatBlock.attributes.agility"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('agility', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Health"
      attr-shorthand="HEA"
      :exceptionals="getExceptionals('health')"
      :inferiors="getInferiors('health')"
      :value="props.currentStatBlock.attributes.health"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('health', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Willpower"
      attr-shorthand="WIL"
      :exceptionals="getExceptionals('willpower')"
      :inferiors="getInferiors('willpower')"
      :value="props.currentStatBlock.attributes.willpower"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('willpower', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Perception"
      attr-shorthand="PER"
      :exceptionals="getExceptionals('perception')"
      :inferiors="getInferiors('perception')"
      :value="props.currentStatBlock.attributes.perception"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('perception', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Charisma"
      attr-shorthand="CHA"
      :exceptionals="getExceptionals('charisma')"
      :inferiors="getInferiors('charisma')"
      :value="props.currentStatBlock.attributes.charisma"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('charisma', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Intelligence"
      attr-shorthand="INT"
      :exceptionals="getExceptionals('intelligence')"
      :inferiors="getInferiors('intelligence')"
      :value="props.currentStatBlock.attributes.intelligence"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
      :is-editable-attr="isEditing"
      @updateAttr="(val) => update('intelligence', val)"
    ></GridDiplayAttr>
    <GridDiplayAttr
      class="gridDisplay"
      attribute="Power"
      attr-shorthand="PWR"
      :exceptionals="getExceptionals('power')"
      :inferiors="getInferiors('power')"
      :value="props.currentStatBlock.attributes.power"
      :attribute-status-modifiers="props.currentStatBlock.attributeStatusModifiers"
      :remove-attribute-status-modifier="props.removeAttributeStatusModifier"
      :add-new-attribute-status-modifier="addAttributeStatusModifier"
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

@media (max-width: 900px) {
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
