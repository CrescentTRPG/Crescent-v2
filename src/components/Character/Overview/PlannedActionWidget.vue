<script lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useSpellStore } from '@/stores/spellsStore'
import AbilityDisplayMedallion from '@/components/AbilityDisplayMedallion.vue'
import {
  BButton,
  BForm,
  BFormInput,
  BFormText,
  BFormTextarea,
  BInputGroupText
} from 'bootstrap-vue-next'
import CustomModal from '@/components/CustomModal.vue'
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import MartialSkillDisplay from '@/components/MartialSkillDisplay.vue'
import IconPicker from '@/components/IconPicker.vue'
import CustomCheckbox from '../CustomCheckbox.vue'
import { usePartyStore } from '@/stores/partyStore'
import { useAdventureStore } from '@/stores/adventureStore'

export default {
  props: ['actionName', 'ability'],
  setup(props, context) {
    const modal = ref(false)
    const statusModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const spellsStore = useSpellStore()
    const { manualSpellgroups } = storeToRefs(spellsStore)
    const partyStore = usePartyStore()
    const characterName: Ref<any> = ref(['self'])
    const statusName = ref(props.ability.name || '')
    const statusDuration = ref(props.ability.duration || '')
    const checkToBreak = ref(props.ability.resistance || '')
    const party: ComputedRef<Array<any>> = computed(() => {
      return Object.values(partyStore.characterObjects) || []
    })
    const statusIcon = ref(
      manualSpellgroups.value[props.ability.spellgroup]?.groupIcon || props.ability.groupIcon || ''
    )
    const statusDescription = ref(props.ability.description || props.ability.skills || '')

    function clearAbility() {
      if (props.actionName === 'Core Action') {
        characterStore.setPlannedCoreAction({})
      }
      if (props.actionName === 'Swift Action') {
        characterStore.setPlannedSwiftAction({})
      }
      if (props.actionName === 'Reaction') {
        characterStore.setPlannedReaction({})
      }
      if (props.actionName === 'Movement Action') {
        characterStore.setPlannedMovementAction({})
      }
    }

    function openAndLoadStatusModal() {
      characterName.value = ['self']
      statusName.value = props.ability.name || ''
      statusIcon.value =
        manualSpellgroups.value[props.ability.spellgroup]?.groupIcon ||
        props.ability.groupIcon ||
        ''
      statusDescription.value =
        props.ability.description.replace('\\n', '\n\n ❖ ').replaceAll('\\n', '\n ❖ ') ||
        props.ability.skills ||
        ''
      statusDuration.value = props.ability.duration || ''
      checkToBreak.value = props.ability.resistance || ''

      statusModal.value = true
    }
    function closeStatusModal() {
      statusModal.value = false
    }
    const adventureStore = useAdventureStore()

    function addAsStatus() {
      characterName.value.forEach((name) => {
        if (name === 'self') {
          characterStore.addCustomStatus({
            name: statusName.value,
            description: statusDescription.value,
            duration: statusDuration.value,
            icon: statusIcon.value,
            checkToBreak: checkToBreak.value,
            linkedModifiers: []
          })
        } else {
          let obj = {
            name: statusName.value,
            description: statusDescription.value,
            duration: statusDuration.value,
            icon: statusIcon.value,
            checkToBreak: checkToBreak.value,
            linkedModifiers: []
          }
          let userId = ''
          const cIds = adventureStore.characterIds
          for (let i = 0; i < cIds.length; i++) {
            if (cIds[i] === name) {
              userId = adventureStore.userIds[i]
            }
          }
          partyStore.addCustomStatus(obj, name, userId)
        }
      })
      if (characterName.value.includes('self')) {
        characterStore.addCustomStatus({
          name: statusName.value,
          description: statusDescription.value,
          duration: statusDuration.value,
          icon: statusIcon.value,
          checkToBreak: checkToBreak.value,
          linkedModifiers: []
        })
      }
      closeStatusModal()
    }

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      props,
      manualSpellgroups,
      clearAbility,
      statusName,
      statusIcon,
      statusDescription,
      characterName,
      closeStatusModal,
      statusModal,
      openAndLoadStatusModal,
      addAsStatus,
      statusDuration,
      checkToBreak,
      partyStore,
      party
    }
  },
  components: {
    AbilityDisplayMedallion,
    BButton,
    CustomModal,
    AbilityDisplay,
    MartialSkillDisplay,
    BFormInput,
    BInputGroupText,
    IconPicker,
    BFormTextarea,
    CustomCheckbox
  },
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  }
}
</script>

<template>
  <div
    style="width: 92%; border: 2px solid; margin-right: 4%; margin-left: 4%; margin-top: 1rem"
    :style="{ fontFamily: designStore.font, borderColor: designStore.secondaryTheme }"
  >
    <div
      style="
        width: 100%;
        font-size: 1rem;
        border-bottom: 2px solid;
        padding: 0.25rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.primaryText,
        fontFamily: designStore.titleFont,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div style="margin-right: -0.25rem">
        <v-icon
          style="margin-right: -1.25rem"
          name="wi-moon-waning-crescent-5"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
        <v-icon
          name="wi-moon-waning-crescent-3"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
      </div>
      <div
        style="z-index: 5; display: flex; flex-direction: column; justify-content: center"
        :style="{
          background: designStore.primaryTheme,
          borderColor: designStore.secondaryTheme
        }"
      >
        {{ props.actionName }}
      </div>
      <div style="margin-left: -0.25rem; z-index: 4">
        <v-icon
          name="wi-moon-waxing-crescent-3"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
        <v-icon
          style="margin-left: -1.25rem"
          name="wi-moon-waxing-crescent-1"
          scale="1.5"
          :style="{ color: designStore.secondaryTheme }"
        ></v-icon>
      </div>
    </div>

    <div
      v-if="props.ability.name"
      style="
        min-height: 4rem;
        display: flex;
        flex-direction: column;
        border: 10px solid;
        cursor: pointer;
      "
      :style="{
        background: designStore.secondaryTheme,
        borderColor: LightenDarkenColor(designStore.inputBacking, -10),
        boxShadow: 'inset 0px 0px 0px 2px ' + LightenDarkenColor(designStore.secondaryTheme, -10),
        color: designStore.inputText
      }"
      @click="modal = !modal"
    >
      <div
        style="
          display: flex;
          justify-content: space-around;
          flex-direction: row;
          flex-grow: 1;
          z-index: 3;
        "
        class="outerBox"
        :style="{
          background: designStore.inputBacking
        }"
      >
        <div
          style="
            text-align: center;
            z-index: 4;
            height: 100%;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
            align-self: center;
          "
          :style="{
            background: designStore.inputBacking
          }"
        >
          {{ props.ability.name }}
        </div>
      </div>
      <div
        style="display: flex; justify-content: center"
        :style="{ background: designStore.inputBacking }"
        v-if="ability.spellgroup"
      >
        ( {{ ability.rank }} Mana )
      </div>
      <div
        style="display: flex; justify-content: center"
        :style="{ background: designStore.inputBacking }"
        v-if="ability.perkGroup && ability.type.includes('Charge')"
      >
        ( 1 Charge, {{ ability.type.split('(')[1].charAt(0) }} Total)
      </div>
      <div
        :style="{ background: designStore.inputBacking }"
        style="display: flex; justify-content: center"
        v-if="ability.skills"
      >
        ( No Cost )
      </div>
      <AbilityDisplayMedallion
        :style="{ background: designStore.inputBacking }"
        :medallion="manualSpellgroups[ability.spellgroup]?.groupIcon || ability.groupIcon"
      ></AbilityDisplayMedallion>
    </div>

    <div
      v-else
      style="min-height: 4rem; display: flex; flex-direction: column; border: 10px solid"
      :style="{
        background: designStore.secondaryTheme,
        borderColor: LightenDarkenColor(designStore.inputBacking, -10),
        boxShadow: 'inset 0px 0px 0px 2px ' + LightenDarkenColor(designStore.secondaryTheme, -10),
        color: designStore.inputText
      }"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          flex-direction: column;
          flex-grow: 1;
          z-index: 3;
        "
        class="outerBox"
        :style="{
          background: designStore.inputBacking
        }"
      >
        <div
          style="
            text-align: center;
            z-index: 4;
            height: 100%;
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          "
          :style="{
            background: designStore.inputBacking
          }"
        >
          No Ability Planned
        </div>
      </div>
    </div>
    <CustomModal
      :showModal="modal"
      :title="props.ability.name || props.ability.skill + ' - ' + props.ability.rank"
      @close="modal = !modal"
    >
      <template v-slot:body>
        <AbilityDisplay
          v-if="
            props.ability.spellgroup ||
            props.ability.perkGroup ||
            (!(props.ability.attributes || props.ability.combatStyles) && !props.ability.skill)
          "
          :medallion="
            manualSpellgroups[props.ability.spellgroup]?.groupIcon || props.ability.groupIcon
          "
          :description="props.ability.description"
          :area="props.ability.area"
          :duration="props.ability.duration"
          :action-cost="props.ability.actionCost"
          :resistance="props.ability.resistance"
          :target="props.ability.target"
          :type="props.ability.type"
        ></AbilityDisplay>

        <div
          v-if="props.ability.attributes || props.ability.combatStyles"
          style="padding-bottom: 0.5rem; border-top: 2px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
        >
          <div v-for="skill in props.ability.skills" :key="skill.name">
            <MartialSkillDisplay
              :title="skill.name"
              :description="skill.description"
              :mpCost="skill.mp_cost"
            ></MartialSkillDisplay>
          </div>
        </div>
        <div v-if="props.ability.skill != undefined" v-html="props.ability.description"></div>
      </template>
    </CustomModal>
    <div
      v-if="props.ability.name"
      style="
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        flex-grow: 1;
        z-index: 3;
        font-size: small;
        font-style: normal;
      "
      class="outerBox"
      :style="{
        background: LightenDarkenColor(designStore.inputBacking, -10),
        borderColor: designStore.secondaryTheme,
        color: designStore.primaryText
      }"
    >
      <BButton
        @click="clearAbility"
        class="actionButtons"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        <div style="display: flex">
          <div style="margin-right: 0.5rem; margin-top: 0.1rem">Clear</div>
          <i class="bi bi-x-lg" style="font-size: large"></i></div
      ></BButton>
      <BButton
        class="actionButtons"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
        ><div style="display: flex; justify-content: flex-end" @click="openAndLoadStatusModal()">
          <div style="text-wrap: wrap; width: 120%">Add as Status</div>
          <i class="bi bi-plus-lg" style="font-size: x-large; margin-top: 0.25rem"> </i></div
      ></BButton>
    </div>
    <CustomModal :showModal="statusModal" title="Add Ability as Status" @close="closeStatusModal()">
      <template v-slot:body>
        <div style="display: flex">
          <BInputGroupText
            style="
              border: 3px solid;
              border-radius: 0.675rem;
              border-right: none;
              border-top-right-radius: 0;
              border-bottom-right-radius: 0;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
            >Status Name</BInputGroupText
          >
          <BFormInput
            v-model="statusName"
            style="
              border-top-left-radius: 0;
              border-bottom-left-radius: 0;
              border: 3px solid;
              border-left: 1px solid;
              margin-right: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              borderColor: designStore.secondaryTheme
            }"
          ></BFormInput>
          <IconPicker
            style="align-self: center; border-radius: 10px"
            :currentIcon="statusIcon"
            @selectedIcon="(icon) => (statusIcon = icon)"
            orientation="bottom"
          ></IconPicker>
        </div>
        <BFormTextarea
          onfocus='this.style.height = "";this.style.height = this.scrollHeight + "px"'
          v-model="statusDescription"
          style="white-space: pre-line; min-height: 6rem; margin-top: 0.5rem; border: 3px solid"
          :style="{
            color: designStore.inputText,
            background: designStore.inputBacking,
            borderColor: designStore.secondaryTheme
          }"
        ></BFormTextarea>
        <div style="display: flex; margin-top: 0.5rem" class="wrappers">
          <div style="display: flex" class="wrappingItem">
            <BInputGroupText
              style="
                border: 3px solid;
                border-radius: 0.675rem;
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Duration</BInputGroupText
            >
            <BFormInput
              v-model="statusDuration"
              style="
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border: 3px solid;
                border-left: 1px solid;
                margin-right: 0.5rem;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormInput>
          </div>
          <div style="display: flex" class="wrappingItem">
            <BInputGroupText
              style="
                border: 3px solid;
                border-radius: 0.675rem;
                border-right: none;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
              >Check Value</BInputGroupText
            >
            <BFormInput
              v-model="checkToBreak"
              style="
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                border: 3px solid;
                border-left: 1px solid;
                margin-right: 0.5rem;
              "
              :style="{
                color: designStore.inputText,
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme
              }"
            ></BFormInput>
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; flex-wrap: wrap">
          <div style="align-self: center; margin-right: 0.5rem; margin-top: 0.5rem">
            <div>Apply to...</div>
          </div>
          <div
            style="
              height: 100%;
              display: flex;
              margin-top: 0.5rem;
              padding: 0.5rem;
              padding-bottom: 0.75rem;
              border-radius: 0.25rem;
              border: 2px solid;
            "
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div style="display: flex; padding-right: 1rem">
              <div style="align-self: center; margin-right: 0.5rem">
                <div style="margin-right: 0.5rem">Self:</div>
              </div>
              <CustomCheckbox
                style="margin-top: -0.5rem; width: 2rem"
                @true="characterName.push('self')"
                @false="characterName.splice(characterName.indexOf('self'), 1)"
                :isChecked="characterName.includes('self')"
              ></CustomCheckbox>
            </div>
            <div v-for="partyMember in party" :key="partyMember">
              <div style="display: flex; padding-right: 1rem">
                <div style="align-self: center; margin-right: 0.5rem">
                  <div style="margin-right: 0.5rem">{{ partyMember.name }}:</div>
                </div>
                <CustomCheckbox
                  style="margin-top: -0.5rem; width: 2rem"
                  @true="characterName.push(partyMember.id)"
                  @false="characterName.splice(characterName.indexOf(partyMember.id), 1)"
                  :isChecked="characterName.includes(partyMember.id)"
                ></CustomCheckbox>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <BButton
          @click="addAsStatus()"
          style="border: 1px solid; margin-right: 1rem"
          :style="{ borderColor: designStore.secondaryTheme }"
          >Add as Status</BButton
        >
        <BButton
          style="border: 1px solid"
          :style="{ borderColor: designStore.secondaryTheme }"
          @click="closeStatusModal()"
          >Cancel</BButton
        ></template
      >
    </CustomModal>
  </div>
</template>

<style scoped>
.outerBox {
  width: 100%;
}
.actionButtons {
  border-radius: 0.675rem;
  margin: 0.5rem;
  margin-top: 0;
  font-size: small;
  padding-top: 0.2rem;
  padding-bottom: 0.2rem;
}

#autoresizing {
  display: block;
  overflow: hidden;
  resize: none;
}
@media (max-width: 800px) {
  .wrappers {
    flex-wrap: wrap;
  }
  .wrappingItem {
    margin-bottom: 0.5rem;
    width: 100%;
  }
}
</style>
