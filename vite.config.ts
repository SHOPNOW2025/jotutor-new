import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Replaced `process.cwd()` with `'.'` to resolve a TypeScript error where `cwd` was not found on the `process` type.
  // The `loadEnv` function will still resolve environment files from the project root.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    server: {
      allowedHosts: true
    },
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'import.meta.env.VITE_MASTERCARD_GATEWAY_URL': JSON.stringify(env.MASTERCARD_GATEWAY_URL || 'https://ap.gateway.mastercard.com')
    }
  }
})
