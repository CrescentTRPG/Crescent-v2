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
import RibbonTitle from '@/components/RibbonTitle.vue'
import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import { computed } from 'vue'
import { useCharacterStore } from '@/stores/characterStore'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import DescriptionHoverDisplay from '@/components/DescriptionHoverDisplay.vue'
import CreatureDisplay from './CreatureDisplay.vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import BFormText from 'bootstrap-vue-next/src/components/BForm/BFormText.vue'

export default {
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualTraits, manualAdaptations, manualCreatures, creatures } = storeToRefs(faunaStore)
    const characterStore = useCharacterStore()
    const baseCreature = ref('')
    const name = ref('')
    const creatureIcon = ref('')
    const adaptation = ref('')
    let arr: Array<string> = []

    const traits = computed(() => {
      let traits: Array<string> = []
      faunaStore.getCreatures.forEach((creature) => (traits = traits.concat(creature.Traits)))
      let t = new Set(traits)
      traits = [...t]
      traits.filter((trait) => trait != 'Deadly')
      return traits
    })
    function getDescription(trait) {
      return faunaStore.manualTraits[trait].description
    }
    function getAdaptationDetails(adaptation) {
      return faunaStore.manualAdaptations[adaptation]
    }
    let traitsArr: Array<any> = []
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
      Description: '',
      'HP Changes': 'None',
      Movement: '50’ Land 25’ Swim',
      Name: '',
      Traits: traitsArr,
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
      baseCreature.value = creatureName

      stagedCreature.value.Attacks = faunaStore.manualCreatures[creatureName].Attacks
      stagedCreature.value.Movement = faunaStore.manualCreatures[creatureName].Movement

      stagedCreature.value.groupIcon = faunaStore.manualCreatures[creatureName].groupIcon
      stagedCreature.value.rank = faunaStore.manualCreatures[creatureName].rank
    }
    function pushAdaptation(adaptation) {
      stagedCreature.value.Adaptations.push(adaptation)
    }
    function removeCreature(index) {
      stagedCreature.value.Adaptations = stagedCreature.value.Adaptations.slice(0, index).concat(
        stagedCreature.value.Adaptations.slice(index + 1, stagedCreature.value.Adaptations.length)
      )
    }
    function removeTraitAtIndex(index) {
      stagedCreature.value.Traits.splice(index)
    }
    function removeAdaptationAtIndex(index) {
      stagedCreature.value.Adaptations.splice(index)
    }
    function startDrag(event, item, index) {
      event.dataTransfer.dropEffect = 'copy'
      event.dataTransfer.effectAllowed = 'copyMove'
      event.dataTransfer.setData('item', item)
      draggedItem.value = item
    }
    function onDrop(event) {
      const item = event.dataTransfer.getData('item')
      let type = ''
      if (manualTraits.value[draggedItem.value]) {
        type = 'trait'
      }
      if (type === 'trait') {
        let traitObj = { name: draggedItem.value, description: getDescription(draggedItem.value) }
        if (stagedCreature.value.Traits.length < 3) {
          stagedCreature.value.Traits.push(draggedItem.value)
        } else {
          alert('You may only pick three Traits')
        }
      } else {
        stagedCreature.value.Adaptations.push(draggedItem.value)
      }
    }
    let draggedItem = ref('')
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
        context.emit('added')
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
      removeCreature,
      traits,
      populate,
      spent,
      characterStore,
      addCreature,
      startDrag,
      manualAdaptations,
      getDescription,
      getAdaptationDetails,
      onDrop,
      removeTraitAtIndex,
      removeAdaptationAtIndex
    }
  },
  components: {
    DescriptionHoverDisplay,
    CreatureDisplay,
    TitleMedallion,
    TitleWidget,
    DropdownSelect,
    BFormInput,
    IconPicker,
    BButton,
    BFormTextarea
  }
}
</script>
<template>
  <div>
    <div>
      <div class="inputItemsContainer">
        <div
          style="flex-grow: 1"
          :style="{ background: designStore.inputBacking, color: designStore.inputText }"
        >
          <div class="nameBaseContainer" :style="{ borderColor: designStore.secondaryTheme }">
            <div
              class="titleLabel"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
            >
              Creature Name
            </div>
            <BFormInput
              style="border: none; border-radius: 0; width: 80%"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              v-model="stagedCreature.Name"
              :options="faunaStore.avaiableCreatureBases"
            ></BFormInput>
          </div>
          <div
            style="
              display: flex;
              border-bottom: 2px solid;
              border-bottom: 2px solid;
              border-right: 2px solid;
            "
            :style="{ borderColor: designStore.secondaryTheme }"
          >
            <div
              class="titleLabel"
              :style="{
                background: designStore.primaryTheme,
                color: designStore.primaryText,
                borderColor: designStore.secondaryTheme
              }"
            >
              Base Creature
            </div>
            <DropdownSelect
              style="border: none; border-radius: 0; min-width: 25%; text-align: center"
              :style="{
                background: designStore.inputBacking,
                color: designStore.inputText,
                borderColor: designStore.secondaryTheme
              }"
              :borderless="true"
              :default="'Select Base Creature'"
              :options="faunaStore.avaiableCreatureBases"
              @selection="(selection) => populate(selection)"
            ></DropdownSelect>
          </div>
        </div>
        <IconPicker
          :style="{ background: designStore.primaryTheme }"
          style="border-radius: 10px; margin: 0.25rem"
          :currentIcon="stagedCreature.groupIcon"
          @selectedIcon="(icon) => (stagedCreature.groupIcon = icon)"
          orientation="bottom"
          :color="designStore.secondaryTheme"
        ></IconPicker>
      </div>
      <BFormTextarea
        style="border: none; border-radius: 0; min-height: 3rem; border-bottom: 2px solid"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme,
          '--bs-secondary-color': designStore.inputText
        }"
        placeholder="Creature Description"
        v-model="stagedCreature.Description"
      ></BFormTextarea>

      <div class="faunaBuilderContainer">
        <div style="display: flex; flex-direction: column; width: 100%">
          <TitleWidget
            title="Creature Preview"
            style="margin-bottom: -0.5rem; margin-top: 0rem"
            :spent="spent"
            :total="characterStore?.attributes?.health"
            units="Adaptive Score"
          ></TitleWidget>
          <CreatureDisplay
            @drop="onDrop($event)"
            @dragenter.prevent
            @dragover.prevent
            :editable="true"
            @deleteTrait="(traitIndex) => removeTraitAtIndex(traitIndex)"
            @deleteAdaptation="(adaptationIndex) => removeAdaptationAtIndex(adaptationIndex)"
            style="padding: 0.5rem"
            :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
            :creature="stagedCreature"
          ></CreatureDisplay>
          <BButton
            style="border: 1px solid; margin: 0.5rem; width: 80%; align-self: center"
            :style="{
              background: designStore.primaryTheme,
              color: designStore.primaryText,
              borderColor: designStore.secondaryTheme
            }"
            @click="addCreature()"
            >Add Custom Creature</BButton
          >
        </div>
        <div
          class="traitsAndAdaptations"
          :style="{
            borderColor: designStore.secondaryTheme,
            scrollbarColor: designStore.secondaryTheme + ' ' + designStore.primaryTheme,
            background: designStore.inputBacking,
            color: designStore.inputText
          }"
        >
          <div class="traitArrange">
            <TitleMedallion title="Traits"></TitleMedallion>
            <div class="columnToRow">
              <div v-for="(trait, index) in traits" :key="index">
                <DescriptionHoverDisplay
                  draggable="true"
                  @dragstart="startDrag($event, trait, index)"
                  :showDots="true"
                  :name="trait"
                  :description="getDescription(trait)"
                ></DescriptionHoverDisplay>
              </div>
            </div>
          </div>
          <div style="display: flex; flex-direction: column">
            <TitleMedallion title="Adaptations"></TitleMedallion>
            <div class="columnToRow">
              <div v-for="(adaptation, index) in faunaStore.getAdaptationsList" :key="index">
                <DescriptionHoverDisplay
                  draggable="true"
                  @dragstart="startDrag($event, adaptation, index)"
                  :showDots="true"
                  :name="adaptation"
                  :description="getAdaptationDetails(adaptation).description"
                ></DescriptionHoverDisplay>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.faunaBuilderContainer {
  display: flex;
}
.titleLabel {
  width: 15rem;
  font-size: large;
  padding: 0.25rem;
  text-align: center;
  border-right: 2px solid;
}
.inputItemsContainer {
  display: flex;
  width: 100%;
}
.nameBaseContainer {
  display: flex;
  border-bottom: 2px solid;
  border-right: 2px solid;
}
.traitArrange {
  display: flex;
  flex-direction: column;
  padding-left: 0.5rem;
  width: 100%;
}
.columnToRow {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.traitsAndAdaptations {
  display: flex;
  flex-direction: column;
  width: 15rem;
  border: 2px solid;
  border-top: 0;
  max-height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden;
  align-items: center;
}
@media (max-width: 600px) {
  .faunaBuilderContainer {
    display: flex;
    flex-direction: column-reverse;
  }
  .traitArrange {
    display: flex;
    flex-direction: column;
    padding-left: 0rem;
    width: min-content;
  }
  .traitsAndAdaptations {
    overflow-y: scroll;
    overflow-x: scroll;
    max-width: 85vw;
    width: 100%;
    flex-direction: row;
  }
  .columnToRow {
    display: flex;
    flex-direction: row;
  }
  .titleLabel {
    font-size: medium;
    width: 10rem;
    padding: 0.25rem;
    text-align: center;
    border-right: 2px solid;
  }
  .nameBaseContainer {
    display: flex;
    border-top: 2px solid;
    border-bottom: 2px solid;

    border-right: 2px solid;
  }
  .inputItemsContainer {
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    flex-direction: column-reverse;
  }
}
</style>
