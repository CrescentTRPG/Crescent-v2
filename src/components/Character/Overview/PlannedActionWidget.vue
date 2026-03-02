<script lang="ts">
import { Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import AbilityDisplay from '@/components/AbilityDisplay.vue'
import AbilityDisplayMedallion from '@/components/AbilityDisplayMedallion.vue'
import AddAsStatusModal from '@/components/AddAsStatusModal.vue'
import CustomModal from '@/components/CustomModal.vue'
import MartialSkillDisplay from '@/components/MartialSkillDisplay.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { usePartyStore } from '@/stores/partyStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'

export default {
  props: ['actionName', 'ability'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const adventureStore = useAdventureStore()
    const spellsStore = useSpellStore()
    const { manualSpellgroups } = storeToRefs(spellsStore)
    const partyStore = usePartyStore()
    const characterName: Ref<any> = ref(['self'])
    const opponentList: Ref<any> = ref([])

    function clearAbility() {
      if (props.actionName === 'Core Action') {
        characterStore.setPlannedCoreAction({})
      }
      if (props.actionName === 'Swift Action') {
        characterStore.setPlannedSwiftAction({})
      }
      if (props.actionName === 'Reaction') {
        characterStore.setPlannedReaction({})
      }
      if (props.actionName === 'Movement Action') {
        characterStore.setPlannedMovementAction({})
      }
    }

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      props,
      manualSpellgroups,
      clearAbility,
      characterName,
      partyStore,
      opponentList,
      adventureStore
    }
  },
  components: {
    AbilityDisplayMedallion,
    BButton,
    CustomModal,
    AbilityDisplay,
    MartialSkillDisplay,
    AddAsStatusModal
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
    style="width: 92%; border: 2px solid; margin-right: 4%; margin-left: 4%; margin-top: 1rem"
    :style="{ fontFamily: designStore.font, borderColor: designStore.secondaryTheme }"
  >
    <div
      style="
        width: 100%;
        font-size: 1rem;
        border-bottom: 2px solid;
        padding: 0.25rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        fontFamily: designStore.titleFont,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="margin-right: -0.25rem">
        <v-icon
          style="margin-right: -1.25rem"
          name="wi-moon-waning-crescent-5"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
        <v-icon
          name="wi-moon-waning-crescent-3"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
      </div>
      <div
        style="z-index: 5; display: flex; flex-direction: column; justify-content: center"
        :style="{
          background: designStore.primaryTheme,
          borderColor: designStore.secondaryTheme
        }"
      >
        {{ props.actionName }}
      </div>
      <div style="margin-left: -0.25rem; z-index: 4">
        <v-icon
          name="wi-moon-waxing-crescent-3"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
        <v-icon
          style="margin-left: -1.25rem"
          name="wi-moon-waxing-crescent-1"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
      </div>
    </div>

    <div
      class="inputColorBackdrop"
      v-if="props.ability.name"
      style="
        min-height: 4rem;
        display: flex;
        flex-direction: column;
        border: 10px solid;
        cursor: pointer;
      "
      :style="{
        background: designStore.inputBacking,
        borderColor: LightenDarkenColor(designStore.inputBacking, -10),
        color: designStore.inputBacking
      }"
      @click="modal = !modal"
    >
      <div
        style="
          display: flex;
          justify-content: space-around;
          flex-direction: row;
          flex-grow: 1;
          z-index: 3;
        "
        class="outerBox"
      >
        <div
          style="
            text-align: center;
            z-index: 4;
            height: 100%;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
            align-self: center;
          "
          :style="{ color: designStore.inputText }"
        >
          {{ props.ability.name }}
        </div>
      </div>
      <div style="display: flex; justify-content: center" v-if="ability.spellgroup">
        ( {{ ability.rank }} Mana )
      </div>
      <div
        style="display: flex; justify-content: center"
        v-if="ability.perkGroup && ability.type.includes('Charge')"
      >
        ( 1 Charge, {{ ability.type.split('(')[1].charAt(0) }} Total)
      </div>
      <div style="display: flex; justify-content: center" v-if="ability.skills">( No Cost )</div>
      <AbilityDisplayMedallion
        :medallion="manualSpellgroups[ability.spellgroup]?.groupIcon || ability.groupIcon"
      ></AbilityDisplayMedallion>
    </div>

    <div
      v-else
      style="min-height: 4rem; display: flex; flex-direction: column; border: 10px solid"
      :style="{
        background: designStore.secondaryTheme,
        borderColor: LightenDarkenColor(designStore.inputBacking, -10),
        boxShadow: 'inset 0px 0px 0px 2px ' + LightenDarkenColor(designStore.secondaryTheme, -10),
        color: designStore.inputBacking
      }"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          flex-grow: 1;
          z-index: 3;
        "
        class="outerBox"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputBacking
        }"
      >
        <div
          style="
            text-align: center;
            z-index: 4;
            height: 100%;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          "
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText
          }"
        >
          No Ability Planned
        </div>
      </div>
    </div>
    <CustomModal
      :showModal="modal"
      :title="props.ability.name || props.ability.skill + ' - ' + props.ability.rank"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <AbilityDisplay
          v-if="
            props.ability.spellgroup ||
            props.ability.perkGroup ||
            (!(props.ability.attributes || props.ability.combatStyles) && !props.ability.skill)
          "
          :medallion="
            manualSpellgroups[props.ability.spellgroup]?.groupIcon || props.ability.groupIcon
          "
          :description="props.ability.description"
          :area="props.ability.area"
          :duration="props.ability.duration"
          :action-cost="props.ability.actionCost"
          :resistance="props.ability.resistance"
          :target="props.ability.target"
          :type="props.ability.type"
        ></AbilityDisplay>

        <div
          v-if="props.ability.attributes || props.ability.combatStyles"
          style="padding-bottom: 0.5rem; border-top: 2px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
        >
          <div v-for="skill in props.ability.skills" :key="skill.name">
            <MartialSkillDisplay
              :title="skill.name"
              :description="skill.description"
              :mpCost="skill.mp_cost"
            ></MartialSkillDisplay>
          </div>
        </div>
        <div v-if="props.ability.skill != undefined" v-html="props.ability.description"></div>
      </template>
    </CustomModal>
    <div
      v-if="props.ability.name"
      style="
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-grow: 1;
        z-index: 3;
        font-size: small;
        font-style: normal;
      "
      class="outerBox"
      :style="{
        background: LightenDarkenColor(designStore.inputBacking, -10),
        borderColor: designStore.secondaryTheme,
        color: designStore.primaryText
      }"
    >
      <BButton
        @click="clearAbility"
        class="actionButtons"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        <div style="display: flex">
          <div style="margin-right: 0.5rem; margin-top: 0.1rem">Clear</div>
          <i class="bi bi-x-lg" style="font-size: large"></i></div
      ></BButton>
      <BButton
        class="actionButtons"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
        ><div style="display: flex; justify-content: flex-end">
          <AddAsStatusModal
            :ability="props.ability"
            :fontSize="'small'"
            style="text-wrap: wrap; width: 120%"
          ></AddAsStatusModal></div
      ></BButton>
    </div>
  </div>
</template>

<style scoped>
.outerBox {
  width: 100%;
}
.actionButtons {
  border-radius: 0.675rem;
  margin: 0.5rem;
  margin-top: 0;
  font-size: small;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}

#autoresizing {
  display: block;
  overflow: hidden;
  resize: none;
}
@media (max-width: 800px) {
  .wrappers {
    flex-wrap: wrap;
  }
  .wrappingItem {
    margin-bottom: 0.5rem;
    width: 100%;
  }
}
</style>
