import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Firebase config from environment variables (VITE_ prefix = exposed to client)
// Set these on your VPS (e.g., in /etc/environment or .env at build time)
// Never commit real values to Git
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DB_ID || '(default)',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const app = initializeApp(firebaseConfig);
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)') 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Error signing in with Google:', error);
    if (error.code === 'auth/unauthorized-domain') {
      throw new Error("This domain is not authorized for OAuth operations. Please add your custom domain (e.g., repairbill.shop) to the Authorized Domains list in the Firebase Console (Authentication > Settings > Authorized domains).");
    }
    if (error.code === 'auth/internal-error' || error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
      throw new Error("Login failed. If you are on a custom domain, ensure it is added to Firebase Authentication > Authorized Domains. Otherwise, your browser may be blocking the popup.");
    }
    throw error;
  }
}

// Connection verification removed to prevent false startup error banners.

