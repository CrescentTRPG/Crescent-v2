<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BNavbarNav } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../stores/designStore'
import AbilityDisplayMedallion from './AbilityDisplayMedallion.vue'

export default {
  props: [
    'title',
    'description',
    'rank',
    'actionCost',
    'resistance',
    'target',
    'area',
    'type',
    'duration',
    'medallion'
  ],
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const tab = ref('corestats')
    return { designStore, tab, props }
  },

  methods: {
    formatHTML(description: string) {
      let sections = description.split('\\n')
      let ret
      if (sections.length === 1) {
        return '<div>' + description + '</div>'
      } else {
        ret = '<div style="margin-bottom: .25rem">' + sections[0] + '</div>'
        sections.shift()
        sections.forEach((s) => {
          ret +=
            '<li style="padding-left: 1rem; margin-bottom: .25rem;list-style-type:none;text-indent: -1rem ;">' +
            '❖ ' +
            s +
            '</li>'
        })
      }
      return ret
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    AbilityDisplayMedallion
  }
}
</script>

<template>
  <div
    style="display: flex; flex-direction: column; width: 100%"
    :style="{ fontFamily: designStore.font }"
  >
    <div
      class="abilityGrid"
      :style="{
        background: designStore.secondaryTheme,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div
          style="
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: fit-content;
          "
        >
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; text-wrap: nowrap; padding-right: 0.5rem">
              Action Cost:
            </div>
            <div style="align-self: flex-end">{{ props.actionCost }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Target:</div>
            <div style="align-self: center">{{ props.target }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Area:</div>
            <div style="align-self: center">{{ props.area }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Type:</div>
            <div style="align-self: center">{{ props.type }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Duration:</div>
            <div style="align-self: center">{{ props.duration }}</div>
          </div>
        </div>
      </div>
      <div
        class="grid__item"
        :style="{ background: designStore.sidebarBacking, borderColor: designStore.secondaryTheme }"
      >
        <div style="display: flex; flex-direction: column; justify-content: center; height: 100%">
          <div
            style="
              display: flex;
              justify-content: flex-start;
              height: 100%;
              padding-right: 0.5rem;
              flex-wrap: wrap;
            "
          >
            <div style="align-self: center; padding-right: 0.5rem">Resistance:</div>
            <div style="align-self: center">{{ props.resistance }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      style="
        border-left: 2px solid;
        border-right: 2px solid;
        border-bottom: 4px solid;
        border-bottom-left-radius: 1rem;
        border-bottom-right-radius: 1rem;
        padding: 0.5rem;
        text-align: left;
      "
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div
        v-html="formatHTML(props.description)"
        style="z-index: 5; margin-left: 0.75rem; margin-right: 0.75rem; text-align: left"
        :style="{ borderColor: designStore.secondaryTheme }"
      ></div>
      <AbilityDisplayMedallion :medallion="props.medallion"></AbilityDisplayMedallion>
    </div>
    <div
      style="display: flex; justify-content: center; z-index: 1; width: 100%"
      :style="{
        color: designStore.secondaryTheme,
        borderColor: designStore.secondaryTheme
      }"
    >
      <v-icon
        name="gi-door-ring-handle"
        scale="2"
        style="
          margin-bottom: -1rem;
          position: relative;
          text-align: right;
          bottom: 0.25rem;
          transform: scale(1.25, 1);
          rotate: 180deg;
        "
      ></v-icon>
    </div>
  </div>
</template>

<style>
.abilityGrid {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  z-index: 4;
  border: 2px solid;
  border-bottom: 2px solid;
  margin-top: -1.5rem;
  grid-gap: 0.05rem;
  justify-content: space-around;
}
.grid__item {
  padding: 0.25rem;
  position: relative;
  padding-left: 0.5rem;
  padding-bottom: 0.5rem;
  padding-top: 0.25rem;
  text-wrap: wrap;
}
@media (max-width: 1000px) {
  .abilityGrid {
    grid-template-rows: auto auto auto;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
