// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDO2RlEcmPntAFwmVaRAu-X73Xvz10-taM",
  authDomain: "clothing-vastra.firebaseapp.com",
  projectId: "clothing-vastra",
  storageBucket: "clothing-vastra.firebasestorage.app",
  messagingSenderId: "472119335488",
  appId: "1:472119335488:web:683a48c080c3cd4da79da5",
  measurementId: "G-574TKVN9CD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;