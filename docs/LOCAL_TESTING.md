# Testing the app without a physical device

Everything below runs on a Windows machine with no Seeker and no Android phone: an emulator plays the
device, Maestro drives the UI the way Playwright drives a browser, and a mock wallet stands in for
Phantom so the Mobile Wallet Adapter flow can be exercised end to end.

## What this setup can and cannot prove

| Can test | Cannot test |
|---|---|
| Every screen, navigation, tour and help centre | How haptics actually feel |
| Real device-sized screenshots (1080×2340) for the store listing | Seed Vault (Seeker hardware only) |
| The MWA handoff: authorize, deauthorize, sign message | Real reward balances, unless the test wallet holds real tokens |
| Release APK behaviour: R8 shrinking, signing, permissions | Carrier/roaming or true low-memory conditions |

A dApp Store reviewer runs the app on ordinary Android hardware, so an emulator is a fair proxy.
The remaining risk is small, but it is real: nothing here runs on a Seeker.

## One-time setup

Already installed on this machine by the setup script
(`scratchpad/setup-android.ps1`), which is re-runnable:

- **JDK 17** — `winget install Microsoft.OpenJDK.17`
- **Android SDK** at `%LOCALAPPDATA%\Android\Sdk`: `cmdline-tools`, `platform-tools` (adb),
  `emulator`, `platforms;android-35`, `system-images;android-35;google_apis;x86_64`
- **AVD** named `seeker_api35` (Pixel 7 profile, API 35)
- **Maestro** at `C:\maestro`

PowerShell 5.1 has no `&&`, so run each command on its own line.

```powershell
$sdk = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_HOME = $sdk
$env:Path = "$sdk\platform-tools;$sdk\emulator;C:\maestro\bin;$env:Path"
```

## Start the emulator and install the app

```powershell
emulator -avd seeker_api35 -no-snapshot-load
```

Leave that window running. In a second terminal:

```powershell
adb devices
adb install -r path\to\app-release.apk
```

Download the APK from the EAS build page, or run `eas build:list` and use the artifact URL. A release
APK is what the dApp Store receives, so test that rather than a debug build.

## Drive the UI and capture screenshots

```powershell
maestro test .maestro/smoke.yaml
maestro test .maestro/store-screenshots.yaml
```

- `smoke.yaml` walks the reviewer path and asserts the screens that cannot be checked on web.
- `store-screenshots.yaml` writes `store-NN-*.png` at device resolution. Copy the ones you want into
  `store-assets/` to replace the web captures, whose tab-bar labels were clipped.
- `maestro studio` opens an interactive inspector for writing new flows against the running emulator.

## Testing the wallet flow with a mock wallet

Mobile Wallet Adapter needs a wallet app on the same device. Solana Mobile publishes one for exactly
this purpose. It does not keep a persistent keypair — it resets whenever the app closes — so it is
right for testing the handoff, wrong for testing balances.

```powershell
git clone https://github.com/solana-mobile/mock-mwa-wallet
cd mock-mwa-wallet\android
.\gradlew :fakewallet:assembleDebug
adb install -r fakewallet\build\outputs\apk\debug\fakewallet-debug.apk
```

Then in the app: **Wallet → Connect wallet**, approve in the mock wallet, and the address and balances
appear. "Sign ownership proof" exercises `signMessages`, which is the only signing this app performs.

Any EXPO_PUBLIC_ value is baked into the bundle in clear text, so use a disclosable endpoint for test
builds too.

For balances that match a real account, use an emulator image with the Play Store, install Phantom or
Solflare, and connect a wallet you control. Never use a wallet holding significant funds for testing.

## Capturing a screenshot by hand

Do NOT redirect binary output in Windows PowerShell: `adb exec-out screencap -p > shot.png` writes
UTF-16 and produces a corrupt file that decoders reject with a misleading out-of-memory error. Pull
the file instead:

```powershell
adb shell screencap -p /sdcard/shot.png
adb pull /sdcard/shot.png shot.png
adb shell rm /sdcard/shot.png
```

The `seeker_api35` AVD renders at 1080x2400, which satisfies the dApp Store minimum of 1080 px.
Keep every listing screenshot at that one size so the aspect ratios match.

## Useful checks on the installed APK

```powershell
adb shell dumpsys package app.seekerdepin.explorer | Select-String "versionName|versionCode"
adb shell pm list permissions -d -g app.seekerdepin.explorer
adb logcat -d | Select-String "ReactNativeJS|FATAL"
```

Expect only `INTERNET` and `VIBRATE`, and no fatal exceptions in the log after a full pass.
