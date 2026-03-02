import { useCollection } from '@/composable/useCollection.js'
import { defineStore } from 'pinia'
import { useUserStore } from './userStore.js'
import { addDoc, collection, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import { useDesignStore } from './designStore.js'
import { useAdventureStore } from './adventureStore.js'
const arr: Array<any> = []

export const usePartyStore = defineStore('party', {
  state: () => ({
    characterRefs: arr,

    characterObjects: {}
  }),
  getters: {},
  actions: {
    async pullCharacterFromFirebase(characterId: string, userId: string) {
      this.characterObjects = {}
      const ref = onSnapshot(doc(db, 'User/' + userId + '/Character/' + characterId), (doc) => {
        const character = {
          id: doc.data()?.id,
          name: doc.data()?.name,
          image: doc.data()?.image,
          details: doc.data()?.details || {},
          archetype: doc.data()?.archetype,
          backstory: doc.data()?.backstory || '',
          motivation: doc.data()?.motivation,
          totalAbilityPoints: doc.data()?.totalAbilityPoints,
          originSkills: doc.data()?.originSkills,
          adventure: doc.data()?.adventure,
          condition: doc.data()?.condition,
          attributes: doc.data()?.attributes,
          exceptionals: doc.data()?.exceptionals,
          traits: doc.data()?.traits || {},
          currentHp: doc.data()?.currentHp || 0,
          barrierHp: doc.data()?.barrierHp || 0,
          showNewPlayerGuide:
            doc.data()?.showNewPlayerGuide === undefined ? true : doc.data()?.showNewPlayerGuide,
          currentMana: doc.data()?.currentMana || 0,
          statusEffects: doc.data()?.statusEffects || {},
          customStatusEffects: doc.data()?.customStatusEffects || {},
          perkGain: doc.data()?.perkGain || ['', '', '', '', ''],
          equipment: doc.data()?.equipment || {
            coins: {
              '0': { name: 'Copper', amount: 0, exchangeRate: 10, num: 0 },
              '1': { name: 'Silver', amount: 0, exchangeRate: 10, num: 1 },
              '2': { name: 'Gold', amount: 0, exchangeRate: 10, num: 2 },
              '3': { name: 'Platninum', amount: 0, exchangeRate: 10, num: 3 }
            },
            wornArmor: '',
            primaryHand: '',
            secondaryHand: '',
            attunedItems: [],
            items: {
              Generic: {},
              Armor: {},
              Shield: {},
              Weapon: {},
              Ingredient: {},
              Potion: {}
            }
          },
          effigies: doc.data()?.effigies || {},
          hpStatusModifiers: doc.data()?.hpStatusModifiers || {},
          manaStatusModifiers: doc.data()?.manaStatusModifiers || {},
          arcaneBattery: doc.data()?.arcaneBattery || 0,
          spellgroups: doc.data()?.spells || {},
          spellChanged: doc.data()?.spellChanged,
          martialPerks: doc.data()?.perks || {},
          perkChanged: doc.data()?.perkChanged,
          specializationChanged: doc.data()?.specializationChanged,
          combatStyleChanged: doc.data()?.combatStyleChanged,
          performanceStyleChanged: doc.data()?.performanceStyleChanged,
          skillChanged: doc.data()?.skillChanged,
          combatStyles: doc.data()?.combatStyles,
          specializations: doc.data()?.specializations,
          skills: doc.data()?.skills,
          armorsWithAbilities: doc.data()?.armorsWithAbilities || [''],
          genericsWithAbilities: doc.data()?.genericsWithAbilitites || [''],
          weaponsWithAbilities: doc.data()?.weaponsWithAbilitites || [''],
          shieldsWithAbilities: doc.data()?.shieldsWithAbilitites || [''],
          practicedStyles: doc.data()?.practicedStyles,
          performanceStyles: doc.data()?.performanceStyles,
          overviewValues: doc.data()?.overviewValues || {},
          armorStatusModifiers: doc.data()?.armorStatusModifiers || {},
          design: {
            primaryTheme: doc.data()?.design.primaryTheme,
            secondaryTheme: doc.data()?.design.secondaryTheme,
            inputBacking: doc.data()?.design.inputBacking,
            sidebarBacking: doc.data()?.design.sidebarBacking,
            sidebarText: doc.data()?.design.sidebarText,
            inputText: doc.data()?.design.inputText,
            primaryText: doc.data()?.design.primaryText,
            pageBackdrop: doc.data()?.design.pageBackdrop,
            alertTheme: doc.data()?.design.alertTheme,
            font: doc.data()?.design.font,
            titleFont: doc.data()?.design.titleFont,
            icon: doc.data()?.design.icon,
            charIcon: doc.data()?.design.charIcon,
            charIconFlair: doc.data()?.design.charIconFlair,
            iconFill: doc.data()?.design.iconFill,
            iconColor: doc.data()?.design.iconColor
          }
        }
        this.characterObjects[characterId] = character
      })
      const refs: Array<any> = ref ? [ref].concat(this.characterRefs) : this.characterRefs
      this.characterRefs = refs
    },
    unsubscribeFromCharacters() {
      Object.values(this.characterRefs).forEach((a) => {
        if (a != null) {
          a()
        }
      })
      this.characterRefs = []
    },
    delay(time: number) {
      return new Promise((resolve) => setTimeout(resolve, time))
    },
    addBasicStatus(status, statusObj, id, userId) {
      this.characterObjects[id].statusEffects[status] = statusObj
      this.updateStatusEffects(this.characterObjects[id].statusEffects, userId, id)
    },
    addCustomStatus(statusObj, id, userId) {
      if (!this.characterObjects[id].customStatusEffects) {
        this.characterObjects[id].customStatusEffects = {}
      }
      this.characterObjects[id].customStatusEffects[statusObj.name] = statusObj
      this.updateCustomStatusEffects(this.characterObjects[id].customStatusEffects, userId, id)
    },
    removeStatus(name, id, userId) {
      delete this.characterObjects[id].statusEffects[name]
      this.updateStatusEffects(this.characterObjects[id].statusEffects, userId, id)
    },
    removeCustomStatus(name, id, userId) {
      delete this.characterObjects[id].customStatusEffects[name]
      this.updateCustomStatusEffects(this.characterObjects[id].customStatusEffects, userId, id)
    },
    async updateStatusEffects(statusEffects, userId, charId) {
      const ret = updateDoc(doc(db, 'User/' + userId + '/Character/' + charId), {
        statusEffects: statusEffects
      })
    },

    async updateCustomStatusEffects(statusEffects, userId, charId) {
      const ret = updateDoc(doc(db, 'User/' + userId + '/Character/' + charId), {
        customStatusEffects: statusEffects
      })
    },
    inviteUserToAddCharacter(userId: string) {
      const invite = {
        adventureName: useAdventureStore().name,
        adventureId: useAdventureStore().id,
        gameMasterId: useUserStore().id,
        gameMasterDisplayName: useUserStore().displayName
      }
      try {
        addDoc(collection(db, 'User/' + userId + '/Invites'), invite)
      } catch (e) {
        alert(e)
      }
      alert('Invitation Sent!')
    },
    async subscribeToCharacter(characterId) {
      const ret = await useCollection(
        'User/' + useUserStore().getUserId + '/Character',
        characterId
      )
    }
  },
  persist: true
})
