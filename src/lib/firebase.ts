// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "solveai-q1vac",
  appId: "1:920819692967:web:9a0c0f15dc336b24eeb282",
  storageBucket: "solveai-q1vac.appspot.com",
  apiKey: "AIzaSyBeruVxbuuG4I_KOFLTXtY--XZd9mcdtJQ",
  authDomain: "solveai-q1vac.firebaseapp.com",
  messagingSenderId: "920819692967",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
