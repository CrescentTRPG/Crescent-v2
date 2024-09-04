<script lang="ts">
import { signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { BButton, BCard, BNavItem, BNavbar, BFormTextarea, BModal } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import CharacterSidebar from '../Build/CharacterSidebar.vue'
import BannerItem from '../Build/BannerItem.vue'
import ArchetypeSelector from '../Build/ArchetypeSelector.vue'
import CustomModal from '../../CustomModal.vue'

export default {
  setup(props, context) {
    const router = useRouter()
    const modal = ref(false)
    const designStore = useDesignStore()
    const icon = ref('gi-quill')
    const descriptionPosition = ref('')
    const description = {
      '': 'Archetypes are a defining feature of a character and have a profound effect on a characters overall build. Archetypes may sound like a class, but they do not in any way restrict what kinda of abilities a character may learn.  Select an archetype under the banner.',
      Augur: 'Augurs have an additional stacking placed roll on all origin skill checks.',
      Breaker:
        'Breakers can reroll all dice greater or equal to a d12 once each round and their attacks ignore shield DVs.',
      Paladin:
        'Upon casting a spell, the paladin may restore an amount of HP to themselves or another character within LOS 20’ for (mana cost)d6 without action cost.',
      Warden: 'Wardens may choose to have either mundane or elemental resistance.',
      Mage: 'Spells  cast  from  a  mage  have  a  free  finesse  that  stacks  with  other  finesse  bonuses.  Mages have a finesse cap of 6.',
      Monk: 'By spending a reaction, monks may take their turn immediately instead of during their normal turn in the initiative order. This may only be done once per round.',
      Rogue:
        'Rogues do not have standard action sets. Rogues have 4 points to spend on actions each round. Core Actions cost 2 points, Swift Actions, Reactions, and Movement Actions cost 1 (...)',
      Mystic:
        'Mystics may expend their swift action to prepare a spell, converting it to an on hit effect until the end of the turn. This strips the spell of its resistance check while retaining its effects (...)',
      Nomad:
        'Nomads may prepare 2 spells they know, for free, as once per rest period magic items that may be activated by their wielder as a reaction (...)',
      Priest:
        'The range of all priests’ spells, including touch spells, is increased by 30’. Priests can also cast spells with a self target on other willing targets at a 30’ + 10’/F LOS range.',
      Elementalist:
        'Elementalists can choose to convert any damage dealt this turn by the character into their magical element type as a swift action. Regardless, each type of elemental damage has additional effects (...)',
      Sorcerer: 'Sorcerers can have four abilities that require focus active at once.'
    }
    const descriptionHTML = {
      Augur: '<div>Augurs have an additional stacking placed roll on all skill checks.</div>',
      Breaker:
        '<div>Breakers can reroll all dice greater or equal to a d12 once each round and their attacks ignore shield DVs.</div>',
      Paladin:
        '<div>Upon casting a spell, the paladin may restore an amount of HP to themselves or another character within LOS 20’ for (mana cost)d6 without action cost.</div>',
      Warden: '<div>Wardens may choose to have either mundane or elemental resistance.</div>',
      Mage: '<div>Spells  cast  from  a  mage  have  a  free  finesse  that  stacks  with  other  finesse  bonuses.  Mages have a finesse cap of 6.</div>',
      Monk: '<div>By spending a reaction, monks may take their turn immediately instead of during their normal turn in the initiative order. This may only be done once per round.</div>',
      Rogue:
        '<div>Rogues do not have standard action sets. Rogues have 4 points to spend on actions each round. Core Actions cost 2 points, Swift Actions, Reactions, and Movement Actions cost 1. If the rogue choses to spend all points on core actions, they lose their movement DVs until the start of their next turn. </div>',
      Mystic:
        '<div>Mystics may expend their swift action to prepare a spell, converting it to an on hit effect until the end of the turn. This strips the spell of its resistance check while retaining its effects. If the attack misses, the spell dissipates and the mana is lost. Should the spell be continuous or focus, the resistance check is determined when the target re-attempts the check (3 times between rest periods.) </div>',
      Nomad:
        '<div>Nomads may prepare 2 spells they know, for free, as once per rest period magic items that may be activated by their wielder as a reaction. Previous items lose power when more are created. These spells can have a combined additive rank equal to the character’s PWR attribute or twice their level; whichever is lower. </div>',
      Priest:
        '<div>The range of all priests’ spells, including touch spells, is increased by 30’. Priests can also cast spells with a self target on other willing targets at a 30’ + 10’/F LOS range.',
      Elementalist:
        '<div>Elementalists can choose to convert any damage dealt this turn by the character into their magical element type as a swift action. Regardless, each type of elemental damage has additional effects:</div> </br><div>    ❖  Fire: Inflicts an instance of suffering (Fire) to  all  struck  enemies  (applies once per enemy per round)</div> <div>    ❖  Ice:  Slows  all struck enemies until the end of their next turn.</div><div>    ❖  Force: Pushes the creature or character (if they are within melee reach of a creature or a surface) up to 10’ in a direction of the character’s choice. </div><div>❖  Lightning: Paralyses a singular struck target until the end of their next turn, HEA save to negate (check is set with PWR.) </div>',
      Sorcerer: '<div>Sorcerers can have four abilities that require focus active at once.</div>'
    }
    return { designStore, icon, descriptionPosition, description, modal, descriptionHTML }
  },

  methods: {
    updateIcon(name: string) {
      console.log(name)
      this.icon = name
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CharacterSidebar,
    BannerItem,
    ArchetypeSelector,
    BFormTextarea,
    CustomModal
  }
}
</script>

<template>
  <div class="archetype-container">
    <div :style="{ fontFamily: designStore.font }" class="banner-container">
      <div style="width: 14rem; display: flex; flex-direction: column">
        <BannerItem :name="icon"></BannerItem>
        <div style="display: flex; justify-content: center">
          <ArchetypeSelector
            style="position: relative; top: 13.5rem; width: 80%"
            @breaker="updateIcon('gi-broken-shield'), (descriptionPosition = 'Breaker')"
            @augur="updateIcon('gi-juggler'), (descriptionPosition = 'Augur')"
            @paladin="updateIcon('gi-healing'), (descriptionPosition = 'Paladin')"
            @warden="updateIcon('gi-energy-shield'), (descriptionPosition = 'Warden')"
            @mage="updateIcon('gi-spell-book'), (descriptionPosition = 'Mage')"
            @monk="updateIcon('gi-high-kick'), (descriptionPosition = 'Monk')"
            @rogue="updateIcon('gi-rogue'), (descriptionPosition = 'Rogue')"
            @mystic="updateIcon('gi-gooey-sword'), (descriptionPosition = 'Mystic')"
            @nomad="updateIcon('gi-intricate-necklace'), (descriptionPosition = 'Nomad')"
            @priest="updateIcon('gi-sun-priest'), (descriptionPosition = 'Priest')"
            @elementalist="updateIcon('gi-frostfire'), (descriptionPosition = 'Elementalist')"
            @sorcerer="updateIcon('gi-brain-stem'), (descriptionPosition = 'Sorcerer')"
          ></ArchetypeSelector>
        </div>
        <i
          class="bi bi-patch-question"
          :style="{ color: designStore.alertTheme }"
          style="
            margin-top: 0.25rem;
            font-size: 2rem;
            position: relative;
            left: 10rem;
            top: 7.5rem;
            width: 2rem;
          "
          @click="modal = !modal"
        ></i>
      </div>
    </div>
    <CustomModal :showModal="modal" :title="descriptionPosition" @close="modal = false">
      <template v-slot:body>
        <div v-html="descriptionHTML[descriptionPosition]"></div>
      </template>
    </CustomModal>
  </div>
</template>

<style>
.modal-content {
  background: inherit;
}
.modal-dialog {
  background: inherit;
}

.archetype-container {
  display: flex;
  height: 17rem;
}
.description-border {
  position: absolute;
  padding: 4px;
  border: 2px solid;
  margin: 1rem;
  max-height: 16rem;
}
.description {
  cursor: pointer;
  border: 4px solid;
  width: 100%;
  min-width: 15rem;
  max-height: 14.75rem;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 1rem;
  padding-right: 1rem;
  white-space: wrap;
  padding-bottom: 1rem;
  padding-top: 0.5rem;
}
.banner-container {
  position: relative;
  right: 5%;
  display: flex;
  min-width: 14rem;
  justify-content: flex-start;
  padding-bottom: 2rem;
}
@media (max-width: 650px) {
  .textarea-container {
    justify-content: flex-start;
  }
  .banner-container {
    right: 10%;
    position: relative;
    display: flex;
    justify-content: center;
    width: 100%;
    height: 15rem;
    padding-bottom: 2rem;
  }
}
@media (max-width: 650px) {
  .archetype-container {
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  .description {
    border: 4px solid;
    height: 40%;
    padding: 1rem;
    min-width: 13rem;
    overflow: hidden;
    display: block;
    text-overflow: ellipsis;
    padding-bottom: 2rem;
    height: inherit;
  }
  .description-border {
    position: relative;
    padding: 4px;
    border: 2px solid;
    right: 1rem;
    max-height: 16rem;
    width: 100%;
  }
}
</style>
