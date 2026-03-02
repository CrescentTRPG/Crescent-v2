<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import DropdownSelect from '@/components/DropdownSelect.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import { useUserStore } from '@/stores/userStore.ts'
import MoonDisplay from './MoonDisplay.vue'

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const file = ref()
    const localImg = ref('')
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const story = ref('')
    const options = [
      'Discovery',
      'Immortality',
      'Sacrifice',
      'Kinship',
      'Domination',
      'Ideology',
      'Envy',
      'Wayward'
    ]
    const motivation = ref(characterStore.motivation)
    function update(motive) {
      motivation.value = motive
      characterStore.setMotivation(motive)
    }
    const descriptions = {
      Discovery: {
        icon: 'wi-moon-alt-waxing-crescent-2',
        description:
          'There is a mystery in everything. Knowledge, experience, and wonder are the things most worth pursuing in the universe. Searching for new thrills, living a life worth living, knowing the valleys and mountains of the mind, and inding questions that have yet to be conceived is the goal of discovery. Those motivated by discovery have neither desire nor ability to commit to a single path, for better or worse.'
      },
      Immortality: {
        icon: 'wi-moon-alt-full',

        description:
          'Above all, seekers of immortality strive to burn a searing mark on the annals of history. Wealth and power are all well and good, but their transience renders them worthless to the eye of the aspiring immortal. A legacy stretching into the millennia is the only worthy desire, and no sacrifice is too great to make in its pursuit. Striving to ininity, at the back of every immortal’s mind lies the worry that the contrast between their achievements and those of one who lives only in the moment is merely one of degree.'
      },
      Sacrifice: {
        icon: 'wi-moon-alt-waxing-gibbous-4',
        description:
          'Martyrdom is the sacrifice’s only goal. Ruination of the self is an unintended consequence. The sacrifice is the first in a battle and the last out; always willing to bear the burden of others, both emotional and physical, long past their breaking point. All suffering is biblical, and the sacrifice would gladly pay any price to staunch the blood loss of another. A prmial soul stronger than any material mundane or magical, they  will  protect. But how can one protect another if they lack the will to defend themselves?'
      },
      Kinship: {
        icon: 'wi-moon-alt-first-quarter',
        description:
          'All people are linked together; they experience the same range of emotions and express the same hardships. One seeking kinship aims to bond with others over this shared common ground. There is no nectar sweeter than love and friendship. For better or worse, reason takes a second place to the war drums of the heart. These individuals are often easily manipulated and overly trusting.'
      },
      Ideology: {
        icon: 'wi-moon-alt-waning-gibbous-2',
        description:
          'Unshakeable and pure; the ideologue knows that the world is a manichean duality. There is right and wrong, and the ideologue stands on the side of righteousness - where are you? Faith substitutes for food and water in the mind of the ideologue. Carrying a natural wisdom and fine temperament, the ideologue strives for their own sense of justice, regardless of what others think of them. If only everyone else adopted… the right way of doing things. Doubt is for the weak willed; the ideologue knows they have the answers. At least, they’re convinced that they do.'
      },
      Envy: {
        icon: 'wi-moon-alt-waning-crescent-4',
        description:
          'The envious are ambitious and motivated individuals, always striving to have more and never satisied with what they have. The envious look longingly at those with steadfast beliefs and motivations wishing for a stronger sense of self. The envious are often distrusting and manipulative: pulling others down, setting friends against one another, never taking the blame, turning individuals against their most sacred beliefs. Every other person is an enemy on some level, even when the envious has deluded themselves into believing someone is their friend. At the core of it all though, the person the envious hates the most is themselves.'
      },
      Domination: {
        icon: 'wi-moon-alt-third-quarter',

        description:
          'If people were meant to exercise freedom; they would not be so willing to submit.  In order to save others from themselves, it is necessary to give them a leader - something the seeker of domination selflessly volunteers for. Every conversation, war, and struggle is nothing more than another battle in the competition for influence. In that battle there is only victory and defeat. Modesty is a hubris that cannot be afforded. If progress is to be made, others must know who is in charge. They are the shield that stands between civilization and chaos.'
      },
      Wayward: {
        icon: 'wi-moon-alt-new',
        description:
          'The wayward are anything but lacking in motivation. Seeing the fools around them destroyed in futile struggles to live up to self-contradicting ideals, the wayward chose a different path. Motivation can only be found in the world around you, not in dusty tomes, grand palaces, or great triumph, be it on the battleield or at the negotiating table. The only winning move in the game of the powerful is not to play. The wayward enjoy unparalleled freedom, but also face the great uncertainty of a life lived without clear purpose.'
      },
      'Select Motivation': {
        icon: 'gi-uncertainty',
        description:
          'It is said that the phase of the moon on the day you were born effects the very base motivations that drive an individual.  This phenomenon is described as your "Lunar Motivation".  Lunar Motivations refelct the base reason as to why each day, the character chooses to press onwards.  They refelect their ultimate driving goal and most of them can be used to support moral and immoral actions, however, different motivations definately lean in one direction or the other.'
      }
    }

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      file,
      story,
      localImg,
      options,
      update,
      descriptions,
      motivation
    }
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
    }
  },
  components: { TitleMedallion, MoonDisplay, DropdownSelect }
}
</script>

<template>
  <div style="height: fit-content">
    <div
      class="motive"
      style="width: 20rem; margin-top: 1rem; min-height: 25.5rem"
      :style="{ background: designStore.primaryTheme }"
    >
      <div
        style="
          clip-path: circle(50% at 50% 50%);
          width: 10rem;
          height: 10rem;
          position: absolute;
          margin-left: 5rem;
          margin-top: 0.25rem;
        "
        :style="{ background: designStore.sidebarBacking }"
      ></div>
      <MoonDisplay
        :moonPhase="descriptions[motivation]?.icon || 'gi-uncertainty'"
        style="position: absolute; margin-left: 5rem"
      ></MoonDisplay>
      <div
        style="
          width: 20rem;
          position: absolute;
          margin-top: 4.4rem;
          text-align: center;
          font-size: medium;
          padding: 0.5rem;
        "
        :style="{
          background: designStore.sidebarBacking,
          fontFamily: designStore.font,
          color: designStore.sidebarText
        }"
      >
        <TitleMedallion :title="motivation" :color="designStore.sidebarText"></TitleMedallion>
        <div>{{ descriptions[motivation]?.description }}</div>

        <DropdownSelect
          style="text-align: center; font-size: large; z-index: 5; cursor: pointer; width: 18rem"
          :options="options"
          :default="motivation"
          @selection="(selection) => update(selection)"
        ></DropdownSelect>
      </div>
    </div>
    <div class="mobileMotive" style="cursor: pointer">
      <div
        style="display: flex; flex-direction: column; padding: 1rem"
        :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
      >
        <div style="font-size: large; text-align: center">Lunar Motivation</div>
        <hr :style="{ borderColor: designStore.secondaryTheme }" style="margin-bottom: -0.5rem" />
        <div style="display: flex; justify-content: center">
          <v-icon scale="2" name="wi-moon-waxing-crescent-2" style="align-self: center"></v-icon>
          <v-icon scale="4" :name="descriptions[motivation]?.icon || 'gi-uncertainty'"></v-icon>
          <v-icon scale="2" name="wi-moon-waning-crescent-4" style="align-self: center"></v-icon>
        </div>
        <div style="display: flex; justify-content: center"></div>

        <DropdownSelect
          style="border: 1px solid; font-size: medium; text-align: center; padding: 0.5rem"
          :options="options"
          :default="''"
          @selection="(selection) => update(selection)"
        ></DropdownSelect>
      </div>
    </div>
  </div>
</template>

<style scoped>
.image-box {
  cursor: pointer;
  border: 2px solid;
}
.characterCardTitle {
  background: #422c58;
  color: #dfdfdf;
  padding: 0.5rem;
  width: fit-content;
  border-radius: 10px;
  font-size: 1rem;
  position: absolute;
  left: 1.5rem;
  max-width: 90%;
}
.addIconContain {
  background-color: #dfdfdf;
  display: flex;
  justify-content: center;
  font-size: 12rem;
  color: #ffffff;
}
</style>
