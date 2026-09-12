// Run with: npx tsx src/lib/__tests__/tokens.test.ts
import assert from 'node:assert/strict';
import { PublicKey } from '@solana/web3.js';
import { DEPIN_TOKENS, UNTRACKED_NETWORK_IDS, tokensByMint, tokensForNetwork } from '../../data/tokens';
import { networks } from '../../data/networks';
import { CHAIN_FOR_CLUSTER, isValidRpcUrl, rpcUrl } from '../solana';

// A malformed mint would mean querying the wrong account — or showing someone else's balance.
for (const t of DEPIN_TOKENS) {
  assert.doesNotThrow(() => new PublicKey(t.mint), `invalid mint for ${t.symbol}`);
  assert.equal(new PublicKey(t.mint).toBase58(), t.mint, `mint is not canonical base58: ${t.symbol}`);
}

assert.equal(tokensByMint.size, DEPIN_TOKENS.length, 'duplicate mint in DEPIN_TOKENS');
assert.equal(new Set(DEPIN_TOKENS.map((t) => t.symbol)).size, DEPIN_TOKENS.length, 'duplicate symbol in DEPIN_TOKENS');

// Token -> network wiring must match the catalog, in both directions.
const networkIds = new Set(networks.map((n) => n.id));
for (const t of DEPIN_TOKENS) {
  assert.ok(networkIds.has(t.networkId), `unknown networkId on ${t.symbol}: ${t.networkId}`);
}
for (const id of UNTRACKED_NETWORK_IDS) {
  assert.ok(networkIds.has(id), `unknown networkId in UNTRACKED_NETWORK_IDS: ${id}`);
  assert.equal(tokensForNetwork(id).length, 0, `${id} is listed as untracked but has a mint`);
}
for (const n of networks) {
  const tracked = tokensForNetwork(n.id).length > 0;
  assert.ok(tracked || UNTRACKED_NETWORK_IDS.includes(n.id), `network ${n.id} has no mint and is not listed as untracked`);
}

const rpcCases: [string, boolean][] = [
  ['https://api.mainnet-beta.solana.com', true],
  ['http://api.mainnet-beta.solana.com', false], // no cleartext
  ['https://user:pw@rpc.example.com', false], // credentials in URL
  ['ws://localhost:8900', false],
  ['not a url', false],
];
for (const [u, expected] of rpcCases) assert.equal(isValidRpcUrl(u), expected, `isValidRpcUrl(${u})`);

assert.ok(rpcUrl('mainnet-beta').startsWith('https://'), 'mainnet RPC must be HTTPS');
assert.ok(rpcUrl('devnet').startsWith('https://'), 'devnet RPC must be HTTPS');
assert.equal(CHAIN_FOR_CLUSTER['mainnet-beta'], 'solana:mainnet');
assert.equal(CHAIN_FOR_CLUSTER.devnet, 'solana:devnet');

console.log(`ok — ${DEPIN_TOKENS.length} mints, ${networks.length} networks, ${rpcCases.length} rpc cases`);
