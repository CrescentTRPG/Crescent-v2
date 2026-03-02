<script lang="ts">
import { computed, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import { ComputedRef } from 'vue'
import { useAdventureStore } from '@/stores/adventureStore.ts'
import StatBlockQuickReference from '../StatBlockQuickReference.vue'
import { useInitiativeStore } from '@/stores/initiativeStore.ts'
import HpWidgetModal from '@/components/Character/Overview/HpWidgetModal.vue'

export default {
  emits: ['render'],
  props: [
    'statBlock',
    'editable',
    'updateTemp',
    'edit',
    'initiative',
    'initiativeDisplayNumericHp',
    'initiativeDisplayNumericMana',
    'initiativeDisplayHp',
    'initiativeDisplayMana',
    'initiativeDisplayEnemyTraits',
    'initiativeDisplayCharacterTraits',
    'allowApplyStatusToCharacter',
    'allowApplyStatusToEnemy',
    'isOpponent',
    'collapseable'
  ],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()

    const adventureStore = useAdventureStore()
    const initiativeStore = useInitiativeStore()

    const wornArmorPassives = computed(() => {
      return {}
    })

    const primaryHandheldPassives = computed(() => {
      return {}
    })

    const secondaryHandheldPassives = computed(() => {
      return {}
    })
    function editStatBlock() {
      props.edit(props.statBlock.name)
    }

    const totalHp = computed(() => {
      let ret = props.statBlock.totalHp

      if (props.statBlock.hpStatusModifiers['Override Base Hp']) {
        const max = Object.values(props.statBlock.hpStatusModifiers['Override Base Hp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          ret = max
        }
      }
      let modifier = 0

      if (props.statBlock.hpStatusModifiers['Modify Base Hp']) {
        const max = Object.values(props.statBlock.hpStatusModifiers['Modify Base Hp']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (props.statBlock.currentHp > ret + modifier) {
        setCurrentAndBarrierHP(parseInt(ret + modifier + ''), props.statBlock.barrierHp)
      }
      const hp = Math.max(ret + modifier, 0)
      return hp
    })

    function setCurrentAndBarrierHP(currentHp: number, barrierHp: number) {
      let newTemp = { ...props.statBlock }
      newTemp.currentHp = currentHp
      newTemp.barrierHp = barrierHp
      hpModal.value = false
      props.updateTemp(newTemp)
    }

    const totalMana = computed(() => {
      let sum = props.statBlock.totalMana

      if (props.statBlock.manaStatusModifiers['override base mana']) {
        const max = Object.values(props.statBlock.manaStatusModifiers['override base mana']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          sum = max
        }
      }
      let modifier = 0

      if (props.statBlock.manaStatusModifiers['modify base mana']) {
        const baseModifier = props.statBlock.manaStatusModifiers['modify base mana']

        if (baseModifier) {
          const arr = Object.values(baseModifier)
          const max = arr.reduce(
            (acc: number, mod: any) =>
              parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
            -1000
          )

          if (max != -1000) {
            modifier = modifier + max
          }
        }
      }

      if (props.statBlock.currentMana > sum + modifier) {
        props.statBlock.setCurrentMana(
          Math.min(parseInt(props.statBlock.currentMana + ''), totalMana.value)
        )
      }
      const m = sum + modifier
      return m
    })

    const wornArmor = computed(() => {
      return {}
    })

    const wornShield = computed(() => {
      return {}
    })

    const isPinned: ComputedRef<boolean> = computed(() => {
      return props.statBlock.statusEffects['Pinned']?.description.length > 0 ? true : false
    })
    const isStunned: ComputedRef<boolean> = computed(() => {
      return props.statBlock.statusEffects['Stunned']?.description.length > 0 ? true : false
    })

    const isProne: ComputedRef<boolean> = computed(() => {
      return props.statBlock.statusEffects['Prone']?.description.length > 0 ? true : false
    })

    const isSlowed: ComputedRef<boolean> = computed(() => {
      return props.statBlock.statusEffects['Slowed']?.description.length > 0 ? true : false
    })
    const armorDvs: ComputedRef<number> = computed(() => {
      let modifier = 0
      if (props.statBlock?.overviewValues?.isDodging) {
        return 0
      }

      if (props.statBlock.armorStatusModifiers['Modify Armor Dvs']) {
        const max = Object.values(props.statBlock.armorStatusModifiers['Modify Armor Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (props.statBlock.armorStatusModifiers['Override Armor Dvs']) {
        const max = Object.values(
          props.statBlock.armorStatusModifiers['Override Armor Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }

      return Math.max(parseInt(props.statBlock.armorDvs + '') + modifier, 0)
    })
    const bonusDvs: ComputedRef<number> = computed(() => {
      let modifier = 0
      if (props.statBlock.armorStatusModifiers['Modify Bonus Dvs']) {
        const max = Object.values(props.statBlock.armorStatusModifiers['Modify Bonus Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.statBlock.armorStatusModifiers['Override Bonus Dvs']) {
        const max = Object.values(
          props.statBlock.armorStatusModifiers['Override Bonus Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }

      return Math.max(props.statBlock.bonusDvs + modifier, 0)
    })
    const shieldDvs: ComputedRef<number> = computed(() => {
      let modifier = 0
      if (props.statBlock?.overviewValues?.isDodging) {
        return 0
      }

      if (props.statBlock.armorStatusModifiers['Modify Shield Dvs']) {
        const max = Object.values(props.statBlock.armorStatusModifiers['Modify Shield Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }

      if (props.statBlock.armorStatusModifiers['Override Shield Dvs']) {
        const max = Object.values(
          props.statBlock.armorStatusModifiers['Override Shield Dvs']
        ).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return Math.max(max + modifier, 0)
        }
      }

      return Math.max(parseInt(props.statBlock.shieldDvs + '') + modifier, 0)
    })

    const moveDvs: ComputedRef<number> = computed(() => {
      let modifier = 0

      if (props.statBlock.armorStatusModifiers['Modify Move Dvs']) {
        const max = Object.values(props.statBlock.armorStatusModifiers['Modify Move Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          -1000
        )
        if (max != -1000) {
          modifier = modifier + max
        }
      }
      if (props.statBlock.armorStatusModifiers['Override Move Dvs']) {
        const max = Object.values(props.statBlock.armorStatusModifiers['Override Move Dvs']).reduce(
          (acc: number, mod: any) =>
            parseInt(mod.modAmount) > acc ? parseInt(mod.modAmount) : acc,
          0
        )
        if (max > 0) {
          return isStunned.value || isPinned ? 0 : Math.max(max + modifier, 0)
        }
      }

      const perks = Object.values(props.statBlock.perks)
      if (props.statBlock?.overviewValues?.isDodging) {
        return isStunned.value || isPinned.value
          ? 0
          : perks.reduce((acc: number, perk: any) => (perk.rank > acc ? perk.rank : acc), 0) +
              15 +
              modifier
      }

      return isStunned.value || isPinned.value || isProne.value
        ? 0
        : props.statBlock.moveDvs + modifier
    })
    const totalDvs: ComputedRef<number> = computed(() => {
      return (
        parseInt(armorDvs.value + '') +
        parseInt(shieldDvs.value + '') +
        parseInt(moveDvs.value + '') +
        parseInt(bonusDvs.value + '')
      )
    })

    function addCustomStatus(status) {
      let newTemp = { ...props.statBlock }
      newTemp.customStatusEffects[status.name] = status
      props.updateTemp(newTemp)
    }

    function changeInitiative(key: string, newVal: number, agi: string | number) {
      initiativeStore.changeInitiativeOrder(key, newVal, agi)
    }

    function addStatus(status, check, duration, rank, icon, description, damageType, id) {
      let newTemp = { ...props.statBlock }
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
      props.updateTemp(newTemp)
    }
    function removeStatus(name: string) {
      let newTemp = { ...props.statBlock }

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
      props.updateTemp(newTemp)
    }
    function addNewHpStatusModifier(modifier) {
      let newTemp = { ...props.statBlock }
      const modRef = newTemp.hpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      newTemp.hpStatusModifiers[modifier.modifierType] = { ...modRef, [pos]: modifier }
      if (modifier.linkedStatus) {
        newTemp.customStatusEffects[modifier.linkedStatus].linkedModifiers.push(
          'HP: ' + modifier.modifierType + ' : ' + modifier.modAmount
        )
      }
      props.updateTemp(newTemp)
    }
    function removeHpStatusModifier(modifier) {
      let newTemp = { ...props.statBlock }
      const modRef = newTemp.hpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.hpStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.hpStatusModifiers[modifier.modifierType]
      }
      props.updateTemp(newTemp)
    }
    function removeMpStatusModifier(modifier) {
      let newTemp = { ...props.statBlock }
      const modRef = newTemp.mpStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.mpStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.mpStatusModifiers[modifier.modifierType]
      }
      props.updateTemp(newTemp)
    }
    function removeManaStatusModifier(modifier) {
      let newTemp = { ...props.statBlock }
      const modRef = newTemp.manaStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.manaStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.manaStatusModifiers[modifier.modifierType]
      }
      props.updateTemp(newTemp)
    }
    function removeArmorStatusModifier(modifier) {
      let newTemp = { ...props.statBlock }
      const modRef = newTemp.armorStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.armorStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.armorStatusModifiers[modifier.modifierType]
      }
      props.updateTemp(newTemp)
    }
    function removeAttributeStatusModifier(modifier) {
      let newTemp = { ...props.statBlock }

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
      props.updateTemp(newTemp)
    }

    function removeMovementStatusModifier(modifier: any) {
      let newTemp = { ...props.statBlock }
      const modRef = newTemp.movementStatusModifiers[modifier.modifierType]
      const pos = modifier.modAmount + ' '
      if (modRef && modRef[pos]) {
        delete modRef[pos]
      }
      if (Object.values(newTemp.movementStatusModifiers[modifier.modifierType] || {}).length == 0) {
        delete newTemp.movementStatusModifiers[modifier.modifierType]
        props.updateTemp(newTemp)
      }
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
    const hpModal = ref(false)
    function setHp(current: any, total: any) {
      let newTemp = { ...props.statBlock }
      newTemp.currentHp = parseInt(current + '')
      newTemp.totalHp = parseInt(total + '')
      props.updateTemp(newTemp)
    }
    function setHpModal(bool: boolean) {
      hpModal.value = bool
    }
    return {
      designStore,
      modal,
      props,
      totalHp,
      wornArmorPassives,
      secondaryHandheldPassives,
      primaryHandheldPassives,
      totalMana,
      totalDvs,
      addStatus,
      removeStatus,
      addCustomStatus,
      editStatBlock,
      changeInitiative,
      hpModal,
      removeHpStatusModifier,
      setCurrentAndBarrierHP,
      addNewHpStatusModifier,
      setHp,
      setHpModal
    }
  },
  components: {
    StatBlockQuickReference,
    HpWidgetModal
  }
}
</script>

<template>
  <div>
    <StatBlockQuickReference
      :initiative="props.initiative"
      :edit="editStatBlock"
      :id="props.statBlock.id"
      :image="props.statBlock.image"
      :name="props.statBlock.name"
      :archetype="props.statBlock.archetype"
      :level="Math.floor(props.statBlock.totalAbilityPoints / 10)"
      :statusEffects="props.statBlock.statusEffects"
      :currentHp="props.statBlock.currentHp"
      :totalHp="totalHp"
      :currentMana="props.statBlock.currentMana"
      :totalMana="totalMana"
      :secondaryHandheldPassives="secondaryHandheldPassives"
      :primaryHandheldPassives="primaryHandheldPassives"
      :wornArmorPassives="wornArmorPassives"
      :wornArmor="props.statBlock.wornArmor"
      :wornShield="props.statBlock.wornShield"
      :totalDvs="totalDvs"
      :armorStatusModifiers="{}"
      :addNewArmorStatusModifier="() => {}"
      :removeArmorStatusModifier="() => {}"
      :traits="props.statBlock.traits || {}"
      :editable="props.editable"
      :addStatus="addStatus"
      :addCustomStatus="addCustomStatus"
      :removeCustomStatus="removeStatus"
      :customStatusEffects="props.statBlock.customStatusEffects"
      :removeStatus="removeStatus"
      :changeInitiative="changeInitiative"
      :agi="props.statBlock.attributes.agility"
      :keyVal="props.statBlock.name"
      :openHpModal="() => (hpModal = true)"
      :isOpponent="true"
      :initiativeDisplayNumericHp="initiativeDisplayNumericHp"
      :initiativeDisplayNumericMana="initiativeDisplayNumericMana"
      :initiativeDisplayHp="initiativeDisplayHp"
      :initiativeDisplayMana="initiativeDisplayMana"
      :initiativeDisplayEnemyTraits="initiativeDisplayEnemyTraits"
      :initiativeDisplayCharacterTraits="initiativeDisplayCharacterTraits"
      :allowApplyStatusToCharacter="allowApplyStatusToCharacter"
      :allowApplyStatusToEnemy="allowApplyStatusToEnemy"
      :collapseable="props.collapseable"
      :setHpModal="setHpModal"
    ></StatBlockQuickReference>
    <HpWidgetModal
      :setCurrentAndBarrier="setCurrentAndBarrierHP"
      :totalHp="totalHp"
      :traits="statBlock.traits"
      :secondaryHandheldPassives="secondaryHandheldPassives"
      :primaryHandheldPassives="primaryHandheldPassives"
      :wornArmorPassives="wornArmorPassives"
      :current-hp="statBlock.currentHp"
      :barrier-hp="statBlock.barrierHp"
      :hpStatusModifiers="statBlock.hpStatusModifiers"
      :statusEffects="statBlock.statusEffects"
      :removeHpStatusModifier="removeHpStatusModifier"
      :addNewHpStatusModifier="addNewHpStatusModifier"
      :setHp="setHp"
      :modal="hpModal"
      :setModal="(newVal) => (hpModal = newVal)"
      :restiricted-mode="true"
    ></HpWidgetModal>
  </div>
</template>

<style></style>
