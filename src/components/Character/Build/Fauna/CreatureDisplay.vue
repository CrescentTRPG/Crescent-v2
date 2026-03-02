<script lang="ts">
import AbilityDisplayMedallion from '@/components/AbilityDisplayMedallion.vue'
import { useDesignStore } from '@/stores/designStore.ts'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import AdaptationDisplay from './AdaptationDisplay.vue'
import TraitDisplay from './TraitDisplay.vue'
import _ from 'lodash'

import BFormTextarea from 'bootstrap-vue-next/src/components/BFormTextarea/BFormTextarea.vue'
import EffigyBasicStatDisplay from '../../Effigy/EffigyBasicStatDisplay.vue'
import { describe } from 'node:test'
import IconDisplay from '@/components/IconDisplay.vue'
import BButton from 'bootstrap-vue-next/src/components/BButton/BButton.vue'
import FancyDecor from '@/components/FancyDecor.vue'
import CustomModal from '@/components/CustomModal.vue'
import GridSelect from '@/components/GridSelect.vue'

export default {
  props: ['creature', 'editable', 'mode', 'updateCreature'],
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { manualTraits, manualAdaptations, avaiableCreatureBases } = storeToRefs(faunaStore)
    const attributes = computed(() => {
      let ret = ''
      if (props.creature['Attribute Changes']?.strength > 0) {
        ret += props.creature['Attribute Changes'].strength + ' STR, '
      }
      if (props.creature['Attribute Changes']?.health > 0) {
        ret += props.creature['Attribute Changes'].health + ' HEA, '
      }
      if (props.creature['Attribute Changes']?.willpower > 0) {
        ret += props.creature['Attribute Changes'].willpower + ' WIL, '
      }
      if (props.creature['Attribute Changes']?.agility > 0) {
        ret += props.creature['Attribute Changes'].agility + ' AGI, '
      }
      if (props.creature['Attribute Changes']?.intelligence > 0) {
        ret += props.creature['Attribute Changes'].intelligence + ' INT, '
      }
      if (props.creature['Attribute Changes']?.charisma > 0) {
        ret += props.creature['Attribute Changes'].charisma + ' CHA, '
      }
      if (props.creature['Attribute Changes']?.power > 0) {
        ret += props.creature['Attribute Changes'].power + ' PWR, '
      }
      if (props.creature['Attribute Changes']?.perception > 0) {
        ret += props.creature['Attribute Changes'].perception + ' PER, '
      }
      return ret.substring(0, ret.length - 2) || ''
    })

    function updateDescription(val) {
      props.updateCreature({ ..._.cloneDeep(props.creature), Description: val })
    }

    function removeTrait(trait) {
      context.emit('deleteTrait', props.creature.Traits.indexOf(trait))
    }
    function removeAdaptation(trait) {
      context.emit('deleteAdaptation', props.creature.Adaptations.indexOf(trait))
    }
    const landMovement = computed(() => {
      let move = props.creature.Movement || ''
      let land = move.split(',').find((m) => m.includes('Land'))
      if (land) return land
      return false
    })
    const flight = computed(() => {
      let move = props.creature.Movement || ''
      let flight = move.split(',').find((m) => m.includes('Flight') || m.includes('Fly'))
      if (flight) return flight
      return false
    })
    const burrow = computed(() => {
      let move = props.creature.Movement || ''
      let burrow = move.split(',').find((m) => m.includes('Burrow'))
      if (burrow) return burrow
      return false
    })
    const swim = computed(() => {
      let move = props.creature.Movement || ''
      let swim = move.split(',').find((m) => m.includes('Swim'))
      if (swim) return swim
      return false
    })
    const climb = computed(() => {
      let move = props.creature.Movement || ''
      let climb = move.split(',').find((m) => m.includes('Climb'))
      if (climb) return climb
      return false
    })
    const traits = computed(() => {
      let traits: Array<string> = []
      Object.values(faunaStore.manualCreatures)
        .filter((creature) => avaiableCreatureBases.value.includes(creature.Name))
        .forEach((creature) => (traits = traits.concat(creature.Traits)))
      let t = new Set(traits)
      traits = [...t]
      traits.filter((trait) => trait != 'Deadly')
      return traits
    })
    const traitOptions = computed(() => {
      return Object.values(manualTraits.value)
        .map((trait: any) => {
          return {
            name: trait.name,
            value: trait.name,
            icon: trait.icon,
            description: trait.description,
            disabled: !traits.value.includes(trait.name)
          }
        })
        .sort((a, b) => {
          if (props.creature.Traits.includes(a.name) && props.creature.Traits.includes(b.name))
            return a.name.localeCompare(b.name)
          else if (props.creature.Traits.includes(b.name)) return 1
          else if (props.creature.Traits.includes(a.name)) return -1
          else if (traits.value.includes(b.name) && traits.value.includes(a.name))
            return a.name.localeCompare(b.name)
          else if (!traits.value.includes(b.name) && !traits.value.includes(a.name))
            return a.name.localeCompare(b.name)
          else if (traits.value.includes(a.name)) {
            return -1
          } else if (traits.value.includes(b.name)) {
            return 1
          }
          return 0
        })
        .filter((trait) => trait.name != 'Deadly')
    })
    const adaptationOptions = computed(() => {
      return Object.values(manualAdaptations.value)
        .map((adaptation: any) => {
          return {
            name: adaptation.name + '(' + adaptation.adaptiveScore + ')',
            value: adaptation.name,
            icon: adaptation.icon,
            description: adaptation.description
          }
        })
        .sort((a, b) => {
          if (
            props.creature.Adaptations?.includes(a.name) &&
            props.creature.Adaptations?.includes(b.name)
          )
            return a.name.localeCompare(b.name)
          else if (props.creature.Adaptations?.includes(b.name)) return 1
          else if (props.creature.Adaptations?.includes(a.name)) return -1
          else return a.name.localeCompare(b.name)
        })
    })
    function editTraits(traitName) {
      let newTraits = _.cloneDeep(props.creature.Traits)
      if (newTraits.includes(traitName)) {
        newTraits = newTraits.filter((t) => t != traitName)
      } else {
        newTraits.push(traitName)
      }
      props.updateCreature({ ..._.cloneDeep(props.creature), Traits: newTraits })
    }

    function editAdaptations(adaptationName) {
      let newAdaptations = _.cloneDeep(props.creature.Adaptations) || []
      if (newAdaptations.includes(adaptationName)) {
        newAdaptations = newAdaptations.filter((t) => t != adaptationName)
      } else {
        newAdaptations.push(adaptationName)
      }
      props.updateCreature({ ..._.cloneDeep(props.creature), Adaptations: newAdaptations })
    }

    const adaptiveScoreCurrent = computed(() => {
      let score = 0
      props.creature.Adaptations?.forEach((adaptation) => {
        score += manualAdaptations.value[adaptation]?.adaptiveScore || 0
      })
      return score
    })
    const descriptionTemp = ref(props.creature.Description)
    const editTraitsModal = ref(false)
    const editAdaptationsModal = ref(false)
    return {
      manualTraits,
      designStore,
      props,
      attributes,
      removeTrait,
      removeAdaptation,
      updateDescription,
      landMovement,
      flight,
      burrow,
      swim,
      climb,
      traitOptions,
      editTraits,
      editTraitsModal,
      editAdaptationsModal,
      adaptationOptions,
      faunaStore,
      editAdaptations,
      adaptiveScoreCurrent,
      descriptionTemp
    }
  },
  components: {
    AbilityDisplayMedallion,
    TraitDisplay,
    AdaptationDisplay,
    BFormTextarea,
    BButton,
    CustomModal,
    GridSelect
  }
}
</script>
<template>
  <div>
    <div class="displayContainer">
      <div v-if="creature.Attacks">
        <div class="ItemsContainer" :style="{ color: designStore.primaryTheme }">
          <div
            style="position: relative; right: 2.25rem; bottom: 2.25rem"
            class="disappearingMobileItems"
          >
            <v-icon
              style="position: absolute"
              name="gi-punch"
              scale="6.25"
              :style="{ color: designStore.secondaryTheme }"
            ></v-icon>
            <v-icon
              style="position: absolute"
              name="gi-punch"
              scale="6"
              :style="{ color: designStore.primaryTheme }"
            ></v-icon>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ creature.Attacks }}
          </div>
          <div
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
            class="disappearingMobileItems"
          >
            Attacks
          </div>
        </div>
      </div>
      <div v-if="creature['HP Changes'] != 'None' && creature['HP Changes'] != ''">
        <div
          style="height: 4.5rem; margin: 0.5rem"
          class="ItemsContainer"
          :style="{ color: designStore.primaryTheme }"
        >
          <div
            style="position: relative; right: 0.5rem; bottom: 1.75rem"
            class="disappearingMobileItems"
          >
            <i
              style="position: absolute; font-size: 5.25rem"
              class="bi bi-heart-fill"
              :style="{ color: designStore.secondaryTheme }"
            ></i>
            <i
              style="position: absolute; font-size: 5rem; margin-left: 0.1rem; margin-top: 0.1rem"
              class="bi bi-heart-fill"
              :style="{ color: designStore.primaryTheme }"
            ></i>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ creature['HP Changes'] + ' HP' }}
          </div>
          <div
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
            class="disappearingMobileItems"
          >
            Hp Changes
          </div>
        </div>
      </div>
      <div v-if="creature['Armor Changes'] != 'None' && creature['Armor Changes'] != ''">
        <div
          style="height: 4.5rem; margin: 0.5rem"
          class="ItemsContainer"
          :style="{ color: designStore.primaryTheme }"
        >
          <div
            style="position: relative; right: 0.5rem; bottom: 2rem"
            class="disappearingMobileItems"
          >
            <v-icon
              style="position: absolute; transform: scalex(1.25)"
              name="gi-shield"
              scale="5.5"
              :style="{ color: designStore.secondaryTheme }"
            ></v-icon>
            <v-icon
              style="
                position: absolute;
                transform: scalex(1.25);
                margin-left: 0.25rem;
                margin-top: 0.25rem;
              "
              name="gi-shield"
              scale="5"
              :style="{ color: designStore.primaryTheme }"
            ></v-icon>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ creature['Armor Changes'] + ' Dvs' }}
          </div>
          <div
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
            class="disappearingMobileItems"
          >
            Armor Changes
          </div>
        </div>
      </div>
      <div v-if="landMovement">
        <div class="ItemsContainer" :style="{ color: designStore.primaryTheme }">
          <div
            style="position: relative; right: 1.5rem; bottom: 2rem"
            class="disappearingMobileItems"
          >
            <v-icon
              style="position: absolute; transform: scalex(1.25)"
              name="gi-sprint"
              scale="5.5"
              :style="{ color: designStore.secondaryTheme }"
            ></v-icon>
            <v-icon
              style="
                position: absolute;
                transform: scalex(1.25);
                margin-left: 0.25rem;
                margin-top: 0.25rem;
              "
              name="gi-sprint"
              scale="5"
              :style="{ color: designStore.primaryTheme }"
            ></v-icon>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ landMovement }}
          </div>
          <div
            class="disappearingMobileItems"
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
          >
            Land Speed
          </div>
        </div>
      </div>
      <div v-if="flight">
        <div class="ItemsContainer" :style="{ color: designStore.primaryTheme }">
          <div
            style="position: relative; right: 0.9rem; bottom: 2rem"
            class="disappearingMobileItems"
          >
            <v-icon
              style="position: absolute; transform: scalex(1.25)"
              name="gi-angel-wings"
              scale="5.5"
              :style="{ color: designStore.secondaryTheme }"
            ></v-icon>
            <v-icon
              style="
                position: absolute;
                transform: scalex(1.25);
                margin-left: 0.25rem;
                margin-top: 0.25rem;
              "
              name="gi-angel-wings"
              scale="5"
              :style="{ color: designStore.primaryTheme }"
            ></v-icon>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ flight }}
          </div>
          <div
            class="disappearingMobileItems"
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
          >
            Flight Speed
          </div>
        </div>
      </div>
      <div v-if="burrow">
        <div class="ItemsContainer" :style="{ color: designStore.primaryTheme }">
          <div
            style="position: relative; right: 0.9rem; bottom: 2.75rem"
            class="disappearingMobileItems"
          >
            <v-icon
              style="position: absolute"
              name="gi-dig-hole"
              scale="6.5"
              :style="{ color: designStore.secondaryTheme }"
            ></v-icon>
            <v-icon
              style="position: absolute; margin-left: 0.25rem; margin-top: 0.25rem"
              name="gi-dig-hole"
              scale="6"
              :style="{ color: designStore.primaryTheme }"
            ></v-icon>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ burrow }}
          </div>
          <div
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
            class="disappearingMobileItems"
          >
            Burrow Speed
          </div>
        </div>
      </div>
      <div v-if="swim">
        <div class="ItemsContainer" :style="{ color: designStore.primaryTheme }">
          <div
            style="position: relative; right: 0.9rem; bottom: 2.25rem"
            class="disappearingMobileItems"
          >
            <v-icon
              style="position: absolute"
              name="gi-whale-tail"
              scale="5.5"
              :style="{ color: designStore.secondaryTheme }"
            ></v-icon>
            <v-icon
              style="position: absolute; margin-left: 0.25rem; margin-top: 0.25rem"
              name="gi-whale-tail"
              scale="5"
              :style="{ color: designStore.primaryTheme }"
            ></v-icon>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ swim }}
          </div>
          <div
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
            class="disappearingMobileItems"
          >
            Swim Speed
          </div>
        </div>
      </div>

      <div v-if="attributes">
        <div class="ItemsContainer" :style="{ color: designStore.primaryTheme }">
          <div
            style="position: relative; right: 0.9rem; bottom: 2.25rem"
            class="disappearingMobileItems"
          >
            <v-icon
              style="position: absolute"
              name="gi-skills"
              scale="5.5"
              :style="{ color: designStore.secondaryTheme }"
            ></v-icon>
            <v-icon
              style="position: absolute; margin-left: 0.25rem; margin-top: 0.25rem"
              name="gi-skills"
              scale="5"
              :style="{ color: designStore.primaryTheme }"
            ></v-icon>
          </div>

          <div
            style="
              font-size: small;
              z-index: 3;
              text-align: center;
              padding: 0.5rem;
              border-radius: 0.5rem;
            "
            :style="{
              color: designStore.inputText,
              background: designStore.inputBacking,
              border: '2px solid ' + designStore.secondaryTheme
            }"
          >
            {{ attributes }}
          </div>
          <div
            style="font-size: small; z-index: 3; text-align: center; padding-top: 1.5rem"
            :style="{ color: designStore.primaryText }"
            class="disappearingMobileItems"
          >
            Attribute Mod
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="props.editable || props.creature.Description"
      :style="{ fontFamily: designStore.titleFont }"
      style="font-size: large"
    >
      Description
    </div>
    <hr
      v-if="props.editable || props.creature.Description"
      :style="{ color: designStore.secondaryTheme }"
      style="margin-top: 0.25rem; margin-bottom: 0rem"
    />
    <div v-if="props.editable" style="margin-bottom: 1rem">
      <BFormTextarea
        v-model="descriptionTemp"
        @change="updateDescription(descriptionTemp)"
        placeholder="a foul beast..."
        style="margin-bottom: 0.5rem"
        :style="{
          background: designStore.inputBacking,
          color: designStore.inputText,
          borderColor: designStore.secondaryTheme
        }"
      />
    </div>
    <div v-else style="margin: 0.5rem; margin-top: 0rem">{{ creature.Description }}</div>
    <div v-if="props.editable || props.creature.Traits.length > 0">
      <div style="display: flex; justify-content: space-between">
        <div :style="{ fontFamily: designStore.titleFont }" style="font-size: large">Traits</div>
        <div style="display: flex">
          <div v-if="mode === 'custom'">Traits: {{ creature.Traits.length }} / 3</div>

          <BButton v-if="props.editable && props.mode === 'custom'" @click="editTraitsModal = true">
            <i class="bi bi-pen-fill"></i
          ></BButton>
        </div>
      </div>
      <hr
        :style="{ color: designStore.secondaryTheme }"
        style="margin-top: 0.25rem; margin-bottom: 0rem"
      />

      <div style="margin-bottom: 1rem">
        <div v-for="(trait, index) in creature.Traits" :key="trait">
          <TraitDisplay
            @delete="(item) => removeTrait(item)"
            :editable="props.editable && props.mode != 'base'"
            :trait="trait"
            :index="index"
          ></TraitDisplay>
        </div>
      </div>
    </div>
    <div
      v-if="props.creature.Adaptations && (props.editable || props.creature.Adaptations.length > 0)"
      style="margin-bottom: 1rem"
    >
      <div style="display: flex; justify-content: space-between">
        <div :style="{ fontFamily: designStore.titleFont }" style="font-size: large">
          Adaptations
        </div>
        <div style="display: flex">
          <div>Adaptive Score: {{ adaptiveScoreCurrent }} / {{ faunaStore.adaptiveScore }}</div>
          <BButton v-if="props.editable" @click="editAdaptationsModal = true"
            ><i class="bi bi-pen-fill"></i
          ></BButton>
        </div>
      </div>
      <hr
        :style="{ color: designStore.secondaryTheme }"
        style="margin-top: 0.25rem; margin-bottom: 0rem"
      />
    </div>
    <div v-for="adaptation in creature.Adaptations" :key="adaptation">
      <AdaptationDisplay
        @delete="(item) => removeAdaptation(item)"
        :editable="props.editable"
        :adaptation="adaptation"
      ></AdaptationDisplay>
    </div>
    <AbilityDisplayMedallion :medallion="creature.groupIcon"></AbilityDisplayMedallion>
    <CustomModal :showModal="editTraitsModal" title="Edit Traits" @close="editTraitsModal = false">
      <template v-slot:body>
        <GridSelect
          textWrap="balance"
          :updateOption="editTraits"
          :options="traitOptions"
          :selected="creature.Traits"
          :multiSelect="true"
        ></GridSelect>
      </template>
      <template v-slot:footer>
        <div style="font-size: large; margin-left: 2rem">
          Number of Selected Traits: {{ creature.Traits.length }} / 3
        </div>
      </template>
    </CustomModal>
    <CustomModal
      :showModal="editAdaptationsModal"
      title="Edit Adaptations"
      @close="editAdaptationsModal = false"
    >
      <template v-slot:body>
        <GridSelect
          textWrap="balance"
          :updateOption="editAdaptations"
          :options="adaptationOptions"
          :selected="creature.Adaptations"
          :multiSelect="true"
        ></GridSelect>
      </template>
      <template v-slot:footer>
        <div style="font-size: large; margin-left: 2rem">
          Adaptive Score: {{ adaptiveScoreCurrent }}/{{ faunaStore.adaptiveScore }}
        </div>
      </template>
    </CustomModal>
  </div>
</template>
<style scoped>
.itemsInList {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  border: 2px solid;
  padding: 0.25rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
}
.ItemsContainer {
  z-index: 2;
  margin: 0.5rem;
  padding-top: 1rem;
  height: 4.5rem;
  padding-right: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.displayContainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: end;
  padding-top: 0.5rem;
}
@media (max-width: 600px) {
  .displayContainer {
    padding-top: 0;
  }
  .ItemsContainer {
    z-index: 2;
    margin: 0.25rem;
    padding-top: 0rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 3rem;
  }
  .disappearingMobileItems {
    display: none;
  }
}
</style>
