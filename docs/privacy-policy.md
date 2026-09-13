# Privacy Policy

_Last updated 2026-09-11_

## Summary

Seeker DePIN Explorer does not collect, store, transmit or sell any personal data. The app has no account system, no analytics SDK, no advertising SDK, no crash-reporting service and no backend of its own. Everything you see is bundled inside the app.

## Data the app processes on your device

Favourites and compare selections are kept in memory only and are discarded when the app closes. Search text is processed locally and never leaves the device. The app does not read your wallet, contacts, location, files, camera, microphone or clipboard.

## Network access

Until you connect a wallet, the app makes no network requests of its own. When you tap a vendor or documentation link, the page opens in an Android Custom Tab (Chrome) or your default browser over HTTPS. From that point the vendor's own privacy policy applies; we do not receive any information about what you do there. Only a fixed allow-list of vendor domains can be opened. If you connect a wallet, the app queries a public Solana RPC endpoint over HTTPS to read balances for that address — see "Wallet and on-chain data" below.

## Permissions

The app requests no dangerous Android permissions. It uses INTERNET (to open links in the browser) and VIBRATE (for light haptic feedback). Backup of app data to Google is disabled.

## Wallet and on-chain data

Connecting a wallet is optional and off by default. If you connect one, the app uses Mobile Wallet Adapter to ask your wallet app (or Seed Vault on a Seeker) to share a public address. The app never sees, requests or stores your seed phrase or private keys, and it never creates or submits a transaction — the only signature it can ask for is an off-chain text message you read first. Your address and the authorisation token are held in memory for the session and are cleared when you disconnect or close the app. To show balances, the address is sent to a public Solana RPC endpoint (api.mainnet-beta.solana.com or api.devnet.solana.com, or an endpoint configured at build time); that provider necessarily sees the address and your IP address and is governed by its own policy. Anything you sign or hold on-chain is public data on Solana.

## Children

The app is informational and suitable for general audiences. It is not directed at children under 13 and collects no data from anyone.

## Changes and contact

We will update this policy if the app's data practices change, and note the date above. Questions: rchac005@gmail.com.

---
Rene Chacon · rchac005@gmail.com · https://ucsdmiami2020.github.io/seeker-depin-legal/
