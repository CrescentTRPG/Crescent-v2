import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { db } from '@/firebase/config.js'
import { collection, setDoc, doc, addDoc, updateDoc } from 'firebase/firestore'

interface Design {
  primaryTheme: string
  secondaryTheme: string
  inputBacking: string
  inputText: string
  primaryText: string
  pageBackdrop: string
  alertTheme: string
  font: string
  titleFont: string
  icon: string
  iconFill: string
  iconColor: string
}

export const useDesignStore = defineStore('design', {
  state: () => ({
    primaryTheme: '#422c58',
    secondaryTheme: '#c2b172',
    inputBacking: '#f1eef1',
    inputText: '#000000',
    primaryText: '#dfdfdf',
    pageBackdrop: '#dfdfdf',
    alertTheme: '#c15be6',
    font: 'Bahnschrift',
    titleFont: 'Bahnschrift',
    icon: 'square',
    iconFill: 'check',
    iconColor: '#000000'
  }),
  getters: {
    getPrimaryTheme: (state) => state.primaryTheme,
    getSecondaryTheme: (state) => state.secondaryTheme,
    getInputBacking: (state): string => state.inputBacking,
    getInputText: (state) => state.inputText,
    getPrimaryText: (state) => state.primaryText,
    getPageBackdrop: (state) => state.pageBackdrop,
    getAlertTheme: (state) => state.alertTheme,
    getFont: (state) => state.font,
    getTitleFont: (state) => state.titleFont,
    getIcon: (state) => state.icon,
    getIconFill: (state) => state.iconFill,
    getIconColor: (state) => state.iconColor
  },
  actions: {
    setLocalDesign(design: {
      primaryTheme: string
      secondaryTheme: string
      inputBacking: string
      inputText: string
      primaryText: string
      pageBackdrop: string
      alertTheme: string
      font: string
      titleFont: string
      icon: string
      iconFill: string
      iconColor: string
    }) {
      this.primaryTheme = design.primaryTheme
      this.secondaryTheme = design.secondaryTheme
      this.inputBacking = design.inputBacking
      this.inputText = design.inputText
      this.primaryText = design.primaryText
      this.pageBackdrop = design.pageBackdrop
      this.alertTheme = design.alertTheme
      this.font = design.font
      this.titleFont = design.titleFont
      this.icon = design.icon
      this.iconFill = design.iconFill
      this.iconColor = design.iconColor
    },
    async setDesign(des: Design, uid: string, cid: string) {
      this.setLocalDesign(des)
      let ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), { design: des })
      console.log(ret)
    }
  },
  persist: true
})
