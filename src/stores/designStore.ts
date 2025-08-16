import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { db } from '@/firebase/config.js'
import { collection, setDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { useAdventureStore } from './adventureStore.js'
import { useCharacterStore } from './characterStore.js'

interface Design {
  primaryTheme: string
  secondaryTheme: string
  inputBacking: string
  sidebarBacking: string
  sidebarText: string
  inputText: string
  primaryText: string
  pageBackdrop: string
  alertTheme: string
  charIcon: string
  charIconFlair: string
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
    sidebarBacking: '#e7e2e9',
    sidebarText: '#000000',
    inputText: '#000000',
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
  }),
  getters: {
    getPrimaryTheme: (state) => state.primaryTheme,
    getSecondaryTheme: (state) => state.secondaryTheme,
    getInputBacking: (state): string => state.inputBacking,
    getSidebarBacking: (state): string => state.sidebarBacking,
    getSidebarText: (state): string => state.sidebarText,
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
      sidebarBacking: string
      sidebarText: string
      inputText: string
      primaryText: string
      pageBackdrop: string
      alertTheme: string
      font: string
      titleFont: string
      charIcon: string
      charIconFlair: string
      icon: string
      iconFill: string
      iconColor: string
    }) {
      this.primaryTheme = design.primaryTheme
      this.secondaryTheme = design.secondaryTheme
      this.inputBacking = design.inputBacking
      this.inputText = design.inputText
      this.sidebarBacking = design.sidebarBacking
      this.sidebarText = design.sidebarText
      this.primaryText = design.primaryText
      this.pageBackdrop = design.pageBackdrop
      this.alertTheme = design.alertTheme
      this.font = design.font
      this.titleFont = design.titleFont
      this.charIcon = design.charIcon
      this.charIconFlair = design.charIconFlair
      this.icon = design.icon
      this.iconFill = design.iconFill
      this.iconColor = design.iconColor
    },
    async setDesign(des: Design, uid: string, isAdventure: boolean) {
      this.setLocalDesign(des)
      let ret: any = ''
      if (isAdventure) {
        ret = updateDoc(doc(db, 'User/' + uid + '/Adventure/' + useAdventureStore().id), {
          design: des
        })
      } else {
        ret = updateDoc(
          doc(db, 'User/' + uid + '/Character/' + useCharacterStore().getCharacterId),
          { design: des }
        )
      }
      console.log(ret)
    }
  },
  persist: true
})
