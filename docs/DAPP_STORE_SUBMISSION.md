# Solana dApp Store submission checklist

Everything below maps to a documented requirement or a known rejection reason. Tick them in order.

## A. One-time setup

- [ ] **Fill in publisher identity** in `src/data/legal.ts` (`PUBLISHER.name`, `contactEmail`, `website`). Re-generate `/docs/*.md` if you change wording (they mirror the in-app screens).
- [ ] **Host the three legal documents** at public HTTPS URLs (GitHub Pages of this repo works: `docs/privacy-policy.md`, `docs/terms-of-use.md`, `docs/copyright.md`). The portal asks for Privacy Policy, EULA/Terms and Copyright URLs.
- [ ] **Choose the final Android package id** in `app.json` (`android.package`). It is permanent once the App NFT is minted and must match the APK on every update.
- [ ] **Generate a dedicated release keystore** (never reuse a Google Play key):
  ```bash
  mkdir -p keystores
  keytool -genkeypair -v -storetype PKCS12 -keystore keystores/dapp-store-release.jks \
    -alias dappstore -keyalg RSA -keysize 4096 -validity 10000
  ```
  Back it up somewhere durable. Copy `keystore.properties.example` → `android/keystore.properties` after prebuild and fill it in (git-ignored).
- [ ] **Publisher wallet**: a Solana wallet (Phantom / Solflare / Backpack) with ~0.2 SOL for Arweave uploads and NFT mints. Keep the keypair offline between releases.

## B. Build the release APK

```bash
npm ci
npm run typecheck && npm test
npx expo prebuild --platform android --clean
cp keystore.properties.example android/keystore.properties   # then edit
cd android && ./gradlew assembleRelease
# → android/app/build/outputs/apk/release/app-release.apk
```
or with EAS: `eas build -p android --profile dapp-store`.

- [ ] Verify it is release-signed with **your** key, not debug:
  `apksigner verify --print-certs app-release.apk` (certificate DN must be yours, not `CN=Android Debug`).
- [ ] Verify the manifest: `aapt dump badging app-release.apk | grep -E "package|uses-permission|sdkVersion|targetSdkVersion"` — expect `versionCode='2'` (or higher), `targetSdkVersion:'36'`, and only `INTERNET` + `VIBRATE`.
- [ ] Install on an API 34+ arm64 emulator or a Seeker and smoke-test all four tabs, a device detail, a vendor link (opens Custom Tab), and the Legal screens.

## C. Listing assets (in `store-assets/`)

| Asset | Requirement | Provided |
|---|---|---|
| App icon | 512×512 PNG, square, **must match launcher icon** | `icon-512.png` (same artwork as `assets/icon.png`) |
| Banner | 1200×600 PNG/JPG | `banner-1200x600.png` |
| Screenshots | ≥4, min 1080 px, all same orientation, must show real functionality | `screenshot-1…7` at 1080×2340 (portrait) — regenerate from a real device/emulator before final submission if you prefer native captures |
| Feature graphic | 1200×1200 (optional) | — |

Suggested listing copy:

- **Name:** Seeker DePIN Explorer
- **Short description (≤30 chars):** Explore Solana DePIN hardware
- **Long description:** A field guide to the physical hardware that plugs into Solana — the Seeker and Saga phones, the CUDIS ring and BrushO toothbrush that pay for healthy habits, Helium hotspots, the Hivemapper Bee dashcam, GEODNET stations and XNET radios. Compare specs and prices side by side, see how each device earns, follow each network's timeline, and jump to the vendor. No wallet, no account, no data collection.
- **Category:** Utilities / Reference (DePIN)
- **Age rating:** Everyone
- **Testing instructions for reviewers:** No login or wallet required. Open Explore → tap any device → tap a vendor link (opens in Chrome Custom Tab). Compare tab: add up to three devices. About → Legal shows Privacy Policy, Terms, Copyright.
- **What's new (v1.0.0):** Initial release — 10 devices, compare view, network guide.

## D. Submit

1. Sign in at https://publish.solanamobile.com with the publisher wallet.
2. Create the publisher profile, then **New dApp** → fill metadata, upload icon/banner/screenshots, paste the three legal URLs.
3. **New Version** → upload `app-release.apk`, add release notes and testing instructions, sign the Arweave upload and NFT mint transactions.
4. Accept the Publisher Policy, Developer Agreement and Terms of Use.
5. Wait for the review email (typically 2–5 business days). Questions go to the `#dapp-store` channel on the Solana Mobile Discord.

## E. Every update after that

- Bump `expo.version` and **increment `android.versionCode`** in `app.json` (regressions are rejected).
- Same package id, same signing key.
- `npm run typecheck && npm test && npm run audit`.
- Re-check the manifest diff after any SDK or dependency upgrade.

## Policy points this app satisfies by design

- No deceptive or misleading claims: every reward mention carries a "not guaranteed / not financial advice" disclaimer; prices are labelled as list prices with vendor links.
- No IP misuse: no vendor logos or product photography; trademarks used nominatively and attributed on the Copyright screen; original app icon.
- No data collection, no analytics, no ads, no third-party SDKs that phone home; privacy policy states exactly that.
- Not a thin web wrapper: native RN UI, no WebView.
- Functionality matches screenshots and description.
