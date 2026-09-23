# Handoff — 23 Sep 2026

Where the dApp Store submission stands, and what is left.

## State

| Item | State |
|---|---|
| Code | v1.4.2 / versionCode 8, committed and pushed at `228eb7e`. Typecheck + both test suites green, CI green. |
| Package id | `app.seekerdepin.explorer` — **permanent** once the app NFT mints |
| Repo | https://github.com/ucsdmiami2020/seeker-depin-explorer (public) |
| PR | [#1](https://github.com/ucsdmiami2020/seeker-depin-explorer/pull/1) — still open, feature graphic only |
| Legal pages | Live: https://ucsdmiami2020.github.io/seeker-depin-legal/ |
| Security review | Done — 15 findings across two passes. `SECURITY-REVIEW.md` |
| Security tab | Shipped, data-driven from `src/data/security.ts` |
| **APK v1.4.2** | **Built, verified, uploaded to the portal.** `C:\Users\rchac\Downloads\seeker-depin-explorer-v1.4.2.apk` (86.43 MB) |
| Screenshots | 14 at 1080×1920 (9:16) in `store-assets/screenshots-1080x1920/`; 14 at 1080×2400 in `screenshots-v141/` |
| Feature graphic | `store-assets/feature-graphic-1200x1200.png` |
| Preview video | `store-assets/preview-video.mp4` — 7.5 MB, but **1080×2400**, not 9:16 |
| Storage provider | ArDrive chosen |

## Verified on a real device (emulator, API 35)

- Back button returns to the catalog — `.maestro/back-navigation.yaml` passes against v1.4.2
- Welcome call to action reachable at 1080×1920 — the capture run cannot start otherwise
- 14-screen capture flow passes end to end

## Remaining work

### Blocking the submission

1. **Store Listing is still `Draft`** in the portal sidebar. Finish and save it; the release is
   reviewed against the listing. All field values are in `docs/DAPP_STORE_SUBMISSION.md` section C.
2. **Finish the release upload**: "What's new" text, reviewer testing instructions, then submit and
   approve the two wallet signatures (storage upload + release NFT mint). Keep ~0.2 SOL available,
   plus whatever the ArDrive estimator asks for ~87 MB.

### Should happen before or soon after submitting

3. **Preview video is the wrong aspect** (1080×2400). Re-record on the `seeker_169` AVD:
   `maestro test .maestro/preview-video.yaml`. The store accepts MP4 at 720p or better.
4. **Welcome text clips mid-word** where the pinned footer starts, at 1080×1920. Cosmetic only, and
   it does not affect the six screenshots chosen for the listing. One-line padding fix; ride it along
   with the next release.
5. **MWA connect/sign has never run end to end.** The mock wallet builds
   (`:app:assembleDebug`, module is `app` not `fakewallet`), but connect → approve → balances →
   "Sign ownership proof" has not been walked through. Do it before claiming the wallet feature works.
6. **Back up the keystore.** It exists only on EAS. `eas credentials` → Android → download. Lose it
   and the listing can never be updated.
7. **Rotate the publisher API key** pasted into a chat transcript. The portal path does not need it.
8. **RPC endpoint.** Still the public one, which rate-limits. `EXPO_PUBLIC_SOLANA_RPC` is **inlined
   into the bundle**, so never ship a URL with an API key in it — use one restricted by domain or
   bundle id, or a proxy, then `eas env:set … --environment production` and rebuild.
9. **PR #1** is open and contains only the feature graphic; everything else landed on `master`
   directly. Merge or close it.

### Paused

10. **Clock In hackathon** (`HACKATHON.md`) — deliberately paused in favour of the dApp Store. The
    demo video script and pitch deck are still current if it resumes.

### Planned, not built

11. **Community submissions** — let users propose devices and corrections. Full plan in
    `docs/FEATURE-PLAN-SUBMISSIONS.md`; ships as v1.5.0.

## Environment (all installed permanently)

Android SDK, AVDs `seeker_api35` (1080×2400) and `seeker_169` (1080×1920), Maestro at `C:\maestro`,
JDK 17, EAS CLI. Setup and gotchas: `docs/LOCAL_TESTING.md`.

PowerShell 5.1 has no `&&`; one command per line:

```powershell
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_HOME = $sdk
$env:JAVA_HOME = (Get-ChildItem 'C:\Program Files\Microsoft' -Filter 'jdk-17*' -Directory | Select-Object -First 1).FullName
$env:Path = "$env:JAVA_HOME\bin;$sdk\platform-tools;$sdk\emulator;C:\maestro\bin;$env:Path"
emulator -avd seeker_169 -no-snapshot-load -no-window
```

Maestro writes captures to `%USERPROFILE%\.maestro\tests\<timestamp>\<flow>\takeScreenshot\`.

## Hard-won details worth keeping

- **Run the emulator flows on every release APK.** Two bugs reached shipping builds invisibly — the
  back button closing the app, and the welcome button below the fold on 16:9. Typecheck, unit tests,
  CI and the web preview all passed while both were live.
- **Never re-enable `predictiveBackGestureEnabled`** without running `.maestro/back-navigation.yaml`.
- **Verify token mints** against a public registry before adding them. A wrong mint shows someone
  else's balance.
- **Windows PowerShell corrupts binary redirects**: use `adb shell screencap` + `adb pull`, never
  `adb exec-out … > file.png`.
- **EAS builds with npm 10**; the lockfile must be generated with npm 10 or `npm ci` fails there.
