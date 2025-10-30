// Import the required Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration (keep as-is from your Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyAIfHAADkFetBGWuEfdniK3-xqzKCkyqrA",
  authDomain: "karigarsetu.firebaseapp.com",
  projectId: "karigarsetu",
  storageBucket: "karigarsetu.firebasestorage.app",
  messagingSenderId: "518096117495",
  appId: "1:518096117495:web:a614379facd82ed4197df2",
  measurementId: "G-MB9M9HC65L"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

// Optional: analytics (won't run on server-side)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, auth, db, analytics };
