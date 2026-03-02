<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore.ts'

import { useCharacterStore } from '@/stores/characterStore.ts'

import { useUserStore } from '@/stores/userStore.ts'
import { storeToRefs } from 'pinia'

export default {
  props: ['attribute', 'attrShorthand'],
  setup(props, context) {
    const modal = ref(false)
    const userStore = useUserStore()
    const designStore = useDesignStore()
    const characterStore = useCharacterStore()
    const { attributes, exceptionals } = storeToRefs(characterStore)
    const attributeVal = ref(attributes.value[props.attribute.toLowerCase()])
    const exceptionalVal = ref(exceptionals.value[props.attribute.toLowerCase()])

    return {
      designStore,
      modal,
      userStore,
      characterStore,
      attributeVal,
      exceptionalVal,
      props
    }
  },
  components: {}
}
</script>

<template>
  <div class="outerBox">
    <div
      style="position: absolute; width: inherit; display: flex; justify-content: space-between"
      :style="{ color: designStore.secondaryTheme }"
    >
      <v-icon
        class="flourish"
        name="gi-abstract-076"
        scale="1.5"
        style="right: 0.25rem; z-index: 1"
      ></v-icon>
      <v-icon
        class="flourish"
        name="gi-abstract-076"
        scale="1.5"
        style="text-align: right; z-index: 1; left: 0.5rem"
      ></v-icon>
    </div>
    <div
      class="attri"
      :style="{
        background: designStore.inputBacking,
        color: designStore.inputText,
        borderColor: designStore.secondaryTheme
      }"
    >
      <div class="attrLayers">
        {{ attributeVal }}
        <div style="font-size: medium; display: flex">
          <div v-if="exceptionalVal >= 0">+</div>
          {{ exceptionalVal }}
        </div>
      </div>
      <div
        class="shorthand"
        style="font-size: medium; align-self: center"
        :style="{ fontFamily: designStore.titleFont }"
      >
        {{ attrShorthand }}
      </div>
      <div
        class="fullName"
        style="font-size: medium; align-self: center"
        :style="{ fontFamily: designStore.titleFont }"
      >
        {{ attribute }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.outerBox {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
  width: 5rem;
}
.fullName {
  display: none;
}
.attri {
  position: relative;
  display: flex;
  flex-direction: column;
  z-index: 3;
  font-size: xx-large;
  width: 4.75rem;
  align-self: center;
  padding-right: 0.6rem;
  padding-left: 0.6rem;
  border-radius: 0.75rem;
  margin: 0.25rem;
  border-left: 4px solid;
  border-right: 4px solid;
}
.flourish {
  position: relative;
  margin-top: 2rem;
  transform: scale(1, 1.5);
}
.attrLayers {
  display: flex;
  justify-content: center;
  height: 2.5rem;
}

@media (max-width: 600px) {
  .flourish {
    display: none;
  }
}
@media (max-width: 970px) {
  .outerBox {
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    width: 3.8rem;
  }
  .attrLayers {
    height: 1.75rem;
  }
  .attri {
    font-size: x-large;
    width: 3.5rem;
  }
  .flourish {
    position: relative;
    margin-top: 1.5rem;
    transform: scale(0.9, 1.25);
  }
}
@media (min-width: 1475px) {
  .attri {
    font-size: xxx-large;
    width: 6.75rem;
  }
  .outerBox {
    margin-left: 0.3rem;
    margin-right: 0.3rem;
    width: 7rem;
  }
  .attrLayers {
    height: 3.5rem;
  }
  .flourish {
    position: relative;
    margin-top: 2.75rem;
    transform: scale(1.25, 2);
  }
  .shorthand {
    display: none;
  }
  .fullName {
    display: block;
  }
}
</style>
