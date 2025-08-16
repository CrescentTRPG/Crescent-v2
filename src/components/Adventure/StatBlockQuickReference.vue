<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useDesignStore } from '../../stores/designStore'
import BImg from 'bootstrap-vue-next/src/components/BImg.vue'
import StatusEffectItem from '../Character/Overview/StatusEffectItem.vue'
import StatusEffectIcon from '@/StatusEffectIcon.vue'
import AddStatusButton from './AddStatusButton.vue'
import ArmorWidget from '../Character/Overview/ArmorWidget.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import IconDisplay from '../IconDisplay.vue'
import InitiativeDisplay from './Stat Blocks/initiativeDisplay.vue'
import { useInitiativeStore } from '@/stores/initiativeStore'
import { storeToRefs } from 'pinia'
import { useAdventureStore } from '@/stores/adventureStore'

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
    'addCustomStatus',
    'initiative',
    'collapseable',
    'changeInitiative',
    'agi',
    'keyVal'
  ],
  setup(props, context) {
    const modal = ref(false)
    const designStore = useDesignStore()
    const initiativeStore = useInitiativeStore()
    const adventureStore = useAdventureStore()
    const { initiativeOpened } = storeToRefs(initiativeStore)
    const collapsed = ref(adventureStore.settings.initiativeDefaultExpanded)
    let flip = document.querySelector('collapseOnClick')
    let header = document.querySelector('headerSpacer')
    flip?.addEventListener('click', function () {
      console.log('HOW')
      header?.classList.add('collapse-spacer')
    })
    header?.addEventListener('animationend', function () {
      header?.classList.remove('collapse-spacer')
    })
    onMounted(() => {
      if (Object.keys(initiativeOpened.value).includes(props.id))
        collapsed.value = initiativeOpened.value[props.id]
    })
    function flipCollapsed() {
      collapsed.value = !collapsed.value
      initiativeStore.setInitiativeOpened(props.id, collapsed.value)
    }

    return {
      designStore,
      modal,
      props,
      collapsed,
      initiativeOpened,
      flipCollapsed
    }
  },
  components: { BImg, StatusEffectIcon, AddStatusButton, BButton, IconDisplay, InitiativeDisplay }
}
</script>

<template>
  <div>
    <div
      v-if="collapsed === true"
      style="
        display: flex;
        align-self: center;
        border: 2px solid;
        height: fit-content;
        margin-bottom: 0.25rem;
        margin-top: 0.25rem;
        padding-left: 0.5rem;
      "
      class="collapsedHeader"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.primaryTheme
      }"
    >
      <InitiativeDisplay :initiative="props.initiative" v-if="props.initiative"></InitiativeDisplay>
      <div id="headerSpacer" :style="{ '--sidebar-backdrop': designStore.sidebarBacking }"></div>
      <div
        style="
          font-size: x-large;
          height: 3rem;
          text-align: left;
          padding: 0.25rem;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          flex-grow: 1;
          display: flex;
          justify-content: space-between;
          overflow: hidden;
        "
        :style="{
          fontFamily: designStore.titleFont,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
      >
        <div>{{ props.name }}</div>
        <IconDisplay
          id="collapseOnClick"
          class="collapseIcon"
          @click="flipCollapsed()"
          :color="designStore.primaryText"
          :icon="collapsed ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill'"
        ></IconDisplay>
      </div>

      <BButton
        v-if="editable"
        style="
          padding: 0.25rem;
          align-self: center;
          border: 1px solid;
          height: fit-content;
          margin-right: 0.25rem;
        "
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
        @click="props.edit()"
        >View <i class="bi bi-binoculars" style="margin: 0rem"></i
      ></BButton>
    </div>
    <div
      v-else
      style="border: 2px solid"
      :style="{ background: designStore.inputBacking, borderColor: designStore.secondaryTheme }"
    >
      <!-- <InitiativeDisplay
        :initiative="props.initiative"
        style="position: absolute; z-index: 5; translate: 0.25rem -0.15rem"
      ></InitiativeDisplay> -->

      <div style="display: flex; justify-content: flex-end">
        <div
          style="display: flex; justify-content: space-between; width: 100%"
          :style="{ background: designStore.primaryTheme }"
        >
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
                animation-name: grow;
                animation-duration: 0.25s;
                z-index: 4;
              "
              :style="{ background: designStore.inputBacking }"
            >
              <BImg
                :src="props.image"
                style="
                  z-index: 4;
                  clip-path: polygon(0 0, 7rem 0%, 708rem 8rem, 0% 100%);
                  width: 7rem;
                  height: fit-content;
                "
                :style="{ background: designStore.inputBacking }"
              ></BImg>
            </div>
            <div style="position: absolute; display: flex">
              <div
                style="width: 5rem; height: 3rem; z-index: 3"
                :style="{ background: designStore.inputBacking, color: designStore.inputBacking }"
              ></div>
              <div
                style="position: relative; right: 3rem; width: 3rem; z-index: 3"
                class="diagonalBorder"
                :style="{ background: designStore.inputBacking, color: designStore.inputBacking }"
              ></div>
            </div>
            <div
              class="diagonalBorder"
              style="z-index: 5"
              :style="{ background: designStore.secondaryTheme }"
            ></div>

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
                padding-right: 0.5rem;
                z-index: 3;
                display: flex;
                flex-grow: 1;
              "
              :style="{
                fontFamily: designStore.titleFont,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
            >
              <InitiativeDisplay
                v-if="props.initiative"
                :changeInitiative="props.changeInitiative"
                :keyVal="props.keyVal"
                :agi="props.agi"
                :initiative="props.initiative"
                style="position: relative; right: 0.5rem; bottom: 0.15rem"
              ></InitiativeDisplay>
              <div style="display: flex; justify-content: space-between; flex-grow: 2">
                <div style="overflow: hidden">
                  {{ props.name }}
                </div>
                <IconDisplay
                  class="collapseIcon"
                  @click="flipCollapsed()"
                  :color="designStore.primaryText"
                  :icon="collapsed ? 'bi bi-caret-down-fill' : 'bi bi-caret-up-fill'"
                ></IconDisplay>
              </div>
            </div>
            <BButton
              v-if="editable"
              style="
                padding: 0.25rem;
                min-width: 4.25rem;
                align-self: center;
                border: 1px solid;
                height: fit-content;
              "
              :style="{
                borderColor: designStore.secondaryTheme,
                background: designStore.primaryTheme
              }"
              @click="props.edit()"
              >View <i class="bi bi-binoculars" style="margin: 0rem"></i
            ></BButton>
          </div>
        </div>
      </div>
      <div
        style="
          display: flex;
          justify-content: flex-end;
          height: 5rem;
          font-size: large;
          width: 100%;
        "
        :style="{ color: designStore.inputText }"
      >
        <div style="display: flex; flex-direction: column; width: 100%">
          <div style="display: flex; justify-content: space-between">
            <div
              style="display: flex; margin-left: 9.5rem; overflow-x: auto"
              class="restrictTraits"
            >
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
            <div
              style="text-align: end; padding-left: 1rem; text-wrap: nowrap; padding-right: 1rem"
            >
              Level {{ props.level }}
            </div>
          </div>
          <div style="display: flex; width: 100%">
            <div style="display: flex; width: 100%; justify-content: flex-end">
              <div v-for="status in props.statusEffects" :key="status">
                <StatusEffectIcon
                  :icon="status.icon || status.groupIcon || 'nothing'"
                  :isCustom="false"
                  :statusObj="status"
                  :removeStatus="props.removeStatus"
                  :removeCustomStatus="props.removeCustomStatus"
                ></StatusEffectIcon>
              </div>
              <div v-for="status in props.customStatusEffects" :key="status">
                <StatusEffectIcon
                  :icon="status.icon || status.groupIcon || 'nothing'"
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
        class="condition-container"
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

.collapseIcon:active {
  display: block;
  cursor: pointer;
  transform: rotate(90deg);
  -webkit-transition-duration: 1s;
  -moz-transition-duration: 1s;
  -ms-transition-duration: 1s;
  -o-transition-duration: 1s;
  transition-duration: 1s;
}

.collapse-spacer {
  animation-name: squish;
  animation-duration: 0.25s;
  background: var(--sidebar-backdrop);
}

@keyframes squish {
  0% {
    width: 30%;
  }
  100% {
    width: 0%;
  }
}
@keyframes regrow {
  0% {
    width: 50%;
  }
  100% {
    width: 100%;
  }
}
@keyframes stretch {
  0% {
    width: 0%;
  }
  100% {
    flex-grow: 1;
  }
}
@keyframes grow {
  0% {
    transform: scaleX(0.25);
    transform: scaley(0.5);

    height: 2rem;
  }
  100% {
    transform: scaleX(1);
    transform: scaley(1);

    height: 8rem;
  }
}
@keyframes growy {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

.condition-container {
  z-index: 1;
  animation-name: growy;
  animation-duration: 0.25s;
}

.restrictTraits {
  max-width: 20rem;
}
@media (max-width: 600px) {
  .restrictTraits {
    max-width: 15rem;
  }
}
@media (max-width: 500px) {
  .restrictTraits {
    max-width: 13.5rem;
  }
}
@media (max-width: 450px) {
  .restrictTraits {
    max-width: 8.5rem;
  }
}
</style>
