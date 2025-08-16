<script lang="ts">
import { DEFAULT_STAT_BLOCK } from '@/bases'
import ArrayTabs from '@/components/ArrayTabs.vue'
import { useDesignStore } from '@/stores/designStore'
import { BButton } from 'bootstrap-vue-next'
import { computed, onMounted, Ref, ref } from 'vue'
import PowerLevelIcon from './PowerLevelIcon.vue'
import CustomModal from '@/components/CustomModal.vue'
import IconPicker from '@/components/IconPicker.vue'
import CustomCheckbox from '@/components/Character/CustomCheckbox.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'

export default {
  props: ['currentStatBlock'],
  setup(props, context) {
    const designStore = useDesignStore()
    const modal = ref(false)
    const overridePowerLevel = ref('')
    const spendProfile = computed(() => {
      let totalSpend = 0
      let highestRankSpend = ''
      let highestRankSpendAmount = 0
      let defensiveExceptionalScore = 0
      let offensiveExceptionalScore = 0
      let defensiveTraitsScore = 0
      let healthScore = props.currentStatBlock.attributes.health / 10 + 0.5
      let willpowerScore = props.currentStatBlock.attributes.willpower / 10 + 0.5
      let agilityScore = props.currentStatBlock.attributes.agility / 10 + 0.5

      if (props.currentStatBlock.traits) {
        let traits = Object.values(props.currentStatBlock.traits)
        traits.forEach((t: any) => {
          if (t.name?.includes('Resistance')) {
            defensiveTraitsScore += 1.5
          }
          if (t.name?.includes('Susceptibility')) {
            defensiveTraitsScore -= 1.5
          }
          if (t.name?.includes('Immunity')) {
            defensiveTraitsScore += 2
          }
          if (t.name?.includes('Vulnerability')) {
            defensiveTraitsScore -= 2
          }
          if (
            t.name === 'Exceptional Willpower' ||
            t.name === 'Exceptional Health' ||
            t.name === 'Exceptional Agility'
          ) {
            defensiveExceptionalScore += t.number
          }
          if (
            t.name === 'Exceptional Power' ||
            t.name === 'Exceptional Perception' ||
            t.name === 'Exceptional Strength'
          ) {
            offensiveExceptionalScore += t.number
          }
        })
      }
      if (defensiveTraitsScore < 0) {
        defensiveTraitsScore = -1 / defensiveTraitsScore
      } else if (defensiveTraitsScore === 0) {
        defensiveTraitsScore = 1
      }
      let totalDvs =
        props.currentStatBlock.armorDvs +
        props.currentStatBlock.shieldDvs +
        props.currentStatBlock.moveDvs +
        props.currentStatBlock.bonusDvs
      let dvScore =
        totalDvs <= 10
          ? 0.5
          : totalDvs <= 13
            ? 0.9
            : totalDvs <= 15
              ? 1
              : totalDvs <= 23
                ? (totalDvs - 15) / 5 + 1
                : totalDvs - 23 + 2
      let hp = props.currentStatBlock.totalHp / 30 || 0
      let mana = props.currentStatBlock.totalMana / 5 || 0
      let maxRankSpellGroupIcon = ''

      let acc = 0
      let spellgroups: Array<any> = Object.values(props.currentStatBlock.spells)
      spellgroups.forEach((spellgroup) => {
        let maxRank = Object.values(spellgroup.spells).reduce(
          (acc: number, mod: any) => (mod.rank > acc ? mod.rank : acc),
          0
        )
        console.log(maxRank, spellgroup.icon)
        if (maxRank > acc) {
          acc = maxRank
          maxRankSpellGroupIcon = spellgroup.groupIcon
        }
      })
      let maxRankSpell = acc
      let maxRankSpecializationIcon = ''
      let specAcc = 0
      let maxRankCombatStyleIcon = ''
      let specializations: Array<any> = Object.values(props.currentStatBlock.specializations)
      specializations.forEach((specialization) => {
        if (specialization.rank > specAcc) {
          specAcc = specialization.rank
          maxRankSpecializationIcon = specialization.groupIcon || 'gi-uncertainty'
        }
      })
      let combatStyles: Array<any> = Object.values(props.currentStatBlock.combatStyles)
      combatStyles.forEach((combatStyle) => {
        if (combatStyle.rank > specAcc) {
          maxRankCombatStyleIcon = combatStyle.groupIcon || 'gi-uncertainty'
        }
      })

      let mp = Math.max(props.currentStatBlock.mp - 10, 0) + props.currentStatBlock.mp / 2
      let perks = props.currentStatBlock.perks
        ? Object.values(props.currentStatBlock.perks).length
        : 0
      let speedFactor =
        (props.currentStatBlock.base -
          30 +
          props.currentStatBlock.flight * 2 +
          props.currentStatBlock.swimming +
          props.currentStatBlock.climbing * 1.5 +
          props.currentStatBlock.burrowing * 2) /
        30

      return {
        mp: mp,
        mana: mana,
        tankScore:
          hp === 0
            ? 0
            : hp *
                dvScore *
                defensiveTraitsScore *
                ((healthScore + willpowerScore + agilityScore) / 3) +
              defensiveExceptionalScore,
        speedFactor: speedFactor,
        perks: perks,
        maxRankSpell: maxRankSpell / 2,
        maxRankSpellGroupIcon: maxRankSpellGroupIcon,
        maxRankCombatStyleIcon: maxRankCombatStyleIcon,
        maxRankSpecializationIcon: maxRankSpecializationIcon
      }
    })
    const powerLevel = computed(() => {
      let level = Math.floor(
        spendProfile.value.mp +
          spendProfile.value.mana +
          spendProfile.value.tankScore +
          spendProfile.value.speedFactor +
          spendProfile.value.perks +
          spendProfile.value.maxRankSpell
      )
      context.emit('power', level)

      return level
    })
    const powerIcon = computed(() => {
      let icon = calculateIcon(spendProfile.value)
      context.emit('powerIcon', icon)
      return icon
    })
    const overrideIcon = ref('')
    onMounted(() => {
      overrideIcon.value = props.currentStatBlock.overrideIcon
    })

    function calculateIcon(spendProfile) {
      if (spendProfile.maxRankSpell > spendProfile.mp) {
        return spendProfile.maxRankSpellGroupIcon
      } else if (spendProfile.mp >= spendProfile.maxRankSpell) {
        return spendProfile.maxRankSpecializationIcon
          ? spendProfile.maxRankSpecializationIcon
          : spendProfile.maxRankCombatStyleIcon
      }
      return 'gi-person-icon'
    }
    function setIcon(icon) {
      overrideIcon.value = icon
      context.emit('overrideIcon', overrideIcon.value)
    }

    function clearOverrideIcon() {
      overrideIcon.value = ''
      context.emit('overrideIcon', '')
    }
    function sendOverrideValue() {
      context.emit('overridePowerLevel', overridePowerLevel)
    }

    return {
      designStore,
      props,
      powerLevel,
      modal,
      calculateIcon,
      spendProfile,
      setIcon,
      overrideIcon,
      powerIcon,
      clearOverrideIcon,
      overridePowerLevel,
      sendOverrideValue
    }
  },
  components: { PowerLevelIcon, CustomModal, IconPicker, BButton, BFormInput }
}
</script>
<template>
  <div>
    <PowerLevelIcon
      :current-stat-block="props.currentStatBlock"
      :powerLevel="overridePowerLevel ? overridePowerLevel : powerLevel"
      :icon="overrideIcon ? overrideIcon : powerIcon"
      @click="modal = true"
    ></PowerLevelIcon>
    <CustomModal :showModal="modal" title="Power Level" @close="modal = false">
      <template v-slot:body>
        <div style="display: flex">
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            Calculated Power Icon
            <div style="width: 5rem; align-self: center">
              <PowerLevelIcon
                style="margin: 0.75rem"
                :style="{ color: designStore.inputText }"
                :current-stat-block="props.currentStatBlock"
                :powerLevel="powerLevel"
                :icon="powerIcon"
                @click="modal = true"
              ></PowerLevelIcon>
            </div>
          </div>
          <div style="margin: 0.75rem">
            This icon represents a combination of the computed power level of a combatant as well as
            their most invested abilities. You can use the computed visual shown here, or override
            both the icon design and the number. The combined Power Level of opponents should
            roughly total the levels of the players for an even encounter. The difficulty will vary
            depending on the individual abilities of the players compared to the opponent.
          </div>
        </div>
        <div style="display: flex">
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            Override Icon

            <IconPicker
              style="align-self: center"
              :currentIcon="overrideIcon || calculateIcon(spendProfile)"
              @selectedIcon="(icon) => setIcon(icon)"
              orientation="left"
            ></IconPicker>
            <BButton
              style="
                position: relative;
                padding: 0.15rem;
                bottom: 1rem;
                left: 2rem;
                align-self: center;
              "
              @click="clearOverrideIcon()"
            >
              <v-icon
                name="gi-plain-circle"
                :style="{ color: designStore.primaryTheme }"
                style="position: absolute; z-index: 3"
                scale="1.5"
              ></v-icon>
              <v-icon name="gi-cancel" style="z-index: 4; position: relative" scale="1.5"></v-icon
            ></BButton>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            <div>Override Power Level</div>
            <BFormInput
              v-model="overridePowerLevel"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              style="
                font-size: x-large;
                height: 4rem;
                margin-bottom: 2rem;
                margin-top: 0.25rem;
                width: 4rem;
                align-self: center;
                text-align: center;
              "
              @change="sendOverrideValue()"
            ></BFormInput>
          </div>
        </div>
      </template>
    </CustomModal>
  </div>
</template>
<style></style>
