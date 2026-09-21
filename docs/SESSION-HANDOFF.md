# Handoff — 21 Sep 2026

Where the dApp Store submission stands, and what to do next session.

## State

| Item | State |
|---|---|
| Code | v1.4.0 / versionCode 6, committed and pushed. Typecheck + both test suites green. |
| Package id | `app.seekerdepin.explorer` — **permanent** once the app NFT mints. |
| Repo | https://github.com/ucsdmiami2020/seeker-depin-explorer (public), CI green |
| PR | [#1](https://github.com/ucsdmiami2020/seeker-depin-explorer/pull/1), open |
| Legal pages | Live: https://ucsdmiami2020.github.io/seeker-depin-legal/ |
| Security review | **Done** — 6 findings, 3 fixed, 3 accepted. See `SECURITY-REVIEW.md`, section "Second review". |
| Security tab | **Shipped** — data-driven from `src/data/security.ts`, rendering verified |
| Feature graphic | Done: `store-assets/feature-graphic-1200x1200.png` |
| APK v1.4.0 | **Was building at shutdown** — [build c3b5b17b](https://expo.dev/accounts/ucsdmiami2020s-team/projects/solanoseekerrwaviewer/builds/c3b5b17b-a079-4144-b871-a205023981e6). EAS builds in the cloud, so it finished without this machine. |
| Store screenshots | Pipeline **proven** at 1080×2400 with legible tab labels, but the final set was never captured — the run was still waiting on the build |
| Preview video | Flow written (`.maestro/preview-video.yaml`), not yet recorded |

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
