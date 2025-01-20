import { db } from '@/firebase/config.js'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
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
  name: string
  source: string
}

export const useMartialPerksStore = defineStore('martialPerk', {
  state: () => ({
    perkGain: ['', '', '', '', ''],
    martialPerks: {},
    manualMartialPerks: {},
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
    setUpBuildDisplayFromScratch() {
      const perks: Array<any> = []
      let index = 0

      Object.values(this.manualMartialPerks)
        .sort((a: any, b: any) => {
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
        })
        .forEach((martialPerk: any) => {
          perks.push({
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
            perkGroup: martialPerk.perkGroup,
            perkIndex: index
          })
          index += 1
        })
      this.buildDisplayMartialPerks = perks
    },
    setUpBuildDisplay(perkChanged) {
      if (this.buildDisplayMartialPerks.length > 1) {
        if (perkChanged != undefined && perkChanged.name) {
          this.buildDisplayMartialPerks[perkChanged.perkIndex].known = perkChanged.known
        }
      } else {
        this.setUpBuildDisplayFromScratch()
      }
    },
    clearBuildDisplay() {
      this.buildDisplayMartialPerks = []
    },
    setManualMartialPerksFromFirebase(perks) {
      this.manualMartialPerks = perks
    },
    pullManualMartialPerksFromFirebase() {
      const manualMartialPerksRef = doc(db, 'Ability/Base')
      onSnapshot(
        manualMartialPerksRef,
        (snap) => {
          this.manualMartialPerks = snap.data()?.perks
        },
        (err) => {
          console.log(err.message)
        }
      )
    },
    setCharacterMartialPerksFromFirebase(perks: any) {
      this.martialPerks = perks
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
    setLocalPerk(perk: any) {
      this.martialPerks[perk.name] = perk
    },
    async setMartialPerk(perk: any) {
      if (perk.known) {
        this.setLocalPerk(perk)
      } else {
        delete this.martialPerks[perk.name]
        this.resolvePerkGain(perk)
      }
      await updateDoc(
        doc(
          db,
          'User/' + useUserStore().getUserId + '/Character/' + useCharacterStore().getCharacterId
        ),
        { perks: this.martialPerks, perkChanged: perk }
      )
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
