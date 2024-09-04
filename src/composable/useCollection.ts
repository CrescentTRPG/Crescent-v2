import { db } from '@/firebase/config.js'
import { collection, setDoc, doc, addDoc, updateDoc } from 'firebase/firestore'

async function add(error: string | null, collectionPath: string, document: any) {
  error = null
  try {
    return addDoc(collection(db, collectionPath), document)
  } catch (err: any) {
    console.log(err.message)
    error = 'Could not add document'
  }
}

async function set(error: string | null, collectionPath: string, document: any) {
  error = null
  try {
    return setDoc(doc(db, collectionPath, document.id), document)
  } catch (err: any) {
    console.log(err.message)
    error = 'Could not add document'
  }
}

export async function useCollection(path: string, document) {
  let error = null
  if (path.split('/').length % 2 === 0) {
    return await set(error, path, document)
  }
  return await add(error, path, document)
}

export async function updateDocument(path: string, data: any) {
  try {
    return updateDoc(doc(db, path), data)
  } catch (err: any) {
    console.log(err.message)
  }
}
