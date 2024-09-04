// Import the functions you need from the SDKs you need
//import { getAnalytics } from 'firebase/analytics'

// eslint-disable-next-line no-unused-vars
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD84e3sDUXcDlMJuIHzwejhDh1TrFq7A-g',
  authDomain: 'crescent-d61ff.firebaseapp.com',
  projectId: 'crescent-d61ff',
  storageBucket: 'crescent-d61ff.appspot.com',
  messagingSenderId: '868181633993',
  appId: '1:868181633993:web:afdffc3f2396c6c972d618',
  measurementId: 'G-MGD34XDLBR'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
//const analytics = getAnalytics(app)

const auth = getAuth(app)

export { auth, app, db }
