import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Read from Vite env (prefix: VITE_)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration (only in development)
if (import.meta.env.DEV) {
  const requiredKeys = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  const missingKeys = requiredKeys.filter(key => !import.meta.env[key]);
  
  if (missingKeys.length > 0) {
    console.error('[Firebase] Missing required environment variables:', missingKeys);
    console.error('[Firebase] Please check your .env file or build arguments');
  } else if (!firebaseConfig.apiKey || firebaseConfig.apiKey === 'undefined') {
    console.error('[Firebase] VITE_FIREBASE_API_KEY is undefined or empty');
    console.error('[Firebase] Current value:', import.meta.env.VITE_FIREBASE_API_KEY);
  } else {
    console.log('[Firebase] Configuration loaded successfully');
    console.log('[Firebase] Project ID:', firebaseConfig.projectId);
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configure Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };