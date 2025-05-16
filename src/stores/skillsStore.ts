import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useCollection } from '@/composable/useCollection.js'
import { useUserStore } from './userStore.js'
import { useCharacterStore } from './characterStore.js'
import { db } from '@/firebase/config.js'
import { collection, setDoc, doc, addDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { usePerformanceStore } from './performanceStore.js'

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
        attribute: 'Agility',
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
      if (skill.skill === 'Performance' && skill.rank < 10) {
        const performanceStore = usePerformanceStore()
        if (skill.rank < 5) {
          performanceStore.setPerformanceStyles({
            ...performanceStore.performanceStyles,
            style2: '',
            style3: ''
          })
        } else {
          performanceStore.setPerformanceStyles({
            ...performanceStore.performanceStyles,
            style3: ''
          })
        }
      }
      if (skill.rank == 0) {
        delete this.skills[skill.skill]
      } else {
        this.skills[skill.skill] = skill
      }
      updateDoc(
        doc(
          db,
          'User/' + useUserStore().getUserId + '/Character/' + useCharacterStore().getCharacterId
        ),
        { skills: this.skills, skillChanged: skill }
      )
    },
    clearEffectiveSkills() {
      this.effectiveSkills = []
    },
    setEffectiveSkills() {
      const effectiveSkillsArr = Object.values(this.allSkills).sort((a: any, b: any) => {
        let aCode = a.skill.charCodeAt(0)
        let bCode = b.skill.charCodeAt(0)
        if (aCode - bCode == 0) {
          aCode = a.skill.charCodeAt(1)
          bCode = b.skill.charCodeAt(1)
          if (aCode - bCode == 0) {
            aCode = a.skill.charCodeAt(2)
            bCode = b.skill.charCodeAt(2)
          }
        }
        return aCode - bCode
      })
      const ret: Array<any> = []
      let index = 0
      effectiveSkillsArr.forEach((skill: ManualSkill) => {
        const obj = {
          id: this.skills[skill.skill]?.id || '',
          skill: skill.skill,
          rank: this.skills[skill.skill]?.rank || 0,
          source: this.skills[skill.skill]?.source || 'Base',
          description: skill.description,
          attribute: skill.attribute,
          isOrigin: useCharacterStore().getOriginSkills.includes(skill.skill),
          index: index
        }
        ret.push(obj)
        index += 1
      })
      this.effectiveSkills = ret
    },
    setUpBuildDisplay(skillChanged) {
      if (this.effectiveSkills.length > 1) {
        if (skillChanged != undefined && skillChanged.skill) {
          this.effectiveSkills[skillChanged.index].rank = skillChanged.rank
        }
      } else {
        this.setEffectiveSkills()
      }
    },
    setEffectiveOriginSkill(isOrigin: boolean, index: number) {
      this.effectiveSkills[index].isOrigin = isOrigin
    },
    async setAllSkillsFromFirebase(skills: any) {
      this.allSkills = Object.values(skills)
    },
    setCharacterSkillsFromFirebase(skills: any) {
      this.skills = skills
    }
  },
  persist: true
})
