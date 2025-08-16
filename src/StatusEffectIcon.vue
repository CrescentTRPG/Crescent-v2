<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import { useDesignStore } from './stores/designStore'
import CustomModal from './components/CustomModal.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import AbilityDisplay from './components/AbilityDisplay.vue'
import TitleMedallion from './components/TitleMedallion.vue'

export default {
  props: [
    'icon',
    'removeStatus',
    'isCustom',
    'statusObj',
    'notRemoveable',
    'color',
    'boxShadow',
    'borderBottom',
    'background',
    'disableModal',
    'ability'
  ],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    function loadValuesAndShowModal(val) {
      modalName.value = val.name
      modalDescription.value = val.description
      modalDuration.value = val.duration || ''
      modalCheckToBreak.value = val.checkToBreak || ''
      modal.value = true
    }
    const modalName = ref('')
    const modalDescription = ref('')
    const modalDuration = ref('')
    const modalCheckToBreak = ref('')

    function remove() {
      modal.value = false
      props.removeStatus(props.statusObj.name)
    }
    function show() {
      if (!props.disableModal) {
        modal.value = true
      }
    }
    function formatHTML(description: string) {
      let sections = description.split('❖ ')
      let ret
      if (sections.length === 1) {
        sections = description.split('\\n')
        if (sections.length === 1) {
          return '<div>' + description + '</div>'
        }
      }
      ret = '<div style="margin-bottom: .25rem">' + sections[0] + '</div>'
      sections.shift()
      sections.forEach((s) => {
        ret +=
          '<li style="padding-left: 1rem; margin-bottom: .25rem;list-style-type:none;text-indent: -1rem ;">' +
          '❖ ' +
          s +
          '</li>'
      })

      return ret
    }
    return {
      designStore,
      modal,
      props,
      formatHTML,
      remove,
      show
    }
  },
  components: { CustomModal, BButton, AbilityDisplay, TitleMedallion }
}
</script>

<template>
  <div @click="show()">
    <div
      v-if="props.icon?.substring(0, 2) == 'gi'"
      :style="{
        boxShadow: props.boxShadow || 'none',
        color: props.color || designStore.alertTheme,
        borderColor: designStore.secondaryTheme || 'none',
        background: props.background || 'none'
      }"
      class="iconContain hoverableTransparantRadial"
    >
      <v-icon scale="1.5" :name="props.icon" style="cursor: pointer"></v-icon>
    </div>
    <div
      :style="{
        boxShadow: props.boxShadow || 'none',
        borderBottom: props.borderBottom || 'none',
        color: props.color || designStore.alertTheme,
        background: props.background || 'none'
      }"
      class="iconContain hoverableTransparantRadial"
      v-if="props.icon?.substring(0, 2) == 'bi'"
      style="font-size: 1.5rem; cursor: pointer"
    >
      <i :class="props.icon"></i>
    </div>
    <CustomModal :showModal="modal" :title="props.statusObj.name" @close="modal = false">
      <template v-slot:body>
        <div
          v-html="formatHTML(props.statusObj.description)"
          style="z-index: 5; margin-left: 0.75rem; margin-right: 0.75rem; text-align: left"
        ></div>
        <div
          style="display: flex; justify-content: flex-end"
          v-if="props.statusObj.duration || props.statusObj.checkToBreak"
        >
          <div style="margin-right: 1rem">Duration: {{ props.statusObj.duration }}</div>
          <div>Check to Break: {{ props.statusObj.checkToBreak }}</div>
        </div>
        <TitleMedallion
          v-if="props.ability"
          title="Trait Ability"
          :color="designStore.primaryText"
        ></TitleMedallion>

        <div
          style="display: flex; justify-content: flex-end; margin-top: 2rem"
          v-if="props.ability"
        >
          <AbilityDisplay
            :title="props.ability.name"
            :description="props.ability.description"
            :actionCost="props.ability.actionCost"
            :rank="props.ability.rank"
            :target="props.ability.target"
            :medallion="props.icon"
            :duration="props.ability.duration"
            :type="props.ability.type"
            :resistance="props.ability.resistance"
            :area="props.ability.area"
          ></AbilityDisplay>
        </div>
      </template>
      <template v-slot:footer>
        <BButton
          v-if="!props.notRemoveable"
          @click="remove()"
          style="border: 1px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Remove</BButton
        >
      </template>
    </CustomModal>
  </div>
</template>

<style>
.iconContain {
  height: 100%;
  max-height: 3rem;
  padding-top: 0.5rem;
  padding-left: 0.25rem;
  margin-left: -0.45rem;
  padding-right: 0.65rem;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  padding-bottom: 0.5rem;
}
</style>
