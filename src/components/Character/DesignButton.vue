<script lang="ts">
import { BButton, BFormSelect, BFormInput } from 'bootstrap-vue-next'
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
    return {
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
      icon,
      iconFill,
      iconColor,
      fontList,
      update,
      sidebarBacking,
      sidebarText
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
        iconColor: '#000000'
      }
      this.design.setDesign(designObj, useUserStore().getUserId, useCharacterStore().getCharacterId)
    }
  },
  components: {
    IconPicker,
    BButton,
    BFormInput,
    BFormSelect,
    CustomModal,
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
            Secondary Theme
            <BFormInput type="color" v-model="secondaryTheme" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Input Backing
            <BFormInput type="color" v-model="inputBacking" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Input Text
            <BFormInput type="color" v-model="inputText" style="width: 100%"></BFormInput>
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
          <div class="colorView">
            Icon Color<BFormInput type="color" v-model="iconColor" style="width: 100%"></BFormInput>
          </div>
          <div class="colorView">
            Sidebar Text
            <BFormInput type="color" v-model="sidebarText" style="width: 100%"></BFormInput>
          </div>
        </div>
        <div style="display: flex; margin: 0.5rem">
          <div style="width: 16rem; align-self: center; margin: 0.5rem">Main Font</div>
          <BFormSelect
            :options="fontList"
            v-model="font"
            :style="{
              borderColor: design.secondaryTheme,
              color: design.inputText,
              background: design.inputBacking
            }"
          ></BFormSelect>
          <div style="width: 16rem; align-self: center; margin: 0.5rem">Title Font</div>
          <BFormSelect :options="fontList" v-model="titleFont"></BFormSelect>
        </div>
        <div style="display: flex">
          <div
            style="
              width: 31rem;
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            Checkbox Outside
          </div>
          <BFormInput v-model="icon"></BFormInput>
          <div
            style="
              width: 25rem;
              display: flex;
              justify-content: center;
              flex-direction: column;
              text-align: center;
              margin: 0.5rem;
            "
          >
            Inner Icon
          </div>
          <BFormInput v-model="iconFill"></BFormInput>
          <IconPicker :currentIcon="design.iconFill"></IconPicker>
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
          <BButton
            :style="{
              background: design.primaryTheme,
              color: design.primaryText,
              fontFamily: design.font,
              borderColor: secondaryTheme
            }"
            style="margin-right: 1rem"
            @click="reset"
            >Reset to Default</BButton
          >
          <BButton
            :style="{
              background: design.primaryTheme,
              color: design.primaryText,
              fontFamily: design.font,
              borderColor: secondaryTheme
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
.colorView {
  width: 8rem;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
</style>
