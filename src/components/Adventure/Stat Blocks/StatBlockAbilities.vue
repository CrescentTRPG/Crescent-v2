<script lang="ts">
import { BInputGroup, BFormInput, BInputGroupText, BButton, BTable } from 'bootstrap-vue-next'
import { computed, ComputedRef, Ref, ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import { storeToRefs } from 'pinia'
import { useCharacterStore } from '@/stores/characterStore'
import CustomModal from '@/components/CustomModal.vue'
import { useUserStore } from '@/stores/userStore'
import { useSpellStore } from '@/stores/spellsStore'
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import CustomPagination from '@/components/CustomPagination.vue'
import MartialSkillDisplay from '@/components/MartialSkillDisplay.vue'
import { usePerformanceStore } from '@/stores/performanceStore'
import CreatureDisplay from '@/components/Character/Build/Fauna/CreatureDisplay.vue'
import MartialAttackDisplay from '@/components/Character/Matrial Attack Builder/MartialAttackDisplay.vue'
import CustomCheckbox from '@/components/Character/CustomCheckbox.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import TitleWidget from '@/components/TitleWidget.vue'

export default {
  props: [
    'isEditing',
    'abilities',
    'fields',
    'buildDisplaySpells',
    'updateSpell',
    'buildDisplayPerks',
    'updatePerk',
    'buildDisplaySpecializations',
    'updateSpecialization',
    'buildDisplayCombatStyles',
    'updateCombatStyles',
    'buildDisplaySkills',
    'updateSkill',
    'updateStyle',
    'buildDisplayPerformanceAbilities'
  ],
  emits: ['ability'],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const spellsStore = useSpellStore()
    const { manualSpellgroups } = storeToRefs(spellsStore)
    const { manualPerformanceStyles } = usePerformanceStore()

    const currentPage = ref(1)
    const perPage = ref(15)
    const currentModal = ref(0)
    const filterOn = ['name', 'group', 'actionCost', 'spellgroup', 'perkGroup', 'rank', 'skill']
    const filter = ref('')
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
    const totalRows = ref(props.abilities?.length)

    function getSortedSkills(spec) {
      console.log(spec)
      return spec.skills.sort(function (a, b) {
        let aVal =
          a.skillStats.type === 'Passive'
            ? 0
            : a.skillStats.modes
              ? a.skillStats[a.skillStats.modes[0]].type === 'Passive'
                ? 0
                : 100
              : 100
        let bVal =
          b.skillStats.type === 'Passive'
            ? 0
            : b.skillStats.modes
              ? b.skillStats[b.skillStats.modes[0]].type === 'Passive'
                ? 0
                : 100
              : 100
        let ret = 0
        if (aVal > bVal) ret = 1
        else if (aVal < bVal) ret = -1

        return ret
      })
    }
    const oneToTen = [
      { value: 0, text: '0' },
      { value: 1, text: '1' },
      { value: 2, text: '2' },
      { value: 3, text: '3' },
      { value: 4, text: '4' },
      { value: 5, text: '5' },
      { value: 6, text: '6' },
      { value: 7, text: '7' },
      { value: 8, text: '8' },
      { value: 9, text: '9' },
      { value: 10, text: '10' }
    ]
    return {
      designStore,
      userStore,
      characterStore,
      currentPage,
      perPage,
      currentModal,
      modal,
      filterOn,
      filter,
      totalRows,
      manualSpellgroups,
      infoModal,
      manualPerformanceStyles,
      getSortedSkills,
      props,
      oneToTen
    }
  },
  components: {
    CustomModal,
    BFormInput,
    CustomPagination,
    BTable,
    BButton,
    AbilityDisplay,
    CreatureDisplay,
    MartialSkillDisplay,
    MartialAttackDisplay,
    CustomCheckbox,
    DropdownSelect
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
    }
  }
}
</script>

<template>
  <div
    style="border-left: 2px solid; margin-left: -2px"
    :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
  >
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
      :fields="props.fields"
      :items="props.abilities"
    >
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
                  (!(data.item.attributes || data.item.combatStyles || data.item.mp) &&
                    !data.item.skill &&
                    !data.item.Movement)
                "
                :medallion="
                  manualSpellgroups[data.item.spellgroup as any]?.groupIcon ||
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
              <MartialAttackDisplay
                v-if="data.item.mp"
                :description="data.item.description"
                :weaponAttack="data.item.attackObj"
                :icon="data.item.icon || 'gi-tec-9'"
              ></MartialAttackDisplay>

              <CreatureDisplay v-if="data.item.Movement" :creature="data.item"></CreatureDisplay>
              <div
                v-if="data.item.attributes || data.item.combatStyles"
                style="padding-bottom: 0.5rem; border-top: 2px solid"
                :style="{ borderColor: designStore.secondaryTheme }"
              >
                <div v-for="skill in getSortedSkills(data.item)" :key="skill.name">
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
      <template #cell(known)="data">
        <div v-if="data.item.spellgroup">
          <CustomCheckbox
            :overrideBox="''"
            :overrideFill="''"
            :isChecked="props.buildDisplaySpells[data.item.spellIndex as number]?.known || false"
            style="margin-left: 0.5rem; margin-right: 1rem"
            :update="0"
            @true="
              props.updateSpell(
                data.item.name,
                data.item.rank,
                manualSpellgroups[data.item.spellgroup as any].source,
                true,
                data.item.spellgroup,
                data.item.groupNumber,
                data.item.groupSpellIndex,
                data.item.spellIndex
              )
            "
            @false="
              props.updateSpell(
                data.item.name,
                data.item.rank,
                manualSpellgroups[data.item.spellgroup as any].source,
                false,
                data.item.spellgroup,
                data.item.groupNumber,
                data.item.groupSpellIndex,
                data.item.spellIndex
              )
            "
          >
          </CustomCheckbox>
        </div>
        <div v-if="data.item.perkGroup">
          <CustomCheckbox
            :overrideBox="''"
            :overrideFill="''"
            :isChecked="props.buildDisplayPerks[data.item.perkIndex as number]?.known || false"
            style="margin-left: 0.5rem; margin-right: 1rem"
            :update="0"
            @true="
              props.updatePerk(
                data.item.name,
                data.item.rank as number,
                data.item.source,
                true,
                data.item.perkGroup as string,
                data.item.perkIndex as number
              )
            "
            @false="
              props.updatePerk(
                data.item.name,
                data.item.rank as number,
                data.item.source,
                false,
                data.item.perkGroup as string,
                data.item.perkIndex as number
              )
            "
          >
          </CustomCheckbox>
        </div>
        <div v-if="data.item.style">
          <CustomCheckbox
            :overrideBox="''"
            :overrideFill="''"
            :isChecked="
              props.buildDisplayPerformanceAbilities[data.item.styleIndex as number]?.known || false
            "
            style="margin-left: 0.5rem; margin-right: 1rem"
            :update="0"
            @true="
              updateStyle(
                data.item.name,
                data.item.rank,
                manualPerformanceStyles[data.item.style as any]?.source || '',
                true,
                data.item.style,
                data.item.groupNumber,
                data.item.groupStyleIndex,
                data.item.styleIndex
              )
            "
            @false="
              updateStyle(
                data.item.name,
                data.item.rank,
                manualPerformanceStyles[data.item.style as any]?.source || '',
                false,
                data.item.style,
                data.item.groupNumber,
                data.item.groupStyleIndex,
                data.item.styleIndex
              )
            "
          >
          </CustomCheckbox>
        </div>
        <div v-if="!data.item.perkGroup && !data.item.spellgroup && !data.item.style">
          <div v-if="data.item.combatStyles">
            <DropdownSelect
              :default="props.buildDisplaySpecializations[data.item.index as number]?.rank"
              style="
                font-size: large;
                width: 4.5rem;
                cursor: pointer;
                border-width: 2px;
                margin-left: 0rem;
              "
              :options="oneToTen"
              @selection="
                (selection) =>
                  updateSpecialization(
                    data.item.name,
                    data.item.id,
                    selection,
                    data.item.source,
                    data.item.index,
                    data.item.combatStyles,
                    data.item.groupIcon
                  )
              "
            ></DropdownSelect>
          </div>
          <div v-if="data.item.attributes">
            <DropdownSelect
              :default="props.buildDisplayCombatStyles[data.item.index as number]?.rank"
              style="
                font-size: large;
                width: 4.5rem;
                cursor: pointer;
                border-width: 2px;
                margin-left: 0rem;
              "
              :options="oneToTen"
              @selection="
                (selection) =>
                  updateCombatStyles(
                    data.item.name,
                    data.item.id,
                    selection,
                    data.item.source,
                    data.item.index,
                    data.item.attributes,
                    data.item.groupIcon
                  )
              "
            ></DropdownSelect>
          </div>
          <div v-if="data.item.attribute">
            <DropdownSelect
              :default="props.buildDisplaySkills[data.item.index as number]?.rank"
              style="
                font-size: large;
                width: 4.5rem;
                cursor: pointer;
                border-width: 2px;
                margin-left: 0rem;
              "
              :options="oneToTen"
              @selection="
                (selection) =>
                  updateSkill(
                    data.item.skill,
                    data.item.id,
                    selection,
                    data.item.source,
                    data.item.index,
                    data.item.attribute
                  )
              "
            ></DropdownSelect>
          </div>
        </div>
      </template>
      <template #cell(group)="data">
        <div class="fullGroup">
          {{
            data.item
              ? data.item.isEquipment
                ? 'Equipment'
                : data.item.spellgroup
                  ? `${data.item.spellgroup}`
                  : data.item.perkGroup
                    ? `${data.item.perkGroup}`
                    : data.item.attributes
                      ? 'Combat Style'
                      : data.item.combatStyles
                        ? 'Specialization'
                        : data.item.isTrait
                          ? 'Trait'
                          : data.item.mp
                            ? 'Martial Attack'
                            : data.item.Movement
                              ? 'Fauna Transformation'
                              : data.item.style
                                ? data.item.style
                                : data.item.groupIcon
                                  ? 'General Actions'
                                  : 'Skill'
              : 'Something went wrong'
          }}
        </div>
        <div class="iconGroup">
          <v-icon
            scale="1.5"
            :name="manualSpellgroups[data.item.spellgroup as any]?.groupIcon || data.item.groupIcon"
          ></v-icon>
        </div>
      </template>
      <template #cell(actionCost)="data">
        <div style="white-space: pre-line">
          {{ formatActionCost(data.item.actionCost as string) || 'Variable' }}
        </div>
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
