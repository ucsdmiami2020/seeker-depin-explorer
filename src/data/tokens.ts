/**
 * SPL mints for the DePIN networks in the catalog.
 *
 * Every mint below was checked against Jupiter's verified token list
 * (https://lite-api.jup.ag/tokens/v2/search) on 2026-09-12 — symbol, name and `isVerified`.
 * Mints are only listed when the verified entry unambiguously matches the network in
 * `src/data/networks.ts`; guessing a mint would mean showing someone the wrong balance.
 *
 * Deliberately NOT listed (no verified mint that clearly maps to the network):
 *   BrushO (BRUSH), Wingbits (WINGS), Starpower (STAR)
 * `UNTRACKED_NETWORK_IDS` keeps that visible in the UI instead of silently showing nothing.
 */
export interface DePinToken {
  /** Base58 SPL mint address. */
  mint: string;
  symbol: string;
  name: string;
  /** id of the network in src/data/networks.ts */
  networkId: string;
}

export const DEPIN_TOKENS: readonly DePinToken[] = [
  { mint: 'SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3', symbol: 'SKR', name: 'Seeker', networkId: 'solana-mobile' },
  { mint: 'hntyVP6YFm1Hg25TN9WGLqM12b8TQmcknKrdu1oxWux', symbol: 'HNT', name: 'Helium Network Token', networkId: 'helium' },
  { mint: 'mb1eu7TzEc71KxDpsmsKoucSSuuoGLv1drys1oP2jh6', symbol: 'MOBILE', name: 'Helium Mobile', networkId: 'helium' },
  { mint: 'iotEVVZLEywoTn1QdwNPddxPWszn3zFhEot3MfL9fns', symbol: 'IOT', name: 'Helium IOT', networkId: 'helium' },
  { mint: 'CudisfkgWvMKnZ3TWf6iCuHm8pN2ikXhDcWytwz6f6RN', symbol: 'CUDIS', name: 'CUDIS', networkId: 'cudis' },
  { mint: '4vMsoUT2BWatFweudnQM1xedRLfJgJ7hswhcpz4xgBTy', symbol: 'HONEY', name: 'Hivemapper HONEY', networkId: 'hivemapper' },
  { mint: '7JA5eZdCzztSfQbJvS8aVVxMFfd81Rs9VvwnocV1mKHu', symbol: 'GEOD', name: 'Geodnet Token', networkId: 'geodnet' },
  { mint: 'xNETbUB7cRb3AAu2pNG2pUwQcJ2BHcktfvSB8x1Pq6L', symbol: 'XNET', name: 'XNET Mobile', networkId: 'xnet' },
  { mint: 'wxmJYe17a2oGJZJ1wDe6ZyRKUKmrLj2pJsavEdTVhPP', symbol: 'WXM', name: 'WeatherXM', networkId: 'weatherxm' },
  { mint: 'onoyC1ZjHNtT2tShqvVSg5WEcQDbu5zht6sdU9Nwjrc', symbol: 'ONO', name: 'onocoy', networkId: 'onocoy' },
  { mint: 'RoamA1USA8xjvpTJZ6RvvxyDRzNh6GCA1zVGKSiMVkn', symbol: 'ROAM', name: 'Roam Token', networkId: 'roam' },
  { mint: 'FRySi8LPkuByB7VPSCCggxpewFUeeJiwEGRKKuhwpKcX', symbol: 'NATIX', name: 'NATIX Network', networkId: 'natix' },
];

/** Networks in the catalog with no tracked mint — surfaced in the Wallet tab. */
export const UNTRACKED_NETWORK_IDS: readonly string[] = ['brusho', 'wingbits', 'starpower'];

export const tokensByMint: ReadonlyMap<string, DePinToken> = new Map(DEPIN_TOKENS.map((t) => [t.mint, t]));

export function tokensForNetwork(networkId: string): DePinToken[] {
  return DEPIN_TOKENS.filter((t) => t.networkId === networkId);
}
