<script lang="ts">
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { storeToRefs } from 'pinia'
import { useDesignStore } from '../../../stores/designStore.ts'
import PassiveListObj from './PassiveListObj.vue'

export default {
  props: ['item'],
  setup(props, context) {
    const designStore = useDesignStore()
    const spellsStore = useSpellStore()
    const { manualSpellgroups } = storeToRefs(spellsStore)
    return { designStore, manualSpellgroups, props }
  },

  methods: {},
  components: { AbilityDisplay, TitleMedallion, PassiveListObj }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <div style="display: flex; justify-content: flex-start; flex-wrap: wrap; margin-top: -0.75rem">
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        class="slightlySpaced"
      >
        Amount: {{ props.item.count }}
      </div>
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        class="slightlySpaced"
      >
        Type: {{ props.item.type }}
      </div>
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        v-if="props.item.isAttuneable"
        class="slightlySpaced"
      >
        Is Attuneable?: Yes
      </div>
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        v-if="!props.item.isAttuneable"
        class="slightlySpaced"
      >
        Is Attuneable?: No
      </div>
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        v-if="props.item.isAttuned"
        class="slightlySpaced"
      >
        Is Attuned?: Yes
      </div>
      <div
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
        v-if="!props.item.isAttuned"
        class="slightlySpaced"
      >
        Is Attuned?: No
      </div>
    </div>
    <div
      v-if="
        props.item.type === 'Armor' || props.item.type === 'Shield' || props.item.type === 'Weapon'
      "
    >
      <TitleMedallion :title="props.item.type" :color="designStore.primaryText"></TitleMedallion>
      <div style="display: flex; justify-content: flex-start; flex-wrap: wrap">
        <div
          v-if="props.item.type === 'Armor'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          Weight: {{ props.item.equippedStats.weight }}
        </div>
        <div
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          Material: {{ props.item.equippedStats.material }}
        </div>
        <div
          v-if="props.item.type === 'Armor' || props.item.type === 'Shield'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          Protection Value: {{ props.item.equippedStats.value }}
        </div>
        <div
          v-if="props.item.type === 'Weapon'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          # Hands: {{ props.item.equippedStats.hands }}
        </div>
        <div
          v-if="props.item.type === 'Weapon'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          Reach/Range: {{ props.item.equippedStats.range }}'
        </div>
        <div
          v-if="props.item.type === 'Weapon'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          STR Requirement: {{ props.item.equippedStats.strReq }}
        </div>
        <div
          v-if="props.item.type === 'Weapon'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          Damage String: {{ props.item.equippedStats.damageString }}
        </div>

        <div
          v-if="props.item.equippedStats.isMusical && props.item.type === 'Weapon'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          Is Musical?: Yes
        </div>
        <div
          v-if="!props.item.equippedStats.isMusical && props.item.type === 'Weapon'"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          class="slightlySpaced"
        >
          Is Musical?: No
        </div>
      </div>
      <div
        style="
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          width: 100%;
          margin-top: 0.5rem;
        "
        v-if="props.item.type === 'Weapon'"
      >
        <div style="display: flex">
          Specializations:
          <div
            v-for="(spec, index) in props.item.equippedStats.specializations"
            style="padding-left: 0.5rem; display: flex"
            :key="spec"
          >
            {{ spec }}
            <div v-if="parseInt(index + '') < props.item.equippedStats.specializations.length - 1">
              ,
            </div>
          </div>
        </div>
        <div style="display: flex">
          Combat Styles:
          <div
            v-for="(style, index) in props.item.equippedStats.combatStyles"
            style="padding-left: 0.5rem; display: flex"
            :key="style"
          >
            {{ style }}
            <div v-if="parseInt(index + '') < props.item.equippedStats.combatStyles.length - 1">
              ,
            </div>
          </div>
        </div>
      </div>
      <div style="display: flex" v-if="props.item.type === 'Weapon'">
        Damage Types:
        <div
          v-for="(damage, index) in props.item.equippedStats.weaponDamageTypes"
          style="padding-left: 0.5rem; display: flex"
          :key="damage"
        >
          {{ damage }}
          <div v-if="parseInt(index + '') < props.item.equippedStats.weaponDamageTypes.length - 1">
            ,
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="
        Object.values(props.item.equippedStats.passives).length > 0 &&
        (props.item.type === 'Weapon' ||
          props.item.type === 'Armor' ||
          props.item.type === 'Shield')
      "
    >
      <div style="font-size: large" :style="{ fontFamily: designStore.titleFont }">Passives:</div>
      <hr
        :style="{ color: designStore.secondaryTheme }"
        style="margin-bottom: -0.25rem; margin-top: 0.25rem"
      />
      <PassiveListObj
        v-for="passive in Object.values(props.item.equippedStats.passives) as Array<any>"
        :key="passive.modifierType"
        :mod-amount="passive.modAmount"
        :modifier-type="passive.name"
        :damageType="passive.damageType"
        :deleteable="false"
      ></PassiveListObj>
    </div>
    <div style="font-size: large" :style="{ fontFamily: designStore.titleFont }">Description:</div>
    <hr
      style="margin-bottom: -0.25rem; margin-top: 0.25rem"
      :style="{ color: designStore.secondaryTheme }"
    />
    <div>{{ props.item.description }}</div>
    <div v-if="props.item.equippedStats.ability.name">
      <TitleMedallion
        :title="props.item.equippedStats.ability.name"
        :color="designStore.primaryText"
        style="margin-bottom: 1rem"
      ></TitleMedallion>
      <div
        v-if="props.item.equippedStats.ability.uses"
        style="
          z-index: 10;
          position: relative;
          bottom: 1.5rem;
          text-align: start;
          width: 100%;
          padding-left: 2rem;
        "
        :style="{ color: designStore.primaryText }"
      >
        Uses: {{ props.item.equippedStats.ability.uses }}
      </div>
      <AbilityDisplay
        v-if="
          props.item.equippedStats.ability.spellgroup ||
          props.item.equippedStats.ability.perkGroup ||
          (!(
            props.item.equippedStats.ability.attributes ||
            props.item.equippedStats.ability.combatStyles
          ) &&
            !props.item.equippedStats.ability.skill)
        "
        :medallion="
          props.item.equippedStats.ability.groupIcon ||
          manualSpellgroups[props.item.equippedStats.ability.spellgroup]?.groupIcon
        "
        :description="props.item.equippedStats.ability.description"
        :area="props.item.equippedStats.ability.area"
        :duration="props.item.equippedStats.ability.duration"
        :action-cost="props.item.equippedStats.ability.actionCost"
        :resistance="props.item.equippedStats.ability.resistance"
        :target="props.item.equippedStats.ability.target"
        :type="props.item.equippedStats.ability.type"
      ></AbilityDisplay>
    </div>
    <AbilityDisplay
      style="margin-top: 2rem"
      v-if="props.item.type === 'Potion'"
      :medallion="props.item.ability.groupIcon"
      :description="props.item.ability.description"
      :area="props.item.ability.area"
      :duration="props.item.ability.duration"
      :action-cost="props.item.ability.actionCost"
      :resistance="props.item.ability.resistance"
      :target="props.item.ability.target"
      :type="props.item.ability.type"
    ></AbilityDisplay>
  </div>
</template>

<style>
.slightlySpaced {
  margin-right: 0.5rem;
  border: 1px solid;
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-top: 0.5rem;
}
</style>
