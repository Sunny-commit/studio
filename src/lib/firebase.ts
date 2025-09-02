
'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "solveai-q1vac",
  appId: "1:920819692967:web:9a0c0f15dc336b24eeb282",
  storageBucket: "solveai-q1vac.firebasestorage.app",
  apiKey: "AIzaSyBeruVxbuuG4I_KOFLTXtY--XZd9mcdtJQ",
  authDomain: "solveai-q1vac.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "920819692967"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
