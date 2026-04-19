import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your app's Firebase project configuration
// These values can be found in your Firebase Project Settings
const firebaseConfig = {
  apiKey: "AIzaSyBP2cOy_Ue25O5fS7y1sB_9k9RZGSzvygY",
  authDomain: "ai-powered-resume-checker.firebaseapp.com",
  projectId: "ai-powered-resume-checker",
  storageBucket: "ai-powered-resume-checker.firebasestorage.app",
  messagingSenderId: "274024189197",
  appId: "1:274024189197:web:dd6dcbd6624ccaa3a9f444"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
