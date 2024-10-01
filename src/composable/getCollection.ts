import { db } from '@/firebase/config.js'
import { onSnapshot, collection, query, getDocs } from 'firebase/firestore'

export async function getCollection(collectionPath: string) {
  let documents: Array<any> = []
  let error
  let collectionRef = collection(db, collectionPath)
  onSnapshot(
    collectionRef,
    (snap) => {
      let results: Array<any> = []
      snap.docs.forEach((doc) => {
        doc.id && results.push({ ...doc.data(), id: doc.id })
      })
      error = null
      documents = results
      //console.log(results)
      console.log('docs:', documents)
      return documents
    },
    (err) => {
      console.log(err.message)
      error = 'Could not fetch data'
      documents = []
    }
  )
}
export async function getCollectionOnce(collectionPath: string) {
  let documents: Array<any> = []
  let error
  let collectionRef = collection(db, collectionPath)
  const q = query(collectionRef)
  const querySnapshot = await getDocs(q)
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    documents.push({ ...doc.data(), id: doc.id })
  })
  return documents
}
