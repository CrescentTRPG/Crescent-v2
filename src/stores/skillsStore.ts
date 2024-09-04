import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { useUserStore } from './userStore.js'
import { useCharacterStore } from './characterStore.js'
import { db } from '@/firebase/config.js'
import { collection, setDoc, doc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore'

interface Skill {
  skill: string
  rank: number
  source: string
  id: string
}

interface ManualSkill {
  skill: string
  description: string
  attribute: string
}

export const useSkillStore = defineStore('skill', {
  state: () => ({
    skills: {},
    allSkills: []
  }),
  getters: {
    getSkills: (state) => state.skills,
    getAllSkills: (state): Array<ManualSkill> => state.allSkills,
    getEffectiveSkills: (state): Array<any> =>
      state.allSkills.map((skill: ManualSkill) => ({
        skill: skill.skill,
        rank: state.skills[skill.skill]?.rank || 0,
        description: skill.description,
        attribute: skill.attribute,
        isOrigin: useCharacterStore().getOriginSkills.includes(skill.skill)
      }))
  },
  actions: {
    async setSkill(archetype: string, uid: string, cid: string) {
      let ret = updateDoc(doc(db, 'User/' + uid + '/Character/' + cid), { archetype: archetype })
      console.log(ret)
    },
    async pullAllSkillsFromFirebase() {
      let allSkillsRef = collection(db, 'Skill/Base/Skill')
      onSnapshot(
        allSkillsRef,
        (snap) => {
          let results: any = []
          snap.docs.forEach((doc) => {
            results.push({ ...doc.data() })
          })
          this.allSkills = results
        },
        (err) => {
          console.log(err.message)
        }
      )
    },
    pullCharacterSkillsFromFirebase() {
      let collectionRef = collection(
        db,
        'User/' +
          useUserStore().getUserId +
          '/Character/' +
          useCharacterStore().getCharacterId +
          '/Skills'
      )
      onSnapshot(
        collectionRef,
        (snap) => {
          snap.docs.forEach((doc) => {
            this.skills[doc.data().skill] = doc.data()
          })
        },
        (err) => {
          console.log(err.message)
        }
      )
    }
  },
  persist: true
})
