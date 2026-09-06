# Seeker DePIN Explorer

A modern, interactive field guide to the physical hardware that plugs into Solana — built for the **Solana Seeker** (and any Android phone) with Expo / React Native.

**What's in v1 (catalog-only, no wallet required)**

- 10 devices across 5 categories: Seeker, Saga, CUDIS Ring, BrushO toothbrush, Helium Mobile Indoor/Outdoor, Helium IoT (LoRaWAN), Hivemapper Bee, GEODNET base station, XNET CBRS radio
- Explore tab: hero stats, search, category chips, Featured / Newest / Price sort, favourites filter
- Device detail: gradient hero, price + release card, specs table, "How you earn", timeline, network card, vendor links, related devices, share sheet
- Compare tab: pick up to 3 devices → side-by-side overview and aligned spec table
- Networks tab: the 7 DePIN protocols behind the devices, expandable with their devices and links
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

> This app has no native modules beyond Expo's, so it also runs in **Expo Go** on Android for quick previews:
> `npx expo start` → scan the QR with Expo Go. For dApp Store submission you still need a real APK (below).

Web preview (handy for design iteration): `npx expo start --web`.

## Project layout

```
app/                     expo-router routes
  _layout.tsx            Stack + providers
  (tabs)/                Explore · Compare · Networks · About
  device/[id].tsx        Device detail screen
src/
  data/devices.ts        ← the catalog. Add a device here and it appears everywhere.
  data/networks.ts       DePIN networks
  data/types.ts          Device / Network types
  components/            DeviceCard + small UI primitives
  state/AppState.tsx     Favourites + compare selection (in-memory)
  theme.ts               Colours, spacing, type scale
```

### Adding a device

Append an object to `src/data/devices.ts` that satisfies the `Device` type. Icons are glyph names from
`@expo/vector-icons` (`MaterialCommunityIcons` or `Ionicons`) — no product imagery is bundled, on purpose.
Prices are strings; the Explore "Price" sort parses the first `$number` it finds.

## Building a signed APK for the Solana dApp Store

The dApp Store wants a release APK signed with **your** keystore (not Play App Signing).

**Option A — local Gradle build**

```bash
npx expo prebuild --platform android          # generates android/
# put your keystore in android/app/ and add signingConfigs.release to android/app/build.gradle
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

**Option B — EAS Build** (config in `eas.json`, all profiles output `.apk`)

```bash
npm i -g eas-cli && eas login
eas build -p android --profile production
```

Then follow Solana Mobile's publishing flow:

```bash
mkdir publishing && cd publishing
npx @solana-mobile/dapp-store-cli init
# edit config.yaml (publisher, app, release: point release.files at your APK, add screenshots/icon)
npx dapp-store validate
npx dapp-store create publisher -k <keypair.json>
npx dapp-store create app -k <keypair.json>
npx dapp-store create release -k <keypair.json> -b <path-to-android-sdk-build-tools>
npx dapp-store publish submit -k <keypair.json> -u <mainnet-rpc-url> --requestor-is-authorized --complies-with-solana-dapp-store-policies
```

Docs: https://docs.solanamobile.com/dapp-publishing/overview

Android package id is `com.srblife.seekerdepinexplorer` (change in `app.json` before your first release — it's permanent per dApp Store listing).

## Roadmap → v2 (wallet integration)

The catalog is deliberately decoupled from any wallet code, so adding Mobile Wallet Adapter is additive:

1. `npx expo install @solana-mobile/mobile-wallet-adapter-protocol-web3js @solana-mobile/mobile-wallet-adapter-protocol @solana/web3.js react-native-get-random-values buffer`
2. Add a `WalletProvider` next to `AppStateProvider` using `transact()` from MWA for authorize / sign.
3. On device detail, query the connected wallet for the device's NFT collection / token mint and show an "Owned ✓" badge.
4. Test against the Mock MWA Wallet: https://github.com/solana-mobile/mock-mwa-wallet
5. Seed Vault signing needs a **custom dev build** (`npx expo run:android`), not Expo Go.

## Data accuracy

Specs and prices were gathered from vendor sites and press coverage in September 2026 and are vendor list prices at that time; each device links to the vendor for the live number. Token rewards are network-dependent and not guaranteed. Not affiliated with Solana Mobile or any listed vendor.

## Tooling notes

- Expo SDK 57 · React Native 0.86 · React 19 · expo-router 57 · TypeScript strict
- `npx tsc --noEmit` passes clean.
- `npx expo export --platform web` produces a static site; a React hydration notice (#418) can appear in the browser console from safe-area insets during static hydration — it does not affect Android.
