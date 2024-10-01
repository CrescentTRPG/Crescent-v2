import { db } from '@/firebase/config.js'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore.js'
import { useCharacterStore } from './characterStore.js'

interface ManualMartialPerk {
  name: string
  description: string
  area: string
  resistance: string
  target: string
  type: string
  actionCost: string
  duration: string
  source: string
  perkGroup: string
  rank: number
}

interface ManualMartialPerk {
  id: string
  name: string
  source: string
}

export const useMartialPerksStore = defineStore('martialPerk', {
  state: () => ({
    perkGain: ['', '', '', '', ''],
    martialPerks: {},
    manualMartialPerks: [],
    buildDisplayMartialPerks: [
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
        perkGroup: 'Defensive Perks'
      }
    ]
  }),
  getters: {
    getPerkGain: (state): Array<string> => state.perkGain
  },
  actions: {
    setLocalPerkGain(gain: Array<string>) {
      this.perkGain = gain
    },
    setUpBuildDisplay() {
      this.buildDisplayMartialPerks = this.manualMartialPerks.map(
        (martialPerk: ManualMartialPerk) => ({
          id: this.martialPerks[martialPerk.name]?.id || '',
          name: martialPerk.name,
          description: martialPerk.description,
          rank: martialPerk.rank,
          source: martialPerk.source,
          known: this.martialPerks[martialPerk.name]?.known ? true : false,
          actionCost: martialPerk.actionCost,
          duration: martialPerk.duration,
          type: martialPerk.type,
          target: martialPerk.target,
          resistance: martialPerk.resistance,
          area: martialPerk.area,
          perkGroup: martialPerk.perkGroup
        })
      )
    },
    pullManualMartialPerksFromFirebase() {
      const manualMartialPerksRef = query(
        collection(db, 'Ability/Base/Martial Perk'),
        orderBy('rank', 'asc')
      )
      onSnapshot(
        manualMartialPerksRef,
        (snap) => {
          const results: any = []
          snap.docs.forEach((doc) => {
            results.push({
              name: doc.data().name,
              rank: doc.data().rank,
              description: doc.data().description,
              area: doc.data().area,
              resistance: doc.data().resistance,
              target: doc.data().target,
              type: doc.data().type,
              actionCost: doc.data().action_cost,
              duration: doc.data().duration,
              source: 'Base',
              perkGroup: doc.data().martial_perk_group_name
            })
          })
          this.manualMartialPerks = results
          this.setUpBuildDisplay()
        },
        (err) => {
          console.log(err.message)
        }
      )
    },
    pullCharacterMartialPerksFromFirebase() {
      const collectionRef = collection(
        db,
        'User/' +
          useUserStore().getUserId +
          '/Character/' +
          useCharacterStore().getCharacterId +
          '/Martial Perks'
      )
      onSnapshot(
        collectionRef,
        (snap) => {
          snap.docs.forEach((doc) => {
            this.martialPerks[doc.data().name] = { ...doc.data(), id: doc.id }
          })
          this.setUpBuildDisplay()
        },
        (err) => {
          console.log(err.message)
        }
      )
      this.setUpBuildDisplay()
    },
    async resolvePerkGain(removedPerk: any) {
      if (
        this.perkGain[removedPerk.rank - 1] === '' ||
        (this.perkGain[removedPerk.rank - 1] === 'movespeed' &&
          (removedPerk.perkGroup === 'Supportive Perks' ||
            removedPerk.perkGroup === 'Defensive Perks')) ||
        (this.perkGain[removedPerk.rank - 1] === 'hitpoints' &&
          (removedPerk.perkGroup === 'Offensive Perks' ||
            removedPerk.perkGroup === 'Utility Perks'))
      ) {
        return
      }
      let kill = true
      Object.values(this.martialPerks).forEach((perk: any) => {
        if (perk && perk.rank === removedPerk.rank && perk.name != removedPerk.name) {
          if (
            (removedPerk.perkGroup === 'Utility Perks' ||
              removedPerk.perkGroup === 'Offensive Perks') &&
            (perk.perkGroup === 'Utility Perks' || perk.perkGroup === 'Offensive Perks')
          ) {
            kill = false
            return
          } else if (
            (removedPerk.perkGroup === 'Defensive Perks' ||
              removedPerk.perkGroup === 'Supportive Perks') &&
            (perk.perkGroup === 'Defensive Perks' || perk.perkGroup === 'Supportive Perks')
          ) {
            kill = false
            return
          }
        }
      })
      if (kill) {
        const copy = this.perkGain.slice()
        copy[removedPerk.rank - 1] = ''
        this.setPerkGain(copy)
      }
    },
    async setMartialPerk(perk: any) {
      let ret
      if (perk.id === '') {
        ret = await addDoc(
          collection(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Martial Perks/'
          ),
          perk
        )
        this.martialPerks[perk.name] = { ...perk, id: ret.id }
      } else if (perk.known === false) {
        deleteDoc(
          doc(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Martial Perks/' +
              perk.id
          )
        )
        this.resolvePerkGain(perk)
        this.martialPerks[perk.name] = undefined
      } else {
        ret = updateDoc(
          doc(
            db,
            'User/' +
              useUserStore().getUserId +
              '/Character/' +
              useCharacterStore().getCharacterId +
              '/Martial Perks/' +
              perk.id
          ),
          perk
        )
      }
    },
    async setPerkGain(perkGain: Array<string>) {
      this.setLocalPerkGain(perkGain)
      const ret = updateDoc(
        doc(
          db,
          'User/' + useUserStore().getUserId + '/Character/' + useCharacterStore().getCharacterId
        ),
        { perkGain: perkGain }
      )
    }
  },
  persist: true
})
