<script lang="ts">
import { useDesignStore } from '@/stores/designStore.ts'

import { ref } from 'vue'

import CustomModal from '@/components/CustomModal.vue'
import GridSelect from '@/components/GridSelect.vue'
import _ from 'lodash'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFaunaStore } from '@/stores/faunaStore.ts'
import IconDisplay from '@/components/IconDisplay.vue'

export default {
  props: ['base', 'updateCreature', 'mode'],
  emits: ['baseSelected'],
  setup(props, context) {
    const designStore = useDesignStore()
    const faunaStore = useFaunaStore()
    const { avaiableCreatureBases } = storeToRefs(faunaStore)
    const typeModal = ref(false)

    function getTypeColor(type) {
      if (type === props.base.effigyType) {
        return designStore.alertTheme
      }
      return designStore.secondaryTheme
    }
    function getTypeBoxShadow(type) {
      if (type === props.base.effigyType) {
        return '0px 0px 10px 3px ' + designStore.alertTheme
      }
      return 'none'
    }
    function updateBaseCreature(creatureName) {
      context.emit('baseSelected', creatureName)
      if (props.mode === 'base')
        props.updateCreature({
          ..._.cloneDeep(props.base),
          Attacks: faunaStore.manualCreatures[creatureName].Attacks,
          Movement: faunaStore.manualCreatures[creatureName].Movement,
          'Attribute Changes': faunaStore.manualCreatures[creatureName]['Attribute Changes'],
          'HP Changes': faunaStore.manualCreatures[creatureName]['HP Changes'],
          'Armor Changes': faunaStore.manualCreatures[creatureName]['Armor Changes'],
          Traits: faunaStore.manualCreatures[creatureName].Traits,
          groupIcon: faunaStore.manualCreatures[creatureName].groupIcon,
          rank: faunaStore.manualCreatures[creatureName].rank,
          baseCreature: creatureName,
          baseCreatureIcon: faunaStore.manualCreatures[creatureName].groupIcon
        })
      if (props.mode === 'custom')
        props.updateCreature({
          ..._.cloneDeep(props.base),
          Attacks: faunaStore.manualCreatures[creatureName].Attacks,
          Movement: faunaStore.manualCreatures[creatureName].Movement,
          groupIcon: faunaStore.manualCreatures[creatureName].groupIcon,
          rank: faunaStore.manualCreatures[creatureName].rank,
          baseCreature: creatureName,
          baseCreatureIcon: faunaStore.manualCreatures[creatureName].groupIcon
        })
    }
    const options = computed(() => {
      return [
        {
          name: 'Bear',
          value: 'Bear',
          icon: 'gi-polar-bear',
          disabled: !avaiableCreatureBases.value.includes('Bear'),

          description: 'A viscous and hardy creature'
        },
        {
          name: 'Wolf',
          value: 'Wolf',
          icon: 'gi-wolf-howl',
          disabled: !avaiableCreatureBases.value.includes('Wolf'),

          description: 'An agile creature with excellent senses'
        },
        {
          name: 'Great Raven',
          icon: 'gi-raven',
          value: 'Great Raven',
          disabled: !avaiableCreatureBases.value.includes('Great Raven'),

          description: 'A perceptive and elusive creature which can dash at great speeds.'
        },
        {
          name: 'Great Butterfly',
          icon: 'gi-butterfly',
          value: 'Great Butterfly',
          disabled: !avaiableCreatureBases.value.includes('Great Butterfly'),

          description: 'A graceful and inherently magical creature.'
        },
        {
          name: 'Dire Bear',
          value: 'Dire Bear',
          icon: 'gi-polar-bear',
          disabled: !avaiableCreatureBases.value.includes('Dire Bear'),

          description: 'A powerful thick-coated creature with an inspiring roar'
        },
        {
          name: 'Dire Wolf',
          value: 'Dire Wolf',
          icon: 'gi-wolf-howl',
          disabled: !avaiableCreatureBases.value.includes('Dire Wolf'),

          description: 'A cunning predator with keen senses and a deafening shriek'
        },
        {
          name: 'Eruraven',
          icon: 'gi-raven',
          value: 'Eruraven',
          disabled: !avaiableCreatureBases.value.includes('Eruraven'),

          description: 'A three eyed erudite creature with a connection to time and space'
        },
        {
          name: 'Mawfly',
          icon: 'gi-butterfly',
          value: 'Mawfly',
          disabled: !avaiableCreatureBases.value.includes('Mawfly'),

          description: 'Emissaries of the primal aspect of death, mawflies directly attack the soul'
        },
        {
          name: 'Earthenbear',
          value: 'Earthenbear',
          icon: 'gi-polar-bear',
          disabled: !avaiableCreatureBases.value.includes('Earthenbear'),

          description: 'A powerful thick-coated creature with an inspiring roar'
        },
        {
          name: 'Leechwolf',
          value: 'Leechwolf',
          icon: 'gi-wolf-howl',
          disabled: !avaiableCreatureBases.value.includes('Leechwolf'),

          description: 'Supernatural predator whose stikes drain lifework back into itself'
        },
        {
          name: 'Roc',
          icon: 'gi-raven',
          value: 'Roc',
          disabled: !avaiableCreatureBases.value.includes('Roc'),

          description:
            'Collasal birds and eerie birds.  Their massive wings cast shadows over entire villages and their breath lays them to ruin.'
        },
        {
          name: 'Solar Starfly',
          icon: 'gi-butterfly',
          value: 'Solar Starfly',
          disabled: !avaiableCreatureBases.value.includes('Solar Starfly'),

          description:
            'Enigmatic beings of divine light, their warmth empowers allies and sears foes'
        },
        {
          name: 'Elemental Bear',
          value: 'Elemental Bear',
          icon: 'gi-polar-bear',
          disabled: !avaiableCreatureBases.value.includes('Elemental Bear'),

          description: 'A monolith of unsurmountable elemental fury'
        },
        {
          name: 'Duskhunter',
          value: 'Duskhunter',
          icon: 'gi-wolf-howl',
          disabled: !avaiableCreatureBases.value.includes('Duskhunter'),

          description:
            'Horrific monsters whose presence is undetectable, save for the prickling feeling running down your spine.  The duskhunter is the ultimate predator.'
        },
        {
          name: 'Astral Wanderer',
          icon: 'gi-butterfly',
          value: 'Astral Wanderer',
          disabled: !avaiableCreatureBases.value.includes('Astral Wanderer'),
          description:
            'Mangnanamous celestial being that bend space and time around them.  Their magic knows no bounds.'
        },
        {
          name: 'Strygarii',
          icon: 'gi-raven',
          value: 'Strygarii',
          disabled: !avaiableCreatureBases.value.includes('Strygarii'),
          description:
            'Unnerving birds with long twisted beaks and a feather coat of undulating nightmares. The dead call to those in their wake.'
        }
      ]
    })

    return {
      designStore,
      typeModal,
      getTypeColor,
      updateBaseCreature,
      getTypeBoxShadow,
      options,
      props
    }
  },
  components: {
    // BFormInput,
    // IconPicker,
    // BButton,
    // BFormTextarea,
    CustomModal,
    GridSelect,
    IconDisplay
  }
}
</script>
<template>
  <div
    id="BaseCreatureType"
    @click="typeModal = true"
    class="hoverablePrimary"
    style="
      display: flex;
      flex-direction: column;
      cursor: pointer;
      margin: 0.5rem;
      border-radius: 0.5rem;
    "
    :style="{ background: designStore.primaryTheme, color: designStore.primaryText }"
  >
    <div style="text-align: center; padding-right: 0.5rem; padding-left: 0.5rem">Base Creature</div>
    <div style="justify-content: center; align-items: center; display: flex">
      <IconDisplay
        :icon="props.base.baseCreatureIcon"
        :scale="3"
        :size="'3rem'"
        :color="designStore.primaryText"
      ></IconDisplay>
    </div>
    <div style="justify-content: center; align-items: center; display: flex; font-size: small">
      <div style="margin-top: -0.25rem; padding-left: 0.25rem; padding-right: 0.25rem">
        {{ props.base.baseCreature || 'None' }}
      </div>
    </div>
    <CustomModal :showModal="typeModal" title="Edit Base Creature" @close="typeModal = false">
      <template v-slot:body>
        <GridSelect
          :options="options"
          :selected="''"
          :updateOption="updateBaseCreature"
        ></GridSelect>
      </template>
    </CustomModal>
  </div>
</template>
<style></style>
