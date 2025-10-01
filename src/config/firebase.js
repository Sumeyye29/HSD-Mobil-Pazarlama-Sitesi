import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Environment değişkenlerini kontrol et
const envVars = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Environment değişkenlerini logla (opsiyonel)
console.log('Firebase Config Check:', {
  apiKey: envVars.apiKey ? '✓' : '✗',
  authDomain: envVars.authDomain ? '✓' : '✗',
  projectId: envVars.projectId ? '✓' : '✗'
});

// Eksik config kontrolü
const missingVars = Object.entries(envVars)
  .filter(([, value]) => !value)  // sadece value lazım
  .map(([key]) => key);


if (missingVars.length > 0) {
  console.error(`Missing Firebase config variables: ${missingVars.join(', ')}`);
}

const firebaseConfig = envVars;

let db;

try {
  // Firebase'i başlat
  const app = initializeApp(firebaseConfig);
  console.log('Firebase initialized successfully');

  // Firestore'u başlat
  db = getFirestore(app);
  console.log('Firestore initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { db };
