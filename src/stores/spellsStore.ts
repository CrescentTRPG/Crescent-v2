import { db } from '@/firebase/config.js'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc
} from 'firebase/firestore'
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
            id: '',
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
        id: '',
        duration: 'Instantaneous',
        source: 'Base',
        spellgroup: '',
        grouping: 'Intelligence',
        groupIcon: ''
      }
    ]
  }),
  actions: {
    setUpBuildDisplay() {
      const ret: Array<any> = []
      const spells: Array<any> = []

      let counter = 0
      Object.values(this.manualSpellgroups).forEach((spellgroup: any) => {
        const ObjSpells: Array<any> = []
        const obj = {
          spells: [{}],
          index: counter,
          id: this.spellgroups[spellgroup.name]?.id || '',
          source: spellgroup.source,
          name: spellgroup.name,
          groupPurchaseLimiter: spellgroup.groupPurchaseLimiter,
          rankLimiter: spellgroup.rankLimiter,
          manaGain: spellgroup.manaGain,
          groupIcon: spellgroup.groupIcon,
          baseCost: spellgroup.baseCost
        }
        spellgroup.spells.forEach((spell: ManualSpell) => {
          const known = this.isSpellKnown(spell, spellgroup.name)
          spells.push({
            ...spell,
            actionCost: spell.action_cost,
            known: known,
            grouping: spellgroup.groupPurchaseLimiter,
            spellgroup: spellgroup.name,
            groupIcon: spellgroup.groupIcon,
            groupPurchaseLimiter: spellgroup.groupPurchaseLimiter,
            source: spellgroup.source
          })
          ObjSpells.push({
            ...spell,
            source: spellgroup.source,
            actionCost: spell.action_cost,
            known: known,
            grouping: spellgroup.groupPurchaseLimiter,
            spellgroup: spellgroup.name,
            groupIcon: spellgroup.groupIcon,
            groupPurchaseLimiter: spellgroup.groupPurchaseLimiter
          })
        })
        obj.spells = ObjSpells
        ret.push(obj)

        counter++
      })
      this.buildDisplaySpellgroups = ret
      this.buildDisplaySpells = spells
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
            this.manualSpellgroups[doc.data().name] = { ...doc.data(), source: 'Base', spells: [] }
            const spellsRef = query(
              collection(db, 'Ability/Base/Spellgroup/' + doc.data().name + '/Spells'),
              orderBy('rank', 'asc')
            )

            const querySnap = await getDocs(spellsRef)
            querySnap.forEach((snapDoc) => {
              this.manualSpellgroups[doc.data().name].spells.push(snapDoc.data())
            })
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
    pullCharacterSpellgroupsFromFirebase() {
      const spellgroupRef = collection(
        db,
        'User/' +
          useUserStore().getUserId +
          '/Character/' +
          useCharacterStore().getCharacterId +
          '/Spellgroups'
      )
      onSnapshot(
        spellgroupRef,
        (snap) => {
          const len = snap.docs.length
          let count = 0
          snap.docs.forEach(async (doc) => {
            count++
            this.spellgroups[doc.data().name] = { ...doc.data(), source: 'Base', id: doc.id }
            const results = await getCollectionOnce(
              'User/' +
                useUserStore().getUserId +
                '/Character/' +
                useCharacterStore().getCharacterId +
                '/Spellgroups/' +
                doc.data().name +
                '/Spells'
            )
            this.spellgroups[doc.data().name].spells = this.buildSpellsObj(results)
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
    buildSpellsObj(spells: Array<any>) {
      const spellsObj: any = {}
      spells.forEach((spell) => {
        spellsObj[spell.name] = spell
      })
      return spellsObj
    },
    async setSpell(spell: any) {
      if (!this.spellgroups[spell.spellgroup]) {
        setDoc(
          doc(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Spellgroups/',
            spell.spellgroup
          ),
          { name: spell.spellgroup }
        )
      }
      let ret
      if (!spell.id) {
        console.log('spooky')
        ret = await addDoc(
          collection(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Spellgroups/' +
              spell.spellgroup +
              '/Spells'
          ),
          spell
        )
      }
      console.log(ret)
    }
  },
  persist: true
})
