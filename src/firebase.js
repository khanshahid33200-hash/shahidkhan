import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBOw6_PS_KHpc3vJmDlHwmmxIGLoAOURc8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "rb-production-afb2d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "rb-production-afb2d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "rb-production-afb2d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "438884317131",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:438884317131:web:2fa13a3a8fe7565c2ba84e"
};

// Initialize Firebase App for RB PRODUCTION
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default app;
