<script lang="ts">
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'

import { useCharacterStore } from '@/stores/characterStore'

import { useUserStore } from '@/stores/userStore'
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
  components: {},
  methods: {
    LightenDarkenColor(col, amt) {
      var num = parseInt(col.substring(1), 16)
      var r = (num >> 16) + amt
      var b = ((num >> 8) & 0x00ff) + amt
      var g = (num & 0x0000ff) + amt
      var newColor = g | (b << 8) | (r << 16)
      return '#' + newColor.toString(16)
    }
  }
}
</script>

<template>
  <div
    style="width: 95%; border: 1px solid; margin: 0.1rem; border-radius: 4px"
    :style="{
      background: designStore.secondaryTheme,
      borderColor: LightenDarkenColor(designStore.secondaryTheme, -20),
      boxShadow: 'inset 0px 0px 0px 1px ' + LightenDarkenColor(designStore.secondaryTheme, -10),
      color: designStore.inputText
    }"
  >
    <div
      class="outerBox"
      :style="{
        background: designStore.inputBacking,
        borderColor: designStore.secondaryTheme,
        borderLeftColor: LightenDarkenColor(designStore.secondaryTheme, -20)
      }"
    >
      <div class="attrz">
        {{ attributeVal }}
        <div class="exec">
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
        style="align-self: center"
        :style="{ fontFamily: designStore.titleFont }"
      >
        {{ attribute }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.outerBox {
  border: 2px solid;
  width: 100%;
  clip-path: polygon(0 17%, 10% 0, 90% 0, 100% 17%, 100% 83%, 90% 100%, 10% 100%, 0% 83%);
}
.attrz {
  display: flex;
  font-size: x-large;
  justify-content: center;
}
.shorthand {
  display: none;
}
.fullName {
  font-size: small;
  margin-top: -0.25rem;
  justify-self: center;
}
.exec {
  font-size: medium;
  display: flex;
}
@media (max-width: 520px) {
  .shorthand {
    margin-top: -0.25rem;
    display: block;
    justify-self: center;
  }
  .fullName {
    display: none;
  }
}
@media (min-width: 780px) {
  .fullName {
    display: none;
  }
  .shorthand {
    margin-top: -0.25rem;
    display: block;
    justify-self: center;
  }
}
@media (min-width: 1000px) {
  .shorthand {
    display: none;
  }
  .attrz {
    display: flex;
    font-size: xx-large;
    justify-content: center;
  }
  .fullName {
    display: block;
    margin-top: -0.5rem;
  }
}
@media (min-width: 1400px) {
  .attrz {
    display: flex;
    font-size: 2.5rem;
    justify-content: center;
  }
  .fullName {
    margin-top: -1rem;
    font-size: medium;
  }
  .exec {
    margin-top: 0.25rem;
    font-size: large;
    display: flex;
  }
}
</style>
