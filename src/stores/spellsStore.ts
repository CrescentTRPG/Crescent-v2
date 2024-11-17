import { db } from '@/firebase/config.js'
import { collection, doc, onSnapshot, query, updateDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore.js'
import { useCharacterStore } from './characterStore.js'
import { getCollectionOnce } from '@/composable/getCollection.js'
import SpellsTable from '@/components/Character/Build/SpellsTable.vue'

interface ManualSpell {
  name: string
  description: string
  area: string
  resistance: string
  target: string
  type: string
  action_cost: string
  duration: string
  source: string
  rank: number
}

interface ManualSpellgroup {
  spells: Array<ManualSpell>
  source: string
  name: string
  baseCost: number
  rankLimiter: string
  groupPurchaseLimiter: string
  manaGain: number
  groupIcon: ''
}

export const useSpellStore = defineStore('spell', {
  state: () => ({
    arcaneBattery: 0,
    spellgroups: {},
    manualSpellgroups: {},
    buildDisplaySpellgroups: [
      {
        spells: [
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
            source: 'Base'
          }
        ],
        source: 'Base',
        name: 'Beeomancy',
        baseCost: 1,
        rankLimiter: 'Power',
        manaGain: 1,
        groupIcon: '',
        index: 0,
        groupPurchaseLimiter: 'Charisma'
      }
    ],
    buildDisplaySpells: [
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
        spellgroup: '',
        grouping: 'Intelligence',
        groupIcon: ''
      }
    ]
  }),
  actions: {
    setUpBuildDisplayFromScratch() {
      const spells: Array<any> = []
      const spellgroups: Array<any> = []
      let index = 0
      let spellIndex = 0
      Object.entries(this.manualSpellgroups).map(([spellgroup]) => {
        const spellsArray = Object.values(this.manualSpellgroups[spellgroup].spells).sort(
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
        let groupSpellIndex = 0
        spellsArray.forEach((spell: any) => {
          spell.known = this.isSpellKnown(spell, spellgroup)
          spell.groupNumber = index
          spell.spellIndex = spellIndex
          spell.groupSpellIndex = groupSpellIndex
          groupSpellIndex += 1
          spellIndex += 1
        })

        spells.push(...spellsArray)

        spellgroups.push({
          ...this.manualSpellgroups[spellgroup],
          spells: spellsArray,
          index: index
        })
        index++
      })
      this.buildDisplaySpells = spells
      this.buildDisplaySpellgroups = spellgroups
    },
    setUpBuildDisplay(spellChanged: any) {
      if (this.buildDisplaySpellgroups.length > 1 && this.buildDisplaySpells.length > 1) {
        if (spellChanged != undefined) {
          this.buildDisplaySpellgroups[spellChanged.groupNumber].spells[
            spellChanged.groupSpellIndex
          ].known = spellChanged.known
          this.buildDisplaySpells[spellChanged.spellIndex].known = spellChanged.known
        }
      } else {
        this.setUpBuildDisplayFromScratch()
      }
    },

    clearBuildDisplay() {
      this.buildDisplaySpells = []
      this.buildDisplaySpellgroups = []
    },

    spellIndex(spellsArray, spell) {
      for (let i = 0; i < spellsArray.length; i++) {
        if (spell.rank <= spellsArray[i].rank) {
          return i
        }
      }
      return 0
    },

    isSpellKnown(spell: ManualSpell, spellgroup: string): boolean {
      let ret = false
      if (
        this.spellgroups[spellgroup] &&
        this.spellgroups[spellgroup].spells &&
        this.spellgroups[spellgroup].spells[spell.name] &&
        this.spellgroups[spellgroup].spells[spell.name].known
      ) {
        ret = true
      }
      return ret
    },
    pullManualSpellgroupsFromFirebase() {
      const manualSpellgroupRef = query(collection(db, 'Ability/Base/Spellgroup'))
      onSnapshot(
        manualSpellgroupRef,
        (snap) => {
          const len = snap.docs.length
          let count = 0
          snap.docs.forEach(async (doc) => {
            count++
            this.manualSpellgroups[doc.data().name] = { ...doc.data(), source: 'Base' }
          })
        },
        (err) => {
          console.log(err.message)
        }
      )
    },
    setCharacterSpellgroupsFromFirebase(spells: any) {
      this.spellgroups = spells
    },
    buildSpellsObj(spells: Array<any>) {
      const spellsObj: any = {}
      spells.forEach((spell) => {
        spellsObj[spell.name] = spell
      })
      return spellsObj
    },
    setLocalSpell(spell: any) {
      this.spellgroups[spell.spellgroup].spells[spell.name] = spell
    },
    setLocalSpellgroup(spellgroup: string) {
      this.spellgroups[spellgroup] = { ...this.manualSpellgroups[spellgroup], spells: {} }
    },
    async setSpell(spell: any) {
      console.log(spell.groupNumber)
      if (!this.spellgroups[spell.spellgroup]) {
        this.setLocalSpellgroup(spell.spellgroup)
        //set all rank zeros
        for (let i = 0; i < this.buildDisplaySpellgroups[spell.groupNumber].spells.length; i++) {
          if (this.buildDisplaySpellgroups[spell.groupNumber].spells[i].rank == 0) {
            this.setLocalSpell({
              ...this.buildDisplaySpellgroups[spell.groupNumber].spells[i],
              known: true
            })
            updateDoc(
              doc(
                db,
                'User/' +
                  useUserStore().getUserId +
                  '/Character/' +
                  useCharacterStore().getCharacterId
              ),
              {
                spells: this.spellgroups,
                spellChanged: {
                  ...this.buildDisplaySpellgroups[spell.groupNumber].spells[i],
                  known: true
                }
              }
            )
          } else {
            break
          }
        }
      }
      this.setLocalSpell(spell)
      await updateDoc(
        doc(
          db,
          'User/' + useUserStore().getUserId + '/Character/' + useCharacterStore().getCharacterId
        ),
        { spells: this.spellgroups, spellChanged: spell }
      )
    },
    async removeSpell(spell: any) {
      this.setLocalSpell(spell)
      delete this.spellgroups[spell.spellgroup].spells[spell.name]
      if (
        Object.values(this.spellgroups[spell.spellgroup].spells).reduce(
          (acc, spell: any) => acc + spell.rank,
          0
        ) == 0
      ) {
        Object.values(this.spellgroups[spell.spellgroup].spells).forEach((spell: any) => {
          updateDoc(
            doc(
              db,
              'User/' +
                useUserStore().getUserId +
                '/Character/' +
                useCharacterStore().getCharacterId
            ),
            { spellChanged: { ...spell, known: false } }
          )
        })
        delete this.spellgroups[spell.spellgroup]
      }

      await updateDoc(
        doc(
          db,
          'User/' + useUserStore().getUserId + '/Character/' + useCharacterStore().getCharacterId
        ),
        { spells: this.spellgroups, spellChanged: spell }
      )
    }
  },
  persist: true
})
