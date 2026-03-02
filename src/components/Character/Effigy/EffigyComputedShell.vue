<script lang="ts">
import { useCharacterComputedStore } from '@/stores/characterComputedStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import { computed } from 'vue'
import EffigyStateReference from './EffigyStateReference.vue'

export default {
  props: ['effigy', 'updateEffigy'],
  setup(props, context) {
    const designStore = useDesignStore()
    const characterComputedStore = useCharacterComputedStore()

    const effigyTotalHp = computed(() => {
      let mod = 0
      Object.values(props.effigy.minorBonuses).forEach((bonus: any) => {
        if (bonus.includes('HP')) {
          mod += 5
        }
      })
      Object.values(props.effigy.majorBonuses).forEach((bonus: any) => {
        if (bonus.includes('HP')) {
          mod += 15
        }
      })

      return characterComputedStore.totalHp / 2 + mod
    })

    const effigyTotalMana = computed(() => {
      let mod = 0
      Object.values(props.effigy.minorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Mana')) {
          mod += 2
        }
      })
      Object.values(props.effigy.majorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Mana')) {
          mod += 6
        }
        if (bonus.includes('spell')) {
          mod += 3
        }
      })

      return props.effigy.effigyType === 'caster' ? mod + parseInt(' ' + props.effigy.level) : mod
    })

    const effigyArmorDvs = computed(() => {
      let mod = 0
      Object.values(props.effigy.minorBonuses).forEach((bonus: any) => {
        if (bonus.includes('DV')) {
          mod += 2
        }
      })

      return parseInt(' ' + props.effigy.level) + mod
    })
    const effigyMoveDvs = computed(() => {
      return 10
    })
    const effigyTotalDvs = computed(() => {
      return effigyArmorDvs.value + effigyMoveDvs.value
    })
    const effigyLand = computed(() => {
      let mod = 0
      Object.values(props.effigy.majorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Land')) {
          mod += 30
        }
      })
      Object.values(props.effigy.minorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Land')) {
          mod += 15
        }
      })
      return props.effigy.movementType === 'Land' ? 30 + mod + "'" : 0 + mod + "'"
    })

    const effigyFlight = computed(() => {
      let mod = 0
      Object.values(props.effigy.majorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Flight')) {
          mod += 30
        }
      })
      Object.values(props.effigy.minorBonuses).forEach((bonus: any) => {
        if (bonus.includes('Flight')) {
          mod += 15
        }
      })
      return props.effigy.movementType === 'Flight' ? 30 + mod + "'" : 0 + mod + "'"
    })

    const rangedAttack = computed(() => {
      return props.effigy.level === 5
        ? '1d12'
        : props.effigy.level === 4
          ? '1d10'
          : props.effigy.level === 3
            ? '1d6'
            : 'none'
    })
    const meleeAttack = computed(() => {
      return props.effigy.level === 5
        ? '2d10'
        : props.effigy.level === 4
          ? '2d8'
          : props.effigy.level === 3
            ? '1d10'
            : props.effigy.level === 2
              ? '1d8'
              : props.effigy.level === 1
                ? '1d6'
                : 'none'
    })
    return {
      props,
      designStore,
      characterComputedStore,
      effigyTotalHp,
      effigyTotalMana,
      effigyTotalDvs,
      meleeAttack,
      rangedAttack,
      effigyLand,
      effigyFlight
    }
  },
  components: {
    // TitleWidget,
    // DropdownSelect
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    EffigyStateReference
  }
}
</script>
<template>
  <div>
    <EffigyStateReference
      :effigy="props.effigy"
      :update-effigy="props.updateEffigy"
      :totalHp="effigyTotalHp"
      :totalMana="effigyTotalMana"
      :totalDvs="effigyTotalDvs"
      :meleeAttack="meleeAttack"
      :rangedAttack="rangedAttack"
      :effigyLand="effigyLand"
      :effigyFlight="effigyFlight"
    ></EffigyStateReference>
  </div>
</template>
<style></style>
