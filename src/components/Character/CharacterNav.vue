<script lang="ts">
import { useCharacterStore } from '@/stores/characterStore.ts'
import { BNavItem, BNavbar } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDesignStore } from '../../stores/designStore.ts'
import GuideMessage from '../GuideMessage.vue'

export default {
  setup(props, context) {
    const error = ref(null)
    const router = useRouter()
    const designStore = useDesignStore()
    const navPos = ref('build')
    const characterStore = useCharacterStore()
    return { designStore, navPos, characterStore }
  },
  computed: {
    width() {
      return window.innerWidth
    }
  },
  methods: {
    switchTab(tab: string) {
      this.navPos = tab
      this.$emit(tab)
    },

    navItemStyle(item: string) {
      if (item === this.navPos) {
        return this.designStore.getAlertTheme
      }
      return this.designStore.getInputText
    },
    navItemStyleBg(item: string) {
      if (item === this.navPos) {
        return this.designStore.pageBackdrop
      }
      return this.designStore.inputBacking
    }
  },
  components: {
    BNavbar,
    BNavItem,
    GuideMessage
  }
}
</script>

<template>
  <div style="width: 100%">
    <BNavbar
      class="navClass"
      :style="{
        borderColor: designStore.secondaryTheme,
        background: designStore.inputBacking,
        fontFamily: designStore.font
      }"
    >
      <BNavItem
        :style="{ color: navItemStyle('build'), background: designStore.inputBacking }"
        @click="switchTab('build')"
        class="textI"
        >Build</BNavItem
      >
      <BNavItem
        :style="{ color: navItemStyle('build'), background: designStore.inputBacking }"
        @click="switchTab('build')"
        class="navI"
      >
        <i class="bi bi-tools"></i>
        <div v-if="navPos === 'build'">Build</div>
      </BNavItem>
      <GuideMessage
        :step="1"
        style="position: absolute; margin-left: 10%; margin-top: 0rem"
        title="Build Tab"
        orientation="left"
        guideNumber="1"
        message="This is the build tab.  All Permanent character creation and modification is done here."
      ></GuideMessage>
      <BNavItem
        :style="{ color: navItemStyle('overview'), background: designStore.inputBacking }"
        @click="switchTab('overview')"
        class="textI"
        >Overview
        <GuideMessage
          :step="10"
          style="
            position: absolute;
            max-width: 30rem;
            margin-left: 2rem;
            z-index: 50;
            margin-top: -2rem;
          "
          title="Overview Tab"
          orientation="bottom"
          shift="start"
          message="The Overview Tab represents a character's present state. All temporary modification happens here.  This tab also conviently lets you see all your abilities!"
        ></GuideMessage>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('overview'), background: designStore.inputBacking }"
        @click="switchTab('overview')"
        class="navI"
      >
        <i class="bi bi-view-list"></i>
        <div v-if="navPos === 'overview'">Overview</div>
        <GuideMessage
          :step="10"
          style="
            position: absolute;
            max-width: 30rem;
            margin-left: 0rem;
            z-index: 50;
            margin-top: -2rem;
          "
          title="Overview Tab"
          orientation="bottom"
          shift="start"
          message="The Overview Tab represents a character's present state. All temporary modification happens here.  This tab also conviently lets you see all your abilities!"
        ></GuideMessage>
      </BNavItem>

      <BNavItem
        :style="{ color: navItemStyle('details'), background: designStore.inputBacking }"
        @click="switchTab('details')"
        class="textI"
        >Details
        <GuideMessage
          :step="16"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: -2rem;
            margin-left: 5%;
          "
          title="Details Tab"
          orientation="bottom"
          shift="start"
          message="The Details Tab is where you can note your character's personal details, such as name, age, appearance, and backstory."
        ></GuideMessage
      ></BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('details'), background: designStore.inputBacking }"
        @click="switchTab('details')"
        class="navI"
        ><i class="bi bi-person-vcard"></i>
        <div v-if="navPos === 'details'">Details</div>
        <GuideMessage
          :step="16"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: -2rem;
            margin-left: -0.5rem;
          "
          title="Details Tab"
          orientation="bottom"
          shift="start"
          message="The Details Tab is where you can note your character's personal details, such as name, age, appearance, and backstory."
        ></GuideMessage>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('equipment'), background: designStore.inputBacking }"
        @click="switchTab('equipment')"
        class="textI"
        >Equipment
        <GuideMessage
          :step="17"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: -2rem;
            margin-left: 5.5%;
          "
          title="Equipment Tab"
          orientation="bottom"
          shift="start"
          message="The Equipment Tab is where you can manage what gear your character is using as well as all the items and funds at their disposal."
        ></GuideMessage
      ></BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('equipment'), background: designStore.inputBacking }"
        @click="switchTab('equipment')"
        class="navI"
        ><i class="bi bi-backpack4"></i>
        <div v-if="navPos === 'equipment'">Equipment</div>
        <GuideMessage
          :step="17"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: -2rem;
            margin-left: -10rem;
          "
          title="Equipment Tab"
          orientation="bottom"
          shift="center"
          message="The Equipment Tab is where you can manage what gear your character is using as well as all the items and funds at their disposal."
        ></GuideMessage>
      </BNavItem>
      <BNavItem
        v-if="characterStore.adventure?.adventureId || false"
        :style="{ color: navItemStyle('party'), background: designStore.inputBacking }"
        @click="switchTab('party')"
      >
        <i class="bi bi-people"></i>
        <div class="manText" v-if="navPos === 'party'">Party</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('journal'), background: designStore.inputBacking }"
        @click="switchTab('journal')"
      >
        <i class="bi bi-journal"></i
        ><GuideMessage
          :step="21"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: 0rem;
            margin-left: 0%;
            right: 20%;
          "
          title="Journal Tab"
          orientation="bottom"
          shift="end"
          message="This is your Journal Tab. You can make files, organize them into folders and take notes. You also might be able to share your notes if you are in an adventure."
        ></GuideMessage>
        <div class="manText" v-if="navPos === 'journal'">Journal</div>
      </BNavItem>
      <BNavItem
        :style="{ color: navItemStyle('manual'), background: designStore.inputBacking }"
        @click="switchTab('manual')"
      >
        <i class="bi bi-book"></i
        ><GuideMessage
          :step="22"
          style="
            position: absolute;
            max-width: 30rem;
            z-index: 50;
            margin-top: 0rem;
            margin-left: 0%;
            right: 5%;
          "
          title="Manual Tab"
          orientation="bottom"
          shift="end"
          message="This is your Manual Tab. This tab has great reference material including some new player guides, a searchable quick reference, and an ULTRA filterable list of every single ability!"
        ></GuideMessage>
        <div class="manText" v-if="navPos === 'manual'">Manual</div>
      </BNavItem></BNavbar
    >
  </div>
</template>

<style scoped>
li {
  list-style-type: none;
  text-align: center;
  width: 33%;
}
.navClass {
  width: 100%;
  margin-top: 1rem;
  border: 2px solid;
}
@media (max-width: 500px) {
  .navClass {
    width: 100%;
    margin-top: 1rem;
    border: 2px solid;
  }
  .navI {
    padding-bottom: 0.5rem;
  }
  .textI {
    display: none;
  }
}
@media (min-width: 501px) {
  .navI {
    display: none;
  }
  .manText {
    display: none;
  }
}
.manText {
  padding-bottom: 0.5rem;
}
</style>
