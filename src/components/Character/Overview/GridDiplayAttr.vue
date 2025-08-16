<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useUserStore } from '@/stores/userStore'
import CustomModal from '@/components/CustomModal.vue'

import TitleWidget from '@/components/TitleWidget.vue'
import StatusModifierExplaination from './StatusModifierExplaination.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'
import StatusEffectItem from './StatusEffectItem.vue'
import AddStatusEffectWidget from './AddStatusEffectWidget.vue'
import BInputGroup from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroup.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import BasicInput from '../BasicInput.vue'

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
    'isEditableAttr'
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

    const titleMessage: ComputedRef = computed(() => {
      if (exceptionalVal.value < 0) {
        return props.value + ' ' + props.attribute + ', ' + exceptionalVal.value + ' Inferior(s)'
      } else if (exceptionalVal.value > 0) {
        return props.value + ' ' + props.attribute + ', ' + exceptionalVal.value + ' Exceptional(s)'
      } else {
        return props.value + ' ' + props.attribute
      }
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
      editModal
    }
  },
  components: {
    CustomModal,
    TitleWidget,
    StatusModifierExplaination,
    RibbonTitle,
    AddStatusEffectWidget,
    StatusEffectItem,

    BasicInput
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
