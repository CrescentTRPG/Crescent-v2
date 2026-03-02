<script lang="ts">
import { DEFAULT_EFFIGY } from '@/bases.ts'
import BeingBuilt from '@/components/BeingBuilt.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useEffigyStore } from '@/stores/effigyStore.ts'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { useTraitsStore } from '@/stores/traitsStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import _ from 'lodash'
import { Ref, ref } from 'vue'
import EffigyAbilities from './EffigyAbilities.vue'
import EffigyBuild from './EffigyBuild.vue'
import EffigyNav from './EffigyNav.vue'

export interface effigy {
  name: string
  level: number
  groupIcon: string
  isAscendant: boolean
  attributes: {
    strength: number
    agility: number
    perception: number
    willpower: number
    health: number
    intelligence: number
    power: number
    charisma: number
  }
  exceptionals: {
    strength: number
    agility: number
    perception: number
    willpower: number
    health: number
    intelligence: number
    power: number
    charisma: number
  }
  spells: any
  combatStyles: any
  specialization: string
  specializations: any
  totalMana: number
  perks: any
  skills: any
  currentHp: number
  currentMana: number
  traits: any
  movementType: string
  majorBonuses: any
  minorBonuses: any
  chosenResistance: string
  chosenSucceptibility: string
  chosenImmunity: string
  chosenVulnerability: string
  spellgroup: string
  spellgroup2: string
  mp: number
  base: number
  flight: number
  effigyType: string
  practicedStyles: any
  combatStyle: string
  equipment: any
  damageType: string
}

export default {
  props: ['ogEffigy'],
  setup(props, context) {
    const designStore = useDesignStore()
    const effigyStore = useEffigyStore()
    const martialSkillsStore = useMartialSkillsStore()
    const traitsStore = useTraitsStore()
    const effigy: Ref<effigy> = ref(_.cloneDeep(props.ogEffigy))
    const nameModal = ref(false)
    const typeModal = ref(false)
    const effigyPos = ref('build')
    function updateEffigy(newEffigy) {
      effigy.value = newEffigy
    }
    function goBack() {
      context.emit('return')
    }

    function getTraits() {
      let traits = {}

      // size category
      let size = 0
      let calcRank = 0
      calcRank += effigy.value.minorBonuses[1]?.includes('size') ? 1 : 0
      calcRank += effigy.value.minorBonuses[2]?.includes('size') && effigy.value.level >= 3 ? 1 : 0
      calcRank += effigy.value.minorBonuses[3]?.includes('size') && effigy.value.level >= 5 ? 1 : 0
      if (size === 1) {
        traits['Large Size Category'] =
          traitsStore.manualTraits['Size Category']['Large Size Category']
      }
      if (size === 2) {
        traits['Massive Size Category'] =
          traitsStore.manualTraits['Size Category']['Massive Size Category']
      }
      if (size === 3) {
        traits['Colossal Size Category'] =
          traitsStore.manualTraits['Size Category']['Colossal Size Category']
      }

      //armor

      let dvBonus = 0
      dvBonus += effigy.value.minorBonuses[1]?.includes('DV') ? 2 : 0
      dvBonus += effigy.value.minorBonuses[2]?.includes('DV') && effigy.value.level >= 3 ? 2 : 0
      dvBonus += effigy.value.minorBonuses[3]?.includes('DV') && effigy.value.level >= 5 ? 2 : 0
      traits['Armor DVs'] = {
        ...traitsStore.manualTraits['Armor DVs'],
        number: effigy.value.level,
        description: traitsStore.manualTraits['Armor DVs'].description
          .replace('*NUM*', effigy.value.level + dvBonus)
          .replace('character', 'effigy')
      }

      //resistance
      if (
        effigy.value.chosenResistance &&
        effigy.value.level >= 2 &&
        effigy.value.chosenSucceptibility
      ) {
        traits[effigy.value.chosenResistance + ' Resistance'] =
          traitsStore.manualTraits['Resistance'][effigy.value.chosenResistance + ' Resistance']
      }
      //succ
      if (
        effigy.value.chosenSucceptibility &&
        effigy.value.level >= 2 &&
        effigy.value.chosenResistance
      ) {
        traits[effigy.value.chosenSucceptibility + ' Susceptibility'] =
          traitsStore.manualTraits['Susceptibility'][
            effigy.value.chosenSucceptibility + ' Susceptibility'
          ]
      }

      //Immunity
      if (
        effigy.value.chosenImmunity &&
        effigy.value.level >= 4 &&
        effigy.value.chosenVulnerability
      ) {
        traits[effigy.value.chosenImmunity + ' Immunity'] =
          traitsStore.manualTraits['Immunity'][effigy.value.chosenImmunity + ' Immunity']
      }

      //Vulnerability
      if (
        effigy.value.chosenVulnerability &&
        effigy.value.level >= 4 &&
        effigy.value.chosenImmunity
      ) {
        traits[effigy.value.chosenVulnerability + ' Vulnerability'] =
          traitsStore.manualTraits['Vulnerability'][
            effigy.value.chosenVulnerability + ' Vulnerability'
          ]
      }
      //inherent Attacks
      const attackDice =
        effigy.value.level === 5
          ? '2d10'
          : effigy.value.level === 4
            ? '2d8'
            : effigy.value.level === 3
              ? '1d10'
              : effigy.value.level === 2
                ? '1d8'
                : '1d6'
      traits['Melee Attack'] = {
        icon: 'gi-punch',
        description:
          'This effigy has the ability to make a ' +
          attackDice +
          ' melee attack dealing ' +
          effigy.value.damageType +
          ' damage',
        name: 'Melee Attack',
        ability: {
          actionCost: 'Core Action',
          area: 'Single Target',
          duration: 'Instantaneous',
          groupIcon: 'gi-punch',
          name: 'Melee Attack',
          isTrait: true,
          resistance: 'N/A',
          target: 'touch',
          description:
            'The effigy can make a melee attack roll, on hit deal ' +
            attackDice +
            ' ' +
            effigy.value.damageType +
            ' damage'
        }
      }
      if (effigy.value.level >= 3) {
        const rangedDice =
          effigy.value.level === 5 ? '1d12' : effigy.value.level === 4 ? '1d10' : '1d6'
        traits['Ranged Attack'] = {
          icon: 'gi-blast',
          description:
            'This effigy has the ability to make a ' +
            rangedDice +
            ' ranged attack dealing ' +
            effigy.value.damageType +
            ' damage',
          name: 'Ranged Attack',
          ability: {
            actionCost: 'Core Action',
            area: 'Single Target',
            duration: 'Instantaneous',
            groupIcon: 'gi-blast',
            name: 'Ranged Attack',
            isTrait: true,
            resistance: 'N/A',
            target: "LOS 40'",
            description:
              'The effigy can make a ranged attack roll, on hit deal ' +
              rangedDice +
              ' ' +
              effigy.value.damageType +
              ' damage'
          }
        }
      }
      return traits
    }

    function save() {
      let newEffigy: effigy = _.cloneDeep(DEFAULT_EFFIGY)
      newEffigy.minorBonuses = effigy.value.minorBonuses
      newEffigy.majorBonuses = effigy.value.majorBonuses
      newEffigy.effigyType = effigy.value.effigyType
      newEffigy.isAscendant = effigy.value.isAscendant
      newEffigy.groupIcon = effigy.value.groupIcon
      newEffigy.name = effigy.value.name
      newEffigy.level = effigy.value.level
      newEffigy.attributes = effigy.value.attributes
      newEffigy.damageType = effigy.value.damageType
      newEffigy.chosenResistance = effigy.value.chosenResistance
      newEffigy.chosenImmunity = effigy.value.chosenImmunity
      newEffigy.chosenSucceptibility = effigy.value.chosenSucceptibility
      newEffigy.chosenVulnerability = effigy.value.chosenVulnerability
      newEffigy.movementType = effigy.value.movementType

      //Calculate speed
      if (effigy.value.movementType === 'land') {
        newEffigy.base = 30
      } else {
        newEffigy.flight = 15
      }
      if (
        effigy.value.minorBonuses[1]?.includes('Land') ||
        effigy.value.minorBonuses[2]?.includes('Land') ||
        effigy.value.minorBonuses[3]?.includes('Land')
      ) {
        let calcRank = 0
        calcRank += effigy.value.minorBonuses[1]?.includes('Land') ? 15 : 0
        calcRank +=
          effigy.value.minorBonuses[2]?.includes('Land') && effigy.value.level >= 3 ? 15 : 0
        calcRank +=
          effigy.value.minorBonuses[3]?.includes('Land') && effigy.value.level >= 5 ? 15 : 0
        newEffigy.base += calcRank
      }

      if (
        effigy.value.minorBonuses[1]?.includes('Flight') ||
        effigy.value.minorBonuses[2]?.includes('Flight') ||
        effigy.value.minorBonuses[3]?.includes('Flight')
      ) {
        let calcRank = 0
        calcRank += effigy.value.minorBonuses[1]?.includes('Flight') ? 15 : 0
        calcRank +=
          effigy.value.minorBonuses[2]?.includes('Flight') && effigy.value.level >= 3 ? 15 : 0
        calcRank +=
          effigy.value.minorBonuses[3]?.includes('Flight') && effigy.value.level >= 5 ? 15 : 0
        newEffigy.flight += calcRank
      }

      if (
        effigy.value.level >= 5 &&
        (effigy.value.majorBonuses[1]?.includes('Flight') ||
          (effigy.value.isAscendant && effigy.value.majorBonuses[2]?.includes('Flight')))
      ) {
        newEffigy.flight += 30
      }

      if (
        effigy.value.level >= 5 &&
        (effigy.value.majorBonuses[1]?.includes('Land') ||
          (effigy.value.isAscendant && effigy.value.majorBonuses[2]?.includes('Land')))
      ) {
        newEffigy.base += 30
      }

      if (effigy.value.effigyType === 'caster') {
        newEffigy.spellgroup = effigy.value.spellgroup
        newEffigy.spells = {}
        newEffigy.spells[effigy.value.spellgroup] = effigy.value.spells[effigy.value.spellgroup]
        Object.keys(newEffigy.spells[effigy.value.spellgroup].spells).forEach((spell) => {
          if (newEffigy.spells[effigy.value.spellgroup].spells[spell].rank > effigy.value.level) {
            delete newEffigy.spells[effigy.value.spellgroup].spells[spell]
          }
        })
        newEffigy.totalMana = effigy.value.level
      }
      if (effigy.value.effigyType === 'fighter') {
        newEffigy.perks = {}
        newEffigy.perks = effigy.value.perks
        Object.keys(newEffigy.perks).forEach((perk) => {
          if (newEffigy.perks[perk].rank > effigy.value.level) {
            delete newEffigy.perks[perk]
          }
        })
      }
      if (
        effigy.value.level >= 5 &&
        (effigy.value.majorBonuses[1]?.includes('spell group') ||
          (effigy.value.isAscendant && effigy.value.majorBonuses[2]?.includes('spell group')))
      ) {
        newEffigy.spellgroup2 = effigy.value.spellgroup2
        newEffigy.spells[effigy.value.spellgroup2] = effigy.value.spells[effigy.value.spellgroup2]
        newEffigy.totalMana += 3
      }
      if (effigy.value.effigyType === 'fighter') {
        newEffigy.perks = {}
        newEffigy.perks = effigy.value.perks
      }
      if (
        effigy.value.minorBonuses[1]?.includes('Combat Style') ||
        effigy.value.minorBonuses[2]?.includes('Combat Style') ||
        effigy.value.minorBonuses[3]?.includes('Combat Style')
      ) {
        let calcRank = 0
        calcRank += effigy.value.minorBonuses[1]?.includes('Combat Style') ? 2 : 0
        calcRank +=
          effigy.value.minorBonuses[2]?.includes('Combat Style') && effigy.value.level >= 3 ? 2 : 0
        calcRank +=
          effigy.value.minorBonuses[3]?.includes('Combat Style') && effigy.value.level >= 5 ? 2 : 0
        newEffigy.combatStyles = {}
        newEffigy.combatStyles[effigy.value.combatStyle] = {
          ...martialSkillsStore.allCombatStyles[effigy.value.combatStyle],
          rank: calcRank
        }
        newEffigy.combatStyle = effigy.value.combatStyle

        newEffigy.mp = calcRank
      }
      if (
        effigy.value.level >= 5 &&
        (effigy.value.majorBonuses[1]?.includes('specialization') ||
          (effigy.value.isAscendant && effigy.value.majorBonuses[2]?.includes('specialization')))
      ) {
        let calcRank = 0
        calcRank += effigy.value.minorBonuses[1]?.includes('Combat Style') ? 2 : 0
        calcRank +=
          effigy.value.minorBonuses[2]?.includes('Combat Style') && effigy.value.level >= 3 ? 2 : 0
        calcRank +=
          effigy.value.minorBonuses[3]?.includes('Combat Style') && effigy.value.level >= 5 ? 2 : 0
        newEffigy.specializations = {}
        newEffigy.specialization = effigy.value.specialization
        newEffigy.specializations[effigy.value.specialization] = {
          ...martialSkillsStore.allSpecializations[effigy.value.specialization],
          rank: calcRank
        }
      }
      //bonus mana

      let calcMana = 0
      calcMana += effigy.value.minorBonuses[1]?.includes('Mana') ? 2 : 0
      calcMana += effigy.value.minorBonuses[2]?.includes('Mana') && effigy.value.level >= 3 ? 2 : 0
      calcMana += effigy.value.minorBonuses[3]?.includes('Mana') && effigy.value.level >= 5 ? 2 : 0
      newEffigy.totalMana += calcMana

      if (
        effigy.value.level >= 5 &&
        (effigy.value.majorBonuses[1]?.includes('Mana') ||
          (effigy.value.isAscendant && effigy.value.majorBonuses[2]?.includes('Mana')))
      ) {
        newEffigy.totalMana += 6
      }
      newEffigy.currentMana = newEffigy.totalMana
      newEffigy.traits = getTraits()
      effigyStore.addEffigy(newEffigy)
      context.emit('return')
    }

    const damageTypes = [
      'Fire',
      'Ice',
      'Lightning',
      'Force',
      'Toxic',
      'Stress',
      'Piercing',
      'Edged',
      'Blunt',
      'Blight',
      'Divine',
      'Pure Magic'
    ]
    const oneToFive = [
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' }
    ]
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }

    function updateName(val) {
      effigy.value.name = val
      nameModal.value = false
    }
    return {
      designStore,
      updateEffigy,
      effigy,
      damageTypes,
      lightenDarkenColor,
      oneToFive,
      nameModal,
      updateName,
      typeModal,
      effigyPos,
      goBack,
      save
    }
  },
  components: {
    TitleWidget,
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    EffigyNav,
    EffigyBuild,
    BeingBuilt,
    EffigyAbilities,
    BButton
  }
}
</script>
<template>
  <div style="display: flex; flex-direction: column" id="EditEffigy">
    <TitleWidget style="margin-bottom: -1rem" title="New Effigy"></TitleWidget>
    <EffigyNav
      @build="effigyPos = 'build'"
      @abilities="effigyPos = 'abilities'"
      @equipment="effigyPos = 'equipment'"
      @details="effigyPos = 'details'"
    ></EffigyNav>
    <EffigyBuild
      v-if="effigyPos === 'build'"
      :effigy="effigy"
      :updateEffigy="updateEffigy"
    ></EffigyBuild>
    <EffigyAbilities
      :effigy="effigy"
      :updateEffigy="updateEffigy"
      v-if="effigyPos === 'abilities'"
    ></EffigyAbilities>
    <BeingBuilt v-if="effigyPos === 'equipment'"></BeingBuilt>
    <BeingBuilt v-if="effigyPos === 'details'"></BeingBuilt>
    <div
      style="
        display: flex;
        justify-content: flex-end;
        border-top: 2px solid;
        position: fixed;
        width: calc(Max(100% - 9rem, 83%));
        bottom: 0;
        z-index: 5;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="display: flex; justify-content: flex-end; margin: 0.2rem">
        <BButton
          class="footerButtons"
          style="margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="save()"
        >
          <i class="bi bi-floppy"></i>
          <div style="margin-left: 0.5rem" class="discardText">Save</div>
          <div class="goBackText">and Go Back</div>
        </BButton>
        <BButton
          class="footerButtons"
          style="margin-left: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="goBack()"
        >
          <i class="bi bi-arrow-90deg-left"></i>
          <div class="discardText">Return</div>
          <div class="goBackText"></div>
        </BButton>
      </div>
    </div>
  </div>
</template>
<style>
.arrangeMidsection {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-bottom: -22rem;
}
@media (max-width: 700px) {
  .arrangeMidsection {
    display: flex;
    flex-direction: column;
    margin-bottom: -22rem;
  }
  .scaleIcons {
    transform: scale(0.8);
    z-index: 5;
  }
  @media (max-width: 400px) {
    .scaleIcons {
      flex-wrap: wrap;
      transform: scale(0.75);
      margin-bottom: -1rem;
      z-index: 5;
    }
  }
}
.fancySelect {
  cursor: pointer;
  border-width: 2px;
  margin: 0rem;
  margin-bottom: 0.5rem;
  flex-grow: 1;
}

.bonuses {
  clip-path: stroke-box
    polygon(10% 0%, 90% 0%, 100% 10%, 100% 90%, 90% 100%, 10% 100%, 0% 90%, 0% 10%);
  padding: 1rem;
  margin: 1rem;
  border: 2px solid;
  z-index: 3;
  position: relative;
}
</style>
