import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "cascadiagame-online.firebaseapp.com",
  projectId: "cascadiagame-online",
  storageBucket: "cascadiagame-online.appspot.com",
  messagingSenderId: "1045295095309",
  appId: "1:1045295095309:web:54163b55aa7d60fc9ebf44"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);