<script lang="ts">
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { useDesignStore } from '@/stores/designStore.ts'
import { BTableSimple, BTbody, BTd, BTh, BThead, BTr } from 'bootstrap-vue-next'

export default {
  props: ['title'],
  setup(props, context) {
    const modal = ref(false)

    const designStore = useDesignStore()
    function lightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
    return {
      designStore,
      props,
      lightenDarkenColor
    }
  },
  components: {
    BTableSimple,
    BThead,
    BTr,
    BTh,
    BTbody,
    BTd
  }
}
</script>

<template>
  <div
    :style="{
      '--bs-table-bg': designStore.inputBacking,
      '--bs-table-color': designStore.inputText,
      '--bs-table-border-color': designStore.secondaryTheme,
      '--bs-table-hover-bg': lightenDarkenColor(designStore.inputBacking, 10),
      '--bs-table-hover-color': lightenDarkenColor(designStore.inputBacking, 10),
      '--hover-table': lightenDarkenColor(designStore.inputBacking, -20),
      '--table-bg': designStore.inputBacking,
      background: designStore.inputBacking
    }"
    style="padding: 1rem"
  >
    &#9;Alchemical Ingredients can be found whilst adventuring or available for purchase in town at
    GM's discretion. In general, it will be hard to find the more rare and difficult ingredients and
    wehen they are available, they will be in more limited quantities. If not found while questing,
    rare ingredients are most likely to be found in large cities. Availability is up to GM's
    discretion.

    <BTableSimple hover small caption-top responsive style="margin-top: 1rem">
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Bases
      </caption>
      <BThead
        :style="{
          background: designStore.sidebarBacking,
          color: designStore.sidebarText,
          '--bs-table-bg': designStore.sidebarBacking,
          '--bs-table-color': designStore.sidebarText,
          '--table-bg': designStore.sidebarBacking
        }"
      >
        <BTr>
          <BTh>Name</BTh>
          <BTh>Difficulty Value</BTh>
          <BTh>Effects</BTh>
          <BTh>Ingredient Cost</BTh>
          <BTh>Added Market Value</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Water</BTd>
          <BTd class="smol">1</BTd>
          <BTd>Imbibed potion</BTd>
          <BTd class="smol">1 cp</BTd>
          <BTd class="smol">1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Strong Spirits</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Single target thrown potion</BTd>
          <BTd class="smol">2 sp</BTd>
          <BTd class="smol">4 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Magical Blood</BTd>
          <BTd class="smol">3</BTd>
          <BTd
            >Lathered onto a weapon as a swift action lasting 1 minute. Consumed upon the next
            successful strike.</BTd
          >
          <BTd class="smol">5 sp</BTd>
          <BTd class="smol">8 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Pure Alcohol</BTd>
          <BTd class="smol">4</BTd>
          <BTd>Thrown potion that explodes in a 10’ radius</BTd>
          <BTd class="smol">1 gp</BTd>
          <BTd class="smol">1 gp 1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Hydrablood</BTd>
          <BTd class="smol">5</BTd>
          <BTd>Thrown potion that explodes in a 20’ radius</BTd>
          <BTd class="smol">2 gp</BTd>
          <BTd class="smol">2 sp 6 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Ichor</BTd>
          <BTd class="smol">6</BTd>
          <BTd
            >Lathered onto a weapon as a swift action lasting indefinitely. Consumed after the next
            5 successful strikes.</BTd
          >
          <BTd class="smol">3 gp</BTd>
          <BTd class="smol">3 gp 9 sp</BTd>
        </BTr>
      </BTbody>
    </BTableSimple>
    <BTableSimple hover small caption-top responsive>
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Reagents
      </caption>
      <BThead
        :style="{
          background: designStore.sidebarBacking,
          color: designStore.sidebarText,
          '--bs-table-bg': designStore.sidebarBacking,
          '--bs-table-color': designStore.sidebarText,
          '--table-bg': designStore.sidebarBacking
        }"
      >
        <BTr>
          <BTh>Name</BTh>
          <BTh>Difficulty Value</BTh>
          <BTh>Effects</BTh>
          <BTh>Ingredient Cost</BTh>
          <BTh>Added Market Value</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Sunflower Seed</BTd>
          <BTd class="smol">1</BTd>
          <BTd>Heals for 1d6</BTd>
          <BTd class="smol">2 cp</BTd>
          <BTd class="smol">1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Pasrasol Mushroom</BTd>
          <BTd class="smol">1</BTd>
          <BTd>Damages for 1d6 toxic damage</BTd>
          <BTd class="smol">2cp</BTd>
          <BTd class="smol">1sp</BTd>
        </BTr>
        <BTr>
          <BTd>Saffron Seeds</BTd>
          <BTd class="smol">3</BTd>
          <BTd>Heals for 5d6</BTd>
          <BTd class="smol">5sp</BTd>
          <BTd class="smol">8sp</BTd>
        </BTr>
        <BTr>
          <BTd>Hairy Panus Mushroom</BTd>
          <BTd class="smol">3</BTd>
          <BTd>Damages for 5d6 toxic damage</BTd>
          <BTd class="smol">5sp</BTd>
          <BTd class="smol">8sp</BTd>
        </BTr>
        <BTr>
          <BTd>Mandrake Seed</BTd>
          <BTd class="smol">5</BTd>
          <BTd>Heals for 10d6</BTd>
          <BTd class="smol">1gp 2sp</BTd>
          <BTd class="smol">1gp 8sp</BTd>
        </BTr>
        <BTr>
          <BTd>Nightcap Mushroom</BTd>
          <BTd class="smol">5</BTd>
          <BTd>Damages for 10d6 toxic damage</BTd>
          <BTd class="smol">1gp 2sp</BTd>
          <BTd class="smol">1gp 8sp</BTd>
        </BTr>
        <BTr>
          <BTd>Dragon Scales</BTd>
          <BTd class="smol">7</BTd>
          <BTd>Restores 2d4 mana</BTd>
          <BTd class="smol">2gp 5sp</BTd>
          <BTd class="smol">3gp 7sp</BTd>
        </BTr>
        <BTr>
          <BTd>Moonlight Cherry Blossom</BTd>
          <BTd class="smol">7</BTd>
          <BTd>Removes 2d4 mana</BTd>
          <BTd class="smol">2gp 5sp</BTd>
          <BTd class="smol">3gp 7sp</BTd>
        </BTr>
        <BTr>
          <BTd>Unicorn Horn</BTd>
          <BTd class="smol">9</BTd>
          <BTd>Restores 4d4 mana</BTd>
          <BTd class="smol">5gp</BTd>
          <BTd class="smol">8gp 6sp</BTd>
        </BTr>
        <BTr>
          <BTd>Moonbloom Shroom</BTd>
          <BTd class="smol">9</BTd>
          <BTd>Removes 4d4 mana</BTd>
          <BTd class="smol">5gp</BTd>
          <BTd class="smol">8gp 6sp</BTd>
        </BTr>

        <BTr>
          <BTd>Ancient Willow Seed</BTd>
          <BTd class="smol">10</BTd>
          <BTd
            >Heals for 20d6 and any excess is converted to an HP shield that lasts for the next
            minute</BTd
          >
          <BTd class="smol">6gp</BTd>
          <BTd class="smol">8gp 5sp</BTd>
        </BTr>
      </BTbody>
    </BTableSimple>
    <BTableSimple hover small caption-top responsive>
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Mutagens
      </caption>
      <BThead
        :style="{
          background: designStore.sidebarBacking,
          color: designStore.sidebarText,
          '--bs-table-bg': designStore.sidebarBacking,
          '--bs-table-color': designStore.sidebarText,
          '--table-bg': designStore.sidebarBacking
        }"
      >
        <BTr>
          <BTh>Name</BTh>
          <BTh>Difficulty Value</BTh>
          <BTh>Effects</BTh>
          <BTh>Duration</BTh>
          <BTh>Ingredient Cost</BTh>
          <BTh>Added Market Value</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Soap</BTd>
          <BTd class="smol">1</BTd>
          <BTd
            >The target and their belongings are made highly presentable through cleaning, removing
            stains, drying clothes, etc.</BTd
          >
          <BTd class="smol">instantaneous</BTd>
          <BTd class="smol">2 cp</BTd>
          <BTd class="smol">1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Weeping Carnation</BTd>
          <BTd class="smol">1</BTd>
          <BTd>The target is slowed</BTd>
          <BTd class="smol">2 rounds</BTd>
          <BTd class="smol">1 sp</BTd>
          <BTd class="smol">2 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Jellyfish Stingers</BTd>
          <BTd class="smol">1</BTd>
          <BTd>The target falls prone.</BTd>
          <BTd class="smol">instantaneous</BTd>
          <BTd class="smol">1 sp</BTd>
          <BTd class="smol">2 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Lurch Reeds</BTd>
          <BTd class="smol">1</BTd>
          <BTd>The target is cured of fatigue and hangovers.</BTd>
          <BTd class="smol">instantaneous</BTd>
          <BTd class="smol">1 sp 5cp</BTd>
          <BTd class="smol">4 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Dwindleberries</BTd>
          <BTd class="smol">2</BTd>
          <BTd>The next attack roll made against the target has a placed roll to hit.</BTd>
          <BTd class="smol">2 rounds</BTd>
          <BTd class="smol">1 sp 5cp</BTd>
          <BTd class="smol">4 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Clam Shells</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Target can breathe and form verbal components of spells underwater.</BTd>
          <BTd class="smol">1 Minute</BTd>
          <BTd class="smol">3sp</BTd>
          <BTd class="smol">5sp</BTd>
        </BTr>
        <BTr>
          <BTd>Iron Shavings </BTd>
          <BTd class="smol">2</BTd>
          <BTd>The target is granted an additional strike for the round.</BTd>
          <BTd class="smol">instantaneous</BTd>
          <BTd class="smol">4sp</BTd>
          <BTd class="smol">6 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Elemental Essence</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Change the damage type to an elemental magic damage type of your choice</BTd>
          <BTd class="smol">N/A</BTd>
          <BTd class="smol">4sp</BTd>
          <BTd class="smol">7sp</BTd>
        </BTr>
        <BTr>
          <BTd>Psilocybin Mushroom</BTd>
          <BTd class="smol">2</BTd>
          <BTd>The target is frightened</BTd>
          <BTd class="smol">1 round</BTd>
          <BTd class="smol">5 sp</BTd>
          <BTd class="smol">7 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Lizard Scales</BTd>
          <BTd class="smol">3</BTd>
          <BTd>The target receives 2 Bonus DVs.</BTd>
          <BTd class="smol">2 rounds</BTd>
          <BTd class="smol">3 sp</BTd>
          <BTd class="smol">6 sp</BTd>
        </BTr>

        <BTr>
          <BTd>Stargazer Lily</BTd>
          <BTd class="smol">3</BTd>
          <BTd>The target cannot talk quietly and must yell</BTd>
          <BTd class="smol">1 Minute</BTd>
          <BTd class="smol">4 sp</BTd>
          <BTd class="smol">7 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Moondew</BTd>
          <BTd class="smol">3</BTd>
          <BTd>Target experiences vivid hallucinations.</BTd>
          <BTd class="smol">1 Minute</BTd>
          <BTd class="smol">6 sp 5 cp</BTd>
          <BTd class="smol">1 gp</BTd>
        </BTr>
        <BTr>
          <BTd>Starbloom</BTd>
          <BTd class="smol">3</BTd>
          <BTd
            >Grants the target vision through obstructions such as non-magical darkness and physical
            barriers</BTd
          >
          <BTd class="smol">4 rounds</BTd>
          <BTd class="smol">8 sp</BTd>
          <BTd class="smol">1 gp 1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Myrrh</BTd>
          <BTd class="smol">4</BTd>
          <BTd
            >The target is heavily perfumed and can be detected by means other than sight by other
            creatures.</BTd
          >
          <BTd class="smol">4 rounds</BTd>
          <BTd class="smol">6 sp</BTd>
          <BTd class="smol">1 gp 1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Raven's Eyes</BTd>
          <BTd class="smol">4</BTd>
          <BTd>All of the target's abilities have their ranges doubled</BTd>
          <BTd class="smol">1 round</BTd>
          <BTd class="smol">7 sp 5cp</BTd>
          <BTd class="smol">1 gp 2 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Burst Cherries</BTd>
          <BTd class="smol">4</BTd>
          <BTd>The target is befuddled</BTd>
          <BTd class="smol">1 round</BTd>
          <BTd class="smol">7 sp 5cp</BTd>
          <BTd class="smol">1 gp 1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Fractal Lichen</BTd>
          <BTd class="smol">4</BTd>
          <BTd
            >The target experiences vague visions of the future. Adding personal items can influence
            the direction or subject of the visions.</BTd
          >
          <BTd class="smol">Variable</BTd>
          <BTd class="smol">1 gp 4 sp</BTd>
          <BTd class="smol">1 gp 9 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Quartz Powder</BTd>
          <BTd class="smol">4</BTd>
          <BTd>The target is teleported LOS 60' to a location of their choice.</BTd>
          <BTd class="smol">instantaneous</BTd>
          <BTd class="smol">1 gp 8 sp</BTd>
          <BTd class="smol">2 gp 3 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Phosphorus</BTd>
          <BTd class="smol">5</BTd>
          <BTd
            >Any damage dealt by the potion is instead dealt as suffering in the potion's relevant
            damage type.</BTd
          >
          <BTd class="smol">N/A</BTd>
          <BTd class="smol">5sp</BTd>
          <BTd class="smol">1 gp 1 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Gnomish Mead</BTd>
          <BTd class="smol">5</BTd>
          <BTd>The target shrinks one size category smaller.</BTd>
          <BTd class="smol">2 rounds</BTd>
          <BTd class="smol">6sp</BTd>
          <BTd class="smol">1 gp 2 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Crystalline Light</BTd>
          <BTd class="smol">5</BTd>
          <BTd
            >The target glows brightly, eradicating natural darkness in the target area and
            eliminating stealth and invisibility</BTd
          >
          <BTd class="smol">4 rounds</BTd>
          <BTd class="smol">9sp</BTd>
          <BTd class="smol">1 gp 5 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Magician's Little Helper</BTd>
          <BTd class="smol">5</BTd>
          <BTd>The next spell cast by the target in this round is finessed 2 times. </BTd>
          <BTd class="smol">instantaneous</BTd>

          <BTd class="smol">1 gp 6 sp</BTd>
          <BTd class="smol">2 gp 2 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Salt</BTd>
          <BTd class="smol">6</BTd>
          <BTd>Potion's effects apply continuously for 2 rounds</BTd>
          <BTd class="smol">N/A</BTd>

          <BTd class="smol">5 sp</BTd>
          <BTd class="smol">1 gp 2 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Spring Shrooms</BTd>
          <BTd class="smol">6</BTd>
          <BTd>The target is immune to falling damage.</BTd>
          <BTd class="smol">1 round</BTd>

          <BTd class="smol">7 sp</BTd>
          <BTd class="smol">1 gp 4 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Holy Water</BTd>
          <BTd class="smol">6</BTd>
          <BTd>The damage type of the potion changes to divine.</BTd>
          <BTd class="smol">N/A</BTd>

          <BTd class="smol">9 sp</BTd>
          <BTd class="smol">1 gp 6 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Mythril Powder</BTd>
          <BTd class="smol">6</BTd>
          <BTd
            >The target becomes nearly weightless and hovers above the ground. The target receives a
            displaced roll on all STR Checks. If the target has a flight speed, it is doubled.</BTd
          >
          <BTd class="smol">4 rounds</BTd>

          <BTd class="smol">1 gp</BTd>
          <BTd class="smol">1 gp 8 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Fairy's Cap</BTd>
          <BTd class="smol">6</BTd>
          <BTd>The target is instantly teleported to their position from 3 rounds ago.</BTd>
          <BTd class="smol">instantaneous</BTd>

          <BTd class="smol">1 gp 8 sp</BTd>
          <BTd class="smol">2 gp 6 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Ectoplasm</BTd>
          <BTd class="smol">6</BTd>
          <BTd>The target is made ethereal.</BTd>
          <BTd class="smol">2 rounds</BTd>
          <BTd class="smol">2gp</BTd>
          <BTd class="smol">3gp</BTd>
        </BTr>
        <BTr>
          <BTd>Mercury</BTd>
          <BTd class="smol">7</BTd>
          <BTd>Delays potion effect by 1 hour</BTd>
          <BTd class="smol">N/A</BTd>

          <BTd class="smol">1 gp 3 sp</BTd>
          <BTd class="smol">2 gp 3 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Mandrake Root</BTd>
          <BTd class="smol">7</BTd>
          <BTd>The target can understand all languages.</BTd>
          <BTd class="smol">1 Minute</BTd>

          <BTd class="smol">1 gp 5 sp</BTd>
          <BTd class="smol">2 gp 5 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Primordial Orchid</BTd>
          <BTd class="smol">7</BTd>
          <BTd
            >The target becomes immune to an elemental damage type. (decided at the time of
            creation)</BTd
          >
          <BTd class="smol">2 rounds</BTd>

          <BTd class="smol">1 gp 7 sp</BTd>
          <BTd class="smol">2 gp 8 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Tallow</BTd>
          <BTd class="smol">7</BTd>
          <BTd
            >Grants the target an inferior stat of the alchemist's choice(set at the time of the
            potion's creation).</BTd
          >
          <BTd class="smol">2 rounds</BTd>

          <BTd class="smol">2 gp 2 sp</BTd>
          <BTd class="smol">3 gp 3 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Poppy Seeds</BTd>
          <BTd class="smol">7</BTd>
          <BTd>The target is made sluggish, their Martial Point total is halved.</BTd>
          <BTd class="smol">2 rounds</BTd>

          <BTd class="smol">4 gp 2 sp</BTd>
          <BTd class="smol">5 gp 6 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Tiger Lilly</BTd>
          <BTd class="smol">8</BTd>
          <BTd>The target is rendered mute.</BTd>
          <BTd class="smol">2 rounds</BTd>

          <BTd class="smol">2 gp 1 sp</BTd>
          <BTd class="smol">3 gp 6 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Powdered Essentia</BTd>
          <BTd class="smol">8</BTd>
          <BTd>Delays potion effect by 12 hours</BTd>
          <BTd class="smol">N/A</BTd>

          <BTd class="smol">2 gp 4 sp</BTd>
          <BTd class="smol">4 gp</BTd>
        </BTr>
        <BTr>
          <BTd>Realgar Dust</BTd>
          <BTd class="smol">8</BTd>
          <BTd
            >A random chaos effect is rolled, wherein the target is considered both the target and
            the caster.</BTd
          >
          <BTd class="smol">instantaneous</BTd>

          <BTd class="smol">3 gp</BTd>
          <BTd class="smol">4 gp 8 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Reishi Mushroom</BTd>
          <BTd class="smol">8</BTd>
          <BTd>The target is cured of disease and cleansed of all status effects</BTd>
          <BTd class="smol">instantaneous</BTd>

          <BTd class="smol">5 gp</BTd>
          <BTd class="smol">7 gp 2 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Cloudbloom</BTd>
          <BTd class="smol">9</BTd>
          <BTd>The target falls upwards at a rate of 40ft per round.</BTd>
          <BTd class="smol">4 rounds</BTd>

          <BTd class="smol">1 gp 2 sp</BTd>
          <BTd class="smol">2 gp 8 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Copper Powder</BTd>
          <BTd class="smol">9</BTd>
          <BTd>Potion's effects apply continuously for 4 rounds</BTd>
          <BTd class="smol">N/A</BTd>

          <BTd class="smol">2 gp 3 sp</BTd>
          <BTd class="smol">4 gp 5 sp</BTd>
        </BTr>

        <BTr>
          <BTd>Selenium</BTd>
          <BTd class="smol">9</BTd>
          <BTd
            >The potion does the exact opposite of what it would do otherwise. Healing effects would
            deal pure magic damage.</BTd
          >
          <BTd class="smol">N/A</BTd>

          <BTd class="smol">3 gp 7 sp</BTd>
          <BTd class="smol">6 gp 6 sp</BTd>
        </BTr>
        <BTr>
          <BTd>Banana Slugs</BTd>
          <BTd class="smol">10</BTd>
          <BTd
            >The target is permanently transformed into a gender of the alchemist's choice(set at
            the time of the potion's creation).</BTd
          >
          <BTd class="smol">Permanent</BTd>

          <BTd class="smol">6 gp 5 sp</BTd>
          <BTd class="smol">14 gp</BTd>
        </BTr>
        <BTr>
          <BTd>Polymethaqualone</BTd>
          <BTd class="smol">10</BTd>
          <BTd
            >The target is permanently transformed into a creature that the alchemist has studied
            (set at the time of the potion's creation). The target can receive any adaptations
            natural to the creature, with a total point cost up to the target's HEA stat.
            (instantaneous)</BTd
          >
          <BTd class="smol">Permanent</BTd>

          <BTd class="smol">7 gp</BTd>
          <BTd class="smol">15 gp</BTd>
        </BTr>
      </BTbody>
    </BTableSimple>
  </div>
</template>

<style scoped>
tr {
  --bs-table-hover-color: color;
  --bs-table-hover-bg: var(--hover-table);
  --bs-table-bg: var(--table-bg);
  --bs-table-color: color;
}
table {
  background-color: var(--table-bg);
}
td {
  --bs-table-bg: var(--table-bg);
  --bs-table-color: color;
}
.rulesReferenceContainer {
  display: flex;
}
.smol {
  text-align: center;
}
th {
  align-self: center;
  text-align: center;
}
</style>
