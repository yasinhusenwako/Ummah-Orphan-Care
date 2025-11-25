import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Log Firebase config in development
if (import.meta.env.DEV) {
  console.log('Firebase Config:', {
    apiKey: firebaseConfig.apiKey ? '✓ Set' : '✗ Missing',
    authDomain: firebaseConfig.authDomain ? '✓ Set' : '✗ Missing',
    projectId: firebaseConfig.projectId ? '✓ Set' : '✗ Missing',
  });
}

// Initialize Firebase
let app;
let analytics;
let auth;
let db;
let storage;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Analytics might fail in some environments, so wrap it
  try {
    analytics = getAnalytics(app);
  } catch (analyticsError) {
    console.warn('Analytics initialization failed (this is okay):', analyticsError);
  }
  
  if (import.meta.env.DEV) {
    console.log('✓ Firebase initialized successfully');
  }
} catch (error) {
  console.error('✗ Firebase initialization failed:', error);
  throw error;
}

export { app, analytics, auth, db, storage };
