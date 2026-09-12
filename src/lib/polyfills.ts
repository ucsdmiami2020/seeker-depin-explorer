/**
 * Runtime polyfills required by @solana/web3.js on React Native.
 * Imported first from index.ts, before expo-router/entry, so every screen sees them.
 *
 * - crypto.getRandomValues: needed for keypair/nonce generation (native only; the browser has it).
 * - Buffer: web3.js assumes the Node global.
 */
import { Platform } from 'react-native';
import { Buffer } from 'buffer';

if (Platform.OS !== 'web') {
  require('react-native-get-random-values');
}

const g = globalThis as unknown as { Buffer?: typeof Buffer };
if (!g.Buffer) g.Buffer = Buffer;
