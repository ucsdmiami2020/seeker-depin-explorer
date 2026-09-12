import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { Buffer } from 'buffer';
import { PublicKey } from '@solana/web3.js';
import type { Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import {
  CHAIN_FOR_CLUSTER,
  fetchSolBalance,
  fetchTokenHoldings,
  getConnection,
  type Cluster,
  type TokenHolding,
} from '../lib/solana';
import { PUBLISHER } from '../data/legal';

/**
 * Mobile Wallet Adapter is an Android-only protocol: the app associates with a wallet app
 * installed on the same device. On web and iOS the provider stays inert and the Wallet screen
 * explains why, so the catalog keeps working everywhere.
 */
export const WALLET_AVAILABLE = Platform.OS === 'android';

/** Wallets show this when asking the user to approve. uri/icon are omitted until the site is live. */
const website = PUBLISHER.website.startsWith('https://') ? PUBLISHER.website : undefined;
const APP_IDENTITY = {
  name: 'Seeker DePIN Explorer',
  uri: website,
  icon: website ? 'favicon.png' : undefined,
};

export interface ConnectedAccount {
  /** base58, for display and RPC */
  address: string;
  /** base64, the form MWA expects back */
  addressB64: string;
  label?: string;
}

export interface OwnershipProof {
  statement: string;
  /** base64 ed25519 signature produced by the wallet */
  signature: string;
}

interface WalletState {
  available: boolean;
  cluster: Cluster;
  account: ConnectedAccount | null;
  sol: number | null;
  holdings: TokenHolding[];
  busy: boolean;
  error: string | null;
  proof: OwnershipProof | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  refresh: () => Promise<void>;
  signOwnershipProof: () => Promise<void>;
  selectCluster: (cluster: Cluster) => void;
}

const Ctx = createContext<WalletState | null>(null);

function friendlyError(e: unknown): string {
  const code = (e as { code?: string })?.code;
  if (code === 'ERROR_WALLET_NOT_FOUND') {
    return 'No compatible wallet found on this device. Install Phantom, Solflare or Backpack (or use Seed Vault on a Seeker) and try again.';
  }
  if (code === 'ERROR_ASSOCIATION_CANCELLED') return 'Connection cancelled.';
  const message = e instanceof Error ? e.message : String(e);
  return message || 'Something went wrong talking to the wallet.';
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [cluster, setCluster] = useState<Cluster>('mainnet-beta');
  const [account, setAccount] = useState<ConnectedAccount | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [sol, setSol] = useState<number | null>(null);
  const [holdings, setHoldings] = useState<TokenHolding[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proof, setProof] = useState<OwnershipProof | null>(null);

  /** Reads are plain RPC calls — no wallet round-trip needed. */
  const loadBalances = useCallback(async (address: string, forCluster: Cluster) => {
    const connection = getConnection(forCluster);
    const owner = new PublicKey(address);
    const [solBalance, tokenHoldings] = await Promise.all([
      fetchSolBalance(connection, owner),
      fetchTokenHoldings(connection, owner),
    ]);
    setSol(solBalance);
    setHoldings(tokenHoldings);
  }, []);

  const connect = useCallback(async () => {
    if (!WALLET_AVAILABLE) {
      setError('Wallet connection needs the Android app — Mobile Wallet Adapter is not available here.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { transact } = await import('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
      const result = await transact(async (wallet: Web3MobileWallet) =>
        wallet.authorize({
          identity: APP_IDENTITY,
          chain: CHAIN_FOR_CLUSTER[cluster],
          ...(authToken ? { auth_token: authToken } : {}),
        }),
      );
      const first = result.accounts[0];
      if (!first) throw new Error('The wallet returned no accounts.');
      const address = new PublicKey(Buffer.from(first.address, 'base64')).toBase58();
      setAccount({ address, addressB64: first.address, label: first.label });
      setAuthToken(result.auth_token);
      await loadBalances(address, cluster);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }, [authToken, cluster, loadBalances]);

  const disconnect = useCallback(async () => {
    const token = authToken;
    setAccount(null);
    setAuthToken(null);
    setSol(null);
    setHoldings([]);
    setProof(null);
    setError(null);
    if (!WALLET_AVAILABLE || !token) return;
    try {
      const { transact } = await import('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
      await transact(async (wallet: Web3MobileWallet) => wallet.deauthorize({ auth_token: token }));
    } catch {
      // The local session is already cleared; a failed revoke should not surface as an error.
    }
  }, [authToken]);

  const refresh = useCallback(async () => {
    if (!account) return;
    setBusy(true);
    setError(null);
    try {
      await loadBalances(account.address, cluster);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }, [account, cluster, loadBalances]);

  /**
   * Off-chain message signing (no fee, no transaction): proves the connected address is
   * controlled by this wallet. MWA returns the payload with the 64-byte signature appended.
   */
  const signOwnershipProof = useCallback(async () => {
    if (!account || !WALLET_AVAILABLE) return;
    setBusy(true);
    setError(null);
    try {
      const statement = [
        'Seeker DePIN Explorer ownership proof',
        `Address: ${account.address}`,
        `Cluster: ${cluster}`,
        `Issued: ${new Date().toISOString()}`,
      ].join('\n');
      const payload = new Uint8Array(Buffer.from(statement, 'utf8'));
      const { transact } = await import('@solana-mobile/mobile-wallet-adapter-protocol-web3js');
      const signed = await transact(async (wallet: Web3MobileWallet) => {
        await wallet.authorize({
          identity: APP_IDENTITY,
          chain: CHAIN_FOR_CLUSTER[cluster],
          ...(authToken ? { auth_token: authToken } : {}),
        });
        return wallet.signMessages({ addresses: [account.addressB64], payloads: [payload] });
      });
      const signedPayload = signed[0];
      if (!signedPayload) throw new Error('The wallet returned no signature.');
      const signature = Buffer.from(signedPayload.slice(-64)).toString('base64');
      setProof({ statement, signature });
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setBusy(false);
    }
  }, [account, authToken, cluster]);

  const selectCluster = useCallback(
    (next: Cluster) => {
      setCluster(next);
      setSol(null);
      setHoldings([]);
      setProof(null);
      if (account) {
        setBusy(true);
        loadBalances(account.address, next)
          .catch((e) => setError(friendlyError(e)))
          .finally(() => setBusy(false));
      }
    },
    [account, loadBalances],
  );

  const value = useMemo<WalletState>(
    () => ({
      available: WALLET_AVAILABLE,
      cluster,
      account,
      sol,
      holdings,
      busy,
      error,
      proof,
      connect,
      disconnect,
      refresh,
      signOwnershipProof,
      selectCluster,
    }),
    [
      cluster,
      account,
      sol,
      holdings,
      busy,
      error,
      proof,
      connect,
      disconnect,
      refresh,
      signOwnershipProof,
      selectCluster,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWallet() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useWallet must be used inside WalletProvider');
  return v;
}
