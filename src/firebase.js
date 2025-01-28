import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  onSnapshot // <-- Added here
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAvulHPrRZoa5AY8kKil8_yQyXLzdEXcLE",
  authDomain: "pivotframeworks.firebaseapp.com",
  projectId: "pivotframeworks",
  storageBucket: "pivotframeworks.appspot.com",
  messagingSenderId: "1018229086412",
  appId: "1:1018229086412:web:da27fc1bb4045190514a69"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  onSnapshot // <-- Exported here
};