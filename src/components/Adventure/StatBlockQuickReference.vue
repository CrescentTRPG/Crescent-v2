<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../stores/designStore'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import StatusEffectItem from '../Character/Overview/StatusEffectItem.vue'
import StatusEffectIcon from '@/StatusEffectIcon.vue'
import AddStatusButton from './AddStatusButton.vue'
import ArmorWidget from '../Character/Overview/ArmorWidget.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'

export default {
  props: [
    'id',
    'totalHp',
    'currentHp',
    'totalMana',
    'currentMana',
    'totalDvs',
    'statusEffects',
    'customStatusEffects',
    'name',
    'image',
    'archetype',
    'traits',
    'level',
    'secondaryHandheldPassives',
    'primaryHandheldPassives',
    'wornArmorPassives',
    'wornArmor',
    'wornShield',
    'editable',
    'edit',
    'removeStatus',
    'addStatus',
    'removeCustomStatus',
    'addCustomStatus'
  ],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()

    return {
      designStore,
      modal,
      props
    }
  },
  components: { BImg, StatusEffectIcon, AddStatusButton, BButton }
}
</script>

<template>
  <div
    style="border: 2px solid"
    :style="{ background: designStore.inputBacking, borderColor: designStore.secondaryTheme }"
  >
    <div
      style="display: flex; justify-content: space-between"
      :style="{ background: designStore.primaryTheme }"
    >
      <!-- <ArmorWidget
        style="
          position: absolute;
          transform: scale(0.5, 0.5);
          z-index: 5;
          margin-top: 0.45rem;
          margin-left: 0.5rem;
        "
        :totalDvs="14"
        :armorDvs="4"
        :shieldDvs="0"
        :moveDvs="10"
        :bonusDvs="0"
        :secondaryHandheldPassives="props.secondaryHandheldPassives"
        :primaryHandheldPassives="props.primaryHandheldPassives"
        :wornArmorPassives="props.wornArmorPassives"
        :statusEffects="props.statusEffects"
        :wornArmor="props.wornArmor"
        :wornShield="props.wornShield"
        :armorStatusModifiers="{}"
        :addNewArmorStatusModifier="() => {}"
        :removeArmorStatusModifier="() => {}"
        :traits="props.traits"
      ></ArmorWidget> -->

      <div
        style="
          display: flex;
          height: 3rem;
          text-align: right;
          border-bottom: 2px solid;
          padding-right: 0.5rem;
          flex-grow: 1;
        "
        :style="{
          fontFamily: designStore.titleFont,
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <div
          style="
            height: 8rem;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: center;
            clip-path: polygon(0 0, 7rem 0%, 50% 8rem, 0% 100%);
          "
          :style="{ background: designStore.inputBacking }"
        >
          <BImg
            :src="props.image"
            style="
              clip-path: polygon(0 0, 7rem 0%, 708rem 8rem, 0% 100%);
              width: 7rem;
              height: fit-content;
            "
            :style="{ background: designStore.inputBacking }"
          ></BImg>
        </div>
        <div class="diagonalBorder" :style="{ background: designStore.secondaryTheme }"></div>

        <div
          style="
            position: absolute;
            font-size: 10rem;
            z-index: 5;
            margin-left: 1.5rem;
            margin-top: -1.6rem;
            transform: scale(0.5, 0.45);
          "
          :style="{ color: designStore.primaryTheme }"
        >
          <div
            style="
              position: absolute;
              font-size: 3.5rem;
              width: 10rem;
              text-align: center;
              margin-top: 3rem;
            "
            :style="{ color: designStore.primaryText }"
          >
            {{ props.totalDvs }}
          </div>
          <i class="bi bi-shield-fill"></i>
        </div>
        <div
          style="
            position: absolute;
            font-size: 11rem;
            z-index: 4;
            margin-left: 1rem;
            margin-top: -2.4rem;
            transform: scale(0.48, 0.45);
          "
          :style="{ color: designStore.secondaryTheme }"
        >
          <i class="bi bi-shield-fill"></i>
        </div>

        <div
          style="
            font-size: x-large;
            height: 3rem;
            text-align: left;
            padding: 0.25rem;
            padding-left: 0.5rem;
            padding-right: 0.5rem;
            flex-grow: 1;
          "
          :style="{
            fontFamily: designStore.titleFont,
            color: designStore.primaryText,
            borderColor: designStore.secondaryTheme
          }"
        >
          {{ props.name }}
        </div>
        <BButton
          v-if="editable"
          style="padding: 0.25rem; align-self: center; border: 1px solid; height: fit-content"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
          @click="props.edit()"
          >Edit <i class="bi bi-pen" style="margin: 0rem"></i
        ></BButton>
      </div>
    </div>
    <div
      style="display: flex; justify-content: flex-end; height: 5rem; font-size: large; width: 100%"
      :style="{ color: designStore.inputText }"
    >
      <div style="display: flex; flex-direction: column; width: 100%">
        <div style="display: flex; justify-content: space-between">
          <div style="display: flex; margin-left: 9.5rem; overflow-x: auto">
            <div v-for="trait in props.traits" :key="trait">
              <StatusEffectIcon
                style="margin-top: -0.5rem"
                :icon="trait.icon"
                :isCustom="false"
                :statusObj="trait"
                :notRemoveable="true"
                :color="designStore.inputText"
              ></StatusEffectIcon>
            </div>
          </div>
          <div style="text-align: end; min-width: 4.5rem; padding-right: 1rem">
            Level {{ props.level }}
          </div>
        </div>
        <div style="display: flex; width: 100%">
          <div style="display: flex; width: 100%; justify-content: flex-end">
            <div v-for="status in props.statusEffects" :key="status">
              <StatusEffectIcon
                :icon="status.icon"
                :isCustom="false"
                :statusObj="status"
                :removeStatus="props.removeStatus"
                :removeCustomStatus="props.removeCustomStatus"
              ></StatusEffectIcon>
            </div>
            <div v-for="status in props.customStatusEffects" :key="status">
              <StatusEffectIcon
                :icon="status.icon"
                :isCustom="false"
                :statusObj="status"
                :removeStatus="props.removeCustomStatus"
              ></StatusEffectIcon>
            </div>
            <AddStatusButton
              :removeStatus="props.removeStatus"
              :removeCustomStatus="props.removeCustomStatus"
              :addStatus="props.addStatus"
              :addCustomStatus="props.addCustomStatus"
              :id="props.id"
            ></AddStatusButton>
          </div>
        </div>
      </div>
    </div>
    <div
      style="width: 100%; border-top: 2px solid"
      :style="{ borderColor: designStore.secondaryTheme }"
    >
      <div
        style="display: flex; border-bottom: 2px solid"
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.inputBacking,
          color: designStore.inputText
        }"
      >
        <div
          style="padding: 0.25rem; width: 5rem"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          HP
        </div>
        <div style="width: calc(100% - 10rem)">
          <div
            style="height: 2rem"
            :style="{
              background: designStore.sidebarBacking,
              width: (props.currentHp * 100) / props.totalHp + '%',
              boxShadow: 'inset 0px 0px 4px 1px ' + designStore.alertTheme
            }"
          ></div>
        </div>
        <div
          style="padding: 0.25rem; width: 5rem; text-align: center"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          {{ currentHp }} / {{ totalHp }}
        </div>
      </div>
      <div
        style="display: flex; border-bottom: 2px solid"
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.inputBacking,
          color: designStore.inputText
        }"
      >
        <div
          style="padding: 0.25rem; width: 5rem"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          Mana
        </div>
        <div style="width: calc(100% - 10rem)">
          <div
            style="height: 2rem"
            :style="{
              background: designStore.sidebarBacking,
              width:
                props.totalMana === 0 ? '0%' : (props.currentMana * 100) / props.totalMana + '%',
              boxShadow: 'inset 0px 0px 4px 1px ' + designStore.alertTheme
            }"
          ></div>
        </div>
        <div
          style="padding: 0.25rem; width: 5rem; text-align: center"
          :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
        >
          {{ currentMana }} / {{ totalMana }}
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.diagonalBorder {
  width: 0.75rem;
  height: 8rem;
  transform: skew(-22deg);
  background: #c2b172;
  position: relative;
  right: 2rem;
}
</style>
