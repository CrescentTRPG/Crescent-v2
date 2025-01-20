<script lang="ts">
import { BInputGroup, BFormInput, BInputGroupText, BButton, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { useSkillStore } from '@/stores/skillsStore'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import CustomModal from '@/components/CustomModal.vue'
import { useUserStore } from '@/stores/userStore'
import { useMartialSkillsStore } from '@/stores/martialSkillsStore'
import { useMartialPerksStore } from '@/stores/martialPerksStore'
import { useSpellStore } from '@/stores/spellsStore'
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import { LiteralUnion } from 'node_modules/bootstrap-vue-next/dist/src/types'
import MartialSkillDisplay from '@/components/MartialSkillDisplay.vue'
import ArrayTabs from '@/components/ArrayTabs.vue'
import BDropdown from 'bootstrap-vue-next/src/components/BDropdown/BDropdown.vue'
import BDropdownItem from 'bootstrap-vue-next/src/components/BDropdown/BDropdownItem.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import { isTemplateExpression } from 'typescript'
import { useEquipmentStore } from '@/stores/equipmentStore'
import { usePerformanceStore } from '@/stores/performanceStore'
import { useFaunaStore } from '@/stores/faunaStore'
import CreatureDisplay from '../Build/Fauna/CreatureDisplay.vue'

export default {
  emits: ['ability'],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const spellsStore = useSpellStore()
    const { spellgroups, buildDisplaySpells, manualSpellgroups } = storeToRefs(spellsStore)
    const martialSkillsStore = useMartialSkillsStore()
    const { specializations, buildDisplaySpecializations, combatStyles, buildDisplayCombatStyles } =
      storeToRefs(martialSkillsStore)
    const martialPerksStore = useMartialPerksStore()
    const { martialPerks, buildDisplayMartialPerks } = storeToRefs(martialPerksStore)
    const skillStore = useSkillStore()
    const { effectiveSkills, skills } = storeToRefs(skillStore)
    const performanceStore = usePerformanceStore()
    const { manualPerformanceStyles } = usePerformanceStore()
    const equipmentStore = useEquipmentStore()
    const faunaStore = useFaunaStore()
    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'group', 'actionCost', 'spellgroup', 'perkGroup', 'rank', 'skill']
    const filter = ref('')
    const fields = ref([
      { key: 'name', label: 'Rank - Name' },
      {
        key: 'cost',
        label: 'Cost',
        formatter: (_value: unknown, _key?: LiteralUnion<keyof any>, item?: any) =>
          item
            ? item.spellgroup
              ? `${item.rank} Mana`
              : item.uses
                ? item.uses
                : item.Movement
                  ? `${item.rank} Mana`
                  : item.perkGroup
                    ? `${item.type}`
                    : item.style
                      ? `${item.type}`
                      : 'No Cost'
            : 'Something went wrong'
      },

      {
        key: 'group',
        formatter: (_value: unknown, _key?: LiteralUnion<keyof any>, item?: any) =>
          item
            ? item.spellgroup
              ? `${item.spellgroup}`
              : item.isEquipment
                ? 'Equipment'
                : item.perkGroup
                  ? `${item.perkGroup}`
                  : item.style
                    ? item.style
                    : item.attributes
                      ? 'Combat Style'
                      : item.combatStyles
                        ? 'Specialization'
                        : 'Skill'
            : 'Something went wrong',
        label: 'Group'
      },
      { key: 'actionCost', label: 'Action Cost' },
      { key: 'actions', label: 'Plan' }
    ])
    const knownSpells: ComputedRef<Array<any>> = computed(() => {
      const groups: any = Object.values(spellgroups.value)
      let spells: Array<any> = []
      groups.forEach((group) => {
        let spellx = Object.values(group.spells)

        spells = spells.concat(spellx)
      })

      const knownSpells: Array<any> = []
      spells
        .sort((a: any, b: any) => {
          let aCode = a.spellgroup.charCodeAt(0)
          let bCode = b.spellgroup.charCodeAt(0)
          if (aCode - bCode == 0) {
            if (aCode - bCode == 0) {
              aCode = a.spellgroup.charCodeAt(2)
              bCode = b.spellgroup.charCodeAt(2)
              if (aCode - bCode == 0) {
                aCode = a.rank
                bCode = b.rank
                if (aCode - bCode == 0) {
                  aCode = a.name.charCodeAt(2)
                  bCode = b.name.charCodeAt(2)
                }
              }
            }
          }
          return aCode - bCode
        })
        .forEach((spell: any) => {
          let knownSpell = buildDisplaySpells.value[spell.spellIndex]
          knownSpells.push(knownSpell)
        })

      return knownSpells
    })

    function getMedallion(group: string) {
      switch (group) {
        case 'Offensive Perks':
          return 'gi-swords-power'
        case 'Defensive Perks':
          return 'gi-heavy-helm'
        case 'Utility Perks':
          return 'gi-gear-hammer'
        case 'Supportive Perks':
          return 'gi-heart-shield'
      }
    }

    const knownPerks: ComputedRef<Array<any>> = computed(() => {
      const perks: any = Object.values(martialPerks.value)
      let knownPerks: Array<any> = []
      perks
        .sort((a: any, b: any) => {
          if (a.rank === b.rank) {
            let aCode = a.name.charCodeAt(0)
            let bCode = b.name.charCodeAt(0)
            if (aCode - bCode == 0) {
              aCode = a.name.charCodeAt(1)
              bCode = b.name.charCodeAt(1)
              if (aCode - bCode == 0) {
                aCode = a.name.charCodeAt(2)
                bCode = b.name.charCodeAt(2)
              }
            }
            return aCode - bCode
          }
          return a.rank - b.rank
        })
        .forEach((perk) => {
          let perkx = {
            ...buildDisplayMartialPerks.value[perk.perkIndex],
            groupIcon: getMedallion(perk.perkGroup)
          }
          knownPerks.push(perkx)
        })
      return knownPerks
    })

    const knownCombatStyles: ComputedRef<Array<any>> = computed(() => {
      const cStyles: any = Object.values(combatStyles.value)
      let styles: Array<any> = []
      cStyles.forEach((style: any) => {
        let stylex = buildDisplayCombatStyles.value[style.index]
        let styley = { ...stylex, actionCost: 'Core Action' }
        styles.push(styley)
      })
      return styles
    })

    const knownSpecializations: ComputedRef<Array<any>> = computed(() => {
      const specs: any = Object.values(specializations.value)
      let styles: Array<any> = []
      specs.forEach((spec) => {
        let specx = buildDisplaySpecializations.value[spec.index]
        let specy = { ...specx, actionCost: 'Core Action' }

        styles.push(specy)
      })
      return styles
    })

    const knownSkillz: ComputedRef<Array<any>> = computed(() => {
      const skillsArr: any = Object.values(skillStore.skills)
      let skillsRet: Array<any> = []
      skillsArr.forEach((skillx) => {
        skillsRet.push({ ...effectiveSkills.value[skillx.index], name: skillx.skill })
      })
      console.log(skillsRet)
      return skillsRet
    })

    const knownTraits: ComputedRef<Array<any>> = computed(() => {
      let traits = Object.values(characterStore.traits)
      let abilities: Array<any> = []
      traits.forEach((trait: any) => {
        if (trait.ability) abilities.push({ ...trait.ability, groupIcon: trait.icon })
      })
      return abilities
    })

    const tabObject: ComputedRef<any> = computed((): any => {
      let arr = {}
      if (knownSpells.value.length > 0) {
        arr['Spells'] = { known: true, name: 'Spells', index: 0 }
      } else {
        arr['Spells'] = { known: false, name: 'Spells', index: 0 }
      }
      if (knownCombatStyles.value.length > 0) {
        arr['Combat Styles'] = { known: true, name: 'Combat Styles', index: 0 }
      } else {
        arr['Combat Styles'] = { known: false, name: 'Combat Styles', index: 0 }
      }
      if (knownSpecializations.value.length > 0) {
        arr['Specializations'] = { known: true, name: 'Specializations', index: 0 }
      } else {
        arr['Specializations'] = { known: false, name: 'Specializations', index: 0 }
      }
      if (knownSkillz.value.length > 0) {
        arr['Skills'] = { known: true, name: 'Skills', index: 0 }
      } else {
        arr['Skills'] = { known: false, name: 'Skills', index: 0 }
      }
      if (knownTraits.value.length > 0) {
        arr['Traits'] = { known: true, name: 'Traits', index: 0 }
      } else {
        arr['Traits'] = { known: false, name: 'Traits', index: 0 }
      }
      if (equipmentStore.getAbilitites.length > 0) {
        arr['Equipment'] = { known: true, name: 'Equipment', index: 0 }
      } else {
        arr['Equipment'] = { known: false, name: 'Equipment', index: 0 }
      }
      if (equipmentStore.getAbilitites.length > 0) {
        arr['Performance'] = { known: true, name: 'Performance', index: 0 }
      } else {
        arr['Performance'] = { known: false, name: 'Performance', index: 0 }
      }
      if (equipmentStore.getAbilitites.length > 0) {
        arr['Fauna Transformations'] = { known: true, name: 'Fauna Transformations', index: 0 }
      } else {
        arr['Fauna Transformations'] = { known: false, name: 'Fauna Transformations', index: 0 }
      }
      return arr
    })

    const selectedTabs: Ref<Array<any>> = ref([])

    let knownAbilities: ComputedRef<Array<any>> = computed(() => {
      let abilities: Array<any> = []
      if (selectedTabs.value && selectedTabs.value.length > 0) {
        selectedTabs.value.forEach((tab) => {
          if (tab.name === 'Spells') {
            abilities = abilities.concat(knownSpells.value)
          }
          if (tab.name === 'Skills') {
            abilities = abilities.concat(knownSkillz.value)
          }
          if (tab.name === 'Specializations') {
            abilities = abilities.concat(knownSpecializations.value)
          }
          if (tab.name === 'Combat Styles') {
            abilities = abilities.concat(knownCombatStyles.value)
          }
          if (tab.name === 'Traits') {
            abilities = abilities.concat(knownTraits.value)
          }
          if (tab.name === 'Equipment') {
            abilities = abilities.concat(equipmentStore.getAbilitites)
          }
          if (tab.name === 'Performance') {
            abilities = abilities.concat(performanceStore.getAbilities)
          }
          if (tab.name === 'Fauna Transformations') {
            abilities = abilities.concat(faunaStore.getCreatures)
          }
        })
        return abilities
      }
      return knownSpells.value
        .concat(knownPerks.value)
        .concat(knownCombatStyles.value)
        .concat(knownSpecializations.value)
        .concat(knownSkillz.value)
        .concat(knownTraits.value)
        .concat(equipmentStore.getAbilitites)
        .concat(performanceStore.getAbilities)
        .concat(faunaStore.getCreatures)
    })

    const totalRows = ref(knownAbilities?.value?.length)
    return {
      designStore,
      userStore,
      characterStore,
      buildDisplaySpells,
      knownAbilities,
      currentPage,
      perPage,
      currentModal,
      modal,
      filterOn,
      filter,
      fields,
      totalRows,
      manualSpellgroups,
      knownPerks,
      knownCombatStyles,
      knownSpecializations,
      knownSkillz,
      knownTraits,
      tabObject,
      selectedTabs,
      infoModal,
      manualPerformanceStyles
    }
  },
  components: {
    CustomModal,
    BFormInput,
    BButton,
    AbilityDisplay,
    CustomPagination,
    BTable,
    MartialSkillDisplay,
    ArrayTabs,
    BDropdown,
    BDropdownItem,
    CreatureDisplay
  },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    },
    tableBg() {
      if (parseInt(this.designStore.inputBacking.substring(1), 16) >= 3000000) {
        return this.LightenDarkenColor(this.designStore.inputBacking, 10)
      }
      return this.LightenDarkenColor(this.designStore.inputBacking, -10)
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    showInfoModal() {
      this.infoModal = !this.infoModal
    },
    formatActionCost(actionCost: string) {
      let arr = actionCost?.split('/')
      if (arr?.length == 2) return arr[0] + ' /' + '\n' + arr[1]
      else {
        return actionCost
      }
    },
    addToTurnPlanner(ability: any, actionCost: string) {
      if (actionCost === 'Core Action') {
        this.characterStore.setPlannedCoreAction(ability)
      }
      if (actionCost === 'Swift Action') {
        this.characterStore.setPlannedSwiftAction(ability)
      }
      if (actionCost === 'Reaction') {
        this.characterStore.setPlannedReaction(ability)
      }
      if (actionCost === 'Movement Action') {
        this.characterStore.setPlannedMovementAction(ability)
      }
    }
  }
}
</script>

<template>
  <div
    style="border-left: 2px solid; margin-left: -2px"
    :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
  >
    <ArrayTabs
      filteringMessage="Ability Type"
      :tabs="Object.values(tabObject)"
      @selectedTabs="(tabs) => (selectedTabs = tabs)"
    ></ArrayTabs>
    <BFormInput
      class="inputSearch"
      placeholder="Search..."
      v-model="filter"
      style="border-radius: 0; border: none; border-bottom: 2px solid"
      :style="{
        fontFamily: designStore.font,
        color: designStore.inputText,
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        '--bs-secondary-color': designStore.inputText
      }"
    ></BFormInput>
    <BTable
      @filtered="onFiltered"
      striped
      :style="{
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText,
        backgroundColor: designStore.inputBacking,
        '--bs-table-striped-bg': tableBg()
      }"
      :sort-internal="true"
      :filter="filter"
      :filterable="filterOn"
      :per-page="perPage"
      :current-page="currentPage"
      headerTitle="Abilities"
      class="tableClass mobile"
      :fields="fields"
      :items="knownAbilities"
    >
      <template #cell(actionCost)="data">
        <div style="white-space: pre-line">
          {{ formatActionCost(data.item.actionCost) || 'Variable' }}
        </div>
      </template>
      <template #cell(name)="data">
        <div :style="{ background: designStore.inputBacking }">
          <BButton
            class="nameButton mobile"
            style="width: 100%; border: 2px solid; text-align: left"
            @click="showModal(data.index)"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            >{{ data.item.rank ? data.item.rank : data.item.rank === 0 ? 0 : 'N/A' }} {{ ' - ' }}
            {{ data.item.name || data.item.Name }}</BButton
          >
          <CustomModal
            :showModal="modal && currentModal == data.index"
            :title="data.item.name || data.item.Name || data.item.skill + ' - ' + data.item.rank"
            @close="showModal(data.index)"
          >
            <template v-slot:body>
              <AbilityDisplay
                v-if="
                  data.item.spellgroup ||
                  data.item.perkGroup ||
                  (!(data.item.attributes || data.item.combatStyles) &&
                    !data.item.skill &&
                    !data.item.Movement)
                "
                :medallion="
                  manualSpellgroups[data.item.spellgroup]?.groupIcon ||
                  data.item.groupIcon ||
                  'gi-cubes'
                "
                :description="data.item.description || ''"
                :area="data.item.area || ''"
                :duration="data.item.duration || ''"
                :action-cost="data.item.actionCost || ''"
                :resistance="data.item.resistance || ''"
                :target="data.item.target || ''"
                :type="data.item.type || ''"
              ></AbilityDisplay>
              <CreatureDisplay v-if="data.item.Movement" :creature="data.item"></CreatureDisplay>
              <div
                v-if="data.item.attributes || data.item.combatStyles"
                style="padding-bottom: 0.5rem; border-top: 2px solid"
                :style="{ borderColor: designStore.secondaryTheme }"
              >
                <div v-for="skill in data.item.skills" :key="skill.name">
                  <MartialSkillDisplay
                    :title="skill.name"
                    :description="skill.description"
                    :mpCost="skill.mp_cost"
                  ></MartialSkillDisplay>
                </div>
              </div>
              <div v-if="data.item.skill != undefined" v-html="data.item.description"></div>
            </template>
          </CustomModal>
        </div>
      </template>
      <template #cell(group)="data">
        <div class="fullGroup">
          {{
            data.item
              ? data.item.spellgroup
                ? `${data.item.spellgroup}`
                : data.item.isEquipment
                  ? 'Equipment'
                  : data.item.perkGroup
                    ? `${data.item.perkGroup}`
                    : data.item.attributes
                      ? 'Combat Style'
                      : data.item.combatStyles
                        ? 'Specialization'
                        : data.item.isTrait
                          ? 'Trait'
                          : data.item.Movement
                            ? 'Fauna Transformation'
                            : data.item.style
                              ? data.item.style
                              : 'Skill'
              : 'Something went wrong'
          }}
        </div>
        <div class="iconGroup">
          <v-icon
            scale="1.5"
            :name="manualSpellgroups[data.item.spellgroup]?.groupIcon || data.item.groupIcon"
          ></v-icon>
        </div>
      </template>
      <template #cell(rank)="data">
        <div style="margin-left: 1rem; margin-top: 0.5rem">{{ data.item.rank }}</div>
      </template>
      <template #cell(actions)="data">
        <BDropdown
          test-data="action"
          class="me-2"
          style="margin-left: -1rem"
          :style="{
            '--bs-btn-color': designStore.inputText,
            '--bs-btn-hover-bg': designStore.inputBacking,
            '--bs-btn-active-color': designStore.inputText,
            '--bs-btn-active-bg:': designStore.inputBacking,
            '--bs-dropdown-color': designStore.inputText,
            '--bs-dropdown-bg': designStore.inputBacking,
            '--bs-dropdown-link-hover-color': designStore.alertTheme,
            '--bs-dropdown-link-hover-bg': designStore.inputBacking,
            '--bs-dropdown-link-active-color': designStore.alertTheme,
            '--bs-dropdown-link-active-bg': designStore.primaryTheme,
            scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme
          }"
        >
          <template #button-content>
            <BButton
              class="addButton"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme,
                '--dropdownBg': designStore.inputBacking
              }"
              ><i class="bi bi-plus"></i
            ></BButton>
          </template>
          <div
            style="padding: 0.5rem"
            :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          >
            Actions
          </div>
          <BDropdownItem
            href="#"
            @click="addToTurnPlanner(data.item, 'Core Action')"
            v-if="data.item.actionCost?.includes('Core Action')"
            >Core Action</BDropdownItem
          >
          <BDropdownItem
            href="#"
            v-if="data.item.actionCost?.includes('Swift')"
            @click="addToTurnPlanner(data.item, 'Swift Action')"
            >Swift Action</BDropdownItem
          >

          <BDropdownItem
            href="#"
            v-if="data.item.actionCost?.includes('Movement')"
            @click="addToTurnPlanner(data.item, 'Movement Action')"
            >Movement Action</BDropdownItem
          >
          <BDropdownItem
            href="#"
            v-if="data.item.actionCost?.includes('Reaction')"
            @click="addToTurnPlanner(data.item, 'Reaction')"
          >
            Reaction</BDropdownItem
          >
          <div
            style="padding: 0.5rem; display: flex; flex-wrap: wrap; justify-content: space-between"
            :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
          >
            <div style="text-wrap: wrap">Non-Default</div>
            <i
              @click="showInfoModal()"
              class="bi bi-patch-question"
              style="font-size: 1.5rem; cursor: pointer"
              :style="{ color: designStore.alertTheme }"
            ></i>
            <div style="margin-top: -0.5rem">Actions</div>
          </div>
          <BDropdownItem
            href="#"
            v-if="!data.item.actionCost?.includes('Core Action')"
            @click="addToTurnPlanner(data.item, 'Core Action')"
            >Core Action</BDropdownItem
          >
          <BDropdownItem
            href="#"
            v-if="!data.item.actionCost?.includes('Swift Action')"
            @click="addToTurnPlanner(data.item, 'Swift Action')"
          >
            Swift Action
          </BDropdownItem>
          <BDropdownItem
            href="#"
            v-if="!data.item.actionCost?.includes('Movement')"
            @click="addToTurnPlanner(data.item, 'Movement Action')"
            >Movement Action</BDropdownItem
          >
          <BDropdownItem
            href="#"
            v-if="!data.item.actionCost?.includes('Reaction')"
            @click="addToTurnPlanner(data.item, 'Reaction')"
          >
            Reaction</BDropdownItem
          >
        </BDropdown>
      </template>
    </BTable>
    <CustomModal title="Non-Default Actions" :showModal="infoModal" @close="showInfoModal()">
      <template v-slot:body>
        These action costs may not be the default, but are possible to be used as such. Many
        characters have the ability to modify the action cost of abilities and furthermore, some
        abilities have complex usage of actions and may not list all their actions as default.
      </template>
    </CustomModal>
    <CustomPagination
      @currentPage="(page) => (currentPage = page)"
      :currentPage="currentPage"
      :total-rows="totalRows"
      :per-page="perPage"
    ></CustomPagination>
  </div>
</template>

<style>
ul {
  --dropdownBg: inherit;
}
li {
  --dropdownBg: inherit;
}
.dropdown-item {
  --dropdownBg: inherit;
  background-color: var(--dropdownBg);
  background: inherit;
  color: inherit;
  --bs-dropdown-link-hover-color: inherit;
  --bs-dropdown-link-hover-bg: inherit;
  --bs-dropdown-link-active-color: inherit;
  --bs-dropdown-link-active-bg: inherit;
}
.addButton {
  padding: 0px 5px 0px 5px;
  font-size: x-large;
  border: 2px solid;
  margin-left: 0.5rem;
}
.fullGroup {
  display: block;
}
.iconGroup {
  display: none;
}
@media (max-width: 550px) {
  .addButton {
    padding: 0px 4px 0px 4px;
    font-size: large;
    border: 2px solid;
    margin: 0;
  }
  .fullGroup {
    display: none;
  }
  .iconGroup {
    display: block;
  }
}
</style>
