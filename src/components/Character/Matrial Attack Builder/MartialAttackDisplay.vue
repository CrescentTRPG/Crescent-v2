<script lang="ts">
import DescriptionHoverDisplay from '@/components/DescriptionHoverDisplay.vue'
import { BButton, BFormInput } from 'bootstrap-vue-next'
import BFormRadio from 'bootstrap-vue-next/src/components/BFormRadio/BFormRadio.vue'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDesignStore } from '../../../stores/designStore.ts'
import AbilityDisplayMedallion from '../../AbilityDisplayMedallion.vue'
import CustomCheckbox from '../CustomCheckbox.vue'

export default {
  emits: ['rollString'],
  props: ['title', 'description', 'mp', 'weaponAttack', 'displayDice', 'attributes', 'icon'],
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const tab = ref('corestats')
    const mode = ref(props.weaponAttack['Universal Skills'].modes[0])
    const strikes = computed(() => {
      return Object.keys(props.weaponAttack).sort()
    })
    const rollStringOverride = ref({})
    const localAttack = ref({})
    onMounted(() => {
      Object.keys(props.weaponAttack).forEach((key) => {
        rollStringOverride.value[key] = {}
        rollStringOverride.value[key].rollstring = getRollstring(key) || ' '
        localAttack.value = props.weaponAttack
      })
    })
    watch(props, async (props, old) => {
      if (props.weaponAttack != localAttack.value) {
        Object.keys(props.weaponAttack).forEach((key) => {
          rollStringOverride.value[key] = {}
          rollStringOverride.value[key].rollstring = getRollstring(key) || ' '
        })
      }
    })

    function updateRollstring(attack) {
      if (attack === 'all') {
        Object.keys(props.weaponAttack).forEach((attack) => {
          rollStringOverride.value[attack].rollstring = getRollstring(attack) || ' '
        })
      } else {
        rollStringOverride.value[attack].rollstring = getRollstring(attack) || ' '
      }
    }
    function constructAttack(attack: string) {
      let attacks = [attack]
      let resistance = Math.max(
        props.attributes.agility.modifier,
        props.attributes.strength.modifier
      )
      if (attack === 'all') {
        attacks = strikes.value
      }
      let ret = ''
      let i = 1
      attacks.forEach((attack) => {
        const raw = rollStringOverride.value[attack].rollstring
        let rolls = raw.split('|')
        if (rolls[0].indexOf('d') <= -1) {
          if (raw.match(/[^\s\\]/)) {
            ret += '(#' + rolls[0] + ' Save#2d10' + ' + ' + resistance + ')'
          }
          i--
        } else {
          ret += '(Strike ' + i + ' |' + rolls[0] + ') '
        }
        if (rolls.length > 1) {
          let toHit = '#Perception#'
          toHit += rolls[1].replace('PER', '2d10')
          toHit += ' + ' + props.attributes.perception.modifier + ') '
          ret += '(Strike ' + i + ' |' + toHit
        }

        if (rolls.length > 2) {
          ret += '(Strike ' + i + ' |' + '#' + rolls[2] + ' Save#2d10' + ' + ' + resistance + ')'
        }
        i++
      })
      context.emit('rollString', ret)
    }
    function getRollstring(strike) {
      let rollstring = props.weaponAttack[strike].rollstring
      if (mode.value === '' && props.weaponAttack[strike].modeObj) {
        mode.value = props.weaponAttack['Universal Skills'].modes[0]
      }
      if (props.weaponAttack[strike].modeObj[mode.value]) {
        rollstring = props.weaponAttack[strike].modeObj[mode.value].rollstring
      }
      if (props.weaponAttack[strike].conditionObj) {
        let conditions = Object.keys(props.weaponAttack[strike].conditionObj)
        conditions.forEach((condition) => {
          if (props.weaponAttack[strike].conditionObj[condition].useCondition) {
            rollstring = props.weaponAttack[strike].conditionObj[condition].alternateRollstring
          }
        })
      }
      return rollstring || ''
    }
    const strikeConditionObj = ref({})

    return {
      designStore,
      tab,
      props,
      strikes,
      getRollstring,
      mode,
      constructAttack,
      updateRollstring,
      rollStringOverride
    }
  },
  components: {
    AbilityDisplayMedallion,
    DescriptionHoverDisplay,
    BFormInput,
    BButton,
    CustomCheckbox,
    BFormRadio
  }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; width: 100%"
    :style="{
      fontFamily: designStore.font,
      background: designStore.primaryTheme,
      color: designStore.primaryText
    }"
  >
    <div style="padding: 0.5rem; white-space: nowrap">{{ props.description }}</div>
    <hr :style="{ color: designStore.secondaryTheme }" />
    <div
      v-if="props.weaponAttack['Universal Skills'].modes.length > 1"
      style="display: flex; margin-left: 0.5rem"
    >
      Modes:
      <div
        style="display: flex"
        :style="{
          '--bs-form-check-bg': designStore.inputBacking,
          borderColor: designStore.primaryText,
          '--input-bg': designStore.alertTheme
        }"
      >
        <BFormRadio
          style="margin: 0.25rem"
          v-model="mode"
          v-for="o in props.weaponAttack['Universal Skills'].modes"
          :value="o"
          :key="o.name"
          @change="updateRollstring('all')"
        >
          {{ o }}
        </BFormRadio>
      </div>
    </div>
    <div v-for="strike in strikes" :key="strike">
      <div style="display: flex">
        <div
          style="
            display: flex;
            justify-content: space-between;
            flex-grow: 1;
            padding-right: 0.5rem;
            flex-wrap: wrap;
          "
        >
          <div
            style="padding: 0.5rem; display: flex; width: 50%; flex-wrap: wrap"
            v-if="!props.displayDice"
          >
            <div
              style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between"
              v-if="
                props.weaponAttack[strike].rollstring ||
                props.weaponAttack[strike].alternateRollstring ||
                props.weaponAttack[strike].skills.length > 0 ||
                props.weaponAttack[strike].modeObj
              "
            >
              <div style="padding: 0.5rem; white-space: nowrap; text-align: start">
                {{ strike }}:
              </div>

              <BFormInput
                :style="{
                  borderColor: designStore.secondaryTheme,
                  background: designStore.inputBacking,
                  color: designStore.inputText,
                  '--bs-secondary-color': designStore.inputText
                }"
                style="height: 2.5rem; min-width: 8rem"
                :placeholder="getRollstring(strike)"
              ></BFormInput>
            </div>
            <div v-if="props.weaponAttack[strike].conditionObj">
              <div
                style="
                  display: flex;
                  border: 2px solid;
                  border-radius: 0.375rem;
                  padding-right: 2rem;
                  width: 12.5rem;
                  margin-top: 0.5rem;
                "
                :key="condition"
                v-for="condition in Object.keys(props.weaponAttack[strike].conditionObj)"
              >
                <DescriptionHoverDisplay
                  style="width: 10rem"
                  :notBordered="true"
                  name="condition active?"
                  :description="props.weaponAttack[strike].conditionObj[condition].condition"
                ></DescriptionHoverDisplay>
                <CustomCheckbox
                  :isChecked="props.weaponAttack[strike].conditionObj[condition].useCondition"
                  @click="
                    props.weaponAttack[strike].conditionObj[condition].useCondition =
                      !props.weaponAttack[strike].conditionObj[condition].useCondition
                  "
                  :update="0"
                  style="transform: translate(-1rem, -0.15rem); width: 0rem"
                ></CustomCheckbox>
              </div>
            </div>
          </div>
          <div
            v-if="!props.displayDice"
            style="display: flex; justify-content: flex-end; max-width: 50%; flex-wrap: wrap"
          >
            <DescriptionHoverDisplay
              v-for="skill in props.weaponAttack[strike].skills"
              :key="skill.name"
              :name="skill.name"
              :description="skill.description"
            ></DescriptionHoverDisplay>
          </div>
        </div>
      </div>
      <div style="padding: 0.5rem; display: flex; flex-wrap: wrap" v-if="props.displayDice">
        <div style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-between">
          <div style="padding: 0.5rem; white-space: nowrap; text-align: start">{{ strike }}:</div>
          <div style="display: flex; width: 100%" v-if="rollStringOverride[strike]?.rollstring">
            <BFormInput
              :style="{
                borderColor: designStore.secondaryTheme,
                background: designStore.inputBacking,
                color: designStore.inputText,
                '--bs-secondary-color': designStore.inputText
              }"
              v-model="rollStringOverride[strike].rollstring"
              style="height: 2.5rem"
              :placeholder="getRollstring(strike)"
            ></BFormInput>
            <BButton
              @click="constructAttack(strike)"
              v-if="props.displayDice"
              style="
                border: 1px solid;
                padding-right: 0.75rem;
                padding-left: 0.75rem;
                margin: 0.25rem;
                margin-top: 0;
                height: 2.5rem;
              "
              :style="{ borderColor: designStore.secondaryTheme }"
              ><i class="bi bi-dice-6"></i
            ></BButton>
          </div>
        </div>
        <div v-if="props.weaponAttack[strike].conditionObj">
          <div
            style="
              display: flex;
              border: 2px solid;
              border-radius: 0.375rem;
              margin-left: 0.5rem;
              padding-right: 2rem;
              width: 12.5rem;
              margin-top: 0.5rem;
            "
            :key="condition"
            v-for="condition in Object.keys(props.weaponAttack[strike].conditionObj)"
          >
            <DescriptionHoverDisplay
              style="width: 10rem"
              :notBordered="true"
              name="condition active?"
              :description="props.weaponAttack[strike].conditionObj[condition].condition"
            ></DescriptionHoverDisplay>
            <CustomCheckbox
              :isChecked="props.weaponAttack[strike].conditionObj[condition].useCondition"
              @click="
                ((props.weaponAttack[strike].conditionObj[condition].useCondition =
                  !props.weaponAttack[strike].conditionObj[condition].useCondition),
                updateRollstring(strike))
              "
              :update="0"
              style="transform: translate(-1rem, -0.15rem); width: 0rem"
            ></CustomCheckbox>
          </div>
        </div>

        <div
          v-if="!props.displayDice"
          style="display: flex; justify-content: flex-end; max-width: 50%; flex-wrap: wrap"
        >
          <DescriptionHoverDisplay
            v-for="skill in props.weaponAttack[strike].skills"
            :key="skill.name"
            :name="skill.name"
            :description="skill.description"
          ></DescriptionHoverDisplay>
        </div>
      </div>

      <hr v-if="!props.displayDice" :style="{ color: designStore.secondaryTheme }" />
    </div>
    <BButton
      @click="constructAttack('all')"
      v-if="props.displayDice"
      style="
        border: 1px solid;
        padding-right: 0.75rem;
        padding-left: 0.75rem;
        margin: 0.25rem;
        margin-top: 0;
        height: 2.5rem;
      "
      :style="{ borderColor: designStore.secondaryTheme }"
      ><i class="bi bi-dice-6"></i> Roll All <i class="bi bi-dice-6"></i
    ></BButton>
    <AbilityDisplayMedallion :medallion="props.icon"></AbilityDisplayMedallion>
  </div>
</template>

<style>
.abilityGrid {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  z-index: 4;
  border: 2px solid;
  border-bottom: 2px solid;
  margin-top: -1.5rem;
  grid-gap: 0.05rem;
  justify-content: space-around;
}
.grid__item {
  padding: 0.25rem;
  position: relative;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
  padding-top: 0.25rem;
  text-wrap: wrap;
}
@media (max-width: 1000px) {
  .abilityGrid {
    grid-template-rows: auto auto auto;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
