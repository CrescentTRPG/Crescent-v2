<script lang="ts">
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useInitiativeStore } from '@/stores/initiativeStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

export default {
  props: [
    'openAddCombatantModal',
    'mode',
    'sortHighToLow',
    'nextTurn',
    'overrideFull',
    'rollInitiative'
  ],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const adventureStore = useAdventureStore()
    const initiativeStore = useInitiativeStore()
    return {
      designStore,
      modal,
      adventureStore,
      props,
      initiativeStore
    }
  },
  components: { BButton }
}
</script>

<template>
  <div
    class="twoHeader"
    :style="{
      fontFamily: designStore.font,
      background: designStore.inputBacking,
      borderColor: designStore.secondaryTheme
    }"
  >
    <div style="display: flex" v-if="!overrideFull">
      <div
        v-if="mode === 'run'"
        class="headerContainer"
        :style="{
          fontFamily: designStore.font,
          color: designStore.primaryText,
          background: designStore.primaryTheme,
          borderColor: designStore.secondaryTheme
        }"
      >
        <div
          class="manageCombatantsLong"
          style="align-self: center; font-size: large; padding-left: 0.5rem; padding-right: 0.5rem"
          :style="{
            fontFamily: designStore.titleFont,
            color: designStore.primaryText,
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme
          }"
        >
          Initiative
        </div>
        <BButton
          v-if="props.mode === 'run'"
          @click="props.rollInitiative()"
          class="initiativeButtons"
          style="font-size: 1rem; padding: 0.25rem; margin: 0.15rem; border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <v-icon name="gi-rolling-dices" scale="1.25"></v-icon
        ></BButton>
        <BButton
          v-if="props.mode === 'run'"
          @click="initiativeStore.sort()"
          class="initiativeButtons"
          style="font-size: 1rem; padding: 0.25rem; margin: 0.15rem; border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <i
            class="bi bi-sort-numeric-down-alt"
            style="padding-left: 0.25rem; padding-right: 0.25rem"
          ></i
        ></BButton>
        <BButton
          v-if="props.mode === 'run'"
          @click="initiativeStore.lastTurn()"
          class="initiativeButtons"
          style="font-size: 1rem; padding: 0.25rem; margin: 0.15rem; border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <v-icon
            :style="{
              color: designStore.primaryText
            }"
            scale="1.25"
            name="gi-player-previous"
          ></v-icon
        ></BButton>
        <BButton
          v-if="props.mode === 'run'"
          @click="initiativeStore.nextTurn()"
          class="initiativeButtons"
          style="font-size: 1rem; padding: 0.25rem; margin: 0.15rem; border: 2px solid"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          <v-icon
            :style="{
              color: designStore.primaryText
            }"
            scale="1.25"
            name="gi-player-next"
          ></v-icon
        ></BButton>
      </div>
      <div
        v-if="mode === 'run'"
        style="position: relative; left: -1rem; z-index: 1; margin-right: -1rem"
        class="manageCombatantsLong"
      >
        <v-icon
          :style="{
            color: designStore.secondaryTheme
          }"
          scale="2"
          name="gi-leapfrog"
        ></v-icon>
      </div>
    </div>
    <div style="display: flex; width: 100%; justify-content: space-between" v-if="overrideFull">
      <div v-if="props.mode === 'run'" style="display: flex">
        <div
          style="border-right: 2px solid; z-index: 2; display: flex; padding-right: 0.5rem"
          :style="{
            fontFamily: designStore.font,
            color: designStore.primaryText,
            background: designStore.primaryTheme,
            borderColor: designStore.secondaryTheme
          }"
        >
          <div
            style="
              align-self: center;
              font-size: large;
              padding-left: 0.5rem;
              padding-right: 0.5rem;
            "
            :style="{
              fontFamily: designStore.titleFont,
              color: designStore.primaryText,
              background: designStore.primaryTheme,
              borderColor: designStore.secondaryTheme
            }"
          >
            Initiative
          </div>
          <BButton
            v-if="props.mode === 'run'"
            @click="props.rollInitiative()"
            style="
              font-size: 1rem;
              padding: 0.25rem;
              margin: 0.15rem;
              border: 2px solid;
              display: flex;
            "
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div class="overrideFullInitiativeButtons">Roll Initiative</div>
            <v-icon name="gi-rolling-dices" scale="1.25"></v-icon>
          </BButton>
          <BButton
            v-if="props.mode === 'run'"
            @click="initiativeStore.sort()"
            style="
              font-size: 1rem;
              padding: 0.25rem;
              margin: 0.15rem;
              border: 2px solid;
              display: flex;
            "
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div class="overrideFullInitiativeButtons">Sort</div>

            <i
              class="bi bi-sort-numeric-down-alt"
              style="padding-left: 0.25rem; padding-right: 0.25rem"
            ></i>
          </BButton>
          <BButton
            v-if="props.mode === 'run'"
            @click="initiativeStore.lastTurn()"
            style="
              font-size: 1rem;
              padding: 0.25rem;
              margin: 0.15rem;
              border: 2px solid;
              display: flex;
            "
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div class="overrideFullInitiativeButtons">Last Turn</div>

            <v-icon
              :style="{
                color: designStore.primaryText
              }"
              scale="1.25"
              name="gi-player-previous"
            ></v-icon>
          </BButton>
          <BButton
            v-if="props.mode === 'run'"
            @click="initiativeStore.nextTurn()"
            style="
              font-size: 1rem;
              padding: 0.25rem;
              margin: 0.15rem;
              border: 2px solid;
              display: flex;
            "
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div class="overrideFullInitiativeButtons">Next Turn</div>

            <v-icon
              :style="{
                color: designStore.primaryText
              }"
              scale="1.25"
              name="gi-player-next"
            ></v-icon>
          </BButton>
        </div>
        <div
          style="position: relative; left: -1rem; z-index: 1; margin-right: -1rem"
          v-if="props.mode === 'run'"
        >
          <v-icon
            :style="{
              color: designStore.secondaryTheme
            }"
            scale="2"
            name="gi-leapfrog"
          ></v-icon>
        </div>
      </div>
      <BButton
        @click="props.openAddCombatantModal"
        class="overrideManageCombatantsCont"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        ><div class="overrideManageCombatants">Manage Combatants</div>
        <i class="bi bi-pencil-square"></i
      ></BButton>
    </div>

    <BButton
      v-if="!overrideFull"
      class="manageCombatantsLong"
      @click="props.openAddCombatantModal"
      style="font-size: 1rem; padding: 0.25rem; margin: 0.15rem; border: 2px solid"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
      >Manage Combatants <i class="bi bi-pencil-square"></i
    ></BButton>
    <BButton
      v-if="!overrideFull"
      class="manageCombatantsShort"
      @click="props.openAddCombatantModal"
      style="font-size: 1rem; padding: 0.25rem; margin: 0.15rem; margin-left: 0; border: 2px solid"
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <i class="bi bi-pencil-square"></i
    ></BButton>
  </div>
</template>

<style>
.manageCombatantsLong {
  display: block;
}
.manageCombatantsShort {
  display: none;
}
.initiativeButtons {
  display: block;
}
.overrideFullInitiativeButtons {
  display: block;
  margin-right: 0.15rem;
}
.overrideManageCombatantsCont {
  font-size: 1rem;
  padding: 0.25rem;
  margin: 0.15rem;
  border: 2px solid;
  display: flex;
  justify-content: center;
  width: 30%;
}
.twoHeader {
  display: flex;
  flex-direction: row;
  height: fit-content;
  border: 2px solid;
  border-left: 1px solid;
  border-bottom: 0;
  justify-content: space-between;
}
.overrideManageCombatants {
  display: block;
  margin-right: 0.15rem;
}
.headerContainer {
  border-right: 2px solid;
  z-index: 2;
  display: flex;
  padding-right: 0.25rem;
  flex-direction: row;
}
@media (max-width: 1500px) {
  .initiativeButtons {
    display: block;
    max-width: 2rem;
  }
  .manageCombatantsLong {
    display: none;
  }
  .manageCombatantsShort {
    display: block;
  }
}
@media (max-width: 800px) {
  .overrideManageCombatantsCont {
    font-size: 1rem;
    padding: 0.25rem;
    margin: 0.15rem;
    border: 2px solid;
    display: flex;
    justify-content: center;
    flex-grow: 1;
  }
  .overrideFullInitiativeButtons {
    display: none;
  }
  .headerContainer {
    border-right: 2px solid;
    z-index: 2;
    display: flex;
    padding-right: 0.25rem;
    flex-direction: column;
  }
  .twoHeader {
    display: flex;
    flex-direction: column;
    height: fit-content;
    border: 2px solid;
    border-left: 1px solid;
    border-bottom: 0;
    justify-content: flex-start;
  }
  .initiativeButtons {
    display: block;
    max-width: none;
    width: max-content;
  }
}
@media (max-width: 600px) {
  .overrideManageCombatants {
    display: none;
  }
}
</style>
