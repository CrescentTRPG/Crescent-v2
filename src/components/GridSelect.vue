<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'
import { computed, ref } from 'vue'

import TitleMedallion from './TitleMedallion.vue'
import { lightenDarkenColor } from '@/Utility.ts'
import { text } from 'stream/consumers'

export default {
  props: ['selected', 'updateOption', 'options', 'multiSelect', 'textWrap', 'useDisabledMessage'],
  //options in format [{name: '', description: '', value: ''}]
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)

    function getColor(option) {
      if (props.multiSelect) {
        if (!option.name) {
          if (
            Array.isArray(props.selected) &&
            props.selected.filter((item) => item === option).length > 0
          ) {
            console.log(option)
            return designStore.alertTheme
          }
        } else if (
          Array.isArray(props.selected) &&
          props.selected.filter(
            (item) => item.name === option.name && item.description === option.description
          ).length > 0
        ) {
          return designStore.alertTheme
        }
        return designStore.secondaryTheme
      } else {
        if (option === props.selected) {
          return designStore.alertTheme
        }
        return designStore.secondaryTheme
      }
    }
    function getBoxShadow(option) {
      if (props.multiSelect) {
        if (!option.name) {
          if (
            Array.isArray(props.selected) &&
            props.selected.filter((item) => item === option).length > 0
          ) {
            console.log(option)
            return '0px 0px 10px 3px ' + designStore.alertTheme
          }
        } else if (
          Array.isArray(props.selected) &&
          props.selected.filter(
            (item) =>
              (item.name === option.name && item.description === option.description) ||
              (item.name === undefined && item === option)
          ).length > 0
        ) {
          console.log(option)
          return '0px 0px 10px 3px ' + designStore.alertTheme
        }
        return 'none'
      }
      return 'none'
    }
    function update(option) {
      props.updateOption(option)
    }

    return {
      designStore,
      modal,
      update,
      getColor,
      getBoxShadow,
      props,
      lightenDarkenColor
    }
  },

  components: {
    TitleMedallion
  }
}
</script>
<template>
  <div>
    <div class="gridSelectContainer">
      <div
        v-for="option in props.options"
        :class="option.disabled ? 'gridSelect' : 'gridSelect hoverableTransparantLinear'"
        :style="{
          background: option.disabled
            ? lightenDarkenColor(designStore.inputBacking, -30)
            : designStore.inputBacking,
          color: designStore.inputText,
          borderColor: getColor(option.value),
          boxShadow: getBoxShadow(option.value)
        }"
        :key="option.name"
        @click="!option.disabled && update(option.value)"
      >
        <div
          v-if="option.disabled"
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          "
        >
          <TitleMedallion
            :title="option.name + (option.nameDecorator || '')"
            :style="{ 'text-wrap': props.textWrap }"
          ></TitleMedallion>

          <div class="interiorItems">
            <v-icon
              v-if="option.icon.substring(0, 2) === 'gi'"
              :name="option.icon"
              scale="5"
            ></v-icon>
            <i v-else :class="option.icon" style="font-size: 5rem"></i>
            <div style="text-align: end; align-self: center">
              {{ option.description }}
            </div>
          </div>
          <div
            style="font-size: small; text-align: center; position: relative; top: 0.5rem"
            v-if="props.useDisabledMessage"
          >
            {{ option.disabledMessage }}
          </div>
        </div>
        <div v-else style="cursor: pointer; height: 100%; display: flex; flex-direction: column">
          <TitleMedallion
            :title="option.name"
            :style="{ 'text-wrap': props.textWrap }"
          ></TitleMedallion>
          <div class="interiorItems">
            <v-icon
              v-if="option.icon.substring(0, 2) === 'gi'"
              :name="option.icon"
              scale="5"
            ></v-icon>
            <i v-else :class="option.icon" style="font-size: 5rem"></i>
            <div style="text-align: end; align-self: center">
              {{ option.description }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.gridSelect {
  border: 3px solid;
  border-radius: 0.375rem;
  padding: 1rem;
  align-items: center;
  margin: 2rem;
}
.interiorItems {
  align-items: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
.gridSelectContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 1100px) {
  .interiorItems {
    align-items: end;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    flex-direction: column-reverse;
    flex-grow: 1;
  }
}
@media (max-width: 900px) {
  .gridSelectContainer {
    display: flex;
    flex-direction: column;
  }
  .interiorItems {
    align-items: center;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
