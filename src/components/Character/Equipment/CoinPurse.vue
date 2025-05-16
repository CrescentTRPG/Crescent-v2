<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { useEquipmentStore } from '@/stores/equipmentStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const equipmentStore = useEquipmentStore()
    const { equipment } = storeToRefs(equipmentStore)
    const currency = computed(() => {
      return Object.values(equipment.value.coins).sort((a, b) => a.num - b.num)
    })
    const localCurrencyObj = ref(equipment.value.coins)
    function updateStore() {
      equipmentStore.setCoins(localCurrencyObj.value)
    }
    function organizeIntoStacks() {
      let coins = localCurrencyObj.value
      let overflow = 0
      currency.value.forEach((coin, index) => {
        let amount = parseInt(coin.amount + '') + overflow
        coins[coin.num + ''] = {
          num: coin.num,
          name: coin.name,
          exchangeRate: coin.exchangeRate,
          amount:
            index < currency.value.length - 1 ? amount % parseInt(coin.exchangeRate + '') : amount
        }
        overflow = Math.floor(amount / parseInt(coin.exchangeRate + ''))
      })
      localCurrencyObj.value = coins
      updateStore()
    }
    return { designStore, currency, localCurrencyObj, updateStore, organizeIntoStacks }
  },
  components: { BFormInput, BInputGroupText, BButton },
  watch: {
    equipment() {
      this.localCurrencyObj = useEquipmentStore().equipment.coins
    }
  }
}
</script>
<template>
  <div
    style="border-bottom: 2px solid"
    :style="{
      borderColor: designStore.secondaryTheme
    }"
  >
    <div
      :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
      style="
        width: 7rem;
        margin-top: 0.5rem;
        font-size: large;
        border-top-right-radius: 0.375rem;
        padding: 0.15rem;
      "
    >
      <v-icon name="gi-cash" scale="1.5"></v-icon>
      Wallet
    </div>
    <div
      style="display: flex"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div class="mobileCoin">
        <div v-for="c in currency" :key="c.name" style="display: flex; width: 100%">
          <BInputGroupText
            style="border: none"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >{{ c.name }} :</BInputGroupText
          >
          <BFormInput
            style="
              border: none;
              border-right: 1px solid;
              border-radius: 0;
              text-align: end;
              flex-grow: 1;
            "
            :style="{
              background: designStore.inputBacking,
              color: designStore.inputText,
              borderColor: designStore.secondaryTheme
            }"
            type="number"
            @change="updateStore()"
            v-model="localCurrencyObj[c.num + ''].amount"
          ></BFormInput>
        </div>
      </div>

      <BButton
        @click="organizeIntoStacks()"
        style="margin: 0.25rem; border: 1px solid"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        ><v-icon name="gi-stack"></v-icon
      ></BButton>
    </div>
  </div>
</template>
<style>
.mobileCoin {
  width: 100%;
  display: flex;
}
@media (max-width: 900px) {
  .mobileCoin {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 800px) {
    .mobileCoin {
      width: 100%;
      display: flex;
    }
    @media (max-width: 600px) {
      .mobileCoin {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style>
