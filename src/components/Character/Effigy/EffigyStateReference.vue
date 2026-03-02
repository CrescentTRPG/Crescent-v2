<script lang="ts">
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useCharacterComputedStore } from '@/stores/characterComputedStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import _ from 'lodash'
import EffigyBasicStatDisplay from './EffigyBasicStatDisplay.vue'

export default {
  props: [
    'effigy',
    'updateEffigy',
    'totalHp',
    'totalMana',
    'totalDvs',
    'rangedAttack',
    'meleeAttack',
    'effigyLand',
    'effigyFlight'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    const characterComputedStore = useCharacterComputedStore()

    function changeIsAscendant(val) {
      if (val) {
        if (props.effigy.level < 5) {
          alert('Effigy must be level 5 to be Ascendant.')
          return
        }
      }
      let copy = _.cloneDeep(props.effigy)
      copy.isAscendant = val
      props.updateEffigy(copy)
    }
    function getTypeColor(type) {
      if (type === props.effigy.isAscendant) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }
    function getTypeBoxShadow(type) {
      if (type === props.effigy.isAscendant) {
        return '0px 0px 10px 3px ' + designStore.alertTheme
      }
      return 'none'
    }

    return {
      props,
      designStore,
      characterComputedStore,
      getTypeColor,
      getTypeBoxShadow,
      changeIsAscendant
    }
  },
  components: {
    // TitleWidget,
    // DropdownSelect
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    EffigyBasicStatDisplay,
    TitleMedallion
  }
}
</script>
<template>
  <div class="arrangeEffigyStats">
    <EffigyBasicStatDisplay
      class="scaleEffigyStats"
      :value="props.totalHp"
      label="HP"
      icon="bi bi-heart-fill"
      modal-title="Effigy HP"
    >
      <template v-slot:body>
        <div>
          An effigy's HP is derived from the HP of the Caster/2. This may be modified by major/minor
          bonuses or magical items.
        </div>
      </template>
    </EffigyBasicStatDisplay>
    <EffigyBasicStatDisplay
      class="scaleEffigyStats"
      :value="totalMana"
      label="Mana"
      icon="bi bi-book-fill"
      :modal-title="'Effigy Mana'"
    >
      <template v-slot:body>
        <div>
          An effigy will have mana equal to their ranks in spellgroups. This amount of mana may also
          be modified by bonuses or magical items.
        </div>
      </template>
    </EffigyBasicStatDisplay>
    <EffigyBasicStatDisplay
      class="scaleEffigyStats"
      :value="props.totalDvs"
      label="Dvs"
      icon="bi bi-shield-fill"
      :modal-title="'Effigy DVs'"
    >
      <template v-slot:body>
        <div>
          An effigy will have base Armor DV's Equivalent to their level. This may be modified by
          equipping armor on the eqipment tab
        </div>
      </template>
    </EffigyBasicStatDisplay>
    <effigy-basic-stat-display
      class="scaleEffigyStats"
      :is-dual="true"
      icon-shift="1.3rem"
      icon2-shift="1rem"
      icon="gi-blaster"
      icon2="gi-punch"
      :value="rangedAttack"
      :value2="meleeAttack"
      :modal-title="'Effigy Base Attacks'"
      ><template v-slot:body>
        <div>
          Every Effigy has a basic ability to make a melee and ranged attack. These attacks can be
          flavored to come from whatever mechanism you like. The attack strengh scales with the
          effigy's level and deal the effigy's damage type. Effigy's may also weild weapons and
          attack with those, in which case the attack damage and die value would come from the
          weapon and not the effigy's base abilities.
        </div>
      </template></effigy-basic-stat-display
    >
    <effigy-basic-stat-display
      class="scaleEffigyStats"
      :is-dual="true"
      icon="gi-heart-wings"
      icon2="gi-run"
      :value="props.effigyFlight"
      :value2="props.effigyLand"
      :modal-title="'Effigy Movespeed'"
    >
      <template v-slot:body>
        <div>
          Every Effigy have a base movement type that can be set in their Base Properties section.
          This determines their initial speed. Effigies also get faster with each level and may
          select minor/major monuses to grant a new movement type or make an existing one faster.
        </div>
      </template>
    </effigy-basic-stat-display>
    <EffigyBasicStatDisplay
      class="scaleEffigyStats"
      icon="bi bi-person-fill"
      :addFlair="props.effigy.isAscendant"
      :lilLabel="props.effigy.isAscendant ? 'Ascendant' : 'Default'"
      modal-title="Is this Effigy Ascendant?"
    >
      <template v-slot:body>
        <div class="effigySelectContainer">
          <div
            @click="changeIsAscendant(false)"
            class="effigyTypeSelect hoverableTransparantLinear"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: getTypeColor(false),
              boxShadow: getTypeBoxShadow(false)
            }"
          >
            <TitleMedallion title="Default"></TitleMedallion>
            <div style="display: flex">
              <v-icon name="gi-rock-golem" scale="5"></v-icon>
              <div style="text-align: end; align-self: center">The Default State of an effigy</div>
            </div>
          </div>
          <div
            class="effigyTypeSelect hoverableTransparantLinear"
            @click="changeIsAscendant(true)"
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: getTypeColor(true),
              boxShadow: getTypeBoxShadow(true)
            }"
          >
            <TitleMedallion title="Ascendant"></TitleMedallion>

            <div style="display: flex; justify-content: space-between">
              <v-icon name="gi-angel-outfit" scale="5"></v-icon>
              <div style="text-align: end; align-self: center">
                An Effigy that has undergone the Ascendant Effigy Ritual.
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </template>
    </EffigyBasicStatDisplay>
  </div>
</template>
<style>
.arrangeEffigyStats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 25rem;
  padding-left: 10%;
}
.scaleEffigyStats {
  transform: scale(1.5, 1.5);
  margin: 15%;
}
@media (max-width: 1600px) {
  .arrangeEffigyStats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    height: 25rem;
  }
  .scaleEffigyStats {
    transform: scale(1.25, 1.25);
    margin: 10%;
  }
}
@media (max-width: 1250px) {
  .arrangeEffigyStats {
    margin-top: -1rem;
    padding-left: 2rem;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    height: 25rem;
  }
  .scaleEffigyStats {
    transform: scale(1, 1);
  }
  @media (max-width: 1000px) {
    .arrangeEffigyStats {
      padding-left: 1rem;
    }
    @media (max-width: 700px) {
      .arrangeEffigyStats {
        padding-left: 10%;
      }
      .scaleEffigyStats {
        transform: scale(1.2, 1.2);
      }
      @media (max-width: 450px) {
        .scaleEffigyStats {
          margin-right: 0rem;
          transform: scale(0.9, 0.9);
        }
        .arrangeEffigyStats {
          padding-left: 1%;
        }
      }
    }
  }
}
</style>
