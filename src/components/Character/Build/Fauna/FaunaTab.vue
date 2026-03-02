<script lang="ts">
import TitleWidget from '@/components/TitleWidget.vue'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { ManualSpell, useSpellStore } from '@/stores/spellsStore.ts'
import { BNavbar } from 'bootstrap-vue-next'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import BNavItem from 'bootstrap-vue-next/src/components/BNav/BNavItem.vue'
import { computed, Ref, ref } from 'vue'
import {} from 'vue-router'
import { useDesignStore } from '../../../../stores/designStore.ts'
import AdaptationsTable from './AdaptationsTable.vue'
import CreaturesTable from './CreaturesTable.vue'
import CustomModal from '@/components/CustomModal.vue'
import GridSelect from '@/components/GridSelect.vue'
import BuildCreature, { creature } from './BuildCreature.vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const spellsStore = useSpellStore()
    const navPos = ref('creature')
    function switchTab(tab: string) {
      navPos.value = tab
    }
    function navItemStyle(item: string) {
      if (item === navPos.value) {
        return designStore.getAlertTheme
      }
      return designStore.getInputText
    }
    function shiftMode(newMode) {
      mode.value = newMode
    }
    const buildSelectModal = ref(false)
    const buildMode = ref('')
    function selectBuildType(type: string) {
      buildSelectModal.value = false
      buildMode.value = type
    }

    const options = computed(() => {
      let canTransform = (Object.values(spellsStore.spellgroups['Fauna']?.spells) || []).some(
        (spell: any) => spell.name === 'Transformation'
      )
      return [
        {
          name: 'Tweak Base Creature',
          value: 'base',
          icon: 'gi-wolf-head',
          description: 'Apply adaptations to a known base creature.'
        },
        {
          name: 'Custom Creature',
          icon: 'gi-frankenstein-creature',
          value: 'custom',
          disabled: !canTransform,
          description:
            'Create a completely custom creature using known traits.  This requires the Spell Transformation-3.'
        }
      ]
    })

    const mode = ref('table')
    const selectedCreature: Ref<creature> = ref({
      Name: '',
      Description: '',
      'HP Changes': '',
      Movement: '',
      Attacks: '',
      Traits: [],
      actionCost: '',
      'Armor Changes': '',
      groupIcon: 'gi-uncertainty',
      rank: 1,
      Adaptations: [],
      isCustom: false
    })
    return {
      designStore,
      props,
      switchTab,
      navPos,
      navItemStyle,
      mode,
      shiftMode,
      spellsStore,
      buildSelectModal,
      selectBuildType,
      options,
      buildMode,
      selectedCreature
    }
  },
  methods: {},
  components: {
    TitleWidget,
    BNavbar,
    BNavItem,
    CreaturesTable,
    AdaptationsTable,
    CustomModal,
    GridSelect,
    BButton,
    BuildCreature
  }
}
</script>

<template>
  <div>
    <div v-if="buildMode === ''">
      <BButton
        @click="buildSelectModal = true"
        style="
          border: 2px solid;
          position: absolute;
          right: 2rem;
          font-size: small;
          margin-top: 0.25rem;
        "
        :style="{
          background: designStore.primaryTheme,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme
        }"
        >Add Creature <v-icon name="gi-gooey-daemon"></v-icon
      ></BButton>
      <TitleWidget
        title="Fauna"
        :info-message="'The creatures listed below are all of the animals your character has gained the ability to morph into. Characters gain new Base Creatures by purchasing new spells.  Characters may also modify Base Creatures, or just their own body with adaptations.  With a little metamagic and some adaptations they can modify Base Creatures to appear very different.  Or, for a completely custom experience, characters can learn the rank 3 spell Transformation, in which they can create their own Custom Creatures to tranform into by choosing traits they have learned from their known Base Creatures.'"
      ></TitleWidget>
      <BNavbar
        style="border-left: 0; border-right: 0"
        class="navClass"
        :style="{
          borderColor: designStore.secondaryTheme,
          background: designStore.inputBacking,
          fontFamily: designStore.font
        }"
      >
        <BNavItem
          :style="{ color: navItemStyle('creature'), background: designStore.inputBacking }"
          @click="switchTab('creature')"
          class="textI"
          >Creatures</BNavItem
        >
        <BNavItem
          :style="{ color: navItemStyle('creature'), background: designStore.inputBacking }"
          @click="switchTab('creature')"
          class="navI"
        >
          <v-icon name="gi-polar-bear" scale="1.5"></v-icon>
          <div v-if="navPos === 'creature'">Creatures</div>
        </BNavItem>
        <BNavItem
          :style="{ color: navItemStyle('adapt'), background: designStore.inputBacking }"
          @click="switchTab('adapt')"
          class="textI"
          >Adaptations</BNavItem
        >
        <BNavItem
          :style="{ color: navItemStyle('adapt'), background: designStore.inputBacking }"
          @click="switchTab('adapt')"
          class="navI"
        >
          <v-icon name="gi-tumor" scale="1.5"></v-icon>
          <div v-if="navPos === 'adapt'">Adaptations</div>
        </BNavItem>
      </BNavbar>
      <div v-if="navPos === 'creature'">
        <div
          style="display: flex; justify-content: flex-end; border-bottom: 2px solid"
          :style="{
            background: designStore.pageBackdrop,
            color: designStore.sidebarText,
            borderColor: designStore.secondaryTheme
          }"
        ></div>
        <CreaturesTable v-if="mode === 'table'"></CreaturesTable>
      </div>
      <div v-if="navPos === 'adapt'">
        <AdaptationsTable></AdaptationsTable>
      </div>
      <CustomModal
        :showModal="buildSelectModal"
        title="Select Creature Type"
        @close="buildSelectModal = false"
      >
        <template v-slot:body>
          <GridSelect
            :updateOption="selectBuildType"
            :options="options"
            :selected="''"
          ></GridSelect>
          <p style="text-align: center">
            Note: all of these creatures will create references in the Overview Tab. Its not
            neccesary to build them here, but it can help keep track of common transformations you
            wish to utilize
          </p>
        </template>
      </CustomModal>
    </div>
    <div v-else>
      <BuildCreature
        :mode="buildMode"
        @return="buildMode = ''"
        @added="buildMode = ''"
        :og-creature="selectedCreature"
      ></BuildCreature>
    </div>
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
  border: 2px solid;
  border-left: 0px;
  border-right: 0px;
}
@media (max-width: 500px) {
  .navClass {
    width: 100%;
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
