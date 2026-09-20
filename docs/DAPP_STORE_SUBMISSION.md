# Solana dApp Store submission checklist

Everything below maps to a documented requirement or a known rejection reason. Tick them in order.
Reference: [Submit a New App](https://docs.solanamobile.com/dapp-store/submit-new-app) · [Build and Sign an APK](https://docs.solanamobile.com/dapp-store/build-and-sign-an-apk) · [Publisher Policy](https://legal.solanamobile.com/publisher-policy-web)

Current build: **v1.2.0, versionCode 4** (Mobile Wallet Adapter + read-only on-chain balances, first-run guided tour and in-app help centre).

## A. One-time setup

- [x] **Publisher identity** in `src/data/legal.ts` (`PUBLISHER.name`, `contactEmail`) — Rene Chacon · rchac005@gmail.com. `/docs/*.md` mirror the in-app screens; keep them in sync if you change wording.
- [x] **Website**: https://ucsdmiami2020.github.io/seeker-depin-legal/ (also the MWA app identity shown in wallet approval sheets).
- [x] **Legal documents hosted** at https://ucsdmiami2020.github.io/seeker-depin-legal/ — paste these into the portal:
  - Privacy Policy: https://ucsdmiami2020.github.io/seeker-depin-legal/privacy-policy
  - Terms / EULA: https://ucsdmiami2020.github.io/seeker-depin-legal/terms-of-use
  - Copyright: https://ucsdmiami2020.github.io/seeker-depin-legal/copyright
- [ ] **Choose the final Android package id** in `app.json` (`android.package`). It is permanent once the App NFT is minted and must match the APK on every update.
- [ ] **Release keystore** — a new key used only for the dApp Store (never a Google Play key). Either:
  - let EAS generate and manage it on the first `dapp-store` build, then download a backup with `eas credentials`; or
  - generate your own (needs a JDK for `keytool`; the command below is bash syntax) and upload it to EAS or use it for local Gradle builds:
    ```bash
    mkdir -p keystores
    keytool -genkeypair -v -storetype PKCS12 -keystore keystores/dapp-store-release.jks \
      -alias dappstore -keyalg RSA -keysize 4096 -validity 10000
    ```
    For local builds copy `keystore.properties.example` → `android/keystore.properties` after prebuild and fill it in (git-ignored).

  Back the keystore and passwords up somewhere durable — losing them means you can never update the listing.
- [ ] **Publisher Portal account** at https://publish.solanamobile.com: complete the publisher profile and submit **KYC/KYB identity verification**. The verified identity should match the publisher name above.
- [ ] **Publisher wallet**: a browser-extension Solana wallet (Phantom / Solflare / Backpack) with ~0.2 SOL for storage uploads and NFT mints. It becomes the permanent publisher wallet for this app — without it you cannot submit updates. Keep the seed phrase offline.

## B. Build the release APK

EAS (recommended — no local JDK / Android SDK needed). Run each command on its own line: Windows PowerShell 5.1 does not support `&&`.

```bash
npm ci
npm run typecheck
npm test
eas login
eas env:set --name EXPO_PUBLIC_SOLANA_RPC --value https://your-endpoint --environment production --visibility plaintext
eas build -p android --profile dapp-store
eas credentials
```

- `eas env:set` is needed once, not per build. `eas build` asks to generate a keystore on the first run — answer yes.
- `eas credentials` → Android → dapp-store: download the keystore and store it with its passwords somewhere durable.

or locally (needs JDK 17 + Android SDK):

```bash
npx expo prebuild --platform android --clean
cp keystore.properties.example android/keystore.properties   # then edit
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```

- [ ] **Set the RPC endpoint in EAS, not in your shell.** EAS cloud builds do not receive environment variables from your terminal, so `EXPO_PUBLIC_SOLANA_RPC=… eas build` silently falls back to the public RPC. Use `eas env:set … --environment production` (above); the `dapp-store` profile in `eas.json` reads the `production` environment. The public endpoints are rate-limited, and a reviewer hitting a 429 sees an app that looks broken.
- The two checks below need the Android SDK build-tools (`apksigner`, `aapt`), which EAS does not install on your machine. Without them you can still see the keystore SHA-256 fingerprint in `eas credentials`. In PowerShell, replace `| grep -E "…"` with `| Select-String "package|uses-permission|sdkVersion|targetSdkVersion"`.
- [ ] Verify it is release-signed with **your** key, not debug:
  `apksigner verify --print-certs app-release.apk` (certificate DN must be yours, not `CN=Android Debug`).
- [ ] Verify the manifest: `aapt dump badging app-release.apk | grep -E "package|uses-permission|sdkVersion|targetSdkVersion"` — expect `versionCode='4'` (or higher), `targetSdkVersion:'36'`, and still only `INTERNET` + `VIBRATE` (MWA needs no extra permission).
- [ ] Install on an API 34+ arm64 emulator or a Seeker and run the full device checklist in `HACKATHON.md` — including the wallet flows, which cannot be tested on web.

## C. Listing assets (in `store-assets/`)

| Asset | Requirement | Provided |
|---|---|---|
| App icon | 512×512 PNG, **must match launcher icon** | `icon-512.png` (same artwork as `assets/icon.png`) |
| Banner | 1200×600 PNG/JPG | `banner-1200x600.png` |
| Screenshots | ≥4, min 1080 px, same orientation and aspect ratio, must show real functionality | `screenshot-1…9` at 1080×2340 (portrait). These were captured from the web build and the tab-bar labels are clipped — **retake on an emulator or Seeker, and add the Wallet tab** (connected state + holdings), since it is now a headline feature |
| Feature graphic | 1200×1200 (optional, needed for Editor's choice) | — |

Suggested listing copy:

- **Name:** Seeker DePIN Explorer
- **Short description (≤30 chars):** Explore Solana DePIN hardware
- **Long description:** A field guide to the physical hardware that plugs into Solana — 16 devices across 13 networks, from the Seeker and Saga phones and the CUDIS ring to Helium hotspots, the Hivemapper Bee dashcam, GEODNET and onocoy GNSS stations, XNET radios, WeatherXM weather stations, Wingbits flight trackers and more. Compare specs and prices side by side, check each device's adoption-confidence score, see how it earns, follow each network's timeline, and jump to the vendor. Connect a wallet to see which of those networks you already hold — balances are read straight from Solana, and the app never sees your keys or sends a transaction.
- **Category:** Utilities / Reference (DePIN)
- **Age rating:** Everyone
- **Testing instructions for reviewers:** No login or account required. A six-step guided tour opens automatically on first launch and explains the whole app; the green help button (bottom right of every tab) reopens it. Launch → Enter Explorer → tap any device → tap a vendor link (opens in Chrome Custom Tab). Compare tab: add up to three devices. Wallet tab is optional: tap Connect wallet and approve in Phantom/Solflare/Backpack to see SOL and DePIN token balances — a Devnet toggle is provided so no mainnet funds are needed, and "Sign ownership proof" signs an off-chain message only (no transaction, no fee). About → Legal shows Privacy Policy, Terms, Copyright.
- **What's new (v1.2.0):** A guided tour on first launch, plus a help button on every tab that explains the catalog, the adoption-confidence score and the optional wallet features. Includes the v1.1.0 wallet release: connect via Mobile Wallet Adapter to see which DePIN networks you hold, on mainnet or devnet, and sign an off-chain ownership proof.

## D. Submit (Publisher Portal)

1. Sign in at https://publish.solanamobile.com, connect the publisher wallet, and pick a storage provider (ArDrive recommended — use the cost estimator and top up the prepaid balance first).
2. **Add a dApp → New dApp** → fill metadata, upload icon/banner/screenshots, paste the three legal URLs.
3. App **Home → New Version** → upload `app-release.apk`, add release notes and testing instructions, press **Submit** and approve the storage upload and App/Release NFT mint transactions.
4. Accept the Publisher Policy, Developer Agreement and Terms of Use.
5. Review results arrive by email from `publishersupport@dappstore.solanamobile.com` within 3–5 business days. Questions go to `#dev-answers` on the Solana Mobile Discord.

## E. Every update after that

- Bump `expo.version` and **increment `android.versionCode`** in `app.json` (regressions are rejected). Keep `package.json` version in step.
- Same package id, same signing key, same publisher wallet. Fill in "What's new".
- `npm run typecheck && npm test && npm run audit`.
- Re-check the manifest diff after any SDK or dependency upgrade.
- Submit from the portal (**Home → New Version**) or with the portal-backed CLI:
  ```bash
  npm install -g @solana-mobile/dapp-store-cli
  # bash:       export DAPP_STORE_API_KEY=<portal API key>
  # PowerShell: $env:DAPP_STORE_API_KEY = "<portal API key>"
  dapp-store --apk-file app-release.apk --keypair <publisher-keypair.json> --whats-new "…"
  ```

## Policy points this app satisfies by design

- No deceptive or misleading claims: every reward mention carries a "not guaranteed / not financial advice" disclaimer; prices are labelled as list prices with vendor links; wallet balances are labelled as public on-chain data that may be delayed.
- No IP misuse: no vendor logos or product photography; trademarks used nominatively and attributed on the Copyright screen; original app icon.
- Wallet safety: no key material in the app, no transaction construction or submission, signing limited to an off-chain message the user reads first, authorisation kept in memory and cleared on disconnect.
- Privacy: no analytics, no ads, no accounts, no third-party SDKs that phone home. The only outbound request is to the Solana RPC endpoint, and only after the user connects a wallet — disclosed in the privacy policy.
- Not a thin web wrapper: native RN UI, no WebView.
- Functionality matches screenshots and description.
