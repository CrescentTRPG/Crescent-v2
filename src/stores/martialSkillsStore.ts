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
    allCombatStyles: { Heavy: { skills: [], attributes: [], name: '', id: '', source: '' } },
    allSpecializations: { Axes: { skills: [], combatStyles: [], name: '', id: '', source: '' } },
    buildDisplayCombatStyles: [
      {
        name: 'nothing',
        rank: 2,
        skills: [{ name: '', description: '', mp_cost: '' }],
        id: 'huh',
        source: 'Test',
        attributes: ['STR']
      }
    ],
    buildDisplaySpecializations: [
      {
        name: 'nothing',
        rank: 2,
        skills: [{ name: '', description: '', mp_cost: '' }],
        id: 'huh',
        source: 'Test',
        combatStyles: ['Heavy']
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
    setUpBuildDisplay() {
      this.buildDisplayCombatStyles = Object.values(this.allCombatStyles).map(
        (combatStyle: ManualCombatStyle) => ({
          id: this.combatStyles[combatStyle.name]?.id || '',
          skills: combatStyle.skills,
          source: combatStyle.source,
          name: combatStyle.name,
          rank: this.combatStyles[combatStyle.name]?.rank || 0,
          attributes: combatStyle.attributes
        })
      )
    },
    setUpBuildSpecializationDisplay() {
      this.buildDisplaySpecializations = Object.values(this.allSpecializations).map(
        (specialization: ManualSpecialization) => ({
          id: this.specializations[specialization.name]?.id || '',
          skills: specialization.skills,
          source: specialization.source,
          name: specialization.name,
          rank: this.specializations[specialization.name]?.rank || 0,
          combatStyles: specialization.combatStyles
        })
      )
    },
    async setCombatStyle(combatStyle: any) {
      let ret
      if (combatStyle.id === '') {
        ret = await addDoc(
          collection(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Combat Styles/'
          ),
          combatStyle
        )
        this.combatStyles[combatStyle.name] = { ...combatStyle, id: ret.id }
      } else {
        ret = updateDoc(
          doc(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Combat Styles/' +
              combatStyle.id
          ),
          { rank: combatStyle.rank }
        )
      }
    },
    async setSpecialization(specialization: any) {
      let ret
      if (specialization.id === '') {
        ret = await addDoc(
          collection(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Specializations/'
          ),
          specialization
        )
        this.specializations[specialization.name] = { ...specialization, id: ret.id }
      } else {
        ret = updateDoc(
          doc(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Specializations/' +
              specialization.id
          ),
          { rank: specialization.rank }
        )
      }
    },
    async pullAllCombatStylesFromFirebase() {
      const allCombatStylesRef = collection(db, 'Ability/Base/Combat Style')
      onSnapshot(
        allCombatStylesRef,
        (snap) => {
          const len = snap.docs.length
          let count = 0
          snap.docs.forEach(async (doc) => {
            count++
            this.allCombatStyles[doc.data().name] = { ...doc.data(), source: 'Base' }
            const results = await getCollectionOnce(
              'Ability/Base/Combat Style/' + doc.data().name + '/Skills'
            )
            this.allCombatStyles[doc.data().name].skills = results
            if (len == count) {
              this.setUpBuildDisplay()
            }
          })
        },
        (err) => {
          console.log(err.message)
        }
      )
    },
    async pullAllSpecializationsFromFirebase() {
      const allSpecializationsRef = collection(db, 'Ability/Base/Specialization')
      onSnapshot(
        allSpecializationsRef,
        (snap) => {
          const len = snap.docs.length
          let count = 0
          snap.docs.forEach(async (doc) => {
            count++
            this.allSpecializations[doc.data().name] = { ...doc.data(), source: 'Base' }
            const results = await getCollectionOnce(
              'Ability/Base/Specialization/' + doc.data().name + '/Skills'
            )
            this.allSpecializations[doc.data().name].skills = results
            if (len == count) {
              this.setUpBuildSpecializationDisplay()
            }
          })
        },
        (err) => {
          console.log(err.message)
        }
      )
    },
    pullCharacterCombatStylesFromFirebase() {
      const collectionRef = collection(
        db,
        'User/' +
          useUserStore().getUserId +
          '/Character/' +
          useCharacterStore().getCharacterId +
          '/Combat Styles'
      )
      onSnapshot(
        collectionRef,
        (snap) => {
          snap.docs.forEach((doc) => {
            this.combatStyles[doc.data().name] = { ...doc.data(), id: doc.id }
          })
          this.setUpBuildDisplay()
        },
        (err) => {
          console.log(err.message)
        }
      )
    },
    pullCharacterSpecializationsFromFirebase() {
      const collectionRef = collection(
        db,
        'User/' +
          useUserStore().getUserId +
          '/Character/' +
          useCharacterStore().getCharacterId +
          '/Specializations'
      )
      onSnapshot(
        collectionRef,
        (snap) => {
          snap.docs.forEach((doc) => {
            this.specializations[doc.data().name] = { ...doc.data(), id: doc.id }
          })
          this.setUpBuildSpecializationDisplay()
        },
        (err) => {
          console.log(err.message)
        }
      )
    }
  },
  persist: true
})
