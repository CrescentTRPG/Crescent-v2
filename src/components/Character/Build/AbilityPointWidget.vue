<script lang="ts">
import { useRouter } from 'vue-router'
import { BInputGroup, BFormInput, BInputGroupText } from 'bootstrap-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useSkillStore } from '@/stores/skillsStore'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import CustomModal from '@/components/CustomModal.vue'
import { useUserStore } from '@/stores/userStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { useSpellStore } from '@/stores/spellsStore'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const skillStore = useSkillStore()
    const martialSkillsStore = useMartialSkillsStore()
    const martialPerksStore = useMartialPerksStore()
    const spellsStore = useSpellStore()
    const { skills } = storeToRefs(skillStore)
    const { combatStyles, specializations } = storeToRefs(martialSkillsStore)
    const { martialPerks } = storeToRefs(martialPerksStore)
    const { totalAbilityPoints } = storeToRefs(characterStore)
    const { spellgroups, manualSpellgroups } = storeToRefs(spellsStore)

    const totalAbilityPointsRef = ref(totalAbilityPoints.value)

    onMounted(() => {
      characterStore.setLocalSpentAbilityPoints(spentAbilityPoints.value)
    })

    function rankSum(val: number) {
      if (isNaN(val)) {
        return 0
      }
      if (val <= 0) {
        return 0
      }
      if (val == 1) {
        return 1
      } else {
        return val + rankSum(val - 1)
      }
    }
    function updateSpentAbilityPoints(points: number) {
      characterStore.setLocalSpentAbilityPoints(points)
    }
    function updateTotalAbilityPoints() {
      characterStore.setTotalAbilityPoints(
        totalAbilityPointsRef.value,
        userStore.getUserId,
        characterStore.getCharacterId
      )
    }
    const spentAbilityPoints = computed(() => {
      let counter = 0
      counter += rankSum(parseInt(spellsStore.arcaneBattery + ''))
      Object.values(skills.value).forEach((val: any) => (counter += rankSum(val.rank)))
      Object.values(combatStyles.value).forEach((val: any) => (counter += rankSum(val.rank)))
      Object.values(specializations.value).forEach((val: any) => (counter += rankSum(val.rank)))
      Object.values(martialPerks.value).forEach((val: any) => {
        if (val) {
          counter += val.rank * 3
        }
      })
      Object.values(spellgroups.value).forEach((val: any) => {
        Object.values(val.spells).forEach((spell: any) => {
          if (spell.known) {
            if (manualSpellgroups.value[spell.spellgroup].flatCost) {
              counter += val.baseCost
            } else {
              counter += val.baseCost * spell.rank
            }
          }
        })
      })
      return counter
    })
    const level = computed(() => {
      return Math.floor(totalAbilityPoints.value / 10)
    })
    watch(totalAbilityPoints, (newVal, oldVal) => {
      if (totalAbilityPointsRef.value != totalAbilityPoints.value)
        totalAbilityPointsRef.value = totalAbilityPoints.value
    })
    watch(spentAbilityPoints, (newVal, oldVal) => {
      console.log(spentAbilityPoints.value, oldVal, newVal)
      if (oldVal != newVal) updateSpentAbilityPoints(newVal)
    })

    return {
      designStore,
      skills,
      totalAbilityPoints,
      modal,
      totalAbilityPointsRef,
      userStore,
      characterStore,
      combatStyles,
      specializations,
      martialPerks,
      spellgroups,
      manualSpellgroups,
      spellsStore,
      spentAbilityPoints,
      level,
      updateSpentAbilityPoints,
      updateTotalAbilityPoints
    }
  },
  components: {
    CustomModal,
    BInputGroup,
    BFormInput,
    BInputGroupText
  }
}
</script>

<template>
  <div
    :style="{ color: designStore.inputText }"
    style="
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      width: min-content;
      z-index: 2;
      flex-grow: 1;
      cursor: pointer;
    "
    @click="modal = true"
  >
    <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
      <div
        style="display: flex; justify-content: space-between; margin-left: 1rem"
        class="pointsContainer"
      >
        <div style="display: flex; flex-direction: row">
          <div style="display: flex; flex-direction: column">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
              :style="{ fontFamily: designStore.titleFont }"
            >
              {{ spentAbilityPoints }}
            </div>
            <div style="align-self: center">Spent</div>
          </div>
          <i
            class="bi bi-slash-lg"
            style="
              align-self: center;
              font-size: 3rem;
              transform: skew(25deg);
              margin-right: -0.75rem;
              margin-left: -0.5rem;
            "
            :style="{ color: designStore.secondaryTheme }"
          ></i>
          <div style="display: flex; flex-direction: column">
            <div
              style="align-self: center; font-size: xx-large; margin: 0.5rem; margin-bottom: -1rem"
              :style="{ fontFamily: designStore.titleFont }"
            >
              {{ totalAbilityPoints }}
            </div>
            <div style="align-self: center">Total</div>
          </div>
        </div>
        <div class="level">
          <div style="font-size: medium; align-self: center; padding-top: 0.5rem">Lvl.</div>
          <div
            :style="{ fontFamily: designStore.titleFont }"
            style="margin-top: -1rem; align-self: center"
          >
            {{ level }}
          </div>
        </div>
      </div>
    </div>
    <CustomModal :showModal="modal" title="Set Total Ability Points" @close="modal = !modal">
      <template v-slot:body>
        <BInputGroup
          style="border: 3px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BInputGroupText
            style="width: 10rem"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >Total Ability Points</BInputGroupText
          >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="0"
            max="10"
            @change="updateTotalAbilityPoints()"
            v-model="totalAbilityPointsRef"
          ></BFormInput> </BInputGroup
      ></template>
    </CustomModal>
  </div>
</template>

<style scoped>
.pointsContainer {
  margin-left: 1rem;
}
.level {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: xx-large;
  margin-left: 1rem;
}
@media (max-width: 600px) {
  .level {
    display: none;
  }
  .pointsContainer {
    margin-left: 0;
  }
}
</style>
