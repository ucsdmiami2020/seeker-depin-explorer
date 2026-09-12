/**
 * Read-only Solana RPC access.
 *
 * The app never holds a private key: signing happens in the user's wallet app over Mobile
 * Wallet Adapter (see src/state/WalletProvider.tsx). Everything here is a public-data read
 * of an address the user chose to connect.
 */
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { tokensByMint, type DePinToken } from '../data/tokens';

export type Cluster = 'mainnet-beta' | 'devnet';

/** MWA chain identifiers, per the Mobile Wallet Adapter spec. */
export const CHAIN_FOR_CLUSTER: Record<Cluster, `solana:${string}`> = {
  'mainnet-beta': 'solana:mainnet',
  devnet: 'solana:devnet',
};

const DEFAULT_RPC: Record<Cluster, string> = {
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
};

/** SPL Token and Token-2022 program ids — both hold balances we want to read. */
const TOKEN_PROGRAM_IDS = [
  new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
  new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'),
];

/**
 * A custom endpoint can be supplied at build time with EXPO_PUBLIC_SOLANA_RPC (e.g. a Helius
 * URL, since the public endpoints are heavily rate-limited). HTTPS only: the app ships with
 * usesCleartextTraffic=false, and an http:// endpoint would fail at runtime anyway.
 */
export function isValidRpcUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    return u.protocol === 'https:' && !u.username && !u.password;
  } catch {
    return false;
  }
}

export function rpcUrl(cluster: Cluster): string {
  const override = process.env.EXPO_PUBLIC_SOLANA_RPC;
  if (override && isValidRpcUrl(override)) return override;
  return DEFAULT_RPC[cluster];
}

export function getConnection(cluster: Cluster): Connection {
  return new Connection(rpcUrl(cluster), 'confirmed');
}

export async function fetchSolBalance(connection: Connection, owner: PublicKey): Promise<number> {
  const lamports = await connection.getBalance(owner);
  return lamports / LAMPORTS_PER_SOL;
}

export interface TokenHolding {
  mint: string;
  amount: number;
  /** Set when the mint is one of the catalog's DePIN networks. */
  token?: DePinToken;
}

/**
 * Every non-zero SPL balance the address holds, with catalog DePIN tokens resolved.
 * Returns DePIN holdings first, then the rest (largest balance first within each group).
 */
export async function fetchTokenHoldings(connection: Connection, owner: PublicKey): Promise<TokenHolding[]> {
  const responses = await Promise.all(
    TOKEN_PROGRAM_IDS.map((programId) => connection.getParsedTokenAccountsByOwner(owner, { programId })),
  );

  const byMint = new Map<string, number>();
  for (const response of responses) {
    for (const { account } of response.value) {
      const info = (account.data as { parsed?: { info?: Record<string, any> } }).parsed?.info;
      const mint: string | undefined = info?.mint;
      const amount: number | undefined = info?.tokenAmount?.uiAmount ?? undefined;
      if (!mint || !amount || amount <= 0) continue;
      byMint.set(mint, (byMint.get(mint) ?? 0) + amount);
    }
  }

  const holdings: TokenHolding[] = [...byMint.entries()].map(([mint, amount]) => ({
    mint,
    amount,
    token: tokensByMint.get(mint),
  }));

  return holdings.sort((a, b) => {
    if (!!a.token !== !!b.token) return a.token ? -1 : 1;
    return b.amount - a.amount;
  });
}

/** 7Xy4…9fGh — addresses are too long to show in full on a phone. */
export function shortAddress(address: string, lead = 4, tail = 4): string {
  return address.length <= lead + tail + 1 ? address : `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

export function formatAmount(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(2)}K`;
  if (amount >= 1) return amount.toFixed(2);
  return amount.toPrecision(3);
}
