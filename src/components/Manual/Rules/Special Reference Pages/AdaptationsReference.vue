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
    &#9;Beasts of nature can perform feats that seem fantastical to the more civilized species. By
    adapting one's own body to harness the powers of the great beasts of nature, one may become even
    more powerful. A character's cumulative adaptive score is limited to whichever is lower between
    their Health or their (maximum ranks in Fauna)*2. Note: the character may choose to adapt custom
    adaptations at GM discretion. Using a metamagic check may give the GM a basis for whether or not
    the adaptation is a success. Custom adaptations should be assigned a relevant adaptive score at
    GM's discretion.

    <BTableSimple hover small caption-top responsive style="margin-top: 1rem">
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Movement
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
          <BTh>Adaptive Score</BTh>
          <BTh>Description</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Adhesive</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Character gains a climbing speed equal to their land movement speed.</BTd>
        </BTr>
        <BTr>
          <BTd>Burrowing</BTd>
          <BTd class="smol">4</BTd>
          <BTd
            >Character gains a burrowing speed equal to an eighth of their land movement speed.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Extra Set of Legs</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Character gains 10’ of bonus land movement.</BTd>
        </BTr>
        <BTr>
          <BTd>Glider</BTd>
          <BTd class="smol">3</BTd>
          <BTd
            >Characters may glide instead of free falling, slowing their descent such that they take
            no damage and allowing them to fall 10’ but glide 30’ forward as a movement action.
            While gliding, a character’s movement DVs are halved.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Slithering</BTd>
          <BTd class="smol">5</BTd>
          <BTd
            >Character does not require the use of their limbs to move. The character can also spend
            a reaction (characters with slither retain their reaction while grappled ) to slither
            out of a grapple or pin , with three placed rolls to break .</BTd
          >
        </BTr>
        <BTr>
          <BTd>Webbing</BTd>
          <BTd class="smol">2</BTd>
          <BTd> Character gains a swim speed equal to their land movement speed.</BTd>
        </BTr>
        <BTr>
          <BTd>Wings</BTd>
          <BTd class="smol">5</BTd>
          <BTd> Character gains a flight speed equal to half their land movement speed.</BTd>
        </BTr>
      </BTbody>
    </BTableSimple>
    <BTableSimple hover small caption-top responsive style="margin-top: 1rem">
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Attack
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
          <BTh>Adaptive Score</BTh>
          <BTh>Description</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Breath Weapon</BTd>
          <BTd class="smol">5</BTd>
          <BTd
            >Character may shoot a chosen elemental damage type in a 5’ X (rank*10)’ cone,
            inflicting (rank)d12 damage with an AGI save for half.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Claws</BTd>
          <BTd class="smol">1</BTd>
          <BTd
            >Character may grow their choice of d6 precision or d12 versatile claws. The claws
            inflict piercing damage and may be used with knives or brawling skill respectively.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Horns</BTd>
          <BTd class="smol">1</BTd>
          <BTd
            >Character grows 2d8 or 1d20 (9 STR) heavy horns that may be used with axe skill. The
            horns inflict edged damage.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Tail</BTd>
          <BTd class="smol">1</BTd>
          <BTd
            >Character grows may grow their choice of a d12 versatile or d20 heavy tail. The tail
            inflicts blunt damage and may be used with polearm skill. The character requires 9 STR
            to use the heavy tail in combat.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Venemous Coat</BTd>
          <BTd class="smol">5</BTd>
          <BTd
            >Grappling a target, or being grappled causes the target to gain an instance of
            suffering (Toxic) at the start of each of the character’s turns in which the grapple is
            maintained</BTd
          >
        </BTr>
      </BTbody>
    </BTableSimple>
    <BTableSimple hover small caption-top responsive style="margin-top: 1rem">
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Defense
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
          <BTh>Adaptive Score</BTh>
          <BTh>Description</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Hibernating</BTd>
          <BTd class="smol">2</BTd>
          <BTd
            >Character may go into a comatose state for 16 hours recovering all HP and mana and
            cleansing themselves of any non magical ailments or broken bones during the
            process.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Land on Feet</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Decreases fall damage by (rank)d6</BTd>
        </BTr>
        <BTr>
          <BTd>Regeneration</BTd>
          <BTd class="smol">3</BTd>
          <BTd
            >Character regenerates (rank) HP at the start of each turn - if they are missing any.
            They may do so a number of times up to their HEA per rest period. If a character removes
            the Regeneration adaptation, they must wait until after a long rest to apply it
            again.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Scales</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Hardened scales provide 2/2 shield DVs.</BTd>
        </BTr>
      </BTbody>
    </BTableSimple>
    <BTableSimple hover small caption-top responsive style="margin-top: 1rem">
      <caption
        style="padding: 1rem"
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText
        }"
      >
        Extraneous
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
          <BTh>Adaptive Score</BTh>
          <BTh>Description</BTh>
        </BTr>
      </BThead>
      <BTbody>
        <BTr>
          <BTd>Enviornmental Adaptation</BTd>
          <BTd class="smol">1</BTd>
          <BTd
            >Character can persist in a chosen reasonably extreme environment such as extreme heat,
            cold, pressure, etc.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Extra set of Arms</BTd>
          <BTd class="smol">5</BTd>
          <BTd>Character grows two new arms somewhere on their body.</BTd>
        </BTr>
        <BTr>
          <BTd>Goliath</BTd>
          <BTd class="smol">4</BTd>
          <BTd>Character becomes one size category larger, stacking with any other bonuses.</BTd>
        </BTr>
        <BTr>
          <BTd>Miniature</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Character becomes one size category smaller.</BTd>
        </BTr>
        <BTr>
          <BTd>Night Vision</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Character sees (rank*10)’ in natural darkness.</BTd>
        </BTr>
        <BTr>
          <BTd>Non-Breathing</BTd>
          <BTd class="smol">4</BTd>
          <BTd>Character no longer needs to breathe.</BTd>
        </BTr>
        <BTr>
          <BTd>Sensitive Nose/Ears/Echolocation</BTd>
          <BTd class="smol">2</BTd>
          <BTd
            >Character can track things by their scent/sounds acting as effective as normal vision
            in a radius of (rank)*5’.</BTd
          >
        </BTr>
        <BTr>
          <BTd>Stretch</BTd>
          <BTd class="smol">2</BTd>
          <BTd>Character’s limbs have an increased reach of 10’</BTd>
        </BTr>
        <BTr>
          <BTd>Water Breathing</BTd>
          <BTd class="smol">1</BTd>
          <BTd>Character breathes underwater as if it were normal air.</BTd>
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
