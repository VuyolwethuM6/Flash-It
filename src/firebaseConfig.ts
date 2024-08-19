// src/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkZwjrVGAwHiBVT1cEurmP7XzzqptJ8F8",
  authDomain: "flashit-fast.firebaseapp.com",
  projectId: "flashit-fast",
  storageBucket: "flashit-fast.appspot.com",
  messagingSenderId: "394225868475",
  appId: "1:394225868475:web:3bdd11ebfcd31d2dd8539e",
  measurementId: "G-JR9BMCJ454"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, auth, analytics };
