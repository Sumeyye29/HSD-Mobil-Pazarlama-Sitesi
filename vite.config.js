import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Environment değişkenlerini yükle
  const env = loadEnv(mode, process.cwd(), '')
  
  // Environment değişkenlerini kontrol et
  console.log('Environment variables loaded:', {
    VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY ? 'exists' : 'missing',
    VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN ? 'exists' : 'missing',
    VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID ? 'exists' : 'missing'
  })

  return {
    plugins: [react()],
    // Sadece gerekli environment değişkenlerini tanımla
    define: {
      'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
      'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN),
      'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID),
      'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET),
      'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID),
      'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID)
    }
  }
})