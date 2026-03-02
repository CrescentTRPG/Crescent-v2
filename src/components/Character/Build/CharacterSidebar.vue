<script lang="ts">
import { useMartialSkillsStore } from '@/stores/martialSkillsStore.ts'
import { useSkillStore } from '@/stores/skillsStore.ts'
import { useSpellStore } from '@/stores/spellsStore.ts'
import { BNav, BNavItem } from 'bootstrap-vue-next'
import { ComputedRef, computed, onMounted, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'
import GuideMessage from '@/components/GuideMessage.vue'
import { useCharacterStore } from '@/stores/characterStore.ts'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const spellsStore = useSpellStore()
    const skillsStore = useSkillStore()
    const martialSkillsStore = useMartialSkillsStore()
    const characterStore = useCharacterStore()
    const hasFauna: ComputedRef<Boolean> = computed(() => {
      if (spellsStore.spellgroups['Fauna'] != undefined) {
        return true
      }
      return false
    })

    const hasEffigy: ComputedRef<Boolean> = computed(() => {
      if (spellsStore.spellgroups['Effigy'] != undefined) {
        return true
      }
      return false
    })

    const hasPerformance: ComputedRef<Boolean> = computed(() => {
      if (skillsStore.skills['Performance']?.rank >= 1) {
        return true
      }
      return false
    })

    const hasCombatStyles: ComputedRef<Boolean> = computed(() => {
      if (Object.keys(martialSkillsStore.combatStyles).length > 0) {
        return true
      }
      return false
    })

    const navPos = ref('corestats')
    return {
      designStore,
      navPos,
      hasFauna,
      hasEffigy,
      hasPerformance,
      hasCombatStyles,
      characterStore
    }
  },
  methods: {
    navItemStyle(item: string) {
      if (item === this.navPos) {
        return this.designStore.getAlertTheme
      }
      return this.designStore.getSidebarText
    },
    navItemStyleBg(item: string) {
      if (item === this.navPos) {
        return this.designStore.pageBackdrop
      }
      return this.designStore.inputBacking
    },
    switchTab(tab: string) {
      this.navPos = tab
      this.$emit(tab)
    }
  },
  components: {
    BNavItem,
    BNav,
    GuideMessage
  }
}
</script>

<template>
  <div>
    <BNav
      vertical
      class="sidebar"
      :style="{
        background: designStore.sidebarBacking,
        color: designStore.sidebarText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <BNavItem :style="{ color: navItemStyle('corestats') }" @click="switchTab('corestats')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-skills" />
          <span class="textI">Core Stats</span>
        </div>
      </BNavItem>
      <BNavItem :style="{ color: navItemStyle('traits') }" @click="switchTab('traits')">
        <GuideMessage
          v-if="characterStore.newPlayerGuideStep === 5"
          :value="switchTab('traits')"
          :execute="() => switchTab('skills')"
          :step="5"
          style="
            position: absolute;
            max-width: 30rem;
            margin-left: 2rem;
            z-index: 50;
            margin-top: -8rem;
          "
          title="Traits"
          orientation="left"
          shift="start"
          message="Traits are passive bonuses and penalties that define your character.  Most characters will start with just one trait, an exceptional, but talk to your game master about what makes sense in your setting. Traits are commonly used to represent racial bonuses and penalties if your game has those.  This tab is where you can add them"
        ></GuideMessage>
        <div class="vertical">
          <v-icon scale="1.5" name="gi-dna1" />
          <span class="textI">Traits </span>
        </div>
      </BNavItem>

      <BNavItem :style="{ color: navItemStyle('skills') }" @click="switchTab('skills')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-jump-across" />
          <span class="textI">Skills</span>
          <GuideMessage
            :execute="() => switchTab('martialskills')"
            :step="6"
            style="
              position: absolute;
              max-width: 30rem;
              margin-left: 2rem;
              z-index: 50;
              margin-top: -7rem;
            "
            title="Skills"
            orientation="left"
            shift="start"
            message="Skills are basic abilities that everyone can attempt to perform on a basic level.  Anyone may invest ability points in them to improve their skill rank for an improved roll modifier and, depending on the skill, special ability unlocks.  This tab is where you can  put ranks in skills."
          ></GuideMessage>
        </div>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('martialskills') }"
        @click="switchTab('martialskills')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-crossed-swords" />
          <span class="textI">Martial Skills</span>
          <GuideMessage
            :execute="() => switchTab('martialperks')"
            :step="7"
            style="
              position: absolute;
              max-width: 30rem;
              margin-left: 4rem;
              z-index: 50;
              margin-top: -9rem;
            "
            title="Martial Skills"
            orientation="left"
            shift="start"
            message="Anyone can swing a weapon by performing the Weapon Attack general ability, but martial skills represent specialized training.  There are two kinds of martial skills:  Combat Styles and Specializations. Investing ability points in martial skills improves your rank with that skill, making your attacks more powerful and diverse."
          ></GuideMessage>
        </div>
      </BNavItem>

      <BNavItem :style="{ color: navItemStyle('martialperks') }" @click="switchTab('martialperks')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-sword-tie" />
          <span class="textI">Martial Perks</span>
          <GuideMessage
            :execute="() => switchTab('spells')"
            :step="8"
            style="
              position: absolute;
              max-width: 30rem;
              margin-left: 4rem;
              z-index: 50;
              margin-top: -9rem;
            "
            title="Martial Perks"
            orientation="left"
            shift="start"
            message="Martial Perks are combat maneuvers that grant characters new options in combat.  Characters who invest in weapons will likely find these useful to diversify their action economy, though anyone may purchase them!  This tab is where you can select martial perks for your character."
          ></GuideMessage>
        </div>
      </BNavItem>

      <BNavItem :style="{ color: navItemStyle('spells') }" @click="switchTab('spells')">
        <div class="vertical">
          <v-icon scale="1.5" name="gi-comet-spark" />
          <span class="textI">Spells</span>
          <GuideMessage
            :step="9"
            style="
              position: absolute;
              max-width: 30rem;
              margin-left: 2rem;
              z-index: 50;
              margin-top: -7rem;
            "
            title="Spells"
            orientation="left"
            shift="start"
            message="Spells are magical abilities grouped into spellgroups. You can purchase spells here. You can learn more about the different spellgroups and how to cast spells in the manual tab."
          ></GuideMessage>
        </div>
      </BNavItem>

      <BNavItem
        v-if="hasEffigy"
        :style="{ color: navItemStyle('effigy') }"
        @click="switchTab('effigy')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-rock-golem" />
          <span class="textI">Effigy</span>
        </div>
      </BNavItem>
      <BNavItem
        v-if="hasFauna"
        :style="{ color: navItemStyle('fauna') }"
        @click="switchTab('fauna')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-dragon-spiral" />
          <span class="textI">Fauna</span>
        </div>
      </BNavItem>
      <BNavItem
        v-if="hasPerformance"
        :style="{ color: navItemStyle('performance') }"
        @click="switchTab('performance')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-sing" />
          <span class="textI long">Performance</span>
          <span class="textI short">Perform</span>
        </div>
      </BNavItem>
      <BNavItem
        v-if="hasCombatStyles"
        :style="{ color: navItemStyle('martialbuilder') }"
        @click="switchTab('martialbuilder')"
      >
        <div class="vertical">
          <v-icon scale="1.5" name="gi-wide-arrow-dunk" />
          <span class="textI long"> Martial Builder </span>
          <span class="textI short"> Martial Builder </span>
        </div>
      </BNavItem>
    </BNav>
  </div>
</template>

<style scoped>
.giIcon {
  font-size: 2rem;
}
li {
  list-style-type: none;
  text-align: start;
  padding-top: 1rem;
  width: 85%;
}
.vertical {
  display: flex;
  flex-direction: column;
}

.sidebar {
  --bs-nav-link-padding-x: 0;
  --bs-nav-link-padding-y: 0;
  --bs-nav-link-color: color !important;
  --bs-nav-link-hover-color: color !important;
  margin-left: 0;
  max-width: 9rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-right: solid 4px;
  /* box-shadow: inset -2px -3px 10px 2px; */
  display: flex;
  align-items: start;
  flex-direction: column;
  padding-left: 1rem;
  border-left: solid 2px;
}
@media (max-width: 720px) {
  .long {
    display: none;
  }
}
@media (min-width: 721px) {
  .short {
    display: none;
  }
}
@media (max-width: 500px) {
  .textI {
    display: none;
  }
  .sidebar {
    min-width: 4rem;
    height: 100%;
    border-right: solid 2px;
    border-left: solid 2px;
    display: flex;
    align-items: start;
    flex-direction: column;
    padding-left: 1rem;
  }
}
</style>
