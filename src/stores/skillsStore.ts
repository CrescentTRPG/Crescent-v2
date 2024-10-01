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
    allSkills: [],
    effectiveSkills: [
      {
        skill: 'nothing',
        rank: 2,
        description: 'something',
        isOrigin: false,
        id: 'huh',
        source: 'Test'
      }
    ]
  }),
  getters: {
    getSkills: (state) => state.skills,
    getAllSkills: (state): Array<ManualSkill> => state.allSkills,
    getEffectiveSkills: (state) => state.effectiveSkills
  },
  actions: {
    async setSkill(skill: any) {
      let ret
      if (skill.id === '') {
        ret = await addDoc(
          collection(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Skills/'
          ),
          skill
        )
        this.skills[skill.skill] = { ...skill, id: ret.id }
      } else {
        ret = updateDoc(
          doc(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Skills/' +
              skill.id
          ),
          { rank: skill.rank }
        )
      }
    },
    setEffectiveSkills() {
      this.effectiveSkills = this.allSkills.map((skill: ManualSkill) => ({
        id: this.skills[skill.skill]?.id || '',
        skill: skill.skill,
        rank: this.skills[skill.skill]?.rank || 0,
        source: this.skills[skill.skill]?.source || 'Base',
        description: skill.description,
        attribute: skill.attribute,
        isOrigin: useCharacterStore().getOriginSkills.includes(skill.skill)
      }))
    },
    async pullAllSkillsFromFirebase() {
      let allSkillsRef = collection(db, 'Ability/Base/Skill')
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
            this.skills[doc.data().skill] = { ...doc.data(), id: doc.id }
          })
          this.setEffectiveSkills()
        },
        (err) => {
          console.log(err.message)
        }
      )
    }
  },
  persist: true
})
