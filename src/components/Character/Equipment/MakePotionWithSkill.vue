<script lang="ts">
import CustomModal from '@/components/CustomModal.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'
import { useUserStore } from '@/stores/userStore.ts'
import { BButton, BFormInput } from 'bootstrap-vue-next'
import { storeToRefs } from 'pinia'
import { computed, Ref, ref, watch } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { Potion, useEquipmentStore } from '@/stores/equipmentStore.ts'

import { useCharacterComputedStore } from '@/stores/characterComputedStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import BasicInput from '../BasicInput.vue'
import _ from 'lodash'
import CustomCheckbox from '../CustomCheckbox.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useStatusEffectStore } from '@/stores/statusEffectStore.ts'

export default {
  emits: ['closeModal'],
  props: [
    'showModal',
    'ingredients',
    'modifyIsHidden',
    'difficulty',
    'name',
    'ability',
    'closeAndClearBrew'
  ],
  setup(props, context) {
    const modal = ref(false)
    const infoModal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const characterComputedStore = useCharacterComputedStore()
    const equipmentStore = useEquipmentStore()
    const { alchemicalIngredients } = storeToRefs(equipmentStore)
    const skillStore = useSkillStore()
    const statusEffectsStore = useStatusEffectStore()
    const { getSkills } = storeToRefs(statusEffectsStore)
    const { skills } = storeToRefs(skillStore)
    function attemptBrew() {}
    watch(props, (thing, thing2) => {
      payingFor.value = [...props.ingredients]
    })
    const amount = ref(0)
    const nameOverride = ref(props.name)
    const payingFor: Ref<string[]> = ref([...props.ingredients])
    function removeFromIngredients(i) {
      console.log(i)
      let index = payingFor.value.indexOf(i)
      console.log(index)

      payingFor.value.splice(index, 1)
      console.log(payingFor.value)
    }
    const cost = computed(() => {
      let ret = 0
      props.ingredients.forEach((element) => {
        if (payingFor.value.indexOf(element) >= 0) {
          ret +=
            alchemicalIngredients.value.bases[element]?.numericalCost ||
            alchemicalIngredients.value.reagents[element]?.numericalCost ||
            alchemicalIngredients.value.mutagens[element]?.numericalCost
        }
      })
      return ret
    })
    watch(props, (a, b) => {
      nameOverride.value = props.name
    })
    function makeAlchemyRoll() {
      let mods = characterStore.diceStatusModifiers['alchemy']
      let numrolls = getSkills.value['Alchemy'].placed + 2

      let rolls: number[] = []
      for (let i = 0; i < numrolls; i++) {
        rolls.push(Math.floor(Math.random() * 10) + 1)
      }
      rolls.sort()
      rollobj.value = {
        roll1: rolls[numrolls - 1],
        roll2: rolls[numrolls - 2],
        total: getSkills.value['Alchemy'].modifier + rolls[numrolls - 1] + rolls[numrolls - 2],
        discardedRolls: rolls.slice(0, numrolls - 2)
      }
      if (rollobj.value.total - props.difficulty >= 15) amount.value = 3
      else if (rollobj.value.total - props.difficulty >= 10) {
        amount.value = 2
      } else if (rollobj.value.total - props.difficulty >= 0) {
        amount.value = 1
      } else {
        amount.value = 0
      }
      return getSkills.value['Alchemy'].modifier + rolls[numrolls - 1] + rolls[numrolls - 2]
    }
    const rollobj = ref({ total: 0, roll1: 0, roll2: 0, discardedRolls: [] as number[] })

    const costInWords = computed(() => {
      let strOutput = ''
      let coinRemainder = cost.value
      let coins = Object.values(equipmentStore.equipment.coins)
      for (let i = 0; i < coins.length; i++) {
        if (coinRemainder % coins[i].exchangeRate === 0) {
          coinRemainder = coinRemainder / coins[i].exchangeRate
        } else {
          if (strOutput.length > 0)
            strOutput =
              (coinRemainder % coins[i].exchangeRate) + ' ' + coins[i].name + ' and ' + strOutput
          else
            strOutput =
              (coinRemainder % coins[i].exchangeRate) + ' ' + coins[i].name + ' ' + strOutput
          coinRemainder = Math.floor(coinRemainder / coins[0].exchangeRate)
        }
        if (coinRemainder <= 0) {
          break
        }
      }
      return strOutput
    })
    const exists = computed(() => {
      return equipmentStore.equipment.items.Potion[nameOverride.value]?.name ? true : false
    })
    const hasSameIngredients = computed(() => {
      let arr1 = [...props.ingredients].sort()
      let arr2 = [
        ...(equipmentStore.equipment.items.Potion[nameOverride.value]?.ingredients || [])
      ].sort()
      if (arr1.length != arr2.length) {
        return false
      } else {
        for (let i = 0; i < arr1.length; i++) {
          if (arr1[i] != arr2[i]) {
            return false
          }
        }
      }
      return exists.value && true
    })

    function dispatchMakePotion() {
      if (amount.value > 0) {
        dispatchAddPotionAndSpend(true)
      } else {
        dispatchAddPotionAndSpend(false)
      }
      rollobj.value = { total: 0, roll1: 0, roll2: 0, discardedRolls: [] }
    }

    function dispatchAddPotionAndSpend(add) {
      let coins = _.cloneDeep(equipmentStore.equipment.coins)
      let remaining = cost.value
      let mul = 1
      for (let i = 0; i < Object.keys(coins).length; i++) {
        if (remaining <= coins[i].amount * mul) {
          let mun = coins[i].amount * mul - remaining

          coins[i].amount = Math.floor(mun / mul)
          if (coins[i - 1]) {
            coins[i - 1].amount = (mun % mul) / (mul / coins[i - 1].exchangeRate)
            if (coins[i - 1].amount % 1 !== 0) {
              if (coins[i - 2])
                coins[i - 2].amount = Math.round(
                  (coins[i - 1].amount % 1) * coins[i - 2].exchangeRate
                )
              coins[i - 1].amount = Math.floor(coins[i - 1].amount)
            }
          }
          remaining = 0
          break
        } else {
          remaining = remaining - coins[i].amount * mul
          mul = mul * coins[i].exchangeRate
          coins[i].amount = 0
        }
      }
      console.log(coins)
      if (remaining > 0) {
        alert('YOU ARE TOO BROKE')
      } else {
        equipmentStore.setCoins(coins)
        if (add) {
          dispatchAddPotion()
        }
      }
    }
    const rollDescription = computed(() => {
      if (getSkills.value['Alchemy'].placed > 0) {
        return (
          '( 2d10' +
          '*' +
          getSkills.value['Alchemy'].placed +
          ' + ' +
          getSkills.value['Alchemy'].modifier +
          ' )'
        )
      }
      return '( 2d10' + ' + ' + getSkills.value['Alchemy'].modifier + ' )'
    })
    function dispatchAddPotion() {
      if (hasSameIngredients.value) {
        equipmentStore.increaseItemAmount(nameOverride.value, amount.value, 'Potion')
      } else {
        let newPotion: Potion = {
          name: nameOverride.value,
          count: amount.value,
          description: 'Potion containing the ingredients ' + props.ingredients,
          type: 'Potion',
          isAttuneable: false,
          isAttuned: false,
          equippedStats: {
            ability: { name: '' },
            passives: {},
            material: '',
            enchantments: {},
            technicalAddons: {},
            materialCoverings: {}
          },
          ingredients: props.ingredients,
          ability: props.ability
        }
        equipmentStore.addItem(newPotion)
      }
    }
    return {
      designStore,
      equipmentStore,
      props,
      amount,
      context,
      dispatchAddPotion,
      alchemicalIngredients,
      cost,
      nameOverride,
      costInWords,
      dispatchAddPotionAndSpend,
      exists,
      payingFor,
      removeFromIngredients,
      hasSameIngredients,
      dispatchMakePotion,
      makeAlchemyRoll,
      rollobj,
      rollDescription
    }
  },
  components: {
    BButton,
    CustomModal,
    BasicInput,
    CustomCheckbox
    // TitleWidget
  }
}
</script>

<template>
  <div>
    <CustomModal
      :showModal="props.showModal"
      title="Make Potion(s)"
      @close="(context.emit('closeModal'), props.modifyIsHidden(false), props.closeAndClearBrew())"
    >
      <template v-slot:body>
        <div>
          <div
            style="
              display: flex;
              text-align: center;
              margin-bottom: 0.5rem;
              border-bottom: 1px solid;
            "
            :style="{
              background: designStore.sidebarBacking,
              borderColor: designStore.secondaryTheme,
              color: designStore.sidebarText
            }"
          >
            <div style="padding: 0.25rem">Current Funds:</div>
            <div
              style="padding: 0.25rem"
              v-for="coin in Object.values(equipmentStore.equipment.coins)"
              :key="coin.name"
            >
              {{ coin.amount + ' ' + coin.name + ' ' }}
            </div>
          </div>
          <div style="display: flex; flex-wrap: wrap; text-align: center; margin-bottom: 0.5rem">
            <div style="align-self: center">{{ props.difficulty }} Alchemy Check to brew</div>
            <BasicInput
              style="margin-left: 0.5rem; margin-right: 0.5rem; width: fit-content; flex-grow: 1"
              :style="{ borderColor: designStore.secondaryTheme }"
              :value="nameOverride"
              @new-value="(val) => (nameOverride = val)"
            ></BasicInput>
            <div v-if="costInWords" style="align-self: center">for {{ costInWords }}</div>
            <div v-else style="align-self: center">for FREE</div>
          </div>

          <div v-if="hasSameIngredients" :style="{ color: designStore.alertTheme }">
            {{ equipmentStore.equipment.items.Potion[nameOverride]?.count }} in Inventory
          </div>
          <div v-else-if="exists" :style="{ color: designStore.alertTheme }">
            WARNING, Item by this name with different ingredients already exists, making this will
            override that existing item.
          </div>
          <div
            style="margin-bottom: -0.5rem; margin-top: 1rem"
            :style="{ color: designStore.primaryText }"
          >
            Include Ingredient Cost...
          </div>
          <div>
            <hr style="margin-bottom: -0.5rem" :style="{ color: designStore.secondaryTheme }" />

            <div
              style="padding-bottom: 0.25rem"
              :style="{
                background: designStore.inputBacking,
                borderColor: designStore.secondaryTheme,
                color: designStore.inputText
              }"
              v-for="i in props.ingredients"
              :key="i"
            >
              <div style="display: flex; padding-left: 0.5rem">
                <CustomCheckbox
                  style="width: 2.5rem; height: 2.5rem"
                  :is-checked="payingFor.includes(i)"
                  @true="payingFor.unshift(i)"
                  @false="removeFromIngredients(i)"
                ></CustomCheckbox>
                <div style="padding: 0.5rem; text-align: l; width: 5rem">
                  {{
                    alchemicalIngredients.mutagens[i]?.cost ||
                    alchemicalIngredients.reagents[i]?.cost ||
                    alchemicalIngredients.bases[i]?.cost
                  }}
                </div>
                <div style="padding: 0.5rem; text-align: center">{{ i }}</div>
              </div>
              <hr style="margin-bottom: -0.75rem" :style="{ color: designStore.secondaryTheme }" />
            </div>
          </div>
          <div style="display: flex; padding-top: 0.5rem; margin-top: 0.5rem">
            <BButton
              style="border: 1px solid; margin-right: 0.5rem; margin-bottom: 0.5rem"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              @click="makeAlchemyRoll()"
              >Roll {{ rollDescription }}</BButton
            >
            <div
              v-if="rollobj.total > 0"
              style="display: flex; flex-direction: column; padding-right: 0.5rem; flex-grow: 1"
            >
              <div style="display: flex">
                <div style="align-self: center">Result:</div>
                <div
                  style="font-size: x-large; padding: 0.25rem"
                  :style="{ color: designStore.alertTheme }"
                >
                  {{ rollobj.total }}
                </div>

                <div style="align-self: center">
                  {{ '([' + rollobj.roll1 + ', ' + rollobj.roll2 + '])' }} you brew
                </div>
                <div
                  style="font-size: x-large; padding: 0.25rem"
                  :style="{ color: designStore.alertTheme }"
                >
                  {{ ' ' + amount }}
                </div>
              </div>
              <div
                style="font-size: small; align-self: end"
                v-if="rollobj.discardedRolls.length >= 1"
              >
                Discarded Rolls: {{ rollobj.discardedRolls }}
              </div>
            </div>

            <BButton
              v-if="rollobj.total > 0"
              style="border: 1px solid; margin-right: 0.5rem; margin-bottom: 0.5rem"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              @click="dispatchMakePotion()"
            >
              Confirm Result and Spend</BButton
            >
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <BButton
          style="border: 1px solid; margin-left: 0.5rem; margin-bottom: 0.5rem"
          :style="{
            background: designStore.primaryTheme,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
          @click="context.emit('closeModal')"
          >Go Back</BButton
        >
      </template>
    </CustomModal>
  </div>
</template>

<style></style>
