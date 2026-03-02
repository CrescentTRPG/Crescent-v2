<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'

import TitleMedallion from '@/components/TitleMedallion.vue'

import { Ref, ref } from 'vue'

import { computed } from 'vue'
import _ from 'lodash'
import CustomModal from '@/components/CustomModal.vue'

export default {
  props: ['updateEffigy', 'effigy'],
  setup(props, context) {
    const designStore = useDesignStore()

    const typeModal = ref(false)

    const effigyTypeIcon = computed(() => {
      return props.effigy.effigyType === 'fighter'
        ? 'gi-axe-sword'
        : props.effigy.effigyType === 'caster'
          ? 'gi-magic-palm'
          : 'gi-choice'
    })
    function getTypeColor(type) {
      if (type === props.effigy.effigyType) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }
    function getTypeBoxShadow(type) {
      if (type === props.effigy.effigyType) {
        return '0px 0px 10px 3px ' + designStore.alertTheme
      }
      return 'none'
    }
    function updateType(type) {
      props.updateEffigy({ ..._.cloneDeep(props.effigy), effigyType: type })
    }

    return {
      designStore,
      effigyTypeIcon,
      typeModal,
      getTypeColor,
      updateType,
      getTypeBoxShadow
    }
  },
  components: {
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    TitleMedallion,
    CustomModal
  }
}
</script>
<template>
  <div
    id="EffigyType"
    @click="typeModal = true"
    class="hoverablePrimary"
    style="
      display: flex;
      flex-direction: column;
      cursor: pointer;
      margin: 0.5rem;
      border-radius: 0.5rem;
    "
    :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
  >
    <div style="text-align: center; padding-right: 0.5rem; padding-left: 0.5rem">Effigy Type</div>

    <v-icon style="align-self: center" :name="effigyTypeIcon" scale="3"></v-icon>
    <CustomModal :showModal="typeModal" title="Edit Effigy Type" @close="typeModal = false">
      <template v-slot:body>
        <div class="effigySelectContainer">
          <div
            @click="updateType('caster')"
            class="effigyTypeSelect hoverableTransparantLinear"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: getTypeColor('caster'),
              boxShadow: getTypeBoxShadow('caster')
            }"
          >
            <TitleMedallion title="Caster"></TitleMedallion>
            <div style="display: flex">
              <v-icon name="gi-magic-palm" scale="5"></v-icon>
              <div style="text-align: end; align-self: center">
                Caster's learn a new rank in a spellgroup and a point of mana at each level.
              </div>
            </div>
          </div>
          <div
            class="effigyTypeSelect hoverableTransparantLinear"
            @click="updateType('fighter')"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: getTypeColor('fighter'),
              boxShadow: getTypeBoxShadow('fighter')
            }"
          >
            <TitleMedallion title="Fighter"></TitleMedallion>

            <div style="display: flex; justify-content: space-between">
              <v-icon name="gi-swordman" scale="5"></v-icon>
              <div style="text-align: end; align-self: center">
                Fighters learn a martial perk at every other rank (1,3,5)
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </template>
    </CustomModal>
  </div>
</template>
<style>
.effigyTypeSelect {
  border: 3px solid;
  border-radius: 0.375rem;
  padding: 1rem;
  align-items: center;
  margin: 2rem;
}
.effigySelectContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}
@media (max-width: 900px) {
  .effigySelectContainer {
    display: flex;
    flex-direction: column;
  }
}
</style>
