<script lang="ts">
import { computed, ComputedRef, Ref, ref } from 'vue'
import { useDesignStore } from '../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'
import _ from 'lodash'

import CustomModal from '@/components/CustomModal.vue'
import IconPicker from '@/components/IconPicker.vue'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BFormInput, BFormTextarea, BInputGroupText } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'

import { useAdventureStore } from '@/stores/adventureStore.ts'
import { useInitiativeStore } from '@/stores/initiativeStore.ts'
import { usePartyStore } from '@/stores/partyStore.ts'
import CustomCheckbox from './Character/CustomCheckbox.vue'

export default {
  props: ['ability', 'fontSize'],
  setup(props, context) {
    const modal = ref(false)
    const statusModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const adventureStore = useAdventureStore()
    const spellsStore = useSpellStore()
    const initiativeStore = useInitiativeStore()
    const { manualSpellgroups } = storeToRefs(spellsStore)
    const partyStore = usePartyStore()
    const characterName: Ref<any> = ref([])
    const opponentList: Ref<any> = ref([])

    const statusName = ref(props.ability.name || '')
    const statusDuration = ref(props.ability.duration || '')
    const checkToBreak = ref(props.ability.resistance || '')
    const party: ComputedRef<Array<any>> = computed(() => {
      return Object.values(partyStore.characterObjects) || []
    })
    const opponents: ComputedRef<Array<any>> = computed(() => {
      return Object.keys(initiativeStore.combatants) || []
    })
    const statusIcon = ref(
      manualSpellgroups.value[props.ability.spellgroup]?.groupIcon || props.ability.groupIcon || ''
    )
    const statusDescription = ref(props.ability.description || props.ability.skills || '')

    function openAndLoadStatusModal() {
      characterName.value = []
      opponentList.value = []
      statusName.value = props.ability.name || props.ability.Name || ''
      statusIcon.value =
        manualSpellgroups.value[props.ability.spellgroup]?.groupIcon ||
        props.ability.groupIcon ||
        ''
      statusDescription.value = props.ability.description
        ? props.ability.description.replace('\\n', '\n\n ❖ ').replaceAll('\\n', '\n ❖ ')
        : props.ability.skills || props.ability.Description || ''
      statusDuration.value = props.ability.duration || ''
      checkToBreak.value = props.ability.resistance || ''

      statusModal.value = true
    }
    function closeStatusModal() {
      statusModal.value = false
    }

    function addAsStatus() {
      const status = {
        name: statusName.value,
        description: statusDescription.value,
        duration: statusDuration.value,
        icon: statusIcon.value,
        checkToBreak: checkToBreak.value,
        linkedModifiers: []
      }
      let newCombatants = _.cloneDeep(initiativeStore.combatants)
      opponentList.value.forEach((opponent) => {
        newCombatants[opponent].customStatusEffects[statusName.value] = status
      })
      initiativeStore.updateCombatants(newCombatants)
      characterName.value.forEach((name) => {
        if (name === 'self') {
          characterStore.addCustomStatus(status)
        } else {
          let userId = ''
          const cIds = adventureStore.characterIds
          for (let i = 0; i < cIds.length; i++) {
            if (cIds[i] === name) {
              userId = adventureStore.userIds[i]
            }
          }
          partyStore.addCustomStatus(status, name, userId)
        }
      })

      closeStatusModal()
    }

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      props,
      manualSpellgroups,
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
      party,
      opponents,
      opponentList,
      adventureStore
    }
  },
  components: {
    BButton,
    CustomModal,
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
  <div>
    <div
      :style="{ fontSize: props.fontSize || 'medium' }"
      style="padding: 0; display: flex; justify-content: flex-end"
      @click="openAndLoadStatusModal()"
    >
      <div style="align-self: center; margin-right: 0.25rem">Add as Status</div>
      <i class="bi bi-plus-lg" style="font-size: x-large; margin-top: 0.25rem"> </i>
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
            <div>Apply to Party Member(s)...</div>
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
              flex-wrap: wrap;
              margin-bottom: 1rem;
            "
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
          >
            <div style="display: flex; padding-right: 1rem; padding-bottom: 0.75rem">
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
              <div style="display: flex; padding-right: 1rem; padding-bottom: 0.75rem">
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
          <div
            style="display: flex"
            v-if="adventureStore.activeCombatId && adventureStore.settings.allowApplyStatusToEnemy"
          >
            <div style="align-self: center; margin-right: 0.5rem; margin-top: 0.5rem">
              <div>Apply to Combatant(s)...</div>
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
                flex-wrap: wrap;
                margin-bottom: 1rem;
                width: fit-content;
              "
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
            >
              <div v-for="opponent in opponents" :key="opponent">
                <div style="display: flex; padding-right: 1rem; padding-bottom: 0.75rem">
                  <div style="align-self: center; margin-right: 0.5rem">
                    <div style="margin-right: 0.5rem">{{ opponent }}:</div>
                  </div>
                  <CustomCheckbox
                    style="margin-top: -0.5rem; width: 2rem"
                    @true="opponentList.push(opponent)"
                    @false="characterName.splice(characterName.indexOf(opponent), 1)"
                    :isChecked="characterName.includes(opponent)"
                  ></CustomCheckbox>
                </div>
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
