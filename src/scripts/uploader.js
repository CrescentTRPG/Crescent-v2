var admin = require('firebase-admin')
import { db } from '@/firebase/config.js'
import { useCollection } from '@/composable/useCollection.js'

const path = require('path')
const fs = require('fs')
const directoryPath = path.join(__dirname, 'files')

fs.readdir(directoryPath, function (err, files) {
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }

  files.forEach(function (file) {
    var lastDotIndex = file.lastIndexOf('.')

    var menu = require('./files/' + file)

    menu.forEach(function (obj) {
      const collectionPath = 'Skill/Base/' + file.substring(0, lastDotIndex)

      useCollection(collectionPath, obj)
    })
  })
})
