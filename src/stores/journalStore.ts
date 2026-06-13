import { defineStore } from 'pinia'
import _ from 'lodash'
import { useCollection } from '@/composable/useCollection.js'
import { useAdventureStore } from './adventureStore.js'
import { collection, getDoc, updateDoc, doc, deleteDoc, DocumentSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config.js'
import LinkedEntries from '@/components/Journal/LinkedEntries.vue'
import { resolve } from 'path'
import { Holiday, Section } from '@/bases.js'
import { useCharacterStore } from './characterStore.ts'
import { useUserStore } from './userStore.ts'

export const useJournalStore = defineStore('journal', {
  state: () => ({
    entryMap: {
      entryIds: ['aaaa']
    },
    journalIdKey: {
      //id: {name: name, linkedEntries: {}, linkedBy: {}}
    },
    openFileUnsavedChanges: false,
    bookmarkedEntries: {},
    toast: '',
    showToast: false,
    calendar: {
      days: {},
      sections: { 0: {}, names: ['month'] },
      dateFormula: '',
      miniPickerFormula: '',
      organizedBy: 'month',
      itemsInARow: 7,
      titleSectionFormula: '',
      holidays: {}
    },
    currentDate: 0,
    currentYear: 1,
    localCalendarChanges: false,
    openFolders: [''],
    selectedFolderPath: '',
    openFile: { id: '' }
  }),
  getters: {
    getHoldiays(context) {
      return Object.values(context.calendar.holidays)
    },
    getFolderDisplay(context) {
      return getFolderArrayFromNestedFolders(context.entryMap, '', [])
    },
    getFullDateArr(context) {
      let arr = []
      const sections = Object.keys(this.calendar.sections).filter((a) => a != 'names')
      let i = 1
      Object.values(this.calendar.sections[sections.length - 1]).forEach((section: any) => {
        //getArr(section)
        const obj = {}
        obj[sections.length - 1] = section.key
        arr = arr.concat(
          getDateArr(context.calendar.sections, section, sections.length - 1, [], obj)
        )
        i++
      })
      return arr.map((item: any, i) => ({ ...item, index: i }))
    },
    getSectionedDateArr() {
      const arr = []
      this.calendar.sections
      return ''
    }
  },
  actions: {
    openFolder(folderPath) {
      this.openFolders.push(folderPath)
    },
    editHolidays(holidays) {
      this.calendar.holidays = holidays
      this.localCalendarChanges = true
    },
    saveBookmarkedEntry(entry) {
      this.bookmarkedEntries[entry.id] = entry
    },
    removeBookmarkedEntry(id) {
      delete this.bookmarkedEntries[id]
    },
    setCurrentDateFromFirebase(date, year) {
      this.currentDate = date
      this.currentYear = year
    },
    setCurrentDate(date, year) {
      this.currentDate = date
      this.currentYear = year
      updateDoc(
        doc(
          db,
          'User/' + useAdventureStore().gameMasterId + '/Adventure/' + useAdventureStore().id
        ),
        { currentDate: date, currentYear: year }
      )
    },
    setOpenFileFromBookmark(entry, isCharacter) {
      if (this.openFile.id) {
        this.closeOpenFile(isCharacter)
      }
      this.updateOpenFile(entry, isCharacter)
    },
    deleteFolder(path, name, isCharacter) {
      const entryMapCopy = { ...this.entryMap }
      this.removeFolderAtPath(path, name, entryMapCopy)
      this.pushEntryMapToFirestore(isCharacter)
    },
    async updateCalendar(newCal) {
      this.localCalendarChanges = true

      this.calendar = newCal
    },
    clearOpenFileAndBookmarks() {
      this.openFile = { id: '' }
      this.bookmarkedEntries = {}
    },
    closeFolder(folderPath) {
      const cp = this.openFolders.filter((path) => !path.includes(folderPath))
      this.openFolders = cp
    },
    createFolderAtPathWithTheseFiles(folders: Array<string>, name: string, ref, interiorFolderRef) {
      if (folders.length < 1) {
        ref[name] = interiorFolderRef
      } else {
        const newStart: string = folders.shift() || ''
        this.createFolderAtPathWithTheseFiles(folders, name, ref[newStart], interiorFolderRef)
      }
    },
    updateOpenFile(file, isCharacter) {
      this.openFileUnsavedChanges = true
      this.openFile = file
      if (Object.keys(this.bookmarkedEntries).includes(this.openFile.id)) {
        console.log('hi')
        this.saveBookmarkedEntry(this.openFile)
      }
      console.log('here instead')

      this.updateJournalIDKeyItem(file.id, file)
    },
    async openNewFileFromObj(file, isCharacter) {
      this.updateFile(this.openFile, isCharacter)
      this.updateOpenFile({ ...file, id: file.id }, isCharacter)
    },
    async openNewFile(fileId, isCharacter) {
      console.log(fileId, 'openNew')
      if (fileId !== this.openFile.id) {
        if (this.openFile.id) {
          this.updateFile(this.openFile, isCharacter)
        }
        let file
        if (isCharacter) {
          file = doc(
            db,
            'User/' +
              useUserStore().id +
              '/Character/' +
              useCharacterStore().id +
              '/Journal/' +
              fileId
          )
        } else {
          file = doc(
            db,
            'User/' +
              useAdventureStore().gameMasterId +
              '/Adventure/' +
              useAdventureStore().id +
              '/Journal/' +
              fileId
          )
        }
        const ret = (await getDoc(file)) as DocumentSnapshot

        ret && this.updateOpenFile({ ...ret.data(), id: ret.id }, isCharacter)
      }
    },
    async getFile(fileId, isCharacter) {
      let file
      console.log(fileId, 'getFile')

      if (isCharacter) {
        file = doc(
          db,
          'User/' +
            useUserStore().id +
            '/Character/' +
            useCharacterStore().id +
            '/Journal/' +
            fileId
        )
      } else {
        file = doc(
          db,
          'User/' +
            useAdventureStore().gameMasterId +
            '/Adventure/' +
            useAdventureStore().id +
            '/Journal/' +
            fileId
        )
      }
      const ret = await getDoc(file)
      return ret.data()
    },
    saveCalendarToDatabase(isCharacter) {
      this.localCalendarChanges = false
      let file

      if (isCharacter) {
        file = updateDoc(
          doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().id),
          {
            calendar: this.calendar
          }
        )
      } else {
        file = updateDoc(
          doc(
            db,
            'User/' + useAdventureStore().gameMasterId + '/Adventure/' + useAdventureStore().id
          ),
          {
            calendar: this.calendar
          }
        )
      }
    },

    setCalendarFromDatabase(cal) {
      console.log(cal)
      this.calendar = cal
    },
    closeOpenFile(isCharacter) {
      if (Object.keys(this.bookmarkedEntries).includes(this.openFile.id)) {
        this.saveBookmarkedEntry(this.openFile)
      }
      this.openFileUnsavedChanges = false
      this.pushEntryMapToFirestore(isCharacter)
      const ret = this.updateFile(this.openFile, isCharacter)
      this.openFile = { id: '' }
      return ret
    },
    autoSaveOpenFile(isCharacter) {
      this.pushEntryMapToFirestore(isCharacter)

      this.updateFile(this.openFile, isCharacter)
    },
    updateJournalIDKeyItem(id, item) {
      this.journalIdKey[id] = {
        name: item.name,
        type: item.type,
        linkedEntries: item.linkedEntries,
        linkedBy: { ...item.linkedBy, ...this.journalIdKey[id]?.linkedBy },
        tags: item.tags,
        shared: item.shared,
        id: id
      }
    },
    updateJournalIDKeyLinkedBy(linkedId, linkingId, realtion) {
      this.journalIdKey[linkedId].linkedBy[linkingId] = { id: linkingId, relationship: realtion }
    },
    deleteJournalIDKeyLinkedBy(linkedId, linkingId) {
      delete this.journalIdKey[linkedId].linkedBy[linkingId]
    },
    deleteJournalIDKeyItem(id) {
      delete this.journalIdKey[id]
    },
    async postFile(file, path, isCharacter) {
      let ret
      if (isCharacter) {
        ret = await useCollection(
          'User/' + useUserStore().id + '/Character/' + useCharacterStore().id + '/Journal',
          file
        )
      } else {
        ret = await useCollection(
          'User/' +
            useAdventureStore().gameMasterId +
            '/Adventure/' +
            useAdventureStore().id +
            '/Journal',
          file
        )
      }

      ret && this.updateJournalIDKeyItem(ret.id, file)
      ret && this.openNewFileFromObj({ ...file, id: ret.id }, isCharacter)
      ret && this.updateEntryMapWithNewFile(ret.id, path, isCharacter)
    },
    async deleteFileFromFirebase(fileId, isCharacter) {
      this.openFile = { id: '' }
      console.log(fileId)

      if (isCharacter) {
        await deleteDoc(
          doc(
            db,
            'User/' +
              useUserStore().id +
              '/Character/' +
              useCharacterStore().id +
              '/Journal/' +
              fileId
          )
        )
      } else {
        await deleteDoc(
          doc(
            db,
            'User/' +
              useAdventureStore().gameMasterId +
              '/Adventure/' +
              useAdventureStore().id +
              '/Journal/' +
              fileId
          )
        )
      }

      this.removeAllReferencesToId(fileId, isCharacter)
    },
    async removeAllReferencesToId(id, isCharacter) {
      this.deleteJournalIDKeyItem(id)
      this.removeIdFromAllLinkedBy(id)
      this.removeBookmarkedEntry(id)
      removeFileFromEntryMapRecursively(id, this.entryMap)
      this.pushEntryMapToFirestore(isCharacter)
    },

    async removeIdFromAllLinkedBy(id) {
      Object.keys(this.journalIdKey).forEach(
        (keyId) => delete this.journalIdKey[keyId].linkedBy[id]
      )
    },
    async updateFile(file, isCharacter) {
      const val = false
      let ret
      if (file.id) {
        console.log(file.id, 'update')

        if (isCharacter) {
          ret = await updateDoc(
            doc(
              db,
              'User/' +
                useUserStore().id +
                '/Character/' +
                useCharacterStore().id +
                '/Journal/' +
                file.id
            ),
            file
          ).then(async () => {
            this.toast = 'Saved file: "' + file.name + '" in database!'
            this.showToast = true
            this.openFileUnsavedChanges = false

            await delay(1000)

            this.showToast = false
          })
        } else {
          ret = await updateDoc(
            doc(
              db,
              'User/' +
                useAdventureStore().gameMasterId +
                '/Adventure/' +
                useAdventureStore().id +
                '/Journal/' +
                file.id
            ),
            file
          ).then(async () => {
            this.toast = 'Saved file: "' + file.name + '" in database!'
            this.showToast = true
            this.openFileUnsavedChanges = false

            await delay(1000)

            this.showToast = false
          })
        }
      }
      return val
    },
    setEntryMapFromFirebase(entryMap) {
      this.entryMap = entryMap
    },
    setJournalIdKeyFromFirebase(journalIdKey) {
      this.journalIdKey = journalIdKey
    },
    updateEntryMapWithNewFile(id, path, isCharacter) {
      const pathArr = path ? path.split('\\') : []
      const ref = this.getFolderRef(pathArr, this.entryMap)
      ref.entryIds.push(id)
      this.pushEntryMapToFirestore(isCharacter)
    },
    async pushEntryMapToFirestore(isCharacter) {
      if (isCharacter) {
        await updateDoc(
          doc(db, 'User/' + useUserStore().id + '/Character/' + useCharacterStore().id),
          { entryMap: this.entryMap, journalIdKey: this.journalIdKey }
        )
      } else {
        await updateDoc(
          doc(
            db,
            'User/' + useAdventureStore().gameMasterId + '/Adventure/' + useAdventureStore().id
          ),
          { entryMap: this.entryMap, journalIdKey: this.journalIdKey }
        )
      }
    },
    createNewFolder(path, isCharacter) {
      let folderName = 'New Folder'
      const pathArr = path ? path.split('\\') : []
      const ref = this.getFolderRef(pathArr, this.entryMap)
      const folders = Object.keys(ref)
      let i = 2
      while (folders.includes(folderName)) {
        if (folderName.includes('(')) {
          folderName = folderName.substring(0, folderName.indexOf('(') + 1) + i + ')'
          i++
        } else {
          folderName += '(1)'
        }
      }
      ref[folderName] = { entryIds: [] }
      this.pushEntryMapToFirestore(isCharacter)
    },
    changeFolderName(oldpath, newPath, name, oldName, isCharacter) {
      const newFolders = newPath.split('\\')
      newFolders.pop()
      const interiorFolderRef = this.getFolderRef(oldpath.split('\\'), _.cloneDeep(this.entryMap))
      this.createFolderAtPathWithTheseFiles(newFolders, name, this.entryMap, interiorFolderRef)
      this.removeFolderAtPath(oldpath.split('\\'), oldName, this.entryMap)
      this.pushEntryMapToFirestore(isCharacter)
    },
    deleteFile(path, index, isCharacter) {
      removeFromEntryMapRecursively(path.split('\\'), index, this.entryMap)
      this.pushEntryMapToFirestore(isCharacter)
    },
    moveFolder(folders, name, destinationFolders, ids, isCharacter) {
      let canProceed = true
      if (destinationFolders.length > folders.length) {
        //check if its being put into it own child
        for (let i = 0; i < folders.length; i++) {
          if (destinationFolders[i] === name && folders[i] === name) {
            alert('You cannot move a folder into a folder inside of itself!')
            canProceed = false
          }
          if (destinationFolders[i] != folders[i]) {
            break
          }
        }
      }
      if (canProceed) {
        const entryMapCopy = { ...this.entryMap }
        const foldersCopy = JSON.parse(JSON.stringify(folders))
        const interiorFolderRef = this.getFolderRef(foldersCopy, _.cloneDeep(this.entryMap))
        interiorFolderRef.entryIds = ids
        this.removeFolderAtPath(folders, name, entryMapCopy)
        this.createFolderAtPathWithTheseFiles(
          destinationFolders,
          name,
          entryMapCopy,
          interiorFolderRef
        )
        this.entryMap = entryMapCopy
        this.pushEntryMapToFirestore(isCharacter)
      }
    },
    getFolderRef(folders, ref) {
      if (folders.length < 1) {
        return ref
      } else {
        const newStart = folders.shift()
        return this.getFolderRef(folders, ref[newStart])
      }
    },
    removeFolderAtPath(folders, name, ref) {
      if (folders.length < 2) {
        delete ref[name]
      } else {
        const newStart = folders.shift()
        this.removeFolderAtPath(folders, name, ref[newStart])
      }
    },
    moveFile(newPath, oldPath: string, id: string, index: number, isCharacter) {
      const entryMapCopy = { ...this.entryMap }
      if (oldPath) {
        const arr = oldPath.split('\\')
        removeFromEntryMapRecursively(arr, index, entryMapCopy)
      } else {
        entryMapCopy.entryIds.splice(index, 1)
      }
      if (newPath) {
        const arr = newPath.split('\\')
        addToEntryMapRecursively(arr, id, entryMapCopy)
      } else {
        entryMapCopy.entryIds.push(id)
      }
      this.entryMap = entryMapCopy
      this.pushEntryMapToFirestore(isCharacter)
    }
  },
  persist: true
})

function removeFromEntryMapRecursively(folders, index, ref) {
  if (folders.length < 1) {
    ref.entryIds.splice(index, 1)
  } else {
    const newStart = folders.shift()
    removeFromEntryMapRecursively(folders, index, ref[newStart])
  }
}

function removeFileFromEntryMapRecursively(fileId, ref) {
  const entries = Object.keys(ref)
  entries.forEach((entry) => {
    if (entry === 'entryIds') {
      const index = ref.entryIds.indexOf(fileId)
      if (index >= 0) {
        ref.entryIds.splice(index, 1)
      }

      return true
    } else {
      removeFileFromEntryMapRecursively(fileId, ref[entry])
    }
  })
}

function addToEntryMapRecursively(folders, id, ref) {
  if (folders.length < 1) {
    ref.entryIds.push(id)
  } else {
    const newStart = folders.shift()
    addToEntryMapRecursively(folders, id, ref[newStart])
  }
}

function getFolderArrayFromNestedFolders(folder: any, currentPath: string, cumul: Array<string>) {
  const folders = Object.keys(folder).filter((name) => name !== 'entryIds')
  if (folders.length < 1) {
    if (!cumul.includes(currentPath) && currentPath != '') cumul.push(currentPath)
    return cumul
  } else {
    folders.forEach((name) => {
      if (Object.keys(folder[name]).filter((name) => name !== 'entryIds').length > 0)
        cumul.push(getNewPath(currentPath, name))
      getFolderArrayFromNestedFolders(folder[name], getNewPath(currentPath, name), cumul)
    })
  }
  return cumul
}
function getNewPath(currentPath, name): string {
  if (!currentPath) {
    return name
  }
  return currentPath + '\\' + name
}

function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

function getDateArr(allSections, section, index, dateArr, dateObj: {}) {
  if (index === 0) {
    if (section.arrangedVals.length > 0) {
      return section.arrangedVals
    } else {
      const arr: Array<any> = []
      for (let i = 1; i <= section.numSubsections; i++) {
        const date = { ...dateObj, day: i }
        arr.push(date)
      }
      return arr
    }
  } else {
    if (section.arrangedVals.length > 0) {
      section.arrangedVals.forEach((key) => {
        const obj = _.cloneDeep(dateObj)
        obj[index - 1] = key
        dateArr = dateArr.concat(
          getDateArr(allSections, allSections[index - 1][key], index - 1, dateArr, obj)
        )
      })
    } else {
      for (let i = 1; i <= section.numSubsections; i++) {
        const obj = _.cloneDeep(dateObj)
        obj[index - 1] = i
        dateArr = dateArr.concat(
          getDateArr(allSections, allSections[index - 1][i], index - 1, dateArr, obj)
        )
      }
    }
  }
  return dateArr
}
