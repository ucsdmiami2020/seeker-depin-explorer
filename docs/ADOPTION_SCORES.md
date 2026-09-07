# Adoption confidence — scores as of 2026-09

Rubric: five factors × 0–2 points (see `src/lib/adoption.ts`). Columns: Tenure · Installed base · Independent reviews · Community · Reward track record.

| Device | Score | Tier | T·I·R·C·TR |
|---|---|---|---|
| Helium Mobile Hotspot (Indoor) | 10/10 | Established | 2·2·2·2·2 |
| Helium IoT Hotspot (LoRaWAN) | 10/10 | Established | 2·2·2·2·2 |
| Saga | 9/10 | Established | 2·1·2·2·2 |
| Helium Mobile Hotspot (Outdoor) | 9/10 | Established | 2·1·2·2·2 |
| Seeker | 8/10 | Established | 1·2·2·2·1 |
| Bee (Hivemapper) | 7/10 | Growing | 1·1·2·2·1 |
| GEODNET Triple-Band Base Station | 7/10 | Growing | 2·1·1·1·2 |
| WeatherXM D1 Weather Station | 7/10 | Growing | 2·1·2·1·1 |
| CUDIS Ring (Sporty Series) | 6/10 | Growing | 1·1·2·1·1 |
| Roam Rainier MAX60 Router | 6/10 | Growing | 1·2·1·1·1 |
| onocoy Onolink GNSS Station | 5/10 | Growing | 1·1·1·1·1 |
| NATIX VX360 | 5/10 | Growing | 1·1·1·1·1 |
| XNET CBRS Radio | 4/10 | Early | 1·0·1·1·1 |
| Wingbits WB200 ADS-B Station | 4/10 | Early | 1·1·1·1·0 |
| Starpower Starplug | 4/10 | Early | 1·1·1·1·0 |
| BrushO Smart Toothbrush | 1/10 | Very new | 0·0·1·0·0 |

## Candidates researched but not added (and why)

- **Dabba (India Wi‑Fi)** — Solana-based and real hardware, but TGE pending and hardware sold mainly to Indian ISP partners; revisit after token launch.
- **DIMO Macaron / LTE R1** — moved off Solana-adjacent chains (Polygon → Base); not Solana.
- **Hivemapper Dashcam / Dashcam S** — discontinued, superseded by Bee (noted on the Bee page).
- **Glow solar, io.net, Render, Nosana, Grass** — Solana DePINs with no consumer hardware SKU.
- **Sourceful Energy gateway, Daylight batteries, Ambient air-quality nodes** — Solana energy/sensing DePINs, but hardware availability/pricing could not be verified from public pages at research time; strong candidates for the next catalog pass.
- **WeatherXM** was added with a chain caveat: WXM is Arbitrum-native and bridged to Solana, but the app is in the Solana dApp Store.

## Re-scoring

Edit the factor values and notes in `src/data/adoption.ts`, bump `asOf`, and run `npm run typecheck && npm test`. Scores and tiers derive automatically everywhere in the app.
