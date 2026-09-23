/**
 * Content for the Security tab.
 *
 * Written for developers and programme managers evaluating the app: what the threat model is,
 * which controls are actually enforced in code, and what is knowingly accepted. Every claim here
 * must correspond to something real in the repository — if a control is removed, remove the claim.
 *
 * Last reviewed: 2026-09-21. The version badge is read from the app config at runtime.
 */
import type { IconSet } from './types';

export const REVIEW = {
  date: '21 September 2026',
  standard: 'OWASP MASVS-L1',
  repo: 'https://github.com/ucsdmiami2020/seeker-depin-explorer',
};

export type ControlState = 'enforced' | 'accepted' | 'planned';

export interface Control {
  title: string;
  detail: string;
  state: ControlState;
  /** Where to look in the repository. */
  where?: string;
}

export interface ControlGroup {
  id: string;
  icon: { set: IconSet; name: string };
  title: string;
  summary: string;
  controls: Control[];
}

/** The four claims a reviewer most wants to check, shown as headline cards. */
export const POSTURE = [
  { label: 'Private keys held', value: 'None', note: 'Signing happens inside your wallet app' },
  { label: 'Transactions built', value: 'Zero', note: 'No code path can move funds' },
  { label: 'Data collected', value: 'None', note: 'No accounts, analytics, ads or crash SDKs' },
  { label: 'Android permissions', value: 'Two', note: 'INTERNET and VIBRATE only' },
];

export const THREAT_MODEL = {
  inScope: [
    'A malicious app on the same device launching our deep links or impersonating a wallet',
    'Hostile or compromised data in the catalog turning into an unsafe outbound link',
    'A hostile RPC endpoint returning malformed or oversized responses',
    'Anyone inspecting the shipped APK: its manifest, permissions and bundled strings',
    'Supply-chain risk in the Expo, React Native and Solana dependency trees',
  ],
  outOfScope: [
    'A rooted or already-compromised device',
    'The security of the wallet app the user chooses',
    'Vendor websites opened in the browser',
    'Solana network or RPC provider availability',
  ],
};

export const GROUPS: ControlGroup[] = [
  {
    id: 'keys',
    icon: { set: 'ion', name: 'key-outline' },
    title: 'Key material and signing',
    summary: 'The app is designed so that losing it loses nothing.',
    controls: [
      {
        title: 'No private keys, ever',
        detail:
          'The app never holds, requests or stores a seed phrase or private key. Mobile Wallet Adapter hands off to your wallet app (or Seed Vault on a Seeker), which signs and returns only a public result.',
        state: 'enforced',
        where: 'src/state/WalletProvider.tsx',
      },
      {
        title: 'Off-chain signing only',
        detail:
          'Only authorize, deauthorize and signMessages are implemented. The app builds no transaction and calls no send method, so no code path can move funds even if it were compromised.',
        state: 'enforced',
        where: 'src/state/WalletProvider.tsx',
      },
      {
        title: 'Authorisation kept in memory',
        detail:
          'The wallet address and auth token live in React state and are cleared on disconnect or app close. Nothing is written to disk, so nothing can be recovered from a backup or by another app.',
        state: 'enforced',
      },
      {
        title: 'Ownership proof is not an auth token',
        detail:
          'The signed statement includes the address, cluster and timestamp, but no server nonce or domain binding. It demonstrates control of an address; it is not suitable as a login credential until SIWS-style binding is added.',
        state: 'accepted',
      },
    ],
  },
  {
    id: 'network',
    icon: { set: 'ion', name: 'globe-outline' },
    title: 'Network and outbound links',
    summary: 'Every destination is decided at build time, never by data.',
    controls: [
      {
        title: 'HTTPS-only host allow-list',
        detail:
          'Outbound links are parsed with the WHATWG URL parser and checked against a fixed host list. Non-HTTPS URLs, embedded credentials and suffix spoofs such as helium.com.evil.io are rejected before the OS ever sees them.',
        state: 'enforced',
        where: 'src/lib/allowlist.ts',
      },
      {
        title: 'Links open in Chrome Custom Tabs',
        detail:
          'Vendor pages render in the browser sandbox with a visible URL bar, not in an in-app WebView. The app has no WebView at all, so no page can reach app internals.',
        state: 'enforced',
        where: 'src/lib/links.ts',
      },
      {
        title: 'Cleartext traffic disabled',
        detail:
          'usesCleartextTraffic is false in the manifest, so no plain HTTP request can succeed from the app process even if a dependency attempts one.',
        state: 'enforced',
        where: 'app.json',
      },
      {
        title: 'RPC endpoint is build-time only',
        detail:
          'The Solana RPC URL is a compile-time constant validated as HTTPS with no embedded credentials. It can never be set by a link, a deep link or catalog data.',
        state: 'enforced',
        where: 'src/lib/solana.ts',
      },
      {
        title: 'The RPC provider sees your address',
        detail:
          'Reading balances necessarily reveals the connected address and your IP to the RPC provider. This is disclosed in the privacy policy and is inherent to reading a public chain without running your own node.',
        state: 'accepted',
      },
    ],
  },
  {
    id: 'input',
    icon: { set: 'ion', name: 'enter-outline' },
    title: 'Untrusted input',
    summary: 'Anything arriving from outside the app is treated as hostile.',
    controls: [
      {
        title: 'Deep links resolve to known routes only',
        detail:
          'Any app can launch seekerdepin:// links. Route parameters are coerced to strings and looked up by exact id; unknown ids show a recovery screen instead of rendering attacker-supplied text.',
        state: 'enforced',
        where: 'app/device/[id].tsx, app/legal/[doc].tsx',
      },
      {
        title: 'Not-found screen never echoes the path',
        detail:
          'The stock unmatched-route screen prints the incoming URL, which for a deep link is attacker-controlled text inside a trusted app. It is replaced with a screen that shows no path at all.',
        state: 'enforced',
        where: 'app/+not-found.tsx',
      },
      {
        title: 'Token balances matched by mint address',
        detail:
          'Any token can claim any symbol on-chain. Balances are labelled only when the mint matches a curated list verified against a public token registry, so a fake "HNT" cannot impersonate the real one.',
        state: 'enforced',
        where: 'src/data/tokens.ts',
      },
      {
        title: 'Wallet error text is constrained',
        detail:
          'Messages returned by another app are mapped to known error codes and truncated before display, so a hostile app cannot render arbitrary phishing text inside our UI.',
        state: 'enforced',
        where: 'src/state/WalletProvider.tsx',
      },
      {
        title: 'Search is a local filter',
        detail:
          'Typed text never leaves the device and is used only for in-memory string matching. There is no query language, no backend and no injection surface.',
        state: 'enforced',
      },
    ],
  },
  {
    id: 'build',
    icon: { set: 'mci', name: 'package-variant-closed' },
    title: 'Build and distribution',
    summary: 'What ships is what was reviewed.',
    controls: [
      {
        title: 'Release signed with a dedicated key',
        detail:
          'A config plugin wires a release keystore used only for the dApp Store, never a Play key. The build fails loudly if the signing config does not land, so a debug-signed release cannot ship by accident.',
        state: 'enforced',
        where: 'plugins/withReleaseSigning.js',
      },
      {
        title: 'No over-the-air code updates',
        detail:
          'expo-updates is not installed, so the APK cannot fetch and run new JavaScript. The reviewed build is the running build until a new APK is submitted.',
        state: 'enforced',
      },
      {
        title: 'Minimal permissions, backup disabled',
        detail:
          'Thirteen permissions inherited from libraries are force-removed at manifest-merge time, leaving INTERNET and VIBRATE. allowBackup is false, so no future state can leak into a Google backup.',
        state: 'enforced',
        where: 'app.json',
      },
      {
        title: 'Code shrinking and resource stripping',
        detail: 'R8 and resource shrinking run on release builds, reducing both size and unused code paths.',
        state: 'enforced',
      },
      {
        title: 'Continuous verification',
        detail:
          'Every push runs a strict TypeScript check plus unit tests that assert every catalog URL is allow-listed and every token mint is canonical, on the same Node and npm versions as the release build.',
        state: 'enforced',
        where: '.github/workflows/ci.yml',
      },
    ],
  },
  {
    id: 'supply',
    icon: { set: 'mci', name: 'source-branch' },
    title: 'Supply chain',
    summary: 'Fewer dependencies, each one accounted for.',
    controls: [
      {
        title: 'Lockfile pinned to the build image',
        detail:
          'package-lock.json is generated with the same npm version the build servers use, so the dependency graph resolved in CI is the one that ships.',
        state: 'enforced',
      },
      {
        title: 'Three known transitive advisories',
        detail:
          'Two denial-of-service parsing issues and one buffer-bounds issue reach the tree through Expo Router and web3.js. All three are reachable only via local CPU or a hostile RPC response, with no data or key material at risk. Re-checked on every dependency change.',
        state: 'accepted',
      },
      {
        title: 'No analytics, ads or crash SDKs',
        detail:
          'The app bundles no third-party service that phones home, which removes an entire class of data-leak and supply-chain risk.',
        state: 'enforced',
      },
    ],
  },
];

/** Stated plainly so nobody mistakes the coverage for more than it is. */
export const LIMITS: string[] = [
  'The wallet connect and signing flows have been exercised on an Android emulator with a mock wallet, not yet on Seeker hardware.',
  'Seed Vault behaviour can only be verified on a real Seeker device.',
  'No third-party penetration test or independent audit has been commissioned.',
  'The review covers this repository, not the wallets, vendor sites or RPC providers it talks to.',
];
