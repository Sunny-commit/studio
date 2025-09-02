
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

export const firebaseConfig = {
  projectId: "solveai-q1vac",
  appId: "1:920819692967:web:9a0c0f15dc336b24eeb282",
  storageBucket: "solveai-q1vac.firebasestorage.app",
  apiKey: "AIzaSyBeruVxbuuG4I_KOFLTXtY--XZd9mcdtJQ",
  authDomain: "solveai-q1vac.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "920819692967"
};

// Initialize Firebase for client-side usage
function getClientSideFirebaseApp(): FirebaseApp {
    if (typeof window !== 'undefined') {
        return !getApps().length ? initializeApp(firebaseConfig) : getApp();
    }
    // Return a dummy app for server-side rendering, though it shouldn't be used for auth
    return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

// Export a function to get auth, ensuring it's only called on the client
export function getClientAuth(): Auth {
    return getAuth(getClientSideFirebaseApp());
}
