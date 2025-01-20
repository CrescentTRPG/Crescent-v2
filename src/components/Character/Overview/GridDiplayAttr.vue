<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import CustomModal from '@/components/CustomModal.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BInputGroup from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroup.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import { useStatusEffectStore } from '@/stores/statusEffectStore'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'

export default {
  props: ['attribute', 'attrShorthand'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { attributes, exceptionals, attributeStatusModifiers } = storeToRefs(characterStore)
    const lowercaseAttr = props.attribute.toLowerCase()
    const statusEffectsStore = useStatusEffectStore()
    const {
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
      getPowerInferiors
    } = storeToRefs(statusEffectsStore)
    const baseAttributeVal = ref(attributes.value[lowercaseAttr])
    const baseExceptionalVal = ref(exceptionals.value[lowercaseAttr])
    const numExceptionals: ComputedRef<number> = computed(() => {
      if (props.attribute === 'Strength') return getStrengthExceptionals.value
      else if (props.attribute === 'Agility') return getAgilityExceptionals.value
      else if (props.attribute === 'Perception') return getperceptionExceptionals.value
      else if (props.attribute === 'Willpower') return getWillpowerExceptionals.value
      else if (props.attribute === 'Charisma') return getCharismaExceptionals.value
      else if (props.attribute === 'Health') return gethealthExceptionals.value
      else if (props.attribute === 'Intelligence') return getIntelligenceExceptionals.value
      else return getPowerExceptionals.value
    })

    const numInferiors: ComputedRef<number> = computed(() => {
      if (props.attribute === 'Strength') return getStrengthInferiors.value
      else if (props.attribute === 'Agility') return getAgilityInferiors.value
      else if (props.attribute === 'Perception') return getPerceptionInferiors.value
      else if (props.attribute === 'Willpower') return getWillpowerInferiors.value
      else if (props.attribute === 'Charisma') return getCharismaInferiors.value
      else if (props.attribute === 'Health') return getHealthInferiors.value
      else if (props.attribute === 'Intelligence') return getIntelligenceInferiors.value
      else return getPowerInferiors.value
    })

    const exceptionalVal: ComputedRef = computed(() => {
      return numExceptionals.value - numInferiors.value
    })

    const attributeVal: ComputedRef = computed(() => {
      if (props.attribute === 'Strength') return getStrength.value
      else if (props.attribute === 'Agility') return getAgility.value
      else if (props.attribute === 'Perception') return getPerception.value
      else if (props.attribute === 'Willpower') return getWillpower.value
      else if (props.attribute === 'Charisma') return getCharisma.value
      else if (props.attribute === 'Health') return getHealth.value
      else if (props.attribute === 'Intelligence') return getIntelligence.value
      else return getPower.value
    })
    const modifierType = [
      'Override Attribute',
      'Modify Attribute',
      'Add Exceptional(s)',
      'Add Inferior(s)'
    ]

    const titleMessage: ComputedRef = computed(() => {
      if (exceptionalVal.value < 0) {
        return (
          attributeVal.value + ' ' + props.attribute + ', ' + exceptionalVal.value + ' Inferior(s)'
        )
      } else if (exceptionalVal.value > 0) {
        return (
          attributeVal.value +
          ' ' +
          props.attribute +
          ', ' +
          exceptionalVal.value +
          ' Exceptional(s)'
        )
      } else {
        return attributeVal.value + ' ' + props.attribute
      }
    })

    function getAttributeColor() {
      return !useCharacterStore().attributeStatusModifiers[props.attribute.toLowerCase()][
        'Modify Attribute'
      ] &&
        !useCharacterStore().attributeStatusModifiers[props.attribute.toLowerCase()][
          'Override Attribute'
        ]
        ? designStore.sidebarText
        : designStore.alertTheme
    }
    function getExceptionalColor() {
      return !useCharacterStore().attributeStatusModifiers[props.attribute.toLowerCase()][
        'Add Inferior(s)'
      ] &&
        !useCharacterStore().attributeStatusModifiers[props.attribute.toLowerCase()][
          'Add Exceptional(s)'
        ]
        ? designStore.secondaryTheme
        : designStore.alertTheme
    }
    function addAttributeStatusModifier(addedVal) {
      let statusObj = {
        modifierType: addedVal.selectedMod,
        linkedStatus: addedVal.linkedStatus,
        modAmount: addedVal.modAmount,
        attribute: props.attribute
      }
      characterStore.addNewAttributeStatusModifier(statusObj)
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      characterStore.removeAttributeStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus,
        attribute: props.attribute
      })
    }

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(attributeStatusModifiers.value[props.attribute.toLowerCase()])
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })

      return ret
    })

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      attributeVal,
      exceptionalVal,
      baseAttributeVal,
      baseExceptionalVal,
      props,
      modifierType,
      titleMessage,
      addAttributeStatusModifier,
      statusModifiersList,
      removeModifier,
      numInferiors,
      numExceptionals,
      getExceptionalColor,
      getAttributeColor
    }
  },
  components: {
    CustomModal,
    TitleWidget,
    StatusModifierExplaination,
    RibbonTitle,
    AddStatusEffectWidget,
    StatusEffectItem
  },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  }
}
</script>

<template>
  <div
    @click="modal = !modal"
    style="width: 95%; margin: 0.1rem; border-radius: 4px; cursor: pointer"
    :style="{
      color: getAttributeColor(),
      background: designStore.secondaryTheme,
      border: '1px solid' + LightenDarkenColor(designStore.secondaryTheme, -20),
      boxShadow: 'inset 0px 0px 0px 1px ' + LightenDarkenColor(designStore.secondaryTheme, -10)
    }"
  >
    <div
      class="outerBox"
      :style="{
        background: designStore.sidebarBacking,
        borderColor: designStore.secondaryTheme,
        borderLeftColor: LightenDarkenColor(designStore.secondaryTheme, -20)
      }"
    >
      <div class="attrz">
        <div style="width: 0.25rem; padding-right: 1.5rem"></div>
        <div style="">{{ attributeVal }}</div>
        <div class="exec" v-if="exceptionalVal != 0" :style="{ color: getAttributeColor() }">
          <div style="display: flex; justify-content: center; width: 100%">
            <v-icon
              v-if="exceptionalVal > 0"
              :style="{ color: getExceptionalColor() }"
              name="gi-polar-star"
              style="position: absolute; margin-top: -0.9rem; margin-left: 0.1rem; z-index: 4"
              scale="2.5"
            ></v-icon>

            <v-icon
              v-if="exceptionalVal < 0"
              :style="{ color: getExceptionalColor() }"
              name="gi-plain-arrow"
              style="
                position: absolute;
                margin-top: -0.5rem;
                z-index: 3;
                transform: scale(1.25, 1);
                margin-left: 0.25rem;
              "
              scale="2"
            ></v-icon>
            <div
              style="position: relative; z-index: 5; bottom: 0.15rem; left: 0.05rem"
              :style="{
                color: designStore.primaryText,
                textShadow:
                  '-1px -1px 0 ' +
                  designStore.primaryTheme +
                  ', -1px 1px 0 ' +
                  designStore.primaryTheme +
                  ', 1px -1px 0 ' +
                  designStore.primaryTheme +
                  ', 1px 1px 0 ' +
                  designStore.primaryTheme
              }"
            >
              {{ exceptionalVal }}
            </div>
          </div>
        </div>
        <div v-else style="width: 0.25rem; padding-right: 1.5rem"></div>
      </div>
      <div
        class="shorthand"
        style="font-size: medium; align-self: center"
        :style="{ fontFamily: designStore.titleFont }"
      >
        {{ attrShorthand }}
      </div>
      <div
        class="fullName"
        style="align-self: center"
        :style="{ fontFamily: designStore.titleFont, color: getAttributeColor() }"
      >
        {{ attribute }}
      </div>
    </div>
    <CustomModal :title="'Modify ' + props.attribute" :showModal="modal" @close="modal = !modal">
      <template v-slot:body>
        <div style="display: flex; justify-content: center">
          <RibbonTitle
            style="margin-top: -1rem"
            :title="titleMessage"
            :background="designStore.sidebarBacking"
            :textColor="designStore.sidebarText"
          ></RibbonTitle>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: -1rem">
          <TitleWidget title="Status Modifiers" style="width: 100%"></TitleWidget>
          <StatusModifierExplaination
            style="position: relative; top: 2.5rem"
          ></StatusModifierExplaination>
        </div>
        <AddStatusEffectWidget
          :modifierType="modifierType"
          @added="(addedVal) => addAttributeStatusModifier(addedVal)"
        ></AddStatusEffectWidget>

        <div v-for="mod in statusModifiersList" :key="mod">
          <StatusEffectItem
            @delete="removeModifier(mod.modifierType, mod.modAmount, mod.linkedStatus)"
            :modifierType="mod.modifierType"
            :modAmount="mod.modAmount"
            :linkedStatus="mod.linkedStatus"
          ></StatusEffectItem>
        </div>
      </template>
    </CustomModal>
  </div>
</template>

<style scoped>
.outerBox {
  border: 2px solid;
  width: 100%;
  clip-path: polygon(0 17%, 10% 0, 90% 0, 100% 17%, 100% 83%, 90% 100%, 10% 100%, 0% 83%);
}
.attrz {
  display: flex;
  font-size: x-large;
  justify-content: space-between;
}
.shorthand {
  display: none;
}
.fullName {
  font-size: small;
  margin-top: -0.25rem;
  justify-self: center;
}
.exec {
  position: relative;
  z-index: 5;
  padding: 0.25rem;
  padding-right: 0.75rem;
  height: 50%;
  font-size: medium;
  align-items: end;
  border-bottom-left-radius: 0.25rem;
}
@media (max-width: 520px) {
  .shorthand {
    margin-top: -0.25rem;
    display: block;
    justify-self: center;
  }
  .fullName {
    display: none;
  }
}
@media (min-width: 900px) {
  .fullName {
    display: none;
  }
  .shorthand {
    margin-top: -0.25rem;
    display: block;
    justify-self: center;
  }
}
@media (min-width: 1000px) {
  .shorthand {
    display: none;
  }
  .attrz {
    display: flex;
    font-size: xx-large;
    justify-content: space-between;
  }
  .fullName {
    display: block;
    margin-top: -0.5rem;
  }
}
@media (min-width: 1400px) {
  .attrz {
    display: flex;
    font-size: 2.5rem;
    justify-content: space-between;
  }
  .fullName {
    margin-top: -1rem;
    font-size: medium;
  }
  .exec {
    position: relative;
    z-index: 5;
    padding: 0.25rem;
    padding-right: 0.75rem;
    height: 50%;
    font-size: medium;
    align-items: end;
    border-bottom-left-radius: 0.25rem;
  }
}
.ribbon-top {
  margin-top: 0.2rem;
  width: 0;
  height: 0;
  border-top: 0px solid transparent;
  border-bottom: 20px solid transparent;

  border-left: 15px solid;
}
.ribbon-bottom {
  width: 0;
  height: 0;
  border-top: 20px solid transparent;
  border-bottom: 0px solid transparent;

  border-left: 15px solid;
}
</style>
