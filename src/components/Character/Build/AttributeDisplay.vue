<script lang="ts">
import { useRouter } from 'vue-router'
import {
  BButton,
  BCard,
  BNavItem,
  BNavbar,
  BFormInput,
  BInputGroup,
  BInputGroupText
} from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../../stores/designStore'
import CustomModal from '../../CustomModal.vue'
import { useCharacterStore } from '../../../stores/characterStore'
import { useUserStore } from '../../../stores/userStore'

export default {
  props: ['attribute', 'attributeValue', 'exceptionalValue', 'attributeMessage', ],
  setup(props, context) {
    const router = useRouter()
    const userStore = useUserStore()
    const characterStore = useCharacterStore()
    const attributeValue = ref(characterStore.getAttributes[props.attribute.toLowerCase()] || 0)
    const exceptionalValue = ref(0)
    const designStore = useDesignStore()
    const modal = ref(false)
    return { designStore, modal, attributeValue, exceptionalValue, props, characterStore, userStore }
  },

  methods: {
    updateAttr(){
      let copy = {...this.characterStore.getAttributes};
      copy[this.props.attribute.toLowerCase()] = parseInt(this.attributeValue);
      this.characterStore.setAttribute(copy, this.userStore.getUserId, this.characterStore.getCharacterId)
    }
  },
  components: {
    BButton,
    BNavbar,
    BNavItem,
    BCard,
    CustomModal,
    BFormInput,
    BInputGroup,
    BInputGroupText
  }
}
</script>

<template>
  <div @click="modal = !modal" style="width: 100%">
    <div
      style=" width: 100%; z-index: 1;box-shadow: inset -5px 0px 1px 1px; padding-right: 2rem;  cursor: pointer;" 
      :style="{ background: designStore.inputBacking, color: designStore.secondaryTheme}"
    >
    <div style="display: flex; justify-content: space-between; z-index: 4; margin-left: 1rem; width: 100%" :style="{color: designStore.inputText}">
      <div style="display: flex; flex-direction: column; font-size: large; width: inherit;">
        <div class="attributeLabel">{{ props.attribute }}</div>
        <span style="display: flex; z-index: 4;margin-top: -1rem;margin-bottom: -1rem;" :style="{borderColor: designStore.secondaryTheme, color:designStore.secondaryTheme}">
          <v-icon name="gi-abstract-119" style="position: relative; left: .25rem"></v-icon>
          <hr :style="{borderColor: designStore.secondaryTheme}"></hr>
          <v-icon name="gi-abstract-119" style="position: relative; right: .25rem"></v-icon>

        </span>
        <div class="attributeMessage">
          {{ props.attributeMessage }}
        </div>
      </div>
      <div 
      style="display: flex; flex-direction: column; z-index: 3; font-size: xxx-large; width: 6.5rem; align-self: center; padding-right: .6rem;padding-left: .6rem; border-radius: .75rem; margin: .25rem; border-left: 4px solid; border-right: 4px solid" 
      :style="{background: designStore.primaryTheme, color: designStore.primaryText, borderColor: designStore.secondaryTheme}">
        <div style="display: flex; justify-content: center">{{ attributeValue }} <div style="font-size: medium;display: flex;"> <div v-if="exceptionalValue >=0">+</div>{{ exceptionalValue }}</div></div>
      </div>
    </div>
    </div>
    <CustomModal :showModal="modal" :title="$props.attribute" @close="modal = false">
      <template v-slot:body>
        <BInputGroup
          style="border: 3px solid; border-radius: 10px; margin-bottom: 1rem"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BInputGroupText
            style="width: 7rem"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            
            >Attribute</BInputGroupText
          >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="0"
            max="10"
            @change="updateAttr()"
            v-model="attributeValue"
          ></BFormInput>
        </BInputGroup>
        <BInputGroup
          style="border: 3px solid; border-radius: 10px"
          :style="{ borderColor: designStore.secondaryTheme, background: designStore.primaryTheme }"
        >
          <BInputGroupText
            style="width: 7rem"
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            >Exceptional</BInputGroupText
          >
          <BFormInput
            :style="{ background: designStore.inputBacking, color: designStore.inputText }"
            type="number"
            min="-10"
            max="10"
            v-model="exceptionalValue"
          ></BFormInput>
        </BInputGroup>
      </template>
    </CustomModal>
  </div>
</template>

<style>
.attributeMessage {
  z-index: 4; display: flex; justify-content: flex-start; margin-left: 2rem; font-size: small;
}
.attributeLabel {
  font-size: xx-large; z-index: 4; width: 45%; margin-left: 1.5rem
}
.attr {
  margin-top: 0.5rem;
  margin-right: 0.5rem;
  cursor: pointer;
  height: 7.25rem;
  width: 7.25rem;
  display: flex;
  justify-content: center;
  flex-direction: row;
  border-radius: 0.5rem;
}
.innerAttr {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0.5rem;
}
@media (max-width: 550px) {
  .attributeLabel{
    font-size: x-large;
  }
  .attributeMessage {
    font-size: x-small;
    margin-left: 1.5rem;
  }
}
</style>
