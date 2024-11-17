import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { useUserStore } from './userStore.js'
import { useCharacterStore } from './characterStore.js'
import { db } from '@/firebase/config.js'
import { collection, setDoc, doc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { getCollectionOnce } from '@/composable/getCollection.js'

interface ManualCombatStyle {
  skills: Array<any>
  attributes: Array<string>
  name: string
  id: string
  source: string
}

interface ManualSpecialization {
  skills: Array<any>
  combatStyles: Array<string>
  name: string
  id: string
  source: string
}

interface CharacterSpecialization {
  skills: any
  combatStyles: Array<string>
  name: string
  id: string
  source: string
  rank: number
}

interface CharacterCombatStyles {
  skills: any
  combatStyles: Array<string>
  name: string
  id: string
  source: string
  rank: number
}

interface MartialSkill {
  id: string
  name: string
  rank: number
  source: string
}

export const useMartialSkillsStore = defineStore('martialSkill', {
  state: () => ({
    combatStyles: {},
    specializations: {},
    allCombatStyles: {
      Heavy: { skills: [], attributes: [], name: '', id: '', source: '', groupIcon: '' }
    },
    allSpecializations: {
      Axes: { skills: [], combatStyles: [], name: '', id: '', source: '', groupIcon: '' }
    },
    buildDisplayCombatStyles: [
      {
        name: 'nothing',
        rank: 2,
        skills: [{ name: '', description: '', mp_cost: '' }],
        id: 'huh',
        source: 'Test',
        attributes: ['STR'],
        groupIcon: 'gi-hearts'
      }
    ],
    buildDisplaySpecializations: [
      {
        name: 'nothing',
        rank: 2,
        skills: [{ name: '', description: '', mp_cost: '' }],
        id: 'huh',
        source: 'Test',
        combatStyles: ['Heavy'],
        groupIcon: 'gi-hearts'
      }
    ]
  }),
  getters: {
    getCombatStyles: (state) => state.combatStyles,
    getSpecializations: (state) => state.specializations,
    getAllCombatStyles: (state) => state.allCombatStyles,
    getAllSpecializations: (state) => state.allSpecializations
  },
  actions: {
    setUpBuildDisplayFromScratch() {
      const allCombatStylesArr = Object.values(this.allCombatStyles).sort((a: any, b: any) => {
        let aCode = a.attributes.length
        let bCode = b.attributes.length
        if (a.attributes.includes('Agility')) {
          aCode -= 1
        } else {
          aCode += 2
        }
        if (b.attributes.includes('Agility')) {
          bCode -= 1
        } else {
          bCode += 2
        }
        return aCode - bCode
      })
      const ret: Array<{
        name: string
        id: string
        skills: Array<any>
        source: string
        rank: number
        attributes: Array<string>
        index: number
        groupIcon: string
      }> = []
      let index = 0
      allCombatStylesArr.forEach((combatStyle) => {
        const obj = {
          id: this.combatStyles[combatStyle.name]?.id || '',
          skills: Object.values(combatStyle.skills),
          source: combatStyle.source,
          name: combatStyle.name,
          rank: this.combatStyles[combatStyle.name]?.rank || 0,
          attributes: combatStyle.attributes,
          index: index,
          groupIcon: combatStyle.groupIcon
        }
        ret.push(obj)
        index += 1
      })
      this.buildDisplayCombatStyles = ret
    },
    setUpBuildDisplay(combatStyleChanged) {
      if (this.buildDisplayCombatStyles.length > 1) {
        if (combatStyleChanged != undefined) {
          this.buildDisplayCombatStyles[combatStyleChanged.index].rank = combatStyleChanged.rank
        }
      } else {
        this.setUpBuildDisplayFromScratch()
      }
    },
    setUpBuildSpecializationDisplayFromScratch() {
      const allSpecializationsArr = Object.values(this.allSpecializations).sort(
        (a: any, b: any) => {
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
      )
      let index = 0
      const ret: Array<{
        name: string
        id: string
        skills: Array<any>
        source: string
        rank: number
        combatStyles: Array<string>
        groupIcon: string
      }> = []
      allSpecializationsArr.forEach((specialization) => {
        const obj = {
          id: this.specializations[specialization.name]?.id || '',
          skills: Object.values(specialization.skills),
          source: specialization.source,
          name: specialization.name,
          rank: this.specializations[specialization.name]?.rank || 0,
          combatStyles: specialization.combatStyles,
          index: index,
          groupIcon: specialization.groupIcon
        }
        ret.push(obj)
        index += 1
      })
      this.buildDisplaySpecializations = ret
    },
    setUpBuildSpecializationDisplay(specializationChanged) {
      if (this.buildDisplaySpecializations.length > 1) {
        if (specializationChanged != undefined) {
          this.buildDisplaySpecializations[specializationChanged.index].rank =
            specializationChanged.rank
        }
      } else {
        this.setUpBuildSpecializationDisplayFromScratch()
      }
    },
    clearMartialSkillsBuild() {
      this.buildDisplayCombatStyles = []
      this.buildDisplaySpecializations = []
    },
    async setCombatStyle(combatStyle: any) {
      console.log(combatStyle)
      console.log(combatStyle)
      if (combatStyle.rank == 0) {
        delete this.combatStyles[combatStyle.skill]
      } else {
        this.combatStyles[combatStyle.skill] = { ...combatStyle }
      }
      console.log(this.combatStyles)

      updateDoc(
        doc(
          db,
          'User/' + useUserStore().getUserId + '/Character/' + useCharacterStore().getCharacterId
        ),
        { combatStyles: this.combatStyles, combatStyleChanged: combatStyle }
      )
    },
    async setSpecialization(specialization: any) {
      if (specialization.rank == 0) {
        delete this.specializations[specialization.name]
      } else {
        this.specializations[specialization.name] = { ...specialization }
      }
      updateDoc(
        doc(
          db,
          'User/' + useUserStore().getUserId + '/Character/' + useCharacterStore().getCharacterId
        ),
        { specializations: this.specializations, specializationChanged: specialization }
      )
    },
    setAllSpecializationsFromFirebase(specializations: any) {
      this.allSpecializations = specializations
    },
    setAllCombatStylesFromFirebase(combatStyles: any) {
      this.allCombatStyles = combatStyles
    },
    setCharacterCombatStylesFromFirebase(combatStyles: CharacterCombatStyles) {
      this.combatStyles = combatStyles
    },
    setCharacterSpecializationsFromFirebase(specializations: CharacterSpecialization) {
      this.specializations = specializations
    }
  },
  persist: true
})
