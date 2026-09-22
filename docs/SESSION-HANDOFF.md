# Handoff — 22 Sep 2026

Where the dApp Store submission stands, and what to do next session.

## State

| Item | State |
|---|---|
| Code | v1.4.1 / versionCode 7, committed and pushed. Typecheck + both test suites green. |
| Package id | `app.seekerdepin.explorer` — **permanent** once the app NFT mints. |
| Repo | https://github.com/ucsdmiami2020/seeker-depin-explorer (public), CI green |
| PR | [#1](https://github.com/ucsdmiami2020/seeker-depin-explorer/pull/1), open |
| Legal pages | Live: https://ucsdmiami2020.github.io/seeker-depin-legal/ |
| Security review | **Done** — 6 findings, 3 fixed, 3 accepted. See `SECURITY-REVIEW.md`, section "Second review". |
| Security tab | **Shipped** — data-driven from `src/data/security.ts`, rendering verified |
| Feature graphic | Done: `store-assets/feature-graphic-1200x1200.png` |
| APK v1.4.1 | [build 146c5c78](https://expo.dev/accounts/ucsdmiami2020s-team/projects/solanoseekerrwaviewer/builds/146c5c78-e839-434d-aa36-09fe06eebcb9) — contains the back-button fix. v1.4.0 (c3b5b17b) is the last build **with** the bug; do not ship it. |
| Store screenshots | 7 of 14 captured from v1.4.0 before the back bug stopped the run. A full capture was queued against v1.4.1 — check `captures-v141` in the scratchpad. |
| Preview video | Partial recording from v1.4.0; full run queued against v1.4.1 alongside the screenshots |

## Pick up here

Everything needed is installed permanently: Android SDK, the `seeker_api35` AVD, Maestro
(`C:\maestro`), JDK 17. Scratchpad files (downloaded APKs, the mock wallet build, the
feature-graphic generator) live in Windows temp and may have been cleaned.

PowerShell 5.1 has no `&&`, so one command per line:

```powershell
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_HOME = $sdk
$env:JAVA_HOME = (Get-ChildItem 'C:\Program Files\Microsoft' -Filter 'jdk-17*' -Directory | Select-Object -First 1).FullName
$env:Path = "$env:JAVA_HOME\bin;$sdk\platform-tools;$sdk\emulator;C:\maestro\bin;$env:Path"
emulator -avd seeker_api35 -no-snapshot-load -no-window
```

Second terminal — get the APK URL from `eas build:list --platform android --limit 1`, download it, then:

```powershell
adb install -r seeker-depin-explorer-v1.4.0.apk
maestro test .maestro/store-screenshots.yaml
maestro test .maestro/preview-video.yaml
```

### Where the output lands

Maestro writes to its own debug folder, **not** the working directory:

```
%USERPROFILE%\.maestro\tests\<timestamp>\store-screenshots\takeScreenshot\store-NN-*.png
```

Copy the keepers into `store-assets/`, replacing the web captures whose tab labels are clipped.
Keep every listing image at 1080×2400 so the aspect ratios match. The video lands as `preview.mp4`
in the same run folder; the store wants MP4 at 720p or better, 1080p recommended.

### Flow quirks, already handled

- The tour left button reads "Skip" only on step 1; from step 2 it is "Back". The flow walks to the
  last step and taps "Start exploring". Getting this wrong killed an earlier run.
- The help button carries an accessibility label rather than a testID, so that capture step is
  `optional`. To make it reliable, add `testID="help-fab"` to `HelpFab` and update both flows —
  that needs a rebuild.
- The search field now has `testID="search-input"`; `smoke.yaml` uses it.

## Then: test the wallet flow

Rebuild the mock wallet if the scratchpad was cleaned. The module is `app`, not `fakewallet` as
Solana Mobile documents:

```powershell
git clone https://github.com/solana-mobile/mock-mwa-wallet
cd mock-mwa-wallet
.\gradlew.bat :app:assembleDebug --no-daemon
adb install -r app\build\outputs\apk\debug\app-debug.apk
```

Then Wallet → Connect wallet → approve → check the address, balances and "Sign ownership proof".

## P1 bug: back button closed the app — fixed in v1.4.1

**Symptom.** Open any device page from Explore, press the Android back button, and the app closed
instead of returning to the catalog. Present in every build up to and including v1.4.0.

**Confirmed, not inferred.** Reproduced on an API 35 emulator with a flow that presses back exactly
once: the assertion for the catalog failed and `dumpsys window` showed `mCurrentFocus` had become
`NexusLauncherActivity`. Not a crash — the crash buffer was empty and logcat showed
`AndroidRuntime: VM exiting with result code 0`, so the activity was simply finished.

**Cause.** `android.predictiveBackGestureEnabled: true` writes `android:enableOnBackInvokedCallback`
into the manifest. Once an app opts in, Android stops calling the legacy `onBackPressed()` path that
React Native depends on, and unless every layer of the navigation stack registers an
`OnBackInvokedCallback`, the system default runs and finishes the activity. Expo defaults this flag
to false; this project had opted in without the support to back it up.

**Fix.** Flag set to false in `app.json` (commit `8c4d9cd`, v1.4.1 / versionCode 7). Recorded as
finding 15 in `SECURITY-REVIEW.md`.

**Regression test.** `.maestro/back-navigation.yaml` asserts one back press from a device page lands
back on the catalog with the tab bar intact. Do not re-enable predictive back without running it.

**Still to verify:** the fix has been committed and built but not yet confirmed on a device. Run:

```powershell
maestro test .maestro/back-navigation.yaml
```

against the v1.4.1 APK. It must pass before the screenshots and video are worth capturing, and
before anything is submitted.

**Wider lesson.** This shipped through typecheck, unit tests, CI and the web preview untouched.
Only driving a real Android build caught it. Run `.maestro/smoke.yaml` and
`.maestro/back-navigation.yaml` against every release APK before submitting.

## Decisions still open

1. **Publisher wallet must match the Seeker ID.** `ucsdmiami2020.skr` resolves on-chain to
   `8jTpgM8S6TUiGXD9Cor7wAKA2QF5ufcGUjEHkWmzG6CL`. Check which wallet the portal account is
   connected to. If it differs: connect that wallet, move the domain, or soften the About copy.
   **Fix before minting — the publisher wallet cannot be changed afterwards.**
2. **RPC endpoint — read before picking one.** `EXPO_PUBLIC_SOLANA_RPC` is **inlined into the
   JavaScript bundle**, so anyone who unzips the APK can read it. A Helius-style URL with an API key
   in the path would publish that key to every user. Earlier notes in this repo said otherwise and
   were wrong. Use an endpoint restricted by domain or bundle id, or a proxy, then:
   ```powershell
   eas env:set --name EXPO_PUBLIC_SOLANA_RPC --value https://your-endpoint --environment production --visibility plaintext
   ```
   and rebuild.
3. **Rotate the publisher API key** that was pasted into a chat transcript. Only the CLI submission
   path needs it; the portal does not.
4. **Back up the keystore.** It exists only on EAS. `eas credentials` → Android → download. Lose it
   and the listing can never be updated.

## Then submit

`docs/DAPP_STORE_SUBMISSION.md` is the checklist, current for v1.4.0. The portal steps — account,
KYC/KYB, wallet connection, signing the publisher/app/release mints — need your keys and cannot be
automated.
