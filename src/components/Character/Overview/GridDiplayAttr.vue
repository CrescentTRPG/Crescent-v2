<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useUserStore } from '@/stores/userStore.ts'
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import RibbonTitle from '@/components/RibbonTitle.vue'
import BasicInput from '../BasicInput.vue'
import AddStatusModifierModal from './AddStatusModifierModal.vue'
import ExceptionalTracker from './ExceptionalTracker.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import FancyDecor from '@/components/FancyDecor.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'

export default {
  props: [
    'attribute',
    'attrShorthand',
    'exceptionals',
    'inferiors',
    'value',
    'attributeStatusModifiers',
    'addNewAttributeStatusModifier',
    'removeAttributeStatusModifier',
    'isEditableAttr',
    'usedExceptionals',
    'useExceptional'
  ],
  emits: ['updateAttr'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()

    const exceptionalVal: ComputedRef = computed(() => {
      return props.exceptionals - props.inferiors
    })

    const modifierType = [
      'Override Attribute',
      'Modify Attribute',
      'Add Exceptional(s)',
      'Add Inferior(s)'
    ]

    const exceptionalsList = computed(() => {
      let ret: Array<{ used: boolean; index: number }> = []
      for (
        let i = 0;
        i < props.exceptionals - props.inferiors + Object.keys(props.usedExceptionals || {}).length;
        i++
      ) {
        ret.push({ index: i, used: props.usedExceptionals[i] })
      }
      return ret
    })

    const titleMessage: ComputedRef = computed(() => {
      return props.value + ' ' + props.attribute
    })

    function getAttributeColor() {
      return !props.attributeStatusModifiers[props.attribute.toLowerCase()]['Modify Attribute'] &&
        !props.attributeStatusModifiers[props.attribute.toLowerCase()]['Override Attribute']
        ? designStore.sidebarText
        : designStore.alertTheme
    }
    function getExceptionalColor() {
      return !props.attributeStatusModifiers[props.attribute.toLowerCase()]['Add Inferior(s)'] &&
        !props.attributeStatusModifiers[props.attribute.toLowerCase()]['Add Exceptional(s)']
        ? designStore.secondaryTheme
        : designStore.alertTheme
    }
    function addAttributeStatusModifier(addedVal) {
      if (addedVal.selectedMod && addedVal.modAmount) {
        let statusObj = {
          modifierType: addedVal.selectedMod,
          linkedStatus: addedVal.linkedStatus,
          modAmount: addedVal.modAmount,
          attribute: props.attribute
        }
        props.addNewAttributeStatusModifier(statusObj)
      }
    }

    function removeModifier(modifierType, modAmount, linkedStatus) {
      props.removeAttributeStatusModifier({
        modifierType: modifierType,
        modAmount: modAmount,
        linkedStatus: linkedStatus,
        attribute: props.attribute
      })
    }

    const statusModifiersList: ComputedRef<Array<any>> = computed(() => {
      let modifiers = Object.values(props.attributeStatusModifiers[props.attribute.toLowerCase()])
      let ret = []
      modifiers.forEach((modGroup: any) => {
        ret = ret.concat(Object.values(modGroup))
      })

      return ret
    })
    const isHidden = ref(false)
    function showModal() {
      if (props.isEditableAttr) {
        editModal.value = true
      } else {
        modal.value = true
      }
    }
    const editModal = ref(false)
    function updateAttr(val) {
      context.emit('updateAttr', val)
    }
    function getIcon() {
      switch (props.attribute) {
        case 'Agility':
          return 'gi-tightrope'
        case 'Strength':
          return 'gi-strong'
        case 'Health':
          return 'gi-heart-inside'
        case 'Willpower':
          return 'gi-confrontation'
        case 'Perception':
          return 'gi-eye-target'
        case 'Charisma':
          return 'gi-star-struck'
        case 'Intelligence':
          return 'gi-brain'
        case 'Power':
          return 'gi-glowing-hands'
      }
    }

    return {
      designStore,
      modal,
      userStore,
      exceptionalVal,
      props,
      modifierType,
      titleMessage,
      addAttributeStatusModifier,
      statusModifiersList,
      removeModifier,
      getExceptionalColor,
      getAttributeColor,
      showModal,
      updateAttr,
      editModal,
      isHidden,
      exceptionalsList,
      getIcon
    }
  },
  components: {
    CustomModal,

    IconDisplay,
    StatusEffectItem,
    AddStatusModifierModal,
    BasicInput,
    ExceptionalTracker
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
    @click="showModal()"
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
      <div class="attrz hoverableAttr">
        <div style="width: 0.25rem; padding-right: 1.5rem"></div>
        <div style="">{{ props.value }}</div>
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
      <div style="width: 100%; display: flex; justify-content: center">
        <div
          class="shorthand"
          style="font-size: medium; align-self: center"
          :style="{ fontFamily: designStore.titleFont }"
        >
          {{ attrShorthand }}
        </div>
      </div>
      <div style="width: 100%; display: flex; justify-content: center">
        <div
          class="fullName"
          style="align-self: center"
          :style="{ fontFamily: designStore.titleFont, color: getAttributeColor() }"
        >
          {{ attribute }}
        </div>
      </div>
    </div>
    <CustomModal
      :is-hidden="isHidden"
      :title="'Modify ' + props.attribute"
      :showModal="modal"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <div
          style="
            margin-top: -1rem;
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding-bottom: 1rem;
          "
        >
          <div style="display: flex; justify-content: center">
            <IconDisplay
              :color="designStore.secondaryTheme"
              :scale="4"
              :icon="getIcon()"
            ></IconDisplay>
          </div>
          <div
            style="
              align-self: center;
              font-size: x-large;
              padding: 0.5rem;
              border: 2px solid;
              margin-top: -1rem;
            "
            :style="{
              background: designStore.sidebarBacking,
              color: designStore.sidebarText,
              borderColor: designStore.secondaryTheme
            }"
          >
            {{ titleMessage }}
          </div>
          <div
            v-if="exceptionalsList.length > 0"
            style="display: flex; justify-content: center; flex-grow: 1"
          >
            <div v-for="e in exceptionalsList" :key="e.index">
              <ExceptionalTracker
                :used="e.used"
                :flipExceptional="() => props.useExceptional(e.index, !e.used, props.attribute)"
              ></ExceptionalTracker>
            </div>
            <div style="align-self: center">{{ '( + ' + exceptionalVal + ' )' }}</div>
          </div>
        </div>

        <AddStatusModifierModal
          :modifiers="modifierType"
          modifierType="Modify Mp"
          @added="(addedVal) => addAttributeStatusModifier(addedVal)"
          :modify-is-hidden="(val) => (isHidden = val)"
        ></AddStatusModifierModal>

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
    <CustomModal
      :showModal="editModal"
      :title="props.attribute"
      @close="editModal = false"
      :close-on-enter="true"
    >
      <template v-slot:body>
        <BasicInput
          :label="props.attribute"
          :value="props.value"
          type="number"
          :max="10"
          :min="0"
          @newValue="(val) => updateAttr(val)"
        ></BasicInput>
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
