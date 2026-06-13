<script lang="ts">
import { ref } from 'vue'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'

import { useDesignStore } from '@/stores/designStore.ts'
import { BTableSimple, BTbody, BTd, BTh, BThead, BTr } from 'bootstrap-vue-next'
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
  components: { TitleWidget, AbilityDisplayMedallion, TitleMedallion }
}
</script>

<template>
  <div style="margin: 1rem">
    <h3>What does it mean to be a Player?</h3>
    <p>
      Players are main characters in a shared story between Players and the Game Master. Each player
      controls a single character that they give a rich backstory, motivation, and personal details.
      They make these characters before the game begins, typically with some guidance from their
      Game Master. The characters grow over the course of the story, their life experience
      culminating in
      <i>Ability Points</i>. Characters invest the <i>Ability Points</i> they earn through their
      life experiences into new abilities See: <i>Building a Character</i>,
      <i>Ability Points</i> and <i>Selecting Abilities</i>.
    </p>
    <AbilityDisplayMedallion :medallion="'gi-journey'"></AbilityDisplayMedallion>

    <TitleWidget title="How do players interact with the story?"></TitleWidget>
    <div style="margin: 0.5rem">
      Player interaction depends on the current speed of play. There are two basic speeds of play:
      Exploration and Turn by Turn. <br /><br />
      <h5>Exploration Mode</h5>
      All characters are free to announce actions, speak in character, use abilities, or make plans.
      Time may pass nebulously, or linger for awhile in the same moment. Whenever the result of an
      action is in question or an ability is used that specifies that rolls will be made, Players
      will need to roll dice. See <i>Rolling Dice</i> for more information. Some of these rolls may
      be as a part of a <i>Skill Challenge</i>.<br /><br />
      <h5>Turn By Turn Mode</h5>
      Everyone rolls initiative and waits for their turn in the initiative order to come up. Players
      have a set of actions they are allowed to take within that round (Core, Swift, Move, and
      Reaction) and they may only take them, except for their Reaction, on their specific turn
      unless otherwise specified. Turn by Turn mode is primarily used in combat. Everyone should be
      planning their turn before their turn comes up so as to move in a timely manner.
      <TitleMedallion title="Types of Actions" style="text-wrap: nowrap"></TitleMedallion>

      <div style="margin: 0.5rem">
        <h5>Core Action</h5>
        <p>
          The main component of a turn. This action can be converted to any of the three other
          actions.
        </p>
        <h5>Movement Action</h5>
        <p>
          The character may move any amount of space, up to their movement speed. A character’s base
          speed is typically set to 30’. This Action can be used partially and resumed.
        </p>
        <h5>Swift Action</h5>
        <p>
          The character takes a particularly fast action. Typically fast acting spells and the
          activation of certain abilities. <i>Buffing</i> spells that involve enhancing one’s allies
          tend to be swift actions.
        </p>
        <h5>Reaction</h5>
        <p>
          The character takes an action in response to an event; typically a specific effect. This
          can occur at any point throughout the round. If the reaction interrupts another
          character’s turn, they can continue their turn after the reaction is taken.
        </p>
      </div>
    </div>
    <br />
    <AbilityDisplayMedallion :medallion="'gi-swordman'"></AbilityDisplayMedallion>
    <TitleWidget title="Basic Concepts"></TitleWidget>
    <div style="margin: 0.5rem">
      <h5>Hit Points (HP)</h5>
      <p>
        Hit points (HP), indicate a character’s ability to sustain damage. When damaged, they have
        hit points subtracted from their current HP. Their current HP indicates their new condition.
        There are several means of restoring hit points, one of which is resting. Upon taking a
        complete rest period, a character restores a number of hit points equal to ten times their
        HEA attribute. HP may not be restored beyond the original maximum HP total through rest. A
        character at level 1 begins with 18 HP. Only a single rest period can be taken in a
        twenty-four hour period.
      </p>
      <h5>Defense Values (DVs)</h5>
      <p>
        Defense Values (DVs) represent how hard it is to hit a target or pierce their armor. See
        <i>Defense Values</i> for more details.
      </p>

      <h5>Stacking Rules</h5>
      <p>
        All characters are subject to stacking rules. In cases where the character has two bonuses
        of the same type, the largest active effect will always take precedence over any other ones
        — preventing the stacking of multiple effects. If an effect is labeled as stacking, such as
        the stacking placed rolls granted by the augur archetype, these rules do not pertain to that
        instance of the effect.
      </p>
    </div>
    <AbilityDisplayMedallion :medallion="'gi-book-cover'"></AbilityDisplayMedallion>
  </div>
</template>

<style scoped></style>
