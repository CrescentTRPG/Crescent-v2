<script lang="ts">
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'
import { BButton, BTh, BTableSimple, BThead, BTr, BTd } from 'bootstrap-vue-next'
import CustomModal from '@/components/CustomModal.vue'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import AbilityDisplay from '@/components/AbilityDisplay.vue'
import { useTraitsStore } from '@/stores/traitsStore'

export default {
  props: ['traits'],
  setup(props, context) {
    const userStore = useUserStore()
    const characterStore = useCharacterStore()
    const designStore = useDesignStore()
    const traitsStore = useTraitsStore()
    const modal = ref(false)
    const currentModal = ref(0)
    const abilityModal = ref(false)
    return {
      designStore,
      characterStore,
      userStore,
      modal,
      props,
      currentModal,
      abilityModal,
      traitsStore
    }
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
    tableBg(num: number) {
      console.log(parseInt(this.designStore.inputBacking.substring(1), 16))

      if (num % 2 === 0) {
        if (parseInt(this.designStore.inputBacking.substring(1), 16) >= 3000000) {
          return this.LightenDarkenColor(this.designStore.inputBacking, 10)
        }
        return this.LightenDarkenColor(this.designStore.inputBacking, -10)
      }
      return this.designStore.inputBacking
    },
    tableTxt(num: number) {
      return this.designStore.inputText
    },
    showModal(id: number) {
      this.currentModal = id
      this.modal = !this.modal
    },
    showAbilityModal(id: number) {
      this.currentModal = id
      this.abilityModal = !this.abilityModal
    }
  },
  components: {
    BButton,
    BTh,
    BTableSimple,
    BTr,
    BTd,
    BThead,
    CustomModal,
    AbilityDisplay
  }
}
</script>

<template>
  <div
    id="BuildTab"
    style="display: flex; justify-content: flex-start; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <BTableSimple
      style="border-top: 2px solid"
      :style="{
        bsEmphasisColor: designStore.sidebarBacking,
        bsTableStripedColor: designStore.sidebarText,
        fontFamily: designStore.font,
        borderColor: designStore.secondaryTheme,
        color: designStore.inputText,
        backgroundColor: designStore.inputBacking
      }"
      class="tableClass"
    >
      <col />
      <col />
      <col />
      <BThead>
        <BTr
          style="border-bottom: 1px solid"
          :style="{
            fontFamily: designStore.font,
            borderColor: designStore.secondaryTheme,
            color: designStore.inputText,
            backgroundColor: designStore.inputBacking
          }"
        >
          <BTh style="padding-left: 1rem">Icon</BTh>
          <BTh>Trait</BTh>
          <BTh>Trait Ability</BTh>
          <BTh></BTh>
        </BTr>
        <BTr
          v-for="(trait, index) in props.traits"
          :key="trait.name"
          :style="{ background: tableBg(index), color: tableTxt(index) }"
        >
          <BTd class="w-10" style="padding-left: 1rem"
            ><v-icon :name="trait.icon" scale="2"></v-icon
          ></BTd>

          <BTd
            ><BButton
              style="width: 100%; border: 2px solid; text-align: left"
              @click="showModal(index)"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              >{{ trait.name }}</BButton
            >
            <CustomModal
              :showModal="modal && currentModal == index"
              :title="trait.name"
              @close="showModal(index)"
            >
              <template v-slot:body>
                <div>{{ trait.description }}</div>
              </template>
            </CustomModal>
          </BTd>
          <BTd>
            <div v-if="!trait.ability" style="margin-bottom: 0.5rem">N/A</div>
            <BButton
              v-if="trait.ability"
              style="width: 100%; border: 2px solid; text-align: left"
              @click="showAbilityModal(index)"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
              >Trait Ability</BButton
            >
            <CustomModal
              :showModal="abilityModal && currentModal == index"
              :title="trait.name"
              @close="showAbilityModal(index)"
            >
              <template v-slot:body>
                <AbilityDisplay
                  :title="trait.ability.name"
                  :description="trait.ability.description"
                  :actionCost="trait.ability.actionCost"
                  :rank="trait.ability.rank"
                  :target="trait.ability.target"
                  :medallion="trait.icon"
                  :duration="trait.ability.duration"
                  :type="trait.ability.type"
                  :resistance="trait.ability.resistance"
                  :area="trait.ability.area"
                ></AbilityDisplay>
              </template>
            </CustomModal>
          </BTd>
          <BTd
            ><i
              class="bi bi-x-lg"
              :style="{ color: designStore.inputText }"
              style="font-size: large; margin-bottom: 0.5rem"
              @click="traitsStore.removeTrait(trait.name)"
            ></i
          ></BTd>
        </BTr>
      </BThead>
    </BTableSimple>
  </div>
</template>

<style>
.tableClass {
  --bs-table-bg: background-color !important;
  --bs-table-color-type: color !important;
}
</style>
