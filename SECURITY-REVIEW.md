# Security Review — Seeker DePIN Explorer v1.0.0 (versionCode 2)

Reviewed 2026-09-07 against OWASP MASVS-L1 (mobile app security verification) and the Solana dApp Store publisher requirements. Scope: application code in `app/` and `src/`, Expo/Android build configuration, third-party dependencies, and the generated Android manifest.

## Executive summary

| Area | Before | After |
|---|---|---|
| Outbound links | `Linking.openURL()` on any string from catalog data | HTTPS-only host allow-list + Android Custom Tabs; 11 attack strings unit-tested |
| Android manifest | `allowBackup=true` (Expo default); cleartext not pinned; dangerous permissions inherited from libraries | `allowBackup=false`, `usesCleartextTraffic=false`, only INTERNET + VIBRATE; 13 permissions force-removed with `tools:node="remove"` |
| Release signing | Expo template signs *release* with the **debug keystore** → dApp Store rejection | Config plugin wires a real release keystore from `keystore.properties`/env; loud warning if missing |
| Code shrinking | Off | R8/ProGuard + resource shrinking enabled for release |
| Error handling | Red-box / crash on render error; default "Unmatched Route" page echoing the URL | Root `ErrorBoundary` (no stack in release), custom `+not-found`, hardened stale-deep-link state |
| Legal / policy | None | In-app Privacy Policy, Terms/EULA, Copyright screen + hosted Markdown in `/docs`; reward disclaimers on every "How you earn" card |
| Listing assets | Expo placeholder icon (icon-mismatch rejection risk) | Original icon set (adaptive + monochrome + 512 px store icon) and 1200×600 banner; 7 screenshots at 1080×2340 |
| Secrets hygiene | — | `.gitignore` for keystores, `keystore.properties`, Solana keypairs; `android/` generated, not committed |
| Dependencies | 2 transitive moderate advisories | Same 2 — analysed below, both accepted with rationale |

Verification: `npx tsc --noEmit` clean · `npm test` (allow-list) 11/11 + 21/21 catalog URLs · `expo prebuild` manifest inspected · web export rendered headlessly, no runtime errors.

## Attack surface

The app is a static catalog. It has no backend, no accounts, no wallet code, no storage of user data, no WebView, and makes **zero network requests of its own**. The remaining surface is:

1. **Deep links** (`seekerdepin://…`) — any app on the device can launch the exported `MainActivity` with an arbitrary path.
2. **Outbound links** — URLs in the catalog data are handed to the OS.
3. **Supply chain** — Expo/React Native dependency tree.
4. **Build & distribution** — APK signing, debuggability, backup.

## Findings and remediation

### 1. Outbound URLs handed straight to `Linking.openURL` — Medium → Fixed
`Linking.openURL(url)` will open *any* scheme the string resolves to (`intent://`, `javascript:` on web, custom schemes that other apps register). The URLs are static today, but the catalog is designed to be edited, and an `intent://` string in a data file would become an intent launched from a trusted app.

**Fix:** `src/lib/allowlist.ts` validates with the WHATWG `URL` parser: `https:` only, no embedded credentials, hostname must equal or be a subdomain of an explicit allow-list (suffix-spoofs like `helium.com.evil.io` rejected). `src/lib/links.ts` then opens through `expo-web-browser` (Android Custom Tabs) so the user stays in-app, sees the real URL bar, and the page runs in Chrome's sandbox, not a WebView with app privileges. Non-conforming URLs are silently dropped (dev-only console warning). Unit tests in `src/lib/__tests__/allowlist.test.ts` also assert every catalog URL is allow-listed, so a typo fails `npm test` rather than silently breaking a link.

### 2. Android backup enabled — Medium → Fixed
Expo defaults `android:allowBackup="true"`. The app stores nothing today, but backup would silently include any future persisted state (e.g. wallet address cache) in Google backups and `adb backup` on older devices. Set `"allowBackup": false` in `app.json`; confirmed in the generated manifest.

### 3. Cleartext traffic not explicitly denied — Low → Fixed
`expo-build-properties` → `usesCleartextTraffic: false` so no `http://` request can ever succeed from the app process, even if a dependency tries.

### 4. Inherited permissions — Low → Fixed
Libraries in the RN/Expo tree merge permissions such as `SYSTEM_ALERT_WINDOW` (dev-client overlay), `READ_EXTERNAL_STORAGE`, `READ_PHONE_STATE`. Reviewers and users see these. `blockedPermissions` removes 13 of them at manifest-merge time; the final manifest carries only `INTERNET` and `VIBRATE` (haptics). If you later add MWA, it needs nothing extra — it works over intents.

### 5. Release APK signed with debug keystore — High (for store submission) → Fixed
Expo's Gradle template sets `release { signingConfig signingConfigs.debug }`. A debug-signed APK is a documented dApp Store rejection, and the debug key is public. `plugins/withReleaseSigning.js` injects a `release` signing config that reads `android/keystore.properties` (git-ignored) or `DAPP_STORE_*` env vars, enables v1+v2 signing, and prints a warning if none is configured. EAS builds (`dapp-store` profile) manage their own keystore and are unaffected.

**Correction (2026-09-11):** the original step-3 regex started matching at the `signingConfigs.release` block the plugin had just inserted, so it rewired `buildTypes.debug` and left `buildTypes.release` on the debug keystore — reproduced by running the plugin against the SDK 57 `build.gradle` template. The match is now anchored on `buildTypes {`, and prebuild throws if `buildTypes.release` does not end up pointing at the release config. Always confirm with `apksigner verify --print-certs` before uploading.

### 6. No error boundary; default not-found echoes the URL — Low → Fixed
An uncaught render error in release RN crashes the app; the stock unmatched-route screen prints the incoming URL, which for a deep link is attacker-controlled text rendered inside a trusted app. Added a root `ErrorBoundary` (stack shown only when `__DEV__`), a custom `+not-found.tsx` that never echoes the path, and a proper recovery state in `device/[id]` for unknown ids (`router.replace('/')`).

### 7. R8/ProGuard off — Low → Fixed
`enableProguardInReleaseBuilds` and `enableShrinkResourcesInReleaseBuilds` enabled. Reduces APK size and strips unused code paths; not a security control on its own, but standard for release.

### 8. Dependencies — 2 moderate advisories, accepted
`npm audit --omit=dev` reports 14 entries that collapse to two root causes:

- **`decode-uri-component@0.2.2`** (GHSA-vcc3-ghjq-m6fr, DoS via exponential decoding) via `expo-router → query-string@7`. Reachable only when the router parses a query string from an incoming deep link. Impact is bounded to local CPU time in our own process (no server, no data), and the app reads no query parameters. The patched release (0.5.0) is ESM-only and cannot be substituted under `query-string@7`'s CommonJS `require` without breaking Metro; the fix arrives with the next expo-router major. **Accepted; re-check on each SDK upgrade.**
- **`uuid@7.0.3`** (GHSA-w5hq-g745-h8pq) via `@expo/config-plugins → xcode`. Build-time only, iOS project generation, never bundled into the APK. **Accepted.**

Runtime bundle contains no other flagged packages. Re-run `npm run audit` before each release.

### 9. Things reviewed and found acceptable
- No `console.log`, `eval`, `dangerouslySetInnerHTML`, WebView, or dynamic code loading in app code.
- `Share.share` payload is composed from static catalog strings only.
- Search input is used solely for in-memory `includes()` filtering — no injection surface.
- `useLocalSearchParams` values are coerced with `String()` and looked up by exact id; unknown → not-found state.
- `scheme: seekerdepin` intent filter has `BROWSABLE` (required by expo-router); the activity is exported by necessity. Because the app holds no secrets and performs no privileged actions, deep-link abuse is limited to opening a screen.
- `predictiveBackGestureEnabled: true` and `enableOnBackInvokedCallback` — required for Android 14+ back-gesture correctness on Seeker.
- Haptics wrapped in `.catch(() => {})` so a missing vibrator never throws.
- `expo-updates` is not installed → `expo.modules.updates.ENABLED=false`; the APK cannot fetch remote JS. (If you add OTA updates later, dApp Store policy requires the reviewed build's behaviour not change materially via OTA.)

## Residual risks and recommendations

1. **When wallet support is added (v2):** keep all signing inside MWA `transact()`; never request `signMessage` for anything other than SIWS-style auth; show exactly what will be signed; never persist the auth token unencrypted (use `expo-secure-store`).
2. **Pin the allow-list in CI:** `npm test` already fails on non-allow-listed catalog URLs; add it to your pre-commit or CI.
3. **Keystore custody:** store the release `.jks` and passwords in a password manager / HSM-backed secret store; the dApp Store cannot re-key a listing.
4. **Solana publisher keypair:** anyone holding it can publish releases under your name. Keep it offline; consider a dedicated hardware-backed key.
5. **SDK cadence:** Expo SDK 57 targets API 36. Re-run `npm run audit` and `expo prebuild` after each SDK bump and diff the manifest.

## Addendum — wallet integration (v1.1.0, versionCode 3), 2026-09-12

v1.1.0 adds Mobile Wallet Adapter and read-only RPC access. This changes the attack surface described above, so:

- **No key material in the app.** The app holds no private key, seed phrase or keypair. Authorization and signing happen inside the user's wallet app over MWA; the app receives a public address and an auth token. The auth token lives in React state only — it is never written to disk, so it cannot be read from a backup or another app.
- **Signing is off-chain only.** The app implements `authorize`, `deauthorize` and `signMessages`. It never builds, signs or submits a transaction, so no code path can move a user's funds. The ownership proof is a plain-text statement; the user sees it before signing.
- **Outbound network calls.** Reads go to `api.mainnet-beta.solana.com` / `api.devnet.solana.com` over HTTPS (or an `EXPO_PUBLIC_SOLANA_RPC` override, validated as HTTPS with no embedded credentials — `isValidRpcUrl`). `usesCleartextTraffic=false` still holds. The RPC provider necessarily sees the connected address and the device IP; this is disclosed in the privacy policy.
- **Data handling.** The connected address and balances are in-memory only and cleared on disconnect. No analytics, no logging of addresses.
- **New dependencies.** `@solana-mobile/mobile-wallet-adapter-protocol{,-web3js}` 2.3.0, `@solana/web3.js` 1.99.0, `react-native-get-random-values`, `buffer`. `npm run audit` goes from 14 to 18 moderate entries, collapsing to **three** root causes — the two previously accepted (`decode-uri-component`, `uuid`) plus one new:
  - **`stream-json` ≤3.4.0** (GHSA-528h-pc64-c93x, quadratic parsing of deeply nested JSON → event-loop DoS), reached via `@solana/web3.js → jayson`. It can only be triggered by the JSON an RPC endpoint returns, so the threat is a hostile or compromised RPC provider, and the impact is bounded to CPU time in the app's own process — there is no key material or user data to lose. Mitigations already in place: the endpoint is a fixed HTTPS default or a build-time value validated by `isValidRpcUrl`, never user- or link-supplied. **Accepted; re-check on each `@solana/web3.js` upgrade.**
- **Permissions unchanged.** MWA works over intents and local sockets; the manifest still carries only INTERNET and VIBRATE.
- **Not yet verified on hardware.** The MWA flow has not been exercised on a device or emulator in this environment (no Android SDK/JDK available). Typecheck, unit tests and the web build pass. Run the checklist in `HACKATHON.md` on a Seeker or an Android emulator with Phantom before submitting or shipping.

## Second review — v1.4.0 (versionCode 6), 2026-09-21

Full re-read of `app/` and `src/` after the wallet, tour and catalog work, plus the build and CI
configuration. Six findings: three fixed in this release, three accepted and documented. The
user-facing summary of the resulting posture is the in-app Security tab (`src/data/security.ts`),
which is deliberately data-driven so a removed control cannot leave a stale claim behind.

### 10. Build-time RPC override is embedded in the shipped bundle — Medium, guidance

`EXPO_PUBLIC_SOLANA_RPC` is read through `process.env` and, like every `EXPO_PUBLIC_*` variable,
Expo **inlines it into the JavaScript bundle at build time**. Anyone who unzips the APK can read it.

That is harmless for the public endpoints, but it makes the obvious next step dangerous: a Helius or
QuickNode URL usually carries an API key in the path, and shipping one here publishes that key to
every user. Earlier guidance in this repository recommended exactly that and was wrong.

**Guidance:** use an endpoint that is safe to disclose — one restricted by domain/bundle-id
allow-list, rate-limited, and read-only — or put a minimal proxy in front and ship the proxy URL.
Never ship a bearer-style key. `isValidRpcUrl` still enforces HTTPS with no embedded credentials,
which blocks the `https://user:pass@host` form but cannot stop a key in the path.

### 11. Wallet error text rendered verbatim — Low → Fixed

`friendlyError` fell back to `e.message` for unknown failures. On MWA, that message originates in
whichever app answered the association — which is not necessarily a real wallet, since any app can
register the intent. A hostile app could therefore render arbitrary text inside our trusted UI
("Enter your recovery phrase to continue"), which is a credible phishing surface.

**Fix:** known error codes map to our own wording; anything else shows a fixed generic line. Foreign
strings appear only under `__DEV__`, whitespace-collapsed and truncated to 200 characters.

### 12. CI workflow relied on the default token scope — Low → Fixed

`.github/workflows/ci.yml` declared no `permissions` block, so the job ran with whatever the
repository default grants. The workflow only checks out code and runs tests.

**Fix:** `permissions: contents: read` at workflow level.

### 13. Ownership proof is not bound to a session — Low, accepted

The signed statement covers the address, cluster and an ISO timestamp, but carries no server nonce
and no domain binding, so a captured signature is replayable and is not safe as a login credential.
Today it only demonstrates control of an address to the person holding the phone, which is what the
UI claims and no more.

**Accepted.** Before any feature treats it as authentication — the planned operator-verified
reviews would — move to SIWS-style binding: server-issued nonce, domain, issued-at and expiry, with
the server verifying and burning the nonce.

### 14. RPC reads are unbounded and untimed — Low, accepted

`fetchTokenHoldings` asks for every SPL and Token-2022 account the address owns and awaits both
requests with no timeout. A wallet holding thousands of dust accounts, or a hostile RPC returning an
oversized response, degrades to a slow or hung Wallet tab. There is no memory-safety issue and no
data at risk; the failure mode is a spinner that does not stop.

**Accepted for this release.** Worth adding: an `AbortController`-based fetch timeout on the
`Connection`, and a cap on rendered holdings.

### Verification performed

- `npx tsc --noEmit` clean; unit tests green (11 link cases, 39 catalog URLs, 13 mints, 14 networks).
- Grep sweep for `eval`, `dangerouslySetInnerHTML`, `innerHTML`, WebView, `child_process` and raw
  `fetch` in app code: no hits. The only `Linking.openURL` call sits behind the allow-list on the web
  path, and no direct network calls exist outside `@solana/web3.js`.
- Manifest expectations unchanged: `INTERNET` + `VIBRATE`, `allowBackup=false`,
  `usesCleartextTraffic=false`.
- Dependency audit: three transitive advisories, all reachable only via local CPU or a hostile RPC
  response, re-accepted with rationale.

### Residual risk

The wallet flows have been exercised on an emulator with Solana Mobile's mock wallet, not on Seeker
hardware, and no independent penetration test has been commissioned. Both are stated in the app.
