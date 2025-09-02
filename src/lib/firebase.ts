
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "solveai-q1vac",
  appId: "1:920819692967:web:9a0c0f15dc336b24eeb282",
  storageBucket: "solveai-q1vac.firebasestorage.app",
  apiKey: "AIzaSyBeruVxbuuG4I_KOFLTXtY--XZd9mcdtJQ",
  authDomain: "solveai-q1vac.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "920819692967"
};

let app: FirebaseApp;
let auth: Auth;

// Initialize Firebase only on the client side
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} else if (getApps().length) {
  app = getApp();
  auth = getAuth(app);
}

// @ts-ignore
export { app, auth };
