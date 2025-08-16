<template>
  <div
    style="font-size: xx-large; display: flex; justify-content: center; padding-top: 10rem"
    :style="{ fontFamily: design.font + ', sans-serif' }"
  >
    <v-icon scale="4" :name="leftmoon" animation="float"></v-icon>
    <div>{{ message }}</div>
    <v-icon scale="4" :name="rightmoon" animation="float"></v-icon>
  </div>
</template>

<script lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

import { useDesignStore } from '@/stores/designStore'

export default {
  setup(props, context) {
    const navPos = ref('build')
    let design = useDesignStore()
    const leftmoon = ref('wi-moon-alt-full')
    const rightmoon = ref('wi-moon-alt-new')
    const loadMessage = function () {
      let val = Math.floor(Math.random() * 15)
      switch (val) {
        case 0:
          return 'Calibrating Crossbows'
        case 1:
          return 'Scouting the Dungeon'
        case 2:
          return 'Stealthily Casting Fireball'
        case 3:
          return 'Applying Ambiance'
        case 4:
          return 'Fetching Quests'
        case 5:
          return 'Slaying the Dragon'
        case 6:
          return 'Leveling Up'
        case 7:
          return 'Gearing Up'
        case 8:
          return 'Building a Worthy Rival'
        case 9:
          return 'Brewing Potions'
        case 10:
          return 'Stressing my Exceptional Intelligence'
        case 11:
          return 'Rolling the Dice'
        case 12:
          return 'Running on Water'
        case 13:
          return 'Testing out a new Spell'
        case 14:
          return 'Sharpening Blades'
        default:
          return 'Counting Coins'
      }
    }
    const message = ref(loadMessage())
    const delay = (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
    const animate = async function (time) {
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-5'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-2'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-4'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-3'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-3'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-4'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-2'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-5'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-waxing-gibbous-1'
      rightmoon.value = 'wi-moon-alt-waxing-crescent-6'
      await delay(time)
      leftmoon.value = 'wi-moon-alt-first-quarter'
      rightmoon.value = 'wi-moon-alt-first-quarter'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-1'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-6'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-2'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-5'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-3'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-4'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-4'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-3'
      await delay(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-5'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-2'
      await delay(time)
      //animate(time)
      rightmoon.value = 'wi-moon-alt-waxing-gibbous-6'
      leftmoon.value = 'wi-moon-alt-waxing-crescent-1'
      animate(time)
    }

    onMounted(() => {
      animate(300)
    })

    return {
      props,
      design,
      navPos,
      leftmoon,
      rightmoon,
      message
    }
  },

  methods: {
    delay: function (time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    }
  }
}
</script>

<style></style>
