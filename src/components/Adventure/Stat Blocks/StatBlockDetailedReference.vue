<script lang="ts">
import EffectsRibbon from '@/components/Character/Overview/EffectsRibbon.vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import { GenericModifier } from '@/stores/characterStore.ts'
import { useDesignStore } from '@/stores/designStore.ts'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BOffcanvas from 'bootstrap-vue-next/src/components/BOffcanvas/BOffcanvas.vue'
import _ from 'lodash'
import { computed, ComputedRef, onMounted, ref, watch } from 'vue'
import RandomlyGenerateStatBlock from './RandomlyGenerateStatBlock.vue'
import StatBlockAbilitiesWrapper from './StatBlockAbiltiesWrapper.vue'
import StatBlockAttributes from './StatBlockAttributes.vue'
import StatBlockBio from './StatBlockBio.vue'
import StatBlockHeader from './StatBlockHeader.vue'
import StatBlockMovespeedWrapper from './StatBlockMovespeedWrapper.vue'
import StatBlockState from './StatBlockState.vue'
import StatBlockVersionControl from './StatBlockVersionControl.vue'
import StatBlockEquipment from './StatBlockEquipment.vue'

export default {
  props: [
    'currentStatBlock',
    'isEditing',
    'goBack',
    'lightenDarkenColor',
    'rm',
    'inCombat',
    'updateCombat',
    'currentStatBlockId',
    'omitVersionControl',
    'omitDetails',
    'omitToolbar',
    'useIconInsteadOfPowerLevel'
  ],
  setup(props, context) {
    const designStore = useDesignStore()
    function editModeSwitch() {
      editing.value = !editing.value
    }
    const editing = ref(props.isEditing)
    const randomized = ref(false)
    const adventureStore = useAdventureStore()
    const statBlock = ref({ ...props.currentStatBlock })
    function updateTemp(newBlock) {
      currentStatBlockTemp.value = newBlock
      if (props.inCombat) {
        props.updateCombat(currentStatBlockTemp.value)
      }
    }
    function updateFromRandom(newBlock) {
      updateTemp(newBlock)
      randomized.value = true
    }
    function updateRandom() {
      randomized.value = false
    }
    const wornArmorPassives = computed(() => {
      return (
        currentStatBlockTemp.value.equipment.items.Armor[
          currentStatBlockTemp.value.equipment.wornArmor
        ]?.equippedStats?.passives || {}
      )
    })

    const primaryHandheldPassives = computed(() => {
      return (
        currentStatBlockTemp.value.equipment.items.Weapon[
          currentStatBlockTemp.value.equipment.primaryHand
        ]?.equippedStats?.passives || {}
      )
    })

    const secondaryHandheldPassives = computed(() => {
      return (
        currentStatBlockTemp.value.equipment.items.Shield[
          currentStatBlockTemp.value.equipment.secondaryHand
        ]?.equippedStats?.passives ||
        currentStatBlockTemp.value.equipment.items.Weapon[
          currentStatBlockTemp.value.equipment.secondaryHand
        ]?.equippedStats?.passives ||
        {}
      )
    })
    const powerLevel = ref(0)
    const overridePowerLevel = ref('')
    const overrideIcon = ref('')
    const powerIcon = ref('gi-uncertainty')
    const currentStatBlockTemp = ref({ ...props.currentStatBlock })
    const versionObjs = ref({})
    const currentVersion = ref(currentStatBlockTemp.value.currentVersion)
    watch(props, (newVal, oldVal) => {
      if (props.currentStatBlock.name != currentStatBlockTemp.value.name) {
        currentStatBlockTemp.value = props.currentStatBlock
      }
      if (props.currentStatBlock != statBlock.value) {
        statBlock.value = { ...props.currentStatBlock }
        currentStatBlockTemp.value = props.currentStatBlock
      }
    })
    onMounted(() => {
      currentStatBlockTemp.value = { ...props.currentStatBlock, versionObjs: null }
      versionObjs.value = props.currentStatBlock.versionObjs
      if (props.omitVersionControl! && currentStatBlockTemp?.value?.versions?.length > 0) {
        currentStatBlockTemp.value = {
          ...versionObjs.value[currentStatBlockTemp.value.currentVersion]
        }
      }
    })
    const isPinned: ComputedRef<boolean> = computed(() => {
      return currentStatBlockTemp.value.statusEffects['Pinned']?.description.length > 0 ||
        currentStatBlockTemp.value.statusEffects['Grappled']?.description.length > 0
        ? true
        : false
    })
    const isStunned: ComputedRef<boolean> = computed(() => {
      return currentStatBlockTemp.value.statusEffects['Stunned']?.description.length > 0
        ? true
        : false
    })

    const isProne: ComputedRef<boolean> = computed(() => {
      return currentStatBlockTemp.value.statusEffects['Prone']?.description.length > 0
        ? true
        : false
    })

    const isSlowed: ComputedRef<boolean> = computed(() => {
      return currentStatBlockTemp.value.statusEffects['Slowed']?.description.length > 0 ||
        currentStatBlockTemp.value.statusEffects['Encumbered']?.description.length > 0
        ? true
        : false
    })

    function removeMovementStatusModifier(modifier: GenericModifier) {
      const modRef = currentStatBlockTemp.value.movementStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (
        Object.values(
          currentStatBlockTemp.value.movementStatusModifiers[modifier.modifierType] || {}
        ).length == 0
      ) {
        delete currentStatBlockTemp.value.movementStatusModifiers[modifier.modifierType]
      }
    }

    function addCustomStatus(status) {
      let newTemp = { ...currentStatBlockTemp.value }
      newTemp.customStatusEffects[status.name] = status
      updateTemp(newTemp)
    }

    function addStatus(status, check, duration, icon, description, rank, damageType) {
      let newTemp = { ...currentStatBlockTemp.value }
      let statusObj = {
        name: status,
        checkToBreak: check,
        duration: duration,
        icon: icon,
        damageType: damageType,
        description: description,
        linkedModifiers: [],
        isBasic: true,
        rank: rank
      }
      newTemp.statusEffects[statusObj.name] = statusObj
      updateTemp(newTemp)
    }
    function removeStatus(name: string) {
      let newTemp = { ...currentStatBlockTemp.value }

      if (newTemp.customStatusEffects[name]) {
        removeLinkedModifiers(newTemp.customStatusEffects[name])
        delete newTemp.customStatusEffects[name]
      }
      if (newTemp.statusEffects[name]) {
        delete newTemp.statusEffects[name]
      }
      if (newTemp.traits[name]) {
        delete newTemp.traits[name]
      }
      updateTemp(newTemp)
    }
    function removeLinkedModifiers(customStatus: any) {
      customStatus.linkedModifiers.forEach((mod) => {
        const modArr = mod.split(':')
        switch (modArr[0]) {
          case 'HP':
            removeHpStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1)),
              sufferingDamageType: ''
            })
            break
          case 'Mana':
            removeManaStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
            break
          case 'Mp':
            removeMpStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
            break
          case 'Move':
            removeMovementStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
            break
          case 'Armor':
            removeArmorStatusModifier({
              linkedStatus: '',
              modifierType: modArr[1].substring(1, modArr[1].length - 1),
              modAmount: parseInt(modArr[2].substring(1))
            })
        }
        const attr = modArr[0].split(',')[1]
        if (attr) {
          removeAttributeStatusModifier({
            linkedStatus: '',
            modifierType: modArr[1].substring(1, modArr[1].length - 1),
            modAmount: parseInt(modArr[2].substring(1)),
            attribute: attr.substring(1)
          })
        }
      })
    }
    function removeHpStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.hpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.hpStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.hpStatusModifiers[modifier.modifierType]
      }
      updateTemp(newTemp)
    }
    function removeMpStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.mpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.mpStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.mpStatusModifiers[modifier.modifierType]
      }
      updateTemp(newTemp)
    }
    function removeManaStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.manaStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.manaStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.manaStatusModifiers[modifier.modifierType]
      }
      updateTemp(newTemp)
    }
    function removeArmorStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }
      const modRef = newTemp.armorStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.armorStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.armorStatusModifiers[modifier.modifierType]
      }
      updateTemp(newTemp)
    }
    function removeAttributeStatusModifier(modifier) {
      let newTemp = { ...props.currentStatBlock }

      const attribute = modifier.attribute.toLowerCase()

      const modRef = newTemp.attributeStatusModifiers[attribute][modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (
        (
          (newTemp.attributeStatusModifiers[attribute] &&
            Object.values(newTemp.attributeStatusModifiers[attribute][modifier.modifierType])) ||
          {}
        ).length == 0
      ) {
        delete newTemp.attributeStatusModifiers[attribute][modifier.modifierType]
      }
      updateTemp(newTemp)
    }

    function save() {
      currentStatBlockTemp.value.powerLevel = powerLevel.value
      currentStatBlockTemp.value.overrideIcon = overrideIcon.value
      currentStatBlockTemp.value.overridePwerLevel = overridePowerLevel.value
      currentStatBlockTemp.value.powerIcon = powerIcon.value

      if (props.currentStatBlockId) {
        adventureStore.putStatBlock(currentStatBlockTemp.value, props.currentStatBlockId)
      } else {
        adventureStore.postStatBlock(currentStatBlockTemp.value)
      }
      props.goBack()
    }

    function getStyles() {
      if (editing.value) return { border: '2px solid ' + designStore.alertTheme }
    }
    function addNewVersion(version) {
      versionObjs.value[version] = _.cloneDeep(currentStatBlockTemp.value)
      currentStatBlockTemp.value.versions.push(version)
    }
    function selectVersion(version) {
      versionObjs.value[currentStatBlockTemp.value.currentVersion] = _.cloneDeep(
        currentStatBlockTemp.value
      )
      currentStatBlockTemp.value = _.cloneDeep(versionObjs.value[version])
      currentStatBlockTemp.value.versions =
        versionObjs.value[currentStatBlockTemp.value.currentVersion].versions
      currentStatBlockTemp.value.currentVersion = version
      currentVersion.value = version
    }
    const showBio = ref(false)

    function toggleBio() {
      showBio.value = !showBio.value
    }
    const showEquipment = ref(false)

    function updateTempEquipment(equipment) {
      currentStatBlockTemp.value.equipment = equipment
      updateTemp(currentStatBlockTemp.value)
    }
    return {
      designStore,
      statBlock,
      props,
      updateTemp,
      currentStatBlockTemp,
      isPinned,
      isStunned,
      isProne,
      isSlowed,
      removeMovementStatusModifier,
      addCustomStatus,
      addStatus,
      removeStatus,
      removeAttributeStatusModifier,
      removeArmorStatusModifier,
      editModeSwitch,
      editing,
      getStyles,
      versionObjs,
      addNewVersion,
      selectVersion,
      currentVersion,
      randomized,
      updateFromRandom,
      updateRandom,
      save,
      powerLevel,
      showBio,
      toggleBio,
      powerIcon,
      overrideIcon,
      overridePowerLevel,
      removeHpStatusModifier,
      removeManaStatusModifier,
      removeMpStatusModifier,
      showEquipment,
      updateTempEquipment,
      wornArmorPassives,
      primaryHandheldPassives,
      secondaryHandheldPassives
    }
  },
  components: {
    StatBlockHeader,
    StatBlockVersionControl,
    StatBlockAttributes,
    StatBlockBio,
    StatBlockState,
    StatBlockAbilitiesWrapper,
    StatBlockMovespeedWrapper,
    EffectsRibbon,
    BButton,
    RandomlyGenerateStatBlock,
    BOffcanvas,
    StatBlockEquipment
  }
}
</script>
<template>
  <div
    style="height: max-content; min-height: 100vh; padding-bottom: 3rem; flex-grow: 1"
    :style="getStyles()"
  >
    <StatBlockHeader
      v-if="!useIconInsteadOfPowerLevel"
      :current-stat-block="currentStatBlockTemp"
      :updateTemp="updateTemp"
      :is-editing="editing"
      :useIconInsteadOfPowerLevel="props.useIconInsteadOfPowerLevel"
      @power="(level) => (powerLevel = level)"
      @powerIcon="(icon) => (powerIcon = icon)"
      @overrideIcon="(icon) => (overrideIcon = icon)"
      @overridePowerLevel="(level) => (overridePowerLevel = level)"
      :wornArmorPassives="wornArmorPassives"
      :secondaryHandheldPassives="secondaryHandheldPassives"
      :primaryHandheldPassives="primaryHandheldPassives"
    ></StatBlockHeader>

    <div
      style="display: flex; width: 100%; height: inherit; overflow-y: auto"
      v-if="!showEquipment"
    >
      <div style="flex-grow: 1">
        <div class="arrangeMainBlock">
          <div>
            <StatBlockState
              :isStunned="isStunned"
              :isPinned="isPinned"
              :isProne="isProne"
              :isSlowed="isSlowed"
              :current-stat-block="currentStatBlockTemp"
              :is-editing="editing"
              :updateTemp="updateTemp"
              :removeHpStatusModifier="removeHpStatusModifier"
              :removeManaStatusModifier="removeManaStatusModifier"
              :removeMpStatusModifier="removeMpStatusModifier"
              :removeArmorStatusModifier="removeArmorStatusModifier"
              :wornArmorPassives="wornArmorPassives"
              :secondaryHandheldPassives="secondaryHandheldPassives"
              :primaryHandheldPassives="primaryHandheldPassives"
            ></StatBlockState>
          </div>
          <div style="display: flex; flex-direction: column; flex-grow: 1">
            <StatBlockVersionControl
              v-if="!props.omitVersionControl"
              :versions="currentStatBlockTemp.versions"
              :currentStatBlock="currentStatBlockTemp"
              :currentVersion="currentStatBlockTemp.currentVersion"
              :is-editing="editing"
              :versionObjs="versionObjs"
              :selectVersion="selectVersion"
              :addNewVersion="addNewVersion"
              :toggle="toggleBio"
            ></StatBlockVersionControl>
            <EffectsRibbon
              :traits="currentStatBlockTemp.traits"
              :customStatusEffects="currentStatBlockTemp.customStatusEffects"
              :addCustomStatus="addCustomStatus"
              :removeStatus="removeStatus"
              :addStatus="addStatus"
              :statuses="currentStatBlockTemp.statusEffects"
              :is-editing="editing"
              :currentStatBlock="currentStatBlockTemp"
              :updateTemp="updateTemp"
            ></EffectsRibbon>
            <div>
              <StatBlockAttributes
                :is-editing="editing"
                :current-stat-block="currentStatBlockTemp"
                :updateTemp="updateTemp"
                :removeAttributeStatusModifier="removeAttributeStatusModifier"
                :wornArmorPassives="wornArmorPassives"
                :secondaryHandheldPassives="secondaryHandheldPassives"
                :primaryHandheldPassives="primaryHandheldPassives"
              ></StatBlockAttributes>
            </div>
            <StatBlockMovespeedWrapper
              :current-stat-block="currentStatBlockTemp"
              :isStunned="isStunned"
              :isPinned="isPinned"
              :isProne="isProne"
              :isSlowed="isSlowed"
              :isEditing="editing"
              :removeMovementStatusModifier="removeMovementStatusModifier"
              :updateTemp="updateTemp"
              :wornArmorPassives="wornArmorPassives"
              :secondaryHandheldPassives="secondaryHandheldPassives"
              :primaryHandheldPassives="primaryHandheldPassives"
            ></StatBlockMovespeedWrapper>
            <StatBlockAbilitiesWrapper
              :updateTemp="updateTemp"
              :current-stat-block="currentStatBlockTemp"
              :is-editing="editing"
              :currentVersion="currentVersion"
              :selectVersion="selectVersion"
              :randomized="randomized"
              :updateRandom="updateRandom"
            ></StatBlockAbilitiesWrapper>
          </div>
        </div>
      </div>
      <StatBlockBio
        :collapsable="true"
        v-if="!props.omitDetails"
        class="bioSidebar"
        :is-editing="editing"
        :update-temp="updateTemp"
        :current-stat-block="currentStatBlockTemp"
      ></StatBlockBio>
      <BOffcanvas
        class="bioOffCanvas"
        v-model="showBio"
        placement="end"
        :teleportDisabled="false"
        :backdrop="true"
        shadow="false"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          '--bs-btn-close-color': designStore.primaryText
        }"
      >
        <StatBlockBio
          :collapsable="false"
          style="width: 100%"
          :is-editing="editing"
          :update-temp="updateTemp"
          :current-stat-block="currentStatBlockTemp"
        ></StatBlockBio>
      </BOffcanvas>
    </div>
    <div v-else style="width: 100%">
      <StatBlockEquipment
        :update="updateTempEquipment"
        :equipment="currentStatBlockTemp.equipment"
        :updateTemp="updateTemp"
        :currentStatBlock="currentStatBlockTemp"
        :currentStatBlockId="currentStatBlockId"
      ></StatBlockEquipment>
    </div>
    <div
      v-if="!props.omitToolbar"
      style="
        display: flex;
        justify-content: space-between;
        border-top: 2px solid;
        position: fixed;
        width: 100%;
        bottom: 0;
        z-index: 5;
      "
      :style="{
        background: designStore.primaryTheme,
        color: designStore.sidebarText,
        borderColor: editing ? designStore.alertTheme : designStore.secondaryTheme
      }"
    >
      <div style="display: flex; justify-content: space-between; margin: 0.2rem; width: 100%">
        <div style="display: flex">
          <BButton
            @click="editing = !editing"
            class="footerButtons"
            :style="{
              color: editing ? designStore.alertTheme : designStore.primaryText,
              borderColor: editing ? designStore.alertTheme : designStore.secondaryTheme
            }"
          >
            <div v-if="editing" style="display: flex">
              <div class="goBackText" style="margin-right: 0.25rem">Toggle Edit Mode</div>
              <i class="bi bi-pen"></i>
            </div>
            <div v-else style="display: flex">
              <div class="goBackText" style="margin-right: 0.25rem">Toggle Edit Mode</div>
              <i class="bi bi-binoculars"></i></div
          ></BButton>
          <BButton
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="showEquipment = !showEquipment"
            class="footerButtons"
            style="margin-left: 0.5rem"
          >
            <div v-if="showEquipment" style="display: flex">
              <div class="goBackText" style="margin-right: 0.25rem">Toggle Tab</div>
              <i class="bi bi-backpack4"></i>
            </div>
            <div v-else style="display: flex">
              <div class="goBackText" style="margin-right: 0.25rem">Toggle Tab</div>
              <i class="bi bi-view-list"></i></div
          ></BButton>
        </div>
        <div style="display: flex">
          <RandomlyGenerateStatBlock
            v-if="editing"
            :updateFromRandom="updateFromRandom"
            :current-stat-block="currentStatBlockTemp"
          ></RandomlyGenerateStatBlock>
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
            <div style="margin-left: 0.5rem; margin-right: 0.25rem" class="goBackText">Save</div>
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
            @click="props.goBack()"
          >
            <i class="bi bi-arrow-90deg-left"></i>
            <div class="discardText">Return</div>
            <div class="goBackText"></div>
          </BButton>
          <BButton
            v-if="props.rm"
            class="footerButtons"
            style="margin-left: 0.5rem"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="props.rm(currentStatBlockTemp.value.id)"
          >
            <i class="bi bi-trash"></i>
            <div style="margin-left: 0.5rem" class="discardText">Delete</div>
            <div class="goBackText">and Go Back</div>
          </BButton>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.arrangeMainBlock {
  height: inherit;
  display: flex;
}
.bioSidebar {
  display: flex;
  flex-direction: column;
}
.bioOffCanvas {
  display: none;
}

.discardText {
  margin-right: 0.25rem;
  margin-left: 0.25rem;
}
.footerButtons {
  font-size: large;
  align-self: center;
  border: 2px solid;
  display: flex;
}

@media (max-width: 1300px) {
  .bioSidebar {
    display: none;
  }
  .bioOffCanvas {
    display: flex;
    flex-direction: column;
  }
  .footerButtons {
    font-size: medium;
    align-self: center;
    border: 2px solid;
  }
}

@media (max-width: 1100px) {
  .discardText {
    margin-left: 0.25rem;
  }
  .goBackText {
    display: none;
  }
}
@media (max-width: 800px) {
  .arrangeMainBlock {
    height: inherit;
    display: flex;
    flex-direction: column;
  }
}
</style>
