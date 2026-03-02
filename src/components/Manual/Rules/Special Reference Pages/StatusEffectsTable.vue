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
    &#9;Status Effects represent the current state of your character independant of their remaining
    HP. These effects are temporary and typically time limited. Within this application, manyof the
    basic status effects will automatically apply their effects when it makes sense and highlight
    the effects to show that they are actively being modified. You can apply and remove Status
    Effects on the Overview Page.

    <BTableSimple hover small caption-top responsive style="margin-top: 1rem">
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Status Effects
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
          <BTh>Format</BTh>
          <BTh>Description</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Befuddle</BTd>
          <BTd><i>Befuddled</i></BTd>
          <BTd
            >The character loses their sense of self, spacing out occasionally. The character has a
            displaced roll on all PER and INT related checks as long as the condition lasts. A
            befuddled character cannot maintain Focus, any active focus spells are broken upon
            becoming befuddled .
          </BTd>
        </BTr>
        <BTr>
          <BTd>Blind</BTd>
          <BTd><i>blinded (type)</i></BTd>
          <BTd
            >Target cannot utilize its sight to perceive its surroundings, and has their LOS
            restricted to 10’. The target automatically fails any checks that require sight. <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ True blindness prevents all means of sight, even those provided by magical or
              unnatural senses. Magical darkness inflicts True Blindness, limiting LOS to touch .
              <br />
              &#9;❖ The affected target suffers 2 displaced rolls on all attack rolls. <br />
              &#9;❖ All attack rolls against the target gain a placed roll.
            </div></BTd
          >
        </BTr>
        <BTr>
          <BTd>Charm</BTd>
          <BTd><i>charmed</i></BTd>
          <BTd
            >Targets affected by this condition will perceive the charm er as their ally, and refuse
            to harm them — and seek to protect them. The charmer may direct the charmed target to
            perform an action as a swift action, so long as it does not directly endanger/harm the
            charmed individual. The condition lasts for the duration of the magical effect causing
            it. In case the affected target or its possessions is a target of offensive actions
            stemming from the charmer, the charmed target is allowed to immediately re-attempt the
            original resistance check again to break the charm with no action cost.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Confused</BTd>
          <BTd><i>confused</i></BTd>
          <BTd
            >Target cannot differentiate between friend and foe. It will attempt to resist any
            magical effects and if in the middle of combat will select targets for both its benign
            and offensive actions arbitrarily (roll a d6, 1-3 is benign, 4-6 is offensive), though
            it has a preference for the nearest targets.</BTd
          >
        </BTr>

        <BTr>
          <BTd>Encumber</BTd>
          <BTd><i>encumbered</i></BTd>
          <BTd
            >The total weight of what the character is carrying exceeds that of the character’s
            weight multiplied by their Might (½ Strength Attribute + Might Ranks.) When encumbered,
            they are slowed .
          </BTd>
        </BTr>
        <BTr>
          <BTd>Ethereal</BTd>
          <BTd><i>ethereal</i></BTd>
          <BTd
            >Targets affected by this condition are in the ethereal plane ; they..

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ Are immune to all damage that is not from its current plane.<br />
              ❖ Can only affect other ethereal targets<br />
              ❖ Are flying at a speed equal to their normal movement speed.<br />
              ❖ Are capable of moving through non-magical materials such as wood or stone, but not
              enchanted materials and are blinded while inside solid materials.<br />
            </div>
            If the target turns physical, it is displaced to the nearest unoccupied space within
            20’. If no such place exists, the target materializes inside a solid object, dead.</BTd
          >
        </BTr>

        <BTr>
          <BTd>Fatigue</BTd>
          <BTd><i>fatigued</i></BTd>
          <BTd
            >The character failed to get a complete rest period. The scale of detriment increases
            for each night the character fails to rest. After missing their first night of rest, the
            character has a displaced roll on all attribute checks. On each subsequent day, the
            character receives a stacking displaced roll on every roll for each night the character
            misses a day’s rest.
          </BTd>
        </BTr>
        <BTr>
          <BTd>Frightened</BTd>
          <BTd><i>frightened</i></BTd>
          <BTd
            >Target is terrified by the source of this condition and will utilize its movement
            action to put space between itself and the source. In addition:

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ They have a displaced roll on any check stemming from the source of the
              condition.<br />
              ❖ They have a displaced roll when making an attack roll against the source of the
              condition.<br />
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Hex</BTd>
          <BTd><i>hexed</i></BTd>
          <BTd
            >Targets affected by this condition are are incapable of teleportation by any means.
          </BTd>
        </BTr>
        <BTr>
          <BTd>Invisible</BTd>
          <BTd><i>invisible</i></BTd>
          <BTd
            >Target bends visible light around itself, turning invisible to normal vision, though it
            still releases noise.

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ Attacks against them have a blindness penalty if they are undetected, otherwise only
              one displaced roll if hidden.<br />
              ❖ Gain two placed rolls on subtlety checks.<br />
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Paralyze</BTd>
          <BTd><i>paralyzed</i></BTd>
          <BTd
            >Target is paralyzed and cannot move its body, though it regains its movement action
            upon breaking free of the paralysis.

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ Target is still aware of its surroundings, though unable to to take actions.<br />
              ❖ Upon taking any damage, the paralysis is broken immediately at no action cost.
              <br />❖ Target cannot make AGI checks while paralyzed.<br />
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Pin</BTd>
          <BTd><i>pinned</i></BTd>
          <BTd
            >Affected target suffers a number of penalties:

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ A pin ned target’s movement speed is always 0.<br />
              ❖ A pin ned target’s movement DVs are set to 0.<br />
              ❖ Has two displaced rolls on all AGI checks and loses any placed rolls.<br />
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Planar Bound</BTd>
          <BTd><i>planar bound</i></BTd>
          <BTd
            >Planar bound targets are incapable of shifting planes. This includes teleportation to
            different planes of reality and becoming ethereal. Planar bound targets are additionally
            considered Hexed, and thus incapable of teleportation as well.
          </BTd>
        </BTr>
        <BTr>
          <BTd>Grapple</BTd>
          <BTd><i>grappled</i></BTd>
          <BTd
            >A grapple can be made with a successful melee attack roll, (inflicting no damage,
            though skill can alter grapples) pin ning them on hit. The target is reduced to a core
            action (while grappled ) , and the grappler is slowed . The target regains their
            movement and swift action upon breaking the grapple. To maintain a grapple the character
            must spend a Core Action each round.

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ It takes two arms to grapple a target of the character’s own size class, one arm to
              grapple a target of a smaller size class, and the character cannot effectively grapple
              a target of a larger size class.<br />
              ❖ Grappled targets can attempt to break by using a core action to attempt a new
              grapple check (contested might check. )<br />
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Petrify</BTd>
          <BTd><i>petrifed</i></BTd>
          <BTd
            >Target is turned into a statue, losing all of their actions. In this state the target
            gains resistance to most damage types, but can receive blunt, magical or stress damages
            as normal.
            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ If the target takes blunt damage that brings it to negative HP, the statue is
              shattered, but can be glued back together. If the effect ends when the statue is
              shattered, the target is dead. If the target takes enough magical or mental damage to
              normally kill it, it dies.<br />
              ❖ The target is not aware of its surroundings while under this condition.<br />
            </div>
            Unless otherwise stated, the target re-attempts the check at the end of each of their
            turns, breaking free on success.
          </BTd>
        </BTr>
        <BTr>
          <BTd>Prone</BTd>
          <BTd><i>prone</i></BTd>
          <BTd
            >Target is knocked to the ground, gaining a number of effects until they utilize half of
            their movement to stand up.

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ The target’s movement DVs are reduced to zero<br />
              ❖ Attacks against the target gain a placed roll.<br />
              ❖ The target’s movement speed is halved.<br />
              ❖ The target suffers a displaced roll on AGI checks<br />
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Sick</BTd>
          <BTd><i>sickened</i></BTd>
          <BTd
            >Sickened I. Target suffers a displaced roll on all checks. Upon entering combat, the
            target becomes <i>confused</i>.<br />
            Sickened II+. Target gains a stacking instance of suffering (Toxic.)
          </BTd>
        </BTr>
        <BTr>
          <BTd>Slow</BTd>
          <BTd><i>slowed</i></BTd>
          <BTd
            >A slowed character moves at half of their normal movement speed and loses their
            reaction
          </BTd>
        </BTr>
        <BTr>
          <BTd>Spell Jammed</BTd>
          <BTd><i>spell jammed</i></BTd>
          <BTd
            >The target cannot utilize magic under this condition.

            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ If condition specifies magic type, only that magic type is blocked. Otherwise all
              magic is restricted.<br />
              ❖ This condition does not stop already activated spell effects from working, but does
              not allow activation of any new effects by the target.
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Stunned</BTd>
          <BTd><i>stunned</i></BTd>
          <BTd
            >The target is stunned and cannot perform any movement, core, reaction, or swift
            actions.
            <br />
            <div style="text-indent: 1rem each-line hanging; padding-left: 1rem">
              ❖ Has a displaced roll on all HEA, WIL, STR, and AGI checks.<br />
              ❖ A stunned target’s movement speed is always 0. <br />❖ Target cannot access their
              movement DVs while pinned.
            </div>
          </BTd>
        </BTr>
        <BTr>
          <BTd>Suffering</BTd>
          <BTd><i>suffer</i></BTd>
          <BTd
            >Each instance of Suffering inflicts a d6 of a damage type at the start of a character’s
            turn until cleared. Targets under the effects of suffering can remove all instances of
            it by expending their swift action.
          </BTd>
        </BTr>
        <BTr>
          <BTd>Stunned</BTd>
          <BTd><i>stunned</i></BTd>
          <BTd
            >Unconscious targets cannot perform any kind of actions and automatically fail all AGI
            and STR checks.
          </BTd>
        </BTr>

        <BTr>
          <BTd>Warp</BTd>
          <BTd><i>warped</i></BTd>
          <BTd
            >Upon gaining three instances of Warp a character becomes Warped. Each complete rest
            period reduces each instance of Warp by 1; unless they are already Warped . The
            character’s mind has been shattered; either through insight into higher beings, extreme
            stress, addiction or circumstance. The character must fulfill the warp’s condition,
            whatever it may be for the day. Failure to fulfill the warp’s condition within 18 hours
            will cause the character to be unable to recover HP in any way and gain a displaced roll
            on all attribute checks until they fulfill the warp’s condition. Warp can also twist a
            character’s motivations, memories, and personality. Cures for warp are often highly
            personal. Ex: Soul Warp - A character’s obsession with blight forces them to consume a
            soul once each day.
          </BTd>
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
