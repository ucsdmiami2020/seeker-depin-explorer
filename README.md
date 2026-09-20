# Seeker DePIN Explorer

[![CI](https://github.com/ucsdmiami2020/seeker-depin-explorer/actions/workflows/ci.yml/badge.svg)](https://github.com/ucsdmiami2020/seeker-depin-explorer/actions/workflows/ci.yml)

A modern, interactive field guide to the physical hardware that plugs into Solana — built for the **Solana Seeker** (and any Android phone) with Expo / React Native.

**What's in v1.1 (wallet optional, no account)**

- 16 devices across 7 categories: Seeker, Saga, CUDIS Ring, BrushO toothbrush, Helium Mobile Indoor/Outdoor, Helium IoT (LoRaWAN), Hivemapper Bee, GEODNET base station, XNET CBRS radio, WeatherXM D1, Wingbits WB200, onocoy Onolink, Roam Rainier MAX60, NATIX VX360, Starpower Starplug
- **Wallet tab (Mobile Wallet Adapter)** — connect Phantom / Solflare / Backpack or Seed Vault, read SOL and SPL balances from mainnet or devnet, see which of the catalog's DePIN networks you already hold, and sign an off-chain ownership proof. The app never sees a private key and never builds or submits a transaction.
- **Guided tour and help centre** — a six-step interactive tour opens on first launch explaining what the app is for, how the adoption score is built and what the wallet does; a floating help button reopens the full guide at any time. The tour state is held in memory only, so nothing is written to the device.
- **Adoption confidence score (0–10)** on every device — five evidence-based factors (tenure, installed base, independent reviews, community, reward track record) with the evidence shown in-app, a tier badge (Established / Growing / Early / Very new), sort + filter on Explore, a Compare row, and a methodology screen. Data lives in `src/data/adoption.ts`; rubric in `src/lib/adoption.ts`.
- Welcome screen on launch introducing devices, networks and adoption signals
- Explore tab: hero stats, search, category chips, Featured / Newest / Price sort, favourites filter
- Device detail: gradient hero, price + release card, specs table, "How you earn", timeline, network card, vendor links, related devices, share sheet, and a holdings badge when your wallet holds that network's token
- Compare tab: pick up to 3 devices → side-by-side overview and aligned spec table
- Networks tab: the 13 DePIN networks behind the devices, expandable with their devices and links
- Dark Solana-themed UI, haptics on Android, typed routes via expo-router

## Quick start

```bash
# Node 20+ recommended. Yarn or npm both work.
npm install

# Run on an Android emulator (API 34+, arm64 image) or a Seeker over USB
npx expo run:android

# Or start Metro and open it in a dev build
npx expo start
```

> Mobile Wallet Adapter needs a real Android build with a wallet app installed — it does **not** work in Expo Go or on
> web, where the Wallet tab explains why and the rest of the catalog keeps working.

Web preview (handy for design iteration): `npx expo start --web`.

### Solana RPC endpoint

Balances are read from the public endpoints by default. They are heavily rate-limited, so for a demo or a release set
your own HTTPS endpoint (Helius, Triton, QuickNode…) at build time:

Local run (PowerShell):

```powershell
$env:EXPO_PUBLIC_SOLANA_RPC = "https://your-endpoint.example.com"; npx expo run:android
```

EAS cloud builds do **not** receive variables from your shell. Store the endpoint in EAS once; the `dapp-store` profile in `eas.json` reads the `production` environment:

```bash
eas env:set --name EXPO_PUBLIC_SOLANA_RPC --value https://your-endpoint.example.com --environment production --visibility plaintext
```

Non-HTTPS endpoints, or URLs with embedded credentials, are rejected (`src/lib/solana.ts`).

## Project layout

```
app/                     expo-router routes
  _layout.tsx            Stack + providers (AppState, Wallet)
  index.tsx              Redirects / to the welcome screen
  welcome.tsx            Launch screen → Enter Explorer
  (tabs)/                Explore · Compare · Networks · Wallet · About
  device/[id].tsx        Device detail screen
src/
  data/devices.ts        ← the catalog. Add a device here and it appears everywhere.
  data/adoption.ts       Adoption-confidence evidence per device (edit here to re-score)
  data/networks.ts       DePIN networks
  data/tokens.ts         Verified SPL mints per network (used to label balances)
  data/types.ts          Device / Network types
  components/            DeviceCard, AdoptionBadge/Panel + small UI primitives
  lib/adoption.ts        Scoring rubric, tiers
  lib/allowlist.ts       HTTPS host allow-list for outbound links
  lib/solana.ts          RPC config + read-only balance queries
  lib/polyfills.ts       crypto.getRandomValues + Buffer, for @solana/web3.js
  state/AppState.tsx     Favourites + compare selection (in-memory)
  state/WalletProvider.tsx  Mobile Wallet Adapter session (in-memory)
  theme.ts               Colours, spacing, type scale
```

> Because `app/index.tsx` owns `/`, navigate to the tabs with `/(tabs)`, not `/` (which lands on the welcome screen).

### Adding a device

Append an object to `src/data/devices.ts` that satisfies the `Device` type. Icons are glyph names from
`@expo/vector-icons` (`MaterialCommunityIcons` or `Ionicons`) — no product imagery is bundled, on purpose.
Prices are strings; the Explore "Price" sort parses the first `$number` it finds.

### Adding a token mint

`src/data/tokens.ts` maps SPL mints to catalog networks. Only add a mint you have verified against an authoritative
source — `npm test` asserts every mint is canonical base58, unique, and points at a real network, and that every
network is either tracked or explicitly listed in `UNTRACKED_NETWORK_IDS`. A wrong mint means showing someone the
wrong balance.

## Security & store readiness

- `SECURITY-REVIEW.md` — findings, fixes and accepted risks (MASVS-L1 oriented), plus the v1.1 wallet addendum.
- `docs/DAPP_STORE_SUBMISSION.md` — step-by-step checklist, listing copy, asset table.
- `HACKATHON.md` — Clock In hackathon requirements, status and the on-device test checklist.
- `store-assets/` — 512 px icon, 1200×600 banner, nine 1080×2340 screenshots.
- `docs/privacy-policy.md`, `docs/terms-of-use.md`, `docs/copyright.md` — host these (GitHub Pages is fine) and paste the URLs into the publisher portal. They mirror `PUBLISHER` and the texts in `src/data/legal.ts`; keep both in sync.
- `npm test` runs the outbound-link allow-list and token-map tests; `npm run audit` checks runtime dependencies.

Hardening applied: HTTPS-only host allow-list + Custom Tabs for every external link, HTTPS-only RPC, no key material in
the app, no transaction construction, `allowBackup=false`, `usesCleartextTraffic=false`, only INTERNET + VIBRATE
permissions, R8/resource shrinking, real release signing via `plugins/withReleaseSigning.js`, root error boundary,
custom not-found route, in-app legal screens and reward disclaimers.

## Building a signed APK

The dApp Store wants a release APK signed with a key used **only** for the dApp Store (not Play App Signing).

**Option A — EAS Build** (config in `eas.json`, all profiles output `.apk`; no local JDK / Android SDK needed)

```bash
npm i -g eas-cli && eas login
eas build -p android --profile dapp-store
```

**Option B — local Gradle build** (needs JDK 17 + Android SDK)

```bash
npx expo prebuild --platform android --clean   # generates android/ (git-ignored)
cp keystore.properties.example android/keystore.properties && $EDITOR android/keystore.properties
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
apksigner verify --print-certs app/build/outputs/apk/release/app-release.apk   # must NOT say CN=Android Debug
```
`plugins/withReleaseSigning.js` wires the keystore into the release build type (and fails prebuild if it can't); without it Expo's template would sign the release APK with the debug key, which the dApp Store rejects.

Then publish through the Solana dApp Publisher Portal (full checklist in `docs/DAPP_STORE_SUBMISSION.md`):

1. Create a publisher account at https://publish.solanamobile.com and complete KYC/KYB identity verification.
2. Connect the publisher wallet (permanent for this app, ~0.2 SOL) and choose a storage provider (ArDrive recommended).
3. **New dApp** → listing details, assets, legal URLs → **New Version** → upload the APK → approve the upload and NFT mint transactions.

Later releases can also be submitted with the portal-backed CLI (`@solana-mobile/dapp-store-cli`, using a portal API key and the publisher keypair).

Docs: https://docs.solanamobile.com/dapp-store/intro

Android package id is `com.srblife.seekerdepinexplorer` (change in `app.json` before your first release — it's permanent per dApp Store listing).

## Roadmap → v2

1. Reward history per device, read from each network's on-chain programs.
2. Operator-verified reviews, gated by the ownership proof the Wallet tab already produces.
3. Device NFT / collection detection for networks that mint one per unit.
4. Live token prices from a public price API.

Test MWA against the Mock MWA Wallet when you have no funded wallet: https://github.com/solana-mobile/mock-mwa-wallet

## Data accuracy

Specs and prices were gathered from vendor sites and press coverage in September 2026 and are vendor list prices at that time; each device links to the vendor for the live number. Token rewards are network-dependent and not guaranteed. Balances shown in the Wallet tab come from public RPC and may be delayed or incomplete. Not affiliated with Solana Mobile or any listed vendor.

## Licence

© 2026 Rene Chacon. All rights reserved — see `LICENSE`.

## Tooling notes

- Expo SDK 57 · React Native 0.86 · React 19 · expo-router 57 · TypeScript strict
- MWA 2.3 · @solana/web3.js 1.99
- `npm run typecheck` (tsc strict) and `npm test` pass clean; `expo prebuild` manifest verified.
- `npx expo export --platform web` produces a static site; a React hydration notice (#418) can appear in the browser console from safe-area insets during static hydration — it does not affect Android.
