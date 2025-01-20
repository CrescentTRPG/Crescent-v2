import { defineStore } from 'pinia'
import { useCharacterStore } from './characterStore.js'
import { useUserStore } from './userStore.js'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { aB } from 'vitest/dist/reporters-yx5ZTtEV.js'
interface PerformanceStyles {
  style1: string
  style2: string
  style3: string
}
interface PerformanceAbility {
  rank: number
  passive: boolean
  name: string
  actionCost: string
  target: string
  area: string
  type: string
  duration: string
  resistance: string
  description: string
}
export const usePerformanceStore = defineStore('performance', {
  state: () => ({
    manualPerformanceStyles: {},
    performanceStyles: { style1: '', style2: '', style3: '' },
    practicedStyles: {
      Instrumental: {},
      Vocal: {},
      Dance: {}
    },
    buildDisplayAbilities: [
      {
        name: 'meep',
        description: 'moo',
        area: '4',
        resistance: 'AGI',
        target: 'you',
        type: 'Activated',
        actionCost: 'Swift Action',
        known: false,
        rank: 1,
        duration: 'Instantaneous',
        source: 'Base',
        style: '',
        groupIcon: ''
      }
    ],
    buildDisplayStyles: [
      {
        abilities: [
          {
            name: 'meep',
            description: 'moo',
            area: '4',
            resistance: 'AGI',
            target: 'you',
            type: 'Activated',
            actionCost: 'Swift Action',
            known: false,
            rank: 1,
            duration: 'Instantaneous',
            source: 'Base',
            style: '',
            groupIcon: ''
          }
        ],
        style: 'beep',
        groupIcon: 'boop',
        index: 0
      }
    ]
  }),
  getters: {
    getAbilities() {
      const ret: Array<any> = []
      const styles = Object.keys(this.practicedStyles)
      for (let i = 0; i < styles.length; i++) {
        Object.values(this.practicedStyles[styles[i]]).forEach((ability: any) =>
          ret.push({
            ...this.manualPerformanceStyles[styles[i]].styles[ability.name],
            groupIcon: this.manualPerformanceStyles[styles[i]].groupIcon,
            style: styles[i]
          })
        )
      }
      return ret
    }
  },
  actions: {
    async setManualPerformanceStyles(styles: any) {
      this.manualPerformanceStyles = styles
    },
    setLocalPerformanceStyles(styles: PerformanceStyles) {
      this.performanceStyles = styles
    },
    setLocalPracticedStyles(styles: any) {
      this.practicedStyles = styles
    },
    clearBuildDisplay() {
      this.buildDisplayStyles = []
      this.buildDisplayAbilities = []
    },
    setUpBuildDisplay(styleChanged: any) {
      if (this.buildDisplayStyles.length > 1 && this.buildDisplayStyles.length > 1) {
        if (styleChanged.name) {
          this.buildDisplayStyles[styleChanged.groupNumber].abilities[
            styleChanged.groupStyleIndex
          ].known = styleChanged.known
          this.buildDisplayAbilities[styleChanged.styleIndex].known = styleChanged.known
        }
      } else {
        this.setUpBuildDisplayFromScratch()
      }
    },
    setUpBuildDisplayFromScratch() {
      const abilities: Array<any> = []
      const styleGroups: Array<any> = []
      let index = 0
      let styleIndex = 0
      Object.entries(this.manualPerformanceStyles).map(([style]) => {
        const stylesArray = Object.values(this.manualPerformanceStyles[style].styles).sort(
          (a: any, b: any) => {
            if (a.rank === b.rank) {
              let aCode = a.name.charCodeAt(0)
              let bCode = b.name.charCodeAt(0)
              if (aCode - bCode == 0) {
                aCode = a.name.charCodeAt(1)
                bCode = b.name.charCodeAt(1)
                if (aCode - bCode == 0) {
                  aCode = a.name.charCodeAt(2)
                  bCode = b.name.charCodeAt(2)
                }
              }
              return aCode - bCode
            }
            return a.rank - b.rank
          }
        )
        let groupStyleIndex = 0
        stylesArray.forEach((ability: any) => {
          ability.known = this.isPracticed(style, ability.name)
          ability.groupNumber = index
          ability.styleIndex = styleIndex
          ability.source = 'base'
          ability.groupStyleIndex = groupStyleIndex
          ability.style = style
          groupStyleIndex += 1
          styleIndex += 1
        })
        abilities.push(...stylesArray)
        styleGroups.push({
          ...this.manualPerformanceStyles[style],
          abilities: stylesArray,
          index: index
        })
        index++
      })
      this.buildDisplayAbilities = abilities
      this.buildDisplayStyles = styleGroups
    },
    isPracticed(style: string, abilityName: string) {
      let ret = false
      if (
        this.practicedStyles[style] &&
        this.practicedStyles[style][abilityName] &&
        this.practicedStyles[style][abilityName].known
      ) {
        ret = true
      }
      return ret
    },
    setStyleAsPracticed(obj) {
      console.log(obj)
      if (!obj.known) {
        delete this.practicedStyles[obj.style][obj.name]
        if (Object.entries(this.practicedStyles[obj.style]).length < 1) {
          delete this.practicedStyles[obj.style]
        }
      } else {
        if (!this.practicedStyles[obj.style]) {
          this.practicedStyles[obj.style] = {}
        }
        this.practicedStyles[obj.style][obj.name] = obj
      }

      this.setPracticedStyles(this.practicedStyles, obj)
    },
    setPracticedStyles(styles: any, style) {
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { practicedStyles: styles, performanceStyleChanged: style }
      )
    },
    async setPerformanceStyles(styles: PerformanceStyles) {
      this.setLocalPerformanceStyles(styles)
      const ret = updateDoc(
        doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().getCharacterId),
        { performanceStyles: styles }
      )
    }
  },
  persist: true
})
