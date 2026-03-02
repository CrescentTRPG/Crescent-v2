<script lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'

import TitleWidget from '@/components/TitleWidget.vue'
import CharacterDetail from './CharacterDetail.vue'
export interface Details {
  age: string
  weight: string
  hairColor: string
  eyeColor: string
  height: string
  background: string
  strengths: string
  goal: string
  weaknesses: string
  shorthandDescriptors: string
}

export default {
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const file = ref()
    const localImg = ref('')
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const story = ref('')
    function update(value, property) {
      let newObj = coreTraits.value
      newObj[property] = value
      characterStore.setDetails(newObj)
    }
    const coreTraits: ComputedRef<Details> = computed(() => {
      let obj = {
        age: characterStore.details.age,
        weight: characterStore.details.weight,
        hairColor: characterStore.details.hairColor,
        eyeColor: characterStore.details.eyeColor,
        height: characterStore.details.height,
        background: characterStore.details.background,
        strengths: characterStore.details.strengths,
        goal: characterStore.details.goal,
        weaknesses: characterStore.details.weaknesses,
        shorthandDescriptors: characterStore.details.shorthandDescriptors
      }
      return obj
    })

    return {
      update,
      coreTraits,
      designStore,
      modal,
      userStore,
      characterStore,
      file,
      story,
      localImg
    }
  },
  computed: {
    scrollbarColor() {
      return this.designStore.secondaryTheme + ' ' + this.designStore.primaryTheme
    }
  },
  components: { TitleWidget, CharacterDetail }
}
</script>

<template>
  <div style="flex-grow: 1">
    <TitleWidget title="Core Traits"></TitleWidget>
    <div class="coreTraits">
      <CharacterDetail
        :value="coreTraits.age"
        title="Age"
        @update="(value) => update(value, 'age')"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'weight')"
        :value="coreTraits.weight"
        title="Weight"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'hairColor')"
        :value="coreTraits.hairColor"
        title="Hair Color"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'eyeColor')"
        :value="coreTraits.eyeColor"
        title="Eye Color"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'height')"
        :value="coreTraits.height"
        title="Height"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'background')"
        :value="coreTraits.background"
        title="Background"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'shorthandDescriptors')"
        :value="coreTraits.shorthandDescriptors"
        class="shorthand"
        title="Shorthand Descriptors"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'goal')"
        :value="coreTraits.goal"
        class="goal"
        title="Goal"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'strengths')"
        :value="coreTraits.strengths"
        class="strength"
        title="Strengths"
      ></CharacterDetail>
      <CharacterDetail
        @update="(value) => update(value, 'weaknesses')"
        :value="coreTraits.weaknesses"
        class="weakness"
        title="Weaknesses"
      ></CharacterDetail>
    </div>
  </div>
</template>

<style scoped>
.coreTraits {
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-template-rows: repeat(5, auto);
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}
.strength {
  grid-area: 3 / 1 / 3 / 3;
}
.weakness {
  grid-area: 3 / 3 / 5 / 5;
}

@media (max-width: 1400px) {
  .coreTraits {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    grid-column-gap: 0px;
    grid-row-gap: 0px;
  }
  .strength {
    grid-area: 3 / 1 / 4 / 3;
  }
  .weakness {
    grid-area: 4 / 1 / 5 / 3;
  }
  .goal {
    grid-area: 3 / 3 / 4 / 4;
  }
  .shorthand {
    grid-area: 4 / 3 / 5 / 4;
  }
  @media (max-width: 1000px) {
    .coreTraits {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(4, 1fr);
      grid-column-gap: 0px;
      grid-row-gap: 0px;
    }
    .strength {
      grid-area: 4 / 1 / 5 / 2;
    }
    .weakness {
      grid-area: 4 / 2 / 5 / 3;
    }

    .goal {
      grid-area: 3 / 1 / 4 / 2;
    }
    .shorthand {
      grid-area: 3 / 2 / 4 / 3;
    }
  }
}
</style>
