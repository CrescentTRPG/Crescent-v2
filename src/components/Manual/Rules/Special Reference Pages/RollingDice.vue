<script lang="ts">
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { useDesignStore } from '@/stores/designStore.ts'
import TitleWidget from '@/components/TitleWidget.vue'
import AbilityDisplayMedallion from '@/components/AbilityDisplayMedallion.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'

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
  components: { AbilityDisplayMedallion, TitleMedallion }
}
</script>
<template>
  <div style="margin: 0.5rem">
    <p>
      This system primarily uses two ten sided dice, abreviated to 2d10, for most rolls, however it
      is reccomended to have a standard suite of RPG dice nevertheless (d4
      <v-icon name="gi-d4"></v-icon>, d6 <v-icon name="gi-perspective-dice-six"></v-icon>, d8
      <v-icon name="gi-dice-eight-faces-eight"></v-icon>, d10 <v-icon name="gi-d10"></v-icon>, d12
      <v-icon name="gi-d12"></v-icon>, d20 <v-icon name="gi-dice-twenty-faces-twenty"></v-icon>,
      d100 <v-icon name="gi-d10"></v-icon><v-icon name="gi-d10"></v-icon>). The abbreviation used
      above is common notation used for lots of rolls. (# of dice rolled)d(# of sides on the dice).
      Ex: 3d6 (roll 3 six sided dice)
    </p>
    <p>
      Whenever you need to roll, you will be instructed to do so, either by the game master, or by
      the ability you intend to use. You can use physical dice OR the handy dandy dice roller in the
      top right will automatically calculate your bonuses for you if you like! All rolls fit into
      one of these catagories...
    </p>
    <TitleMedallion title="Types of Rolls" style="text-wrap: nowrap"></TitleMedallion>
    <div
      style="margin: 1rem; margin-top: 0.5rem"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <h5>Attribute Checks</h5>
      <p>2d10 + The value of the associated <i>Atrribute</i>. See: <i>Attributes</i></p>
      <h5>Attack Roll</h5>
      <p>
        Also called a "To Hit Roll", Attack rolls are made to determine if an attack hits. Attack
        Rolls are ultimately a Perception Check (Attribute Check using a character's Perception).
        The Attack roll must meet or exceed a Targets <i>Defense Values</i> (DVs) in order to hit
        them and apply its effects. See: <i>Defense Values</i>
      </p>
      <h5>Roll Initiative</h5>
      <p>
        Initiative Rolls determine how quickly characters go in the initiative order. Initiative
        rolls are a kind of <i>Attribute Check</i> and they use Agility. If two combatants
        initiative is tied, The combatant with the higher Agility goes first. Note: characters may
        chose to fail initiative and get a 0.
      </p>
      <h5>Resistance Checks / Saves</h5>
      <div>
        <p>
          Resistance Checks and Saves are a kind of <i>Attribute Check</i>. The Attribute used will
          be specified on the ability. The value targets need to roll to save on a Resistance Check
          is determined by the target, as Resistance Checks and Saves are Contested Checks. This
          means that the individual using the ability sets the difficultly with an
          <i>Attribute Check</i> of some kind. This is called Setting a Resistance Check. The Target
          saves by meeting or exceeding that rolled value with their own <i>Attribute Check</i>.
          <br />
        </p>
        <p style="font-size: small; text-align: end; margin-left: 2rem">
          Ex: Jimmy Casts Fireball on a couple of Goblins. Fireball is a spell, so he sets his
          Resistance Check with Power. He rolls 2d10 getting a 2 and a 7 for a total of 9 and adds
          his Power of 7 for a grand total of 16. The spell fireball specifies that targets make a
          Health Save so the goblins Grunkle and Spit each roll 2d10 and add their Health. Grunkle
          rolls a 2 and a 3 and adds their Health score of 3 for a total of 8, failing the save.
          Spit rolls a 9 and a 4 and adds their Health score of 3 for a total of 16, just barely
          making the save.
        </p>
        <p>
          The difference between a Resistance <b>Save</b> and a <b>Check</b> is that Resistance
          <b>Saves</b> cannot be re-attempted, but Resistance <b>Checks</b> can be re-attempted on
          subsquent turns.
        </p>
      </div>
    </div>
    <h5>Skill Checks</h5>
    <p>
      2d10 + (Ranks in the skill) + (half of that skills Dominant Atttibute). All skills have one
      Dominate Attribute. Ex: Knowledge's dominant attribute is Intelligence. This becomes a part of
      the modifier applied to skill checks, but its not valued as highly as ranks in the skill
      itself.
    </p>
    <h5>Other Rolls</h5>
    <p>
      All other rolls will explicitly tell you what dice to roll 4d6, 1d4 etc. These could be to
      determine damage totals, modifiers, etc.
    </p>
    <TitleMedallion title="Placed and Displaced Rolls" style="text-wrap: nowrap"></TitleMedallion>
    <div style="margin: 0.5rem"></div>
    <p>
      Placed rolls are when a character rolls extra dice equal to the number of placed rolls and
      takes the best dice for their roll. Ex: Quinn is making a Health save, but they have one
      placed roll. So instead of rolling 2d10, they get to roll three, and pick the highest two dice
      for their roll. Characters may get placed rolls form their abilities, status effects, etc.
    </p>
    <p>
      Displaced rolls are very similar, but in the reverse. In a Displaced roll, instead of
      selecting the best dice, the character must select the worst dice. Ex: Fara is Blinded, so she
      has two displaced rolls of Perception Checks. she rolls an additional 2d10 dice on top of the
      2d10 she would normally roll and picks the two lowest rolls. The sum of those is the value of
      her roll.
    </p>
    <p style="font-size: small">
      Note: The Die Roller on the app tells you how may dice are being rolled and will always show
      you in the results what dice were kept and which were ignored. Since rolling with one placed
      roll rolls three dice it will show the 3 dice are being rolled and one will be pushed aside.
    </p>
    <AbilityDisplayMedallion :medallion="'gi-d10'"></AbilityDisplayMedallion>
  </div>
</template>
