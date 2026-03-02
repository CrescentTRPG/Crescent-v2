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
        if (Array.isArray(props.selected) && props.selected.includes(option)) {
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
        if (Array.isArray(props.selected) && props.selected.includes(option)) {
          return '0px 0px 10px 3px ' + designStore.alertTheme
        }
        return 'none'
      } else {
        if (option === props.selected) {
          return '0px 0px 10px 3px ' + designStore.alertTheme
        }
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
            :title="option.name"
            :style="{ 'text-wrap': props.textWrap }"
          ></TitleMedallion>

          <div style="display: flex; align-items: center">
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
        <div v-else style="cursor: pointer">
          <TitleMedallion
            :title="option.name"
            :style="{ 'text-wrap': props.textWrap }"
          ></TitleMedallion>
          <div style="display: flex; align-items: center">
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
.gridSelectContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 900px) {
  .gridSelectContainer {
    display: flex;
    flex-direction: column;
  }
}
</style>
