<script lang="ts">
import { useDesignStore } from '@/stores/designStore'
import { useFaunaStore } from '@/stores/faunaStore'
import { storeToRefs } from 'pinia'
import CreatureBuilderTabs from './CreatureBuilderTabs.vue'
import TitleWidget from '@/components/TitleWidget.vue'
import TitleMedallion from '@/components/TitleMedallion.vue'
import SearchableDropdown from '@/components/SearchableDropdown.vue'
import BFormSelect from 'bootstrap-vue-next/src/components/BFormSelect/BFormSelect.vue'
import BInputGroupText from 'bootstrap-vue-next/src/components/BInputGroup/BInputGroupText.vue'
import { ref } from 'vue'
import BFormInput from 'bootstrap-vue-next/src/components/BFormInput/BFormInput.vue'
import IconPicker from '@/components/IconPicker.vue'
import CreatureDisplay from './CreatureDisplay.vue'
import RibbonTitle from '@/components/RibbonTitle.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import { computed } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'

export default {
  setup() {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualTraits, manualAdaptations, manualCreatures, creatures } = storeToRefs(faunaStore)
    const characterStore = useCharacterStore()
    const baseCreature = ref('')
    const name = ref('')
    const creatureIcon = ref('')
    const adaptation = ref('')
    let arr: Array<string> = []

    const stagedCreature = ref({
      rank: 1,
      actionCost: 'Swift Action',
      isCustom: true,
      'Armor Changes': 'None',
      Attacks: 'None',
      'Attribute Changes': {
        agility: 0,
        charisma: 0,
        health: 0,
        intelligence: 0,
        perception: 0,
        power: 0,
        strength: 0,
        willpower: 0
      },
      Description: 'This creature is....',
      'HP Changes': 'None',
      Movement: '50’ Land 25’ Swim',
      Name: '',
      Traits: [],
      Adaptations: arr,
      groupIcon: 'gi-uncertainty'
    })
    const spent = computed(() => {
      let ret = 0
      stagedCreature.value.Adaptations.forEach((adaptation) => {
        ret += parseInt(manualAdaptations.value[adaptation].adaptiveScore + '')
      })
      return ret
    })
    function populate(creatureName) {
      stagedCreature.value['Attribute Changes'] =
        faunaStore.manualCreatures[creatureName]['Attribute Changes']
      stagedCreature.value.Attacks = faunaStore.manualCreatures[creatureName].Attacks
      stagedCreature.value.Movement = faunaStore.manualCreatures[creatureName].Movement
      stagedCreature.value['Attribute Changes'] =
        faunaStore.manualCreatures[creatureName]['Attribute Changes']
      stagedCreature.value['Armor Changes'] =
        faunaStore.manualCreatures[creatureName]['Armor Changes']
      stagedCreature.value['HP Changes'] = faunaStore.manualCreatures[creatureName]['HP Changes']
      stagedCreature.value.Traits = faunaStore.manualCreatures[creatureName].Traits
      stagedCreature.value.groupIcon = faunaStore.manualCreatures[creatureName].groupIcon
      stagedCreature.value.rank = faunaStore.manualCreatures[creatureName].rank
    }
    function pushAdaptation(adaptation) {
      stagedCreature.value.Adaptations.push(adaptation)
    }
    function removeItem(index) {
      stagedCreature.value.Adaptations = stagedCreature.value.Adaptations.slice(0, index).concat(
        stagedCreature.value.Adaptations.slice(index + 1, stagedCreature.value.Adaptations.length)
      )
    }
    function addCreature() {
      if (
        stagedCreature.value.Name === '' ||
        manualCreatures.value[stagedCreature.value.Name] ||
        creatures.value[stagedCreature.value.Name]
      ) {
        alert('Creature needs a unique Name!')
      } else if (baseCreature.value == '') {
        alert('Creature needs a base!')
      } else {
        faunaStore.addCreature(stagedCreature.value)
        alert('Creature added to Creatures Table!')
      }
    }

    return {
      designStore,
      faunaStore,
      baseCreature,
      name,
      creatureIcon,
      adaptation,
      stagedCreature,
      pushAdaptation,
      removeItem,
      populate,
      spent,
      characterStore,
      addCreature
    }
  },
  components: {
    TitleWidget,
    BFormSelect,
    BInputGroupText,
    BFormInput,
    IconPicker,
    SearchableDropdown,
    CreatureDisplay,
    RibbonTitle,
    BFormTextarea,
    BButton
  }
}
</script>
<template>
  <div
    style="display: flex; justify-content: end; width: 100%"
    :style="{ background: designStore.inputBacking, color: designStore.inputText }"
  >
    <div style="width: 100%">
      <RibbonTitle
        style="margin-top: 0.25rem"
        title="Tweak Exisiting Creature"
        :background="designStore.primaryTheme"
        :textColor="designStore.primaryText"
      ></RibbonTitle>
      <div
        style="display: flex; border-top: 2px solid; border-bottom: 2px solid"
        :style="{
          background: designStore.inputBacking,
          color: designStore.primaryText,
          borderColor: designStore.secondaryTheme,
          fontFamily: designStore.titleFont
        }"
      >
        <BInputGroupText
          style="
            text-align: center;
            border: 0;
            font-size: large;
            border-right: 2px solid;
            border-radius: 0;
          "
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          >Name</BInputGroupText
        >
        <BFormInput
          style="border: none; border-radius: 0"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          v-model="stagedCreature.Name"
          :options="faunaStore.avaiableCreatureBases"
        ></BFormInput>
        <IconPicker
          :style="{ background: designStore.primaryTheme }"
          style="align-self: center; border-radius: 10px; margin: 0.25rem"
          :currentIcon="stagedCreature.groupIcon"
          @selectedIcon="(icon) => (creatureIcon = icon)"
          orientation="bottom"
          :color="designStore.secondaryTheme"
        ></IconPicker>
      </div>
      <div style="display: flex">
        <BInputGroupText
          style="
            text-align: center;
            border: 0;
            border-right: 2px solid;
            border-radius: 0;
            border-bottom: 2px solid;
          "
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          >Description</BInputGroupText
        >
        <BFormTextarea
          style="border: none; border-radius: 0; min-height: 3rem; border-bottom: 2px solid"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          placeholder="Select Creature"
          v-model="stagedCreature.Description"
        ></BFormTextarea>
      </div>
      <div style="display: flex">
        <BInputGroupText
          style="text-align: center; border: 0; border-right: 2px solid; border-radius: 0"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          >Base Creature</BInputGroupText
        >
        <BFormSelect
          style="border: none; border-radius: 0"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          placeholder="Select Creature"
          v-model="baseCreature"
          :options="faunaStore.avaiableCreatureBases"
          @change="populate(baseCreature)"
        ></BFormSelect>
      </div>
      <div style="display: flex">
        <BInputGroupText
          style="text-align: center; border: 0; border: 1px solid; border-left: 0; border-radius: 0"
          :style="{
            background: designStore.inputBacking,
            color: designStore.inputText,
            borderColor: designStore.secondaryTheme
          }"
          >Add Adaptation</BInputGroupText
        >
        <SearchableDropdown
          :options="faunaStore.getAdaptationsList"
          :borders="'none'"
          :search-s="adaptation"
          @select="(selection) => pushAdaptation(selection)"
        ></SearchableDropdown>
      </div>
      <div style="display: flex">
        <div
          @click="removeItem(index)"
          v-for="(adaptation, index) in stagedCreature.Adaptations"
          :key="index"
          style="padding: 0.5rem; margin: 0.5rem; border: 1px solid; border-radius: 0.375rem"
          :style="{ borderColor: designStore.secondaryTheme }"
        >
          <i class="bi bi-x-lg"></i> {{ adaptation }} ({{
            faunaStore.manualAdaptations[adaptation].adaptiveScore
          }})
        </div>
      </div>
    </div>
  </div>
  <TitleWidget
    title="Creature Preview"
    style="margin-bottom: -0.5rem; margin-top: 0rem"
    :spent="spent"
    :total="characterStore?.attributes?.health"
    units="Adaptive Score"
  ></TitleWidget>
  <CreatureDisplay
    style="padding: 0.5rem"
    :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
    :creature="stagedCreature"
  ></CreatureDisplay>
  <BButton
    style="border: 1px solid; margin: 0.25rem; position: absolute; right: 0.5rem"
    :style="{
      background: designStore.primaryTheme,
      color: designStore.primaryText,
      borderColor: designStore.secondaryTheme
    }"
    @click="addCreature()"
    >Add Creature</BButton
  >
</template>
<style></style>
