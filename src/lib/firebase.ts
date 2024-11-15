import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBTkZ3Oueak1fmKZComYgEISOlPS0iranw",
  authDomain: "apex-prototype.firebaseapp.com",
  projectId: "apex-prototype",
  storageBucket: "apex-prototype.firebasestorage.app",
  messagingSenderId: "229407541168",
  appId: "1:229407541168:web:7d760fd34d249a8a89b875",
  measurementId: "G-3RZ74J0P70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);