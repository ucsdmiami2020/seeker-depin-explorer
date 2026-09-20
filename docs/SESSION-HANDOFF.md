# Handoff — 20 Sep 2026

Where the dApp Store submission stands, and what to do next session.

## State

| Item | State |
|---|---|
| Code | v1.3.0 / versionCode 5, committed and pushed. Typecheck + both test suites green. |
| Package id | `app.seekerdepin.explorer` — **permanent** once the app NFT mints. |
| Repo | https://github.com/ucsdmiami2020/seeker-depin-explorer (public), CI green |
| PR | [#1](https://github.com/ucsdmiami2020/seeker-depin-explorer/pull/1) — feature graphic only; the rest already landed on `master` |
| Legal pages | Live: https://ucsdmiami2020.github.io/seeker-depin-legal/ (privacy-policy · terms-of-use · copyright) |
| APK v1.3.0 | **Built OK** (87 MB). Direct download: https://expo.dev/artifacts/eas/dRRT9nZY95Ux6g-TAfzmb95nyIq6T2DWqwzuHbrLKb4.apk — [build fc445979](https://expo.dev/accounts/ucsdmiami2020s-team/projects/solanoseekerrwaviewer/builds/fc445979-d596-4c9b-be54-ccd0b945a7f6). This is the APK to test, screenshot and submit. |
| Feature graphic | Done: `store-assets/feature-graphic-1200x1200.png` |
| Preview video | **Not started** — needs the v1.3.0 APK on the emulator |
| Store screenshots | **Still the old web captures** with clipped tab labels; retake on the emulator |

## What did not survive the shutdown

The emulator, the Maestro run, the preview server and the background watchers all stopped. The
Android SDK, the AVD (`seeker_api35`), Maestro (`C:\maestro`) and JDK 17 are installed permanently.

Files in the session scratchpad may be cleaned up by Windows:
`%LOCALAPPDATA%\Temp\claude\...\9b392db4-...\scratchpad\` held the downloaded APK, the mock wallet
build and the feature-graphic generator. The mock wallet is rebuildable (below); the APK is
downloadable from EAS; **the feature-graphic generator is not in the repo** — recreate it if the
device or network counts change.

## Resume here

Full setup detail is in `docs/LOCAL_TESTING.md`. Short version — PowerShell 5.1 has no `&&`, so one
command per line:

```powershell
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_HOME = $sdk
$env:JAVA_HOME = (Get-ChildItem 'C:\Program Files\Microsoft' -Filter 'jdk-17*' -Directory | Select-Object -First 1).FullName
$env:Path = "$env:JAVA_HOME\bin;$sdk\platform-tools;$sdk\emulator;C:\maestro\bin;$env:Path"
emulator -avd seeker_api35 -no-snapshot-load -no-window
```

Then, in a second terminal:

```powershell
# APK: https://expo.dev/artifacts/eas/dRRT9nZY95Ux6g-TAfzmb95nyIq6T2DWqwzuHbrLKb4.apk
adb install -r seeker-depin-explorer-v1.3.0.apk
maestro test .maestro/smoke.yaml
```

### 1. Fix the Maestro selector bug (blocks video and screenshots)

`smoke.yaml` failed with `Element not found: Text matching regex: Helium.*` after 55s. Launch, the
tour and Skip all worked. The suspect is the search step:

```yaml
- tapOn:
    id: "Search devices, tokens, makers…"
```

`id:` matches a testID/resource-id, and that string is placeholder **text**. Use `maestro studio`
against the running emulator to read the real selector, then fix both flow files.

### 2. Capture the listing assets

- `maestro test .maestro/store-screenshots.yaml` → device-resolution PNGs at 1080×2400. Copy the
  keepers into `store-assets/`, replacing the web captures. Keep one aspect ratio throughout.
- Preview video: add `startRecording` / `stopRecording` to a flow, or record the emulator during a
  run. Target MP4, 1080p, 30–60s. `docs/DEMO_SCRIPT.md` has the shot order.

### 3. Test the wallet flow

Rebuild the mock wallet if the scratchpad was cleaned:

```powershell
git clone https://github.com/solana-mobile/mock-mwa-wallet
cd mock-mwa-wallet
.\gradlew.bat :app:assembleDebug --no-daemon
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

Note the module is `app`, not `fakewallet` as Solana Mobile's docs claim. Then in the app:
Wallet → Connect wallet → approve → check the address, balances and "Sign ownership proof".

## Decisions still open

1. **Publisher wallet must match the Seeker ID.** `ucsdmiami2020.skr` resolves on-chain to
   `8jTpgM8S6TUiGXD9Cor7wAKA2QF5ufcGUjEHkWmzG6CL`. Check which wallet your publisher portal account
   is connected to. If it differs, either connect that wallet, move the domain to the publishing
   wallet, or soften the About copy — the app currently shows the Seeker ID as the publisher
   identity. **Fix before minting; the wallet cannot be changed afterwards.**
2. **RPC endpoint.** No EAS variable is set, so builds use the rate-limited public RPC and the
   Wallet tab can look broken to a reviewer. One command fixes it for every future build:
   ```powershell
   eas env:set --name EXPO_PUBLIC_SOLANA_RPC --value https://your-endpoint --environment production --visibility plaintext
   ```
   Then rebuild.
3. **API key.** The publisher API key was pasted into a chat transcript — rotate it in the portal.
   It is only needed for the CLI submission path, not the portal.
4. **Keystore backup.** The release key lives only on EAS. `eas credentials` → Android → download.
   Lose it and the listing can never be updated.

## Then submit

`docs/DAPP_STORE_SUBMISSION.md` is the checklist, already updated for v1.3.0. Portal steps (account,
KYC/KYB, wallet connection, signing the publisher/app/release mints) all need your keys and cannot be
automated.
