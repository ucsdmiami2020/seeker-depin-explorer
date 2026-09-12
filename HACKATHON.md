# Clock In — Solana Mobile hackathon submission

Event: https://solanamobile.radiant.nexus/ · Submissions due **9 Oct 2026, 1:59 AM CDT** · Winners announced 10 Nov 2026.

## Requirements → status

| Requirement | Status |
|---|---|
| Android only, functional APK | Build config ready (`eas build -p android --profile dapp-store`). **APK not yet built — needs EAS login.** |
| Integrates Solana Mobile Stack + Mobile Wallet Adapter | Done in code: `src/state/WalletProvider.tsx` (authorize / deauthorize / signMessages over MWA 2.3). **Not yet exercised on hardware.** |
| Mobile-first, not a port or PWA wrapper | Native React Native UI, no WebView. MWA, Seed Vault-compatible signing, haptics, Android Custom Tabs, adaptive + monochrome icons, predictive back, deep links. |
| Meaningful interaction with the Solana network | Reads SOL and SPL balances from mainnet/devnet RPC, resolves 12 verified DePIN mints to catalog networks, and signs an off-chain ownership proof. |
| GitHub repo accessible to judges | **Pending** — must be public (or judge-accessible) before the deadline. |
| Demo video | Script in `docs/DEMO_SCRIPT.md`; **recording pending**. |
| Pitch deck | `docs/pitch-deck.pptx`. |

## Eligibility notes

- Project started September 2026, inside the 3-month window.
- Pre-existing catalog app, but the hackathon work is substantial and mobile-specific: MWA wallet integration, on-chain balance reads, the verified token map, and the Wallet tab (commits from 2026-09-12).
- One submission only, solo, under the registered account (Bobby Fisher / rchac005).

## What the wallet integration actually does

1. **Connect** — `transact()` → `wallet.authorize({ identity, chain })`. Works with Phantom, Solflare, Backpack, or Seed Vault on a Seeker. The auth token stays in memory; nothing is written to disk.
2. **Read** — `getBalance` plus `getParsedTokenAccountsByOwner` across the SPL Token and Token-2022 programs, on mainnet or devnet.
3. **Match** — non-zero mints are matched against `src/data/tokens.ts`, which carries 12 mints verified against Jupiter's verified list on 2026-09-12. Networks with no confidently verified mint (BrushO, Wingbits, Starpower) are listed as untracked rather than shown as zero.
4. **Surface** — the Wallet tab shows holdings mapped to catalog networks and devices; device detail shows a badge when you hold that network's token.
5. **Prove** — `signMessages` signs a plain-text ownership statement. Off-chain, no fee, no transaction. The app cannot move funds: it never builds or submits a transaction.

## Before submitting — device checklist

The MWA flow has **not** been run on hardware from this environment (no Android SDK/JDK here). Run this on a Seeker or an Android emulator with a wallet installed:

- [ ] `eas build -p android --profile dapp-store` produces an APK; `apksigner verify --print-certs` shows your key, not `CN=Android Debug`.
- [ ] Install on device with Phantom (or Seed Vault) present.
- [ ] Wallet tab → Connect → approve in wallet → address and SOL balance appear.
- [ ] Balances match an explorer for the same address (check one DePIN token).
- [ ] Switch to Devnet → balances refresh; switch back to Mainnet.
- [ ] Sign ownership proof → wallet shows the statement → signature appears in-app.
- [ ] Open a device on a network you hold → wallet badge appears.
- [ ] Disconnect → balances clear; the wallet no longer lists the app as authorised.
- [ ] With **no** wallet installed: Connect shows the "no compatible wallet" message rather than crashing.
- [ ] Airplane mode: connect/refresh fails with a readable error.

## Build and submit

```bash
npm ci && npm run typecheck && npm test
eas build -p android --profile dapp-store       # needs: eas login
```

Optional: set `EXPO_PUBLIC_SOLANA_RPC` to a Helius (or similar) HTTPS endpoint before building — the public RPC is heavily rate-limited and judges may hit it.

Submission materials: APK, GitHub URL, demo video, `docs/pitch-deck.pptx`.

## After the hackathon

Winners must publish to the Solana dApp Store within 30 days of the 10 Nov announcement. That path is already prepared in `docs/DAPP_STORE_SUBMISSION.md` (portal account, KYC/KYB, publisher wallet, listing assets). Note the screenshots there still need retaking on a device, and they should now include the Wallet tab.
