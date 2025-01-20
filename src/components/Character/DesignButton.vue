<script lang="ts">
import { BButton, BFormSelect, BFormInput, BDropdown, BDropdownItem } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useDesignStore } from '../../stores/designStore'
import { useUserStore } from '../../stores/userStore'
import { useCharacterStore } from '../../stores/characterStore'
import CustomModal from '../CustomModal.vue'
import CustomCheckbox from './CustomCheckbox.vue'
import IconPicker from '../IconPicker.vue'

export default {
  setup(props, context) {
    const design = useDesignStore()
    const modal = ref(false)
    const primaryTheme = ref(JSON.parse(JSON.stringify(design.primaryTheme)))
    const secondaryTheme = ref(JSON.parse(JSON.stringify(design.secondaryTheme)))
    const inputBacking = ref(JSON.parse(JSON.stringify(design.inputBacking)))
    const inputText = ref(JSON.parse(JSON.stringify(design.inputText)))
    const sidebarText = ref(JSON.parse(JSON.stringify(design.sidebarText)))
    const sidebarBacking = ref(JSON.parse(JSON.stringify(design.sidebarBacking)))
    const primaryText = ref(JSON.parse(JSON.stringify(design.primaryText)))
    const pageBackdrop = ref(JSON.parse(JSON.stringify(design.pageBackdrop)))
    const alertTheme = ref(JSON.parse(JSON.stringify(design.alertTheme)))
    const font = ref(JSON.parse(JSON.stringify(design.font)))
    const titleFont = ref(JSON.parse(JSON.stringify(design.titleFont)))
    const icon = ref(JSON.parse(JSON.stringify(design.icon)))
    const iconFill = ref(JSON.parse(JSON.stringify(design.iconFill)))
    const charIcon = ref(JSON.parse(JSON.stringify(design.charIcon)))
    const charIconFlair = ref(JSON.parse(JSON.stringify(design.charIconFlair)))

    const iconColor = ref(JSON.parse(JSON.stringify(design.iconColor)))
    const update = ref(0)
    const fontList = ref([
      'Helvetica',
      'Arial',
      'Arial Black',
      'Verdana',
      'Tahoma',
      'Trebuchet MS',
      'Impact',
      'Ink Free',
      'Times New Roman',
      'Book Antiqua',
      'Franklin Gothic Medium',
      'Roboto',
      'Andalé Mono',
      'Courier',
      'Lucida',
      'Signika',
      'Bookman Old Style',
      'Segoe UI Light',
      'Brush Script MT',
      'Bitter',
      'Comic Sans MS',
      'Bahnschrift'
    ])

    const checkboxBacking = ref([
      {
        html: 'Square Outline <i class="bi bi-square"></i>',
        value: 'bi bi-square',
        name: 'square'
      },
      { html: 'Square Filled <i class="bi bi-square-fill"></i>', value: 'bi bi-square-fill' },
      { html: 'Circle Outline <i class="bi bi-circle"></i>', value: 'bi bi-circle' },
      { html: 'Circle Filled <i class="bi bi-circle-fill"></i>', value: 'bi bi-circle-fill' },
      { html: 'Triangle Outline <i class="bi bi-triangle"></i>', value: 'bi bi-triangle' },
      {
        html: 'Triangle Outline <i class="bi bi-triangle-fill"></i>',
        value: 'bi bi-triangle-fill'
      },
      { html: 'Diamond Outline <i class="bi bi-diamond"></i>', value: 'bi bi-diamond' },
      { html: 'Diamond Filled <i class="bi bi-diamond-fill"></i>', value: 'bi bi-diamond-fill' },
      { html: 'Pentagon Outline <i class="bi bi-pentagon"></i>', value: 'bi bi-pentagon' },
      { html: 'Pentagon Filled <i class="bi bi-pentagon-fill"></i>', value: 'bi bi-pentagon-fill' },
      { html: 'Hexagon Outline <i class="bi bi-hexagon"></i>', value: 'bi bi-hexagon' },
      { html: 'Hexagon Filled <i class="bi bi-hexagon-fill"></i>', value: 'bi bi-hexagon-fill' },
      { html: 'Octagon Outline <i class="bi bi-octagon"></i>', value: 'bi bi-octagon' },
      { html: 'Octagon Filled <i class="bi bi-octagon-fill"></i>', value: 'bi bi-octagon-fill' },
      { html: 'heart Outline <i class="bi bi-heart"></i>', value: 'bi bi-heart' },
      { html: 'heart Filled <i class="bi bi-heart-fill"></i>', value: 'bi bi-heart-fill' },
      { html: 'Star Outline <i class="bi bi-star"></i>', value: 'bi bi-star' },
      { html: 'Star Filled <i class="bi bi-star-fill"></i>', value: 'bi bi-star-fill' }
    ])
    let designs = [
      {
        primaryTheme: '#3E5642',
        secondaryTheme: '#aca26c',
        inputBacking: '#cad8d6',
        inputText: '#195115',
        sidebarBacking: '#7d7064',
        sidebarText: '#351a08',
        primaryText: '#ccdbcf',
        pageBackdrop: '#6d7566',
        alertTheme: '#f36353',
        font: 'Bahnschrift',
        titleFont: 'Segoe UI Light',
        icon: 'bi bi-square',
        iconFill: 'bi bi-check',
        charIconFlair: 'bi bi-stars',
        charIcon: 'bi bi-moon-stars-fill',
        iconColor: '#000000'
      },
      {
        primaryTheme: '#d0ccea',
        secondaryTheme: '#fffdeb',
        inputBacking: '#f3e7f3',
        inputText: '#a081b1',
        sidebarBacking: '#d2e8ee',
        sidebarText: '#846a90',
        primaryText: '#846a90',
        pageBackdrop: '#eceffe',
        alertTheme: '#5585c8',
        font: 'Helvetica',
        titleFont: 'Ink Free',
        icon: 'bi bi-heart',
        iconFill: 'bi bi-check',
        charIconFlair: 'gi-charm',
        charIcon: 'gi-bow-tie-ribbon',
        iconColor: '#ad89be'
      },
      {
        primaryTheme: '#381a56',
        secondaryTheme: '#a1925e',
        inputBacking: '#2c1b2c',
        inputText: '#cabfbf',
        sidebarBacking: '#0f1038',
        sidebarText: '#dfdfdf',
        primaryText: '#dfdfdf',
        pageBackdrop: '#101010',
        alertTheme: '#c15be6',
        font: 'Bahnschrift',
        titleFont: 'Bahnschrift',
        icon: 'bi bi-square',
        iconFill: 'bi bi-check',
        charIconFlair: 'bi bi-stars',
        charIcon: 'bi bi-moon-stars-fill',
        iconColor: '#dfdfdf'
      },
      {
        primaryTheme: '#400707',
        secondaryTheme: '#a80000',
        inputBacking: '#2f2b28',
        inputText: '#cccccc',
        sidebarBacking: '#404040',
        sidebarText: '#dfdfdf',
        primaryText: '#dfdfdf',
        pageBackdrop: '#101010',
        alertTheme: '#fe8839',
        font: 'Bahnschrift',
        titleFont: 'Franklin Gothic Medium',
        icon: 'bi bi-square',
        iconFill: 'gi-supersonic-bullet',
        charIconFlair: 'gi-steel-claws',
        charIcon: 'gi-daemon-skull',
        iconColor: '#dfdfdf'
      },
      {
        primaryTheme: '#2D193E',
        secondaryTheme: '#000000',
        inputBacking: '#54445A',
        inputText: '#c4c4c4',
        sidebarBacking: '#552759',
        sidebarText: '#000000',
        primaryText: '#c78233',
        pageBackdrop: '#150E11',
        alertTheme: '#52ff7d',
        font: 'Lucida',
        titleFont: 'Bookman Old Style',
        icon: 'bi bi-square',
        iconFill: 'gi-spider-face',
        charIconFlair: 'gi-skull-staff',
        charIcon: 'gi-witch-flight',
        iconColor: '#410733'
      }
    ]
    return {
      checkboxBacking,
      design,
      modal,
      primaryTheme,
      secondaryTheme,
      inputBacking,
      inputText,
      primaryText,
      pageBackdrop,
      alertTheme,
      font,
      titleFont,
      charIcon,
      charIconFlair,
      icon,
      iconFill,
      iconColor,
      fontList,
      update,
      sidebarBacking,
      sidebarText,
      designs
    }
  },
  methods: {
    updateObj() {
      let designObj = {
        primaryTheme: this.primaryTheme,
        secondaryTheme: this.secondaryTheme,
        inputBacking: this.inputBacking,
        inputText: this.inputText,
        sidebarBacking: this.sidebarBacking,
        sidebarText: this.sidebarText,
        primaryText: this.primaryText,
        pageBackdrop: this.pageBackdrop,
        alertTheme: this.alertTheme,
        font: this.font,
        titleFont: this.titleFont,
        charIcon: this.charIcon,
        charIconFlair: this.charIconFlair,
        icon: this.icon,
        iconFill: this.iconFill,
        iconColor: this.iconColor
      }
      this.design.setDesign(designObj, useUserStore().getUserId, useCharacterStore().getCharacterId)
    },
    reset() {
      let designObj = {
        primaryTheme: '#422c58',
        secondaryTheme: '#c2b172',
        inputBacking: '#f1eef1',
        inputText: '#000000',
        sidebarBacking: '#e7e2e9',
        sidebarText: '#000000',
        primaryText: '#dfdfdf',
        pageBackdrop: '#dfdfdf',
        alertTheme: '#c15be6',
        font: 'Bahnschrift',
        titleFont: 'Bahnschrift',
        icon: 'bi bi-square',
        iconFill: 'bi bi-check',
        charIconFlair: 'bi bi-stars',
        charIcon: 'bi bi-moon-stars-fill',
        iconColor: '#000000'
      }
      this.design.setDesign(designObj, useUserStore().getUserId, useCharacterStore().getCharacterId)
    },
    setFromDropdown(obj) {
      this.design.setDesign(obj, useUserStore().getUserId, useCharacterStore().getCharacterId)
    }
  },
  components: {
    BFormSelect,
    IconPicker,
    BButton,
    BFormInput,
    CustomModal,
    BDropdown,
    BDropdownItem,
    CustomCheckbox
  }
}
</script>

<template>
  <div>
    <CustomModal :showModal="modal" title="Set Custom Design" @close="modal = !modal">
      <template v-slot:body>
        <div style="display: flex; justify-content: space-around">
          <div class="colorView">
            Primary Theme
            <BFormInput type="color" v-model="primaryTheme" style="width: 100%"></BFormInput>
          </div>

          <div class="colorView">
            Input Backing
            <BFormInput type="color" v-model="inputBacking" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Sidebar Backing
            <BFormInput type="color" v-model="sidebarBacking" style="width: 100%"></BFormInput>
          </div>
        </div>
        <div style="display: flex; justify-content: space-around">
          <div class="colorView">
            Primary Text
            <BFormInput type="color" v-model="primaryText" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Input Text
            <BFormInput type="color" v-model="inputText" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Sidebar Text
            <BFormInput type="color" v-model="sidebarText" style="width: 100%"></BFormInput>
          </div>
        </div>
        <div style="display: flex; justify-content: space-around">
          <div class="colorView">
            Secondary Theme
            <BFormInput type="color" v-model="secondaryTheme" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Page Backdrop
            <BFormInput type="color" v-model="pageBackdrop" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Alert Theme<BFormInput
              type="color"
              v-model="alertTheme"
              style="width: 100%"
            ></BFormInput>
          </div>
        </div>
        <div class="font">
          <div class="fontWithLabel">
            <div class="fontLabel">Main Font</div>
            <BFormSelect
              :options="fontList"
              v-model="font"
              style="min-width: 12rem; margin-bottom: 1rem; flex-grow: 1"
              :style="{
                borderColor: design.secondaryTheme,
                color: design.inputText,
                background: design.inputBacking
              }"
            ></BFormSelect>
          </div>
          <div class="fontWithLabel">
            <div class="fontLabel">Title Font</div>
            <BFormSelect
              :options="fontList"
              v-model="titleFont"
              style="min-width: 12rem; margin-bottom: 1rem; flex-grow: 1"
              :style="{
                borderColor: design.secondaryTheme,
                color: design.inputText,
                background: design.inputBacking
              }"
            ></BFormSelect>
          </div>
        </div>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; flex-direction: row">
          <div class="colorView">
            Checkbox Outside
            <BFormSelect
              html-field="html"
              v-model="icon"
              class="checkdrop"
              :style="{
                background: design.inputBacking,
                color: design.inputText,
                borderColor: design.secondaryTheme
              }"
              :options="checkboxBacking"
            >
            </BFormSelect>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            Inner Icon
            <IconPicker
              :style="{ background: inputBacking }"
              style="align-self: center; border-radius: 10px"
              :currentIcon="design.iconFill"
              @selectedIcon="(icon) => (iconFill = icon)"
              orientation="bottom"
              :color="design.iconColor"
            ></IconPicker>
          </div>
          <div class="colorView">
            Icon Color<BFormInput type="color" v-model="iconColor" style="width: 100%"></BFormInput>
          </div>

          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            Character Icon

            <IconPicker
              style="align-self: center; border-radius: 10px"
              :style="{ color: secondaryTheme }"
              id="2"
              :currentIcon="design.charIcon"
              @selectedIcon="(icon) => (charIcon = icon)"
              orientation="bottom"
              :color="design.secondaryTheme"
            ></IconPicker>
          </div>
          <div
            style="
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            Framing Flair Icon
            <IconPicker
              style="align-self: center; border-radius: 10px"
              :style="{ color: secondaryTheme }"
              id="3"
              :currentIcon="design.charIconFlair"
              @selectedIcon="(icon) => (charIconFlair = icon)"
              orientation="bottom"
              :color="design.secondaryTheme"
            ></IconPicker>
          </div>
        </div>
        <b-button
          @click="update++"
          style="margin-top: 0.5rem; font-size: 1rem"
          :style="{
            background: design.primaryTheme,
            color: design.primaryText,
            borderColor: design.secondaryTheme
          }"
          >Push Icons To Preview</b-button
        >
        <div
          :style="{ background: design.primaryTheme, fontFamily: design.titleFont }"
          style="font-size: x-large"
        >
          Preview
        </div>
        <div
          :style="{ background: pageBackdrop, borderColor: design.secondaryTheme }"
          style="padding: 2rem; border: 2px solid"
        >
          <div
            style="
              width: 10rem;
              height: 3rem;
              border: 2px solid;
              margin-bottom: 1rem;
              border-radius: 10px;
            "
            :style="{
              background: primaryTheme,
              color: primaryText,
              borderColor: secondaryTheme,
              fontFamily: titleFont
            }"
          >
            <div
              style="
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;
              "
            >
              Example View
            </div>
          </div>
          <div
            style="
              width: 20rem;
              height: 3rem;
              display: flex;
              justify-content: space-around;
              border: 2px solid;
            "
            :style="{
              background: inputBacking,
              color: inputText,
              fontFamily: font,
              borderColor: secondaryTheme
            }"
          >
            <div
              style="
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;
              "
            >
              Example Input
            </div>
            <CustomCheckbox
              :isChecked="true"
              :overrideBox="icon"
              :overrideFill="iconFill"
              :update="update"
            ></CustomCheckbox>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div style="display: flex">
          <BDropdown
            text="Set From built in color schemes"
            style="font-size: medium"
            :style="{
              background: design.primaryTheme,
              '--bs-btn-bg': design.primaryTheme,
              '--bs-btn-color': design.primaryText,
              '--bs-btn-border-color': design.secondaryTheme,
              '--bs-btn-hover-color': design.primaryText,
              '--bs-btn-hover-bg': design.primaryTheme,
              '--bs-btn-hover-border-color': design.secondaryTheme,
              '--bs-btn-active-color': design.primaryText,
              '--bs-btn-active-bg:': design.primaryTheme,
              '--bs-btn-active-border-color': design.secondaryTheme,
              '--bs-dropdown-color': design.primaryText,
              '--bs-dropdown-bg': design.primaryTheme,
              '--bs-dropdown-link-hover-color': design.alertTheme,
              '--bs-dropdown-link-hover-bg': design.primaryTheme,
              '--bs-dropdown-link-active-color': design.alertTheme,
              '--bs-dropdown-link-active-bg': design.primaryTheme,
              scrollbarColor: design.secondaryTheme + ' ' + design.primaryTheme
            }"
          >
            <template #button-content>
              <BButton
                style="margin-bottom: 0.5rem; border: 1px solid"
                :style="{
                  '--dropdownBg': design.inputBacking,
                  borderColor: design.secondaryTheme
                }"
                >Set From built in color schemes</BButton
              >
            </template>
            <BDropdownItem class="dropdown-item" @click="setFromDropdown(designs[2])"
              >Dark Mode</BDropdownItem
            >
            <BDropdownItem class="dropdown-item" @click="setFromDropdown(designs[3])"
              >Edge Lord</BDropdownItem
            >
            <BDropdownItem class="dropdown-item" @click="setFromDropdown(designs[0])"
              >Scouts Honor</BDropdownItem
            >
            <BDropdownItem class="dropdown-item" @click="setFromDropdown(designs[1])"
              >Pastel Cutie</BDropdownItem
            >
            <BDropdownItem class="dropdown-item" @click="setFromDropdown(designs[4])"
              >Witch Vibes</BDropdownItem
            >
          </BDropdown>
          <BButton
            style="margin-right: 1rem; border: 1px solid"
            :style="{
              borderColor: design.secondaryTheme,
              background: design.primaryTheme,
              color: design.primaryText,
              fontFamily: design.font
            }"
            @click="reset"
            >Reset to Default</BButton
          >

          <BButton
            style="border: 1px solid"
            :style="{
              background: design.primaryTheme,
              color: design.primaryText,
              fontFamily: design.font,
              borderColor: design.secondaryTheme
            }"
            @click="updateObj"
            >Set Color Scheme</BButton
          >
        </div>
      </template>
    </CustomModal>
    <BButton
      @click="modal = !modal"
      class="button"
      style="margin-right: 0.25rem; font-size: 1rem; margin-bottom: 1rem"
      :style="{ background: design.primaryTheme, color: design.primaryText }"
    >
      <i class="bi bi-palette"></i>
    </BButton>
  </div>
</template>

<style scoped>
.fontWithLabel {
  display: flex;
  flex-grow: 1;
}
.fontLabel {
  width: 6rem;
  align-self: center;
  margin: 0.5rem;
  text-align: center;
  margin-bottom: 1rem;
}

@media (max-width: 65rem) {
  .fontWithLabel {
    flex-direction: column;
  }
  .fontLabel {
    align-self: start;
    margin: 0;
  }
  @media (max-width: 40rem) {
    .fontWithLabel {
      flex-direction: row;
      flex-wrap: wrap;
    }
    .fontLabel {
      text-align: center;
    }
  }
}

.font {
  display: flex;
  margin: 0.5rem;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-bottom: 0;
  margin-top: 1rem;
}
.colorView {
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
option:hover {
  background-color: red;
}
</style>
