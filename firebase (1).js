import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// These values are public identifiers, safe to keep in the app.
const firebaseConfig = {
  apiKey: "AIzaSyCFejtyWyF1zKuqlfMwvY1xag0C13FlpLU",
  authDomain: "learnup-26f32.firebaseapp.com",
  projectId: "learnup-26f32",
  storageBucket: "learnup-26f32.firebasestorage.app",
  messagingSenderId: "901344032987",
  appId: "1:901344032987:web:bf8a90b2d637984508f4fe",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
